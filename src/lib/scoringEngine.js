import { DEFAULT_DRIVE_WEIGHTS } from "@/config/constants";
import { buildSkillAuthenticity } from "@/lib/skillAuthenticator";
import { keywordMatchScore, round } from "@/lib/utils";

const projectEvidenceScore = (student, requiredSkills = []) => {
  const projects = student.resume_parsed_data?.projects || [];
  if (!projects.length) return 0;

  const scores = projects.map((project) => {
    const techStack = project.tech_stack || [];
    const skillScore = keywordMatchScore(techStack, requiredSkills);
    const descBonus = requiredSkills.filter((skill) =>
      String(project.description || "").toLowerCase().includes(String(skill).toLowerCase())
    ).length;
    return Math.min(skillScore + descBonus * 5, 100);
  });

  return round(scores.reduce((sum, value) => sum + value, 0) / scores.length);
};

const academicScore = (student, drive) => {
  let score = 100;
  const cgpaGap = Math.max(0, Number(drive.min_cgpa || 0) - Number(student.cgpa || 0));
  const tenthGap = Math.max(0, Number(drive.min_tenth || 0) - Number(student.tenth_percentage || 0));
  const twelfthGap = Math.max(0, Number(drive.min_twelfth || 0) - Number(student.twelfth_percentage || 0));
  const backlogGap = Math.max(0, Number(student.backlogs_current || 0) - Number(drive.max_backlogs || 0));
  score -= cgpaGap * 18 + tenthGap * 1.5 + twelfthGap * 1.5 + backlogGap * 20;
  return Math.max(round(score), 0);
};

const experienceFit = (student, drive) => {
  const experiences = student.resume_parsed_data?.experiences || [];
  if (!experiences.length) return 35;
  const requiredSkills = [...(drive.must_have_skills || []), ...(drive.good_to_have_skills || [])];
  const weighted = experiences.map((experience) => {
    const techScore = keywordMatchScore(experience.tech_stack || [], requiredSkills);
    const descHits = requiredSkills.filter((skill) =>
      String(experience.description || "").toLowerCase().includes(String(skill).toLowerCase())
    ).length;
    return Math.min(techScore + descHits * 8, 100);
  });
  return round(weighted.reduce((sum, value) => sum + value, 0) / weighted.length);
};

const authenticityScore = (student) => {
  const skillAuthenticity = student.skill_authenticity || buildSkillAuthenticity(student);
  const values = Object.values(skillAuthenticity);
  if (!values.length) return 0;

  const total = values.reduce((sum, item) => {
    if (item.state === "verified") return sum + 100;
    if (item.state === "partial") return sum + 65;
    return sum + 20;
  }, 0);

  return round(total / values.length);
};

export const checkEligibility = (student, drive) => {
  const reasons = [];
  const departmentEligible =
    !(drive.eligible_departments || []).length ||
    (drive.eligible_departments || []).includes(student.department);
  if (!departmentEligible) reasons.push("Department not eligible.");
  if (Number(student.cgpa || 0) < Number(drive.min_cgpa || 0)) reasons.push("CGPA below threshold.");
  if (Number(student.backlogs_current || 0) > Number(drive.max_backlogs || 0)) reasons.push("Backlogs exceed limit.");
  if (Number(student.tenth_percentage || 0) < Number(drive.min_tenth || 0))
    reasons.push("10th percentage below threshold.");
  if (Number(student.twelfth_percentage || 0) < Number(drive.min_twelfth || 0))
    reasons.push("12th percentage below threshold.");
  if ((drive.allowed_status || ["unplaced"]).length && !(drive.allowed_status || ["unplaced"]).includes(student.placement_status || "unplaced"))
    reasons.push("Placement status does not meet drive rule.");

  return {
    eligible: reasons.length === 0,
    reasons
  };
};

export const scoreStudentAgainstDrive = (student, drive) => {
  const requiredSkills = drive.must_have_skills || [];
  const optionalSkills = drive.good_to_have_skills || [];
  const skillMatch = round(keywordMatchScore(student.skills || [], requiredSkills.length ? requiredSkills : optionalSkills));
  const projectRelevance = projectEvidenceScore(student, [...requiredSkills, ...optionalSkills]);
  const academicFit = academicScore(student, drive);
  const experienceScore = experienceFit(student, drive);
  const trustScore = Number(student.trust_score || 0);
  const authScore = authenticityScore(student);

  const weights = drive.weights || DEFAULT_DRIVE_WEIGHTS;
  const matchScore = round(
    skillMatch * (weights.technical / 100) +
      projectRelevance * (weights.projectDepth / 100) +
      academicFit * (weights.academic / 100) +
      experienceScore * (weights.experience / 100) +
      trustScore * (weights.trust / 100) +
      authScore * (weights.authenticity / 100)
  );

  const interestAlignment = round((projectRelevance + experienceScore) / 2);
  const eligibility = checkEligibility(student, drive);

  return {
    eligible: eligibility.eligible,
    eligibility_details: eligibility.reasons,
    match_score: matchScore,
    skill_match: skillMatch,
    project_relevance: projectRelevance,
    academic_fit: academicFit,
    experience_score: experienceScore,
    interest_alignment: interestAlignment,
    authenticity_score: authScore,
    trust_score_at_application: trustScore,
    match_breakdown: {
      requiredSkills,
      optionalSkills,
      weights,
      eligibilityReasons: eligibility.reasons
    }
  };
};

export const rankApplications = (applications = []) =>
  [...applications].sort((left, right) => right.match_score - left.match_score);
