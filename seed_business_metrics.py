#!/usr/bin/env python3
import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend_django.settings")
django.setup()

from business_forecast.models import BusinessMetric
from django.contrib.auth import get_user_model
from api.models import (
    BusinessMetric as ApiBusinessMetric,
    OverviewAlert,
    OverviewKpiSummary,
    OverviewProfitLossSnapshot,
)

User = get_user_model()
user = User.objects.order_by("id").first()

BusinessMetric.objects.all().delete()

if not user:
    raise SystemExit("No user found. Create a user first, then rerun this script.")

ApiBusinessMetric.objects.filter(user=user).delete()
OverviewProfitLossSnapshot.objects.filter(user=user).delete()
OverviewKpiSummary.objects.filter(user=user).delete()
OverviewAlert.objects.filter(user=user).delete()

data = [
    {"category": "Financial", "metric": "Revenue / Sales Growth", "current": "22.5%", "target": "25%", "last_month": "18.3%", "change": "+23.0%", "status": "good"},
    {"category": "Financial", "metric": "Net Profit Margin", "current": "18.5%", "target": "20%", "last_month": "17.2%", "change": "+7.6%", "status": "good"},
    {"category": "Financial", "metric": "Gross Profit Margin", "current": "62%", "target": "65%", "last_month": "60.5%", "change": "+2.5%", "status": "good"},
    {"category": "Financial", "metric": "Operating Cash Flow", "current": "$2.8M", "target": "$3.2M", "last_month": "$2.6M", "change": "+7.2%", "status": "good"},
    {"category": "Financial", "metric": "Return on Investment (ROI)", "current": "35.8%", "target": "40%", "last_month": "32.1%", "change": "+11.5%", "status": "good"},
    {"category": "Financial", "metric": "Accounts Receivable Turnover", "current": "8.2 times", "target": "9 times", "last_month": "7.8 times", "change": "+5.1%", "status": "good"},
    {"category": "Financial", "metric": "Accounts Payable Turnover", "current": "6.5 times", "target": "7 times", "last_month": "6.1 times", "change": "+6.6%", "status": "good"},
    {"category": "Financial", "metric": "Budget Variance", "current": "2.8%", "target": "2%", "last_month": "3.5%", "change": "-20.0%", "status": "fair"},

    {"category": "Customer", "metric": "Customer Acquisition Cost (CAC)", "current": "$285", "target": "$250", "last_month": "$295", "change": "-3.4%", "status": "fair"},
    {"category": "Customer", "metric": "Customer Lifetime Value (CLV)", "current": "$4K", "target": "$5K", "last_month": "$4K", "change": "+3.7%", "status": "good"},
    {"category": "Customer", "metric": "Net Promoter Score (NPS)", "current": "52 points", "target": "60 points", "last_month": "48 points", "change": "+8.3%", "status": "good"},
    {"category": "Customer", "metric": "Customer Retention Rate", "current": "91.5%", "target": "95%", "last_month": "89.8%", "change": "+1.9%", "status": "good"},
    {"category": "Customer", "metric": "Churn Rate", "current": "2.1%", "target": "1.5%", "last_month": "2.3%", "change": "-8.7%", "status": "fair"},
    {"category": "Customer", "metric": "Average Response Time", "current": "4.2 hours", "target": "2 hours", "last_month": "4.8 hours", "change": "-12.5%", "status": "fair"},

    {"category": "Sales & Marketing", "metric": "Leads Generated", "current": "1240", "target": "1500", "last_month": "1085", "change": "+14.3%", "status": "good"},
    {"category": "Sales & Marketing", "metric": "Lead Conversion Rate", "current": "8.5%", "target": "10%", "last_month": "7.8%", "change": "+9.0%", "status": "good"},
    {"category": "Sales & Marketing", "metric": "Sales Growth Rate", "current": "22.5%", "target": "25%", "last_month": "18.3%", "change": "+23.0%", "status": "good"},
    {"category": "Sales & Marketing", "metric": "Marketing ROI", "current": "380%", "target": "450%", "last_month": "340%", "change": "+11.8%", "status": "good"},
    {"category": "Sales & Marketing", "metric": "Website Traffic", "current": "48,500 visits", "target": "60,000 visits", "last_month": "42,300 visits", "change": "+14.6%", "status": "good"},
    {"category": "Sales & Marketing", "metric": "Website Conversion Rate", "current": "3.2%", "target": "4%", "last_month": "2.9%", "change": "+10.3%", "status": "good"},
    {"category": "Sales & Marketing", "metric": "Cost Per Lead", "current": "$85", "target": "$75", "last_month": "$92", "change": "-7.6%", "status": "fair"},
    {"category": "Sales & Marketing", "metric": "Sales Pipeline Coverage", "current": "3.8 ratio", "target": "4 ratio", "last_month": "3.5 ratio", "change": "+8.6%", "status": "good"},

    {"category": "Operational", "metric": "Cycle Time", "current": "6.2 days", "target": "5 days", "last_month": "6.8 days", "change": "-8.8%", "status": "fair"},
    {"category": "Operational", "metric": "Order Fulfillment Time", "current": "3.5 days", "target": "2.5 days", "last_month": "3.8 days", "change": "-7.9%", "status": "fair"},
    {"category": "Operational", "metric": "Inventory Turnover Rate", "current": "4.2 times", "target": "5 times", "last_month": "3.9 times", "change": "+7.7%", "status": "good"},
    {"category": "Operational", "metric": "Manufacturing Defect Rate", "current": "1.2%", "target": "0.8%", "last_month": "1.5%", "change": "-20.0%", "status": "fair"},
    {"category": "Operational", "metric": "On-Time Delivery Rate", "current": "94.5%", "target": "98%", "last_month": "92.1%", "change": "+2.6%", "status": "good"},
    {"category": "Operational", "metric": "Process Downtime", "current": "1.8%", "target": "0.5%", "last_month": "2.1%", "change": "-14.3%", "status": "fair"},
    {"category": "Operational", "metric": "Quality Score", "current": "94.2%", "target": "97%", "last_month": "92.8%", "change": "+1.5%", "status": "good"},

    {"category": "HR & Employee", "metric": "Employee Turnover Rate", "current": "8.5%", "target": "5%", "last_month": "9.2%", "change": "-7.6%", "status": "fair"},
    {"category": "HR & Employee", "metric": "Employee Engagement Score", "current": "72 points", "target": "80 points", "last_month": "68 points", "change": "+5.9%", "status": "good"},
    {"category": "HR & Employee", "metric": "Average Time to Hire", "current": "32 days", "target": "25 days", "last_month": "35 days", "change": "-8.6%", "status": "fair"},
    {"category": "HR & Employee", "metric": "Training Completion Rate", "current": "82.5%", "target": "95%", "last_month": "78.3%", "change": "+5.4%", "status": "good"},
    {"category": "HR & Employee", "metric": "Absenteeism Rate", "current": "3.2%", "target": "2%", "last_month": "3.5%", "change": "-8.6%", "status": "fair"},
    {"category": "HR & Employee", "metric": "Revenue per Employee", "current": "$385K", "target": "$420K", "last_month": "$370K", "change": "+4.1%", "status": "good"},

    {"category": "Project & Product", "metric": "Project Completion Rate", "current": "88.5%", "target": "95%", "last_month": "85.2%", "change": "+3.9%", "status": "good"},
    {"category": "Project & Product", "metric": "On-Time Project Delivery", "current": "82%", "target": "90%", "last_month": "78.5%", "change": "+4.5%", "status": "good"},
    {"category": "Project & Product", "metric": "Product Defect Rate", "current": "0.8%", "target": "0.5%", "last_month": "1%", "change": "-20.0%", "status": "fair"},
    {"category": "Project & Product", "metric": "Feature Adoption Rate", "current": "68.5%", "target": "75%", "last_month": "64.2%", "change": "+6.7%", "status": "good"},
    {"category": "Project & Product", "metric": "Time to Market", "current": "5.2 months", "target": "4 months", "last_month": "5.8 months", "change": "-10.3%", "status": "fair"},
    {"category": "Project & Product", "metric": "Budget vs Actual (Project)", "current": "2.5%", "target": "2%", "last_month": "3.2%", "change": "-21.9%", "status": "good"},

    {"category": "Innovation & Growth", "metric": "New Product Revenue %", "current": "18.5%", "target": "22%", "last_month": "16.2%", "change": "+14.2%", "status": "good"},
    {"category": "Innovation & Growth", "metric": "R&D Spending vs Revenue", "current": "8.5%", "target": "10%", "last_month": "7.9%", "change": "+7.6%", "status": "good"},
    {"category": "Innovation & Growth", "metric": "Market Share Growth", "current": "3.8%", "target": "5%", "last_month": "3.2%", "change": "+18.8%", "status": "good"},
    {"category": "Innovation & Growth", "metric": "Patents / Innovations", "current": "7", "target": "10", "last_month": "6", "change": "+16.7%", "status": "good"},
    {"category": "Innovation & Growth", "metric": "Expansion into New Markets", "current": "2", "target": "3", "last_month": "1", "change": "+100.0%", "status": "excellent"},
    {"category": "Innovation & Growth", "metric": "Year-over-Year Growth Rate", "current": "22.5%", "target": "25%", "last_month": "18.3%", "change": "+23.0%", "status": "good"},

    {"category": "Digital & IT", "metric": "Website / App Traffic", "current": "48,500 visits", "target": "60,000 visits", "last_month": "42,300 visits", "change": "+14.6%", "status": "good"},
    {"category": "Digital & IT", "metric": "System Uptime", "current": "99.85%", "target": "99.95%", "last_month": "99.72%", "change": "+0.1%", "status": "good"},
    {"category": "Digital & IT", "metric": "Cybersecurity Incidents", "current": "2", "target": "0", "last_month": "3", "change": "-33.3%", "status": "fair"},
    {"category": "Digital & IT", "metric": "Data Accuracy / Quality", "current": "97.2%", "target": "99%", "last_month": "96.5%", "change": "+0.7%", "status": "good"},
    {"category": "Digital & IT", "metric": "IT Cost per User", "current": "$125", "target": "$110", "last_month": "$132", "change": "-5.3%", "status": "fair"},
    {"category": "Digital & IT", "metric": "Mobile App Engagement", "current": "62.5%", "target": "70%", "last_month": "58.3%", "change": "+7.2%", "status": "good"},
]

