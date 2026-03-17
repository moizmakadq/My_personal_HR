import MainLayout from "@/components/layout/MainLayout";
import InterviewerDashboard from "@/components/interviews/InterviewerDashboard";
import { useDriveStore } from "@/store/driveStore";

export default function InterviewerDashboardPage() {
  const { interviewSlots, applications } = useDriveStore();
  return (
    <MainLayout title="Interviewer Dashboard" subtitle="Review your assigned interviews and move straight into the room.">
      <InterviewerDashboard slots={interviewSlots.slice(0, 10)} applications={applications} />
    </MainLayout>
  );
}
