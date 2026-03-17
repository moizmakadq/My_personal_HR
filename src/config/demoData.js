import { DEMO_ACCOUNTS, INTERVIEWER_PANELS } from "@/config/constants";
import { runDriveAutopilot } from "@/lib/autopilotEngine";
import { enrichBenchmarkMetrics } from "@/lib/benchmarkEngine";
import { analyzeBiasAndFatigue } from "@/lib/biasDetector";
import { generateStudentFeedback, classifyPerformance } from "@/lib/feedbackGenerator";
import { detectPlagiarism } from "@/lib/plagiarismDetector";
import { buildSkillAuthenticity } from "@/lib/skillAuthenticator";
import { calculateResumeTrustScore } from "@/lib/trustScoreEngine";
import { round } from "@/lib/utils";

const createId = (prefix, index) => `${prefix}-${String(index).padStart(3, "0")}`;

const names = [
  "Aarav Mehta",
  "Diya Nair",
  "Rahul Kapoor",
  "Amit Sinha",
  "Priya Menon",
  "Sneha Talwar",
  "Vikram Rao",
  "Karan Jain",
  "Ananya Iyer",
  "Rohan Verma",
  "Meera Kulkarni",
  "Sahil Gupta",
  "Nikita Rao",
  "Dev Patel",
  "Ishita Das",
  "Arjun Reddy",
  "Lavanya Krishnan",
  "Pranav Bose",
  "Harshita Singh",
  "Aditya Kulkarni",
  "Pooja Nandan",
  "Ritwik Sen",
  "Vaishnavi Rao",
  "Mohit Bansal",
  "Shruti Chandra",
  "Tejaswini Mallik",
  "Yash Malhotra",
  "Tanvi Chopra",
  "Neeraj Menon",
  "Keerthi Prasad"
];

const departmentSpread = [
  "CSE",
  "CSE",
  "CSE",
  "CSE",
  "CSE",
  "CSE",
  "CSE",
  "CSE",
  "CSE",
  "CSE",
  "CSE",
  "CSE",
  "CSE",
  "CSE",
  "CSE",
  "IT",
  "IT",
  "IT",
  "IT",
  "IT",
  "IT",
  "IT",
  "IT",
  "ECE",
  "ECE",
  "ECE",
  "ECE",
  "ECE",
  "ME",
  "ME"
];

