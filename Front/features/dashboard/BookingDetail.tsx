"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Booking } from "@/types";
import { StatusBadge } from "./StatusBadge";
import { formatCurrency } from "@/lib/utils";
import { useBooking, useCancelBooking } from "@/hooks/useTrips";

interface BookingDetailProps {
  reference: string;
}

export function BookingDetail({ reference }: BookingDetailProps) {
  const [cancelOpen, setCancelOpen] = useState(false);
  const { data: booking, isLoading, isError } = useBooking(reference);
  const cancelMutation = useCancelBooking();

  if (isLoading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton" style={{ height: "120px", borderRadius: "20px" }} />
        ))}
      </div>
    );
  }

  if (isError || !booking) {
    return (
      <div style={{ padding: "48px 24px", textAlign: "center", background: "#fff", borderRadius: "20px", border: "1px solid rgba(226,216,194,0.5)" }}>
        <p style={{ fontFamily: "var(--font-sans)", color: "#7A6E60", fontSize: "0.9375rem" }}>
          Booking not found or could not be loaded.
        </p>
        <Link href="/dashboard/bookings" style={{ display: "inline-block", marginTop: "16px", color: "#C8913A", fontFamily: "var(--font-sans)", fontSize: "0.875rem" }}>
          Back to bookings
        </Link>
      </div>
    );
  }

  const { trip, summary } = booking;

  const formattedDate = new Date(booking.date).toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });

  const createdAt = new Date(booking.created_at).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });

  const totalPeople = booking.participants.reduce((s, p) => s + p.count, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.8125rem", fontFamily: "var(--font-sans)" }}>
        <Link href="/dashboard" style={{ color: "#948A7D", textDecoration: "none" }}>Dashboard</Link>
        <span style={{ color: "#D4C9AE" }}>/</span>
        <Link href="/dashboard/bookings" style={{ color: "#948A7D", textDecoration: "none" }}>Bookings</Link>
        <span style={{ color: "#D4C9AE" }}>/</span>
        <span style={{ color: "#1A1208", fontWeight: 500 }}>{booking.reference}</span>
      </div>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
            <StatusBadge status={booking.status} />
            <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.8125rem", color: "#948A7D" }}>
              Booked {createdAt}
            </span>
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.25rem, 3vw, 1.625rem)", color: "#1A1208", letterSpacing: "-0.02em" }}>
            {trip.title}
          </h1>
        </div>
        {/* Reference badge */}
        <div style={{ padding: "8px 16px", borderRadius: "12px", background: "rgba(200,145,58,0.1)", border: "1px solid rgba(200,145,58,0.2)", textAlign: "right", flexShrink: 0 }}>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6875rem", color: "#948A7D", textTransform: "uppercase", letterSpacing: "0.08em" }}>Reference</p>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "1rem", color: "#C8913A", letterSpacing: "0.04em" }}>{booking.reference}</p>
        </div>
      </div>

      {/* Trip card */}
      <div style={{ background: "#fff", borderRadius: "20px", border: "1px solid rgba(226,216,194,0.6)", overflow: "hidden", boxShadow: "0 2px 12px rgba(26,18,8,0.05)" }}>
        <div style={{ display: "flex", flexDirection: "column" }} className="sm:flex-row">
          <div style={{ position: "relative", flexShrink: 0 }} className="w-full h-48 sm:w-56 sm:h-auto">
            <Image src={trip.cover_image} alt={trip.title} fill className="object-cover" sizes="(max-width:640px) 100vw, 224px" />
          </div>
          <div style={{ padding: "22px", flex: 1 }}>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", fontWeight: 600, color: "#C8913A", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>
              {trip.type} · {trip.location.name}
            </p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.125rem", color: "#1A1208", letterSpacing: "-0.015em", marginBottom: "16px" }}>
              {trip.title}
            </h2>
            <div style={{ display: "grid", gap: "10px" }} className="sm:grid-cols-2">
              {[
                { label: "Date",     value: formattedDate },
                ...(booking.time ? [{ label: "Time", value: booking.time }] : []),
                { label: "Duration", value: trip.duration_label },
                { label: "Guests",   value: `${totalPeople} ${totalPeople === 1 ? "person" : "people"}` },
                { label: "Location", value: trip.location.name },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6875rem", color: "#948A7D", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 500, marginBottom: "2px" }}>{label}</p>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.9375rem", color: "#1A1208", fontWeight: 500 }}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Two-column grid for details */}
      <div style={{ display: "grid", gap: "16px" }} className="lg:grid-cols-2">

        {/* Participants */}
        <div style={{ background: "#fff", borderRadius: "18px", border: "1px solid rgba(226,216,194,0.6)", padding: "22px", boxShadow: "0 1px 8px rgba(26,18,8,0.04)" }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1rem", color: "#1A1208", marginBottom: "14px" }}>Participants</h3>
          {booking.participants.map((p) => (
            <div key={p.type} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(226,216,194,0.4)" }}>
              <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.9375rem", color: "#1A1208", textTransform: "capitalize" }}>
                {p.type}s × {p.count}
              </span>
              <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.9375rem", color: "#1A1208", fontWeight: 500 }}>
                {formatCurrency(p.price * p.count, summary.currency)}
              </span>
            </div>
          ))}
        </div>

        {/* Price breakdown */}
        <div style={{ background: "#fff", borderRadius: "18px", border: "1px solid rgba(226,216,194,0.6)", padding: "22px", boxShadow: "0 1px 8px rgba(26,18,8,0.04)" }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1rem", color: "#1A1208", marginBottom: "14px" }}>Price breakdown</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <PriceLine label="Trip subtotal" value={formatCurrency(summary.trip_subtotal, summary.currency)} />
            {summary.addons_subtotal > 0 && (
              <PriceLine label="Add-ons" value={formatCurrency(summary.addons_subtotal, summary.currency)} />
            )}
            <PriceLine label="Taxes & fees" value={formatCurrency(summary.taxes, summary.currency)} />
            <div style={{ height: "1px", background: "rgba(226,216,194,0.6)", margin: "4px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "1rem", color: "#1A1208" }}>Total</span>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", color: "#1A1208", letterSpacing: "-0.02em" }}>
                {formatCurrency(summary.total, summary.currency)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Add-ons */}
      {booking.addons.length > 0 && (
        <div style={{ background: "#fff", borderRadius: "18px", border: "1px solid rgba(226,216,194,0.6)", padding: "22px", boxShadow: "0 1px 8px rgba(26,18,8,0.04)" }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1rem", color: "#1A1208", marginBottom: "14px" }}>Add-ons</h3>
          {booking.addons.map(({ addon, quantity, subtotal }) => (
            <div key={addon.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(226,216,194,0.4)" }}>
              <div>
                <p style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "0.9375rem", color: "#1A1208" }}>{addon.name}</p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.8125rem", color: "#948A7D" }}>× {quantity}</p>
              </div>
              <span style={{ fontFamily: "var(--font-sans)", fontWeight: 500, color: "#1A1208" }}>
                {formatCurrency(subtotal, summary.currency)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Contact info */}
      <div style={{ background: "#fff", borderRadius: "18px", border: "1px solid rgba(226,216,194,0.6)", padding: "22px", boxShadow: "0 1px 8px rgba(26,18,8,0.04)" }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1rem", color: "#1A1208", marginBottom: "14px" }}>Contact details</h3>
        <div style={{ display: "grid", gap: "12px" }} className="sm:grid-cols-2">
          {[
            { label: "Name",  value: `${booking.first_name} ${booking.last_name}` },
            { label: "Email", value: booking.email },
            { label: "Phone", value: booking.phone },
          ].map(({ label, value }) => (
            <div key={label}>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6875rem", color: "#948A7D", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 500, marginBottom: "2px" }}>{label}</p>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.9375rem", color: "#1A1208" }}>{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {booking.voucher_url && (
          <a href={booking.voucher_url}
            style={{ padding: "11px 22px", borderRadius: "12px", background: "#1A1208", color: "#FDFCFA", fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "0.9375rem", textDecoration: "none" }}>
            Download voucher
          </a>
        )}
        <Link href="/help"
          style={{ padding: "11px 22px", borderRadius: "12px", border: "1.5px solid rgba(226,216,194,0.8)", background: "#fff", color: "#7A6E60", fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "0.9375rem", textDecoration: "none" }}>
          Get help
        </Link>
        {(booking.status === "confirmed" || booking.status === "pending") && (
          <button
            onClick={() => setCancelOpen(true)}
            style={{ padding: "11px 22px", borderRadius: "12px", border: "1.5px solid rgba(181,74,44,0.3)", background: "rgba(181,74,44,0.05)", color: "#923A22", fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "0.9375rem", cursor: "pointer", marginLeft: "auto" }}>
            Cancel booking
          </button>
        )}
      </div>

      {/* Cancel confirmation modal */}
      {cancelOpen && (
        <>
          <div style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(26,18,8,0.5)" }} onClick={() => setCancelOpen(false)} />
          <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 310, background: "#FDFCFA", borderRadius: "20px", padding: "32px", maxWidth: "440px", width: "90%", boxShadow: "0 20px 60px rgba(26,18,8,0.25)" }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", color: "#1A1208", marginBottom: "10px" }}>Cancel this booking?</h3>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.9375rem", color: "#7A6E60", lineHeight: 1.65, marginBottom: "24px" }}>
              This will cancel your booking for <strong style={{ color: "#1A1208" }}>{trip.title}</strong> on {formattedDate}. You may be eligible for a refund depending on the cancellation policy.
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => setCancelOpen(false)}
                style={{ flex: 1, padding: "12px", borderRadius: "12px", border: "1.5px solid rgba(226,216,194,0.8)", background: "#fff", color: "#7A6E60", fontFamily: "var(--font-sans)", fontWeight: 500, cursor: "pointer" }}>
                Keep booking
              </button>
              <button
                disabled={cancelMutation.isPending}
                onClick={() => cancelMutation.mutate(
                  { reference: booking.reference },
                  { onSuccess: () => setCancelOpen(false) }
                )}
                style={{ flex: 1, padding: "12px", borderRadius: "12px", background: "#B54A2C", color: "#fff", fontFamily: "var(--font-sans)", fontWeight: 600, border: "none", cursor: "pointer", opacity: cancelMutation.isPending ? 0.6 : 1 }}>
                {cancelMutation.isPending ? "Cancelling…" : "Yes, cancel"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function PriceLine({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "#7A6E60" }}>{label}</span>
      <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "#1A1208", fontWeight: 500 }}>{value}</span>
    </div>
  );
}
