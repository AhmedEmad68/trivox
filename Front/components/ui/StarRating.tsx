interface StarRatingProps {
  rating:       number;
  reviewCount?: number;
  size?:        "sm" | "md" | "lg";
  showCount?:   boolean;
  className?:   string;
  lightMode?:   boolean; // for use on dark backgrounds
}

export function StarRating({
  rating, reviewCount, size = "md", showCount = true, className, lightMode = false,
}: StarRatingProps) {
  const sizes     = { sm: 10, md: 12, lg: 14 };
  const fontSizes = { sm: "0.75rem", md: "0.8125rem", lg: "0.9375rem" };
  const starSize  = sizes[size];

  return (
    <span
      className={className}
      style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: fontSizes[size] }}
    >
      <svg width={starSize} height={starSize} viewBox="0 0 12 12" fill="#C8913A" aria-hidden="true">
        <path d="M6 0.5l1.545 3.13L11 4.145 8.5 6.58l.59 3.42L6 8.365 2.91 10 3.5 6.58 1 4.145l3.455-.515L6 0.5z"/>
      </svg>
      <span style={{ color: "#C8913A" }}>{rating.toFixed(1)}</span>
      {showCount && reviewCount !== undefined && (
        <span style={{ color: lightMode ? "rgba(253,252,250,0.6)" : "#948A7D", fontWeight: 400 }}>
          ({reviewCount.toLocaleString()})
        </span>
      )}
    </span>
  );
}
