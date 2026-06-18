"use client";

import { useState } from "react";
import { useBookings } from "@/hooks/useTrips";
import { MOCK_BOOKINGS } from "@/lib/mockUserData";
import { BookingListCard } from "./BookingListCard";
import type { BookingStatus, Booking } from "@/types";

const TABS: { label: string; value: "all" | BookingStatus }[] = [
  { label: "All",       value: "all"       },
  { label: "Upcoming",  value: "confirmed" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

export function BookingsList() {
  const [activeTab, setActiveTab] = useState<"all" | BookingStatus>("all");
  const { data: apiData, isLoading, isError } = useBookings();

  /* Real data when API is connected, mock fallback otherwise */
  const allBookings: Booking[] = (isError || !apiData) ? MOCK_BOOKINGS : apiData.results;

  const filtered = activeTab === "all"
    ? allBookings
    : allBookings.filter((b) => b.status === activeTab);

  const countFor = (tab: "all" | BookingStatus) =>
    tab === "all" ? allBookings.length : allBookings.filter((b) => b.status === tab).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Header */}
      <div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.375rem, 3vw, 1.75rem)", color: "#1A1208", letterSpacing: "-0.025em", marginBottom: "4px" }}>
          My Bookings
        </h1>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.9375rem", color: "#7A6E60" }}>
          {allBookings.length} total booking{allBookings.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "6px", overflowX: "auto", scrollbarWidth: "none", paddingBottom: "2px" }}>
        {TABS.map((tab) => {
          const count  = countFor(tab.value);
          const active = activeTab === tab.value;
          return (
            <button key={tab.value} onClick={() => setActiveTab(tab.value)}
              style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", borderRadius: "9999px", border: `1px solid ${active ? "#1A1208" : "rgba(226,216,194,0.7)"}`, background: active ? "#1A1208" : "rgba(255,255,255,0.8)", color: active ? "#FDFCFA" : "#7A6E60", fontFamily: "var(--font-sans)", fontSize: "0.875rem", fontWeight: active ? 500 : 400, cursor: "pointer", transition: "all 0.15s" }}>
              {tab.label}
              {count > 0 && (
                <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "20px", height: "20px", borderRadius: "50%", background: active ? "rgba(255,255,255,0.15)" : "rgba(26,18,8,0.07)", color: active ? "#FDFCFA" : "#7A6E60", fontFamily: "var(--font-sans)", fontSize: "0.6875rem", fontWeight: 600 }}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Skeleton loading */}
      {isLoading && (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton" style={{ height: "160px", borderRadius: "20px" }} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && filtered.length === 0 && (
        <div style={{ padding: "48px 24px", textAlign: "center", background: "#fff", borderRadius: "20px", border: "1px solid rgba(226,216,194,0.5)" }}>
          <p style={{ fontFamily: "var(--font-sans)", color: "#7A6E60", fontSize: "0.9375rem" }}>
            No {activeTab !== "all" ? activeTab : ""} bookings yet.
          </p>
        </div>
      )}

      {/* List */}
      {!isLoading && filtered.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {filtered.map((b) => <BookingListCard key={b.id} booking={b} />)}
        </div>
      )}
    </div>
  );
}
