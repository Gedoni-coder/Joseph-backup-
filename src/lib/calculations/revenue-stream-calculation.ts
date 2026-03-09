/**
 * Revenue Stream Calculation Utilities
 * Contains all business logic for revenue stream analysis
 */

import { RevenueStream } from "@/lib/revenue-data";

/**
 * Calculate total revenue across all streams
 * @param streams - Array of revenue streams
 * @returns Total revenue
 */
export function calculateTotalRevenue(streams: RevenueStream[]): number {
  return streams.reduce((sum, s) => sum + s.currentRevenue, 0);
}

/**
 * Calculate total forecast revenue
 * @param streams - Array of revenue streams
 * @returns Total forecast revenue
 */
export function calculateTotalForecastRevenue(streams: RevenueStream[]): number {
  return streams.reduce((sum, s) => sum + s.forecastRevenue, 0);
}

/**
 * Calculate weighted average growth rate
 * @param streams - Array of revenue streams
 * @returns Weighted average growth rate
 */
export function calculateAvgRevenueGrowth(streams: RevenueStream[]): number {
  if (streams.length === 0) return 0;
  const total = calculateTotalRevenue(streams);
  if (total === 0) return 0;
  
  const weightedSum = streams.reduce((sum, s) => {
    const weight = s.currentRevenue / total;
    return sum + (s.growth * weight);
  }, 0);
  
  return Math.round(weightedSum * 10) / 10;
}

/**
 * Calculate weighted average margin
 * @param streams - Array of revenue streams
 * @returns Weighted average margin
 */
export function calculateAvgRevenueMargin(streams: RevenueStream[]): number {
  if (streams.length === 0) return 0;
  const total = calculateTotalRevenue(streams);
  if (total === 0) return 0;
  
  const weightedSum = streams.reduce((sum, s) => {
    const weight = s.currentRevenue / total;
    return sum + (s.margin * weight);
  }, 0);
  
  return Math.round(weightedSum * 10) / 10;
}

/**
 * Calculate total customers across all streams
 * @param streams - Array of revenue streams
 * @returns Total customers
 */
export function calculateTotalStreamCustomers(streams: RevenueStream[]): number {
  return streams.reduce((sum, s) => sum + s.customers, 0);
}

/**
 * Calculate revenue potential (forecast - current)
 * @param streams - Array of revenue streams
 * @returns Total revenue growth potential
 */
export function calculateRevenuePotential(streams: RevenueStream[]): number {
  return calculateTotalForecastRevenue(streams) - calculateTotalRevenue(streams);
}

/**
 * Calculate percentage of revenue potential
 * @param streams - Array of revenue streams
 * @returns Growth percentage
 */
export function calculateRevenueGrowthPotential(streams: RevenueStream[]): number {
  const current = calculateTotalRevenue(streams);
  if (current === 0) return 0;
  
  const potential = calculateRevenuePotential(streams);
  return Math.round((potential / current) * 100 * 10) / 10;
}

/**
 * Get top performing stream
 * @param streams - Array of revenue streams
 * @returns Stream with highest growth
 */
export function getTopPerformingStream(streams: RevenueStream[]): RevenueStream | null {
  if (streams.length === 0) return null;
  return streams.reduce((top, s) => 
    s.growth > (top?.growth || 0) ? s : top, streams[0]
  );
}

/**
 * Get highest revenue stream
 * @param streams - Array of revenue streams
 * @returns Stream with highest current revenue
 */
export function getHighestRevenueStream(streams: RevenueStream[]): RevenueStream | null {
  if (streams.length === 0) return null;
  return streams.reduce((highest, s) => 
    s.currentRevenue > (highest?.currentRevenue || 0) ? s : highest, streams[0]
  );
}

/**
 * Calculate stream distribution
 * @param streams - Array of revenue streams
 * @returns Object with revenue percentages
 */
export function calculateStreamDistribution(streams: RevenueStream[]): Record<string, number> {
  const total = calculateTotalRevenue(streams);
  if (total === 0) return {};
  
  return streams.reduce((acc, s) => {
    acc[s.name] = Math.round((s.currentRevenue / total) * 100);
    return acc;
  }, {} as Record<string, number>);
}

/**
 * Get stream summary
 * @param streams - Array of revenue streams
 * @returns Summary object
 */
export function getStreamSummary(streams: RevenueStream[]): {
  totalRevenue: number;
  totalForecast: number;
  totalCustomers: number;
  avgGrowth: number;
  avgMargin: number;
  growthPotential: number;
  streamCount: number;
} {
  return {
    totalRevenue: calculateTotalRevenue(streams),
    totalForecast: calculateTotalForecastRevenue(streams),
    totalCustomers: calculateTotalStreamCustomers(streams),
    avgGrowth: calculateAvgRevenueGrowth(streams),
    avgMargin: calculateAvgRevenueMargin(streams),
    growthPotential: calculateRevenueGrowthPotential(streams),
    streamCount: streams.length,
  };
}

/**
 * Format revenue for display
 * @param amount - Revenue amount
 * @returns Formatted string
 */
export function formatRevenue(amount: number): string {
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

