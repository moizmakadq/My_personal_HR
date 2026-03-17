import { ALL_SKILLS, CITIES, DEPARTMENTS } from "@/config/constants";
import { escapeRegex, titleCase, unique } from "@/lib/utils";

const PARSER_API = import.meta.env.VITE_PARSER_API_URL || "http://localhost:8000";

const KNOWN_COMPANIES = [
  "Google",
  "Microsoft",
  "Amazon",
  "Razorpay",
  "Freshworks",
  "Zoho",
  "CRED",
  "PhonePe",
  "Paytm",
  "Flipkart",
  "Meesho",
  "TCS",
  "Infosys",
  "Wipro",
  "Accenture",
  "Capgemini",
  "Cognizant",
  "HCL",
  "Deloitte",
  "Oracle",
  "SAP",
  "Intel",
  "NVIDIA"
];

const DEPARTMENT_ALIASES = {
  CSE: ["cse", "computer science", "computer science engineering", "computer science & engineering"],
  IT: ["it", "information technology"],
  ECE: ["ece", "electronics", "electronics and communication", "electronics & communication"],
  ME: ["me", "mechanical", "mechanical engineering"],
  EEE: ["eee", "electrical", "electrical and electronics", "electrical & electronics"],
  Civil: ["civil", "civil engineering"]
};

const capture = (pattern, text = "", group = 1) => {
  const match = text.match(pattern);
  return match?.[group]?.trim() || "";
};

const createLooseTokenPattern = (term) =>
  new RegExp(`(^|[^a-z0-9+#./-])${escapeRegex(term)}(?=$|[^a-z0-9+#./-])`, "i");

const normalizeSkill = (skill = "") => {
  const exact = ALL_SKILLS.find((item) => item.toLowerCase() === skill.toLowerCase());
  return exact || titleCase(skill);
};

const uniqueSkills = (skills = []) =>
  unique(
    skills
      .filter(Boolean)
      .map((skill) => normalizeSkill(String(skill).trim()))
      .filter(Boolean)
  );

const inferCompanyName = (text) => {
  const explicit =
    capture(/company\s*[:\-]\s*(.+)/i, text) ||
    capture(/about\s+company\s*[:\-]\s*(.+)/i, text);
  if (explicit) {
    return explicit.split(/\||,| - /)[0].trim();
  }

  const known = KNOWN_COMPANIES.find((company) => createLooseTokenPattern(company).test(text));
  if (known) return known;

  const firstLine = text
    .split("\n")
    .map((line) => line.trim())
    .find(Boolean);

  if (!firstLine) return "Unknown Company";

  return (
    firstLine
      .replace(/(job description|campus drive|hiring|recruitment|opportunity)/gi, "")
      .replace(/\s{2,}/g, " ")
      .trim() || "Unknown Company"
  );
};

const inferRole = (text) =>
  capture(/(?:role|position|job title|designation)\s*[:\-]\s*(.+)/i, text) ||
  capture(/hiring\s+(?:for|an?|a)\s+([A-Za-z0-9 .+/()\-]+)/i, text) ||
  capture(/looking\s+for\s+(?:an?|a)\s+([A-Za-z0-9 .+/()\-]+)/i, text) ||
  capture(/opening\s+for\s+([A-Za-z0-9 .+/()\-]+)/i, text) ||
  "Software Engineer";

const inferSkills = (text) => {
  const found = ALL_SKILLS.filter((skill) => createLooseTokenPattern(skill).test(text));
  const segments = text.split(/\n|,|;|\u2022/).map((segment) => segment.trim());

  const mustHaveBucket = segments
    .filter((segment) => /must have|required|mandatory|proficient|hands[- ]on/i.test(segment))
    .flatMap((segment) => found.filter((skill) => createLooseTokenPattern(skill).test(segment)));

  const goodToHaveBucket = segments
    .filter((segment) => /good to have|preferred|bonus|plus|nice to have/i.test(segment))
    .flatMap((segment) => found.filter((skill) => createLooseTokenPattern(skill).test(segment)));

  const must_have_skills = uniqueSkills(mustHaveBucket);
  const good_to_have_skills = uniqueSkills(
    goodToHaveBucket.length
      ? goodToHaveBucket
      : found.filter((skill) => !must_have_skills.some((item) => item.toLowerCase() === skill.toLowerCase()))
  );

  return { must_have_skills, good_to_have_skills };
};

const inferDepartments = (text) => {
  const matches = Object.entries(DEPARTMENT_ALIASES)
    .filter(([, aliases]) => aliases.some((alias) => createLooseTokenPattern(alias).test(text)))
    .map(([department]) => department)
    .filter((department) => DEPARTMENTS.includes(department));

  if (matches.length) return unique(matches);
  if (/all branches|all departments|all streams|all circuits/i.test(text)) return DEPARTMENTS;
  return ["CSE", "IT"];
};

const inferLocation = (text) => {
  const explicit =
    capture(/location\s*[:\-]\s*(.+)/i, text) ||
    capture(/based in\s+([A-Za-z ,]+)/i, text) ||
    capture(/job location\s*[:\-]\s*(.+)/i, text);

  if (explicit) {
    return titleCase(explicit.split(/\||,/)[0].trim());
  }

  const city = CITIES.find((item) => createLooseTokenPattern(item).test(text));
  return city || "Bengaluru";
};

