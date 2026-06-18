import Image from "next/image";
import type { Experience } from "@/types";

export function ExperienceHost({ experience }: { experience: Experience }) {
  const { host, story, what_to_expect, what_to_bring } = experience;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

      {/* Story block */}
      {story && (
        <div style={{ background: "#FDFCFA", borderRadius: "20px", border: "1px solid rgba(226,216,194,0.5)", padding: "28px 28px 28px 36px", position: "relative", overflow: "hidden" }}>
          {/* Decorative quote mark */}
          <div style={{ position: "absolute", top: "12px", left: "16px", fontFamily: "var(--font-display)", fontSize: "4rem", color: "#C8913A", opacity: 0.2, lineHeight: 1, userSelect: "none" }}>"</div>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "1rem", color: "#1A1208", lineHeight: 1.8, fontStyle: "italic", position: "relative", zIndex: 1 }}>
            {story}
          </p>
        </div>
      )}

      {/* Host card */}
      <div style={{ background: "#fff", borderRadius: "20px", border: "1px solid rgba(226,216,194,0.6)", padding: "24px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "16px", marginBottom: host.bio ? "16px" : "0" }}>
          <div style={{ position: "relative", width: "64px", height: "64px", borderRadius: "50%", overflow: "hidden", flexShrink: 0, background: "#EDE5D5", border: "3px solid #fff", boxShadow: "0 0 0 2px rgba(200,145,58,0.2)" }}>
            <Image src={host.avatar} alt={host.name} fill className="object-cover" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", color: "#1A1208", letterSpacing: "-0.02em" }}>{host.name}</h3>
              {host.superhost && (
                <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "0.6875rem", fontWeight: 600, color: "#7D541A", background: "rgba(200,145,58,0.12)", border: "1px solid rgba(200,145,58,0.25)", borderRadius: "9999px", padding: "2px 8px", fontFamily: "var(--font-sans)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  ✦ Superhost
                </span>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "4px", flexWrap: "wrap" }}>
              {host.since && (
                <span style={{ fontSize: "0.8125rem", color: "#948A7D", fontFamily: "var(--font-sans)" }}>Hosting since {host.since}</span>
              )}
              <span style={{ fontSize: "0.8125rem", color: "#948A7D", fontFamily: "var(--font-sans)" }}>{host.reviews_count} reviews</span>
              {host.response_rate && (
                <span style={{ fontSize: "0.8125rem", color: "#4A7C3F", fontFamily: "var(--font-sans)", fontWeight: 500 }}>{host.response_rate}% response rate</span>
              )}
            </div>
            {host.languages && host.languages.length > 0 && (
              <div style={{ display: "flex", gap: "6px", marginTop: "8px", flexWrap: "wrap" }}>
                {host.languages.map((lang) => (
                  <span key={lang} style={{ fontSize: "0.6875rem", color: "#625849", background: "#F5F0E8", border: "1px solid rgba(226,216,194,0.8)", borderRadius: "6px", padding: "2px 8px", fontFamily: "var(--font-sans)" }}>
                    {lang}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {host.bio && (
          <p style={{ fontSize: "0.9375rem", color: "#7A6E60", fontFamily: "var(--font-sans)", lineHeight: 1.75 }}>
            {host.bio}
          </p>
        )}
      </div>

      {/* What to expect */}
      {what_to_expect && what_to_expect.length > 0 && (
        <div style={{ background: "#fff", borderRadius: "20px", border: "1px solid rgba(226,216,194,0.6)", padding: "24px" }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.125rem", color: "#1A1208", marginBottom: "16px", letterSpacing: "-0.01em" }}>What to expect</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {what_to_expect.map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "rgba(200,145,58,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "1px" }}>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2 2 4-4" stroke="#C8913A" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <p style={{ fontSize: "0.9375rem", color: "#1A1208", fontFamily: "var(--font-sans)", lineHeight: 1.6 }}>{item}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* What to bring */}
      {what_to_bring && what_to_bring.length > 0 && (
        <div style={{ background: "#F5F0E8", borderRadius: "16px", padding: "20px 24px" }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1rem", color: "#1A1208", marginBottom: "12px", letterSpacing: "-0.01em" }}>What to bring</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {what_to_bring.map((item, i) => (
              <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "0.875rem", color: "#625849", background: "#fff", border: "1px solid rgba(226,216,194,0.7)", borderRadius: "9999px", padding: "5px 12px", fontFamily: "var(--font-sans)" }}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><circle cx="5" cy="5" r="4" stroke="#C8913A" strokeWidth="1.2"/><path d="M3 5l1.5 1.5L7 3.5" stroke="#C8913A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                {item}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
