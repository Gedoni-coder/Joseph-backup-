/**
 * Liquidity Metric Calculation Utilities
 * Contains all business logic for liquidity metric calculations
 */

import { LiquidityMetric } from "@/lib/financial-advisory-data";

/**
 * Get count by status
 */
export function getLiquidityByStatus(metrics: LiquidityMetric[]): Record<string, number> {
  return metrics.reduce((acc, m) => {
    acc[m.status] = (acc[m.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

/**
 * Get count by trend
 */
export function getLiquidityByTrend(metrics: LiquidityMetric[]): Record<string, number> {
  return metrics.reduce((acc, m) => {
    acc[m.trend] = (acc[m.trend] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

/**
 * Calculate average performance
 */
export function getAvgLiquidityPerformance(metrics: LiquidityMetric[]): number {
  if (metrics.length === 0) return 0;
  const healthy = metrics.filter(m => m.status === "healthy").length;
  return Math.round((healthy / metrics.length) * 100);
}

/**
 * Get liquidity summary
 */
export function getLiquiditySummary(metrics: LiquidityMetric[]) {
  return {
    total: metrics.length,
    healthy: metrics.filter(m => m.status === "healthy").length,
    warning: metrics.filter(m => m.status === "warning").length,
    critical: metrics.filter(m => m.status === "critical").length,
    byStatus: getLiquidityByStatus(metrics),
    byTrend: getLiquidityByTrend(metrics),
    avgPerformance: getAvgLiquidityPerformance(metrics),
  };
}
