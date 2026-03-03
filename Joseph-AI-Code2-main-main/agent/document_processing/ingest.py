"""
Document Ingestion - Stage 1 of the Processing Pipeline

Handles:
- File intake and validation (type, size, encoding)
- Support for ALL file types: PDF, DOCX, XLSX, CSV, TXT, JSON, XML,
  PPTX, ODT, RTF, images (PNG/JPG/TIFF/BMP/GIF/WEBP), audio, HTML,
  Markdown, YAML, TOML, parquet, and more
- Malware/virus scanning via ClamAV (if available) with hash-based fallback
- File size enforcement with configurable limits
- MIME type detection via magic bytes (not just extension)
- Duplicate detection via SHA-256 hash
- Temporary storage management with TTL
- Structured error reporting and user feedback
- Metadata extraction at intake (file stats, hash, timestamps)

Triggered automatically when users upload documents - no explicit instruction needed.
"""

from __future__ import annotations

import hashlib
import io
import json
import logging
import mimetypes
import os
import re
import shutil
import tempfile
import time
import uuid
from dataclasses import dataclass, field, asdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List, Optional, Tuple, Union

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

MAX_FILE_SIZE_BYTES: int = int(os.getenv("MAX_FILE_SIZE_MB", "100")) * 1024 * 1024  # 100 MB default
TEMP_DIR: Path = Path(os.getenv("TEMP_UPLOAD_DIR", tempfile.gettempdir())) / "doc_processing"
TEMP_TTL_SECONDS: int = 3600  # 1 hour
ALLOWED_EXTENSIONS: frozenset = frozenset({
    # Documents
    ".pdf", ".doc", ".docx", ".odt", ".rtf", ".txt", ".md", ".rst",
    # Spreadsheets
    ".xls", ".xlsx", ".ods", ".csv", ".tsv",
    # Presentations
    ".ppt", ".pptx", ".odp",
    # Data interchange
    ".json", ".jsonl", ".xml", ".yaml", ".yml", ".toml", ".ini", ".cfg",
    ".html", ".htm", ".xhtml",
    # Images
    ".png", ".jpg", ".jpeg", ".tiff", ".tif", ".bmp", ".gif", ".webp",
    ".svg", ".ico",
    # Archives (we inspect but don't recurse by default)
    ".zip", ".tar", ".gz", ".bz2", ".7z", ".rar",
    # Parquet / data
    ".parquet", ".feather", ".avro",
    # Code / scripts (for code review use-case)
    ".py", ".js", ".ts", ".java", ".c", ".cpp", ".cs", ".go", ".rb",
    ".php", ".swift", ".kt", ".rs", ".sql",
    # Email
    ".eml", ".msg",
    # Other
    ".log",
})

# Magic bytes for MIME detection (extend as needed)
MAGIC_MAP: Dict[bytes, str] = {
    b"\x25\x50\x44\x46": "application/pdf",
    b"\x50\x4B\x03\x04": "application/zip",  # DOCX/XLSX/PPTX are zips
    b"\xD0\xCF\x11\xE0": "application/vnd.ms-office",  # DOC/XLS/PPT (OLE)
    b"\xFF\xD8\xFF": "image/jpeg",
    b"\x89\x50\x4E\x47": "image/png",
    b"\x47\x49\x46\x38": "image/gif",
    b"\x42\x4D": "image/bmp",
    b"\x49\x49\x2A\x00": "image/tiff",
    b"\x4D\x4D\x00\x2A": "image/tiff",
    b"\x52\x49\x46\x46": "image/webp",
    b"\x1F\x8B": "application/gzip",
    b"\x42\x5A\x68": "application/x-bzip2",
    b"<!DOC": "text/html",
    b"<html": "text/html",
    b"<?xml": "text/xml",
    b"{\n": "application/json",
    b'{"': "application/json",
    b"[{": "application/json",
    b"PAR1": "application/vnd.apache.parquet",
}

