from rest_framework.routers import DefaultRouter
from api.views import (
    CustomerProfileViewSet,
    RevenueProjectionViewSet,
    CostStructureViewSet,
    CashFlowForecastViewSet,
    KPIViewSet,
    ScenarioPlanningViewSet,
    DocumentViewSet,
    KeyAssumptionViewSet,
    KeyRiskViewSet,
    CompetitiveMetricViewSet,
    ForecastActionItemViewSet,
    ForecastNextStepViewSet,
    GrowthTrajectoryViewSet,
    RevenueTargetViewSet,
    BusinessMetricViewSet,
    RevenueProductServiceForecastViewSet,
    RevenueRegionalForecastViewSet,
    RevenueHistoricalComparisonViewSet,
    RevenueForecastMethodViewSet,
    RevenueScenarioSnapshotViewSet,
    RevenueSegmentBreakdownViewSet,
    CostOverviewMetricViewSet,
    CostBudgetScenarioViewSet,
    CostMonthlyComparisonViewSet,
    OperationalExpenseCategoryViewSet,
    OperationalExpenseItemViewSet,
    CostTrendAnalysisViewSet,
    OverviewProfitLossSnapshotViewSet,
    OverviewKpiSummaryViewSet,
    OverviewAlertViewSet)

router = DefaultRouter()
router.register(r'customer-profiles', CustomerProfileViewSet, basename='customerprofile')
router.register(r'revenue-projections', RevenueProjectionViewSet, basename='revenueprojection')
router.register(r'cost-structures', CostStructureViewSet, basename='coststructure')
router.register(r'cash-flow-forecasts', CashFlowForecastViewSet, basename='cashflowforecast')
router.register(r'kpis', KPIViewSet, basename='kpi')
router.register(r'scenario-plannings', ScenarioPlanningViewSet, basename='scenarioplanning')
router.register(r'documents', DocumentViewSet, basename='document')
router.register(r'key-assumptions', KeyAssumptionViewSet, basename='keyassumption')
router.register(r'key-risks', KeyRiskViewSet, basename='keyrisk')
router.register(r'competitive-metrics', CompetitiveMetricViewSet, basename='competitivemetric')
router.register(r'forecast-action-items', ForecastActionItemViewSet, basename='forecastactionitem')
router.register(r'forecast-next-steps', ForecastNextStepViewSet, basename='forecastnextstep')
router.register(r'growth-trajectories', GrowthTrajectoryViewSet, basename='growthtrajectory')
router.register(r'revenue-targets', RevenueTargetViewSet, basename='revenuetarget')
router.register(r'business-metrics', BusinessMetricViewSet, basename='businessmetric')
router.register(r'revenue-product-service-forecasts', RevenueProductServiceForecastViewSet, basename='revenueproductserviceforecast')
router.register(r'revenue-regional-forecasts', RevenueRegionalForecastViewSet, basename='revenueregionalforecast')
router.register(r'revenue-historical-comparisons', RevenueHistoricalComparisonViewSet, basename='revenuehistoricalcomparison')
router.register(r'revenue-forecast-methods', RevenueForecastMethodViewSet, basename='revenueforecastmethod')
router.register(r'revenue-scenario-snapshots', RevenueScenarioSnapshotViewSet, basename='revenuescenariosnapshot')
router.register(r'revenue-segment-breakdowns', RevenueSegmentBreakdownViewSet, basename='revenuesegmentbreakdown')
router.register(r'cost-overview-metrics', CostOverviewMetricViewSet, basename='costoverviewmetric')
router.register(r'cost-budget-scenarios', CostBudgetScenarioViewSet, basename='costbudgetscenario')
router.register(r'cost-monthly-comparisons', CostMonthlyComparisonViewSet, basename='costmonthlycomparison')
router.register(r'operational-expense-categories', OperationalExpenseCategoryViewSet, basename='operationalexpensecategory')
router.register(r'operational-expense-items', OperationalExpenseItemViewSet, basename='operationalexpenseitem')
router.register(r'cost-trend-analyses', CostTrendAnalysisViewSet, basename='costtrendanalysis')
router.register(r'overview-profit-loss-snapshots', OverviewProfitLossSnapshotViewSet, basename='overviewprofitlosssnapshot')
router.register(r'overview-kpi-summaries', OverviewKpiSummaryViewSet, basename='overviewkpisummary')
router.register(r'overview-alerts', OverviewAlertViewSet, basename='overviewalert')

urlpatterns = router.urls
