"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { AuthCard, authInputStyle, AuthError } from "@/features/auth/AuthCard";

/* ─── Dev banner ─────────────────────────────────────────────────── */
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
          Django isn&apos;t running. Fill in the form and click &quot;Create account&quot; — a local demo account will be created instantly. No data is sent anywhere.
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  const { register, loading, error, isMockMode, clearError } = useAuth();
  const searchParams = useSearchParams();
  const redirect     = searchParams.get("redirect") ?? "";
  const loginHref    = redirect ? `/login?redirect=${encodeURIComponent(redirect)}` : "/login";

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", password: "", confirmPw: "", phone: "",
  });
  const [agreed,          setAgreed]          = useState(false);
  const [validationError, setValidationError] = useState("");
  const [attempted,       setAttempted]       = useState(false);

  const showMockBanner = isMockMode || (attempted && error?.toLowerCase().includes("cannot reach"));

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const focusStyle = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "#C8913A";
    e.target.style.boxShadow   = "0 0 0 3px rgba(200,145,58,0.15)";
  };
  const blurStyle = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "rgba(226,216,194,0.8)";
    e.target.style.boxShadow   = "none";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setValidationError("");
    setAttempted(true);

    if (form.password.length < 8) {
      setValidationError("Password must be at least 8 characters.");
      return;
    }
    if (form.password !== form.confirmPw) {
      setValidationError("Passwords don't match.");
      return;
    }
    if (!agreed) {
      setValidationError("Please agree to the Terms of Service to continue.");
      return;
    }

    await register({
      email:      form.email,
      password:   form.password,
      first_name: form.firstName,
      last_name:  form.lastName,
      phone:      form.phone || undefined,
    });
  };

  const displayError =
    validationError ||
    (error && !error.toLowerCase().includes("cannot reach") ? error : "");

  return (
    <AuthCard
      title="Create your account"
      subtitle="Join thousands of travellers exploring Egypt."
      footer={
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "#7A6E60" }}>
          Already have an account?{" "}
          <Link href={loginHref} style={{ color: "#C8913A", fontWeight: 500, textDecoration: "none" }}>
            Sign in →
          </Link>
        </p>
      }
    >
      {showMockBanner && <MockModeBanner />}
      {displayError    && <AuthError message={displayError} />}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

        {/* Name row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "0.875rem", color: "#1A1208" }}>
              First name
            </label>
            <input
              type="text" value={form.firstName} onChange={set("firstName")}
              placeholder="Sarah" required autoComplete="given-name"
              style={authInputStyle} onFocus={focusStyle} onBlur={blurStyle}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "0.875rem", color: "#1A1208" }}>
              Last name
            </label>
            <input
              type="text" value={form.lastName} onChange={set("lastName")}
              placeholder="Mitchell" required autoComplete="family-name"
              style={authInputStyle} onFocus={focusStyle} onBlur={blurStyle}
            />
          </div>
        </div>

        {/* Email */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "0.875rem", color: "#1A1208" }}>
            Email address
          </label>
          <input
            type="email" value={form.email} onChange={set("email")}
            placeholder="sarah@example.com" required autoComplete="email"
            style={authInputStyle} onFocus={focusStyle} onBlur={blurStyle}
          />
        </div>

        {/* Phone — optional */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "0.875rem", color: "#1A1208" }}>
            Phone{" "}
            <span style={{ color: "#948A7D", fontWeight: 400 }}>(optional)</span>
          </label>
          <input
            type="tel" value={form.phone} onChange={set("phone")}
            placeholder="+44 7700 900000" autoComplete="tel"
            style={authInputStyle} onFocus={focusStyle} onBlur={blurStyle}
          />
        </div>

        {/* Password */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "0.875rem", color: "#1A1208" }}>
            Password
          </label>
          <input
            type="password" value={form.password} onChange={set("password")}
            placeholder="Min. 8 characters" required autoComplete="new-password"
            style={authInputStyle} onFocus={focusStyle} onBlur={blurStyle}
          />
        </div>

        {/* Confirm password */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "0.875rem", color: "#1A1208" }}>
            Confirm password
          </label>
          <input
            type="password" value={form.confirmPw} onChange={set("confirmPw")}
            placeholder="Repeat password" required autoComplete="new-password"
            style={authInputStyle} onFocus={focusStyle} onBlur={blurStyle}
          />
        </div>

        {/* Terms checkbox */}
        <label
          style={{
            display: "flex", alignItems: "flex-start", gap: "10px",
            cursor: "pointer", marginTop: "4px",
          }}
        >
          <div
            onClick={() => setAgreed((v) => !v)}
            role="checkbox"
            aria-checked={agreed}
            style={{
              width: "18px", height: "18px", borderRadius: "5px", flexShrink: 0,
              border: `2px solid ${agreed ? "#C8913A" : "rgba(226,216,194,0.8)"}`,
              background: agreed ? "#C8913A" : "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              marginTop: "1px", cursor: "pointer", transition: "all 0.15s",
            }}
          >
            {agreed && (
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2 5l2.5 2.5 4-4" stroke="#1A1208" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>
          <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.8125rem", color: "#7A6E60", lineHeight: 1.5 }}>
            I agree to the{" "}
            <Link href="/terms"   style={{ color: "#C8913A", textDecoration: "none" }}>Terms of Service</Link>{" "}
            and{" "}
            <Link href="/privacy" style={{ color: "#C8913A", textDecoration: "none" }}>Privacy Policy</Link>
          </span>
        </label>

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
            transition: "all 0.2s", marginTop: "4px",
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
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>
    </AuthCard>
  );
}
