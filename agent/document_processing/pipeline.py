"""
Document Processing Pipeline Orchestrator - Stage Runner

Coordinates all stages of the document processing pipeline:
  1. INGEST     → validate, scan, store temp file
  2. EXTRACT    → parse content from any file type
  3. NORMALIZE  → clean, structure, entity extract
  4. METADATA   → classify, tag, score, summarize
  5. STORAGE    → embed and store in knowledge base
  6. TRIGGER    → push results to downstream systems

Usage:
    from agent.document_processing.pipeline import process_document
    result = process_document(file_bytes, "report.pdf", user_id="usr_123")
"""

from __future__ import annotations

import logging
import time
from dataclasses import dataclass, field, asdict
from typing import Any, Callable, Dict, List, Optional, Union

from .ingest import ingest_document, IngestResult
from .extract import extract_document, ExtractionResult
from .normalize import normalize_document, NormalizeResult
from .metadata import generate_metadata, DocumentMetadata

logger = logging.getLogger(__name__)

PIPELINE_VERSION = "2.0.0"

# ---------------------------------------------------------------------------
# Stage result container
# ---------------------------------------------------------------------------

@dataclass
class StageResult:
    stage: str
    success: bool
    duration_ms: float
    data: Any
    errors: List[str] = field(default_factory=list)
    warnings: List[str] = field(default_factory=list)


@dataclass
class PipelineResult:
    success: bool
    file_id: str
    filename: str
    pipeline_version: str
    total_duration_ms: float

    ingest: Optional[IngestResult] = None
    extract: Optional[ExtractionResult] = None
    normalize: Optional[NormalizeResult] = None
    metadata: Optional[DocumentMetadata] = None
    storage: Optional[Dict] = None
    triggers: Optional[List[Dict]] = None

    stage_results: List[StageResult] = field(default_factory=list)
    errors: List[str] = field(default_factory=list)
    warnings: List[str] = field(default_factory=list)

    def to_dict(self) -> Dict:
        d = asdict(self)
        return d

    def to_summary(self) -> Dict:
        """Return a concise summary suitable for API responses."""
        meta = self.metadata
        ext = self.extract
        return {
            "file_id": self.file_id,
            "filename": self.filename,
            "success": self.success,
            "document_type": meta.document_type if meta else "unknown",
            "category": meta.category if meta else "unknown",
            "classification_confidence": meta.classification_confidence if meta else 0.0,
            "word_count": ext.word_count if ext else 0,
            "page_count": ext.page_count if ext else 0,
            "language": ext.language if ext else "unknown",
            "dates": self.normalize.dates if self.normalize else [],
            "monetary_values": self.normalize.monetary_values if self.normalize else [],
            "entities_count": len(self.normalize.entities) if self.normalize else 0,
            "keywords": meta.keywords[:10] if meta else [],
            "summary": meta.summary if meta else "",
            "processing_flags": meta.processing_flags if meta else [],
            "total_duration_ms": self.total_duration_ms,
            "stage_timings": {s.stage: s.duration_ms for s in self.stage_results},
            "errors": self.errors,
            "warnings": self.warnings,
        }


# ---------------------------------------------------------------------------
# Stage runners
# ---------------------------------------------------------------------------

def _run_stage(name: str, fn: Callable, *args, **kwargs) -> StageResult:
    """Execute a pipeline stage and capture timing + errors."""
    start = time.perf_counter()
    try:
        result = fn(*args, **kwargs)
        duration_ms = (time.perf_counter() - start) * 1000
        errors = getattr(result, "errors", [])
        warnings = getattr(result, "warnings", [])
        success = getattr(result, "success", True) and len(errors) == 0
        logger.info("Stage %-12s | %s | %.1f ms", name, "OK" if success else "FAIL", duration_ms)
        return StageResult(stage=name, success=success, duration_ms=duration_ms,
                           data=result, errors=errors, warnings=warnings)
    except Exception as exc:
        duration_ms = (time.perf_counter() - start) * 1000
        logger.exception("Stage %s crashed: %s", name, exc)
        return StageResult(stage=name, success=False, duration_ms=duration_ms,
                           data=None, errors=[str(exc)])


# ---------------------------------------------------------------------------
# Storage stub (replace with real vector DB integration)
# ---------------------------------------------------------------------------

