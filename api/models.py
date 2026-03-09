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
    STATUS_CHOICES = [('on_track', 'On Track'), ('at_risk', 'At Risk'), ('off_track', 'Off Track')]
    
    name = models.CharField(max_length=200)
    current_value = models.FloatField()
    target_value = models.FloatField()
    unit = models.CharField(max_length=50, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='on_track')
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name}: {self.current_value}/{self.target_value}"


class ScenarioPlanning(models.Model):
    TYPE_CHOICES = [('optimistic', 'Optimistic'), ('pessimistic', 'Pessimistic'), ('base', 'Base Case')]
    
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
    metadata = models.JSONField(default=dict)

    def __str__(self):
        return self.title


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
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    market_share = models.FloatField(help_text="Market share percentage")
    strengths = models.TextField()
    weaknesses = models.TextField(blank=True)
    website = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

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
    
    name = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES)
    impact = models.CharField(max_length=20, choices=IMPACT_CHOICES, default='medium')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


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


# ==================== FINANCIAL MODELS ====================

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
    CATEGORY_CHOICES = [
        ('cost_optimization', 'Cost Optimization'),
        ('revenue_growth', 'Revenue Growth'),
        ('risk_management', 'Risk Management'),
        ('operational', 'Operational'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES)
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    recommendations = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)

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


# ==================== PRICING MODELS ====================

class PriceSetting(models.Model):
    STRATEGY_CHOICES = [
        ('cost_plus', 'Cost Plus'),
        ('value_based', 'Value Based'),
        ('competitive', 'Competitive'),
        ('dynamic', 'Dynamic'),
    ]
    
    product = models.CharField(max_length=200)
    base_price = models.FloatField()
    current_price = models.FloatField()
    strategy = models.CharField(max_length=20, choices=STRATEGY_CHOICES)
    min_price = models.FloatField(null=True, blank=True)
    max_price = models.FloatField(null=True, blank=True)
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


# ==================== TAX MODELS ====================

class TaxRecord(models.Model):
    STATUS_CHOICES = [('paid', 'Paid'), ('pending', 'Pending'), ('overdue', 'Overdue')]
    
    tax_type = models.CharField(max_length=100)
    amount = models.FloatField()
    period = models.CharField(max_length=20)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    due_date = models.DateField()
    paid_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.tax_type} - {self.amount}"


class ComplianceReport(models.Model):
    STATUS_CHOICES = [('compliant', 'Compliant'), ('non_compliant', 'Non-Compliant'), ('pending', 'Pending')]
    
    name = models.CharField(max_length=200)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    period = models.CharField(max_length=20)
    findings = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.status}"


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
