"use client";

import React from "react";

const STEPS = [
  {
    title: "Find your trip",
    body:  "Browse 180+ curated tours, transfers, and cultural experiences. Filter by destination, budget, and travel style.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="14" cy="14" r="8.5" stroke="#C8913A" strokeWidth="1.5"/>
        <path d="M20.5 20.5L28 28" stroke="#C8913A" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M10 14h8M14 10v8" stroke="#C8913A" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    title: "Book with confidence",
    body:  "Secure your spot instantly. Free cancellation on most trips, transparent pricing — no surprises.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="4" y="6" width="24" height="20" rx="3" stroke="#C8913A" strokeWidth="1.5"/>
        <path d="M4 12h24" stroke="#C8913A" strokeWidth="1.5"/>
        <path d="M10 18l3 3 9-7" stroke="#C8913A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10 8V4M22 8V4" stroke="#C8913A" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    title: "Experience the journey",
    body:  "Your guide meets you at the agreed point. Everything is arranged — just show up and immerse yourself fully.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M16 4C10.477 4 6 8.477 6 14c0 7.732 10 14 10 14s10-6.268 10-14c0-5.523-4.477-10-10-10z" stroke="#C8913A" strokeWidth="1.5"/>
        <circle cx="16" cy="14" r="3.5" stroke="#C8913A" strokeWidth="1.5"/>
      </svg>
    ),
  },
];

function ArrowRight() {
  return (
    <svg width="52" height="20" viewBox="0 0 52 20" fill="none">
      <line x1="0" y1="10" x2="38" y2="10" stroke="#C8913A" strokeWidth="1.2" strokeDasharray="4 3" opacity="0.45"/>
      <path d="M36 5l10 5-10 5" stroke="#C8913A" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" opacity="0.65"/>
    </svg>
  );
}

function ArrowDown() {
  return (
    <svg width="20" height="48" viewBox="0 0 20 48" fill="none">
      <line x1="10" y1="0" x2="10" y2="34" stroke="#C8913A" strokeWidth="1.2" strokeDasharray="4 3" opacity="0.45"/>
      <path d="M5 32l5 10 5-10" stroke="#C8913A" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" opacity="0.65"/>
    </svg>
  );
}

export function HowItWorksSection() {
  return (
    <section
      className="section-padding relative overflow-hidden"
      style={{ background: "#1A1208" }}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(200,145,58,0.07) 0%, transparent 70%)" }}
      />

      <div className="container-trivox relative z-10">
        <div className="section-ornament mb-14">
          <div className="divider-gold" />
          <p className="eyebrow mt-4">Simple process</p>
          <h2 className="mt-2" style={{ fontFamily: "var(--font-display)", color: "#FDFCFA", fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", letterSpacing: "-0.025em" }}>
            How TriVox works
          </h2>
          <p className="mt-2 max-w-md" style={{ color: "rgba(253,252,250,0.6)", fontFamily: "var(--font-sans)", lineHeight: 1.65 }}>
            Planning your Egyptian adventure is simple. Three steps stand between you and the journey of a lifetime.
          </p>
        </div>

        {/* Steps + connectors */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-center gap-0">
          {STEPS.map((step, i) => (
            <React.Fragment key={step.title}>
              {/* Step card */}
              <div className="flex flex-col items-center text-center gap-5 md:flex-1 md:max-w-xs">
                <div className="relative">
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center"
                    style={{ background: "rgba(200,145,58,0.1)", border: "1px solid rgba(200,145,58,0.2)" }}
                  >
                    {step.icon}
                  </div>
                  <div
                    className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ background: "#C8913A", fontSize: "0.6875rem", fontWeight: 600, color: "#1A1208", fontFamily: "var(--font-sans)" }}
                  >
                    {i + 1}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <h3 style={{ fontFamily: "var(--font-display)", color: "#FDFCFA", fontSize: "1.25rem", letterSpacing: "-0.02em" }}>
                    {step.title}
                  </h3>
                  <p style={{ fontSize: "0.875rem", color: "rgba(253,252,250,0.6)", fontFamily: "var(--font-sans)", lineHeight: 1.7 }}>
                    {step.body}
                  </p>
                </div>
              </div>

              {/* Connector between steps */}
              {i < STEPS.length - 1 && (
                <div className="flex items-center justify-center shrink-0 md:pt-9 py-2">
                  <span className="hidden md:block"><ArrowRight /></span>
                  <span className="md:hidden"><ArrowDown /></span>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="flex justify-center mt-14">
          <a href="/trips" className="btn-primary btn btn-xl">Start exploring</a>
        </div>
      </div>
    </section>
  );
}
