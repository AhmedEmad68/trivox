import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title:       "How TriVox Works — Book with Confidence",
  description: "Simple steps to book a tour, transfer or experience. Instant confirmation, free cancellation, secure payment.",
};

const STEPS = [
  { n: "01", title: "Find the right trip", body: "Browse by destination, type, or price. Use filters for duration, rating, and cancellation policy. Every listing has real photos, honest descriptions, and genuine reviews.", icon: "🔍" },
  { n: "02", title: "Check availability",  body: "Pick your date and number of guests. Our live availability calendar shows real-time slots. If a date is full, you can join the waitlist.", icon: "📅" },
  { n: "03", title: "Book securely",        body: "Fill in your details, add any extras, and pay by card or PayPal. All payments are 256-bit SSL encrypted. You receive instant confirmation by email.", icon: "🔒" },
  { n: "04", title: "Get your voucher",     body: "Your e-voucher arrives immediately. It has your guide's number, meeting point, and everything you need. Show it on your phone — no printing needed.", icon: "📱" },
  { n: "05", title: "Meet your guide",      body: "Your guide meets you at the agreed point, usually your hotel. They'll have your name on a sign if arriving at an airport or port.", icon: "🤝" },
  { n: "06", title: "Leave a review",       body: "After your trip, share your experience. Reviews go straight to the listing — we never filter or edit them. Your feedback helps future travellers.", icon: "⭐" },
];

const FAQS = [
  { q: "What if I need to cancel?",          a: "Most trips offer free cancellation up to 24 hours before. The exact policy is shown on every listing before you book. If you cancel within the window, your refund is processed within 5–7 business days." },
  { q: "What's included in the price?",      a: "Each listing shows exactly what's included and excluded. Most tours include transport, guide fees, and entry tickets. Check the 'What's included' section on the trip page." },
  { q: "Are guides licensed?",               a: "Yes. We only work with licensed, vetted guides and operators. Every listing is checked by our Cairo-based team before it appears on TriVox." },
  { q: "What if my guide doesn't show up?",  a: "It's extremely rare, but if it happens, call our 24/7 support line immediately. We'll arrange an alternative or provide a full refund — whichever you prefer." },
  { q: "Can I customise a trip?",            a: "Many tours offer add-ons — extra sites, lunches, vehicle upgrades. For fully private itineraries, contact our team directly and we'll arrange something bespoke." },
  { q: "Do I need travel insurance?",        a: "We strongly recommend it. We're not a substitute for travel insurance, and it's not included in any listing unless specifically stated." },
];

export default function HowItWorksPage() {
  return (
    <div style={{ background: "#FDFCFA" }}>
      {/* Hero */}
      <div style={{ background: "#1A1208", paddingTop: "calc(var(--navbar-height) + 3.5rem)", paddingBottom: "4rem", position: "relative", overflow: "hidden" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 50% 50% at 50% 80%, rgba(200,145,58,0.09), transparent)" }} />
        <div className="container-trivox relative z-10" style={{ maxWidth: "640px" }}>
          <p className="eyebrow" style={{ color: "rgba(200,145,58,0.75)", marginBottom: "12px" }}>Simple process</p>
          <h1 style={{ fontFamily: "var(--font-display)", color: "#FDFCFA", fontSize: "clamp(2.25rem, 5vw, 3.25rem)", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: "16px" }}>
            How TriVox works
          </h1>
          <p style={{ fontFamily: "var(--font-sans)", color: "rgba(253,252,250,0.7)", fontSize: "1.0625rem", lineHeight: 1.7 }}>
            Booking an authentic Egyptian experience takes six steps and about three minutes.
          </p>
        </div>
      </div>

      {/* Steps */}
      <div className="container-trivox section-padding" style={{ maxWidth: "760px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "72px" }}>
          {STEPS.map((step, i) => (
            <div key={step.n} style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
              {/* Step number + connector */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#1A1208", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid rgba(200,145,58,0.3)" }}>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: "1rem", color: "#C8913A", letterSpacing: "-0.02em" }}>{step.n}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{ width: "2px", flex: 1, minHeight: "24px", background: "linear-gradient(to bottom, #C8913A, rgba(200,145,58,0.15))", margin: "8px 0" }} />
                )}
              </div>
              {/* Content */}
              <div style={{ paddingTop: "10px", paddingBottom: i < STEPS.length - 1 ? "16px" : "0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                  <span style={{ fontSize: "1.25rem" }}>{step.icon}</span>
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", color: "#1A1208", letterSpacing: "-0.015em" }}>{step.title}</h2>
                </div>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "1rem", color: "#7A6E60", lineHeight: 1.75 }}>{step.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="divider" style={{ marginBottom: "56px" }} />

        {/* FAQ */}
        <div style={{ marginBottom: "56px" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", color: "#1A1208", letterSpacing: "-0.025em", marginBottom: "28px" }}>
            Frequently asked questions
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {FAQS.map(({ q, a }) => (
              <details
                key={q}
                style={{ background: "#fff", borderRadius: "16px", border: "1px solid rgba(226,216,194,0.6)", overflow: "hidden" }}
              >
                <summary
                  style={{ padding: "18px 20px", fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "1rem", color: "#1A1208", cursor: "pointer", listStyle: "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                >
                  {q}
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginLeft: "12px" }}>
                    <path d="M4 6l4 4 4-4" stroke="#948A7D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </summary>
                <div style={{ padding: "0 20px 18px", borderTop: "1px solid rgba(226,216,194,0.4)" }}>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.9375rem", color: "#7A6E60", lineHeight: 1.7, paddingTop: "14px" }}>{a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* Trust badges row */}
        <div style={{ display: "grid", gap: "12px", marginBottom: "48px" }} className="sm:grid-cols-3">
          {[
            { icon: "🔒", title: "Secure payment",    body: "256-bit SSL on every transaction." },
            { icon: "✓",  title: "Vetted operators",  body: "Every guide checked in person." },
            { icon: "📞", title: "24/7 support",      body: "WhatsApp, phone, email — always." },
          ].map((b) => (
            <div key={b.title} style={{ padding: "18px", background: "#F5F0E8", borderRadius: "16px", textAlign: "center", border: "1px solid rgba(200,145,58,0.12)" }}>
              <span style={{ fontSize: "1.5rem", display: "block", marginBottom: "8px" }}>{b.icon}</span>
              <p style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "0.9375rem", color: "#1A1208", marginBottom: "3px" }}>{b.title}</p>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.8125rem", color: "#7A6E60" }}>{b.body}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center" }}>
          <Link href="/trips" style={{ display: "inline-flex", padding: "14px 36px", borderRadius: "14px", background: "#C8913A", color: "#1A1208", fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "1rem", textDecoration: "none", boxShadow: "0 4px 20px rgba(200,145,58,0.35)" }}>
            Start exploring Egypt →
          </Link>
        </div>
      </div>
    </div>
  );
}
