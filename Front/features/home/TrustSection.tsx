"use client";

import { useState } from "react";

const TRUST_ITEMS = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 3L4 7v5c0 4.418 3.582 8 8 9 4.418-1 8-4.582 8-9V7l-8-4z" stroke="#C8913A" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M8.5 12l2.5 2.5 4.5-4.5" stroke="#C8913A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title:  "Verified operators only",
    body:   "Every experience partner is vetted by our team for quality, safety, and licensing.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke="#C8913A" strokeWidth="1.5"/>
        <path d="M8 12l2.5 2.5 5.5-5.5" stroke="#C8913A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title:  "Free cancellation",
    body:   "Plans change. Cancel up to 24 hours before most trips for a full refund, no questions asked.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="11" width="18" height="11" rx="2" stroke="#C8913A" strokeWidth="1.5"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#C8913A" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="12" cy="16" r="1.5" fill="#C8913A"/>
      </svg>
    ),
    title:  "Secure payments",
    body:   "256-bit SSL encryption. Pay by card, Apple Pay or Google Pay — your data never stored.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="#C8913A" strokeWidth="1.5"/>
        <path d="M12 7v5l3 3" stroke="#C8913A" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title:  "24 / 7 support",
    body:   "Our local team is available around the clock via WhatsApp, phone, or email — always in English.",
  },
];

export function TrustSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <>
      {/* ── Trust badges ─────────────────────────────────────────── */}
      <section className="section-padding" style={{ background: "#FDFCFA" }}>
        <div className="container-trivox">
          <div className="section-ornament mb-12">
            <div className="divider-gold" />
            <p className="eyebrow mt-4">Why book with us</p>
            <h2
              className="mt-2"
              style={{
                fontFamily: "var(--font-display)",
                color: "#1A1208",
                fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
                letterSpacing: "-0.025em",
              }}
            >
              Your journey, guaranteed
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TRUST_ITEMS.map((item) => (
              <div
                key={item.title}
                className="trust-badge flex-col items-start gap-4 p-6"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(200,145,58,0.1)" }}
                >
                  {item.icon}
                </div>
                <div>
                  <h4
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "#1A1208",
                      fontSize: "1.0625rem",
                      letterSpacing: "-0.01em",
                      marginBottom: "6px",
                    }}
                  >
                    {item.title}
                  </h4>
                  <p style={{ fontFamily: "var(--font-sans)", color: "#7A6E60", fontSize: "0.875rem", lineHeight: 1.65 }}>
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter / CTA band ─────────────────────────────────── */}
      <section
        className="py-20 relative overflow-hidden"
        style={{ background: "#1A1208" }}
      >
        {/* Decorative circles */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full pointer-events-none" style={{ background: "rgba(200,145,58,0.05)" }} />
        <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full pointer-events-none" style={{ background: "rgba(200,145,58,0.04)" }} />

        <div className="container-trivox relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <div className="divider-gold mx-auto mb-6" />
            <h2
              className="mb-3"
              style={{
                fontFamily: "var(--font-display)",
                color: "#FDFCFA",
                fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)",
                letterSpacing: "-0.025em",
              }}
            >
              Get insider travel tips
            </h2>
            <p
              className="mb-8"
              style={{
                fontFamily: "var(--font-sans)",
                color: "rgba(253,252,250,0.6)",
                fontSize: "1rem",
                lineHeight: 1.65,
              }}
            >
              Early access to new trips, exclusive discounts, and stories from
              Egypt&apos;s hidden corners — delivered twice a month.
            </p>

            {submitted ? (
              <div
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl"
                style={{ background: "rgba(74,124,63,0.2)", border: "1px solid rgba(74,124,63,0.35)" }}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M3 9l4 4 8-8" stroke="#5C9F50" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span style={{ color: "#7ABB70", fontFamily: "var(--font-sans)", fontSize: "0.9375rem" }}>
                  You&apos;re on the list — welcome aboard!
                </span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 rounded-xl px-5 py-3.5 text-sm outline-none"
                  style={{
                    background: "rgba(253,252,250,0.07)",
                    border: "1px solid rgba(253,252,250,0.15)",
                    color: "#FDFCFA",
                    fontFamily: "var(--font-sans)",
                  }}
                  onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "rgba(200,145,58,0.5)"; (e.target as HTMLInputElement).style.background = "rgba(253,252,250,0.1)"; }}
                  onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = "rgba(253,252,250,0.15)"; (e.target as HTMLInputElement).style.background = "rgba(253,252,250,0.07)"; }}
                />
                <button
                  type="submit"
                  className="btn-primary btn btn-md whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>
            )}

            <p className="mt-4 text-xs" style={{ color: "rgba(253,252,250,0.35)", fontFamily: "var(--font-sans)" }}>
              No spam, ever. Unsubscribe in one click.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
