#!/usr/bin/env python
import os
import django
from datetime import datetime, timedelta, timezone

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend_django.settings")
django.setup()

from api.models import PriceSetting

plus_one = timezone(timedelta(hours=1))

PriceSetting.objects.filter(strategy="dynamic").delete()

records = [
    {
        "product": "Cloud Storage Pro",
        "base_price": 19.99,
        "current_price": 22.99,
        "strategy": "dynamic",
        "algorithm": "ai-driven",
        "min_price": 14.99,
        "max_price": 29.99,
        "next_update": datetime(2024, 12, 1, 8, 30, tzinfo=plus_one),
        "factors": [
            {"name": "Demand Level", "currentValue": 0.85, "impact": 15, "weight": 0.4},
            {"name": "Competitor Pricing", "currentValue": 0.72, "impact": 8, "weight": 0.3},
            {"name": "Inventory Level", "currentValue": 0.91, "impact": -2, "weight": 0.2},
            {"name": "Time of Day", "currentValue": 0.65, "impact": 3, "weight": 0.1},
        ],
        "history": [
            {
                "timestamp": datetime(2024, 12, 1, 8, 30, tzinfo=plus_one).isoformat(),
                "type": "algorithm-update",
                "previous_price": 21.99,
                "new_price": 22.99,
                "change_percent": 15.0,
                "reason": "Demand spike and competitor positioning",
            },
            {
                "timestamp": datetime(2024, 11, 30, 20, 0, tzinfo=plus_one).isoformat(),
                "type": "algorithm-update",
                "previous_price": 20.49,
                "new_price": 21.99,
                "change_percent": 10.0,
                "reason": "Peak-hour demand adjustment",
            },
        ],
    },
    {
        "product": "Professional Services",
        "base_price": 150.0,
        "current_price": 165.0,
        "strategy": "dynamic",
        "algorithm": "demand-based",
        "min_price": 120.0,
        "max_price": 220.0,
        "next_update": datetime(2024, 12, 1, 6, 0, tzinfo=plus_one),
        "factors": [
            {"name": "Market Demand", "currentValue": 0.88, "impact": 10, "weight": 0.5},
            {"name": "Resource Availability", "currentValue": 0.45, "impact": 12, "weight": 0.3},
            {"name": "Seasonal Trends", "currentValue": 0.75, "impact": -2, "weight": 0.2},
        ],
        "history": [
            {
                "timestamp": datetime(2024, 12, 1, 6, 0, tzinfo=plus_one).isoformat(),
                "type": "algorithm-update",
                "previous_price": 160.0,
                "new_price": 165.0,
                "change_percent": 10.0,
                "reason": "High demand and constrained capacity",
            },
            {
                "timestamp": datetime(2024, 11, 29, 18, 30, tzinfo=plus_one).isoformat(),
                "type": "manual-override",
                "previous_price": 155.0,
                "new_price": 160.0,
                "change_percent": 6.7,
                "reason": "Executive adjustment",
            },
        ],
    },
]

for row in records:
    PriceSetting.objects.create(**row)

print(f"Seeded {len(records)} dynamic pricing products")
