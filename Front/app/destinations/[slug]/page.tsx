import type { Metadata } from "next";
import Link  from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { locationsService, type LocationDetail } from "@/services/api/locations";

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

export async function generateStaticParams() {
  try {
    const locations = await locationsService.list();
    return locations.map((l) => ({ slug: l.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const dest = await locationsService.detail(slug);
    return {
      title:       `${dest.name} Tours & Experiences — TriVox Travel`,
      description: dest.description,
      openGraph: {
        title:       `${dest.name} — ${dest.subtitle}`,
        description: dest.description,
        images:      [{ url: dest.hero_image, width: 1600, height: 900, alt: dest.name }],
      },
    };
  } catch {
    return { title: "Destination not found — TriVox" };
  }
}

export default async function DestinationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let dest: LocationDetail;
  try {
    dest = await locationsService.detail(slug);
  } catch {
    notFound();
  }

  const accent = ACCENT[dest.slug] ?? "#C8913A";

  return (
    <div style={{ background: "#FDFCFA" }}>
      {/* Hero */}
      <div style={{ position: "relative", height: "clamp(320px, 55vh, 520px)" }}>
        <Image
          src={dest.hero_image || dest.cover_image}
          alt={dest.name}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div
          style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to bottom, rgba(26,18,8,0.2) 0%, rgba(26,18,8,0.6) 70%, rgba(26,18,8,0.9) 100%)",
          }}
        />
        <div className="container-trivox" style={{ position: "absolute", bottom: "40px", left: 0, right: 0 }}>
          <Link
            href="/destinations"
            style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontFamily: "var(--font-sans)", fontSize: "0.8125rem", color: "rgba(253,252,250,0.7)", textDecoration: "none", marginBottom: "12px" }}
          >
            ← All destinations
          </Link>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6875rem", fontWeight: 600, color: accent, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "8px" }}>
            {dest.subtitle}
          </p>
          <h1 style={{ fontFamily: "var(--font-display)", color: "#FDFCFA", fontSize: "clamp(2.5rem, 6vw, 4rem)", letterSpacing: "-0.03em", lineHeight: 1.05 }}>
            {dest.name}
          </h1>
        </div>
      </div>

      <div className="container-trivox section-padding">
        <div style={{ display: "grid", gap: "48px", alignItems: "start" }} className="lg:grid-cols-[1fr_320px]">

          {/* Left — content */}
          <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>

            {/* Long description */}
            <div>
              <div className="divider-gold" style={{ marginBottom: "20px" }} />
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {(dest.long_description || dest.description).split("\n\n").map((para, i) => (
                  <p key={i} style={{ fontFamily: "var(--font-sans)", fontSize: "1.0625rem", color: "#1A1208", lineHeight: 1.8 }}>
                    {para}
                  </p>
                ))}
              </div>
            </div>

            {/* Highlights grid */}
            {dest.highlights.length > 0 && (
              <div>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", color: "#1A1208", letterSpacing: "-0.02em", marginBottom: "20px" }}>
                  Top highlights
                </h2>
                <div style={{ display: "grid", gap: "12px" }} className="sm:grid-cols-2">
                  {dest.highlights.map((h) => (
                    <div
                      key={h.label}
                      style={{ display: "flex", alignItems: "flex-start", gap: "14px", padding: "16px", background: "#fff", borderRadius: "16px", border: "1px solid rgba(226,216,194,0.6)" }}
                    >
                      <span style={{ fontSize: "1.5rem", flexShrink: 0, lineHeight: 1 }}>{h.icon}</span>
                      <div>
                        <p style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "0.9375rem", color: "#1A1208", marginBottom: "3px" }}>
                          {h.label}
                        </p>
                        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.8125rem", color: "#7A6E60", lineHeight: 1.5 }}>
                          {h.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA banner */}
            <div
              style={{
                padding: "28px 32px", background: "#1A1208", borderRadius: "20px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                gap: "20px", flexWrap: "wrap",
              }}
            >
              <div>
                <p style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", color: "#FDFCFA", letterSpacing: "-0.02em", marginBottom: "4px" }}>
                  Ready to explore {dest.name}?
                </p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "#7A6E60" }}>
                  {dest.trip_count} curated tours, transfers & experiences.
                </p>
              </div>
              <Link
                href={`/trips?location=${dest.slug}`}
                style={{ padding: "12px 24px", borderRadius: "12px", background: "#C8913A", color: "#1A1208", fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "0.9375rem", textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0 }}
              >
                Browse {dest.trip_count} trips →
              </Link>
            </div>
          </div>

          {/* Right — quick facts */}
          <div style={{ position: "sticky", top: "calc(var(--navbar-height) + 24px)" }}>
            <div style={{ background: "#fff", borderRadius: "20px", border: "1px solid rgba(226,216,194,0.6)", overflow: "hidden", boxShadow: "0 4px 24px rgba(26,18,8,0.07)" }}>
              <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(226,216,194,0.5)" }}>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.125rem", color: "#1A1208", letterSpacing: "-0.01em" }}>
                  Quick facts
                </h3>
              </div>
              <div style={{ padding: "6px 0" }}>
                {[
                  { icon: "📅", label: "Best time", value: dest.best_time },
                  { icon: "🗣️", label: "Language",  value: dest.language },
                  { icon: "💰", label: "Currency",  value: dest.currency },
                  { icon: "🕐", label: "Time zone", value: dest.timezone },
                  { icon: "✈️", label: "Trips",     value: `${dest.trip_count} available` },
                ].map(({ icon, label, value }) => (
                  <div key={label} style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "13px 24px", borderBottom: "1px solid rgba(226,216,194,0.4)" }}>
                    <span style={{ fontSize: "1rem", flexShrink: 0 }}>{icon}</span>
                    <div>
                      <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6875rem", color: "#948A7D", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 500, marginBottom: "2px" }}>
                        {label}
                      </p>
                      <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.9375rem", color: "#1A1208", fontWeight: 500 }}>
                        {value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ padding: "16px 24px" }}>
                <Link
                  href={`/trips?location=${dest.slug}`}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "13px", borderRadius: "12px", background: "#1A1208", color: "#FDFCFA", fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "0.9375rem", textDecoration: "none" }}
                >
                  See all {dest.name} trips
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
