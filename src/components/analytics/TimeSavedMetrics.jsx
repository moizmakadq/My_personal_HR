import Card from "@/components/ui/Card";

export default function TimeSavedMetrics({ summary }) {
  return (
    <Card className="space-y-4">
      <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">Time Saved</h3>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl bg-brand-50 p-4 dark:bg-brand-900/20">
          <p className="text-sm text-slate-500">Autopilot setup</p>
          <p className="font-display text-3xl font-bold text-slate-900 dark:text-white">{summary.seconds}s</p>
        </div>
        <div className="rounded-3xl bg-amber-50 p-4 dark:bg-amber-900/20">
          <p className="text-sm text-slate-500">Manual baseline</p>
          <p className="font-display text-3xl font-bold text-slate-900 dark:text-white">{summary.manualHours}h</p>
        </div>
        <div className="rounded-3xl bg-emerald-50 p-4 dark:bg-emerald-900/20">
          <p className="text-sm text-slate-500">Hours saved</p>
          <p className="font-display text-3xl font-bold text-slate-900 dark:text-white">{summary.savedHours}h</p>
        </div>
      </div>
    </Card>
  );
}
