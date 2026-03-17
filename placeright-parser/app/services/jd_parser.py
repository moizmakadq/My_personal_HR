from __future__ import annotations

import re

from app.data.cities_database import INDIAN_CITIES
from app.data.companies_database import KNOWN_COMPANIES
from app.services.skill_extractor import SkillExtractor


class JDParser:
    """Parse raw Job Description text into a structured hiring summary."""

    @staticmethod
    def parse(jd_text: str) -> dict:
        text = jd_text.strip()
        text_lower = text.lower()

        company_name = next((company for company in KNOWN_COMPANIES if company.lower() in text_lower), None)
        if not company_name:
            company_match = re.search(r"company\s*[:\-]\s*(.+)", text, re.IGNORECASE)
            company_name = company_match.group(1).strip() if company_match else text.splitlines()[0].strip()[:120]

        role_match = (
            re.search(r"(?:role|position|job title)\s*[:\-]\s*(.+)", text, re.IGNORECASE)
            or re.search(r"hiring\s+(?:for|an?)\s+([A-Za-z0-9 .+/()\-]+)", text, re.IGNORECASE)
        )
        role = role_match.group(1).strip() if role_match else "Software Engineer"

        location = next((city for city in INDIAN_CITIES if city.lower() in text_lower), None)
        ctc_match = re.search(r"(?:ctc|salary|package)\s*[:\-]?\s*([A-Za-z0-9 .,+/-]+)", text, re.IGNORECASE)
        ctc_lpa_match = re.search(r"(\d+(?:\.\d+)?)\s*lpa", text, re.IGNORECASE)
        job_type = "internship" if "intern" in text_lower else "full_time"
        min_cgpa_match = re.search(r"cgpa\s*(?:of|>=|:)?\s*(\d+(?:\.\d+)?)", text, re.IGNORECASE)
        backlog_match = re.search(r"(?:backlogs|max backlogs)\s*(\d+)", text, re.IGNORECASE)
        experience_match = re.search(r"(\d+\+?\s+years?\s+experience)", text, re.IGNORECASE)
        hiring_match = re.search(r"(?:hiring|openings|positions)\s*(\d+)", text, re.IGNORECASE)

        eligible_departments = []
        for department in ["CSE", "IT", "ECE", "EEE", "ME", "Civil"]:
            if department.lower() in text_lower:
                eligible_departments.append(department)
        if "all branches" in text_lower or "all departments" in text_lower:
            eligible_departments = ["CSE", "IT", "ECE", "EEE", "ME", "Civil"]
        if not eligible_departments:
            eligible_departments = ["CSE", "IT"]

        found_skills = SkillExtractor.extract(text)
        must_have_raw = []
        good_to_have_raw = []
        for line in text.splitlines():
            lower = line.lower()
            line_skills = SkillExtractor.extract(line).get("skills", [])
            if any(token in lower for token in ["must have", "required", "mandatory"]):
                must_have_raw.extend(line_skills)
            elif "good to have" in lower or "preferred" in lower:
                good_to_have_raw.extend(line_skills)

        must_have_skills = sorted(set(must_have_raw))
        good_to_have_skills = sorted(set(good_to_have_raw or [skill for skill in found_skills["skills"] if skill not in must_have_skills]))

        return {
            "company_name": company_name,
            "role": role,
            "location": location,
            "ctc": ctc_match.group(1).strip() if ctc_match else None,
            "ctc_lpa": float(ctc_lpa_match.group(1)) if ctc_lpa_match else None,
            "job_type": job_type,
            "min_cgpa": float(min_cgpa_match.group(1)) if min_cgpa_match else None,
            "max_backlogs": int(backlog_match.group(1)) if backlog_match else None,
            "eligible_departments": eligible_departments,
            "must_have_skills": must_have_skills,
            "good_to_have_skills": good_to_have_skills,
            "experience_requirement": experience_match.group(1) if experience_match else None,
            "hiring_count": int(hiring_match.group(1)) if hiring_match else None,
            "extracted_highlights": {
                "has_bond": "bond" in text_lower and "yes" or "no",
                "mentions_remote": "remote" in text_lower and "yes" or "no",
                "mentions_training": "training" in text_lower and "yes" or "no",
            },
        }
