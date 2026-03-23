from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework import filters
from rest_framework.authentication import TokenAuthentication, SessionAuthentication
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, AllowAny
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django_filters.rest_framework import DjangoFilterBackend
import json
import os
from urllib import request as urllib_request
from urllib import error as urllib_error
from django.utils import timezone
from agent.document_processing import process_stored_document

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

from .serializers import (
    # Company
    CompanyProfileSerializer, CompanyProfileListSerializer,
    # Economic
    EconomicMetricSerializer, EconomicNewsSerializer, EconomicForecastSerializer, EconomicEventSerializer,
    # Business
    CustomerProfileSerializer, RevenueProjectionSerializer, CostStructureSerializer, CashFlowForecastSerializer,
    KPISerializer, ScenarioPlanningSerializer, DocumentSerializer,
    DocumentProcessingEventSerializer, DocumentStatusUpdateSerializer, InsightSerializer,
    KeyAssumptionSerializer, KeyRiskSerializer, CompetitiveMetricSerializer, ForecastActionItemSerializer,
    ForecastNextStepSerializer, GrowthTrajectorySerializer, RevenueTargetSerializer, BusinessMetricSerializer,
    RevenueProductServiceForecastSerializer, RevenueRegionalForecastSerializer, RevenueHistoricalComparisonSerializer,
    RevenueForecastMethodSerializer, RevenueScenarioSnapshotSerializer, RevenueSegmentBreakdownSerializer,
    CostOverviewMetricSerializer, CostBudgetScenarioSerializer, CostMonthlyComparisonSerializer,
    OperationalExpenseCategorySerializer, OperationalExpenseItemSerializer, CostTrendAnalysisSerializer,
    OverviewProfitLossSnapshotSerializer, OverviewKpiSummarySerializer, OverviewAlertSerializer,
    # Market
    MarketSegmentSerializer, CompetitorSerializer, MarketTrendSerializer,
    MarketSizeSerializer, CustomerSegmentDataSerializer, DemandForecastSerializer, IndustryInsightSerializer,
    MarketSummarySerializer, MarketRecommendationSerializer, MarketActionItemSerializer, MarketNextStepSerializer,
    SWOTAnalysisSerializer, ProductComparisonSerializer, MarketPositionSerializer, CompetitiveAdvantageSerializer,
    MarketStrategyRecommendationSerializer, ReportNoteSerializer,
    ReportActionPlanSerializer, ReportEngagementEventSerializer,
    # Loan
    LoanEligibilitySerializer, FundingOptionSerializer, LoanComparisonSerializer, BusinessPlanSerializer,
    FundingStrategySerializer, InvestorMatchSerializer,
    # Revenue
    RevenueStreamSerializer, RevenueScenarioSerializer, ChurnAnalysisSerializer, UpsellOpportunitySerializer,
    RevenueMetricSerializer, ChannelPerformanceSerializer,
    RevenueOverviewMetricSerializer, RevenueOverviewTopStreamSerializer,
    RevenueOverviewChurnRiskSerializer, RevenueOverviewUpsellOpportunitySerializer,
    RevenueOverviewChannelPerformanceSerializer, RevenueUpsellInsightSerializer,
    # Financial
    FinancialLineItemSerializer, BudgetForecastSerializer, CashFlowProjectionSerializer, ScenarioTestSerializer, RiskAssessmentSerializer,
    AdvisoryInsightSerializer, LiquidityMetricSerializer, BudgetValidationSummarySerializer,
    ForecastValidationRecordSerializer, BudgetAlignmentMetricSerializer,
    ForecastImprovementAreaSerializer, ScenarioResilienceMetricSerializer,
    RecommendedStressTestSerializer,
    # Pricing
    PriceSettingSerializer, PricingRuleSerializer, PriceForecastSerializer,
    PricingItemSerializer, PricingStrategySerializer, PricingTestSerializer,
    # Tax
    TaxRecordSerializer, TaxRecommendationSerializer, ComplianceUpdateSerializer,
    TaxPlanningScenarioSerializer, TaxAuditEventSerializer, ComplianceObligationSerializer,
    ComplianceReportSerializer,
    # Policy
    ExternalPolicySerializer, InternalPolicySerializer, StrategyRecommendationSerializer,
    # Inventory
    InventoryItemSerializer, StockMovementSerializer, SupplierSerializer, ProcurementOrderSerializer, LogisticsMetricSerializer,
    # Advice
    AdviceMessageSerializer, NotificationSerializer,
    # Chatbot
    ChatMessageSerializer, ModuleConversationSerializer, AgentStateSerializer
)


# ==================== COMPANY PROFILE VIEWSET ====================

