#!/usr/bin/env python
import os
import django
from decimal import Decimal

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_django.settings')
django.setup()

from api.models import PricingItem, PricingStrategy, PricingTest

def seed_pricing_data():
    """Seed the database with pricing items, strategies, and tests"""
    
    # Clear existing data
    PricingItem.objects.all().delete()
    PricingStrategy.objects.all().delete()
    PricingTest.objects.all().delete()
    
    # Create Pricing Items
    pricing_items = [
        {
            'name': 'Coca Cola',
            'price': Decimal('156.78'),
            'elasticity': Decimal('-1.20'),
            'elasticity_change': Decimal('-0.20'),
            'elasticity_period': 'Q3 2024',
            'competitive_score': Decimal('94.2'),
            'competitive_change': Decimal('2.80'),
            'competitive_period': 'This quarter',
            'acceptance_rate': Decimal('78.5'),
            'acceptance_change': Decimal('-1.20'),
            'acceptance_period': 'Last 7 days',
        },
        {
            'name': 'Pepsi',
            'price': Decimal('148.50'),
            'elasticity': Decimal('-0.80'),
            'elasticity_change': Decimal('0.50'),
            'elasticity_period': 'Q3 2024',
            'competitive_score': Decimal('88.7'),
            'competitive_change': Decimal('1.50'),
            'competitive_period': 'This quarter',
            'acceptance_rate': Decimal('82.3'),
            'acceptance_change': Decimal('2.10'),
            'acceptance_period': 'Last 7 days',
        },
        {
            'name': 'Fanta',
            'price': Decimal('162.25'),
            'elasticity': Decimal('-1.50'),
            'elasticity_change': Decimal('-0.80'),
            'elasticity_period': 'Q3 2024',
            'competitive_score': Decimal('91.5'),
            'competitive_change': Decimal('0.90'),
            'competitive_period': 'This quarter',
            'acceptance_rate': Decimal('75.2'),
            'acceptance_change': Decimal('-2.30'),
            'acceptance_period': 'Last 7 days',
        },
    ]
    
    for item_data in pricing_items:
        item = PricingItem.objects.create(**item_data)
        print(f"✓ Created Pricing Item: {item.name}")
    
    # Create Pricing Strategies
    strategies = [
        {
            'name': 'Premium Software License',
            'strategy_type': 'value-based',
            'suggested_price': Decimal('349.00'),
            'confidence': 87,
            'description': 'Value-based pricing for premium features',
            'is_active': True,
        },
        {
            'name': 'Mobile App Pro',
            'strategy_type': 'tiered',
            'suggested_price': Decimal('12.99'),
            'confidence': 74,
            'description': 'Tiered pricing model for app subscriptions',
            'is_active': True,
        },
        {
            'name': 'Cloud Storage Service',
            'strategy_type': 'dynamic',
            'suggested_price': Decimal('22.99'),
            'confidence': 91,
            'description': 'Dynamic pricing based on demand',
            'is_active': True,
        },
    ]
    
    for strategy_data in strategies:
        strategy = PricingStrategy.objects.create(**strategy_data)
        print(f"✓ Created Pricing Strategy: {strategy.name}")
    
    # Create Pricing Tests
    tests = [
        {
            'name': 'Premium Tier Price Optimization',
            'test_type': 'a-b',
            'status': 'running',
            'confidence': 73,
            'description': 'A/B testing premium tier pricing',
            'variant_count': 2,
            'sample_size': 5000,
        },
        {
            'name': 'Bundle Pricing Experiment',
            'test_type': 'multivariate',
            'status': 'running',
            'confidence': 68,
            'description': 'Testing bundle pricing combinations',
            'variant_count': 4,
            'sample_size': 8000,
        },
        {
            'name': 'Discount Strategy Test',
            'test_type': 'split',
            'status': 'completed',
            'confidence': 92,
            'description': 'Split test for discount strategies',
            'variant_count': 2,
            'sample_size': 10000,
        },
    ]
    
    for test_data in tests:
        if 'description' in test_data:
            test_data.pop('description')
        test = PricingTest.objects.create(**test_data)
        print(f"✓ Created Pricing Test: {test.name}")
    
    print(f"\n✓ Successfully seeded {PricingItem.objects.count()} pricing items")
    print(f"✓ Successfully seeded {PricingStrategy.objects.count()} pricing strategies")
    print(f"✓ Successfully seeded {PricingTest.objects.count()} pricing tests")

if __name__ == '__main__':
    seed_pricing_data()
    print("\nData seeding complete!")
