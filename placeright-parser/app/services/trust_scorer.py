from __future__ import annotations

import re
from typing import Dict, List


class TrustScorer:
    """Calculate Resume Trust Score based on internal consistency."""

    @staticmethod
    def _timeline_consistency(experience: List[dict], education: dict) -> int:
        score = 100
        graduation_year = education.get("graduation_year")
        years = []
        for item in experience:
            span = f"{item.get('start_date', '')} {item.get('end_date', '')}"
            matches = re.findall(r"(20\d{2})", span)
            if matches:
                years.append(tuple(int(match) for match in matches[:2]))
        for start, *rest in years:
            end = rest[0] if rest else start
            if end < start:
                score -= 20
            if graduation_year and end > graduation_year + 1:
                score -= 20
        return max(score, 0)

    @staticmethod
    def calculate(
        skills_data: dict,
        projects: List[dict],
        experience: List[dict],
        certifications: List[dict],
        education: dict,
        personal: dict,
        raw_text: str,
    ) -> dict:
        scores: Dict[str, float] = {}

        skills = skills_data.get("skills", [])
        total_skills = len(skills)
        project_tech = {tech.lower() for project in projects for tech in (project.get("tech_stack") or [])}
        exp_tech = {tech.lower() for item in experience for tech in (item.get("tech_stack") or [])}
        cert_titles = [certification.get("title", "").lower() for certification in certifications if certification.get("title")]

        skills_with_evidence = 0
        for skill in skills:
            skill_lower = skill.lower()
            if skill_lower in project_tech or skill_lower in exp_tech or any(skill_lower in title for title in cert_titles):
                skills_with_evidence += 1
        scores["skill_evidence"] = round((skills_with_evidence / max(total_skills, 1)) * 100, 1)

        if projects:
            scores["project_depth"] = round(
                sum(float(project.get("detail_score", 0)) for project in projects) / len(projects),
                1,
            )
        else:
            scores["project_depth"] = 0

        scores["timeline"] = float(TrustScorer._timeline_consistency(experience, education))

        if total_skills <= 8:
            scores["skill_reasonability"] = 100
        elif total_skills <= 12:
            scores["skill_reasonability"] = 80
        elif total_skills <= 18:
            scores["skill_reasonability"] = 50
        else:
            scores["skill_reasonability"] = 20

        completeness = 0
        if personal.get("name"):
            completeness += 15
        if personal.get("email"):
            completeness += 10
        if personal.get("phone"):
            completeness += 10
        if education.get("degree"):
            completeness += 15
        if education.get("cgpa") is not None:
            completeness += 10
        if skills:
            completeness += 15
        if projects:
            completeness += 15
        if experience:
            completeness += 5
        if personal.get("github") or personal.get("linkedin"):
            completeness += 5
        scores["completeness"] = min(100, completeness)

        scores["uniqueness"] = 100

        weights = {
            "skill_evidence": 0.30,
            "project_depth": 0.20,
            "timeline": 0.15,
            "skill_reasonability": 0.10,
            "completeness": 0.15,
            "uniqueness": 0.10,
        }
        total = sum(scores[name] * weight for name, weight in weights.items())
        return {"total_score": round(total, 1), "breakdown": scores}
