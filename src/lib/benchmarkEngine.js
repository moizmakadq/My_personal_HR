import { round } from "@/lib/utils";

const percentileOf = (value, population = []) => {
  if (!population.length) return 0;
  const below = population.filter((item) => item <= value).length;
  return round((below / population.length) * 100);
};

const projectQuality = (student) =>
  round(
    (student.resume_parsed_data?.projects || []).reduce((sum, project) => {
      let score = 20;
      if ((project.description || "").split(/\s+/).filter(Boolean).length > 35) score += 35;
      if ((project.tech_stack || []).length >= 2) score += 20;
      if (project.github_link || project.live_link) score += 25;
      return sum + score;
    }, 0) / Math.max((student.resume_parsed_data?.projects || []).length, 1)
  );

const experienceStrength = (student) =>
  round(
    (student.resume_parsed_data?.experiences || []).reduce(
      (sum, item) => sum + Math.min((item.duration_months || 2) * 8 + (item.tech_stack || []).length * 5, 100),
      0
    ) / Math.max((student.resume_parsed_data?.experiences || []).length, 1)
  );

export const enrichBenchmarkMetrics = (students = []) => {
  const readinessPopulation = students.map((student) => Number(student.readiness_score || 0));
  const skillPopulation = students.map((student) => (student.skills || []).length);
  const projectPopulation = students.map(projectQuality);
  const experiencePopulation = students.map(experienceStrength);
  const academicPopulation = students.map((student) => Number(student.cgpa || 0));

  return students.map((student) => ({
    ...student,
    percentile_overall: percentileOf(Number(student.readiness_score || 0), readinessPopulation),
    percentile_skills: percentileOf((student.skills || []).length, skillPopulation),
    percentile_projects: percentileOf(projectQuality(student), projectPopulation),
    percentile_experience: percentileOf(experienceStrength(student), experiencePopulation),
    percentile_academic: percentileOf(Number(student.cgpa || 0), academicPopulation)
  }));
};

export const calculateBenchmark = (student, students = []) => {
  const enriched = enrichBenchmarkMetrics(students);
  const current = enriched.find((item) => item.id === student.id) || student;
  const tips = [];
  if (Number(current.percentile_projects || 0) < 50) tips.push("Add one deeper project with public links.");
  if (Number(current.percentile_experience || 0) < 50) tips.push("Strengthen experience with an internship or applied work.");
  if (Number(current.percentile_skills || 0) < 40) tips.push("Sharpen core stack depth instead of broadening with weak claims.");
  if (Number(current.percentile_overall || 0) >= 75) tips.push("You are ahead of most peers. Focus on interview articulation.");

  return {
    overall: current.percentile_overall || 0,
    skills: current.percentile_skills || 0,
    projects: current.percentile_projects || 0,
    experience: current.percentile_experience || 0,
    academic: current.percentile_academic || 0,
    tips
  };
};
