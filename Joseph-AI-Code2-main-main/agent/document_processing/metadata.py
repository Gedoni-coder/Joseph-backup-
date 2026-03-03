"""
Document Metadata Management - Stage 4 of the Processing Pipeline

Responsibilities:
  - Document type classification (invoice, contract, financial report, policy,
    research paper, email, resume, legal brief, tax form, compliance doc, etc.)
  - Owner and user association
  - Upload timestamps and version history
  - Content tags and keyword extraction (TF-IDF / KeyBERT)
  - Category assignment with confidence scores
  - Confidence scoring for extraction quality
  - Processing pipeline metadata (stage timings, quality flags)
  - Relationship detection to other documents (same vendor, project, period)
  - Data lineage tracking
  - Embedding-ready summary generation
"""

from __future__ import annotations

import re
from dataclasses import dataclass, field, asdict
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional, Tuple

# ---------------------------------------------------------------------------
# Document type taxonomy
# ---------------------------------------------------------------------------

DOC_TYPE_TAXONOMY = {
    "invoice": {
        "keywords": ["invoice", "bill", "billing", "invoice number", "payment due",
                     "total amount due", "remit to", "po number", "purchase order"],
        "category": "financial",
        "subcategory": "accounts_payable",
    },
    "receipt": {
        "keywords": ["receipt", "transaction", "paid", "total paid", "thank you for your purchase"],
        "category": "financial",
        "subcategory": "expense",
    },
    "contract": {
        "keywords": ["agreement", "contract", "parties", "whereas", "hereinafter",
                     "terms and conditions", "obligations", "indemnification", "liability"],
        "category": "legal",
        "subcategory": "agreement",
    },
    "financial_report": {
        "keywords": ["financial statements", "balance sheet", "income statement",
                     "cash flow", "revenue", "net income", "ebitda", "fiscal year",
                     "quarterly report", "annual report"],
        "category": "financial",
        "subcategory": "reporting",
    },
    "tax_document": {
        "keywords": ["tax return", "w-2", "1099", "irs", "taxable income",
                     "deductions", "filing status", "ein", "ssn"],
        "category": "tax",
        "subcategory": "filing",
    },
    "compliance_report": {
        "keywords": ["compliance", "audit", "sox", "gdpr", "hipaa", "iso 27001",
                     "regulation", "regulatory", "findings", "remediation"],
        "category": "compliance",
        "subcategory": "audit",
    },
    "policy": {
        "keywords": ["policy", "procedure", "guideline", "standard operating",
                     "must", "shall", "prohibited", "approved by", "effective date"],
        "category": "governance",
        "subcategory": "policy",
    },
    "research_paper": {
        "keywords": ["abstract", "introduction", "methodology", "conclusion",
                     "references", "doi", "peer-reviewed", "hypothesis"],
        "category": "research",
        "subcategory": "academic",
    },
    "resume": {
        "keywords": ["resume", "curriculum vitae", "cv", "work experience",
                     "education", "skills", "objective", "references available"],
        "category": "hr",
        "subcategory": "recruitment",
    },
    "meeting_notes": {
        "keywords": ["meeting", "agenda", "attendees", "action items", "minutes",
                     "discussed", "next steps", "follow up"],
        "category": "operations",
        "subcategory": "meetings",
    },
    "purchase_order": {
        "keywords": ["purchase order", "po number", "vendor", "quantity",
                     "unit price", "ship to", "delivery date"],
        "category": "procurement",
        "subcategory": "purchasing",
    },
    "business_plan": {
        "keywords": ["executive summary", "market analysis", "competitive analysis",
                     "business model", "financial projections", "milestones"],
        "category": "strategy",
        "subcategory": "planning",
    },
    "employment_agreement": {
        "keywords": ["employment", "employee", "employer", "salary", "compensation",
                     "benefits", "termination", "notice period", "confidentiality"],
        "category": "legal",
        "subcategory": "employment",
    },
    "nda": {
        "keywords": ["non-disclosure", "nda", "confidential information",
                     "proprietary", "trade secrets", "recipient"],
        "category": "legal",
        "subcategory": "nda",
    },
    "supply_chain": {
        "keywords": ["shipment", "freight", "logistics", "inventory", "warehouse",
                     "sku", "stock", "delivery", "supplier"],
        "category": "operations",
        "subcategory": "supply_chain",
    },
    "marketing": {
        "keywords": ["campaign", "brand", "target audience", "roi", "click-through",
                     "impressions", "conversion rate", "cpm", "cpc"],
        "category": "marketing",
        "subcategory": "campaign",
    },
    "medical": {
        "keywords": ["patient", "diagnosis", "prescription", "icd-10", "cpt",
                     "physician", "clinical", "healthcare", "treatment"],
        "category": "medical",
        "subcategory": "clinical",
    },
    "general": {
        "keywords": [],
        "category": "general",
        "subcategory": "miscellaneous",
    },
}

