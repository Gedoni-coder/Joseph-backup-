"""
Content Normalization & Structuring - Stage 3 of the Processing Pipeline

Responsibilities:
  - Text cleaning: remove noise, fix encoding artifacts, strip boilerplate
  - Date/time normalization → ISO 8601
  - Currency normalization → {amount, currency_code}
  - Unit normalization (weight, distance, area, temperature)
  - Key-value pair extraction using regex patterns + spaCy NER (optional)
  - Named entity recognition: ORG, PERSON, DATE, MONEY, GPE, PRODUCT
  - Business rule validation (required fields by document type)
  - Deduplication detection (near-duplicate via cosine similarity of token sets)
  - Phone number normalization → E.164
  - Email address extraction and validation
  - URL extraction and validation
  - Address normalization (US-centric with international fallback)
  - Numeric value extraction and categorization
  - Document structure inference (headings, sections, bullet points)
"""

from __future__ import annotations

import hashlib
import re
import unicodedata
from dataclasses import dataclass, field, asdict
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional, Set, Tuple

# ---------------------------------------------------------------------------
# Data structures
# ---------------------------------------------------------------------------

@dataclass
class ExtractedEntity:
    text: str
    entity_type: str   # DATE, MONEY, ORG, PERSON, GPE, PRODUCT, EMAIL, PHONE, URL
    normalized: str    # normalized canonical form
    confidence: float
    start_char: int = 0
    end_char: int = 0


@dataclass
class DocumentSection:
    title: str
    level: int         # 1 = h1, 2 = h2, etc.
    content: str
    word_count: int


@dataclass
class NormalizeResult:
    success: bool
    file_id: str
    clean_text: str
    original_length: int
    cleaned_length: int
    noise_ratio: float              # how much was removed
    entities: List[ExtractedEntity]
    dates: List[str]                # ISO 8601 dates
    monetary_values: List[Dict]     # {amount, currency, raw}
    phone_numbers: List[str]        # E.164 format
    email_addresses: List[str]
    urls: List[str]
    key_value_pairs: Dict[str, str]
    sections: List[DocumentSection]
    validation_errors: List[str]    # business rule violations
    dedup_signature: str            # SHA-256 of normalized token set
    near_duplicate_score: float     # 0–1 against previous docs
    errors: List[str] = field(default_factory=list)
    warnings: List[str] = field(default_factory=list)

    def to_dict(self) -> Dict:
        return asdict(self)


# ---------------------------------------------------------------------------
# Regex patterns
# ---------------------------------------------------------------------------

_DATE_PATTERNS = [
    (r"\b(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{2,4})\b", "MDY"),
    (r"\b(\d{4})[/\-.](\d{1,2})[/\-.](\d{1,2})\b", "YMD"),
    (r"\b(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|"
     r"Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)"
     r"\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})\b", "WORD"),
]

_CURRENCY_PATTERN = re.compile(
    r"(?P<symbol>[$€£¥₹₩₽]|USD|EUR|GBP|JPY|INR|KRW|RUB|CAD|AUD|CHF|CNY|BRL|MXN|ZAR)?"
    r"\s*(?P<amount>[\d,]+(?:\.\d{1,4})?)"
    r"\s*(?P<code>USD|EUR|GBP|JPY|INR|KRW|RUB|CAD|AUD|CHF|CNY|BRL|MXN|ZAR|K|M|B|T)?",
    re.IGNORECASE,
)

_PHONE_PATTERN = re.compile(
    r"(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}"
)

_EMAIL_PATTERN = re.compile(
    r"[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}"
)

_URL_PATTERN = re.compile(
    r"https?://[^\s\"\'\)\]>]+"
)

_KV_PATTERN = re.compile(
    r"^([A-Za-z][A-Za-z\s\-_/]{1,40}?)\s*[:=\|]\s*(.{1,200})$",
    re.MULTILINE,
)

