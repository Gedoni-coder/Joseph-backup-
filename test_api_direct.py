#!/usr/bin/env python
import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_django.settings')
django.setup()

from django.contrib.auth import get_user_model
from rest_framework.test import APIRequestFactory, force_authenticate
from api.views import NotificationViewSet
from api.models import Notification

User = get_user_model()
user = User.objects.filter(email='test@example.com').first()

if user:
    print(f"✓ Found user: {user.email}")
    
    # Test API endpoint
    factory = APIRequestFactory()
    request = factory.get('/api/notifications/messages/')
    force_authenticate(request, user=user)
    
    view = NotificationViewSet.as_view({'get': 'list'})
    response = view(request)
    
    print(f"✓ API Status: {response.status_code}")
    print(f"✓ Response data type: {type(response.data)}")
    
    if hasattr(response, 'data'):
        if isinstance(response.data, list):
            print(f"✓ Returned {len(response.data)} items")
            if response.data:
                print(f"\nFirst notification:")
                for key, val in response.data[0].items():
                    print(f"  {key}: {val}")
        elif isinstance(response.data, dict) and 'results' in response.data:
            print(f"✓ Returned {len(response.data['results'])} items (paginated)")
            if response.data['results']:
                print(f"\nFirst notification:")
                for key, val in response.data['results'][0].items():
                    print(f"  {key}: {val}")
        else:
            print(f"Unexpected data format: {response.data}")
    else:
        print("✗ No data attribute in response")
else:
    print("✗ User not found")

# Also check unread count
print("\n--- Testing unread count endpoint ---")
request2 = factory.get('/api/notifications/messages/unread_count/')
force_authenticate(request2, user=user)
view2 = NotificationViewSet.as_view({'get': 'unread_count'})
response2 = view2(request2)
print(f"✓ Unread count API Status: {response2.status_code}")
print(f"✓ Unread count response: {response2.data}")
