"""
Sales Intelligence API URLs
Router and URL configuration for sales intelligence endpoints
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .sales_intelligence_views import (
    SalesRepViewSet,
    LeadViewSet,
    OpportunityViewSet,
    SalesMetricViewSet,
    ActivityLogViewSet,
    CompetitionTrackingViewSet,
    SalesVelocityViewSet,
)

# Create router and register viewsets
router = DefaultRouter()
router.register(r'sales-reps', SalesRepViewSet, basename='sales-rep')
router.register(r'leads', LeadViewSet, basename='lead')
router.register(r'opportunities', OpportunityViewSet, basename='opportunity')
router.register(r'sales-metrics', SalesMetricViewSet, basename='sales-metric')
router.register(r'activities', ActivityLogViewSet, basename='activity-log')
router.register(r'competition', CompetitionTrackingViewSet, basename='competition-tracking')
router.register(r'velocity', SalesVelocityViewSet, basename='sales-velocity')

urlpatterns = [
    path('', include(router.urls)),
]