for row in data:
    trend = "up" if row["change"].startswith("+") else "down"
    BusinessMetric.objects.create(**row, trend=trend)
    ApiBusinessMetric.objects.create(user=user, **row, trend=trend)

OverviewProfitLossSnapshot.objects.create(
    user=user,
    gross_profit=665000,
    gross_margin=62.0,
    operating_expense=410000,
    net_profit=255000,
    net_margin=23.8,
)

OverviewKpiSummary.objects.create(
    user=user,
    metrics_tracked=48,
    excellent_count=6,
    good_count=30,
    fair_count=10,
    needs_attention_count=2,
)

overview_alerts = [
    {
        "alert_type": "warning",
        "title": "Cost Increase Alert",
        "description": "COGS increased by 8.5% this quarter, impacting gross margins.",
    },
    {
        "alert_type": "warning",
        "title": "Cash Flow Risk",
        "description": "April projected net cash flow is negative due to planned inventory purchase.",
    },
    {
        "alert_type": "info",
        "title": "Revenue Momentum",
        "description": "Q1 revenue exceeded target by 4.2% across core product lines.",
    },
]

for alert in overview_alerts:
    OverviewAlert.objects.create(user=user, **alert)

print(f"Seeded {len(data)} business metrics in business_forecast and api_businessmetric for user '{user.username}'.")
print("Seeded overview profit/loss snapshot, KPI summary, and alerts.")
