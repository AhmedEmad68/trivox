"use client";

import Image from "next/image";
import type { TripBase, Addon } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface BookingSummaryPanelProps {
  trip:           TripBase;
  date:           string;
  participants:   { adults: number; children: number; infants: number };
  selectedAddons: { addon: Addon; qty: number }[];
  step:           number;
}

export function BookingSummaryPanel({
  trip, date, participants, selectedAddons, step,
}: BookingSummaryPanelProps) {
  const fmt = (n: number) => formatCurrency(n, trip.price_currency);

  const totalPeople  = participants.adults + participants.children;
  const basePrice    = trip.price_unit === "per_person" ? trip.price * totalPeople : trip.price;
  const addonsTotal  = selectedAddons.reduce((s, { addon, qty }) =>
    s + addon.price * (addon.price_unit === "per_person" ? qty : 1), 0);
  const taxes        = Math.round((basePrice + addonsTotal) * 0.05 * 100) / 100;
  const total        = basePrice + addonsTotal + taxes;

  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric", year: "numeric" })
    : "—";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

      {/* Trip card */}
      <div style={{ background: "#fff", borderRadius: "18px", border: "1px solid rgba(226,216,194,0.6)", overflow: "hidden", boxShadow: "0 2px 12px rgba(26,18,8,0.06)" }}>
        <div style={{ position: "relative", height: "140px" }}>
          <Image src={trip.cover_image} alt={trip.title} fill className="object-cover" />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 30%, rgba(26,18,8,0.75) 100%)" }} />
          <div style={{ position: "absolute", bottom: "12px", left: "12px", right: "12px" }}>
            <p style={{ fontFamily: "var(--font-display)", color: "#FDFCFA", fontSize: "1rem", lineHeight: 1.25, letterSpacing: "-0.01em" }}>{trip.title}</p>
          </div>
        </div>
        <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: "8px" }}>
          {/* Date */}
          <Row icon={<CalendarIcon />} label="Date" value={formattedDate} />
          {/* Participants */}
          {trip.price_unit === "per_person" && (
            <Row icon={<PeopleIcon />} label="Guests"
              value={[
                participants.adults   > 0 ? `${participants.adults} adult${participants.adults > 1 ? "s" : ""}` : null,
                participants.children > 0 ? `${participants.children} child${participants.children > 1 ? "ren" : ""}` : null,
                participants.infants  > 0 ? `${participants.infants} infant${participants.infants > 1 ? "s" : ""}` : null,
              ].filter(Boolean).join(", ") || "—"}
            />
          )}
          {/* Duration */}
          <Row icon={<ClockIcon />} label="Duration" value={trip.duration_label} />
        </div>
      </div>

      {/* Price breakdown */}
      <div style={{ background: "#fff", borderRadius: "18px", border: "1px solid rgba(226,216,194,0.6)", padding: "18px 20px", boxShadow: "0 2px 12px rgba(26,18,8,0.06)" }}>
        <p style={{ fontFamily: "var(--font-display)", fontSize: "1rem", color: "#1A1208", marginBottom: "14px", letterSpacing: "-0.01em" }}>
          Price breakdown
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {/* Base price */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ fontSize: "0.875rem", color: "#7A6E60", fontFamily: "var(--font-sans)" }}>
              {trip.price_unit === "per_person"
                ? `${fmt(trip.price)} × ${totalPeople} ${totalPeople === 1 ? "person" : "people"}`
                : "Trip price"}
            </span>
            <span style={{ fontSize: "0.875rem", color: "#1A1208", fontFamily: "var(--font-sans)", fontWeight: 500 }}>{fmt(basePrice)}</span>
          </div>

          {/* Add-ons */}
          {selectedAddons.map(({ addon, qty }) => (
            <div key={addon.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontSize: "0.8125rem", color: "#7A6E60", fontFamily: "var(--font-sans)" }}>
                {addon.name}{addon.price_unit === "per_person" ? ` × ${qty}` : ""}
              </span>
              <span style={{ fontSize: "0.8125rem", color: "#1A1208", fontFamily: "var(--font-sans)", fontWeight: 500 }}>
                {fmt(addon.price * (addon.price_unit === "per_person" ? qty : 1))}
              </span>
            </div>
          ))}

          {/* Taxes */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ fontSize: "0.8125rem", color: "#7A6E60", fontFamily: "var(--font-sans)" }}>Taxes & fees (5%)</span>
            <span style={{ fontSize: "0.8125rem", color: "#1A1208", fontFamily: "var(--font-sans)", fontWeight: 500 }}>{fmt(taxes)}</span>
          </div>

          {/* Divider */}
          <div style={{ height: "1px", background: "rgba(226,216,194,0.6)", margin: "4px 0" }} />

          {/* Total */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#1A1208", fontFamily: "var(--font-sans)" }}>Total</span>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "1.375rem", color: "#1A1208", letterSpacing: "-0.025em" }}>{fmt(total)}</span>
          </div>
        </div>
      </div>

      {/* Reassurances */}
      {step < 4 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "7px", padding: "14px 16px", background: "rgba(74,124,63,0.06)", borderRadius: "14px", border: "1px solid rgba(74,124,63,0.15)" }}>
          {[
            trip.cancellation_policy === "free_cancellation" && "Free cancellation up to 24h before",
            trip.instant_confirmation && "Instant confirmation",
            "Secure payment — 256-bit SSL",
          ].filter(Boolean).map((msg) => (
            <div key={msg as string} style={{ display: "flex", alignItems: "center", gap: "7px" }}>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M2 6.5l2.5 2.5 6.5-6.5" stroke="#4A7C3F" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span style={{ fontSize: "0.8125rem", color: "#3A6331", fontFamily: "var(--font-sans)" }}>{msg as string}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Helper row ─────────────────────────────────────────────────── */
function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
      <span style={{ color: "#C8913A", marginTop: "1px", flexShrink: 0 }}>{icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <span style={{ fontSize: "0.6875rem", color: "#948A7D", fontFamily: "var(--font-sans)", display: "block", marginBottom: "1px", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: "0.875rem", color: "#1A1208", fontFamily: "var(--font-sans)", fontWeight: 500 }}>{value}</span>
      </div>
    </div>
  );
}

/* ─── Inline icons ───────────────────────────────────────────────── */
const CalendarIcon = () => <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="1" y="2" width="11" height="10" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M1 5.5h11M4 1v2M9 1v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>;
const PeopleIcon  = () => <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="5" cy="3.5" r="2" stroke="currentColor" strokeWidth="1.3"/><circle cx="9.5" cy="3.5" r="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M1 11c0-2.2 1.79-4 4-4s4 1.8 4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><path d="M9.5 7c1 .4 1.5 1.5 1.5 2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>;
const ClockIcon   = () => <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.3"/><path d="M6.5 3.5v3l2 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>;
