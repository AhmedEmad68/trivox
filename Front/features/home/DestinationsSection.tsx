import Link  from "next/link";
import Image from "next/image";
import { locationsService, type LocationListItem } from "@/services/api/locations";

// ─── Fallback data ────────────────────────────────────────────────────
// Used only when the Django API is unreachable at build/render time so the
// home page never goes blank. Once the API is up, real records (with their
// uploaded cover images) take over automatically.
const FALLBACK: DestCard[] = [
  { slug: "cairo",      name: "Cairo",      highlight: "Citadel · Museums · Souqs",
    cover_image: "https://images.unsplash.com/photo-1553601538-9b57d1e92e6a?w=800&q=80", trip_count: 68 },
  { slug: "giza",       name: "Giza",       highlight: "Pyramids · Sphinx · Saqqara",
    cover_image: "https://images.unsplash.com/photo-1539768942893-daf53e448371?w=800&q=80", trip_count: 15 },
  { slug: "siwa",       name: "Siwa Oasis", highlight: "Oracle · Salt Lakes · Dunes",
    cover_image: "https://images.unsplash.com/photo-1527736947477-2790e28f3443?w=800&q=80", trip_count: 8 },
  { slug: "luxor",      name: "Luxor",      highlight: "Karnak · Valley of Kings · Temples",
    cover_image: "https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=800&q=80", trip_count: 34 },
  { slug: "aswan",      name: "Aswan",      highlight: "Abu Simbel · Nile · Feluccas",
    cover_image: "https://images.unsplash.com/photo-1569366543622-f46aac5ab1a2?w=800&q=80", trip_count: 22 },
  { slug: "alexandria", name: "Alexandria", highlight: "Library · Citadel · Beaches",
    cover_image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80", trip_count: 18 },
  { slug: "hurghada",   name: "Hurghada",   highlight: "Snorkelling · Diving · Desert",
    cover_image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80", trip_count: 24 },
];

interface DestCard {
  slug:        string;
  name:        string;
  highlight:   string;
  cover_image: string;
  trip_count:  number;
}

function toCard(loc: LocationListItem): DestCard {
  const labels = (loc.highlights ?? []).map((h) => h.label).filter(Boolean).slice(0, 3);
  const highlight = labels.length > 0
    ? labels.join(" · ")
    : (loc.subtitle || loc.description || "");
  return {
    slug:        loc.slug,
    name:        loc.name,
    highlight,
    cover_image: loc.cover_image,
    trip_count:  loc.trip_count,
  };
}

export async function DestinationsSection() {
  let destinations: DestCard[];
  try {
    const apiData = await locationsService.list();
    // Show up to 7 — the bento grid is sized for one large + six smalls.
    // Order in admin (Location.order) controls which destinations appear.
    destinations = apiData.slice(0, 7).map(toCard);
    if (destinations.length === 0) destinations = FALLBACK;
  } catch {
    destinations = FALLBACK;
  }

  return (
    <section className="section-padding" style={{ background: "#FDFCFA" }}>
      <style>{`
        .dest-card { overflow: hidden; border-radius: 16px; position: relative; display: block; text-decoration: none; }
        .dest-img { transition: transform 0.7s cubic-bezier(0.4,0,0.2,1); }
        .dest-card:hover .dest-img { transform: scale(1.06); }
        .dest-explore { opacity: 0; transform: translateY(8px); transition: opacity 0.3s, transform 0.3s; display: flex; align-items: center; gap: 6px; margin-top: 10px; }
        .dest-card:hover .dest-explore { opacity: 1; transform: translateY(0); }
        .dest-tint { position: absolute; inset: 0; background: rgba(200,145,58,0); transition: background 0.3s; }
        .dest-card:hover .dest-tint { background: rgba(200,145,58,0.1); }
      `}</style>

      <div className="container-trivox">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <div className="divider-gold mb-4" />
            <p className="eyebrow mb-2">Top destinations</p>
            <h2 style={{ fontFamily: "var(--font-display)", color: "#1A1208", fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", letterSpacing: "-0.025em" }}>
              Where will you go?
            </h2>
          </div>
          <Link href="/destinations" style={{ display: "none", alignItems: "center", gap: "6px", fontSize: "0.875rem", fontWeight: 500, color: "#C8913A", fontFamily: "var(--font-sans)", textDecoration: "none" }} className="hidden sm:flex">
            All destinations
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
        </div>

        {/*
          4-column bento grid:
          Row 1+2: first dest spans cols 1–3 (large hero), 2nd in col 4 row 1, 3rd in col 4 row 2
          Row 3:   remaining destinations fill the bottom row equally
          Order is driven by Location.order in Django admin.
        */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gridTemplateRows: "240px 240px", gap: "12px" }}>
          {destinations.map((dest, i) => {
            const large = i === 0;
            return (
              <Link
                key={dest.slug}
                href={`/destinations/${dest.slug}`}
                className="dest-card"
                style={large ? { gridColumn: "1 / 4", gridRow: "1 / 3" } : {}}
              >
                <Image
                  src={dest.cover_image}
                  alt={dest.name}
                  fill
                  sizes={large ? "(max-width:1024px) 75vw, 700px" : "(max-width:1024px) 25vw, 280px"}
                  className="dest-img object-cover"
                  priority={i === 0}
                />
                <div className="dest-tint" />
                {/* Gradient */}
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(26,18,8,0.04) 0%, rgba(26,18,8,0.55) 60%, rgba(26,18,8,0.88) 100%)" }} />

                {/* Content */}
                <div style={{ position: "absolute", bottom: 0, insetInline: 0, padding: large ? "24px" : "16px" }}>
                  <div style={{ display: "inline-flex", alignItems: "center", marginBottom: "6px", padding: "3px 10px", borderRadius: "9999px", background: "rgba(200,145,58,0.25)", border: "1px solid rgba(200,145,58,0.4)" }}>
                    <span style={{ fontSize: "0.625rem", color: "#E0A040", fontFamily: "var(--font-sans)", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                      {dest.trip_count} trips
                    </span>
                  </div>
                  <h3 style={{ fontFamily: "var(--font-display)", color: "#FDFCFA", fontSize: large ? "1.875rem" : "1.125rem", letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: "4px" }}>
                    {dest.name}
                  </h3>
                  <p style={{ fontSize: "0.75rem", color: "rgba(253,252,250,0.7)", fontFamily: "var(--font-sans)" }}>
                    {dest.highlight}
                  </p>
                  <div className="dest-explore" style={{ color: "#E0A040" }}>
                    <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-sans)", fontWeight: 500 }}>Explore</span>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="flex justify-center mt-8 sm:hidden">
          <Link href="/destinations" className="btn-outline btn btn-lg">All destinations</Link>
        </div>
      </div>
    </section>
  );
}
