import Card from "@/components/ui/Card";
import ScatterPlot from "@/components/common/ScatterPlot";

export default function PerformanceMap({ evaluations = [], applications = [] }) {
  const appMap = Object.fromEntries(applications.map((application) => [application.id, application]));
  const data = evaluations.map((evaluation) => ({
    id: evaluation.id,
    label: appMap[evaluation.application_id]?.student_name,
    preScore: appMap[evaluation.application_id]?.match_score || 0,
    interviewScore: evaluation.weighted_total,
    category: evaluation.performance_category
  }));

  return (
    <Card className="space-y-4">
      <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">Performance Comparison Map</h3>
      <ScatterPlot data={data} />
    </Card>
  );
}
