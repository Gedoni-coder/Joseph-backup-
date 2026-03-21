#!/usr/bin/env python
import os
import django
from datetime import datetime
from django.utils import timezone

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend_django.settings")
django.setup()

from api.models import PricingTest

PricingTest.objects.all().delete()

def parse_date(date_value: str) -> datetime:
    return timezone.make_aware(datetime.strptime(date_value, "%Y-%m-%d"))

records = [
    {
        "name": "Premium Tier Price Optimization",
        "test_type": "a-b",
        "status": "running",
        "confidence": 73,
        "start_date": parse_date("2024-12-01"),
        "end_date": parse_date("2024-12-31"),
        "sample_size": 1568,
        "variant_count": 2,
        "results": {
            "variants": [
                {
                    "id": "current",
                    "name": "Current Price",
                    "price": 299,
                    "conversions": 847,
                    "revenue": 253153,
                    "conversionRate": 6.8,
                },
                {
                    "id": "increased",
                    "name": "Increased Price",
                    "price": 349,
                    "conversions": 721,
                    "revenue": 251629,
                    "conversionRate": 5.8,
                },
            ]
        },
    },
    {
        "name": "Mobile App Subscription Test",
        "test_type": "multivariate",
        "status": "completed",
        "confidence": 89,
        "start_date": parse_date("2024-11-01"),
        "end_date": parse_date("2024-11-30"),
        "sample_size": 4217,
        "variant_count": 2,
        "results": {
            "variants": [
                {
                    "id": "monthly-999",
                    "name": "Monthly $9.99",
                    "price": 9.99,
                    "conversions": 2341,
                    "revenue": 23383,
                    "conversionRate": 5.1,
                },
                {
                    "id": "monthly-1299",
                    "name": "Monthly $12.99",
                    "price": 12.99,
                    "conversions": 1876,
                    "revenue": 24365,
                    "conversionRate": 4.1,
                },
            ]
        },
    },
]

for row in records:
    PricingTest.objects.create(**row)

print(f"Seeded {len(records)} pricing tests for Testing tab")
