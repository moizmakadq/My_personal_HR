import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import StatusBadge from "@/components/common/StatusBadge";

export default function DriveDetail({ drive }) {
  if (!drive) return null;
  return (
    <Card className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">{drive.title}</h2>
          <p className="text-sm text-slate-500">
            {drive.company_name} | {drive.job_role} | {drive.job_location}
          </p>
        </div>
        <StatusBadge value={drive.status} />
      </div>
      <div className="flex flex-wrap gap-2">
        <Badge tone="emerald">{drive.total_shortlisted} shortlisted</Badge>
        <Badge tone="sky">{drive.total_applied} applied</Badge>
        <Badge tone="amber">JD {Math.round(drive.jd_quality_score || 0)}</Badge>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-300">{drive.job_description || drive.jd_raw_text}</p>
    </Card>
  );
}
