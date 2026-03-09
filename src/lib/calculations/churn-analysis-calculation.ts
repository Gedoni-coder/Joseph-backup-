/**
 * Churn Analysis Calculation Utilities
 * Contains all business logic for churn analysis
 */

import { ChurnAnalysis } from "@/lib/revenue-data";

/**
 * Calculate overall churn rate weighted by customer count
 * @param segments - Array of churn analysis segments
 * @returns Overall churn rate
 */
export function calculateOverallChurnRate(segments: ChurnAnalysis[]): number {
  if (segments.length === 0) return 0;
  
  const totalCustomers = segments.reduce((sum, s) => sum + s.customers, 0);
  if (totalCustomers === 0) return 0;
  
  const weightedSum = segments.reduce((sum, s) => {
    const weight = s.customers / totalCustomers;
    return sum + (s.churnRate * weight);
  }, 0);
  
  return Math.round(weightedSum * 10) / 10;
}

/**
 * Calculate total revenue at risk from churn
 * @param segments - Array of churn analysis segments
 * @returns Total revenue at risk
 */
export function calculateTotalRevenueAtRisk(segments: ChurnAnalysis[]): number {
  return segments.reduce((sum, s) => sum + s.revenueAtRisk, 0);
}

/**
 * Calculate average customer lifetime
 * @param segments - Array of churn analysis segments
 * @returns Weighted average lifetime in months
 */
export function calculateAvgCustomerLifetime(segments: ChurnAnalysis[]): number {
  if (segments.length === 0) return 0;
  
  const totalCustomers = segments.reduce((sum, s) => sum + s.customers, 0);
  if (totalCustomers === 0) return 0;
  
  const weightedSum = segments.reduce((sum, s) => {
    const weight = s.customers / totalCustomers;
    return sum + (s.averageLifetime * weight);
  }, 0);
  
  return Math.round(weightedSum * 10) / 10;
}

/**
 * Calculate average retention cost per customer
 * @param segments - Array of churn analysis segments
 * @returns Weighted average retention cost
 */
export function calculateAvgRetentionCost(segments: ChurnAnalysis[]): number {
  if (segments.length === 0) return 0;
  
  const totalCustomers = segments.reduce((sum, s) => sum + s.customers, 0);
  if (totalCustomers === 0) return 0;
  
  const weightedSum = segments.reduce((sum, s) => {
    const weight = s.customers / totalCustomers;
    return sum + (s.retentionCost * weight);
  }, 0);
  
  return Math.round(weightedSum);
}

/**
 * Get segment with highest churn rate
 * @param segments - Array of churn analysis segments
 * @returns Segment with highest churn
 */
export function getHighestChurnSegment(segments: ChurnAnalysis[]): ChurnAnalysis | null {
  if (segments.length === 0) return null;
  return segments.reduce((highest, s) => 
    s.churnRate > (highest?.churnRate || 0) ? s : highest, segments[0]
  );
}

/**
 * Get segment with highest revenue at risk
 * @param segments - Array of churn analysis segments
 * @returns Segment with highest revenue at risk
 */
export function getHighestRiskSegment(segments: ChurnAnalysis[]): ChurnAnalysis | null {
  if (segments.length === 0) return null;
  return segments.reduce((highest, s) => 
    s.revenueAtRisk > (highest?.revenueAtRisk || 0) ? s : highest, segments[0]
  );
}

/**
 * Calculate churn impact score (combination of churn rate and revenue at risk)
 * @param segments - Array of churn analysis segments
 * @returns Churn impact score (0-100)
 */
export function calculateChurnImpactScore(segments: ChurnAnalysis[]): number {
  if (segments.length === 0) return 0;
  
  const avgChurnRate = calculateOverallChurnRate(segments);
  const totalRevenueAtRisk = calculateTotalRevenueAtRisk(segments);
  
  // Churn rate factor (0-50 points)
  const churnFactor = Math.min(avgChurnRate * 5, 50);
  
  // Revenue at risk factor (0-50 points, normalized to $1M)
  const riskFactor = Math.min((totalRevenueAtRisk / 1000000) * 50, 50);
  
  return Math.round(churnFactor + riskFactor);
}

/**
 * Get churn summary
 * @param segments - Array of churn analysis segments
 * @returns Summary object
 */
export function getChurnSummary(segments: ChurnAnalysis[]): {
  overallChurnRate: number;
  totalRevenueAtRisk: number;
  avgLifetime: number;
  avgRetentionCost: number;
  impactScore: number;
  segmentCount: number;
  highestChurnSegment: string;
} {
  const highestChurn = getHighestChurnSegment(segments);
  
  return {
    overallChurnRate: calculateOverallChurnRate(segments),
    totalRevenueAtRisk: calculateTotalRevenueAtRisk(segments),
    avgLifetime: calculateAvgCustomerLifetime(segments),
    avgRetentionCost: calculateAvgRetentionCost(segments),
    impactScore: calculateChurnImpactScore(segments),
    segmentCount: segments.length,
    highestChurnSegment: highestChurn?.segment || "N/A",
  };
}

/**
 * Format churn rate for display
 * @param rate - Churn rate percentage
 * @returns Formatted string
 */
export function formatChurnRate(rate: number): string {
  return `${rate.toFixed(1)}%`;
}

/**
 * Format revenue at risk for display
 * @param amount - Revenue amount
 * @returns Formatted string
 */
export function formatRevenueAtRisk(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`;
  }
  return `$${amount}`;
}