class CompanyProfileViewSet(viewsets.ModelViewSet):
    queryset = CompanyProfile.objects.all()
    serializer_class = CompanyProfileSerializer
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['company_name', 'sector', 'description']
    ordering_fields = ['company_name', 'created_at', 'updated_at']

    def get_serializer_class(self):
        if self.action == 'list':
            return CompanyProfileListSerializer
        return CompanyProfileSerializer

    def get_queryset(self):
        return CompanyProfile.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


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
    serializer_class = CustomerProfileSerializer
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['segment']
    search_fields = ['segment']

    def get_queryset(self):
        return CustomerProfile.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class RevenueProjectionViewSet(viewsets.ModelViewSet):
    serializer_class = RevenueProjectionSerializer
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['period']
    ordering_fields = ['period', 'projected_revenue']

    def get_queryset(self):
        return RevenueProjection.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CostStructureViewSet(viewsets.ModelViewSet):
    serializer_class = CostStructureSerializer
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['category', 'period']
    ordering_fields = ['category', 'amount']

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return CostStructure.objects.filter(user=self.request.user)
        return CostStructure.objects.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CashFlowForecastViewSet(viewsets.ModelViewSet):
    serializer_class = CashFlowForecastSerializer
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['period']
    ordering_fields = ['period', 'net_position']

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return CashFlowForecast.objects.filter(user=self.request.user)
        return CashFlowForecast.objects.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class KPIViewSet(viewsets.ModelViewSet):
    serializer_class = KPISerializer
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['status', 'category', 'impact', 'driver_type', 'data_source']
    ordering_fields = ['name', 'current_value', 'target_value']

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return KPI.objects.filter(user=self.request.user)
        return KPI.objects.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ScenarioPlanningViewSet(viewsets.ModelViewSet):
    serializer_class = ScenarioPlanningSerializer
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['type']
    ordering_fields = ['type', 'probability']

    def get_queryset(self):
        return ScenarioPlanning.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class DocumentViewSet(viewsets.ModelViewSet):
    serializer_class = DocumentSerializer
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['file_type']
    ordering_fields = ['uploaded_at', 'title']

    def get_queryset(self):
        queryset = Document.objects.filter(uploaded_by=self.request.user)

        status_value = self.request.query_params.get('status')
        category_value = self.request.query_params.get('category')
        tag_value = self.request.query_params.get('tag')

        if status_value:
            queryset = queryset.filter(metadata__status=status_value)
        if category_value:
            queryset = queryset.filter(metadata__category=category_value)
        if tag_value:
            queryset = queryset.filter(metadata__tags__contains=[tag_value])

        return queryset

    def _append_event(self, document, stage, level, message, details=None):
        DocumentProcessingEvent.objects.create(
            document=document,
            user=self.request.user,
            stage=stage,
            level=level,
            message=message,
            details=details or {},
        )

    def _status_to_stage(self, status_value):
        if status_value == 'Processed':
            return 'complete'
        if status_value == 'Failed':
            return 'error'
        return 'ingest'

    def _status_to_level(self, status_value):
        if status_value == 'Processed':
            return 'success'
        if status_value == 'Failed':
            return 'error'
        return 'info'

    def _run_processing_pipeline(self, document):
        metadata = document.metadata if isinstance(document.metadata, dict) else {}

        try:
            metadata['status'] = 'Processing'
            document.metadata = metadata
            document.save(update_fields=['metadata'])

            self._append_event(
                document,
                stage='ingest',
                level='info',
                message='Ingesting document payload for processing.',
                details={'file_type': document.file_type, 'size': document.size},
            )

            result = process_stored_document(document, user_id=str(self.request.user.id))
            pipeline_result = result['pipeline_result']

            stage_timings = {
                stage.stage: stage.duration_ms
                for stage in pipeline_result.stage_results
            }

            self._append_event(
                document,
                stage='extract',
                level='success',
                message='Extraction stage completed.',
                details={
                    'char_count': len(result['extracted_text'] or ''),
                    'word_count': len((result['extracted_text'] or '').split()),
                    'duration_ms': stage_timings.get('EXTRACT'),
                },
            )

            self._append_event(
                document,
                stage='normalize',
                level='success',
                message='Normalized extracted metadata.',
                details={'duration_ms': stage_timings.get('NORMALIZE')},
            )

            metadata_update = result['metadata_update']
            document.extracted_text = result['extracted_text']
            document.metadata = metadata_update
            document.save(update_fields=['extracted_text', 'metadata'])

            insight_payload = result['insights']
            Insight.objects.update_or_create(
                document=document,
                defaults={
                    'summary': insight_payload['summary'],
                    'key_points': insight_payload['key_points'],
                    'keywords': insight_payload['keywords'],
                    'entities': insight_payload['entities'],
                },
            )

            self._append_event(
                document,
                stage='metadata',
                level='info',
                message='Generated document insights and metadata.',
                details={
                    'category': metadata_update.get('category'),
                    'keywords': insight_payload['keywords'][:10],
                    'duration_ms': stage_timings.get('METADATA'),
                },
            )

            self._append_event(
                document,
                stage='storage',
                level='success',
                message='Document stored and indexed.',
                details={
                    'status': 'Processed',
                    'duration_ms': stage_timings.get('STORAGE'),
                },
            )
            self._append_event(
                document,
                stage='trigger',
                level='info',
                message='Triggered downstream document manager sync.',
                details={
                    'surfaces': ['upload-center', 'document-manager', 'processing-pipeline'],
                    'duration_ms': stage_timings.get('TRIGGER'),
                },
            )
            self._append_event(
                document,
                stage='complete',
                level='success',
                message='Pipeline complete.',
                details={
                    'status': 'Processed',
                    'total_duration_ms': pipeline_result.total_duration_ms,
                },
            )
        except Exception as exc:
            metadata['status'] = 'Failed'
            metadata['error'] = str(exc)
            document.metadata = metadata
            document.save(update_fields=['metadata'])
            self._append_event(
                document,
                stage='error',
                level='error',
                message='Pipeline failed during processing.',
                details={'error': str(exc)},
            )

    def perform_create(self, serializer):
        file_obj = self.request.FILES.get('file')
        metadata = self.request.data.get('metadata', {})
        if isinstance(metadata, str):
            try:
                metadata = json.loads(metadata)
            except json.JSONDecodeError:
                metadata = {}

        file_name = file_obj.name if file_obj else 'untitled'
        ext = file_name.split('.')[-1].lower() if '.' in file_name else 'other'
        mapped_type = {
            'pdf': 'pdf',
            'xls': 'excel',
            'xlsx': 'excel',
            'csv': 'excel',
            'doc': 'word',
            'docx': 'word',
            'png': 'image',
            'jpg': 'image',
            'jpeg': 'image',
            'gif': 'image',
            'webp': 'image',
        }.get(ext, 'other')

        metadata.setdefault('category', 'General')
        metadata.setdefault('tags', [ext])
        metadata.setdefault('status', 'Processing')

        instance = serializer.save(
            uploaded_by=self.request.user,
            title=self.request.data.get('title') or file_name,
            size=int(self.request.data.get('size') or (file_obj.size if file_obj else 0)),
            file_type=self.request.data.get('file_type') or mapped_type,
            metadata=metadata,
        )
        self._append_event(
            instance,
            stage='uploaded',
            level='info',
            message='Document uploaded and queued for processing.',
            details={'status': metadata.get('status')},
        )
        self._run_processing_pipeline(instance)

    @action(detail=True, methods=['get'], url_path='insights')
    def insights(self, request, pk=None):
        document = self.get_object()
        try:
            insight = document.insight
        except Insight.DoesNotExist:
            return Response(
                {
                    'detail': 'Insights not ready yet for this document.',
                    'status': document.get_status(),
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        return Response(InsightSerializer(insight).data)

    @action(detail=True, methods=['post'], url_path='reprocess')
    def reprocess(self, request, pk=None):
        document = self.get_object()
        self._run_processing_pipeline(document)
        payload = {
            'document': DocumentSerializer(document, context={'request': request}).data,
        }
        if hasattr(document, 'insight'):
            payload['insights'] = InsightSerializer(document.insight).data
        return Response(payload, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], url_path='status')
    def update_status(self, request, pk=None):
        document = self.get_object()
        serializer = DocumentStatusUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        metadata = document.metadata if isinstance(document.metadata, dict) else {}
        new_status = serializer.validated_data['status']
        metadata['status'] = new_status
        document.metadata = metadata
        document.save(update_fields=['metadata'])

        stage = self._status_to_stage(new_status)
        level = self._status_to_level(new_status)
        message = serializer.validated_data.get('message') or f'Document status changed to {new_status}.'
        self._append_event(document, stage=stage, level=level, message=message, details={'status': new_status})

        return Response(DocumentSerializer(document, context={'request': request}).data)

    @action(detail=True, methods=['get'], url_path='events')
    def events(self, request, pk=None):
        document = self.get_object()
        queryset = DocumentProcessingEvent.objects.filter(document=document, user=request.user)
        serializer = DocumentProcessingEventSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='events')
    def all_events(self, request):
        queryset = DocumentProcessingEvent.objects.filter(user=request.user).select_related('document')[:200]
        serializer = DocumentProcessingEventSerializer(queryset, many=True)
        return Response(serializer.data)


