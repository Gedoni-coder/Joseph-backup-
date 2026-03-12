from django.urls import path, include
from rest_framework.routers import DefaultRouter
from ..views import (
    TaxRecordViewSet, TaxRecommendationViewSet, ComplianceUpdateViewSet,
    TaxPlanningScenarioViewSet, TaxAuditEventViewSet, ComplianceObligationViewSet,
    ComplianceReportViewSet,
)

router = DefaultRouter()
router.register(r'tax-records', TaxRecordViewSet, basename='tax-record')
router.register(r'tax-recommendations', TaxRecommendationViewSet, basename='tax-recommendation')
router.register(r'compliance-updates', ComplianceUpdateViewSet, basename='compliance-update')
router.register(r'tax-planning-scenarios', TaxPlanningScenarioViewSet, basename='tax-planning-scenario')
router.register(r'tax-audit-events', TaxAuditEventViewSet, basename='tax-audit-event')
router.register(r'compliance-obligations', ComplianceObligationViewSet, basename='compliance-obligation')
router.register(r'compliance-reports', ComplianceReportViewSet, basename='compliance-report')

urlpatterns = [
    path('', include(router.urls)),
]
