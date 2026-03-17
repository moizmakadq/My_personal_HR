import { AUTHENTICITY_STATES } from "@/config/constants";
import { titleCase } from "@/lib/utils";

const buildEvidenceBucket = (student) => {
  const parsed = student.resume_parsed_data || {};
  const projects = parsed.projects || [];
  const experiences = parsed.experiences || [];
  const certifications = parsed.certifications || [];

  return {
    projects,
    experiences,
    certifications
  };
};

const includesSkill = (haystack, skill) => {
  const normalizedHaystack = String(haystack || "").toLowerCase();
  return normalizedHaystack.includes(String(skill).toLowerCase());
};

const projectMentionsSkill = (project, skill) =>
  (project.tech_stack || []).some((item) => includesSkill(item, skill)) ||
  includesSkill(project.title, skill) ||
  includesSkill(project.description, skill);

const experienceMentionsSkill = (experience, skill) =>
  (experience.tech_stack || []).some((item) => includesSkill(item, skill)) ||
  includesSkill(experience.role, skill) ||
  includesSkill(experience.description, skill);

const certificationMentionsSkill = (certification, skill) =>
  includesSkill(certification.title, skill) || includesSkill(certification.issuing_organization, skill);

export const buildSkillAuthenticity = (student) => {
  const skills = student.skills || [];
  const evidence = buildEvidenceBucket(student);

  return skills.reduce((accumulator, skill) => {
    const hasProject = evidence.projects.some((project) => projectMentionsSkill(project, skill));
    const hasExperience = evidence.experiences.some((experience) =>
      experienceMentionsSkill(experience, skill)
    );
    const hasCertification = evidence.certifications.some((certification) =>
      certificationMentionsSkill(certification, skill)
    );

    let state = AUTHENTICITY_STATES.UNVERIFIED;
    let confidence = "low";
    let reason = "Listed on resume with no supporting project, internship, or certification evidence.";

    if (hasProject && (hasExperience || hasCertification)) {
      state = AUTHENTICITY_STATES.VERIFIED;
      confidence = "high";
      reason = `Used in ${hasProject ? "projects" : ""}${hasProject && hasExperience ? " + " : ""}${
        hasExperience ? "experience" : ""
      }${hasCertification ? `${hasProject || hasExperience ? " + " : ""}certifications` : ""}.`;
    } else if (hasProject || hasExperience || hasCertification) {
      state = AUTHENTICITY_STATES.PARTIAL;
      confidence = "medium";
      reason = `Supported by ${[hasProject && "projects", hasExperience && "experience", hasCertification && "certifications"]
        .filter(Boolean)
        .join(", ")} only.`;
    }

    accumulator[skill] = {
      skill: titleCase(skill),
      state,
      confidence,
      evidence: {
        projects: hasProject,
        experience: hasExperience,
        certifications: hasCertification
      },
      reason
    };

    return accumulator;
  }, {});
};

export const summarizeSkillAuthenticity = (skillAuthenticity = {}) =>
  Object.values(skillAuthenticity).map((item) => ({
    label: item.skill,
    value: item.state,
    confidence: item.confidence,
    reason: item.reason
  }));
