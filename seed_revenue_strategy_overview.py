#!/usr/bin/env python3
import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend_django.settings")
django.setup()

from django.contrib.auth import get_user_model
from api.models import (
    RevenueOverviewMetric,
    RevenueOverviewTopStream,
    RevenueOverviewChurnRisk,
    RevenueOverviewUpsellOpportunity,
    RevenueOverviewChannelPerformance,
    RevenueUpsellInsight,
)

User = get_user_model()
user = User.objects.order_by("id").first()

if not user:
    raise SystemExit("No user found. Create a user first, then rerun this script.")

RevenueOverviewMetric.objects.filter(user=user).delete()
RevenueOverviewTopStream.objects.filter(user=user).delete()
RevenueOverviewChurnRisk.objects.filter(user=user).delete()
RevenueOverviewUpsellOpportunity.objects.filter(user=user).delete()
RevenueOverviewChannelPerformance.objects.filter(user=user).delete()
RevenueUpsellInsight.objects.filter(user=user).delete()

metrics = [
    {
        "name": "Monthly Recurring Revenue",
        "value": 486750,
        "unit": "USD",
        "change_percent": 12.8,
        "trend": "up",
        "period_label": "This month",
        "sort_order": 1,
    },
    {
        "name": "Annual Contract Value",
        "value": 28400,
        "unit": "USD",
        "change_percent": 8.4,
        "trend": "up",
        "period_label": "Q3 2024",
        "sort_order": 2,
    },
    {
        "name": "Customer Lifetime Value",
        "value": 14250,
        "unit": "USD",
        "change_percent": -2.1,
        "trend": "down",
        "period_label": "Last 90 days",
        "sort_order": 3,
    },
    {
        "name": "Revenue per Customer",
        "value": 2847,
        "unit": "USD",
        "change_percent": 15.6,
        "trend": "up",
        "period_label": "This quarter",
        "sort_order": 4,
    },
    {
        "name": "Gross Revenue Retention",
        "value": 94.2,
        "unit": "%",
        "change_percent": 1.8,
        "trend": "up",
        "period_label": "Last 12 months",
        "sort_order": 5,
    },
    {
        "name": "Net Revenue Retention",
        "value": 118.5,
        "unit": "%",
        "change_percent": 4.2,
        "trend": "up",
        "period_label": "Last 12 months",
        "sort_order": 6,
    },
]

streams = [
    {
        "name": "SaaS Subscriptions",
        "stream_type": "subscription",
        "revenue": 2800000,
        "growth_percent": 20.4,
        "sort_order": 1,
    },
    {
        "name": "Professional Services",
        "stream_type": "one-time",
        "revenue": 900000,
        "growth_percent": 25.0,
        "sort_order": 2,
    },
    {
        "name": "API Usage",
        "stream_type": "usage-based",
        "revenue": 500000,
        "growth_percent": 40.5,
        "sort_order": 3,
    },
]

churn_risks = [
    {
        "segment": "Enterprise",
        "customers": 147,
        "churn_rate": 3.2,
        "revenue_at_risk": 890000,
        "sort_order": 1,
    },
    {
        "segment": "SMB",
        "customers": 823,
        "churn_rate": 8.7,
        "revenue_at_risk": 245000,
        "sort_order": 2,
    },
    {
        "segment": "Startup",
        "customers": 1456,
        "churn_rate": 12.4,
        "revenue_at_risk": 178000,
        "sort_order": 3,
    },
]

upsells = [
    {
        "customer_name": "TechCorp Industries",
        "current_plan": "Professional",
        "suggested_plan": "Enterprise",
        "current_mrr": 0,
        "potential_increase": 2500,
        "likelihood_percent": 87,
        "time_to_upgrade_days": 0,
        "triggers": [],
        "sort_order": 1,
    },
    {
        "customer_name": "StartupX Inc",
        "current_plan": "Basic",
        "suggested_plan": "Professional",
        "current_mrr": 0,
        "potential_increase": 200,
        "likelihood_percent": 72,
        "time_to_upgrade_days": 0,
        "triggers": [],
        "sort_order": 2,
    },
    {
        "customer_name": "GlobalSoft Ltd",
        "current_plan": "Professional",
        "suggested_plan": "Enterprise",
        "current_mrr": 0,
        "potential_increase": 1600,
        "likelihood_percent": 94,
        "time_to_upgrade_days": 0,
        "triggers": [],
        "sort_order": 3,
    },
]

upsell_insights = [
    {"category": "high-priority", "text": "Focus on customers with 80%+ probability scores", "sort_order": 1},
    {"category": "high-priority", "text": "Prioritize accounts nearing upgrade triggers", "sort_order": 2},
    {"category": "high-priority", "text": "Create personalized upgrade presentations", "sort_order": 3},
    {"category": "high-priority", "text": "Offer limited-time upgrade incentives", "sort_order": 4},
    {"category": "success-factor", "text": "API usage approaching limits", "sort_order": 1},
    {"category": "success-factor", "text": "Multiple team member requests", "sort_order": 2},
    {"category": "success-factor", "text": "Strong engagement metrics", "sort_order": 3},
    {"category": "success-factor", "text": "Security/compliance requirements", "sort_order": 4},
]

channels = [
    {
        "channel": "Direct Sales",
        "customers": 456,
        "revenue": 3200000,
        "margin_percent": 68.5,
        "sort_order": 1,
    },
    {
        "channel": "Partner Network",
        "customers": 1247,
        "revenue": 1900000,
        "margin_percent": 45.2,
        "sort_order": 2,
    },
    {
        "channel": "Online Marketplace",
        "customers": 2341,
        "revenue": 900000,
        "margin_percent": 38.7,
        "sort_order": 3,
    },
]

for row in metrics:
    RevenueOverviewMetric.objects.create(user=user, **row)

for row in streams:
    RevenueOverviewTopStream.objects.create(user=user, **row)

for row in churn_risks:
    RevenueOverviewChurnRisk.objects.create(user=user, **row)

for row in upsells:
    RevenueOverviewUpsellOpportunity.objects.create(user=user, **row)

for row in channels:
    RevenueOverviewChannelPerformance.objects.create(user=user, **row)

for row in upsell_insights:
    RevenueUpsellInsight.objects.create(user=user, **row)

print(f"Seeded revenue strategy overview data for user '{user.username}'.")
print(f"- overview metrics: {len(metrics)}")
print(f"- top streams: {len(streams)}")
print(f"- churn risks: {len(churn_risks)}")
print(f"- upsell opportunities: {len(upsells)}")
print(f"- channel performances: {len(channels)}")
print(f"- upsell insights: {len(upsell_insights)}")