class KeyAssumptionViewSet(viewsets.ModelViewSet):
    serializer_class = KeyAssumptionSerializer
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return KeyAssumption.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class KeyRiskViewSet(viewsets.ModelViewSet):
    serializer_class = KeyRiskSerializer
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['level']

    def get_queryset(self):
        return KeyRisk.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CompetitiveMetricViewSet(viewsets.ModelViewSet):
    serializer_class = CompetitiveMetricSerializer
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CompetitiveMetric.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ForecastActionItemViewSet(viewsets.ModelViewSet):
    serializer_class = ForecastActionItemSerializer
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['priority']
    ordering_fields = ['index', 'priority']

    def get_queryset(self):
        return ForecastActionItem.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ForecastNextStepViewSet(viewsets.ModelViewSet):
    serializer_class = ForecastNextStepSerializer
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['index']

    def get_queryset(self):
        return ForecastNextStep.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class GrowthTrajectoryViewSet(viewsets.ModelViewSet):
    serializer_class = GrowthTrajectorySerializer
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['quarter']

    def get_queryset(self):
        return GrowthTrajectory.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class RevenueTargetViewSet(viewsets.ModelViewSet):
    serializer_class = RevenueTargetSerializer
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return RevenueTarget.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class BusinessMetricViewSet(viewsets.ModelViewSet):
    serializer_class = BusinessMetricSerializer
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'status', 'trend']
    search_fields = ['metric', 'category']
    ordering_fields = ['category', 'metric', 'status']

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return BusinessMetric.objects.filter(user=self.request.user)
        return BusinessMetric.objects.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class RevenueProductServiceForecastViewSet(viewsets.ModelViewSet):
    serializer_class = RevenueProductServiceForecastSerializer
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['sort_order', 'name', 'projection_year']

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return RevenueProductServiceForecast.objects.filter(user=self.request.user)
        return RevenueProductServiceForecast.objects.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class RevenueRegionalForecastViewSet(viewsets.ModelViewSet):
    serializer_class = RevenueRegionalForecastSerializer
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['sort_order', 'region']

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return RevenueRegionalForecast.objects.filter(user=self.request.user)
        return RevenueRegionalForecast.objects.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class RevenueHistoricalComparisonViewSet(viewsets.ModelViewSet):
    serializer_class = RevenueHistoricalComparisonSerializer
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['sort_order', 'label']

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return RevenueHistoricalComparison.objects.filter(user=self.request.user)
        return RevenueHistoricalComparison.objects.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class RevenueForecastMethodViewSet(viewsets.ModelViewSet):
    serializer_class = RevenueForecastMethodSerializer
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['sort_order', 'name']

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return RevenueForecastMethod.objects.filter(user=self.request.user)
        return RevenueForecastMethod.objects.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class RevenueScenarioSnapshotViewSet(viewsets.ModelViewSet):
    serializer_class = RevenueScenarioSnapshotSerializer
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['sort_order', 'scenario', 'probability']

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return RevenueScenarioSnapshot.objects.filter(user=self.request.user)
        return RevenueScenarioSnapshot.objects.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class RevenueSegmentBreakdownViewSet(viewsets.ModelViewSet):
    serializer_class = RevenueSegmentBreakdownSerializer
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['sort_order', 'segment']

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return RevenueSegmentBreakdown.objects.filter(user=self.request.user)
        return RevenueSegmentBreakdown.objects.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CostOverviewMetricViewSet(viewsets.ModelViewSet):
    serializer_class = CostOverviewMetricSerializer
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['sort_order', 'cost_type']

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return CostOverviewMetric.objects.filter(user=self.request.user)
        return CostOverviewMetric.objects.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CostBudgetScenarioViewSet(viewsets.ModelViewSet):
    serializer_class = CostBudgetScenarioSerializer
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['sort_order', 'label']

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return CostBudgetScenario.objects.filter(user=self.request.user)
        return CostBudgetScenario.objects.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CostMonthlyComparisonViewSet(viewsets.ModelViewSet):
    serializer_class = CostMonthlyComparisonSerializer
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['sort_order', 'month']

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return CostMonthlyComparison.objects.filter(user=self.request.user)
        return CostMonthlyComparison.objects.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class OperationalExpenseCategoryViewSet(viewsets.ModelViewSet):
    serializer_class = OperationalExpenseCategorySerializer
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['sort_order', 'name']

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return OperationalExpenseCategory.objects.filter(user=self.request.user)
        return OperationalExpenseCategory.objects.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class OperationalExpenseItemViewSet(viewsets.ModelViewSet):
    serializer_class = OperationalExpenseItemSerializer
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['category']
    ordering_fields = ['sort_order', 'name']

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return OperationalExpenseItem.objects.filter(user=self.request.user)
        return OperationalExpenseItem.objects.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CostTrendAnalysisViewSet(viewsets.ModelViewSet):
    serializer_class = CostTrendAnalysisSerializer
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['sort_order', 'title']

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return CostTrendAnalysis.objects.filter(user=self.request.user)
        return CostTrendAnalysis.objects.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class OverviewProfitLossSnapshotViewSet(viewsets.ModelViewSet):
    serializer_class = OverviewProfitLossSnapshotSerializer
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['sort_order', 'period_label']

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return OverviewProfitLossSnapshot.objects.filter(user=self.request.user)
        return OverviewProfitLossSnapshot.objects.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class OverviewKpiSummaryViewSet(viewsets.ModelViewSet):
    serializer_class = OverviewKpiSummarySerializer
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['sort_order']

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return OverviewKpiSummary.objects.filter(user=self.request.user)
        return OverviewKpiSummary.objects.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class OverviewAlertViewSet(viewsets.ModelViewSet):
    serializer_class = OverviewAlertSerializer
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['sort_order', 'created_at']

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return OverviewAlert.objects.filter(user=self.request.user)
        return OverviewAlert.objects.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


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
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['competitor_type', 'market_position']
    search_fields = ['name', 'strengths', 'weaknesses', 'pricing_model']
    ordering_fields = ['name', 'market_share', 'current_price', 'updated_at']

    @action(detail=False, methods=['post'], url_path='refresh-data')
    def refresh_data(self, request):
        competitors = list(self.get_queryset())
        for competitor in competitors:
            competitor.save(update_fields=['updated_at'])

        return Response({
            'refreshed_count': len(competitors),
            'refreshed_at': timezone.now(),
        }, status=status.HTTP_200_OK)

    @action(detail=True, methods=['get'], url_path='details')
    def details(self, request, pk=None):
        competitor = self.get_object()
        serializer = self.get_serializer(competitor)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['get'], url_path='compare-features')
    def compare_features(self, request, pk=None):
        competitor = self.get_object()
        all_competitors = Competitor.objects.exclude(pk=competitor.pk)

        avg_price = 0
        avg_market_share = 0
        total_competitors = all_competitors.count()

        if total_competitors > 0:
            avg_price = sum(float(c.current_price or 0) for c in all_competitors) / total_competitors
            avg_market_share = sum(float(c.market_share or 0) for c in all_competitors) / total_competitors

        response_payload = {
            'competitor': competitor.name,
            'position': competitor.market_position,
            'current_price': float(competitor.current_price or 0),
            'market_share': float(competitor.market_share or 0),
            'price_vs_average': round(float(competitor.current_price or 0) - avg_price, 2),
            'market_share_vs_average': round(float(competitor.market_share or 0) - avg_market_share, 2),
            'feature_highlights': competitor.feature_highlights or [],
            'pricing_model': competitor.pricing_model,
            'pricing_summary': competitor.pricing_summary,
        }

        return Response(response_payload, status=status.HTTP_200_OK)


