import MainLayout from "@/components/layout/MainLayout";
import FeedbackGenerator from "@/components/interviews/FeedbackGenerator";
import PerformanceMap from "@/components/interviews/PerformanceMap";
import ResultsBoard from "@/components/interviews/ResultsBoard";
import SelectionManager from "@/components/interviews/SelectionManager";
import { useDriveStore } from "@/store/driveStore";

export default function Results() {
  const { drives, applications, interviewEvaluations, studentFeedback } = useDriveStore();
  const drive = drives.find((item) => item.status === "completed") || drives[0];
  const driveApplications = applications.filter((application) => application.drive_id === drive?.id);
  const evaluations = interviewEvaluations.filter((evaluation) => evaluation.drive_id === drive?.id);
  const feedback = studentFeedback.filter((item) => item.drive_id === drive?.id);

  return (
    <MainLayout title="Results" subtitle="Review outcomes, performance drift, and generated feedback.">
      <div className="grid gap-6 xl:grid-cols-2">
        <ResultsBoard applications={driveApplications} />
        <SelectionManager applications={driveApplications} />
      </div>
      <PerformanceMap evaluations={evaluations} applications={driveApplications} />
      <FeedbackGenerator feedback={feedback} />
    </MainLayout>
  );
}
