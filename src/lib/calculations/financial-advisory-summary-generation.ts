/**
 * Financial Advisory Summary Generation
 * Dynamic content generation for financial advisory module
 */

import { 
  BudgetForecast, 
  CashFlowProjection, 
  RiskAssessment, 
  PerformanceDriver,
  AdvisoryInsight,
  LiquidityMetric 
} from "@/lib/financial-advisory-data";
import { getBudgetForecastSummary } from "./budget-forecast-calculation";
import { getRiskSummary } from "./risk-assessment-calculation";
import { getPerformanceDriverSummary } from "./performance-driver-calculation";
import { getLiquiditySummary } from "./liquidity-metric-calculation";
import { getAdvisoryInsightSummary } from "./advisory-insight-calculation";

/**
 * Get summary content
 */
export function getFinancialAdvisorySummaryContent(
  budgetForecasts: BudgetForecast[],
  riskAssessments: RiskAssessment[],
  performanceDrivers: PerformanceDriver[]
): string {
  const budgetSummary = getBudgetForecastSummary(budgetForecasts);
  const riskSummary = getRiskSummary(riskAssessments);
  const driverSummary = getPerformanceDriverSummary(performanceDrivers);
  
  return `1. BUDGET OVERVIEW
Total budgeted revenue: $${(budgetSummary.totalRevenue / 1000000).toFixed(1)}M across ${budgetSummary.forecastCount} forecast periods. Average confidence level: ${budgetSummary.avgConfidence}%.

2. FINANCIAL HEALTH
${riskSummary.critical > 0 ? `${riskSummary.critical} critical risks identified requiring immediate attention.` : 'No critical risks identified.'} Total of ${riskSummary.total} risks being monitored across ${Object.keys(riskSummary.byCategory).length} categories.

3. PERFORMANCE DRIVERS
Tracking ${driverSummary.total} performance drivers. ${driverSummary.onTrack} are on track, ${driverSummary.atRisk} at risk, and ${driverSummary.critical} in critical status.

4. LIQUIDITY POSITION
Current liquidity metrics show ${driverSummary.exceeding} drivers exceeding targets. Continue monitoring cash flow patterns for optimal working capital management.

5. OUTLOOK
Q1 2025 focuses on maintaining budget discipline while identifying opportunities for operational efficiency improvements.`;
}

/**
 * Get recommendation content
 */
export function getFinancialAdvisoryRecommendationContent(
  insights: AdvisoryInsight[],
  risks: RiskAssessment[]
): string {
  const insightSummary = getAdvisoryInsightSummary(insights);
  const highPriorityRisks = risks.filter(r => r.riskScore >= 40);
  
  return `1. RISK MITIGATION
Address ${highPriorityRisks.length} high-priority risks immediately. Focus on liquidity and market risks that could impact Q1 operations.

2. WORKING CAPITAL OPTIMIZATION
Target 10-15% improvement in cash conversion cycle. Implement automated invoicing and early payment discount programs.

3. PERFORMANCE OPTIMIZATION
Review ${insightSummary.highPriority} high-priority insights. Focus on recommendations with highest financial impact.

4. COST MANAGEMENT
Maintain cost discipline while investing in growth initiatives. Target 5% reduction in operating expense ratio.

5. SCENARIO PLANNING
Develop contingency plans for downside scenarios. Establish trigger points for strategy adjustments based on key leading indicators.`;
}

/**
 * Get summary metrics
 */
export function getFinancialAdvisorySummaryMetrics(
  budgetForecasts: BudgetForecast[],
  risks: RiskAssessment[],
  drivers: PerformanceDriver[],
  insights: AdvisoryInsight[]
) {
  const budgetSummary = getBudgetForecastSummary(budgetForecasts);
  const riskSummary = getRiskSummary(risks);
  const driverSummary = getPerformanceDriverSummary(drivers);
  const insightSummary = getAdvisoryInsightSummary(insights);
  
  return [
    { index: 1, title: "Total Budget Revenue", value: `$${(budgetSummary.totalRevenue / 1000000).toFixed(1)}M`, insight: "Combined forecast revenue" },
    { index: 2, title: "Net Income Target", value: `$${(budgetSummary.totalNetIncome / 1000000).toFixed(1)}M`, insight: "Projected bottom line" },
    { index: 3, title: "Active Risks", value: riskSummary.total, insight: `${riskSummary.critical} critical, ${riskSummary.high} high` },
    { index: 4, title: "Performance Drivers", value: driverSummary.total, insight: `${driverSummary.onTrack} on track` },
    { index: 5, title: "Advisory Insights", value: insightSummary.total, insight: `${insightSummary.highPriority} high priority` },
    { index: 6, title: "Est. Financial Impact", value: `$${(insightSummary.totalFinancialImpact / 1000).toFixed(0)}K`, insight: "Potential value from insights" },
  ];
}
