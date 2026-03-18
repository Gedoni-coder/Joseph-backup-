/**
 * Demand Forecast Calculations Module
 * 
 * Handles demand forecasting including:
 * - Demand projections
 * - Scenario analysis
 * - Forecast accuracy assessment
 * - Growth factor calculations
 */

export interface ForecastData {
  id: string;
  product: string;
  currentDemand: number;
  forecastDemand: number;
  timeframe: string;
  confidence: "High" | "Medium" | "Low";
  methodology: string;
}

export interface ForecastScenario {
  name: string;
  demandLevel: number;
  probability: number; // 0-100
}

export interface CalculatedForecast {
  id: string;
  product: string;
  currentDemand: number;
  forecastedDemand: number;
  growthRate: number;
  growthAmount: number;
  confidenceScore: number;
  demandVelocity: number;
  scenarioWeightedAverage: number;
  forecastReliability: "high" | "medium" | "low";
  riskLevel: "low" | "medium" | "high";
  recommendation: string;
}

/**
 * Calculate demand growth rate
 * 
 * Formula: ((Forecast - Current) / Current) × 100
 * 
 * @param currentDemand - Current demand level
 * @param forecastedDemand - Forecasted demand level
 * @returns Growth rate as percentage
 */
export function calculateDemandGrowthRate(currentDemand: number, forecastedDemand: number): number {
  if (currentDemand === 0) return 0;
  const growth = ((forecastedDemand - currentDemand) / currentDemand) * 100;
  return Math.round(growth * 10) / 10;
}

/**
 * Calculate demand growth amount
 * 
 * @param forecastedDemand - Forecasted demand
 * @param currentDemand - Current demand
 * @returns Absolute growth amount
 */
export function calculateDemandGrowthAmount(forecastedDemand: number, currentDemand: number): number {
  return Math.round(forecastedDemand - currentDemand);
}

/**
 * Convert confidence text to numeric score
 * 
 * @param confidence - Confidence level (High/Medium/Low)
 * @returns Numeric score (0-100)
 */
export function convertConfidenceToScore(confidence: "High" | "Medium" | "Low"): number {
  switch (confidence) {
    case "High":
      return 85;
    case "Medium":
      return 65;
    case "Low":
      return 40;
  }
}

/**
 * Calculate demand velocity
 * 
 * Rate of change per month
 * 
 * @param forecastedDemand - Forecasted demand
 * @param currentDemand - Current demand
 * @param monthsUntilForecast - Months to forecast period
 * @returns Monthly change rate
 */
export function calculateDemandVelocity(
  forecastedDemand: number,
  currentDemand: number,
  monthsUntilForecast: number = 12
): number {
  if (monthsUntilForecast === 0) return 0;
  const totalChange = forecastedDemand - currentDemand;
  const monthlyChange = totalChange / monthsUntilForecast;
  return Math.round(monthlyChange);
}

/**
 * Calculate weighted average of forecast scenarios
 * 
 * @param scenarios - Array of forecast scenarios
 * @returns Weighted average demand
 */
export function calculateScenarioWeightedAverage(scenarios: ForecastScenario[]): number {
  if (scenarios.length === 0) return 0;
  
  const totalProbability = scenarios.reduce((sum, s) => sum + s.probability, 0);
  if (totalProbability === 0) return 0;
  
  const weightedSum = scenarios.reduce((sum, s) => {
    return sum + s.demandLevel * (s.probability / 100);
  }, 0);
  
  return Math.round(weightedSum);
}

/**
 * Assess forecast reliability
 * 
 * Based on confidence and consistency
 * 
 * @param confidenceScore - Confidence score (0-100)
 * @param growthRate - Growth rate (%)
 * @returns Reliability level
 */
export function assessForecastReliability(
  confidenceScore: number,
  growthRate: number
): "high" | "medium" | "low" {
  // Extreme growth rates are less reliable
  const extremeGrowth = Math.abs(growthRate) > 50;
  
  // High confidence + moderate growth = high reliability
  if (confidenceScore >= 80 && !extremeGrowth) {
    return "high";
  }
  
  // Medium confidence = medium reliability
  if (confidenceScore >= 60) {
    return "medium";
  }
  
  return "low";
}

/**
 * Assess forecast risk level
 * 
 * @param reliabilityLevel - Forecast reliability
 * @param growthRate - Growth rate (%)
 * @param confidenceScore - Confidence score
 * @returns Risk level
 */
