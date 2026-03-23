"""
Sales Intelligence API Views
ViewSets and views for sales intelligence endpoints including leads, opportunities, and metrics.
"""

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.db.models import Sum, Count, Avg, Q, F, ExpressionWrapper, FloatField
from django.utils import timezone
from datetime import timedelta

from .models import (
    SalesRep,
    Lead,
    Opportunity,
    SalesMetric,
    ActivityLog,
    SalesPipeline,
    CompetitionTracking,
    SalesVelocity,
)
from .sales_intelligence_serializers import (
    SalesRepSerializer,
    LeadSerializer,
    OpportunityDetailedSerializer,
    OpportunityListSerializer,
    SalesMetricSerializer,
    ActivityLogSerializer,
    SalesPipelineSerializer,
    CompetitionTrackingSerializer,
    SalesVelocitySerializer,
    SalesRepDashboardSerializer,
    PipelineSummarySerializer,
    LeadSummarySerializer,
)


class SalesRepViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Sales Representatives
    Supports CRUD operations and custom actions for sales rep management
    """
    queryset = SalesRep.objects.all()
    serializer_class = SalesRepSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['territory', 'status', 'department']
    search_fields = ['first_name', 'last_name', 'email', 'title']
    ordering_fields = ['ytd_sales', 'ytd_quota_percentage', 'win_rate', 'last_name']
    ordering = ['-ytd_sales']
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    def perform_update(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def dashboard(self, request):
        """Get sales rep dashboard summary"""
        reps = self.get_queryset()
        serializer = SalesRepDashboardSerializer(reps, many=True)
        
        summary = {
            'total_reps': reps.count(),
            'total_quota': reps.aggregate(Sum('quota'))['quota__sum'] or 0,
            'total_ytd_sales': reps.aggregate(Sum('ytd_sales'))['ytd_sales__sum'] or 0,
            'avg_win_rate': reps.aggregate(Avg('win_rate'))['win_rate__avg'] or 0,
            'total_pipeline_value': reps.aggregate(Sum('pipeline_value'))['pipeline_value__sum'] or 0,
            'reps': serializer.data
        }
        return Response(summary)
    
    @action(detail=True, methods=['get'])
    def performance(self, request, pk=None):
        """Get detailed performance metrics for a sales rep"""
        rep = self.get_object()
        
        # Get opportunities for this rep
        opportunities = rep.opportunities.filter(is_closed=True)
        won_deals = opportunities.filter(is_won=True)
        
        performance_data = {
            'rep_id': rep.id,
            'name': f"{rep.first_name} {rep.last_name}",
            'quota': rep.quota,
            'ytd_sales': rep.ytd_sales,
            'quota_percentage': (rep.ytd_sales / rep.quota * 100) if rep.quota > 0 else 0,
            'win_rate': rep.win_rate,
            'total_deals_closed': opportunities.count(),
            'deals_won': won_deals.count(),
            'avg_deal_size': rep.average_deal_size,
            'pipeline_value': rep.pipeline_value,
            'active_leads': rep.active_leads,
            'active_opportunities': rep.active_opportunities,
            'customer_retention': rep.customer_retention,
            'deal_cycle_days': rep.deal_cycle_days,
        }
        return Response(performance_data)
    
    @action(detail=True, methods=['get'])
    def activity_summary(self, request, pk=None):
        """Get activity summary for a sales rep"""
        rep = self.get_object()
        today = timezone.now().date()
        week_start = today - timedelta(days=today.weekday())
        
        activities = rep.activities.filter(
            completed_date__gte=week_start
        )
        
        summary = {
            'rep_id': rep.id,
            'calls_this_week': rep.calls_this_week,
            'emails_this_week': rep.emails_this_week,
            'meetings_this_week': rep.meetings_this_week,
            'total_activities': activities.count(),
            'by_type': dict(
                activities.values('activity_type').annotate(count=Count('id')).values_list('activity_type', 'count')
            )
        }
        return Response(summary)


class LeadViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Sales Leads
    Supports CRUD operations and lead intelligence features
    """
    queryset = Lead.objects.all()
    serializer_class = LeadSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'lead_source', 'industry', 'company_size', 'assigned_to']
    search_fields = ['first_name', 'last_name', 'email', 'company', 'job_title']
    ordering_fields = ['lead_score', 'created_at', 'last_contact_date', 'response_rate']
    ordering = ['-lead_score']
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    def perform_update(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def summary(self, request):
        """Get leads summary and analytics"""
        leads = self.get_queryset()
        
        # Calculate metrics
        converted = leads.filter(status='converted').count()
        total = leads.count()
        conversion_rate = (converted / total * 100) if total > 0 else 0
        
        summary = {
            'total_leads': total,
            'new_leads': leads.filter(status='new').count(),
            'contacted_leads': leads.filter(status='contacted').count(),
            'qualified_leads': leads.filter(status='qualified').count(),
            'converted_leads': converted,
            'lost_leads': leads.filter(status='lost').count(),
            'conversion_rate': round(conversion_rate, 2),
            'avg_lead_score': leads.aggregate(Avg('lead_score'))['lead_score__avg'] or 0,
            'avg_response_rate': leads.aggregate(Avg('response_rate'))['response_rate__avg'] or 0,
            'by_source': dict(
                leads.values('lead_source').annotate(count=Count('id')).values_list('lead_source', 'count')
            ),
            'by_status': dict(
                leads.values('status').annotate(count=Count('id')).values_list('status', 'count')
            ),
            'by_industry': dict(
                leads.values('industry').annotate(count=Count('id')).values_list('industry', 'count')
            )
        }
        return Response(summary)
    
    @action(detail=False, methods=['get'])
    def high_priority(self, request):
        """Get high priority leads (high score, qualified, not contacted recently)"""
        seven_days_ago = timezone.now().date() - timedelta(days=7)
        
        high_priority = self.get_queryset().filter(
            lead_score__gte=70,
            status__in=['qualified', 'new'],
            last_contact_date__lt=seven_days_ago
        ).order_by('-lead_score')[:50]
        
        serializer = self.get_serializer(high_priority, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def convert(self, request, pk=None):
        """Convert a lead to an opportunity"""
        lead = self.get_object()
        
        if lead.status == 'converted':
            return Response({'error': 'Lead already converted'}, status=status.HTTP_400_BAD_REQUEST)
        
        lead.status = 'converted'
        lead.converted_at = timezone.now()
        lead.save()
        
        return Response({
            'message': 'Lead converted successfully',
            'lead_id': lead.id,
            'converted_at': lead.converted_at
        })
    
    @action(detail=False, methods=['post'])
    def bulk_assign(self, request):
        """Bulk assign leads to sales reps"""
        lead_ids = request.data.get('lead_ids', [])
        rep_id = request.data.get('rep_id')
        
        if not rep_id:
            return Response({'error': 'rep_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            rep = SalesRep.objects.get(id=rep_id)
        except SalesRep.DoesNotExist:
            return Response({'error': 'Sales rep not found'}, status=status.HTTP_404_NOT_FOUND)
        
        leads = Lead.objects.filter(id__in=lead_ids)
        leads.update(assigned_to=rep)
        
        return Response({
            'message': f'{leads.count()} leads assigned to {rep.first_name} {rep.last_name}',
            'count': leads.count()
        })


class OpportunityViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Sales Opportunities/Deals
    Supports pipeline management and forecasting
    """
    queryset = Opportunity.objects.all()
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['stage', 'is_won', 'is_closed', 'assigned_to', 'company']
    search_fields = ['name', 'company', 'contact_name', 'contact_email']
    ordering_fields = ['amount', 'probability', 'close_date_expected', 'weighted_amount']
    ordering = ['-close_date_expected']
    
    def get_serializer_class(self):
        """Use list serializer for list views, detailed for detail views"""
        if self.action == 'list':
            return OpportunityListSerializer
        return OpportunityDetailedSerializer
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    def perform_update(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def pipeline_summary(self, request):
        """Get detailed pipeline summary with stage breakdown"""
        opportunities = self.get_queryset()
        
        summary = {
            'total_opportunities': opportunities.count(),
            'total_pipeline_value': opportunities.filter(is_closed=False).aggregate(Sum('amount'))['amount__sum'] or 0,
            'weighted_pipeline': opportunities.filter(is_closed=False).aggregate(Sum('weighted_amount'))['weighted_amount__sum'] or 0,
            'by_stage': {},
            'closed_won': opportunities.filter(is_won=True).count(),
            'closed_lost': opportunities.filter(is_closed=True, is_won=False).count(),
            'by_probability': {},
            'avg_deal_size': opportunities.aggregate(Avg('amount'))['amount__avg'] or 0,
        }
        
        # Stage breakdown
        for stage in Opportunity.STAGE_CHOICES:
            stage_key = stage[0]
            stage_opps = opportunities.filter(stage=stage_key)
            summary['by_stage'][stage[1]] = {
                'count': stage_opps.count(),
                'value': stage_opps.aggregate(Sum('amount'))['amount__sum'] or 0,
                'weighted_value': stage_opps.aggregate(Sum('weighted_amount'))['weighted_amount__sum'] or 0,
            }
        
        return Response(summary)
    
    @action(detail=False, methods=['get'])
    def forecast(self, request):
        """Get revenue forecast based on current opportunities"""
        opportunities = self.get_queryset().filter(is_closed=False)
        
        # Weighted forecast based on probability
        total_forecast = opportunities.aggregate(Sum('weighted_amount'))['weighted_amount__sum'] or 0
        
        # By stage forecast
        by_stage_forecast = {}
        for stage in Opportunity.STAGE_CHOICES:
            stage_opps = opportunities.filter(stage=stage[0])
            by_stage_forecast[stage[1]] = stage_opps.aggregate(Sum('weighted_amount'))['weighted_amount__sum'] or 0
        
        # Monthly/Quarterly breakdown
        today = timezone.now().date()
        next_30_days = opportunities.filter(close_date_expected__lte=today + timedelta(days=30))
        next_90_days = opportunities.filter(close_date_expected__lte=today + timedelta(days=90))
        
        forecast = {
            'total_weighted_forecast': total_forecast,
            'forecast_next_30_days': next_30_days.aggregate(Sum('weighted_amount'))['weighted_amount__sum'] or 0,
            'forecast_next_90_days': next_90_days.aggregate(Sum('weighted_amount'))['weighted_amount__sum'] or 0,
            'by_stage': by_stage_forecast,
            'by_rep': dict(
                opportunities.values('assigned_to__last_name').annotate(
                    forecast=Sum('weighted_amount')
                ).values_list('assigned_to__last_name', 'forecast')
            )
        }
        
        return Response(forecast)
    
    @action(detail=True, methods=['post'])
    def advance_stage(self, request, pk=None):
        """Move opportunity to next stage"""
        opportunity = self.get_object()
        
        # Define stage progression
        stage_progression = {
            'prospecting': 'qualification',
            'qualification': 'needs_analysis',
            'needs_analysis': 'proposal',
            'proposal': 'negotiation',
            'negotiation': 'closed_won',
        }
        
        next_stage = stage_progression.get(opportunity.stage)
        if not next_stage:
            return Response({'error': 'Cannot advance from this stage'}, status=status.HTTP_400_BAD_REQUEST)
        
        opportunity.stage = next_stage
        opportunity.save()
        
        serializer = OpportunityDetailedSerializer(opportunity)
        return Response({'message': 'Stage advanced successfully', 'opportunity': serializer.data})
    
    @action(detail=True, methods=['post'])
    def close(self, request, pk=None):
        """Close an opportunity as won or lost"""
        opportunity = self.get_object()
        
        is_won = request.data.get('is_won', False)
        close_reason = request.data.get('close_reason')
        close_notes = request.data.get('close_notes', '')
        
        opportunity.is_closed = True
        opportunity.is_won = is_won
        opportunity.close_date_actual = timezone.now().date()
        opportunity.close_reason = close_reason
        opportunity.close_notes = close_notes
        
        if is_won:
            opportunity.stage = 'closed_won'
            opportunity.probability = 100
        else:
            opportunity.stage = 'closed_lost'
            opportunity.probability = 0
        
        opportunity.save()
        
        serializer = OpportunityDetailedSerializer(opportunity)
        return Response({'message': 'Opportunity closed', 'opportunity': serializer.data})


class SalesMetricViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for Sales Metrics
    Read-only access to calculated and aggregated sales metrics
    """
    queryset = SalesMetric.objects.all()
    serializer_class = SalesMetricSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['metric_type', 'dimension', 'period_type', 'sales_rep']
    ordering_fields = ['period_end', 'achievement_percentage']
    ordering = ['-period_end']
    
    @action(detail=False, methods=['get'])
    def dashboard(self, request):
        """Get sales metrics dashboard"""
        metrics = self.get_queryset()
        
        # Most recent metrics
        latest = metrics.filter(period_type='monthly').order_by('-period_end').first()
        
        summary = {
            'latest_period': latest.period_start if latest else None,
            'total_active_metrics': metrics.filter(is_flagged=False).count(),
            'flagged_metrics': metrics.filter(is_flagged=True).count(),
            'on_track_metrics': metrics.filter(is_on_track=True).count(),
            'at_risk_metrics': metrics.filter(is_on_track=False).count(),
        }
        
        return Response(summary)


class ActivityLogViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Activity Logs
    Tracks all sales activities - calls, emails, meetings, etc.
    """
    queryset = ActivityLog.objects.all()
    serializer_class = ActivityLogSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['activity_type', 'status', 'sales_rep', 'lead', 'opportunity']
    ordering_fields = ['scheduled_date', 'created_at']
    ordering = ['-scheduled_date']
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def upcoming(self, request):
        """Get upcoming activities"""
        today = timezone.now().date()
        upcoming = self.get_queryset().filter(
            scheduled_date__gte=today,
            status__in=['planned', 'in_progress']
        ).order_by('scheduled_date', 'scheduled_time')[:50]
        
        serializer = self.get_serializer(upcoming, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def overdue(self, request):
        """Get overdue activities"""
        today = timezone.now().date()
        overdue = self.get_queryset().filter(
            scheduled_date__lt=today,
            status__in=['planned', 'in_progress']
        ).order_by('scheduled_date')[:50]
        
        serializer = self.get_serializer(overdue, many=True)
        return Response(serializer.data)


class CompetitionTrackingViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Competition Tracking
    Manages competitive intelligence for opportunities
    """
    queryset = CompetitionTracking.objects.all()
    serializer_class = CompetitionTrackingSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['competitor_name', 'strength', 'opportunity']
    search_fields = ['competitor_name', 'opportunity__name']
    ordering_fields = ['last_updated']
    ordering = ['-last_updated']


class SalesVelocityViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Sales Velocity
    Tracks how quickly deals move through sales stages
    """
    queryset = SalesVelocity.objects.all()
    serializer_class = SalesVelocitySerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['sales_rep']
    ordering_fields = ['period_end']
    ordering = ['-period_end']
