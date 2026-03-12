from django.urls import path, include
from rest_framework.routers import DefaultRouter
from ..views import (
    CustomerProfileViewSet, RevenueProjectionViewSet, CostStructureViewSet,
    CashFlowForecastViewSet, KPIViewSet, ScenarioPlanningViewSet, DocumentViewSet
)

router = DefaultRouter()
router.register(r'customer-profiles', CustomerProfileViewSet, basename='customerprofile')
router.register(r'revenue-projections', RevenueProjectionViewSet, basename='revenueprojection')
router.register(r'cost-structures', CostStructureViewSet, basename='coststructure')
router.register(r'cash-flow-forecasts', CashFlowForecastViewSet, basename='cashflowforecast')
router.register(r'kpis', KPIViewSet, basename='kpi')
router.register(r'scenario-plannings', ScenarioPlanningViewSet, basename='scenarioplanning')
router.register(r'documents', DocumentViewSet, basename='document')

urlpatterns = [
    path('', include(router.urls)),
]
