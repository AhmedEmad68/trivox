import Link from "next/link";

export default function NotFound() {
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
      {/* Decorative number */}
      <div style={{ position: "relative", marginBottom: "32px" }}>
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(6rem, 20vw, 10rem)",
            color: "#F5F0E8",
            letterSpacing: "-0.05em",
            lineHeight: 1,
            userSelect: "none",
          }}
        >
          404
        </p>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              background: "rgba(200,145,58,0.1)",
              border: "2px solid rgba(200,145,58,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path
                d="M14 3C9 3 5 7 5 12c0 6 9 13 9 13s9-7 9-13c0-5-4-9-9-9z"
                stroke="#C8913A"
                strokeWidth="1.5"
              />
              <circle cx="14" cy="12" r="3" stroke="#C8913A" strokeWidth="1.5" />
              <path
                d="M14 12L22 4"
                stroke="#C8913A"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeDasharray="2 2"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Heading */}
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
          color: "#1A1208",
          letterSpacing: "-0.03em",
          marginBottom: "12px",
        }}
      >
        This page got lost in the desert
      </h1>
      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "1.0625rem",
          color: "#7A6E60",
          lineHeight: 1.65,
          maxWidth: "420px",
          marginBottom: "36px",
        }}
      >
        The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
      </p>

      {/* Actions */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
        <Link
          href="/"
          style={{
            padding: "13px 28px",
            borderRadius: "14px",
            background: "#1A1208",
            color: "#FDFCFA",
            fontFamily: "var(--font-sans)",
            fontWeight: 600,
            fontSize: "0.9375rem",
            textDecoration: "none",
          }}
        >
          Go home
        </Link>
        <Link
          href="/trips"
          style={{
            padding: "13px 28px",
            borderRadius: "14px",
            border: "1.5px solid rgba(226,216,194,0.8)",
            background: "#fff",
            color: "#7A6E60",
            fontFamily: "var(--font-sans)",
            fontWeight: 500,
            fontSize: "0.9375rem",
            textDecoration: "none",
          }}
        >
          Browse trips
        </Link>
      </div>

      {/* Quick links */}
      <div
        style={{
          display: "flex",
          gap: "6px",
          marginTop: "40px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {[
          { href: "/trips?type=tour",       label: "Tours"        },
          { href: "/trips?type=transfer",   label: "Transfers"    },
          { href: "/trips?type=experience", label: "Experiences"  },
          { href: "/destinations",          label: "Destinations" },
        ].map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            style={{
              padding: "6px 14px",
              borderRadius: "9999px",
              background: "rgba(200,145,58,0.08)",
              color: "#7D541A",
              border: "1px solid rgba(200,145,58,0.2)",
              fontFamily: "var(--font-sans)",
              fontSize: "0.8125rem",
              fontWeight: 500,
              textDecoration: "none",
            }}
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
