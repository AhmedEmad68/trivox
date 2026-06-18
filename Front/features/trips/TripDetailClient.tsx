"use client";

import { useState } from "react";
import Link from "next/link";
import type { Trip, Tour, Transfer, Experience } from "@/types";
import { Badge }             from "@/components/ui/Badge";
import { StarRating }        from "@/components/ui/StarRating";
import { ImageGallery }      from "@/components/shared/ImageGallery";
import { BookingCard }       from "./BookingCard";
import { TripMeta }          from "./TripMeta";
import { IncludesExcludes }  from "./IncludesExcludes";
import { TourItinerary }     from "./TourItinerary";
import { TransferRoute }     from "./TransferRoute";
import { ExperienceHost }    from "./ExperienceHost";
import { ReviewsSection }    from "./ReviewsSection";
import type { Review }       from "@/types";

interface TripDetailClientProps {
  trip:    Trip;
  reviews: Review[];
}

/* ─── Section wrapper ────────────────────────────────────────────── */
function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section
      id={id}
      style={{
        paddingTop: "50px",
        /* scroll-margin-top accounts for fixed navbar (64px) + sticky section-nav (~48px) + gap */
        scrollMarginTop: "calc(var(--navbar-height) + 64px)",
      }}
    >
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", color: "#1A1208", letterSpacing: "-0.02em", marginBottom: "20px" }}>
        {title}
      </h2>
      {children}
    </section>
  );
}

/* ─── Sticky section nav ─────────────────────────────────────────── */
const SECTION_LINKS: { id: string; label: string }[] = [
  { id: "overview",  label: "Overview"  },
  { id: "details",   label: "Details"   },
  { id: "reviews",   label: "Reviews"   },
];

function SectionNav({ type }: { type: string }) {
  const links = [
    ...SECTION_LINKS,
    ...(type === "tour"       ? [{ id: "itinerary", label: "Itinerary" }] : []),
    ...(type === "transfer"   ? [{ id: "route",     label: "Route"     }] : []),
    ...(type === "experience" ? [{ id: "host",      label: "Your host" }] : []),
  ];

  /**
   * Native anchor href="#id" scrolls so the element top touches the
   * very top of the viewport — this puts it behind the fixed navbar
   * AND the sticky section-nav bar itself.
   *
   * Fix: intercept the click, calculate the true offset, then use
   * window.scrollTo with the correct position.
   *
   * Total offset = navbar height (64px) + section-nav bar height (~48px) + 12px gap
   */
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;

    // Measure the sticky section-nav bar itself
    const navBar = document.getElementById("section-nav-bar");
    const navBarH = navBar ? navBar.getBoundingClientRect().height : 48;

    // CSS custom property for navbar height — parse it
    const navbarH = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue("--navbar-height") || "64",
      10
    );

    const totalOffset = navbarH + navBarH + 20; // 20px breathing room
    const targetTop   = target.getBoundingClientRect().top + window.scrollY - totalOffset;

    window.scrollTo({ top: targetTop, behavior: "smooth" });
  };

  return (
    <div
      id="section-nav-bar"
      style={{
        position: "sticky",
        top: "var(--navbar-height)",
        zIndex: 50,
        background: "rgba(253,252,250,0.94)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(220,210,192,0.5)",
        boxShadow: "0 2px 12px rgba(26,18,8,0.05)",
        marginBottom: "16px",
      }}
      className="hidden lg:block"
    >
      <div style={{ display: "flex", gap: "0", overflowX: "auto", scrollbarWidth: "none" }}>
        {links.map((l) => (
          <a
            key={l.id}
            href={`#${l.id}`}
            onClick={(e) => handleNavClick(e, l.id)}
            style={{
              padding: "14px 18px",
              fontSize: "0.875rem",
              fontFamily: "var(--font-sans)",
              fontWeight: 500,
              color: "#7A6E60",
              textDecoration: "none",
              whiteSpace: "nowrap",
              borderBottom: "2px solid transparent",
              transition: "color 0.15s, border-color 0.15s",
              display: "block",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.color = "#1A1208";
              el.style.borderBottomColor = "#C8913A";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.color = "#7A6E60";
              el.style.borderBottomColor = "transparent";
            }}
          >
            {l.label}
          </a>
        ))}
      </div>
    </div>
  );
}

