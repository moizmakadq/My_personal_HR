import { useMemo, useState } from "react";
import BulkShortlist from "@/components/screening/BulkShortlist";
import CandidateDetail from "@/components/screening/CandidateDetail";
import CandidateRankList from "@/components/screening/CandidateRankList";
import PlagiarismAlerts from "@/components/screening/PlagiarismAlerts";
import { useDriveStore } from "@/store/driveStore";
import { useStudentStore } from "@/store/studentStore";

export default function ScreeningDashboard({ driveId }) {
  const { applications, shortlistTopCandidates, plagiarismRecords, dismissPlagiarismAlert } = useDriveStore();
  const { students } = useStudentStore();
  const driveApplications = useMemo(
    () => applications.filter((application) => !driveId || application.drive_id === driveId),
    [applications, driveId]
  );
  const [selected, setSelected] = useState(driveApplications[0] || null);
  const student = students.find((item) => item.id === selected?.student_id);

  return (
    <div className="space-y-6">
      <BulkShortlist onRun={() => driveId && shortlistTopCandidates({ driveId, count: 15 })} />
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <CandidateRankList applications={driveApplications} onSelect={setSelected} />
          <PlagiarismAlerts records={plagiarismRecords} onDismiss={dismissPlagiarismAlert} />
        </div>
        <CandidateDetail application={selected} student={student} />
      </div>
    </div>
  );
}
