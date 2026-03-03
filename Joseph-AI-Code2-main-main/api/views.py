from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend

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

from .serializers import (
    # Company
    CompanyProfileSerializer, CompanyProfileListSerializer,
    # Economic
    EconomicMetricSerializer, EconomicNewsSerializer, EconomicForecastSerializer, EconomicEventSerializer,
    # Business
    CustomerProfileSerializer, RevenueProjectionSerializer, CostStructureSerializer, CashFlowForecastSerializer,
    KPISerializer, ScenarioPlanningSerializer, DocumentSerializer,
    # Market
    MarketSegmentSerializer, CompetitorSerializer, MarketTrendSerializer,
    # Loan
    LoanEligibilitySerializer, FundingOptionSerializer, LoanComparisonSerializer, BusinessPlanSerializer,
    FundingStrategySerializer, InvestorMatchSerializer,
    # Revenue
    RevenueStreamSerializer, RevenueScenarioSerializer, ChurnAnalysisSerializer, UpsellOpportunitySerializer,
    RevenueMetricSerializer, ChannelPerformanceSerializer,
    # Financial
    BudgetForecastSerializer, CashFlowProjectionSerializer, ScenarioTestSerializer, RiskAssessmentSerializer,
    AdvisoryInsightSerializer, LiquidityMetricSerializer,
    # Pricing
    PriceSettingSerializer, PricingRuleSerializer, PriceForecastSerializer,
    # Tax
    TaxRecordSerializer, ComplianceReportSerializer,
    # Policy
    ExternalPolicySerializer, InternalPolicySerializer, StrategyRecommendationSerializer,
    # Inventory
    InventoryItemSerializer, StockMovementSerializer, SupplierSerializer, ProcurementOrderSerializer, LogisticsMetricSerializer,
    # Chatbot
    ChatMessageSerializer, ModuleConversationSerializer, AgentStateSerializer
)


# ==================== COMPANY PROFILE VIEWSET ====================

class CompanyProfileViewSet(viewsets.ModelViewSet):
    queryset = CompanyProfile.objects.all()
    serializer_class = CompanyProfileSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['company_name', 'sector', 'description']
    ordering_fields = ['company_name', 'created_at', 'updated_at']

    def get_serializer_class(self):
        if self.action == 'list':
            return CompanyProfileListSerializer
        return CompanyProfileSerializer

    def get_queryset(self):
        # Allow unauthenticated access for onboarding
        user = self.request.user
        if user.is_authenticated:
            return CompanyProfile.objects.filter(user=user)
        # For unauthenticated users, return profiles without user (onboarding)
        return CompanyProfile.objects.filter(user__isnull=True)

    def perform_create(self, serializer):
        # If user is authenticated, use them; otherwise create without user
        user = self.request.user
        if user.is_authenticated:
            serializer.save(user=user)
        else:
            # For onboarding without auth, create without user
            serializer.save(user=None)


# ==================== ECONOMIC VIEWSETS ====================

class EconomicMetricViewSet(viewsets.ModelViewSet):
    queryset = EconomicMetric.objects.all()
    serializer_class = EconomicMetricSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['context', 'category', 'trend']
    search_fields = ['name', 'category']
    ordering_fields = ['name', 'value', 'created_at']


class EconomicNewsViewSet(viewsets.ModelViewSet):
    queryset = EconomicNews.objects.all()
    serializer_class = EconomicNewsSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['context', 'category', 'impact']
    search_fields = ['title', 'summary', 'source']
    ordering_fields = ['timestamp', 'title']


class EconomicForecastViewSet(viewsets.ModelViewSet):
    queryset = EconomicForecast.objects.all()
    serializer_class = EconomicForecastSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['context', 'period']
    ordering_fields = ['period', 'indicator']


class EconomicEventViewSet(viewsets.ModelViewSet):
    queryset = EconomicEvent.objects.all()
    serializer_class = EconomicEventSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['context', 'category', 'impact']
    search_fields = ['title', 'description']
    ordering_fields = ['date', 'title']


# ==================== BUSINESS VIEWSETS ====================

class CustomerProfileViewSet(viewsets.ModelViewSet):
    queryset = CustomerProfile.objects.all()
    serializer_class = CustomerProfileSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['segment', 'risk_score']
    search_fields = ['name', 'email']


class RevenueProjectionViewSet(viewsets.ModelViewSet):
    queryset = RevenueProjection.objects.all()
    serializer_class = RevenueProjectionSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['period']
    ordering_fields = ['period', 'projected_revenue']


class CostStructureViewSet(viewsets.ModelViewSet):
    queryset = CostStructure.objects.all()
    serializer_class = CostStructureSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['category', 'period']
    ordering_fields = ['category', 'amount']


class CashFlowForecastViewSet(viewsets.ModelViewSet):
    queryset = CashFlowForecast.objects.all()
    serializer_class = CashFlowForecastSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['period']
    ordering_fields = ['period', 'net_position']


