import MainLayout from "@/components/layout/MainLayout";
import ResultsBoard from "@/components/interviews/ResultsBoard";
import SelectionManager from "@/components/interviews/SelectionManager";
import { useDriveStore } from "@/store/driveStore";

export default function SelectionBoard() {
  const { applications } = useDriveStore();
  return (
    <MainLayout title="Selection Board" subtitle="Review cumulative interview outcomes and pending decisions.">
      <div className="grid gap-6 xl:grid-cols-2">
        <ResultsBoard applications={applications} />
        <SelectionManager applications={applications} />
      </div>
    </MainLayout>
  );
}
