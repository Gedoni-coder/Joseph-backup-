#!/usr/bin/env python3
import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend_django.settings")
django.setup()

from django.contrib.auth import get_user_model
from api.models import FinancialLineItem

User = get_user_model()

# Update this username if you want to seed data for a specific account.
USERNAME = os.environ.get("SEED_USERNAME", "")

line_items = [
    {"category": "Revenue", "item": "Product Sales", "current_amount": 8500000, "budget_amount": 8200000, "last_year_amount": 7800000, "sort_order": 1},
    {"category": "Revenue", "item": "Service Revenue", "current_amount": 3200000, "budget_amount": 3100000, "last_year_amount": 2900000, "sort_order": 2},
    {"category": "Revenue", "item": "Licensing & Royalties", "current_amount": 2000000, "budget_amount": 1900000, "last_year_amount": 1800000, "sort_order": 3},
    {"category": "Expenses", "item": "Cost of Goods Sold", "current_amount": 4200000, "budget_amount": 4100000, "last_year_amount": 3900000, "sort_order": 1},
    {"category": "Expenses", "item": "Sales & Marketing", "current_amount": 2100000, "budget_amount": 2200000, "last_year_amount": 1900000, "sort_order": 2},
    {"category": "Expenses", "item": "R&D", "current_amount": 1800000, "budget_amount": 1800000, "last_year_amount": 1600000, "sort_order": 3},
    {"category": "Expenses", "item": "General & Administrative", "current_amount": 1100000, "budget_amount": 1100000, "last_year_amount": 980000, "sort_order": 4},
    {"category": "Assets", "item": "Cash & Cash Equivalents", "current_amount": 5200000, "budget_amount": 4800000, "last_year_amount": 4500000, "sort_order": 1},
    {"category": "Assets", "item": "Accounts Receivable", "current_amount": 3800000, "budget_amount": 3600000, "last_year_amount": 3200000, "sort_order": 2},
    {"category": "Assets", "item": "Inventory", "current_amount": 2100000, "budget_amount": 2200000, "last_year_amount": 1900000, "sort_order": 3},
    {"category": "Assets", "item": "Property, Plant & Equipment", "current_amount": 5600000, "budget_amount": 5500000, "last_year_amount": 5200000, "sort_order": 4},
]

if USERNAME:
    user = User.objects.filter(username=USERNAME).first()
else:
    user = User.objects.order_by("id").first()

if not user:
    raise SystemExit("No user found. Create a user first, then rerun this script.")

FinancialLineItem.objects.filter(user=user).delete()

for row in line_items:
    FinancialLineItem.objects.create(user=user, unit="USD", period="annual", **row)

print(f"Seeded {len(line_items)} financial line items for user '{user.username}'.")
