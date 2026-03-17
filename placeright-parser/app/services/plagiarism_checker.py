from __future__ import annotations

from typing import List

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


class PlagiarismChecker:
    """Compare resumes and project titles using TF-IDF and token overlap."""

    @staticmethod
    def check_similarity(resume_text: str, all_resume_texts: List[str]) -> dict:
        if not all_resume_texts:
            return {"matches": [], "max_similarity": 0.0, "flagged": False}

        corpus = [resume_text] + all_resume_texts
        vectorizer = TfidfVectorizer(stop_words="english", max_features=5000, ngram_range=(1, 2))
        tfidf_matrix = vectorizer.fit_transform(corpus)
        similarities = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:])[0]

        matches = []
        for index, similarity in enumerate(similarities):
            if similarity > 0.7:
                matches.append(
                    {
                        "index": index,
                        "similarity": round(float(similarity) * 100, 1),
                        "level": "high" if similarity > 0.85 else "medium",
                    }
                )

        return {
            "matches": sorted(matches, key=lambda item: item["similarity"], reverse=True),
            "max_similarity": round(float(max(similarities)) * 100, 1) if len(similarities) else 0.0,
            "flagged": any(match["similarity"] >= 70 for match in matches),
        }

    @staticmethod
    def check_project_similarity(projects_a: List[dict], projects_b: List[dict]) -> List[dict]:
        matches = []
        for project_a in projects_a:
            for project_b in projects_b:
                title_a = set(project_a.get("title", "").lower().split())
                title_b = set(project_b.get("title", "").lower().split())
                if not title_a or not title_b:
                    continue
                intersection = title_a & title_b
                union = title_a | title_b
                jaccard = len(intersection) / len(union) if union else 0
                if jaccard > 0.7:
                    matches.append(
                        {
                            "project_a": project_a.get("title"),
                            "project_b": project_b.get("title"),
                            "similarity": round(jaccard * 100, 1),
                        }
                    )
        return matches
