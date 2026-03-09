/**
 * Summary Generation Utilities
 * Contains all business logic for generating dynamic summaries, recommendations, and content
 */

import { 
  RevenueProjection, 
  CustomerProfile, 
  KPI, 
  ScenarioPlanning, 
  CostStructure,
  CashFlowForecast 
} from "@/lib/business-forecast-data";
import { 
  calculateTotalProjectedRevenue, 
  calculateTotalActualToDate,
  calculateAverageConfidence,
  calculateAchievement,
  calculatePotentialUpside 
} from "./revenue-calculation";
import { calculateKPISummary } from "./kpi-calculation";
import { 
  calculateTotalMarketOpportunity, 
  calculateWeightedAvgGrowth, 
  calculateOverallRetention 
} from "./customer-calculation";
import { calculateProfitProjection } from "./profitloss-calculation";
import { calculateTotalNetCashFlow } from "./cashflow-calculation";

export interface SummaryMetrics {
  index: number;
  title: string;
  value: string | number;
  insight: string;
}

export interface ActionItem {
  index: number;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  timeline: string;
}

export interface NextStep {
  index: number;
  step: string;
  owner: string;
  dueDate: string;
}

/**
 * Generate business forecast summary text
 * @param projections - Revenue projections
 * @param customerProfiles - Customer profiles
 * @param scenarios - Scenario plannings
 * @param kpis - KPIs
 * @param annualTarget - Annual revenue target
 * @returns Summary text
 */
export function generateBusinessSummary(
  projections: RevenueProjection[],
  customerProfiles: CustomerProfile[],
  scenarios: ScenarioPlanning[],
  kpis: KPI[],
  annualTarget?: number
): string {
  const totalProjected = calculateTotalProjectedRevenue(projections);
  const totalActual = calculateTotalActualToDate(projections);
  const avgConfidence = calculateAverageConfidence(projections);
  const achievement = annualTarget ? calculateAchievement(totalProjected, annualTarget) : 0;
  
  const segmentCount = customerProfiles.length;
  const scenarioCount = scenarios.length;
  const kpiCount = kpis.length;
  
  const targetFormatted = annualTarget 
    ? `$${(annualTarget / 1000000).toFixed(1)}M` 
    : `${(totalProjected / 1000000).toFixed(1)}M`;

  return `1. REVENUE OVERVIEW
Current annual revenue target is set at ${targetFormatted} with ${segmentCount} distinct customer segments identified. The forecast includes ${scenarioCount} scenario model(s) to cover conservative, base, and aggressive growth cases.

2. CUSTOMER BASE
The business operates across multiple customer segments with varying demand patterns. Average order values and segment preferences have been analyzed to inform revenue projections and marketing strategies.

3. KEY PERFORMANCE METRICS
${kpiCount} key performance indicator(s) are being tracked across operational, financial, and strategic dimensions. These KPIs provide early signals of business health and market opportunity.

4. FORECAST METHODOLOGY
The forecast employs Monte Carlo simulations, linear regression analysis, and scenario planning to account for uncertainty and provide a range of potential outcomes. Current confidence level: ${avgConfidence}%.

5. NEXT QUARTER OUTLOOK
Q1 2025 focuses on foundation building, with emphasis on customer retention and operational efficiency improvements. Expected growth rate aligns with market expansion strategy.`;
}

/**
 * Generate recommendations based on current data
 * @param projections - Revenue projections
 * @param customerProfiles - Customer profiles
 * @param kpis - KPIs
 * @param costStructure - Cost structure
 * @returns Recommendation text
 */
