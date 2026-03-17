import MainLayout from "@/components/layout/MainLayout";
import ScreeningDashboard from "@/components/screening/ScreeningDashboard";
import { useDriveStore } from "@/store/driveStore";

export default function Screening() {
  const { drives } = useDriveStore();
  const drive = drives.find((item) => item.status === "screening") || drives[0];

  return (
    <MainLayout title="Screening" subtitle="Rank, inspect, and shortlist the best candidates for interview.">
      <ScreeningDashboard driveId={drive?.id} />
    </MainLayout>
  );
}
