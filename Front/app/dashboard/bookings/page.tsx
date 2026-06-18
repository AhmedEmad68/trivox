import type { Metadata } from "next";
import { DashboardLayout } from "@/features/dashboard/DashboardLayout";
import { BookingsList }    from "@/features/dashboard/BookingsList";

export const metadata: Metadata = {
  title:  "My Bookings — TriVox Travel",
  robots: { index: false, follow: false },
};

export default function BookingsPage() {
  return (
    <DashboardLayout>
      <BookingsList />
    </DashboardLayout>
  );
}
