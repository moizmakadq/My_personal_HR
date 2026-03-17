import Card from "@/components/ui/Card";
import ScoreBar from "@/components/common/ScoreBar";

export default function PlacementPredictor({ predictions = [] }) {
  return (
    <Card className="space-y-4">
      <div>
        <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">Placement Probability</h3>
        <p className="text-sm text-slate-500">Predicted odds are based on match, trust, history, and competition.</p>
      </div>
      <div className="space-y-4">
        {predictions.map((prediction) => (
          <div key={prediction.driveId} className="rounded-3xl border border-slate-200 p-4 dark:border-slate-800">
            <div className="mb-2 flex items-center justify-between gap-3">
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white">{prediction.title}</h4>
                <p className="text-sm text-slate-500">
                  Match {prediction.match}% | Probability {prediction.probability}% | {prediction.band}
                </p>
              </div>
              <div className="text-sm text-slate-500">{prediction.higherRanked} above you</div>
            </div>
            <ScoreBar label="Placement Chance" value={prediction.probability} />
            <div className="mt-2 space-y-1">
              {prediction.suggestions.map((tip) => (
                <p key={tip} className="text-sm text-slate-500">
                  • {tip}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
