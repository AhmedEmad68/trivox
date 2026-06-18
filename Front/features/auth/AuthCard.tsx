import Link from "next/link";

interface AuthCardProps {
  title:       string;
  subtitle:    string;
  children:    React.ReactNode;
  footer?:     React.ReactNode;
}

export function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F5F0E8",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 20px 40px",
      }}
    >
      {/* Card */}
      <div
        style={{
          width: "100%",
          maxWidth: "440px",
          background: "#fff",
          borderRadius: "24px",
          border: "1px solid rgba(226,216,194,0.6)",
          boxShadow: "0 8px 40px rgba(26,18,8,0.10)",
          overflow: "hidden",
        }}
      >
        {/* Header strip */}
        <div
          style={{
            background: "#1A1208",
            padding: "28px 32px 24px",
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              textDecoration: "none",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "8px",
                background: "rgba(200,145,58,0.2)",
                border: "1px solid rgba(200,145,58,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="5.5" stroke="rgba(200,145,58,0.4)" strokeWidth="1.2" />
                <path d="M7 2.5L8.2 6.5 7 5.8 5.8 6.5Z" fill="#C8913A" />
                <path d="M7 11.5L5.8 7.5 7 8.2 8.2 7.5Z" fill="rgba(253,252,250,0.25)" />
              </svg>
            </div>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.125rem",
                color: "#FDFCFA",
                letterSpacing: "-0.02em",
              }}
            >
              TriVox
            </span>
          </Link>

          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.625rem",
              color: "#FDFCFA",
              letterSpacing: "-0.025em",
              marginBottom: "6px",
            }}
          >
            {title}
          </h1>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.9375rem",
              color: "rgba(253,252,250,0.6)",
              lineHeight: 1.5,
            }}
          >
            {subtitle}
          </p>
        </div>

        {/* Content */}
        <div style={{ padding: "28px 32px" }}>{children}</div>

        {/* Footer */}
        {footer && (
          <div
            style={{
              padding: "16px 32px 24px",
              borderTop: "1px solid rgba(226,216,194,0.5)",
              textAlign: "center",
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Shared input style ────────────────────────────────────────── */
export const authInputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "12px",
  fontFamily: "var(--font-sans)",
  fontSize: "0.9375rem",
  color: "#1A1208",
  border: "1.5px solid rgba(226,216,194,0.8)",
  background: "#fff",
  outline: "none",
  transition: "border-color 0.15s, box-shadow 0.15s",
  boxSizing: "border-box",
};

export const authInputFocus = {
  borderColor: "#C8913A",
  boxShadow: "0 0 0 3px rgba(200,145,58,0.15)",
};

/* ─── Error banner ───────────────────────────────────────────────── */
export function AuthError({ message }: { message: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "12px 14px",
        borderRadius: "12px",
        background: "rgba(181,74,44,0.08)",
        border: "1px solid rgba(181,74,44,0.22)",
        marginBottom: "16px",
      }}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
        <circle cx="8" cy="8" r="6.5" stroke="#B54A2C" strokeWidth="1.3" />
        <path d="M8 5v3.5M8 10.5v.5" stroke="#B54A2C" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
      <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "#923A22" }}>
        {message}
      </p>
    </div>
  );
}