const archetypes = [
  {
    degree: "B.Tech CSE",
    skills: ["JavaScript", "TypeScript", "React", "Node.js", "MongoDB", "Git", "HTML", "CSS"],
    projects: [
      {
        title: "Placement Analytics Hub",
        description:
          "Built a role-based dashboard for placement coordinators with candidate funnels, trust score heatmaps, and CSV exports. Designed reusable React components, Express APIs, and MongoDB aggregations to cut report time significantly.",
        tech_stack: ["React", "Node.js", "MongoDB", "TypeScript"],
        github_link: "https://github.com/demo/placement-analytics-hub",
        live_link: "https://placement-analytics-hub.netlify.app",
        is_team_project: true,
        team_size: 3,
        duration: "4 months"
      },
      {
        title: "Campus Connect",
        description:
          "Created a student networking portal with responsive feeds, authentication, profile cards, and admin moderation. Implemented optimistic UI patterns and deployment-ready environment handling.",
        tech_stack: ["React", "Node.js", "MongoDB", "Tailwind"],
        github_link: "https://github.com/demo/campus-connect",
        live_link: "https://campus-connect-demo.netlify.app",
        is_team_project: false,
        team_size: 1,
        duration: "3 months"
      }
    ],
    experiences: [
      {
        company_name: "SparkStack Labs",
        role: "Frontend Intern",
        description:
          "Built reusable dashboard widgets, optimized loading states, and collaborated with backend engineers on analytics APIs for enterprise dashboards.",
        tech_stack: ["React", "TypeScript", "Git"],
        start_date: "Jun 2024",
        end_date: "Aug 2024",
        duration_months: 3
      }
    ],
    certifications: [
      { title: "Meta Front-End Developer", issuing_organization: "Coursera", issue_date: "2024" }
    ]
  },
  {
    degree: "B.Tech CSE",
    skills: ["Python", "SQL", "Pandas", "NumPy", "Scikit-learn", "Flask", "Git", "Power BI"],
    projects: [
      {
        title: "Crop Yield Predictor",
        description:
          "Built a machine learning pipeline to predict crop yields using weather and soil features. Used Python notebooks for experimentation, Flask for inference APIs, and interactive Power BI dashboards to present insights.",
        tech_stack: ["Python", "Flask", "Pandas", "Scikit-learn", "Power BI"],
        github_link: "https://github.com/demo/crop-yield-predictor",
        live_link: "",
        is_team_project: true,
        team_size: 4,
        duration: "5 months"
      },
      {
        title: "Placement Trend Miner",
        description:
          "Analyzed historical placement outcomes, cleaned messy CSV data, and generated recruiter-wise trend reports with Python scripts, SQL queries, and visualization dashboards.",
        tech_stack: ["Python", "SQL", "Pandas", "Power BI"],
        github_link: "https://github.com/demo/placement-trend-miner",
        live_link: "",
        is_team_project: false,
        team_size: 1,
        duration: "2 months"
      }
    ],
    experiences: [
      {
        company_name: "DataMosaic",
        role: "Data Analyst Intern",
        description:
          "Created ETL scripts, validated dashboards, and automated weekly sales reporting with SQL, Python, and Power BI.",
        tech_stack: ["Python", "SQL", "Power BI"],
        start_date: "May 2024",
        end_date: "Jul 2024",
        duration_months: 3
      }
    ],
    certifications: [
      { title: "Python for Data Science", issuing_organization: "Coursera", issue_date: "2023" },
      { title: "SQL Advanced", issuing_organization: "HackerRank", issue_date: "2024" }
    ]
  },
  {
    degree: "B.Tech IT",
    skills: ["Java", "Spring Boot", "React", "PostgreSQL", "Docker", "AWS", "Git", "Redis"],
    projects: [
      {
        title: "FinFlow Ledger",
        description:
          "Developed a transaction tracking platform with Spring Boot microservices, PostgreSQL persistence, Redis caching, and Dockerized local environments. Added role-based audit screens in React.",
        tech_stack: ["Java", "Spring Boot", "React", "PostgreSQL", "Docker", "Redis"],
        github_link: "https://github.com/demo/finflow-ledger",
        live_link: "",
        is_team_project: true,
        team_size: 4,
        duration: "4 months"
      }
    ],
    experiences: [
      {
        company_name: "CloudNudge",
        role: "Backend Intern",
        description:
          "Built Spring Boot APIs, tuned PostgreSQL queries, and wrote CI pipelines for AWS deployment.",
        tech_stack: ["Java", "Spring Boot", "PostgreSQL", "AWS"],
        start_date: "Jun 2024",
        end_date: "Sep 2024",
        duration_months: 4
      }
    ],
    certifications: [{ title: "AWS Cloud Practitioner", issuing_organization: "Amazon", issue_date: "2024" }]
  },
  {
    degree: "B.Tech ECE",
    skills: ["C++", "Python", "Linux", "Git", "Docker", "AWS", "SQL", "TensorFlow"],
    projects: [
      {
        title: "Vision-Based Quality Check",
        description:
          "Built a computer vision inspection pipeline for assembly-line images using Python, TensorFlow, and OpenCV. Wrapped inference in a lightweight service and logged model outputs for review.",
        tech_stack: ["Python", "TensorFlow", "Docker", "Linux"],
        github_link: "https://github.com/demo/vision-quality-check",
        live_link: "",
        is_team_project: true,
        team_size: 2,
        duration: "6 months"
      }
    ],
    experiences: [
      {
        company_name: "EdgeFab Systems",
        role: "Embedded AI Intern",
        description:
          "Optimized inference scripts on Linux devices, benchmarked latency, and automated reporting for on-device model rollouts.",
        tech_stack: ["Python", "Linux", "TensorFlow"],
        start_date: "May 2024",
        end_date: "Aug 2024",
        duration_months: 4
      }
    ],
    certifications: [{ title: "Deep Learning Specialization", issuing_organization: "Coursera", issue_date: "2024" }]
  },
  {
    degree: "B.Tech ME",
    skills: ["Python", "SQL", "Power BI", "Git", "Docker", "AWS", "React", "Node.js", "Kubernetes", "GraphQL", "MongoDB", "JavaScript", "TypeScript", "Next.js", "Redis"],
    projects: [
      {
        title: "Maintenance Dashboard",
        description:
          "Built a simple dashboard to track machine downtime and maintenance schedules with interactive charts and uploadable incident reports.",
        tech_stack: ["React", "Node.js", "MongoDB"],
        github_link: "",
        live_link: "",
        is_team_project: false,
        team_size: 1,
        duration: "2 months"
      }
    ],
    experiences: [],
    certifications: []
  }
];

