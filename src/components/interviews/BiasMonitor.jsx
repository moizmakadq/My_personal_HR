import Card from "@/components/ui/Card";
import ScoreBar from "@/components/common/ScoreBar";

export default function BiasMonitor({ metrics = [] }) {
  return (
    <Card className="space-y-4">
      <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">Bias & Fatigue Monitor</h3>
      <div className="space-y-4">
        {metrics.map((metric) => (
          <div key={metric.id} className="rounded-3xl border border-slate-200 p-4 dark:border-slate-800">
            <p className="font-semibold text-slate-900 dark:text-white">Panel {metric.panel_number}</p>
            <p className="text-sm text-slate-500">
              Avg score {metric.avg_score} | Interviews {metric.total_interviews}
            </p>
            <div className="mt-3 space-y-2">
              <ScoreBar label="Score Trend Health" value={Math.max(0, 100 + (metric.score_trend?.[0]?.value || 0) * 15)} />
              <ScoreBar label="Duration Stability" value={Math.max(0, 100 + (metric.duration_trend?.[0]?.value || 0) * 10)} />
            </div>
            {metric.bias_alert || metric.fatigue_alert ? <p className="mt-2 text-sm text-rose-500">{metric.bias_details || metric.fatigue_details}</p> : null}
          </div>
        ))}
      </div>
    </Card>
  );
}
