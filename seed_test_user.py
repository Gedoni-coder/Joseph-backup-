#!/usr/bin/env python3
"""
Seed script to create a default test user for development.
This allows the frontend to auto-authenticate in dev mode.
"""
import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend_django.settings")
django.setup()

from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token

User = get_user_model()

# Create or get test user
test_email = "test@example.com"
test_password = "testuser123"

user, created = User.objects.get_or_create(
    username=test_email,
    defaults={
        'email': test_email,
        'first_name': 'Test',
        'last_name': 'User'
    }
)

if created:
    user.set_password(test_password)
    user.save()
    print(f"✓ Created test user: {test_email}")
else:
    print(f"✓ Test user already exists: {test_email}")

# Create or get auth token for this user
token, token_created = Token.objects.get_or_create(user=user)

if token_created:
    print(f"✓ Created auth token for test user")
else:
    print(f"✓ Auth token already exists for test user")

print(f"\n📝 TEST USER CREDENTIALS:")
print(f"   Email: {test_email}")
print(f"   Password: {test_password}")
print(f"   Auth Token: {token.key}")
print(f"\n💡 Use these credentials for manual testing if needed.")
