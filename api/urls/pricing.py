from django.urls import path, include
from rest_framework.routers import DefaultRouter
from ..views import (
    PriceSettingViewSet, PricingRuleViewSet, PriceForecastViewSet,
    PricingItemViewSet, PricingStrategyViewSet, PricingTestViewSet
)

router = DefaultRouter()
router.register(r'price-settings', PriceSettingViewSet)
router.register(r'pricing-rules', PricingRuleViewSet)
router.register(r'price-forecasts', PriceForecastViewSet)
router.register(r'pricing-items', PricingItemViewSet)
router.register(r'pricing-strategies', PricingStrategyViewSet)
router.register(r'pricing-tests', PricingTestViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
