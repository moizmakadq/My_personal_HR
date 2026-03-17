import Card from "@/components/ui/Card";

export default function PlagiarismStats({ total, records = [] }) {
  return (
    <Card className="space-y-4">
      <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">Plagiarism Snapshot</h3>
      <p className="text-sm text-slate-500">{total} active alerts across project titles, skills, descriptions, and full resumes.</p>
      <div className="space-y-2">
        {records.slice(0, 4).map((record) => (
          <div key={record.id} className="rounded-3xl border border-slate-200 p-4 text-sm dark:border-slate-800">
            {record.student_a_name} & {record.student_b_name}: {record.match_type} {record.similarity_score}%
          </div>
        ))}
      </div>
    </Card>
  );
}
