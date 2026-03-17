import { create } from "zustand";
import demoData from "@/config/demoData";
import { calculateBenchmark, enrichBenchmarkMetrics } from "@/lib/benchmarkEngine";
import { detectPlagiarism } from "@/lib/plagiarismDetector";
import { buildSkillAuthenticity } from "@/lib/skillAuthenticator";
import { calculateResumeTrustScore } from "@/lib/trustScoreEngine";

const STORAGE_KEY = "placeright-students";

const hasRichAuthenticity = (skillAuthenticity = {}) =>
  Object.values(skillAuthenticity || {}).some(
    (value) => value && typeof value === "object" && "state" in value
  );

const hasTrustedBackendScore = (student) =>
  student?.extraction_method === "python_api" &&
  Number(student?.trust_score) > 0 &&
  Object.keys(student?.trust_breakdown || {}).length > 0;

const recalculateStudents = (students) => {
  const withAuthenticity = students.map((student) => ({
    ...student,
    skill_authenticity: hasRichAuthenticity(student.skill_authenticity)
      ? student.skill_authenticity
      : buildSkillAuthenticity(student)
  }));

  const withTrust = withAuthenticity.map((student) => {
    const trust = hasTrustedBackendScore(student)
      ? {
          score: Number(student.trust_score),
          breakdown: student.trust_breakdown || {},
          profileStrength:
            Number(student.profile_strength) ||
            Math.round((Number(student.trust_score) + Number(student.trust_breakdown?.completeness || 0)) / 2)
        }
      : calculateResumeTrustScore(student, withAuthenticity);

    const readiness =
      trust.score * 0.45 +
      Number(student.cgpa || 0) * 7 +
      (student.resume_parsed_data?.projects?.length || 0) * 8 +
      (student.resume_parsed_data?.experiences?.length || 0) * 6;

    return {
      ...student,
      trust_score: trust.score,
      trust_breakdown: trust.breakdown,
      profile_strength: trust.profileStrength,
      readiness_score: readiness
    };
  });

  return {
    students: enrichBenchmarkMetrics(withTrust),
    plagiarismRecords: detectPlagiarism(withTrust)
  };
};

export const useStudentStore = create((set, get) => ({
  students: demoData.students,
  plagiarismRecords: demoData.plagiarismRecords,
  initialized: false,
  initializeStudents: () => {
    if (get().initialized) return;
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      set({ ...JSON.parse(cached), initialized: true });
      return;
    }
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ students: demoData.students, plagiarismRecords: demoData.plagiarismRecords })
    );
    set({ initialized: true });
  },
  persist: () => {
    const { students, plagiarismRecords } = get();
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ students, plagiarismRecords }));
  },
  registerStudent: ({ fullName, rollNumber, email, department, branch }) => {
    const next = {
      id: `student-${Date.now()}`,
      profile_id: `profile-${Date.now()}`,
      full_name: fullName,
      parsed_name: fullName,
      email,
      parsed_email: email,
      parsed_phone: "",
      roll_number: rollNumber,
      department,
      branch,
      degree: "B.Tech",
      university: "National Unity University",
      cgpa: 0,
      tenth_percentage: 0,
      twelfth_percentage: 0,
      graduation_year: 2025,
      backlogs_current: 0,
      skills: [],
      skill_categories: {},
      resume_raw_text: "",
      resume_parsed_data: { education: {}, projects: [], experiences: [], certifications: [] },
      resume_url: "",
      resume_uploaded_at: "",
      video_url: "",
      video_uploaded_at: "",
      github_url: "",
      linkedin_url: "",
      portfolio_url: "",
      trust_score: 0,
      trust_breakdown: {},
      skill_authenticity: {},
      readiness_score: 0,
      percentile_overall: 0,
      percentile_skills: 0,
      percentile_projects: 0,
      percentile_experience: 0,
      placement_status: "unplaced",
      profile_completion: 20,
      profile_strength: 0
    };
    const recalculated = recalculateStudents([...get().students, next]);
    set({ students: recalculated.students, plagiarismRecords: recalculated.plagiarismRecords });
    get().persist();
    return recalculated.students.find((student) => student.id === next.id);
  },
  replaceResume: ({ studentId, parsedData, resumeUrl, uploadedAt }) => {
    const updatedStudents = get().students.map((student) =>
      student.id === studentId
        ? {
            ...student,
            ...parsedData,
            resume_url: resumeUrl,
            resume_uploaded_at: uploadedAt,
            updated_at: uploadedAt
          }
        : student
    );
    const recalculated = recalculateStudents(updatedStudents);
    set({ students: recalculated.students, plagiarismRecords: recalculated.plagiarismRecords });
    get().persist();
  },
  uploadVideo: ({ studentId, videoUrl, uploadedAt }) => {
    set({
      students: get().students.map((student) =>
        student.id === studentId
          ? { ...student, video_url: videoUrl, video_uploaded_at: uploadedAt, updated_at: uploadedAt }
          : student
      )
    });
    get().persist();
  },
  bulkUploadStudents: (newStudents) => {
    const recalculated = recalculateStudents([...get().students, ...newStudents]);
    set({ students: recalculated.students, plagiarismRecords: recalculated.plagiarismRecords });
    get().persist();
  },
  getStudentById: (studentId) => get().students.find((student) => student.id === studentId),
  getStudentByProfileId: (profileId) => get().students.find((student) => student.profile_id === profileId),
  getStudentBenchmark: (studentId) => {
    const student = get().students.find((item) => item.id === studentId);
    if (!student) return null;
    return calculateBenchmark(student, get().students);
  }
}));
