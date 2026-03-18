/**
 * Market Trend Calculations Module
 * 
 * Handles market trend analysis including:
 * - Trend impact scoring
 * - Trend velocity and momentum
 * - Business relevance assessment
 * - Risk/opportunity identification
 * - Trend lifecycle analysis
 */

export interface TrendData {
  id: string;
  category: string;
  trend: string;
  direction: "positive" | "negative" | "neutral";
  impact: "high" | "medium" | "low";
  confidence: number; // 0-100
  description: string;
  timeframe: string;
}

export interface CalculatedTrend {
  id: string;
  category: string;
  trend: string;
  direction: "positive" | "negative" | "neutral";
  impactScore: number; // 0-100
  confidenceLevel: "high" | "medium" | "low";
  businessRelevance: number; // 0-100
  riskOpportunityType: "opportunity" | "threat" | "neutral";
  urgency: "immediate" | "near-term" | "long-term";
  actionRequired: boolean;
}

/**
 * Calculate trend impact score
 * 
 * Combines impact level and confidence
 * 
 * Formula: impact_weight × (confidence / 100)
 * 
 * @param impact - Impact level (high=100, medium=50, low=25)
 * @param confidence - Confidence score (0-100)
 * @returns Impact score (0-100)
 */
export function calculateTrendImpactScore(
  impact: "high" | "medium" | "low",
  confidence: number
): number {
  const impactWeight = impact === "high" ? 100 : impact === "medium" ? 50 : 25;
  const score = (impactWeight * confidence) / 100;
  return Math.round(score);
}

/**
 * Determine confidence level category
 * 
 * @param confidenceScore - Confidence score (0-100)
 * @returns Confidence level
 */
export function determineConfidenceLevel(confidenceScore: number): "high" | "medium" | "low" {
  if (confidenceScore >= 75) return "high";
  if (confidenceScore >= 50) return "medium";
  return "low";
}

/**
 * Determine if trend is opportunity or threat
 * 
 * @param direction - Trend direction
 * @param isPositiveForBusiness - Whether trend direction aligns with business
 * @returns Risk/opportunity type
 */
export function determineTrendType(
  direction: "positive" | "negative" | "neutral",
  isPositiveForBusiness: boolean = true
): "opportunity" | "threat" | "neutral" {
  if (direction === "neutral") return "neutral";
  
  if (isPositiveForBusiness) {
    return direction === "positive" ? "opportunity" : "threat";
  } else {
    return direction === "positive" ? "threat" : "opportunity";
  }
}

/**
 * Assess business relevance of trend
 * 
 * How directly does this trend impact our business
 * 
 * @param impactScore - Trend impact score
 * @param alignmentWithStrategy - 0-100, how aligned with company strategy
 * @param marketSize - Size of affected market
 * @param ourMarketShare - Our share of affected market
 * @returns Relevance score (0-100)
 */
export function assessBusinessRelevance(
  impactScore: number,
  alignmentWithStrategy: number,
  marketSize: number,
  ourMarketShare: number,
  totalTAM: number = 50000000
): number {
  // Impact contribution (40%)
  const impactContribution = (impactScore / 100) * 40;
  
  // Strategy alignment (30%)
  const alignmentContribution = (alignmentWithStrategy / 100) * 30;
  
  // Market relevance (30%) - how much of our market does this affect
  const relevantMarketPercentage = (marketSize / totalTAM) * 100;
  const relevanceContribution = Math.min((relevantMarketPercentage / 100) * 30, 30);
  
  const relevance = impactContribution + alignmentContribution + relevanceContribution;
  return Math.round(relevance);
}

/**
 * Determine urgency of trend
 * 
 * @param impactScore - Trend impact score
 * @param confidenceLevel - Confidence level
 * @param timeframeMonths - Months until trend materializes
 * @returns Urgency level
 */
export function determineTrendUrgency(
  impactScore: number,
  confidenceLevel: "high" | "medium" | "low",
  timeframeMonths: number
): "immediate" | "near-term" | "long-term" {
  // High impact + high confidence + near-term = immediate
  if (impactScore >= 70 && confidenceLevel === "high" && timeframeMonths <= 3) {
    return "immediate";
  }
  
  // Medium-high impact + reasonable confidence + within 12 months = near-term
  if (impactScore >= 50 && timeframeMonths <= 12) {
    return "near-term";
  }
  
  // Everything else is long-term
  return "long-term";
}

