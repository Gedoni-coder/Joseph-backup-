/**
 * Alert Generation Utilities
 * Contains all business logic for generating dynamic alerts and warnings
 */

import { RevenueProjection, CashFlowForecast, KPI, CostStructure } from "@/lib/business-forecast-data";
import { calculateVariance, calculateTotalActualToDate, calculateTotalProjectedRevenue } from "./revenue-calculation";
import { calculateKPIProgress } from "./kpi-calculation";
import { getCashFlowStatus } from "./cashflow-calculation";
import { calculateOperatingExpenseRatio } from "./profitloss-calculation";

export interface Alert {
  id: string;
  type: "warning" | "danger" | "info" | "success";
  title: string;
  description: string;
  category: "revenue" | "cashflow" | "cost" | "kpi";
  severity: "high" | "medium" | "low";
}

/**
 * Generate revenue-related alerts
 * @param projections - Revenue projections array
 * @param annualTarget - Annual revenue target
 * @returns Array of alerts
 */
export function generateRevenueAlerts(
  projections: RevenueProjection[],
  annualTarget?: number
): Alert[] {
  const alerts: Alert[] = [];
  
  // Check if projections are below target
  const totalProjected = calculateTotalProjectedRevenue(projections);
  const totalActual = calculateTotalActualToDate(projections);
  
  if (annualTarget && totalProjected < annualTarget * 0.9) {
    alerts.push({
      id: "revenue-below-target",
      type: "warning",
      title: "Revenue Below Target",
      description: `Current projection ($${(totalProjected / 1000000).toFixed(1)}M) is ${((1 - totalProjected / annualTarget) * 100).toFixed(0)}% below annual target. Review customer segment assumptions.`,
      category: "revenue",
      severity: "high",
    });
  }
  
  // Check individual projections for variance
  projections.forEach((projection) => {
    if (projection.actualToDate) {
      const variance = calculateVariance(projection.actualToDate, projection.projected);
      
      if (variance !== null && variance < -10) {
        alerts.push({
          id: `revenue-variance-${projection.id}`,
          type: "danger",
          title: `${projection.period} Revenue Variance`,
          description: `Actual revenue is ${Math.abs(variance).toFixed(1)}% below projection. Immediate attention needed.`,
          category: "revenue",
          severity: "high",
        });
      } else if (variance !== null && variance < -5) {
        alerts.push({
          id: `revenue-warning-${projection.id}`,
          type: "warning",
          title: `${projection.period} Revenue Warning`,
          description: `Actual revenue is ${Math.abs(variance).toFixed(1)}% below projection. Monitor closely.`,
          category: "revenue",
          severity: "medium",
        });
      }
    }
  });
  
  // Check confidence levels
  const lowConfidenceProjections = projections.filter((p) => p.confidence < 60);
  if (lowConfidenceProjections.length > 0) {
    alerts.push({
      id: "low-confidence",
      type: "info",
      title: "Low Confidence in Projections",
      description: `${lowConfidenceProjections.length} projection(s) have confidence below 60%. Review assumptions.`,
      category: "revenue",
      severity: "low",
    });
  }
  
  return alerts;
}

/**
 * Generate cash flow alerts
 * @param cashFlows - Cash flow forecasts
 * @returns Array of alerts
 */
export function generateCashFlowAlerts(cashFlows: CashFlowForecast[]): Alert[] {
  const alerts: Alert[] = [];
  
  // Check for negative cash flow periods
  const negativePeriods = cashFlows.filter((cf) => cf.netCashFlow < 0);
  if (negativePeriods.length > 0) {
    alerts.push({
      id: "negative-cashflow",
      type: "danger",
      title: "Negative Cash Flow Detected",
      description: `${negativePeriods.length} period(s) have negative net cash flow. Review cash management.`,
      category: "cashflow",
      severity: "high",
    });
  }
  
  // Check for declining trend
  if (cashFlows.length >= 3) {
    const recentFlows = cashFlows.slice(-3);
    const allNegative = recentFlows.every((cf) => cf.netCashFlow < 0);
    
    if (allNegative) {
      alerts.push({
        id: "declining-cashflow",
        type: "warning",
        title: "Cash Flow Declining",
        description: "Recent periods show consistent negative cash flow. Consider adjusting payment terms.",
        category: "cashflow",
        severity: "high",
      });
    }
  }
  
  // Check for high variability
  if (cashFlows.length >= 2) {
    const avgFlow = cashFlows.reduce((sum, cf) => sum + cf.netCashFlow, 0) / cashFlows.length;
    const variance = cashFlows.reduce((sum, cf) => sum + Math.pow(cf.netCashFlow - avgFlow, 2), 0) / cashFlows.length;
    const stdDev = Math.sqrt(variance);
    
    if (Math.abs(stdDev) > Math.abs(avgFlow) * 0.5 && Math.abs(avgFlow) > 0) {
      alerts.push({
        id: "cashflow-variability",
        type: "warning",
        title: "Cash Flow Variability",
        description: "Q2 and Q3 show significant fluctuations. Consider adjusting payment terms.",
        category: "cashflow",
        severity: "medium",
      });
    }
  }
  
  return alerts;
}