const inferCtc = (text) => {
  const ctcBreakdown =
    capture(/(?:ctc|salary|package|stipend)\s*[:\-]?\s*([A-Za-z0-9 .,+/()-]+)/i, text) || null;
  const lpa =
    Number(capture(/(\d+(?:\.\d+)?)\s*(?:lpa|lakhs?\s+per\s+annum)/i, text)) ||
    Number(capture(/(?:rs\.?|inr)\s*(\d+(?:\.\d+)?)\s*lakh/i, text)) ||
    null;

  return { ctc_breakdown: ctcBreakdown, ctc_offered: Number.isFinite(lpa) ? lpa : null };
};

const buildSummary = (text, parsed = {}) => ({
  experience: parsed.experience_requirement || capture(/(\d+\+?\s+years?\s+experience)/i, text) || "",
  requiresCommunication: /communication|stakeholder|client-facing/i.test(text),
  requiresLeadership: /leadership|ownership|mentor|lead a team/i.test(text),
  requiresDeployment: /deploy|production|scale|monitoring|devops/i.test(text)
});

const buildParsedShape = ({
  company,
  job_role,
  job_description,
  job_type,
  job_location,
  ctc_breakdown,
  ctc_offered,
  eligible_departments,
  min_cgpa,
  max_backlogs,
  must_have_skills,
  good_to_have_skills,
  selection_target,
  summary
}) => ({
  company,
  title: `${company} ${job_role}`.trim(),
  job_role,
  job_description,
  job_type,
  job_location,
  ctc_breakdown,
  ctc_offered,
  eligible_departments,
  min_cgpa,
  max_backlogs,
  must_have_skills,
  good_to_have_skills,
  selection_target,
  summary
});

const normalizeBackendJD = (data = {}, sourceText = "") => {
  const company = data.company_name || data.company || inferCompanyName(sourceText);
  const job_role = titleCase(data.role || data.job_role || inferRole(sourceText));
  const job_description = data.job_description || data.jd_text || sourceText.trim();
  const { ctc_breakdown, ctc_offered } = inferCtc(job_description);

  return buildParsedShape({
    company,
    job_role,
    job_description,
    job_type: data.job_type || (/intern/i.test(job_description) ? "internship" : "full_time"),
    job_location: titleCase(data.location || data.job_location || inferLocation(job_description)),
    ctc_breakdown: data.ctc || data.ctc_breakdown || ctc_breakdown,
    ctc_offered: data.ctc_lpa ?? data.ctc_offered ?? ctc_offered,
    eligible_departments: unique(data.eligible_departments || inferDepartments(job_description)),
    min_cgpa:
      data.min_cgpa ??
      (Number(capture(/cgpa\s*(?:of|>=|:)?\s*(\d+(?:\.\d+)?)/i, job_description)) || 6),
    max_backlogs:
      data.max_backlogs ??
      (Number(capture(/(?:backlogs|max backlogs)\s*(\d+)/i, job_description)) || 0),
    must_have_skills: uniqueSkills(data.must_have_skills || []),
    good_to_have_skills: uniqueSkills(data.good_to_have_skills || []),
    selection_target:
      data.hiring_count ??
      data.selection_target ??
      (Number(capture(/(?:hiring|positions|openings)\s*(\d+)/i, job_description)) || 12),
    summary: buildSummary(job_description, data)
  });
};

export function fallbackJDParse(jdText = "") {
  const text = String(jdText || "").trim();
  const company = inferCompanyName(text);
  const job_role = titleCase(inferRole(text));
  const skills = inferSkills(text);
  const { ctc_breakdown, ctc_offered } = inferCtc(text);

  return buildParsedShape({
    company,
    job_role,
    job_description: text,
    job_type: /intern/i.test(text) ? "internship" : "full_time",
    job_location: inferLocation(text),
    ctc_breakdown,
    ctc_offered,
    eligible_departments: inferDepartments(text),
    min_cgpa: Number(capture(/cgpa\s*(?:of|>=|:)?\s*(\d+(?:\.\d+)?)/i, text)) || 6,
    max_backlogs: Number(capture(/(?:backlogs|max backlogs)\s*(\d+)/i, text)) || 0,
    must_have_skills: skills.must_have_skills,
    good_to_have_skills: skills.good_to_have_skills,
    selection_target: Number(capture(/(?:hiring|positions|openings)\s*(\d+)/i, text)) || 12,
    summary: buildSummary(text)
  });
}

export const parseJDSync = fallbackJDParse;

export async function parseJD(jdText = "") {
  const text = String(jdText || "").trim();

  if (!text) {
    return fallbackJDParse(text);
  }

  const endpoints = [`${PARSER_API}/api/parse-jd`, `${PARSER_API}/parse-jd`];
  let lastError = null;

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jd_text: text })
      });

      if (!response.ok) {
        let detail = `JD parsing failed (${response.status})`;
        try {
          const errorBody = await response.json();
          detail = errorBody.detail || errorBody.message || detail;
        } catch {
          detail = await response.text();
        }
        throw new Error(detail || `JD parsing failed (${response.status})`);
      }

      const result = await response.json();

      if (result?.success && result?.data) {
        return normalizeBackendJD(result.data, text);
      }

      if (result && typeof result === "object" && !("success" in result)) {
        return normalizeBackendJD(result, text);
      }

      throw new Error(result?.message || "JD parsing failed");
    } catch (error) {
      lastError = error;
    }
  }

  console.warn("Python JD parser unavailable, using fallback:", lastError?.message || "Unknown error");
  return fallbackJDParse(text);
}