class MarketTrendViewSet(viewsets.ModelViewSet):
    queryset = MarketTrend.objects.all()
    serializer_class = MarketTrendSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['category', 'impact']
    search_fields = ['name', 'description']


# ==================== MARKET ANALYSIS VIEWSETS ====================

class MarketSizeViewSet(viewsets.ModelViewSet):
    queryset = MarketSize.objects.all()
    serializer_class = MarketSizeSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['tam', 'growth_rate', '-created_at']


class CustomerSegmentDataViewSet(viewsets.ModelViewSet):
    queryset = CustomerSegmentData.objects.all()
    serializer_class = CustomerSegmentDataSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'characteristics']
    ordering_fields = ['priority', 'growth_rate', '-created_at']


class DemandForecastViewSet(viewsets.ModelViewSet):
    queryset = MarketDemandForecast.objects.all()
    serializer_class = DemandForecastSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['segment', 'period']
    ordering_fields = ['period', 'confidence_level']


class IndustryInsightViewSet(viewsets.ModelViewSet):
    queryset = IndustryInsight.objects.all()
    serializer_class = IndustryInsightSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['insight_type', 'impact_level']
    search_fields = ['title', 'description']


class MarketSummaryViewSet(viewsets.ModelViewSet):
    queryset = MarketSummary.objects.all()
    serializer_class = MarketSummarySerializer


