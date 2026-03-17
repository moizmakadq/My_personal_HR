from __future__ import annotations

from typing import Dict, Iterable, List


class SkillAuthenticator:
    """
    Determine whether each claimed skill is verified, partial, or unverified
    based on project, experience, and certification evidence.
    """

    @staticmethod
    def authenticate(skills: Iterable[str], projects: List[dict], experience: List[dict], certifications: List[dict]) -> Dict[str, str]:
        result: Dict[str, str] = {}

        project_tech = {tech.lower() for project in projects for tech in (project.get("tech_stack") or [])}
        exp_tech = {tech.lower() for item in experience for tech in (item.get("tech_stack") or [])}
        cert_titles = [certification.get("title", "").lower() for certification in certifications]

        for skill in skills:
            skill_lower = skill.lower()
            in_projects = skill_lower in project_tech
            in_experience = skill_lower in exp_tech
            in_certs = any(skill_lower in title for title in cert_titles)
            evidence_count = sum([in_projects, in_experience, in_certs])

            if evidence_count >= 2:
                result[skill] = "verified"
            elif evidence_count == 1:
                result[skill] = "partial"
            else:
                result[skill] = "unverified"

        return result
