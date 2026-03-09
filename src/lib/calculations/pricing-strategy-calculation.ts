/**
 * Pricing Strategy Calculation Utilities
 * Contains all business logic for pricing strategy calculations
 */

import { PricingStrategy } from "@/lib/pricing-data";

/**
 * Calculate total expected revenue across all strategies
 * @param strategies - Array of pricing strategies
 * @returns Total expected revenue
 */
export function calculateTotalExpectedRevenue(strategies: PricingStrategy[]): number {
  return strategies.reduce((sum, s) => sum + (s.expectedRevenue || 0), 0);
}

/**
 * Calculate average confidence across all strategies
 * @param strategies - Array of pricing strategies
 * @returns Average confidence percentage
 */
export function calculateAvgConfidence(strategies: PricingStrategy[]): number {
  if (strategies.length === 0) return 0;
  const total = strategies.reduce((sum, s) => sum + s.confidence, 0);
  return Math.round(total / strategies.length);
}

/**
 * Calculate average profit margin across all strategies
 * @param strategies - Array of pricing strategies
 * @returns Average profit margin percentage
 */
export function calculateAvgProfitMargin(strategies: PricingStrategy[]): number {
  if (strategies.length === 0) return 0;
  const total = strategies.reduce((sum, s) => sum + (s.profitMargin || 0), 0);
  return Math.round((total / strategies.length) * 10) / 10;
}

/**
 * Calculate average price increase potential
 * @param strategies - Array of pricing strategies
 * @returns Average percentage increase
 */
export function calculateAvgPriceIncrease(strategies: PricingStrategy[]): number {
  if (strategies.length === 0) return 0;
  
  const totalIncrease = strategies.reduce((sum, s) => {
    if (!s.currentPrice || s.currentPrice === 0) return sum;
    const increase = ((s.suggestedPrice - s.currentPrice) / s.currentPrice) * 100;
    return sum + increase;
  }, 0);
  
  return Math.round((totalIncrease / strategies.length) * 10) / 10;
}

/**
 * Get strategy with highest expected revenue
 * @param strategies - Array of pricing strategies
 * @returns Strategy with highest expected revenue
 */
export function getHighestRevenueStrategy(strategies: PricingStrategy[]): PricingStrategy | null {
  if (strategies.length === 0) return null;
  
  return strategies.reduce((highest, s) => {
    if (!highest || (s.expectedRevenue || 0) > (highest.expectedRevenue || 0)) {
      return s;
    }
    return highest;
  }, strategies[0]);
}

/**
 * Get strategy with highest profit margin
 * @param strategies - Array of pricing strategies
 * @returns Strategy with highest profit margin
 */
export function getHighestMarginStrategy(strategies: PricingStrategy[]): PricingStrategy | null {
  if (strategies.length === 0) return null;
  
  return strategies.reduce((highest, s) => {
    if (!highest || (s.profitMargin || 0) > (highest.profitMargin || 0)) {
      return s;
    }
    return highest;
  }, strategies[0]);
}

/**
 * Get strategy with highest confidence
 * @param strategies - Array of pricing strategies
 * @returns Strategy with highest confidence
 */
export function getHighestConfidenceStrategy(strategies: PricingStrategy[]): PricingStrategy | null {
  if (strategies.length === 0) return null;
  
  return strategies.reduce((highest, s) => {
    if (!highest || s.confidence > highest.confidence) {
      return s;
    }
    return highest;
  }, strategies[0]);
}

/**
 * Calculate price difference between current and suggested
 * @param strategy - Pricing strategy
 * @returns Price difference
 */
export function calculatePriceDifference(strategy: PricingStrategy): number {
  return (strategy.suggestedPrice || 0) - (strategy.currentPrice || 0);
}

/**
 * Calculate revenue potential if all strategies are implemented
 * @param strategies - Array of pricing strategies
 * @returns Total potential revenue
 */
export function calculateTotalPotentialRevenue(strategies: PricingStrategy[]): number {
  return strategies.reduce((sum, s) => {
    return sum + (s.expectedRevenue || 0);
  }, 0);
}

/**
 * Get count of strategies by type
 * @param strategies - Array of pricing strategies
 * @returns Object with counts by type
 */
export function getStrategiesByType(strategies: PricingStrategy[]): Record<string, number> {
  return strategies.reduce((acc, s) => {
    acc[s.type] = (acc[s.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

/**
 * Calculate total market share across all strategies
 * @param strategies - Array of pricing strategies
 * @returns Total market share percentage
 */
export function calculateTotalMarketShare(strategies: PricingStrategy[]): number {
  return strategies.reduce((sum, s) => sum + (s.marketShare || 0), 0);
}

/**
 * Get strategy summary object
 * @param strategies - Array of pricing strategies
 * @returns Summary object
 */
export function getStrategySummary(strategies: PricingStrategy[]) {
  return {
    totalRevenue: calculateTotalExpectedRevenue(strategies),
    avgConfidence: calculateAvgConfidence(strategies),
    avgMargin: calculateAvgProfitMargin(strategies),
    avgPriceIncrease: calculateAvgPriceIncrease(strategies),
    strategyCount: strategies.length,
    totalMarketShare: calculateTotalMarketShare(strategies),
    highestRevenue: getHighestRevenueStrategy(strategies),
    highestMargin: getHighestMarginStrategy(strategies),
    byType: getStrategiesByType(strategies),
  };
}