/* ─── Highlights ─────────────────────────────────────────────────── */
function Highlights({ items }: { items: string[] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "10px" }}>
      {items.map((item, i) => (
        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", padding: "12px 14px", background: "#fff", borderRadius: "12px", border: "1px solid rgba(226,216,194,0.55)" }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: "1px" }}>
            <path d="M8 1l1.545 3.13L13 4.56 10.5 7l.59 3.44L8 8.88 4.91 10.44 5.5 7 3 4.56l3.455-.43z" fill="rgba(200,145,58,0.15)" stroke="#C8913A" strokeWidth="1.3" strokeLinejoin="round"/>
          </svg>
          <span style={{ fontSize: "0.875rem", color: "#1A1208", fontFamily: "var(--font-sans)", lineHeight: 1.5 }}>{item}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────────── */
export function TripDetailClient({ trip, reviews }: TripDetailClientProps) {
  const [mobileBookingOpen, setMobileBookingOpen] = useState(false);

  return (
    <>
      <style>{`
        .share-btn:hover { background: #F5F0E8; }
        .back-link:hover { color: #1A1208; }
      `}</style>

      {/* ── Breadcrumb ──────────────────────────────────────────── */}
      <div style={{ background: "#FDFCFA", paddingTop: "calc(var(--navbar-height) + 20px)", paddingBottom: "16px" }}>
        <div className="container-trivox">
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.8125rem", fontFamily: "var(--font-sans)" }}>
            <Link href="/"      style={{ color: "#948A7D", textDecoration: "none" }}   className="back-link" onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#1A1208"; }} onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#948A7D"; }}>Home</Link>
            <span style={{ color: "#D4C9AE" }}>/</span>
            <Link href="/trips" style={{ color: "#948A7D", textDecoration: "none" }}   className="back-link" onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#1A1208"; }} onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#948A7D"; }}>Trips</Link>
            <span style={{ color: "#D4C9AE" }}>/</span>
            <span style={{ color: "#1A1208", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "200px" }}>{trip.title}</span>
          </div>
        </div>
      </div>

      {/* ── Gallery ──────────────────────────────────────────────── */}
      <div style={{ background: "#FDFCFA", paddingBottom: "32px" }}>
        <div className="container-trivox">
          <ImageGallery images={trip.gallery} title={trip.title} />
        </div>
      </div>

      {/* ── Main layout ──────────────────────────────────────────── */}
      <div className="container-trivox" style={{ paddingBottom: "80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "48px" }} className="lg:grid-cols-[1fr_340px]">

          {/* ── Left column ──────────────────────────────────────── */}
          <div>
            {/* Title block */}
            <div id="overview" style={{ paddingTop: "8px", paddingBottom: "32px", borderBottom: "1px solid rgba(226,216,194,0.5)" }}>
              {/* Badges */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px", flexWrap: "wrap" }}>
                <Badge type={trip.type} />
                {trip.is_featured && <Badge type="featured" />}
                {trip.instant_confirmation && (
                  <span style={{ fontSize: "0.6875rem", fontWeight: 500, color: "#3A6331", background: "rgba(74,124,63,0.1)", border: "1px solid rgba(74,124,63,0.22)", borderRadius: "9999px", padding: "2px 10px", fontFamily: "var(--font-sans)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    Instant confirmation
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.625rem, 3vw, 2.25rem)", color: "#1A1208", letterSpacing: "-0.025em", lineHeight: 1.15, marginBottom: "10px" }}>
                {trip.title}
              </h1>

              {/* Tagline */}
              {trip.tagline && (
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "1.0625rem", color: "#7A6E60", lineHeight: 1.6, marginBottom: "16px" }}>
                  {trip.tagline}
                </p>
              )}

              {/* Meta row */}
              <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
                <StarRating rating={trip.rating} reviewCount={trip.review_count} size="md" />
                <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "0.875rem", color: "#7A6E60", fontFamily: "var(--font-sans)" }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1.5C4.5 1.5 2.5 3.7 2.5 6.5c0 3.5 4.5 6 4.5 6s4.5-2.5 4.5-6c0-2.8-2-5-4.5-5z" stroke="currentColor" strokeWidth="1.3"/><circle cx="7" cy="6.5" r="1.8" stroke="currentColor" strokeWidth="1.3"/></svg>
                  {trip.location.name}, {trip.location.country}
                </span>
                {/* Share */}
                <button
                  className="share-btn"
                  onClick={() => navigator.share?.({ title: trip.title, url: window.location.href })}
                  style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "0.875rem", color: "#7A6E60", fontFamily: "var(--font-sans)", background: "transparent", border: "none", cursor: "pointer", padding: "4px 8px", borderRadius: "8px", marginLeft: "auto", transition: "background 0.15s" }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="11" cy="3" r="1.5" stroke="currentColor" strokeWidth="1.3"/><circle cx="3"  cy="7" r="1.5" stroke="currentColor" strokeWidth="1.3"/><circle cx="11" cy="11" r="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M4.5 7.8L9.5 10.5M9.5 3.5L4.5 6.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
                  Share
                </button>
              </div>
            </div>

            {/* Sticky section nav */}
            <SectionNav type={trip.type} />

            {/* Description */}
            <Section id="overview-body" title="About this trip">
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {trip.description.split("\n\n").map((para, i) => (
                  <p key={i} style={{ fontFamily: "var(--font-sans)", fontSize: "1rem", color: "#1A1208", lineHeight: 1.8 }}>{para}</p>
                ))}
              </div>
            </Section>

            {/* Highlights */}
            {trip.highlights.length > 0 && (
              <Section id="highlights" title="Highlights">
                <Highlights items={trip.highlights} />
              </Section>
            )}

            {/* Meta info grid */}
            <Section id="details" title="Trip details">
              <TripMeta trip={trip} />
            </Section>

            {/* Type-specific section */}
            {trip.type === "tour" && (trip as Tour).itinerary?.length > 0 && (
              <Section id="itinerary" title="Itinerary">
                <TourItinerary itinerary={(trip as Tour).itinerary} />
              </Section>
            )}

            {trip.type === "transfer" && (
              <Section id="route" title="Route & vehicle">
                <TransferRoute transfer={trip as Transfer} />
              </Section>
            )}

            {trip.type === "experience" && (
              <Section id="host" title="Your host">
                <ExperienceHost experience={trip as Experience} />
              </Section>
            )}

            {/* Includes / Excludes */}
            {(trip.includes.length > 0 || trip.excludes.length > 0) && (
              <Section id="includes" title="What's included">
                <IncludesExcludes trip={trip} />
              </Section>
            )}

            {/* Reviews */}
            {reviews.length > 0 && (
              <Section id="reviews" title={`Reviews (${trip.review_count.toLocaleString()})`}>
                <ReviewsSection reviews={reviews} stats={trip.review_stats} tripSlug={trip.slug} />
              </Section>
            )}
          </div>

          {/* ── Right column — Booking card ──────────────────────── */}
          <div className="hidden lg:block">
            <div className="sticky-card">
              <BookingCard trip={trip} addons={trip.addons ?? []} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile booking bar ───────────────────────────────────── */}
      <div
        className="lg:hidden"
        style={{ position: "fixed", bottom: 0, insetInline: 0, zIndex: 100, background: "rgba(253,252,250,0.95)", backdropFilter: "blur(16px)", borderTop: "1px solid rgba(226,216,194,0.45)", padding: "14px 20px 14px" }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "14px" }}>
          <div>
            <p style={{ fontSize: "0.75rem", color: "#948A7D", fontFamily: "var(--font-sans)" }}>From</p>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "1.375rem", color: "#1A1208", letterSpacing: "-0.025em" }}>
              {new Intl.NumberFormat("en-US", { style: "currency", currency: trip.price_currency, minimumFractionDigits: 0 }).format(trip.price)}
              <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-sans)", color: "#948A7D", fontWeight: 400, marginLeft: "4px" }}>
                /{trip.price_unit === "per_person" ? "person" : "trip"}
              </span>
            </p>
          </div>
          <button
            onClick={() => setMobileBookingOpen(true)}
            style={{ flex: 1, maxWidth: "200px", padding: "14px", borderRadius: "14px", background: "#C8913A", color: "#1A1208", fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "1rem", border: "none", cursor: "pointer", boxShadow: "0 4px 20px rgba(200,145,58,0.4)" }}
          >
            Book now
          </button>
        </div>
      </div>

      {/* Mobile booking modal */}
      {mobileBookingOpen && (
        <>
          <div style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(26,18,8,0.5)" }} onClick={() => setMobileBookingOpen(false)} />
          <div style={{ position: "fixed", bottom: 0, insetInline: 0, zIndex: 310, background: "#FDFCFA", borderRadius: "24px 24px 0 0", maxHeight: "92dvh", overflowY: "auto", padding: "8px 0 24px" }}>
            <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 16px" }}>
              <div style={{ width: "40px", height: "4px", borderRadius: "9999px", background: "#E2D8C2" }} />
            </div>
            <div style={{ padding: "0 20px 24px" }}>
              <BookingCard trip={trip} addons={trip.addons ?? []} />
            </div>
          </div>
        </>
      )}
    </>
  );
}
