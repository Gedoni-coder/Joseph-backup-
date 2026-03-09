"""
Django Management Command to Seed Database with Mock Data

This command populates the Django database with all the mock data
from the frontend, matching the correct schema, types and structures.
"""
from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import datetime, timedelta
from api.models import (
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
    # Inventory & Supply Chain
    InventoryItem, StockMovement, Supplier, ProcurementOrder, LogisticsMetric,
    DemandForecast, InventoryValuation, DeadStock, InventoryLocation,
    InventoryAudit, TurnoverMetrics, WarehouseOperation, SupplierContract,
    ProductionPlan, MarketVolatility, RegulatoryComplianceSC, DisruptionRisk,
    SustainabilityMetrics,
)


class Command(BaseCommand):
    help = 'Seed database with mock data from frontend'

    def handle(self, *args, **options):
        self.stdout.write('Starting database seeding...')
        
        # Clear existing data (optional - comment out if you want to keep existing data)
        self.clear_existing_data()
        
        # Seed data in order of dependencies
        self.seed_company_profile()
        self.seed_economic_data()
        self.seed_business_data()
        self.seed_market_data()
        self.seed_loan_data()
        self.seed_revenue_data()
        self.seed_financial_data()
        self.seed_pricing_data()
        self.seed_tax_data()
        self.seed_policy_data()
        self.seed_inventory_data()
        
        self.stdout.write(self.style.SUCCESS('Database seeding completed successfully!'))
    
    def clear_existing_data(self):
        """Clear existing data to avoid duplicates"""
        self.stdout.write('Clearing existing data...')
        
        # Clear in reverse order of dependencies
        SustainabilityMetrics.objects.all().delete()
        DisruptionRisk.objects.all().delete()
        RegulatoryComplianceSC.objects.all().delete()
        MarketVolatility.objects.all().delete()
        ProductionPlan.objects.all().delete()
        SupplierContract.objects.all().delete()
        WarehouseOperation.objects.all().delete()
        TurnoverMetrics.objects.all().delete()
        InventoryAudit.objects.all().delete()
        InventoryLocation.objects.all().delete()
        DeadStock.objects.all().delete()
        DemandForecast.objects.all().delete()
        InventoryValuation.objects.all().delete()
        LogisticsMetric.objects.all().delete()
        ProcurementOrder.objects.all().delete()
        Supplier.objects.all().delete()
        StockMovement.objects.all().delete()
        InventoryItem.objects.all().delete()
        
        StrategyRecommendation.objects.all().delete()
        InternalPolicy.objects.all().delete()
        ExternalPolicy.objects.all().delete()
        ComplianceReport.objects.all().delete()
        TaxRecord.objects.all().delete()
        
        PriceForecast.objects.all().delete()
        PricingRule.objects.all().delete()
        PriceSetting.objects.all().delete()
        
        LiquidityMetric.objects.all().delete()
        AdvisoryInsight.objects.all().delete()
        RiskAssessment.objects.all().delete()
        ScenarioTest.objects.all().delete()
        CashFlowProjection.objects.all().delete()
        BudgetForecast.objects.all().delete()
        
        ChannelPerformance.objects.all().delete()
        RevenueMetric.objects.all().delete()
        UpsellOpportunity.objects.all().delete()
        ChurnAnalysis.objects.all().delete()
        RevenueScenario.objects.all().delete()
        RevenueStream.objects.all().delete()
        
        InvestorMatch.objects.all().delete()
        FundingStrategy.objects.all().delete()
        BusinessPlan.objects.all().delete()
        LoanComparison.objects.all().delete()
        FundingOption.objects.all().delete()
        LoanEligibility.objects.all().delete()
        
        MarketTrend.objects.all().delete()
        Competitor.objects.all().delete()
        MarketSegment.objects.all().delete()
        
        Document.objects.all().delete()
        ScenarioPlanning.objects.all().delete()
        KPI.objects.all().delete()
        CashFlowForecast.objects.all().delete()
        CostStructure.objects.all().delete()
        RevenueProjection.objects.all().delete()
        CustomerProfile.objects.all().delete()
        
        EconomicEvent.objects.all().delete()
        EconomicForecast.objects.all().delete()
        EconomicNews.objects.all().delete()
        EconomicMetric.objects.all().delete()
        
        CompanyProfile.objects.all().delete()
        
        self.stdout.write(self.style.SUCCESS('Existing data cleared.'))
    
    # ==================== COMPANY PROFILE ====================
    def seed_company_profile(self):
        self.stdout.write('Seeding Company Profile...')
        
        CompanyProfile.objects.create(
            company_name="Acme Corporation",
            description="Leading provider of innovative business solutions",
            number_of_workers=250,
            sector="Technology",
            company_size="medium",
            country="United States",
            state="California",
            city="San Francisco",
            website_url="https://acmecorp.example.com",
            email="contact@acmecorp.example.com",
            phone="+1-555-0100",
            currency_preference="USD",
            language="en",
            number_of_entities=1,
        )
        self.stdout.write(self.style.SUCCESS(f'Created Company Profile'))
    
    # ==================== ECONOMIC DATA ====================
    def seed_economic_data(self):
        self.stdout.write('Seeding Economic Data...')
        
        # Economic Metrics
        metrics_data = [
            {'context': 'us', 'name': 'GDP Growth', 'value': 2.1, 'change': 0.3, 'unit': '%', 'trend': 'up', 'category': 'Growth'},
            {'context': 'us', 'name': 'Inflation Rate', 'value': 3.4, 'change': -0.2, 'unit': '%', 'trend': 'down', 'category': 'Prices'},
            {'context': 'us', 'name': 'Unemployment Rate', 'value': 3.7, 'change': -0.1, 'unit': '%', 'trend': 'down', 'category': 'Labor'},
            {'context': 'us', 'name': 'Consumer Confidence', 'value': 108.5, 'change': 2.5, 'unit': 'index', 'trend': 'up', 'category': 'Sentiment'},
        ]
        
        for data in metrics_data:
            EconomicMetric.objects.create(**data)
        
        # Economic News
        news_data = [
            {
                'context': 'us',
                'title': 'Federal Reserve Maintains Interest Rates',
                'summary': 'The Fed keeps rates steady, signaling patience in inflation fight',
                'source': 'Financial Times',
                'impact': 'medium',
                'category': 'Monetary Policy'
            },
            {
                'context': 'us',
                'title': 'Tech Sector Shows Strong Growth',
                'summary': 'Technology companies report robust quarterly earnings',
                'source': 'Wall Street Journal',
                'impact': 'positive',
                'category': 'Business'
            },
        ]
        
        for data in news_data:
            EconomicNews.objects.create(**data)
        
        # Economic Forecasts
        forecast_data = [
            {
                'context': 'us',
                'indicator': 'GDP Growth',
                'period': 'Q1 2024',
                'forecast': 2.3,
                'confidence': 75,
                'range_low': 1.8,
                'range_high': 2.8,
            },
            {
                'context': 'us',
                'indicator': 'Inflation Rate',
                'period': 'Q2 2024',
                'forecast': 3.1,
                'confidence': 70,
                'range_low': 2.6,
                'range_high': 3.6,
            },
        ]
        
        for data in forecast_data:
            EconomicForecast.objects.create(**data)
        
        # Economic Events
        event_data = [
            {
                'context': 'us',
                'title': 'Federal Reserve Meeting',
                'date': datetime.now().date() + timedelta(days=30),
                'description': 'Upcoming FOMC meeting to discuss monetary policy',
                'impact': 'high',
                'category': 'Monetary Policy'
            },
        ]
        
        for data in event_data:
            EconomicEvent.objects.create(**data)
        
        self.stdout.write(self.style.SUCCESS(f'Created Economic Data'))
    
    # ==================== BUSINESS DATA ====================
    def seed_business_data(self):
        self.stdout.write('Seeding Business Data...')
        
        # Customer Profiles
        customer_data = [
            {
                'name': 'Enterprise Corp',
                'email': 'accounts@enterprise.com',
                'segment': 'enterprise',
                'lifetime_value': 875000,
                'average_order_value': 125000,
                'order_frequency': 7,
                'risk_score': 'low',
                'preferences': {'priority_support': True, 'custom_solutions': True},
                # Extended fields from UI
                'demand_assumption': 85,
                'growth_rate': 12.5,
                'retention': 92,
                'seasonality': 8,
            },
            {
                'name': 'SMB Solutions',
                'email': 'contact@smbsolutions.com',
                'segment': 'smb',
                'lifetime_value': 142500,
                'average_order_value': 28500,
                'order_frequency': 5,
                'risk_score': 'medium',
                'preferences': {'self_service': True},
                # Extended fields from UI
                'demand_assumption': 280,
                'growth_rate': 25.6,
                'retention': 78,
                'seasonality': 22,
            },
            {
                'name': 'Startup Hub',
                'email': 'hello@startuphub.io',
                'segment': 'startup',
                'lifetime_value': 18200,
                'average_order_value': 5200,
                'order_frequency': 3,
                'risk_score': 'high',
                'preferences': {'flexible_payment': True},
                # Extended fields from UI
                'demand_assumption': 450,
                'growth_rate': 42.3,
                'retention': 65,
                'seasonality': 15,
            },
        ]
        
        for data in customer_data:
            CustomerProfile.objects.create(**data)
        
        # Revenue Projections
        projection_data = [
            {
                'name': 'Q1 Revenue Projection',
                'period': '3m',
                'projected_revenue': 1500000,
                'confidence': 80,
                'assumptions': 'Based on current pipeline and seasonal trends',
                # Extended fields from UI
                'conservative': 1350000,
                'optimistic': 1725000,
                'actual_to_date': 1250000,
            },
            {
                'name': 'Annual Revenue Target',
                'period': '1y',
                'projected_revenue': 6500000,
                'confidence': 65,
                'assumptions': 'Assumes 15% market growth and new customer acquisition',
                # Extended fields from UI
                'conservative': 5850000,
                'optimistic': 7150000,
                'actual_to_date': 0,
            },
        ]
        
        for data in projection_data:
            RevenueProjection.objects.create(**data)
        
        # Cost Structures
        cost_data = [
            {'name': 'Rent', 'category': 'fixed', 'amount': 25000, 'period': 'monthly', 'description': 'Office space lease'},
            {'name': 'Salaries', 'category': 'fixed', 'amount': 150000, 'period': 'monthly', 'description': 'Employee wages'},
            {'name': 'Marketing', 'category': 'variable', 'amount': 15000, 'period': 'monthly', 'description': 'Advertising spend'},
            {'name': 'Software Licenses', 'category': 'semi_variable', 'amount': 5000, 'period': 'monthly', 'description': 'Per user licensing'},
        ]
        
        for data in cost_data:
            CostStructure.objects.create(**data)
        
        # Cash Flow Forecasts
        cashflow_data = [
            {'name': 'Monthly Cash Flow', 'period': 'monthly', 'cash_inflow': 500000, 'cash_outflow': 350000, 'net_position': 150000},
            {'name': 'Weekly Cash Position', 'period': 'weekly', 'cash_inflow': 125000, 'cash_outflow': 100000, 'net_position': 25000},
        ]
        
        for data in cashflow_data:
            CashFlowForecast.objects.create(**data)
        
        # KPIs
        kpi_data = [
            {'name': 'Revenue Growth', 'current_value': 15.5, 'target_value': 20.0, 'unit': '%', 'status': 'at_risk'},
            {'name': 'Customer Acquisition Cost', 'current_value': 450, 'target_value': 400, 'unit': '$', 'status': 'on_track'},
            {'name': 'Net Promoter Score', 'current_value': 72, 'target_value': 80, 'unit': 'points', 'status': 'on_track'},
            {'name': 'Employee Retention', 'current_value': 88, 'target_value': 95, 'unit': '%', 'status': 'at_risk'},
        ]
        
        for data in kpi_data:
            KPI.objects.create(**data)
        
        # Scenario Planning
        scenario_data = [
            {'name': 'Base Case Growth', 'type': 'base', 'probability': 50, 'description': 'Moderate growth with current strategy'},
            {'name': 'Optimistic Expansion', 'type': 'optimistic', 'probability': 25, 'description': 'Successful market expansion and new product launch'},
            {'name': 'Recession Scenario', 'type': 'pessimistic', 'probability': 25, 'description': 'Economic downturn affecting sales'},
        ]
        
        for data in scenario_data:
            ScenarioPlanning.objects.create(**data)
        
        self.stdout.write(self.style.SUCCESS(f'Created Business Data'))
    
    # ==================== MARKET DATA ====================
    def seed_market_data(self):
        self.stdout.write('Seeding Market Data...')
        
        # Market Segments
        segment_data = [
            {
                'name': 'Enterprise',
                'description': 'Large organizations with complex needs',
                'size': 50,
                'growth_rate': 8.2,
                'target_demographics': {'company_size': '500+', 'industry': 'various'}
            },
            {
                'name': 'SMB',
                'description': 'Small and medium businesses',
                'size': 150,
                'growth_rate': 15.3,
                'target_demographics': {'company_size': '10-499', 'industry': 'various'}
            },
            {
                'name': 'Startups',
                'description': 'Early stage companies',
                'size': 300,
                'growth_rate': 28.7,
                'target_demographics': {'company_size': '1-9', 'founded': '<5 years'}
            },
        ]
        
        for data in segment_data:
            MarketSegment.objects.create(**data)
        
        # Competitors
        competitor_data = [
            {
                'name': 'GlobalTech Inc',
                'description': 'Market leader with extensive product suite',
                'market_share': 25.5,
                'strengths': 'Strong brand, extensive resources, global presence',
                'weaknesses': 'Higher prices, slower innovation',
                'website': 'https://globaltech.example.com'
            },
            {
                'name': 'StartupX',
                'description': 'Fast-growing disruptive competitor',
                'market_share': 12.3,
                'strengths': 'Innovative products, agile development',
                'weaknesses': 'Limited resources, narrow focus'
            },
            {
                'name': 'Enterprise Solutions Ltd',
                'description': 'Enterprise-focused competitor',
                'market_share': 18.7,
                'strengths': 'Strong enterprise relationships, compliance',
                'weaknesses': 'Legacy technology stack'
            },
        ]
        
        for data in competitor_data:
            Competitor.objects.create(**data)
        
        # Market Trends
        trend_data = [
            {
                'name': 'Digital Transformation',
                'description': 'Accelerated digital adoption across industries',
                'category': 'technology',
                'impact': 'high'
            },
            {
                'name': 'Remote Work Revolution',
                'description': 'Shift to distributed work models',
                'category': 'consumer_behavior',
                'impact': 'high'
            },
            {
                'name': 'Data Privacy Regulations',
                'description': 'Increasing regulatory requirements for data protection',
                'category': 'regulatory',
                'impact': 'medium'
            },
        ]
        
        for data in trend_data:
            MarketTrend.objects.create(**data)
        
        self.stdout.write(self.style.SUCCESS(f'Created Market Data'))
    
    # ==================== LOAN DATA ====================
    def seed_loan_data(self):
        self.stdout.write('Seeding Loan Data...')
        
        # Loan Eligibility
        eligibility_data = [
            {
                'business_name': 'Acme Corporation',
                'business_type': 'Corporation',
                'eligible_amount': 500000,
                'interest_rate': 6.5,
                'term_months': 36,
                'status': 'eligible',
                'requirements': ['Business license', 'Tax returns 2 years', 'Bank statements']
            },
        ]
        
        for data in eligibility_data:
            LoanEligibility.objects.create(**data)
        
        # Funding Options
        funding_data = [
            {
                'name': 'SBA 7(a) Loan',
                'type': 'loan',
                'min_amount': 50000,
                'max_amount': 5000000,
                'interest_rate': 7.5,
                'description': 'Small Business Administration guaranteed loan'
            },
            {
                'name': 'Venture Capital Growth',
                'type': 'venture_capital',
                'min_amount': 1000000,
                'max_amount': 20000000,
                'description': 'Growth equity for scaling companies'
            },
            {
                'name': 'Equipment Financing',
                'type': 'loan',
                'min_amount': 10000,
                'max_amount': 500000,
                'interest_rate': 8.0,
                'description': 'Finance equipment purchases with the equipment as collateral'
            },
        ]
        
        for data in funding_data:
            FundingOption.objects.create(**data)
        
        # Loan Comparisons
        comparison_data = [
            {
                'name': 'SBA 7(a) Loan',
                'lender': 'Bank of America',
                'amount': 250000,
                'interest_rate': 7.5,
                'term_months': 60,
                'monthly_payment': 5013,
                'total_interest': 50780,
                'features': ['Government guaranteed', 'Flexible use of funds', 'Lower down payment']
            },
        ]
        
        for data in comparison_data:
            LoanComparison.objects.create(**data)
        
        # Business Plans
        business_plan_data = [
            {
                'title': 'Acme Corp 5-Year Growth Plan',
                'industry': 'Technology',
                'summary': 'Comprehensive plan for market expansion and product development',
                'financials': {
                    'revenue_2024': 5000000,
                    'revenue_2025': 7500000,
                    'revenue_2026': 10000000,
                }
            },
        ]
        
        for data in business_plan_data:
            BusinessPlan.objects.create(**data)
        
        # Funding Strategies
        strategy_data = [
            {
                'name': 'Balanced Growth Strategy',
                'description': 'Mix of debt and equity to fund growth while maintaining control',
                'risk_level': 'medium',
                'timeline': '3-5 years',
                'recommended_sources': ['SBA Loans', 'Venture Debt', 'Strategic Investors']
            },
        ]
        
        for data in strategy_data:
            FundingStrategy.objects.create(**data)
        
        # Investor Matches
        investor_data = [
            {
                'investor_name': 'Tech Ventures Capital',
                'investment_range_min': 1000000,
                'investment_range_max': 10000000,
                'sector_focus': 'Technology',
                'typical_deal_size': 3000000,
                'contact_info': {'email': 'deals@techventures.example.com', 'website': 'https://techventures.example.com'}
            },
        ]
        
        for data in investor_data:
            InvestorMatch.objects.create(**data)
        
        self.stdout.write(self.style.SUCCESS(f'Created Loan Data'))
    
    # ==================== REVENUE DATA ====================
    def seed_revenue_data(self):
        self.stdout.write('Seeding Revenue Data...')
        
        # Revenue Streams
        stream_data = [
            {
                'name': 'Marketplace Commission',
                'type': 'product',
                'current_revenue': 8500000,
                'growth_rate': 12.5,
                'margin': 45
            },
            {
                'name': 'Advertising Revenue',
                'type': 'advertising',
                'current_revenue': 3200000,
                'growth_rate': 18.3,
                'margin': 65
            },
            {
                'name': 'Premium Subscriptions',
                'type': 'subscription',
                'current_revenue': 1800000,
                'growth_rate': 5.8,
                'margin': 80
            },
            {
                'name': 'Seller Services',
                'type': 'service',
                'current_revenue': 900000,
                'growth_rate': -2.3,
                'margin': 35
            },
            {
                'name': 'Partner Revenue',
                'type': 'advertising',
                'current_revenue': 600000,
                'growth_rate': 8.5,
                'margin': 55
            },
        ]
        
        for data in stream_data:
            RevenueStream.objects.create(**data)
        
        # Revenue Scenarios
        scenario_data = [
            {
                'name': 'Conservative Growth',
                'description': 'Base case with current market conditions',
                'probability': 50,
                'projected_revenue': 14000000,
                'assumptions': {'market_growth': 8, 'new_customers': 50}
            },
            {
                'name': 'Aggressive Expansion',
                'description': 'New market entry and product launches',
                'probability': 30,
                'projected_revenue': 18000000,
                'assumptions': {'market_growth': 15, 'new_customers': 150}
            },
        ]
        
        for data in scenario_data:
            RevenueScenario.objects.create(**data)
        
        # Churn Analysis
        churn_data = [
            {
                'segment': 'Enterprise',
                'churn_rate': 2.1,
                'risk_score': 0.15,
                'reasons': ['Price', 'Competition', 'Product Fit'],
                'period': 'Q4 2023'
            },
            {
                'segment': 'SMB',
                'churn_rate': 5.8,
                'risk_score': 0.35,
                'reasons': ['Price sensitivity', 'Switching to competitors'],
                'period': 'Q4 2023'
            },
            {
                'segment': 'Startups',
                'churn_rate': 18.5,
                'risk_score': 0.65,
                'reasons': ['Funding issues', 'Business closure', 'Price'],
                'period': 'Q4 2023'
            },
        ]
        
        for data in churn_data:
            ChurnAnalysis.objects.create(**data)
        
        # Upsell Opportunities
        customers = CustomerProfile.objects.all()
        if customers.exists():
            upsell_data = [
                {
                    'customer': customers[0],
                    'product': 'Premium Analytics Package',
                    'current_price': 50000,
                    'upsell_price': 75000,
                    'potential_revenue': 1250000,
                    'probability': 65
                },
                {
                    'customer': customers[1],
                    'product': 'Logistics Integration',
                    'current_price': 15000,
                    'upsell_price': 25000,
                    'potential_revenue': 850000,
                    'probability': 45
                },
            ]
            
            for data in upsell_data:
                UpsellOpportunity.objects.create(**data)
        
        # Revenue Metrics
        metric_data = [
            {'name': 'Monthly Recurring Revenue', 'value': 1200000, 'previous_value': 1100000, 'change_percent': 9.1, 'period': 'January 2024'},
            {'name': 'Annual Recurring Revenue', 'value': 14400000, 'previous_value': 13200000, 'change_percent': 9.1, 'period': '2024'},
            {'name': 'Average Revenue Per User', 'value': 850, 'previous_value': 780, 'change_percent': 9.0, 'period': 'January 2024'},
        ]
        
        for data in metric_data:
            RevenueMetric.objects.create(**data)
        
        # Channel Performance
        channel_data = [
            {
                'channel': 'Direct Sales',
                'revenue': 6800000,
                'conversion_rate': 12.5,
                'customer_acquisition_cost': 350,
                'period': 'Q4 2023'
            },
            {
                'channel': 'Channel Partners',
                'revenue': 4200000,
                'conversion_rate': 8.2,
                'customer_acquisition_cost': 280,
                'period': 'Q4 2023'
            },
            {
                'channel': 'Marketplace Listings',
                'revenue': 2100000,
                'conversion_rate': 5.8,
                'customer_acquisition_cost': 180,
                'period': 'Q4 2023'
            },
            {
                'channel': 'Affiliate Programs',
                'revenue': 1400000,
                'conversion_rate': 15.2,
                'customer_acquisition_cost': 120,
                'period': 'Q4 2023'
            },
        ]
        
        for data in channel_data:
            ChannelPerformance.objects.create(**data)
        
        self.stdout.write(self.style.SUCCESS(f'Created Revenue Data'))
    
    # ==================== FINANCIAL DATA ====================
    def seed_financial_data(self):
        self.stdout.write('Seeding Financial Data...')
        
        # Budget Forecasts
        budget_data = [
            {'category': 'Revenue', 'amount': 5000000, 'actual_amount': 5200000, 'variance': 200000, 'period': 'Q1 2024'},
            {'category': 'COGS', 'amount': 2000000, 'actual_amount': 1950000, 'variance': 50000, 'period': 'Q1 2024'},
            {'category': 'Marketing', 'amount': 500000, 'actual_amount': 550000, 'variance': -50000, 'period': 'Q1 2024'},
            {'category': 'Operations', 'amount': 800000, 'actual_amount': 780000, 'variance': 20000, 'period': 'Q1 2024'},
            {'category': 'R&D', 'amount': 600000, 'actual_amount': 620000, 'variance': -20000, 'period': 'Q1 2024'},
        ]
        
        for data in budget_data:
            BudgetForecast.objects.create(**data)
        
        # Cash Flow Projections
        cashflow_data = [
            {'name': 'Product Sales', 'type': 'inflow', 'amount': 450000, 'period': 'February 2024'},
            {'name': 'Service Revenue', 'type': 'inflow', 'amount': 120000, 'period': 'February 2024'},
            {'name': 'Supplier Payments', 'type': 'outflow', 'amount': -180000, 'period': 'February 2024'},
            {'name': 'Payroll', 'type': 'outflow', 'amount': -150000, 'period': 'February 2024'},
            {'name': 'Marketing', 'type': 'outflow', 'amount': -45000, 'period': 'February 2024'},
        ]
        
        for data in cashflow_data:
            CashFlowProjection.objects.create(**data)
        
        # Scenario Tests
        scenario_data = [
            {
                'name': 'Economic Downturn',
                'type': 'stress',
                'description': 'Simulate 20% revenue decline scenario',
                'impact': {'revenue_change': -20, 'margin_impact': -5},
                'probability': 15
            },
            {
                'name': 'Interest Rate Hike',
                'type': 'sensitivity',
                'description': 'Impact of 2% interest rate increase',
                'impact': {'cost_increase': 8, 'margin_impact': -3},
                'probability': 35
            },
            {
                'name': 'New Market Entry',
                'type': 'what_if',
                'description': 'Potential impact of entering new geographic market',
                'impact': {'revenue_boost': 25, 'cost_increase': 15},
                'probability': 50
            },
        ]
        
        for data in scenario_data:
            ScenarioTest.objects.create(**data)
        
        # Risk Assessments
        risk_data = [
            {
                'category': 'Market Risk',
                'description': 'Changes in market conditions affecting demand',
                'level': 'medium',
                'impact': 'high',
                'mitigation': 'Diversify product portfolio and customer base'
            },
            {
                'category': 'Credit Risk',
                'description': 'Customer default or delayed payments',
                'level': 'low',
                'impact': 'medium',
                'mitigation': 'Credit checks and payment terms optimization'
            },
            {
                'category': 'Operational Risk',
                'description': 'Disruption to business operations',
                'level': 'medium',
                'impact': 'medium',
                'mitigation': 'Business continuity planning and insurance'
            },
        ]
        
        for data in risk_data:
            RiskAssessment.objects.create(**data)
        
        # Advisory Insights
        insight_data = [
            {
                'title': 'Cost Optimization Opportunity',
                'description': 'Analysis shows potential for 15% reduction in operational costs through process improvements',
                'category': 'cost_optimization',
                'priority': 'high',
                'recommendations': ['Implement automated workflows', 'Renegotiate supplier contracts', 'Consolidate vendors']
            },
            {
                'title': 'Revenue Growth Initiative',
                'description': 'Data-driven insights suggest focusing on enterprise segment for higher LTV customers',
                'category': 'revenue_growth',
                'priority': 'high',
                'recommendations': ['Develop enterprise pricing tier', 'Hire enterprise sales team', 'Create enterprise onboarding program']
            },
            {
                'title': 'Working Capital Optimization',
                'description': 'Improve cash conversion cycle by 15 days through receivables and payables management',
                'category': 'operational',
                'priority': 'medium',
                'recommendations': ['Implement early payment discounts', 'Review payment terms with suppliers', 'Automate invoicing']
            },
        ]
        
        for data in insight_data:
            AdvisoryInsight.objects.create(**data)
        
        # Liquidity Metrics
        liquidity_data = [
            {'name': 'Current Ratio', 'value': 2.5, 'benchmark': 2.0, 'period': 'Q4 2023'},
            {'name': 'Quick Ratio', 'value': 1.8, 'benchmark': 1.5, 'period': 'Q4 2023'},
            {'name': 'Cash Ratio', 'value': 0.8, 'benchmark': 0.5, 'period': 'Q4 2023'},
            {'name': 'Days Sales Outstanding', 'value': 45, 'benchmark': 40, 'period': 'Q4 2023'},
            {'name': 'Days Inventory Outstanding', 'value': 30, 'benchmark': 35, 'period': 'Q4 2023'},
        ]
        
        for data in liquidity_data:
            LiquidityMetric.objects.create(**data)
        
        self.stdout.write(self.style.SUCCESS(f'Created Financial Data'))
    
    # ==================== PRICING DATA ====================
    def seed_pricing_data(self):
        self.stdout.write('Seeding Pricing Data...')
        
        # Price Settings
        price_data = [
            {
                'product': 'Basic Plan',
                'base_price': 99,
                'current_price': 99,
                'strategy': 'cost_plus',
                'min_price': 79,
                'max_price': 149
            },
            {
                'product': 'Professional Plan',
                'base_price': 299,
                'current_price': 299,
                'strategy': 'value_based',
                'min_price': 249,
                'max_price': 449
            },
            {
                'product': 'Enterprise Plan',
                'base_price': 999,
                'current_price': 999,
                'strategy': 'competitive',
                'min_price': 799,
                'max_price': 1999
            },
        ]
        
        for data in price_data:
            PriceSetting.objects.create(**data)
        
        # Pricing Rules
        rule_data = [
            {
                'name': 'Volume Discount',
                'condition': 'volume',
                'condition_value': {'min_quantity': 10, 'discount_percent': 10},
                'adjustment_type': 'percentage',
                'adjustment_value': 10,
                'is_active': True
            },
            {
                'name': 'Annual Payment Discount',
                'condition': 'time',
                'condition_value': {'billing_period': 'annual'},
                'adjustment_type': 'percentage',
                'adjustment_value': 20,
                'is_active': True
            },
            {
                'name': 'Enterprise Customer Discount',
                'condition': 'customer',
                'condition_value': {'segment': 'enterprise'},
                'adjustment_type': 'fixed',
                'adjustment_value': 500,
                'is_active': True
            },
        ]
        
        for data in rule_data:
            PricingRule.objects.create(**data)
        
        # Price Forecasts
        forecast_data = [
            {
                'product': 'Basic Plan',
                'forecast_price': 109,
                'confidence': 75,
                'range_low': 99,
                'range_high': 119,
                'period': 'Q2 2024'
            },
            {
                'product': 'Professional Plan',
                'forecast_price': 329,
                'confidence': 70,
                'range_low': 299,
                'range_high': 359,
                'period': 'Q2 2024'
            },
        ]
        
        for data in forecast_data:
            PriceForecast.objects.create(**data)
        
        self.stdout.write(self.style.SUCCESS(f'Created Pricing Data'))
    
    # ==================== TAX DATA ====================
    def seed_tax_data(self):
        self.stdout.write('Seeding Tax Data...')
        
        # Tax Records
        tax_data = [
            {
                'tax_type': 'Federal Income Tax',
                'amount': 125000,
                'period': '2023',
                'status': 'paid',
                'due_date': datetime(2024, 3, 15).date(),
                'paid_date': datetime(2024, 3, 10).date()
            },
            {
                'tax_type': 'State Income Tax',
                'amount': 35000,
                'period': '2023',
                'status': 'paid',
                'due_date': datetime(2024, 4, 15).date(),
                'paid_date': datetime(2024, 4, 12).date()
            },
            {
                'tax_type': 'Quarterly Estimate Q1',
                'amount': 45000,
                'period': 'Q1 2024',
                'status': 'pending',
                'due_date': datetime(2024, 4, 15).date(),
            },
        ]
        
        for data in tax_data:
            TaxRecord.objects.create(**data)
        
        # Compliance Reports
        compliance_data = [
            {
                'name': 'Annual Tax Filing 2023',
                'description': 'Complete tax return filing for fiscal year 2023',
                'status': 'compliant',
                'period': '2023',
                'findings': ['All deductions properly documented', 'Credits correctly applied']
            },
            {
                'name': 'Sales Tax Compliance Review',
                'description': 'Quarterly review of sales tax collection and remittance',
                'status': 'compliant',
                'period': 'Q4 2023',
                'findings': ['All jurisdictions properly collected', 'Timely remittance confirmed']
            },
        ]
        
        for data in compliance_data:
            ComplianceReport.objects.create(**data)
        
        self.stdout.write(self.style.SUCCESS(f'Created Tax Data'))
    
    # ==================== POLICY DATA ====================
    def seed_policy_data(self):
        self.stdout.write('Seeding Policy Data...')
        
        # External Policies
        ext_policy_data = [
            {
                'title': 'GDPR Compliance Requirements',
                'source': 'European Union',
                'category': 'regulation',
                'impact': 'high',
                'description': 'Data protection and privacy regulations for EU citizens',
                'effective_date': datetime(2024, 5, 25).date()
            },
            {
                'title': 'CCPA Amendment',
                'source': 'California',
                'category': 'regulation',
                'impact': 'medium',
                'description': 'Updated consumer privacy rights and business obligations',
                'effective_date': datetime(2024, 1, 1).date()
            },
        ]
        
        for data in ext_policy_data:
            ExternalPolicy.objects.create(**data)
        
        # Internal Policies
        int_policy_data = [
            {
                'title': 'Data Security Policy',
                'category': 'it',
                'description': 'Standards for protecting company and customer data',
                'status': 'active',
                'effective_date': datetime(2023, 6, 1).date()
            },
            {
                'title': 'Expense Reimbursement Policy',
                'category': 'finance',
                'description': 'Guidelines for business expense reimbursement',
                'status': 'active',
                'effective_date': datetime(2023, 1, 1).date()
            },
            {
                'title': 'Remote Work Policy',
                'category': 'hr',
                'description': 'Guidelines for remote and hybrid work arrangements',
                'status': 'active',
                'effective_date': datetime(2023, 3, 1).date()
            },
        ]
        
        for data in int_policy_data:
            InternalPolicy.objects.create(**data)
        
        # Strategy Recommendations
        strategy_data = [
            {
                'title': 'Market Expansion Strategy',
                'description': 'Enter new geographic markets to diversify revenue streams',
                'category': 'growth',
                'priority': 'high',
                'impact': 'high',
                'implementation_steps': ['Conduct market research', 'Identify local partners', 'Develop localization plan'],
                'expected_outcome': '20% revenue growth within 18 months'
            },
            {
                'title': 'Cost Reduction Initiative',
                'description': 'Implement operational efficiencies to reduce overhead costs',
                'category': 'cost',
                'priority': 'high',
                'impact': 'medium',
                'implementation_steps': ['Process audit', 'Identify bottlenecks', 'Implement automation'],
                'expected_outcome': '15% reduction in operational costs'
            },
        ]
        
        for data in strategy_data:
            StrategyRecommendation.objects.create(**data)
        
        self.stdout.write(self.style.SUCCESS(f'Created Policy Data'))
    
    # ==================== INVENTORY DATA ====================
    def seed_inventory_data(self):
        self.stdout.write('Seeding Inventory & Supply Chain Data...')
        
        # Suppliers
        supplier_data = [
            {
                'name': 'Global Parts Ltd',
                'contact_name': 'John Smith',
                'email': 'john@globalparts.com',
                'phone': '+86-21-5888-1234',
                'address': 'Shanghai, China',
                'rating': 4.8,
                'lead_time_days': 30
            },
            {
                'name': 'AfriTrade Partners',
                'contact_name': 'Sarah Johnson',
                'email': 'support@afritrade.com',
                'phone': '+234-1-2345-6789',
                'address': 'Lagos, Nigeria',
                'rating': 4.2,
                'lead_time_days': 7
            },
            {
                'name': 'Emergency Components Inc',
                'contact_name': 'Ahmed Hassan',
                'email': 'orders@emcomp.ae',
                'phone': '+971-4-123-4567',
                'address': 'Dubai, UAE',
                'rating': 4.5,
                'lead_time_days': 3
            },
        ]
        
        suppliers = []
        for data in supplier_data:
            supplier = Supplier.objects.create(**data)
            suppliers.append(supplier)
        
        # Inventory Items
        item_data = [
            {
                'name': 'Electronics Processor',
                'sku': 'ELEC-001',
                'quantity': 450,
                'reorder_level': 100,
                'unit_cost': 150,
                'unit_price': 225,
                'supplier': suppliers[0],
                'location': 'Warehouse A'
            },
            {
                'name': 'Packaging Materials',
                'sku': 'PKG-002',
                'quantity': 45,
                'reorder_level': 200,
                'unit_cost': 50,
                'unit_price': 75,
                'supplier': suppliers[1],
                'location': 'Warehouse B'
            },
            {
                'name': 'Raw Steel Sheets',
                'sku': 'STEEL-003',
                'quantity': 0,
                'reorder_level': 500,
                'unit_cost': 200,
                'unit_price': 300,
                'supplier': suppliers[0],
                'location': 'Warehouse C'
            },
            {
                'name': 'Plastic Components',
                'sku': 'PLASTIC-004',
                'quantity': 8500,
                'reorder_level': 2000,
                'unit_cost': 5,
                'unit_price': 8,
                'supplier': suppliers[2],
                'location': 'Warehouse A'
            },
        ]
        
        items = []
        for data in item_data:
            item = InventoryItem.objects.create(**data)
            items.append(item)
        
        # Stock Movements
        movement_data = [
            {'item': items[0], 'type': 'in', 'quantity': 500, 'reference': 'PO-001'},
            {'item': items[0], 'type': 'out', 'quantity': 50, 'reference': 'SO-001'},
            {'item': items[1], 'type': 'in', 'quantity': 200, 'reference': 'PO-002'},
            {'item': items[3], 'type': 'in', 'quantity': 10000, 'reference': 'PO-003'},
            {'item': items[3], 'type': 'out', 'quantity': 1500, 'reference': 'SO-002'},
        ]
        
        for data in movement_data:
            StockMovement.objects.create(**data)
        
        # Procurement Orders
        order_data = [
            {
                'order_number': 'PO-001',
                'supplier': suppliers[0],
                'items': [{'sku': 'ELEC-001', 'quantity': 500, 'unit_price': 150}],
                'total': 75000,
                'status': 'delivered'
            },
            {
                'order_number': 'PO-002',
                'supplier': suppliers[1],
                'items': [{'sku': 'PKG-002', 'quantity': 200, 'unit_price': 50}],
                'total': 10000,
                'status': 'shipped'
            },
            {
                'order_number': 'PO-003',
                'supplier': suppliers[2],
                'items': [{'sku': 'PLASTIC-004', 'quantity': 10000, 'unit_price': 5}],
                'total': 50000,
                'status': 'pending'
            },
        ]
        
        for data in order_data:
            ProcurementOrder.objects.create(**data)
        
        # Logistics Metrics
        logistics_data = [
            {'name': 'On-Time Delivery Rate', 'value': 96.5, 'unit': '%', 'period': 'January 2024'},
            {'name': 'Order Accuracy', 'value': 98.2, 'unit': '%', 'period': 'January 2024'},
            {'name': 'Average Lead Time', 'value': 12.5, 'unit': 'days', 'period': 'January 2024'},
            {'name': 'Inventory Turnover', 'value': 4.2, 'unit': 'times', 'period': 'Q4 2023'},
        ]
        
        for data in logistics_data:
            LogisticsMetric.objects.create(**data)
        
        # Inventory Locations
        location_data = [
            {
                'name': 'Main Warehouse',
                'location_type': 'warehouse',
                'address': '123 Industrial Blvd, San Francisco, CA',
                'capacity': 50000,
                'current_utilization': 65,
                'manager': 'Mike Wilson',
                'status': 'active'
            },
            {
                'name': 'Distribution Center East',
                'location_type': 'distribution_center',
                'address': '456 Commerce Way, Dallas, TX',
                'capacity': 75000,
                'current_utilization': 45,
                'manager': 'Lisa Chen',
                'status': 'active'
            },
        ]
        
        locations = []
        for data in location_data:
            location = InventoryLocation.objects.create(**data)
            locations.append(location)
        
        # Demand Forecasts
        forecast_data = [
            {
                'item': items[0],
                'forecast_period': 'monthly',
                'current_demand': 150,
                'predicted_demand': 180,
                'confidence': 75,
                'seasonal_factor': 1.2,
                'trend_factor': 1.1,
                'factors': ['Seasonal demand', 'Market growth'],
                'reorder_quantity': 250,
                'reorder_urgency': 'medium'
            },
            {
                'item': items[1],
                'forecast_period': 'monthly',
                'current_demand': 300,
                'predicted_demand': 350,
                'confidence': 70,
                'seasonal_factor': 1.5,
                'trend_factor': 1.0,
                'factors': ['Holiday season', 'Packaging demand'],
                'reorder_quantity': 400,
                'reorder_urgency': 'high'
            },
        ]
        
        for data in forecast_data:
            DemandForecast.objects.create(**data)
        
        # Inventory Valuation
        valuation_data = [
            {
                'method': 'FIFO',
                'total_value': 215000,
                'breakdown': [
                    {'sku': 'ELEC-001', 'quantity': 450, 'value': 101250},
                    {'sku': 'PKG-002', 'quantity': 45, 'value': 3375},
                    {'sku': 'PLASTIC-004', 'quantity': 8500, 'value': 68000}
                ],
                'variance': 2500,
                'cost_of_goods_sold': 45000
            },
        ]
        
        for data in valuation_data:
            InventoryValuation.objects.create(**data)
        
        # Dead Stock
        dead_stock_data = [
            {
                'item': items[2],  # Raw Steel Sheets - out of stock
                'quantity': 0,
                'days_stagnant': 90,
                'original_value': 0,
                'current_value': 0,
                'depreciation': 100,
                'recommended_action': 'liquidate',
                'reason': 'Discontinued product line'
            },
        ]
        
        for data in dead_stock_data:
            DeadStock.objects.create(**data)
        
        # Inventory Audits
        audit_data = [
            {
                'audit_date': datetime(2024, 1, 15).date(),
                'location': locations[0],
                'auditor': 'Jane Doe',
                'status': 'completed',
                'total_items_audited': 250,
                'discrepancies': ['Minor variances in packaging materials'],
                'accuracy': 98.5,
                'adjustments': [{'sku': 'PKG-002', 'adjustment': -5}]
            },
        ]
        
        for data in audit_data:
            InventoryAudit.objects.create(**data)
        
        # Turnover Metrics
        turnover_data = [
            {
                'item': items[0],
                'category': 'Electronics',
                'turnover_ratio': 5.2,
                'average_inventory': 400,
                'cost_of_goods_sold': 208000,
                'days_of_supply': 70,
                'velocity_rating': 'fast',
                'recommendation': 'Maintain current inventory levels'
            },
            {
                'item': items[3],
                'category': 'Components',
                'turnover_ratio': 3.8,
                'average_inventory': 7500,
                'cost_of_goods_sold': 285000,
                'days_of_supply': 95,
                'velocity_rating': 'medium',
                'recommendation': 'Consider reducing safety stock'
            },
        ]
        
        for data in turnover_data:
            TurnoverMetrics.objects.create(**data)
        
        # Production Plans
        production_data = [
            {
                'plan_id': 'PP-001',
                'product_name': 'Electronic Processor Unit A',
                'planned_quantity': 1000,
                'actual_quantity': 850,
                'start_date': datetime(2024, 2, 1).date(),
                'end_date': datetime(2024, 2, 28).date(),
                'status': 'in_progress',
                'required_materials': [{'sku': 'ELEC-001', 'quantity': 1000}],
                'bottlenecks': ['Component shortage'],
                'efficiency': 85,
                'cost_variance': -2500,
                'production_line': 'Line A',
                'priority': 'high'
            },
            {
                'plan_id': 'PP-002',
                'product_name': 'Plastic Housing Model X',
                'planned_quantity': 5000,
                'actual_quantity': 5000,
                'start_date': datetime(2024, 2, 15).date(),
                'end_date': datetime(2024, 3, 15).date(),
                'status': 'planned',
                'required_materials': [{'sku': 'PLASTIC-004', 'quantity': 5000}],
                'bottlenecks': [],
                'efficiency': 0,
                'cost_variance': 0,
                'production_line': 'Line B',
                'priority': 'medium'
            },
        ]
        
        for data in production_data:
            ProductionPlan.objects.create(**data)
        
        # Market Volatility
        volatility_data = [
            {
                'commodity': 'Steel',
                'current_price': 850,
                'price_change': 5.2,
                'volatility_index': 15.5,
                'trend': 'increasing',
                'factors': ['Supply chain constraints', 'Demand surge'],
                'impact': 'high',
                'recommendation': 'Consider hedging strategies and supplier diversification'
            },
            {
                'commodity': 'Plastic Resins',
                'current_price': 1250,
                'price_change': -2.1,
                'volatility_index': 8.2,
                'trend': 'decreasing',
                'factors': ['New capacity', 'Lower demand'],
                'impact': 'low',
                'recommendation': 'Favorable pricing, good time for bulk procurement'
            },
        ]
        
        for data in volatility_data:
            MarketVolatility.objects.create(**data)
        
        # Regulatory Compliance (Supply Chain)
        compliance_data = [
            {
                'regulation': 'ISO 9001 Quality Management',
                'category': 'quality',
                'status': 'compliant',
                'last_audit': datetime(2023, 12, 1).date(),
                'next_audit': datetime(2024, 12, 1).date(),
                'requirements': ['Quality manual', 'Process documentation', 'Internal audits'],
                'gaps': [],
                'certification_required': True
            },
            {
                'regulation': 'Environmental Compliance',
                'category': 'environmental',
                'status': 'at_risk',
                'last_audit': datetime(2023, 6, 15).date(),
                'next_audit': datetime(2024, 3, 15).date(),
                'requirements': ['Waste management plan', 'Emissions reporting', 'Sustainability metrics'],
                'gaps': ['Incomplete emissions reporting'],
                'certification_required': True
            },
        ]
        
        for data in compliance_data:
            RegulatoryComplianceSC.objects.create(**data)
        
        # Disruption Risks
        risk_data = [
            {
                'risk_type': 'supplier_failure',
                'description': 'Global Parts Ltd experiencing production delays due to equipment failure',
                'probability': 35,
                'impact': 80,
                'risk_score': 28,
                'affected_suppliers': ['Global Parts Ltd'],
                'affected_regions': ['Shanghai, China'],
                'mitigation_strategies': ['Activate backup supplier', 'Increase safety stock'],
                'contingency_plans': ['Emergency procurement from Dubai supplier']
            },
            {
                'risk_type': 'geopolitical',
                'description': 'Potential port workers strike could affect West Africa shipments',
                'probability': 25,
                'impact': 60,
                'risk_score': 15,
                'affected_suppliers': ['AfriTrade Partners'],
                'affected_regions': ['Lagos, Nigeria', 'West Africa'],
                'mitigation_strategies': ['Pre-position safety stock', 'Consider air freight'],
                'contingency_plans': ['Air freight for critical items', 'Temporary supplier switch']
            },
        ]
        
        for data in risk_data:
            DisruptionRisk.objects.create(**data)
        
        # Sustainability Metrics
        sustainability_data = [
            {
                'supplier': suppliers[0],
                'carbon_footprint': 1500,
                'energy_efficiency': 75,
                'waste_reduction': 45,
                'sustainability_score': 78,
                'certifications': ['ISO 14001', 'Green Building'],
                'green_initiatives': ['Solar panels', 'Recycling program'],
                'compliance_level': 'silver'
            },
            {
                'supplier': suppliers[1],
                'carbon_footprint': 800,
                'energy_efficiency': 85,
                'waste_reduction': 60,
                'sustainability_score': 82,
                'certifications': ['ISO 14001', 'Fair Trade'],
                'green_initiatives': ['Renewable energy', 'Local sourcing'],
                'compliance_level': 'gold'
            },
        ]
        
        for data in sustainability_data:
            SustainabilityMetrics.objects.create(**data)
        
        # Supplier Contracts
        contract_data = [
            {
                'supplier': suppliers[0],
                'contract_id': 'CONTRACT-001',
                'start_date': datetime(2023, 1, 1).date(),
                'end_date': datetime(2025, 12, 31).date(),
                'value': 500000,
                'terms': 'Annual supply agreement with quarterly price reviews',
                'status': 'active'
            },
            {
                'supplier': suppliers[1],
                'contract_id': 'CONTRACT-002',
                'start_date': datetime(2023, 6, 1).date(),
                'end_date': datetime(2024, 5, 31).date(),
                'value': 150000,
                'terms': 'One-year agreement with volume discounts',
                'status': 'active'
            },
        ]
        
        for data in contract_data:
            SupplierContract.objects.create(**data)
        
        # Warehouse Operations
        operation_data = [
            {
                'warehouse': locations[0],
                'layout': {'sections': 10, 'aisles': 25, 'slots_per_aisle': 100},
                'efficiency': {'picking_rate': 150, 'packing_rate': 80, 'shipping_rate': 200},
                'equipment': ['Forklifts', 'Conveyor belts', 'RFID scanners'],
                'staffing': {'full_time': 25, 'part_time': 10, 'shift_pattern': '2 shifts'}
            },
        ]
        
        for data in operation_data:
            WarehouseOperation.objects.create(**data)
        
        self.stdout.write(self.style.SUCCESS(f'Created Inventory & Supply Chain Data'))

