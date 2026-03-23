from django.contrib import admin
from .models import (
    # Company
    CompanyProfile,
    # Economic
    EconomicMetric, EconomicNews, EconomicForecast, EconomicEvent,
    # Business
    CustomerProfile, RevenueProjection, CostStructure, CashFlowForecast, 
    KPI, ScenarioPlanning, Document, DocumentProcessingEvent, Insight,
    RevenueProductServiceForecast, RevenueRegionalForecast, RevenueHistoricalComparison,
    RevenueForecastMethod, RevenueScenarioSnapshot, RevenueSegmentBreakdown,
    CostOverviewMetric, CostBudgetScenario, CostMonthlyComparison,
    OperationalExpenseCategory, OperationalExpenseItem, CostTrendAnalysis,
    OverviewProfitLossSnapshot, OverviewKpiSummary, OverviewAlert,
    # Market
    MarketSegment, Competitor, MarketTrend,
    MarketSize, CustomerSegmentData, MarketDemandForecast, IndustryInsight,
    MarketSummary, MarketRecommendation, MarketActionItem, MarketNextStep,
    SWOTAnalysis, ProductComparison, MarketPosition, MarketStrategyRecommendation, ReportNote,
    ReportActionPlan, ReportEngagementEvent,
    # Loan
    LoanEligibility, FundingOption, LoanComparison, BusinessPlan, 
    FundingStrategy, InvestorMatch,
    # Revenue
    RevenueStream, RevenueScenario, ChurnAnalysis, UpsellOpportunity,
    RevenueMetric, ChannelPerformance, BusinessMetric,
    RevenueOverviewMetric, RevenueOverviewTopStream, RevenueOverviewChurnRisk,
    RevenueOverviewUpsellOpportunity, RevenueOverviewChannelPerformance,
    RevenueUpsellInsight,
    # Financial
    FinancialLineItem, BudgetForecast, CashFlowProjection, ScenarioTest, RiskAssessment,
    AdvisoryInsight, LiquidityMetric, ScenarioResilienceMetric, RecommendedStressTest,
    # Pricing
    PriceSetting, PricingRule, PriceForecast, PricingItem, PricingStrategy, PricingTest,
    # Tax
    TaxRecord, TaxRecommendation, ComplianceUpdate, TaxPlanningScenario,
    TaxAuditEvent, ComplianceObligation, ComplianceReport,
    # Policy
    ExternalPolicy, InternalPolicy, StrategyRecommendation,
    # Inventory
    InventoryItem, StockMovement, Supplier, ProcurementOrder, LogisticsMetric,
    # Inventory Extended
    DemandForecast, InventoryValuation, DeadStock, InventoryLocation, InventoryAudit,
    TurnoverMetrics, WarehouseOperation, SupplierContract, ProductionPlan,
    MarketVolatility, RegulatoryComplianceSC, DisruptionRisk, SustainabilityMetrics,
    # Growth & Revenue
    RevenueTarget, ForecastActionItem, KeyRisk, KeyAssumption, GrowthTrajectory,
    ForecastNextStep, ForecastImprovementArea, ForecastValidationRecord,
    # Market Analysis
    CompetitiveAdvantage, CompetitiveMetric, CompetitionTracking,
    # Sales
    SalesMetric, SalesPipeline, SalesRep, SalesVelocity, Lead, Opportunity,
    # Budget & Finance
    BudgetAlignmentMetric, BudgetValidationSummary,
    # Activity
    ActivityLog,
    # Advice
    AdviceMessage, Notification,
    # Chatbot
    ChatMessage, ModuleConversation, AgentState
)


class DocumentStatusFilter(admin.SimpleListFilter):
    title = 'status'
    parameter_name = 'status'

    def lookups(self, request, model_admin):
        return [
            ('Processing', 'Processing'),
            ('Processed', 'Processed'),
            ('Failed', 'Failed'),
        ]

    def queryset(self, request, queryset):
        if self.value():
            return queryset.filter(metadata__status=self.value())
        return queryset


