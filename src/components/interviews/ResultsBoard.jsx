import Card from "@/components/ui/Card";
import StatusBadge from "@/components/common/StatusBadge";

export default function ResultsBoard({ applications = [] }) {
  return (
    <Card className="space-y-4">
      <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">Results Board</h3>
      <div className="space-y-3">
        {applications
          .filter((application) => application.final_status !== "pending")
          .map((application) => (
            <div key={application.id} className="flex items-center justify-between gap-3 rounded-3xl border border-slate-200 p-4 dark:border-slate-800">
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">{application.student_name}</p>
                <p className="text-sm text-slate-500">Match {Math.round(application.match_score)}%</p>
              </div>
              <StatusBadge value={application.final_status} />
            </div>
          ))}
      </div>
    </Card>
  );
}
