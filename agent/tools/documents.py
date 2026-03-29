"""Document-processing tool entrypoints.

This module wraps the Section A Python pipeline and exposes a stable tool API
for uploads, local-file processing, and optional Groq enrichment.
"""

from __future__ import annotations

import io
import json
import os
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Any, BinaryIO, Dict, Optional, Union
from urllib import error as urllib_error
from urllib import request as urllib_request

from agent.document_processing import PipelineResult, process_document

FileInput = Union[bytes, bytearray, BinaryIO]


@dataclass
class LLMEnrichmentResult:
    success: bool
    provider: str
    model: Optional[str]
    skipped: bool
    parsed_output: Optional[Dict[str, Any]]
    raw_output: str
    usage: Dict[str, Any]
    error: Optional[str] = None

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


@dataclass
class DocumentToolResult:
    success: bool
    filename: str
    file_id: str
    extracted_text: str
    pipeline_summary: Dict[str, Any]
    structured_output: Dict[str, Any]
    llm_enrichment: Optional[Dict[str, Any]]
    pipeline_result: PipelineResult

    def to_dict(self) -> Dict[str, Any]:
        return {
            "success": self.success,
            "filename": self.filename,
            "file_id": self.file_id,
            "extracted_text": self.extracted_text,
            "pipeline_summary": self.pipeline_summary,
            "structured_output": self.structured_output,
            "llm_enrichment": self.llm_enrichment,
            "pipeline_result": self.pipeline_result.to_dict(),
        }


def _coerce_file_bytes(file_data: FileInput) -> bytes:
    if isinstance(file_data, (bytes, bytearray)):
        return bytes(file_data)

    if hasattr(file_data, "read"):
        raw = file_data.read()
        if isinstance(raw, str):
            return raw.encode("utf-8")
        return raw

    raise TypeError("file_data must be bytes, bytearray, or a binary file-like object.")


def _build_structured_output(pipeline_result: PipelineResult) -> Dict[str, Any]:
    extract_result = pipeline_result.extract
    normalize_result = pipeline_result.normalize
    metadata_result = pipeline_result.metadata

    return {
        "document": {
            "file_id": pipeline_result.file_id,
            "filename": pipeline_result.filename,
            "document_type": metadata_result.document_type if metadata_result else "general",
            "category": metadata_result.category if metadata_result else "general",
            "subcategory": metadata_result.subcategory if metadata_result else "miscellaneous",
            "language": extract_result.language if extract_result else "unknown",
            "word_count": extract_result.word_count if extract_result else 0,
            "page_count": extract_result.page_count if extract_result else 0,
            "summary": metadata_result.summary if metadata_result else "",
            "keywords": metadata_result.keywords if metadata_result else [],
            "topics": metadata_result.topics if metadata_result else [],
            "classification_confidence": (
                metadata_result.classification_confidence if metadata_result else 0.0
            ),
            "processing_flags": metadata_result.processing_flags if metadata_result else [],
        },
        "extraction": {
            "method": extract_result.extraction_method if extract_result else "unknown",
            "confidence": extract_result.confidence if extract_result else 0.0,
            "tables": extract_result.tables if extract_result else [],
            "key_value_pairs": extract_result.key_value_pairs if extract_result else {},
            "metadata": extract_result.metadata if extract_result else {},
        },
        "normalized": {
            "dates": normalize_result.dates if normalize_result else [],
            "monetary_values": normalize_result.monetary_values if normalize_result else [],
            "phone_numbers": normalize_result.phone_numbers if normalize_result else [],
            "email_addresses": normalize_result.email_addresses if normalize_result else [],
            "urls": normalize_result.urls if normalize_result else [],
            "key_value_pairs": normalize_result.key_value_pairs if normalize_result else {},
            "sections": [
                {
                    "title": section.title,
                    "level": section.level,
                    "word_count": section.word_count,
                }
                for section in (normalize_result.sections if normalize_result else [])
            ],
            "validation_errors": normalize_result.validation_errors if normalize_result else [],
        },
        "entities": metadata_result.named_entities_summary if metadata_result else {},
        "storage": pipeline_result.storage or {},
        "triggers": pipeline_result.triggers or [],
        "errors": pipeline_result.errors,
        "warnings": pipeline_result.warnings,
    }


def _extract_json_object(text: str) -> Dict[str, Any]:
    if not text.strip():
        return {}

    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    start = text.find("{")
    end = text.rfind("}")
    if start == -1 or end == -1 or end <= start:
        raise ValueError("Model response did not contain a valid JSON object.")
    return json.loads(text[start : end + 1])


def _should_enable_llm(enrich_with_llm: Optional[bool]) -> bool:
    if enrich_with_llm is not None:
        return enrich_with_llm
    return os.getenv("DOC_PROCESSING_USE_GROQ", "").strip().lower() in {"1", "true", "yes", "on"}


