from __future__ import annotations

import hashlib
import subprocess
import sys
from datetime import datetime

import spacy

from app.services.certification_parser import CertificationParser
from app.services.education_parser import EducationParser
from app.services.experience_parser import ExperienceParser
from app.services.pdf_extractor import PDFExtractor
from app.services.personal_parser import PersonalParser
from app.services.project_parser import ProjectParser
from app.services.section_detector import SectionDetector
from app.services.skill_authenticator import SkillAuthenticator
from app.services.skill_extractor import SkillExtractor
from app.services.trust_scorer import TrustScorer


class ResumeParser:
    """
    Main orchestrator for PDF resume parsing.
    """

    def __init__(self, nlp=None):
        self.nlp = nlp or self._load_spacy_model()

    @staticmethod
    def _load_spacy_model():
        try:
            return spacy.load("en_core_web_sm")
        except OSError:
            try:
                subprocess.run(
                    [sys.executable, "-m", "spacy", "download", "en_core_web_sm"],
                    check=True,
                    capture_output=True,
                )
                return spacy.load("en_core_web_sm")
            except Exception:
                fallback = spacy.blank("en")
                if "sentencizer" not in fallback.pipe_names:
                    fallback.add_pipe("sentencizer")
                return fallback

    def parse(self, pdf_bytes: bytes) -> dict:
        extraction = PDFExtractor.extract(pdf_bytes)
        raw_text = extraction["text"]
        blocks = extraction.get("pages", [{}])[0].get("blocks", []) if extraction.get("pages") else []

        if len(raw_text.strip()) < 50:
            raise ValueError("Could not extract sufficient text from PDF")

        sections = SectionDetector.detect_sections(raw_text, blocks)

        personal = PersonalParser.parse(raw_text, sections.get("header", ""), self.nlp)
        education = EducationParser.parse(raw_text, sections.get("education", ""), self.nlp)
        skills_data = SkillExtractor.extract(raw_text, sections.get("skills", ""))
        projects = ProjectParser.parse(sections.get("projects", ""), raw_text)
        experience = ExperienceParser.parse(sections.get("experience", ""), raw_text, self.nlp)
        certifications = CertificationParser.parse(sections.get("certifications", ""))
        summary = sections.get("summary")

        skill_authenticity = SkillAuthenticator.authenticate(
            skills_data["skills"], projects, experience, certifications
        )
        trust = TrustScorer.calculate(
            skills_data, projects, experience, certifications, education, personal, raw_text
        )

        fingerprint_payload = (
            "|".join(sorted(skill.lower() for skill in skills_data["skills"]))
            + "||"
            + "|".join(sorted(project["title"].lower() for project in projects if project.get("title")))
        )
        fingerprint = hashlib.md5(fingerprint_payload.encode("utf-8")).hexdigest()

        return {
            "personal": personal,
            "education": education,
            "skills": skills_data["skills"],
            "skill_categories": skills_data["skill_categories"],
            "skill_count": skills_data["skill_count"],
            "skill_authenticity": skill_authenticity,
            "projects": projects,
            "experience": experience,
            "certifications": certifications,
            "summary": summary,
            "links": {
                "github": personal.get("github"),
                "linkedin": personal.get("linkedin"),
                "portfolio": personal.get("portfolio"),
            },
            "trust_score": trust["total_score"],
            "trust_breakdown": trust["breakdown"],
            "resume_fingerprint": fingerprint,
            "raw_text": raw_text,
            "extraction_method": extraction.get("method", "unknown"),
            "sections_detected": list(sections.keys()),
            "parsed_at": datetime.utcnow().isoformat(),
        }