class DocumentCategoryFilter(admin.SimpleListFilter):
    title = 'category'
    parameter_name = 'category'

    def lookups(self, request, model_admin):
        categories = (
            Document.objects.exclude(metadata__category__isnull=True)
            .values_list('metadata__category', flat=True)
            .distinct()
        )
        return [(category, category) for category in categories if category]

    def queryset(self, request, queryset):
        if self.value():
            return queryset.filter(metadata__category=self.value())
        return queryset

# Company
@admin.register(CompanyProfile)
class CompanyProfileAdmin(admin.ModelAdmin):
    list_display = ('company_name', 'sector', 'company_size', 'country', 'city', 'created_at')
    search_fields = ('company_name', 'sector', 'description')
    list_filter = ('company_size', 'country', 'sector')

@admin.register(EconomicMetric)
class EconomicMetricAdmin(admin.ModelAdmin):
    list_display = ('name', 'context', 'value', 'trend', 'category')
    list_filter = ('context', 'category', 'trend')
    search_fields = ('name',)

@admin.register(EconomicNews)
class EconomicNewsAdmin(admin.ModelAdmin):
    list_display = ('title', 'context', 'source', 'impact', 'category')
    list_filter = ('context', 'impact', 'category')
    search_fields = ('title', 'summary')

@admin.register(EconomicForecast)
class EconomicForecastAdmin(admin.ModelAdmin):
    list_display = ('indicator', 'context', 'period', 'forecast', 'confidence')
    list_filter = ('context', 'period')

@admin.register(EconomicEvent)
class EconomicEventAdmin(admin.ModelAdmin):
    list_display = ('title', 'context', 'date', 'impact', 'category')
    list_filter = ('context', 'impact', 'category')

# Business
@admin.register(CustomerProfile)
class CustomerProfileAdmin(admin.ModelAdmin):
    list_display = ('name', 'segment', 'lifetime_value', 'risk_score')
    list_filter = ('segment',)

@admin.register(RevenueProjection)
class RevenueProjectionAdmin(admin.ModelAdmin):
    list_display = ('name', 'period', 'projected_revenue', 'confidence')
    list_filter = ('period',)

@admin.register(CostStructure)
class CostStructureAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'amount', 'period')
    list_filter = ('category',)

@admin.register(CashFlowForecast)
class CashFlowForecastAdmin(admin.ModelAdmin):
    list_display = ('name', 'period', 'cash_inflow', 'cash_outflow', 'net_position')

@admin.register(KPI)
class KPIAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'impact', 'current_value', 'target_value', 'status', 'driver_type', 'data_source', 'updated_at')
    list_filter = ('category', 'impact', 'status', 'driver_type', 'data_source')
    search_fields = ('name', 'description')

@admin.register(ScenarioPlanning)
class ScenarioPlanningAdmin(admin.ModelAdmin):
    list_display = ('name', 'type', 'probability', 'created_at')

@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ('title', 'file_type', 'status_display', 'category_display', 'tags_display', 'uploaded_by', 'uploaded_at')
    list_filter = ('file_type', DocumentStatusFilter, DocumentCategoryFilter, 'uploaded_at')
    search_fields = ('title', 'uploaded_by__username', 'uploaded_by__email')
    actions = ('mark_processing', 'mark_processed', 'mark_failed')

    @admin.display(description='Status')
    def status_display(self, obj):
        return obj.get_status()

    @admin.display(description='Category')
    def category_display(self, obj):
        return obj.get_category()

    @admin.display(description='Tags')
    def tags_display(self, obj):
        tags = obj.get_tags()
        return ', '.join(tags[:3]) if tags else '-'

    def _bulk_update_status(self, request, queryset, status_value, stage, level):
        for document in queryset:
            metadata = document.metadata if isinstance(document.metadata, dict) else {}
            metadata['status'] = status_value
            document.metadata = metadata
            document.save(update_fields=['metadata'])

            if document.uploaded_by:
                DocumentProcessingEvent.objects.create(
                    document=document,
                    user=document.uploaded_by,
                    stage=stage,
                    level=level,
                    message=f'Document status changed to {status_value} from admin.',
                    details={'source': 'admin_bulk_action', 'status': status_value},
                )

    @admin.action(description='Mark selected documents as Processing')
    def mark_processing(self, request, queryset):
        self._bulk_update_status(request, queryset, 'Processing', 'ingest', 'info')

    @admin.action(description='Mark selected documents as Processed')
    def mark_processed(self, request, queryset):
        self._bulk_update_status(request, queryset, 'Processed', 'complete', 'success')

    @admin.action(description='Mark selected documents as Failed')
    def mark_failed(self, request, queryset):
        self._bulk_update_status(request, queryset, 'Failed', 'error', 'error')


