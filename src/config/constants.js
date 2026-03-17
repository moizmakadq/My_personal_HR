export const APP_NAME = "PlaceRight";
export const APP_TAGLINE = "Every Interview Counts. Every Resume Speaks Truth.";

export const ROLES = {
  ADMIN: "admin",
  STUDENT: "student",
  INTERVIEWER: "interviewer"
};

export const DEPARTMENTS = ["CSE", "IT", "ECE", "ME", "EEE", "Civil"];

export const BRANCHES = {
  CSE: ["Artificial Intelligence", "Data Science", "Cyber Security", "Core CSE"],
  IT: ["Information Technology", "Cloud Computing", "Software Systems"],
  ECE: ["Embedded Systems", "VLSI Design", "Core ECE"],
  ME: ["Mechanical Design", "Manufacturing", "Robotics"],
  EEE: ["Power Systems", "Electrical Machines"],
  Civil: ["Structural", "Transportation"]
};

export const CITIES = [
  "Bengaluru",
  "Hyderabad",
  "Pune",
  "Gurugram",
  "Noida",
  "Chennai",
  "Mumbai",
  "Remote"
];

export const SKILL_CATALOG = {
  programming: [
    "Python",
    "Java",
    "JavaScript",
    "TypeScript",
    "C++",
    "Go",
    "SQL",
    "Rust"
  ],
  frontend: ["React", "Next.js", "HTML", "CSS", "Tailwind", "Redux"],
  backend: ["Node.js", "Express", "Django", "Flask", "Spring Boot", "FastAPI"],
  database: ["MongoDB", "PostgreSQL", "MySQL", "Redis", "Firebase"],
  devops: ["Docker", "Kubernetes", "AWS", "GCP", "CI/CD", "Terraform"],
  data: ["Pandas", "NumPy", "Scikit-learn", "TensorFlow", "Power BI"],
  tooling: ["Git", "Linux", "Figma", "Postman", "GraphQL", "RabbitMQ"]
};

export const ALL_SKILLS = Object.values(SKILL_CATALOG).flat();

export const AUTHENTICITY_STATES = {
  VERIFIED: "verified",
  PARTIAL: "partial",
  UNVERIFIED: "unverified"
};

export const DRIVE_STATUS = [
  "draft",
  "upcoming",
  "screening",
  "scheduling",
  "interviewing",
  "completed",
  "cancelled"
];

export const SCREENING_STATUS = [
  "pending",
  "shortlisted",
  "waitlisted",
  "filtered_out",
  "override_included"
];

export const INTERVIEW_STATUS = [
  "not_scheduled",
  "scheduled",
  "in_progress",
  "completed",
  "no_show",
  "cancelled"
];

export const FINAL_STATUS = [
  "pending",
  "selected",
  "waitlisted",
  "rejected",
  "offer_accepted",
  "offer_declined"
];

export const DECISION_OPTIONS = [
  { value: "strong_select", label: "Strong Select", tone: "emerald" },
  { value: "select", label: "Select", tone: "sky" },
  { value: "waitlist", label: "Waitlist", tone: "amber" },
  { value: "reject", label: "Reject", tone: "rose" }
];

export const EVALUATION_PARAMETERS = [
  { key: "technical_score", label: "Technical", weightKey: "weight_technical", defaultWeight: 30 },
  { key: "problem_solving_score", label: "Problem Solving", weightKey: "weight_problem_solving", defaultWeight: 25 },
  { key: "communication_score", label: "Communication", weightKey: "weight_communication", defaultWeight: 20 },
  { key: "project_depth_score", label: "Project Depth", weightKey: "weight_project_depth", defaultWeight: 15 },
  { key: "cultural_fit_score", label: "Cultural Fit", weightKey: "weight_cultural_fit", defaultWeight: 10 }
];

export const DEFAULT_DRIVE_WEIGHTS = {
  technical: 35,
  projectDepth: 20,
  academic: 15,
  experience: 10,
  trust: 10,
  authenticity: 10
};

export const TRUST_WEIGHTS = {
  skill_evidence: 0.3,
  project_depth: 0.2,
  timeline: 0.15,
  skill_count: 0.1,
  completeness: 0.15,
  uniqueness: 0.1
};

export const DEMO_ACCOUNTS = {
  admin: { email: "admin@placeright.com", password: "admin123", role: "admin" },
  student: { email: "student@placeright.com", password: "student123", role: "student" },
  interviewer: {
    email: "interviewer@placeright.com",
    password: "interview123",
    role: "interviewer"
  }
};

export const INTERVIEWER_PANELS = [
  { id: "panel-1", name: "Mr. Rajesh Sharma", email: "rajesh.sharma@placeright.com", departmentAffinity: "CSE" },
  { id: "panel-2", name: "Ms. Kavya Gupta", email: "kavya.gupta@placeright.com", departmentAffinity: "IT" },
  { id: "panel-3", name: "Mr. Aditya Menon", email: "aditya.menon@placeright.com", departmentAffinity: "ECE" }
];

export const NAV_ITEMS = {
  admin: [
    { label: "Dashboard", to: "/admin" },
    { label: "Students", to: "/admin/students" },
    { label: "Drives", to: "/admin/drives" },
    { label: "Screening", to: "/admin/screening" },
    { label: "Scheduling", to: "/admin/scheduling" },
    { label: "Monitor", to: "/admin/interview-monitor" },
    { label: "Results", to: "/admin/results" },
    { label: "Plagiarism", to: "/admin/plagiarism" },
    { label: "Analytics", to: "/admin/analytics" },
    { label: "Settings", to: "/admin/settings" }
  ],
  student: [
    { label: "Dashboard", to: "/student" },
    { label: "My Profile", to: "/student/profile" },
    { label: "Parsed Profile", to: "/student/parsed-profile" },
    { label: "Upcoming Drives", to: "/student/drives" },
    { label: "Applications", to: "/student/applications" },
    { label: "Interviews", to: "/student/interviews" },
    { label: "Feedback", to: "/student/feedback" }
  ],
  interviewer: [
    { label: "Dashboard", to: "/interviewer" },
    { label: "Interview Room", to: "/interviewer/room/demo-slot-1" },
    { label: "Selection Board", to: "/interviewer/selection-board" }
  ]
};

export const COMPANY_TYPES = ["product", "service", "startup", "mnc", "government", "other"];

export const EMPTY_STATES = {
  students: "Students appear here after registration or demo seeding.",
  drives: "Create a drive or run Autopilot to get things moving.",
  applications: "Applications will show up after students apply."
};
