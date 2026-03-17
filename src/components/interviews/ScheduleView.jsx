import DataTable from "@/components/common/DataTable";
import StatusBadge from "@/components/common/StatusBadge";

export default function ScheduleView({ slots = [], applications = [] }) {
  const appMap = Object.fromEntries(applications.map((application) => [application.id, application]));
  return (
    <DataTable
      columns={[
        { key: "candidate", label: "Candidate", render: (row) => appMap[row.application_id]?.student_name || row.student_id },
        { key: "panel_number", label: "Panel" },
        { key: "room", label: "Room" },
        { key: "start_time", label: "Start" },
        { key: "status", label: "Status", render: (row) => <StatusBadge value={row.status} /> }
      ]}
      data={slots}
    />
  );
}
