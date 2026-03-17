import Card from "@/components/ui/Card";
import StatusBadge from "@/components/common/StatusBadge";

export default function LiveQueue({ slots = [], applications = [] }) {
  const appMap = Object.fromEntries(applications.map((application) => [application.id, application]));
  return (
    <Card className="space-y-4">
      <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">Live Queue</h3>
      <div className="space-y-3">
        {slots.slice(0, 6).map((slot) => (
          <div key={slot.id} className="flex items-center justify-between gap-3 rounded-3xl border border-slate-200 p-4 dark:border-slate-800">
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">{appMap[slot.application_id]?.student_name}</p>
              <p className="text-sm text-slate-500">
                Panel {slot.panel_number} | {slot.room}
              </p>
            </div>
            <StatusBadge value={slot.status} />
          </div>
        ))}
      </div>
    </Card>
  );
}
