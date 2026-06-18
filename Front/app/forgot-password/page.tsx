"use client";

import { useState } from "react";
import Link from "next/link";
import { authService } from "@/services/api/auth";
import { AuthCard, authInputStyle, AuthError } from "@/features/auth/AuthCard";

export default function ForgotPasswordPage() {
  const [email,    setEmail]    = useState("");
  const [sent,     setSent]     = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await authService.forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Reset your password"
      subtitle="Enter your email and we'll send a reset link."
      footer={
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "#7A6E60" }}>
          Remembered it?{" "}
          <Link href="/login" style={{ color: "#C8913A", fontWeight: 500, textDecoration: "none" }}>
            Back to sign in →
          </Link>
        </p>
      }
    >
      {sent ? (
        /* Success state */
        <div style={{ textAlign: "center", padding: "16px 0 8px" }}>
          <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "rgba(74,124,63,0.1)", border: "2px solid rgba(74,124,63,0.25)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M4 11l4.5 4.5 9.5-9" stroke="#4A7C3F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", color: "#1A1208", marginBottom: "8px" }}>
            Check your inbox
          </h3>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.9375rem", color: "#7A6E60", lineHeight: 1.65, marginBottom: "20px" }}>
            We&apos;ve sent a password reset link to{" "}
            <strong style={{ color: "#1A1208" }}>{email}</strong>.
            It expires in 30 minutes.
          </p>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.8125rem", color: "#948A7D" }}>
            Didn&apos;t receive it? Check your spam folder, or{" "}
            <button
              onClick={() => setSent(false)}
              style={{ background: "none", border: "none", color: "#C8913A", cursor: "pointer", fontFamily: "var(--font-sans)", fontSize: "0.8125rem", fontWeight: 500, padding: 0 }}
            >
              try again
            </button>.
          </p>
        </div>
      ) : (
        /* Form */
        <>
          {error && <AuthError message={error} />}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "0.875rem", color: "#1A1208" }}>
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sarah@example.com"
                required
                autoComplete="email"
                style={authInputStyle}
                onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "#C8913A"; (e.target as HTMLInputElement).style.boxShadow = "0 0 0 3px rgba(200,145,58,0.15)"; }}
                onBlur={(e)  => { (e.target as HTMLInputElement).style.borderColor = "rgba(226,216,194,0.8)"; (e.target as HTMLInputElement).style.boxShadow = "none"; }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", padding: "14px", borderRadius: "12px", border: "none",
                background: loading ? "#E2D8C2" : "#C8913A",
                color: loading ? "#948A7D" : "#1A1208",
                fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "1rem",
                cursor: loading ? "wait" : "pointer",
                boxShadow: loading ? "none" : "0 4px 20px rgba(200,145,58,0.35)",
              }}
            >
              {loading ? "Sending…" : "Send reset link"}
            </button>
          </form>
        </>
      )}
    </AuthCard>
  );
}