class KPIViewSet(viewsets.ModelViewSet):
    queryset = KPI.objects.all()
    serializer_class = KPISerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['status']
    ordering_fields = ['name', 'current_value']


class ScenarioPlanningViewSet(viewsets.ModelViewSet):
    queryset = ScenarioPlanning.objects.all()
    serializer_class = ScenarioPlanningSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['type']
    ordering_fields = ['type', 'probability']


class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['file_type']
    ordering_fields = ['uploaded_at', 'title']

    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user if self.request.user.is_authenticated else None)


# ==================== MARKET VIEWSETS ====================

class MarketSegmentViewSet(viewsets.ModelViewSet):
    queryset = MarketSegment.objects.all()
    serializer_class = MarketSegmentSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'size', 'growth_rate']


class CompetitorViewSet(viewsets.ModelViewSet):
    queryset = Competitor.objects.all()
    serializer_class = CompetitorSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'strengths', 'weaknesses']
    ordering_fields = ['name', 'market_share']


class MarketTrendViewSet(viewsets.ModelViewSet):
    queryset = MarketTrend.objects.all()
    serializer_class = MarketTrendSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['category', 'impact']
    search_fields = ['name', 'description']


# ==================== LOAN VIEWSETS ====================

class LoanEligibilityViewSet(viewsets.ModelViewSet):
    queryset = LoanEligibility.objects.all()
    serializer_class = LoanEligibilitySerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['status', 'business_type']
    ordering_fields = ['eligible_amount', 'interest_rate']


class FundingOptionViewSet(viewsets.ModelViewSet):
    queryset = FundingOption.objects.all()
    serializer_class = FundingOptionSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['type']
    search_fields = ['name', 'description']


class LoanComparisonViewSet(viewsets.ModelViewSet):
    queryset = LoanComparison.objects.all()
    serializer_class = LoanComparisonSerializer
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['interest_rate', 'monthly_payment', 'amount']


class BusinessPlanViewSet(viewsets.ModelViewSet):
    queryset = BusinessPlan.objects.all()
    serializer_class = BusinessPlanSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['industry']
    search_fields = ['title', 'summary']


class FundingStrategyViewSet(viewsets.ModelViewSet):
    queryset = FundingStrategy.objects.all()
    serializer_class = FundingStrategySerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['risk_level']
    ordering_fields = ['name', 'risk_level']


class InvestorMatchViewSet(viewsets.ModelViewSet):
    queryset = InvestorMatch.objects.all()
    serializer_class = InvestorMatchSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['investor_name', 'sector_focus']
    ordering_fields = ['investment_range_min']


# ==================== REVENUE VIEWSETS ====================

class RevenueStreamViewSet(viewsets.ModelViewSet):
    queryset = RevenueStream.objects.all()
    serializer_class = RevenueStreamSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['type']
    ordering_fields = ['name', 'current_revenue']


class RevenueScenarioViewSet(viewsets.ModelViewSet):
    queryset = RevenueScenario.objects.all()
    serializer_class = RevenueScenarioSerializer
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['probability', 'projected_revenue']


class ChurnAnalysisViewSet(viewsets.ModelViewSet):
    queryset = ChurnAnalysis.objects.all()
    serializer_class = ChurnAnalysisSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['segment', 'period']
    ordering_fields = ['churn_rate', 'risk_score']


class UpsellOpportunityViewSet(viewsets.ModelViewSet):
    queryset = UpsellOpportunity.objects.all()
    serializer_class = UpsellOpportunitySerializer
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['potential_revenue', 'probability']


class RevenueMetricViewSet(viewsets.ModelViewSet):
    queryset = RevenueMetric.objects.all()
    serializer_class = RevenueMetricSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['period']
    ordering_fields = ['value', 'change_percent']


class ChannelPerformanceViewSet(viewsets.ModelViewSet):
    queryset = ChannelPerformance.objects.all()
    serializer_class = ChannelPerformanceSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['period']
    ordering_fields = ['revenue', 'conversion_rate']


# ==================== FINANCIAL VIEWSETS ====================

class BudgetForecastViewSet(viewsets.ModelViewSet):
    queryset = BudgetForecast.objects.all()
    serializer_class = BudgetForecastSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['category', 'period']
    ordering_fields = ['category', 'amount']


class CashFlowProjectionViewSet(viewsets.ModelViewSet):
    queryset = CashFlowProjection.objects.all()
    serializer_class = CashFlowProjectionSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['type', 'period']
    ordering_fields = ['amount', 'period']


class ScenarioTestViewSet(viewsets.ModelViewSet):
    queryset = ScenarioTest.objects.all()
    serializer_class = ScenarioTestSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['type']
    ordering_fields = ['probability']


class RiskAssessmentViewSet(viewsets.ModelViewSet):
    queryset = RiskAssessment.objects.all()
    serializer_class = RiskAssessmentSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['level', 'impact']
    ordering_fields = ['level', 'category']


class AdvisoryInsightViewSet(viewsets.ModelViewSet):
    queryset = AdvisoryInsight.objects.all()
    serializer_class = AdvisoryInsightSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'priority']
    search_fields = ['title', 'description']
    ordering_fields = ['priority', 'created_at']


