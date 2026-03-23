#!/usr/bin/env python3
"""Seed Performance-Driver Alignment KPI records for Financial Advisory."""
import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend_django.settings")
django.setup()

from django.contrib.auth import get_user_model
from api.models import KPI

User = get_user_model()
user = User.objects.filter(email="test@example.com").first() or User.objects.order_by("id").first()
if not user:
    raise SystemExit("No user found. Create a user before seeding KPI records.")

KPI.objects.filter(user=user).delete()

rows = [
    {
        "name": "Revenue Growth Rate",
        "description": "Measures period-over-period revenue expansion",
        "category": "revenue",
        "impact": "high",
        "current_value": 12.0,
        "target_value": 10.0,
        "unit": "%",
        "trend": "improving",
        "status": "exceeding_target",
        "driver_type": "leading",
        "unit_of_measure": "%",
        "warning_threshold": 8.0,
        "critical_threshold": 6.0,
        "data_source": "auto_sync",
        "linked_budget_items": ["Q2 Revenue", "Enterprise Sales Plan"],
        "driver_link": ["Sales Pipeline", "Pricing Strategy"],
        "kpi_history": [
            {"date": "2026-01-31", "value": 8.7},
            {"date": "2026-02-28", "value": 10.2},
            {"date": "2026-03-20", "value": 12.0},
        ],
    },
    {
        "name": "Customer Acquisition Cost",
        "description": "Tracks blended CAC across channels",
        "category": "cost",
        "impact": "high",
        "current_value": 285.0,
        "target_value": 300.0,
        "unit": "$",
        "trend": "improving",
        "status": "on_track",
        "driver_type": "lagging",
        "unit_of_measure": "$",
        "warning_threshold": 320.0,
        "critical_threshold": 360.0,
        "data_source": "auto_sync",
        "linked_budget_items": ["Marketing Budget", "Demand Generation"],
        "driver_link": ["Campaign Mix", "Channel ROI"],
        "kpi_history": [
            {"date": "2026-01-31", "value": 320.0},
            {"date": "2026-02-28", "value": 301.0},
            {"date": "2026-03-20", "value": 285.0},
        ],
    },
    {
        "name": "Operational Cycle Time",
        "description": "Average end-to-end cycle time for fulfillment",
        "category": "efficiency",
        "impact": "medium",
        "current_value": 4.2,
        "target_value": 4.0,
        "unit": "days",
        "trend": "stable",
        "status": "at_risk",
        "driver_type": "leading",
        "unit_of_measure": "days",
        "warning_threshold": 4.4,
        "critical_threshold": 5.0,
        "data_source": "manual",
        "linked_budget_items": ["Operations Budget"],
        "driver_link": ["Fulfillment Process", "Staffing Levels"],
        "kpi_history": [
            {"date": "2026-01-31", "value": 4.5},
            {"date": "2026-02-28", "value": 4.3},
            {"date": "2026-03-20", "value": 4.2},
        ],
    },
    {
        "name": "Forecast Accuracy",
        "description": "Variance-based accuracy of rolling forecasts",
        "category": "financial",
        "impact": "medium",
        "current_value": 92.0,
        "target_value": 95.0,
        "unit": "%",
        "trend": "improving",
        "status": "on_track",
        "driver_type": "lagging",
        "unit_of_measure": "%",
        "warning_threshold": 88.0,
        "critical_threshold": 82.0,
        "data_source": "auto_sync",
        "linked_budget_items": ["Forecast Model", "Budget Control"],
        "driver_link": ["Planning Cadence", "Variance Analysis"],
        "kpi_history": [
            {"date": "2026-01-31", "value": 88.0},
            {"date": "2026-02-28", "value": 90.0},
            {"date": "2026-03-20", "value": 92.0},
        ],
    },
]

for row in rows:
    KPI.objects.create(user=user, **row)

print(f"Seeded performance drivers (KPI rows): {len(rows)}")
print(f"User: {user.email} (id={user.id})")
