"use client";

import { useState } from "react";
import { api } from "@/services/api/client";

export default function ContactPage() {
  const [form,      setForm]      = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting,setSubmitting]= useState(false);
  const [error,     setError]     = useState("");

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSubmitting(true);
    setError("");
    try {
      await api.post("/auth/contact/", form, { noAuth: true });
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again or email us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "12px 14px", borderRadius: "12px",
    fontFamily: "var(--font-sans)", fontSize: "0.9375rem", color: "#1A1208",
    border: "1.5px solid rgba(226,216,194,0.8)", background: "#fff",
    outline: "none", transition: "border-color 0.15s",
  };

  return (
    <div style={{ background: "#FDFCFA" }}>
      {/* Hero */}
      <div style={{ background: "#1A1208", paddingTop: "calc(var(--navbar-height) + 3rem)", paddingBottom: "4rem" }}>
        <div className="container-trivox" style={{ maxWidth: "600px" }}>
          <p className="eyebrow" style={{ color: "rgba(200,145,58,0.75)", marginBottom: "10px" }}>Get in touch</p>
          <h1 style={{ fontFamily: "var(--font-display)", color: "#FDFCFA", fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.03em", marginBottom: "14px" }}>
            We&apos;d love to hear from you
          </h1>
          <p style={{ fontFamily: "var(--font-sans)", color: "rgba(253,252,250,0.65)", fontSize: "1rem", lineHeight: 1.7 }}>
            Whether you have a question about a trip, need help with a booking, or want to list your experience on TriVox — we&apos;re here.
          </p>
        </div>
      </div>

      <div className="container-trivox section-padding">
        <div style={{ display: "grid", gap: "40px", maxWidth: "1000px" }} className="lg:grid-cols-[1fr_360px]">

          {/* Form */}
          <div style={{ background: "#fff", borderRadius: "22px", border: "1px solid rgba(226,216,194,0.6)", padding: "32px", boxShadow: "0 2px 16px rgba(26,18,8,0.06)" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", color: "#1A1208", letterSpacing: "-0.02em", marginBottom: "24px" }}>
              Send a message
            </h2>

            {submitted ? (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: "rgba(74,124,63,0.1)", border: "2px solid rgba(74,124,63,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M5 12l4 4 10-10" stroke="#4A7C3F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", color: "#1A1208", marginBottom: "8px" }}>Message sent!</h3>
                <p style={{ fontFamily: "var(--font-sans)", color: "#7A6E60", fontSize: "0.9375rem" }}>
                  We&apos;ll get back to you within a few hours, usually much sooner.
                </p>
              </div>
            ) : (
              <>
              {error && (
                <div style={{ padding: "12px 16px", borderRadius: "12px", background: "rgba(181,74,44,0.08)", border: "1px solid rgba(181,74,44,0.25)", marginBottom: "16px" }}>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "#B54A2C" }}>{error}</p>
                </div>
              )}
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "grid", gap: "16px" }} className="sm:grid-cols-2">
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "0.875rem", color: "#1A1208" }}>Your name *</label>
                    <input type="text" value={form.name} onChange={set("name")} placeholder="Sarah Mitchell" required style={inputStyle} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "0.875rem", color: "#1A1208" }}>Email address *</label>
                    <input type="email" value={form.email} onChange={set("email")} placeholder="sarah@example.com" required style={inputStyle} />
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "0.875rem", color: "#1A1208" }}>Subject</label>
                  <select value={form.subject} onChange={set("subject")} style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}>
                    <option value="">Select a topic</option>
                    <option value="booking">Booking question</option>
                    <option value="cancel">Cancellation / refund</option>
                    <option value="custom">Custom itinerary</option>
                    <option value="list">List my experience</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "0.875rem", color: "#1A1208" }}>Message *</label>
                  <textarea value={form.message} onChange={set("message")} rows={5} placeholder="Tell us how we can help…" required style={{ ...inputStyle, resize: "vertical", lineHeight: 1.65 }} />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{ padding: "14px", borderRadius: "12px", background: "#C8913A", color: "#1A1208", fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "1rem", border: "none", cursor: submitting ? "wait" : "pointer", boxShadow: "0 4px 20px rgba(200,145,58,0.3)", opacity: submitting ? 0.7 : 1 }}
                >
                  {submitting ? "Sending…" : "Send message"}
                </button>
              </form>
              </>
            )}
          </div>

          {/* Direct contact */}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {[
              { icon: "📧", label: "Email", value: "hello@trivox.travel",     href: "mailto:hello@trivox.travel",    note: "Usually replies within 2 hours" },
              { icon: "💬", label: "WhatsApp", value: "+20 100 123 4567",     href: "https://wa.me/201001234567",   note: "Available 24/7" },
              { icon: "📞", label: "Phone",    value: "+20 100 123 4567",     href: "tel:+201001234567",            note: "9am – 9pm EET" },
            ].map((c) => (
              <a
                key={c.label}
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "flex-start", gap: "14px", padding: "18px 20px", background: "#fff", borderRadius: "16px", border: "1px solid rgba(226,216,194,0.6)", textDecoration: "none", boxShadow: "0 1px 8px rgba(26,18,8,0.04)" }}
              >
                <span style={{ fontSize: "1.375rem", flexShrink: 0 }}>{c.icon}</span>
                <div>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6875rem", color: "#948A7D", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 500, marginBottom: "3px" }}>{c.label}</p>
                  <p style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "0.9375rem", color: "#1A1208", marginBottom: "2px" }}>{c.value}</p>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.8125rem", color: "#7A6E60" }}>{c.note}</p>
                </div>
              </a>
            ))}

            <div style={{ padding: "20px", background: "#F5F0E8", borderRadius: "16px", border: "1px solid rgba(200,145,58,0.15)" }}>
              <p style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "0.875rem", color: "#1A1208", marginBottom: "4px" }}>Based in Cairo</p>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.8125rem", color: "#7A6E60", lineHeight: 1.6 }}>
                TriVox Travel<br />
                5 Tahrir Square, Garden City<br />
                Cairo, Egypt 11511
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
