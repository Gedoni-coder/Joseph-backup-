/**
 * Customer Segment Calculations Module
 * 
 * Handles customer segment analysis including:
 * - Revenue potential calculations
 * - Growth and retention projections
 * - Demand summary metrics
 * - Seasonality adjustments
 * - Segment profitability
 */

export interface SegmentData {
  segment: string;
  units: number;
  growthRate: number;
  retention: number;
  avgOrderValue: number;
  seasonality: number;
}

export interface CalculatedSegment extends SegmentData {
  grossRevenue: number;
  retainedRevenue: number;
  seasonallyAdjustedRevenue: number;
  projectedRevenue: number;
  growthAbsolute: number;
  retentionPercentage: number;
  seasonalityFactor: number;
}

export interface DemandSummary {
  totalMarketOpportunity: number;
  totalUnits: number;
  weightedAvgGrowth: number;
  overallRetention: number;
  blendedAvgOrderValue: number;
  avgSeasonalityImpact: number;
}

/**
 * Calculate gross revenue (before adjustments)
 * 
 * Formula: units * avgOrderValue
 * 
 * @param units - Number of units/customers
 * @param avgOrderValue - Average order value
 * @returns Gross revenue
 */
export function calculateGrossRevenue(units: number, avgOrderValue: number): number {
  return Math.round(units * avgOrderValue);
}

/**
 * Calculate retained revenue (after churn)
 * 
 * Formula: grossRevenue * (retention / 100)
 * 
 * @param grossRevenue - Revenue before retention adjustment
 * @param retention - Retention rate (0-100)
 * @returns Retained revenue
 */
export function calculateRetainedRevenue(grossRevenue: number, retention: number): number {
  return Math.round(grossRevenue * (retention / 100));
}

/**
 * Calculate seasonality-adjusted revenue
 * 
 * Seasonality is typically expressed as ±percentage variation
 * This calculates the average impact (assume we're calculating for "normal" period)
 * 
 * Formula: baseRevenue * (1 ± seasonality/100) [average case]
 * 
 * @param baseRevenue - Base revenue before seasonality
 * @param seasonality - Seasonality as percentage (e.g., 8 for ±8%)
 * @param seasonalityFactor - Period factor (-1 to +1, where 0 is average)
 * @returns Seasonally adjusted revenue
 */
export function calculateSeasonallyAdjustedRevenue(
  baseRevenue: number,
  seasonality: number,
  seasonalityFactor: number = 0
): number {
  const adjustment = 1 + (seasonality / 100) * seasonalityFactor;
  return Math.round(baseRevenue * adjustment);
}

/**
 * Calculate growth-adjusted revenue
 * 
 * Formula: baseRevenue * (1 + growthRate/100)
 * 
 * @param baseRevenue - Base revenue
 * @param growthRate - Growth rate as percentage
 * @returns Revenue after growth adjustment
 */
export function calculateGrowthAdjustedRevenue(baseRevenue: number, growthRate: number): number {
  return Math.round(baseRevenue * (1 + growthRate / 100));
}

/**
 * Calculate projected revenue (full calculation)
 * 
 * Formula: units * avgOrderValue * (retention/100) * (1 + growth/100)
 * 
 * @param units - Number of units
 * @param avgOrderValue - Average order value
 * @param retention - Retention rate (0-100)
 * @param growthRate - Growth rate (%)
 * @returns Projected revenue
 */
export function calculateProjectedRevenue(
  units: number,
  avgOrderValue: number,
  retention: number,
  growthRate: number
): number {
  const gross = calculateGrossRevenue(units, avgOrderValue);
  const retained = calculateRetainedRevenue(gross, retention);
  const projected = calculateGrowthAdjustedRevenue(retained, growthRate);
  return projected;
}

/**
 * Calculate absolute growth (units or revenue)
 * 
 * @param projected - Projected value
 * @param baseline - Baseline value
 * @returns Absolute growth amount
 */
export function calculateGrowthAbsolute(projected: number, baseline: number): number {
  return projected - baseline;
}

/**
 * Calculate growth percentage
 * 
 * @param projected - Projected value
 * @param baseline - Baseline value
 * @returns Growth percentage
 */
export function calculateGrowthPercentage(projected: number, baseline: number): number {
  if (baseline === 0) return 0;
  return ((projected - baseline) / baseline) * 100;
}

/**
 * Full calculation pipeline for a customer segment
 * 
 * @param data - Raw segment data
 * @param baselineRevenue - Previous period revenue for growth calculation
 * @returns Fully calculated segment metrics
 */
