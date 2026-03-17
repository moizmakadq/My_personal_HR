from __future__ import annotations

import re
from typing import List

from app.data.companies_database import KNOWN_COMPANIES
from app.services.skill_extractor import SkillExtractor


class ExperienceParser:
    """Parse internship and work experience entries."""

    DATE_PATTERN = re.compile(
        r"((?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\.?\s*\d{2,4})\s*[-–]\s*((?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\.?\s*\d{2,4}|present|current)",
        re.IGNORECASE,
    )

    @classmethod
    def parse(cls, experience_section: str | None, all_text: str = "", nlp=None) -> List[dict]:
        if not experience_section:
            return []

        blocks = [
            block.strip()
            for block in re.split(r"\n\s*\n|(?=\n[•\-\*])", experience_section)
            if block.strip()
        ]
        experiences: List[dict] = []

        for block in blocks:
            lines = [re.sub(r"^[•\-\*]\s*", "", line.strip()) for line in block.split("\n") if line.strip()]
            if not lines:
                continue

            header = lines[0]
            role = None
            company = None

            if "@" in header:
                left, right = [part.strip() for part in header.split("@", 1)]
                role, company = left, right
            elif "|" in header:
                left, right = [part.strip() for part in header.split("|", 1)]
                role, company = left, right
            else:
                role = header

            if not company:
                for known_company in KNOWN_COMPANIES:
                    if known_company.lower() in block.lower():
                        company = known_company
                        break

            if not company and nlp:
                doc = nlp(block[:250])
                orgs = [ent.text.strip() for ent in doc.ents if ent.label_ == "ORG"]
                if orgs:
                    company = orgs[0]

            dates = cls.DATE_PATTERN.search(block)
            start_date = dates.group(1) if dates else None
            end_date = dates.group(2) if dates else None

            description_lines = lines[1:] if len(lines) > 1 else []
            description = " ".join(description_lines).strip() or None
            tech_stack = SkillExtractor.extract(block).get("skills", [])[:12]

            duration_months = None
            duration_match = re.search(r"(\d+)\s*(?:months?|mos?)", block, re.IGNORECASE)
            if duration_match:
                duration_months = int(duration_match.group(1))

            experiences.append(
                {
                    "company_name": company,
                    "role": role,
                    "description": description,
                    "tech_stack": tech_stack,
                    "start_date": start_date,
                    "end_date": end_date,
                    "duration_months": duration_months,
                }
            )

        return experiences[:8]
