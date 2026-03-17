import Progress from "@/components/ui/Progress";
import { barClass, formatPercent } from "@/lib/utils";

export default function ScoreBar({ label, value, hint }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-slate-700 dark:text-slate-200">{label}</span>
        <span className="text-slate-500">{formatPercent(value)}</span>
      </div>
      <Progress value={value} barClassName={barClass(value)} />
      {hint ? <p className="text-xs text-slate-500">{hint}</p> : null}
    </div>
  );
}
