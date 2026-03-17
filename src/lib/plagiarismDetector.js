import { jaccardSimilarity, tokenize, uid } from "@/lib/utils";

const PARSER_API = import.meta.env.VITE_PARSER_API_URL || "http://localhost:8000";

const normalize = (value = "") => value.toLowerCase().replace(/[^a-z0-9]/g, "");

const simpleHash = (value = "") => {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }
  return `fp_${Math.abs(hash)}`;
};

const normalizeSimilarityValue = (value) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 0;
  return numeric <= 1 ? Number((numeric * 100).toFixed(1)) : Number(numeric.toFixed(1));
};

const toLevel = (similarity) => {
  if (similarity >= 85) return "high";
  if (similarity >= 70) return "medium";
  return "low";
};

const normalizeApiResult = (data = {}) => {
  const matches = Array.isArray(data.matches)
    ? data.matches
        .map((match, index) => {
          const similarity = normalizeSimilarityValue(match.similarity ?? match.similarity_score);
          return {
            index: Number.isInteger(match.index) ? match.index : index,
            similarity,
            level: match.level || toLevel(similarity)
          };
        })
        .sort((left, right) => right.similarity - left.similarity)
    : [];

  const maxSimilarity =
    normalizeSimilarityValue(data.max_similarity) ||
    (matches.length ? matches[0].similarity : 0);

  return {
    matches,
    max_similarity: maxSimilarity
  };
};

export async function checkPlagiarism(resumeText = "", allResumeTexts = []) {
  const text = String(resumeText || "").trim();
  const corpus = Array.isArray(allResumeTexts) ? allResumeTexts.filter(Boolean) : [];

  if (!text || !corpus.length) {
    return { matches: [], max_similarity: 0 };
  }

  const endpoints = [`${PARSER_API}/api/check-plagiarism`, `${PARSER_API}/check-plagiarism`];
  let lastError = null;

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resume_text: text,
          all_resume_texts: corpus
        })
      });

      if (!response.ok) {
        let detail = `Plagiarism check failed (${response.status})`;
        try {
          const errorBody = await response.json();
          detail = errorBody.detail || errorBody.message || detail;
        } catch {
          detail = await response.text();
        }
        throw new Error(detail || `Plagiarism check failed (${response.status})`);
      }

      const result = await response.json();

      if (result?.success && result?.data) {
        return normalizeApiResult(result.data);
      }

      if (result && typeof result === "object" && !("success" in result)) {
        return normalizeApiResult(result);
      }

      throw new Error(result?.message || "Plagiarism check failed");
    } catch (error) {
      lastError = error;
    }
  }

  console.warn("Python plagiarism checker unavailable, using fallback:", lastError?.message || "Unknown error");
  return fallbackPlagiarismCheck(text, corpus);
}

export function fallbackPlagiarismCheck(text = "", corpus = []) {
  const baseWords = new Set(tokenize(text).filter((word) => word.length > 3));

  if (!baseWords.size || !Array.isArray(corpus) || !corpus.length) {
    return { matches: [], max_similarity: 0 };
  }

  const matches = corpus
    .map((other, index) => {
      const otherWords = new Set(tokenize(String(other || "")).filter((word) => word.length > 3));
      const intersection = new Set([...baseWords].filter((word) => otherWords.has(word)));
      const union = new Set([...baseWords, ...otherWords]);
      const similarity = union.size ? Number(((intersection.size / union.size) * 100).toFixed(1)) : 0;

      return {
        index,
        similarity,
        level: toLevel(similarity)
      };
    })
    .filter((match) => match.similarity > 50)
    .sort((left, right) => right.similarity - left.similarity);

  return {
    matches,
    max_similarity: matches.length ? matches[0].similarity : 0
  };
}

