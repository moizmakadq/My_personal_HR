import { Briefcase, Clock3, ShieldAlert, Users } from "lucide-react";
import StatCard from "@/components/common/StatCard";

export default function OverviewDashboard({ stats }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatCard icon={Users} label="Students" value={stats.students} hint="Profiles available for screening" />
      <StatCard icon={Briefcase} label="Active Drives" value={stats.activeDrives} hint="Upcoming + screening + interviewing" />
      <StatCard icon={ShieldAlert} label="Plagiarism Alerts" value={stats.plagiarism} hint="Active similarity warnings" />
      <StatCard icon={Clock3} label="Hours Saved" value={stats.hoursSaved} hint="Autopilot vs manual workflow" />
    </div>
  );
}
