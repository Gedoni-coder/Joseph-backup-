#!/usr/bin/env python3
import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend_django.settings")
django.setup()

from api.models import (
    RiskAssessment,
)


def seed_risk_assessment_tab() -> None:
    RiskAssessment.objects.all().delete()

    # Created in reverse so default created_at desc ordering matches UI expectation.
    risk_rows = [
        {
            "category": "Market Risk",
            "description": "Changes in market conditions affecting demand",
            "level": "medium",
            "impact": "high",
            "mitigation": "Diversify product portfolio and customer base",
        },
        {
            "category": "Credit Risk",
            "description": "Customer default or delayed payments",
            "level": "low",
            "impact": "medium",
            "mitigation": "Credit checks and payment terms optimization",
        },
        {
            "category": "Operational Risk",
            "description": "Disruption to business operations",
            "level": "medium",
            "impact": "medium",
            "mitigation": "Business continuity planning and insurance",
        },
    ]

    for row in risk_rows:
        RiskAssessment.objects.create(**row)

    print("Seeded risk assessment tab data.")
    print("- risk assessments:", RiskAssessment.objects.count())


if __name__ == "__main__":
    seed_risk_assessment_tab()
