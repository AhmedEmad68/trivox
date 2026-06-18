"use client";

import { useState } from "react";
import Image from "next/image";
import type { TripBase, Addon } from "@/types";
import type { ContactInfo } from "./Step2ContactInfo";
import { formatCurrency } from "@/lib/utils";

interface Step4Props {
  trip:            TripBase;
  date:            string;
  participants:    { adults: number; children: number; infants: number };
  contact:         ContactInfo;
  selectedAddons:  { addon: Addon; qty: number }[];
  onBack:          () => void;
  onConfirm:       () => void;
  isSubmitting:    boolean;
}

function CardInput({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "0.875rem", color: "#1A1208" }}>{label}</label>
      {children}
    </div>
  );
}

export function Step4Payment({ trip, date, participants, contact, selectedAddons, onBack, onConfirm, isSubmitting }: Step4Props) {
  const [cardNumber,  setCardNumber]  = useState("");
  const [expiry,      setExpiry]      = useState("");
  const [cvv,         setCvv]         = useState("");
  const [cardName,    setCardName]    = useState("");
  const [agreed,      setAgreed]      = useState(false);
  const [payMethod,   setPayMethod]   = useState<"card" | "paypal">("card");

  const fmt = (n: number) => formatCurrency(n, trip.price_currency);

  const totalPeople = participants.adults + participants.children;
  const basePrice   = trip.price_unit === "per_person" ? trip.price * Math.max(1, totalPeople) : trip.price;
  const addonsTotal = selectedAddons.reduce((s, { addon, qty }) =>
    s + addon.price * (addon.price_unit === "per_person" ? qty : 1), 0);
  const taxes       = Math.round((basePrice + addonsTotal) * 0.05 * 100) / 100;
  const total       = basePrice + addonsTotal + taxes;

  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })
    : "—";

  const canPay = agreed && (
    payMethod === "paypal" ||
    (cardNumber.replace(/\s/g, "").length >= 16 && expiry.length === 5 && cvv.length >= 3 && cardName.trim())
  );

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "11px 14px", borderRadius: "12px",
    fontFamily: "var(--font-sans)", fontSize: "0.9375rem", color: "#1A1208",
    border: "1.5px solid rgba(226,216,194,0.8)", background: "#fff", outline: "none",
    transition: "border-color 0.15s, box-shadow 0.15s",
  };

  const formatCard   = (v: string) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const formatExpiry = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

      {/* Booking summary recap */}
      <div style={{ background: "#F5F0E8", borderRadius: "18px", padding: "18px 20px", display: "flex", flexDirection: "column", gap: "10px" }}>
        <p style={{ fontFamily: "var(--font-display)", fontSize: "1rem", color: "#1A1208", letterSpacing: "-0.01em", marginBottom: "4px" }}>Booking summary</p>
        {[
          { label: "Trip",      value: trip.title },
          { label: "Date",      value: formattedDate },
          { label: "Guests",    value: `${participants.adults} adult${participants.adults > 1 ? "s" : ""}${participants.children > 0 ? `, ${participants.children} child${participants.children > 1 ? "ren" : ""}` : ""}` },
          { label: "Name",      value: `${contact.firstName} ${contact.lastName}` },
          { label: "Email",     value: contact.email },
        ].map(({ label, value }) => (
          <div key={label} style={{ display: "flex", gap: "12px" }}>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.8125rem", color: "#948A7D", minWidth: "52px", flexShrink: 0 }}>{label}</span>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.8125rem", color: "#1A1208", fontWeight: 500, wordBreak: "break-word" }}>{value}</span>
          </div>
        ))}
      </div>

      {/* Price lines */}
      <div style={{ background: "#fff", borderRadius: "18px", border: "1px solid rgba(226,216,194,0.6)", padding: "18px 20px" }}>
        <p style={{ fontFamily: "var(--font-display)", fontSize: "1rem", color: "#1A1208", marginBottom: "14px" }}>Price details</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <PriceLine label={trip.price_unit === "per_person" ? `Trip × ${totalPeople} ${totalPeople === 1 ? "person" : "people"}` : "Trip"} value={fmt(basePrice)} />
          {selectedAddons.map(({ addon, qty }) => (
            <PriceLine key={addon.id} label={`${addon.name}${addon.price_unit === "per_person" ? ` × ${qty}` : ""}`}
              value={fmt(addon.price * (addon.price_unit === "per_person" ? qty : 1))} />
          ))}
          <PriceLine label="Taxes & fees (5%)" value={fmt(taxes)} />
          <div style={{ height: "1px", background: "rgba(226,216,194,0.6)", margin: "4px 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "1rem", color: "#1A1208" }}>Total due today</span>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", color: "#1A1208", letterSpacing: "-0.03em" }}>{fmt(total)}</span>
          </div>
        </div>
      </div>

      {/* Payment method selector */}
      <div>
        <p style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "0.9375rem", color: "#1A1208", marginBottom: "12px" }}>Payment method</p>
        <div style={{ display: "flex", gap: "10px", marginBottom: "18px" }}>
          {(["card", "paypal"] as const).map((m) => (
            <button key={m} onClick={() => setPayMethod(m)}
              style={{ flex: 1, padding: "12px 16px", borderRadius: "12px", border: `2px solid ${payMethod === m ? "#C8913A" : "rgba(226,216,194,0.7)"}`, background: payMethod === m ? "rgba(200,145,58,0.06)" : "#fff", cursor: "pointer", fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "0.875rem", color: payMethod === m ? "#7D541A" : "#7A6E60", transition: "all 0.18s" }}>
              {m === "card" ? "💳 Credit / Debit card" : "🅿 PayPal"}
            </button>
          ))}
        </div>

        {/* Card form */}
        {payMethod === "card" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <CardInput label="Card number">
              <div style={{ ...inputStyle, display: "flex", alignItems: "center", gap: "10px", padding: "11px 14px" }}>
                <input type="text" value={cardNumber} onChange={(e) => setCardNumber(formatCard(e.target.value))}
                  placeholder="1234 5678 9012 3456" maxLength={19}
                  style={{ flex: 1, border: "none", outline: "none", fontFamily: "var(--font-sans)", fontSize: "0.9375rem", color: "#1A1208", background: "transparent", letterSpacing: "0.05em" }} />
                <div style={{ display: "flex", gap: "4px" }}>
                  {["VISA","MC","AMEX"].map((b) => (
                    <span key={b} style={{ fontSize: "0.5625rem", fontWeight: 700, color: "#948A7D", background: "#F5F0E8", borderRadius: "4px", padding: "2px 5px" }}>{b}</span>
                  ))}
                </div>
              </div>
            </CardInput>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              <CardInput label="Expiry">
                <input type="text" value={expiry} onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  placeholder="MM/YY" maxLength={5} style={inputStyle} />
              </CardInput>
              <CardInput label="CVV">
                <input type="text" value={cvv} onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  placeholder="123" maxLength={4} style={inputStyle} />
              </CardInput>
            </div>

            <CardInput label="Name on card">
              <input type="text" value={cardName} onChange={(e) => setCardName(e.target.value)}
                placeholder="SARAH MITCHELL" style={{ ...inputStyle, textTransform: "uppercase" }} />
            </CardInput>

            {/* Security badges */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 14px", background: "#F5F0E8", borderRadius: "10px" }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1L2.5 3.5V7c0 2.7 2 4.7 4.5 5 2.5-.3 4.5-2.3 4.5-5V3.5L7 1z" stroke="#4A7C3F" strokeWidth="1.3"/><path d="M4.5 7l2 2 3-3" stroke="#4A7C3F" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "#625849" }}>
                256-bit SSL encryption · PCI DSS compliant · Your card details are never stored
              </span>
            </div>
          </div>
        )}

        {/* PayPal */}
        {payMethod === "paypal" && (
          <div style={{ padding: "24px", background: "#F5F0E8", borderRadius: "14px", textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-sans)", color: "#7A6E60", fontSize: "0.875rem", lineHeight: 1.6 }}>
              You&apos;ll be redirected to PayPal to complete your payment securely.
            </p>
          </div>
        )}
      </div>

      {/* Terms checkbox */}
      <label style={{ display: "flex", alignItems: "flex-start", gap: "10px", cursor: "pointer" }}>
        <div onClick={() => setAgreed(!agreed)}
          style={{ width: "20px", height: "20px", borderRadius: "6px", flexShrink: 0, border: `2px solid ${agreed ? "#C8913A" : "rgba(226,216,194,0.8)"}`, background: agreed ? "#C8913A" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "1px", cursor: "pointer", transition: "all 0.15s" }}>
          {agreed && <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M2 5.5l2.5 2.5 5-5" stroke="#1A1208" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
        </div>
        <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "#7A6E60", lineHeight: 1.6 }}>
          I agree to the{" "}
          <a href="/terms" style={{ color: "#C8913A", textDecoration: "none" }}>Terms of Service</a>,{" "}
          <a href="/privacy" style={{ color: "#C8913A", textDecoration: "none" }}>Privacy Policy</a>, and{" "}
          <a href="/refund-policy" style={{ color: "#C8913A", textDecoration: "none" }}>Refund Policy</a>.
        </span>
      </label>

      {/* Action row */}
      <div style={{ display: "flex", gap: "12px" }}>
        <button onClick={onBack}
          style={{ flex: "none", padding: "14px 20px", borderRadius: "14px", border: "1.5px solid rgba(226,216,194,0.8)", background: "#fff", color: "#7A6E60", fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "0.9375rem", cursor: "pointer" }}>
          ← Back
        </button>
        <button
          onClick={onConfirm}
          disabled={!canPay || isSubmitting}
          style={{ flex: 1, padding: "15px", borderRadius: "14px", border: "none", cursor: canPay && !isSubmitting ? "pointer" : "not-allowed", background: canPay ? "#1A1208" : "#E2D8C2", color: canPay ? "#FDFCFA" : "#948A7D", fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "1rem", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
          {isSubmitting ? (
            <>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="animate-spin">
                <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeOpacity="0.2"/>
                <path d="M8 2a6 6 0 0 1 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Processing…
            </>
          ) : (
            <>🔒 Pay {fmt(total)}</>
          )}
        </button>
      </div>
    </div>
  );
}

function PriceLine({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
      <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "#7A6E60" }}>{label}</span>
      <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "#1A1208", fontWeight: 500 }}>{value}</span>
    </div>
  );
}
