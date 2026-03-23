"""Insight extraction utilities for the document processing MVP.

Outputs:
- summary
- key_points
- keywords
- entities (people, dates, places)
"""

from __future__ import annotations

import re
from typing import Dict, List


def _split_sentences(text: str) -> List[str]:
    raw = re.split(r"(?<=[.!?])\s+", text or "")
    return [s.strip() for s in raw if len(s.strip()) > 20]


def _build_summary(clean_text: str, fallback_summary: str) -> str:
    if fallback_summary and fallback_summary.strip():
        return fallback_summary.strip()
    sentences = _split_sentences(clean_text)
    if not sentences:
        return "No extractable summary was generated from this document."
    return " ".join(sentences[:3])[:1200]


def _build_key_points(clean_text: str, max_points: int = 5) -> List[str]:
    points: List[str] = []
    for sentence in _split_sentences(clean_text):
        if sentence in points:
            continue
        points.append(sentence)
        if len(points) >= max_points:
            break
    return points


def _map_entities(named_entities_summary: Dict, dates: List[str]) -> Dict[str, List[str]]:
    people = list(named_entities_summary.get("PERSON", []))
    places = list(named_entities_summary.get("GPE", []))
    organizations = list(named_entities_summary.get("ORG", []))
    merged_dates = list(dict.fromkeys([*dates, *named_entities_summary.get("DATE", [])]))

    return {
        "people": people,
        "dates": merged_dates,
        "places": places,
        "organizations": organizations,
    }


def build_mvp_insights(
    clean_text: str,
    metadata_summary: str,
    metadata_keywords: List[str],
    named_entities_summary: Dict,
    dates: List[str],
) -> Dict:
    summary = _build_summary(clean_text, metadata_summary)
    key_points = _build_key_points(clean_text)
    keywords = list(dict.fromkeys((metadata_keywords or [])[:20]))
    entities = _map_entities(named_entities_summary or {}, dates or [])

    return {
        "summary": summary,
        "key_points": key_points,
        "keywords": keywords,
        "entities": entities,
    }
