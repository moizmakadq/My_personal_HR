from __future__ import annotations

import re
from typing import List


class CertificationParser:
    """Parse certification and coursework sections into structured records."""

    @staticmethod
    def parse(certification_section: str | None) -> List[dict]:
        if not certification_section:
            return []

        blocks = [
            block.strip()
            for block in re.split(r"\n\s*\n|(?=\n[•\-\*])", certification_section)
            if block.strip()
        ]

        certifications: List[dict] = []
        for block in blocks:
            lines = [re.sub(r"^[•\-\*]\s*", "", line.strip()) for line in block.split("\n") if line.strip()]
            if not lines:
                continue

            title = lines[0]
            issuer = None
            issue_date = None
            url_match = re.search(r"https?://\S+", block)
            year_match = re.search(r"(20\d{2})", block)

            if len(lines) > 1 and not re.search(r"https?://", lines[1], re.IGNORECASE):
                issuer = lines[1]
            if year_match:
                issue_date = year_match.group(1)

            certifications.append(
                {
                    "title": title[:150],
                    "issuing_organization": issuer,
                    "credential_url": url_match.group(0) if url_match else None,
                    "issue_date": issue_date,
                }
            )

        return certifications[:12]
