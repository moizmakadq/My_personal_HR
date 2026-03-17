import MainLayout from "@/components/layout/MainLayout";
import DriveList from "@/components/drives/DriveList";
import { useDriveStore } from "@/store/driveStore";

export default function ManageDrives() {
  const { drives } = useDriveStore();
  return (
    <MainLayout title="Manage Drives" subtitle="Review draft, live, and completed placement drives.">
      <DriveList drives={drives} />
    </MainLayout>
  );
}