@admin.register(DocumentProcessingEvent)
class DocumentProcessingEventAdmin(admin.ModelAdmin):
    list_display = ('document', 'stage', 'level', 'message', 'created_at')
    list_filter = ('stage', 'level', 'created_at')
    search_fields = ('document__title', 'message', 'user__username')


@admin.register(Insight)
class InsightAdmin(admin.ModelAdmin):
    list_display = ('document', 'created_at', 'updated_at')
    search_fields = ('document__title', 'summary')
    readonly_fields = ('created_at', 'updated_at')

# Market
@admin.register(MarketSegment)
class MarketSegmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'size', 'growth_rate', 'description')

@admin.register(Competitor)
class CompetitorAdmin(admin.ModelAdmin):
    list_display = ('name', 'market_position', 'current_price', 'market_share', 'pricing_model', 'updated_at')
    list_filter = ('market_position', 'competitor_type')
    search_fields = ('name', 'pricing_model', 'pricing_summary', 'strengths')

@admin.register(MarketTrend)
class MarketTrendAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'impact', 'direction', 'timeframe', 'confidence', 'created_at')


@admin.register(MarketSize)
class MarketSizeAdmin(admin.ModelAdmin):
    list_display = ('name', 'tam', 'sam', 'som', 'growth_rate', 'timeframe', 'region')
    search_fields = ('name', 'description', 'region')
    list_filter = ('currency', 'region')


@admin.register(CustomerSegmentData)
class CustomerSegmentDataAdmin(admin.ModelAdmin):
    list_display = ('name', 'market_size', 'percentage_of_total', 'avg_spending', 'growth_rate', 'priority')
    search_fields = ('name', 'description', 'region')
    list_filter = ('priority', 'region')


@admin.register(MarketDemandForecast)
class MarketDemandForecastAdmin(admin.ModelAdmin):
    list_display = ('segment', 'period', 'current_demand', 'forecasted_demand', 'confidence_level', 'seasonality_factor')
    search_fields = ('segment', 'period')


@admin.register(IndustryInsight)
class IndustryInsightAdmin(admin.ModelAdmin):
    list_display = ('title', 'insight_type', 'impact_level', 'timeframe', 'probability', 'created_at')
    list_filter = ('insight_type', 'impact_level')
    search_fields = ('title', 'description')


@admin.register(MarketSummary)
class MarketSummaryAdmin(admin.ModelAdmin):
    list_display = ('title', 'created_at', 'updated_at')
    search_fields = ('title', 'content')


@admin.register(MarketRecommendation)
class MarketRecommendationAdmin(admin.ModelAdmin):
    list_display = ('title', 'priority', 'implementation_timeline', 'expected_impact', 'created_at')
    list_filter = ('priority',)
    search_fields = ('title', 'description')


@admin.register(MarketActionItem)
class MarketActionItemAdmin(admin.ModelAdmin):
    list_display = ('title', 'priority', 'timeline', 'owner', 'created_at')
    list_filter = ('priority',)
    search_fields = ('title', 'description', 'owner')


@admin.register(MarketNextStep)
class MarketNextStepAdmin(admin.ModelAdmin):
    list_display = ('step', 'owner', 'due_date', 'status', 'created_at')
    list_filter = ('status',)
    search_fields = ('step', 'owner', 'due_date')


@admin.register(SWOTAnalysis)
class SWOTAnalysisAdmin(admin.ModelAdmin):
    list_display = ('competitor_name', 'overall_score', 'created_at')
    search_fields = ('competitor_name',)


