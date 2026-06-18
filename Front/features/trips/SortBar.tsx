"use client";

import { useState } from "react";
import type { FilterState, SortOption } from "@/hooks/useFilterState";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "popularity", label: "Most popular"      },
  { value: "rating",     label: "Highest rated"     },
  { value: "price_asc",  label: "Price: low → high" },
  { value: "price_desc", label: "Price: high → low" },
  { value: "newest",     label: "Newest first"      },
];

interface SortBarProps {
  filters:              FilterState;
  total:                number;
  loading:              boolean;
  view:                 "grid" | "list";
  onSort:               (sort: SortOption) => void;
  onViewChange:         (view: "grid" | "list") => void;
  activeCount:          number;
  onRemoveFilter:       (key: keyof FilterState) => void;
  onOpenMobileFilters:  () => void;
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "5px",
      padding: "4px 10px", borderRadius: "8px",
      background: "#1A1208",
      fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "#FDFCFA", fontWeight: 500,
      whiteSpace: "nowrap",
    }}>
      {label}
      <button
        onClick={onRemove}
        style={{ background: "none", border: "none", cursor: "pointer", color: "#C8913A", lineHeight: 1, padding: 0, display: "flex", alignItems: "center" }}
        aria-label={`Remove ${label} filter`}
      >
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
          <path d="M2.5 2.5l6 6M8.5 2.5l-6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
      </button>
    </span>
  );
}

