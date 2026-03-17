from __future__ import annotations

import re
from typing import Dict, List, Optional


class SectionDetector:
    """
    Detects logical resume sections by combining header keywords with
    line-format heuristics. Coordinates may be passed in from the PDF
    extractor, but the detector still works on plain text alone.
    """

    SECTION_HEADERS = {
        "personal": [
            "personal information",
            "personal details",
            "contact",
            "contact information",
            "contact details",
            "about me",
        ],
        "summary": [
            "summary",
            "objective",
            "career objective",
            "professional summary",
            "profile summary",
            "about",
            "profile",
            "introduction",
        ],
        "education": [
            "education",
            "academic",
            "academics",
            "qualification",
            "qualifications",
            "educational qualification",
            "academic qualification",
            "academic details",
            "educational details",
            "scholastics",
        ],
        "skills": [
            "skills",
            "technical skills",
            "technologies",
            "tools & technologies",
            "tools and technologies",
            "technical proficiency",
            "competencies",
            "core competencies",
            "key skills",
            "skill set",
            "programming skills",
            "technology stack",
            "languages and tools",
            "tech stack",
        ],
        "experience": [
            "experience",
            "work experience",
            "professional experience",
            "employment",
            "employment history",
            "work history",
            "internship",
            "internships",
            "training",
            "industrial training",
        ],
        "projects": [
            "projects",
            "academic projects",
            "personal projects",
            "key projects",
            "major projects",
            "project work",
            "notable projects",
            "selected projects",
            "project experience",
            "mini projects",
        ],
        "certifications": [
            "certifications",
            "certification",
            "certificates",
            "professional certifications",
            "courses",
            "online courses",
            "training & certifications",
            "moocs",
            "coursework",
            "relevant coursework",
        ],
        "achievements": [
            "achievements",
            "awards",
            "honors",
            "accomplishments",
            "awards & achievements",
            "recognition",
            "extracurricular",
            "extra curricular",
            "activities",
            "co-curricular",
            "positions of responsibility",
            "por",
        ],
        "publications": [
            "publications",
            "research",
            "papers",
            "research papers",
            "research work",
        ],
    }

    @classmethod
    def _match_header(cls, line: str) -> Optional[str]:
        stripped = line.strip()
        if not stripped:
            return None

        clean = re.sub(r"[:\-–|#*_=\[\](){}]", "", stripped).strip().lower()
        compact = re.sub(r"\s+", " ", clean)

        for section_name, keywords in cls.SECTION_HEADERS.items():
            for keyword in keywords:
                if compact == keyword:
                    return section_name
                if len(compact) < 40 and compact.startswith(f"{keyword} "):
                    return section_name
                if len(compact) < 40 and keyword in compact:
                    return section_name

        if stripped.isupper() and len(stripped) < 40:
            lower = stripped.lower()
            for section_name, keywords in cls.SECTION_HEADERS.items():
                if any(keyword in lower for keyword in keywords):
                    return section_name
        return None

    @classmethod
    def detect_sections(cls, text: str, blocks: Optional[List[dict]] = None) -> Dict[str, str]:
        lines = text.split("\n")
        sections: Dict[str, str] = {}
        current_section = "header"
        current_lines: List[str] = []

        for line in lines:
            line_stripped = line.strip()
            if not line_stripped:
                if current_lines:
                    current_lines.append("")
                continue

            detected_section = cls._match_header(line_stripped)

            if not detected_section and blocks:
                matching_blocks = [
                    block for block in blocks if line_stripped.lower() in str(block.get("text", "")).lower()
                ]
                if matching_blocks:
                    block = matching_blocks[0]
                    if block.get("is_bold") and block.get("font_size", 0) >= 11:
                        detected_section = cls._match_header(line_stripped.upper())

            if detected_section:
                if current_lines:
                    sections[current_section] = "\n".join(current_lines).strip()
                current_section = detected_section
                current_lines = []
            else:
                current_lines.append(line_stripped)

        if current_lines:
            sections[current_section] = "\n".join(current_lines).strip()

        return {key: value for key, value in sections.items() if value}
