from __future__ import annotations

from pathlib import Path

from fastapi.testclient import TestClient

from app.main import app
from app.services.jd_parser import JDParser
from app.services.pdf_extractor import PDFExtractor
from app.services.resume_parser import ResumeParser


SAMPLE_PDF = Path(__file__).with_name("sample_resume.pdf")


def test_health_endpoint():
    client = TestClient(app)
    response = client.get("/health")
    assert response.status_code == 200
    payload = response.json()
    assert payload["status"] == "ok"
    assert payload["version"] == "1.0.0"


def test_pdf_extractor_reads_sample_pdf():
    result = PDFExtractor.extract(SAMPLE_PDF.read_bytes())
    assert result["text"]
    assert "Priya Sharma" in result["text"]
    assert result["metadata"]["pages"] >= 1


def test_resume_parser_extracts_core_fields():
    parser = ResumeParser()
    result = parser.parse(SAMPLE_PDF.read_bytes())
    assert result["personal"]["name"]
    assert result["personal"]["email"] == "priya.sharma@example.com"
    assert result["skill_count"] >= 5
    assert len(result["projects"]) >= 1
    assert result["trust_score"] > 0


def test_parse_resume_endpoint_accepts_pdf():
    client = TestClient(app)
    with SAMPLE_PDF.open("rb") as handle:
        response = client.post("/parse-resume", files={"file": ("sample_resume.pdf", handle, "application/pdf")})
    assert response.status_code == 200
    payload = response.json()
    assert payload["success"] is True
    assert payload["data"]["personal"]["email"] == "priya.sharma@example.com"


def test_jd_parser_extracts_skills_and_role():
    jd = """
    Razorpay Campus Hiring
    Role: Backend Engineer
    Location: Bengaluru
    CTC: 14 LPA
    Must have: Java, Spring Boot, PostgreSQL, Docker
    Good to have: AWS, React
    CGPA 7.5
    Hiring 8
    """
    result = JDParser.parse(jd)
    assert result["company_name"] == "Razorpay"
    assert result["role"] == "Backend Engineer"
    assert "Java" in result["must_have_skills"]
