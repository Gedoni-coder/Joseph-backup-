#!/usr/bin/env python3
import os
import django
import sqlite3

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend_django.settings")
django.setup()

from api.models import FinancialLineItem, RiskAssessment, ScenarioTest
from business_forecast.models import BusinessMetric

print("Database Summary:")
print(f"  FinancialLineItem: {FinancialLineItem.objects.count()} rows")
print(f"  RiskAssessment: {RiskAssessment.objects.count()} rows")
print(f"  ScenarioTest: {ScenarioTest.objects.count()} rows")
print(f"  BusinessMetric: {BusinessMetric.objects.count()} rows")

# Check if we have at least one user
from django.contrib.auth import get_user_model
User = get_user_model()
print(f"\nUsers: {User.objects.count()}")
for user in User.objects.all()[:3]:
    print(f"  - {user.email} (id={user.id})")
