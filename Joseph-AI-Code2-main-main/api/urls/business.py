from django.urls import path, include
from rest_framework.routers import DefaultRouter
from ..views import (
    CustomerProfileViewSet, RevenueProjectionViewSet, CostStructureViewSet,
    CashFlowForecastViewSet, KPIViewSet, ScenarioPlanningViewSet, DocumentViewSet
)

router = DefaultRouter()
router.register(r'customer-profiles', CustomerProfileViewSet)
router.register(r'revenue-projections', RevenueProjectionViewSet)
router.register(r'cost-structures', CostStructureViewSet)
router.register(r'cash-flow-forecasts', CashFlowForecastViewSet)
router.register(r'kpis', KPIViewSet)
router.register(r'scenario-plannings', ScenarioPlanningViewSet)
router.register(r'documents', DocumentViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
