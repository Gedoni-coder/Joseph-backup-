from django.urls import path, include
from rest_framework.routers import DefaultRouter
from ..views import (
    EconomicMetricViewSet, EconomicNewsViewSet, 
    EconomicForecastViewSet, EconomicEventViewSet
)

router = DefaultRouter()
router.register(r'metrics', EconomicMetricViewSet)
router.register(r'news', EconomicNewsViewSet)
router.register(r'forecasts', EconomicForecastViewSet)
router.register(r'events', EconomicEventViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
