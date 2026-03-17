from __future__ import annotations

from fastapi import APIRouter

from app.models.jd import JDInput
from app.services.jd_parser import JDParser

router = APIRouter(tags=["JD"])


@router.post("/parse-jd")
async def parse_jd(body: JDInput):
    result = JDParser.parse(body.jd_text)
    return {"success": True, "data": result}