export function assessForecastRisk(
  reliabilityLevel: "high" | "medium" | "low",
  growthRate: number,
  confidenceScore: number
): "low" | "medium" | "high" {
  const extremeGrowth = Math.abs(growthRate) > 50;
  const lowConfidence = confidenceScore < 60;
  
  if (reliabilityLevel === "high" && !extremeGrowth) {
    return "low";
  }
  
  if (reliabilityLevel === "low" || extremeGrowth || lowConfidence) {
    return "high";
  }
  
  return "medium";
}

/**
 * Generate forecast recommendation
 * 
 * @param reliabilityLevel - Forecast reliability
 * @param riskLevel - Risk level
 * @param growthRate - Growth rate
 * @returns Actionable recommendation
 */
export function generateForecastRecommendation(
  reliabilityLevel: "high" | "medium" | "low",
  riskLevel: "low" | "medium" | "high",
  growthRate: number
): string {
  if (reliabilityLevel === "low") {
    return "Forecast unreliable - collect more data before major planning decisions";
  }
  
  if (riskLevel === "high" && Math.abs(growthRate) > 50) {
    return "Extreme growth projected - validate assumptions carefully";
  }
  
  if (growthRate > 30) {
    return "Strong growth expected - prepare expansion planning";
  }
  
  if (growthRate < -20) {
    return "Demand decline expected - review market position and strategy";
  }
  
  if (reliabilityLevel === "high") {
    return "Forecast reliable - use for operational planning";
  }
  
  return "Forecast moderate reliability - plan with contingencies";
}

/**
 * Calculate complete forecast
 * 
 * @param data - Raw forecast data
 * @param scenarios - Forecast scenarios (optional)
 * @returns Fully calculated forecast
 */
export function calculateCompleteForecast(
  data: ForecastData,
  scenarios: ForecastScenario[] = []
): CalculatedForecast {
  const growthRate = calculateDemandGrowthRate(data.currentDemand, data.forecastDemand);
  const growthAmount = calculateDemandGrowthAmount(data.forecastDemand, data.currentDemand);
  const confidenceScore = convertConfidenceToScore(data.confidence);
  const demandVelocity = calculateDemandVelocity(data.forecastDemand, data.currentDemand);
  
  const scenarioAverage =
    scenarios.length > 0 ? calculateScenarioWeightedAverage(scenarios) : data.forecastDemand;
  
  const reliability = assessForecastReliability(confidenceScore, growthRate);
  const riskLevel = assessForecastRisk(reliability, growthRate, confidenceScore);
  const recommendation = generateForecastRecommendation(reliability, riskLevel, growthRate);
  
  return {
    id: data.id,
    product: data.product,
    currentDemand: Math.round(data.currentDemand),
    forecastedDemand: Math.round(data.forecastDemand),
    growthRate,
    growthAmount,
    confidenceScore,
    demandVelocity,
    scenarioWeightedAverage: Math.round(scenarioAverage),
    forecastReliability: reliability,
    riskLevel,
    recommendation,
  };
}

/**
 * Calculate batch of forecasts
 * 
 * @param forecasts - Array of forecast data
 * @param scenarioData - Map of forecast ID to scenarios
 * @returns Array of calculated forecasts
 */
export function calculateBatchForecasts(
  forecasts: ForecastData[],
  scenarioData: Record<string, ForecastScenario[]> = {}
): CalculatedForecast[] {
  return forecasts.map((forecast) => {
    const scenarios = scenarioData[forecast.id] ?? [];
    return calculateCompleteForecast(forecast, scenarios);
  });
}

/**
 * Identify forecasts with high growth potential
 * 
 * @param forecasts - Array of calculated forecasts
 * @param growthThreshold - Minimum growth rate (%)
 * @returns High-growth forecasts
 */
export function getHighGrowthForecasts(
  forecasts: CalculatedForecast[],
  growthThreshold: number = 20
): CalculatedForecast[] {
  return forecasts.filter((f) => f.growthRate >= growthThreshold);
}

/**
 * Identify forecasts with decline risk
 * 
 * @param forecasts - Array of calculated forecasts
 * @returns Forecasts with negative growth
 */
export function getDeclineRiskForecasts(forecasts: CalculatedForecast[]): CalculatedForecast[] {
  return forecasts.filter((f) => f.growthRate < 0);
}

/**
 * Calculate aggregate demand forecast
 * 
 * Sum of all forecasted demands
 * 
 * @param forecasts - Array of calculated forecasts
 * @returns Total forecasted demand
 */
