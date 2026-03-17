import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export default function SkillMatchVisual({ application }) {
  if (!application) return null;
  const required = application.match_breakdown?.requiredSkills || [];
  const optional = application.match_breakdown?.optionalSkills || [];
  const authentic = application.skill_authenticity_snapshot || {};
  return (
    <Card className="space-y-4">
      <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">Skill Match</h3>
      <div>
        <p className="mb-2 text-xs uppercase tracking-wide text-slate-400">Required</p>
        <div className="flex flex-wrap gap-2">
          {required.map((skill) => (
            <Badge key={skill} tone={authentic[skill]?.state === "verified" ? "emerald" : "amber"}>
              {skill}
            </Badge>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-2 text-xs uppercase tracking-wide text-slate-400">Good to Have</p>
        <div className="flex flex-wrap gap-2">
          {optional.map((skill) => (
            <Badge key={skill} tone="sky">
              {skill}
            </Badge>
          ))}
        </div>
      </div>
    </Card>
  );
}
