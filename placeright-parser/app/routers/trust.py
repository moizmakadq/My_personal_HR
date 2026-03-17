from __future__ import annotations

from fastapi import APIRouter

from app.models.trust import TrustInput
from app.services.trust_scorer import TrustScorer

router = APIRouter(tags=["Trust"])


@router.post("/calculate-trust")
async def calculate_trust(body: TrustInput):
    parsed_resume = body.parsed_resume.model_dump()
    result = TrustScorer.calculate(
        {"skills": parsed_resume.get("skills", []), "skill_categories": parsed_resume.get("skill_categories", {})},
        parsed_resume.get("projects", []),
        parsed_resume.get("experience", []),
        parsed_resume.get("certifications", []),
        parsed_resume.get("education", {}),
        parsed_resume.get("personal", {}),
        parsed_resume.get("raw_text", ""),
    )
    return {"success": True, "data": result}
