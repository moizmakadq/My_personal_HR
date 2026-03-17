import { round } from "@/lib/utils";

const historicalFit = (application, historicalApplications = []) => {
  const comparable = historicalApplications.filter(
    (item) =>
      item.final_status &&
      item.drive_role?.toLowerCase() === application.drive_role?.toLowerCase()
  );
  if (!comparable.length) return 60;

  const selectedScores = comparable
    .filter((item) => ["selected", "offer_accepted"].includes(item.final_status))
    .map((item) => Number(item.match_score || 0));
  if (!selectedScores.length) return 55;

  const threshold = selectedScores.reduce((sum, score) => sum + score, 0) / selectedScores.length;
  return round(Math.max(0, 100 - Math.max(0, threshold - Number(application.match_score || 0)) * 2));
};

export const calculatePlacementProbability = ({
  application,
  competition = [],
  historicalApplications = []
}) => {
  const higherRanked = competition.filter(
    (candidate) => Number(candidate.match_score || 0) > Number(application.match_score || 0)
  ).length;
  const competitionScore = competition.length
    ? round(Math.max(0, 100 - (higherRanked / competition.length) * 100))
    : 70;
  const historyScore = historicalFit(application, historicalApplications);
  const probability = round(
    Number(application.match_score || 0) * 0.4 +
      Number(application.trust_score_at_application || 0) * 0.2 +
      historyScore * 0.25 +
      competitionScore * 0.15
  );

  let band = "Low-Medium";
  if (probability >= 75) band = "Very High";
  else if (probability >= 60) band = "High";
  else if (probability < 40) band = "Low";

  return {
    probability,
    band,
    higherRanked,
    competitionCount: competition.length,
    historyScore,
    suggestions: [
      ...(application.skill_match < 75 ? ["Improve must-have skill coverage before the next drive."] : []),
      ...(application.project_relevance < 70 ? ["Show stronger shipped-project evidence for this stack."] : []),
      ...(application.trust_score_at_application < 70 ? ["Upload a cleaner resume with clearer project proof points."] : [])
    ]
  };
};
