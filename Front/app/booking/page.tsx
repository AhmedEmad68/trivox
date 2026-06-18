import type { Metadata } from "next";
import { Suspense }      from "react";
import { BookingClient } from "@/features/booking/BookingClient";

export const metadata: Metadata = {
  title: "Complete Your Booking — TriVox Travel",
  description: "Secure your spot in just a few steps. Instant confirmation, free cancellation on most trips.",
  robots: { index: false, follow: false }, // Don't index the booking funnel
};

function BookingSkeleton() {
  return (
    <div style={{ paddingTop: "var(--navbar-height)" }}>
      <div style={{ background: "#1A1208", height: "96px" }} />
      <div style={{ background: "#fff", height: "80px", borderBottom: "1px solid rgba(226,216,194,0.45)" }} />
      <div className="container-trivox" style={{ paddingTop: "40px" }}>
        <div style={{ maxWidth: "640px" }}>
          <div className="skeleton" style={{ height: "28px", width: "200px", borderRadius: "8px", marginBottom: "24px" }} />
          <div className="skeleton" style={{ height: "400px", borderRadius: "18px" }} />
        </div>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<BookingSkeleton />}>
      <BookingClient />
    </Suspense>
  );
}