# ---------------------------------------------------------------------------
# Data structures
# ---------------------------------------------------------------------------

@dataclass
class ClassificationResult:
    document_type: str
    category: str
    subcategory: str
    confidence: float
    matched_keywords: List[str]
    alternative_types: List[Tuple[str, float]]   # [(type, confidence), ...]


@dataclass
class DocumentMetadata:
    file_id: str
    filename: str
    document_type: str
    category: str
    subcategory: str
    classification_confidence: float
    alternative_classifications: List[Dict]

    # Content tags
    keywords: List[str]
    topics: List[str]
    named_entities_summary: Dict[str, List[str]]  # type → [values]

    # Ownership
    owner_id: Optional[str]
    uploaded_by: Optional[str]
    department: Optional[str]
    project_id: Optional[str]

    # Temporal
    upload_timestamp: str
    document_date: Optional[str]      # date extracted from content
    period_start: Optional[str]
    period_end: Optional[str]

    # Quality
    extraction_confidence: float
    ocr_quality: Optional[float]
    completeness_score: float
    processing_flags: List[str]       # "low_confidence", "near_duplicate", etc.

    # Lineage
    source_system: str
    pipeline_version: str
    stage_timings: Dict[str, float]   # stage → duration_ms
    processing_status: str            # "complete" | "partial" | "failed"

    # Relationships
    related_documents: List[str]      # file_ids of related docs
    same_vendor_docs: List[str]
    same_project_docs: List[str]

    # Embedding
    summary: str
    embedding_ready: bool

    errors: List[str] = field(default_factory=list)
    warnings: List[str] = field(default_factory=list)

    def to_dict(self) -> Dict:
        return asdict(self)


# ---------------------------------------------------------------------------
# Keyword extraction (TF-IDF-lite without sklearn dep)
# ---------------------------------------------------------------------------

_STOPWORDS = frozenset({
    "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
    "of", "with", "by", "from", "as", "is", "was", "are", "were", "be",
    "been", "being", "have", "has", "had", "do", "does", "did", "will",
    "would", "could", "should", "may", "might", "shall", "can", "need",
    "dare", "ought", "used", "that", "this", "these", "those", "it", "its",
    "he", "she", "they", "we", "you", "i", "me", "him", "her", "us", "them",
    "my", "your", "his", "our", "their", "what", "which", "who", "whom",
    "when", "where", "why", "how", "all", "each", "every", "both", "few",
    "more", "most", "other", "some", "such", "no", "not", "only", "same",
    "so", "than", "too", "very", "just", "because", "if", "then", "else",
    "also", "into", "up", "out", "about", "through", "during", "before",
    "after", "above", "below", "between", "under", "again", "further",
    "once",
})


def _extract_keywords(text: str, top_n: int = 20) -> List[str]:
    """Simple frequency-based keyword extraction."""
    words = re.findall(r"\b[a-zA-Z]{3,}\b", text.lower())
    freq: Dict[str, int] = {}
    for w in words:
        if w not in _STOPWORDS:
            freq[w] = freq.get(w, 0) + 1
    sorted_words = sorted(freq, key=freq.get, reverse=True)
    return sorted_words[:top_n]