class MarketRecommendationViewSet(viewsets.ModelViewSet):
    queryset = MarketRecommendation.objects.all()
    serializer_class = MarketRecommendationSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['priority']
    ordering_fields = ['-priority', '-created_at']


class MarketActionItemViewSet(viewsets.ModelViewSet):
    queryset = MarketActionItem.objects.all()
    serializer_class = MarketActionItemSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['priority']
    search_fields = ['title', 'description', 'owner']


class MarketNextStepViewSet(viewsets.ModelViewSet):
    queryset = MarketNextStep.objects.all()
    serializer_class = MarketNextStepSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['status']
    search_fields = ['step', 'owner']


class SWOTAnalysisViewSet(viewsets.ModelViewSet):
    queryset = SWOTAnalysis.objects.all()
    serializer_class = SWOTAnalysisSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['competitor_name']
    ordering_fields = ['-overall_score']


class ProductComparisonViewSet(viewsets.ModelViewSet):
    queryset = ProductComparison.objects.all()
    serializer_class = ProductComparisonSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['product_name', 'competitor_products']
    ordering_fields = ['-created_at']


class MarketPositionViewSet(viewsets.ModelViewSet):
    queryset = MarketPosition.objects.all()
    serializer_class = MarketPositionSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['market_segment', 'our_position']


class CompetitiveAdvantageViewSet(viewsets.ModelViewSet):
    queryset = CompetitiveAdvantage.objects.all()
    serializer_class = CompetitiveAdvantageSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['advantage_type', 'strength_level']
    search_fields = ['advantage', 'description']


class StrategyRecommendationAnalysisViewSet(viewsets.ModelViewSet):
    queryset = MarketStrategyRecommendation.objects.all()
    serializer_class = MarketStrategyRecommendationSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['strategy_type']
    search_fields = ['title', 'description']


class ReportNoteViewSet(viewsets.ModelViewSet):
    queryset = ReportNote.objects.all()
    serializer_class = ReportNoteSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['category', 'importance']
    search_fields = ['title', 'content']


class ReportActionPlanViewSet(viewsets.ModelViewSet):
    queryset = ReportActionPlan.objects.all()
    serializer_class = ReportActionPlanSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['report_note', 'priority', 'timeline']
    search_fields = ['title', 'description', 'owner', 'report_title']
    ordering_fields = ['target_date', '-created_at', 'created_at']


class ReportEngagementEventViewSet(viewsets.ModelViewSet):
    queryset = ReportEngagementEvent.objects.all()
    serializer_class = ReportEngagementEventSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['report_note', 'action_type', 'channel']
    ordering_fields = ['-created_at', 'created_at']


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


class RevenueOverviewMetricViewSet(viewsets.ModelViewSet):
    serializer_class = RevenueOverviewMetricSerializer
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['sort_order', 'name']

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return RevenueOverviewMetric.objects.filter(user=self.request.user)
        return RevenueOverviewMetric.objects.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class RevenueOverviewTopStreamViewSet(viewsets.ModelViewSet):
    serializer_class = RevenueOverviewTopStreamSerializer
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['sort_order', 'name']

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return RevenueOverviewTopStream.objects.filter(user=self.request.user)
        return RevenueOverviewTopStream.objects.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class RevenueOverviewChurnRiskViewSet(viewsets.ModelViewSet):
    serializer_class = RevenueOverviewChurnRiskSerializer
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['sort_order', 'segment']

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return RevenueOverviewChurnRisk.objects.filter(user=self.request.user)
        return RevenueOverviewChurnRisk.objects.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class RevenueOverviewUpsellOpportunityViewSet(viewsets.ModelViewSet):
    serializer_class = RevenueOverviewUpsellOpportunitySerializer
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['sort_order', 'customer_name', 'likelihood_percent']

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return RevenueOverviewUpsellOpportunity.objects.filter(user=self.request.user)
        return RevenueOverviewUpsellOpportunity.objects.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class RevenueOverviewChannelPerformanceViewSet(viewsets.ModelViewSet):
    serializer_class = RevenueOverviewChannelPerformanceSerializer
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['sort_order', 'channel']

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return RevenueOverviewChannelPerformance.objects.filter(user=self.request.user)
        return RevenueOverviewChannelPerformance.objects.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class RevenueUpsellInsightViewSet(viewsets.ModelViewSet):
    serializer_class = RevenueUpsellInsightSerializer
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['category']
    ordering_fields = ['category', 'sort_order']

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return RevenueUpsellInsight.objects.filter(user=self.request.user)
        return RevenueUpsellInsight.objects.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# ==================== FINANCIAL VIEWSETS ====================

class FinancialLineItemViewSet(viewsets.ModelViewSet):
    serializer_class = FinancialLineItemSerializer
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    filterset_fields = ['category', 'period']
    search_fields = ['item', 'category']
    ordering_fields = ['category', 'sort_order', 'item', 'current_amount']

    def get_queryset(self):
        return FinancialLineItem.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

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


class BudgetValidationSummaryViewSet(viewsets.ModelViewSet):
    queryset = BudgetValidationSummary.objects.all()
    serializer_class = BudgetValidationSummarySerializer
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['generated_at', 'accuracy_score', 'budget_alignment']


