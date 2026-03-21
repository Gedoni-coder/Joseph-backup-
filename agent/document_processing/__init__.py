"""
Document Processing Pipeline
Stages: INGEST → EXTRACT → NORMALIZE → METADATA → STORAGE → TRIGGER
"""
from .pipeline import process_document, PipelineResult, register_trigger
from .ingest import ingest_document, IngestResult
from .extract import extract_document, ExtractionResult
from .normalize import normalize_document, NormalizeResult
from .metadata import generate_metadata, DocumentMetadata
from .django_integration import process_stored_document

__all__ = [
    "process_document",
    "PipelineResult",
    "register_trigger",
    "ingest_document",
    "IngestResult",
    "extract_document",
    "ExtractionResult",
    "normalize_document",
    "NormalizeResult",
    "generate_metadata",
    "DocumentMetadata",
    "process_stored_document",
]
