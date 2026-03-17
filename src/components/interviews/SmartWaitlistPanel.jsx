import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function SmartWaitlistPanel({ recommendation }) {
  if (!recommendation) return null;
  return (
    <Card className="space-y-4">
      <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">Smart Waitlist Promotion</h3>
      <p className="text-sm text-slate-500">{recommendation.reason}</p>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 p-4 dark:border-slate-800">
          <p className="text-sm text-slate-500">Standard next</p>
          <p className="font-semibold text-slate-900 dark:text-white">{recommendation.standardNext?.student_name}</p>
        </div>
        <div className="rounded-3xl border border-emerald-200 p-4 dark:border-emerald-900/30">
          <p className="text-sm text-slate-500">Smart pick</p>
          <p className="font-semibold text-slate-900 dark:text-white">{recommendation.smartPick?.student_name}</p>
        </div>
      </div>
      <div className="flex gap-3">
        <Button>Promote Recommended</Button>
        <Button variant="secondary">Promote By Score</Button>
      </div>
    </Card>
  );
}
