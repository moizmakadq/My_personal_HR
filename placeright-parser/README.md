# PlaceRight Resume Parser API

Production-ready FastAPI service for parsing student resume PDFs, parsing JDs, calculating Resume Trust Score, and checking plagiarism. The project is designed for free deployment on Render.com.

## Stack

- Python 3.11+
- FastAPI
- PyMuPDF
- pdfplumber
- spaCy (`en_core_web_sm`)
- scikit-learn
- uvicorn

## Endpoints

- `POST /parse-resume`
- `POST /parse-jd`
- `POST /calculate-trust`
- `POST /check-plagiarism`
- `GET /health`

## Local Development

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python -m spacy download en_core_web_sm
uvicorn app.main:app --reload
```

Swagger docs will be available at:

```text
http://127.0.0.1:8000/docs
```

## Render Deployment

This repo already includes:

- `Dockerfile`
- `render.yaml`

Deploy steps:

1. Push `placeright-parser` to GitHub.
2. Create a new Render Web Service from the repo.
3. Render will detect `render.yaml`.
4. Deploy.

Health check:

```text
/health
```

## Example Requests

### Parse Resume

```bash
curl -X POST "http://127.0.0.1:8000/parse-resume" ^
  -H "accept: application/json" ^
  -H "Content-Type: multipart/form-data" ^
  -F "file=@tests/sample_resume.pdf;type=application/pdf"
```

### Parse JD

```bash
curl -X POST "http://127.0.0.1:8000/parse-jd" ^
  -H "Content-Type: application/json" ^
  -d "{\"jd_text\":\"Razorpay Campus Hiring\nRole: Backend Engineer\nLocation: Bengaluru\nMust have: Java, Spring Boot, PostgreSQL, Docker\"}"
```

### Calculate Trust

```bash
curl -X POST "http://127.0.0.1:8000/calculate-trust" ^
  -H "Content-Type: application/json" ^
  -d "{\"parsed_resume\":{\"personal\":{\"name\":\"Priya Sharma\"},\"education\":{\"degree\":\"B.Tech\",\"cgpa\":8.1},\"skills\":[\"Python\",\"React\"],\"projects\":[{\"title\":\"Placement Portal\",\"detail_score\":80,\"tech_stack\":[\"Python\",\"React\"]}],\"experience\":[],\"certifications\":[],\"raw_text\":\"sample\"}}"
```

### Check Plagiarism

```bash
curl -X POST "http://127.0.0.1:8000/check-plagiarism" ^
  -H "Content-Type: application/json" ^
  -d "{\"resume_text\":\"Built a React app\",\"all_resumes\":[\"Built a React app\",\"Worked on Java\"]}"
```

## Testing

```bash
pytest
```

The `tests/` folder includes:

- API health and resume endpoint checks
- PDF extraction test
- special-character skill parsing test (`C++`, `Node.js`)
- skill authenticity test
- trust scoring test
- plagiarism similarity test

## Notes

- PyMuPDF is the primary extractor.
- pdfplumber is the fallback for structured/table-heavy PDFs.
- If spaCy model download is unavailable at runtime, the parser falls back to a blank English pipeline so the API remains operational.
