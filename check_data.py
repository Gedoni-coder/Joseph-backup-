#!/usr/bin/env python
import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_django.settings')
django.setup()

from api.models import AdviceMessage, Notification

print("=== NOTIFICATIONS ===")
notifs = Notification.objects.all()
for n in notifs:
    print(f"  ✓ {n.subject} (read: {n.is_read})")
print(f"Total: {notifs.count()}")

print("\n=== ADVICE MESSAGES ===")
advice = AdviceMessage.objects.all()
for a in advice:
    print(f"  ✓ {a.module_name}: {a.title} (read: {a.is_read})")
print(f"Total: {advice.count()}")
