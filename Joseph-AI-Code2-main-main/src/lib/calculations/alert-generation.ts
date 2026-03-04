/**
 * Alert Generation Module
 * 
 * Automatically generates business alerts based on:
 * - Revenue performance vs targets
 * - Cash flow health
 * - Cost trends
 * - KPI thresholds
 * - Customer metrics
 */

export interface Alert {
  id: string;
  title: string;
  description: string;
  severity: "critical" | "warning" | "info";
  category: string;
  value?: number;
  threshold?: number;
  actionItems?: string[];
}

/**
 * Check if revenue is below target threshold
 * 
 * Alert when: Actual < (Projected * 0.95)
 * 
 * @param actualToDate - Actual revenue to date
 * @param projected - Projected revenue for period
 * @returns Alert if triggered
 */
export function checkRevenueShortfall(
  actualToDate: number,
  projected: number
): Alert | null {
  const threshold = projected * 0.95; // 5% tolerance
  
  if (actualToDate < threshold) {
    const shortfall = threshold - actualToDate;
    const shortfallPercent = (shortfall / projected) * 100;
    
    return {
      id: "revenue-shortfall",
      title: "Revenue Below Target",
      description: `Current projection is ${shortfallPercent.toFixed(1)}% below expected. Review customer segment assumptions and sales pipeline.`,
      severity: actualToDate < projected * 0.85 ? "critical" : "warning",
      category: "Revenue",
      value: actualToDate,
      threshold,
      actionItems: [
        "Review actual vs projected assumptions",
        "Check top customer pipeline status",
        "Analyze seasonal impact vs forecast",
        "Consider acceleration initiatives",
      ],
    };
  }
  
  return null;
}

/**
 * Check for cash flow variability
 * 
 * Alert when: Month-to-month variance > threshold
 * 
 * @param cashFlows - Array of monthly cash flows
 * @param varianceThreshold - Percentage threshold (default 20%)
 * @returns Alert if triggered
 */
export function checkCashFlowVariability(
  cashFlows: number[],
  varianceThreshold: number = 20
): Alert | null {
  if (cashFlows.length < 2) return null;
  
  // Calculate standard deviation
  const mean = cashFlows.reduce((a, b) => a + b, 0) / cashFlows.length;
  const squareDiffs = cashFlows.map((value) => Math.pow(value - mean, 2));
  const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / cashFlows.length;
  const stdDev = Math.sqrt(avgSquareDiff);
  const coefficientOfVariation = (stdDev / Math.abs(mean)) * 100;
  
  if (coefficientOfVariation > varianceThreshold) {
    // Find high-variability periods
    const highVariancePeriods = cashFlows
      .map((cf, i) => ({
        period: `M${i + 1}`,
        value: cf,
        deviation: Math.abs(cf - mean),
      }))
      .filter((item) => item.deviation > stdDev)
      .map((item) => item.period)
      .join(", ");
    
    return {
      id: "cash-flow-variability",
      title: "Cash Flow Variability",
      description: `Monthly cash flow shows ${coefficientOfVariation.toFixed(1)}% variability (${highVariancePeriods}). Consider adjusting payment terms and working capital management.`,
      severity: coefficientOfVariation > 40 ? "critical" : "warning",
      category: "Cash Flow",
      value: coefficientOfVariation,
      threshold: varianceThreshold,
      actionItems: [
        "Review customer payment terms",
        "Analyze seasonal cash flow patterns",
        "Negotiate supplier terms for cash flow stability",
        "Establish cash reserve policy",
      ],
    };
  }
  
  return null;
}

/**
 * Check for cost increase trends
 * 
 * Alert when: Costs trending upward > threshold
 * 
 * @param costs - Array of monthly costs
 * @param targetCostPercentage - Target costs as % of revenue
 * @returns Alert if triggered
 */
