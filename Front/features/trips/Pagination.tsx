"use client";

interface PaginationProps {
  currentPage:  number;
  totalPages:   number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  // Build page numbers to show
  const pages: (number | "…")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3)          pages.push("…");
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push("…");
    pages.push(totalPages);
  }

  const btnBase: React.CSSProperties = {
    width: "38px", height: "38px", borderRadius: "10px", border: "1px solid rgba(226,216,194,0.7)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: "var(--font-sans)", fontSize: "0.875rem", cursor: "pointer",
    transition: "all 0.15s", background: "#fff", color: "#7A6E60",
  };

  return (
    <nav aria-label="Page navigation" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", paddingTop: "32px" }}>
      {/* Prev */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{ ...btnBase, opacity: currentPage === 1 ? 0.4 : 1, cursor: currentPage === 1 ? "not-allowed" : "pointer" }}
        aria-label="Previous page"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Pages */}
      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`ellipsis-${i}`} style={{ width: "38px", height: "38px", display: "flex", alignItems: "center", justifyContent: "center", color: "#948A7D", fontFamily: "var(--font-sans)", fontSize: "0.875rem" }}>…</span>
        ) : (
          <button key={p} onClick={() => onPageChange(p as number)}
            style={{
              ...btnBase,
              background:   p === currentPage ? "#1A1208" : "#fff",
              color:        p === currentPage ? "#FDFCFA" : "#7A6E60",
              borderColor:  p === currentPage ? "#1A1208" : "rgba(226,216,194,0.7)",
              fontWeight:   p === currentPage ? 500 : 400,
            }}
            aria-label={`Page ${p}`}
            aria-current={p === currentPage ? "page" : undefined}
          >
            {p}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{ ...btnBase, opacity: currentPage === totalPages ? 0.4 : 1, cursor: currentPage === totalPages ? "not-allowed" : "pointer" }}
        aria-label="Next page"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </nav>
  );
}