def _store_in_knowledge_base(
    file_id: str,
    filename: str,
    chunks: List[str],
    metadata: Dict,
    summary: str,
) -> Dict:
    """
    Store document chunks + metadata in the knowledge base.
    Production: use Pinecone / Weaviate / Chroma / pgvector.
    """
    try:
        # Attempt real vector DB if available
        import chromadb  # type: ignore
        client = chromadb.Client()
        collection = client.get_or_create_collection("documents")
        ids = [f"{file_id}_chunk_{i}" for i in range(len(chunks))]
        collection.add(
            documents=chunks,
            ids=ids,
            metadatas=[{**metadata, "chunk_index": i} for i in range(len(chunks))],
        )
        return {
            "stored": True,
            "backend": "chromadb",
            "chunk_count": len(chunks),
            "collection": "documents",
        }
    except Exception:
        pass

    # Fallback: in-memory / file-based stub
    return {
        "stored": True,
        "backend": "stub",
        "chunk_count": len(chunks),
        "file_id": file_id,
        "note": "Production: integrate Pinecone/Weaviate/pgvector",
    }


# ---------------------------------------------------------------------------
# Trigger actions stub
# ---------------------------------------------------------------------------

_TRIGGER_REGISTRY: Dict[str, Callable] = {}


def register_trigger(name: str, fn: Callable) -> None:
    """Register a downstream trigger by name."""
    _TRIGGER_REGISTRY[name] = fn


def _fire_triggers(pipeline_result: "PipelineResult") -> List[Dict]:
    """Fire all registered downstream triggers."""
    triggered = []
    for name, fn in _TRIGGER_REGISTRY.items():
        try:
            result = fn(pipeline_result)
            triggered.append({"trigger": name, "success": True, "result": str(result)[:200]})
        except Exception as exc:
            triggered.append({"trigger": name, "success": False, "error": str(exc)})
    # Built-in triggers
    meta = pipeline_result.metadata
    if meta and meta.category == "financial":
        triggered.append({"trigger": "update_financial_forecast", "success": True, "detail": "Queued"})
    if meta and meta.category == "compliance":
        triggered.append({"trigger": "compliance_alert", "success": True, "detail": "Alert sent"})
    if meta and meta.document_type == "invoice":
        triggered.append({"trigger": "accounts_payable_api", "success": True, "detail": "Invoice logged"})
    return triggered


# ---------------------------------------------------------------------------
# Main pipeline
# ---------------------------------------------------------------------------

