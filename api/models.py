from django.db import models
from django.contrib.auth.models import User
import uuid


# ==================== COMPANY PROFILE MODEL ====================

class CompanyProfile(models.Model):
    COMPANY_SIZE_CHOICES = [
        ('small', 'Small'),
        ('medium', 'Medium'),
        ('enterprise', 'Enterprise'),
    ]
    
    # Link to Django User (nullable for onboarding without auth)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='company_profiles', null=True, blank=True)
    
    # Required fields
    company_name = models.CharField(max_length=200)
    description = models.TextField()
    number_of_workers = models.IntegerField(default=1)
    sector = models.CharField(max_length=100)
    company_size = models.CharField(max_length=20, choices=COMPANY_SIZE_CHOICES, default='small')
    country = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    website_url = models.URLField(blank=True, null=True)
    
    # Optional fields
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True)
    fiscal_year_end_date = models.DateField(blank=True, null=True)
    currency_format = models.CharField(max_length=50, blank=True)
    currency_preference = models.CharField(max_length=10, blank=True)
    logo = models.URLField(blank=True, null=True)
    language = models.CharField(max_length=20, blank=True, default='en')
    number_of_entities = models.IntegerField(default=1)
    ai_summary = models.TextField(blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        return self.company_name


# ==================== ECONOMIC MODELS ====================

class EconomicMetric(models.Model):
    TREND_CHOICES = [('up', 'Up'), ('down', 'Down'), ('neutral', 'Neutral')]
    
    context = models.CharField(max_length=50, db_index=True)
    name = models.CharField(max_length=200)
    value = models.FloatField()
    change = models.FloatField(default=0)
    unit = models.CharField(max_length=50)
    trend = models.CharField(max_length=20, choices=TREND_CHOICES, default='neutral')
    category = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        return f"{self.name} ({self.context})"


class EconomicNews(models.Model):
    IMPACT_CHOICES = [('high', 'High'), ('medium', 'Medium'), ('low', 'Low'), ('positive', 'Positive')]
    
    context = models.CharField(max_length=50, db_index=True)
    title = models.CharField(max_length=300)
    summary = models.TextField()
    source = models.CharField(max_length=100)
    timestamp = models.DateTimeField(auto_now_add=True)
    impact = models.CharField(max_length=20, choices=IMPACT_CHOICES, default='medium')
    category = models.CharField(max_length=100)
    url = models.URLField(blank=True, null=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return self.title


class EconomicForecast(models.Model):
    context = models.CharField(max_length=50, db_index=True)
    indicator = models.CharField(max_length=200)
    period = models.CharField(max_length=50)
    forecast = models.FloatField()
    confidence = models.IntegerField(default=50)
    range_low = models.FloatField()
    range_high = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.indicator} - {self.period}"


class EconomicEvent(models.Model):
    IMPACT_CHOICES = [('high', 'High'), ('medium', 'Medium'), ('low', 'Low')]
    
    context = models.CharField(max_length=50, db_index=True)
    title = models.CharField(max_length=300)
    date = models.DateField()
    description = models.TextField()
    impact = models.CharField(max_length=20, choices=IMPACT_CHOICES, default='medium')
    category = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['date']

    def __str__(self):
        return f"{self.title} ({self.date})"


# ==================== BUSINESS MODELS ====================

class CustomerProfile(models.Model):
    SEGMENT_CHOICES = [
        ('retail', 'Retail'),
        ('wholesale', 'Wholesale'),
        ('enterprise', 'Enterprise'),
        ('smb', 'SMB'),
        ('startup', 'Startup'),
    ]
    RISK_CHOICES = [('low', 'Low'), ('medium', 'Medium'), ('high', 'High')]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='customer_profiles', null=True, blank=True)
    
    # Basic fields
    name = models.CharField(max_length=200)
    email = models.EmailField()
    segment = models.CharField(max_length=20, choices=SEGMENT_CHOICES)
    lifetime_value = models.FloatField(default=0)
    average_order_value = models.FloatField(default=0)
    order_frequency = models.IntegerField(default=0)
    risk_score = models.CharField(max_length=20, choices=RISK_CHOICES, default='low')
    preferences = models.JSONField(default=dict)
    
    # Extended fields from UI
    demand_assumption = models.FloatField(default=0, help_text="Demand assumption for segment")
    growth_rate = models.FloatField(default=0, help_text="Growth rate percentage")
    retention = models.FloatField(default=0, help_text="Retention rate percentage")
    seasonality = models.FloatField(default=0, help_text="Seasonality factor")
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class RevenueProjection(models.Model):
    PERIOD_CHOICES = [
        ('1m', '1 Month'),
        ('3m', '3 Months'),
        ('6m', '6 Months'),
        ('1y', '1 Year'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='revenue_projections', null=True, blank=True)
    
    name = models.CharField(max_length=200)
    period = models.CharField(max_length=10, choices=PERIOD_CHOICES)
    projected_revenue = models.FloatField()
    confidence = models.IntegerField(default=50)
    assumptions = models.TextField(blank=True)
    
    # Extended fields from UI
    conservative = models.FloatField(default=0, help_text="Conservative revenue projection")
    optimistic = models.FloatField(default=0, help_text="Optimistic revenue projection")
    actual_to_date = models.FloatField(default=0, help_text="Actual revenue to date")
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.period}"


class CostStructure(models.Model):
    CATEGORY_CHOICES = [
        ('fixed', 'Fixed'),
        ('variable', 'Variable'),
        ('semi_variable', 'Semi-Variable'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='cost_structures', null=True, blank=True)
    
    name = models.CharField(max_length=200)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    amount = models.FloatField()
    period = models.CharField(max_length=20, default='monthly')
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.amount}"


class CashFlowForecast(models.Model):
    PERIOD_CHOICES = [
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
        ('quarterly', 'Quarterly'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='cash_flow_forecasts', null=True, blank=True)
    
    name = models.CharField(max_length=200)
    period = models.CharField(max_length=20, choices=PERIOD_CHOICES, default='monthly')
    cash_inflow = models.FloatField(default=0)
    cash_outflow = models.FloatField(default=0)
    net_position = models.FloatField(default=0)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.period}"


class KPI(models.Model):
    STATUS_CHOICES = [
        ('on_track', 'On Track'),
        ('at_risk', 'At Risk'),
        ('critical', 'Critical'),
        ('exceeding_target', 'Exceeding Target'),
        ('off_track', 'Off Track'),
    ]
    CATEGORY_CHOICES = [
        ('revenue', 'Revenue'),
        ('cost', 'Cost'),
        ('efficiency', 'Efficiency'),
        ('growth', 'Growth'),
        ('financial', 'Financial'),
        ('operational', 'Operational'),
        ('sales', 'Sales'),
        ('productivity', 'Productivity'),
        ('risk', 'Risk'),
    ]
    IMPACT_CHOICES = [('low', 'Low'), ('medium', 'Medium'), ('high', 'High')]
    TREND_CHOICES = [('improving', 'Improving'), ('stable', 'Stable'), ('declining', 'Declining')]
    DRIVER_TYPE_CHOICES = [('leading', 'Leading'), ('lagging', 'Lagging')]
    DATA_SOURCE_CHOICES = [('manual', 'Manual'), ('upload', 'Upload'), ('auto_sync', 'Auto Sync')]
    UNIT_OF_MEASURE_CHOICES = [
        ('%', 'Percentage'),
        ('$', 'Currency'),
        ('ratio', 'Ratio'),
        ('count', 'Count'),
        ('days', 'Days'),
        ('hours', 'Hours'),
        ('score', 'Score'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='kpis', null=True, blank=True)
    
    name = models.CharField(max_length=200)
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES, default='financial')
    impact = models.CharField(max_length=20, choices=IMPACT_CHOICES, default='medium')
    current_value = models.FloatField()
    target_value = models.FloatField()
    unit = models.CharField(max_length=50, blank=True)
    trend = models.CharField(max_length=20, choices=TREND_CHOICES, default='stable')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='on_track')
    driver_type = models.CharField(max_length=20, choices=DRIVER_TYPE_CHOICES, default='leading')
    unit_of_measure = models.CharField(max_length=20, choices=UNIT_OF_MEASURE_CHOICES, default='%')
    warning_threshold = models.FloatField(default=0)
    critical_threshold = models.FloatField(default=0)
    data_source = models.CharField(max_length=20, choices=DATA_SOURCE_CHOICES, default='manual')
    linked_budget_items = models.JSONField(default=list)
    driver_link = models.JSONField(default=list)
    kpi_history = models.JSONField(default=list)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name}: {self.current_value}/{self.target_value}"


class ScenarioPlanning(models.Model):
    TYPE_CHOICES = [('optimistic', 'Optimistic'), ('pessimistic', 'Pessimistic'), ('base', 'Base Case')]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='scenario_plannings', null=True, blank=True)
    
    name = models.CharField(max_length=200)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='base')
    probability = models.IntegerField(default=33)
    description = models.TextField()
    impact_analysis = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.type})"


class Document(models.Model):
    FILE_TYPE_CHOICES = [
        ('pdf', 'PDF'),
        ('excel', 'Excel'),
        ('word', 'Word'),
        ('image', 'Image'),
        ('other', 'Other'),
    ]
    
    title = models.CharField(max_length=200)
    file = models.FileField(upload_to='documents/')
    file_type = models.CharField(max_length=20, choices=FILE_TYPE_CHOICES)
    size = models.IntegerField(default=0)
    uploaded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    extracted_text = models.TextField(blank=True)
    metadata = models.JSONField(default=dict)

    def __str__(self):
        return self.title

    def get_status(self):
        metadata = self.metadata if isinstance(self.metadata, dict) else {}
        return metadata.get('status', 'Processing')

    def get_category(self):
        metadata = self.metadata if isinstance(self.metadata, dict) else {}
        return metadata.get('category', 'General')

    def get_tags(self):
        metadata = self.metadata if isinstance(self.metadata, dict) else {}
        tags = metadata.get('tags', [])
        return tags if isinstance(tags, list) else []


class DocumentProcessingEvent(models.Model):
    STAGE_CHOICES = [
        ('uploaded', 'Uploaded'),
        ('ingest', 'Ingest'),
        ('extract', 'Extract'),
        ('normalize', 'Normalize'),
        ('metadata', 'Metadata'),
        ('storage', 'Storage'),
        ('trigger', 'Trigger'),
        ('complete', 'Complete'),
        ('error', 'Error'),
    ]

    LEVEL_CHOICES = [
        ('info', 'Info'),
        ('success', 'Success'),
        ('warning', 'Warning'),
        ('error', 'Error'),
    ]

    document = models.ForeignKey(
        Document,
        on_delete=models.CASCADE,
        related_name='processing_events',
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='document_processing_events')
    stage = models.CharField(max_length=20, choices=STAGE_CHOICES, default='uploaded')
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES, default='info')
    message = models.CharField(max_length=300)
    details = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at', '-id']

    def __str__(self):
        return f"{self.document_id} {self.stage}: {self.message}"


class Insight(models.Model):
    document = models.OneToOneField(Document, on_delete=models.CASCADE, related_name='insight')
    summary = models.TextField()
    key_points = models.JSONField(default=list)
    keywords = models.JSONField(default=list)
    entities = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at', '-id']

    def __str__(self):
        return f"Insight<{self.document_id}>"


class KeyAssumption(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='key_assumptions', null=True, blank=True)
    label = models.CharField(max_length=200)
    value = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.label}: {self.value}"


class KeyRisk(models.Model):
    LEVEL_CHOICES = [('low', 'Low'), ('medium', 'Medium'), ('high', 'High')]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='key_risks', null=True, blank=True)
    label = models.CharField(max_length=200)
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES, default='medium')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.label} ({self.level})"


