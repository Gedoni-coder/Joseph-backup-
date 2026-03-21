from django.urls import path, include
from rest_framework.routers import DefaultRouter
from ..views import (
    FinancialLineItemViewSet, BudgetForecastViewSet, CashFlowProjectionViewSet, ScenarioTestViewSet,
    RiskAssessmentViewSet, AdvisoryInsightViewSet, LiquidityMetricViewSet,
    BudgetValidationSummaryViewSet, ForecastValidationRecordViewSet,
    BudgetAlignmentMetricViewSet, ForecastImprovementAreaViewSet,
    ScenarioResilienceMetricViewSet, RecommendedStressTestViewSet, KPIViewSet,
)

router = DefaultRouter()
router.register(r'financial-line-items', FinancialLineItemViewSet, basename='financiallineitem')
router.register(r'budget-forecasts', BudgetForecastViewSet)
router.register(r'cash-flow-projections', CashFlowProjectionViewSet)
router.register(r'scenario-tests', ScenarioTestViewSet)
router.register(r'risk-assessments', RiskAssessmentViewSet)
router.register(r'advisory-insights', AdvisoryInsightViewSet)
router.register(r'performance-drivers', KPIViewSet, basename='performance-driver')
router.register(r'liquidity-metrics', LiquidityMetricViewSet)
router.register(r'budget-validation-summaries', BudgetValidationSummaryViewSet)
router.register(r'forecast-validation-records', ForecastValidationRecordViewSet)
router.register(r'budget-alignment-metrics', BudgetAlignmentMetricViewSet)
router.register(r'forecast-improvement-areas', ForecastImprovementAreaViewSet)
router.register(r'scenario-resilience-metrics', ScenarioResilienceMetricViewSet)
router.register(r'recommended-stress-tests', RecommendedStressTestViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