@admin.register(ProductComparison)
class ProductComparisonAdmin(admin.ModelAdmin):
    list_display = ('product_name', 'market_position', 'created_at')
    list_filter = ('market_position',)
    search_fields = ('product_name',)


@admin.register(MarketPosition)
class MarketPositionAdmin(admin.ModelAdmin):
    list_display = ('market_segment', 'our_position', 'market_share_estimate', 'created_at')
    search_fields = ('market_segment', 'our_position', 'market_leader')


@admin.register(MarketStrategyRecommendation)
class MarketStrategyRecommendationAdmin(admin.ModelAdmin):
    list_display = ('title', 'strategy_type', 'created_at')
    list_filter = ('strategy_type',)
    search_fields = ('title', 'description', 'rationale')


@admin.register(ReportNote)
class ReportNoteAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'importance', 'created_at')
    list_filter = ('category', 'importance')
    search_fields = ('title', 'content')


@admin.register(ReportActionPlan)
class ReportActionPlanAdmin(admin.ModelAdmin):
    list_display = ('title', 'report_title', 'priority', 'timeline', 'target_date', 'created_at')
    list_filter = ('priority', 'timeline')
    search_fields = ('title', 'description', 'owner', 'report_title')


@admin.register(ReportEngagementEvent)
class ReportEngagementEventAdmin(admin.ModelAdmin):
    list_display = ('action_type', 'channel', 'report_note', 'created_at')
    list_filter = ('action_type', 'channel')
    search_fields = ('report_note__title',)

# Loan
@admin.register(LoanEligibility)
class LoanEligibilityAdmin(admin.ModelAdmin):
    list_display = ('business_name', 'eligible_amount', 'interest_rate', 'status')

@admin.register(FundingOption)
class FundingOptionAdmin(admin.ModelAdmin):
    list_display = ('name', 'type', 'min_amount', 'max_amount', 'interest_rate')

@admin.register(LoanComparison)
class LoanComparisonAdmin(admin.ModelAdmin):
    list_display = ('name', 'lender', 'amount', 'interest_rate', 'term_months')

@admin.register(BusinessPlan)
class BusinessPlanAdmin(admin.ModelAdmin):
    list_display = ('title', 'industry', 'created_at')

@admin.register(FundingStrategy)
class FundingStrategyAdmin(admin.ModelAdmin):
    list_display = ('name', 'risk_level', 'timeline')

@admin.register(InvestorMatch)
class InvestorMatchAdmin(admin.ModelAdmin):
    list_display = ('investor_name', 'investment_range_min', 'investment_range_max', 'sector_focus')

# Revenue
@admin.register(RevenueStream)
class RevenueStreamAdmin(admin.ModelAdmin):
    list_display = ('name', 'type', 'current_revenue', 'growth_rate')

@admin.register(RevenueScenario)
class RevenueScenarioAdmin(admin.ModelAdmin):
    list_display = ('name', 'probability', 'projected_revenue')

@admin.register(ChurnAnalysis)
class ChurnAnalysisAdmin(admin.ModelAdmin):
    list_display = ('segment', 'churn_rate', 'risk_score', 'period')

@admin.register(UpsellOpportunity)
class UpsellOpportunityAdmin(admin.ModelAdmin):
    list_display = ('customer', 'product', 'potential_revenue', 'probability')

@admin.register(RevenueMetric)
class RevenueMetricAdmin(admin.ModelAdmin):
    list_display = ('name', 'value', 'period', 'change_percent')

@admin.register(ChannelPerformance)
class ChannelPerformanceAdmin(admin.ModelAdmin):
    list_display = ('channel', 'revenue', 'conversion_rate', 'period')


@admin.register(RevenueOverviewMetric)
class RevenueOverviewMetricAdmin(admin.ModelAdmin):
    list_display = ('name', 'value', 'unit', 'change_percent', 'trend', 'period_label', 'sort_order')
    list_filter = ('trend', 'unit')
    search_fields = ('name', 'period_label')


@admin.register(RevenueOverviewTopStream)
class RevenueOverviewTopStreamAdmin(admin.ModelAdmin):
    list_display = ('name', 'stream_type', 'revenue', 'growth_percent', 'sort_order')
    list_filter = ('stream_type',)
    search_fields = ('name',)


