import MainLayout from "@/components/layout/MainLayout";
import ScheduleGenerator from "@/components/interviews/ScheduleGenerator";
import ScheduleView from "@/components/interviews/ScheduleView";
import { useDriveStore } from "@/store/driveStore";

export default function Scheduling() {
  const { drives, interviewSlots, applications } = useDriveStore();
  const drive = drives.find((item) => ["screening", "upcoming", "interviewing"].includes(item.status)) || drives[0];
  return (
    <MainLayout title="Scheduling" subtitle="Generate panels, slots, and standby candidates for the drive.">
      <ScheduleGenerator driveId={drive?.id} />
      <ScheduleView
        slots={interviewSlots.filter((slot) => slot.drive_id === drive?.id)}
        applications={applications.filter((application) => application.drive_id === drive?.id)}
      />
    </MainLayout>
  );
}
