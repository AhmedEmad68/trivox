"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { authService } from "@/services/api/auth";
import { AuthCard, authInputStyle, AuthError } from "@/features/auth/AuthCard";

export default function ResetPasswordPage() {
  const params      = useParams();
  const token       = params.token as string;

  const [password,  setPassword]  = useState("");
  const [confirm,   setConfirm]   = useState("");
  const [done,      setDone]      = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await authService.resetPassword(token, password);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const focusStyle  = { borderColor: "#C8913A", boxShadow: "0 0 0 3px rgba(200,145,58,0.15)" };
  const blurStyle   = { borderColor: "rgba(226,216,194,0.8)", boxShadow: "none" };

  return (
    <AuthCard
      title="Choose a new password"
      subtitle="At least 8 characters — make it strong."
      footer={
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "#7A6E60" }}>
          <Link href="/login" style={{ color: "#C8913A", fontWeight: 500, textDecoration: "none" }}>
            ← Back to sign in
          </Link>
        </p>
      }
    >
      {done ? (
        /* ── Success state ── */
        <div style={{ textAlign: "center", padding: "16px 0 8px" }}>
          <div style={{
            width: "56px", height: "56px", borderRadius: "50%",
            background: "rgba(74,124,63,0.1)", border: "2px solid rgba(74,124,63,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px",
          }}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M4 11l4.5 4.5 9.5-9" stroke="#4A7C3F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", color: "#1A1208", marginBottom: "8px" }}>
            Password updated!
          </h3>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.9375rem", color: "#7A6E60", lineHeight: 1.65, marginBottom: "24px" }}>
            Your password has been changed. You can now sign in with your new password.
          </p>
          <Link
            href="/login"
            style={{
              display: "inline-block", padding: "13px 28px", borderRadius: "12px",
              background: "#1A1208", color: "#FDFCFA", textDecoration: "none",
              fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "0.9375rem",
            }}
          >
            Go to sign in →
          </Link>
        </div>
      ) : (
        /* ── Form ── */
        <>
          {error && <AuthError message={error} />}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "0.875rem", color: "#1A1208" }}>
                New password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                required
                minLength={8}
                autoComplete="new-password"
                style={authInputStyle}
                onFocus={(e) => Object.assign((e.target as HTMLInputElement).style, focusStyle)}
                onBlur={(e)  => Object.assign((e.target as HTMLInputElement).style, blurStyle)}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "0.875rem", color: "#1A1208" }}>
                Confirm new password
              </label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repeat your new password"
                required
                autoComplete="new-password"
                style={authInputStyle}
                onFocus={(e) => Object.assign((e.target as HTMLInputElement).style, focusStyle)}
                onBlur={(e)  => Object.assign((e.target as HTMLInputElement).style, blurStyle)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", padding: "14px", borderRadius: "12px", border: "none",
                background: loading ? "#E2D8C2" : "#C8913A",
                color:      loading ? "#948A7D" : "#1A1208",
                fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "1rem",
                cursor: loading ? "wait" : "pointer",
                boxShadow: loading ? "none" : "0 4px 20px rgba(200,145,58,0.35)",
              }}
            >
              {loading ? "Updating…" : "Update password"}
            </button>
          </form>
        </>
      )}
    </AuthCard>
  );
}
