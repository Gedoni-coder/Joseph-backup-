#!/usr/bin/env python
"""Seed Pricing Strategies with complete data including business metrics"""
import os
import django
from decimal import Decimal

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_django.settings')
django.setup()

from api.models import PricingStrategy

# Clear existing strategies
PricingStrategy.objects.all().delete()

pricing_strategies = [
    {
        "name": "Premium Software License",
        "strategy_type": "value-based",
        "description": "Enterprise software pricing based on value delivered to customers",
        "current_price": Decimal("299.00"),
        "suggested_price": Decimal("349.00"),
        "confidence": 87,
        "expected_revenue": Decimal("2.8"),  # in millions
        "market_share": Decimal("23.5"),  # percentage
        "margin": Decimal("68.2"),  # percentage
        "is_active": True,
    },
    {
        "name": "Mobile App Pro",
        "strategy_type": "tiered",
        "description": "Freemium model with multiple subscription tiers",
        "current_price": Decimal("9.99"),
        "suggested_price": Decimal("12.99"),
        "confidence": 74,
        "expected_revenue": Decimal("0.5"),
        "market_share": Decimal("15.8"),
        "margin": Decimal("82.1"),
        "is_active": True,
    },
    {
        "name": "Cloud Storage Service",
        "strategy_type": "dynamic",
        "description": "AI-driven pricing based on demand and usage patterns",
        "current_price": Decimal("19.99"),
        "suggested_price": Decimal("22.99"),
        "confidence": 91,
        "expected_revenue": Decimal("1.6"),
        "market_share": Decimal("31.2"),
        "margin": Decimal("45.6"),
        "is_active": True,
    },
    {
        "name": "Professional Consulting",
        "strategy_type": "discrimination",
        "description": "Segment-based pricing for different customer types",
        "current_price": Decimal("150.00"),
        "suggested_price": Decimal("175.00"),
        "confidence": 82,
        "expected_revenue": Decimal("0.9"),
        "market_share": Decimal("18.4"),
        "margin": Decimal("55.8"),
        "is_active": True,
    },
]

for strategy_data in pricing_strategies:
    strategy = PricingStrategy.objects.create(**strategy_data)
    print(f"✓ Created {strategy.name} ({strategy.strategy_type})")
    print(f"  Current Price: ${strategy.current_price}")
    print(f"  Suggested Price: ${strategy.suggested_price} (Confidence: {strategy.confidence}%)")
    print(f"  Expected Revenue: ${strategy.expected_revenue}M")
    print(f"  Market Share: {strategy.market_share}%")
    print(f"  Margin: {strategy.margin}%")

print(f"\n✓ Successfully seeded {PricingStrategy.objects.count()} pricing strategies")
