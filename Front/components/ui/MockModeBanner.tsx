"use client";

import { useAuth } from "@/contexts/AuthContext";

export function MockModeBanner() {
  const { isMockMode } = useAuth();

  if (!isMockMode) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "16px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "10px 18px",
        borderRadius: "12px",
        background: "#1A1208",
        border: "1px solid rgba(200,145,58,0.4)",
        boxShadow: "0 4px 24px rgba(26,18,8,0.3)",
        whiteSpace: "nowrap",
      }}
    >
      {/* Pulsing dot */}
      <span
        style={{
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          background: "#C8913A",
          flexShrink: 0,
          animation: "mock-pulse 2s ease-in-out infinite",
        }}
      />
      <span
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "0.8125rem",
          fontWeight: 500,
          color: "#E0A040",
        }}
      >
        Dev mode — API offline. Auth is mocked locally.
      </span>
      <a
        href="https://docs.djangoproject.com/en/stable/intro/tutorial01/"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "0.75rem",
          color: "#948A7D",
          textDecoration: "none",
          borderLeft: "1px solid rgba(255,255,255,0.1)",
          paddingLeft: "10px",
          marginLeft: "4px",
        }}
      >
        Start Django →
      </a>
      <style>{`
        @keyframes mock-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
