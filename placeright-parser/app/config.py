from __future__ import annotations

import os
from functools import lru_cache
from typing import Iterable

from dotenv import load_dotenv

load_dotenv()

MAX_FILE_SIZE = 10 * 1024 * 1024
ALLOWED_EXTENSIONS = [".pdf"]
SPACY_MODEL = "en_core_web_sm"
API_VERSION = "1.0.0"
API_PREFIX = "/api"
REQUEST_TIMEOUT_SECONDS = 30
DEFAULT_SIMILARITY_THRESHOLD = 0.7
MAX_PROJECTS = 8
DEFAULT_ALLOWED_ORIGINS = ["*"]


@lru_cache(maxsize=1)
def get_environment() -> str:
    return os.getenv("PYTHON_ENV", "development").lower()


def normalize_whitespace(value: str) -> str:
    return " ".join((value or "").split())


def allowed_file(filename: str) -> bool:
    return any(filename.lower().endswith(extension) for extension in ALLOWED_EXTENSIONS)


def chunk_text(lines: Iterable[str]) -> str:
    return "\n".join(line.rstrip() for line in lines if line is not None).strip()