const buildResumeText = ({ name, email, phone, student, projects, experiences, certifications }) => {
  const education = `${student.degree} | ${student.university}\nCGPA: ${student.cgpa}\n12th: ${student.twelfth_percentage}\n10th: ${student.tenth_percentage}\nGraduation: ${student.graduation_year}`;
  const skillText = student.skills.join(", ");
  const projectText = projects
    .map(
      (project) =>
        `${project.title}\n${project.description}\nTech: ${(project.tech_stack || []).join(", ")}\n${[
          project.github_link,
          project.live_link
        ]
          .filter(Boolean)
          .join(" ")}`
    )
    .join("\n\n");
  const experienceText = experiences
    .map(
      (experience) =>
        `${experience.role} @ ${experience.company_name}\n${experience.description}\n${(experience.tech_stack || []).join(
          ", "
        )}\n${experience.start_date} - ${experience.end_date}`
    )
    .join("\n\n");
  const certText = certifications
    .map((certification) => `${certification.title}\n${certification.issuing_organization}\n${certification.issue_date}`)
    .join("\n\n");

  return `${name}\n${email} | ${phone}\nhttps://github.com/${name.toLowerCase().replace(/\s+/g, "")}\nhttps://linkedin.com/in/${name
    .toLowerCase()
    .replace(/\s+/g, "")}\n\nEDUCATION\n${education}\n\nSKILLS\n${skillText}\n\nPROJECTS\n${projectText}\n\nEXPERIENCE\n${experienceText}\n\nCERTIFICATIONS\n${certText}`.trim();
};

const createStudent = (name, index) => {
  const archetype = archetypes[index % archetypes.length];
  const department = departmentSpread[index];
  const email = index === 0 ? DEMO_ACCOUNTS.student.email : `${name.toLowerCase().replace(/\s+/g, ".")}@placeright.demo`;
  const skills = [...archetype.skills];
  const projects = JSON.parse(JSON.stringify(archetype.projects));
  const experiences = JSON.parse(JSON.stringify(archetype.experiences));
  const certifications = JSON.parse(JSON.stringify(archetype.certifications));

  if (index === 2 || index === 3) {
    projects[0] = {
      title: "E-Commerce Platform",
      description:
        "Built a full-stack commerce application using React for the frontend and Node.js for the backend with MongoDB storage, JWT auth, product filters, and admin order dashboards.",
      tech_stack: ["React", "Node.js", "MongoDB", "JavaScript"],
      github_link: "https://github.com/demo/ecommerce-platform",
      live_link: "",
      is_team_project: false,
      team_size: 1,
      duration: "4 months"
    };
  }

  if (index === 4 || index === 5) {
    skills.splice(0, skills.length, "Python", "React", "Node.js", "MongoDB", "SQL", "Docker", "AWS", "Git", "HTML", "CSS", "JavaScript", "TypeScript");
  }

  if (index === 6 || index === 7) {
    projects[0].description =
      "Built a web application using React for frontend and Node.js for backend with MongoDB database, role-based login, dashboards, and responsive workflows for student operations.";
  }

  const student = {
    id: createId("student", index + 1),
    profile_id: createId("profile", index + 1),
    email,
    full_name: name,
    parsed_name: name,
    parsed_email: email,
    parsed_phone: `9${String(100000000 + index * 27137).slice(0, 9)}`,
    roll_number: `2021${department}${String(index + 1).padStart(3, "0")}`,
    department,
    branch:
      department === "CSE"
        ? "Core CSE"
        : department === "IT"
          ? "Information Technology"
          : department === "ECE"
            ? "Embedded Systems"
            : "Mechanical Design",
    degree: archetype.degree,
    university: "National Unity University",
    cgpa: round(6 + ((index * 0.27) % 3.5), 2),
    tenth_percentage: round(72 + ((index * 1.9) % 24), 2),
    twelfth_percentage: round(70 + ((index * 2.3) % 25), 2),
    graduation_year: 2025,
    backlogs_current: index % 17 === 0 ? 1 : 0,
    skills,
    skill_categories: {},
    resume_url: `/demo/resumes/${createId("resume", index + 1)}.pdf`,
    resume_uploaded_at: "2026-02-15T10:00:00.000Z",
    video_url: index % 3 === 0 ? `/demo/videos/${createId("video", index + 1)}.webm` : "",
    video_uploaded_at: index % 3 === 0 ? "2026-02-16T12:00:00.000Z" : "",
    github_url: `https://github.com/${name.toLowerCase().replace(/\s+/g, "")}`,
    linkedin_url: `https://linkedin.com/in/${name.toLowerCase().replace(/\s+/g, "")}`,
    portfolio_url: index % 2 === 0 ? `https://${name.toLowerCase().replace(/\s+/g, "")}.dev` : "",
    placement_status: "unplaced",
    placed_company: null,
    placed_ctc: null,
    backlogs: 0,
    created_at: "2026-01-10T09:00:00.000Z",
    updated_at: "2026-02-16T12:00:00.000Z"
  };

  student.resume_parsed_data = {
    education: {
      degree: student.degree,
      university: student.university,
      cgpa: student.cgpa,
      tenth_percentage: student.tenth_percentage,
      twelfth_percentage: student.twelfth_percentage,
      graduation_year: student.graduation_year
    },
    projects,
    experiences,
    certifications
  };
  student.resume_raw_text = buildResumeText({
    name,
    email,
    phone: student.parsed_phone,
    student,
    projects,
    experiences,
    certifications
  });

  return student;
};

