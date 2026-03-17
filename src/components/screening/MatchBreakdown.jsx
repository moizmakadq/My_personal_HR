import Card from "@/components/ui/Card";
import ScoreBar from "@/components/common/ScoreBar";

export default function MatchBreakdown({ application }) {
  if (!application) return null;
  return (
    <Card className="space-y-4">
      <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">Match Breakdown</h3>
      <ScoreBar label="Skills" value={application.skill_match} />
      <ScoreBar label="Projects" value={application.project_relevance} />
      <ScoreBar label="Academic" value={application.academic_fit} />
      <ScoreBar label="Experience" value={application.experience_score} />
      <ScoreBar label="Interest" value={application.interest_alignment} />
    </Card>
  );
}
