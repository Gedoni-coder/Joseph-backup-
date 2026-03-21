#!/usr/bin/env python
import os
import django
from decimal import Decimal

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_django.settings')
django.setup()

from api.models import Competitor

competitors = [
    {
        "name": "Jumia",
        "description": "Pan-African e-commerce marketplace and fintech ecosystem",
        "competitor_type": "direct",
        "market_position": "premium",
        "pricing_model": "Marketplace Commission",
        "pricing_summary": "15% Commission",
        "current_price": Decimal("15.50"),
        "market_share": 32.5,
        "strengths": "Pan-African Reach; JumiaPay Integration; Logistics Network",
        "weaknesses": "High operational costs in fragmented logistics regions",
        "feature_highlights": [
            "15% Commission",
            "Pan-African Reach",
            "JumiaPay Integration",
            "Logistics Network"
        ],
        "website": "https://www.jumia.com",
        "headquarters": "Lagos, Nigeria",
        "key_products": ["Marketplace", "JumiaPay", "Logistics"],
        "target_markets": ["Nigeria", "Kenya", "Egypt", "Ghana"],
    },
    {
        "name": "Konga",
        "description": "Nigerian-focused marketplace with payments and logistics services",
        "competitor_type": "direct",
        "market_position": "mid-market",
        "pricing_model": "Seller Fees",
        "pricing_summary": "12-15% Commission",
        "current_price": Decimal("12.80"),
        "market_share": 18.7,
        "strengths": "Nigerian Focus; KongaPay; Trusted Brand",
        "weaknesses": "Smaller geographic footprint compared to regional rivals",
        "feature_highlights": [
            "12-15% Commission",
            "Nigerian Focus",
            "KongaPay",
            "Trusted Brand"
        ],
        "website": "https://www.konga.com",
        "headquarters": "Lagos, Nigeria",
        "key_products": ["Marketplace", "KongaPay", "Delivery"],
        "target_markets": ["Nigeria"],
    },
    {
        "name": "Temu",
        "description": "Low-cost social commerce marketplace with direct sourcing model",
        "competitor_type": "direct",
        "market_position": "budget",
        "pricing_model": "Marketplace Fees",
        "pricing_summary": "Ultra-Low Fees",
        "current_price": Decimal("8.50"),
        "market_share": 15.8,
        "strengths": "Direct China Sourcing; Social Commerce; Free Shipping Threshold",
        "weaknesses": "Perceived quality inconsistency and variable delivery times",
        "feature_highlights": [
            "Ultra-Low Fees",
            "Direct China Sourcing",
            "Social Commerce",
            "Free Shipping Threshold"
        ],
        "website": "https://www.temu.com",
        "headquarters": "Boston, USA",
        "key_products": ["Marketplace", "Social Commerce", "Cross-border Logistics"],
        "target_markets": ["Global"],
    },
    {
        "name": "Amazon",
        "description": "Global marketplace with integrated logistics and subscription ecosystem",
        "competitor_type": "direct",
        "market_position": "premium",
        "pricing_model": "Referral & FBA Fees",
        "pricing_summary": "15-20% Referral Fee",
        "current_price": Decimal("20.20"),
        "market_share": 12.3,
        "strengths": "FBA Services; Prime Benefits; Global Reach",
        "weaknesses": "Higher fee complexity for SMB sellers",
        "feature_highlights": [
            "15-20% Referral Fee",
            "FBA Services",
            "Prime Benefits",
            "Global Reach"
        ],
        "website": "https://www.amazon.com",
        "headquarters": "Seattle, USA",
        "key_products": ["Marketplace", "FBA", "Prime"],
        "target_markets": ["Global"],
    },
]

for item in competitors:
    Competitor.objects.update_or_create(name=item["name"], defaults=item)

print(f"Seeded {len(competitors)} competitive pricing competitors")
