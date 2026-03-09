/**
 * Revenue Calculation Utilities
 * Contains all business logic for revenue projections calculations
 */

import { RevenueProjection } from "@/lib/business-forecast-data";

/**
 * Calculate progress percentage toward a revenue target
 * @param actualToDate - Actual revenue achieved to date
 * @param projected - Projected/target revenue
 * @returns Progress percentage (0-100)
 */
export function calculateProgress(actualToDate: number | undefined, projected: number): number {
  if (!actualToDate || actualToDate === 0 || !projected || projected === 0) {
    return 0;
  }
  const progress = (actualToDate / projected) * 100;
  return Math.min(Math.round(progress), 100);
}

/**
 * Calculate variance between actual and projected
 * @param actualToDate - Actual revenue achieved
 * @param projected - Projected/target revenue
 * @returns Variance percentage (positive = over target, negative = below target)
 */
export function calculateVariance(actualToDate: number | undefined, projected: number): number | null {
  if (!actualToDate || !projected) {
    return null;
  }
  return ((actualToDate - projected) / projected) * 100;
}

/**
 * Get variance color class based on variance value
 * @param variance - Variance percentage
 * @returns Color class string
 */
export function getVarianceColor(variance: number | null): string {
  if (variance === null) return "text-muted-foreground";
  if (variance > 5) return "text-economic-positive";
  if (variance < -5) return "text-economic-negative";
  return "text-economic-neutral";
}

/**
 * Determine confidence level based on confidence score
 * @param confidence - Confidence score (0-100)
 * @returns Confidence level string
 */
export function getConfidenceLevel(confidence: number): string {
  if (confidence >= 80) return "High";
  if (confidence >= 60) return "Medium";
  return "Low";
}

/**
 * Get confidence color based on confidence score
 * @param confidence - Confidence score (0-100)
 * @returns Color class string
 */
export function getConfidenceColor(confidence: number): string {
  if (confidence >= 80) return "text-economic-positive";
  if (confidence >= 60) return "text-economic-warning";
  return "text-economic-negative";
}

/**
 * Calculate scenario range position as percentage
 * @param projected - Projected revenue
 * @param conservative - Conservative (minimum) estimate
 * @param optimistic - Optimistic (maximum) estimate
 * @returns Position percentage (0-100)
 */
export function calculateScenarioRangePosition(
  projected: number,
  conservative: number,
  optimistic: number
): number {
  if (!projected || !conservative || !optimistic) return 50;
  const range = optimistic - conservative;
  if (range === 0) return 50;
  const position = ((projected - conservative) / range) * 100;
  return Math.min(Math.max(position, 0), 100);
}

/**
 * Calculate potential upside (difference between optimistic and projected)
 * @param projections - Array of revenue projections
 * @returns Total potential upside amount
 */
export function calculatePotentialUpside(projections: RevenueProjection[]): number {
  return projections.reduce((sum, p) => sum + (p.optimistic - p.projected), 0);
}

/**
 * Calculate total projected revenue from projections
 * @param projections - Array of revenue projections
 * @returns Total projected revenue
 */
export function calculateTotalProjectedRevenue(projections: RevenueProjection[]): number {
  return projections.reduce((sum, p) => sum + p.projected, 0);
}

/**
 * Calculate total actual revenue to date
 * @param projections - Array of revenue projections
 * @returns Total actual revenue to date
 */
export function calculateTotalActualToDate(projections: RevenueProjection[]): number {
  return projections.reduce((sum, p) => sum + (p.actualToDate || 0), 0);
}

/**
 * Calculate average confidence across all projections
 * @param projections - Array of revenue projections
 * @returns Average confidence percentage
 */
export function calculateAverageConfidence(projections: RevenueProjection[]): number {
  if (projections.length === 0) return 0;
  const total = projections.reduce((sum, p) => sum + p.confidence, 0);
  return Math.round(total / projections.length);
}

/**
 * Generate monthly projections from quarterly data
 * @param quarterlyProjections - Array of quarterly projections
 * @returns Array of monthly projections
 */
export function generateMonthlyProjections(
  quarterlyProjections: RevenueProjection[]
): RevenueProjection[] {
  const months = [
    "Jan 2025", "Feb 2025", "Mar 2025", "Apr 2025", "May 2025", "Jun 2025",
    "Jul 2025", "Aug 2025", "Sep 2025", "Oct 2025", "Nov 2025", "Dec 2025"
  ];

  const monthlyData: RevenueProjection[] = [];
  const quarterly = quarterlyProjections.slice(0, 4);

  for (let i = 0; i < 12; i++) {
    const quarterIndex = Math.floor(i / 3);
    const q = quarterly[quarterIndex];

    if (q) {
      const monthlyProjected = q.projected / 3;
      const monthlyConservative = q.conservative / 3;
      const monthlyOptimistic = q.optimistic / 3;
      const monthlyActual = q.actualToDate ? q.actualToDate / 3 : undefined;

      monthlyData.push({
        id: `month-${i + 1}`,
        period: months[i],
        projected: monthlyProjected,
        conservative: monthlyConservative,
        optimistic: monthlyOptimistic,
        actualToDate: monthlyActual,
        confidence: q.confidence,
      });
    }
  }

  return monthlyData;
}

/**
 * Generate yearly projection from quarterly data
 * @param quarterlyProjections - Array of quarterly projections
 * @returns Single yearly projection
 */
export function generateYearlyProjection(
  quarterlyProjections: RevenueProjection[]
): RevenueProjection {
  const totalProjected = quarterlyProjections.reduce((sum, p) => sum + p.projected, 0);
  const totalConservative = quarterlyProjections.reduce((sum, p) => sum + p.conservative, 0);
  const totalOptimistic = quarterlyProjections.reduce((sum, p) => sum + p.optimistic, 0);
  const totalActual = quarterlyProjections.reduce((sum, p) => sum + (p.actualToDate || 0), 0);
  
  const avgConfidence = quarterlyProjections.length > 0
    ? Math.round(quarterlyProjections.reduce((sum, p) => sum + p.confidence, 0) / quarterlyProjections.length)
    : 0;

  return {
    id: "yearly-2025",
    period: "Full Year 2025",
    projected: totalProjected,
    conservative: totalConservative,
    optimistic: totalOptimistic,
    actualToDate: totalActual,
    confidence: avgConfidence,
  };
}

/**
 * Calculate achievement percentage toward annual target
 * @param totalProjected - Total projected revenue
 * @param annualTarget - Annual revenue target
 * @returns Achievement percentage
 */
export function calculateAchievement(totalProjected: number, annualTarget: number): number {
  if (!annualTarget || annualTarget === 0) return 0;
  return Math.round((totalProjected / annualTarget) * 100);
}

/**
 * Get view type data (monthly/quarterly/yearly)
 * @param projections - Array of projections
 * @param viewType - Type of view
 * @returns Filtered/aggregated projections
 */
export function getViewData(
  projections: RevenueProjection[],
  viewType: "monthly" | "quarterly" | "yearly"
): RevenueProjection[] {
  switch (viewType) {
    case "monthly":
      return generateMonthlyProjections(projections);
    case "yearly":
      return [generateYearlyProjection(projections)];
    default:
      return projections;
  }
}

