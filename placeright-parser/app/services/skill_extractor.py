from __future__ import annotations

import re
from typing import Dict, List

from app.data.skills_database import ALL_SKILLS, CASING_MAP, MASTER_SKILLS, SKILL_ALIASES


class SkillExtractor:
    """
    Extract skills from both explicit skills sections and contextual mentions
    across projects, experiences, and certifications.
    """

    @staticmethod
    def _make_pattern(term: str) -> re.Pattern[str]:
        escaped = re.escape(term.lower())
        return re.compile(rf"(^|[^a-z0-9]){escaped}(?=$|[^a-z0-9])", re.IGNORECASE)

    @classmethod
    def extract(cls, text: str, skills_section: str | None = None) -> dict:
        found_skills: Dict[str, dict] = {}
        text_lower = text.lower()
        skills_section_lower = (skills_section or "").lower()

        for category, skills_list in MASTER_SKILLS.items():
            for skill in skills_list:
                canonical_key = skill.lower()
                variants = [canonical_key] + SKILL_ALIASES.get(canonical_key, [])
                for variant in variants:
                    if cls._make_pattern(variant).search(text_lower):
                        canonical = CASING_MAP.get(canonical_key, skill)
                        bucket = found_skills.setdefault(
                            canonical.lower(),
                            {"name": canonical, "category": category, "locations": []},
                        )
                        if skills_section_lower and cls._make_pattern(variant).search(skills_section_lower):
                            bucket["locations"].append("skills_section")
                        else:
                            bucket["locations"].append("resume_context")
                        break

        skill_categories: Dict[str, List[str]] = {}
        skills_list: List[str] = []
        skills_with_context: List[dict] = []

        for _, data in sorted(found_skills.items(), key=lambda item: item[1]["name"].lower()):
            skills_list.append(data["name"])
            skill_categories.setdefault(data["category"], []).append(data["name"])
            skills_with_context.append(
                {
                    "skill": data["name"],
                    "category": data["category"],
                    "found_in": sorted(set(data["locations"])),
                }
            )

        return {
            "skills": skills_list,
            "skill_categories": skill_categories,
            "skill_count": len(skills_list),
            "skills_with_context": skills_with_context,
        }

    @classmethod
    def extract_from_fragment(cls, text: str) -> List[str]:
        return cls.extract(text).get("skills", [])

    @staticmethod
    def normalize_skill(skill: str) -> str:
        return CASING_MAP.get(skill.lower(), skill.strip())

    @staticmethod
    def is_known_skill(skill: str) -> bool:
        return skill.lower() in {item.lower() for item in ALL_SKILLS}
