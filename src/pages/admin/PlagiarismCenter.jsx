import MainLayout from "@/components/layout/MainLayout";
import PlagiarismAlerts from "@/components/screening/PlagiarismAlerts";
import { useDriveStore } from "@/store/driveStore";

export default function PlagiarismCenter() {
  const { plagiarismRecords, dismissPlagiarismAlert } = useDriveStore();
  return (
    <MainLayout title="Plagiarism Center" subtitle="Review suspicious resume clones and dismiss false positives.">
      <PlagiarismAlerts records={plagiarismRecords} onDismiss={dismissPlagiarismAlert} />
    </MainLayout>
  );
}
