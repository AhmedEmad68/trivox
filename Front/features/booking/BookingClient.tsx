"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { StepIndicator, type Step }   from "./StepIndicator";
import { BookingSummaryPanel }  from "./BookingSummaryPanel";
import { Step1TripDetails }     from "./Step1TripDetails";
import { Step2ContactInfo }     from "./Step2ContactInfo";
import { Step3Addons }          from "./Step3Addons";
import { Step4Payment }         from "./Step4Payment";
import { BookingConfirmed }     from "./BookingConfirmed";
import type { ContactInfo }     from "./Step2ContactInfo";
import type { TripBase, BookingCreate } from "@/types";
import { formatCurrency }       from "@/lib/utils";
import { useTrip }              from "@/hooks/useTrips";
import { bookingsService }      from "@/services/api/bookings";
import { useAuth }              from "@/contexts/AuthContext";

/* ─── Steps config ───────────────────────────────────────────────── */
const STEPS: Step[] = [
  { id: 1, label: "Trip details"   },
  { id: 2, label: "Your info"      },
  { id: 3, label: "Add-ons"        },
  { id: 4, label: "Payment"        },
];

const DEFAULT_CONTACT: ContactInfo = {
  firstName: "", lastName: "", email: "", phone: "", nationality: "", requests: "",
};