export function SortBar({
  filters, total, loading, view, onSort, onViewChange, activeCount, onRemoveFilter, onOpenMobileFilters,
}: SortBarProps) {
  const [sortOpen, setSortOpen] = useState(false);
  const currentSort = SORT_OPTIONS.find((s) => s.value === filters.sort) ?? SORT_OPTIONS[0];

  const chips: { key: keyof FilterState; label: string }[] = [];
  if (filters.type && filters.type !== "all") chips.push({ key: "type",         label: `Type: ${filters.type}` });
  if (filters.location)                       chips.push({ key: "location",     label: `📍 ${filters.location.charAt(0).toUpperCase() + filters.location.slice(1)}` });
  if (filters.price_min > 0)                  chips.push({ key: "price_min",    label: `From $${filters.price_min}` });
  if (filters.price_max < 500)                chips.push({ key: "price_max",    label: `Up to $${filters.price_max}` });
  if (filters.rating_min > 0)                 chips.push({ key: "rating_min",   label: `${filters.rating_min}+ ★` });
  if (filters.duration_max > 0)              chips.push({ key: "duration_max", label: `< ${filters.duration_max}h` });
  if (filters.free_cancel)                    chips.push({ key: "free_cancel",  label: "Free cancel" });
  if (filters.instant)                        chips.push({ key: "instant",      label: "Instant" });
  if (filters.search)                         chips.push({ key: "search",       label: `"${filters.search}"` });

  return (
    <>
      <style>{`
        /* Hide mobile filter button on desktop, show on mobile */
        .tv-mobile-filter-btn { display: none; }
        @media (max-width: 767px) {
          .tv-mobile-filter-btn { display: flex !important; }
          .tv-view-toggle { display: none !important; }
        }
      `}</style>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>

        {/* Top row */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>

          {/* Mobile: Filters button — hidden on desktop */}
          <button
            className="tv-mobile-filter-btn"
            onClick={onOpenMobileFilters}
            style={{
              display: "none", // overridden by CSS above on mobile
              alignItems: "center", gap: "7px",
              padding: "9px 14px", borderRadius: "10px",
              background: activeCount > 0 ? "#1A1208" : "#fff",
              border: `1px solid ${activeCount > 0 ? "#1A1208" : "rgba(214,204,184,0.8)"}`,
              cursor: "pointer",
              fontFamily: "var(--font-sans)", fontSize: "0.875rem",
              color: activeCount > 0 ? "#FDFCFA" : "#1A1208", fontWeight: 500,
              boxShadow: "0 1px 4px rgba(26,18,8,0.06)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 2.5h12M3.5 7h7M6 11.5h2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
            Filters
            {activeCount > 0 && (
              <span style={{
                background: "#C8913A", color: "#1A1208",
                fontSize: "0.5625rem", fontWeight: 700,
                fontFamily: "var(--font-sans)",
                borderRadius: "9999px", padding: "2px 6px",
              }}>
                {activeCount}
              </span>
            )}
          </button>

          {/* Result count */}
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.9375rem", color: "#625849", flex: 1 }}>
            {loading ? (
              <span style={{ display: "inline-block", width: "80px", height: "16px", borderRadius: "6px", background: "#DDD5C5" }} />
            ) : (
              <>
                <span style={{ fontWeight: 700, color: "#1A1208" }}>{total}</span>
                {" "}trip{total !== 1 ? "s" : ""} found
              </>
            )}
          </p>

          {/* Sort dropdown */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setSortOpen(!sortOpen)}
              style={{
                display: "flex", alignItems: "center", gap: "7px",
                padding: "8px 13px", borderRadius: "10px",
                background: "#fff", border: "1px solid rgba(214,204,184,0.8)",
                cursor: "pointer", fontFamily: "var(--font-sans)", fontSize: "0.875rem",
                color: "#1A1208", fontWeight: 500,
                boxShadow: "0 1px 4px rgba(26,18,8,0.06)",
                whiteSpace: "nowrap",
              }}
            >
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M1 2.5h11M3 6.5h7M5.5 10.5h2" stroke="#948A7D" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
              <span style={{ maxWidth: "130px", overflow: "hidden", textOverflow: "ellipsis" }}>
                {currentSort.label}
              </span>
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none"
                style={{ transform: sortOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.18s", flexShrink: 0 }}>
                <path d="M2 4l3.5 3.5L9 4" stroke="#948A7D" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {sortOpen && (
              <>
                <div style={{ position: "fixed", inset: 0, zIndex: 40 }} onClick={() => setSortOpen(false)} />
                <div style={{
                  position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 50,
                  background: "#fff", borderRadius: "14px",
                  border: "1px solid rgba(214,204,184,0.8)",
                  boxShadow: "0 8px 36px rgba(26,18,8,0.14)", overflow: "hidden", minWidth: "196px",
                }}>
                  {SORT_OPTIONS.map((opt) => {
                    const active = filters.sort === opt.value || (!filters.sort && opt.value === "popularity");
                    return (
                      <button key={opt.value}
                        onClick={() => { onSort(opt.value); setSortOpen(false); }}
                        style={{
                          width: "100%", textAlign: "left", padding: "10px 14px",
                          fontFamily: "var(--font-sans)", fontSize: "0.875rem",
                          background: active ? "#1A1208" : "transparent",
                          color: active ? "#FDFCFA" : "#1A1208",
                          fontWeight: active ? 500 : 400, border: "none", cursor: "pointer",
                          display: "flex", alignItems: "center", justifyContent: "space-between",
                        }}
                      >
                        {opt.label}
                        {active && (
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6l2.5 2.5 5.5-5" stroke="#C8913A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* View toggle — hidden on mobile */}
          <div className="tv-view-toggle" style={{ display: "flex", borderRadius: "10px", border: "1px solid rgba(214,204,184,0.8)", overflow: "hidden", background: "#fff" }}>
            {(["grid", "list"] as const).map((v) => (
              <button key={v} onClick={() => onViewChange(v)}
                style={{
                  padding: "8px 11px", border: "none", cursor: "pointer",
                  background: view === v ? "#1A1208" : "transparent",
                  color: view === v ? "#C8913A" : "#948A7D",
                  transition: "all 0.15s", display: "flex", alignItems: "center",
                }}
                aria-label={`${v} view`}
              >
                {v === "grid"
                  ? <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="5" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><rect x="8" y="1" width="5" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><rect x="1" y="8" width="5" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><rect x="8" y="8" width="5" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.3"/></svg>
                  : <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 3h12M1 7h12M1 11h12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
                }
              </button>
            ))}
          </div>
        </div>

        {/* Active filter chips */}
        {chips.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", alignItems: "center" }}>
            {chips.map((chip) => (
              <FilterChip key={chip.key} label={chip.label} onRemove={() => onRemoveFilter(chip.key)} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
