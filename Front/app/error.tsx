"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to error tracking service in production
    console.error("TriVox app error:", error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        paddingTop: "var(--navbar-height)",
        paddingInline: "24px",
        background: "#FDFCFA",
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: "72px",
          height: "72px",
          borderRadius: "20px",
          background: "rgba(181,74,44,0.08)",
          border: "1px solid rgba(181,74,44,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "24px",
        }}
      >
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <circle cx="14" cy="14" r="11" stroke="#B54A2C" strokeWidth="1.5" />
          <path d="M14 9v6" stroke="#B54A2C" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="14" cy="18.5" r="1.2" fill="#B54A2C" />
        </svg>
      </div>

      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(1.5rem, 3vw, 2rem)",
          color: "#1A1208",
          letterSpacing: "-0.025em",
          marginBottom: "10px",
        }}
      >
        Something went wrong
      </h1>
      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "1rem",
          color: "#7A6E60",
          lineHeight: 1.65,
          maxWidth: "380px",
          marginBottom: "32px",
        }}
      >
        An unexpected error occurred. Our team has been notified. Please try again or contact support if the problem persists.
      </p>

      {/* Error digest for support */}
      {error.digest && (
        <p
          style={{
            fontFamily: "var(--font-mono, monospace)",
            fontSize: "0.75rem",
            color: "#948A7D",
            background: "#F5F0E8",
            padding: "6px 12px",
            borderRadius: "8px",
            marginBottom: "28px",
          }}
        >
          Error ID: {error.digest}
        </p>
      )}

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
        <button
          onClick={reset}
          style={{
            padding: "12px 28px",
            borderRadius: "12px",
            background: "#1A1208",
            color: "#FDFCFA",
            fontFamily: "var(--font-sans)",
            fontWeight: 600,
            fontSize: "0.9375rem",
            border: "none",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
        <a
          href="/"
          style={{
            padding: "12px 28px",
            borderRadius: "12px",
            border: "1.5px solid rgba(226,216,194,0.8)",
            background: "#fff",
            color: "#7A6E60",
            fontFamily: "var(--font-sans)",
            fontWeight: 500,
            fontSize: "0.9375rem",
            textDecoration: "none",
          }}
        >
          Go home
        </a>
      </div>
    </div>
  );
}