class LiquidityMetricViewSet(viewsets.ModelViewSet):
    queryset = LiquidityMetric.objects.all()
    serializer_class = LiquidityMetricSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['period']
    ordering_fields = ['name', 'value']


# ==================== PRICING VIEWSETS ====================

class PriceSettingViewSet(viewsets.ModelViewSet):
    queryset = PriceSetting.objects.all()
    serializer_class = PriceSettingSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['strategy']
    ordering_fields = ['product', 'current_price']


class PricingRuleViewSet(viewsets.ModelViewSet):
    queryset = PricingRule.objects.all()
    serializer_class = PricingRuleSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['condition', 'is_active']
    ordering_fields = ['name']


class PriceForecastViewSet(viewsets.ModelViewSet):
    queryset = PriceForecast.objects.all()
    serializer_class = PriceForecastSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['period']
    ordering_fields = ['product', 'forecast_price']


# ==================== TAX VIEWSETS ====================

class TaxRecordViewSet(viewsets.ModelViewSet):
    queryset = TaxRecord.objects.all()
    serializer_class = TaxRecordSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['tax_type', 'status', 'period']
    ordering_fields = ['due_date', 'amount']


class ComplianceReportViewSet(viewsets.ModelViewSet):
    queryset = ComplianceReport.objects.all()
    serializer_class = ComplianceReportSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['status', 'period']
    ordering_fields = ['created_at', 'period']


# ==================== POLICY VIEWSETS ====================

class ExternalPolicyViewSet(viewsets.ModelViewSet):
    queryset = ExternalPolicy.objects.all()
    serializer_class = ExternalPolicySerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'impact']
    search_fields = ['title', 'description', 'source']
    ordering_fields = ['effective_date', 'title']


class InternalPolicyViewSet(viewsets.ModelViewSet):
    queryset = InternalPolicy.objects.all()
    serializer_class = InternalPolicySerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'status']
    search_fields = ['title', 'description']
    ordering_fields = ['effective_date', 'title']


class StrategyRecommendationViewSet(viewsets.ModelViewSet):
    queryset = StrategyRecommendation.objects.all()
    serializer_class = StrategyRecommendationSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'priority', 'impact']
    search_fields = ['title', 'description']
    ordering_fields = ['priority', 'created_at']


# ==================== INVENTORY VIEWSETS ====================

class InventoryItemViewSet(viewsets.ModelViewSet):
    queryset = InventoryItem.objects.all()
    serializer_class = InventoryItemSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['location']
    search_fields = ['name', 'sku']
    ordering_fields = ['name', 'quantity', 'sku']


class StockMovementViewSet(viewsets.ModelViewSet):
    queryset = StockMovement.objects.all()
    serializer_class = StockMovementSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['type']
    ordering_fields = ['date', 'quantity']


class SupplierViewSet(viewsets.ModelViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'contact_name', 'email']
    ordering_fields = ['name', 'rating']


class ProcurementOrderViewSet(viewsets.ModelViewSet):
    queryset = ProcurementOrder.objects.all()
    serializer_class = ProcurementOrderSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['status']
    ordering_fields = ['order_date', 'total']


class LogisticsMetricViewSet(viewsets.ModelViewSet):
    queryset = LogisticsMetric.objects.all()
    serializer_class = LogisticsMetricSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['period']
    ordering_fields = ['name', 'value']


# ==================== CHATBOT VIEWSETS ====================

class ChatMessageViewSet(viewsets.ModelViewSet):
    queryset = ChatMessage.objects.all()
    serializer_class = ChatMessageSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['role']
    ordering_fields = ['timestamp']


class ModuleConversationViewSet(viewsets.ModelViewSet):
    queryset = ModuleConversation.objects.all()
    serializer_class = ModuleConversationSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['module']
    search_fields = ['title', 'module']

    @action(detail=False, methods=['get'])
    def by_module(self, request):
        module = request.query_params.get('module')
        if module:
            conversations = self.queryset.filter(module=module)
            serializer = self.get_serializer(conversations, many=True)
            return Response(serializer.data)
        return Response([])


class AgentStateViewSet(viewsets.ModelViewSet):
    queryset = AgentState.objects.all()
    serializer_class = AgentStateSerializer

    @action(detail=False, methods=['get'])
    def status(self, request):
        try:
            agent = AgentState.objects.first()
            if agent:
                serializer = self.get_serializer(agent)
                return Response(serializer.data)
            return Response({'is_running': False, 'pending_tasks': 0})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['post'])
    def start(self, request):
        agent, _ = AgentState.objects.get_or_create(name='main')
        agent.is_running = True
        agent.save()
        serializer = self.get_serializer(agent)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def stop(self, request):
        agent, _ = AgentState.objects.get_or_create(name='main')
        agent.is_running = False
        agent.save()
        serializer = self.get_serializer(agent)
        return Response(serializer.data)
