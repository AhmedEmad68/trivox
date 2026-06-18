"use client";

import Link from "next/link";
import type { TripBase } from "@/types";
import type { ContactInfo } from "./Step2ContactInfo";
import { formatCurrency } from "@/lib/utils";

interface BookingConfirmedProps {
  trip:     TripBase;
  contact:  ContactInfo;
  date:     string;
  total:    number;
  reference: string;
}

export function BookingConfirmed({ trip, contact, date, total, reference }: BookingConfirmedProps) {
  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })
    : "—";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", paddingBlock: "40px 60px" }}>
      {/* Animated checkmark */}
      <div style={{ position: "relative", width: "88px", height: "88px", marginBottom: "28px" }}>
        <div style={{ width: "88px", height: "88px", borderRadius: "50%", background: "rgba(74,124,63,0.1)", border: "3px solid rgba(74,124,63,0.3)", display: "flex", alignItems: "center", justifyContent: "center", animation: "scale-in 0.4s ease-out" }}>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path d="M8 20l8 8 16-16" stroke="#4A7C3F" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
              style={{ strokeDasharray: 50, strokeDashoffset: 0, animation: "draw 0.5s ease-out 0.3s both" }}/>
          </svg>
        </div>
      </div>

      {/* Heading */}
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", color: "#1A1208", letterSpacing: "-0.03em", marginBottom: "10px" }}>
        You&apos;re booked!
      </h1>
      <p style={{ fontFamily: "var(--font-sans)", fontSize: "1.0625rem", color: "#7A6E60", lineHeight: 1.65, maxWidth: "440px", marginBottom: "32px" }}>
        Your booking is confirmed. A voucher has been sent to{" "}
        <span style={{ color: "#1A1208", fontWeight: 500 }}>{contact.email}</span>.
      </p>

      {/* Reference card */}
      <div style={{ background: "#fff", borderRadius: "20px", border: "1px solid rgba(226,216,194,0.6)", padding: "24px 32px", marginBottom: "28px", width: "100%", maxWidth: "480px", boxShadow: "0 4px 24px rgba(26,18,8,0.08)" }}>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6875rem", color: "#948A7D", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 500, marginBottom: "8px" }}>
          Booking reference
        </p>
        <p style={{ fontFamily: "var(--font-display)", fontSize: "1.875rem", color: "#C8913A", letterSpacing: "0.05em" }}>
          {reference}
        </p>
        <div style={{ height: "1px", background: "rgba(226,216,194,0.5)", margin: "20px 0" }} />
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", textAlign: "left" }}>
          {[
            { label: "Trip",   value: trip.title },
            { label: "Date",   value: formattedDate },
            { label: "Total paid", value: formatCurrency(total, trip.price_currency) },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: "flex", gap: "12px" }}>
              <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.8125rem", color: "#948A7D", minWidth: "72px" }}>{label}</span>
              <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.8125rem", color: "#1A1208", fontWeight: 500 }}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* What happens next */}
      <div style={{ background: "#F5F0E8", borderRadius: "18px", padding: "22px 24px", width: "100%", maxWidth: "480px", marginBottom: "32px", textAlign: "left" }}>
        <p style={{ fontFamily: "var(--font-display)", fontSize: "1rem", color: "#1A1208", marginBottom: "14px", letterSpacing: "-0.01em" }}>
          What happens next
        </p>
        {[
          { icon: "📧", text: "Check your inbox — your voucher and joining instructions are on their way." },
          { icon: "📱", text: "Save your reference number. Your guide will ask for it at the start." },
          { icon: "💬", text: "Questions? Our team is available 24/7 via WhatsApp or email." },
        ].map(({ icon, text }) => (
          <div key={text} style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "10px" }}>
            <span style={{ fontSize: "1rem", flexShrink: 0 }}>{icon}</span>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "#7A6E60", lineHeight: 1.6 }}>{text}</p>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
        <Link href="/dashboard/bookings"
          style={{ padding: "13px 24px", borderRadius: "12px", background: "#1A1208", color: "#FDFCFA", fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "0.9375rem", textDecoration: "none" }}>
          View my bookings
        </Link>
        <Link href="/trips"
          style={{ padding: "13px 24px", borderRadius: "12px", border: "1.5px solid rgba(226,216,194,0.8)", background: "#fff", color: "#7A6E60", fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "0.9375rem", textDecoration: "none" }}>
          Explore more trips
        </Link>
      </div>

      <style>{`
        @keyframes draw { from { stroke-dashoffset: 50; } to { stroke-dashoffset: 0; } }
      `}</style>
    </div>
  );
}