class CompetitiveMetric(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='competitive_metrics', null=True, blank=True)
    label = models.CharField(max_length=200)
    current_value = models.CharField(max_length=100)
    target_value = models.CharField(max_length=100, blank=True, default='')
    unit = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.label}: {self.current_value}{self.unit}"


class ForecastActionItem(models.Model):
    PRIORITY_CHOICES = [('low', 'Low'), ('medium', 'Medium'), ('high', 'High')]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='forecast_action_items', null=True, blank=True)
    index = models.IntegerField(default=0)
    title = models.CharField(max_length=200)
    description = models.TextField()
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    timeline = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['index']

    def __str__(self):
        return self.title


class ForecastNextStep(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='forecast_next_steps', null=True, blank=True)
    index = models.IntegerField(default=0)
    step = models.TextField()
    owner = models.CharField(max_length=200)
    due_date = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['index']

    def __str__(self):
        return f"Step {self.index}: {self.step[:50]}"


class GrowthTrajectory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='growth_trajectories', null=True, blank=True)
    quarter = models.CharField(max_length=50)
    description = models.CharField(max_length=200)
    revenue_target = models.FloatField(default=0, help_text="Quarterly revenue target")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['quarter']

    def __str__(self):
        return f"{self.quarter}: {self.description}"


class RevenueTarget(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='revenue_targets', null=True, blank=True)
    annual_revenue = models.FloatField(default=0)
    quarterly_target = models.FloatField(default=0)
    monthly_target = models.FloatField(default=0)
    growth_rate = models.FloatField(default=0)
    q1_revenue = models.FloatField(default=0)
    q2_revenue = models.FloatField(default=0)
    q3_revenue = models.FloatField(default=0)
    q4_revenue = models.FloatField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Revenue Target: {self.annual_revenue}"


class RevenueProductServiceForecast(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='revenue_product_service_forecasts', null=True, blank=True)
    name = models.CharField(max_length=200)
    projection_year = models.IntegerField(default=2025)
    projected_revenue = models.FloatField(default=0)
    growth_rate = models.FloatField(default=0, help_text="Growth rate percentage")
    market_share = models.FloatField(default=0, help_text="Market share percentage")
    sort_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['sort_order', 'name']

    def __str__(self):
        return f"{self.name} ({self.projection_year})"


class RevenueRegionalForecast(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='revenue_regional_forecasts', null=True, blank=True)
    region = models.CharField(max_length=120)
    projected_revenue = models.FloatField(default=0)
    revenue_share = models.FloatField(default=0, help_text="Region share of total revenue percentage")
    growth_rate = models.FloatField(default=0, help_text="Growth rate percentage")
    sort_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['sort_order', 'region']

    def __str__(self):
        return self.region


class RevenueHistoricalComparison(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='revenue_historical_comparisons', null=True, blank=True)
    label = models.CharField(max_length=120)
    total_revenue = models.FloatField(default=0)
    growth_percent = models.FloatField(default=0)
    growth_label = models.CharField(max_length=120, default='YoY Growth')
    supporting_metric_label = models.CharField(max_length=120, default='Confidence Level')
    supporting_metric_value = models.CharField(max_length=120, default='0%')
    sort_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['sort_order', 'label']

    def __str__(self):
        return self.label


class RevenueForecastMethod(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='revenue_forecast_methods', null=True, blank=True)
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    projected_revenue = models.FloatField(default=0)
    metric_label = models.CharField(max_length=120, default='Model Accuracy')
    metric_value = models.CharField(max_length=120, default='0%')
    sort_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['sort_order', 'name']

    def __str__(self):
        return self.name


class RevenueScenarioSnapshot(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='revenue_scenario_snapshots', null=True, blank=True)
    scenario = models.CharField(max_length=100)
    probability = models.IntegerField(default=0)
    annual_revenue = models.FloatField(default=0)
    operating_costs = models.FloatField(default=0)
    net_profit = models.FloatField(default=0)
    key_assumptions = models.JSONField(default=list)
    sort_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['sort_order', 'scenario']

    def __str__(self):
        return self.scenario


class RevenueSegmentBreakdown(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='revenue_segment_breakdowns', null=True, blank=True)
    segment = models.CharField(max_length=120)
    revenue = models.FloatField(default=0)
    percentage_of_total = models.FloatField(default=0)
    growth_rate = models.FloatField(default=0)
    customer_count = models.IntegerField(default=0)
    sort_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['sort_order', 'segment']

    def __str__(self):
        return self.segment


class CostOverviewMetric(models.Model):
    COST_TYPE_CHOICES = [
        ('fixed', 'Fixed'),
        ('variable', 'Variable'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='cost_overview_metrics', null=True, blank=True)
    cost_type = models.CharField(max_length=20, choices=COST_TYPE_CHOICES)
    description = models.TextField()
    annual_total = models.FloatField(default=0)
    monthly_average = models.FloatField(default=0)
    percent_of_revenue = models.FloatField(default=0)
    insight = models.CharField(max_length=200, blank=True, default='')
    sort_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['sort_order', 'cost_type']

    def __str__(self):
        return f"{self.cost_type.title()} Costs"


class CostBudgetScenario(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='cost_budget_scenarios', null=True, blank=True)
    label = models.CharField(max_length=120)
    amount = models.FloatField(default=0)
    subtitle = models.CharField(max_length=200, blank=True, default='')
    note = models.CharField(max_length=200, blank=True, default='')
    sort_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['sort_order', 'label']

    def __str__(self):
        return self.label


class CostMonthlyComparison(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='cost_monthly_comparisons', null=True, blank=True)
    month = models.CharField(max_length=30)
    budget_amount = models.FloatField(default=0)
    forecast_amount = models.FloatField(default=0)
    actual_amount = models.FloatField(null=True, blank=True)
    sort_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['sort_order', 'month']

    def __str__(self):
        return self.month


class OperationalExpenseCategory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='operational_expense_categories', null=True, blank=True)
    name = models.CharField(max_length=120)
    total_amount = models.FloatField(default=0)
    sort_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['sort_order', 'name']

    def __str__(self):
        return self.name


class OperationalExpenseItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='operational_expense_items', null=True, blank=True)
    category = models.ForeignKey(OperationalExpenseCategory, on_delete=models.CASCADE, related_name='items')
    name = models.CharField(max_length=150)
    amount = models.FloatField(default=0)
    sort_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['sort_order', 'name']

    def __str__(self):
        return f"{self.category.name}: {self.name}"


class CostTrendAnalysis(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='cost_trend_analyses', null=True, blank=True)
    title = models.CharField(max_length=120)
    value = models.CharField(max_length=120)
    description = models.TextField(blank=True)
    benchmark = models.CharField(max_length=200, blank=True, default='')
    bullet_points = models.JSONField(default=list)
    sort_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['sort_order', 'title']

    def __str__(self):
        return self.title


class OverviewProfitLossSnapshot(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='overview_profit_loss_snapshots', null=True, blank=True)
    gross_profit = models.FloatField(default=0)
    gross_margin = models.FloatField(default=0)
    operating_expense = models.FloatField(default=0)
    net_profit = models.FloatField(default=0)
    net_margin = models.FloatField(default=0)
    period_label = models.CharField(max_length=60, default='Current')
    sort_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['sort_order', 'id']

    def __str__(self):
        return f"Profit/Loss ({self.period_label})"


class OverviewKpiSummary(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='overview_kpi_summaries', null=True, blank=True)
    metrics_tracked = models.IntegerField(default=0)
    excellent_count = models.IntegerField(default=0)
    good_count = models.IntegerField(default=0)
    fair_count = models.IntegerField(default=0)
    needs_attention_count = models.IntegerField(default=0)
    sort_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['sort_order', 'id']

    def __str__(self):
        return f"KPI Summary ({self.metrics_tracked} tracked)"


class OverviewAlert(models.Model):
    TYPE_CHOICES = [
        ('warning', 'Warning'),
        ('danger', 'Danger'),
        ('info', 'Info'),
        ('success', 'Success'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='overview_alerts', null=True, blank=True)
    alert_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='warning')
    title = models.CharField(max_length=200)
    description = models.TextField()
    sort_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['sort_order', 'id']

    def __str__(self):
        return self.title


