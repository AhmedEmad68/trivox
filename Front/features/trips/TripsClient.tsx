"use client";

import { useState, useMemo } from "react";
import { useTrips }        from "@/hooks/useTrips";
import { useFilterState }  from "@/hooks/useFilterState";
import { FilterSidebar }   from "./FilterSidebar";
import { SortBar }         from "./SortBar";
import { TripGrid }        from "./TripGrid";
import { TypeTabs }        from "./TypeTabs";
import { Pagination }      from "./Pagination";
import { MOCK_TRIPS }      from "@/lib/mockData";
import type { TripBase } from "@/types";
import type { FilterState } from "@/hooks/useFilterState";

const PAGE_SIZE = 12;

function applyLocalFilters(
  trips: TripBase[], filters: FilterState, page: number
): { results: TripBase[]; total: number; totalPages: number } {
  let out = [...trips];
  if (filters.type && filters.type !== "all")  out = out.filter((t) => t.type === filters.type);
  if (filters.location)                        out = out.filter((t) => t.location.slug === filters.location || t.location.name.toLowerCase() === filters.location.toLowerCase());
  if (filters.search)                          out = out.filter((t) => t.title.toLowerCase().includes(filters.search.toLowerCase()) || t.description.toLowerCase().includes(filters.search.toLowerCase()));
  if (filters.price_min > 0)                  out = out.filter((t) => t.price >= filters.price_min);
  if (filters.price_max < 500)                out = out.filter((t) => t.price <= filters.price_max);
  if (filters.rating_min > 0)                 out = out.filter((t) => t.rating >= filters.rating_min);
  if (filters.duration_max > 0)              out = out.filter((t) => (t.duration_hours ?? 0) <= filters.duration_max);
  if (filters.free_cancel)                    out = out.filter((t) => t.cancellation_policy === "free_cancellation");
  if (filters.instant)                        out = out.filter((t) => t.instant_confirmation);
  switch (filters.sort) {
    case "rating":     out.sort((a, b) => b.rating - a.rating); break;
    case "price_asc":  out.sort((a, b) => a.price  - b.price);  break;
    case "price_desc": out.sort((a, b) => b.price  - a.price);  break;
    case "newest":     out.sort((a, b) => b.id     - a.id);     break;
    default:           out.sort((a, b) => b.review_count - a.review_count);
  }
  const total      = out.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const results    = out.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  return { results, total, totalPages };
}

