from __future__ import annotations

from typing import Dict, List, Optional

from pydantic import BaseModel, Field


class ParsedResumeInput(BaseModel):
    personal: Dict[str, Optional[str]] = Field(default_factory=dict)
    education: Dict[str, Optional[float]] = Field(default_factory=dict)
    skills: List[str] = Field(default_factory=list)
    skill_categories: Dict[str, List[str]] = Field(default_factory=dict)
    projects: List[Dict[str, object]] = Field(default_factory=list)
    experience: List[Dict[str, object]] = Field(default_factory=list)
    certifications: List[Dict[str, object]] = Field(default_factory=list)
    raw_text: str = ""


class TrustInput(BaseModel):
    parsed_resume: ParsedResumeInput


class TrustResponse(BaseModel):
    success: bool
    data: Dict[str, object]


class PlagiarismResponse(BaseModel):
    success: bool
    data: Dict[str, object]