class ForecastValidationRecordViewSet(viewsets.ModelViewSet):
    queryset = ForecastValidationRecord.objects.all()
    serializer_class = ForecastValidationRecordSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    filterset_fields = ['validation_status']
    search_fields = ['period']
    ordering_fields = ['sort_order', 'period', 'accuracy_score', 'revenue_variance']


class BudgetAlignmentMetricViewSet(viewsets.ModelViewSet):
    queryset = BudgetAlignmentMetric.objects.all()
    serializer_class = BudgetAlignmentMetricSerializer
    filter_backends = [filters.OrderingFilter, filters.SearchFilter]
    search_fields = ['name']
    ordering_fields = ['sort_order', 'name', 'score']


class ForecastImprovementAreaViewSet(viewsets.ModelViewSet):
    queryset = ForecastImprovementArea.objects.all()
    serializer_class = ForecastImprovementAreaSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    filterset_fields = ['icon', 'theme']
    search_fields = ['title', 'summary', 'recommended_action']
    ordering_fields = ['sort_order', 'title', 'updated_at']


class ScenarioResilienceMetricViewSet(viewsets.ModelViewSet):
    queryset = ScenarioResilienceMetric.objects.all()
    serializer_class = ScenarioResilienceMetricSerializer
    filter_backends = [filters.OrderingFilter, filters.SearchFilter]
    search_fields = ['name', 'description', 'value']
    ordering_fields = ['sort_order', 'name', 'updated_at']


class RecommendedStressTestViewSet(viewsets.ModelViewSet):
    queryset = RecommendedStressTest.objects.all()
    serializer_class = RecommendedStressTestSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    filterset_fields = ['icon']
    search_fields = ['title', 'description']
    ordering_fields = ['sort_order', 'title', 'updated_at']


# ==================== PRICING VIEWSETS ====================

class PriceSettingViewSet(viewsets.ModelViewSet):
    queryset = PriceSetting.objects.all()
    serializer_class = PriceSettingSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['strategy', 'algorithm']
    search_fields = ['product']
    ordering_fields = ['product', 'current_price', 'updated_at', 'next_update']

    @action(detail=False, methods=['post'], url_path='configure-rules')
    def configure_rules(self, request):
        name = request.data.get('name', '').strip()
        condition = request.data.get('condition', 'time')
        condition_value = request.data.get('condition_value', {})
        adjustment_type = request.data.get('adjustment_type', 'percentage')
        adjustment_value = request.data.get('adjustment_value', 0)
        is_active = request.data.get('is_active', True)

        if not name:
            return Response({'detail': 'Rule name is required.'}, status=status.HTTP_400_BAD_REQUEST)

        pricing_rule = PricingRule.objects.create(
            name=name,
            condition=condition,
            condition_value=condition_value,
            adjustment_type=adjustment_type,
            adjustment_value=float(adjustment_value or 0),
            is_active=bool(is_active),
        )

        return Response({
            'id': pricing_rule.id,
            'name': pricing_rule.name,
            'condition': pricing_rule.condition,
            'adjustment_type': pricing_rule.adjustment_type,
            'adjustment_value': pricing_rule.adjustment_value,
            'is_active': pricing_rule.is_active,
            'message': 'Dynamic pricing rule configured successfully.',
        }, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], url_path='manual-override')
    def manual_override(self, request, pk=None):
        price_setting = self.get_object()
        override_price = request.data.get('override_price')
        reason = request.data.get('reason', '').strip() or 'Manual override'

        try:
            override_price_value = float(override_price)
        except (TypeError, ValueError):
            return Response({'detail': 'A valid override_price is required.'}, status=status.HTTP_400_BAD_REQUEST)

        previous_price = price_setting.current_price
        price_setting.current_price = override_price_value

        history = list(price_setting.history or [])
        history.insert(0, {
            'timestamp': timezone.now().isoformat(),
            'type': 'manual-override',
            'previous_price': previous_price,
            'new_price': override_price_value,
            'change_percent': round(((override_price_value - price_setting.base_price) / price_setting.base_price) * 100, 2) if price_setting.base_price else 0,
            'reason': reason,
        })
        price_setting.history = history[:50]
        price_setting.save(update_fields=['current_price', 'history', 'updated_at'])

        return Response({
            'id': price_setting.id,
            'product': price_setting.product,
            'current_price': price_setting.current_price,
            'message': 'Manual override applied successfully.',
        })

    @action(detail=True, methods=['get'], url_path='history')
    def history(self, request, pk=None):
        price_setting = self.get_object()
        return Response({
            'id': price_setting.id,
            'product': price_setting.product,
            'history': price_setting.history or [],
        })


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


class PricingItemViewSet(viewsets.ModelViewSet):
    queryset = PricingItem.objects.all()
    serializer_class = PricingItemSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['name']
    search_fields = ['name']
    ordering_fields = ['name', 'price', '-updated_at']


class PricingStrategyViewSet(viewsets.ModelViewSet):
    queryset = PricingStrategy.objects.all()
    serializer_class = PricingStrategySerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['strategy_type', 'is_active']
    ordering_fields = ['name', 'confidence', '-updated_at']


