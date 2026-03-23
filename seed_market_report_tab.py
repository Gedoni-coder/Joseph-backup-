#!/usr/bin/env python3
import os
from datetime import datetime

import django
from django.utils import timezone

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend_django.settings")
django.setup()

from api.models import ReportNote

ReportNote.objects.all().delete()

generated_at = timezone.make_aware(datetime(2026, 3, 20, 15, 57, 0))

common_recommendations = [
    "Review this report and define actions in the Action Plan.",
]

common_next_steps = [
    "Validate assumptions",
    "Assign owners",
    "Track progress weekly",
]

reports = [
    {
        "title": "Consolidation Opportunity",
        "content": "3-5 regional players in key markets are seeking exit opportunities or partnerships. These present acquisition targets for market expansion.",
        "summary": "3-5 regional players in key markets are seeking exit opportunities or partnerships. These present acquisition targets for market expansion.",
        "author": "JOSEPH",
        "confidence": 75,
        "date_generated": generated_at,
        "key_metrics": [
            {"label": "Report Confidence Level", "value": "75%", "trend": "stable"},
        ],
        "insights": [
            "3-5 regional players in key markets are seeking exit opportunities or partnerships. These present acquisition targets for market expansion.",
        ],
        "recommendations": common_recommendations,
        "next_steps": common_next_steps,
        "category": "recommendation",
        "importance": "medium",
    },
    {
        "title": "Customer Acquisition Costs Rising",
        "content": "CAC continues to rise 8-12% annually across all segments. This trend makes customer retention and LTV expansion critical for profitability.",
        "summary": "CAC continues to rise 8-12% annually across all segments. This trend makes customer retention and LTV expansion critical for profitability.",
        "author": "JOSEPH",
        "confidence": 75,
        "date_generated": generated_at,
        "key_metrics": [
            {"label": "Report Confidence Level", "value": "75%", "trend": "stable"},
        ],
        "insights": [
            "CAC continues to rise 8-12% annually across all segments. This trend makes customer retention and LTV expansion critical for profitability.",
        ],
        "recommendations": common_recommendations,
        "next_steps": common_next_steps,
        "category": "strategy",
        "importance": "high",
    },
    {
        "title": "AI Personalization is Table Stakes",
        "content": "Every major competitor now offers AI-powered recommendations. This feature is essential for competitive positioning and directly impacts customer satisfaction and retention.",
        "summary": "Every major competitor now offers AI-powered recommendations. This feature is essential for competitive positioning and directly impacts customer satisfaction and retention.",
        "author": "JOSEPH",
        "confidence": 75,
        "date_generated": generated_at,
        "key_metrics": [
            {"label": "Report Confidence Level", "value": "75%", "trend": "stable"},
        ],
        "insights": [
            "Every major competitor now offers AI-powered recommendations. This feature is essential for competitive positioning and directly impacts customer satisfaction and retention.",
        ],
        "recommendations": common_recommendations,
        "next_steps": common_next_steps,
        "category": "competitive",
        "importance": "high",
    },
    {
        "title": "Market Growth Accelerating",
        "content": "Market growth is accelerating above historical 15% baseline to 18.5% CAGR. This acceleration is driven by digital transformation initiatives and rising e-commerce penetration rates.",
        "summary": "Market growth is accelerating above historical 15% baseline to 18.5% CAGR. This acceleration is driven by digital transformation initiatives and rising e-commerce penetration rates.",
        "author": "JOSEPH",
        "confidence": 75,
        "date_generated": generated_at,
        "key_metrics": [
            {"label": "Report Confidence Level", "value": "75%", "trend": "stable"},
        ],
        "insights": [
            "Market growth is accelerating above historical 15% baseline to 18.5% CAGR. This acceleration is driven by digital transformation initiatives and rising e-commerce penetration rates.",
        ],
        "recommendations": common_recommendations,
        "next_steps": common_next_steps,
        "category": "overview",
        "importance": "high",
    },
    {
        "title": "Mid-Market is Prime Target",
        "content": "Mid-market retailers (32% of market) are experiencing 22.5% growth - faster than enterprise (14.2%) and only slightly slower than SMB (35%). This segment offers best ROI for our sales and marketing investments.",
        "summary": "Mid-market retailers (32% of market) are experiencing 22.5% growth - faster than enterprise (14.2%) and only slightly slower than SMB (35%). This segment offers best ROI for our sales and marketing investments.",
        "author": "JOSEPH",
        "confidence": 75,
        "date_generated": generated_at,
        "key_metrics": [
            {"label": "Report Confidence Level", "value": "75%", "trend": "stable"},
        ],
        "insights": [
            "Mid-market retailers (32% of market) are experiencing 22.5% growth - faster than enterprise (14.2%) and only slightly slower than SMB (35%). This segment offers best ROI for our sales and marketing investments.",
        ],
        "recommendations": common_recommendations,
        "next_steps": common_next_steps,
        "category": "market",
        "importance": "critical",
    },
]

for row in reports:
    ReportNote.objects.create(**row)

print({
    "reports_created": len(reports),
    "avg_confidence": 75,
    "total_insights": sum(len(report["insights"]) for report in reports),
})
