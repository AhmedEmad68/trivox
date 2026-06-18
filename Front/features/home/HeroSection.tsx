"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// ─── DESTINATION QUICK-SELECT ─────────────────────────────────────
const DESTINATIONS = [
  { label: "Cairo",      value: "cairo",      emoji: "🏛️" },
  { label: "Luxor",      value: "luxor",      emoji: "🏺" },
  { label: "Aswan",      value: "aswan",      emoji: "⛵" },
  { label: "Alexandria", value: "alexandria", emoji: "🌊" },
  { label: "Hurghada",   value: "hurghada",   emoji: "🤿" },
  { label: "Sinai",      value: "sinai",      emoji: "🏔️" },
];

const TRIP_TYPES = [
  { label: "All",         value: "" },
  { label: "Tours",       value: "tour" },
  { label: "Transfers",   value: "transfer" },
  { label: "Experiences", value: "experience" },
];

// ─── HERO STATS ───────────────────────────────────────────────────
const STATS = [
  { value: "12,000+", label: "Happy travellers" },
  { value: "4.9★",    label: "Average rating" },
  { value: "180+",    label: "Curated trips" },
  { value: "24/7",    label: "Customer support" },
];

// ─── ANIMATED COUNTER ─────────────────────────────────────────────
// (simple – just renders static for SSR safety)
function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span
        className="font-display text-2xl sm:text-3xl"
        style={{ color: "#C8913A", letterSpacing: "-0.02em" }}
      >
        {value}
      </span>
      <span className="text-xs sm:text-sm" style={{ color: "rgba(253,252,250,0.65)" }}>
        {label}
      </span>
    </div>
  );
}

