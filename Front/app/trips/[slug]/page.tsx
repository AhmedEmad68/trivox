import type { Metadata } from "next";
import { Suspense }           from "react";
import { TripDetailClient }   from "@/features/trips/TripDetailClient";
import { MOCK_TOUR, MOCK_TRANSFER, MOCK_EXPERIENCE, MOCK_REVIEWS } from "@/lib/mockDetailData";
import type { Trip }          from "@/types";

/* ─── Attempt real API, fall back to mock silently ───────────────── */
async function getTripData(slug: string): Promise<Trip | null> {
  // In production, replace with real API call:
  // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/trips/${slug}/`, { next: { revalidate: 120 } });
  // if (!res.ok) return null;
  // return res.json();

  // Mock fallback — maps slug to the right mock object
  if (slug === "cairo-airport-transfer") return MOCK_TRANSFER as Trip;
  if (slug === "egyptian-cooking-class") return MOCK_EXPERIENCE as Trip;
  return MOCK_TOUR as Trip; // default — tour
}

/* ─── Dynamic metadata ────────────────────────────────────────────── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const trip = await getTripData(slug);

  if (!trip) {
    return { title: "Trip not found — TriVox Travel" };
  }

  return {
    title: `${trip.title} | TriVox Travel`,
    description: trip.description.slice(0, 160),
    openGraph: {
      title:       trip.title,
      description: trip.description.slice(0, 160),
      images:      [{ url: trip.cover_image, width: 1200, height: 630, alt: trip.title }],
      type:        "website",
    },
  };
}

/* ─── Loading skeleton ────────────────────────────────────────────── */
function DetailSkeleton() {
  return (
    <div style={{ paddingTop: "calc(var(--navbar-height) + 20px)" }}>
      <div className="container-trivox">
        {/* Gallery skeleton */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", height: "460px", marginBottom: "32px" }}>
          <div className="skeleton" style={{ borderRadius: "16px 0 0 16px" }} />
          <div style={{ display: "grid", gridTemplateRows: "1fr 1fr", gap: "8px" }}>
            <div className="skeleton" style={{ borderRadius: "0 16px 0 0" }} />
            <div className="skeleton" style={{ borderRadius: "0 0 16px 0" }} />
          </div>
        </div>
        {/* Title skeleton */}
        <div className="skeleton" style={{ height: "40px", width: "70%", borderRadius: "10px", marginBottom: "12px" }} />
        <div className="skeleton" style={{ height: "24px", width: "40%", borderRadius: "8px", marginBottom: "32px" }} />
      </div>
    </div>
  );
}

/* ─── Page component ─────────────────────────────────────────────── */
export default async function TripDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const trip = await getTripData(slug);

  if (!trip) {
    return (
      <div style={{ paddingTop: "calc(var(--navbar-height) + 60px)", textAlign: "center", minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", color: "#1A1208", marginBottom: "12px" }}>Trip not found</h1>
        <p style={{ fontFamily: "var(--font-sans)", color: "#7A6E60", marginBottom: "24px" }}>The trip you&apos;re looking for doesn&apos;t exist or has been removed.</p>
        <a href="/trips" className="btn-primary btn btn-lg">Browse all trips</a>
      </div>
    );
  }

  return (
    <Suspense fallback={<DetailSkeleton />}>
      <TripDetailClient
        trip={trip}
        reviews={MOCK_REVIEWS}
      />
    </Suspense>
  );
}
