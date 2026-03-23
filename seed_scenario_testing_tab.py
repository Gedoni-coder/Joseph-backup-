#!/usr/bin/env python3
import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend_django.settings")
django.setup()

from api.models import (
    RecommendedStressTest,
    ScenarioResilienceMetric,
    ScenarioTest,
)


def seed_scenario_testing_tab() -> None:
    ScenarioResilienceMetric.objects.all().delete()
    RecommendedStressTest.objects.all().delete()
    ScenarioTest.objects.all().delete()

    scenario_rows = [
        {
            "name": "Revenue -30% Stress",
            "type": "stress",
            "description": "Severe demand contraction with immediate revenue shock.",
            "impact": {
                "parameters": [{"variable": "Revenue", "baseValue": 2500000, "testValue": 1750000, "changePercent": -30}],
                "revenue": 1750000,
                "expenses": 1500000,
                "netIncome": 250000,
                "cashFlow": -600000,
                "impactSeverity": "critical",
            },
            "probability": 28,
        },
        {
            "name": "Revenue -15% Sensitivity",
            "type": "sensitivity",
            "description": "Moderate sales contraction under weaker market demand.",
            "impact": {
                "parameters": [{"variable": "Revenue", "baseValue": 2500000, "testValue": 2125000, "changePercent": -15}],
                "revenue": 2125000,
                "expenses": 1500000,
                "netIncome": 625000,
                "cashFlow": -300000,
                "impactSeverity": "high",
            },
            "probability": 36,
        },
        {
            "name": "Operating Expenses +20%",
            "type": "stress",
            "description": "Inflation and supplier pressure raise operating expenses.",
            "impact": {
                "parameters": [{"variable": "Expenses", "baseValue": 1500000, "testValue": 1800000, "changePercent": 20}],
                "revenue": 2500000,
                "expenses": 1800000,
                "netIncome": 700000,
                "cashFlow": -240000,
                "impactSeverity": "high",
            },
            "probability": 40,
        },
        {
            "name": "Market Share -10%",
            "type": "sensitivity",
            "description": "Competitive losses reduce top-line performance.",
            "impact": {
                "parameters": [{"variable": "Market Share", "baseValue": 100, "testValue": 90, "changePercent": -10}],
                "revenue": 2350000,
                "expenses": 1455000,
                "netIncome": 895000,
                "cashFlow": -105000,
                "impactSeverity": "medium",
            },
            "probability": 33,
        },
        {
            "name": "Interest Rates +300bps",
            "type": "stress",
            "description": "Debt servicing costs rise after sharp central bank moves.",
            "impact": {
                "parameters": [{"variable": "Interest Rates", "baseValue": 5, "testValue": 8, "changePercent": 3}],
                "revenue": 2500000,
                "expenses": 1590000,
                "netIncome": 910000,
                "cashFlow": -81000,
                "impactSeverity": "medium",
            },
            "probability": 29,
        },
        {
            "name": "Revenue +10% Upside",
            "type": "what_if",
            "description": "Upside case from stronger conversion and expansion sales.",
            "impact": {
                "parameters": [{"variable": "Revenue", "baseValue": 2500000, "testValue": 2750000, "changePercent": 10}],
                "revenue": 2750000,
                "expenses": 1500000,
                "netIncome": 1250000,
                "cashFlow": 200000,
                "impactSeverity": "low",
            },
            "probability": 45,
        },
        {
            "name": "Supplier Disruption",
            "type": "stress",
            "description": "Input delays and spot buying significantly lift COGS.",
            "impact": {
                "parameters": [{"variable": "Expenses", "baseValue": 1500000, "testValue": 1920000, "changePercent": 28}],
                "revenue": 2400000,
                "expenses": 1920000,
                "netIncome": 480000,
                "cashFlow": -336000,
                "impactSeverity": "critical",
            },
            "probability": 24,
        },
        {
            "name": "FX Volatility",
            "type": "sensitivity",
            "description": "Currency swings affect procurement and imported services.",
            "impact": {
                "parameters": [{"variable": "Expenses", "baseValue": 1500000, "testValue": 1620000, "changePercent": 8}],
                "revenue": 2500000,
                "expenses": 1620000,
                "netIncome": 880000,
                "cashFlow": -96000,
                "impactSeverity": "medium",
            },
            "probability": 31,
        },
        {
            "name": "Demand Recovery +15%",
            "type": "what_if",
            "description": "Rebound case driven by retention and upsell improvements.",
            "impact": {
                "parameters": [{"variable": "Revenue", "baseValue": 2500000, "testValue": 2875000, "changePercent": 15}],
                "revenue": 2875000,
                "expenses": 1560000,
                "netIncome": 1315000,
                "cashFlow": 280000,
                "impactSeverity": "low",
            },
            "probability": 41,
        },
    ]

    for row in scenario_rows:
        ScenarioTest.objects.create(**row)

    resilience_rows = [
        {
            "name": "Revenue Decline Tolerance",
            "value": "-25%",
            "value_tone": "red",
            "description": "Business remains profitable with up to 25% revenue decline.",
            "sort_order": 1,
        },
        {
            "name": "Cost Inflation Buffer",
            "value": "+15%",
            "value_tone": "yellow",
            "description": "Can absorb up to 15% increase in operating costs.",
            "sort_order": 2,
        },
        {
            "name": "Cash Flow Stress Point",
            "value": "6 months",
            "value_tone": "orange",
            "description": "Liquidity remains sufficient for six months under stress conditions.",
            "sort_order": 3,
        },
    ]

    for row in resilience_rows:
        ScenarioResilienceMetric.objects.create(**row)

    recommended_rows = [
        {
            "title": "Supply Chain Disruption",
            "description": "Test a 20-30% increase in material and logistics costs.",
            "icon": "alert-triangle",
            "scenario_template": {
                "testVariable": "Expenses",
                "changePercent": 25,
                "testType": "stress",
            },
            "sort_order": 1,
        },
        {
            "title": "Economic Recession",
            "description": "Model a 40% demand reduction scenario with margin pressure.",
            "icon": "trending-down",
            "scenario_template": {
                "testVariable": "Revenue",
                "changePercent": -40,
                "testType": "stress",
            },
            "sort_order": 2,
        },
        {
            "title": "Interest Rate Shock",
            "description": "Analyze a 300 basis point rate increase on financing costs.",
            "icon": "activity",
            "scenario_template": {
                "testVariable": "Interest Rates",
                "changePercent": 3,
                "testType": "sensitivity",
            },
            "sort_order": 3,
        },
    ]

    for row in recommended_rows:
        RecommendedStressTest.objects.create(**row)

    print("Seeded scenario and stress testing tab data.")
    print("- scenario tests:", ScenarioTest.objects.count())
    print("- resilience metrics:", ScenarioResilienceMetric.objects.count())
    print("- recommended stress tests:", RecommendedStressTest.objects.count())


if __name__ == "__main__":
    seed_scenario_testing_tab()
