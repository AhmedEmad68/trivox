import type { Metadata } from "next";
import Link  from "next/link";
import Image from "next/image";
import { locationsService, type LocationListItem } from "@/services/api/locations";

// Live backend data — render at request time so the build doesn't depend on
// the backend and never bakes stale fallback data into static HTML.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title:       "Destinations — Discover Egypt | TriVox Travel",
  description: "Explore Cairo, Luxor, Aswan, Alexandria, Hurghada and more. Find tours, transfers and experiences for every Egyptian destination.",
};

const ACCENT: Record<string, string> = {
  cairo:      "#C8913A",
  giza:       "#B54A2C",
  luxor:      "#B54A2C",
  aswan:      "#4A7C3F",
  alexandria: "#1A1208",
  hurghada:   "#C8913A",
  sinai:      "#B54A2C",
  siwa:       "#4A7C3F",
};

export default async function DestinationsPage() {
  let destinations: LocationListItem[] = [];
  try {
    destinations = await locationsService.list();
  } catch {
    // backend offline — render empty state gracefully
  }

  return (
    <div style={{ background: "#FDFCFA" }}>
      {/* Hero */}
      <div
        style={{
          background: "#1A1208",
          paddingTop: "calc(var(--navbar-height) + 3rem)",
          paddingBottom: "4rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 50% at 50% 60%, rgba(200,145,58,0.08) 0%, transparent 70%)" }}
        />
        <div className="container-trivox relative z-10">
          <p className="eyebrow" style={{ color: "rgba(200,145,58,0.75)", marginBottom: "10px" }}>
            Explore Egypt
          </p>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              color: "#FDFCFA",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              letterSpacing: "-0.035em",
              lineHeight: 1.1,
              maxWidth: "16ch",
              marginBottom: "16px",
            }}
          >
            Where will your journey begin?
          </h1>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              color: "rgba(253,252,250,0.65)",
              fontSize: "1.0625rem",
              lineHeight: 1.7,
              maxWidth: "500px",
            }}
          >
            From ancient temples to coral reefs, Egypt's destinations are as
            varied as they are extraordinary.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="container-trivox section-padding">
        {destinations.length === 0 ? (
          <p style={{ fontFamily: "var(--font-sans)", color: "#948A7D", textAlign: "center", padding: "4rem 0" }}>
            Destinations unavailable — please try again later.
          </p>
        ) : (
          <div
            style={{ display: "grid", gap: "24px" }}
            className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          >
            {destinations.map((dest, i) => {
              const accent = ACCENT[dest.slug] ?? "#C8913A";
              return (
                <Link
                  key={dest.slug}
                  href={`/destinations/${dest.slug}`}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    background: "#fff",
                    borderRadius: "20px",
                    overflow: "hidden",
                    border: "1px solid rgba(226,216,194,0.6)",
                    textDecoration: "none",
                    boxShadow: "0 2px 12px rgba(26,18,8,0.05)",
                    transition: "box-shadow 0.25s, transform 0.25s",
                  }}
                  className="dest-listing-card"
                >
                  <style>{`.dest-listing-card:hover { box-shadow: 0 10px 36px rgba(26,18,8,0.13); transform: translateY(-3px); } .dest-listing-card:hover .dest-listing-img { transform: scale(1.06); }`}</style>

                  {/* Image */}
                  <div style={{ position: "relative", height: "220px", overflow: "hidden" }}>
                    <Image
                      src={dest.cover_image}
                      alt={dest.name}
                      fill
                      className="dest-listing-img object-cover"
                      style={{ transition: "transform 0.6s cubic-bezier(0.4,0,0.2,1)" }}
                      sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                      priority={i < 3}
                    />
                    <div
                      style={{
                        position: "absolute", inset: 0,
                        background: "linear-gradient(to bottom, transparent 40%, rgba(26,18,8,0.75) 100%)",
                      }}
                    />
                    {/* Trip count pill */}
                    <div
                      style={{
                        position: "absolute", top: "12px", right: "12px",
                        padding: "4px 10px", borderRadius: "9999px",
                        background: "rgba(26,18,8,0.6)", backdropFilter: "blur(8px)",
                      }}
                    >
                      <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.6875rem", fontWeight: 500, color: "#E0A040", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                        {dest.trip_count} trips
                      </span>
                    </div>
                    {/* Name overlay */}
                    <div style={{ position: "absolute", bottom: "12px", left: "16px" }}>
                      <p style={{ fontFamily: "var(--font-display)", color: "#FDFCFA", fontSize: "1.5rem", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
                        {dest.name}
                      </p>
                    </div>
                  </div>

                  {/* Content */}
                  <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div>
                      <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6875rem", fontWeight: 600, color: accent, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "6px" }}>
                        {dest.subtitle}
                      </p>
                      <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "#7A6E60", lineHeight: 1.65 }}>
                        {dest.description}
                      </p>
                    </div>

                    {/* Highlights */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {dest.highlights.map((h) => (
                        <span
                          key={h.label}
                          style={{
                            padding: "3px 9px", borderRadius: "9999px",
                            background: "#F5F0E8", border: "1px solid rgba(226,216,194,0.7)",
                            fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "#625849",
                          }}
                        >
                          {h.label}
                        </span>
                      ))}
                    </div>

                    {/* Climate + CTA */}
                    <div
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        marginTop: "auto", paddingTop: "12px",
                        borderTop: "1px solid rgba(226,216,194,0.5)", gap: "10px",
                      }}
                    >
                      <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "#948A7D" }}>
                        🌡 {dest.climate}
                      </span>
                      <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.8125rem", fontWeight: 500, color: accent, whiteSpace: "nowrap" }}>
                        Explore →
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