export function checkCostIncreaseTrend(
  costs: number[],
  targetCostPercentage: number = 75
): Alert | null {
  if (costs.length < 3) return null;
  
  // Calculate trend using linear regression
  const n = costs.length;
  const indices = Array.from({ length: n }, (_, i) => i);
  const sumX = indices.reduce((a, b) => a + b, 0);
  const sumY = costs.reduce((a, b) => a + b, 0);
  const sumXY = indices.reduce((sum, x, i) => sum + x * costs[i], 0);
  const sumX2 = indices.reduce((sum, x) => sum + x * x, 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const isIncreasing = slope > 0;
  const increaseFactor = slope / (sumY / n);
  
  if (isIncreasing && increaseFactor > 0.02) {
    // Costs increasing by > 2% of average
    const percentIncrease = increaseFactor * 100;
    
    return {
      id: "cost-increase-trend",
      title: "Cost Increase Trend",
      description: `Operating expenses trending upward (${percentIncrease.toFixed(1)}% monthly increase). Monitor cost structure closely and evaluate efficiency improvements.`,
      severity: percentIncrease > 5 ? "critical" : "warning",
      category: "Costs",
      value: percentIncrease,
      actionItems: [
        "Conduct cost structure review",
        "Identify cost drivers and variances",
        "Evaluate process optimization opportunities",
        "Renegotiate vendor contracts",
      ],
    };
  }
  
  return null;
}

/**
 * Check for low KPI performance
 * 
 * Alert when: Multiple KPIs below "Good" status
 * 
 * @param kpiStatuses - Map of KPI ID to status
 * @returns Alert if triggered
 */
export function checkLowKPIPerformance(
  kpiStatuses: Record<string, "Excellent" | "Good" | "Fair" | "Needs Attention">
): Alert | null {
  const lowPerformers = Object.entries(kpiStatuses).filter(
    ([, status]) => status === "Fair" || status === "Needs Attention"
  );
  
  const criticalPerformers = Object.entries(kpiStatuses).filter(
    ([, status]) => status === "Needs Attention"
  );
  
  if (criticalPerformers.length >= 2 || lowPerformers.length >= 5) {
    return {
      id: "low-kpi-performance",
      title: "Multiple KPIs Below Target",
      description: `${criticalPerformers.length} critical and ${lowPerformers.length} warning level KPIs. Recommend immediate review of performance drivers.`,
      severity: criticalPerformers.length >= 3 ? "critical" : "warning",
      category: "Performance",
      actionItems: [
        "Review KPI performance breakdown by category",
        "Identify common performance drivers",
        "Prioritize highest-impact improvement areas",
        "Develop action plans for critical KPIs",
      ],
    };
  }
  
  return null;
}

/**
 * Check for customer retention issues
 * 
 * Alert when: Churn rate above threshold
 * 
 * @param churnRate - Customer churn rate (0-100)
 * @param targetChurnRate - Target churn rate
 * @returns Alert if triggered
 */
export function checkCustomerRetention(
  churnRate: number,
  targetChurnRate: number = 2.0
): Alert | null {
  if (churnRate > targetChurnRate) {
    const excessChurn = churnRate - targetChurnRate;
    
    return {
      id: "customer-retention",
      title: "Elevated Customer Churn",
      description: `Churn rate at ${churnRate.toFixed(2)}% (target: ${targetChurnRate}%). Investigate key account health and satisfaction metrics.`,
      severity: churnRate > targetChurnRate * 2 ? "critical" : "warning",
      category: "Customer",
      value: churnRate,
      threshold: targetChurnRate,
      actionItems: [
        "Conduct customer satisfaction survey",
        "Review churn reasons and patterns",
        "Contact at-risk key accounts",
        "Develop retention programs for high-value segments",
      ],
    };
  }
  
  return null;
}

/**
 * Check for runway risk (cash depletion)
 * 
 * Alert when: Runway below 6 months
 * 
 * @param runwayMonths - Months of cash remaining
 * @returns Alert if triggered
 */
export function checkCashRunway(runwayMonths: number): Alert | null {
  if (runwayMonths < 12) {
    return {
      id: "cash-runway",
      title: runwayMonths < 6 ? "Critical: Low Cash Runway" : "Cash Runway Below Target",
      description:
        runwayMonths < 6
          ? `Cash runway only ${runwayMonths.toFixed(1)} months remaining. Immediate action required to improve cash position or reduce burn rate.`
          : `Cash runway at ${runwayMonths.toFixed(1)} months (target: 12+ months). Develop plan to extend runway.`,
      severity: runwayMonths < 6 ? "critical" : "warning",
      category: "Cash Flow",
      value: runwayMonths,
      threshold: 12,
      actionItems:
        runwayMonths < 6
          ? [
              "Accelerate revenue realization",
              "Implement immediate cost reduction",
              "Explore financing options",
              "Develop 90-day cash improvement plan",
            ]
          : [
              "Project cash needs for growth initiatives",
              "Develop path to profitability",
              "Plan capital requirements",
              "Monitor burn rate monthly",
            ],
    };
  }
  
  return null;
}

/**
 * Check for sales pipeline concern
 * 
 * Alert when: Pipeline too thin relative to target
 * 
 * @param pipelineValue - Current sales pipeline value
 * @param quarterlyTarget - Quarterly revenue target
 * @param minimumMultiple - Minimum pipeline coverage (typical: 3-4x)
 * @returns Alert if triggered
 */
export function checkSalesPipeline(
  pipelineValue: number,
  quarterlyTarget: number,
  minimumMultiple: number = 3
): Alert | null {
  const coverage = pipelineValue / quarterlyTarget;
  
  if (coverage < minimumMultiple) {
    return {
      id: "sales-pipeline",
      title: "Insufficient Sales Pipeline",
      description: `Pipeline coverage at ${coverage.toFixed(1)}x (target: ${minimumMultiple}x). Recommend expanding prospecting efforts to build future revenue.`,
      severity: coverage < 1.5 ? "critical" : "warning",
      category: "Sales",
      value: coverage,
      threshold: minimumMultiple,
      actionItems: [
        "Increase prospecting activities",
        "Review pipeline aging and velocity",
        "Assess sales qualification criteria",
        "Evaluate lead generation channels",
      ],
    };
  }
  
  return null;
}

/**
 * Check for margin compression
 * 
 * Alert when: Margin below target
 * 
 * @param currentMargin - Current profit margin
 * @param targetMargin - Target profit margin
 * @returns Alert if triggered
 */
export function checkMarginCompression(
  currentMargin: number,
  targetMargin: number
): Alert | null {
  const marginGap = targetMargin - currentMargin;
  
  if (marginGap > 1) {
    // More than 1% below target
    return {
      id: "margin-compression",
      title: "Profit Margin Below Target",
      description: `Net profit margin at ${currentMargin.toFixed(1)}% vs target ${targetMargin.toFixed(1)}%. Analyze pricing, costs, and product mix optimization.`,
      severity: marginGap > 3 ? "critical" : "warning",
      category: "Profitability",
      value: currentMargin,
      threshold: targetMargin,
      actionItems: [
        "Conduct margin analysis by product/segment",
        "Review pricing strategy",
        "Analyze cost structure and efficiency",
        "Evaluate product mix optimization",
      ],
    };
  }
  
  return null;
}

/**
 * Check for growth rate deceleration
 * 
 * Alert when: Growth trending downward
 * 
 * @param growthRates - Array of period growth rates
 * @returns Alert if triggered
 */
export function checkGrowthDeceleration(growthRates: number[]): Alert | null {
  if (growthRates.length < 3) return null;
  
  // Check if recent growth < previous growth
  const previousGrowth = growthRates[growthRates.length - 2];
  const currentGrowth = growthRates[growthRates.length - 1];
  const deceleration = previousGrowth - currentGrowth;
  
  if (deceleration > 2) {
    // Growth declined by more than 2%
    return {
      id: "growth-deceleration",
      title: "Growth Rate Declining",
      description: `Growth rate decelerated from ${previousGrowth.toFixed(1)}% to ${currentGrowth.toFixed(1)}%. Evaluate market conditions and competitive positioning.`,
      severity: deceleration > 5 ? "warning" : "info",
      category: "Growth",
      value: currentGrowth,
      actionItems: [
        "Analyze market demand trends",
        "Review competitive landscape",
        "Assess customer acquisition efficiency",
        "Evaluate new market opportunities",
      ],
    };
  }
  
  return null;
}

/**
 * Generate all alerts for business forecast
 * 
 * @param metrics - Object containing all business metrics
 * @returns Array of generated alerts
 */
export function generateAllAlerts(metrics: {
  actualToDate?: number;
  projected?: number;
  monthlyRevenue?: number[];
  monthlyCosts?: number[];
  churnRate?: number;
  runwayMonths?: number;
  pipelineValue?: number;
  quarterlyTarget?: number;
  currentMargin?: number;
  targetMargin?: number;
  growthRates?: number[];
  kpiStatuses?: Record<string, "Excellent" | "Good" | "Fair" | "Needs Attention">;
}): Alert[] {
  const alerts: Alert[] = [];
  
  // Revenue checks
  if (metrics.actualToDate !== undefined && metrics.projected !== undefined) {
    const revenueAlert = checkRevenueShortfall(metrics.actualToDate, metrics.projected);
    if (revenueAlert) alerts.push(revenueAlert);
  }
  
  // Cash flow checks
  if (metrics.monthlyRevenue) {
    const cashFlowAlert = checkCashFlowVariability(metrics.monthlyRevenue);
    if (cashFlowAlert) alerts.push(cashFlowAlert);
  }
  
  if (metrics.monthlyCosts) {
    const costAlert = checkCostIncreaseTrend(metrics.monthlyCosts);
    if (costAlert) alerts.push(costAlert);
  }
  
  // Customer checks
  if (metrics.churnRate !== undefined) {
    const retentionAlert = checkCustomerRetention(metrics.churnRate);
    if (retentionAlert) alerts.push(retentionAlert);
  }
  
  // Runway checks
  if (metrics.runwayMonths !== undefined) {
    const runwayAlert = checkCashRunway(metrics.runwayMonths);
    if (runwayAlert) alerts.push(runwayAlert);
  }
  
  // Pipeline checks
  if (metrics.pipelineValue !== undefined && metrics.quarterlyTarget !== undefined) {
    const pipelineAlert = checkSalesPipeline(metrics.pipelineValue, metrics.quarterlyTarget);
    if (pipelineAlert) alerts.push(pipelineAlert);
  }
  
  // Margin checks
  if (metrics.currentMargin !== undefined && metrics.targetMargin !== undefined) {
    const marginAlert = checkMarginCompression(metrics.currentMargin, metrics.targetMargin);
    if (marginAlert) alerts.push(marginAlert);
  }
  
  // Growth checks
  if (metrics.growthRates) {
    const growthAlert = checkGrowthDeceleration(metrics.growthRates);
    if (growthAlert) alerts.push(growthAlert);
  }
  
  // KPI checks
  if (metrics.kpiStatuses) {
    const kpiAlert = checkLowKPIPerformance(metrics.kpiStatuses);
    if (kpiAlert) alerts.push(kpiAlert);
  }
  
  // Sort by severity
  const severityOrder = { critical: 0, warning: 1, info: 2 };
  alerts.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
  
  return alerts;
}
