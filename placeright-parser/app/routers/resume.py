from __future__ import annotations

from fastapi import APIRouter, File, HTTPException, Request, UploadFile

from app.config import MAX_FILE_SIZE, allowed_file

router = APIRouter(tags=["Resume"])


@router.post("/parse-resume")
async def parse_resume(request: Request, file: UploadFile = File(...)):
    if not file.filename or not allowed_file(file.filename):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted")

    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large. Max 10MB")
    if len(contents) < 100:
        raise HTTPException(status_code=400, detail="File appears to be empty")

    parser = request.app.state.resume_parser
    try:
        result = parser.parse(contents)
        return {
            "success": True,
            "data": result,
            "message": (
                f"Successfully parsed resume. Found {result['skill_count']} skills, "
                f"{len(result['projects'])} projects, {len(result['experience'])} experiences."
            ),
        }
    except ValueError as error:
        raise HTTPException(status_code=422, detail=str(error)) from error
    except Exception as error:  # pragma: no cover - API safety
        raise HTTPException(status_code=500, detail=f"Failed to parse resume: {error}") from error