// ─── SEARCH BAR ───────────────────────────────────────────────────
function HeroSearch() {
  const router = useRouter();
  const [destination, setDestination] = useState("");
  const [type,        setType]        = useState("");
  const [date,        setDate]        = useState("");
  const [destOpen, setDestOpen] = useState(false);
  const destRef = useRef<HTMLDivElement>(null);

  // Close destination dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (destRef.current && !destRef.current.contains(e.target as Node)) setDestOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (destination) params.set("location", destination);
    if (type)        params.set("type", type);
    if (date)        params.set("date", date);
    router.push(`/trips${params.toString() ? `?${params}` : ""}`);
  };

  const selectedDest = DESTINATIONS.find((d) => d.value === destination);

  return (
    <div
      className="w-full max-w-3xl mx-auto rounded-2xl overflow-visible"
      style={{
        background: "rgba(255,255,255,0.97)",
        boxShadow: "0 20px 60px -10px rgba(26,18,8,0.35), 0 4px 16px -4px rgba(26,18,8,0.2)",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Tab strip */}
      <div
        className="flex border-b"
        style={{ borderColor: "rgba(226,216,194,0.6)" }}
      >
        {TRIP_TYPES.map((t) => (
          <button
            key={t.value}
            onClick={() => setType(t.value)}
            className="flex-1 py-3 text-xs font-medium tracking-wide uppercase transition-all duration-150"
            style={{
              color: type === t.value ? "#C8913A" : "#948A7D",
              borderBottom: type === t.value ? "2px solid #C8913A" : "2px solid transparent",
              fontFamily: "var(--font-sans)",
              letterSpacing: "0.08em",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Fields row */}
      <div className="flex flex-col sm:flex-row">
        {/* Destination */}
        <div
          ref={destRef}
          className="relative flex-1 border-b sm:border-b-0 sm:border-r"
          style={{ borderColor: "rgba(226,216,194,0.5)" }}
        >
          <button
            onClick={() => setDestOpen(!destOpen)}
            className="w-full text-left px-5 py-4 transition-colors"
          >
            <span
              className="block text-xs uppercase tracking-widest font-medium mb-1"
              style={{ color: "#C8913A", fontFamily: "var(--font-sans)" }}
            >
              Where to
            </span>
            <span
              className="text-sm font-medium"
              style={{ color: destination ? "#1A1208" : "#948A7D", fontFamily: "var(--font-sans)" }}
            >
              {selectedDest ? `${selectedDest.emoji} ${selectedDest.label}` : "Choose destination"}
            </span>
          </button>

          {/* Destination dropdown */}
          {destOpen && (
            <div
              className="absolute top-full left-0 right-0 z-50 rounded-xl mt-1"
              style={{
                background: "#FDFCFA",
                boxShadow: "0 8px 40px -4px rgba(26,18,8,0.32), 0 2px 8px rgba(26,18,8,0.12)",
                border: "1px solid rgba(200,145,58,0.25)",
                overflowY: "auto",
                maxHeight: "260px",
              }}
            >
              {DESTINATIONS.map((d) => (
                <button
                  key={d.value}
                  onClick={() => { setDestination(d.value); setDestOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors"
                  style={{
                    fontFamily: "var(--font-sans)",
                    color: destination === d.value ? "#C8913A" : "#1A1208",
                    background: destination === d.value ? "rgba(200,145,58,0.07)" : "transparent",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(200,145,58,0.06)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = destination === d.value ? "rgba(200,145,58,0.07)" : "transparent"; }}
                >
                  <span className="text-base">{d.emoji}</span>
                  <span className="font-medium">{d.label}</span>
                  {destination === d.value && (
                    <svg className="ml-auto" width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2.5 7l3 3 6-6" stroke="#C8913A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Date */}
        <div
          className="relative flex-1 border-b sm:border-b-0 sm:border-r"
          style={{ borderColor: "rgba(226,216,194,0.5)" }}
        >
          <div className="px-5 py-4">
            <span
              className="block text-xs uppercase tracking-widest font-medium mb-1"
              style={{ color: "#C8913A", fontFamily: "var(--font-sans)" }}
            >
              When
            </span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="w-full bg-transparent text-sm font-medium outline-none"
              style={{
                color: date ? "#1A1208" : "#948A7D",
                fontFamily: "var(--font-sans)",
                border: "none",
              }}
            />
          </div>
        </div>

        {/* Search button */}
        <div className="flex items-center px-4 py-3">
          <button
            onClick={handleSearch}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200"
            style={{
              background: "#1A1208",
              color: "#FDFCFA",
              fontFamily: "var(--font-sans)",
              boxShadow: "0 4px 16px -2px rgba(26,18,8,0.35)",
              letterSpacing: "0.01em",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#2A1C0A"; (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#1A1208"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
          >
            <SearchIcon />
            <span>Search</span>
          </button>
        </div>
      </div>

      {/* Quick picks */}
      <div
        className="px-5 py-3 flex items-center gap-2 flex-wrap border-t"
        style={{ borderColor: "rgba(226,216,194,0.4)" }}
      >
        <span className="text-xs" style={{ color: "#948A7D", fontFamily: "var(--font-sans)" }}>
          Popular:
        </span>
        {DESTINATIONS.slice(0, 4).map((d) => (
          <button
            key={d.value}
            onClick={() => setDestination(d.value)}
            className="text-xs px-2.5 py-1 rounded-full transition-all duration-150"
            style={{
              fontFamily: "var(--font-sans)",
              background: destination === d.value ? "rgba(200,145,58,0.12)" : "rgba(26,18,8,0.04)",
              color: destination === d.value ? "#7D541A" : "#625849",
              border: `1px solid ${destination === d.value ? "rgba(200,145,58,0.25)" : "rgba(26,18,8,0.08)"}`,
            }}
          >
            {d.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── HERO SECTION ─────────────────────────────────────────────────
export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col" style={{ zIndex: 10, isolation: "isolate" }}>
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1539768942893-daf53e448371?w=1920&q=85"
          alt="The Great Pyramids of Giza at golden hour"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        {/* Multi-layer overlay for depth */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(26,18,8,0.55) 0%, rgba(26,18,8,0.3) 30%, rgba(26,18,8,0.35) 60%, rgba(26,18,8,0.82) 100%)" }} />
        {/* Subtle warm tint */}
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 60% 40%, rgba(200,145,58,0.12) 0%, transparent 70%)" }} />
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-start pb-12 sm:pb-16"
        style={{ paddingTop: "calc(var(--navbar-height) + 3rem)" }}>
        <div className="container-trivox">
          {/* Eyebrow */}
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 animate-fade-up"
            style={{
              background: "rgba(200,145,58,0.2)",
              border: "1px solid rgba(200,145,58,0.35)",
              backdropFilter: "blur(8px)",
            }}
          >
            <span style={{ color: "#E0A040", fontSize: "0.6875rem", fontFamily: "var(--font-sans)", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              ✦ Egypt & Beyond
            </span>
          </div>

          {/* Headline */}
          <h1
            className="animate-fade-up stagger-1 mb-4"
            style={{
              fontFamily: "var(--font-display)",
              color: "#FDFCFA",
              fontSize: "clamp(2.5rem, 6vw, 5rem)",
              lineHeight: 1.06,
              letterSpacing: "-0.03em",
              maxWidth: "16ch",
            }}
          >
            Every journey
            <br />
            <em style={{ color: "#C8913A" }}>tells a story.</em>
          </h1>

          {/* Sub-headline */}
          <p
            className="animate-fade-up stagger-2 mb-10 max-w-lg"
            style={{
              fontFamily: "var(--font-sans)",
              color: "rgba(253,252,250,0.75)",
              fontSize: "clamp(1rem, 2vw, 1.125rem)",
              lineHeight: 1.65,
            }}
          >
            Handpicked tours, transfers, and cultural experiences across Egypt —
            crafted for curious travellers from around the world.
          </p>

          {/* Search */}
          <div className="animate-fade-up stagger-3" style={{ position: "relative", zIndex: 20 }}>
            <HeroSearch />
          </div>

          {/* Stats bar */}
          <div
            className="mt-10 animate-fade-up stagger-4 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl"
            style={{ position: "relative", zIndex: 1 }}
          >
            {STATS.map((s) => (
              <Stat key={s.label} value={s.value} label={s.label} />
            ))}
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div
        className="relative z-10 flex flex-col items-center gap-2 pb-6 animate-bounce"
        style={{ opacity: 0.6 }}
      >
        <span style={{ fontSize: "0.625rem", color: "#FDFCFA", letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "var(--font-sans)" }}>
          Scroll
        </span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M4 6l4 4 4-4" stroke="#FDFCFA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </section>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
