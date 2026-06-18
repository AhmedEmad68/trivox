import type { TripBase } from "@/types";

export function IncludesExcludes({ trip }: { trip: TripBase }) {
  if (!trip.includes.length && !trip.excludes.length) return null;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
      {trip.includes.length > 0 && (
        <div>
          <h4 style={{ fontFamily: "var(--font-display)", fontSize: "1rem", color: "#1A1208", marginBottom: "12px", letterSpacing: "-0.01em" }}>
            Included
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {trip.includes.map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: "2px" }}>
                  <circle cx="8" cy="8" r="7" fill="rgba(74,124,63,0.12)"/>
                  <path d="M5 8l2.5 2.5 4.5-4.5" stroke="#4A7C3F" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span style={{ fontSize: "0.875rem", color: "#1A1208", fontFamily: "var(--font-sans)", lineHeight: 1.5 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {trip.excludes.length > 0 && (
        <div>
          <h4 style={{ fontFamily: "var(--font-display)", fontSize: "1rem", color: "#1A1208", marginBottom: "12px", letterSpacing: "-0.01em" }}>
            Not included
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {trip.excludes.map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: "2px" }}>
                  <circle cx="8" cy="8" r="7" fill="rgba(181,74,44,0.08)"/>
                  <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="#B54A2C" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
                <span style={{ fontSize: "0.875rem", color: "#7A6E60", fontFamily: "var(--font-sans)", lineHeight: 1.5 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
