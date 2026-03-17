import { analyzeJDQuality } from "@/lib/jdQualityAnalyzer";
import { calculatePlacementProbability } from "@/lib/probabilityEngine";
import { generateInterviewQuestions } from "@/lib/questionGenerator";
import { detectResumeRedFlags } from "@/lib/redFlagDetector";
import { generateInterviewSchedule } from "@/lib/schedulerEngine";
import { scoreStudentAgainstDrive } from "@/lib/scoringEngine";
import { uid } from "@/lib/utils";

export const runDriveAutopilot = ({
  jdText,
  baseDrive = {},
  students = [],
  historicalApplications = [],
  plagiarismRecords = [],
  interviewers = []
}) => {
  const startedAt = performance.now();
  const quality = analyzeJDQuality(jdText, students);
  const drive = {
    id: baseDrive.id || uid("drive"),
    title: baseDrive.title || `${quality.parsed.company} ${quality.parsed.job_role}`,
    company_name: quality.parsed.company,
    drive_date: baseDrive.drive_date || new Date().toISOString().slice(0, 10),
    num_panels: baseDrive.num_panels || 2,
    interview_duration: baseDrive.interview_duration || 20,
    buffer_minutes: baseDrive.buffer_minutes || 5,
    interview_start_time: baseDrive.interview_start_time || "10:00",
    rooms: baseDrive.rooms || ["Panel A", "Panel B"],
    weight_technical: 30,
    weight_problem_solving: 25,
    weight_communication: 20,
    weight_project_depth: 15,
    weight_cultural_fit: 10,
    ...quality.parsed,
    ...baseDrive,
    autopilot_used: true,
    jd_quality_score: quality.score,
    jd_quality_details: quality.details
  };

  const eligibleStudents = students
    .map((student) => ({
      student,
      scoring: scoreStudentAgainstDrive(student, drive)
    }))
    .filter((item) => item.scoring.eligible);

  const applications = eligibleStudents.map(({ student, scoring }) => {
    const snapshot = {
      id: uid("app"),
      drive_id: drive.id,
      student_id: student.id,
      drive_role: drive.job_role,
      ...scoring,
      red_flags: detectResumeRedFlags(student, plagiarismRecords),
      skill_authenticity_snapshot: student.skill_authenticity,
      screening_status: "pending",
      interview_status: "not_scheduled",
      final_status: "pending"
    };
    const probability = calculatePlacementProbability({
      application: snapshot,
      competition: eligibleStudents.map((item) => ({ ...item.scoring })),
      historicalApplications
    });
    snapshot.placement_probability = probability.probability;
    snapshot.probability_details = probability;
    snapshot.suggested_questions = generateInterviewQuestions({
      application: snapshot,
      student,
      plagiarismRecords
    });
    return snapshot;
  });

  const ranked = [...applications].sort((left, right) => right.match_score - left.match_score);
  const shortlistCount = Math.max(baseDrive.selection_target || 15, Math.min(15, ranked.length));
  const shortlisted = ranked.filter((application, index) => index < shortlistCount && application.match_score >= 65);
  const waitlisted = ranked.filter((application, index) => index >= shortlistCount && index < shortlistCount + 3);
  shortlisted.forEach((application) => {
    application.screening_status = "shortlisted";
    application.interview_status = "scheduled";
  });
  waitlisted.forEach((application) => {
    application.screening_status = "waitlisted";
  });

  const schedule = generateInterviewSchedule({
    drive,
    shortlistedApplications: shortlisted,
    standbyApplications: waitlisted,
    interviewers
  });

  const elapsedSeconds = ((performance.now() - startedAt) / 1000).toFixed(1);

  return {
    drive,
    quality,
    applications: ranked,
    shortlisted,
    waitlisted,
    schedule,
    summary: {
      eligibleCount: eligibleStudents.length,
      above75: ranked.filter((item) => item.match_score >= 75).length,
      between50And75: ranked.filter((item) => item.match_score >= 50 && item.match_score < 75).length,
      below50: ranked.filter((item) => item.match_score < 50).length,
      autoShortlisted: shortlisted.length,
      elapsedSeconds
    }
  };
};
