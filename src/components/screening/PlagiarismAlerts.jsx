import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function PlagiarismAlerts({ records = [], onDismiss }) {
  return (
    <Card className="space-y-4">
      <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">Plagiarism Alerts</h3>
      <div className="space-y-3">
        {records
          .filter((record) => record.status === "active")
          .map((record) => (
            <div key={record.id} className="rounded-3xl border border-rose-200 p-4 dark:border-rose-900/30">
              <p className="font-semibold text-slate-900 dark:text-white">
                {record.student_a_name} & {record.student_b_name}
              </p>
              <p className="text-sm text-slate-500">
                {record.match_type.replace("_", " ")} similarity {record.similarity_score}%
              </p>
              <div className="mt-3 flex gap-3">
                <Button variant="secondary" size="sm">
                  View Comparison
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onDismiss?.(record.id)}>
                  Dismiss
                </Button>
              </div>
            </div>
          ))}
      </div>
    </Card>
  );
}
