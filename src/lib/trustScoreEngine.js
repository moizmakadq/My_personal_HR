import { TRUST_WEIGHTS } from "@/config/constants";
import { calculateResumeUniqueness } from "@/lib/plagiarismDetector";
import { round } from "@/lib/utils";

const parseYear = (value = "") => {
  const match = String(value).match(/(20\d{2}|19\d{2})/);
  return match ? Number(match[1]) : null;
};

const getEvidenceText = (student) => {
  const parsed = student.resume_parsed_data || {};
  const projects = parsed.projects || [];
  const experiences = parsed.experiences || [];
  const certifications = parsed.certifications || [];

  return [
    ...projects.flatMap((project) => [project.title, project.description, ...(project.tech_stack || [])]),
    ...experiences.flatMap((experience) => [
      experience.company_name,
      experience.role,
      experience.description,
      ...(experience.tech_stack || [])
    ]),
    ...certifications.flatMap((certification) => [certification.title, certification.issuing_organization])
  ]
    .join(" ")
    .toLowerCase();
};

const calculateSkillEvidence = (student) => {
  const skills = student.skills || [];
  if (!skills.length) return 0;
  const evidenceText = getEvidenceText(student);
  const backed = skills.filter((skill) => evidenceText.includes(skill.toLowerCase())).length;
  return round((backed / skills.length) * 100);
};

const calculateProjectDepth = (student) => {
  const projects = student.resume_parsed_data?.projects || [];
  if (!projects.length) return 0;

  const scores = projects.map((project) => {
    let score = 25;
    const wordCount = (project.description || "").trim().split(/\s+/).filter(Boolean).length;
    if (wordCount > 50) score += 40;
    else if (wordCount > 20) score += 25;
    else if (wordCount > 5) score += 10;
    if (project.github_link || project.live_link) score += 20;
    if ((project.tech_stack || []).length >= 2) score += 15;
    return Math.min(score, 100);
  });

  return round(scores.reduce((sum, value) => sum + value, 0) / scores.length);
};

const calculateTimelineConsistency = (student) => {
  const experiences = student.resume_parsed_data?.experiences || [];
  const education = student.resume_parsed_data?.education || {};
  let score = 100;

  const sortedExperience = [...experiences].sort((a, b) => (parseYear(a.start_date) || 0) - (parseYear(b.start_date) || 0));
  sortedExperience.forEach((item, index) => {
    const currentEnd = parseYear(item.end_date || item.start_date);
    const nextStart = parseYear(sortedExperience[index + 1]?.start_date);
    if (currentEnd && nextStart && currentEnd > nextStart) {
      score -= 20;
    }
  });

  const graduationYear = Number(student.graduation_year || education.graduation_year || 0);
  sortedExperience.forEach((item) => {
    const startYear = parseYear(item.start_date);
    const endYear = parseYear(item.end_date || item.start_date);
    if (graduationYear && endYear && endYear > graduationYear + 1) {
      score -= 20;
    }
    if (startYear && endYear && startYear > endYear) {
      score -= 20;
    }
  });

  return Math.max(score, 0);
};

const calculateSkillCountReasonableness = (student) => {
  const count = (student.skills || []).length;
  if (count <= 8) return 100;
  if (count <= 12) return 80;
  if (count <= 18) return 50;
  return 20;
};

const calculateCompleteness = (student) => {
  const parsed = student.resume_parsed_data || {};
  const checks = [
    student.degree || parsed.education?.degree,
    (student.skills || []).length > 0,
    (parsed.projects || []).length > 0,
    (parsed.experiences || []).length > 0,
    student.parsed_email || student.email || student.parsed_phone
  ];

  return checks.reduce((score, present) => score + (present ? 20 : 0), 0);
};

export const calculateResumeTrustScore = (student, peers = []) => {
  const breakdown = {
    skill_evidence: calculateSkillEvidence(student),
    project_depth: calculateProjectDepth(student),
    timeline: calculateTimelineConsistency(student),
    skill_count: calculateSkillCountReasonableness(student),
    completeness: calculateCompleteness(student),
    uniqueness: calculateResumeUniqueness(student, peers)
  };

  const score = round(
    breakdown.skill_evidence * TRUST_WEIGHTS.skill_evidence +
      breakdown.project_depth * TRUST_WEIGHTS.project_depth +
      breakdown.timeline * TRUST_WEIGHTS.timeline +
      breakdown.skill_count * TRUST_WEIGHTS.skill_count +
      breakdown.completeness * TRUST_WEIGHTS.completeness +
      breakdown.uniqueness * TRUST_WEIGHTS.uniqueness
  );

  return {
    score,
    breakdown,
    profileStrength: Math.round((score + breakdown.completeness) / 2),
    label: score >= 80 ? "High Trust" : score >= 60 ? "Moderate Trust" : "Low Trust"
  };
};
