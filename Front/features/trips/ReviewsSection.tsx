"use client";

import { useState } from "react";
import type { Review, ReviewStats } from "@/types";
import { ReviewCard, ReviewsSummary } from "@/components/shared/ReviewCard";

interface ReviewsSectionProps {
  reviews:    Review[];
  stats?:     ReviewStats;
  tripSlug:   string;
}

export function ReviewsSection({ reviews, stats, tripSlug: _tripSlug }: ReviewsSectionProps) {
  const [visibleCount, setVisibleCount] = useState(3);

  if (!reviews.length) return null;

  return (
    <div>
      {/* Summary bar */}
      {stats && (
        <div style={{ marginBottom: "28px" }}>
          <ReviewsSummary
            average={stats.average}
            total={stats.total}
            distribution={stats.distribution}
          />
        </div>
      )}

      {/* Review cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {reviews.slice(0, visibleCount).map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {/* Load more */}
      {visibleCount < reviews.length && (
        <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
          <button
            onClick={() => setVisibleCount((n) => n + 4)}
            style={{ padding: "11px 28px", borderRadius: "12px", background: "#fff", border: "1px solid rgba(226,216,194,0.7)", fontFamily: "var(--font-sans)", fontSize: "0.9375rem", fontWeight: 500, color: "#1A1208", cursor: "pointer", transition: "all 0.15s", boxShadow: "0 1px 4px rgba(26,18,8,0.06)" }}
          >
            Show more reviews
          </button>
        </div>
      )}
    </div>
  );
}
