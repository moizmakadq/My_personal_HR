import MainLayout from "@/components/layout/MainLayout";
import OverviewDashboard from "@/components/analytics/OverviewDashboard";
import AutopilotPanel from "@/components/drives/AutopilotPanel";
import DriveList from "@/components/drives/DriveList";
import { useDriveStore } from "@/store/driveStore";
import { useStudentStore } from "@/store/studentStore";

export default function AdminDashboard() {
  const { drives, plagiarismRecords } = useDriveStore();
  const { students } = useStudentStore();
  const stats = {
    students: students.length,
    activeDrives: drives.filter((drive) => ["upcoming", "screening", "interviewing"].includes(drive.status)).length,
    plagiarism: plagiarismRecords.filter((record) => record.status === "active").length,
    hoursSaved: 28
  };

  return (
    <MainLayout title="Admin Dashboard" subtitle="Run trusted placement drives from one control room.">
      <OverviewDashboard stats={stats} />
      <AutopilotPanel />
      <DriveList drives={drives.slice(0, 4)} />
    </MainLayout>
  );
}