class PricingTestViewSet(viewsets.ModelViewSet):
    queryset = PricingTest.objects.all()
    serializer_class = PricingTestSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'test_type']
    search_fields = ['name']
    ordering_fields = ['name', 'status', '-created_at']

    @action(detail=True, methods=['post'], url_path='pause')
    def pause(self, request, pk=None):
        pricing_test = self.get_object()
        pricing_test.status = 'paused'
        pricing_test.save(update_fields=['status', 'updated_at'])
        return Response({
            'id': pricing_test.id,
            'status': pricing_test.status,
            'message': 'Pricing test paused successfully.'
        })

    @action(detail=True, methods=['post'], url_path='resume')
    def resume(self, request, pk=None):
        pricing_test = self.get_object()
        pricing_test.status = 'running'
        pricing_test.save(update_fields=['status', 'updated_at'])
        return Response({
            'id': pricing_test.id,
            'status': pricing_test.status,
            'message': 'Pricing test resumed successfully.'
        })

    @action(detail=True, methods=['get'], url_path='results')
    def results(self, request, pk=None):
        pricing_test = self.get_object()
        variants = pricing_test.results.get('variants', []) if pricing_test.results else []

        winning_variant = None
        if variants:
            winning_variant = max(variants, key=lambda variant: float(variant.get('revenue', 0) or 0))

        return Response({
            'id': pricing_test.id,
            'name': pricing_test.name,
            'status': pricing_test.status,
            'test_type': pricing_test.test_type,
            'confidence': pricing_test.confidence,
            'start_date': pricing_test.start_date,
            'end_date': pricing_test.end_date,
            'sample_size': pricing_test.sample_size,
            'variant_count': pricing_test.variant_count,
            'results': {
                'variants': variants,
            },
            'variants': variants,
            'winning_variant': winning_variant,
        })


# ==================== TAX VIEWSETS ====================

class TaxRecordViewSet(viewsets.ModelViewSet):
    serializer_class = TaxRecordSerializer
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['status', 'tax_year']
    ordering_fields = ['updated_at', 'estimated_tax']

    def get_queryset(self):
        return TaxRecord.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class TaxRecommendationViewSet(viewsets.ModelViewSet):
    serializer_class = TaxRecommendationSerializer
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['category', 'priority', 'implemented']
    ordering_fields = ['potential_savings', 'created_at']

    def get_queryset(self):
        return TaxRecommendation.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ComplianceUpdateViewSet(viewsets.ModelViewSet):
    serializer_class = ComplianceUpdateSerializer
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['type', 'jurisdiction', 'status', 'impact']
    ordering_fields = ['effective_date', 'created_at']

    def get_queryset(self):
        return ComplianceUpdate.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class TaxPlanningScenarioViewSet(viewsets.ModelViewSet):
    serializer_class = TaxPlanningScenarioSerializer
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['risk_level']
    ordering_fields = ['savings', 'confidence']

    def get_queryset(self):
        return TaxPlanningScenario.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class TaxAuditEventViewSet(viewsets.ModelViewSet):
    serializer_class = TaxAuditEventSerializer
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['outcome', 'category']
    ordering_fields = ['created_at']

    def get_queryset(self):
        return TaxAuditEvent.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ComplianceObligationViewSet(viewsets.ModelViewSet):
    serializer_class = ComplianceObligationSerializer
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['status', 'frequency', 'priority']
    ordering_fields = ['due_date', 'priority']

    def get_queryset(self):
        return ComplianceObligation.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ComplianceReportViewSet(viewsets.ModelViewSet):
    serializer_class = ComplianceReportSerializer
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['status', 'type', 'period']
    ordering_fields = ['due_date', 'created_at']

    def get_queryset(self):
        return ComplianceReport.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


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


def _normalize_module_key(module_value: str) -> str:
    module_map = {
        'market_analysis': 'market',
        'market-analysis': 'market',
        'pricing_strategy': 'pricing',
        'pricing-strategy': 'pricing',
        'revenue_strategy': 'revenue',
        'revenue-strategy': 'revenue',
        'business-forecast': 'business',
        'loan-funding': 'loan',
        'financial-advisory': 'financial',
        'tax-compliance': 'tax',
        'policy-economic': 'policy',
        'inventory-supply': 'inventory',
        'economic-forecasting': 'economic',
    }
    return module_map.get(module_value, module_value)


def _call_gemini_chat(prompt: str) -> str:
    api_key = os.getenv('GEMINI_API_KEY', '').strip()
    if not api_key:
        raise RuntimeError('GEMINI_API_KEY is not configured')

    endpoint = (
        'https://generativelanguage.googleapis.com/v1beta/models/'
        f'gemini-1.5-flash:generateContent?key={api_key}'
    )
    payload = {
        'contents': [
            {
                'parts': [
                    {'text': prompt}
                ]
            }
        ]
    }
    req = urllib_request.Request(
        endpoint,
        data=json.dumps(payload).encode('utf-8'),
        headers={'Content-Type': 'application/json'},
        method='POST',
    )

    try:
        with urllib_request.urlopen(req, timeout=30) as response:
            body = json.loads(response.read().decode('utf-8'))
    except urllib_error.HTTPError as exc:
        detail = exc.read().decode('utf-8', errors='ignore')
        raise RuntimeError(f'Gemini API error: {detail}') from exc
    except Exception as exc:
        raise RuntimeError(f'Gemini request failed: {exc}') from exc

    candidates = body.get('candidates', [])
    if not candidates:
        return 'I could not generate a response right now. Please try again.'

    content = candidates[0].get('content', {})
    parts = content.get('parts', [])
    text = ''.join(part.get('text', '') for part in parts if isinstance(part, dict)).strip()
    return text or 'I could not generate a response right now. Please try again.'


