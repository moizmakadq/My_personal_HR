import { Gauge, ShieldCheck, Trophy } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import BatchBenchmark from "@/components/students/BatchBenchmark";
import PlacementPredictor from "@/components/students/PlacementPredictor";
import StatCard from "@/components/common/StatCard";
import { useAuthStore } from "@/store/authStore";
import { useDriveStore } from "@/store/driveStore";
import { useStudentStore } from "@/store/studentStore";

export default function StudentDashboard() {
  const { profile } = useAuthStore();
  const { getStudentByProfileId, getStudentBenchmark } = useStudentStore();
  const { drives, applications } = useDriveStore();
  const student = getStudentByProfileId(profile?.id) || useStudentStore.getState().students[0];
  const benchmark = getStudentBenchmark(student.id);
  const predictions = drives
    .filter((drive) => ["upcoming", "screening"].includes(drive.status))
    .map((drive) => {
      const application = applications.find((item) => item.drive_id === drive.id && item.student_id === student.id);
      return application
        ? {
            driveId: drive.id,
            title: drive.title,
            match: Math.round(application.match_score),
            probability: Math.round(application.placement_probability),
            band: application.probability_details?.band || "Medium",
            higherRanked: application.probability_details?.higherRanked || 0,
            suggestions: application.probability_details?.suggestions || []
          }
        : null;
    })
    .filter(Boolean);

  return (
    <MainLayout title="Student Dashboard" subtitle="Track profile strength, batch standing, and placement probability.">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard icon={Gauge} label="Profile Strength" value={`${Math.round(student.profile_strength)}/100`} />
        <StatCard icon={ShieldCheck} label="Trust Score" value={`${Math.round(student.trust_score)}/100`} />
        <StatCard icon={Trophy} label="Batch Standing" value={`Top ${100 - Math.round(benchmark?.overall || 0)}%`} />
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <BatchBenchmark benchmark={benchmark} />
        <PlacementPredictor predictions={predictions} />
      </div>
    </MainLayout>
  );
}