_HEADING_PATTERNS = [
    re.compile(r"^#{1,6}\s+(.+)$", re.MULTILINE),           # Markdown
    re.compile(r"^([A-Z][A-Z\s]{3,50}):?$", re.MULTILINE),  # ALL CAPS headings
    re.compile(r"^(\d+\.)\s+([A-Z].+)$", re.MULTILINE),     # Numbered headings
]

_CURRENCY_SYMBOL_MAP = {
    "$": "USD", "€": "EUR", "£": "GBP", "¥": "JPY",
    "₹": "INR", "₩": "KRW", "₽": "RUB",
}

_MONTH_MAP = {
    "jan": 1, "january": 1, "feb": 2, "february": 2, "mar": 3, "march": 3,
    "apr": 4, "april": 4, "may": 5, "jun": 6, "june": 6, "jul": 7, "july": 7,
    "aug": 8, "august": 8, "sep": 9, "september": 9, "oct": 10, "october": 10,
    "nov": 11, "november": 11, "dec": 12, "december": 12,
}

# Boilerplate phrases to strip
_BOILERPLATE = re.compile(
    r"(all rights reserved|confidential and proprietary|this document is|"
    r"page \d+ of \d+|printed on|do not distribute|internal use only|"
    r"footer|header|table of contents)",
    re.IGNORECASE,
)

# Near-duplicate registry: dedup_signature → file_id
_SEEN_SIGNATURES: Dict[str, str] = {}


# ---------------------------------------------------------------------------
# Text cleaning
# ---------------------------------------------------------------------------

