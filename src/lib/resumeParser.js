import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { ALL_SKILLS } from "@/config/constants";

const PARSER_API = import.meta.env.VITE_PARSER_API_URL || "http://localhost:8000";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const normalizeTrustBreakdown = (breakdown = {}) => {
  const normalized = {
    skill_evidence: Number(breakdown.skill_evidence ?? 0),
    project_depth: Number(breakdown.project_depth ?? 0),
    timeline: Number(breakdown.timeline ?? 0),
    skill_count: Number(breakdown.skill_count ?? breakdown.skill_reasonability ?? 0),
    completeness: Number(breakdown.completeness ?? 0),
    uniqueness: Number(breakdown.uniqueness ?? 0)
  };

  return Object.fromEntries(Object.entries(normalized).filter(([, value]) => Number.isFinite(value) && value > 0));
};

const normalizeAuthenticityState = (value) => {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") return value.state || value.status || "unverified";
  return "unverified";
};

const normalizeSkillAuthenticity = (skillAuthenticity = {}, skills = []) => {
  const entries = Object.entries(skillAuthenticity || {});
  if (!entries.length && skills.length) {
    return {};
  }

  return entries.reduce((accumulator, [skill, rawValue]) => {
    if (rawValue && typeof rawValue === "object" && rawValue.state) {
      accumulator[skill] = rawValue;
      return accumulator;
    }

    const state = normalizeAuthenticityState(rawValue);
    const confidence =
      state === "verified" ? "high" : state === "partial" ? "medium" : "low";
    const reason =
      state === "verified"
        ? "Supported by multiple resume evidence points identified by the parser."
        : state === "partial"
          ? "Supported by limited evidence in projects, experience, or certifications."
          : "Listed on the resume without strong supporting evidence.";

    accumulator[skill] = {
      skill,
      state,
      confidence,
      evidence: {
        projects: state !== "unverified",
        experience: state === "verified",
        certifications: state === "verified"
      },
      reason
    };

    return accumulator;
  }, {});
};

const normalizeBackendResume = (data) => {
  const trust_breakdown = normalizeTrustBreakdown(data?.trust_breakdown || {});
  const trust_score = Number(data?.trust_score ?? 0);
  const profile_strength =
    Number(data?.profile_strength) ||
    (Number.isFinite(trust_score)
      ? Math.round((trust_score + Number(trust_breakdown.completeness || 0)) / 2)
      : 0);
  const skills = data?.skills || [];
  const skill_authenticity = normalizeSkillAuthenticity(data?.skill_authenticity || {}, skills);

  return {
    parsed_name: data?.personal?.name || null,
    parsed_email: data?.personal?.email || null,
    parsed_phone: data?.personal?.phone || null,
    github_url: data?.links?.github || data?.personal?.github || null,
    linkedin_url: data?.links?.linkedin || data?.personal?.linkedin || null,
    portfolio_url: data?.links?.portfolio || data?.personal?.portfolio || null,
    degree: data?.education?.degree || null,
    university: data?.education?.university || null,
    cgpa: data?.education?.cgpa ?? null,
    tenth_percentage: data?.education?.tenth_percentage ?? null,
    twelfth_percentage: data?.education?.twelfth_percentage ?? null,
    graduation_year: data?.education?.graduation_year ?? null,
    skills,
    skill_categories: data?.skill_categories || {},
    skill_authenticity,
    trust_score,
    trust_breakdown,
    profile_strength,
    resume_fingerprint: data?.resume_fingerprint || null,
    resume_raw_text: data?.raw_text || "",
    extraction_method: data?.extraction_method || "python_api",
    parsed_at: data?.parsed_at || new Date().toISOString(),
    resume_parsed_data: {
      personal: data?.personal || {},
      education: data?.education || {},
      projects: data?.projects || [],
      experiences: data?.experience || [],
      certifications: data?.certifications || [],
      summary: data?.summary || null,
      sections_detected: data?.sections_detected || []
    }
  };
};

export async function parseResume(pdfFile) {
  const formData = new FormData();
  formData.append("file", pdfFile);
  const endpoints = [`${PARSER_API}/api/parse-resume`, `${PARSER_API}/parse-resume`];

  let lastError = null;

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        lastError = new Error(error.detail || error.message || `Failed to parse resume via ${endpoint}`);
        continue;
      }

      const result = await response.json();
      if (result?.success && result?.data) {
        return normalizeBackendResume(result.data);
      }

      if (result && typeof result === "object" && !("success" in result)) {
        return normalizeBackendResume(result);
      }

      throw new Error(result?.message || "Parsing failed");
    } catch (error) {
      lastError = error;
    }
  }

  console.warn("Python parser unavailable, using fallback:", lastError?.message || "Unknown error");
  return fallbackParse(pdfFile);
}

async function fallbackParse(pdfFile) {
  const arrayBuffer = await pdfFile.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let text = "";
  for (let index = 1; index <= pdf.numPages; index += 1) {
    const page = await pdf.getPage(index);
    const content = await page.getTextContent();
    text += `${content.items.map((item) => item.str).join(" ")}\n`;
  }

  const cleaned = text.trim();
  const email = cleaned.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)?.[0] || null;
  const phone = cleaned.match(/(?:\+91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}/)?.[0] || null;
  const github = cleaned.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[\w.-]+/i)?.[0] || null;
  const linkedin = cleaned.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[\w.-]+/i)?.[0] || null;
  const portfolio =
    cleaned.match(/(?:https?:\/\/)?(?!.*(?:github|linkedin))[a-zA-Z0-9-]+\.(?:com|dev|app|io|in)(?:\/\S*)?/i)?.[0] ||
    null;
  const nameCandidate =
    cleaned
      .split("\n")
      .map((line) => line.trim())
      .find((line) => line && !line.includes("@") && !/\d{5,}/.test(line) && line.split(" ").length <= 4) || null;

  const skills = ALL_SKILLS.filter((skill) => cleaned.toLowerCase().includes(skill.toLowerCase()));

  return {
    parsed_name: nameCandidate,
    parsed_email: email,
    parsed_phone: phone,
    github_url: github,
    linkedin_url: linkedin,
    portfolio_url: portfolio,
    degree: null,
    university: null,
    cgpa: null,
    tenth_percentage: null,
    twelfth_percentage: null,
    graduation_year: null,
    skills,
    skill_categories: {},
    skill_authenticity: {},
    trust_score: 0,
    trust_breakdown: {},
    resume_fingerprint: null,
    resume_raw_text: cleaned,
    extraction_method: "fallback_js",
    parsed_at: new Date().toISOString(),
    resume_parsed_data: {
      personal: {
        name: nameCandidate,
        email,
        phone,
        location: null,
        github,
        linkedin,
        portfolio
      },
      education: {},
      projects: [],
      experiences: [],
      certifications: [],
      summary: null,
      sections_detected: []
    },
    _fallback: true,
    _fallback_message:
      "Parsed with basic fallback. Upload again when parser server is available for full analysis."
  };
}

export async function parseResumeFile(pdfFile) {
  return parseResume(pdfFile);
}
