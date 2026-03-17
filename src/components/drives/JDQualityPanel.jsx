import Card from "@/components/ui/Card";
import ScoreBar from "@/components/common/ScoreBar";

export default function JDQualityPanel({ analysis }) {
  if (!analysis) return null;
  return (
    <Card className="space-y-4">
      <div>
        <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">JD Quality Analysis</h3>
        <p className="text-sm text-slate-500">Quality score {analysis.score}/100</p>
      </div>
      <ScoreBar label="Clarity" value={analysis.details.clarityScore} />
      <ScoreBar label="Completeness" value={analysis.details.completenessScore} />
      <ScoreBar label="Realism" value={analysis.details.realismScore} />
      <ScoreBar label="Match Potential" value={analysis.details.matchPotentialScore} />
      <div className="space-y-2">
        {analysis.suggestions.map((suggestion) => (
          <p key={suggestion} className="text-sm text-slate-500">
            • {suggestion}
          </p>
        ))}
      </div>
    </Card>
  );
}