export const createResumeFingerprint = (student) => {
  const parsed = student.resume_parsed_data || {};
  const payload = JSON.stringify({
    skills: student.skills || [],
    projects: (parsed.projects || []).map((project) => ({
      title: project.title,
      description: project.description,
      tech_stack: project.tech_stack
    })),
    experiences: (parsed.experiences || []).map((experience) => ({
      company_name: experience.company_name,
      role: experience.role,
      tech_stack: experience.tech_stack
    })),
    education: parsed.education || {},
    raw: student.resume_raw_text || ""
  });

  return simpleHash(payload);
};

export const compareProjectTitles = (leftProjects = [], rightProjects = []) => {
  const matches = [];
  leftProjects.forEach((project) => {
    rightProjects.forEach((candidate) => {
      const similarity = jaccardSimilarity(normalize(project.title), normalize(candidate.title));
      if (similarity >= 0.9) {
        matches.push({
          match_type: "project_title",
          similarity_score: similarity,
          details: {
            matched_project: project.title,
            other_project: candidate.title
          }
        });
      }
    });
  });
  return matches;
};

export const compareSkillSets = (leftSkills = [], rightSkills = []) => {
  if (leftSkills.length && leftSkills.join("|").toLowerCase() === rightSkills.join("|").toLowerCase()) {
    return [
      {
        match_type: "skill_set",
        similarity_score: 1,
        details: {
          matched_count: leftSkills.length,
          ordered_match: true
        }
      }
    ];
  }
  return [];
};

export const compareProjectDescriptions = (leftProjects = [], rightProjects = []) => {
  const matches = [];
  leftProjects.forEach((project) => {
    rightProjects.forEach((candidate) => {
      const similarity = jaccardSimilarity(project.description || "", candidate.description || "");
      if (similarity >= 0.75) {
        matches.push({
          match_type: "description",
          similarity_score: similarity,
          details: {
            matched_project: project.title,
            other_project: candidate.title
          }
        });
      }
    });
  });
  return matches;
};

export const compareResumeText = (leftText = "", rightText = "") => {
  const similarity = jaccardSimilarity(tokenize(leftText), tokenize(rightText));
  return similarity >= 0.7
    ? [
        {
          match_type: "full_resume",
          similarity_score: similarity,
          details: { similarity }
        }
      ]
    : [];
};

export const detectPlagiarism = (students = []) => {
  const records = [];

  for (let leftIndex = 0; leftIndex < students.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < students.length; rightIndex += 1) {
      const left = students[leftIndex];
      const right = students[rightIndex];
      const leftParsed = left.resume_parsed_data || {};
      const rightParsed = right.resume_parsed_data || {};

      const matches = [
        ...compareProjectTitles(leftParsed.projects, rightParsed.projects),
        ...compareSkillSets(left.skills || [], right.skills || []),
        ...compareProjectDescriptions(leftParsed.projects, rightParsed.projects),
        ...compareResumeText(left.resume_raw_text, right.resume_raw_text)
      ];

      matches.forEach((match) => {
        records.push({
          id: uid("plag"),
          student_a_id: left.id,
          student_b_id: right.id,
          student_a_name: left.parsed_name || left.full_name,
          student_b_name: right.parsed_name || right.full_name,
          match_type: match.match_type,
          similarity_score: Number((match.similarity_score * 100).toFixed(2)),
          details: match.details,
          status: "active",
          detected_at: new Date().toISOString()
        });
      });
    }
  }

  return records.sort((a, b) => b.similarity_score - a.similarity_score);
};

export const calculateResumeUniqueness = (student, peers = []) => {
  const others = peers.filter((candidate) => candidate.id !== student.id);
  if (!others.length) return 100;

  const similarities = others.map((candidate) =>
    jaccardSimilarity(
      tokenize(`${(student.skills || []).join(" ")} ${(student.resume_raw_text || "").slice(0, 1000)}`),
      tokenize(`${(candidate.skills || []).join(" ")} ${(candidate.resume_raw_text || "").slice(0, 1000)}`)
    )
  );

  const highestSimilarity = Math.max(...similarities, 0);
  if (highestSimilarity > 0.8) return 10;
  return Number(((1 - highestSimilarity) * 100).toFixed(2));
};
