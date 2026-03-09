/**
 * Demand Forecast Calculation Utilities
 * Contains all business logic for demand forecasting calculations
 */

import { DemandForecast, MarketTrend } from "@/lib/market-data";

/**
 * Calculate demand growth percentage
 * @param currentDemand - Current demand
 * @param forecastDemand - Forecasted demand
 * @returns Growth percentage
 */
export function calculateDemandGrowth(currentDemand: number, forecastDemand: number): number {
  if (!currentDemand || currentDemand === 0) return 0;
  return Math.round(((forecastDemand - currentDemand) / currentDemand) * 100 * 10) / 10;
}

/**
 * Calculate total factor impact
 * @param factors - Array of demand factors
 * @returns Total impact sum
 */
export function calculateTotalFactorImpact(factors: { impact: number }[]): number {
  return factors.reduce((sum, f) => sum + f.impact, 0);
}

/**
 * Calculate weighted factor impact
 * @param factors - Array of demand factors
 * @returns Weighted impact sum
 */
export function calculateWeightedFactorImpact(factors: { impact: number; weight: number }[]): number {
  return factors.reduce((sum, f) => sum + (f.impact * f.weight), 0);
}

/**
 * Get scenario with highest probability
 * @param scenarios - Array of forecast scenarios
 * @returns Most likely scenario
 */
export function getMostLikelyScenario(scenarios: { probability: number; name: string; demand: number }[]): {
  name: string;
  demand: number;
  probability: number;
} | null {
  if (scenarios.length === 0) return null;
  return scenarios.reduce((highest, s) => 
    s.probability > highest.probability ? s : highest, scenarios[0]
  );
}

/**
 * Calculate expected demand using probability-weighted average
 * @param scenarios - Array of forecast scenarios
 * @returns Expected demand value
 */
export function calculateExpectedDemand(scenarios: { probability: number; demand: number }[]): number {
  if (scenarios.length === 0) return 0;
  const weightedSum = scenarios.reduce((sum, s) => sum + (s.probability / 100 * s.demand), 0);
  return Math.round(weightedSum);
}

/**
 * Get demand forecast summary
 * @param forecasts - Array of demand forecasts
 * @returns Summary object
 */
export function getDemandForecastSummary(forecasts: DemandForecast[]): {
  totalCurrentDemand: number;
  totalForecastDemand: number;
  avgGrowth: number;
  avgConfidence: number;
  forecastCount: number;
} {
  const totalCurrentDemand = forecasts.reduce((sum, f) => sum + f.currentDemand, 0);
  const totalForecastDemand = forecasts.reduce((sum, f) => sum + f.forecastDemand, 0);
  const avgGrowth = forecasts.length > 0
    ? Math.round(forecasts.reduce((sum, f) => sum + calculateDemandGrowth(f.currentDemand, f.forecastDemand), 0) / forecasts.length * 10) / 10
    : 0;
  const avgConfidence = forecasts.length > 0
    ? Math.round(forecasts.reduce((sum, f) => sum + f.confidence, 0) / forecasts.length)
    : 0;

  return {
    totalCurrentDemand,
    totalForecastDemand,
    avgGrowth,
    avgConfidence,
    forecastCount: forecasts.length,
  };
}

/**
 * Format demand number for display
 * @param demand - Demand number
 * @returns Formatted string
 */
export function formatDemand(demand: number): string {
  if (demand >= 1000000) {
    return `${(demand / 1000000).toFixed(1)}M`;
  }
  if (demand >= 1000) {
    return `${(demand / 1000).toFixed(0)}K`;
  }
  return demand.toLocaleString();
}

/**
 * Calculate trend strength
 * @param trends - Array of market trends
 * @returns Strength score (0-100)
 */
export function calculateTrendStrength(trends: MarketTrend[]): number {
  if (trends.length === 0) return 0;
  
  let positiveCount = 0;
  let highImpactCount = 0;
  
  trends.forEach(trend => {
    if (trend.direction === 'positive') positiveCount++;
    if (trend.impact === 'high') highImpactCount++;
  });
  
  const positiveScore = (positiveCount / trends.length) * 50;
  const impactScore = (highImpactCount / trends.length) * 50;
  
  return Math.round(positiveScore + impactScore);
}

/**
 * Get trend summary
 * @param trends - Array of market trends
 * @returns Summary object
 */
export function getTrendSummary(trends: MarketTrend[]): {
  total: number;
  positive: number;
  negative: number;
  neutral: number;
  highImpact: number;
  avgConfidence: number;
  strength: number;
} {
  const positive = trends.filter(t => t.direction === 'positive').length;
  const negative = trends.filter(t => t.direction === 'negative').length;
  const neutral = trends.filter(t => t.direction === 'neutral').length;
  const highImpact = trends.filter(t => t.impact === 'high').length;
  const avgConfidence = trends.length > 0
    ? Math.round(trends.reduce((sum, t) => sum + t.confidence, 0) / trends.length)
    : 0;
  const strength = calculateTrendStrength(trends);

  return {
    total: trends.length,
    positive,
    negative,
    neutral,
    highImpact,
    avgConfidence,
    strength,
  };
}

