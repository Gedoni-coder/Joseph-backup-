/**
 * Revenue Calculations Module
 * 
 * Handles all revenue projection calculations including:
 * - Monthly, quarterly, and yearly projections
 * - Progress tracking (actual vs. projected)
 * - Variance analysis
 * - Confidence level determination
 * - Scenario range calculations
 * 
 * All calculations are pure functions for testability.
 */

export interface RevenuePeriodData {
  period: string;
  projected: number;
  conservative: number;
  optimistic: number;
  actualToDate?: number;
  confidence: number;
}

export interface CalculatedRevenueProjection {
  period: string;
  percentageComplete: number;
  projected: number;
  actualToDate: number;
  variance: number;
  variancePercentage: number;
  progress: number;
  scenarioMin: number;
  scenarioMax: number;
  confidence: "High" | "Medium" | "Low";
  confidenceScore: number;
  status: "On Track" | "Below Target" | "Exceeding Target";
}

/**
 * Calculate percentage of period complete based on actual vs projected
 * 
 * @param actual - Actual revenue to date
 * @param projected - Projected revenue for period
 * @returns Percentage of projected revenue achieved (0-100+)
 * 
 * @example
 * calculatePercentageComplete(884666.67, 933333.33) // Returns 94.8
 */
export function calculatePercentageComplete(actual: number, projected: number): number {
  if (projected === 0) return 0;
  const percentage = (actual / projected) * 100;
  return Math.round(percentage * 10) / 10; // Round to 1 decimal place
}

/**
 * Calculate variance between actual and projected revenue
 * 
 * @param actual - Actual revenue to date
 * @param projected - Projected revenue for period
 * @returns Variance in currency units (can be positive or negative)
 * 
 * @example
 * calculateVariance(884666.67, 933333.33) // Returns -48666.66
 */
export function calculateVariance(actual: number, projected: number): number {
  return actual - projected;
}

/**
 * Calculate variance as percentage
 * 
 * @param actual - Actual revenue to date
 * @param projected - Projected revenue for period
 * @returns Variance as percentage (-100 to +100+)
 * 
 * @example
 * calculateVariancePercentage(884666.67, 933333.33) // Returns -5.2
 */
export function calculateVariancePercentage(actual: number, projected: number): number {
  if (projected === 0) return 0;
  const variance = ((actual - projected) / projected) * 100;
  return Math.round(variance * 10) / 10; // Round to 1 decimal place
}

/**
 * Determine confidence level based on variance and historical accuracy
 * 
 * Confidence mapping:
 * - High: variance within -5% to +10% (strong consistency)
 * - Medium: variance within -15% to +20% (acceptable range)
 * - Low: variance outside medium range (needs review)
 * 
 * @param variancePercentage - Variance as percentage
 * @param historicalAccuracy - Historical accuracy score (0-1)
 * @returns Confidence level and numeric score
 * 
 * @example
 * determineConfidenceLevel(-5.2, 0.95) // Returns { level: "High", score: 85 }
 */
export function determineConfidenceLevel(
  variancePercentage: number,
  historicalAccuracy: number = 0.85
): { level: "High" | "Medium" | "Low"; score: number } {
  // Base confidence from variance
  let baseScore = 50;
  
  if (variancePercentage >= -5 && variancePercentage <= 10) {
    baseScore = 85; // High confidence zone
  } else if (variancePercentage >= -15 && variancePercentage <= 20) {
    baseScore = 70; // Medium confidence zone
  } else {
    baseScore = 55; // Low confidence zone
  }
  
  // Adjust based on historical accuracy (weight: 30%)
  const historicalBoost = (historicalAccuracy - 0.75) * 100; // Range: -25 to +25
  const finalScore = Math.round(baseScore + historicalBoost * 0.3);
  const boundedScore = Math.max(0, Math.min(100, finalScore));
  
  let level: "High" | "Medium" | "Low";
  if (boundedScore >= 80) {
    level = "High";
  } else if (boundedScore >= 60) {
    level = "Medium";
  } else {
    level = "Low";
  }
  
  return { level, score: boundedScore };
}

/**
 * Calculate progress percentage (typically 0-100, but can exceed 100 if exceeding target)
 * 
 * @param percentageComplete - Percentage of projected revenue achieved
 * @returns Progress as 0-100+ (can exceed 100 if overperforming)
 * 
 * @example
 * calculateProgress(94.8) // Returns 95
 */
export function calculateProgress(percentageComplete: number): number {
  return Math.round(percentageComplete);
}

/**
 * Determine projection status based on variance
 * 
 * @param variancePercentage - Variance as percentage
 * @returns Status indicator
 * 
 * @example
 * determineStatus(-5.2) // Returns "On Track"
 * determineStatus(-15) // Returns "Below Target"
 * determineStatus(5) // Returns "Exceeding Target"
 */