let rawStudents = names.map(createStudent);

rawStudents = rawStudents.map((student) => ({
  ...student,
  skill_authenticity: buildSkillAuthenticity(student)
}));

rawStudents = rawStudents.map((student) => {
  const trust = calculateResumeTrustScore(student, rawStudents);
  const completeness =
    (student.parsed_email ? 20 : 0) +
    ((student.resume_parsed_data.projects || []).length ? 20 : 0) +
    ((student.resume_parsed_data.experiences || []).length ? 20 : 0) +
    ((student.resume_parsed_data.certifications || []).length ? 20 : 0) +
    ((student.skills || []).length ? 20 : 0);
  const readiness_score = round(trust.score * 0.45 + student.cgpa * 7 + completeness * 0.2);

  return {
    ...student,
    trust_score: trust.score,
    trust_breakdown: trust.breakdown,
    resume_fingerprint: `${student.id}-${Math.round(trust.score * 1000)}`,
    readiness_score,
    profile_completion: Math.min(100, completeness),
    profile_strength: trust.profileStrength
  };
});

const students = enrichBenchmarkMetrics(rawStudents);
const plagiarismRecords = detectPlagiarism(students);

const companies = [
  ["Google", "product", "Search and cloud products", "Bengaluru", "https://google.com"],
  ["Razorpay", "product", "Payments and fintech APIs", "Bengaluru", "https://razorpay.com"],
  ["TCS Digital", "service", "Enterprise digital delivery", "Mumbai", "https://tcs.com"],
  ["Freshworks", "product", "SaaS CRM and support tools", "Chennai", "https://freshworks.com"],
  ["Zoho", "product", "Business software suite", "Chennai", "https://zoho.com"],
  ["CRED", "startup", "Consumer fintech experiences", "Bengaluru", "https://cred.club"],
  ["Intel", "mnc", "Hardware and software systems", "Bengaluru", "https://intel.com"],
  ["Siemens", "mnc", "Industrial software and automation", "Pune", "https://siemens.com"]
].map((entry, index) => ({
  id: createId("company", index + 1),
  name: entry[0],
  company_type: entry[1],
  description: entry[2],
  headquarters: entry[3],
  website: entry[4],
  industry: "Technology",
  total_visits: 1 + index,
  total_hires: 3 + index,
  avg_rating: round(3.9 + index * 0.07, 2),
  created_at: "2026-01-01T08:00:00.000Z",
  updated_at: "2026-03-01T08:00:00.000Z"
}));

