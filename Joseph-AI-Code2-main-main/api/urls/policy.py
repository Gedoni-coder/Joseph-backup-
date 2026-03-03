from django.urls import path, include
from rest_framework.routers import DefaultRouter
from ..views import (
    ExternalPolicyViewSet, InternalPolicyViewSet, StrategyRecommendationViewSet
)

router = DefaultRouter()
router.register(r'external-policies', ExternalPolicyViewSet)
router.register(r'internal-policies', InternalPolicyViewSet)
router.register(r'strategy-recommendations', StrategyRecommendationViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
