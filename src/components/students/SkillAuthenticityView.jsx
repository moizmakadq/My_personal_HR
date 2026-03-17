import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

const toneMap = { verified: "emerald", partial: "amber", unverified: "rose" };
const iconMap = { verified: "✅", partial: "⚠️", unverified: "❌" };

export default function SkillAuthenticityView({ student }) {
  return (
    <Card className="space-y-4">
      <div>
        <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">Skill Authenticity</h3>
        <p className="text-sm text-slate-500">Each skill is graded by evidence in projects, experience, and certifications.</p>
      </div>
      <div className="space-y-3">
        {Object.values(student.skill_authenticity || {}).map((item) => (
          <div key={item.skill} className="flex items-start justify-between gap-3 rounded-3xl border border-slate-200 p-4 dark:border-slate-800">
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">
                {iconMap[item.state]} {item.skill}
              </p>
              <p className="text-sm text-slate-500">{item.reason}</p>
            </div>
            <Badge tone={toneMap[item.state]}>{item.confidence}</Badge>
          </div>
        ))}
      </div>
    </Card>
  );
}