def _groq_enrich_document(
    structured_output: Dict[str, Any],
    extracted_text: str,
    custom_instruction: Optional[str] = None,
) -> LLMEnrichmentResult:
    api_key = os.getenv("GROQ_API_KEY", "").strip()
    model = (
        os.getenv("DOC_PROCESSING_GROQ_MODEL", "").strip()
        or os.getenv("GROQ_MODEL", "").strip()
        or "llama-3.1-8b-instant"
    )

    if not api_key:
        return LLMEnrichmentResult(
            success=False,
            provider="groq",
            model=model,
            skipped=True,
            parsed_output=None,
            raw_output="",
            usage={},
            error="GROQ_API_KEY is not configured.",
        )

    prompt_payload = {
        "document": structured_output["document"],
        "normalized": structured_output["normalized"],
        "entities": structured_output["entities"],
        "extraction_key_value_pairs": structured_output["extraction"]["key_value_pairs"],
        "excerpt": extracted_text[:12000],
    }
    instruction = custom_instruction or (
        "Return strict JSON with keys: executive_summary, useful_fields, action_items, "
        "risks, follow_up_questions. Keep useful_fields as an object."
    )

    request_body = {
        "model": model,
        "temperature": 0.1,
        "messages": [
            {
                "role": "system",
                "content": (
                    "You convert extracted business documents into compact structured JSON. "
                    "Do not include markdown fences or explanatory text."
                ),
            },
            {
                "role": "user",
                "content": (
                    f"{instruction}\n\n"
                    f"Document payload:\n{json.dumps(prompt_payload, ensure_ascii=True)}"
                ),
            },
        ],
    }

    req = urllib_request.Request(
        "https://api.groq.com/openai/v1/chat/completions",
        data=json.dumps(request_body).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}",
        },
        method="POST",
    )

    try:
        with urllib_request.urlopen(req, timeout=45) as response:
            body = json.loads(response.read().decode("utf-8"))
    except urllib_error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="ignore")
        return LLMEnrichmentResult(
            success=False,
            provider="groq",
            model=model,
            skipped=False,
            parsed_output=None,
            raw_output="",
            usage={},
            error=f"Groq API error: {detail or exc.reason}",
        )
    except Exception as exc:
        return LLMEnrichmentResult(
            success=False,
            provider="groq",
            model=model,
            skipped=False,
            parsed_output=None,
            raw_output="",
            usage={},
            error=f"Groq request failed: {exc}",
        )

    message = (
        body.get("choices", [{}])[0]
        .get("message", {})
        .get("content", "")
        .strip()
    )
    usage = body.get("usage", {}) or {}

    try:
        parsed = _extract_json_object(message)
        return LLMEnrichmentResult(
            success=True,
            provider="groq",
            model=model,
            skipped=False,
            parsed_output=parsed,
            raw_output=message,
            usage=usage,
        )
    except Exception as exc:
        return LLMEnrichmentResult(
            success=False,
            provider="groq",
            model=model,
            skipped=False,
            parsed_output=None,
            raw_output=message,
            usage=usage,
            error=f"Groq response parsing failed: {exc}",
        )


def process_uploaded_document(
    file_data: FileInput,
    filename: str,
    *,
    user_id: Optional[str] = None,
    department: Optional[str] = None,
    project_id: Optional[str] = None,
    enrich_with_llm: Optional[bool] = None,
    llm_instruction: Optional[str] = None,
    skip_scan: bool = False,
    stop_on_error: bool = False,
) -> DocumentToolResult:
    """
    Process an uploaded document through the Section A pipeline and return a
    stable structured payload for callers.
    """
    payload = _coerce_file_bytes(file_data)
    pipeline_result = process_document(
        payload,
        filename,
        user_id=user_id,
        department=department,
        project_id=project_id,
        skip_scan=skip_scan,
        stop_on_error=stop_on_error,
    )

    extracted_text = ""
    if pipeline_result.normalize and pipeline_result.normalize.clean_text:
        extracted_text = pipeline_result.normalize.clean_text
    elif pipeline_result.extract:
        extracted_text = pipeline_result.extract.raw_text

    structured_output = _build_structured_output(pipeline_result)

    llm_result: Optional[LLMEnrichmentResult] = None
    if _should_enable_llm(enrich_with_llm):
        llm_result = _groq_enrich_document(
            structured_output=structured_output,
            extracted_text=extracted_text,
            custom_instruction=llm_instruction,
        )

    return DocumentToolResult(
        success=pipeline_result.success,
        filename=filename,
        file_id=pipeline_result.file_id,
        extracted_text=extracted_text,
        pipeline_summary=pipeline_result.to_summary(),
        structured_output=structured_output,
        llm_enrichment=llm_result.to_dict() if llm_result else None,
        pipeline_result=pipeline_result,
    )


def process_document_path(
    path: Union[str, Path],
    *,
    user_id: Optional[str] = None,
    department: Optional[str] = None,
    project_id: Optional[str] = None,
    enrich_with_llm: Optional[bool] = None,
    llm_instruction: Optional[str] = None,
    skip_scan: bool = False,
    stop_on_error: bool = False,
) -> DocumentToolResult:
    file_path = Path(path)
    file_bytes = file_path.read_bytes()
    return process_uploaded_document(
        file_data=file_bytes,
        filename=file_path.name,
        user_id=user_id,
        department=department,
        project_id=project_id,
        enrich_with_llm=enrich_with_llm,
        llm_instruction=llm_instruction,
        skip_scan=skip_scan,
        stop_on_error=stop_on_error,
    )


def process_text_document(
    text: str,
    filename: str = "document.txt",
    **kwargs: Any,
) -> DocumentToolResult:
    return process_uploaded_document(
        io.BytesIO(text.encode("utf-8")),
        filename=filename,
        **kwargs,
    )
