"use client";

import { useState } from "react";
import Image from "next/image";

const TESTIMONIALS = [
  {
    id: 1,
    name:    "Sarah Mitchell",
    country: "United Kingdom",
    avatar:  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
    rating:  5,
    trip:    "Pyramids & Sphinx Full-Day Tour",
    date:    "March 2026",
    body:    "Absolutely phenomenal experience. Our guide Ahmed was a walking encyclopedia — his passion for Egyptology was infectious. The private vehicle pickup was seamless, and the pacing of the day was perfect. This is the only way to see the Pyramids.",
  },
  {
    id: 2,
    name:    "Thomas Brenner",
    country: "Germany",
    avatar:  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
    rating:  5,
    trip:    "Luxor Valley of the Kings Tour",
    date:    "February 2026",
    body:    "We did two tours through TriVox and both exceeded expectations. The booking was instant, the price was transparent, and our guide was genuinely wonderful. Luxor felt like a dream — I had no idea Egyptian history ran so deep.",
  },
  {
    id: 3,
    name:    "Yuki Tanaka",
    country: "Japan",
    avatar:  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80",
    rating:  5,
    trip:    "Egyptian Home Cooking Experience",
    date:    "March 2026",
    body:    "Cooking with Fatima's family was the highlight of my entire Egypt trip — more memorable than any monument. We made ful medames, koshari, and mahshi from scratch. The laughter, the warmth, the food — I will never forget it.",
  },
  {
    id: 4,
    name:    "Marco Rossi",
    country: "Italy",
    avatar:  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
    rating:  5,
    trip:    "Nile Felucca Sunset Sail",
    date:    "January 2026",
    body:    "The felucca at sunset in Aswan is pure magic. No engine noise, just wind and water and the sound of the Nile. Our captain was jovial and knowledgeable. Twenty euros for the most peaceful hour of my life.",
  },
];

function StarRow({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 14 14" fill={i < count ? "#C8913A" : "#EDE5D5"}>
          <path d="M7 1l1.545 3.13 3.455.5-2.5 2.44.59 3.43L7 8.885 3.91 10.5l.59-3.43L2 4.63l3.455-.5z"/>
        </svg>
      ))}
    </div>
  );
}

export function TestimonialsSection() {
  const [active, setActive] = useState(0);
  const current = TESTIMONIALS[active];

  return (
    <section className="section-padding" style={{ background: "#F5F0E8" }}>
      <div className="container-trivox">
        {/* Header */}
        <div className="section-ornament mb-14">
          <div className="divider-gold" />
          <p className="eyebrow mt-4">Real stories</p>
          <h2
            className="mt-2"
            style={{
              fontFamily: "var(--font-display)",
              color: "#1A1208",
              fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
              letterSpacing: "-0.025em",
            }}
          >
            Travellers love TriVox
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* Main testimonial */}
          <div
            className="lg:col-span-3 rounded-3xl p-8 sm:p-10"
            style={{
              background: "#fff",
              boxShadow: "0 4px 32px -4px rgba(26,18,8,0.1)",
              border: "1px solid rgba(226,216,194,0.6)",
            }}
          >
            {/* Quote mark */}
            <div
              className="mb-6"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "4rem",
                color: "#C8913A",
                lineHeight: 1,
                opacity: 0.4,
              }}
            >
              "
            </div>

            <StarRow count={current.rating} />

            <p
              className="mt-5 mb-8"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "clamp(1rem, 1.5vw, 1.125rem)",
                color: "#1A1208",
                lineHeight: 1.75,
              }}
            >
              {current.body}
            </p>

            {/* Author */}
            <div className="flex items-center gap-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0" style={{ border: "2px solid #EDE5D5" }}>
                <Image src={current.avatar} alt={current.name} fill className="object-cover" />
              </div>
              <div>
                <p style={{ fontFamily: "var(--font-sans)", fontWeight: 500, color: "#1A1208", fontSize: "0.9375rem" }}>
                  {current.name}
                </p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.8125rem", color: "#948A7D" }}>
                  {current.country} · {current.date}
                </p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "#C8913A", marginTop: "2px" }}>
                  {current.trip}
                </p>
              </div>
            </div>

            {/* Dot navigation */}
            <div className="flex gap-2 mt-8">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className="transition-all duration-200 rounded-full"
                  style={{
                    width: i === active ? "24px" : "8px",
                    height: "8px",
                    background: i === active ? "#C8913A" : "#E2D8C2",
                  }}
                  aria-label={`Testimonial ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Sidebar — other testimonials */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            {TESTIMONIALS.filter((_, i) => i !== active).map((t) => (
              <button
                key={t.id}
                onClick={() => setActive(TESTIMONIALS.indexOf(t))}
                className="text-left rounded-2xl p-5 transition-all duration-200 group"
                style={{
                  background: "#fff",
                  border: "1px solid rgba(226,216,194,0.6)",
                  boxShadow: "0 1px 4px rgba(26,18,8,0.05)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(200,145,58,0.3)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px -4px rgba(26,18,8,0.12)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(226,216,194,0.6)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 4px rgba(26,18,8,0.05)";
                }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="relative w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
                    <Image src={t.avatar} alt={t.name} fill className="object-cover" />
                  </div>
                  <div>
                    <p style={{ fontFamily: "var(--font-sans)", fontWeight: 500, color: "#1A1208", fontSize: "0.8125rem" }}>
                      {t.name}
                    </p>
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6875rem", color: "#948A7D" }}>
                      {t.country}
                    </p>
                  </div>
                  <div className="ml-auto">
                    <StarRow count={t.rating} />
                  </div>
                </div>
                <p
                  className="text-sm line-clamp-2"
                  style={{ fontFamily: "var(--font-sans)", color: "#7A6E60", lineHeight: 1.6 }}
                >
                  {t.body}
                </p>
              </button>
            ))}

            {/* Trust stat */}
            <div
              className="rounded-2xl p-5 flex items-center gap-4"
              style={{
                background: "rgba(200,145,58,0.08)",
                border: "1px solid rgba(200,145,58,0.15)",
              }}
            >
              <div>
                <p style={{ fontFamily: "var(--font-display)", color: "#C8913A", fontSize: "1.875rem", letterSpacing: "-0.02em" }}>
                  4.9★
                </p>
                <p style={{ fontFamily: "var(--font-sans)", color: "#7A6E60", fontSize: "0.75rem" }}>
                  from 2,400+ reviews
                </p>
              </div>
              <div style={{ width: "1px", height: "40px", background: "rgba(200,145,58,0.2)" }} />
              <div>
                <p style={{ fontFamily: "var(--font-sans)", color: "#1A1208", fontSize: "0.875rem", fontWeight: 500 }}>
                  Verified Tripadvisor
                </p>
                <p style={{ fontFamily: "var(--font-sans)", color: "#7A6E60", fontSize: "0.75rem" }}>
                  Certificate of Excellence
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
