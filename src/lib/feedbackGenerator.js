import { EVALUATION_PARAMETERS } from "@/config/constants";
import { round } from "@/lib/utils";

export const classifyPerformance = (preScore, interviewScore) => {
  if (preScore < 60 && interviewScore >= 75) return "diamond";
  if (preScore >= 75 && interviewScore < 50) return "paper_tiger";
  return "consistent";
};

export const generateStudentFeedback = ({ application, evaluation, drive, student }) => {
  const score_breakdown = EVALUATION_PARAMETERS.reduce((accumulator, parameter) => {
    accumulator[parameter.label] = Number(evaluation?.[parameter.key] || 0);
    return accumulator;
  }, {});

  const lowAreas = EVALUATION_PARAMETERS.filter((parameter) => Number(evaluation?.[parameter.key] || 0) < 6).map(
    (parameter) => parameter.label
  );
  const performance_category = classifyPerformance(application.match_score, evaluation.weighted_total);

  const resources = [];
  if (lowAreas.includes("Technical")) resources.push("Build one deeper project and revisit core DSA patterns.");
  if (lowAreas.includes("Communication")) resources.push("Practice explaining project tradeoffs in 2-minute answers.");
  if (lowAreas.includes("Problem Solving")) resources.push("Use mock interviews with timed whiteboard-style prompts.");
  if (lowAreas.includes("Project Depth")) resources.push("Prepare architecture stories for each listed project.");

  const result =
    evaluation.decision === "strong_select" || evaluation.decision === "select"
      ? "Selected"
      : evaluation.decision === "waitlist"
        ? "Waitlisted"
        : "Rejected";

  return {
    id: `feedback_${application.id}`,
    drive_id: drive.id,
    student_id: student.id,
    application_id: application.id,
    result,
    score_breakdown,
    improvement_areas: lowAreas,
    recommended_resources: resources,
    performance_category,
    summary: `Pre-screen ${round(application.match_score)} vs interview ${round(evaluation.weighted_total)}. Classified as ${performance_category.replace("_", " ")}.`
  };
};
