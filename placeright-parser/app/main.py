from __future__ import annotations

from contextlib import asynccontextmanager

import spacy
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import API_VERSION, DEFAULT_ALLOWED_ORIGINS, MAX_FILE_SIZE, SPACY_MODEL
from app.routers import health, jd, plagiarism, resume, trust
from app.services.resume_parser import ResumeParser


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        nlp = spacy.load(SPACY_MODEL)
    except OSError:
        fallback = spacy.blank("en")
        if "sentencizer" not in fallback.pipe_names:
            fallback.add_pipe("sentencizer")
        nlp = fallback

    app.state.nlp = nlp
    app.state.resume_parser = ResumeParser(nlp=nlp)
    yield


app = FastAPI(
    title="PlaceRight Resume Parser API",
    version=API_VERSION,
    description="Resume parsing, JD parsing, trust scoring, and plagiarism detection API for PlaceRight.",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=DEFAULT_ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def catch_exceptions_middleware(request: Request, call_next):
    try:
        if request.url.path.endswith("/parse-resume"):
            content_length = request.headers.get("content-length")
            if content_length and int(content_length) > MAX_FILE_SIZE:
                return JSONResponse(status_code=413, content={"detail": "Request too large. Max 10MB"})
        return await call_next(request)
    except Exception as error:  # pragma: no cover - safety net
        return JSONResponse(status_code=500, content={"detail": f"Unhandled server error: {error}"})


@app.get("/")
async def root():
    return {
        "name": "PlaceRight Resume Parser API",
        "version": API_VERSION,
        "docs": "/docs",
        "health": "/health",
    }


app.include_router(health.router)
app.include_router(resume.router)
app.include_router(jd.router)
app.include_router(trust.router)
app.include_router(plagiarism.router)