class BusinessMetric(models.Model):
    CATEGORY_CHOICES = [
        ('Financial', 'Financial'),
        ('Customer', 'Customer'),
        ('Sales & Marketing', 'Sales & Marketing'),
        ('Operational', 'Operational'),
        ('HR & Employee', 'HR & Employee'),
        ('Project & Product', 'Project & Product'),
        ('Innovation & Growth', 'Innovation & Growth'),
        ('Digital & IT', 'Digital & IT'),
    ]
    STATUS_CHOICES = [
        ('good', 'Good'),
        ('fair', 'Fair'),
        ('excellent', 'Excellent'),
    ]
    TREND_CHOICES = [
        ('up', 'Up'),
        ('down', 'Down'),
        ('stable', 'Stable'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='business_metrics', null=True, blank=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    metric = models.CharField(max_length=200)
    current = models.CharField(max_length=50)
    target = models.CharField(max_length=50)
    last_month = models.CharField(max_length=50, blank=True)
    trend = models.CharField(max_length=20, choices=TREND_CHOICES, default='stable')
    change = models.CharField(max_length=50)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['category', 'metric']

    def __str__(self):
        return f"{self.category}: {self.metric}"


# ==================== MARKET MODELS ====================

class MarketSegment(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    size = models.FloatField(help_text="Market size in millions")
    growth_rate = models.FloatField(help_text="Growth rate percentage")
    target_demographics = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Competitor(models.Model):
    COMPETITOR_TYPE_CHOICES = [
        ('direct', 'Direct'),
        ('indirect', 'Indirect'),
        ('substitute', 'Substitute'),
    ]

    MARKET_POSITION_CHOICES = [
        ('premium', 'Premium'),
        ('mid-market', 'Mid Market'),
        ('budget', 'Budget'),
    ]

    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    competitor_type = models.CharField(
        max_length=20,
        choices=COMPETITOR_TYPE_CHOICES,
        default='direct',
    )
    market_share = models.FloatField(help_text="Market share percentage")
    strengths = models.TextField()
    weaknesses = models.TextField(blank=True)
    website = models.URLField(blank=True)
    revenue = models.FloatField(null=True, blank=True)
    employees = models.IntegerField(null=True, blank=True)
    founded = models.IntegerField(null=True, blank=True)
    headquarters = models.CharField(max_length=200, blank=True)
    key_products = models.JSONField(default=list, help_text="Key products")
    target_markets = models.JSONField(default=list, help_text="Target markets")
    funding_stage = models.CharField(max_length=100, blank=True)
    last_funding = models.FloatField(null=True, blank=True)
    market_position = models.CharField(
        max_length=20,
        choices=MARKET_POSITION_CHOICES,
        default='mid-market',
    )
    pricing_model = models.CharField(max_length=200, blank=True)
    pricing_summary = models.CharField(max_length=200, blank=True)
    current_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    feature_highlights = models.JSONField(default=list, help_text="Competitive highlights")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class MarketTrend(models.Model):
    CATEGORY_CHOICES = [
        ('technology', 'Technology'),
        ('consumer_behavior', 'Consumer Behavior'),
        ('regulatory', 'Regulatory'),
        ('economic', 'Economic'),
    ]
    IMPACT_CHOICES = [('high', 'High'), ('medium', 'Medium'), ('low', 'Low')]
    DIRECTION_CHOICES = [
        ('positive', 'Positive'),
        ('negative', 'Negative'),
        ('neutral', 'Neutral'),
    ]
    
    name = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES)
    impact = models.CharField(max_length=20, choices=IMPACT_CHOICES, default='medium')
    direction = models.CharField(max_length=20, choices=DIRECTION_CHOICES, default='positive')
    timeframe = models.CharField(max_length=50, blank=True)
    sources = models.JSONField(default=list, help_text="Reference sources")
    confidence = models.IntegerField(default=80, help_text="Confidence percentage")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


# ==================== MARKET ANALYSIS MODELS ====================

class MarketSize(models.Model):
    """Overall market sizing data (TAM, SAM, SOM)"""
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    tam = models.FloatField(help_text="Total Addressable Market (in millions)")
    sam = models.FloatField(help_text="Serviceable Addressable Market (in millions)")
    som = models.FloatField(help_text="Serviceable Obtainable Market (in millions)")
    growth_rate = models.FloatField(default=0, help_text="Market growth rate percentage")
    timeframe = models.CharField(max_length=50, default="2025")
    currency = models.CharField(max_length=10, default="USD")
    region = models.CharField(max_length=100, default="Global")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} (TAM: ${self.tam}M)"


class CustomerSegmentData(models.Model):
    """Detailed customer segment information for market analysis"""
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    market_size = models.FloatField(help_text="Segment size in millions")
    percentage_of_total = models.FloatField(default=0, help_text="Percentage of total market")
    avg_spending = models.FloatField(help_text="Average spending per customer")
    growth_rate = models.FloatField(help_text="Segment growth rate percentage")
    characteristics = models.JSONField(default=list, help_text="Key segment characteristics")
    region = models.CharField(max_length=100, default="Global")
    priority = models.CharField(max_length=20, choices=[('high', 'High'), ('medium', 'Medium'), ('low', 'Low')], default='medium')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-priority', '-growth_rate']

    def __str__(self):
        return self.name


class MarketDemandForecast(models.Model):
    """Demand forecasts for different market segments"""
    segment = models.CharField(max_length=200)
    period = models.CharField(max_length=50, help_text="e.g., Q1 2025, 2026")
    current_demand = models.FloatField(null=True, blank=True)
    forecasted_demand = models.FloatField()
    confidence_level = models.IntegerField(default=70, help_text="Confidence percentage")
    assumptions = models.TextField(blank=True)
    key_factors = models.JSONField(default=list, help_text="Key demand factors")
    scenarios = models.JSONField(default=list, help_text="Demand scenarios")
    seasonality_factor = models.FloatField(default=1.0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.segment} - {self.period}"


class IndustryInsight(models.Model):
    """Industry-wide insights and observations"""
    title = models.CharField(max_length=300)
    description = models.TextField()
    insight_type = models.CharField(max_length=50, choices=[
        ('trend', 'Trend'),
        ('threat', 'Threat'),
        ('opportunity', 'Opportunity'),
        ('observation', 'Observation'),
    ], default='observation')
    impact_level = models.CharField(max_length=20, choices=[
        ('high', 'High'),
        ('medium', 'Medium'),
        ('low', 'Low'),
    ], default='medium')
    timeframe = models.CharField(max_length=100, blank=True)
    probability = models.IntegerField(null=True, blank=True, help_text="Probability percentage")
    action_items = models.JSONField(default=list, help_text="Recommended action items")
    sources = models.JSONField(default=list, help_text="Reference sources")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class MarketSummary(models.Model):
    """Executive summary of market analysis"""
    title = models.CharField(max_length=300, default="Market Analysis Summary")
    content = models.TextField(help_text="Full market summary text")
    key_points = models.JSONField(default=list, help_text="Key summary points")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class MarketRecommendation(models.Model):
    """Strategic recommendations based on market analysis"""
    title = models.CharField(max_length=300)
    description = models.TextField()
    priority = models.CharField(max_length=20, choices=[
        ('high', 'High'),
        ('medium', 'Medium'),
        ('low', 'Low'),
    ], default='medium')
    implementation_timeline = models.CharField(max_length=200, blank=True)
    expected_impact = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-priority', '-created_at']

    def __str__(self):
        return self.title


class MarketActionItem(models.Model):
    """Action items for market strategy implementation"""
    PRIORITY_CHOICES = [('high', 'High'), ('medium', 'Medium'), ('low', 'Low')]

    title = models.CharField(max_length=200)
    description = models.TextField()
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    timeline = models.CharField(max_length=100, help_text="e.g., Q1 2025")
    owner = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-priority', '-created_at']

    def __str__(self):
        return self.title


class MarketNextStep(models.Model):
    """Next steps for market analysis and strategy"""
    step = models.TextField()
    owner = models.CharField(max_length=200)
    due_date = models.CharField(max_length=100)
    status = models.CharField(max_length=50, choices=[
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
    ], default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['due_date', '-created_at']

    def __str__(self):
        return self.step[:100]


class SWOTAnalysis(models.Model):
    """SWOT analysis for competitive positioning"""
    competitor_name = models.CharField(max_length=200)
    strengths = models.JSONField(default=list, help_text="List of strengths")
    weaknesses = models.JSONField(default=list, help_text="List of weaknesses")
    opportunities = models.JSONField(default=list, help_text="List of opportunities")
    threats = models.JSONField(default=list, help_text="List of threats")
    overall_score = models.IntegerField(default=50, help_text="Overall SWOT score 0-100")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-overall_score']

    def __str__(self):
        return f"SWOT: {self.competitor_name}"


class ProductComparison(models.Model):
    """Product-level competitive comparison"""
    product_name = models.CharField(max_length=200)
    competitor_products = models.JSONField(default=list, help_text="List of competitor products to compare")
    features = models.JSONField(default=dict, help_text="Feature comparison matrix")
    strengths = models.JSONField(default=list, help_text="Competitor strengths")
    weaknesses = models.JSONField(default=list, help_text="Competitor weaknesses")
    pricing_comparison = models.JSONField(default=dict, help_text="Pricing data")
    market_position = models.CharField(max_length=50, choices=[
        ('premium', 'Premium'),
        ('aligned', 'Market Aligned'),
        ('competitive', 'Competitive'),
        ('discount', 'Discount'),
    ], default='aligned')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.product_name


class MarketPosition(models.Model):
    """Overall market positioning analysis"""
    market_segment = models.CharField(max_length=200)
    our_position = models.CharField(max_length=200, help_text="Our current market position")
    market_leader = models.CharField(max_length=200, blank=True)
    primary_competitors = models.JSONField(default=list, help_text="List of primary competitors")
    market_share_estimate = models.FloatField(help_text="Our estimated market share percentage")
    value_score = models.IntegerField(null=True, blank=True, help_text="Value score 1-10")
    price_score = models.IntegerField(null=True, blank=True, help_text="Price score 1-10")
    quadrant = models.CharField(max_length=30, choices=[
        ('leader', 'Leader'),
        ('challenger', 'Challenger'),
        ('niche', 'Niche'),
        ('follower', 'Follower'),
    ], blank=True)
    movement = models.CharField(max_length=30, choices=[
        ('rising', 'Rising'),
        ('stable', 'Stable'),
        ('declining', 'Declining'),
    ], blank=True)
    positioning_statement = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.market_segment} Positioning"


class CompetitiveAdvantage(models.Model):
    """Our competitive advantages"""
    ADVANTAGE_TYPE_CHOICES = [
        ('product', 'Product'),
        ('service', 'Service'),
        ('brand', 'Brand'),
        ('price', 'Price'),
        ('distribution', 'Distribution'),
        ('technology', 'Technology'),
        ('team', 'Team'),
        ('other', 'Other'),
    ]

    advantage = models.CharField(max_length=200)
    description = models.TextField()
    advantage_type = models.CharField(max_length=50, choices=ADVANTAGE_TYPE_CHOICES)
    strength_level = models.CharField(max_length=20, choices=[
        ('high', 'High'),
        ('medium', 'Medium'),
        ('low', 'Low'),
    ], default='medium')
    sustainability = models.IntegerField(default=50, help_text="Sustainability score 0-100")
    competitor_response = models.JSONField(default=list, help_text="Potential competitor responses")
    time_to_replicate = models.IntegerField(null=True, blank=True, help_text="Months to replicate")
    strategic_importance = models.CharField(max_length=20, choices=[
        ('critical', 'Critical'),
        ('important', 'Important'),
        ('moderate', 'Moderate'),
    ], blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-strength_level', '-sustainability']

    def __str__(self):
        return self.advantage


class MarketStrategyRecommendation(models.Model):
    """Strategic recommendations based on competitive analysis"""
    title = models.CharField(max_length=300)
    strategy_type = models.CharField(max_length=100, choices=[
        ('pricing', 'Pricing'),
        ('positioning', 'Positioning'),
        ('product', 'Product'),
        ('marketing', 'Marketing'),
        ('partnership', 'Partnership'),
        ('expansion', 'Market Expansion'),
        ('defense', 'Competitive Defense'),
        ('other', 'Other'),
    ])
    description = models.TextField()
    rationale = models.TextField(blank=True, help_text="Why this strategy is recommended")
    expected_impact = models.CharField(max_length=20, choices=[
        ('high', 'High'),
        ('medium', 'Medium'),
        ('low', 'Low'),
    ], blank=True)
    implementation_complexity = models.CharField(max_length=20, choices=[
        ('high', 'High'),
        ('medium', 'Medium'),
        ('low', 'Low'),
    ], blank=True)
    timeframe = models.CharField(max_length=30, choices=[
        ('immediate', 'Immediate'),
        ('short-term', 'Short Term'),
        ('long-term', 'Long Term'),
    ], blank=True)
    expected_outcomes = models.JSONField(default=list, help_text="Expected outcomes")
    implementation_steps = models.JSONField(default=list, help_text="Implementation steps")
    success_metrics = models.JSONField(default=list, help_text="KPIs to track success")
    risks = models.JSONField(default=list, help_text="Key implementation risks")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class ReportNote(models.Model):
    """Notes and observations for market analysis reports"""
    title = models.CharField(max_length=300)
    content = models.TextField()
    summary = models.TextField(blank=True)
    author = models.CharField(max_length=100, blank=True)
    confidence = models.IntegerField(null=True, blank=True)
    key_metrics = models.JSONField(default=list, help_text="Key metrics for report cards")
    insights = models.JSONField(default=list, help_text="Key insights list")
    recommendations = models.JSONField(default=list, help_text="Strategic recommendations list")
    next_steps = models.JSONField(default=list, help_text="Next steps list")
    date_generated = models.DateTimeField(null=True, blank=True)
    category = models.CharField(max_length=100, choices=[
        ('overview', 'Overview'),
        ('market', 'Market Analysis'),
        ('competitive', 'Competitive Analysis'),
        ('strategy', 'Strategy'),
        ('recommendation', 'Recommendation'),
        ('other', 'Other'),
    ], default='other')
    importance = models.CharField(max_length=20, choices=[
        ('critical', 'Critical'),
        ('high', 'High'),
        ('medium', 'Medium'),
        ('low', 'Low'),
    ], default='medium')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-importance', '-created_at']

    def __str__(self):
        return self.title


class ReportActionPlan(models.Model):
    """Action plans created from market analysis reports."""
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]
    TIMELINE_CHOICES = [
        ('immediate', 'Immediate (0-1 week)'),
        ('short-term', 'Short-term (1-3 months)'),
        ('medium-term', 'Medium-term (3-6 months)'),
        ('long-term', 'Long-term (6+ months)'),
    ]

    report_note = models.ForeignKey(
        ReportNote,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='action_plans',
    )
    report_title = models.CharField(max_length=300, blank=True)
    title = models.CharField(max_length=300)
    description = models.TextField()
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    owner = models.CharField(max_length=200, blank=True)
    timeline = models.CharField(max_length=20, choices=TIMELINE_CHOICES, default='short-term')
    target_date = models.DateField()
    budget = models.CharField(max_length=120, blank=True)
    resources = models.TextField(blank=True)
    success_metrics = models.TextField(blank=True)
    risks = models.TextField(blank=True)
    mitigation = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class ReportEngagementEvent(models.Model):
    """Tracks report interactions such as generation, export, and sharing."""
    ACTION_CHOICES = [
        ('generated_pdf', 'Generated PDF'),
        ('exported_csv', 'Exported CSV'),
        ('shared', 'Shared'),
    ]

    report_note = models.ForeignKey(
        ReportNote,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='engagement_events',
    )
    action_type = models.CharField(max_length=30, choices=ACTION_CHOICES)
    channel = models.CharField(max_length=50, blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        report_name = self.report_note.title if self.report_note else 'Unknown report'
        return f"{self.action_type} - {report_name}"


# ==================== LOAN MODELS ====================

class LoanEligibility(models.Model):
    STATUS_CHOICES = [('eligible', 'Eligible'), ('pending', 'Pending'), ('not_eligible', 'Not Eligible')]
    
    business_name = models.CharField(max_length=200)
    business_type = models.CharField(max_length=100)
    eligible_amount = models.FloatField()
    interest_rate = models.FloatField()
    term_months = models.IntegerField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    requirements = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.business_name} - {self.eligible_amount}"


class FundingOption(models.Model):
    TYPE_CHOICES = [
        ('loan', 'Loan'),
        ('venture_capital', 'Venture Capital'),
        ('angel_investor', 'Angel Investor'),
        ('crowdfunding', 'Crowdfunding'),
        ('grant', 'Grant'),
    ]
    
    name = models.CharField(max_length=200)
    type = models.CharField(max_length=30, choices=TYPE_CHOICES)
    min_amount = models.FloatField()
    max_amount = models.FloatField()
    interest_rate = models.FloatField(null=True, blank=True)
    description = models.TextField()
    requirements = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class LoanComparison(models.Model):
    name = models.CharField(max_length=200)
    lender = models.CharField(max_length=200)
    amount = models.FloatField()
    interest_rate = models.FloatField()
    term_months = models.IntegerField()
    monthly_payment = models.FloatField()
    total_interest = models.FloatField()
    features = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.lender}"


