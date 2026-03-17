import Card from "@/components/ui/Card";
import Timer from "@/components/common/Timer";

export default function InterviewTimer({ minutes = 20 }) {
  return (
    <Card className="text-center">
      <div className="text-sm uppercase tracking-wide text-slate-400">Interview Timer</div>
      <div className="mt-2 font-display text-4xl font-bold text-slate-900 dark:text-white">
        <Timer seconds={minutes * 60} />
      </div>
    </Card>
  );
}
