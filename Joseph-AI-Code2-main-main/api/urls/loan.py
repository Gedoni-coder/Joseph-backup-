from django.urls import path, include
from rest_framework.routers import DefaultRouter
from ..views import (
    LoanEligibilityViewSet, FundingOptionViewSet, LoanComparisonViewSet,
    BusinessPlanViewSet, FundingStrategyViewSet, InvestorMatchViewSet
)

router = DefaultRouter()
router.register(r'loan-eligibility', LoanEligibilityViewSet)
router.register(r'funding-options', FundingOptionViewSet)
router.register(r'loan-comparisons', LoanComparisonViewSet)
router.register(r'business-plans', BusinessPlanViewSet)
router.register(r'funding-strategy', FundingStrategyViewSet)
router.register(r'investor-matches', InvestorMatchViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
