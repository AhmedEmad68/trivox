import type { Metadata } from "next";
import { DashboardLayout }  from "@/features/dashboard/DashboardLayout";
import { ProfileSettings }  from "@/features/dashboard/ProfileSettings";

export const metadata: Metadata = {
  title:  "Profile Settings — TriVox Travel",
  robots: { index: false, follow: false },
};

export default function ProfilePage() {
  return (
    <DashboardLayout>
      <ProfileSettings />
    </DashboardLayout>
  );
}