@admin.register(RevenueOverviewChurnRisk)
class RevenueOverviewChurnRiskAdmin(admin.ModelAdmin):
    list_display = ('segment', 'customers', 'churn_rate', 'revenue_at_risk', 'sort_order')
    search_fields = ('segment',)


@admin.register(RevenueOverviewUpsellOpportunity)
class RevenueOverviewUpsellOpportunityAdmin(admin.ModelAdmin):
    list_display = ('customer_name', 'current_plan', 'suggested_plan', 'potential_increase', 'likelihood_percent', 'sort_order')
    search_fields = ('customer_name', 'current_plan', 'suggested_plan')


@admin.register(RevenueOverviewChannelPerformance)
class RevenueOverviewChannelPerformanceAdmin(admin.ModelAdmin):
    list_display = ('channel', 'customers', 'revenue', 'margin_percent', 'sort_order')
    search_fields = ('channel',)


@admin.register(RevenueUpsellInsight)
class RevenueUpsellInsightAdmin(admin.ModelAdmin):
    list_display = ('category', 'text', 'sort_order')
    list_filter = ('category',)
    search_fields = ('text',)

@admin.register(BusinessMetric)
class BusinessMetricAdmin(admin.ModelAdmin):
    list_display = ('category', 'metric', 'current', 'target', 'status', 'created_at')
    list_filter = ('category', 'status')
    search_fields = ('metric', 'category')

@admin.register(RevenueProductServiceForecast)
class RevenueProductServiceForecastAdmin(admin.ModelAdmin):
    list_display = ('name', 'projection_year', 'projected_revenue', 'growth_rate', 'market_share', 'sort_order')
    list_filter = ('projection_year',)
    search_fields = ('name',)

@admin.register(RevenueRegionalForecast)
class RevenueRegionalForecastAdmin(admin.ModelAdmin):
    list_display = ('region', 'projected_revenue', 'revenue_share', 'growth_rate', 'sort_order')
    search_fields = ('region',)

@admin.register(RevenueHistoricalComparison)
class RevenueHistoricalComparisonAdmin(admin.ModelAdmin):
    list_display = ('label', 'total_revenue', 'growth_percent', 'growth_label', 'supporting_metric_label', 'sort_order')
    search_fields = ('label',)

@admin.register(RevenueForecastMethod)
class RevenueForecastMethodAdmin(admin.ModelAdmin):
    list_display = ('name', 'projected_revenue', 'metric_label', 'metric_value', 'sort_order')
    search_fields = ('name',)

@admin.register(RevenueScenarioSnapshot)
class RevenueScenarioSnapshotAdmin(admin.ModelAdmin):
    list_display = ('scenario', 'probability', 'annual_revenue', 'operating_costs', 'net_profit', 'sort_order')
    search_fields = ('scenario',)

@admin.register(RevenueSegmentBreakdown)
class RevenueSegmentBreakdownAdmin(admin.ModelAdmin):
    list_display = ('segment', 'revenue', 'percentage_of_total', 'growth_rate', 'customer_count', 'sort_order')
    search_fields = ('segment',)

@admin.register(CostOverviewMetric)
class CostOverviewMetricAdmin(admin.ModelAdmin):
    list_display = ('cost_type', 'annual_total', 'monthly_average', 'percent_of_revenue', 'sort_order')
    list_filter = ('cost_type',)

@admin.register(CostBudgetScenario)
class CostBudgetScenarioAdmin(admin.ModelAdmin):
    list_display = ('label', 'amount', 'subtitle', 'sort_order')

@admin.register(CostMonthlyComparison)
class CostMonthlyComparisonAdmin(admin.ModelAdmin):
    list_display = ('month', 'budget_amount', 'forecast_amount', 'actual_amount', 'sort_order')

@admin.register(OperationalExpenseCategory)
class OperationalExpenseCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'total_amount', 'sort_order')

@admin.register(OperationalExpenseItem)
class OperationalExpenseItemAdmin(admin.ModelAdmin):
    list_display = ('category', 'name', 'amount', 'sort_order')
    list_filter = ('category',)

