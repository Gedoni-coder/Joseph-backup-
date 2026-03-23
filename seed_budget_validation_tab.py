#!/usr/bin/env python3
import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend_django.settings")
django.setup()

from api.models import (
    BudgetAlignmentMetric,
    BudgetValidationSummary,
    ForecastImprovementArea,
    ForecastValidationRecord,
)


def seed_budget_validation_tab() -> None:
    BudgetValidationSummary.objects.all().delete()
    ForecastValidationRecord.objects.all().delete()
    BudgetAlignmentMetric.objects.all().delete()
    ForecastImprovementArea.objects.all().delete()

    BudgetValidationSummary.objects.create(
        accuracy_score=0,
        avg_variance=40000.0,
        validated_forecasts=1,
        budget_alignment=92,
    )

    ForecastValidationRecord.objects.create(
        period="Q1 2024",
        validation_status="acceptable",
        forecasted_revenue=6900000,
        actual_revenue=7150000,
        revenue_variance=3.6,
        forecasted_net_income=4900000,
        actual_net_income=5200000,
        accuracy_score=92,
        sort_order=1,
    )

    alignment_metrics = [
        {"name": "Revenue Forecasting", "score": 88, "sort_order": 1},
        {"name": "Expense Planning", "score": 94, "sort_order": 2},
        {"name": "Cash Flow Prediction", "score": 79, "sort_order": 3},
        {"name": "Market Condition Factors", "score": 86, "sort_order": 4},
    ]
    for row in alignment_metrics:
        BudgetAlignmentMetric.objects.create(**row)

    improvement_areas = [
        {
            "title": "Revenue Forecasting Strength",
            "summary": "Consistently outperforming forecasts by 3.2% on average",
            "icon": "trending-up",
            "theme": "green",
            "sections": [
                {
                    "heading": "Current Performance",
                    "body": "Your revenue forecasts consistently underestimate actual results, with an average outperformance of +3.2%. This pattern is consistent across multiple periods, indicating a systemic tendency toward conservative estimation rather than random variance.",
                },
                {
                    "heading": "Root Cause Analysis",
                    "body": "This outperformance may result from: (1) conservative sales forecasting by nature, (2) stronger-than-expected market demand, or (3) superior sales execution exceeding internal expectations. Each requires different strategic responses.",
                },
                {
                    "heading": "Strategic Implication",
                    "body": "While consistent outperformance is positive, it suggests you may be leaving strategic opportunities on the table. More aggressive revenue forecasting could enable better resource allocation and unlock profitable growth initiatives.",
                },
            ],
            "recommended_action": "Increase revenue targets by 3-4% in next forecast cycle and incorporate leading sales indicators for better upside visibility.",
            "sort_order": 1,
        },
        {
            "title": "Expense Volatility Control",
            "summary": "Higher variance in operating expenses requires refinement",
            "icon": "alert-circle",
            "theme": "yellow",
            "sections": [
                {
                    "heading": "Current Challenge",
                    "body": "Operating expenses exhibit noticeable volatility, particularly in weeks 1-2 of each period. This unpredictability increases the challenge of accurate net income forecasting and weakens the overall stability of financial projections.",
                },
                {
                    "heading": "Affected Areas",
                    "bullets": [
                        "Procurement patterns and supplier payment timing",
                        "Staffing costs and hourly labor fluctuations",
                        "Discretionary spending and project-based expenses",
                    ],
                },
                {
                    "heading": "Impact Assessment",
                    "body": "This volatility is the primary source of forecasting noise and complicates strategic decision-making. It weakens confidence in cash flow projections and makes budget variance analysis less actionable.",
                },
            ],
            "recommended_action": "Implement granular expense tracking by sub-category. Establish fixed vs. variable expense analysis and develop rolling 13-week expense forecasts.",
            "sort_order": 2,
        },
        {
            "title": "Seasonal Pattern Optimization",
            "summary": "Strengthen seasonal weighting in quarterly forecasts",
            "icon": "calendar",
            "theme": "blue",
            "sections": [
                {
                    "heading": "Pattern Identification",
                    "body": "Q1 and Q4 consistently demonstrate significant seasonal uplift in revenue, indicating strong recurring patterns driven by market cycles or business seasonality. These patterns are partially captured in current forecasts but insufficiently weighted.",
                },
                {
                    "heading": "Current State Assessment",
                    "body": "While seasonal effects are acknowledged in forecasting, the magnitude of seasonal adjustments appears to underestimate the actual impact. Q1 shows approximately 15-18% uplift vs. baseline, but current models incorporate only 8-10%.",
                },
                {
                    "heading": "Improvement Potential",
                    "body": "Incorporating stronger seasonal adjustments with multi-year historical data analysis could improve forecast accuracy by 3-5 percentage points.",
                },
            ],
            "recommended_action": "Conduct 3-year seasonal analysis by quarter and product line. Increase seasonal weighting in Q1/Q4 forecasts and establish dynamic seasonal factors.",
            "sort_order": 3,
        },
    ]

    for row in improvement_areas:
        ForecastImprovementArea.objects.create(**row)

    print("Seeded budget validation tab data.")
    print("- summaries:", BudgetValidationSummary.objects.count())
    print("- validation records:", ForecastValidationRecord.objects.count())
    print("- alignment metrics:", BudgetAlignmentMetric.objects.count())
    print("- improvement areas:", ForecastImprovementArea.objects.count())


if __name__ == "__main__":
    seed_budget_validation_tab()
