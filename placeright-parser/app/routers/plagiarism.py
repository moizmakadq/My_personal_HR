from __future__ import annotations

from fastapi import APIRouter

from app.models.resume import PlagiarismInput
from app.services.plagiarism_checker import PlagiarismChecker

router = APIRouter(tags=["Plagiarism"])


@router.post("/check-plagiarism")
async def check_plagiarism(body: PlagiarismInput):
    result = PlagiarismChecker.check_similarity(body.resume_text, body.all_resumes)
    return {"success": True, "data": result}