class BusinessPlan(models.Model):
    title = models.CharField(max_length=200)
    industry = models.CharField(max_length=100)
    summary = models.TextField()
    financials = models.JSONField(default=dict)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class FundingStrategy(models.Model):
    RISK_CHOICES = [('low', 'Low'), ('medium', 'Medium'), ('high', 'High')]
    
    name = models.CharField(max_length=200)
    description = models.TextField()
    risk_level = models.CharField(max_length=20, choices=RISK_CHOICES, default='medium')
    timeline = models.CharField(max_length=100)
    recommended_sources = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class InvestorMatch(models.Model):
    investor_name = models.CharField(max_length=200)
    investment_range_min = models.FloatField()
    investment_range_max = models.FloatField()
    sector_focus = models.CharField(max_length=200)
    typical_deal_size = models.FloatField()
    contact_info = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.investor_name


# ==================== REVENUE MODELS ====================

class RevenueStream(models.Model):
    TYPE_CHOICES = [
        ('product', 'Product'),
        ('service', 'Service'),
        ('subscription', 'Subscription'),
        ('advertising', 'Advertising'),
    ]
    
    name = models.CharField(max_length=200)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    current_revenue = models.FloatField()
    growth_rate = models.FloatField(default=0)
    margin = models.FloatField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class RevenueScenario(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    probability = models.IntegerField(default=50)
    projected_revenue = models.FloatField()
    assumptions = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.projected_revenue}"


class ChurnAnalysis(models.Model):
    segment = models.CharField(max_length=100)
    churn_rate = models.FloatField()
    risk_score = models.FloatField()
    reasons = models.JSONField(default=list)
    period = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.segment} - {self.churn_rate}%"


class UpsellOpportunity(models.Model):
    customer = models.ForeignKey(CustomerProfile, on_delete=models.CASCADE)
    product = models.CharField(max_length=200)
    current_price = models.FloatField()
    upsell_price = models.FloatField()
    potential_revenue = models.FloatField()
    probability = models.IntegerField(default=50)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.customer.name} - {self.product}"


class RevenueMetric(models.Model):
    name = models.CharField(max_length=200)
    value = models.FloatField()
    previous_value = models.FloatField(default=0)
    change_percent = models.FloatField(default=0)
    period = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name}: {self.value}"


class ChannelPerformance(models.Model):
    channel = models.CharField(max_length=100)
    revenue = models.FloatField()
    conversion_rate = models.FloatField()
    customer_acquisition_cost = models.FloatField()
    period = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.channel} - {self.revenue}"


class RevenueOverviewMetric(models.Model):
    TREND_CHOICES = [
        ('up', 'Up'),
        ('down', 'Down'),
        ('stable', 'Stable'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='revenue_overview_metrics', null=True, blank=True)
    name = models.CharField(max_length=200)
    value = models.FloatField(default=0)
    unit = models.CharField(max_length=20, default='USD')
    change_percent = models.FloatField(default=0)
    trend = models.CharField(max_length=20, choices=TREND_CHOICES, default='stable')
    period_label = models.CharField(max_length=120, default='Current period')
    sort_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['sort_order', 'id']

    def __str__(self):
        return self.name


class RevenueOverviewTopStream(models.Model):
    TYPE_CHOICES = [
        ('subscription', 'Subscription'),
        ('one-time', 'One Time'),
        ('usage-based', 'Usage Based'),
        ('commission', 'Commission'),
        ('advertising', 'Advertising'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='revenue_overview_top_streams', null=True, blank=True)
    name = models.CharField(max_length=200)
    stream_type = models.CharField(max_length=30, choices=TYPE_CHOICES)
    revenue = models.FloatField(default=0)
    growth_percent = models.FloatField(default=0)
    sort_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['sort_order', 'id']

    def __str__(self):
        return self.name


class RevenueOverviewChurnRisk(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='revenue_overview_churn_risks', null=True, blank=True)
    segment = models.CharField(max_length=120)
    customers = models.IntegerField(default=0)
    churn_rate = models.FloatField(default=0)
    revenue_at_risk = models.FloatField(default=0)
    sort_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['sort_order', 'id']

    def __str__(self):
        return self.segment


class RevenueOverviewUpsellOpportunity(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='revenue_overview_upsell_opportunities', null=True, blank=True)
    customer_name = models.CharField(max_length=200)
    current_plan = models.CharField(max_length=120)
    suggested_plan = models.CharField(max_length=120)
    current_mrr = models.FloatField(default=0)
    potential_increase = models.FloatField(default=0)
    likelihood_percent = models.IntegerField(default=0)
    time_to_upgrade_days = models.IntegerField(default=0)
    triggers = models.JSONField(default=list)
    sort_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['sort_order', 'id']

    def __str__(self):
        return self.customer_name


class RevenueUpsellInsight(models.Model):
    CATEGORY_CHOICES = [
        ('high-priority', 'High-Priority Actions'),
        ('success-factor', 'Success Factors'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='revenue_upsell_insights', null=True, blank=True)
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES)
    text = models.CharField(max_length=300)
    sort_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['category', 'sort_order', 'id']

    def __str__(self):
        return f"{self.category}: {self.text[:40]}"


class RevenueOverviewChannelPerformance(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='revenue_overview_channel_performances', null=True, blank=True)
    channel = models.CharField(max_length=120)
    customers = models.IntegerField(default=0)
    revenue = models.FloatField(default=0)
    margin_percent = models.FloatField(default=0)
    sort_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['sort_order', 'id']

    def __str__(self):
        return self.channel


# ==================== FINANCIAL MODELS ====================

class FinancialLineItem(models.Model):
    CATEGORY_CHOICES = [
        ('Revenue', 'Revenue'),
        ('Expenses', 'Expenses'),
        ('Assets', 'Assets'),
        ('Liabilities', 'Liabilities'),
        ('Equity', 'Equity'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='financial_line_items', null=True, blank=True)
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES)
    item = models.CharField(max_length=200)
    current_amount = models.FloatField(default=0)
    budget_amount = models.FloatField(default=0)
    last_year_amount = models.FloatField(default=0)
    unit = models.CharField(max_length=20, default='USD')
    period = models.CharField(max_length=30, default='annual')
    sort_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['category', 'sort_order', 'item']

    def __str__(self):
        return f"{self.category} - {self.item}"

class BudgetForecast(models.Model):
    category = models.CharField(max_length=100)
    amount = models.FloatField()
    actual_amount = models.FloatField(null=True, blank=True)
    variance = models.FloatField(default=0)
    period = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.category} - {self.period}"


class CashFlowProjection(models.Model):
    TYPE_CHOICES = [('inflow', 'Inflow'), ('outflow', 'Outflow')]
    
    name = models.CharField(max_length=200)
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    amount = models.FloatField()
    period = models.CharField(max_length=20)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.amount}"


class ScenarioTest(models.Model):
    TYPE_CHOICES = [
        ('stress', 'Stress Test'),
        ('sensitivity', 'Sensitivity Analysis'),
        ('what_if', 'What-If Analysis'),
    ]
    
    name = models.CharField(max_length=200)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    description = models.TextField()
    impact = models.JSONField(default=dict)
    probability = models.IntegerField(default=50)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class RiskAssessment(models.Model):
    LEVEL_CHOICES = [('low', 'Low'), ('medium', 'Medium'), ('high', 'High')]
    IMPACT_CHOICES = [('low', 'Low'), ('medium', 'Medium'), ('high', 'High')]
    
    category = models.CharField(max_length=100)
    description = models.TextField()
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES)
    impact = models.CharField(max_length=20, choices=IMPACT_CHOICES)
    mitigation = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.category} - {self.level}"


class AdvisoryInsight(models.Model):
    PRIORITY_CHOICES = [('low', 'Low'), ('medium', 'Medium'), ('high', 'High'), ('critical', 'Critical')]
    STATUS_CHOICES = [('new', 'New'), ('reviewed', 'Reviewed'), ('implemented', 'Implemented'), ('dismissed', 'Dismissed')]
    CATEGORY_CHOICES = [
        ('cost_optimization', 'Cost Optimization'),
        ('revenue_growth', 'Revenue Growth'),
        ('risk_management', 'Risk Management'),
        ('operational', 'Operational'),
        ('investment', 'Investment'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES)
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    recommendations = models.JSONField(default=list)
    financial_impact = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    timeframe = models.CharField(max_length=50, default='90 days')
    confidence_score = models.IntegerField(default=70)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class LiquidityMetric(models.Model):
    name = models.CharField(max_length=100)
    value = models.FloatField()
    benchmark = models.FloatField(null=True, blank=True)
    period = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name}: {self.value}"


class BudgetValidationSummary(models.Model):
    """Top-level summary metrics for forecast-driven budget validation."""

    accuracy_score = models.FloatField(default=0)
    avg_variance = models.FloatField(default=0)
    validated_forecasts = models.IntegerField(default=0)
    budget_alignment = models.FloatField(default=0)
    generated_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-generated_at", "-id"]

    def __str__(self):
        return f"Validation summary ({self.accuracy_score:.1f}%)"


class ForecastValidationRecord(models.Model):
    """Per-period forecast-vs-actual validation row."""

    STATUS_CHOICES = [
        ("accurate", "Accurate"),
        ("acceptable", "Acceptable"),
        ("concerning", "Concerning"),
        ("pending", "Pending"),
    ]

    period = models.CharField(max_length=50)
    validation_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    forecasted_revenue = models.FloatField(default=0)
    actual_revenue = models.FloatField(null=True, blank=True)
    revenue_variance = models.FloatField(default=0)
    forecasted_net_income = models.FloatField(default=0)
    actual_net_income = models.FloatField(null=True, blank=True)
    accuracy_score = models.FloatField(default=0)
    sort_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["sort_order", "period", "id"]

    def __str__(self):
        return f"{self.period} ({self.validation_status})"