@admin.register(CostTrendAnalysis)
class CostTrendAnalysisAdmin(admin.ModelAdmin):
    list_display = ('title', 'value', 'sort_order')

@admin.register(OverviewProfitLossSnapshot)
class OverviewProfitLossSnapshotAdmin(admin.ModelAdmin):
    list_display = ('period_label', 'gross_profit', 'operating_expense', 'net_profit', 'sort_order')

@admin.register(OverviewKpiSummary)
class OverviewKpiSummaryAdmin(admin.ModelAdmin):
    list_display = ('metrics_tracked', 'excellent_count', 'good_count', 'fair_count', 'needs_attention_count', 'sort_order')

@admin.register(OverviewAlert)
class OverviewAlertAdmin(admin.ModelAdmin):
    list_display = ('title', 'alert_type', 'sort_order', 'created_at')
    list_filter = ('alert_type',)

# Financial
@admin.register(FinancialLineItem)
class FinancialLineItemAdmin(admin.ModelAdmin):
    list_display = ('category', 'item', 'current_amount', 'budget_amount', 'last_year_amount', 'period', 'sort_order')
    list_filter = ('category', 'period')
    search_fields = ('item',)

@admin.register(BudgetForecast)
class BudgetForecastAdmin(admin.ModelAdmin):
    list_display = ('category', 'amount', 'period', 'variance')

@admin.register(CashFlowProjection)
class CashFlowProjectionAdmin(admin.ModelAdmin):
    list_display = ('name', 'period', 'amount', 'type')

@admin.register(ScenarioTest)
class ScenarioTestAdmin(admin.ModelAdmin):
    list_display = ('name', 'type', 'impact', 'probability')

@admin.register(RiskAssessment)
class RiskAssessmentAdmin(admin.ModelAdmin):
    list_display = ('category', 'level', 'impact', 'created_at')

@admin.register(AdvisoryInsight)
class AdvisoryInsightAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'priority', 'created_at')

@admin.register(LiquidityMetric)
class LiquidityMetricAdmin(admin.ModelAdmin):
    list_display = ('name', 'value', 'period', 'benchmark')

@admin.register(ScenarioResilienceMetric)
class ScenarioResilienceMetricAdmin(admin.ModelAdmin):
    list_display = ('name', 'value', 'value_tone', 'sort_order', 'updated_at')
    search_fields = ('name', 'description')

@admin.register(RecommendedStressTest)
class RecommendedStressTestAdmin(admin.ModelAdmin):
    list_display = ('title', 'icon', 'sort_order', 'updated_at')
    search_fields = ('title', 'description')

# Pricing
@admin.register(PriceSetting)
class PriceSettingAdmin(admin.ModelAdmin):
    list_display = ('product', 'base_price', 'current_price', 'strategy')

@admin.register(PricingRule)
class PricingRuleAdmin(admin.ModelAdmin):
    list_display = ('name', 'condition', 'adjustment_type', 'adjustment_value')

@admin.register(PriceForecast)
class PriceForecastAdmin(admin.ModelAdmin):
    list_display = ('product', 'forecast_price', 'confidence', 'period')

@admin.register(PricingItem)
class PricingItemAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'elasticity', 'competitive_score', 'acceptance_rate', 'updated_at')
    search_fields = ('name',)

@admin.register(PricingStrategy)
class PricingStrategyAdmin(admin.ModelAdmin):
    list_display = ('name', 'strategy_type', 'suggested_price', 'confidence', 'is_active', 'updated_at')
    list_filter = ('strategy_type', 'is_active')
    search_fields = ('name',)

@admin.register(PricingTest)
class PricingTestAdmin(admin.ModelAdmin):
    list_display = ('name', 'test_type', 'status', 'confidence', 'created_at')
    list_filter = ('status', 'test_type')
    search_fields = ('name',)

# Tax
@admin.register(TaxRecord)
class TaxRecordAdmin(admin.ModelAdmin):
    list_display = ('entity', 'tax_year', 'taxable_income', 'estimated_tax', 'effective_rate', 'status')

