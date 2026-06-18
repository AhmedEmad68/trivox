"use client";

import Image from "next/image";
import Link from "next/link";
import type { Booking } from "@/types";
import { StatusBadge } from "./StatusBadge";
import { formatCurrency } from "@/lib/utils";

interface BookingCardProps {
  booking: Booking;
}

export function BookingListCard({ booking }: BookingCardProps) {
  const { trip, summary } = booking;

  const formattedDate = new Date(booking.date).toLocaleDateString("en-US", {
    weekday: "short",
    month:   "long",
    day:     "numeric",
    year:    "numeric",
  });

  const typeColor: Record<string, string> = {
    tour:       "#C8913A",
    transfer:   "#B54A2C",
    experience: "#4A7C3F",
  };
  const accentColor = typeColor[trip.type] ?? "#C8913A";

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "20px",
        border: "1px solid rgba(226,216,194,0.6)",
        overflow: "hidden",
        boxShadow: "0 2px 12px rgba(26,18,8,0.05)",
        transition: "box-shadow 0.2s, transform 0.2s",
      }}
      className="booking-card-hover"
    >
      <style>{`
        .booking-card-hover:hover {
          box-shadow: 0 6px 28px rgba(26,18,8,0.1);
          transform: translateY(-2px);
        }
      `}</style>

      <div style={{ display: "flex", flexDirection: "column" }} className="sm:flex-row">
        {/* Trip image */}
        <div
          style={{ position: "relative", flexShrink: 0, background: "#EDE5D5" }}
          className="w-full sm:w-48 h-40 sm:h-auto"
        >
          <Image
            src={trip.cover_image}
            alt={trip.title}
            fill
            className="object-cover"
            sizes="(max-width:640px) 100vw, 192px"
          />
          {/* Type accent bar */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "3px",
              background: accentColor,
            }}
          />
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: "20px", minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: "12px",
              marginBottom: "10px",
              flexWrap: "wrap",
            }}
          >
            <div style={{ minWidth: 0 }}>
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.6875rem",
                  fontWeight: 600,
                  color: accentColor,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: "4px",
                }}
              >
                {trip.type} · {trip.location.name}
              </p>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.0625rem",
                  color: "#1A1208",
                  letterSpacing: "-0.01em",
                  lineHeight: 1.3,
                }}
              >
                {trip.title}
              </h3>
            </div>
            <StatusBadge status={booking.status} />
          </div>

          {/* Meta row */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "14px",
              marginBottom: "16px",
            }}
          >
            <MetaItem
              icon={
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <rect x="1" y="2" width="11" height="10" rx="2" stroke="currentColor" strokeWidth="1.3"/>
                  <path d="M1 5.5h11M4 1v2M9 1v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
              }
              value={formattedDate}
            />
            <MetaItem
              icon={
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.3"/>
                  <path d="M6.5 3.5v3l2 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
              }
              value={trip.duration_label}
            />
            <MetaItem
              icon={
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M6.5 1C4 1 2 3.2 2 5.6c0 3.4 4.5 6.4 4.5 6.4S11 9 11 5.6C11 3.2 9 1 6.5 1z" stroke="currentColor" strokeWidth="1.3"/>
                </svg>
              }
              value={`Ref: ${booking.reference}`}
            />
          </div>

          {/* Footer */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: "14px",
              borderTop: "1px solid rgba(226,216,194,0.5)",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "#948A7D" }}>
                Total paid{" "}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.125rem",
                  color: "#1A1208",
                  letterSpacing: "-0.02em",
                }}
              >
                {formatCurrency(summary.total, summary.currency)}
              </span>
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              {booking.status === "confirmed" && (
                <Link
                  href={`/dashboard/bookings/${booking.reference}`}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "10px",
                    background: "#1A1208",
                    color: "#FDFCFA",
                    fontFamily: "var(--font-sans)",
                    fontWeight: 500,
                    fontSize: "0.875rem",
                    textDecoration: "none",
                    transition: "background 0.15s",
                  }}
                >
                  View details
                </Link>
              )}
              {booking.status === "completed" && (
                <Link
                  href={`/trips/${trip.slug}`}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "10px",
                    border: "1.5px solid rgba(226,216,194,0.8)",
                    background: "#fff",
                    color: "#7A6E60",
                    fontFamily: "var(--font-sans)",
                    fontWeight: 500,
                    fontSize: "0.875rem",
                    textDecoration: "none",
                  }}
                >
                  Book again
                </Link>
              )}
              {(booking.status === "confirmed" || booking.status === "pending") && (
                <button
                  style={{
                    padding: "8px 16px",
                    borderRadius: "10px",
                    border: "1.5px solid rgba(181,74,44,0.3)",
                    background: "rgba(181,74,44,0.06)",
                    color: "#923A22",
                    fontFamily: "var(--font-sans)",
                    fontWeight: 500,
                    fontSize: "0.875rem",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetaItem({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
      <span style={{ color: "#948A7D" }}>{icon}</span>
      <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.8125rem", color: "#7A6E60" }}>{value}</span>
    </div>
  );
}
