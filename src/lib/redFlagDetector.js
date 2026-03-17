export const detectResumeRedFlags = (student, plagiarismRecords = []) => {
  const flags = [];
  const trust = student.trust_breakdown || {};
  const authenticity = student.skill_authenticity || {};
  const parsed = student.resume_parsed_data || {};

  Object.values(authenticity)
    .filter((item) => item.state === "unverified")
    .slice(0, 3)
    .forEach((item) => flags.push({ severity: "high", text: `${item.skill}: listed with zero evidence.` }));

  (parsed.projects || []).forEach((project) => {
    if (!project.github_link && !project.live_link) {
      flags.push({ severity: "medium", text: `${project.title}: no GitHub or live link provided.` });
    }
    if (project.is_team_project) {
      flags.push({ severity: "medium", text: `${project.title}: verify individual contribution in team project.` });
    }
  });

  if (Number(trust.timeline || 100) < 80) {
    flags.push({ severity: "high", text: "Timeline inconsistencies detected across education or internships." });
  }
  if (Number(trust.skill_count || 100) < 60) {
    flags.push({ severity: "medium", text: "Skill count looks inflated compared with supporting evidence." });
  }

  plagiarismRecords
    .filter((record) => record.student_a_id === student.id || record.student_b_id === student.id)
    .slice(0, 2)
    .forEach((record) => {
      flags.push({
        severity: "high",
        text: `Plagiarism alert: ${record.match_type.replace("_", " ")} similarity ${record.similarity_score}%.`
      });
    });

  return flags;
};
