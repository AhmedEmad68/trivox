"use client";

import Link from "next/link";

const CATEGORIES = [
  {
    type: "tour", href: "/trips?type=tour",
    label: "Tours", tagline: "Guided explorations",
    description: "Walk through millennia of history with expert local guides. From the Pyramids to the Valley of the Kings.",
    accent: "#C8913A", accentBg: "rgba(200,145,58,0.08)", accentBorder: "rgba(200,145,58,0.2)",
    cls: "cat-card-tour",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M14 4L4 20h20L14 4z" stroke="#C8913A" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M10 20v4h8v-4" stroke="#C8913A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="14" cy="13" r="2" stroke="#C8913A" strokeWidth="1.3"/>
      </svg>
    ),
    count: "90+ tours",
  },
  {
    type: "transfer", href: "/trips?type=transfer",
    label: "Transfers", tagline: "Seamless connections",
    description: "Private airport pickups, hotel transfers, and inter-city rides. Comfortable, punctual, stress-free.",
    accent: "#B54A2C", accentBg: "rgba(181,74,44,0.07)", accentBorder: "rgba(181,74,44,0.18)",
    cls: "cat-card-transfer",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="3" y="11" width="22" height="10" rx="2.5" stroke="#B54A2C" strokeWidth="1.5"/>
        <path d="M3 14l4-6h14l4 6" stroke="#B54A2C" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="9"  cy="21" r="2.5" stroke="#B54A2C" strokeWidth="1.5"/>
        <circle cx="19" cy="21" r="2.5" stroke="#B54A2C" strokeWidth="1.5"/>
      </svg>
    ),
    count: "40+ routes",
  },
  {
    type: "experience", href: "/trips?type=experience",
    label: "Experiences", tagline: "Live like a local",
    description: "Home cooking, souq walks, whirling dervish shows, calligraphy workshops — authentic cultural immersion.",
    accent: "#4A7C3F", accentBg: "rgba(74,124,63,0.07)", accentBorder: "rgba(74,124,63,0.18)",
    cls: "cat-card-experience",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M14 3C9 3 5 7 5 12c0 6 9 13 9 13s9-7 9-13c0-5-4-9-9-9z" stroke="#4A7C3F" strokeWidth="1.5"/>
        <circle cx="14" cy="12" r="3" stroke="#4A7C3F" strokeWidth="1.5"/>
      </svg>
    ),
    count: "50+ experiences",
  },
];

export function CategorySection() {
  return (
    <section className="section-padding" style={{ background: "#FDFCFA" }}>
      <style>{`
        .cat-card { background: #fff; transition: box-shadow 0.25s, transform 0.25s; }
        .cat-card:hover { transform: translateY(-4px); }
        .cat-card-tour:hover      { box-shadow: 0 12px 40px -6px rgba(26,18,8,0.14), 0 0 0 1px rgba(200,145,58,0.22); }
        .cat-card-transfer:hover  { box-shadow: 0 12px 40px -6px rgba(26,18,8,0.14), 0 0 0 1px rgba(181,74,44,0.2);  }
        .cat-card-experience:hover{ box-shadow: 0 12px 40px -6px rgba(26,18,8,0.14), 0 0 0 1px rgba(74,124,63,0.2);  }
        .cat-arrow { transition: gap 0.2s; display: flex; align-items: center; gap: 4px; }
        .cat-card:hover .cat-arrow { gap: 8px; }
      `}</style>

      <div className="container-trivox">
        <div className="section-ornament mb-12">
          <div className="divider-gold" />
          <p className="eyebrow mt-4">What we offer</p>
          <h2 className="mt-2" style={{ fontFamily: "var(--font-display)", color: "#1A1208", fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", letterSpacing: "-0.025em" }}>
            Every way to explore Egypt
          </h2>
          <p className="text-body max-w-md mt-2">
            Three distinct ways to experience the world&apos;s most storied destination.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.type}
              href={cat.href}
              className={`cat-card ${cat.cls} rounded-2xl p-7 flex flex-col gap-5`}
              style={{ border: `1px solid ${cat.accentBorder}`, boxShadow: "0 2px 12px -2px rgba(26,18,8,0.06)", textDecoration: "none" }}
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: cat.accentBg }}>
                {cat.icon}
              </div>

              <div className="flex flex-col gap-2 flex-1">
                <span style={{ fontSize: "0.6875rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.12em", color: cat.accent, fontFamily: "var(--font-sans)" }}>
                  {cat.tagline}
                </span>
                <h3 style={{ fontFamily: "var(--font-display)", color: "#1A1208", fontSize: "1.25rem", letterSpacing: "-0.02em" }}>
                  {cat.label}
                </h3>
                <p style={{ fontFamily: "var(--font-sans)", color: "#7A6E60", fontSize: "0.875rem", lineHeight: 1.65 }}>
                  {cat.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4" style={{ borderTop: `1px solid ${cat.accentBorder}` }}>
                <span style={{ fontSize: "0.75rem", color: "#948A7D", fontFamily: "var(--font-sans)" }}>{cat.count}</span>
                <span className="cat-arrow" style={{ fontSize: "0.875rem", fontWeight: 500, color: cat.accent, fontFamily: "var(--font-sans)" }}>
                  Browse
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
