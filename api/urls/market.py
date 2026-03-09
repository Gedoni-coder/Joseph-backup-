from django.urls import path, include
from rest_framework.routers import DefaultRouter
from ..views import (
    MarketSegmentViewSet, CompetitorViewSet, MarketTrendViewSet
)

router = DefaultRouter()
router.register(r'market-segments', MarketSegmentViewSet)
router.register(r'competitors', CompetitorViewSet)
router.register(r'market-trends', MarketTrendViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
