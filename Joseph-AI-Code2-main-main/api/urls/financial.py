from django.urls import path, include
from rest_framework.routers import DefaultRouter
from ..views import (
    BudgetForecastViewSet, CashFlowProjectionViewSet, ScenarioTestViewSet,
    RiskAssessmentViewSet, AdvisoryInsightViewSet, LiquidityMetricViewSet
)

router = DefaultRouter()
router.register(r'budget-forecasts', BudgetForecastViewSet)
router.register(r'cash-flow-projections', CashFlowProjectionViewSet)
router.register(r'scenario-tests', ScenarioTestViewSet)
router.register(r'risk-assessments', RiskAssessmentViewSet)
router.register(r'advisory-insights', AdvisoryInsightViewSet)
router.register(r'liquidity-metrics', LiquidityMetricViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
