import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import TrustScoreBadge from "@/components/common/TrustScoreBadge";

export default function StudentCard({ student, onClick }) {
  return (
    <Card className="cursor-pointer space-y-3" onClick={onClick}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">{student.parsed_name}</h3>
          <p className="text-sm text-slate-500">
            {student.department} | CGPA {student.cgpa} | {student.roll_number}
          </p>
        </div>
        <TrustScoreBadge value={student.trust_score} />
      </div>
      <div className="flex flex-wrap gap-2">
        <Badge tone="sky">{student.skills.length} skills</Badge>
        <Badge tone="slate">{student.percentile_overall}%ile</Badge>
        <Badge tone="emerald">{student.profile_strength}/100 strength</Badge>
      </div>
    </Card>
  );
}
