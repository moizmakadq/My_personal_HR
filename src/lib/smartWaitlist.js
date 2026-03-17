import { keywordMatchScore } from "@/lib/utils";

const getUnderrepresentedSkills = ({ drive, scheduledApplications = [], studentMap = {} }) => {
  const requiredSkills = drive.must_have_skills || [];
  const counts = requiredSkills.reduce((accumulator, skill) => ({ ...accumulator, [skill]: 0 }), {});

  scheduledApplications.forEach((application) => {
    const skills = studentMap[application.student_id]?.skills || [];
    requiredSkills.forEach((skill) => {
      if (skills.map((item) => item.toLowerCase()).includes(skill.toLowerCase())) {
        counts[skill] += 1;
      }
    });
  });

  return requiredSkills
    .map((skill) => ({ skill, count: counts[skill] || 0 }))
    .sort((left, right) => left.count - right.count)
    .map((item) => item.skill);
};

export const recommendWaitlistPromotion = ({
  drive,
  noShowApplication,
  scheduledApplications = [],
  standbyApplications = [],
  studentMap = {}
}) => {
  if (!standbyApplications.length) return null;

  const standardNext = [...standbyApplications].sort((a, b) => b.match_score - a.match_score)[0];
  const underrepresentedSkills = getUnderrepresentedSkills({ drive, scheduledApplications, studentMap });

  const scored = standbyApplications.map((application) => {
    const studentSkills = studentMap[application.student_id]?.skills || [];
    const diversityGain = keywordMatchScore(studentSkills, underrepresentedSkills.slice(0, 3));
    return {
      ...application,
      diversity_gain: diversityGain,
      smart_score: application.match_score * 0.7 + diversityGain * 0.3
    };
  });

  const smartPick = [...scored].sort((a, b) => b.smart_score - a.smart_score)[0];

  return {
    noShowApplication,
    standardNext,
    smartPick,
    recommended: smartPick,
    reason: `Pool is thin on ${underrepresentedSkills.slice(0, 2).join(" and ")}. ${
      studentMap[smartPick.student_id]?.parsed_name || "This candidate"
    } fills those gaps better than the standard next-by-score pick.`
  };
};