@admin.register(TaxRecommendation)
class TaxRecommendationAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'potential_savings', 'priority', 'implemented')

@admin.register(ComplianceUpdate)
class ComplianceUpdateAdmin(admin.ModelAdmin):
    list_display = ('title', 'type', 'jurisdiction', 'impact', 'status', 'effective_date')

@admin.register(TaxPlanningScenario)
class TaxPlanningScenarioAdmin(admin.ModelAdmin):
    list_display = ('name', 'current_tax', 'projected_tax', 'savings', 'risk_level', 'confidence')

@admin.register(TaxAuditEvent)
class TaxAuditEventAdmin(admin.ModelAdmin):
    list_display = ('action', 'entity', 'outcome', 'category', 'created_at')

@admin.register(ComplianceObligation)
class ComplianceObligationAdmin(admin.ModelAdmin):
    list_display = ('name', 'due_date', 'frequency', 'agency', 'status', 'priority')

@admin.register(ComplianceReport)
class ComplianceReportAdmin(admin.ModelAdmin):
    list_display = ('title', 'type', 'status', 'period', 'due_date', 'completion_rate')

# Policy
@admin.register(ExternalPolicy)
class ExternalPolicyAdmin(admin.ModelAdmin):
    list_display = ('title', 'source', 'category', 'impact', 'effective_date')

@admin.register(InternalPolicy)
class InternalPolicyAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'status', 'effective_date')

@admin.register(StrategyRecommendation)
class StrategyRecommendationAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'priority', 'impact')

# Inventory
@admin.register(InventoryItem)
class InventoryItemAdmin(admin.ModelAdmin):
    list_display = ('name', 'sku', 'quantity', 'reorder_level')
    search_fields = ('name', 'sku')

@admin.register(StockMovement)
class StockMovementAdmin(admin.ModelAdmin):
    list_display = ('item', 'type', 'quantity', 'date')

@admin.register(Supplier)
class SupplierAdmin(admin.ModelAdmin):
    list_display = ('name', 'contact_name', 'rating')

@admin.register(ProcurementOrder)
class ProcurementOrderAdmin(admin.ModelAdmin):
    list_display = ('order_number', 'supplier', 'status', 'total')

@admin.register(LogisticsMetric)
class LogisticsMetricAdmin(admin.ModelAdmin):
    list_display = ('name', 'value', 'period')

# Chatbot
@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ('conversation', 'role', 'content', 'timestamp')
    list_filter = ('role',)

@admin.register(ModuleConversation)
class ModuleConversationAdmin(admin.ModelAdmin):
    list_display = ('module', 'user', 'created_at', 'updated_at')

@admin.register(AgentState)
class AgentStateAdmin(admin.ModelAdmin):
    list_display = ('name', 'is_running', 'pending_tasks', 'last_activity')

# ==================== ADVICE ADMIN ====================

@admin.register(AdviceMessage)
class AdviceMessageAdmin(admin.ModelAdmin):
    list_display = ('module_name', 'title', 'user', 'is_read', 'created_at')
    list_filter = ('module_id', 'is_read', 'created_at')
    search_fields = ('title', 'content', 'module_name')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('Basic Info', {'fields': ('user', 'module_id', 'module_name', 'module_icon')}),
        ('Content', {'fields': ('title', 'content')}),
        ('Status', {'fields': ('is_read',)}),
        ('Timestamps', {'fields': ('created_at', 'updated_at'), 'classes': ('collapse',)}),
    )


