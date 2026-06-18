"use client";

import { useState } from "react";
import type { ItineraryDay } from "@/types";

const STOP_ICONS: Record<string, React.ReactNode> = {
  activity:      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="#C8913A" strokeWidth="1.3"/><path d="M7 4v3l2 1.5" stroke="#C8913A" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  meal:          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 2v5a4 4 0 008 0V2M7 2v5" stroke="#4A7C3F" strokeWidth="1.3" strokeLinecap="round"/><path d="M7 10v2" stroke="#4A7C3F" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  transport:     <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="5" width="12" height="6" rx="1.5" stroke="#7A6E60" strokeWidth="1.2"/><path d="M1 6.5l2.5-3.5h7l2.5 3.5" stroke="#7A6E60" strokeWidth="1.2"/><circle cx="4" cy="11" r="1.2" stroke="#7A6E60" strokeWidth="1.2"/><circle cx="10" cy="11" r="1.2" stroke="#7A6E60" strokeWidth="1.2"/></svg>,
  accommodation: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 12V4l5-2 5 2v8" stroke="#7A6E60" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><rect x="5" y="8" width="4" height="4" stroke="#7A6E60" strokeWidth="1.2"/></svg>,
  free_time:     <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="#948A7D" strokeWidth="1.2"/><path d="M5 7h4M7 5v4" stroke="#948A7D" strokeWidth="1.2" strokeLinecap="round"/></svg>,
};

const STOP_COLORS: Record<string, string> = {
  activity: "#C8913A", meal: "#4A7C3F", transport: "#7A6E60", accommodation: "#7A6E60", free_time: "#948A7D",
};

export function TourItinerary({ itinerary }: { itinerary: ItineraryDay[] }) {
  const [openDays, setOpenDays] = useState<Set<number>>(new Set([1]));

  const toggleDay = (day: number) => {
    setOpenDays((prev) => {
      const next = new Set(prev);
      if (next.has(day)) next.delete(day);
      else next.add(day);
      return next;
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {itinerary.map((day) => {
        const isOpen = openDays.has(day.day);
        return (
          <div
            key={day.day}
            style={{ borderRadius: "16px", border: "1px solid rgba(226,216,194,0.6)", overflow: "hidden", background: "#fff" }}
          >
            {/* Day header */}
            <button
              onClick={() => toggleDay(day.day)}
              style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", background: isOpen ? "#FDFCFA" : "#fff", border: "none", cursor: "pointer", borderBottom: isOpen ? "1px solid rgba(226,216,194,0.5)" : "none", transition: "background 0.15s" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "10px", background: "rgba(200,145,58,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#C8913A", fontFamily: "var(--font-sans)" }}>
                    {itinerary.length > 1 ? `D${day.day}` : "—"}
                  </span>
                </div>
                <div style={{ textAlign: "left" }}>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: "1rem", color: "#1A1208", letterSpacing: "-0.01em" }}>{day.title}</p>
                  {day.meals_included && day.meals_included.length > 0 && (
                    <p style={{ fontSize: "0.75rem", color: "#4A7C3F", fontFamily: "var(--font-sans)", marginTop: "2px" }}>
                      Meals: {day.meals_included.join(", ")}
                    </p>
                  )}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "0.75rem", color: "#948A7D", fontFamily: "var(--font-sans)" }}>{day.stops.length} stops</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", flexShrink: 0 }}>
                  <path d="M4 6l4 4 4-4" stroke="#948A7D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </button>

            {/* Stops timeline */}
            {isOpen && (
              <div style={{ padding: "20px 20px 8px 20px" }}>
                {day.description && (
                  <p style={{ fontSize: "0.875rem", color: "#7A6E60", fontFamily: "var(--font-sans)", lineHeight: 1.65, marginBottom: "20px" }}>{day.description}</p>
                )}
                <div style={{ position: "relative", paddingLeft: "28px" }}>
                  {/* Vertical track */}
                  <div style={{ position: "absolute", left: "10px", top: "8px", bottom: "24px", width: "1.5px", background: "linear-gradient(to bottom, #C8913A, #EDE5D5)" }} />

                  {day.stops.map((stop, idx) => (
                    <div key={stop.order} style={{ position: "relative", paddingBottom: idx < day.stops.length - 1 ? "20px" : "12px" }}>
                      {/* Dot */}
                      <div style={{ position: "absolute", left: "-24px", top: "3px", width: "12px", height: "12px", borderRadius: "50%", background: STOP_COLORS[stop.type] || "#C8913A", border: "2px solid #fff", boxShadow: "0 0 0 2px rgba(200,145,58,0.15)" }} />

                      <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px", flexWrap: "wrap" }}>
                            {stop.time && (
                              <span style={{ fontSize: "0.6875rem", fontWeight: 600, color: "#C8913A", fontFamily: "var(--font-sans)", letterSpacing: "0.06em", textTransform: "uppercase" }}>{stop.time}</span>
                            )}
                            <span style={{ fontSize: "0.9375rem", fontWeight: 500, color: "#1A1208", fontFamily: "var(--font-sans)" }}>{stop.title}</span>
                            <span style={{ display: "flex", alignItems: "center" }}>{STOP_ICONS[stop.type]}</span>
                          </div>
                          <p style={{ fontSize: "0.8125rem", color: "#7A6E60", fontFamily: "var(--font-sans)", lineHeight: 1.6 }}>{stop.description}</p>
                          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "6px", flexWrap: "wrap" }}>
                            {stop.duration && (
                              <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.6875rem", color: "#948A7D", fontFamily: "var(--font-sans)" }}>
                                <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><circle cx="5.5" cy="5.5" r="4.5" stroke="currentColor" strokeWidth="1.2"/><path d="M5.5 3v2.5l1.5 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                                {stop.duration}
                              </span>
                            )}
                            {stop.location && (
                              <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.6875rem", color: "#948A7D", fontFamily: "var(--font-sans)" }}>
                                <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M5.5 1C3.5 1 2 2.7 2 4.8c0 3 3.5 5.2 3.5 5.2S9 7.8 9 4.8C9 2.7 7.5 1 5.5 1z" stroke="currentColor" strokeWidth="1.2"/><circle cx="5.5" cy="4.8" r="1.3" stroke="currentColor" strokeWidth="1.2"/></svg>
                                {stop.location}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
