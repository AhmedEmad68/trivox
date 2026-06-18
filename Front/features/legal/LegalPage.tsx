interface LegalPageProps {
  title:       string;
  lastUpdated: string;
  children:    React.ReactNode;
}

export function LegalPage({ title, lastUpdated, children }: LegalPageProps) {
  return (
    <div style={{ background: "#FDFCFA" }}>
      {/* Header */}
      <div style={{ background: "#1A1208", paddingTop: "calc(var(--navbar-height) + 2.5rem)", paddingBottom: "3rem" }}>
        <div className="container-trivox" style={{ maxWidth: "760px" }}>
          <h1 style={{ fontFamily: "var(--font-display)", color: "#FDFCFA", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", letterSpacing: "-0.03em", marginBottom: "8px" }}>
            {title}
          </h1>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "rgba(253,252,250,0.5)" }}>
            Last updated: {lastUpdated}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container-trivox section-padding" style={{ maxWidth: "760px" }}>
        <div
          style={{ display: "flex", flexDirection: "column", gap: "32px" }}
          className="legal-content"
        >
          <style>{`
            .legal-content h2 {
              font-family: var(--font-display);
              font-size: 1.25rem;
              color: #1A1208;
              letter-spacing: -0.015em;
              margin-top: 8px;
              margin-bottom: 12px;
            }
            .legal-content p {
              font-family: var(--font-sans);
              font-size: 1rem;
              color: #7A6E60;
              line-height: 1.8;
              margin-bottom: 10px;
            }
            .legal-content ul {
              padding-left: 20px;
              display: flex;
              flex-direction: column;
              gap: 6px;
            }
            .legal-content li {
              font-family: var(--font-sans);
              font-size: 0.9375rem;
              color: #7A6E60;
              line-height: 1.7;
            }
            .legal-content section {
              padding-bottom: 24px;
              border-bottom: 1px solid rgba(226,216,194,0.5);
            }
            .legal-content section:last-child {
              border-bottom: none;
            }
            .legal-content a {
              color: #C8913A;
              text-decoration: none;
            }
          `}</style>
          {children}
        </div>
      </div>
    </div>
  );
}