export function generateRecommendations(
  projections: RevenueProjection[],
  customerProfiles: CustomerProfile[],
  kpis: KPI[],
  costStructure: CostStructure[]
): string {
  const totalProjected = calculateTotalProjectedRevenue(projections);
  const kpiSummary = calculateKPISummary(kpis);
  const profitData = calculateProfitProjection(projections, costStructure);
  
  // Find highest growth segment
  let highestGrowthSegment = customerProfiles[0];
  customerProfiles.forEach((profile) => {
    if (profile.growthRate > (highestGrowthSegment?.growthRate || 0)) {
      highestGrowthSegment = profile;
    }
  });

  let recommendations = "";

  // Revenue optimization
  recommendations += `1. REVENUE OPTIMIZATION\n`;
  if (highestGrowthSegment) {
    recommendations += `Prioritize ${highestGrowthSegment.segment} customer segment that shows strongest growth potential (${highestGrowthSegment.growthRate}% growth rate). `;
  }
  recommendations += `Consider dynamic pricing strategies for products with high elasticity. Implement customer lifetime value modeling to focus acquisition and retention efforts on most valuable segments.\n\n`;

  // Scenario planning
  recommendations += `2. SCENARIO PLANNING\n`;
  if (profitData.netMargin < 15) {
    recommendations += `Develop contingency plans for downside scenarios (20% revenue below base case). Current net margin is ${profitData.netMargin}%, consider cost optimization. `;
  } else {
    recommendations += `Develop contingency plans for downside scenarios (20% revenue below base case). `;
  }
  recommendations += `Establish trigger points for strategy adjustments based on key leading indicators. Quarterly scenario reviews to adapt planning assumptions as market conditions evolve.\n\n`;

  // Operational efficiency
  recommendations += `3. OPERATIONAL EFFICIENCY\n`;
  if (profitData.operatingExpenseRatio > 35) {
    recommendations += `Target 10-15% improvement in cost structure through process optimization. Current operating expense ratio is ${profitData.operatingExpenseRatio}%, above optimal range. `;
  } else {
    recommendations += `Target 10-15% improvement in cost structure through process optimization. `;
  }
  recommendations += `Invest in automation for repetitive tasks. Negotiate supplier contracts aligned with growth trajectory.\n\n`;

  // Cash flow management
  recommendations += `4. CASH FLOW MANAGEMENT\n`;
  recommendations += `Establish working capital reserves equivalent to 60 days of operating expenses. Monitor cash conversion cycle monthly. Implement early warning system for cash flow stress signals.\n\n`;

  // Market expansion
  recommendations += `5. MARKET EXPANSION\n`;
  recommendations += `Identify 2-3 new market segments or geographies for expansion in next 12 months. Allocate 15-20% of resources to innovation and market testing. Build partnerships with complementary service providers.`;

  return recommendations;
}

/**
 * Generate summary metrics
 * @param projections - Revenue projections
 * @param customerProfiles - Customer profiles
 * @param scenarios - Scenario plannings
 * @param kpis - KPIs
 * @param annualTarget - Annual revenue target
 * @returns Array of metrics
 */
export function generateSummaryMetrics(
  projections: RevenueProjection[],
  customerProfiles: CustomerProfile[],
  scenarios: ScenarioPlanning[],
  kpis: KPI[],
  annualTarget?: number
): SummaryMetrics[] {
  const totalProjected = calculateTotalProjectedRevenue(projections);
  
  return [
    {
      index: 1,
      title: "Annual Revenue Target",
      value: annualTarget 
        ? `$${(annualTarget / 1000000).toFixed(1)}M` 
        : `$${(totalProjected / 1000000).toFixed(1)}M`,
      insight: "Primary revenue goal for fiscal year",
    },
    {
      index: 2,
      title: "Customer Segments",
      value: customerProfiles.length,
      insight: "Active market segments being served",
    },
    {
      index: 3,
      title: "KPIs Tracked",
      value: kpis.length,
      insight: "Performance metrics under active monitoring",
    },
    {
      index: 4,
      title: "Scenario Models",
      value: scenarios.length,
      insight: "Planning scenarios for different market conditions",
    },
  ];
}

/**
 * Generate action items based on data
 * @param projections - Revenue projections
 * @param kpis - KPIs
 * @param cashFlows - Cash flows
 * @returns Array of action items
 */
