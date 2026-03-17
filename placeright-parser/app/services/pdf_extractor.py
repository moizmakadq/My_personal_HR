from __future__ import annotations

import io
from typing import Dict, List

import fitz
import pdfplumber


class PDFExtractor:
    """Extract text from PDF using PyMuPDF first and pdfplumber as fallback."""

    @staticmethod
    def extract_with_pymupdf(pdf_bytes: bytes) -> dict:
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        full_text = []
        pages: List[dict] = []

        for page_num, page in enumerate(doc):
            page_dict = page.get_text("dict")
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

            text_blocks.sort(key=lambda item: (round(item["y"] / 10) * 10, item["x"]))
            page_text = " ".join(block["text"] for block in text_blocks if block["text"].strip())
            full_text.append(page_text)
            pages.append({"page_num": page_num + 1, "text": page_text, "blocks": text_blocks})

        metadata = {
            "title": doc.metadata.get("title", "") if doc.metadata else "",
            "author": doc.metadata.get("author", "") if doc.metadata else "",
            "pages": len(doc),
        }
        doc.close()
        return {"text": "\n".join(full_text).strip(), "pages": pages, "metadata": metadata}

    @staticmethod
    def extract_with_pdfplumber(pdf_bytes: bytes) -> dict:
        pdf = pdfplumber.open(io.BytesIO(pdf_bytes))
        full_text = []
        page_count = len(pdf.pages)
        for page in pdf.pages:
            full_text.append(page.extract_text() or "")
        pdf.close()
        return {"text": "\n".join(full_text).strip(), "pages": [], "metadata": {"pages": page_count}}

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