export function calculateCompleteSegment(
  data: SegmentData,
  baselineRevenue: number = 0
): CalculatedSegment {
  const grossRevenue = calculateGrossRevenue(data.units, data.avgOrderValue);
  const retainedRevenue = calculateRetainedRevenue(grossRevenue, data.retention);
  
  const seasonallyAdjustedRevenue = calculateSeasonallyAdjustedRevenue(
    retainedRevenue,
    data.seasonality,
    0
  );
  
  const projectedRevenue = calculateGrowthAdjustedRevenue(
    seasonallyAdjustedRevenue,
    data.growthRate
  );
  
  const growthAbsolute = calculateGrowthAbsolute(
    projectedRevenue,
    baselineRevenue || retainedRevenue
  );
  
  return {
    ...data,
    grossRevenue,
    retainedRevenue,
    seasonallyAdjustedRevenue,
    projectedRevenue,
    growthAbsolute,
    retentionPercentage: data.retention,
    seasonalityFactor: data.seasonality / 100,
  };
}

/**
 * Calculate batch of segments
 * 
 * @param dataArray - Array of segment data
 * @param baselineRevenues - Optional array of baseline revenues for growth calc
 * @returns Array of calculated segments
 */
export function calculateBatchSegments(
  dataArray: SegmentData[],
  baselineRevenues?: number[]
): CalculatedSegment[] {
  return dataArray.map((data, index) => {
    const baseline = baselineRevenues?.[index] ?? 0;
    return calculateCompleteSegment(data, baseline);
  });
}

/**
 * Calculate demand summary from multiple segments
 * 
 * @param segments - Array of calculated segments
 * @returns Aggregated demand summary
 */
export function calculateDemandSummary(segments: CalculatedSegment[]): DemandSummary {
  if (segments.length === 0) {
    return {
      totalMarketOpportunity: 0,
      totalUnits: 0,
      weightedAvgGrowth: 0,
      overallRetention: 0,
      blendedAvgOrderValue: 0,
      avgSeasonalityImpact: 0,
    };
  }
  
  const totalMarketOpportunity = segments.reduce((sum, s) => sum + s.projectedRevenue, 0);
  const totalUnits = segments.reduce((sum, s) => sum + s.units, 0);
  
  // Weighted average growth (by units)
  const weightedGrowth = segments.reduce(
    (sum, s) => sum + s.growthRate * (s.units / totalUnits),
    0
  );
  
  // Weighted average retention (by units)
  const weightedRetention = segments.reduce(
    (sum, s) => sum + s.retention * (s.units / totalUnits),
    0
  );
  
  // Weighted average order value (by units)
  const weightedAOV = segments.reduce(
    (sum, s) => sum + s.avgOrderValue * (s.units / totalUnits),
    0
  );
  
  // Average seasonality impact
  const avgSeasonality = segments.reduce((sum, s) => sum + Math.abs(s.seasonality), 0) / segments.length;
  
  return {
    totalMarketOpportunity: Math.round(totalMarketOpportunity),
    totalUnits,
    weightedAvgGrowth: Math.round(weightedGrowth * 10) / 10,
    overallRetention: Math.round(weightedRetention * 10) / 10,
    blendedAvgOrderValue: Math.round(weightedAOV),
    avgSeasonalityImpact: Math.round(avgSeasonality * 10) / 10,
  };
}

/**
 * Calculate segment market share
 * 
 * @param segmentRevenue - Segment revenue
 * @param totalMarketRevenue - Total market revenue
 * @returns Market share as percentage
 */
export function calculateMarketShare(segmentRevenue: number, totalMarketRevenue: number): number {
  if (totalMarketRevenue === 0) return 0;
  return (segmentRevenue / totalMarketRevenue) * 100;
}

/**
 * Identify high-growth segments
 * 
 * @param segments - Array of calculated segments
 * @param growthThreshold - Growth rate threshold
 * @returns High-growth segments
 */
export function getHighGrowthSegments(
  segments: CalculatedSegment[],
  growthThreshold: number = 20
): CalculatedSegment[] {
  return segments.filter((s) => s.growthRate > growthThreshold);
}

/**
 * Identify high-retention segments
 * 
 * @param segments - Array of calculated segments
 * @param retentionThreshold - Retention rate threshold
 * @returns High-retention segments
 */
export function getHighRetentionSegments(
  segments: CalculatedSegment[],
  retentionThreshold: number = 85
): CalculatedSegment[] {
  return segments.filter((s) => s.retention > retentionThreshold);
}

