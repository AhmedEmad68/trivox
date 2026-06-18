"use client";

import { useState } from "react";
import Link        from "next/link";
import { TripCard }         from "@/components/shared/TripCard";
import { TripCardSkeleton } from "@/components/ui/Skeleton";
import { useFeaturedTrips } from "@/hooks/useTrips";
import { MOCK_TRIPS }       from "@/lib/mockData";
import type { TripBase, ProductType } from "@/types";

const TABS: { label: string; value: ProductType | "all" }[] = [
  { label: "All",         value: "all"        },
  { label: "Tours",       value: "tour"       },
  { label: "Experiences", value: "experience" },
  { label: "Transfers",   value: "transfer"   },
];

export function FeaturedTrips() {
  const [activeTab, setActiveTab] = useState<ProductType | "all">("all");
  const { data, isLoading, isError } = useFeaturedTrips(12);

  const allTrips: TripBase[] = data ?? MOCK_TRIPS;
  const filtered = activeTab === "all" ? allTrips : allTrips.filter((t) => t.type === activeTab);

  return (
    <section className="section-padding" style={{ background: "#F5F0E8" }}>
      <style>{`
        .view-all-link { display: inline-flex; align-items: center; gap: 6px; font-size: 0.875rem; font-weight: 500; color: #C8913A; font-family: var(--font-sans); text-decoration: none; transition: color 0.15s; }
        .view-all-link:hover { color: #A67428; }
      `}</style>

      <div className="container-trivox">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <div className="divider-gold mb-4" />
            <p className="eyebrow mb-2">Handpicked for you</p>
            <h2 style={{ fontFamily: "var(--font-display)", color: "#1A1208", fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", letterSpacing: "-0.025em" }}>
              Featured trips
            </h2>
          </div>
          <Link href="/trips" className="view-all-link hidden sm:inline-flex">
            View all trips
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
        </div>

        {/* Type tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar pb-1">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              style={{
                flexShrink: 0, padding: "8px 16px", borderRadius: "9999px",
                fontSize: "0.875rem", fontFamily: "var(--font-sans)",
                fontWeight: activeTab === tab.value ? 500 : 400, cursor: "pointer",
                transition: "all 0.18s",
                background: activeTab === tab.value ? "#1A1208" : "rgba(255,255,255,0.75)",
                color:      activeTab === tab.value ? "#FDFCFA" : "#7A6E60",
                border:     `1px solid ${activeTab === tab.value ? "#1A1208" : "rgba(226,216,194,0.8)"}`,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {isLoading && !isError ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => <TripCardSkeleton key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {(isError ? MOCK_TRIPS : filtered).slice(0, 6).map((trip, i) => (
              <TripCard key={trip.id} trip={trip} priority={i < 3} />
            ))}
          </div>
        )}

        <div className="flex justify-center mt-10 sm:hidden">
          <Link href="/trips" className="btn-outline btn btn-lg">View all trips</Link>
        </div>
      </div>
    </section>
  );
}
