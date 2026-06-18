import type { Metadata } from "next";
import { HeroSection }        from "@/features/home/HeroSection";
import { CategorySection }    from "@/features/home/CategorySection";
import { FeaturedTrips }      from "@/features/home/FeaturedTrips";
import { DestinationsSection } from "@/features/home/DestinationsSection";
import { HowItWorksSection }  from "@/features/home/HowItWorksSection";
import { TestimonialsSection } from "@/features/home/TestimonialsSection";
import { TrustSection }       from "@/features/home/TrustSection";

// Rendered at request time (not at `next build`) so the live backend isn't
// required during the Docker image build. The container's backend is up at
// runtime, so real data is fetched on first request.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "TriVox — Discover Egypt & Beyond",
  description:
    "Handpicked tours, seamless transfers, and authentic cultural experiences across Egypt. Book with confidence — instant confirmation, free cancellation.",
};

export default function HomePage() {
  return (
    <>
      {/* 1. Full-screen hero with smart search */}
      <HeroSection />

      {/* 2. Three product type categories */}
      <CategorySection />

      {/* 3. Featured trips with type tabs */}
      <FeaturedTrips />

      {/* 4. Popular destinations grid */}
      <DestinationsSection />

      {/* 5. How it works — dark section */}
      <HowItWorksSection />

      {/* 6. Testimonials carousel */}
      <TestimonialsSection />

      {/* 7. Trust badges + newsletter */}
      <TrustSection />
    </>
  );
}
