from rest_framework import serializers
from django.contrib.auth.models import User
import json
from .models import (
    # Company
    CompanyProfile,
    # Economic
    EconomicMetric, EconomicNews, EconomicForecast, EconomicEvent,
    # Business
    CustomerProfile, RevenueProjection, CostStructure, CashFlowForecast,
    KPI, ScenarioPlanning, Document, DocumentProcessingEvent, Insight,
    KeyAssumption, KeyRisk, CompetitiveMetric, ForecastActionItem,
    ForecastNextStep, GrowthTrajectory, RevenueTarget, BusinessMetric,
    RevenueProductServiceForecast, RevenueRegionalForecast, RevenueHistoricalComparison,
    RevenueForecastMethod, RevenueScenarioSnapshot, RevenueSegmentBreakdown,
    CostOverviewMetric, CostBudgetScenario, CostMonthlyComparison,
    OperationalExpenseCategory, OperationalExpenseItem, CostTrendAnalysis,
    OverviewProfitLossSnapshot, OverviewKpiSummary, OverviewAlert,
    # Market
    MarketSegment, Competitor, MarketTrend,
    MarketSize, CustomerSegmentData, MarketDemandForecast, IndustryInsight,
    MarketSummary, MarketRecommendation, MarketActionItem, MarketNextStep,
    SWOTAnalysis, ProductComparison, MarketPosition, CompetitiveAdvantage,
    MarketStrategyRecommendation, ReportNote, ReportActionPlan, ReportEngagementEvent,
    # Loan
    LoanEligibility, FundingOption, LoanComparison, BusinessPlan,
    FundingStrategy, InvestorMatch,
    # Revenue
    RevenueStream, RevenueScenario, ChurnAnalysis, UpsellOpportunity,
    RevenueMetric, ChannelPerformance,
    RevenueOverviewMetric, RevenueOverviewTopStream, RevenueOverviewChurnRisk,
    RevenueOverviewUpsellOpportunity, RevenueOverviewChannelPerformance,
    RevenueUpsellInsight,
    # Financial
    FinancialLineItem, BudgetForecast, CashFlowProjection, ScenarioTest, RiskAssessment,
    AdvisoryInsight, LiquidityMetric, BudgetValidationSummary, ForecastValidationRecord,
    BudgetAlignmentMetric, ForecastImprovementArea, ScenarioResilienceMetric,
    RecommendedStressTest,
    # Pricing
    PriceSetting, PricingRule, PriceForecast, PricingItem, PricingStrategy, PricingTest,
    # Tax
    TaxRecord, TaxRecommendation, ComplianceUpdate, TaxPlanningScenario,
    TaxAuditEvent, ComplianceObligation, ComplianceReport,
    # Policy
    ExternalPolicy, InternalPolicy, StrategyRecommendation,
    # Inventory
    InventoryItem, StockMovement, Supplier, ProcurementOrder, LogisticsMetric,
    # Advice
    AdviceMessage, Notification,
    # Chatbot
    ChatMessage, ModuleConversation, AgentState
)


# ==================== COMPANY PROFILE SERIALIZERS ====================

class CompanyProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyProfile
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at', 'user')


class CompanyProfileListSerializer(serializers.ModelSerializer):
    """Serializer for listing company profiles (without nested user)"""
    
    class Meta:
        model = CompanyProfile
        fields = [
            'id', 'company_name', 'description', 'number_of_workers', 'sector',
            'company_size', 'country', 'state', 'city', 'website_url',
            'email', 'phone', 'fiscal_year_end_date', 'currency_format',
            'currency_preference', 'logo', 'language', 'number_of_entities',
            'ai_summary', 'created_at', 'updated_at'
        ]


# ==================== ECONOMIC SERIALIZERS ====================

class EconomicMetricSerializer(serializers.ModelSerializer):
    class Meta:
        model = EconomicMetric
        fields = '__all__'


