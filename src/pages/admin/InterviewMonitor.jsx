import MainLayout from "@/components/layout/MainLayout";
import BiasMonitor from "@/components/interviews/BiasMonitor";
import LiveQueue from "@/components/interviews/LiveQueue";
import SmartWaitlistPanel from "@/components/interviews/SmartWaitlistPanel";
import { useDriveStore } from "@/store/driveStore";

export default function InterviewMonitor() {
  const { drives, interviewSlots, applications, interviewerMetrics, getSmartWaitlistRecommendation } = useDriveStore();
  const drive = drives.find((item) => ["screening", "interviewing", "completed"].includes(item.status)) || drives[0];
  const slots = interviewSlots.filter((slot) => slot.drive_id === drive?.id);
  const recommendation = slots[0] ? getSmartWaitlistRecommendation({ driveId: drive.id, slotId: slots[0].id }) : null;

  return (
    <MainLayout title="Interview Monitor" subtitle="Track live queue, panel health, and smart waitlist actions.">
      <div className="grid gap-6 xl:grid-cols-2">
        <LiveQueue slots={slots} applications={applications.filter((application) => application.drive_id === drive?.id)} />
        <BiasMonitor metrics={interviewerMetrics.filter((metric) => metric.drive_id === drive?.id)} />
      </div>
      <SmartWaitlistPanel recommendation={recommendation} />
    </MainLayout>
  );
}