KNOWN_MALICIOUS_HASHES: frozenset = frozenset()  # populate from threat-intel feed

# ---------------------------------------------------------------------------
# Data structures
# ---------------------------------------------------------------------------

@dataclass
class IngestResult:
    success: bool
    file_id: str
    original_filename: str
    safe_filename: str
    temp_path: str
    file_size_bytes: int
    mime_type: str
    detected_extension: str
    sha256_hash: str
    md5_hash: str
    is_duplicate: bool
    duplicate_of: Optional[str]
    scan_status: str  # "clean" | "threat_found" | "skipped"
    scan_detail: str
    ingest_timestamp: str
    metadata: Dict
    errors: List[str] = field(default_factory=list)
    warnings: List[str] = field(default_factory=list)

    def to_dict(self) -> Dict:
        return asdict(self)


# ---------------------------------------------------------------------------
# Utilities
# ---------------------------------------------------------------------------

def _sanitize_filename(name: str) -> str:
    """Return a safe, printable filename."""
    stem = Path(name).stem
    suffix = Path(name).suffix.lower()
    stem = re.sub(r"[^\w\-.()\[\] ]", "_", stem)
    stem = stem.strip(". ")[:120] or "document"
    return f"{stem}{suffix}"


def _compute_hashes(data: bytes) -> Tuple[str, str]:
    sha256 = hashlib.sha256(data).hexdigest()
    md5 = hashlib.md5(data).hexdigest()
    return sha256, md5


def _detect_mime(data: bytes, filename: str) -> str:
    """Detect MIME type from magic bytes first, then fallback to extension."""
    header = data[:8]
    for magic, mime in MAGIC_MAP.items():
        if header.startswith(magic):
            # Distinguish OOXML (docx/xlsx/pptx) from generic zip
            if mime == "application/zip":
                ext = Path(filename).suffix.lower()
                if ext == ".docx":
                    return "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                if ext == ".xlsx":
                    return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                if ext == ".pptx":
                    return "application/vnd.openxmlformats-officedocument.presentationml.presentation"
            return mime
    # Text sniff
    try:
        sample = data[:4096].decode("utf-8", errors="ignore")
        if sample.strip().startswith("{") or sample.strip().startswith("["):
            return "application/json"
        if "," in sample and "\n" in sample:
            ext = Path(filename).suffix.lower()
            if ext in (".csv", ".tsv"):
                return "text/csv"
    except Exception:
        pass
    guessed, _ = mimetypes.guess_type(filename)
    return guessed or "application/octet-stream"


def _scan_for_malware(data: bytes, sha256: str) -> Tuple[str, str]:
    """
    Attempt ClamAV scan; fall back to hash-list check.
    Returns (status, detail).
    """
    if sha256 in KNOWN_MALICIOUS_HASHES:
        return "threat_found", f"Hash {sha256} matches known-malicious database"

    try:
        import clamd  # type: ignore
        cd = clamd.ClamdUnixSocket()
        result = cd.instream(io.BytesIO(data))
        stream_result = result.get("stream", ("OK", ""))
        if stream_result[0] == "FOUND":
            return "threat_found", stream_result[1]
        return "clean", "ClamAV scan passed"
    except Exception:
        pass

    return "skipped", "Antivirus unavailable; hash-list check passed"


def _cleanup_old_temp_files() -> None:
    """Remove temp files older than TEMP_TTL_SECONDS."""
    if not TEMP_DIR.exists():
        return
    now = time.time()
    for p in TEMP_DIR.iterdir():
        if p.is_file() and (now - p.stat().st_mtime) > TEMP_TTL_SECONDS:
            try:
                p.unlink()
            except Exception:
                pass


# ---------------------------------------------------------------------------
# Duplicate registry (in-process; replace with Redis/DB for production)
# ---------------------------------------------------------------------------

_SEEN_HASHES: Dict[str, str] = {}  # sha256 -> file_id


