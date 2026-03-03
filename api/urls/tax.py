from django.urls import path, include
from rest_framework.routers import DefaultRouter
from ..views import (
    TaxRecordViewSet, ComplianceReportViewSet
)

router = DefaultRouter()
router.register(r'tax-records', TaxRecordViewSet)
router.register(r'compliance-reports', ComplianceReportViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