def _extract_bigrams(text: str, top_n: int = 10) -> List[str]:
    """Extract meaningful bigrams."""
    words = [w for w in re.findall(r"\b[a-zA-Z]{3,}\b", text.lower())
             if w not in _STOPWORDS]
    bigrams: Dict[str, int] = {}
    for i in range(len(words) - 1):
        bg = f"{words[i]} {words[i+1]}"
        bigrams[bg] = bigrams.get(bg, 0) + 1
    sorted_bg = sorted(bigrams, key=bigrams.get, reverse=True)
    return sorted_bg[:top_n]


# ---------------------------------------------------------------------------
# Document classification
# ---------------------------------------------------------------------------

def _classify_document(text: str, filename: str) -> ClassificationResult:
    text_lower = (text + " " + filename).lower()
    scores: Dict[str, Tuple[float, List[str]]] = {}

    for doc_type, config in DOC_TYPE_TAXONOMY.items():
        kws = config["keywords"]
        if not kws:
            continue
        matched = [kw for kw in kws if kw in text_lower]
        score = len(matched) / len(kws)
        if matched:
            scores[doc_type] = (score, matched)

    if not scores:
        return ClassificationResult(
            document_type="general",
            category="general",
            subcategory="miscellaneous",
            confidence=0.3,
            matched_keywords=[],
            alternative_types=[],
        )

    sorted_scores = sorted(scores.items(), key=lambda x: x[1][0], reverse=True)
    best_type, (best_score, best_keywords) = sorted_scores[0]
    taxonomy = DOC_TYPE_TAXONOMY[best_type]

    alternatives = [(t, round(s, 3)) for t, (s, _) in sorted_scores[1:4]]

    return ClassificationResult(
        document_type=best_type,
        category=taxonomy["category"],
        subcategory=taxonomy["subcategory"],
        confidence=round(min(best_score * 1.2, 1.0), 3),
        matched_keywords=best_keywords,
        alternative_types=alternatives,
    )


# ---------------------------------------------------------------------------
# Summary generation
# ---------------------------------------------------------------------------

def _generate_summary(
    clean_text: str,
    doc_type: str,
    kv: Dict[str, str],
    dates: List[str],
    monetary: List[Dict],
    entities: List[Any],
) -> str:
    """Generate a concise summary for embedding and display."""
    parts = []

    type_label = doc_type.replace("_", " ").title()
    parts.append(f"Document type: {type_label}.")

    if dates:
        parts.append(f"Key dates: {', '.join(dates[:3])}.")

    if monetary:
        top_amounts = [m["formatted"] for m in sorted(monetary, key=lambda x: x["amount"], reverse=True)[:3]]
        parts.append(f"Monetary values: {', '.join(top_amounts)}.")

    # Named entities
    orgs = [e.text for e in entities if hasattr(e, 'entity_type') and e.entity_type in ("ORG", "ORGANIZATION")][:3]
    persons = [e.text for e in entities if hasattr(e, 'entity_type') and e.entity_type == "PERSON"][:2]
    if orgs:
        parts.append(f"Organizations: {', '.join(orgs)}.")
    if persons:
        parts.append(f"Persons: {', '.join(persons)}.")

    # KV highlights
    for key in ["title", "subject", "from", "to", "vendor", "client", "total", "amount"]:
        if key.title() in kv or key in kv:
            val = kv.get(key.title()) or kv.get(key, "")
            if val:
                parts.append(f"{key.title()}: {val[:100]}.")

    # First sentence of clean text
    first_sentence = re.split(r"[.!?]", clean_text[:500])[0].strip()
    if first_sentence and len(first_sentence) > 20:
        parts.append(first_sentence + ".")

    return " ".join(parts)[:800]


# ---------------------------------------------------------------------------
# Completeness scoring
# ---------------------------------------------------------------------------

