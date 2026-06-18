import type { Metadata } from "next";
import { DashboardLayout }   from "@/features/dashboard/DashboardLayout";
import { DashboardOverview } from "@/features/dashboard/DashboardOverview";

export const metadata: Metadata = {
  title:  "My Dashboard — TriVox Travel",
  description: "View your bookings, upcoming trips, and account details.",
  robots: { index: false, follow: false },
};

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <DashboardOverview />
    </DashboardLayout>
  );
}
