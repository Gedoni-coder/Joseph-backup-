/**
 * Customer Calculation Utilities
 * Contains all business logic for customer segment calculations
 */

import { CustomerProfile } from "@/lib/business-forecast-data";

/**
 * Calculate revenue potential for a customer segment
 * @param demandAssumption - Number of units (demand)
 * @param avgOrderValue - Average order value
 * @returns Total revenue potential
 */
export function calculateSegmentRevenuePotential(demandAssumption: number, avgOrderValue: number): number {
  return demandAssumption * avgOrderValue;
}

/**
 * Calculate total market opportunity across all segments
 * @param profiles - Array of customer profiles
 * @returns Total market opportunity
 */
export function calculateTotalMarketOpportunity(profiles: CustomerProfile[]): number {
  return profiles.reduce((sum, p) => {
    return sum + calculateSegmentRevenuePotential(p.demandAssumption, p.avgOrderValue);
  }, 0);
}

/**
 * Calculate weighted average growth rate across segments
 * @param profiles - Array of customer profiles
 * @returns Weighted average growth rate
 */
export function calculateWeightedAvgGrowth(profiles: CustomerProfile[]): number {
  if (profiles.length === 0) return 0;
  
  const totalDemand = profiles.reduce((sum, p) => sum + p.demandAssumption, 0);
  if (totalDemand === 0) return 0;
  
  const weightedSum = profiles.reduce((sum, p) => {
    const weight = p.demandAssumption / totalDemand;
    return sum + (p.growthRate * weight);
  }, 0);
  
  return Math.round(weightedSum * 10) / 10;
}

/**
 * Calculate overall retention rate weighted by segment size
 * @param profiles - Array of customer profiles
 * @returns Overall retention percentage
 */
export function calculateOverallRetention(profiles: CustomerProfile[]): number {
  if (profiles.length === 0) return 0;
  
  const totalDemand = profiles.reduce((sum, p) => sum + p.demandAssumption, 0);
  if (totalDemand === 0) return 0;
  
  const weightedSum = profiles.reduce((sum, p) => {
    const weight = p.demandAssumption / totalDemand;
    return sum + (p.retention * weight);
  }, 0);
  
  return Math.round(weightedSum * 10) / 10;
}

/**
 * Calculate total demand across all segments
 * @param profiles - Array of customer profiles
 * @returns Total demand units
 */
export function calculateTotalDemand(profiles: CustomerProfile[]): number {
  return profiles.reduce((sum, p) => sum + p.demandAssumption, 0);
}

/**
 * Calculate average order value across all segments
 * @param profiles - Array of customer profiles
 * @returns Average order value
 */
export function calculateAvgOrderValue(profiles: CustomerProfile[]): number {
  if (profiles.length === 0) return 0;
  
  const totalRevenue = profiles.reduce((sum, p) => {
    return sum + calculateSegmentRevenuePotential(p.demandAssumption, p.avgOrderValue);
  }, 0);
  
  const totalDemand = calculateTotalDemand(profiles);
  if (totalDemand === 0) return 0;
  
  return totalRevenue / totalDemand;
}

/**
 * Calculate average growth rate across segments
 * @param profiles - Array of customer profiles
 * @returns Simple average growth rate
 */
export function calculateAvgGrowthRate(profiles: CustomerProfile[]): number {
  if (profiles.length === 0) return 0;
  
  const total = profiles.reduce((sum, p) => sum + p.growthRate, 0);
  return Math.round((total / profiles.length) * 10) / 10;
}

/**
 * Calculate average retention rate across segments
 * @param profiles - Array of customer profiles
 * @returns Simple average retention rate
 */
export function calculateAvgRetention(profiles: CustomerProfile[]): number {
  if (profiles.length === 0) return 0;
  
  const total = profiles.reduce((sum, p) => sum + p.retention, 0);
  return Math.round((total / profiles.length) * 10) / 10;
}

/**
 * Get segment with highest growth rate
 * @param profiles - Array of customer profiles
 * @returns Profile with highest growth
 */
export function getHighestGrowthSegment(profiles: CustomerProfile[]): CustomerProfile | null {
  if (profiles.length === 0) return null;
  
  return profiles.reduce((highest, p) => {
    if (!highest || p.growthRate > highest.growthRate) {
      return p;
    }
    return highest;
  }, profiles[0]);
}

/**
 * Get segment with highest revenue potential
 * @param profiles - Array of customer profiles
 * @returns Profile with highest revenue potential
 */
export function getHighestRevenueSegment(profiles: CustomerProfile[]): CustomerProfile | null {
  if (profiles.length === 0) return null;
  
  return profiles.reduce((highest, p) => {
    const currentPotential = calculateSegmentRevenuePotential(p.demandAssumption, p.avgOrderValue);
    const highestPotential = highest 
      ? calculateSegmentRevenuePotential(highest.demandAssumption, highest.avgOrderValue)
      : 0;
    
    if (!highest || currentPotential > highestPotential) {
      return p;
    }
    return highest;
  }, profiles[0]);
}

/**
 * Get segment with highest retention
 * @param profiles - Array of customer profiles
 * @returns Profile with highest retention
 */
export function getHighestRetentionSegment(profiles: CustomerProfile[]): CustomerProfile | null {
  if (profiles.length === 0) return null;
  
  return profiles.reduce((highest, p) => {
    if (!highest || p.retention > highest.retention) {
      return p;
    }
    return highest;
  }, profiles[0]);
}

/**
 * Calculate segment distribution percentages
 * @param profiles - Array of customer profiles
 * @returns Object with segment percentages
 */
export function calculateSegmentDistribution(profiles: CustomerProfile[]): Record<string, number> {
  const totalDemand = calculateTotalDemand(profiles);
  if (totalDemand === 0) return {};
  
  return profiles.reduce((acc, p) => {
    acc[p.segment] = Math.round((p.demandAssumption / totalDemand) * 100);
    return acc;
  }, {} as Record<string, number>);
}

/**
 * Calculate revenue distribution percentages
 * @param profiles - Array of customer profiles
 * @returns Object with revenue percentages
 */
export function calculateRevenueDistribution(profiles: CustomerProfile[]): Record<string, number> {
  const totalMarketOpportunity = calculateTotalMarketOpportunity(profiles);
  if (totalMarketOpportunity === 0) return {};
  
  return profiles.reduce((acc, p) => {
    const segmentRevenue = calculateSegmentRevenuePotential(p.demandAssumption, p.avgOrderValue);
    acc[p.segment] = Math.round((segmentRevenue / totalMarketOpportunity) * 100);
    return acc;
  }, {} as Record<string, number>);
}

/**
 * Get demand summary object
 * @param profiles - Array of customer profiles
 * @returns Demand summary object
 */
export function getDemandSummary(profiles: CustomerProfile[]): {
  totalMarketOpportunity: number;
  weightedAvgGrowth: number;
  overallRetention: number;
  totalDemand: number;
  segmentCount: number;
} {
  return {
    totalMarketOpportunity: calculateTotalMarketOpportunity(profiles),
    weightedAvgGrowth: calculateWeightedAvgGrowth(profiles),
    overallRetention: calculateOverallRetention(profiles),
    totalDemand: calculateTotalDemand(profiles),
    segmentCount: profiles.length,
  };
}