def _check_duplicate(sha256: str) -> Optional[str]:
    return _SEEN_HASHES.get(sha256)


def _register_hash(sha256: str, file_id: str) -> None:
    _SEEN_HASHES[sha256] = file_id


# ---------------------------------------------------------------------------
# Main entry point
# ---------------------------------------------------------------------------

def ingest_document(
    file_data: Union[bytes, io.IOBase],
    filename: str,
    max_size_bytes: int = MAX_FILE_SIZE_BYTES,
    skip_scan: bool = False,
) -> IngestResult:
    """
    Ingest a document and return an IngestResult.

    Parameters
    ----------
    file_data : bytes or file-like object
        Raw file content.
    filename : str
        Original filename from the upload.
    max_size_bytes : int
        Maximum allowed file size in bytes.
    skip_scan : bool
        Skip antivirus scan (for testing only).
    """
    file_id = str(uuid.uuid4())
    errors: List[str] = []
    warnings: List[str] = []

    # Read data
    if isinstance(file_data, (bytes, bytearray)):
        data = bytes(file_data)
    else:
        data = file_data.read()

    file_size = len(data)
    safe_name = _sanitize_filename(filename)
    detected_ext = Path(safe_name).suffix.lower()

    # --- 1. Size check ---
    if file_size == 0:
        errors.append("File is empty.")
    if file_size > max_size_bytes:
        errors.append(
            f"File size {file_size / 1024 / 1024:.1f} MB exceeds limit "
            f"of {max_size_bytes / 1024 / 1024:.0f} MB."
        )

    # --- 2. Extension check ---
    if detected_ext and detected_ext not in ALLOWED_EXTENSIONS:
        warnings.append(
            f"Extension '{detected_ext}' is not in the standard allow-list; "
            "will attempt best-effort processing."
        )

    # --- 3. MIME detection ---
    mime_type = _detect_mime(data, filename)

    # --- 4. Hash computation ---
    sha256, md5 = _compute_hashes(data)

    # --- 5. Duplicate check ---
    dup_of = _check_duplicate(sha256)
    is_duplicate = dup_of is not None

    # --- 6. Malware scan ---
    if errors or skip_scan:
        scan_status, scan_detail = "skipped", "Skipped due to prior errors"
    else:
        scan_status, scan_detail = _scan_for_malware(data, sha256)

    if scan_status == "threat_found":
        errors.append(f"Security threat detected: {scan_detail}")

    # --- 7. Persist to temp storage ---
    temp_path = ""
    if not errors:
        TEMP_DIR.mkdir(parents=True, exist_ok=True)
        _cleanup_old_temp_files()
        temp_path = str(TEMP_DIR / f"{file_id}_{safe_name}")
        try:
            Path(temp_path).write_bytes(data)
            _register_hash(sha256, file_id)
        except OSError as exc:
            errors.append(f"Failed to write temp file: {exc}")

    result = IngestResult(
        success=len(errors) == 0,
        file_id=file_id,
        original_filename=filename,
        safe_filename=safe_name,
        temp_path=temp_path,
        file_size_bytes=file_size,
        mime_type=mime_type,
        detected_extension=detected_ext,
        sha256_hash=sha256,
        md5_hash=md5,
        is_duplicate=is_duplicate,
        duplicate_of=dup_of,
        scan_status=scan_status,
        scan_detail=scan_detail,
        ingest_timestamp=datetime.now(timezone.utc).isoformat(),
        metadata={
            "file_size_mb": round(file_size / 1024 / 1024, 3),
            "file_size_kb": round(file_size / 1024, 1),
            "extension": detected_ext,
            "mime_type": mime_type,
        },
        errors=errors,
        warnings=warnings,
    )

    if result.success:
        logger.info("Ingested %s (%s, %d bytes) → %s", filename, mime_type, file_size, file_id)
    else:
        logger.warning("Ingest failed for %s: %s", filename, errors)

    return result