def _score_completeness(
    raw_text: str,
    kv: Dict,
    dates: List,
    entities: List,
    doc_type: str,
) -> float:
    score = 0.0
    if raw_text and len(raw_text) > 100:
        score += 0.4
    if kv:
        score += min(len(kv) / 10, 0.2)
    if dates:
        score += 0.15
    if entities:
        score += min(len(entities) / 20, 0.15)
    taxonomy = DOC_TYPE_TAXONOMY.get(doc_type, {})
    expected_kws = taxonomy.get("keywords", [])
    if expected_kws:
        text_lower = raw_text.lower()
        matched = sum(1 for kw in expected_kws if kw in text_lower)
        score += 0.1 * (matched / len(expected_kws))
    return round(min(score, 1.0), 3)


# ---------------------------------------------------------------------------
# Main entry point
# ---------------------------------------------------------------------------

def generate_metadata(
    file_id: str,
    filename: str,
    clean_text: str,
    raw_text: str,
    key_value_pairs: Dict[str, Any],
    entities: List[Any],
    dates: List[str],
    monetary_values: List[Dict],
    extraction_confidence: float,
    document_type_hint: str = "",
    owner_id: Optional[str] = None,
    uploaded_by: Optional[str] = None,
    department: Optional[str] = None,
    project_id: Optional[str] = None,
    stage_timings: Optional[Dict[str, float]] = None,
    near_duplicate: bool = False,
) -> DocumentMetadata:
    errors: List[str] = []
    warnings: List[str] = []
    flags: List[str] = []

    classification = _classify_document(clean_text, filename)
    doc_type = document_type_hint or classification.document_type

    keywords = _extract_keywords(clean_text)
    topics = _extract_bigrams(clean_text)

    named_entities_summary: Dict[str, List[str]] = {}
    for ent in entities:
        if not hasattr(ent, "entity_type"):
            continue
        et = ent.entity_type
        if et not in named_entities_summary:
            named_entities_summary[et] = []
        val = getattr(ent, "normalized", ent.text)
        if val not in named_entities_summary[et]:
            named_entities_summary[et].append(val)

    summary = _generate_summary(clean_text, doc_type, key_value_pairs, dates, monetary_values, entities)
    completeness = _score_completeness(clean_text, key_value_pairs, dates, entities, doc_type)

    if extraction_confidence < 0.5:
        flags.append("low_confidence")
    if near_duplicate:
        flags.append("near_duplicate")
    if completeness < 0.4:
        flags.append("incomplete")
    if not dates:
        flags.append("no_dates_found")

    doc_date = dates[0] if dates else None
    period_start = min(dates) if len(dates) > 1 else doc_date
    period_end = max(dates) if len(dates) > 1 else doc_date

    return DocumentMetadata(
        file_id=file_id,
        filename=filename,
        document_type=doc_type,
        category=classification.category,
        subcategory=classification.subcategory,
        classification_confidence=classification.confidence,
        alternative_classifications=[
            {"type": t, "confidence": c} for t, c in classification.alternative_types
        ],
        keywords=keywords,
        topics=topics,
        named_entities_summary=named_entities_summary,
        owner_id=owner_id,
        uploaded_by=uploaded_by,
        department=department,
        project_id=project_id,
        upload_timestamp=datetime.now(timezone.utc).isoformat(),
        document_date=doc_date,
        period_start=period_start,
        period_end=period_end,
        extraction_confidence=extraction_confidence,
        ocr_quality=None,
        completeness_score=completeness,
        processing_flags=flags,
        source_system="joseph-ai-document-pipeline",
        pipeline_version="2.0.0",
        stage_timings=stage_timings or {},
        processing_status="complete" if not flags else "partial",
        related_documents=[],
        same_vendor_docs=[],
        same_project_docs=[],
        summary=summary,
        embedding_ready=len(clean_text) > 50,
        errors=errors,
        warnings=warnings,
    )
