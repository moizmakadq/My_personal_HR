import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export default function ParsedDataView({ student }) {
  const parsed = student.resume_parsed_data || {};
  return (
    <Card className="space-y-5">
      <div>
        <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">Extracted Data</h3>
        <p className="text-sm text-slate-500">
          This data was automatically extracted from the resume and cannot be edited directly.
        </p>
      </div>

      <section className="grid gap-4 md:grid-cols-2">
        <div>
          <div className="text-xs uppercase tracking-wide text-slate-400">Personal</div>
          <div className="mt-2 space-y-1 text-sm text-slate-700 dark:text-slate-200">
            <p>{student.parsed_name}</p>
            <p>{student.parsed_email}</p>
            <p>{student.parsed_phone}</p>
          </div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wide text-slate-400">Education</div>
          <div className="mt-2 space-y-1 text-sm text-slate-700 dark:text-slate-200">
            <p>{student.degree}</p>
            <p>{student.university}</p>
            <p>CGPA {student.cgpa}</p>
            <p>12th {student.twelfth_percentage}% | 10th {student.tenth_percentage}%</p>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-2 text-xs uppercase tracking-wide text-slate-400">Skills ({student.skills.length})</div>
        <div className="flex flex-wrap gap-2">
          {student.skills.map((skill) => (
            <Badge key={skill} tone="sky">
              {skill}
            </Badge>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <div className="text-xs uppercase tracking-wide text-slate-400">Projects</div>
        {(parsed.projects || []).map((project) => (
          <div key={project.title} className="rounded-3xl border border-slate-200 p-4 dark:border-slate-800">
            <h4 className="font-semibold text-slate-900 dark:text-white">{project.title}</h4>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{project.description}</p>
            <p className="mt-2 text-xs text-slate-500">{project.tech_stack?.join(", ")}</p>
          </div>
        ))}
      </section>

      <section className="space-y-3">
        <div className="text-xs uppercase tracking-wide text-slate-400">Experience</div>
        {(parsed.experiences || []).map((experience) => (
          <div key={`${experience.company_name}-${experience.role}`} className="rounded-3xl border border-slate-200 p-4 dark:border-slate-800">
            <h4 className="font-semibold text-slate-900 dark:text-white">
              {experience.role} @ {experience.company_name}
            </h4>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{experience.description}</p>
          </div>
        ))}
      </section>
    </Card>
  );
}
