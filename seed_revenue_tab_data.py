import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_django.settings')
django.setup()

from api.models import (
    GrowthTrajectory,
    RevenueProductServiceForecast,
    RevenueRegionalForecast,
    RevenueHistoricalComparison,
    RevenueForecastMethod,
    RevenueScenarioSnapshot,
    RevenueSegmentBreakdown,
)


def seed_growth_trajectory() -> None:
    rows = [
        {"quarter": "Q1 2025", "description": "Foundation building phase", "revenue_target": 3000000},
        {"quarter": "Q2 2025", "description": "Accelerated growth period", "revenue_target": 3300000},
        {"quarter": "Q3 2025", "description": "Market expansion phase", "revenue_target": 3600000},
        {"quarter": "Q4 2025", "description": "Optimization and scaling", "revenue_target": 3800000},
    ]
    GrowthTrajectory.objects.all().delete()
    GrowthTrajectory.objects.bulk_create(GrowthTrajectory(**row) for row in rows)


def seed_product_service_forecasts() -> None:
    rows = [
        {"name": "Core Platform", "projection_year": 2025, "projected_revenue": 5200000, "growth_rate": 18, "market_share": 42, "sort_order": 1},
        {"name": "Premium Tier", "projection_year": 2025, "projected_revenue": 3100000, "growth_rate": 28, "market_share": 25, "sort_order": 2},
        {"name": "Professional Services", "projection_year": 2025, "projected_revenue": 2800000, "growth_rate": 22, "market_share": 23, "sort_order": 3},
        {"name": "Support & Maintenance", "projection_year": 2025, "projected_revenue": 2600000, "growth_rate": 15, "market_share": 10, "sort_order": 4},
    ]
    RevenueProductServiceForecast.objects.all().delete()
    RevenueProductServiceForecast.objects.bulk_create(RevenueProductServiceForecast(**row) for row in rows)


def seed_regional_forecasts() -> None:
    rows = [
        {"region": "North America", "projected_revenue": 6500000, "revenue_share": 52, "growth_rate": 14, "sort_order": 1},
        {"region": "Europe", "projected_revenue": 3800000, "revenue_share": 30, "growth_rate": 22, "sort_order": 2},
        {"region": "Asia-Pacific", "projected_revenue": 2400000, "revenue_share": 18, "growth_rate": 38, "sort_order": 3},
    ]
    RevenueRegionalForecast.objects.all().delete()
    RevenueRegionalForecast.objects.bulk_create(RevenueRegionalForecast(**row) for row in rows)


def seed_historical_comparison() -> None:
    rows = [
        {
            "label": "2024 Performance",
            "total_revenue": 11200000,
            "growth_percent": 16,
            "growth_label": "YoY Growth",
            "supporting_metric_label": "Q4 Actual",
            "supporting_metric_value": "$3.1M",
            "sort_order": 1,
        },
        {
            "label": "2025 Projection",
            "total_revenue": 13700000,
            "growth_percent": 22,
            "growth_label": "Projected Growth",
            "supporting_metric_label": "Confidence Level",
            "supporting_metric_value": "80%",
            "sort_order": 2,
        },
    ]
    RevenueHistoricalComparison.objects.all().delete()
    RevenueHistoricalComparison.objects.bulk_create(RevenueHistoricalComparison(**row) for row in rows)


def seed_forecasting_methods() -> None:
    rows = [
        {
            "name": "Linear Regression",
            "description": "Baseline trend assuming steady growth",
            "projected_revenue": 13200000,
            "metric_label": "R^2 Score",
            "metric_value": "0.92",
            "sort_order": 1,
        },
        {
            "name": "Moving Average (12-Month)",
            "description": "Smoothed trend accounting for seasonality",
            "projected_revenue": 13500000,
            "metric_label": "Trend Direction",
            "metric_value": "Up",
            "sort_order": 2,
        },
        {
            "name": "Exponential Smoothing",
            "description": "Recent data weighted more heavily",
            "projected_revenue": 13900000,
            "metric_label": "alpha Parameter",
            "metric_value": "0.15",
            "sort_order": 3,
        },
        {
            "name": "AI-Based Prediction",
            "description": "Machine learning model incorporating market factors",
            "projected_revenue": 14100000,
            "metric_label": "Model Accuracy",
            "metric_value": "87%",
            "sort_order": 4,
        },
    ]
    RevenueForecastMethod.objects.all().delete()
    RevenueForecastMethod.objects.bulk_create(RevenueForecastMethod(**row) for row in rows)


def seed_scenario_snapshot() -> None:
    rows = [
        {
            "scenario": "Worst Case",
            "probability": 25,
            "annual_revenue": 11800000,
            "operating_costs": 9800000,
            "net_profit": 2000000,
            "key_assumptions": ["Market slowdown", "Increased competition", "Customer churn"],
            "sort_order": 1,
        }
    ]
    RevenueScenarioSnapshot.objects.all().delete()
    RevenueScenarioSnapshot.objects.bulk_create(RevenueScenarioSnapshot(**row) for row in rows)


def seed_segment_breakdowns() -> None:
    rows = [
        {
            "segment": "Enterprise",
            "revenue": 2000000,
            "percentage_of_total": 45,
            "growth_rate": 28,
            "customer_count": 12,
            "sort_order": 1,
        },
        {
            "segment": "SMB",
            "revenue": 300000,
            "percentage_of_total": 6,
            "growth_rate": 15,
            "customer_count": 87,
            "sort_order": 2,
        },
    ]
    RevenueSegmentBreakdown.objects.all().delete()
    RevenueSegmentBreakdown.objects.bulk_create(RevenueSegmentBreakdown(**row) for row in rows)


def main() -> None:
    seed_growth_trajectory()
    seed_product_service_forecasts()
    seed_regional_forecasts()
    seed_historical_comparison()
    seed_forecasting_methods()
    seed_scenario_snapshot()
    seed_segment_breakdowns()

    print("Revenue tab data seeded:")
    print("- growth_trajectories:", GrowthTrajectory.objects.count())
    print("- revenue_product_service_forecasts:", RevenueProductServiceForecast.objects.count())
    print("- revenue_regional_forecasts:", RevenueRegionalForecast.objects.count())
    print("- revenue_historical_comparisons:", RevenueHistoricalComparison.objects.count())
    print("- revenue_forecast_methods:", RevenueForecastMethod.objects.count())
    print("- revenue_scenario_snapshots:", RevenueScenarioSnapshot.objects.count())
    print("- revenue_segment_breakdowns:", RevenueSegmentBreakdown.objects.count())


if __name__ == '__main__':
    main()
