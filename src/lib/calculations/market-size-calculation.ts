/**
 * Market Size Calculation Utilities
 * Contains all business logic for TAM, SAM, SOM calculations
 */

import { MarketSize } from "@/lib/market-data";

/**
 * Calculate SAM as percentage of TAM
 * @param sam - Serviceable Addressable Market
 * @param tam - Total Addressable Market
 * @returns SAM as percentage of TAM
 */
export function calculateSAMPercentage(sam: number, tam: number): number {
  if (!tam || tam === 0) return 0;
  return Math.round((sam / tam) * 100);
}

/**
 * Calculate SOM as percentage of SAM
 * @param som - Serviceable Obtainable Market
 * @param sam - Serviceable Addressable Market
 * @returns SOM as percentage of SAM
 */
export function calculateSOMPercentage(som: number, sam: number): number {
  if (!sam || sam === 0) return 0;
  return Math.round((som / sam) * 100);
}

/**
 * Calculate market penetration rate
 * @param currentRevenue - Current revenue
 * @param som - Serviceable Obtainable Market
 * @returns Market penetration percentage
 */
export function calculateMarketPenetration(currentRevenue: number, som: number): number {
  if (!som || som === 0) return 0;
  return Math.round((currentRevenue / som) * 100);
}

/**
 * Calculate market share
 * @param companyRevenue - Company revenue
 * @param tam - Total Addressable Market
 * @returns Market share percentage
 */
export function calculateMarketShare(companyRevenue: number, tam: number): number {
  if (!tam || tam === 0) return 0;
  return Math.round((companyRevenue / tam) * 10000) / 100;
}

/**
 * Calculate projected market size based on growth rate
 * @param currentSize - Current market size
 * @param growthRate - Annual growth rate (percentage)
 * @param years - Number of years to project
 * @returns Projected market size
 */
export function calculateProjectedMarketSize(
  currentSize: number,
  growthRate: number,
  years: number
): number {
  return Math.round(currentSize * Math.pow(1 + growthRate / 100, years));
}

/**
 * Calculate compound annual growth rate (CAGR)
 * @param startValue - Starting value
 * @param endValue - Ending value
 * @param years - Number of years
 * @returns CAGR percentage
 */
export function calculateCAGR(startValue: number, endValue: number, years: number): number {
  if (!startValue || !years) return 0;
  return Math.round((Math.pow(endValue / startValue, 1 / years) - 1) * 100 * 10) / 10;
}

/**
 * Get market opportunity summary
 * @param marketSizes - Array of market sizes
 * @returns Summary object with totals
 */
export function getMarketSizeSummary(marketSizes: MarketSize[]): {
  totalTAM: number;
  totalSAM: number;
  totalSOM: number;
  avgGrowthRate: number;
  marketCount: number;
} {
  const totalTAM = marketSizes.reduce((sum, m) => sum + m.tam, 0);
  const totalSAM = marketSizes.reduce((sum, m) => sum + m.sam, 0);
  const totalSOM = marketSizes.reduce((sum, m) => sum + m.som, 0);
  const avgGrowthRate = marketSizes.length > 0
    ? Math.round(marketSizes.reduce((sum, m) => sum + m.growthRate, 0) / marketSizes.length * 10) / 10
    : 0;

  return {
    totalTAM,
    totalSAM,
    totalSOM,
    avgGrowthRate,
    marketCount: marketSizes.length,
  };
}

/**
 * Format market size for display
 * @param amount - Amount in currency
 * @returns Formatted string (e.g., "$195B")
 */
export function formatMarketSize(amount: number): string {
  if (amount >= 1000000000) {
    return `$${(amount / 1000000000).toFixed(1)}B`;
  }
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`;
  }
  return `$${amount}`;
}

/**
 * Calculate market potential index (0-100)
 * @param growthRate - Market growth rate
 * @param tam - Total Addressable Market size
 * @param competitionLevel - Competition level (0-10)
 * @returns Market potential score
 */
export function calculateMarketPotentialIndex(
  growthRate: number,
  tam: number,
  competitionLevel: number = 5
): number {
  // Growth factor (0-40 points)
  const growthFactor = Math.min(growthRate, 40);
  
  // Size factor (0-30 points, based on TAM)
  const sizeFactor = tam > 100000000000 ? 30 : 
                     tam > 10000000000 ? 20 : 
                     tam > 1000000000 ? 10 : 5;
  
  // Competition factor (0-30 points, lower is better)
  const competitionFactor = Math.max(0, 30 - (competitionLevel * 3));
  
  return growthFactor + sizeFactor + competitionFactor;
}

/**
 * Get market attractiveness rating
 * @param potentialIndex - Market potential index
 * @returns Rating string
 */
export function getMarketAttractiveness(potentialIndex: number): string {
  if (potentialIndex >= 80) return "Excellent";
  if (potentialIndex >= 60) return "Good";
  if (potentialIndex >= 40) return "Fair";
  return "Low";
}