/**
 * Calculate full trend analysis
 * 
 * @param data - Raw trend data
 * @param alignmentScore - How aligned trend is with business strategy (0-100)
 * @param affectedMarketSize - Size of market affected by trend
 * @param ourMarketShare - Our market share in affected market
 * @returns Fully calculated trend metrics
 */
export function calculateCompleteTrend(
  data: TrendData,
  alignmentScore: number = 50,
  affectedMarketSize: number = 10000000,
  ourMarketShare: number = 2
): CalculatedTrend {
  const impactScore = calculateTrendImpactScore(data.impact, data.confidence);
  const confidenceLevel = determineConfidenceLevel(data.confidence);
  const businessRelevance = assessBusinessRelevance(
    impactScore,
    alignmentScore,
    affectedMarketSize,
    ourMarketShare
  );
  
  const isPositiveForBusiness = alignmentScore >= 50;
  const trendType = determineTrendType(data.direction, isPositiveForBusiness);
  
  // Parse timeframe to months (e.g., "6 months", "2025 Q1")
  const timeframeMonths = parseTimeframeToMonths(data.timeframe);
  const urgency = determineTrendUrgency(impactScore, confidenceLevel, timeframeMonths);
  
  const actionRequired =
    urgency !== "long-term" &&
    (impactScore >= 50 || businessRelevance >= 60) &&
    trendType !== "neutral";
  
  return {
    id: data.id,
    category: data.category,
    trend: data.trend,
    direction: data.direction,
    impactScore,
    confidenceLevel,
    businessRelevance,
    riskOpportunityType: trendType,
    urgency,
    actionRequired,
  };
}

/**
 * Calculate batch of trends
 * 
 * @param trends - Array of trend data
 * @param alignmentScores - Map of trend ID to alignment score
 * @param affectedMarkets - Map of trend ID to affected market size
 * @returns Array of calculated trends
 */
export function calculateBatchTrends(
  trends: TrendData[],
  alignmentScores: Record<string, number> = {},
  affectedMarkets: Record<string, number> = {}
): CalculatedTrend[] {
  return trends.map((trend) => {
    const alignment = alignmentScores[trend.id] ?? 50;
    const marketSize = affectedMarkets[trend.id] ?? 10000000;
    return calculateCompleteTrend(trend, alignment, marketSize);
  });
}

/**
 * Identify key trends requiring action
 * 
 * @param trends - Array of calculated trends
 * @returns Trends that require action
 */
export function getActionableTrends(trends: CalculatedTrend[]): CalculatedTrend[] {
  return trends.filter((t) => t.actionRequired);
}

/**
 * Rank trends by impact and urgency
 * 
 * @param trends - Array of calculated trends
 * @returns Sorted trends (most critical first)
 */
export function rankTrendsByPriority(trends: CalculatedTrend[]): CalculatedTrend[] {
  return [...trends].sort((a, b) => {
    // Urgency first (immediate > near-term > long-term)
    const urgencyOrder = { immediate: 0, "near-term": 1, "long-term": 2 };
    const urgencyDiff = urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
    if (urgencyDiff !== 0) return urgencyDiff;
    
    // Then by impact score
    return b.impactScore - a.impactScore;
  });
}

/**
 * Identify opportunities from trends
 * 
 * @param trends - Array of calculated trends
 * @returns Opportunity trends
 */
export function identifyOpportunities(trends: CalculatedTrend[]): CalculatedTrend[] {
  return trends.filter((t) => t.riskOpportunityType === "opportunity");
}

/**
 * Identify threats from trends
 * 
 * @param trends - Array of calculated trends
 * @returns Threat trends
 */
export function identifyThreats(trends: CalculatedTrend[]): CalculatedTrend[] {
  return trends.filter((t) => t.riskOpportunityType === "threat");
}

/**
 * Calculate trend momentum
 * 
 * Measures acceleration of trend
 * 
 * @param confidenceHistory - Array of confidence scores over time
 * @returns Momentum value (-100 to +100)
 */
export function calculateTrendMomentum(confidenceHistory: number[]): number {
  if (confidenceHistory.length < 2) return 0;
  
  // Simple momentum: recent change
  const recent = confidenceHistory.slice(-3); // Last 3 periods
  if (recent.length < 2) return 0;
  
  const change = recent[recent.length - 1] - recent[0];
  const momentum = (change / recent[0]) * 100;
  
  return Math.round(momentum);
}