def _local_module_fallback_response(module: str, user_message: str) -> str:
    module_tips = {
        'revenue': 'review MRR trend, top revenue streams, churn risk segments, and highest-probability upsell accounts',
        'pricing': 'compare conversion impact by price tier before changing headline prices',
        'market': 'prioritize high-growth segments with strongest margin potential',
        'business': 'focus on KPI variance and cash flow timing for the next quarter',
        'financial': 'check operating margin drivers and major expense categories',
        'loan': 'align repayment schedule with projected cash inflows',
        'tax': 'validate filing dates and high-risk compliance items first',
        'policy': 'map policy changes to revenue, cost, and compliance impact',
        'inventory': 'optimize reorder points using demand volatility and lead time',
        'economic': 'use current macro trends as assumptions in planning scenarios',
    }
    tip = module_tips.get(module, 'start with the key KPI trends and biggest risk areas')
    trimmed = user_message.strip()
    return (
        f'I can help with this in {module} mode. '
        f'For your request "{trimmed[:140]}", I recommend you first {tip}. '
        'If you want, I can break this down into specific action steps and targets.'
    )


@api_view(['POST'])
@permission_classes([AllowAny])
def module_chat(request):
    conversation_id = request.data.get('conversation')
    user_content = (request.data.get('content') or '').strip()
    module = _normalize_module_key((request.data.get('module') or '').strip())

    if not user_content:
        return Response({'error': 'content is required'}, status=status.HTTP_400_BAD_REQUEST)

    if not conversation_id:
        return Response({'error': 'conversation is required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        conversation = ModuleConversation.objects.get(id=conversation_id)
    except ModuleConversation.DoesNotExist:
        return Response({'error': 'conversation not found'}, status=status.HTTP_404_NOT_FOUND)

    if module and conversation.module != module:
        conversation.module = module
        conversation.save(update_fields=['module', 'updated_at'])

    ChatMessage.objects.create(
        conversation=conversation,
        role='user',
        content=user_content,
    )

    recent_messages = ChatMessage.objects.filter(conversation=conversation).order_by('-timestamp')[:10]
    history_lines = []
    for msg in reversed(list(recent_messages)):
        speaker = 'User' if msg.role == 'user' else 'Assistant'
        history_lines.append(f'{speaker}: {msg.content}')

    prompt = (
        f'You are JOSEPH, an assistant for the {conversation.module} module. '
        'Provide concise, practical business guidance.\n\n'
        f'Conversation history:\n{"\n".join(history_lines)}\n\n'
        f'Current user message:\n{user_content}'
    )

    try:
        assistant_content = _call_gemini_chat(prompt)
    except RuntimeError:
        # Keep chat usable even when external AI provider is unavailable.
        assistant_content = _local_module_fallback_response(conversation.module, user_content)

    assistant_msg = ChatMessage.objects.create(
        conversation=conversation,
        role='assistant',
        content=assistant_content,
    )

    return Response(
        {
            'assistant_message': {
                'id': str(assistant_msg.id),
                'type': 'assistant',
                'content': assistant_msg.content,
                'timestamp': assistant_msg.timestamp.isoformat(),
            }
        },
        status=status.HTTP_200_OK,
    )

# ==================== ADVICE MESSAGE VIEWSET ====================

class AdviceMessageViewSet(viewsets.ModelViewSet):
    """ViewSet for managing advice messages in the Advice Hub"""
    queryset = AdviceMessage.objects.all()
    serializer_class = AdviceMessageSerializer
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['module_id', 'is_read']
    ordering_fields = ['-created_at', 'module_name']
    ordering = ['-created_at']

    def get_queryset(self):
        # Return advice messages for the authenticated user
        user = self.request.user
        return AdviceMessage.objects.filter(user=user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['put'])
    def mark_all_read(self, request):
        """Mark all advice messages as read for the authenticated user"""
        AdviceMessage.objects.filter(user=request.user).update(is_read=True)
        return Response({'status': 'all messages marked as read'})

    @action(detail=True, methods=['put'])
    def mark_read(self, request, pk=None):
        """Mark a specific advice message as read"""
        message = self.get_object()
        message.is_read = True
        message.save()
        return Response(AdviceMessageSerializer(message).data)

    @action(detail=False, methods=['get'])
    def unread_count(self, request):
        """Get count of unread advice messages"""
        unread = AdviceMessage.objects.filter(user=request.user, is_read=False).count()
        return Response({'unread_count': unread})


# ==================== NOTIFICATION VIEWSET ====================

class NotificationViewSet(viewsets.ModelViewSet):
    """ViewSet for managing user notifications"""
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['type', 'priority', 'category', 'is_read', 'starred', 'archived']
    ordering_fields = ['-created_at', 'priority']
    ordering = ['-created_at']

    def get_queryset(self):
        # Return notifications for the authenticated user
        user = self.request.user
        return Notification.objects.filter(user=user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['put'])
    def mark_all_read(self, request):
        """Mark all notifications as read for the authenticated user"""
        Notification.objects.filter(user=request.user).update(is_read=True)
        return Response({'status': 'all notifications marked as read'})

    @action(detail=True, methods=['put'])
    def mark_read(self, request, pk=None):
        """Mark a specific notification as read"""
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response(NotificationSerializer(notification).data)

    @action(detail=True, methods=['put'])
    def toggle_starred(self, request, pk=None):
        """Toggle starred status of a notification"""
        notification = self.get_object()
        notification.starred = not notification.starred
        notification.save()
        return Response(NotificationSerializer(notification).data)

    @action(detail=True, methods=['put'])
    def toggle_archived(self, request, pk=None):
        """Toggle archived status of a notification"""
        notification = self.get_object()
        notification.archived = not notification.archived
        notification.save()
        return Response(NotificationSerializer(notification).data)

    @action(detail=False, methods=['get'])
    def unread_count(self, request):
        """Get count of unread notifications"""
        unread = Notification.objects.filter(user=request.user, is_read=False).count()
        return Response({'unread_count': unread})
