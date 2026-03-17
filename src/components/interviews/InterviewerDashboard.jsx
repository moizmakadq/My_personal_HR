import Card from "@/components/ui/Card";
import StatusBadge from "@/components/common/StatusBadge";

export default function InterviewerDashboard({ slots = [], applications = [] }) {
  const appMap = Object.fromEntries(applications.map((application) => [application.id, application]));
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {slots.map((slot) => (
        <Card key={slot.id} className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
              {appMap[slot.application_id]?.student_name || slot.student_id}
            </h3>
            <StatusBadge value={slot.status} />
          </div>
          <p className="text-sm text-slate-500">
            Panel {slot.panel_number} | {slot.room}
          </p>
          <p className="text-sm text-slate-500">{slot.start_time}</p>
        </Card>
      ))}
    </div>
  );
}
