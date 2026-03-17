import Card from "@/components/ui/Card";

export default function DriveTimeline({ drive }) {
  if (!drive) return null;
  const steps = [
    ["JD Parsed", true],
    ["Screening", drive.total_applied > 0],
    ["Shortlisting", drive.total_shortlisted > 0],
    ["Scheduling", drive.status !== "draft"],
    ["Results", drive.status === "completed"]
  ];

  return (
    <Card className="space-y-4">
      <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">Drive Timeline</h3>
      <div className="space-y-3">
        {steps.map(([label, done], index) => (
          <div key={label} className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-full ${done ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"} text-center text-sm font-bold leading-10 text-white`}>
              {index + 1}
            </div>
            <div className="text-sm text-slate-700 dark:text-slate-200">{label}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}
