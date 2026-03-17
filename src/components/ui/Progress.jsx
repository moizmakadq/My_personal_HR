import { cn } from "@/lib/utils";

export default function Progress({ value = 0, className, barClassName }) {
  return (
    <div className={cn("h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800", className)}>
      <div className={cn("h-full rounded-full bg-brand-600 transition-all", barClassName)} style={{ width: `${value}%` }} />
    </div>
  );
}
