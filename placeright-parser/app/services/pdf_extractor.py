from __future__ import annotations

import io
import re
from typing import List

import fitz
import pdfplumber


class PDFExtractor:
    """Extract text from PDF using PyMuPDF first and pdfplumber as fallback."""

    @staticmethod
    def _normalize_page_text(text: str) -> str:
        text = (text or "").replace("\r", "\n")
        text = re.sub(r"\n{3,}", "\n\n", text)
        return text.strip()

    @staticmethod
    def _build_page_text_from_blocks(text_blocks: List[dict]) -> str:
        if not text_blocks:
            return ""

        ordered = sorted(text_blocks, key=lambda item: (round(item["y"] / 3) * 3, item["x"]))
        lines: List[str] = []
        current_line: List[str] = []
        current_y = None

        for block in ordered:
            text = str(block.get("text", "")).strip()
            if not text:
                continue

            if current_y is None:
                current_y = block["y"]

            if abs(block["y"] - current_y) > 4:
                if current_line:
                    lines.append(" ".join(current_line).strip())
                current_line = [text]
                current_y = block["y"]
            else:
                current_line.append(text)

        if current_line:
            lines.append(" ".join(current_line).strip())

        return "\n".join(line for line in lines if line).strip()

    @staticmethod
    def extract_with_pymupdf(pdf_bytes: bytes) -> dict:
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        full_text = []
        pages: List[dict] = []

        for page_num, page in enumerate(doc):
            page_dict = page.get_text("dict", sort=True)
            blocks = page_dict.get("blocks", [])
            text_blocks = []
            for block in blocks:
                if block.get("type") != 0:
                    continue
                for line in block.get("lines", []):
                    for span in line.get("spans", []):
                        text_blocks.append(
                            {
                                "text": span.get("text", ""),
                                "x": span.get("bbox", [0, 0, 0, 0])[0],
                                "y": span.get("bbox", [0, 0, 0, 0])[1],
                                "font_size": span.get("size", 0),
                                "font": span.get("font", ""),
                                "is_bold": "bold" in span.get("font", "").lower(),
                            }
                        )

            page_text = PDFExtractor._normalize_page_text(page.get_text("text", sort=True))
            if len(page_text) < 40:
                page_text = PDFExtractor._build_page_text_from_blocks(text_blocks)

            full_text.append(page_text)
            pages.append({"page_num": page_num + 1, "text": page_text, "blocks": text_blocks})

        metadata = {
            "title": doc.metadata.get("title", "") if doc.metadata else "",
            "author": doc.metadata.get("author", "") if doc.metadata else "",
            "pages": len(doc),
        }
        doc.close()
        return {"text": "\n\n".join(part for part in full_text if part).strip(), "pages": pages, "metadata": metadata}

    @staticmethod
    def extract_with_pdfplumber(pdf_bytes: bytes) -> dict:
        pdf = pdfplumber.open(io.BytesIO(pdf_bytes))
        full_text = []
        page_count = len(pdf.pages)
        for page in pdf.pages:
            full_text.append(PDFExtractor._normalize_page_text(page.extract_text() or ""))
        pdf.close()
        return {"text": "\n\n".join(part for part in full_text if part).strip(), "pages": [], "metadata": {"pages": page_count}}

    @staticmethod
    def extract(pdf_bytes: bytes) -> dict:
        try:
            result = PDFExtractor.extract_with_pymupdf(pdf_bytes)
            if len(result["text"].strip()) > 50:
                result["method"] = "pymupdf"
                return result
        except Exception:
            pass

        try:
            result = PDFExtractor.extract_with_pdfplumber(pdf_bytes)
            result["method"] = "pdfplumber"
            return result
        except Exception as error:
            raise ValueError(f"Failed to extract text from PDF: {error}") from error