/**
 * Generate cost-related alerts
 * @param costStructure - Cost structure array
 * @param revenue - Total revenue
 * @returns Array of alerts
 */
export function generateCostAlerts(
  costStructure: CostStructure[],
  revenue: number
): Alert[] {
  const alerts: Alert[] = [];
  
  // Calculate operating expense ratio
  const operatingExpenses = costStructure
    .filter((c) => c.type === "Operating")
    .reduce((sum, c) => sum + c.amount, 0);
  
  const expenseRatio = calculateOperatingExpenseRatio(operatingExpenses * 12, revenue);
  
  if (expenseRatio > 40) {
    alerts.push({
      id: "high-opex",
      type: "warning",
      title: "High Operating Expenses",
      description: `Operating expenses are ${expenseRatio}% of revenue. Target 25-35% for healthy margins.`,
      category: "cost",
      severity: "high",
    });
  }
  
  // Check for increasing cost trends
  const increasingCosts = costStructure.filter((c) => c.trend === "up");
  if (increasingCosts.length > 0) {
    alerts.push({
      id: "cost-increase-trend",
      type: "warning",
      title: "Cost Increase Trend",
      description: `${increasingCosts.length} cost item(s) showing upward trend. Monitor cost structure closely.`,
      category: "cost",
      severity: "medium",
    });
  }
  
  return alerts;
}

/**
 * Generate KPI alerts
 * @param kpis - KPI array
 * @returns Array of alerts
 */
export function generateKPIAlerts(kpis: KPI[]): Alert[] {
  const alerts: Alert[] = [];
  
  // Find KPIs below target
  const belowTarget = kpis.filter((kpi) => {
    const progress = calculateKPIProgress(kpi.current, kpi.target);
    return progress < 80;
  });
  
  if (belowTarget.length > 0) {
    alerts.push({
      id: "kpis-below-target",
      type: "warning",
      title: "KPIs Below Target",
      description: `${belowTarget.length} KPI(s) are below 80% of target. Review performance metrics.`,
      category: "kpi",
      severity: "medium",
    });
  }
  
  // Find critical KPIs (below 60%)
  const critical = kpis.filter((kpi) => {
    const progress = calculateKPIProgress(kpi.current, kpi.target);
    return progress < 60;
  });
  
  if (critical.length > 0) {
    alerts.push({
      id: "critical-kpis",
      type: "danger",
      title: "Critical KPI Performance",
      description: `${critical.length} KPI(s) require immediate attention (below 60% of target).`,
      category: "kpi",
      severity: "high",
    });
  }
  
  return alerts;
}

/**
 * Generate all alerts combined
 * @param projections - Revenue projections
 * @param cashFlows - Cash flow forecasts
 * @param costStructure - Cost structure
 * @param kpis - KPIs
 * @param annualTarget - Annual revenue target
 * @returns Array of all alerts
 */
export function generateAllAlerts(
  projections: RevenueProjection[],
  cashFlows: CashFlowForecast[],
  costStructure: CostStructure[],
  kpis: KPI[],
  annualTarget?: number
): Alert[] {
  const totalRevenue = calculateTotalProjectedRevenue(projections);
  
  const revenueAlerts = generateRevenueAlerts(projections, annualTarget);
  const cashFlowAlerts = generateCashFlowAlerts(cashFlows);
  const costAlerts = generateCostAlerts(costStructure, totalRevenue);
  const kpiAlerts = generateKPIAlerts(kpis);
  
  // Combine and sort by severity
  const allAlerts = [
    ...revenueAlerts,
    ...cashFlowAlerts,
    ...costAlerts,
    ...kpiAlerts,
  ].sort((a, b) => {
    const severityOrder = { high: 0, medium: 1, low: 2 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });
  
  return allAlerts;
}

/**
 * Get alert icon based on type
 * @param type - Alert type
 * @returns Icon name
 */
export function getAlertIcon(type: Alert["type"]): string {
  switch (type) {
    case "danger":
      return "AlertCircle";
    case "warning":
      return "AlertTriangle";
    case "success":
      return "CheckCircle";
    case "info":
    default:
      return "Info";
  }
}

