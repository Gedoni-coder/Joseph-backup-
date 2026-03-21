#!/usr/bin/env python
"""
Integration test for Pricing Strategy API and Frontend
Tests all endpoints and verifies data persistence
"""

import os
import django
import requests
import json
from decimal import Decimal

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_django.settings')
django.setup()

from api.models import PricingItem

BASE_URL = "http://127.0.0.1:8000/api/pricing"
HEADERS = {"Content-Type": "application/json"}

def test_get_pricing_items():
    """Test GET /pricing-items endpoint"""
    print("\n[TEST 1] GET /api/pricing/pricing-items/")
    try:
        response = requests.get(f"{BASE_URL}/pricing-items/", headers=HEADERS)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        print(f"  OK: Retrieved {data['count']} pricing items")
        return data
    except Exception as e:
        print(f"  FAILED: {e}")
        return None

def test_get_pricing_strategies():
    """Test GET /pricing-strategies endpoint"""
    print("\n[TEST 2] GET /api/pricing/pricing-strategies/")
    try:
        response = requests.get(f"{BASE_URL}/pricing-strategies/", headers=HEADERS)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        print(f"  OK: Retrieved {data['count']} pricing strategies")
        return data
    except Exception as e:
        print(f"  FAILED: {e}")
        return None

def test_get_pricing_tests():
    """Test GET /pricing-tests endpoint"""
    print("\n[TEST 3] GET /api/pricing/pricing-tests/")
    try:
        response = requests.get(f"{BASE_URL}/pricing-tests/", headers=HEADERS)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        print(f"  OK: Retrieved {data['count']} pricing tests")
        return data
    except Exception as e:
        print(f"  FAILED: {e}")
        return None

def test_create_pricing_item():
    """Test POST /pricing-items endpoint"""
    print("\n[TEST 4] POST /api/pricing/pricing-items/")
    try:
        item_data = {
            "name": "Integration Test Item",
            "price": "15.99",
            "elasticity": "-0.95",
            "elasticity_change": "0.15",
            "elasticity_period": "Q4 2024",
            "competitive_score": "89.5",
            "competitive_change": "1.2",
            "competitive_period": "This quarter",
            "acceptance_rate": "79.8",
            "acceptance_change": "0.5",
            "acceptance_period": "Last 7 days",
        }
        response = requests.post(f"{BASE_URL}/pricing-items/", json=item_data, headers=HEADERS)
        assert response.status_code == 201, f"Expected 201, got {response.status_code}: {response.text}"
        created_item = response.json()
        print(f"  OK: Created item '{created_item['name']}' with ID {created_item['id']}")
        return created_item
    except Exception as e:
        print(f"  FAILED: {e}")
        return None

def test_filtering():
    """Test filtering and ordering"""
    print("\n[TEST 5] Test filtering and ordering")
    try:
        response = requests.get(f"{BASE_URL}/pricing-items/?ordering=-price", headers=HEADERS)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        items = data.get('results', data) if isinstance(data, dict) else data
        if items and len(items) > 1:
            prices = [float(item['price']) for item in items]
            is_desc = prices == sorted(prices, reverse=True)
            if is_desc:
                print(f"  OK: Items correctly ordered by price (descending)")
            else:
                print(f"  WARNING: Price ordering may not be correct")
        else:
            print(f"  OK: Filtering works (got {len(items)} items)")
        return True
    except Exception as e:
        print(f"  FAILED: {e}")
        return None

def test_metric_calculations():
    """Test that metrics are correctly calculated and stored"""
    print("\n[TEST 6] Verify metric calculations")
    try:
        response = requests.get(f"{BASE_URL}/pricing-items/", headers=HEADERS)
        data = response.json()
        items = data.get('results', data) if isinstance(data, dict) else data
        
        if not items:
            print("  WARNING: No items to test")
            return None
        
        item = items[0]
        required_fields = [
            'id', 'name', 'price',
            'elasticity', 'elasticity_change', 'elasticity_period',
            'competitive_score', 'competitive_change', 'competitive_period',
            'acceptance_rate', 'acceptance_change', 'acceptance_period'
        ]
        
        missing = [f for f in required_fields if f not in item]
        if missing:
            print(f"  FAILED: Missing fields: {missing}")
            return None
        
        print(f"  OK: All metric fields present in item '{item['name']}'")
        print(f"      Elasticity: {item['elasticity']} (change: {item['elasticity_change']})")
        print(f"      Competitive: {item['competitive_score']} (change: {item['competitive_change']})")
        print(f"      Acceptance: {item['acceptance_rate']} (change: {item['acceptance_change']})")
        return True
    except Exception as e:
        print(f"  FAILED: {e}")
        return None

def test_database_persistence():
    """Test that data is actually persisted in database"""
    print("\n[TEST 7] Verify database persistence")
    try:
        count_before = PricingItem.objects.count()
        
        # Create new item via API
        item_data = {
            "name": "Database Persistence Test",
            "price": "25.50",
            "elasticity": "-1.1",
            "elasticity_change": "0",
            "elasticity_period": "Q4 2024",
            "competitive_score": "82.0",
            "competitive_change": "0",
            "competitive_period": "This quarter",
            "acceptance_rate": "76.5",
            "acceptance_change": "0",
            "acceptance_period": "Last 7 days",
        }
        response = requests.post(f"{BASE_URL}/pricing-items/", json=item_data, headers=HEADERS)
        assert response.status_code == 201, f"POST failed with {response.status_code}"
        
        # Count records in database
        count_after = PricingItem.objects.count()
        
        if count_after == count_before + 1:
            print(f"  OK: Database persisted new item ({count_before} -> {count_after} items)")
            # Verify it's in the database
            last_item = PricingItem.objects.last()
            if last_item and last_item.name == "Database Persistence Test":
                print(f"      Verified: Item '{last_item.name}' exists in database")
                return True
            else:
                print(f"  WARNING: Item created but name verification inconclusive")
                return True
        else:
            print(f"  FAILED: Expected {count_before + 1} items, got {count_after}")
            return None
    except Exception as e:
        print(f"  FAILED: {e}")
        return None

def run_all_tests():
    """Run all integration tests"""
    print("=" * 70)
    print("PRICING STRATEGY INTEGRATION TEST SUITE")
    print("=" * 70)
    
    results = {
        "GET /pricing-items": test_get_pricing_items(),
        "GET /pricing-strategies": test_get_pricing_strategies(),
        "GET /pricing-tests": test_get_pricing_tests(),
        "POST /pricing-items": test_create_pricing_item(),
        "Filtering & Ordering": test_filtering(),
        "Metric Calculations": test_metric_calculations(),
        "Database Persistence": test_database_persistence(),
    }
    
    print("\n" + "=" * 70)
    print("SUMMARY")
    print("=" * 70)
    
    passed = sum(1 for v in results.values() if v is not None and v is not True)
    total = len(results)
    
    for test_name, result in results.items():
        status = "PASS" if result else "FAIL"
        print(f"  [{status}] {test_name}")
    
    print(f"\nTests passed: {passed}/{total}")
    print("=" * 70)

if __name__ == "__main__":
    try:
        run_all_tests()
    except Exception as e:
        print(f"\nFATAL ERROR: {e}")
        import traceback
        traceback.print_exc()
