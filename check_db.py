import django
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_django.settings')
django.setup()

from api.models import (
    CompanyProfile, EconomicMetric, EconomicNews, EconomicForecast, EconomicEvent,
    CustomerProfile, RevenueProjection, CostStructure, CashFlowForecast,
    KPI, ScenarioPlanning, MarketSegment, Competitor, MarketTrend,
    LoanEligibility, FundingOption, LoanComparison, BusinessPlan, FundingStrategy,
    InvestorMatch, RevenueStream, RevenueScenario, ChurnAnalysis, UpsellOpportunity,
    RevenueMetric, ChannelPerformance, BudgetForecast, CashFlowProjection,
    ScenarioTest, RiskAssessment, AdvisoryInsight, LiquidityMetric, PriceSetting,
    PricingRule, PriceForecast, TaxRecord, ComplianceReport, ExternalPolicy,
    InternalPolicy, StrategyRecommendation, InventoryItem, StockMovement,
    Supplier, ProcurementOrder, LogisticsMetric
)

print('=== DATABASE POPULATION VERIFICATION ===\n')

# Company
print(f'CompanyProfile: {CompanyProfile.objects.count()} records')

# Economic
print(f'EconomicMetric: {EconomicMetric.objects.count()} records')
print(f'EconomicNews: {EconomicNews.objects.count()} records')
print(f'EconomicForecast: {EconomicForecast.objects.count()} records')
print(f'EconomicEvent: {EconomicEvent.objects.count()} records')

# Business
print(f'CustomerProfile: {CustomerProfile.objects.count()} records')
print(f'RevenueProjection: {RevenueProjection.objects.count()} records')
print(f'CostStructure: {CostStructure.objects.count()} records')
print(f'CashFlowForecast: {CashFlowForecast.objects.count()} records')
print(f'KPI: {KPI.objects.count()} records')
print(f'ScenarioPlanning: {ScenarioPlanning.objects.count()} records')

# Market
print(f'MarketSegment: {MarketSegment.objects.count()} records')
print(f'Competitor: {Competitor.objects.count()} records')
print(f'MarketTrend: {MarketTrend.objects.count()} records')

# Loan
print(f'LoanEligibility: {LoanEligibility.objects.count()} records')
print(f'FundingOption: {FundingOption.objects.count()} records')
print(f'LoanComparison: {LoanComparison.objects.count()} records')
print(f'BusinessPlan: {BusinessPlan.objects.count()} records')
print(f'FundingStrategy: {FundingStrategy.objects.count()} records')
print(f'InvestorMatch: {InvestorMatch.objects.count()} records')

# Revenue
print(f'RevenueStream: {RevenueStream.objects.count()} records')
print(f'RevenueScenario: {RevenueScenario.objects.count()} records')
print(f'ChurnAnalysis: {ChurnAnalysis.objects.count()} records')
print(f'UpsellOpportunity: {UpsellOpportunity.objects.count()} records')
print(f'RevenueMetric: {RevenueMetric.objects.count()} records')
print(f'ChannelPerformance: {ChannelPerformance.objects.count()} records')

# Financial
print(f'BudgetForecast: {BudgetForecast.objects.count()} records')
print(f'CashFlowProjection: {CashFlowProjection.objects.count()} records')
print(f'ScenarioTest: {ScenarioTest.objects.count()} records')
print(f'RiskAssessment: {RiskAssessment.objects.count()} records')
print(f'AdvisoryInsight: {AdvisoryInsight.objects.count()} records')
print(f'LiquidityMetric: {LiquidityMetric.objects.count()} records')

# Pricing
print(f'PriceSetting: {PriceSetting.objects.count()} records')
print(f'PricingRule: {PricingRule.objects.count()} records')
print(f'PriceForecast: {PriceForecast.objects.count()} records')

# Tax
print(f'TaxRecord: {TaxRecord.objects.count()} records')
print(f'ComplianceReport: {ComplianceReport.objects.count()} records')

# Policy
print(f'ExternalPolicy: {ExternalPolicy.objects.count()} records')
print(f'InternalPolicy: {InternalPolicy.objects.count()} records')
print(f'StrategyRecommendation: {StrategyRecommendation.objects.count()} records')

# Inventory
print(f'InventoryItem: {InventoryItem.objects.count()} records')
print(f'StockMovement: {StockMovement.objects.count()} records')
print(f'Supplier: {Supplier.objects.count()} records')
print(f'ProcurementOrder: {ProcurementOrder.objects.count()} records')
print(f'LogisticsMetric: {LogisticsMetric.objects.count()} records')
