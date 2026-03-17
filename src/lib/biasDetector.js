import { average, groupBy, round } from "@/lib/utils";

const linearTrend = (values = []) => {
  if (values.length < 3) return 0;
  const firstHalf = average(values.slice(0, Math.ceil(values.length / 2)));
  const secondHalf = average(values.slice(Math.floor(values.length / 2)));
  return round(secondHalf - firstHalf, 2);
};

export const analyzeBiasAndFatigue = (evaluations = [], students = []) => {
  const byPanel = groupBy(evaluations, (evaluation) => evaluation.panel_number || 1);
  const studentMap = students.reduce((map, student) => ({ ...map, [student.id]: student }), {});
  const panels = Object.entries(byPanel).map(([panelNumber, items]) => {
    const totals = items.map((item) => Number(item.weighted_total || 0));
    const durations = items.map((item) => Number(item.actual_duration || 0));
    const departmentGroups = groupBy(items, (item) => studentMap[item.student_id]?.department || "Unknown");
    const departmentScores = Object.entries(departmentGroups).map(([department, scores]) => ({
      department,
      avg: average(scores.map((item) => Number(item.weighted_total || 0)))
    }));
    const highestDepartment = [...departmentScores].sort((a, b) => b.avg - a.avg)[0];
    const lowestDepartment = [...departmentScores].sort((a, b) => a.avg - b.avg)[0];
    const departmentBias =
      highestDepartment && lowestDepartment ? round(highestDepartment.avg - lowestDepartment.avg, 2) : 0;
    const scoreTrend = linearTrend(totals);
    const durationTrend = linearTrend(durations);
    const avgScore = round(average(totals));
    const avgDuration = round(average(durations));

    const alerts = [];
    if (Math.abs(scoreTrend) >= 1) alerts.push(`Score trend shift detected (${scoreTrend > 0 ? "+" : ""}${scoreTrend}).`);
    if (scoreTrend <= -1) alerts.push("Fatigue signal: scores are declining across the day.");
    if (durationTrend <= -4) alerts.push("Interview duration is falling. Candidates may be rushed.");
    if (avgScore >= 8.5 || avgScore <= 4) alerts.push("Scoring pattern shows weak differentiation.");
    if (departmentBias >= 1.5) {
      alerts.push(
        `Possible department bias: ${highestDepartment.department} avg ${highestDepartment.avg} vs ${lowestDepartment.department} avg ${lowestDepartment.avg}.`
      );
    }

    return {
      panelNumber: Number(panelNumber),
      interviews: items.length,
      avgScore,
      avgDuration,
      scoreTrend,
      durationTrend,
      fatigueAlert: scoreTrend <= -1 || durationTrend <= -4,
      biasAlert: avgScore >= 8.5 || avgScore <= 4 || departmentBias >= 1.5,
      alerts
    };
  });

  const panelVariance =
    panels.length > 1
      ? round(Math.max(...panels.map((panel) => panel.avgScore)) - Math.min(...panels.map((panel) => panel.avgScore)))
      : 0;

  return {
    panels,
    panelVariance,
    globalAlerts: [
      ...(panelVariance > 1 ? [`Panel score variance too high at ${panelVariance} points.`] : []),
      ...panels.filter((panel) => panel.fatigueAlert).map((panel) => `Panel ${panel.panelNumber} should take a break.`)
    ]
  };
};
