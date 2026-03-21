import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_django.settings')
django.setup()

from api.models import (
    CostOverviewMetric,
    CostBudgetScenario,
    CostMonthlyComparison,
    OperationalExpenseCategory,
    OperationalExpenseItem,
    CostTrendAnalysis,
    CashFlowForecast,
    CostStructure,
)


def seed_cost_overview() -> None:
    rows = [
        {
            'cost_type': 'fixed',
            'description': 'Rent, salaries, subscriptions, insurance',
            'annual_total': 3200000,
            'monthly_average': 267000,
            'percent_of_revenue': 23,
            'insight': 'Stable and predictable',
            'sort_order': 1,
        },
        {
            'cost_type': 'variable',
            'description': 'Raw materials, commissions, production costs',
            'annual_total': 5100000,
            'monthly_average': 425000,
            'percent_of_revenue': 37,
            'insight': 'Scales with revenue',
            'sort_order': 2,
        },
    ]
    CostOverviewMetric.objects.all().delete()
    CostOverviewMetric.objects.bulk_create(CostOverviewMetric(**row) for row in rows)


def seed_budget_scenarios() -> None:
    rows = [
        {'label': 'Budget 2025', 'amount': 8800000, 'subtitle': 'Target spending', 'note': '', 'sort_order': 1},
        {'label': 'Forecast 2025', 'amount': 8300000, 'subtitle': 'Projected spending', 'note': '', 'sort_order': 2},
        {'label': 'Variance', 'amount': 500000, 'subtitle': 'Under budget (5.7%)', 'note': '+$500K', 'sort_order': 3},
    ]
    CostBudgetScenario.objects.all().delete()
    CostBudgetScenario.objects.bulk_create(CostBudgetScenario(**row) for row in rows)


def seed_monthly_comparison() -> None:
    rows = [
        {'month': 'January', 'budget_amount': 750000, 'forecast_amount': 680000, 'actual_amount': 690000, 'sort_order': 1},
        {'month': 'February', 'budget_amount': 750000, 'forecast_amount': 720000, 'actual_amount': 750000, 'sort_order': 2},
        {'month': 'March', 'budget_amount': 750000, 'forecast_amount': 700000, 'actual_amount': 680000, 'sort_order': 3},
        {'month': 'April', 'budget_amount': 750000, 'forecast_amount': 710000, 'actual_amount': None, 'sort_order': 4},
    ]
    CostMonthlyComparison.objects.all().delete()
    CostMonthlyComparison.objects.bulk_create(CostMonthlyComparison(**row) for row in rows)


def seed_operational_expenses() -> None:
    category_rows = [
        {'name': 'Marketing & Sales', 'total_amount': 1250000, 'sort_order': 1},
        {'name': 'Research & Development', 'total_amount': 1250000, 'sort_order': 2},
        {'name': 'General & Administrative', 'total_amount': 920000, 'sort_order': 3},
        {'name': 'Forecasted COGS', 'total_amount': 4520000, 'sort_order': 4},
    ]
    items_by_category = {
        'Marketing & Sales': [
            {'name': 'Digital Marketing', 'amount': 480000, 'sort_order': 1},
            {'name': 'Sales Team Salaries', 'amount': 620000, 'sort_order': 2},
            {'name': 'Events & Conferences', 'amount': 150000, 'sort_order': 3},
        ],
        'Research & Development': [
            {'name': 'R&D Team Salaries', 'amount': 850000, 'sort_order': 1},
            {'name': 'Tools & Infrastructure', 'amount': 220000, 'sort_order': 2},
            {'name': 'Licenses & Software', 'amount': 180000, 'sort_order': 3},
        ],
        'General & Administrative': [
            {'name': 'Office Rent', 'amount': 360000, 'sort_order': 1},
            {'name': 'Admin Staff Salaries', 'amount': 420000, 'sort_order': 2},
            {'name': 'Utilities & Services', 'amount': 140000, 'sort_order': 3},
        ],
        'Forecasted COGS': [
            {'name': 'Raw Materials', 'amount': 2100000, 'sort_order': 1},
            {'name': 'Manufacturing', 'amount': 1800000, 'sort_order': 2},
            {'name': 'Shipping & Logistics', 'amount': 620000, 'sort_order': 3},
        ],
    }

    OperationalExpenseItem.objects.all().delete()
    OperationalExpenseCategory.objects.all().delete()

    for row in category_rows:
        category = OperationalExpenseCategory.objects.create(**row)
        OperationalExpenseItem.objects.bulk_create(
            OperationalExpenseItem(category=category, **item) for item in items_by_category[category.name]
        )


