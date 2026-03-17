import { create } from "zustand";
import { INTERVIEWER_PANELS } from "@/config/constants";
import demoData from "@/config/demoData";
import { runDriveAutopilot } from "@/lib/autopilotEngine";
import { analyzeBiasAndFatigue } from "@/lib/biasDetector";
import { generateStudentFeedback } from "@/lib/feedbackGenerator";
import { calculatePlacementProbability } from "@/lib/probabilityEngine";
import { generateInterviewQuestions } from "@/lib/questionGenerator";
import { detectResumeRedFlags } from "@/lib/redFlagDetector";
import { generateInterviewSchedule } from "@/lib/schedulerEngine";
import { scoreStudentAgainstDrive } from "@/lib/scoringEngine";
import { recommendWaitlistPromotion } from "@/lib/smartWaitlist";
import { useStudentStore } from "@/store/studentStore";

const STORAGE_KEY = "placeright-drives";

export const useDriveStore = create((set, get) => ({
  companies: demoData.companies,
  drives: demoData.drives,
  applications: demoData.applications,
  interviewSlots: demoData.interviewSlots,
  interviewEvaluations: demoData.interviewEvaluations,
  interviewerMetrics: demoData.interviewerMetrics,
  studentFeedback: demoData.studentFeedback,
  plagiarismRecords: demoData.plagiarismRecords,
  autopilotResult: null,
  initialized: false,
  initializeDriveData: () => {
    if (get().initialized) return;
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      set({ ...JSON.parse(cached), initialized: true });
      return;
    }
    get().persist();
    set({ initialized: true });
  },
  persist: () => {
    const snapshot = {
      companies: get().companies,
      drives: get().drives,
      applications: get().applications,
      interviewSlots: get().interviewSlots,
      interviewEvaluations: get().interviewEvaluations,
      interviewerMetrics: get().interviewerMetrics,
      studentFeedback: get().studentFeedback,
      plagiarismRecords: useStudentStore.getState().plagiarismRecords
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  },
  syncFromStudents: () => {
    set({ plagiarismRecords: useStudentStore.getState().plagiarismRecords });
    get().persist();
  },
  applyToDrive: ({ driveId, studentId }) => {
    const drive = get().drives.find((item) => item.id === driveId);
    const student = useStudentStore.getState().students.find((item) => item.id === studentId);
    if (!drive || !student) throw new Error("Drive or student not found.");
    const scoring = scoreStudentAgainstDrive(student, drive);
    const competition = get().applications.filter((application) => application.drive_id === driveId);
    const probability = calculatePlacementProbability({
      application: scoring,
      competition,
      historicalApplications: get().applications.filter((application) => application.final_status !== "pending")
    });
    const application = {
      id: `${driveId}-${studentId}`,
      drive_id: driveId,
      drive_role: drive.job_role,
      student_id: studentId,
      student_name: student.parsed_name,
      ...scoring,
      placement_probability: probability.probability,
      probability_details: probability,
      red_flags: detectResumeRedFlags(student, get().plagiarismRecords),
      skill_authenticity_snapshot: student.skill_authenticity,
      suggested_questions: generateInterviewQuestions({
        application: { ...scoring, drive_role: drive.job_role },
        student,
        plagiarismRecords: get().plagiarismRecords
      }),
      screening_status: "pending",
      interview_status: "not_scheduled",
      final_status: "pending",
      applied_at: new Date().toISOString()
    };
    set({
      applications: [...get().applications.filter((item) => item.id !== application.id), application]
    });
    get().persist();
    return application;
  },
  runAutopilot: ({ jdText, baseDrive }) => {
    const result = runDriveAutopilot({
      jdText,
      baseDrive,
      students: useStudentStore.getState().students,
      historicalApplications: get().applications,
      plagiarismRecords: useStudentStore.getState().plagiarismRecords,
      interviewers: INTERVIEWER_PANELS
    });
    const drive = {
      ...result.drive,
      status: "screening",
      total_eligible: result.summary.eligibleCount,
      total_applied: result.applications.length,
      total_shortlisted: result.shortlisted.length
    };
    set({
      drives: [...get().drives.filter((item) => item.id !== drive.id), drive],
      applications: [
        ...get().applications.filter((application) => application.drive_id !== drive.id),
        ...result.applications
      ],
      interviewSlots: [...get().interviewSlots.filter((slot) => slot.drive_id !== drive.id), ...result.schedule],
      autopilotResult: result,
      plagiarismRecords: useStudentStore.getState().plagiarismRecords
    });
    get().persist();
    return result;
  },
  shortlistTopCandidates: ({ driveId, count = 15 }) => {
    const driveApps = get()
      .applications.filter((application) => application.drive_id === driveId)
      .sort((a, b) => b.match_score - a.match_score);
    const shortlistedIds = new Set(driveApps.slice(0, count).map((application) => application.id));
    set({
      applications: get().applications.map((application) =>
        application.drive_id === driveId
          ? {
              ...application,
              screening_status: shortlistedIds.has(application.id) ? "shortlisted" : "filtered_out"
            }
          : application
      )
    });
    get().persist();
  },
  generateSchedule: ({ driveId }) => {
    const drive = get().drives.find((item) => item.id === driveId);
    const shortlisted = get().applications.filter(
      (application) => application.drive_id === driveId && application.screening_status === "shortlisted"
    );
    const waitlisted = get().applications.filter(
      (application) => application.drive_id === driveId && application.screening_status === "waitlisted"
    );
    const schedule = generateInterviewSchedule({
      drive,
      shortlistedApplications: shortlisted,
      standbyApplications: waitlisted,
      interviewers: INTERVIEWER_PANELS
    });
    set({
      interviewSlots: [...get().interviewSlots.filter((slot) => slot.drive_id !== driveId), ...schedule]
    });
    get().persist();
    return schedule;
  },
  submitEvaluation: ({ evaluation }) => {
    const application = get().applications.find((item) => item.id === evaluation.application_id);
    const drive = get().drives.find((item) => item.id === evaluation.drive_id);
    const student = useStudentStore.getState().students.find((item) => item.id === evaluation.student_id);
    const feedback = generateStudentFeedback({ application, evaluation, drive, student });

    const interviewEvaluations = [...get().interviewEvaluations.filter((item) => item.id !== evaluation.id), evaluation];
    const applications = get().applications.map((item) =>
      item.id === evaluation.application_id
        ? {
            ...item,
            interview_status: "completed",
            final_status:
              evaluation.decision === "strong_select" || evaluation.decision === "select"
                ? "selected"
                : evaluation.decision === "waitlist"
                  ? "waitlisted"
                  : "rejected"
          }
        : item
    );
    const health = analyzeBiasAndFatigue(
      interviewEvaluations.filter((item) => item.drive_id === drive.id),
      useStudentStore.getState().students
    );
    const interviewerMetrics = [
      ...get().interviewerMetrics.filter((metric) => metric.drive_id !== drive.id),
      ...health.panels.map((panel) => ({
        id: `${drive.id}-metric-${panel.panelNumber}`,
        drive_id: drive.id,
        interviewer_id: `panel-${panel.panelNumber}`,
        panel_number: panel.panelNumber,
        total_interviews: panel.interviews,
        avg_score: panel.avgScore,
        score_trend: [{ value: panel.scoreTrend }],
        duration_trend: [{ value: panel.durationTrend }],
        bias_alert: panel.biasAlert,
        bias_details: panel.alerts.join(" "),
        fatigue_alert: panel.fatigueAlert,
        fatigue_details: panel.alerts.join(" "),
        updated_at: new Date().toISOString()
      }))
    ];

    set({
      applications,
      interviewEvaluations,
      studentFeedback: [...get().studentFeedback.filter((item) => item.id !== feedback.id), feedback],
      interviewerMetrics
    });
    get().persist();
  },
  dismissPlagiarismAlert: (recordId) => {
    set({
      plagiarismRecords: get().plagiarismRecords.map((record) =>
        record.id === recordId ? { ...record, status: "dismissed" } : record
      )
    });
    get().persist();
  },
  getSmartWaitlistRecommendation: ({ driveId, slotId }) => {
    const slot = get().interviewSlots.find((item) => item.id === slotId);
    const drive = get().drives.find((item) => item.id === driveId);
    const scheduledApplications = get().applications.filter(
      (application) =>
        application.drive_id === driveId &&
        ["shortlisted", "override_included"].includes(application.screening_status)
    );
    const standbyApplications = get().applications.filter(
      (application) => application.drive_id === driveId && application.screening_status === "waitlisted"
    );
    const studentMap = Object.fromEntries(
      useStudentStore.getState().students.map((student) => [student.id, student])
    );
    const noShowApplication = get().applications.find((application) => application.id === slot?.application_id);
    return recommendWaitlistPromotion({
      drive,
      noShowApplication,
      scheduledApplications,
      standbyApplications,
      studentMap
    });
  }
}));
