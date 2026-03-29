"""Django integration bridge for document processing pipeline.

Runs pipeline on stored Document objects and returns DB-ready outputs.
"""

from __future__ import annotations

from typing import Dict, Optional

from .insights import build_mvp_insights
from .pipeline import process_document


def process_stored_document(document, user_id: Optional[str] = None) -> Dict:
    if not document.file:
        raise ValueError("Document has no attached file.")

    document.file.open("rb")
    try:
        file_bytes = document.file.read()
    finally:
        document.file.close()

    filename = document.file.name.split("/")[-1] or document.title or "document"
    pipeline_result = process_document(
        file_data=file_bytes,
        filename=filename,
        user_id=user_id,
        stop_on_error=False,
    )

    if not pipeline_result.success:
        raise RuntimeError(
            "; ".join(pipeline_result.errors) or "Document processing failed."
        )

    extract_result = pipeline_result.extract
    normalize_result = pipeline_result.normalize
    metadata_result = pipeline_result.metadata

    clean_text = ""
    if normalize_result and normalize_result.clean_text:
        clean_text = normalize_result.clean_text
    elif extract_result and extract_result.raw_text:
        clean_text = extract_result.raw_text

    mvp_insights = build_mvp_insights(
        clean_text=clean_text,
        metadata_summary=metadata_result.summary if metadata_result else "",
        metadata_keywords=metadata_result.keywords if metadata_result else [],
        named_entities_summary=metadata_result.named_entities_summary if metadata_result else {},
        dates=normalize_result.dates if normalize_result else [],
    )

    current_metadata = document.metadata if isinstance(document.metadata, dict) else {}
    keywords = mvp_insights["keywords"]
    existing_tags = current_metadata.get("tags", [])
    if not isinstance(existing_tags, list):
        existing_tags = []

    merged_tags = []
    for tag in [*existing_tags, *keywords[:8], "processed"]:
        if isinstance(tag, str) and tag and tag not in merged_tags:
            merged_tags.append(tag)

    metadata_update = {
        **current_metadata,
        "status": "Processed",
        "document_type": metadata_result.document_type if metadata_result else "general",
        "category": current_metadata.get("category")
        or (metadata_result.category.title() if metadata_result else "General"),
        "subcategory": metadata_result.subcategory if metadata_result else "miscellaneous",
        "tags": merged_tags,
        "summary": metadata_result.summary if metadata_result else mvp_insights["summary"],
        "keywords": keywords,
        "classification_confidence": (
            metadata_result.classification_confidence if metadata_result else 0.0
        ),
        "processing_flags": metadata_result.processing_flags if metadata_result else [],
        "pipeline": {
            "version": pipeline_result.pipeline_version,
            "duration_ms": pipeline_result.total_duration_ms,
            "stage_timings": {
                stage.stage: stage.duration_ms for stage in pipeline_result.stage_results
            },
        },
    }

    return {
        "extracted_text": clean_text,
        "insights": mvp_insights,
        "metadata_update": metadata_update,
        "pipeline_result": pipeline_result,
    }
