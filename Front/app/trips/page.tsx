import type { Metadata } from "next";
import { Suspense }      from "react";
import { TripsClient }   from "@/features/trips/TripsClient";

export const metadata: Metadata = {
  title:       "Explore Trips — Tours, Transfers & Experiences",
  description: "Browse 180+ handpicked tours, private transfers, and cultural experiences across Egypt. Filter by type, price, rating and duration.",
  openGraph: {
    title:       "Explore Trips — TriVox Travel",
    description: "Tours, transfers, and experiences across Egypt.",
    images: [{ url: "/og-trips.jpg", width: 1200, height: 630 }],
  },
};

/* ─── Skeleton placeholder while client component boots ─────────── */
function PageSkeleton() {
  return (
    <div>
      {/* Header skeleton */}
      <div style={{ background: "#1A1208", paddingTop: "calc(var(--navbar-height) + 2rem)", paddingBottom: "2.5rem" }}>
        <div className="container-trivox">
          <div style={{ width: "80px", height: "12px", borderRadius: "6px", background: "rgba(255,255,255,0.1)", marginBottom: "12px" }} />
          <div style={{ width: "280px", height: "44px", borderRadius: "10px", background: "rgba(255,255,255,0.08)" }} />
        </div>
      </div>
      {/* Body skeleton */}
      <div className="container-trivox" style={{ paddingTop: "32px" }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: "18px", marginTop: "48px" }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ borderRadius: "16px", height: "320px" }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function TripsPage() {
  return (
    /* Suspense is required because TripsClient calls useSearchParams() */
    <Suspense fallback={<PageSkeleton />}>
      <TripsClient />
    </Suspense>
  );
}
