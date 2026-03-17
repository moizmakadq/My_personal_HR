from __future__ import annotations

import re
from typing import Optional

from app.data.cities_database import INDIAN_CITIES


class PersonalParser:
    """Parse personal information from the top of the resume and full text."""

    @staticmethod
    def parse(text: str, header_text: str = "", nlp=None) -> dict:
        result = {
            "name": None,
            "email": None,
            "phone": None,
            "location": None,
            "github": None,
            "linkedin": None,
            "portfolio": None,
        }

        email_pattern = r"[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}"
        email_match = re.search(email_pattern, text)
        if email_match:
            result["email"] = email_match.group().lower()

        phone_patterns = [
            r"(?:\+91[\s\-]?)?[6-9]\d{4}[\s\-]?\d{5}",
            r"(?:\+91[\s\-]?)?[6-9]\d{9}",
            r"(?:\+91[\s\-]?)?\d{5}[\s\-]?\d{5}",
            r"\(\+?91\)\s*\d{5}[\s\-]?\d{5}",
        ]
        for pattern in phone_patterns:
            phone_match = re.search(pattern, text)
            if phone_match:
                result["phone"] = phone_match.group().strip()
                break

        github = re.search(r"(?:https?://)?(?:www\.)?github\.com/([a-zA-Z0-9_.\-]+)", text, re.IGNORECASE)
        linkedin = re.search(r"(?:https?://)?(?:www\.)?linkedin\.com/in/([a-zA-Z0-9_.\-]+)", text, re.IGNORECASE)
        portfolio = re.search(
            r"(?:https?://)?(?!github|linkedin|facebook|twitter|instagram|leetcode|hackerrank)([a-zA-Z0-9\-]+\.[a-zA-Z]{2,}(?:/[^\s]*)?)",
            text,
            re.IGNORECASE,
        )

        if github:
            result["github"] = f"https://github.com/{github.group(1)}"
        if linkedin:
            result["linkedin"] = f"https://linkedin.com/in/{linkedin.group(1)}"
        if portfolio:
            candidate = portfolio.group(1)
            if result["email"] and candidate.lower() not in result["email"]:
                result["portfolio"] = f"https://{candidate}"

        if nlp:
            doc = nlp(text[:500])
            for ent in doc.ents:
                if ent.label_ == "PERSON":
                    candidate_name = ent.text.strip()
                    words = candidate_name.split()
                    if 2 <= len(words) <= 4 and not re.search(r"\d", candidate_name) and len(candidate_name) < 50:
                        result["name"] = candidate_name
                        break

        if not result["name"]:
            search_text = header_text if header_text else text
            lines = [line.strip() for line in search_text.split("\n") if line.strip()]
            for line in lines[:6]:
                if (
                    len(line) < 40
                    and not re.search(r"[@:/]", line)
                    and not re.search(r"\d{4,}", line)
                    and not any(
                        keyword in line.lower()
                        for keyword in [
                            "resume",
                            "cv",
                            "curriculum",
                            "phone",
                            "email",
                            "address",
                            "mobile",
                            "tel",
                            "summary",
                            "objective",
                            ".com",
                            ".org",
                            ".in",
                        ]
                    )
                    and 2 <= len(line.split()) <= 4
                ):
                    result["name"] = line
                    break

        text_lower = text.lower()
        for city in INDIAN_CITIES:
            if city.lower() in text_lower:
                result["location"] = city
                break

        return result
