import { detectResumeRedFlags } from "@/lib/redFlagDetector";

export const generateInterviewQuestions = ({ application, student, plagiarismRecords = [] }) => {
  const authenticity = student.skill_authenticity || {};
  const flags = detectResumeRedFlags(student, plagiarismRecords);
  const questions = [];

  Object.values(authenticity)
    .filter((item) => item.state === "unverified")
    .slice(0, 2)
    .forEach((item, index) => {
      questions.push({
        id: `verify-${index}`,
        priority: "verify",
        checked: false,
        prompt: `You list ${item.skill} on your resume without supporting evidence. Explain one production scenario where you used it and walk through the core workflow.`,
        purpose: `${item.skill} is unverified.`
      });
    });

  (student.resume_parsed_data?.projects || [])
    .filter((project) => project.is_team_project || (!project.github_link && !project.live_link))
    .slice(0, 2)
    .forEach((project, index) => {
      questions.push({
        id: `probe-${index}`,
        priority: "probe",
        checked: false,
        prompt: project.is_team_project
          ? `Your ${project.title} project was a team project. Which specific module did you personally build, and how did you validate it?`
          : `Your ${project.title} project has no public link. Can you describe the architecture, APIs, and one difficult bug you fixed?`,
        purpose: project.is_team_project ? "Verify individual contribution." : "Verify project authenticity."
      });
    });

  flags.slice(0, 1).forEach((flag, index) => {
    questions.push({
      id: `flag-${index}`,
      priority: "probe",
      checked: false,
      prompt: `There is a concern on your profile: "${flag.text}" Can you add context with concrete examples?`,
      purpose: "Resolve resume red flags with specifics."
    });
  });

  questions.push({
    id: "role-fit",
    priority: "optional",
    checked: false,
    prompt: `Why are you a fit for ${application.drive_role || "this role"}, and what part of the job excites you most?`,
    purpose: "Measure motivation and role understanding."
  });

  return questions;
};