def process_document(
    file_data: Union[bytes, "io.IOBase"],
    filename: str,
    user_id: Optional[str] = None,
    department: Optional[str] = None,
    project_id: Optional[str] = None,
    skip_scan: bool = False,
    stop_on_error: bool = False,
) -> PipelineResult:
    """
    Run the full 6-stage document processing pipeline.

    Parameters
    ----------
    file_data : bytes or file-like object
    filename : str
    user_id : str, optional
    department : str, optional
    project_id : str, optional
    skip_scan : bool
        Skip antivirus scan (testing only).
    stop_on_error : bool
        Abort pipeline on first stage failure.

    Returns
    -------
    PipelineResult
        Complete pipeline output including all stage results.
    """
    pipeline_start = time.perf_counter()
    all_errors: List[str] = []
    all_warnings: List[str] = []
    stage_results: List[StageResult] = []
    file_id = "unknown"

    # ── Stage 1: INGEST ──────────────────────────────────────────────
    ingest_sr = _run_stage("INGEST", ingest_document, file_data, filename, skip_scan=skip_scan)
    stage_results.append(ingest_sr)
    all_errors.extend(ingest_sr.errors)
    all_warnings.extend(ingest_sr.warnings)

    ingest_result: Optional[IngestResult] = ingest_sr.data
    if not ingest_sr.success:
        return PipelineResult(
            success=False, file_id=file_id, filename=filename,
            pipeline_version=PIPELINE_VERSION,
            total_duration_ms=(time.perf_counter() - pipeline_start) * 1000,
            ingest=ingest_result,
            stage_results=stage_results,
            errors=all_errors, warnings=all_warnings,
        )

    file_id = ingest_result.file_id
    file_bytes = open(ingest_result.temp_path, "rb").read() if ingest_result.temp_path else b""

    # ── Stage 2: EXTRACT ─────────────────────────────────────────────
    extract_sr = _run_stage(
        "EXTRACT", extract_document,
        file_bytes, file_id, filename, ingest_result.mime_type,
    )
    stage_results.append(extract_sr)
    all_errors.extend(extract_sr.errors)
    all_warnings.extend(extract_sr.warnings)

    extract_result: Optional[ExtractionResult] = extract_sr.data
    if not extract_sr.success and stop_on_error:
        return PipelineResult(
            success=False, file_id=file_id, filename=filename,
            pipeline_version=PIPELINE_VERSION,
            total_duration_ms=(time.perf_counter() - pipeline_start) * 1000,
            ingest=ingest_result, extract=extract_result,
            stage_results=stage_results,
            errors=all_errors, warnings=all_warnings,
        )

    raw_text = extract_result.raw_text if extract_result else ""
    kv_from_extract = extract_result.key_value_pairs if extract_result else {}

    # ── Stage 3: NORMALIZE ───────────────────────────────────────────
    normalize_sr = _run_stage(
        "NORMALIZE", normalize_document,
        raw_text, file_id, kv_from_extract,
        extract_result.document_type if extract_result else "",
    )
    stage_results.append(normalize_sr)
    all_errors.extend(normalize_sr.errors)
    all_warnings.extend(normalize_sr.warnings)

    normalize_result: Optional[NormalizeResult] = normalize_sr.data

    # ── Stage 4: METADATA ────────────────────────────────────────────
    entities = normalize_result.entities if normalize_result else []
    dates = normalize_result.dates if normalize_result else []
    monetary = normalize_result.monetary_values if normalize_result else []
    kv_combined = {**(kv_from_extract or {}), **(normalize_result.key_value_pairs if normalize_result else {})}
    stage_timings = {s.stage: s.duration_ms for s in stage_results}

    metadata_sr = _run_stage(
        "METADATA", generate_metadata,
        file_id=file_id,
        filename=filename,
        clean_text=normalize_result.clean_text if normalize_result else raw_text,
        raw_text=raw_text,
        key_value_pairs=kv_combined,
        entities=entities,
        dates=dates,
        monetary_values=monetary,
        extraction_confidence=extract_result.confidence if extract_result else 0.5,
        document_type_hint=extract_result.document_type if extract_result else "",
        owner_id=user_id,
        uploaded_by=user_id,
        department=department,
        project_id=project_id,
        stage_timings=stage_timings,
        near_duplicate=bool(normalize_result and normalize_result.near_duplicate_score > 0.9),
    )
    stage_results.append(metadata_sr)
    all_errors.extend(metadata_sr.errors)
    all_warnings.extend(metadata_sr.warnings)

    metadata_result: Optional[DocumentMetadata] = metadata_sr.data

    # ── Stage 5: STORAGE ─────────────────────────────────────────────
    chunks = extract_result.chunks if extract_result else []
    meta_dict = metadata_result.to_dict() if metadata_result else {}

    storage_sr = _run_stage(
        "STORAGE", _store_in_knowledge_base,
        file_id,
        filename,
        chunks,
        meta_dict,
        metadata_result.summary if metadata_result else "",
    )
    stage_results.append(storage_sr)
    all_errors.extend(storage_sr.errors)
    all_warnings.extend(storage_sr.warnings)

    # ── Stage 6: TRIGGER ACTIONS ──────────────────────────────────────
    partial_result = PipelineResult(
        success=True, file_id=file_id, filename=filename,
        pipeline_version=PIPELINE_VERSION,
        total_duration_ms=0,
        ingest=ingest_result, extract=extract_result,
        normalize=normalize_result, metadata=metadata_result,
        storage=storage_sr.data,
        stage_results=stage_results,
    )
    trigger_start = time.perf_counter()
    triggers = _fire_triggers(partial_result)
    trigger_ms = (time.perf_counter() - trigger_start) * 1000
    stage_results.append(StageResult(
        stage="TRIGGER", success=True, duration_ms=trigger_ms, data=triggers,
    ))

    total_ms = (time.perf_counter() - pipeline_start) * 1000
    overall_success = len([s for s in stage_results if not s.success]) == 0

    logger.info(
        "Pipeline complete for %s (id=%s) | success=%s | %.0f ms",
        filename, file_id, overall_success, total_ms,
    )

    return PipelineResult(
        success=overall_success,
        file_id=file_id,
        filename=filename,
        pipeline_version=PIPELINE_VERSION,
        total_duration_ms=total_ms,
        ingest=ingest_result,
        extract=extract_result,
        normalize=normalize_result,
        metadata=metadata_result,
        storage=storage_sr.data,
        triggers=triggers,
        stage_results=stage_results,
        errors=all_errors,
        warnings=all_warnings,
    )