export function calculateAggregateForecast(forecasts: CalculatedForecast[]): number {
  return forecasts.reduce((sum, f) => sum + f.forecastedDemand, 0);
}

/**
 * Calculate aggregate current demand
 * 
 * @param forecasts - Array of calculated forecasts
 * @returns Total current demand
 */
export function calculateAggregateCurrentDemand(forecasts: CalculatedForecast[]): number {
  return forecasts.reduce((sum, f) => sum + f.currentDemand, 0);
}

/**
 * Calculate portfolio growth rate
 * 
 * Overall growth across all forecasts
 * 
 * @param forecasts - Array of calculated forecasts
 * @returns Portfolio growth rate
 */
export function calculatePortfolioGrowthRate(forecasts: CalculatedForecast[]): number {
  const currentTotal = calculateAggregateCurrentDemand(forecasts);
  const forecastedTotal = calculateAggregateForecast(forecasts);
  
  return calculateDemandGrowthRate(currentTotal, forecastedTotal);
}

/**
 * Assess forecast confidence distribution
 * 
 * @param forecasts - Array of calculated forecasts
 * @returns Distribution of confidence levels
 */
export function assessConfidenceDistribution(
  forecasts: CalculatedForecast[]
): {
  highConfidence: number;
  mediumConfidence: number;
  lowConfidence: number;
  averageConfidence: number;
} {
  const high = forecasts.filter((f) => f.confidenceScore >= 80).length;
  const medium = forecasts.filter((f) => f.confidenceScore >= 60 && f.confidenceScore < 80).length;
  const low = forecasts.filter((f) => f.confidenceScore < 60).length;
  
  const avg = forecasts.length > 0
    ? forecasts.reduce((sum, f) => sum + f.confidenceScore, 0) / forecasts.length
    : 0;
  
  return {
    highConfidence: high,
    mediumConfidence: medium,
    lowConfidence: low,
    averageConfidence: Math.round(avg),
  };
}

/**
 * Forecast sensitivity analysis
 * 
 * Show impact of confidence change on forecast
 * 
 * @param currentForecast - Current forecasted demand
 * @param currentConfidence - Current confidence score
 * @param scenarioConfidence - Scenario confidence score
 * @returns Adjusted forecast
 */
export function sensitivityAnalysis(
  currentForecast: number,
  currentConfidence: number,
  scenarioConfidence: number
): number {
  const confidenceChange = (scenarioConfidence - currentConfidence) / currentConfidence;
  const adjustedForecast = currentForecast * (1 + confidenceChange * 0.5); // 50% sensitivity
  return Math.round(adjustedForecast);
}

/**
 * Multi-scenario forecast summary
 * 
 * @param baselineScenario - Most likely scenario
 * @param optimisticScenario - Best case scenario
 * @param pessimisticScenario - Worst case scenario
 * @returns Scenario range
 */
export function createScenarioRange(
  baselineScenario: number,
  optimisticScenario: number,
  pessimisticScenario: number
): {
  min: number;
  baseline: number;
  max: number;
  range: number;
  upside: number;
  downside: number;
} {
  const min = Math.min(pessimisticScenario, baselineScenario, optimisticScenario);
  const max = Math.max(pessimisticScenario, baselineScenario, optimisticScenario);
  
  return {
    min,
    baseline: Math.round(baselineScenario),
    max,
    range: max - min,
    upside: max - baselineScenario,
    downside: baselineScenario - min,
  };
}

/**
 * Forecast accuracy estimation
 * 
 * Based on methodology and confidence
 * 
 * @param methodology - Forecasting methodology
 * @param confidenceScore - Confidence score
 * @returns Estimated accuracy (0-100%)
 */
export function estimateForecastAccuracy(methodology: string, confidenceScore: number): number {
  // Base accuracy by methodology
  const methodAccuracy: Record<string, number> = {
    "time-series": 75,
    regression: 70,
    exponential: 72,
    "machine-learning": 80,
    expert: 65,
    "bottom-up": 70,
    "top-down": 65,
  };
  
  const methodBase = Object.entries(methodAccuracy).find(([m]) =>
    methodology.toLowerCase().includes(m)
  )?.[1] ?? 70;
  
  // Adjust by confidence
  const confidenceMultiplier = confidenceScore / 100;
  const estimatedAccuracy = methodBase * confidenceMultiplier;
  
  return Math.round(estimatedAccuracy);
}