export function determineStatus(
  variancePercentage: number
): "On Track" | "Below Target" | "Exceeding Target" {
  if (variancePercentage < -5) {
    return "Below Target";
  } else if (variancePercentage > 2) {
    return "Exceeding Target";
  } else {
    return "On Track";
  }
}

/**
 * Calculate scenario range (conservative and optimistic bounds)
 * 
 * Uses standard deviation approach:
 * Conservative = projected * (1 - volatility coefficient)
 * Optimistic = projected * (1 + volatility coefficient)
 * 
 * @param projected - Projected revenue for period
 * @param volatility - Volatility coefficient (0-1), typically 0.08-0.15
 * @returns Object with min and max scenario values
 * 
 * @example
 * calculateScenarioRange(933333.33, 0.1) 
 * // Returns { min: 840000, max: 1026667 }
 */
export function calculateScenarioRange(
  projected: number,
  volatility: number = 0.1
): { min: number; max: number } {
  const min = Math.round(projected * (1 - volatility));
  const max = Math.round(projected * (1 + volatility));
  return { min, max };
}

/**
 * Calculate average confidence across multiple projections
 * 
 * @param confidenceScores - Array of confidence scores (0-100)
 * @returns Average confidence score
 * 
 * @example
 * calculateAverageConfidence([85, 78, 72, 68]) // Returns 75.75
 */
export function calculateAverageConfidence(confidenceScores: number[]): number {
  if (confidenceScores.length === 0) return 0;
  const sum = confidenceScores.reduce((acc, score) => acc + score, 0);
  const average = sum / confidenceScores.length;
  return Math.round(average * 10) / 10;
}

/**
 * Calculate potential upside (difference between optimistic and projected)
 * 
 * @param optimistic - Optimistic scenario value
 * @param projected - Base projected value
 * @returns Upside amount in currency units
 * 
 * @example
 * calculateUpside(3220000, 2800000) // Returns 420000
 */
export function calculateUpside(optimistic: number, projected: number): number {
  const upside = optimistic - projected;
  return Math.round(upside);
}

/**
 * Calculate downside risk (difference between projected and conservative)
 * 
 * @param projected - Base projected value
 * @param conservative - Conservative scenario value
 * @returns Downside risk amount in currency units
 * 
 * @example
 * calculateDownside(2800000, 2520000) // Returns 280000
 */
export function calculateDownside(projected: number, conservative: number): number {
  const downside = projected - conservative;
  return Math.round(downside);
}

/**
 * Aggregate multiple monthly projections into quarterly
 * 
 * @param monthlyProjections - Array of monthly data
 * @param monthsInQuarter - Number of months (typically 3)
 * @returns Aggregated quarterly projection
 * 
 * @example
 * aggregateMonthlyToQuarterly([jan, feb, mar])
 * // Returns Q1 total projection
 */
export function aggregateMonthlyToQuarterly(
  monthlyProjections: RevenuePeriodData[],
  monthsInQuarter: number = 3
): RevenuePeriodData {
  if (monthlyProjections.length === 0) {
    return {
      period: "Q X XXXX",
      projected: 0,
      conservative: 0,
      optimistic: 0,
      confidence: 0,
    };
  }
  
  const projected = monthlyProjections.reduce((sum, m) => sum + m.projected, 0);
  const conservative = monthlyProjections.reduce((sum, m) => sum + m.conservative, 0);
  const optimistic = monthlyProjections.reduce((sum, m) => sum + m.optimistic, 0);
  const actualToDate = monthlyProjections.reduce((sum, m) => sum + (m.actualToDate || 0), 0);
  
  // Weighted average confidence
  const confidenceSum = monthlyProjections.reduce((sum, m) => sum + m.confidence, 0);
  const confidence = confidenceSum / monthlyProjections.length;
  
  return {
    period: "Q X XXXX",
    projected,
    conservative,
    optimistic,
    actualToDate,
    confidence,
  };
}

/**
 * Aggregate quarterly projections into annual
 * 
 * @param quarterlyProjections - Array of quarterly data (Q1-Q4)
 * @returns Aggregated annual projection
 * 
 * @example
 * aggregateQuarterlyToAnnual([q1, q2, q3, q4])
 * // Returns full year total projection
 */
export function aggregateQuarterlyToAnnual(
  quarterlyProjections: RevenuePeriodData[]
): RevenuePeriodData {
  if (quarterlyProjections.length === 0) {
    return {
      period: "Full Year XXXX",
      projected: 0,
      conservative: 0,
      optimistic: 0,
      confidence: 0,
    };
  }
  
  const projected = quarterlyProjections.reduce((sum, q) => sum + q.projected, 0);
  const conservative = quarterlyProjections.reduce((sum, q) => sum + q.conservative, 0);
  const optimistic = quarterlyProjections.reduce((sum, q) => sum + q.optimistic, 0);
  const actualToDate = quarterlyProjections.reduce((sum, q) => sum + (q.actualToDate || 0), 0);
  
  // Weighted average confidence (can weight by quarter progress if needed)
  const confidenceSum = quarterlyProjections.reduce((sum, q) => sum + q.confidence, 0);
  const confidence = confidenceSum / quarterlyProjections.length;
  
  return {
    period: "Full Year XXXX",
    projected,
    conservative,
    optimistic,
    actualToDate,
    confidence,
  };
}