def seed_cost_trends() -> None:
    rows = [
        {
            'title': 'Cost Growth Rate',
            'value': '+4.2%',
            'description': 'YoY increase from 2024 to 2025',
            'benchmark': '',
            'bullet_points': [
                'Salary increases (+2%)',
                'Material cost inflation (+3%)',
                'Headcount expansion (+1.2%)',
            ],
            'sort_order': 1,
        },
        {
            'title': 'COGS as % of Revenue',
            'value': '37%',
            'description': 'Below industry average of 42%',
            'benchmark': '',
            'bullet_points': [
                'Potential 1-2% improvement',
                'Supplier optimization needed',
                'Process automation benefits',
            ],
            'sort_order': 2,
        },
    ]
    CostTrendAnalysis.objects.all().delete()
    CostTrendAnalysis.objects.bulk_create(CostTrendAnalysis(**row) for row in rows)


def seed_monthly_cash_flow_forecast() -> None:
    rows = [
        {'name': 'January', 'period': 'monthly', 'cash_inflow': 950000, 'cash_outflow': 690000, 'net_position': 260000},
        {'name': 'February', 'period': 'monthly', 'cash_inflow': 980000, 'cash_outflow': 750000, 'net_position': 230000},
        {'name': 'March', 'period': 'monthly', 'cash_inflow': 940000, 'cash_outflow': 680000, 'net_position': 260000},
        {'name': 'April', 'period': 'monthly', 'cash_inflow': 960000, 'cash_outflow': 710000, 'net_position': 250000},
    ]
    CashFlowForecast.objects.all().delete()
    CashFlowForecast.objects.bulk_create(CashFlowForecast(**row) for row in rows)


def seed_cost_structures() -> None:
    rows = [
        {'name': 'Rent', 'category': 'fixed', 'amount': 360000, 'period': 'annual', 'description': 'Office rent'},
        {'name': 'Salaries', 'category': 'fixed', 'amount': 1200000, 'period': 'annual', 'description': 'Staff salaries'},
        {'name': 'Subscriptions', 'category': 'fixed', 'amount': 120000, 'period': 'annual', 'description': 'Software subscriptions'},
        {'name': 'Insurance', 'category': 'fixed', 'amount': 90000, 'period': 'annual', 'description': 'Business insurance'},
        {'name': 'Raw Materials', 'category': 'variable', 'amount': 2100000, 'period': 'annual', 'description': 'Material procurement'},
        {'name': 'Commissions', 'category': 'variable', 'amount': 750000, 'period': 'annual', 'description': 'Sales commissions'},
        {'name': 'Production Costs', 'category': 'variable', 'amount': 2250000, 'period': 'annual', 'description': 'Manufacturing and variable operations'},
    ]
    CostStructure.objects.all().delete()
    CostStructure.objects.bulk_create(CostStructure(**row) for row in rows)


def main() -> None:
    seed_cost_overview()
    seed_budget_scenarios()
    seed_monthly_comparison()
    seed_operational_expenses()
    seed_cost_trends()
    seed_monthly_cash_flow_forecast()
    seed_cost_structures()

    print('Cost tab data seeded:')
    print('- cost_overview_metrics:', CostOverviewMetric.objects.count())
    print('- cost_budget_scenarios:', CostBudgetScenario.objects.count())
    print('- cost_monthly_comparisons:', CostMonthlyComparison.objects.count())
    print('- operational_expense_categories:', OperationalExpenseCategory.objects.count())
    print('- operational_expense_items:', OperationalExpenseItem.objects.count())
    print('- cost_trend_analyses:', CostTrendAnalysis.objects.count())
    print('- cash_flow_forecasts:', CashFlowForecast.objects.count())
    print('- cost_structures:', CostStructure.objects.count())


if __name__ == '__main__':
    main()