const jdTexts = [
  `Google Campus Drive
Role: Software Engineer
Location: Bengaluru
CTC: 18 LPA
Eligible: CSE, IT
CGPA 8.0
Must have: Python, React, Node.js, SQL
Good communication skills
Hiring 10`,
  `Razorpay Hiring for Backend Engineer
Location: Bengaluru
Package: 14 LPA
CGPA 7.5
Eligible: CSE, IT
Must have: Java, Spring Boot, PostgreSQL, Redis, Docker
Good to have: AWS, React
Openings 8`,
  `TCS Digital Campus Opportunity
Role: Digital Engineer
Location: Mumbai
CTC: 7.5 LPA
Eligible: All branches
CGPA 6.0
Must have: JavaScript, HTML, CSS, Git
Openings 18`,
  `Freshworks Campus Drive
Role: Product Support Engineer
Location: Chennai
CTC: 9 LPA
Eligible: CSE, IT, ECE
CGPA 6.5
Must have: SQL, JavaScript, Communication
Good to have: React, Node.js
Openings 12`,
  `Intel Campus Hiring
Role: Software Engineer
Location: Bengaluru
CTC: 12 LPA
Eligible: CSE, IT, ECE
CGPA 7.0
Must have: C++, Python, Linux, Docker
Good to have: TensorFlow, AWS
Openings 9`
];

const driveBases = [
  { id: createId("drive", 1), company_id: companies[0].id, drive_date: "2026-01-25", status: "completed", selection_target: 10 },
  { id: createId("drive", 2), company_id: companies[1].id, drive_date: "2026-02-04", status: "completed", selection_target: 8 },
  { id: createId("drive", 3), company_id: companies[2].id, drive_date: "2026-02-18", status: "completed", selection_target: 12 },
  { id: createId("drive", 4), company_id: companies[3].id, drive_date: "2026-03-12", status: "screening", selection_target: 10 },
  { id: createId("drive", 5), company_id: companies[6].id, drive_date: "2026-03-25", status: "upcoming", selection_target: 9 }
];

let historicalApplications = [];
const drives = [];
let applications = [];
let interviewSlots = [];
let interviewEvaluations = [];
let studentFeedback = [];