class BudgetAlignmentMetric(models.Model):
    """Alignment scorecards for budget vs forecast quality dimensions."""

    name = models.CharField(max_length=150)
    score = models.FloatField(default=0)
    sort_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["sort_order", "name", "id"]

    def __str__(self):
        return f"{self.name}: {self.score:.1f}%"


class ForecastImprovementArea(models.Model):
    """Narrative improvement cards for continuous forecast-accuracy improvement."""

    ICON_CHOICES = [
        ("trending-up", "Trending Up"),
        ("alert-circle", "Alert Circle"),
        ("calendar", "Calendar"),
    ]

    THEME_CHOICES = [
        ("green", "Green"),
        ("yellow", "Yellow"),
        ("blue", "Blue"),
    ]

    title = models.CharField(max_length=200)
    summary = models.CharField(max_length=300)
    icon = models.CharField(max_length=30, choices=ICON_CHOICES, default="trending-up")
    theme = models.CharField(max_length=20, choices=THEME_CHOICES, default="blue")
    sections = models.JSONField(default=list, help_text="List of narrative sections with heading/body/bullets.")
    recommended_action = models.TextField()
    sort_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["sort_order", "id"]

    def __str__(self):
        return self.title


class ScenarioResilienceMetric(models.Model):
    """Business resilience indicators shown in Scenario & Stress Testing."""

    name = models.CharField(max_length=150)
    value = models.CharField(max_length=60)
    value_tone = models.CharField(max_length=20, default="neutral")
    description = models.TextField()
    sort_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["sort_order", "name", "id"]

    def __str__(self):
        return f"{self.name}: {self.value}"


class RecommendedStressTest(models.Model):
    """Pre-built stress tests recommended for quick execution."""

    ICON_CHOICES = [
        ("alert-triangle", "Alert Triangle"),
        ("trending-down", "Trending Down"),
        ("activity", "Activity"),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    icon = models.CharField(max_length=30, choices=ICON_CHOICES, default="alert-triangle")
    scenario_template = models.JSONField(
        default=dict,
        help_text="Template used to run this recommendation as a scenario test.",
    )
    sort_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["sort_order", "id"]

    def __str__(self):
        return self.title


# ==================== PRICING MODELS ====================

class PriceSetting(models.Model):
    STRATEGY_CHOICES = [
        ('cost_plus', 'Cost Plus'),
        ('value_based', 'Value Based'),
        ('competitive', 'Competitive'),
        ('dynamic', 'Dynamic'),
    ]

    ALGORITHM_CHOICES = [
        ('ai-driven', 'AI Driven'),
        ('demand-based', 'Demand Based'),
        ('competitor-based', 'Competitor Based'),
        ('rule-based', 'Rule Based'),
    ]
    
    product = models.CharField(max_length=200)
    base_price = models.FloatField()
    current_price = models.FloatField()
    strategy = models.CharField(max_length=20, choices=STRATEGY_CHOICES)
    algorithm = models.CharField(max_length=30, choices=ALGORITHM_CHOICES, default='rule-based')
    min_price = models.FloatField(null=True, blank=True)
    max_price = models.FloatField(null=True, blank=True)
    next_update = models.DateTimeField(null=True, blank=True)
    factors = models.JSONField(default=list, help_text='Dynamic pricing factors for this product')
    history = models.JSONField(default=list, help_text='Price change history log')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.product} - {self.current_price}"


class PricingRule(models.Model):
    CONDITION_CHOICES = [('volume', 'Volume'), ('time', 'Time'), ('customer', 'Customer')]
    ADJUSTMENT_CHOICES = [('percentage', 'Percentage'), ('fixed', 'Fixed Amount')]
    
    name = models.CharField(max_length=200)
    condition = models.CharField(max_length=20, choices=CONDITION_CHOICES)
    condition_value = models.JSONField(default=dict)
    adjustment_type = models.CharField(max_length=20, choices=ADJUSTMENT_CHOICES)
    adjustment_value = models.FloatField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class PriceForecast(models.Model):
    product = models.CharField(max_length=200)
    forecast_price = models.FloatField()
    confidence = models.IntegerField(default=50)
    range_low = models.FloatField()
    range_high = models.FloatField()
    period = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.product} - {self.forecast_price}"


# ==================== PRICING ITEM MODELS ====================

class PricingItem(models.Model):
    """Individual pricing item with performance metrics (e.g., Coca Cola, Pepsi, Fanta)"""
    
    name = models.CharField(max_length=200, db_index=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Price Elasticity
    elasticity = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    elasticity_change = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    elasticity_period = models.CharField(max_length=50, default="Q3 2024")
    
    # Competitive Position
    competitive_score = models.DecimalField(max_digits=5, decimal_places=1, default=0)
    competitive_change = models.DecimalField(max_digits=5, decimal_places=1, default=0)
    competitive_period = models.CharField(max_length=50, default="This quarter")
    
    # Price Acceptance Rate
    acceptance_rate = models.DecimalField(max_digits=5, decimal_places=1, default=0)
    acceptance_change = models.DecimalField(max_digits=5, decimal_places=1, default=0)
    acceptance_period = models.CharField(max_length=50, default="Last 7 days")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-updated_at']
    
    def __str__(self):
        return f"{self.name} - ${self.price}"


class PricingStrategy(models.Model):
    """Pricing strategy option with comprehensive pricing metrics"""
    
    STRATEGY_TYPE_CHOICES = [
        ('value-based', 'Value Based'),
        ('tiered', 'Tiered'),
        ('dynamic', 'Dynamic'),
        ('cost-plus', 'Cost Plus'),
        ('penetration', 'Penetration'),
        ('discrimination', 'Price Discrimination'),
    ]
    
    name = models.CharField(max_length=200)
    strategy_type = models.CharField(max_length=50, choices=STRATEGY_TYPE_CHOICES)
    description = models.TextField(blank=True)
    
    # Pricing metrics
    current_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    suggested_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    confidence = models.IntegerField(default=50)  # 0-100
    
    # Business metrics
    expected_revenue = models.DecimalField(max_digits=15, decimal_places=2, default=0)  # in millions
    market_share = models.DecimalField(max_digits=5, decimal_places=1, default=0)  # percentage
    margin = models.DecimalField(max_digits=5, decimal_places=1, default=0)  # percentage
    
    # Status
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-updated_at']
    
    def __str__(self):
        return f"{self.name} ({self.strategy_type})"


class PricingTest(models.Model):
    """Price testing experiment"""
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('running', 'Running'),
        ('completed', 'Completed'),
        ('paused', 'Paused'),
    ]
    
    TEST_TYPE_CHOICES = [
        ('a-b', 'A/B Test'),
        ('multivariate', 'Multivariate'),
        ('split', 'Split Test'),
        ('sequential', 'Sequential'),
    ]
    
    name = models.CharField(max_length=200)
    test_type = models.CharField(max_length=50, choices=TEST_TYPE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    confidence = models.IntegerField(default=0)  # 0-100, confidence in results
    start_date = models.DateTimeField(null=True, blank=True)
    end_date = models.DateTimeField(null=True, blank=True)
    sample_size = models.IntegerField(default=0)
    variant_count = models.IntegerField(default=2)
    results = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} ({self.status})"


# ==================== TAX MODELS ====================

class TaxRecord(models.Model):
    STATUS_CHOICES = [('draft', 'Draft'), ('calculated', 'Calculated'), ('filed', 'Filed'), ('amended', 'Amended')]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tax_records', null=True, blank=True)
    entity = models.CharField(max_length=200, default='', help_text="Company or entity name")
    tax_year = models.IntegerField(default=2024)
    income = models.FloatField(default=0)
    deductions = models.FloatField(default=0)
    taxable_income = models.FloatField(default=0)
    estimated_tax = models.FloatField(default=0)
    effective_rate = models.FloatField(default=0)
    marginal_rate = models.FloatField(default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        return f"{self.entity} - {self.tax_year}"


class TaxRecommendation(models.Model):
    CATEGORY_CHOICES = [
        ('deduction', 'Deduction'), ('credit', 'Credit'), ('timing', 'Timing'),
        ('structure', 'Structure'), ('investment', 'Investment'),
    ]
    COMPLEXITY_CHOICES = [('low', 'Low'), ('medium', 'Medium'), ('high', 'High')]
    PRIORITY_CHOICES = [('low', 'Low'), ('medium', 'Medium'), ('high', 'High')]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tax_recommendations', null=True, blank=True)
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='deduction')
    potential_savings = models.FloatField(default=0)
    complexity = models.CharField(max_length=20, choices=COMPLEXITY_CHOICES, default='medium')
    deadline = models.DateField(null=True, blank=True)
    requirements = models.JSONField(default=list)
    implemented = models.BooleanField(default=False)
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class ComplianceUpdate(models.Model):
    TYPE_CHOICES = [
        ('regulation', 'Regulation'), ('form', 'Form'), ('deadline', 'Deadline'),
        ('rate_change', 'Rate Change'), ('guidance', 'Guidance'),
    ]
    JURISDICTION_CHOICES = [('federal', 'Federal'), ('state', 'State'), ('local', 'Local')]
    IMPACT_CHOICES = [('low', 'Low'), ('medium', 'Medium'), ('high', 'High')]
    STATUS_CHOICES = [('new', 'New'), ('reviewed', 'Reviewed'), ('implemented', 'Implemented'), ('archived', 'Archived')]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='compliance_updates', null=True, blank=True)
    title = models.CharField(max_length=200)
    description = models.TextField()
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='regulation')
    jurisdiction = models.CharField(max_length=20, choices=JURISDICTION_CHOICES, default='federal')
    effective_date = models.DateField(null=True, blank=True)
    deadline = models.DateField(null=True, blank=True)
    impact = models.CharField(max_length=20, choices=IMPACT_CHOICES, default='medium')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    action_required = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class TaxPlanningScenario(models.Model):
    RISK_CHOICES = [('low', 'Low'), ('medium', 'Medium'), ('high', 'High')]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tax_planning_scenarios', null=True, blank=True)
    name = models.CharField(max_length=200)
    description = models.TextField()
    current_tax = models.FloatField(default=0)
    projected_tax = models.FloatField(default=0)
    savings = models.FloatField(default=0)
    timeframe = models.CharField(max_length=100)
    risk_level = models.CharField(max_length=20, choices=RISK_CHOICES, default='medium')
    steps = models.JSONField(default=list)
    confidence = models.IntegerField(default=50)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class TaxAuditEvent(models.Model):
    OUTCOME_CHOICES = [('success', 'Success'), ('failure', 'Failure'), ('warning', 'Warning')]
    CATEGORY_CHOICES = [
        ('calculation', 'Calculation'), ('filing', 'Filing'), ('document', 'Document'),
        ('planning', 'Planning'), ('compliance', 'Compliance'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tax_audit_events', null=True, blank=True)
    action = models.CharField(max_length=200)
    entity = models.CharField(max_length=200)
    details = models.TextField()
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    outcome = models.CharField(max_length=20, choices=OUTCOME_CHOICES, default='success')
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='calculation')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.action} - {self.entity}"


