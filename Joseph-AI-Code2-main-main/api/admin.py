from django.contrib import admin
from .models import (
    # Company
    CompanyProfile,
    # Economic
    EconomicMetric, EconomicNews, EconomicForecast, EconomicEvent,
    # Business
    CustomerProfile, RevenueProjection, CostStructure, CashFlowForecast, 
    KPI, ScenarioPlanning, Document,
    # Market
    MarketSegment, Competitor, MarketTrend,
    # Loan
    LoanEligibility, FundingOption, LoanComparison, BusinessPlan, 
    FundingStrategy, InvestorMatch,
    # Revenue
    RevenueStream, RevenueScenario, ChurnAnalysis, UpsellOpportunity,
    RevenueMetric, ChannelPerformance,
    # Financial
    BudgetForecast, CashFlowProjection, ScenarioTest, RiskAssessment,
    AdvisoryInsight, LiquidityMetric,
    # Pricing
    PriceSetting, PricingRule, PriceForecast,
    # Tax
    TaxRecord, ComplianceReport,
    # Policy
    ExternalPolicy, InternalPolicy, StrategyRecommendation,
    # Inventory
    InventoryItem, StockMovement, Supplier, ProcurementOrder, LogisticsMetric,
    # Chatbot
    ChatMessage, ModuleConversation, AgentState
)

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
    list_display = ('name', 'current_value', 'target_value', 'status')
    list_filter = ('status',)

@admin.register(ScenarioPlanning)
class ScenarioPlanningAdmin(admin.ModelAdmin):
    list_display = ('name', 'type', 'probability', 'created_at')

@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ('title', 'file_type', 'uploaded_at')
    list_filter = ('file_type',)

# Market
@admin.register(MarketSegment)
class MarketSegmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'size', 'growth_rate', 'description')

@admin.register(Competitor)
class CompetitorAdmin(admin.ModelAdmin):
    list_display = ('name', 'market_share', 'strengths')

@admin.register(MarketTrend)
class MarketTrendAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'impact', 'created_at')

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

# Financial
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

# Tax
@admin.register(TaxRecord)
class TaxRecordAdmin(admin.ModelAdmin):
    list_display = ('tax_type', 'amount', 'period', 'status', 'due_date')

@admin.register(ComplianceReport)
class ComplianceReportAdmin(admin.ModelAdmin):
    list_display = ('name', 'status', 'period', 'created_at')

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