class EconomicNewsSerializer(serializers.ModelSerializer):
    class Meta:
        model = EconomicNews
        fields = '__all__'


class EconomicForecastSerializer(serializers.ModelSerializer):
    class Meta:
        model = EconomicForecast
        fields = '__all__'


class EconomicEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = EconomicEvent
        fields = '__all__'


# ==================== BUSINESS SERIALIZERS ====================

class CustomerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerProfile
        fields = '__all__'
        read_only_fields = ('user',)


class RevenueProjectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = RevenueProjection
        fields = '__all__'
        read_only_fields = ('user',)


class CostStructureSerializer(serializers.ModelSerializer):
    class Meta:
        model = CostStructure
        fields = '__all__'
        read_only_fields = ('user',)


class CashFlowForecastSerializer(serializers.ModelSerializer):
    class Meta:
        model = CashFlowForecast
        fields = '__all__'
        read_only_fields = ('user',)


class KPISerializer(serializers.ModelSerializer):
    class Meta:
        model = KPI
        fields = '__all__'
        read_only_fields = ('user',)


class ScenarioPlanningSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScenarioPlanning
        fields = '__all__'
        read_only_fields = ('user',)


class DocumentSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()
    uploaded_by_name = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()
    category = serializers.SerializerMethodField()
    tags = serializers.SerializerMethodField()

    class Meta:
        model = Document
        fields = '__all__'
        read_only_fields = ('uploaded_by', 'uploaded_at')
        extra_kwargs = {
            'file_type': {'required': False},
            'size': {'required': False},
            'title': {'required': False},
            'metadata': {'required': False},
        }

    def get_file_url(self, obj):
        request = self.context.get('request')
        if not obj.file:
            return None
        if request:
            return request.build_absolute_uri(obj.file.url)
        return obj.file.url

    def get_uploaded_by_name(self, obj):
        if not obj.uploaded_by:
            return None
        full_name = obj.uploaded_by.get_full_name().strip()
        return full_name or obj.uploaded_by.username

    def validate_metadata(self, value):
        if isinstance(value, str):
            try:
                return json.loads(value)
            except json.JSONDecodeError:
                raise serializers.ValidationError('Metadata must be valid JSON.')
        return value

    def get_status(self, obj):
        return obj.get_status()

    def get_category(self, obj):
        return obj.get_category()

    def get_tags(self, obj):
        return obj.get_tags()


class DocumentProcessingEventSerializer(serializers.ModelSerializer):
    document_title = serializers.CharField(source='document.title', read_only=True)

    class Meta:
        model = DocumentProcessingEvent
        fields = '__all__'
        read_only_fields = ('user', 'created_at')


class DocumentStatusUpdateSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=['Processing', 'Processed', 'Failed'])
    message = serializers.CharField(required=False, allow_blank=True, max_length=300)


class InsightSerializer(serializers.ModelSerializer):
    class Meta:
        model = Insight
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')


class KeyAssumptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = KeyAssumption
        fields = '__all__'
        read_only_fields = ('user',)


class KeyRiskSerializer(serializers.ModelSerializer):
    class Meta:
        model = KeyRisk
        fields = '__all__'
        read_only_fields = ('user',)


class CompetitiveMetricSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompetitiveMetric
        fields = '__all__'
        read_only_fields = ('user',)


class ForecastActionItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ForecastActionItem
        fields = '__all__'
        read_only_fields = ('user',)


class ForecastNextStepSerializer(serializers.ModelSerializer):
    class Meta:
        model = ForecastNextStep
        fields = '__all__'
        read_only_fields = ('user',)


class GrowthTrajectorySerializer(serializers.ModelSerializer):
    class Meta:
        model = GrowthTrajectory
        fields = '__all__'
        read_only_fields = ('user',)


class RevenueTargetSerializer(serializers.ModelSerializer):
    class Meta:
        model = RevenueTarget
        fields = '__all__'
        read_only_fields = ('user',)


class BusinessMetricSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusinessMetric
        fields = '__all__'
        read_only_fields = ('user',)


class RevenueProductServiceForecastSerializer(serializers.ModelSerializer):
    class Meta:
        model = RevenueProductServiceForecast
        fields = '__all__'
        read_only_fields = ('user',)


class RevenueRegionalForecastSerializer(serializers.ModelSerializer):
    class Meta:
        model = RevenueRegionalForecast
        fields = '__all__'
        read_only_fields = ('user',)


class RevenueHistoricalComparisonSerializer(serializers.ModelSerializer):
    class Meta:
        model = RevenueHistoricalComparison
        fields = '__all__'
        read_only_fields = ('user',)


class RevenueForecastMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = RevenueForecastMethod
        fields = '__all__'
        read_only_fields = ('user',)


class RevenueScenarioSnapshotSerializer(serializers.ModelSerializer):
    class Meta:
        model = RevenueScenarioSnapshot
        fields = '__all__'
        read_only_fields = ('user',)


class RevenueSegmentBreakdownSerializer(serializers.ModelSerializer):
    class Meta:
        model = RevenueSegmentBreakdown
        fields = '__all__'
        read_only_fields = ('user',)


class CostOverviewMetricSerializer(serializers.ModelSerializer):
    class Meta:
        model = CostOverviewMetric
        fields = '__all__'
        read_only_fields = ('user',)


class CostBudgetScenarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = CostBudgetScenario
        fields = '__all__'
        read_only_fields = ('user',)


class CostMonthlyComparisonSerializer(serializers.ModelSerializer):
    class Meta:
        model = CostMonthlyComparison
        fields = '__all__'
        read_only_fields = ('user',)


class OperationalExpenseCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = OperationalExpenseCategory
        fields = '__all__'
        read_only_fields = ('user',)


class OperationalExpenseItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OperationalExpenseItem
        fields = '__all__'
        read_only_fields = ('user',)


class CostTrendAnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = CostTrendAnalysis
        fields = '__all__'
        read_only_fields = ('user',)


class OverviewProfitLossSnapshotSerializer(serializers.ModelSerializer):
    class Meta:
        model = OverviewProfitLossSnapshot
        fields = '__all__'
        read_only_fields = ('user',)


class OverviewKpiSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = OverviewKpiSummary
        fields = '__all__'
        read_only_fields = ('user',)


class OverviewAlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = OverviewAlert
        fields = '__all__'
        read_only_fields = ('user',)


# ==================== MARKET SERIALIZERS ====================

class MarketSegmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = MarketSegment
        fields = '__all__'


class CompetitorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Competitor
        fields = '__all__'


class MarketTrendSerializer(serializers.ModelSerializer):
    class Meta:
        model = MarketTrend
        fields = '__all__'


# ==================== MARKET ANALYSIS SERIALIZERS ====================

class MarketSizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = MarketSize
        fields = '__all__'


class CustomerSegmentDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerSegmentData
        fields = '__all__'


class DemandForecastSerializer(serializers.ModelSerializer):
    class Meta:
        model = MarketDemandForecast
        fields = '__all__'


class IndustryInsightSerializer(serializers.ModelSerializer):
    class Meta:
        model = IndustryInsight
        fields = '__all__'


class MarketSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = MarketSummary
        fields = '__all__'


class MarketRecommendationSerializer(serializers.ModelSerializer):
    class Meta:
        model = MarketRecommendation
        fields = '__all__'


class MarketActionItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = MarketActionItem
        fields = '__all__'


class MarketNextStepSerializer(serializers.ModelSerializer):
    class Meta:
        model = MarketNextStep
        fields = '__all__'


class SWOTAnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = SWOTAnalysis
        fields = '__all__'


class ProductComparisonSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductComparison
        fields = '__all__'


class MarketPositionSerializer(serializers.ModelSerializer):
    class Meta:
        model = MarketPosition
        fields = '__all__'


class CompetitiveAdvantageSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompetitiveAdvantage
        fields = '__all__'


class MarketStrategyRecommendationSerializer(serializers.ModelSerializer):
    class Meta:
        model = MarketStrategyRecommendation
        fields = '__all__'


class ReportNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReportNote
        fields = '__all__'


class ReportActionPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReportActionPlan
        fields = '__all__'


class ReportEngagementEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReportEngagementEvent
        fields = '__all__'


# ==================== LOAN SERIALIZERS ====================

class LoanEligibilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = LoanEligibility
        fields = '__all__'


class FundingOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = FundingOption
        fields = '__all__'


class LoanComparisonSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoanComparison
        fields = '__all__'


class BusinessPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusinessPlan
        fields = '__all__'


class FundingStrategySerializer(serializers.ModelSerializer):
    class Meta:
        model = FundingStrategy
        fields = '__all__'


class InvestorMatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvestorMatch
        fields = '__all__'


# ==================== REVENUE SERIALIZERS ====================

class RevenueStreamSerializer(serializers.ModelSerializer):
    class Meta:
        model = RevenueStream
        fields = '__all__'


class RevenueScenarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = RevenueScenario
        fields = '__all__'


class ChurnAnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChurnAnalysis
        fields = '__all__'


class UpsellOpportunitySerializer(serializers.ModelSerializer):
    class Meta:
        model = UpsellOpportunity
        fields = '__all__'


class RevenueMetricSerializer(serializers.ModelSerializer):
    class Meta:
        model = RevenueMetric
        fields = '__all__'


class ChannelPerformanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChannelPerformance
        fields = '__all__'


class RevenueOverviewMetricSerializer(serializers.ModelSerializer):
    class Meta:
        model = RevenueOverviewMetric
        fields = '__all__'
        read_only_fields = ('user',)


class RevenueOverviewTopStreamSerializer(serializers.ModelSerializer):
    class Meta:
        model = RevenueOverviewTopStream
        fields = '__all__'
        read_only_fields = ('user',)


class RevenueOverviewChurnRiskSerializer(serializers.ModelSerializer):
    class Meta:
        model = RevenueOverviewChurnRisk
        fields = '__all__'
        read_only_fields = ('user',)


class RevenueOverviewUpsellOpportunitySerializer(serializers.ModelSerializer):
    class Meta:
        model = RevenueOverviewUpsellOpportunity
        fields = '__all__'
        read_only_fields = ('user',)


class RevenueOverviewChannelPerformanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = RevenueOverviewChannelPerformance
        fields = '__all__'
        read_only_fields = ('user',)


class RevenueUpsellInsightSerializer(serializers.ModelSerializer):
    class Meta:
        model = RevenueUpsellInsight
        fields = '__all__'
        read_only_fields = ('user',)


# ==================== FINANCIAL SERIALIZERS ====================

class BudgetForecastSerializer(serializers.ModelSerializer):
    class Meta:
        model = BudgetForecast
        fields = '__all__'


class CashFlowProjectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CashFlowProjection
        fields = '__all__'


class ScenarioTestSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScenarioTest
        fields = '__all__'


class RiskAssessmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = RiskAssessment
        fields = '__all__'


class AdvisoryInsightSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdvisoryInsight
        fields = '__all__'


class LiquidityMetricSerializer(serializers.ModelSerializer):
    class Meta:
        model = LiquidityMetric
        fields = '__all__'


class BudgetValidationSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = BudgetValidationSummary
        fields = '__all__'


class ForecastValidationRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = ForecastValidationRecord
        fields = '__all__'


class BudgetAlignmentMetricSerializer(serializers.ModelSerializer):
    class Meta:
        model = BudgetAlignmentMetric
        fields = '__all__'


class ForecastImprovementAreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ForecastImprovementArea
        fields = '__all__'


class ScenarioResilienceMetricSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScenarioResilienceMetric
        fields = '__all__'


class RecommendedStressTestSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecommendedStressTest
        fields = '__all__'


# ==================== FINANCIAL SERIALIZERS ====================

class FinancialLineItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = FinancialLineItem
        fields = '__all__'
        read_only_fields = ('user',)


# ==================== PRICING SERIALIZERS ====================

class PriceSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = PriceSetting
        fields = '__all__'


class PricingRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = PricingRule
        fields = '__all__'


class PriceForecastSerializer(serializers.ModelSerializer):
    class Meta:
        model = PriceForecast
        fields = '__all__'


class PricingItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PricingItem
        fields = '__all__'


class PricingStrategySerializer(serializers.ModelSerializer):
    class Meta:
        model = PricingStrategy
        fields = '__all__'


class PricingTestSerializer(serializers.ModelSerializer):
    class Meta:
        model = PricingTest
        fields = '__all__'


# ==================== TAX SERIALIZERS ====================

class TaxRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaxRecord
        fields = '__all__'
        read_only_fields = ('user',)


class TaxRecommendationSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaxRecommendation
        fields = '__all__'
        read_only_fields = ('user',)


class ComplianceUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ComplianceUpdate
        fields = '__all__'
        read_only_fields = ('user',)


class TaxPlanningScenarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaxPlanningScenario
        fields = '__all__'
        read_only_fields = ('user',)


class TaxAuditEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaxAuditEvent
        fields = '__all__'
        read_only_fields = ('user',)


class ComplianceObligationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ComplianceObligation
        fields = '__all__'
        read_only_fields = ('user',)


class ComplianceReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = ComplianceReport
        fields = '__all__'
        read_only_fields = ('user',)


# ==================== POLICY SERIALIZERS ====================

class ExternalPolicySerializer(serializers.ModelSerializer):
    class Meta:
        model = ExternalPolicy
        fields = '__all__'


class InternalPolicySerializer(serializers.ModelSerializer):
    class Meta:
        model = InternalPolicy
        fields = '__all__'


class StrategyRecommendationSerializer(serializers.ModelSerializer):
    class Meta:
        model = StrategyRecommendation
        fields = '__all__'


# ==================== INVENTORY SERIALIZERS ====================

class InventoryItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = InventoryItem
        fields = '__all__'


class StockMovementSerializer(serializers.ModelSerializer):
    class Meta:
        model = StockMovement
        fields = '__all__'


class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = '__all__'


class ProcurementOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProcurementOrder
        fields = '__all__'


class LogisticsMetricSerializer(serializers.ModelSerializer):
    class Meta:
        model = LogisticsMetric
        fields = '__all__'


# ==================== CHATBOT SERIALIZERS ====================

class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = '__all__'


class ModuleConversationSerializer(serializers.ModelSerializer):
    messages = ChatMessageSerializer(many=True, read_only=True)
    
    class Meta:
        model = ModuleConversation
        fields = '__all__'


class AgentStateSerializer(serializers.ModelSerializer):
    class Meta:
        model = AgentState
        fields = '__all__'

# ==================== ADVICE SERIALIZERS ====================

class AdviceMessageSerializer(serializers.ModelSerializer):
    """Serializer for Advice Hub messages"""
    class Meta:
        model = AdviceMessage
        fields = [
            'id', 'module_id', 'module_name', 'module_icon', 
            'title', 'content', 'is_read', 'created_at', 'updated_at'
        ]
        read_only_fields = ('id', 'created_at', 'updated_at')


# ==================== NOTIFICATION SERIALIZERS ====================

class NotificationSerializer(serializers.ModelSerializer):
    """Serializer for User Notifications"""
    class Meta:
        model = Notification
        fields = [
            'id', 'sender', 'subject', 'preview', 'body',
            'type', 'priority', 'category', 'is_read', 'starred', 
            'archived', 'created_at', 'updated_at'
        ]
        read_only_fields = ('id', 'created_at', 'updated_at')