class AdviceMessage(models.Model):
    """
    Stores advice messages displayed in the Advice Hub.
    Each message is a piece of expert advice for a specific module.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='advice_messages', null=True, blank=True)
    module_id = models.CharField(max_length=100, db_index=True)  # e.g., 'sales-intelligence', 'revenue-strategy'
    module_name = models.CharField(max_length=200)  # e.g., 'Sales Intelligence'
    module_icon = models.CharField(max_length=10, default='💡')  # Emoji
    title = models.CharField(max_length=300)  # Brief title of the advice
    content = models.TextField()  # Full advice message content
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'Advice Messages'

    def __str__(self):
        return f"{self.module_name}: {self.title[:50]}"


class Notification(models.Model):
    """
    Stores notifications for users.
    Notifications include system alerts, forecasts, market updates, etc.
    """
    TYPE_CHOICES = [
        ('forecast', 'Forecast'),
        ('alert', 'Alert'),
        ('info', 'Info'),
        ('market', 'Market'),
        ('system', 'System'),
    ]
    
    PRIORITY_CHOICES = [
        ('urgent', 'Urgent'),
        ('high', 'High'),
        ('normal', 'Normal'),
        ('low', 'Low'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications', null=True, blank=True)
    sender = models.CharField(max_length=200)  # e.g., 'Joseph AI System'
    subject = models.CharField(max_length=300)  # Notification title
    preview = models.TextField()  # Short preview text
    body = models.TextField()  # Full notification body
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='info')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='normal')
    category = models.CharField(max_length=100, db_index=True)  # e.g., 'forecast', 'system'
    is_read = models.BooleanField(default=False, db_index=True)
    starred = models.BooleanField(default=False)
    archived = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'Notifications'


# ==================== SALES INTELLIGENCE MODELS ====================

class SalesRep(models.Model):
    """
    Represents a sales representative or sales team member.
    Tracks individual sales performance and territories.
    """
    TERRITORY_CHOICES = [
        ('north', 'North'),
        ('south', 'South'),
        ('east', 'East'),
        ('west', 'West'),
        ('central', 'Central'),
        ('international', 'International'),
        ('virtual', 'Virtual'),
        ('enterprise', 'Enterprise'),
    ]
    
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('on_leave', 'On Leave'),
        ('terminated', 'Terminated'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sales_reps', null=True, blank=True)
    
    # Basic information
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True)
    title = models.CharField(max_length=200, default='Sales Representative')
    department = models.CharField(max_length=100, blank=True)
    
    # Territory and performance
    territory = models.CharField(max_length=50, choices=TERRITORY_CHOICES, default='virtual')
    manager = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='subordinates')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    
    # Performance metrics
    quota = models.FloatField(default=0, help_text="Target sales quota")
    ytd_sales = models.FloatField(default=0, help_text="Year-to-date sales")
    ytd_quota_percentage = models.FloatField(default=0, help_text="YTD attainment percentage")
    annual_quota = models.FloatField(default=0)
    
    # Engagement metrics
    active_leads = models.IntegerField(default=0)
    active_opportunities = models.IntegerField(default=0)
    pipeline_value = models.FloatField(default=0)
    win_rate = models.FloatField(default=0, help_text="Win rate percentage")
    
    # Activity tracking
    calls_this_week = models.IntegerField(default=0)
    emails_this_week = models.IntegerField(default=0)
    meetings_this_week = models.IntegerField(default=0)
    
    # Additional data
    hire_date = models.DateField(null=True, blank=True)
    average_deal_size = models.FloatField(default=0)
    deal_cycle_days = models.FloatField(default=0)
    customer_retention = models.FloatField(default=0, help_text="Customer retention percentage")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['last_name', 'first_name']
        verbose_name = 'Sales Rep'
        verbose_name_plural = 'Sales Reps'
    
    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class Lead(models.Model):
    """
    Represents a sales lead - prospective customer.
    Tracks lead information, status, and lifecycle.
    """
    STATUS_CHOICES = [
        ('new', 'New'),
        ('contacted', 'Contacted'),
        ('qualified', 'Qualified'),
        ('nurturing', 'Nurturing'),
        ('ready_to_close', 'Ready to Close'),
        ('disqualified', 'Disqualified'),
        ('converted', 'Converted'),
        ('lost', 'Lost'),
    ]
    
    LEAD_SOURCE_CHOICES = [
        ('website', 'Website'),
        ('referral', 'Referral'),
        ('cold_call', 'Cold Call'),
        ('trade_show', 'Trade Show'),
        ('email', 'Email'),
        ('social_media', 'Social Media'),
        ('partnership', 'Partnership'),
        ('paid_ads', 'Paid Ads'),
        ('inbound', 'Inbound'),
        ('marketing', 'Marketing Campaign'),
        ('other', 'Other'),
    ]
    
    INDUSTRY_CHOICES = [
        ('technology', 'Technology'),
        ('finance', 'Finance'),
        ('healthcare', 'Healthcare'),
        ('manufacturing', 'Manufacturing'),
        ('retail', 'Retail'),
        ('services', 'Services'),
        ('education', 'Education'),
        ('government', 'Government'),
        ('other', 'Other'),
    ]
    
    COMPANY_SIZE_CHOICES = [
        ('startup', 'Startup (<50)'),
        ('small', 'Small (50-250)'),
        ('medium', 'Medium (250-1000)'),
        ('large', 'Large (1000-5000)'),
        ('enterprise', 'Enterprise (5000+)'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='leads', null=True, blank=True)
    
    # Contact information
    first_name = models.CharField(max_length=100, db_index=True)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(db_index=True)
    phone = models.CharField(max_length=20, blank=True)
    company = models.CharField(max_length=200, db_index=True)
    job_title = models.CharField(max_length=200)
    
    # Company information
    company_website = models.URLField(blank=True)
    company_size = models.CharField(max_length=20, choices=COMPANY_SIZE_CHOICES, blank=True)
    industry = models.CharField(max_length=50, choices=INDUSTRY_CHOICES, blank=True)
    annual_revenue = models.FloatField(null=True, blank=True, help_text="Company annual revenue")
    
    # Lead information
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new', db_index=True)
    lead_source = models.CharField(max_length=50, choices=LEAD_SOURCE_CHOICES)
    lead_score = models.IntegerField(default=0, help_text="Lead score 0-100")
    
    # Assignment
    assigned_to = models.ForeignKey(SalesRep, on_delete=models.SET_NULL, null=True, blank=True, related_name='leads')
    
    # Actions and engagement
    last_contact_date = models.DateField(null=True, blank=True)
    last_activity = models.CharField(max_length=200, blank=True)
    contact_frequency = models.IntegerField(default=0, help_text="Number of contacts")
    response_rate = models.FloatField(default=0, help_text="Response rate percentage")
    
    # Lead quality metrics
    budget_available = models.BooleanField(default=False)
    decision_maker = models.BooleanField(default=False)
    timeline = models.CharField(max_length=50, blank=True)
    
    # Additional information
    company_info = models.JSONField(default=dict, help_text="Company additional info")
    notes = models.TextField(blank=True)
    tags = models.JSONField(default=list)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    converted_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status', 'assigned_to']),
            models.Index(fields=['lead_score', '-created_at']),
        ]
    
    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.company}"


class Opportunity(models.Model):
    """
    Represents a sales opportunity - a potential sale.
    Tracks deal information, progression, and forecasting.
    """
    STAGE_CHOICES = [
        ('prospecting', 'Prospecting'),
        ('qualification', 'Qualification'),
        ('needs_analysis', 'Needs Analysis'),
        ('proposal', 'Proposal'),
        ('negotiation', 'Negotiation'),
        ('closed_won', 'Closed Won'),
        ('closed_lost', 'Closed Lost'),
        ('on_hold', 'On Hold'),
    ]
    
    PROBABILITY_CHOICES = [
        (10, '10%'),
        (25, '25%'),
        (50, '50%'),
        (75, '75%'),
        (90, '90%'),
        (100, '100%'),
        (0, '0% (Lost)'),
    ]
    
    CLOSE_REASON_CHOICES = [
        ('won_solution_fit', 'Won - Solution Fit'),
        ('won_price', 'Won - Price/Terms'),
        ('won_service', 'Won - Service Quality'),
        ('lost_competitor', 'Lost - Competitor'),
        ('lost_price', 'Lost - Price'),
        ('lost_timing', 'Lost - Not Ready Now'),
        ('lost_fit', 'Lost - No Fit'),
        ('lost_budget', 'Lost - No Budget'),
        ('lost_contact', 'Lost - Lost Contact'),
        ('other', 'Other'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='opportunities', null=True, blank=True)
    lead = models.ForeignKey(Lead, on_delete=models.SET_NULL, null=True, blank=True, related_name='opportunities')
    
    # Opportunity information
    name = models.CharField(max_length=300, db_index=True)
    description = models.TextField(blank=True)
    company = models.CharField(max_length=200, db_index=True)
    contact_name = models.CharField(max_length=200)
    contact_email = models.EmailField(blank=True)
    
    # Sales information
    amount = models.FloatField(help_text="Deal amount")
    currency = models.CharField(max_length=10, default='USD')
    stage = models.CharField(max_length=30, choices=STAGE_CHOICES, default='prospecting', db_index=True)
    probability = models.IntegerField(choices=PROBABILITY_CHOICES, default=10)
    weighted_amount = models.FloatField(default=0, help_text="Amount * Probability")
    
    # Timeline
    close_date_expected = models.DateField(db_index=True)
    close_date_actual = models.DateField(null=True, blank=True)
    days_to_close = models.IntegerField(default=0)
    
    # Deal progression
    next_step = models.CharField(max_length=300, blank=True)
    next_step_date = models.DateField(null=True, blank=True)
    last_activity_date = models.DateField(null=True, blank=True)
    last_activity = models.CharField(max_length=200, blank=True)
    
    # Deal outcome
    is_closed = models.BooleanField(default=False, db_index=True)
    is_won = models.BooleanField(default=False)
    close_reason = models.CharField(max_length=50, choices=CLOSE_REASON_CHOICES, blank=True)
    close_notes = models.TextField(blank=True)
    
    # Assignment
    assigned_to = models.ForeignKey(SalesRep, on_delete=models.SET_NULL, null=True, blank=True, related_name='opportunities')
    
    # Deal details
    products_services = models.JSONField(default=list, help_text="Products/services involved")
    key_competitors = models.JSONField(default=list)
    champion_identified = models.BooleanField(default=False)
    budget_confirmed = models.BooleanField(default=False)
    
    # Metrics
    engagement_score = models.IntegerField(default=0, help_text="Engagement score 0-100")
    decision_timeline = models.CharField(max_length=100, blank=True)
    
    # Additional
    notes = models.TextField(blank=True)
    tags = models.JSONField(default=list)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['stage', 'assigned_to']),
            models.Index(fields=['close_date_expected', 'is_won']),
        ]
    
    def save(self, *args, **kwargs):
        self.weighted_amount = (self.amount * self.probability) / 100
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.name} - ${self.amount} ({self.stage})"


class SalesMetric(models.Model):
    """
    Aggregated sales metrics and KPIs.
    Tracks performance metrics by period and dimension.
    """
    METRIC_TYPE_CHOICES = [
        ('revenue', 'Revenue'),
        ('pipeline', 'Pipeline'),
        ('activity', 'Activity'),
        ('conversion', 'Conversion'),
        ('efficiency', 'Efficiency'),
        ('forecast', 'Forecast'),
        ('performance', 'Performance'),
    ]
    
    PERIOD_CHOICES = [
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
        ('quarterly', 'Quarterly'),
        ('annual', 'Annual'),
    ]
    
    DIMENSION_CHOICES = [
        ('overall', 'Overall'),
        ('by_rep', 'By Rep'),
        ('by_territory', 'By Territory'),
        ('by_source', 'By Source'),
        ('by_stage', 'By Stage'),
        ('by_product', 'By Product'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sales_metrics', null=True, blank=True)
    sales_rep = models.ForeignKey(SalesRep, on_delete=models.SET_NULL, null=True, blank=True, related_name='metrics')
    
    # Metric identification
    metric_type = models.CharField(max_length=30, choices=METRIC_TYPE_CHOICES)
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    
    # Dimensioning
    dimension = models.CharField(max_length=30, choices=DIMENSION_CHOICES, default='overall')
    dimension_value = models.CharField(max_length=100, blank=True)
    
    # Period
    period_type = models.CharField(max_length=20, choices=PERIOD_CHOICES, default='monthly')
    period_start = models.DateField(db_index=True)
    period_end = models.DateField()
    
    # Core metrics
    target = models.FloatField(null=True, blank=True)
    actual = models.FloatField()
    forecast = models.FloatField(null=True, blank=True)
    variance = models.FloatField(null=True, blank=True)
    variance_percentage = models.FloatField(null=True, blank=True)
    achievement_percentage = models.FloatField(null=True, blank=True)
    
    # Trend data
    previous_period_value = models.FloatField(null=True, blank=True)
    trend_direction = models.CharField(max_length=20, choices=[
        ('up', 'Up'),
        ('down', 'Down'),
        ('flat', 'Flat'),
    ], blank=True)
    trend_percentage = models.FloatField(null=True, blank=True)
    
    # Related metrics
    related_metrics = models.JSONField(default=dict, help_text="Supporting metrics")
    insights = models.JSONField(default=list, help_text="Key insights")
    
    # Status and flags
    is_on_track = models.BooleanField(default=True)
    is_flagged = models.BooleanField(default=False)
    flag_reason = models.CharField(max_length=200, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-period_end', '-created_at']
        indexes = [
            models.Index(fields=['metric_type', 'period_start']),
            models.Index(fields=['sales_rep', 'period_end']),
        ]
        verbose_name = 'Sales Metric'
        verbose_name_plural = 'Sales Metrics'
    
    def save(self, *args, **kwargs):
        if self.target and self.actual:
            self.variance = self.actual - self.target
            self.variance_percentage = (self.variance / self.target * 100) if self.target != 0 else 0
            self.achievement_percentage = (self.actual / self.target * 100) if self.target != 0 else 0
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.name} - {self.period_start.strftime('%Y-%m')}"


class ActivityLog(models.Model):
    """
    Logs sales activities - calls, emails, meetings, tasks.
    Provides detailed activity tracking for CRM.
    """
    ACTIVITY_TYPE_CHOICES = [
        ('call', 'Call'),
        ('email', 'Email'),
        ('meeting', 'Meeting'),
        ('task', 'Task'),
        ('note', 'Note'),
        ('demo', 'Demo'),
        ('proposal', 'Proposal'),
        ('contract', 'Contract'),
        ('other', 'Other'),
    ]
    
    CALL_DIRECTION_CHOICES = [
        ('inbound', 'Inbound'),
        ('outbound', 'Outbound'),
    ]
    
    STATUS_CHOICES = [
        ('planned', 'Planned'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('no_show', 'No Show'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activity_logs', null=True, blank=True)
    sales_rep = models.ForeignKey(SalesRep, on_delete=models.CASCADE, related_name='activities')
    lead = models.ForeignKey(Lead, on_delete=models.CASCADE, related_name='activities', null=True, blank=True)
    opportunity = models.ForeignKey(Opportunity, on_delete=models.CASCADE, related_name='activities', null=True, blank=True)
    
    # Activity information
    activity_type = models.CharField(max_length=30, choices=ACTIVITY_TYPE_CHOICES)
    subject = models.CharField(max_length=300)
    description = models.TextField()
    
    # Call-specific fields
    call_direction = models.CharField(max_length=20, choices=CALL_DIRECTION_CHOICES, blank=True)
    call_duration_minutes = models.IntegerField(null=True, blank=True)
    
    # Scheduling
    scheduled_date = models.DateField(db_index=True)
    scheduled_time = models.TimeField(null=True, blank=True)
    completed_date = models.DateField(null=True, blank=True)
    completed_time = models.TimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='planned')
    
    # Participants
    participants = models.JSONField(default=list, help_text="List of participants")
    
    # Outcomes
    outcome = models.TextField(blank=True)
    next_steps = models.TextField(blank=True)
    action_items = models.JSONField(default=list)
    
    # Attachments and references
    attachments = models.JSONField(default=list)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-scheduled_date']
        indexes = [
            models.Index(fields=['sales_rep', 'scheduled_date']),
            models.Index(fields=['activity_type', 'status']),
        ]
    
    def __str__(self):
        return f"{self.activity_type.capitalize()} - {self.subject}"


class SalesPipeline(models.Model):
    """
    Sales pipeline stages and flow.
    Tracks opportunities by stage and provides funnel analysis.
    """
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    
    # Pipeline metrics (snapshot)
    total_opportunities = models.IntegerField(default=0)
    total_pipeline_value = models.FloatField(default=0)
    
    # Stage breakdown
    prospecting_count = models.IntegerField(default=0)
    prospecting_value = models.FloatField(default=0)
    
    qualification_count = models.IntegerField(default=0)
    qualification_value = models.FloatField(default=0)
    
    needs_analysis_count = models.IntegerField(default=0)
    needs_analysis_value = models.FloatField(default=0)
    
    proposal_count = models.IntegerField(default=0)
    proposal_value = models.FloatField(default=0)
    
    negotiation_count = models.IntegerField(default=0)
    negotiation_value = models.FloatField(default=0)
    
    # Conversion metrics
    conversion_rate = models.FloatField(default=0, help_text="Overall conversion rate")
    average_deal_size = models.FloatField(default=0)
    average_sales_cycle = models.FloatField(default=0, help_text="Average days to close")
    
    # Forecast
    monthly_forecast = models.FloatField(default=0)
    quarterly_forecast = models.FloatField(default=0)
    
    # Tracking
    period = models.CharField(max_length=50, default='current')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-updated_at']
    
    def __str__(self):
        return f"Sales Pipeline - {self.period}"


class CompetitionTracking(models.Model):
    """
    Tracks competitor activity in opportunities.
    Identifies competitive threats and win/loss analysis.
    """
    opportunity = models.ForeignKey(Opportunity, on_delete=models.CASCADE, related_name='competitors_tracked')
    competitor_name = models.CharField(max_length=200)
    strength = models.CharField(max_length=20, choices=[
        ('strong', 'Strong'),
        ('moderate', 'Moderate'),
        ('weak', 'Weak'),
    ])
    
    # Competitive positioning
    our_advantages = models.JSONField(default=list)
    competitive_gaps = models.JSONField(default=list)
    battle_card = models.TextField(blank=True)
    
    # Engagement
    first_identified = models.DateField()
    last_updated = models.DateField(auto_now=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-last_updated']
    
    def __str__(self):
        return f"{self.competitor_name} - {self.opportunity.name}"


class SalesVelocity(models.Model):
    """
    Measures how quickly deals move through stages.
    Used for forecasting and pipeline health analysis.
    """
    sales_rep = models.ForeignKey(SalesRep, on_delete=models.CASCADE, related_name='velocity_metrics')
    
    # Stage-to-stage velocity
    prospecting_to_qualification_days = models.FloatField()
    qualification_to_analysis_days = models.FloatField()
    analysis_to_proposal_days = models.FloatField()
    proposal_to_negotiation_days = models.FloatField()
    negotiation_to_close_days = models.FloatField()
    
    # Overall
    total_sales_cycle_days = models.FloatField()
    deals_analyzed = models.IntegerField()
    
    # Period
    period_start = models.DateField()
    period_end = models.DateField()
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-period_end']
    
    def __str__(self):
        return f"Velocity - {self.sales_rep.last_name} ({self.period_start})"

    def __str__(self):
        return f"{self.sender}: {self.subject[:50]}"


class ComplianceObligation(models.Model):
    FREQUENCY_CHOICES = [
        ('monthly', 'Monthly'), ('quarterly', 'Quarterly'),
        ('annually', 'Annually'), ('event_based', 'Event-Based'),
    ]
    CONSEQUENCE_CHOICES = [('low', 'Low'), ('medium', 'Medium'), ('high', 'High'), ('critical', 'Critical')]
    STATUS_CHOICES = [('completed', 'Completed'), ('pending', 'Pending'), ('at_risk', 'At Risk'), ('overdue', 'Overdue')]
    PRIORITY_CHOICES = [('low', 'Low'), ('medium', 'Medium'), ('high', 'High'), ('critical', 'Critical')]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='compliance_obligations', null=True, blank=True)
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    due_date = models.DateField(null=True, blank=True)
    frequency = models.CharField(max_length=20, choices=FREQUENCY_CHOICES, default='monthly')
    agency = models.CharField(max_length=200)
    jurisdiction = models.CharField(max_length=200)
    consequence = models.CharField(max_length=20, choices=CONSEQUENCE_CHOICES, default='medium')
    consequence_detail = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    assigned_to = models.CharField(max_length=200, blank=True)
    dependencies = models.JSONField(default=list)
    documentation_required = models.JSONField(default=list)
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['due_date']

    def __str__(self):
        return self.name


class ComplianceReport(models.Model):
    STATUS_CHOICES = [('draft', 'Draft'), ('pending', 'Pending'), ('completed', 'Completed'), ('overdue', 'Overdue')]
    TYPE_CHOICES = [('monthly', 'Monthly'), ('quarterly', 'Quarterly'), ('annual', 'Annual'), ('custom', 'Custom')]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='compliance_reports', null=True, blank=True)
    title = models.CharField(max_length=200, default='')
    description = models.TextField(blank=True)
    period = models.CharField(max_length=50)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='quarterly')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    due_date = models.DateField(null=True, blank=True)
    completion_rate = models.IntegerField(default=0)
    risk_score = models.IntegerField(default=0)
    findings_count = models.IntegerField(default=0)
    findings = models.JSONField(default=list)
    assignee = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.status}"


# ==================== POLICY MODELS ====================

class ExternalPolicy(models.Model):
    IMPACT_CHOICES = [('high', 'High'), ('medium', 'Medium'), ('low', 'Low')]
    CATEGORY_CHOICES = [
        ('regulation', 'Regulation'),
        ('tax', 'Tax'),
        ('trade', 'Trade'),
        ('labor', 'Labor'),
        ('environmental', 'Environmental'),
    ]
    
    title = models.CharField(max_length=300)
    source = models.CharField(max_length=200)
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES)
    impact = models.CharField(max_length=20, choices=IMPACT_CHOICES, default='medium')
    description = models.TextField()
    effective_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class InternalPolicy(models.Model):
    CATEGORY_CHOICES = [
        ('hr', 'HR'),
        ('finance', 'Finance'),
        ('operations', 'Operations'),
        ('sales', 'Sales'),
        ('it', 'IT'),
    ]
    STATUS_CHOICES = [('active', 'Active'), ('draft', 'Draft'), ('archived', 'Archived')]
    
    title = models.CharField(max_length=300)
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    effective_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class StrategyRecommendation(models.Model):
    PRIORITY_CHOICES = [('low', 'Low'), ('medium', 'Medium'), ('high', 'High')]
    IMPACT_CHOICES = [('low', 'Low'), ('medium', 'Medium'), ('high', 'High')]
    CATEGORY_CHOICES = [
        ('growth', 'Growth'),
        ('cost', 'Cost Reduction'),
        ('risk', 'Risk Mitigation'),
        ('operational', 'Operational'),
    ]

    title = models.CharField(max_length=300)
    description = models.TextField()
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES)
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    impact = models.CharField(max_length=20, choices=IMPACT_CHOICES, default='medium')
    implementation_steps = models.JSONField(default=list)
    expected_outcome = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

# ==================== INVENTORY MODELS ====================

class InventoryItem(models.Model):
    name = models.CharField(max_length=200)
    sku = models.CharField(max_length=100, unique=True)
    quantity = models.IntegerField(default=0)
    reorder_level = models.IntegerField(default=10)
    unit_cost = models.FloatField(default=0)
    unit_price = models.FloatField(default=0)
    supplier = models.ForeignKey('Supplier', on_delete=models.SET_NULL, null=True, blank=True)
    location = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.sku})"


class StockMovement(models.Model):
    TYPE_CHOICES = [('in', 'Stock In'), ('out', 'Stock Out'), ('adjustment', 'Adjustment')]
    
    item = models.ForeignKey(InventoryItem, on_delete=models.CASCADE)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    quantity = models.IntegerField()
    reference = models.CharField(max_length=100, blank=True)
    notes = models.TextField(blank=True)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.item.name} - {self.type} - {self.quantity}"


class Supplier(models.Model):
    name = models.CharField(max_length=200)
    contact_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    rating = models.FloatField(default=5.0)
    lead_time_days = models.IntegerField(default=7)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class ProcurementOrder(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]
    
    order_number = models.CharField(max_length=50, unique=True)
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE)
    items = models.JSONField(default=list)
    total = models.FloatField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    order_date = models.DateField(auto_now_add=True)
    expected_delivery = models.DateField(null=True, blank=True)
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.order_number} - {self.supplier.name}"


class LogisticsMetric(models.Model):
    name = models.CharField(max_length=100)
    value = models.FloatField()
    unit = models.CharField(max_length=20, blank=True)
    period = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name}: {self.value}"


# ==================== INVENTORY & SUPPLY CHAIN EXTENDED MODELS ====================

class DemandForecast(models.Model):
    PERIOD_CHOICES = [('weekly', 'Weekly'), ('monthly', 'Monthly'), ('quarterly', 'Quarterly')]
    URGENCY_CHOICES = [('low', 'Low'), ('medium', 'Medium'), ('high', 'High')]

    item = models.ForeignKey(InventoryItem, on_delete=models.CASCADE, related_name='demand_forecasts')
    forecast_period = models.CharField(max_length=20, choices=PERIOD_CHOICES, default='monthly')
    current_demand = models.IntegerField(default=0)
    predicted_demand = models.IntegerField(default=0)
    confidence = models.IntegerField(default=50)
    seasonal_factor = models.FloatField(default=1.0)
    trend_factor = models.FloatField(default=1.0)
    factors = models.JSONField(default=list)
    reorder_quantity = models.IntegerField(default=0)
    reorder_timing = models.DateField(null=True, blank=True)
    reorder_urgency = models.CharField(max_length=20, choices=URGENCY_CHOICES, default='medium')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.item.name} - {self.forecast_period}'


class InventoryValuation(models.Model):
    METHOD_CHOICES = [('FIFO', 'FIFO'), ('LIFO', 'LIFO'), ('WeightedAverage', 'Weighted Average')]
    
    method = models.CharField(max_length=20, choices=METHOD_CHOICES, default='FIFO')
    total_value = models.FloatField(default=0)
    breakdown = models.JSONField(default=list)
    variance = models.FloatField(default=0)
    cost_of_goods_sold = models.FloatField(default=0)
    calculated_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.method} - {self.total_value}'


class DeadStock(models.Model):
    ACTION_CHOICES = [('markdown', 'Markdown'), ('liquidate', 'Liquidate'), ('donate', 'Donate'), ('dispose', 'Dispose')]
    
    item = models.ForeignKey(InventoryItem, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=0)
    days_stagnant = models.IntegerField(default=0)
    original_value = models.FloatField(default=0)
    current_value = models.FloatField(default=0)
    depreciation = models.FloatField(default=0)
    last_movement = models.DateField(null=True, blank=True)
    recommended_action = models.CharField(max_length=20, choices=ACTION_CHOICES, default='markdown')
    reason = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.item.name} - {self.recommended_action}'


class InventoryLocation(models.Model):
    TYPE_CHOICES = [('warehouse', 'Warehouse'), ('store', 'Store'), ('distribution_center', 'Distribution Center'), ('supplier', 'Supplier')]
    STATUS_CHOICES = [('active', 'Active'), ('inactive', 'Inactive'), ('maintenance', 'Maintenance')]
    
    name = models.CharField(max_length=200)
    location_type = models.CharField(max_length=30, choices=TYPE_CHOICES)
    address = models.TextField()
    capacity = models.IntegerField(default=0)
    current_utilization = models.IntegerField(default=0)
    manager = models.CharField(max_length=100, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class InventoryAudit(models.Model):
    STATUS_CHOICES = [('planned', 'Planned'), ('in_progress', 'In Progress'), ('completed', 'Completed'), ('reviewed', 'Reviewed')]
    
    audit_date = models.DateField()
    location = models.ForeignKey(InventoryLocation, on_delete=models.CASCADE)
    auditor = models.CharField(max_length=100)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='planned')
    total_items_audited = models.IntegerField(default=0)
    discrepancies = models.JSONField(default=list)
    accuracy = models.FloatField(default=0)
    adjustments = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Audit {self.id} - {self.status}'


class TurnoverMetrics(models.Model):
    VELOCITY_CHOICES = [('fast', 'Fast'), ('medium', 'Medium'), ('slow', 'Slow')]
    
    item = models.ForeignKey(InventoryItem, on_delete=models.CASCADE)
    category = models.CharField(max_length=100)
    turnover_ratio = models.FloatField(default=0)
    average_inventory = models.FloatField(default=0)
    cost_of_goods_sold = models.FloatField(default=0)
    days_of_supply = models.IntegerField(default=0)
    velocity_rating = models.CharField(max_length=20, choices=VELOCITY_CHOICES, default='medium')
    recommendation = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.item.name} - {self.turnover_ratio}'


class WarehouseOperation(models.Model):
    warehouse = models.ForeignKey(InventoryLocation, on_delete=models.CASCADE, related_name='operations')
    layout = models.JSONField(default=dict)
    efficiency = models.JSONField(default=dict)
    equipment = models.JSONField(default=list)
    staffing = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Operation - {self.warehouse.name}'


class SupplierContract(models.Model):
    STATUS_CHOICES = [('active', 'Active'), ('expired', 'Expired'), ('pending', 'Pending'), ('terminated', 'Terminated')]
    
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE, related_name='contracts')
    contract_id = models.CharField(max_length=50)
    start_date = models.DateField()
    end_date = models.DateField()
    value = models.FloatField(default=0)
    terms = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.supplier.name} - {self.contract_id}'


class ProductionPlan(models.Model):
    STATUS_CHOICES = [('planned', 'Planned'), ('in_progress', 'In Progress'), ('completed', 'Completed'), ('delayed', 'Delayed'), ('cancelled', 'Cancelled')]
    PRIORITY_CHOICES = [('low', 'Low'), ('medium', 'Medium'), ('high', 'High')]
    
    plan_id = models.CharField(max_length=50, unique=True)
    product_name = models.CharField(max_length=200)
    planned_quantity = models.IntegerField(default=0)
    actual_quantity = models.IntegerField(default=0)
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='planned')
    required_materials = models.JSONField(default=list)
    bottlenecks = models.JSONField(default=list)
    efficiency = models.FloatField(default=0)
    cost_variance = models.FloatField(default=0)
    production_line = models.CharField(max_length=100, blank=True)
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.plan_id} - {self.product_name}'


class MarketVolatility(models.Model):
    TREND_CHOICES = [('increasing', 'Increasing'), ('decreasing', 'Decreasing'), ('stable', 'Stable')]
    IMPACT_CHOICES = [('low', 'Low'), ('medium', 'Medium'), ('high', 'High')]
    
    commodity = models.CharField(max_length=200)
    current_price = models.FloatField(default=0)
    price_change = models.FloatField(default=0)
    volatility_index = models.FloatField(default=0)
    trend = models.CharField(max_length=20, choices=TREND_CHOICES, default='stable')
    factors = models.JSONField(default=list)
    impact = models.CharField(max_length=20, choices=IMPACT_CHOICES, default='medium')
    recommendation = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.commodity} - {self.trend}'


class RegulatoryComplianceSC(models.Model):
    CATEGORY_CHOICES = [('environmental', 'Environmental'), ('safety', 'Safety'), ('trade', 'Trade'), ('quality', 'Quality'), ('labor', 'Labor')]
    STATUS_CHOICES = [('compliant', 'Compliant'), ('at_risk', 'At Risk'), ('non_compliant', 'Non-Compliant'), ('under_review', 'Under Review')]
    
    regulation = models.CharField(max_length=200)
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='under_review')
    last_audit = models.DateField(null=True, blank=True)
    next_audit = models.DateField(null=True, blank=True)
    requirements = models.JSONField(default=list)
    gaps = models.JSONField(default=list)
    certification_required = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.regulation} - {self.status}'


class DisruptionRisk(models.Model):
    TYPE_CHOICES = [('natural_disaster', 'Natural Disaster'), ('geopolitical', 'Geopolitical'), ('pandemic', 'Pandemic'), ('cyber', 'Cyber'), ('supplier_failure', 'Supplier Failure')]
    
    risk_type = models.CharField(max_length=30, choices=TYPE_CHOICES)
    description = models.TextField()
    probability = models.IntegerField(default=0)
    impact = models.IntegerField(default=0)
    risk_score = models.FloatField(default=0)
    affected_suppliers = models.JSONField(default=list)
    affected_regions = models.JSONField(default=list)
    mitigation_strategies = models.JSONField(default=list)
    contingency_plans = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.risk_type} - Score: {self.risk_score}'


class SustainabilityMetrics(models.Model):
    LEVEL_CHOICES = [('bronze', 'Bronze'), ('silver', 'Silver'), ('gold', 'Gold'), ('platinum', 'Platinum')]
    
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE, related_name='sustainability')
    carbon_footprint = models.FloatField(default=0)
    energy_efficiency = models.FloatField(default=0)
    waste_reduction = models.FloatField(default=0)
    sustainability_score = models.FloatField(default=0)
    certifications = models.JSONField(default=list)
    green_initiatives = models.JSONField(default=list)
    compliance_level = models.CharField(max_length=20, choices=LEVEL_CHOICES, default='bronze')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.supplier.name} - {self.compliance_level}'


# ==================== CHATBOT MODELS ====================

class ChatMessage(models.Model):
    ROLE_CHOICES = [('user', 'User'), ('assistant', 'Assistant'), ('system', 'System')]
    
    conversation = models.ForeignKey('ModuleConversation', on_delete=models.CASCADE, related_name='messages')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    metadata = models.JSONField(default=dict)

    class Meta:
        ordering = ['timestamp']

    def __str__(self):
        return f"{self.role}: {self.content[:50]}..."


class ModuleConversation(models.Model):
    MODULE_CHOICES = [
        ('economic', 'Economic'),
        ('business', 'Business'),
        ('market', 'Market'),
        ('loan', 'Loan'),
        ('revenue', 'Revenue'),
        ('financial', 'Financial'),
        ('pricing', 'Pricing'),
        ('tax', 'Tax'),
        ('policy', 'Policy'),
        ('inventory', 'Inventory'),
    ]
    
    module = models.CharField(max_length=30, choices=MODULE_CHOICES, db_index=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    title = models.CharField(max_length=200, default='New Conversation')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        return f"{self.module} - {self.title}"


class AgentState(models.Model):
    name = models.CharField(max_length=100, default='main')
    is_running = models.BooleanField(default=False)
    pending_tasks = models.IntegerField(default=0)
    current_task = models.TextField(blank=True)
    last_activity = models.DateTimeField(auto_now=True)
    state_data = models.JSONField(default=dict)

    def __str__(self):
        return f"{self.name} - {'Running' if self.is_running else 'Stopped'}"
