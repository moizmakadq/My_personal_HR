import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export default function JDPreview({ parsed }) {
  if (!parsed) return null;
  return (
    <Card className="space-y-4">
      <div>
        <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">{parsed.company}</h3>
        <p className="text-sm text-slate-500">
          {parsed.job_role} | {parsed.job_location} | CGPA {parsed.min_cgpa}+
        </p>
      </div>
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-wide text-slate-400">Must Have Skills</p>
        <div className="flex flex-wrap gap-2">
          {parsed.must_have_skills.map((skill) => (
            <Badge key={skill} tone="emerald">
              {skill}
            </Badge>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-wide text-slate-400">Good To Have</p>
        <div className="flex flex-wrap gap-2">
          {parsed.good_to_have_skills.map((skill) => (
            <Badge key={skill} tone="sky">
              {skill}
            </Badge>
          ))}
        </div>
      </div>
    </Card>
  );
}