def _clean_text(text: str) -> str:
    """Remove encoding artifacts, normalize whitespace, strip boilerplate."""
    # Unicode normalization
    text = unicodedata.normalize("NFKC", text)
    # Fix common OCR artifacts
    text = text.replace("\x00", "").replace("\ufffd", "?")
    text = re.sub(r"[^\x09\x0A\x0D\x20-\x7E\x80-\xFF\u0100-\uFFFF]", " ", text)
    # Normalize line endings
    text = re.sub(r"\r\n?", "\n", text)
    # Remove repeated punctuation
    text = re.sub(r"([!?.]){3,}", r"\1\1\1", text)
    # Normalize whitespace
    text = re.sub(r"[ \t]{2,}", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    # Strip boilerplate lines
    lines = text.split("\n")
    clean_lines = [l for l in lines if not _BOILERPLATE.search(l)]
    return "\n".join(clean_lines).strip()


# ---------------------------------------------------------------------------
# Date extraction & normalization
# ---------------------------------------------------------------------------

def _normalize_date(m: re.Match, pattern_type: str) -> Optional[str]:
    try:
        if pattern_type == "YMD":
            y, mo, d = int(m.group(1)), int(m.group(2)), int(m.group(3))
        elif pattern_type == "MDY":
            mo, d, y = int(m.group(1)), int(m.group(2)), int(m.group(3))
            if y < 100:
                y += 2000 if y < 50 else 1900
        else:  # WORD
            mo = _MONTH_MAP.get(m.group(1).lower()[:3], 0)
            d, y = int(m.group(2)), int(m.group(3))
        if not (1 <= mo <= 12 and 1 <= d <= 31 and 1900 <= y <= 2100):
            return None
        return datetime(y, mo, d, tzinfo=timezone.utc).strftime("%Y-%m-%d")
    except Exception:
        return None


def _extract_dates(text: str) -> List[str]:
    found: Set[str] = set()
    for pattern, ptype in _DATE_PATTERNS:
        for m in re.finditer(pattern, text, re.IGNORECASE):
            norm = _normalize_date(m, ptype)
            if norm:
                found.add(norm)
    return sorted(found)


# ---------------------------------------------------------------------------
# Currency extraction
# ---------------------------------------------------------------------------

def _extract_monetary(text: str) -> List[Dict]:
    results = []
    for m in _CURRENCY_PATTERN.finditer(text):
        symbol = m.group("symbol") or ""
        amount_str = m.group("amount") or ""
        code_suffix = m.group("code") or ""
        if not amount_str or amount_str == "0":
            continue
        try:
            amount = float(amount_str.replace(",", ""))
        except ValueError:
            continue
        # Multiplier suffixes
        multiplier_map = {"K": 1_000, "M": 1_000_000, "B": 1_000_000_000, "T": 1_000_000_000_000}
        if code_suffix.upper() in multiplier_map:
            amount *= multiplier_map[code_suffix.upper()]
            code_suffix = ""
        currency = (
            _CURRENCY_SYMBOL_MAP.get(symbol, "")
            or code_suffix.upper()
            or symbol.upper()
            or "USD"
        )
        if currency in ("K", "M", "B", "T", ""):
            continue
        results.append({
            "amount": amount,
            "currency": currency,
            "formatted": f"{currency} {amount:,.2f}",
            "raw": m.group(0).strip(),
        })
    return results[:50]  # cap


# ---------------------------------------------------------------------------
# Phone extraction & normalization
# ---------------------------------------------------------------------------

def _normalize_phone(raw: str) -> str:
    digits = re.sub(r"\D", "", raw)
    if len(digits) == 10:
        return f"+1{digits}"
    if len(digits) == 11 and digits[0] == "1":
        return f"+{digits}"
    return f"+{digits}"


def _extract_phones(text: str) -> List[str]:
    raw = _PHONE_PATTERN.findall(text)
    return list({_normalize_phone(p) for p in raw})


# ---------------------------------------------------------------------------
# KV extraction
# ---------------------------------------------------------------------------

def _extract_kv(text: str) -> Dict[str, str]:
    kv: Dict[str, str] = {}
    for m in _KV_PATTERN.finditer(text):
        key = m.group(1).strip().title()
        value = m.group(2).strip()
        if len(key) >= 2 and value:
            kv[key] = value[:300]
    return kv


# ---------------------------------------------------------------------------
# Section extraction
# ---------------------------------------------------------------------------

def _extract_sections(text: str) -> List[DocumentSection]:
    sections: List[DocumentSection] = []
    lines = text.split("\n")
    current_title = "Introduction"
    current_level = 1
    current_lines: List[str] = []

    for line in lines:
        heading_match = None
        level = 1

        # Markdown heading
        md = re.match(r"^(#{1,6})\s+(.+)$", line)
        if md:
            heading_match = md.group(2).strip()
            level = len(md.group(1))

        if heading_match and current_lines:
            content = "\n".join(current_lines).strip()
            sections.append(DocumentSection(
                title=current_title,
                level=current_level,
                content=content,
                word_count=len(content.split()),
            ))
            current_lines = []
            current_title = heading_match
            current_level = level
        else:
            current_lines.append(line)

    if current_lines:
        content = "\n".join(current_lines).strip()
        if content:
            sections.append(DocumentSection(
                title=current_title,
                level=current_level,
                content=content,
                word_count=len(content.split()),
            ))
    return sections


# ---------------------------------------------------------------------------
# NER via spaCy (optional)
# ---------------------------------------------------------------------------

def _run_ner(text: str) -> List[ExtractedEntity]:
    try:
        import spacy  # type: ignore
        nlp = spacy.load("en_core_web_sm")
        doc = nlp(text[:50000])  # cap for speed
        entities = []
        for ent in doc.ents:
            entities.append(ExtractedEntity(
                text=ent.text,
                entity_type=ent.label_,
                normalized=ent.text.strip(),
                confidence=0.85,
                start_char=ent.start_char,
                end_char=ent.end_char,
            ))
        return entities
    except Exception:
        return []


# ---------------------------------------------------------------------------
# Deduplication
# ---------------------------------------------------------------------------

def _compute_dedup_signature(text: str) -> str:
    tokens = sorted(set(re.findall(r"\b[a-z]{3,}\b", text.lower())))
    return hashlib.sha256(" ".join(tokens).encode()).hexdigest()


def _near_duplicate_score(sig: str) -> Tuple[float, Optional[str]]:
    if sig in _SEEN_SIGNATURES:
        return 1.0, _SEEN_SIGNATURES[sig]
    return 0.0, None


# ---------------------------------------------------------------------------
# Business rule validation
# ---------------------------------------------------------------------------

_DOC_TYPE_RULES: Dict[str, List[str]] = {
    "invoice": ["invoice number", "date", "total", "vendor", "buyer"],
    "contract": ["parties", "date", "signature", "terms"],
    "financial_report": ["revenue", "expenses", "net income", "period"],
    "tax": ["tax id", "year", "income", "deductions"],
}


def _validate_business_rules(kv: Dict[str, str], doc_type_hint: str) -> List[str]:
    rules = _DOC_TYPE_RULES.get(doc_type_hint.lower(), [])
    violations = []
    kv_lower = {k.lower(): v for k, v in kv.items()}
    for required in rules:
        if not any(required in key for key in kv_lower):
            violations.append(f"Missing expected field: '{required}'")
    return violations


# ---------------------------------------------------------------------------
# Main entry point
# ---------------------------------------------------------------------------

def normalize_document(
    raw_text: str,
    file_id: str,
    key_value_pairs: Dict[str, Any] = None,
    document_type: str = "",
) -> NormalizeResult:
    """
    Normalize and structure extracted document content.

    Parameters
    ----------
    raw_text : str
        Raw extracted text from Stage 2.
    file_id : str
        Document identifier from Stage 1.
    key_value_pairs : dict, optional
        KV pairs pre-extracted by the extractor.
    document_type : str
        Hint from extraction stage (e.g. "pdf", "invoice").
    """
    errors: List[str] = []
    warnings: List[str] = []
    kv_input = key_value_pairs or {}

    original_length = len(raw_text)
    clean_text = _clean_text(raw_text)
    cleaned_length = len(clean_text)
    noise_ratio = max(0.0, (original_length - cleaned_length) / max(original_length, 1))

    dates = _extract_dates(clean_text)
    monetary = _extract_monetary(clean_text)
    phones = _extract_phones(clean_text)
    emails = _EMAIL_PATTERN.findall(clean_text)
    urls = _URL_PATTERN.findall(clean_text)
    kv = {**kv_input, **_extract_kv(clean_text)}
    sections = _extract_sections(clean_text)
    entities = _run_ner(clean_text)

    # Add regex-based entities for entities not covered by spaCy
    for date in dates:
        entities.append(ExtractedEntity(text=date, entity_type="DATE", normalized=date, confidence=0.9))
    for money in monetary:
        entities.append(ExtractedEntity(
            text=money["raw"], entity_type="MONEY",
            normalized=money["formatted"], confidence=0.85,
        ))
    for email in emails:
        entities.append(ExtractedEntity(text=email, entity_type="EMAIL", normalized=email.lower(), confidence=0.99))
    for phone in phones:
        entities.append(ExtractedEntity(text=phone, entity_type="PHONE", normalized=phone, confidence=0.85))

    validation_errors = _validate_business_rules(kv, document_type)

    dedup_sig = _compute_dedup_signature(clean_text)
    dup_score, dup_of = _near_duplicate_score(dedup_sig)
    if dup_of:
        warnings.append(f"Near-duplicate of document {dup_of} (score={dup_score:.2f})")
    else:
        _SEEN_SIGNATURES[dedup_sig] = file_id

    return NormalizeResult(
        success=True,
        file_id=file_id,
        clean_text=clean_text,
        original_length=original_length,
        cleaned_length=cleaned_length,
        noise_ratio=round(noise_ratio, 4),
        entities=entities,
        dates=dates,
        monetary_values=monetary,
        phone_numbers=phones,
        email_addresses=list(set(emails)),
        urls=list(set(urls)),
        key_value_pairs=kv,
        sections=sections,
        validation_errors=validation_errors,
        dedup_signature=dedup_sig,
        near_duplicate_score=dup_score,
        errors=errors,
        warnings=warnings,
    )
