from __future__ import annotations

from fastapi import APIRouter

from app.config import API_VERSION

router = APIRouter(tags=["Health"])


@router.get("/health")
async def health_check():
    return {"status": "ok", "version": API_VERSION}
