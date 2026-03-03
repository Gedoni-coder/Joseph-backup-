from rest_framework import serializers
from django.contrib.auth.models import User
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


# ==================== COMPANY PROFILE SERIALIZERS ====================

class CompanyProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyProfile
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')

    def create(self, validated_data):
        # Get the user from the request context if available
        user = None
        if self.context.get('request'):
            user = self.context['request'].user
            if user.is_authenticated:
                validated_data['user'] = user
        
        # If user is already in validated_data (from ViewSet), use that
        if 'user' not in validated_data:
            validated_data['user'] = user
            
        return super().create(validated_data)


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


class RevenueProjectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = RevenueProjection
        fields = '__all__'


class CostStructureSerializer(serializers.ModelSerializer):
    class Meta:
        model = CostStructure
        fields = '__all__'


class CashFlowForecastSerializer(serializers.ModelSerializer):
    class Meta:
        model = CashFlowForecast
        fields = '__all__'


class KPISerializer(serializers.ModelSerializer):
    class Meta:
        model = KPI
        fields = '__all__'


class ScenarioPlanningSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScenarioPlanning
        fields = '__all__'


class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = '__all__'
        read_only_fields = ('uploaded_by', 'uploaded_at')


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


# ==================== TAX SERIALIZERS ====================

class TaxRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaxRecord
        fields = '__all__'


class ComplianceReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = ComplianceReport
        fields = '__all__'


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