export function TripsClient() {
  const [view,          setView]          = useState<"grid" | "list">("grid");
  const [mobileFilters, setMobileFilters] = useState(false);

  const { filters, setFilters, setPage, clearFilters, apiFilters, activeCount } = useFilterState();
  const { data: apiData, isLoading, isError } = useTrips(apiFilters);

  const { results, total, totalPages } = useMemo(() => {
    if (!isError && apiData)
      return { results: apiData.results, total: apiData.count, totalPages: apiData.total_pages };
    return applyLocalFilters(MOCK_TRIPS, filters, filters.page);
  }, [apiData, isError, filters]);

  const loading = isLoading && !isError;

  const handleRemoveFilter = (key: keyof FilterState) => {
    const r: Partial<FilterState> = {};
    if (key === "type")         r.type         = "all";
    if (key === "location")     r.location     = "";
    if (key === "price_min")    r.price_min    = 0;
    if (key === "price_max")    r.price_max    = 500;
    if (key === "rating_min")   r.rating_min   = 0;
    if (key === "duration_max") r.duration_max = 0;
    if (key === "free_cancel")  r.free_cancel  = false;
    if (key === "instant")      r.instant      = false;
    if (key === "search")       r.search       = "";
    setFilters(r);
  };

  const closeMobileFilters = () => setMobileFilters(false);

  return (
    <>
      {/* ── Responsive styles ──────────────────────────────────── */}
      <style>{`
        /* Desktop: sidebar inline, no drawer */
        .tv-sidebar-desktop { display: block; }
        .tv-sidebar-mobile-backdrop { display: none; }
        .tv-sidebar-mobile-drawer { display: none; }

        /* Mobile: hide desktop sidebar, show drawer trigger */
        @media (max-width: 767px) {
          .tv-sidebar-desktop { display: none !important; }
          .tv-layout { flex-direction: column !important; }

          /* Backdrop */
          .tv-sidebar-mobile-backdrop {
            display: block;
            position: fixed; inset: 0; z-index: 200;
            background: rgba(15,10,4,0.55);
            backdrop-filter: blur(3px);
          }

          /* Slide-in drawer */
          .tv-sidebar-mobile-drawer {
            display: flex;
            flex-direction: column;
            position: fixed;
            top: 0; left: 0; bottom: 0;
            z-index: 210;
            width: min(88vw, 340px);
            background: #fff;
            box-shadow: 6px 0 40px rgba(15,10,4,0.2);
            overflow-y: auto;
            transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
          }
        }
      `}</style>

      {/* ── Page header ─────────────────────────────────────────── */}
      <div style={{ background: "#0F0A04", paddingTop: "calc(var(--navbar-height) + 2rem)", paddingBottom: "2.25rem" }}>
        <div className="container-trivox">
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6875rem", fontWeight: 600, color: "#C8913A", textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: "8px" }}>
            Explore
          </p>
          <h1 style={{ fontFamily: "var(--font-display)", color: "#FDFCFA", fontSize: "clamp(1.75rem,5vw,2.75rem)", letterSpacing: "-0.03em", lineHeight: 1.08, marginBottom: "20px" }}>
            {filters.type === "tour"        ? "Guided tours"
             : filters.type === "transfer"  ? "Private transfers"
             : filters.type === "experience"? "Experiences"
             : "All trips"}
            {filters.location && (
              <span style={{ color: "#C8913A" }}>
                {" "}in {filters.location.charAt(0).toUpperCase() + filters.location.slice(1)}
              </span>
            )}
          </h1>
          <TypeTabs value={filters.type} onChange={(type) => setFilters({ type })} />
        </div>
      </div>

      {/* ── Body ────────────────────────────────────────────────── */}
      <div style={{ background: "#F2EDE5", minHeight: "60vh" }}>
        <div className="container-trivox" style={{ paddingTop: "24px", paddingBottom: "72px" }}>
          <div className="tv-layout" style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>

            {/* Desktop sidebar — hidden on mobile via CSS */}
            <div className="tv-sidebar-desktop" style={{ width: "268px", flexShrink: 0 }}>
              <div style={{ position: "sticky", top: "calc(var(--navbar-height) + 16px)" }}>
                <FilterSidebar
                  filters={filters}
                  onChange={setFilters}
                  onClear={clearFilters}
                  activeCount={activeCount}
                />
              </div>
            </div>

            {/* Results column */}
            <div style={{ flex: 1, minWidth: 0, width: "100%" }}>
              <div style={{ marginBottom: "18px" }}>
                <SortBar
                  filters={filters}
                  total={total}
                  loading={loading}
                  view={view}
                  onSort={(sort) => setFilters({ sort })}
                  onViewChange={setView}
                  activeCount={activeCount}
                  onRemoveFilter={handleRemoveFilter}
                  onOpenMobileFilters={() => setMobileFilters(true)}
                />
              </div>
              <TripGrid trips={results} loading={loading} view={view} total={total} />
              <Pagination currentPage={filters.page} totalPages={totalPages} onPageChange={setPage} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile filter drawer ────────────────────────────────── */}
      {/* Backdrop */}
      {mobileFilters && (
        <div className="tv-sidebar-mobile-backdrop" onClick={closeMobileFilters} />
      )}

      {/* Drawer */}
      <div
        className="tv-sidebar-mobile-drawer"
        style={{ transform: mobileFilters ? "translateX(0)" : "translateX(-100%)" }}
      >
        {/* Drawer header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", background: "#1A1208", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path d="M1.5 3.5h12M4 7.5h7M6.5 11.5h2" stroke="#C8913A" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "0.9375rem", color: "#FDFCFA" }}>
              Filters
            </span>
            {activeCount > 0 && (
              <span style={{ background: "#C8913A", color: "#1A1208", fontSize: "0.625rem", fontWeight: 700, fontFamily: "var(--font-sans)", borderRadius: "9999px", padding: "2px 7px" }}>
                {activeCount}
              </span>
            )}
          </div>
          <button
            onClick={closeMobileFilters}
            style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: "9px", width: "32px", height: "32px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#FDFCFA" }}
            aria-label="Close filters"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Sidebar content inside drawer */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          <FilterSidebar
            filters={filters}
            onChange={setFilters}
            onClear={clearFilters}
            activeCount={activeCount}
            hideHeader  // hide the dark header — drawer already has one
          />
        </div>

        {/* Apply button */}
        <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(226,216,194,0.4)", flexShrink: 0 }}>
          <button
            onClick={closeMobileFilters}
            style={{ width: "100%", padding: "14px", borderRadius: "12px", background: "#C8913A", color: "#1A1208", fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "1rem", border: "none", cursor: "pointer", boxShadow: "0 4px 16px rgba(200,145,58,0.35)" }}
          >
            Show {total} trip{total !== 1 ? "s" : ""}
          </button>
        </div>
      </div>
    </>
  );
}