/**
 * Assess trend lifecycle stage
 * 
 * @param trend - Calculated trend
 * @returns Lifecycle stage
 */
export function assessTrendLifecycle(trend: CalculatedTrend): "emerging" | "growing" | "mature" | "declining" {
  if (trend.urgency === "immediate") {
    return trend.confidenceLevel === "low" ? "emerging" : "growing";
  }
  
  if (trend.urgency === "near-term") {
    return "growing";
  }
  
  // Long-term trends
  if (trend.impactScore < 30) {
    return "declining";
  }
  
  return "mature";
}

/**
 * Calculate trend portfolio health
 * 
 * Overall assessment of trends affecting business
 * 
 * @param trends - Array of calculated trends
 * @returns Portfolio health assessment
 */
export function assessTrendPortfolioHealth(trends: CalculatedTrend[]): {
  opportunityCount: number;
  threatCount: number;
  netOpportunity: number;
  actionRequiredCount: number;
  urgentActionCount: number;
  overallHealth: "strong" | "balanced" | "concerning";
} {
  const opportunities = identifyOpportunities(trends).length;
  const threats = identifyThreats(trends).length;
  const netOpp = opportunities - threats;
  const actionRequired = trends.filter((t) => t.actionRequired).length;
  const urgent = trends.filter((t) => t.urgency === "immediate").length;
  
  let health: "strong" | "balanced" | "concerning";
  if (opportunities > threats && actionRequired <= 3) {
    health = "strong";
  } else if (Math.abs(netOpp) <= 2 && actionRequired <= 5) {
    health = "balanced";
  } else {
    health = "concerning";
  }
  
  return {
    opportunityCount: opportunities,
    threatCount: threats,
    netOpportunity: netOpp,
    actionRequiredCount: actionRequired,
    urgentActionCount: urgent,
    overallHealth: health,
  };
}

/**
 * Helper: Parse timeframe string to months
 * 
 * @param timeframe - Timeframe string (e.g., "6 months", "2025 Q2")
 * @returns Approximate months
 */
function parseTimeframeToMonths(timeframe: string): number {
  const lower = timeframe.toLowerCase();
  
  // Explicit month mentions
  if (lower.includes("month")) {
    const match = lower.match(/(\d+)\s*month/);
    if (match) return parseInt(match[1]);
  }
  
  // Quarter mentions
  if (lower.includes("q")) {
    const match = lower.match(/q(\d)/);
    if (match) {
      const q = parseInt(match[1]);
      return q * 3;
    }
  }
  
  // Year mentions
  if (lower.includes("year")) {
    const match = lower.match(/(\d+)\s*year/);
    if (match) return parseInt(match[1]) * 12;
  }
  
  // Default to 6 months if unclear
  return 6;
}

/**
 * Calculate trend exposure index
 * 
 * How exposed is business to identified trends
 * 
 * @param trends - Array of calculated trends
 * @param ourMarketShare - Our market share (%)
 * @returns Exposure index (0-100)
 */
export function calculateTrendExposure(
  trends: CalculatedTrend[],
  ourMarketShare: number = 2
): number {
  const avgRelevance = trends.length > 0
    ? trends.reduce((sum, t) => sum + t.businessRelevance, 0) / trends.length
    : 0;
  
  // Exposure = relevance × market share (higher share = higher exposure)
  const exposure = (avgRelevance / 100) * Math.min(ourMarketShare * 10, 100);
  
  return Math.round(exposure);
}

/**
 * Recommend strategy response to trend
 * 
 * @param trend - Calculated trend
 * @returns Recommended response
 */
export function recommendStrategyResponse(trend: CalculatedTrend): string {
  if (trend.riskOpportunityType === "opportunity") {
    if (trend.urgency === "immediate") {
      return "Capitalize immediately - allocate resources to exploit";
    }
    if (trend.urgency === "near-term") {
      return "Develop strategy - prepare for market shift";
    }
    return "Monitor for potential upside";
  }
  
  if (trend.riskOpportunityType === "threat") {
    if (trend.urgency === "immediate") {
      return "Mitigate urgently - develop contingency plan";
    }
    if (trend.urgency === "near-term") {
      return "Prepare defenses - strengthen competitive position";
    }
    return "Monitor and plan ahead";
  }
  
  return "Track trend development";
}
