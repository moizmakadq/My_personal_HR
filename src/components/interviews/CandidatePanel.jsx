import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import ScoreBar from "@/components/common/ScoreBar";
import TrustScoreBadge from "@/components/common/TrustScoreBadge";

const toneMap = { verified: "emerald", partial: "amber", unverified: "rose" };

export default function CandidatePanel({ student, application }) {
  if (!student || !application) return null;
  return (
    <Card className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">{student.parsed_name}</h2>
          <p className="text-sm text-slate-500">
            {student.department} | CGPA {student.cgpa} | Roll {student.roll_number}
          </p>
        </div>
        <TrustScoreBadge value={student.trust_score} />
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <ScoreBar label="Match" value={application.match_score} />
        <ScoreBar label="Trust" value={student.trust_score} />
      </div>
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-wide text-slate-400">Skills</p>
        <div className="flex flex-wrap gap-2">
          {Object.values(student.skill_authenticity || {}).map((item) => (
            <Badge key={item.skill} tone={toneMap[item.state]}>
              {item.skill}
            </Badge>
          ))}
        </div>
      </div>
    </Card>
  );
}
