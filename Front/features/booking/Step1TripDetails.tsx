"use client";

import type { TripBase } from "@/types";
import { formatCurrency } from "@/lib/utils";

type Participants = { adults: number; children: number; infants: number };

interface Step1Props {
  trip:         TripBase;
  date:         string;
  participants: Participants;
  onDate:       (d: string) => void;
  onParticipants: (p: Participants) => void;
  onNext:       () => void;
}

function Counter({ label, sublabel, value, min, onInc, onDec }: {
  label: string; sublabel: string; value: number; min: number;
  onInc: () => void; onDec: () => void;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: "1px solid rgba(226,216,194,0.5)" }}>
      <div>
        <p style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "0.9375rem", color: "#1A1208" }}>{label}</p>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.8125rem", color: "#948A7D", marginTop: "2px" }}>{sublabel}</p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <button
          onClick={onDec}
          disabled={value <= min}
          style={{ width: "34px", height: "34px", borderRadius: "50%", border: "1.5px solid rgba(226,216,194,0.8)", background: "#fff", color: "#1A1208", fontSize: "1.25rem", display: "flex", alignItems: "center", justifyContent: "center", cursor: value <= min ? "not-allowed" : "pointer", opacity: value <= min ? 0.3 : 1, transition: "all 0.15s", fontFamily: "var(--font-sans)", lineHeight: 1 }}
          aria-label={`Decrease ${label}`}
        >−</button>
        <span style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "1.0625rem", color: "#1A1208", minWidth: "24px", textAlign: "center" }}>{value}</span>
        <button
          onClick={onInc}
          style={{ width: "34px", height: "34px", borderRadius: "50%", border: "1.5px solid rgba(200,145,58,0.5)", background: "rgba(200,145,58,0.08)", color: "#1A1208", fontSize: "1.25rem", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.15s", fontFamily: "var(--font-sans)", lineHeight: 1 }}
          aria-label={`Increase ${label}`}
        >+</button>
      </div>
    </div>
  );
}

export function Step1TripDetails({ trip, date, participants, onDate, onParticipants, onNext }: Step1Props) {
  const totalPeople = participants.adults + participants.children;
  const basePrice   = trip.price_unit === "per_person" ? trip.price * Math.max(1, totalPeople) : trip.price;
  const canProceed  = !!date;

  const inc = (key: keyof Participants) => {
    const next = { ...participants, [key]: participants[key] + 1 };
    if (trip.max_group_size && next.adults + next.children > trip.max_group_size) return;
    onParticipants(next);
  };
  const dec = (key: keyof Participants, min = 0) => {
    if (participants[key] <= min) return;
    onParticipants({ ...participants, [key]: participants[key] - 1 });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>

      {/* Trip recap */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "16px", background: "#F5F0E8", borderRadius: "16px", border: "1px solid rgba(226,216,194,0.6)" }}>
        <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#C8913A", flexShrink: 0 }} />
        <div>
          <p style={{ fontFamily: "var(--font-sans)", fontWeight: 500, color: "#1A1208", fontSize: "0.9375rem" }}>{trip.title}</p>
          <p style={{ fontFamily: "var(--font-sans)", color: "#7A6E60", fontSize: "0.8125rem", marginTop: "2px" }}>
            {trip.location.name} · {trip.duration_label}
          </p>
        </div>
        <div style={{ marginLeft: "auto", textAlign: "right", flexShrink: 0 }}>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "1.125rem", color: "#1A1208", letterSpacing: "-0.02em" }}>
            {formatCurrency(trip.price, trip.price_currency)}
          </p>
          <p style={{ fontFamily: "var(--font-sans)", color: "#948A7D", fontSize: "0.75rem" }}>
            per {trip.price_unit === "per_person" ? "person" : "trip"}
          </p>
        </div>
      </div>

      {/* Date selection */}
      <div>
        <label style={{ display: "block", fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "0.9375rem", color: "#1A1208", marginBottom: "10px" }}>
          Select your date
          <span style={{ color: "#B54A2C", marginLeft: "4px" }}>*</span>
        </label>
        <input
          type="date"
          value={date}
          min={new Date().toISOString().split("T")[0]}
          onChange={(e) => onDate(e.target.value)}
          className="input-base"
          style={{ fontFamily: "var(--font-sans)", fontSize: "1rem" }}
        />
        {!date && (
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.8125rem", color: "#B54A2C", marginTop: "6px" }}>
            Please select a date to continue.
          </p>
        )}
      </div>

      {/* Participants — per_person only */}
      {trip.price_unit === "per_person" && (
        <div>
          <h3 style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "0.9375rem", color: "#1A1208", marginBottom: "4px" }}>
            Number of guests
          </h3>
          {trip.max_group_size && (
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.8125rem", color: "#948A7D", marginBottom: "10px" }}>
              Maximum {trip.max_group_size} people per booking
            </p>
          )}
          <Counter label="Adults" sublabel="Age 13+" value={participants.adults} min={1}
            onInc={() => inc("adults")} onDec={() => dec("adults", 1)} />
          <Counter label="Children" sublabel="Age 5–12" value={participants.children} min={0}
            onInc={() => inc("children")} onDec={() => dec("children")} />
          <Counter label="Infants" sublabel="Under 5 (free)" value={participants.infants} min={0}
            onInc={() => onParticipants({ ...participants, infants: participants.infants + 1 })}
            onDec={() => dec("infants")} />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0 4px" }}>
            <span style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "0.9375rem", color: "#1A1208" }}>
              Subtotal
            </span>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", color: "#1A1208", letterSpacing: "-0.025em" }}>
              {formatCurrency(basePrice, trip.price_currency)}
            </span>
          </div>
        </div>
      )}

      {/* Next button */}
      <button
        onClick={onNext}
        disabled={!canProceed}
        style={{
          width: "100%", padding: "15px", borderRadius: "14px", border: "none", cursor: canProceed ? "pointer" : "not-allowed",
          background: canProceed ? "#C8913A" : "#E2D8C2", color: canProceed ? "#1A1208" : "#948A7D",
          fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "1rem",
          boxShadow: canProceed ? "0 4px 20px rgba(200,145,58,0.35)" : "none",
          transition: "all 0.2s",
        }}
      >
        Continue to contact details →
      </button>
    </div>
  );
}
