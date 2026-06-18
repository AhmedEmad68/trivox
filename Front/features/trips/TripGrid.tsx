"use client";

import { TripCard }         from "@/components/shared/TripCard";
import { TripCardSkeleton } from "@/components/ui/Skeleton";
import type { TripBase }    from "@/types";

interface TripGridProps {
  trips:   TripBase[];
  loading: boolean;
  view:    "grid" | "list";
  total:   number;
}

/* Responsive grid entirely via CSS — no Tailwind classes needed */
const GRID_STYLE = `
  .tv-trip-grid {
    display: grid;
    gap: 16px;
    grid-template-columns: 1fr;
  }
  @media (min-width: 480px) {
    .tv-trip-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (min-width: 1100px) {
    .tv-trip-grid { grid-template-columns: repeat(3, 1fr); }
  }
`;

export function TripGrid({ trips, loading, view, total }: TripGridProps) {
  /* Loading skeletons */
  if (loading) {
    if (view === "list") {
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <TripCardSkeleton key={i} variant="horizontal" />
          ))}
        </div>
      );
    }
    return (
      <>
        <style>{GRID_STYLE}</style>
        <div className="tv-trip-grid">
          {Array.from({ length: 9 }).map((_, i) => (
            <TripCardSkeleton key={i} />
          ))}
        </div>
      </>
    );
  }

  /* Empty state */
  if (!trips.length) {
    return (
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "64px 24px", textAlign: "center",
      }}>
        <div style={{
          width: "64px", height: "64px", borderRadius: "20px",
          background: "#EDE8E0", display: "flex", alignItems: "center",
          justifyContent: "center", marginBottom: "20px",
        }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <circle cx="13" cy="13" r="9" stroke="#948A7D" strokeWidth="1.5"/>
            <path d="M20 20L25 25" stroke="#948A7D" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M9 13h8M13 9v8" stroke="#948A7D" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
        </div>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.375rem", color: "#1A1208", marginBottom: "8px", letterSpacing: "-0.02em" }}>
          No trips found
        </h3>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.9375rem", color: "#7A6E60", maxWidth: "300px", lineHeight: 1.65 }}>
          Try adjusting your filters or browsing a different destination.
        </p>
      </div>
    );
  }

  /* List view */
  if (view === "list") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {trips.map((trip, i) => (
          <TripCard key={trip.id} trip={trip} variant="horizontal" priority={i < 4} />
        ))}
      </div>
    );
  }

  /* Grid view */
  return (
    <>
      <style>{GRID_STYLE}</style>
      <div className="tv-trip-grid">
        {trips.map((trip, i) => (
          <TripCard key={trip.id} trip={trip} variant="default" priority={i < 6} />
        ))}
      </div>
    </>
  );
}
