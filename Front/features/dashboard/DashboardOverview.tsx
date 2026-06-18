"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useBookings } from "@/hooks/useTrips";
import { BookingListCard } from "./BookingListCard";
import { StatusBadge } from "./StatusBadge";
import { formatCurrency } from "@/lib/utils";
import { MOCK_USER, MOCK_BOOKINGS } from "@/lib/mockUserData";
import type { Booking } from "@/types";

function SectionHeader({ title, linkHref, linkLabel }: { title: string; linkHref: string; linkLabel: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.125rem", color: "#1A1208", letterSpacing: "-0.015em" }}>
        {title}
      </h2>
      <Link href={linkHref} style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", fontWeight: 500, color: "#C8913A", textDecoration: "none" }}>
        {linkLabel} →
      </Link>
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid rgba(226,216,194,0.6)", padding: "18px 20px", boxShadow: "0 1px 8px rgba(26,18,8,0.04)" }}>
      <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6875rem", color: "#948A7D", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 500 }}>
        {label}
      </p>
      <p style={{ fontFamily: "var(--font-display)", fontSize: "1.625rem", color: accent, letterSpacing: "-0.03em", lineHeight: 1 }}>
        {value}
      </p>
    </div>
  );
}

function UpcomingCard({ booking }: { booking: Booking }) {
  const daysUntil = Math.max(0, Math.ceil((new Date(booking.date).getTime() - Date.now()) / 86400000));
  const dateStr   = new Date(booking.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 18px", background: "#fff", borderRadius: "16px", border: "1px solid rgba(226,216,194,0.6)", boxShadow: "0 1px 6px rgba(26,18,8,0.04)" }}>
      <div style={{ flexShrink: 0, width: "52px", height: "52px", borderRadius: "12px", background: "rgba(200,145,58,0.1)", border: "1px solid rgba(200,145,58,0.2)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", color: "#C8913A", lineHeight: 1, letterSpacing: "-0.02em" }}>{daysUntil}</span>
        <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.5rem", color: "#948A7D", textTransform: "uppercase", letterSpacing: "0.08em" }}>days</span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "0.9375rem", color: "#1A1208", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {booking.trip.title}
        </p>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.8125rem", color: "#7A6E60", marginTop: "2px" }}>
          {dateStr}{booking.time ? ` · ${booking.time}` : ""} · {booking.trip.location.name}
        </p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
        <StatusBadge status={booking.status} />
        <Link href={`/dashboard/bookings/${booking.reference}`}
          style={{ padding: "5px 12px", borderRadius: "8px", border: "1px solid rgba(226,216,194,0.7)", background: "#fff", color: "#7A6E60", fontFamily: "var(--font-sans)", fontSize: "0.8125rem", fontWeight: 500, textDecoration: "none" }}>
          View
        </Link>
      </div>
    </div>
  );
}

export function DashboardOverview() {
  const { user: authUser, isMockMode } = useAuth();
  const { data: bookingsData, isError } = useBookings();

  const user     = authUser ?? MOCK_USER;
  const bookings: Booking[] = (isError || !bookingsData) ? MOCK_BOOKINGS : bookingsData.results;

  const confirmed  = bookings.filter((b) => b.status === "confirmed").length;
  const completed  = bookings.filter((b) => b.status === "completed").length;
  const totalSpent = bookings.filter((b) => b.status !== "cancelled").reduce((s, b) => s + b.summary.total, 0);
  const upcoming   = bookings
    .filter((b) => b.status === "confirmed" && new Date(b.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const memberSince = new Date(user.date_joined).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

      {/* Dev-mode notice */}
      {isMockMode && (
        <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", padding: "12px 16px", borderRadius: "14px", background: "rgba(200,145,58,0.09)", border: "1px solid rgba(200,145,58,0.25)" }}>
          <span style={{ fontSize: "1rem", flexShrink: 0 }}>🔧</span>
          <div>
            <p style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "0.8125rem", color: "#7D541A", marginBottom: "2px" }}>
              Dev mode — showing demo data
            </p>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "#948A7D", lineHeight: 1.5 }}>
              Django backend is offline. Bookings shown are sample data. Start your backend at localhost:8000 to see real data.
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.5rem, 3vw, 2rem)", color: "#1A1208", letterSpacing: "-0.025em", marginBottom: "4px" }}>
          Welcome back, {user.first_name} ✦
        </h1>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.9375rem", color: "#7A6E60" }}>
          Member since {memberSince}
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gap: "14px" }} className="grid-cols-2 lg:grid-cols-4">
        <StatCard label="Upcoming trips"  value={String(confirmed)}                 accent="#C8913A" />
        <StatCard label="Trips completed" value={String(completed)}                 accent="#4A7C3F" />
        <StatCard label="Total bookings"  value={String(bookings.length)}           accent="#1A1208" />
        <StatCard label="Total spent"     value={formatCurrency(totalSpent, "USD")} accent="#B54A2C" />
      </div>

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <div>
          <SectionHeader title="Upcoming trips" linkHref="/dashboard/bookings" linkLabel="All bookings" />
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {upcoming.map((b) => <UpcomingCard key={b.id} booking={b} />)}
          </div>
        </div>
      )}

      {/* Recent bookings */}
      <div>
        <SectionHeader title="Recent bookings" linkHref="/dashboard/bookings" linkLabel="View all" />
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {bookings.slice(0, 3).map((b) => <BookingListCard key={b.id} booking={b} />)}
        </div>
      </div>

      {/* Explore CTA */}
      <div style={{ background: "#1A1208", borderRadius: "20px", padding: "28px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "20px", flexWrap: "wrap" }}>
        <div>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", color: "#FDFCFA", letterSpacing: "-0.02em", marginBottom: "4px" }}>
            Ready for your next adventure?
          </p>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "#625849" }}>
            180+ tours, transfers and experiences across Egypt.
          </p>
        </div>
        <Link href="/trips" style={{ padding: "12px 24px", borderRadius: "12px", background: "#C8913A", color: "#1A1208", fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "0.9375rem", textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0 }}>
          Explore trips →
        </Link>
      </div>
    </div>
  );
}
