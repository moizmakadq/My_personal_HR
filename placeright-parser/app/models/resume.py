from __future__ import annotations

from datetime import datetime
from typing import Dict, List, Optional

from pydantic import BaseModel, Field


class PersonalInfo(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    github: Optional[str] = None
    linkedin: Optional[str] = None
    portfolio: Optional[str] = None


class EducationInfo(BaseModel):
    degree: Optional[str] = None
    branch: Optional[str] = None
    university: Optional[str] = None
    cgpa: Optional[float] = None
    cgpa_scale: Optional[float] = 10
    graduation_year: Optional[int] = None
    tenth_percentage: Optional[float] = None
    twelfth_percentage: Optional[float] = None


class ProjectInfo(BaseModel):
    title: str
    description: Optional[str] = None
    tech_stack: List[str] = Field(default_factory=list)
    github_link: Optional[str] = None
    live_link: Optional[str] = None
    is_team_project: bool = False
    team_size: int = 1
    duration: Optional[str] = None
    detail_score: float = 0


class ExperienceInfo(BaseModel):
    company_name: Optional[str] = None
    role: Optional[str] = None
    description: Optional[str] = None
    tech_stack: List[str] = Field(default_factory=list)
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    duration_months: Optional[int] = None


class CertificationInfo(BaseModel):
    title: str
    issuing_organization: Optional[str] = None
    credential_url: Optional[str] = None
    issue_date: Optional[str] = None


class ResumeData(BaseModel):
    personal: PersonalInfo
    education: EducationInfo
    skills: List[str] = Field(default_factory=list)
    skill_categories: Dict[str, List[str]] = Field(default_factory=dict)
    skill_count: int = 0
    skill_authenticity: Dict[str, str] = Field(default_factory=dict)
    projects: List[ProjectInfo] = Field(default_factory=list)
    experience: List[ExperienceInfo] = Field(default_factory=list)
    certifications: List[CertificationInfo] = Field(default_factory=list)
    summary: Optional[str] = None
    links: Dict[str, Optional[str]] = Field(default_factory=dict)
    trust_score: float = 0
    trust_breakdown: Dict[str, float] = Field(default_factory=dict)
    resume_fingerprint: str
    raw_text: str
    extraction_method: str
    sections_detected: List[str] = Field(default_factory=list)
    parsed_at: datetime


class ParseResumeResponse(BaseModel):
    success: bool
    data: ResumeData
    message: str


class PlagiarismInput(BaseModel):
    resume_text: str
    all_resumes: List[str] = Field(default_factory=list)
