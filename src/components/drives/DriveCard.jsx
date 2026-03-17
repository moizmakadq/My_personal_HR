import Card from "@/components/ui/Card";
import StatusBadge from "@/components/common/StatusBadge";
import Badge from "@/components/ui/Badge";

export default function DriveCard({ drive, onClick }) {
  return (
    <Card className="cursor-pointer space-y-3" onClick={onClick}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">{drive.title}</h3>
          <p className="text-sm text-slate-500">
            {drive.company_name} | {drive.job_location} | {drive.drive_date}
          </p>
        </div>
        <StatusBadge value={drive.status} />
      </div>
      <div className="flex flex-wrap gap-2">
        <Badge tone="sky">{drive.total_applied} applicants</Badge>
        <Badge tone="emerald">{drive.total_shortlisted} shortlisted</Badge>
        <Badge tone="amber">JD {Math.round(drive.jd_quality_score || 0)}/100</Badge>
      </div>
    </Card>
  );
}