# ==================== NOTIFICATION ADMIN ====================

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('sender', 'subject', 'user', 'type', 'priority', 'is_read', 'created_at')
    list_filter = ('type', 'priority', 'is_read', 'starred', 'archived', 'category', 'created_at')
    search_fields = ('subject', 'body', 'sender', 'category')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('Basic Info', {'fields': ('user', 'sender', 'type', 'category')}),
        ('Content', {'fields': ('subject', 'preview', 'body')}),
        ('Status', {'fields': ('is_read', 'starred', 'archived', 'priority')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at'), 'classes': ('collapse',)}),
    )


# ==================== GROWTH & REVENUE EXTENDED ADMIN ====================

@admin.register(RevenueTarget)
class RevenueTargetAdmin(admin.ModelAdmin):
    pass


@admin.register(ForecastActionItem)
class ForecastActionItemAdmin(admin.ModelAdmin):
    pass


@admin.register(KeyRisk)
class KeyRiskAdmin(admin.ModelAdmin):
    pass


@admin.register(KeyAssumption)
class KeyAssumptionAdmin(admin.ModelAdmin):
    pass


@admin.register(GrowthTrajectory)
class GrowthTrajectoryAdmin(admin.ModelAdmin):
    pass


@admin.register(ForecastNextStep)
class ForecastNextStepAdmin(admin.ModelAdmin):
    pass


@admin.register(ForecastImprovementArea)
class ForecastImprovementAreaAdmin(admin.ModelAdmin):
    pass


@admin.register(ForecastValidationRecord)
class ForecastValidationRecordAdmin(admin.ModelAdmin):
    pass


# ==================== INVENTORY EXTENDED ADMIN ====================

@admin.register(DemandForecast)
class DemandForecastAdmin(admin.ModelAdmin):
    pass


@admin.register(InventoryValuation)
class InventoryValuationAdmin(admin.ModelAdmin):
    pass


@admin.register(DeadStock)
class DeadStockAdmin(admin.ModelAdmin):
    pass


@admin.register(InventoryLocation)
class InventoryLocationAdmin(admin.ModelAdmin):
    pass


@admin.register(InventoryAudit)
class InventoryAuditAdmin(admin.ModelAdmin):
    pass


@admin.register(TurnoverMetrics)
class TurnoverMetricsAdmin(admin.ModelAdmin):
    pass


@admin.register(WarehouseOperation)
class WarehouseOperationAdmin(admin.ModelAdmin):
    pass


@admin.register(SupplierContract)
class SupplierContractAdmin(admin.ModelAdmin):
    pass


@admin.register(ProductionPlan)
class ProductionPlanAdmin(admin.ModelAdmin):
    pass


@admin.register(MarketVolatility)
class MarketVolatilityAdmin(admin.ModelAdmin):
    pass


@admin.register(RegulatoryComplianceSC)
class RegulatoryComplianceSCAdmin(admin.ModelAdmin):
    pass


@admin.register(DisruptionRisk)
class DisruptionRiskAdmin(admin.ModelAdmin):
    pass


@admin.register(SustainabilityMetrics)
class SustainabilityMetricsAdmin(admin.ModelAdmin):
    pass


# ==================== MARKET ANALYSIS EXTENDED ADMIN ====================

@admin.register(CompetitiveAdvantage)
class CompetitiveAdvantageAdmin(admin.ModelAdmin):
    pass


@admin.register(CompetitiveMetric)
class CompetitiveMetricAdmin(admin.ModelAdmin):
    pass


@admin.register(CompetitionTracking)
class CompetitionTrackingAdmin(admin.ModelAdmin):
    pass


# ==================== SALES ADMIN ====================

@admin.register(SalesMetric)
class SalesMetricAdmin(admin.ModelAdmin):
    pass


@admin.register(SalesPipeline)
class SalesPipelineAdmin(admin.ModelAdmin):
    pass


@admin.register(SalesRep)
class SalesRepAdmin(admin.ModelAdmin):
    pass


@admin.register(SalesVelocity)
class SalesVelocityAdmin(admin.ModelAdmin):
    pass


@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    pass


@admin.register(Opportunity)
class OpportunityAdmin(admin.ModelAdmin):
    pass


# ==================== BUDGET & FINANCE EXTENDED ADMIN ====================

@admin.register(BudgetAlignmentMetric)
class BudgetAlignmentMetricAdmin(admin.ModelAdmin):
    pass


@admin.register(BudgetValidationSummary)
class BudgetValidationSummaryAdmin(admin.ModelAdmin):
    pass


# ==================== ACTIVITY LOG ADMIN ====================

@admin.register(ActivityLog)
class ActivityLogAdmin(admin.ModelAdmin):
    pass
