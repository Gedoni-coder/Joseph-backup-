#!/usr/bin/env python
import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_django.settings')
django.setup()

from api.models import AdviceMessage, User

user = User.objects.filter(email='test@example.com').first()
if user:
    # Create advice messages
    advice_items = [
        ('Financial Advisory', 'calculator', 'Optimize Cash Flow Strategy', 
         'Review working capital management. Current cash conversion cycle is 45 days - target is 30 days.'),
        ('Financial Advisory', 'trending-up', 'Revenue Growth Opportunity', 
         'Implement price elasticity analysis for high-margin products. Potential revenue lift: 8-12%.'),
        ('Business Forecast', 'target', 'Budget Variance Alert', 
         'Q2 variance trending toward 5%. Recommend reforecasting for Q3-Q4 planning.'),
        ('Pricing Strategy', 'shield', 'Competitive Risk Assessment', 
         'Two new competitors entered market. Monitor pricing 15% below our average.'),
        ('Supply Chain', 'lightbulb', 'Supplier Consolidation Opportunity', 
         'Current 47 suppliers. Consolidate to top 12 can reduce procurement costs by 12%.'),
    ]
    
    created = 0
    for module_name, module_icon, title, content in advice_items:
        advice = AdviceMessage(
            user=user,
            module_name=module_name,
            module_icon=module_icon,
            title=title,
            content=content,
            is_read=False
        )
        advice.save()
        created += 1
        print(f"✓ Created advice: {title}")
    
    print(f"\n✓ Total created: {created} advice messages")
else:
    print("✗ User not found")
