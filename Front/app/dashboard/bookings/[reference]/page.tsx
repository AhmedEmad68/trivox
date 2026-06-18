import type { Metadata } from "next";
import { DashboardLayout } from "@/features/dashboard/DashboardLayout";
import { BookingDetail }   from "@/features/dashboard/BookingDetail";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ reference: string }>;
}): Promise<Metadata> {
  const { reference } = await params;
  return {
    title:  `Booking ${reference} — TriVox Travel`,
    robots: { index: false, follow: false },
  };
}

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const { reference } = await params;

  return (
    <DashboardLayout>
      <BookingDetail reference={reference} />
    </DashboardLayout>
  );
}
