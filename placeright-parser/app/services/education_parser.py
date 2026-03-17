from __future__ import annotations

import re

from app.data.universities_database import KNOWN_UNIVERSITIES


class EducationParser:
    """Parse degree, branch, university, CGPA, percentages, and graduation year."""

    @staticmethod
    def parse(text: str, education_section: str | None = None, nlp=None) -> dict:
        search_text = education_section if education_section else text
        text_lower = search_text.lower()
        full_lower = text.lower()

        result = {
            "degree": None,
            "branch": None,
            "university": None,
            "cgpa": None,
            "cgpa_scale": 10,
            "graduation_year": None,
            "tenth_percentage": None,
            "twelfth_percentage": None,
        }

        degree_patterns = [
            (r"b\.?\s*tech(?:nology)?|bachelor\s*of\s*technology", "B.Tech"),
            (r"b\.?\s*e\.?|bachelor\s*of\s*engineering", "B.E."),
            (r"m\.?\s*tech(?:nology)?|master\s*of\s*technology", "M.Tech"),
            (r"b\.?\s*sc|bachelor\s*of\s*science", "B.Sc"),
            (r"m\.?\s*sc|master\s*of\s*science", "M.Sc"),
            (r"\bbca\b|b\.?\s*c\.?\s*a", "BCA"),
            (r"\bmca\b|m\.?\s*c\.?\s*a", "MCA"),
            (r"b\.?\s*com|bachelor\s*of\s*commerce", "B.Com"),
            (r"\bmba\b|m\.?\s*b\.?\s*a", "MBA"),
            (r"ph\.?\s*d|doctorate", "Ph.D"),
        ]
        for pattern, degree_name in degree_patterns:
            if re.search(pattern, text_lower):
                result["degree"] = degree_name
                break

        branch_patterns = [
            (r"computer\s*science|cse\b|cs\b", "Computer Science & Engineering"),
            (r"information\s*technology|it\b", "Information Technology"),
            (r"electronics?\s*(?:&|and)\s*comm", "Electronics & Communication"),
            (r"electrical\s*eng", "Electrical Engineering"),
            (r"mechanical\s*eng", "Mechanical Engineering"),
            (r"civil\s*eng", "Civil Engineering"),
            (r"chemical\s*eng", "Chemical Engineering"),
            (r"bio\s*tech", "Biotechnology"),
            (r"data\s*science", "Data Science"),
            (r"artificial\s*intelligence|ai\s*(?:&|and)\s*ml", "AI & ML"),
        ]
        for pattern, branch_name in branch_patterns:
            if re.search(pattern, text_lower):
                result["branch"] = branch_name
                break

        if nlp and education_section:
            doc = nlp(education_section)
            for ent in doc.ents:
                if ent.label_ == "ORG":
                    org_text = ent.text.strip()
                    if any(
                        token in org_text.lower()
                        for token in ["university", "institute", "college", "iit", "nit", "iiit", "bits", "vit", "srm"]
                    ):
                        result["university"] = org_text
                        break

        if not result["university"]:
            for university in KNOWN_UNIVERSITIES:
                if university.lower() in text_lower:
                    result["university"] = university
                    break

        cgpa_patterns = [
            r"(?:cgpa|cpi|gpa|grade\s*point)\s*[:\-–]?\s*(\d+\.?\d*)\s*(?:[/]|out of\s*)(\d+(?:\.\d+)?)",
            r"(?:cgpa|cpi|gpa|grade\s*point)\s*[:\-–]?\s*(\d+\.?\d*)",
            r"(\d+\.\d{1,2})\s*/\s*(\d+(?:\.\d+)?)\s*(?:cgpa|cpi|gpa)?",
        ]
        for pattern in cgpa_patterns:
            match = re.search(pattern, text_lower)
            if not match:
                continue
            cgpa_val = float(match.group(1))
            if cgpa_val <= 10:
                result["cgpa"] = cgpa_val
                if match.lastindex and match.lastindex >= 2 and match.group(2):
                    result["cgpa_scale"] = float(match.group(2))
                break

        tenth_patterns = [
            r"(?:10th|x(?:th)?|ssc|secondary|class[\s\-]*10|matriculation).*?(\d{2,3}(?:\.\d+)?)\s*%",
            r"(\d{2,3}(?:\.\d+)?)\s*%\s*(?:in\s*)?(?:10th|x(?:th)?|ssc|secondary|class[\s\-]*10)",
        ]
        for pattern in tenth_patterns:
            match = re.search(pattern, full_lower)
            if match:
                value = float(match.group(1))
                if 30 <= value <= 100:
                    result["tenth_percentage"] = value
                    break

        twelfth_patterns = [
            r"(?:12th|xii(?:th)?|hsc|senior\s*secondary|class[\s\-]*12|inter(?:mediate)?).*?(\d{2,3}(?:\.\d+)?)\s*%",
            r"(\d{2,3}(?:\.\d+)?)\s*%\s*(?:in\s*)?(?:12th|xii|hsc|senior|class[\s\-]*12)",
        ]
        for pattern in twelfth_patterns:
            match = re.search(pattern, full_lower)
            if match:
                value = float(match.group(1))
                if 30 <= value <= 100:
                    result["twelfth_percentage"] = value
                    break

        year_patterns = [
            r"(?:expected|graduating|batch\s*(?:of)?|class\s*(?:of)?)\s*[:\-]?\s*(20[2-3]\d)",
            r"(20[2-3]\d)\s*(?:expected|graduating|batch|present|current)",
            r"(20[2-3]\d)\s*[-–]\s*(?:present|current|ongoing|20[2-3]\d)",
        ]
        for pattern in year_patterns:
            match = re.search(pattern, text_lower)
            if match:
                year = int(match.group(1))
                if 2020 <= year <= 2035:
                    result["graduation_year"] = year
                    break

        return result
