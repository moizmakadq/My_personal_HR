import Card from "@/components/ui/Card";
import ScoreBar from "@/components/common/ScoreBar";

const labels = {
  skill_evidence: "Skill Evidence",
  project_depth: "Project Depth",
  timeline: "Timeline",
  skill_count: "Skill Reasonability",
  completeness: "Completeness",
  uniqueness: "Uniqueness"
};

export default function TrustScorePanel({ student, studentView = false }) {
  return (
    <Card className="space-y-4">
      <div>
        <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
          {studentView ? "Profile Strength" : "Resume Trust Score"}
        </h3>
        <p className="text-sm text-slate-500">
          {studentView ? `${student.profile_strength}/100 strength` : `${student.trust_score}/100 trust`}
        </p>
      </div>
      {Object.entries(student.trust_breakdown || {}).map(([key, value]) => (
        <ScoreBar key={key} label={labels[key] || key} value={value} />
      ))}
    </Card>
  );
}