export function generateActionItems(
  projections: RevenueProjection[],
  kpis: KPI[],
  cashFlows: CashFlowForecast[]
): ActionItem[] {
  const kpiSummary = calculateKPISummary(kpis);
  const totalNetCashFlow = calculateTotalNetCashFlow(cashFlows);
  const items: ActionItem[] = [];

  // High priority items
  if (kpiSummary.needsAttention > 0 || kpiSummary.fair > 2) {
    items.push({
      index: items.length + 1,
      title: "Segment Revenue Analysis",
      description: `Conduct detailed profitability analysis for each customer segment to identify high-margin opportunities and optimize pricing strategy. ${kpiSummary.fair} KPIs need attention.`,
      priority: "high",
      timeline: "Q1 2025",
    });
  }

  if (totalNetCashFlow < 0 || cashFlows.some(cf => cf.netCashFlow < 0)) {
    items.push({
      index: items.length + 1,
      title: "Cash Flow Forecasting System",
      description: "Implement daily cash flow tracking and weekly rolling forecasts to improve liquidity management and decision-making",
      priority: "high",
      timeline: "Q1 2025",
    });
  }

  // Medium priority
  items.push({
    index: items.length + 1,
    title: "Cost Reduction Initiative",
    description: "Launch cross-functional program to identify and eliminate wasteful spending while maintaining service quality",
    priority: "medium",
    timeline: "Q2 2025",
  });

  items.push({
    index: items.length + 1,
    title: "KPI Dashboard Enhancement",
    description: "Expand KPI dashboard with real-time alerts for critical metrics and predictive analytics for early warning signals",
    priority: "medium",
    timeline: "Q2 2025",
  });

  // Low priority
  items.push({
    index: items.length + 1,
    title: "Market Expansion Strategy",
    description: "Research and develop entry strategy for adjacent market segments or geographies with strong growth potential",
    priority: "low",
    timeline: "Q2-Q3 2025",
  });

  return items;
}

/**
 * Generate next steps based on data
 * @param projections - Revenue projections
 * @param kpis - KPIs
 * @returns Array of next steps
 */
export function generateNextSteps(
  projections: RevenueProjection[],
  kpis: KPI[]
): NextStep[] {
  const kpiSummary = calculateKPISummary(kpis);
  const needsAttentionKpis = kpis.filter(kpi => {
    const progress = (kpi.current / kpi.target) * 100;
    return progress < 80;
  });

  const steps: NextStep[] = [
    {
      index: 1,
      step: "Review and validate all revenue assumptions in the forecast model",
      owner: "Finance Team",
      dueDate: "End of Week 1",
    },
    {
      index: 2,
      step: "Conduct sensitivity analysis on key input variables",
      owner: "Analytics Team",
      dueDate: "End of Week 2",
    },
    {
      index: 3,
      step: "Present scenarios to executive team with recommended strategy",
      owner: "CFO",
      dueDate: "End of Month",
    },
  ];

  if (needsAttentionKpis.length > 0) {
    steps.push({
      index: 4,
      step: `Review ${needsAttentionKpis.length} KPIs below target and develop improvement plans`,
      owner: "Department Heads",
      dueDate: "End of Week 2",
    });
  }

  steps.push({
    index: steps.length + 1,
    step: "Establish monthly forecast review cadence with updates",
    owner: "Planning Manager",
    dueDate: "Ongoing",
  });

  return steps;
}

/**
 * Generate demand summary
 * @param profiles - Customer profiles
 * @returns Demand summary object
 */
export function generateDemandSummary(profiles: CustomerProfile[]): {
  totalMarketOpportunity: string;
  weightedAvgGrowth: string;
  overallRetention: string;
} {
  const totalMarketOpportunity = calculateTotalMarketOpportunity(profiles);
  const weightedAvgGrowth = calculateWeightedAvgGrowth(profiles);
  const overallRetention = calculateOverallRetention(profiles);

  return {
    totalMarketOpportunity: `NGN ${totalMarketOpportunity.toLocaleString()}`,
    weightedAvgGrowth: `${weightedAvgGrowth > 0 ? "+" : ""}${weightedAvgGrowth}%`,
    overallRetention: `${overallRetention.toFixed(1)}%`,
  };
}

