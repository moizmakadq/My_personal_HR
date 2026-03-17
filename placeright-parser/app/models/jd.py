from __future__ import annotations

from typing import Dict, List, Optional

from pydantic import BaseModel, Field


class JDInput(BaseModel):
    jd_text: str = Field(min_length=20)


class ParsedJD(BaseModel):
    company_name: Optional[str] = None
    role: Optional[str] = None
    location: Optional[str] = None
    ctc: Optional[str] = None
    ctc_lpa: Optional[float] = None
    job_type: Optional[str] = None
    min_cgpa: Optional[float] = None
    max_backlogs: Optional[int] = None
    eligible_departments: List[str] = Field(default_factory=list)
    must_have_skills: List[str] = Field(default_factory=list)
    good_to_have_skills: List[str] = Field(default_factory=list)
    experience_requirement: Optional[str] = None
    hiring_count: Optional[int] = None
    extracted_highlights: Dict[str, str] = Field(default_factory=dict)


class JDResponse(BaseModel):
    success: bool
    data: ParsedJD