/**
 * Calculate extrapolated annual projection from partial year
 * 
 * Useful for in-year forecasting (e.g., projecting full year from Jan-Jun actuals)
 * 
 * @param actualToDate - Actual revenue through current date
 * @param monthsElapsed - Number of months elapsed in year (1-12)
 * @returns Projected full year revenue
 * 
 * @example
 * extrapolateToAnnual(1200000, 6) // 6 months of actuals
 * // Returns 2400000 (projected full year)
 */
export function extrapolateToAnnual(
  actualToDate: number,
  monthsElapsed: number
): number {
  if (monthsElapsed === 0) return 0;
  const monthsRemaining = 12 - monthsElapsed;
  const monthlyAverage = actualToDate / monthsElapsed;
  const projectedFull = actualToDate + monthlyAverage * monthsRemaining;
  return Math.round(projectedFull);
}

/**
 * Full calculation pipeline for a single revenue projection
 * 
 * Combines all calculations above into one complete transformation
 * 
 * @param data - Raw revenue data from API
 * @param historicalAccuracy - Historical accuracy (0-1)
 * @param volatility - Volatility coefficient (0-1)
 * @returns Fully calculated projection ready for UI
 * 
 * @example
 * calculateCompleteProjection({
 *   period: "Jan 2025",
 *   projected: 933333.33,
 *   conservative: 840000,
 *   optimistic: 1073333,
 *   actualToDate: 884666.67,
 *   confidence: 85
 * }, 0.92, 0.1)
 */
export function calculateCompleteProjection(
  data: RevenuePeriodData,
  historicalAccuracy: number = 0.85,
  volatility: number = 0.1
): CalculatedRevenueProjection {
  const actual = data.actualToDate || 0;
  const percentageComplete = calculatePercentageComplete(actual, data.projected);
  const variance = calculateVariance(actual, data.projected);
  const variancePercentage = calculateVariancePercentage(actual, data.projected);
  const { level: confidenceLevel, score: confidenceScore } = determineConfidenceLevel(
    variancePercentage,
    historicalAccuracy
  );
  const progress = calculateProgress(percentageComplete);
  const status = determineStatus(variancePercentage);
  const { min: scenarioMin, max: scenarioMax } = calculateScenarioRange(
    data.projected,
    volatility
  );
  
  return {
    period: data.period,
    percentageComplete,
    projected: Math.round(data.projected),
    actualToDate: Math.round(actual),
    variance: Math.round(variance),
    variancePercentage,
    progress,
    scenarioMin,
    scenarioMax,
    confidence: confidenceLevel,
    confidenceScore,
    status,
  };
}

/**
 * Calculate batch of projections
 * 
 * @param dataArray - Array of raw revenue data
 * @param historicalAccuracy - Historical accuracy (0-1)
 * @param volatility - Volatility coefficient (0-1)
 * @returns Array of calculated projections
 */
export function calculateBatchProjections(
  dataArray: RevenuePeriodData[],
  historicalAccuracy: number = 0.85,
  volatility: number = 0.1
): CalculatedRevenueProjection[] {
  return dataArray.map((data) =>
    calculateCompleteProjection(data, historicalAccuracy, volatility)
  );
}

/**
 * Determine if projection needs review based on thresholds
 * 
 * Flags projections with:
 * - Large variance (> 15%)
 * - Very low confidence (< 60)
 * - Status not "On Track"
 * 
 * @param projection - Calculated projection
 * @returns boolean indicating if needs review
 */
export function projectionNeedsReview(projection: CalculatedRevenueProjection): boolean {
  return (
    Math.abs(projection.variancePercentage) > 15 ||
    projection.confidenceScore < 60 ||
    projection.status !== "On Track"
  );
}

/**
 * Calculate run rate from YTD actual
 * 
 * Useful for annualized revenue projections
 * 
 * @param ytdActual - Year-to-date actual revenue
 * @param daysElapsed - Number of days elapsed in year
 * @returns Annualized run rate
 * 
 * @example
 * calculateRunRate(5000000, 180)
 * // Returns ~10000000 (annualized)
 */
export function calculateRunRate(ytdActual: number, daysElapsed: number): number {
  if (daysElapsed === 0) return 0;
  const dailyAverage = ytdActual / daysElapsed;
  const annualized = dailyAverage * 365;
  return Math.round(annualized);
}
