from __future__ import annotations

import re
from typing import List

from app.config import MAX_PROJECTS
from app.services.skill_extractor import SkillExtractor


class ProjectParser:
    """Parse project entries from a projects section."""

    @classmethod
    def parse(cls, project_section: str | None, all_text: str = "") -> List[dict]:
        if not project_section:
            return []

        projects: List[dict] = []
        lines = project_section.split("\n")
        current_project = None

        for line in lines:
            line = line.strip()
            if not line:
                continue

            if cls._is_project_title(line):
                if current_project:
                    projects.append(cls._finalize_project(current_project))
                current_project = {"title_line": line, "description_lines": []}
            elif current_project:
                current_project["description_lines"].append(line)
            else:
                current_project = {"title_line": line, "description_lines": []}

        if current_project:
            projects.append(cls._finalize_project(current_project))

        return projects[:MAX_PROJECTS]

    @staticmethod
    def _is_project_title(line: str) -> bool:
        clean = re.sub(r"^[•\-\–▪∙\d.)\]]+\s*", "", line).strip()
        if not clean or len(clean) > 110:
            return False

        if re.search(r"\[.*?\]|\(.*?(?:Python|React|Java|Node|Django|Flask|SQL).*?\)", clean, re.IGNORECASE):
            return True
        if "|" in clean and len(clean) < 90:
            return True

        action_verbs = {
            "built", "developed", "created", "designed", "implemented", "utilized", "integrated",
            "achieved", "reduced", "improved", "managed", "led", "collaborated", "contributed", "worked",
        }
        first_word = clean.split()[0].lower().rstrip(".,;:")
        return clean[0].isupper() and first_word not in action_verbs and len(clean.split()) <= 10

    @classmethod
    def _finalize_project(cls, raw: dict) -> dict:
        title_line = raw["title_line"]
        description = " ".join(raw["description_lines"]).strip()
        full_text = f"{title_line} {description}".strip()
        title = re.sub(r"\[.*?\]|\(.*?\)", "", title_line)
        title = re.sub(r"\|.*$", "", title)
        title = re.sub(r"^[•\-\–▪∙\d.)\]]+\s*", "", title).strip().rstrip(":|-")

        tech_stack = SkillExtractor.extract(full_text).get("skills", [])[:12]
        github = re.search(r"(https?://github\.com/\S+)", full_text, re.IGNORECASE)
        live = re.search(r"(https?://(?!github\.com)\S+)", full_text, re.IGNORECASE)

        is_team = bool(re.search(r"team\s*(?:of\s*)?(\d+)|\bgroup\b|collaborative|team project", full_text, re.IGNORECASE))
        team_match = re.search(r"team\s*(?:of\s*)?(\d+)|(\d+)\s*(?:members?|people)", full_text, re.IGNORECASE)
        team_size = int(team_match.group(1) or team_match.group(2)) if team_match else (4 if is_team else 1)

        duration_match = re.search(
            r"((?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s*\d{2,4})\s*[-–]\s*((?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s*\d{2,4}|present|current|ongoing)",
            full_text,
            re.IGNORECASE,
        )
        duration = f"{duration_match.group(1)} - {duration_match.group(2)}" if duration_match else None

        detail_score = 0
        if title and len(title) > 5:
            detail_score += 20
        if description and len(description) > 30:
            detail_score += 20
        if description and len(description) > 100:
            detail_score += 10
        if tech_stack:
            detail_score += 20
        if github:
            detail_score += 15
        if live:
            detail_score += 15

        return {
            "title": (title or title_line)[:100],
            "description": description[:700] if description else None,
            "tech_stack": tech_stack,
            "github_link": github.group(1) if github else None,
            "live_link": live.group(1) if live else None,
            "is_team_project": is_team,
            "team_size": team_size,
            "duration": duration,
            "detail_score": float(min(100, detail_score)),
        }