/**
 * Identify high-value segments (by average order value)
 * 
 * @param segments - Array of calculated segments
 * @param aovThreshold - Average order value threshold
 * @returns High-value segments
 */
export function getHighValueSegments(
  segments: CalculatedSegment[],
  aovThreshold: number = 10000
): CalculatedSegment[] {
  return segments.filter((s) => s.avgOrderValue > aovThreshold);
}

/**
 * Rank segments by revenue contribution
 * 
 * @param segments - Array of calculated segments
 * @returns Segments sorted by projected revenue (descending)
 */
export function rankSegmentsByRevenue(segments: CalculatedSegment[]): CalculatedSegment[] {
  return [...segments].sort((a, b) => b.projectedRevenue - a.projectedRevenue);
}

/**
 * Calculate customer acquisition cost by segment
 * 
 * @param segmentMarketingSpend - Marketing spend for segment
 * @param newCustomers - New customers acquired
 * @returns CAC for segment
 */
export function calculateSegmentCAC(segmentMarketingSpend: number, newCustomers: number): number {
  if (newCustomers === 0) return 0;
  return Math.round(segmentMarketingSpend / newCustomers);
}

/**
 * Calculate customer lifetime value by segment
 * 
 * Formula: AVG * Frequency * Lifespan
 * 
 * @param avgOrderValue - Average order value
 * @param purchaseFrequency - Times purchased per year
 * @param lifespan - Expected customer lifespan in years
 * @returns CLV for segment
 */
export function calculateSegmentCLV(
  avgOrderValue: number,
  purchaseFrequency: number,
  lifespan: number
): number {
  return Math.round(avgOrderValue * purchaseFrequency * lifespan);
}

/**
 * Calculate payback period (CAC vs CLV)
 * 
 * @param cac - Customer acquisition cost
 * @param clv - Customer lifetime value
 * @returns Payback period ratio (lower is better)
 */
export function calculatePaybackPeriod(cac: number, clv: number): number {
  if (clv === 0) return 0;
  return cac / clv;
}

/**
 * Identify segments needing attention
 * 
 * Low growth + low retention
 * 
 * @param segments - Array of calculated segments
 * @param growthThreshold - Minimum growth rate
 * @param retentionThreshold - Minimum retention rate
 * @returns At-risk segments
 */
export function getAtRiskSegments(
  segments: CalculatedSegment[],
  growthThreshold: number = 10,
  retentionThreshold: number = 75
): CalculatedSegment[] {
  return segments.filter((s) => s.growthRate < growthThreshold && s.retention < retentionThreshold);
}

/**
 * Calculate potential revenue upside from segment optimization
 * 
 * Scenario: improve growth rate and/or retention
 * 
 * @param currentRevenue - Current segment revenue
 * @param targetGrowthRate - Target growth rate
 * @param currentGrowthRate - Current growth rate
 * @param targetRetention - Target retention
 * @param currentRetention - Current retention
 * @returns Potential additional revenue
 */
export function calculateSegmentUpsideOpportunity(
  currentRevenue: number,
  targetGrowthRate: number,
  currentGrowthRate: number,
  targetRetention: number,
  currentRetention: number
): number {
  // Simulate with improved metrics
  const growthImprovement = (targetGrowthRate - currentGrowthRate) / 100;
  const retentionImprovement = (targetRetention - currentRetention) / 100;
  
  // Combined improvement (multiplicative)
  const improvementFactor = (1 + growthImprovement) * (1 + retentionImprovement);
  const upside = (improvementFactor - 1) * currentRevenue;
  
  return Math.round(upside);
}

/**
 * Forecast segment performance (trend-based)
 * 
 * @param historicalRevenues - Array of historical revenue values
 * @param periods - Number of periods to forecast
 * @returns Forecasted revenues
 */
export function forecastSegmentRevenue(
  historicalRevenues: number[],
  periods: number = 4
): number[] {
  if (historicalRevenues.length < 2) return [];
  
  // Simple linear trend
  const n = historicalRevenues.length;
  const indices = Array.from({ length: n }, (_, i) => i);
  const sumX = indices.reduce((a, b) => a + b, 0);
  const sumY = historicalRevenues.reduce((a, b) => a + b, 0);
  const sumXY = indices.reduce((sum, x, i) => sum + x * historicalRevenues[i], 0);
  const sumX2 = indices.reduce((sum, x) => sum + x * x, 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  const forecast = [];
  for (let i = 1; i <= periods; i++) {
    const nextIndex = n - 1 + i;
    const value = intercept + slope * nextIndex;
    forecast.push(Math.max(0, Math.round(value))); // No negative values
  }
  
  return forecast;
}
