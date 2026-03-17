import MainLayout from "@/components/layout/MainLayout";
import CompanyHistory from "@/components/analytics/CompanyHistory";
import CTCDistribution from "@/components/analytics/CTCDistribution";
import DepartmentChart from "@/components/analytics/DepartmentChart";
import DiamondVsTigerChart from "@/components/analytics/DiamondVsTigerChart";
import OverviewDashboard from "@/components/analytics/OverviewDashboard";
import PlacementStats from "@/components/analytics/PlacementStats";
import PlagiarismStats from "@/components/analytics/PlagiarismStats";
import RejectionAnalysis from "@/components/analytics/RejectionAnalysis";
import SkillDemandChart from "@/components/analytics/SkillDemandChart";
import TimeSavedMetrics from "@/components/analytics/TimeSavedMetrics";
import TrendChart from "@/components/analytics/TrendChart";
import TrustScoreDistribution from "@/components/analytics/TrustScoreDistribution";
import { useDriveStore } from "@/store/driveStore";
import { useStudentStore } from "@/store/studentStore";

export default function Analytics() {
  const { drives, applications, interviewEvaluations, plagiarismRecords, companies } = useDriveStore();
  const { students } = useStudentStore();
  const stats = {
    students: students.length,
    activeDrives: drives.filter((drive) => ["upcoming", "screening", "interviewing"].includes(drive.status)).length,
    plagiarism: plagiarismRecords.filter((record) => record.status === "active").length,
    hoursSaved: 28
  };
  const skillCounts = Object.entries(
    students.reduce((accumulator, student) => {
      student.skills.forEach((skill) => {
        accumulator[skill] = (accumulator[skill] || 0) + 1;
      });
      return accumulator;
    }, {})
  )
    .map(([skill, count]) => ({ skill, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const trustBuckets = ["40-50", "50-60", "60-70", "70-80", "80-90", "90-100"].map((bucket, index) => {
    const min = 40 + index * 10;
    const max = min + 10;
    return { bucket, count: students.filter((student) => student.trust_score >= min && student.trust_score < max).length };
  });

  const performanceData = [
    { label: "Diamonds", value: interviewEvaluations.filter((evaluation) => evaluation.performance_category === "diamond").length },
    { label: "Paper Tigers", value: interviewEvaluations.filter((evaluation) => evaluation.performance_category === "paper_tiger").length },
    { label: "Consistent", value: interviewEvaluations.filter((evaluation) => evaluation.performance_category === "consistent").length }
  ];

  return (
    <MainLayout title="Analytics" subtitle="Measure trust, drive performance, bias signals, and placement outcomes.">
      <OverviewDashboard stats={stats} />
      <div className="grid gap-6 xl:grid-cols-2">
        <PlacementStats data={[{ label: "Applied", value: applications.length }, { label: "Selected", value: applications.filter((item) => item.final_status === "selected").length }, { label: "Rejected", value: applications.filter((item) => item.final_status === "rejected").length }]} />
        <SkillDemandChart data={skillCounts} />
        <DepartmentChart data={["CSE", "IT", "ECE", "ME"].map((label) => ({ label, value: students.filter((student) => student.department === label).length }))} />
        <TrustScoreDistribution data={trustBuckets} />
        <DiamondVsTigerChart data={performanceData} />
        <PlagiarismStats total={stats.plagiarism} records={plagiarismRecords.filter((record) => record.status === "active")} />
        <RejectionAnalysis data={[{ label: "Low Match", value: applications.filter((item) => item.match_score < 60).length }, { label: "Low Trust", value: applications.filter((item) => item.trust_score_at_application < 60).length }, { label: "Interview", value: applications.filter((item) => item.final_status === "rejected").length }]} />
        <CTCDistribution data={drives.map((drive) => ({ label: drive.company_name, value: Number(drive.ctc_offered || 0) }))} />
        <CompanyHistory data={companies.map((company) => ({ company: company.name, hires: company.total_hires }))} />
        <TrendChart data={drives.map((drive) => ({ month: drive.drive_date.slice(5, 7), applications: drive.total_applied }))} />
      </div>
      <TimeSavedMetrics summary={{ seconds: 4.2, manualHours: 6, savedHours: 5.9 }} />
    </MainLayout>
  );
}
