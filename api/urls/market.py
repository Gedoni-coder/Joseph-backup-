from django.urls import path, include
from rest_framework.routers import DefaultRouter
from ..views import (
    MarketSegmentViewSet, CompetitorViewSet, MarketTrendViewSet,
    MarketSizeViewSet, CustomerSegmentDataViewSet, DemandForecastViewSet,
    IndustryInsightViewSet, MarketSummaryViewSet, MarketRecommendationViewSet,
    MarketActionItemViewSet, MarketNextStepViewSet, SWOTAnalysisViewSet,
    ProductComparisonViewSet, MarketPositionViewSet, CompetitiveAdvantageViewSet,
    StrategyRecommendationAnalysisViewSet, ReportNoteViewSet,
    ReportActionPlanViewSet, ReportEngagementEventViewSet
)

router = DefaultRouter()
router.register(r'market-segments', MarketSegmentViewSet)
router.register(r'competitors', CompetitorViewSet)
router.register(r'market-trends', MarketTrendViewSet)
router.register(r'market-sizes', MarketSizeViewSet)
router.register(r'customer-segments', CustomerSegmentDataViewSet)
router.register(r'demand-forecasts', DemandForecastViewSet)
router.register(r'industry-insights', IndustryInsightViewSet)
router.register(r'market-summary', MarketSummaryViewSet)
router.register(r'market-recommendations', MarketRecommendationViewSet)
router.register(r'market-actions', MarketActionItemViewSet)
router.register(r'market-next-steps', MarketNextStepViewSet)
router.register(r'swot-analyses', SWOTAnalysisViewSet)
router.register(r'product-comparisons', ProductComparisonViewSet)
router.register(r'market-positions', MarketPositionViewSet)
router.register(r'competitive-advantages', CompetitiveAdvantageViewSet)
router.register(r'strategy-recommendations', StrategyRecommendationAnalysisViewSet)
router.register(r'report-notes', ReportNoteViewSet)
router.register(r'report-action-plans', ReportActionPlanViewSet)
router.register(r'report-events', ReportEngagementEventViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
