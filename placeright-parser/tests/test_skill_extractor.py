from __future__ import annotations

from app.services.plagiarism_checker import PlagiarismChecker
from app.services.skill_authenticator import SkillAuthenticator
from app.services.skill_extractor import SkillExtractor
from app.services.trust_scorer import TrustScorer


def test_skill_extractor_handles_special_character_skills():
    text = "Skills: Python, C++, Node.js, React, PostgreSQL, Docker"
    result = SkillExtractor.extract(text, text)
    assert "C++" in result["skills"]
    assert "Node.js" in result["skills"]


def test_skill_extractor_groups_categories():
    text = "Worked with React, FastAPI, PostgreSQL, Docker and AWS in multiple projects."
    result = SkillExtractor.extract(text)
    assert "frontend" in result["skill_categories"]
    assert "backend" in result["skill_categories"]
    assert "database" in result["skill_categories"]


def test_skill_authenticator_marks_verified_partial_and_unverified():
    skills = ["Python", "Docker", "Kubernetes"]
    projects = [{"tech_stack": ["Python", "Docker"]}]
    experience = [{"tech_stack": ["Python"]}]
    certifications = [{"title": "Docker Foundations"}]
    result = SkillAuthenticator.authenticate(skills, projects, experience, certifications)
    assert result["Python"] == "verified"
    assert result["Docker"] == "verified"
    assert result["Kubernetes"] == "unverified"


def test_trust_scorer_rewards_evidence_and_completeness():
    trust = TrustScorer.calculate(
        {"skills": ["Python", "React"], "skill_categories": {"programming": ["Python"], "frontend": ["React"]}},
        [{"title": "Placement Portal", "detail_score": 80, "tech_stack": ["Python", "React"]}],
        [{"role": "Intern", "tech_stack": ["Python"], "start_date": "Jun 2024", "end_date": "Aug 2024"}],
        [{"title": "React Certification"}],
        {"degree": "B.Tech", "cgpa": 8.1, "graduation_year": 2025},
        {"name": "Priya", "email": "priya@example.com", "phone": "9876543210", "github": "https://github.com/priya"},
        "sample raw text",
    )
    assert trust["total_score"] >= 70
    assert trust["breakdown"]["skill_evidence"] == 100.0


def test_plagiarism_checker_flags_high_similarity():
    resume_text = "Built a React and Node.js ecommerce platform with MongoDB and Docker deployment."
    others = [
        "Built a React and Node.js ecommerce platform with MongoDB and Docker deployment.",
        "Worked on machine learning for agriculture forecasting."
    ]
    result = PlagiarismChecker.check_similarity(resume_text, others)
    assert result["flagged"] is True
    assert result["max_similarity"] >= 90