export function BookingClient() {
  const params   = useSearchParams();
  const router   = useRouter();
  const tripSlug = params.get("trip") ?? "";

  const { isAuthenticated, loading: authLoading } = useAuth();

  // Redirect unauthenticated users to login, preserving the full booking URL
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      const returnTo = `/booking?${params.toString()}`;
      router.replace(`/login?redirect=${encodeURIComponent(returnTo)}`);
    }
  }, [isAuthenticated, authLoading, params, router]);

  const { data: trip, isLoading: tripLoading, isError: tripError } = useTrip(tripSlug);

  const [step,         setStep]         = useState(1);
  const [date,         setDate]         = useState(params.get("date") ?? "");
  const [participants, setParticipants] = useState({
    adults:   Number(params.get("adults")   ?? 1),
    children: Number(params.get("children") ?? 0),
    infants:  Number(params.get("infants")  ?? 0),
  });
  const [contact,        setContact]        = useState<ContactInfo>(DEFAULT_CONTACT);
  const [selectedAddons, setSelectedAddons] = useState<Record<number, number>>({});
  const [isSubmitting,   setIsSubmitting]   = useState(false);
  const [submitError,    setSubmitError]    = useState("");
  const [confirmed,      setConfirmed]      = useState(false);
  const [bookingRef,     setBookingRef]     = useState("");
  const [confirmedTotal, setConfirmedTotal] = useState(0);

  // Pre-select required addons once trip loads
  useEffect(() => {
    if (!trip) return;
    const required: Record<number, number> = {};
    (trip.addons ?? []).filter((a) => a.is_required).forEach((a) => {
      required[a.id] = participants.adults + participants.children;
    });
    setSelectedAddons((prev) => ({ ...required, ...prev }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trip?.id]);

  const toggleAddon = (id: number, totalPeople: number) => {
    setSelectedAddons((prev) => {
      const next = { ...prev };
      if (id in next) delete next[id];
      else next[id] = totalPeople || 1;
      return next;
    });
  };

  const setAddonQty = (id: number, qty: number) => {
    setSelectedAddons((prev) => ({ ...prev, [id]: qty }));
  };

  /* Computed values */
  const addonDetails = trip
    ? Object.entries(selectedAddons)
        .map(([id, qty]) => ({ addon: (trip.addons ?? []).find((a) => a.id === Number(id))!, qty }))
        .filter(({ addon }) => !!addon)
    : [];

  const totalPeople = participants.adults + participants.children;
  const basePrice   = trip
    ? (trip.price_unit === "per_person" ? trip.price * Math.max(1, totalPeople) : trip.price)
    : 0;
  const addonsTotal = addonDetails.reduce((s, { addon, qty }) =>
    s + addon.price * (addon.price_unit === "per_person" ? qty : 1), 0);
  const taxes   = Math.round((basePrice + addonsTotal) * 0.05 * 100) / 100;
  const total   = basePrice + addonsTotal + taxes;

  const handleConfirm = async () => {
    if (!trip) return;
    setIsSubmitting(true);
    setSubmitError("");

    const bookingData: BookingCreate = {
      trip_id:   trip.id,
      trip_type: trip.type,
      date,
      participants: [
        { type: "adult"  as const, count: participants.adults,   price: trip.price },
        { type: "child"  as const, count: participants.children, price: trip.price },
        { type: "infant" as const, count: participants.infants,  price: 0 },
      ].filter((p) => p.count > 0),
      addons: addonDetails.map(({ addon, qty }) => ({ addon_id: addon.id, quantity: qty })),
      special_requests: contact.requests,
      first_name:  contact.firstName,
      last_name:   contact.lastName,
      email:       contact.email,
      phone:       contact.phone,
      nationality: contact.nationality,
    };

    try {
      const result = await bookingsService.create(bookingData);
      setBookingRef(result.reference);
      setConfirmedTotal(result.summary.total);
      setConfirmed(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ── Auth / trip loading skeleton ────────────────────────────── */
  if (authLoading || !isAuthenticated || tripLoading) {
    return (
      <div style={{ background: "#FDFCFA", minHeight: "100vh", paddingTop: "var(--navbar-height)" }}>
        <div style={{ background: "#1A1208", height: "96px" }} />
        <div className="container-trivox" style={{ paddingTop: "40px" }}>
          <div style={{ maxWidth: "640px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <div className="skeleton" style={{ height: "28px", width: "200px", borderRadius: "8px" }} />
            <div className="skeleton" style={{ height: "400px", borderRadius: "18px" }} />
          </div>
        </div>
      </div>
    );
  }

  /* ── Trip not found ───────────────────────────────────────────── */
  if (tripError || !trip) {
    return (
      <div className="container-trivox" style={{ paddingTop: "calc(var(--navbar-height) + 64px)", paddingBottom: "64px", textAlign: "center" }}>
        <p style={{ fontFamily: "var(--font-sans)", color: "#948A7D", fontSize: "1rem" }}>
          Trip not found. Please go back and select a trip.
        </p>
      </div>
    );
  }

  /* ── Confirmed state ──────────────────────────────────────────── */
  if (confirmed) {
    return (
      <div className="container-trivox" style={{ paddingTop: "calc(var(--navbar-height) + 32px)", paddingBottom: "64px" }}>
        <BookingConfirmed trip={trip as TripBase} contact={contact} date={date} total={confirmedTotal} reference={bookingRef} />
      </div>
    );
  }

  /* ── Active booking flow ──────────────────────────────────────── */
  return (
    <div style={{ background: "#FDFCFA", minHeight: "100vh", paddingTop: "var(--navbar-height)" }}>

      {/* Header banner */}
      <div style={{ background: "#1A1208", paddingBlock: "24px 28px" }}>
        <div className="container-trivox">
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6875rem", color: "rgba(200,145,58,0.7)", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 500, marginBottom: "6px" }}>
            Secure booking
          </p>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.5rem, 3vw, 2rem)", color: "#FDFCFA", letterSpacing: "-0.025em" }}>
            Complete your booking
          </h1>
        </div>
      </div>

      {/* Step indicator */}
      <div style={{ background: "#fff", borderBottom: "1px solid rgba(226,216,194,0.45)", paddingBlock: "20px" }}>
        <div className="container-trivox" style={{ maxWidth: "640px" }}>
          <StepIndicator steps={STEPS} currentStep={step} />
        </div>
      </div>

      {/* Body */}
      <div className="container-trivox" style={{ paddingBlock: "36px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "32px" }} className="lg:grid-cols-[1fr_360px]">

          {/* Left — active step */}
          <div>
            <div style={{ marginBottom: "24px" }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", color: "#1A1208", letterSpacing: "-0.02em" }}>
                {STEPS[step - 1].label}
              </h2>
              <div style={{ width: "40px", height: "3px", background: "#C8913A", borderRadius: "2px", marginTop: "8px" }} />
            </div>

            {step === 1 && (
              <Step1TripDetails
                trip={trip as TripBase}
                date={date}
                participants={participants}
                onDate={setDate}
                onParticipants={setParticipants}
                onNext={() => setStep(2)}
              />
            )}
            {step === 2 && (
              <Step2ContactInfo
                data={contact}
                onChange={setContact}
                onNext={() => setStep(3)}
                onBack={() => setStep(1)}
              />
            )}
            {step === 3 && (
              <Step3Addons
                addons={trip.addons ?? []}
                selectedAddons={selectedAddons}
                totalPeople={totalPeople}
                currency={trip.price_currency}
                onToggle={toggleAddon}
                onQty={setAddonQty}
                onNext={() => setStep(4)}
                onBack={() => setStep(2)}
              />
            )}
            {step === 4 && (
              <>
                {submitError && (
                  <div style={{ padding: "12px 16px", borderRadius: "12px", background: "rgba(181,74,44,0.08)", border: "1px solid rgba(181,74,44,0.25)", marginBottom: "16px" }}>
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "#B54A2C" }}>{submitError}</p>
                  </div>
                )}
                <Step4Payment
                  trip={trip as TripBase}
                  date={date}
                  participants={participants}
                  contact={contact}
                  selectedAddons={addonDetails}
                  onBack={() => setStep(3)}
                  onConfirm={handleConfirm}
                  isSubmitting={isSubmitting}
                />
              </>
            )}
          </div>

          {/* Right — summary panel */}
          <div className="hidden lg:block">
            <div className="sticky-card">
              <BookingSummaryPanel
                trip={trip as TripBase}
                date={date}
                participants={participants}
                selectedAddons={addonDetails}
                step={step}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile bottom summary bar */}
      <div className="lg:hidden"
        style={{ position: "fixed", bottom: 0, insetInline: 0, zIndex: 100, background: "rgba(253,252,250,0.96)", backdropFilter: "blur(16px)", borderTop: "1px solid rgba(226,216,194,0.4)", padding: "12px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
          <div>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6875rem", color: "#948A7D", textTransform: "uppercase", letterSpacing: "0.06em" }}>Total</p>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", color: "#1A1208", letterSpacing: "-0.025em" }}>
              {formatCurrency(total, trip.price_currency)}
            </p>
          </div>
          <div style={{ display: "flex", gap: "6px", fontSize: "0.8125rem", color: "#948A7D", fontFamily: "var(--font-sans)", alignItems: "center" }}>
            Step {step} of {STEPS.length}
          </div>
        </div>
      </div>
    </div>
  );
}
