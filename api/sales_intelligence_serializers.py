"""
Sales Intelligence Serializers
Serializers for sales intelligence models including leads, opportunities, sales reps, and metrics.
"""

from rest_framework import serializers
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


class SalesRepSerializer(serializers.ModelSerializer):
    """Serializer for SalesRep model"""
    
    manager_name = serializers.StringRelatedField(source='manager', read_only=True)
    subordinates_count = serializers.SerializerMethodField()
    
    class Meta:
        model = SalesRep
        fields = [
            'id', 'first_name', 'last_name', 'email', 'phone', 'title',
            'department', 'territory', 'manager', 'manager_name', 'status',
            'quota', 'ytd_sales', 'ytd_quota_percentage', 'annual_quota',
            'active_leads', 'active_opportunities', 'pipeline_value', 'win_rate',
            'calls_this_week', 'emails_this_week', 'meetings_this_week',
            'hire_date', 'average_deal_size', 'deal_cycle_days',
            'customer_retention', 'created_at', 'updated_at',
            'subordinates_count'
        ]
        read_only_fields = ['created_at', 'updated_at']
    
    def get_subordinates_count(self, obj):
        return obj.subordinates.count()


class LeadSerializer(serializers.ModelSerializer):
    """Serializer for Lead model"""
    
    assigned_to_name = serializers.StringRelatedField(source='assigned_to', read_only=True)
    days_since_created = serializers.SerializerMethodField()
    days_since_contact = serializers.SerializerMethodField()
    
    class Meta:
        model = Lead
        fields = [
            'id', 'first_name', 'last_name', 'email', 'phone', 'company',
            'job_title', 'company_website', 'company_size', 'industry',
            'annual_revenue', 'status', 'lead_source', 'lead_score',
            'assigned_to', 'assigned_to_name', 'last_contact_date',
            'last_activity', 'contact_frequency', 'response_rate',
            'budget_available', 'decision_maker', 'timeline',
            'company_info', 'notes', 'tags', 'created_at', 'updated_at',
            'converted_at', 'days_since_created', 'days_since_contact'
        ]
        read_only_fields = ['created_at', 'updated_at', 'converted_at']
    
    def get_days_since_created(self, obj):
        from django.utils import timezone
        return (timezone.now().date() - obj.created_at.date()).days
    
    def get_days_since_contact(self, obj):
        if obj.last_contact_date:
            from django.utils import timezone
            return (timezone.now().date() - obj.last_contact_date).days
        return None


class OpportunityDetailedSerializer(serializers.ModelSerializer):
    """Detailed serializer for Opportunity model"""
    
    lead_info = serializers.SerializerMethodField()
    assigned_to_name = serializers.StringRelatedField(source='assigned_to', read_only=True)
    days_open = serializers.SerializerMethodField()
    
    class Meta:
        model = Opportunity
        fields = [
            'id', 'name', 'description', 'company', 'contact_name',
            'contact_email', 'amount', 'currency', 'stage', 'probability',
            'weighted_amount', 'close_date_expected', 'close_date_actual',
            'days_to_close', 'next_step', 'next_step_date', 'last_activity_date',
            'last_activity', 'is_closed', 'is_won', 'close_reason', 'close_notes',
            'assigned_to', 'assigned_to_name', 'products_services', 'key_competitors',
            'champion_identified', 'budget_confirmed', 'engagement_score',
            'decision_timeline', 'notes', 'tags', 'created_at', 'updated_at',
            'lead', 'lead_info', 'days_open'
        ]
        read_only_fields = ['created_at', 'updated_at', 'weighted_amount']
    
    def get_lead_info(self, obj):
        if obj.lead:
            return {
                'id': obj.lead.id,
                'name': f"{obj.lead.first_name} {obj.lead.last_name}",
                'company': obj.lead.company,
                'email': obj.lead.email
            }
        return None
    
    def get_days_open(self, obj):
        if not obj.is_closed:
            from django.utils import timezone
            return (timezone.now().date() - obj.created_at.date()).days
        return None


class OpportunityListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for Opportunity list view"""
    
    assigned_to_name = serializers.StringRelatedField(source='assigned_to', read_only=True)
    
    class Meta:
        model = Opportunity
        fields = [
            'id', 'name', 'company', 'amount', 'stage', 'probability',
            'weighted_amount', 'close_date_expected', 'assigned_to_name',
            'is_won', 'created_at'
        ]


class SalesMetricSerializer(serializers.ModelSerializer):
    """Serializer for SalesMetric model"""
    
    sales_rep_name = serializers.StringRelatedField(source='sales_rep', read_only=True)
    
    class Meta:
        model = SalesMetric
        fields = [
            'id', 'metric_type', 'name', 'description', 'dimension',
            'dimension_value', 'period_type', 'period_start', 'period_end',
            'target', 'actual', 'forecast', 'variance', 'variance_percentage',
            'achievement_percentage', 'previous_period_value', 'trend_direction',
            'trend_percentage', 'related_metrics', 'insights', 'is_on_track',
            'is_flagged', 'flag_reason', 'sales_rep', 'sales_rep_name',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at', 'variance', 'variance_percentage', 'achievement_percentage']


class ActivityLogSerializer(serializers.ModelSerializer):
    """Serializer for ActivityLog model"""
    
    sales_rep_name = serializers.StringRelatedField(source='sales_rep', read_only=True)
    lead_info = serializers.SerializerMethodField()
    opportunity_info = serializers.SerializerMethodField()
    
    class Meta:
        model = ActivityLog
        fields = [
            'id', 'activity_type', 'subject', 'description', 'call_direction',
            'call_duration_minutes', 'scheduled_date', 'scheduled_time',
            'completed_date', 'completed_time', 'status', 'participants',
            'outcome', 'next_steps', 'action_items', 'attachments',
            'sales_rep', 'sales_rep_name', 'lead', 'lead_info',
            'opportunity', 'opportunity_info', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']
    
    def get_lead_info(self, obj):
        if obj.lead:
            return {
                'id': obj.lead.id,
                'name': f"{obj.lead.first_name} {obj.lead.last_name}",
                'company': obj.lead.company
            }
        return None
    
    def get_opportunity_info(self, obj):
        if obj.opportunity:
            return {
                'id': obj.opportunity.id,
                'name': obj.opportunity.name,
                'company': obj.opportunity.company
            }
        return None


class SalesPipelineSerializer(serializers.ModelSerializer):
    """Serializer for SalesPipeline model"""
    
    class Meta:
        model = SalesPipeline
        fields = [
            'id', 'name', 'description', 'total_opportunities', 'total_pipeline_value',
            'prospecting_count', 'prospecting_value',
            'qualification_count', 'qualification_value',
            'needs_analysis_count', 'needs_analysis_value',
            'proposal_count', 'proposal_value',
            'negotiation_count', 'negotiation_value',
            'conversion_rate', 'average_deal_size', 'average_sales_cycle',
            'monthly_forecast', 'quarterly_forecast', 'period',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class CompetitionTrackingSerializer(serializers.ModelSerializer):
    """Serializer for CompetitionTracking model"""
    
    opportunity_name = serializers.CharField(source='opportunity.name', read_only=True)
    
    class Meta:
        model = CompetitionTracking
        fields = [
            'id', 'opportunity', 'opportunity_name', 'competitor_name',
            'strength', 'our_advantages', 'competitive_gaps', 'battle_card',
            'first_identified', 'last_updated', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at', 'last_updated']


class SalesVelocitySerializer(serializers.ModelSerializer):
    """Serializer for SalesVelocity model"""
    
    sales_rep_name = serializers.StringRelatedField(source='sales_rep', read_only=True)
    
    class Meta:
        model = SalesVelocity
        fields = [
            'id', 'sales_rep', 'sales_rep_name',
            'prospecting_to_qualification_days',
            'qualification_to_analysis_days',
            'analysis_to_proposal_days',
            'proposal_to_negotiation_days',
            'negotiation_to_close_days',
            'total_sales_cycle_days',
            'deals_analyzed',
            'period_start', 'period_end',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


# Dashboard serializers for summary/analytics

class SalesRepDashboardSerializer(serializers.ModelSerializer):
    """Simplified serializer for sales rep dashboard"""
    
    quota_attainment = serializers.SerializerMethodField()
    quota_attainment_percent = serializers.SerializerMethodField()
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = SalesRep
        fields = [
            'id', 'first_name', 'last_name', 'email', 'territory', 'status',
            'status_display', 'quota', 'ytd_sales', 'quota_attainment',
            'quota_attainment_percent', 'active_leads', 'active_opportunities',
            'pipeline_value', 'win_rate', 'average_deal_size'
        ]
    
    def get_quota_attainment(self, obj):
        return obj.quota - obj.ytd_sales
    
    def get_quota_attainment_percent(self, obj):
        if obj.quota > 0:
            return round((obj.ytd_sales / obj.quota) * 100, 2)
        return 0


class PipelineSummarySerializer(serializers.Serializer):
    """Serializer for pipeline summary analytics"""
    
    total_opportunities = serializers.IntegerField()
    total_pipeline_value = serializers.FloatField()
    weighted_pipeline = serializers.FloatField()
    average_deal_size = serializers.FloatField()
    total_closed_won = serializers.FloatField()
    win_count = serializers.IntegerField()
    win_rate = serializers.FloatField()
    by_stage = serializers.DictField()
    forecast_monthly = serializers.FloatField()
    forecast_quarterly = serializers.FloatField()


class LeadSummarySerializer(serializers.Serializer):
    """Serializer for leads summary analytics"""
    
    total_leads = serializers.IntegerField()
    new_leads = serializers.IntegerField()
    qualified_leads = serializers.IntegerField()
    converted_leads = serializers.IntegerField()
    conversion_rate = serializers.FloatField()
    avg_lead_score = serializers.FloatField()
    by_source = serializers.DictField()
    by_status = serializers.DictField()
    response_rate = serializers.FloatField()
