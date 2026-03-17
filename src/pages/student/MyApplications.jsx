import MainLayout from "@/components/layout/MainLayout";
import DataTable from "@/components/common/DataTable";
import StatusBadge from "@/components/common/StatusBadge";
import { useAuthStore } from "@/store/authStore";
import { useDriveStore } from "@/store/driveStore";
import { useStudentStore } from "@/store/studentStore";

export default function MyApplications() {
  const { profile } = useAuthStore();
  const { getStudentByProfileId, students } = useStudentStore();
  const { applications } = useDriveStore();
  const student = getStudentByProfileId(profile?.id) || students[0];
  const mine = applications.filter((application) => application.student_id === student.id);

  return (
    <MainLayout title="My Applications" subtitle="Track screening, scheduling, and final decisions.">
      <DataTable
        columns={[
          { key: "drive_role", label: "Role" },
          { key: "match_score", label: "Match", render: (row) => `${Math.round(row.match_score)}%` },
          { key: "screening_status", label: "Screening", render: (row) => <StatusBadge value={row.screening_status} /> },
          { key: "final_status", label: "Final", render: (row) => <StatusBadge value={row.final_status} /> }
        ]}
        data={mine}
      />
    </MainLayout>
  );
}
