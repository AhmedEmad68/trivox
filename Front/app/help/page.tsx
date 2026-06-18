import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title:       "Help Centre — TriVox Travel",
  description: "Answers to common questions about booking, cancellations, payments, and your experience with TriVox.",
};

const CATEGORIES = [
  {
    icon: "📋", title: "Booking",
    articles: [
      { q: "How do I book a trip?",                      a: "Select your trip, choose a date, add participants, then pay securely by card or PayPal. Confirmation arrives by email instantly." },
      { q: "Can I book for a group?",                    a: "Yes. Set the number of adults, children, and infants during checkout. Group rates apply automatically for qualifying trips." },
      { q: "Is there a booking fee?",                    a: "No booking fee. The price shown is the price you pay, including all taxes and fees. Nothing hidden." },
      { q: "Can I book last-minute?",                    a: "Many trips accept same-day bookings. Filter by 'Instant confirmation' to see options with immediate availability." },
    ],
  },
  {
    icon: "↩️", title: "Cancellations & Changes",
    articles: [
      { q: "What is the cancellation policy?",           a: "Each trip has its own policy shown on the listing page. Most offer free cancellation up to 24 hours before the start time." },
      { q: "How do I cancel a booking?",                 a: "Go to My Bookings in your dashboard, find the booking, and click 'Cancel'. Your refund will be processed within 5–7 business days." },
      { q: "Can I change my booking date?",              a: "Date changes are handled by contacting our team directly. We'll do our best to accommodate — subject to availability." },
      { q: "What if the operator cancels?",              a: "If an operator cancels, you receive a full refund immediately, plus a 10% discount code for your next booking." },
    ],
  },
  {
    icon: "💳", title: "Payments",
    articles: [
      { q: "What payment methods are accepted?",         a: "Visa, Mastercard, American Express, and PayPal. All payments are processed securely via Stripe." },
      { q: "Is my payment information safe?",            a: "Yes. We use 256-bit SSL encryption. Your card details are never stored on our servers — all processing is handled by Stripe (PCI DSS Level 1)." },
      { q: "When am I charged?",                        a: "You are charged immediately at checkout. Your booking is confirmed as soon as payment clears — usually within seconds." },
      { q: "Can I get an invoice?",                      a: "Yes. A detailed invoice is attached to your confirmation email. You can also download it from your booking detail page." },
    ],
  },
  {
    icon: "📍", title: "On the day",
    articles: [
      { q: "Where do I meet my guide?",                 a: "Meeting instructions are in your confirmation email and voucher. For most tours, your guide picks you up at your hotel." },
      { q: "What if my guide is late?",                 a: "Wait 15 minutes, then call the number on your voucher. If still no contact, call our 24/7 support line." },
      { q: "Do I need to print my voucher?",            a: "No. Show the voucher on your phone. Make sure you have the booking reference number — your guide will ask for it." },
      { q: "Can I bring children?",                     a: "Most trips welcome children. Each listing shows a minimum age. If none is listed, all ages are welcome." },
    ],
  },
];

export default function HelpPage() {
  return (
    <div style={{ background: "#FDFCFA" }}>
      {/* Hero */}
      <div style={{ background: "#1A1208", paddingTop: "calc(var(--navbar-height) + 3rem)", paddingBottom: "4rem", textAlign: "center" }}>
        <div className="container-trivox" style={{ maxWidth: "560px" }}>
          <h1 style={{ fontFamily: "var(--font-display)", color: "#FDFCFA", fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.03em", marginBottom: "14px" }}>
            How can we help?
          </h1>
          <p style={{ fontFamily: "var(--font-sans)", color: "rgba(253,252,250,0.65)", fontSize: "1.0625rem", lineHeight: 1.65, marginBottom: "28px" }}>
            Answers to the most common questions. Can&apos;t find what you need? Contact us directly.
          </p>
          <Link href="/contact" style={{ display: "inline-flex", padding: "11px 24px", borderRadius: "12px", background: "#C8913A", color: "#1A1208", fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "0.9375rem", textDecoration: "none" }}>
            Contact support
          </Link>
        </div>
      </div>

      {/* FAQ categories */}
      <div className="container-trivox section-padding" style={{ maxWidth: "840px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
          {CATEGORIES.map((cat) => (
            <div key={cat.title}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                <span style={{ fontSize: "1.375rem" }}>{cat.icon}</span>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", color: "#1A1208", letterSpacing: "-0.02em" }}>{cat.title}</h2>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {cat.articles.map(({ q, a }) => (
                  <details key={q} style={{ background: "#fff", borderRadius: "14px", border: "1px solid rgba(226,216,194,0.6)", overflow: "hidden" }}>
                    <summary style={{ padding: "16px 18px", fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "0.9375rem", color: "#1A1208", cursor: "pointer", listStyle: "none", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
                      {q}
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                        <path d="M3 5l4 4 4-4" stroke="#948A7D" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </summary>
                    <div style={{ borderTop: "1px solid rgba(226,216,194,0.4)", padding: "14px 18px" }}>
                      <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.9375rem", color: "#7A6E60", lineHeight: 1.7 }}>{a}</p>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Still need help? */}
        <div style={{ marginTop: "56px", padding: "32px", background: "#F5F0E8", borderRadius: "20px", textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "1.375rem", color: "#1A1208", letterSpacing: "-0.02em", marginBottom: "8px" }}>Still need help?</p>
          <p style={{ fontFamily: "var(--font-sans)", color: "#7A6E60", fontSize: "0.9375rem", marginBottom: "20px" }}>Our team is available 24/7 — usually replies within 10 minutes.</p>
          <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/contact" style={{ padding: "11px 22px", borderRadius: "12px", background: "#1A1208", color: "#FDFCFA", fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "0.9375rem", textDecoration: "none" }}>Send a message</Link>
            <a href="tel:+201001234567" style={{ padding: "11px 22px", borderRadius: "12px", border: "1.5px solid rgba(226,216,194,0.8)", background: "#fff", color: "#7A6E60", fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "0.9375rem", textDecoration: "none" }}>Call us</a>
          </div>
        </div>
      </div>
    </div>
  );
}
