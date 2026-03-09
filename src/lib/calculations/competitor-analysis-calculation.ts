/**
 * Competitor Analysis Calculation Utilities
 * Contains all business logic for competitor pricing analysis
 */

import { CompetitorAnalysis } from "@/lib/pricing-data";

/**
 * Calculate average competitor price
 * @param competitors - Array of competitor analysis
 * @returns Average price
 */
export function calculateAvgCompetitorPrice(competitors: CompetitorAnalysis[]): number {
  if (competitors.length === 0) return 0;
  const total = competitors.reduce((sum, c) => sum + (c.price || 0), 0);
  return Math.round((total / competitors.length) * 100) / 100;
}

/**
 * Calculate total market share among tracked competitors
 * @param competitors - Array of competitor analysis
 * @returns Total market share percentage
 */
export function calculateTotalCompetitorMarketShare(competitors: CompetitorAnalysis[]): number {
  return competitors.reduce((sum, c) => sum + (c.marketShare || 0), 0);
}

/**
 * Get lowest priced competitor
 * @param competitors - Array of competitor analysis
 * @returns Competitor with lowest price
 */
export function getLowestPriceCompetitor(competitors: CompetitorAnalysis[]): CompetitorAnalysis | null {
  if (competitors.length === 0) return null;
  
  return competitors.reduce((lowest, c) => {
    if (!lowest || (c.price || 0) < (lowest.price || 0)) {
      return c;
    }
    return lowest;
  }, competitors[0]);
}

/**
 * Get highest market share competitor
 * @param competitors - Array of competitor analysis
 * @returns Competitor with highest market share
 */
export function getHighestMarketShareCompetitor(competitors: CompetitorAnalysis[]): CompetitorAnalysis | null {
  if (competitors.length === 0) return null;
  
  return competitors.reduce((highest, c) => {
    if (!highest || (c.marketShare || 0) > (highest.marketShare || 0)) {
      return c;
    }
    return highest;
  }, competitors[0]);
}

/**
 * Calculate price range across competitors
 * @param competitors - Array of competitor analysis
 * @returns Object with min and max prices
 */
export function calculatePriceRange(competitors: CompetitorAnalysis[]): { min: number; max: number; range: number } {
  if (competitors.length === 0) return { min: 0, max: 0, range: 0 };
  
  const prices = competitors.map(c => c.price || 0);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  
  return {
    min: Math.round(min * 100) / 100,
    max: Math.round(max * 100) / 100,
    range: Math.round((max - min) * 100) / 100,
  };
}

/**
 * Get competitors by position (premium, mid-market, budget)
 * @param competitors - Array of competitor analysis
 * @returns Object with counts by position
 */
export function getCompetitorsByPosition(competitors: CompetitorAnalysis[]): Record<string, number> {
  return competitors.reduce((acc, c) => {
    acc[c.position] = (acc[c.position] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

/**
 * Calculate competitive price index relative to average
 * @param ourPrice - Our product price
 * @param competitors - Array of competitor analysis
 * @returns Index (100 = at market average)
 */
export function calculateCompetitivePriceIndex(ourPrice: number, competitors: CompetitorAnalysis[]): number {
  if (competitors.length === 0 || ourPrice === 0) return 100;
  
  const avgPrice = calculateAvgCompetitorPrice(competitors);
  return Math.round((ourPrice / avgPrice) * 100);
}

/**
 * Get competitor summary object
 * @param competitors - Array of competitor analysis
 * @param ourPrice - Our product price (optional)
 * @returns Summary object
 */
export function getCompetitorSummary(competitors: CompetitorAnalysis[], ourPrice?: number) {
  const priceRange = calculatePriceRange(competitors);
  
  return {
    competitorCount: competitors.length,
    avgPrice: calculateAvgCompetitorPrice(competitors),
    totalMarketShare: calculateTotalCompetitorMarketShare(competitors),
    lowestPrice: priceRange.min,
    highestPrice: priceRange.max,
    priceRange: priceRange.range,
    lowestCompetitor: getLowestPriceCompetitor(competitors),
    highestShare: getHighestMarketShareCompetitor(competitors),
    byPosition: getCompetitorsByPosition(competitors),
    priceIndex: ourPrice ? calculateCompetitivePriceIndex(ourPrice, competitors) : undefined,
  };
}
