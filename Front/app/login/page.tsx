"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { AuthCard, authInputStyle, AuthError } from "@/features/auth/AuthCard";

/* ─── Dev-mode banner shown when Django isn't running ────────────── */
function MockModeBanner() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "10px",
        padding: "12px 14px",
        borderRadius: "12px",
        background: "rgba(200,145,58,0.1)",
        border: "1px solid rgba(200,145,58,0.3)",
        marginBottom: "16px",
      }}
    >
      <span style={{ fontSize: "1rem", flexShrink: 0 }}>🔧</span>
      <div>
        <p style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "0.8125rem", color: "#7D541A", marginBottom: "2px" }}>
          Dev mode — backend offline
        </p>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "#948A7D", lineHeight: 1.5 }}>
          Django isn&apos;t running. Enter <strong>any email + password</strong> to log in with a demo account. No data is sent anywhere.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const { login, loading, error, isMockMode, clearError } = useAuth();
  const searchParams = useSearchParams();
  const redirect     = searchParams.get("redirect") ?? "";

  // True when the user arrived here because they tried to book
  const isBookingGate = redirect.startsWith("/booking");

  const [email,     setEmail]     = useState("");
  const [password,  setPassword]  = useState("");
  const [showPw,    setShowPw]    = useState(false);
  const [attempted, setAttempted] = useState(false);

  const showMockBanner = isMockMode || (attempted && error?.toLowerCase().includes("cannot reach"));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setAttempted(true);
    await login(email, password);
  };

  const focusStyle = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "#C8913A";
    e.target.style.boxShadow   = "0 0 0 3px rgba(200,145,58,0.15)";
  };
  const blurStyle = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "rgba(226,216,194,0.8)";
    e.target.style.boxShadow   = "none";
  };

  const registerHref = isBookingGate
    ? `/register?redirect=${encodeURIComponent(redirect)}`
    : "/register";

  return (
    <AuthCard
      title={isBookingGate ? "Sign in to book" : "Welcome back"}
      subtitle={
        isBookingGate
          ? "You need an account to complete your booking. Sign in or create one — it only takes a minute."
          : "Sign in to manage your bookings and profile."
      }
      footer={
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "#7A6E60" }}>
          Don&apos;t have an account?{" "}
          <Link href={registerHref} style={{ color: "#C8913A", fontWeight: 500, textDecoration: "none" }}>
            Create one free →
          </Link>
        </p>
      }
    >
      {/* Show mock banner when offline */}
      {showMockBanner && <MockModeBanner />}

      {/* Show API errors (but not the "cannot reach" one — banner covers it) */}
      {error && !error.toLowerCase().includes("cannot reach") && (
        <AuthError message={error} />
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* Email */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "0.875rem", color: "#1A1208" }}>
            Email address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={isMockMode ? "any@email.com" : "sarah@example.com"}
            required
            autoComplete="email"
            style={authInputStyle}
            onFocus={focusStyle}
            onBlur={blurStyle}
          />
        </div>

        {/* Password */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <label style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "0.875rem", color: "#1A1208" }}>
              Password
            </label>
            <Link
              href="/forgot-password"
              style={{ fontFamily: "var(--font-sans)", fontSize: "0.8125rem", color: "#C8913A", textDecoration: "none" }}
            >
              Forgot password?
            </Link>
          </div>
          <div style={{ position: "relative" }}>
            <input
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isMockMode ? "anything" : "••••••••"}
              required
              autoComplete="current-password"
              style={{ ...authInputStyle, paddingRight: "44px" }}
              onFocus={focusStyle}
              onBlur={blurStyle}
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              aria-label={showPw ? "Hide password" : "Show password"}
              style={{
                position: "absolute", right: "12px", top: "50%",
                transform: "translateY(-50%)",
                background: "none", border: "none", cursor: "pointer",
                color: "#948A7D", display: "flex", alignItems: "center", padding: "4px",
              }}
            >
              {showPw ? (
                <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                  <path d="M2 8.5S4.5 3.5 8.5 3.5 15 8.5 15 8.5s-2.5 5-6.5 5S2 8.5 2 8.5z" stroke="currentColor" strokeWidth="1.4"/>
                  <circle cx="8.5" cy="8.5" r="2" stroke="currentColor" strokeWidth="1.4"/>
                  <path d="M3 3l11 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
              ) : (
                <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                  <path d="M2 8.5S4.5 3.5 8.5 3.5 15 8.5 15 8.5s-2.5 5-6.5 5S2 8.5 2 8.5z" stroke="currentColor" strokeWidth="1.4"/>
                  <circle cx="8.5" cy="8.5" r="2" stroke="currentColor" strokeWidth="1.4"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%", padding: "14px", borderRadius: "12px", border: "none",
            background: loading ? "#E2D8C2" : "#C8913A",
            color:      loading ? "#948A7D" : "#1A1208",
            fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "1rem",
            cursor:     loading ? "wait" : "pointer",
            boxShadow:  loading ? "none" : "0 4px 20px rgba(200,145,58,0.35)",
            transition: "all 0.2s",
            marginTop:  "4px",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
          }}
        >
          {loading && (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
              style={{ animation: "spin 0.8s linear infinite" }}>
              <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeOpacity="0.25"/>
              <path d="M8 2a6 6 0 0 1 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </svg>
          )}
          {loading ? "Signing in…" : "Sign in"}
        </button>

        {/* Divider + guest link — hidden when arriving from the booking gate */}
        {!isBookingGate && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ flex: 1, height: "1px", background: "rgba(226,216,194,0.6)" }} />
              <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.8125rem", color: "#948A7D" }}>or</span>
              <div style={{ flex: 1, height: "1px", background: "rgba(226,216,194,0.6)" }} />
            </div>
            <Link
              href="/trips"
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: "13px", borderRadius: "12px",
                border: "1.5px solid rgba(226,216,194,0.8)", background: "#FDFCFA",
                color: "#7A6E60", fontFamily: "var(--font-sans)", fontWeight: 500,
                fontSize: "0.9375rem", textDecoration: "none",
              }}
            >
              Continue browsing as guest
            </Link>
          </>
        )}
      </form>
    </AuthCard>
  );
}
