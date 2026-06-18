"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { TripBase, Addon } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface BookingCardProps {
  trip:    TripBase;
  addons?: Addon[];
}

type ParticipantType = "adult" | "child" | "infant";

const PARTICIPANT_CONFIG: { type: ParticipantType; label: string; sublabel: string; min: number }[] = [
  { type: "adult",  label: "Adults",   sublabel: "Age 13+",  min: 1 },
  { type: "child",  label: "Children", sublabel: "Age 5–12", min: 0 },
  { type: "infant", label: "Infants",  sublabel: "Under 5",  min: 0 },
];

export function BookingCard({ trip, addons = [] }: BookingCardProps) {
  const [date,         setDate]         = useState("");
  const [participants, setParticipants] = useState<Record<ParticipantType, number>>({ adult: 1, child: 0, infant: 0 });
  const [selectedAddons, setSelectedAddons] = useState<Record<number, number>>({});
  const [showAddons,   setShowAddons]   = useState(false);

  const totalPeople = participants.adult + participants.child;

  // Price calc
  const basePrice = trip.price_unit === "per_vehicle" || trip.price_unit === "per_group" || trip.price_unit === "fixed"
    ? trip.price
    : trip.price * totalPeople;

  const addonsTotal = Object.entries(selectedAddons).reduce((sum, [id, qty]) => {
    const addon = addons.find((a) => a.id === Number(id));
    if (!addon) return sum;
    return sum + addon.price * (addon.price_unit === "per_person" ? qty : 1);
  }, 0);

  const total = basePrice + addonsTotal;

  const fmt = (n: number) => formatCurrency(n, trip.price_currency);

  const handleParticipant = (type: ParticipantType, delta: number) => {
    const cfg = PARTICIPANT_CONFIG.find((c) => c.type === type)!;
    const next = Math.max(cfg.min, (participants[type] || 0) + delta);
    const nextTotal = (type === "adult" ? next : participants.adult) + (type === "child" ? next : participants.child);
    if (trip.max_group_size && nextTotal > trip.max_group_size) return;
    setParticipants((p) => ({ ...p, [type]: next }));
    // Update per-person addon quantities
    setSelectedAddons((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((id) => {
        const addon = addons.find((a) => a.id === Number(id));
        if (addon?.price_unit === "per_person") updated[Number(id)] = nextTotal || 1;
      });
      return updated;
    });
  };

  const toggleAddon = (id: number) => {
    setSelectedAddons((prev) => {
      const next = { ...prev };
      if (id in next) delete next[id];
      else next[id] = totalPeople || 1;
      return next;
    });
  };

  const bookingUrl = () => {
    const params = new URLSearchParams({
      trip:   trip.slug,
      adults: String(participants.adult),
      ...(participants.child  > 0 && { children: String(participants.child)  }),
      ...(participants.infant > 0 && { infants:  String(participants.infant) }),
      ...(date                    && { date }),
    });
    const addonIds = Object.keys(selectedAddons).join(",");
    if (addonIds) params.set("addons", addonIds);
    return `/booking?${params.toString()}`;
  };

  return (
    <div style={{ background: "#fff", borderRadius: "20px", border: "1px solid rgba(226,216,194,0.7)", overflow: "hidden", boxShadow: "0 4px 24px rgba(26,18,8,0.1)" }}>

      {/* Price header */}
      <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid rgba(226,216,194,0.5)" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginBottom: "2px" }}>
          {trip.original_price && trip.original_price > trip.price && (
            <span style={{ fontSize: "0.875rem", color: "#948A7D", textDecoration: "line-through", fontFamily: "var(--font-sans)" }}>{fmt(trip.original_price)}</span>
          )}
          <span style={{ fontFamily: "var(--font-display)", fontSize: "1.875rem", color: "#1A1208", letterSpacing: "-0.03em" }}>{fmt(trip.price)}</span>
          <span style={{ fontSize: "0.8125rem", color: "#948A7D", fontFamily: "var(--font-sans)" }}>
            / {trip.price_unit === "per_person" ? "person" : trip.price_unit === "per_vehicle" ? "vehicle" : "group"}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="#C8913A"><path d="M6 1l1.236 2.504L10 3.82 8 5.77l.472 2.73L6 7.12 3.528 8.5 4 5.77 2 3.82l2.764-.316z"/></svg>
          <span style={{ fontSize: "0.8125rem", fontWeight: 500, color: "#C8913A", fontFamily: "var(--font-sans)" }}>{trip.rating.toFixed(1)}</span>
          <span style={{ fontSize: "0.8125rem", color: "#948A7D", fontFamily: "var(--font-sans)" }}>({trip.review_count.toLocaleString()} reviews)</span>
        </div>
      </div>

      <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "16px" }}>

        {/* Date picker */}
        <div>
          <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 500, color: "#1A1208", fontFamily: "var(--font-sans)", marginBottom: "6px", letterSpacing: "0.04em", textTransform: "uppercase" }}>
            Select date
          </label>
          <input
            type="date"
            value={date}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setDate(e.target.value)}
            className="input-base"
            style={{ fontFamily: "var(--font-sans)" }}
          />
        </div>

        {/* Participants — only for per_person pricing */}
        {trip.price_unit === "per_person" && (
          <div>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 500, color: "#1A1208", fontFamily: "var(--font-sans)", marginBottom: "8px", letterSpacing: "0.04em", textTransform: "uppercase" }}>
              Participants
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {PARTICIPANT_CONFIG.map(({ type, label, sublabel, min }) => (
                <div key={type} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "#1A1208", fontFamily: "var(--font-sans)" }}>{label}</span>
                    <span style={{ fontSize: "0.75rem", color: "#948A7D", fontFamily: "var(--font-sans)", marginLeft: "6px" }}>{sublabel}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <button
                      onClick={() => handleParticipant(type, -1)}
                      disabled={participants[type] <= min}
                      style={{ width: "30px", height: "30px", borderRadius: "50%", border: "1.5px solid #E2D8C2", background: "#fff", color: "#7A6E60", fontSize: "1.125rem", cursor: participants[type] <= min ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: participants[type] <= min ? 0.35 : 1, transition: "all 0.15s" }}
                    >−</button>
                    <span style={{ fontSize: "0.9375rem", fontWeight: 500, color: "#1A1208", fontFamily: "var(--font-sans)", minWidth: "20px", textAlign: "center" }}>{participants[type]}</span>
                    <button
                      onClick={() => handleParticipant(type, 1)}
                      style={{ width: "30px", height: "30px", borderRadius: "50%", border: "1.5px solid #E2D8C2", background: "#fff", color: "#7A6E60", fontSize: "1.125rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}
                    >+</button>
                  </div>
                </div>
              ))}
              {trip.max_group_size && (
                <p style={{ fontSize: "0.75rem", color: "#948A7D", fontFamily: "var(--font-sans)" }}>Max {trip.max_group_size} people per booking</p>
              )}
            </div>
          </div>
        )}

        {/* Add-ons toggle */}
        {addons.filter((a) => !a.is_required).length > 0 && (
          <div>
            <button
              onClick={() => setShowAddons(!showAddons)}
              style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderRadius: "12px", background: "#F5F0E8", border: "1px solid rgba(226,216,194,0.6)", cursor: "pointer", fontFamily: "var(--font-sans)", fontSize: "0.875rem", fontWeight: 500, color: "#1A1208" }}
            >
              <span>Optional add-ons ({addons.filter((a) => !a.is_required).length})</span>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {Object.keys(selectedAddons).length > 0 && (
                  <span style={{ fontSize: "0.75rem", color: "#C8913A", fontWeight: 600 }}>+{fmt(addonsTotal)}</span>
                )}
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ transform: showAddons ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                  <path d="M3 5l4 4 4-4" stroke="#948A7D" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </button>

            {showAddons && (
              <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "8px" }}>
                {addons.filter((a) => !a.is_required).map((addon) => {
                  const selected = addon.id in selectedAddons;
                  return (
                    <div key={addon.id}
                      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", borderRadius: "12px", border: `1.5px solid ${selected ? "#C8913A" : "rgba(226,216,194,0.7)"}`, background: selected ? "rgba(200,145,58,0.04)" : "#fff", transition: "all 0.15s", gap: "8px" }}>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: "0.8125rem", fontWeight: 500, color: "#1A1208", fontFamily: "var(--font-sans)", marginBottom: "1px" }}>{addon.name}</p>
                        <p style={{ fontSize: "0.6875rem", color: "#948A7D", fontFamily: "var(--font-sans)" }}>{formatCurrency(addon.price, trip.price_currency)}{addon.price_unit === "per_person" ? " / person" : ""}</p>
                      </div>
                      <button onClick={() => toggleAddon(addon.id)}
                        style={{ flexShrink: 0, padding: "5px 12px", borderRadius: "8px", fontSize: "0.8125rem", fontWeight: 500, cursor: "pointer", fontFamily: "var(--font-sans)", transition: "all 0.15s", background: selected ? "#C8913A" : "#fff", color: selected ? "#1A1208" : "#7A6E60", border: `1px solid ${selected ? "#C8913A" : "#E2D8C2"}` }}>
                        {selected ? "✓ Added" : "Add"}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Price summary */}
        <div style={{ background: "#F5F0E8", borderRadius: "14px", padding: "14px 16px", display: "flex", flexDirection: "column", gap: "6px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", fontFamily: "var(--font-sans)" }}>
            <span style={{ color: "#7A6E60" }}>
              {trip.price_unit === "per_person" ? `${fmt(trip.price)} × ${totalPeople} ${totalPeople === 1 ? "person" : "people"}` : "Trip price"}
            </span>
            <span style={{ color: "#1A1208" }}>{fmt(basePrice)}</span>
          </div>
          {addonsTotal > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", fontFamily: "var(--font-sans)" }}>
              <span style={{ color: "#7A6E60" }}>Add-ons</span>
              <span style={{ color: "#1A1208" }}>{fmt(addonsTotal)}</span>
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1rem", fontFamily: "var(--font-sans)", fontWeight: 600, paddingTop: "8px", borderTop: "1px solid rgba(226,216,194,0.6)", marginTop: "4px" }}>
            <span style={{ color: "#1A1208" }}>Total</span>
            <span style={{ color: "#1A1208", fontFamily: "var(--font-display)", fontSize: "1.25rem", letterSpacing: "-0.02em" }}>{fmt(total)}</span>
          </div>
        </div>

        {/* CTA */}
        <Link href={bookingUrl()}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "15px 24px", borderRadius: "14px", background: "#C8913A", color: "#1A1208", fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "1rem", textDecoration: "none", transition: "all 0.2s", boxShadow: "0 4px 24px rgba(200,145,58,0.4)", letterSpacing: "0.01em" }}>
          Book now
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </Link>

        {/* Reassurances */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {[
            trip.cancellation_policy === "free_cancellation" && "Free cancellation up to 24h before",
            trip.instant_confirmation && "Instant confirmation",
            "No hidden fees",
          ].filter(Boolean).map((msg) => (
            <div key={msg as string} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7l3 3 7-7" stroke="#4A7C3F" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span style={{ fontSize: "0.8125rem", color: "#7A6E60", fontFamily: "var(--font-sans)" }}>{msg as string}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
