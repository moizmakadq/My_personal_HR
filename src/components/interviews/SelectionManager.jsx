import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export default function SelectionManager({ applications = [] }) {
  const selected = applications.filter((application) => application.final_status === "selected");
  const waitlisted = applications.filter((application) => application.final_status === "waitlisted");
  return (
    <Card className="space-y-4">
      <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">Selection Summary</h3>
      <div className="flex gap-3">
        <Badge tone="emerald">{selected.length} selected</Badge>
        <Badge tone="amber">{waitlisted.length} waitlisted</Badge>
      </div>
      <div className="space-y-2">
        {selected.map((application) => (
          <p key={application.id} className="text-sm text-slate-600 dark:text-slate-300">
            {application.student_name}
          </p>
        ))}
      </div>
    </Card>
  );
}
