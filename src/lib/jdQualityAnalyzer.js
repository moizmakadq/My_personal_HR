import { clamp, round } from "@/lib/utils";
import { parseJDSync } from "@/lib/jdParser";
import { checkEligibility } from "@/lib/scoringEngine";

const vaguePhrases = [
  "good communication skills",
  "dynamic environment",
  "self starter",
  "go getter",
  "fast paced environment",
  "rockstar"
];

export const analyzeJDQuality = (jdText = "", students = []) => {
  const parsed = parseJDSync(jdText);
  const lower = jdText.toLowerCase();

  const clarityPenalty = vaguePhrases.filter((phrase) => lower.includes(phrase)).length * 8;
  const clarityScore = clamp(90 - clarityPenalty + Math.min((parsed.must_have_skills || []).length * 3, 10));

  const completenessChecks = [
    parsed.company,
    parsed.job_role,
    parsed.job_location,
    parsed.ctc_breakdown || parsed.ctc_offered,
    parsed.must_have_skills.length > 0
  ];
  const completenessScore = completenessChecks.reduce((score, check) => score + (check ? 20 : 0), 0);

  let realismScore = 100;
  const unrealisticFindings = [];
  if (/10\+?\s+years/i.test(jdText) || /8\+?\s+years/i.test(jdText)) {
    realismScore -= 50;
    unrealisticFindings.push("JD asks for senior-level experience for a campus drive.");
  }
  if (/must know (everything|all technologies)/i.test(jdText)) {
    realismScore -= 25;
    unrealisticFindings.push("JD demands unrealistic breadth from entry-level candidates.");
  }

  const eligibleCount = students.filter((student) => checkEligibility(student, parsed).eligible).length;
  const ratio = students.length ? eligibleCount / students.length : 0.12;
  let matchPotentialScore = 100;
  let matchPotentialLabel = "Balanced";
  if (ratio < 0.05) {
    matchPotentialScore = 55;
    matchPotentialLabel = "Too restrictive";
  } else if (ratio > 0.7) {
    matchPotentialScore = 62;
    matchPotentialLabel = "Too generic";
  }

  const score = round((clarityScore + completenessScore + realismScore + matchPotentialScore) / 4);
  const suggestions = [];
  if (!parsed.ctc_breakdown && !parsed.ctc_offered) suggestions.push("Add CTC or salary details for transparency.");
  if (!parsed.job_location) suggestions.push("Specify the job location.");
  if (unrealisticFindings.length) suggestions.push("Remove senior-experience requirements for campus hiring.");
  if (ratio < 0.05) suggestions.push("Loosen must-have skills or eligibility filters to widen the pool.");
  if (ratio > 0.7) suggestions.push("Add specific stack expectations to reduce noise.");

  return {
    score,
    details: {
      clarityScore,
      completenessScore,
      realismScore,
      matchPotentialScore,
      eligibleCount,
      totalStudents: students.length,
      ratio: round(ratio * 100, 1),
      matchPotentialLabel,
      unrealisticFindings
    },
    highlights: [
      clarityScore >= 75 ? "Clear role description." : "Role wording is vague.",
      completenessScore >= 80 ? "Core hiring details are present." : "JD misses critical placement details.",
      realismScore >= 80 ? "Requirements look realistic for campus hiring." : "Some asks are unrealistic for freshers."
    ],
    suggestions,
    parsed
  };
};