driveBases.forEach((base, index) => {
  const result = runDriveAutopilot({
    jdText: jdTexts[index],
    baseDrive: base,
    students,
    historicalApplications,
    plagiarismRecords,
    interviewers: INTERVIEWER_PANELS
  });

  const company = companies.find((item) => item.id === base.company_id);
  const drive = {
    ...result.drive,
    company_id: base.company_id,
    company_name: company.name,
    title: `${company.name} ${result.drive.job_role}`,
    status: base.status,
    total_eligible: result.summary.eligibleCount,
    total_applied: result.applications.length,
    total_shortlisted: result.shortlisted.length,
    total_interviewed: base.status === "completed" ? Math.min(result.shortlisted.length, 8) : 0,
    total_selected: 0,
    jd_raw_text: jdTexts[index],
    created_by: "profile-admin",
    academic_year: "2025-26"
  };

  drives.push(drive);

  const driveApplications = result.applications.map((application, appIndex) => ({
    ...application,
    id: `${base.id}-app-${appIndex + 1}`,
    drive_id: drive.id,
    drive_role: drive.job_role,
    student_name: students.find((student) => student.id === application.student_id)?.parsed_name || "Student"
  }));

  if (base.status === "completed") {
    const completedSet = driveApplications.slice(0, Math.min(8, driveApplications.length));
    completedSet.forEach((application, evalIndex) => {
      const interviewScoreBase =
        evalIndex === 2
          ? 82
          : evalIndex === 4
            ? 44
            : round(Math.max(52, application.match_score + (evalIndex % 2 === 0 ? 6 : -8)));
      const student = students.find((item) => item.id === application.student_id);
      const evaluation = {
        id: `${drive.id}-eval-${evalIndex + 1}`,
        drive_id: drive.id,
        application_id: application.id,
        student_id: application.student_id,
        slot_id: `${drive.id}-slot-${evalIndex + 1}`,
        interviewer_id: evalIndex % 2 === 0 ? "panel-1" : "panel-2",
        panel_number: (evalIndex % 2) + 1,
        technical_score: round(interviewScoreBase / 10, 1),
        problem_solving_score: round((interviewScoreBase - 4) / 10, 1),
        communication_score: round((interviewScoreBase + 3) / 10, 1),
        project_depth_score: round((interviewScoreBase - 2) / 10, 1),
        cultural_fit_score: round((interviewScoreBase + 1) / 10, 1),
        weighted_total: interviewScoreBase,
        final_combined_score: round((application.match_score + interviewScoreBase) / 2),
        decision: interviewScoreBase >= 78 ? "strong_select" : interviewScoreBase >= 68 ? "select" : interviewScoreBase >= 55 ? "waitlist" : "reject",
        strengths: "Strong ownership, clear examples, and better-than-average articulation.",
        weaknesses: interviewScoreBase < 60 ? "Missed depth in follow-up questions." : "Could tighten system design structure.",
        notes: "Generated from demo evaluation stream.",
        questions_asked: application.suggested_questions?.slice(0, 3) || [],
        video_watched: Boolean(student?.video_url),
        actual_duration: 20 - (evalIndex % 3),
        started_at: `${drive.drive_date}T10:${String(evalIndex * 5).padStart(2, "0")}:00.000Z`,
        completed_at: `${drive.drive_date}T10:${String(evalIndex * 5 + 18).padStart(2, "0")}:00.000Z`,
        performance_category: classifyPerformance(application.match_score, interviewScoreBase)
      };
      interviewEvaluations.push(evaluation);
      application.interview_status = "completed";
      application.final_status =
        evaluation.decision === "strong_select" || evaluation.decision === "select"
          ? "selected"
          : evaluation.decision === "waitlist"
            ? "waitlisted"
            : "rejected";

      studentFeedback.push(
        generateStudentFeedback({
          application,
          evaluation,
          drive,
          student
        })
      );
    });
    drive.total_selected = driveApplications.filter((application) => application.final_status === "selected").length;
  }

  historicalApplications = [...historicalApplications, ...driveApplications];
  applications = [...applications, ...driveApplications];
  interviewSlots = [
    ...interviewSlots,
    ...result.schedule.map((slot, slotIndex) => ({
      ...slot,
      id: `${drive.id}-slot-${slotIndex + 1}`,
      drive_id: drive.id
    }))
  ];
});

const interviewerMetrics = drives
  .filter((drive) => drive.status === "completed")
  .flatMap((drive) => {
    const relevantEvaluations = interviewEvaluations.filter((evaluation) => evaluation.drive_id === drive.id);
    const health = analyzeBiasAndFatigue(relevantEvaluations, students);
    return health.panels.map((panel) => ({
      id: `${drive.id}-metric-${panel.panelNumber}`,
      drive_id: drive.id,
      interviewer_id: `panel-${panel.panelNumber}`,
      panel_number: panel.panelNumber,
      total_interviews: panel.interviews,
      avg_score: panel.avgScore,
      score_trend: [{ value: panel.scoreTrend }],
      duration_trend: [{ value: panel.durationTrend }],
      bias_alert: panel.biasAlert,
      bias_details: panel.alerts.filter((alert) => alert.toLowerCase().includes("bias")).join(" "),
      fatigue_alert: panel.fatigueAlert,
      fatigue_details: panel.alerts.filter((alert) => alert.toLowerCase().includes("fatigue") || alert.toLowerCase().includes("duration")).join(" "),
      updated_at: new Date().toISOString()
    }));
  });

export const demoData = {
  metadata: {
    generatedAt: new Date().toISOString(),
    demoMode: true
  },
  demoAccounts: DEMO_ACCOUNTS,
  profiles: [
    {
      id: "profile-admin",
      email: DEMO_ACCOUNTS.admin.email,
      full_name: "Placement Admin",
      role: "admin"
    },
    {
      id: students[0].profile_id,
      email: DEMO_ACCOUNTS.student.email,
      full_name: students[0].full_name,
      role: "student"
    },
    {
      id: "profile-interviewer",
      email: DEMO_ACCOUNTS.interviewer.email,
      full_name: "Panel Lead",
      role: "interviewer"
    }
  ],
  students,
  companies,
  drives,
  applications,
  interviewSlots,
  interviewEvaluations,
  interviewerMetrics,
  studentFeedback,
  plagiarismRecords
};

export default demoData;
