import Image from "next/image";
import type { Review } from "@/types";
import { StarRating }      from "@/components/ui/StarRating";
import { formatRelativeDate } from "@/lib/utils";

/* ─── Review card ────────────────────────────────────────────────── */
export function ReviewCard({ review, compact = false, className }: { review: Review; compact?: boolean; className?: string }) {
  return (
    <div
      className={className}
      style={{
        background: "#fff",
        borderRadius: "16px",
        border: "1px solid rgba(226,216,194,0.55)",
        padding: compact ? "16px" : "20px 24px",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", marginBottom: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ position: "relative", width: "40px", height: "40px", borderRadius: "50%", overflow: "hidden", background: "#EDE5D5", flexShrink: 0 }}>
            {review.author_avatar ? (
              <Image src={review.author_avatar} alt={review.author_name} fill className="object-cover" />
            ) : (
              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(200,145,58,0.15)", color: "#C8913A", fontWeight: 500, fontSize: "0.875rem", fontFamily: "var(--font-sans)" }}>
                {review.author_name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontWeight: 500, color: "#1A1208", fontSize: "0.875rem", fontFamily: "var(--font-sans)" }}>{review.author_name}</span>
              {review.verified && (
                <span style={{ display: "flex", alignItems: "center", gap: "3px", fontSize: "0.6875rem", color: "#4A7C3F", fontWeight: 500, fontFamily: "var(--font-sans)" }}>
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><circle cx="5.5" cy="5.5" r="5" fill="rgba(74,124,63,0.15)"/><path d="M3 5.5l1.8 1.8 3.2-3.2" stroke="#4A7C3F" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Verified
                </span>
              )}
            </div>
            {review.author_country && (
              <span style={{ fontSize: "0.6875rem", color: "#948A7D", fontFamily: "var(--font-sans)" }}>{review.author_country}</span>
            )}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
          <StarRating rating={review.rating} showCount={false} size="sm" />
          <span style={{ fontSize: "0.6875rem", color: "#948A7D", fontFamily: "var(--font-sans)" }}>{formatRelativeDate(review.date)}</span>
        </div>
      </div>

      {review.title && (
        <h4 style={{ fontWeight: 500, color: "#1A1208", fontSize: "0.875rem", fontFamily: "var(--font-sans)", marginBottom: "6px" }}>
          {review.title}
        </h4>
      )}

      <p style={{ fontSize: "0.875rem", color: "#7A6E60", lineHeight: 1.7, fontFamily: "var(--font-sans)", overflow: compact ? "hidden" : "visible", display: compact ? "-webkit-box" : "block", WebkitLineClamp: compact ? 3 : undefined, WebkitBoxOrient: compact ? "vertical" : undefined } as React.CSSProperties}>
        {review.body}
      </p>

      {/* Review images */}
      {!compact && review.images && review.images.length > 0 && (
        <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
          {review.images.slice(0, 4).map((img, i) => (
            <div key={i} style={{ position: "relative", width: "64px", height: "64px", borderRadius: "10px", overflow: "hidden" }}>
              <Image src={img} alt={`Photo ${i + 1}`} fill className="object-cover" />
            </div>
          ))}
        </div>
      )}

      {/* Operator reply */}
      {!compact && review.response && (
        <div style={{ marginTop: "16px", padding: "14px", borderRadius: "12px", background: "#F5F0E8", borderLeft: "2px solid #C8913A" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
            <span style={{ fontSize: "0.75rem", fontWeight: 500, color: "#C8913A", fontFamily: "var(--font-sans)" }}>Response from {review.response.author}</span>
            <span style={{ fontSize: "0.6875rem", color: "#948A7D", fontFamily: "var(--font-sans)" }}>{formatRelativeDate(review.response.date)}</span>
          </div>
          <p style={{ fontSize: "0.875rem", color: "#7A6E60", lineHeight: 1.7, fontFamily: "var(--font-sans)" }}>{review.response.body}</p>
        </div>
      )}
    </div>
  );
}

/* ─── Reviews summary bar ────────────────────────────────────────── */
export function ReviewsSummary({ average, total, distribution }: { average: number; total: number; distribution: Record<number, number> }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", padding: "24px", background: "#F5F0E8", borderRadius: "16px", border: "1px solid rgba(226,216,194,0.5)" }}
      className="sm:flex-row">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minWidth: "120px" }}>
        <span style={{ fontFamily: "var(--font-display)", fontSize: "3.5rem", color: "#1A1208", letterSpacing: "-0.03em", lineHeight: 1 }}>{average.toFixed(1)}</span>
        <StarRating rating={average} showCount={false} size="lg" className="mt-2" />
        <span style={{ fontSize: "0.8125rem", color: "#948A7D", marginTop: "4px", fontFamily: "var(--font-sans)" }}>{total.toLocaleString()} reviews</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
        {[5, 4, 3, 2, 1].map((star) => {
          const count   = distribution[star] ?? 0;
          const percent = total > 0 ? Math.round((count / total) * 100) : 0;
          return (
            <div key={star} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "0.75rem", color: "#948A7D", width: "12px", fontFamily: "var(--font-sans)" }}>{star}</span>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="#C8913A"><path d="M5 0.5l1.18 2.39 2.64.38-1.91 1.86.45 2.63L5 6.5 2.64 7.76l.45-2.63L1.18 3.27l2.64-.38z"/></svg>
              <div style={{ flex: 1, height: "6px", background: "#E2D8C2", borderRadius: "9999px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${percent}%`, background: "#C8913A", borderRadius: "9999px", transition: "width 0.7s ease" }} />
              </div>
              <span style={{ fontSize: "0.75rem", color: "#948A7D", width: "28px", textAlign: "right", fontFamily: "var(--font-sans)" }}>{percent}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
