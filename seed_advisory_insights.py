#!/usr/bin/env python3
"""
Seed script to populate Advisory Insights with initial data.
Creates strategic recommendations with financial impact analysis.
"""
import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend_django.settings")
django.setup()

from decimal import Decimal
from api.models import AdvisoryInsight

# Clear existing insights
AdvisoryInsight.objects.all().delete()

insights_data = [
    {
        "title": "Working Capital Optimization",
        "description": "Improve cash conversion cycle by 15 days through receivables and payables management",
        "category": "cost_optimization",
        "priority": "medium",
        "status": "new",
        "financial_impact": Decimal("15.00"),
        "timeframe": "90 days",
        "confidence_score": 70,
        "recommendations": [
            "Accelerate receivables collection by 5 days",
            "Extend payables cycle by 10 days",
            "Optimize inventory levels",
            "Review payment terms with suppliers"
        ],
    },
    {
        "title": "Revenue Growth Initiative",
        "description": "Data-driven insights suggest focusing on enterprise segment for higher LTV customers",
        "category": "revenue_growth",
        "priority": "high",
        "status": "new",
        "financial_impact": Decimal("0.00"),
        "timeframe": "90 days",
        "confidence_score": 80,
        "recommendations": [
            "Develop enterprise-focused go-to-market strategy",
            "Allocate resources to high-LTV segment",
            "Create customized enterprise solutions",
            "Build dedicated enterprise sales team"
        ],
    },
    {
        "title": "Cost Optimization Opportunity",
        "description": "Analysis shows potential for 15% reduction in operational costs through process improvements",
        "category": "cost_optimization",
        "priority": "high",
        "status": "new",
        "financial_impact": Decimal("15.00"),
        "timeframe": "90 days",
        "confidence_score": 80,
        "recommendations": [
            "Implement process automation in finance",
            "Consolidate vendor relationships",
            "Optimize facility costs",
            "Review discretionary spending"
        ],
    },
]

for data in insights_data:
    insight = AdvisoryInsight.objects.create(**data)
    print(f"✓ Created: {insight.title} ({insight.category})")

print(f"\n📊 Seeded {len(insights_data)} advisory insights")
print("✓ All insights set to 'new' status and ready for review")
