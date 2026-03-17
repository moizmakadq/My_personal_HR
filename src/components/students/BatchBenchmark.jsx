import Card from "@/components/ui/Card";
import ScoreBar from "@/components/common/ScoreBar";

export default function BatchBenchmark({ benchmark }) {
  if (!benchmark) return null;
  return (
    <Card className="space-y-4">
      <div>
        <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">Anonymous Batch Benchmark</h3>
        <p className="text-sm text-slate-500">You are ahead of {benchmark.overall}% of comparable peers.</p>
      </div>
      <div className="space-y-3">
        <ScoreBar label="Overall Readiness" value={benchmark.overall} />
        <ScoreBar label="Skill Count" value={benchmark.skills} />
        <ScoreBar label="Project Quality" value={benchmark.projects} />
        <ScoreBar label="Experience" value={benchmark.experience} />
        <ScoreBar label="Academic" value={benchmark.academic} />
      </div>
      <div className="space-y-2">
        {benchmark.tips.map((tip) => (
          <p key={tip} className="text-sm text-slate-600 dark:text-slate-300">
            • {tip}
          </p>
        ))}
      </div>
    </Card>
  );
}
