from django.urls import path, include
from rest_framework.routers import DefaultRouter
from ..views import (
    RevenueStreamViewSet, RevenueScenarioViewSet, ChurnAnalysisViewSet,
    UpsellOpportunityViewSet, RevenueMetricViewSet, ChannelPerformanceViewSet,
    RevenueOverviewMetricViewSet, RevenueOverviewTopStreamViewSet,
    RevenueOverviewChurnRiskViewSet, RevenueOverviewUpsellOpportunityViewSet,
    RevenueOverviewChannelPerformanceViewSet, RevenueUpsellInsightViewSet,
)

router = DefaultRouter()
router.register(r'revenue-streams', RevenueStreamViewSet)
router.register(r'revenue-scenarios', RevenueScenarioViewSet)
router.register(r'churn-analyses', ChurnAnalysisViewSet)
router.register(r'upsell-opportunities', UpsellOpportunityViewSet)
router.register(r'revenue-metrics', RevenueMetricViewSet)
router.register(r'channel-performances', ChannelPerformanceViewSet)
router.register(r'overview-metrics', RevenueOverviewMetricViewSet, basename='revenue-overview-metric')
router.register(r'overview-top-streams', RevenueOverviewTopStreamViewSet, basename='revenue-overview-top-stream')
router.register(r'overview-churn-risks', RevenueOverviewChurnRiskViewSet, basename='revenue-overview-churn-risk')
router.register(r'overview-upsell-opportunities', RevenueOverviewUpsellOpportunityViewSet, basename='revenue-overview-upsell-opportunity')
router.register(r'overview-channel-performances', RevenueOverviewChannelPerformanceViewSet, basename='revenue-overview-channel-performance')
router.register(r'upsell-insights', RevenueUpsellInsightViewSet, basename='revenue-upsell-insight')

urlpatterns = [
    path('', include(router.urls)),
]
