/**
 * Competitor Calculations Module
 * 
 * Handles competitive analysis including:
 * - Competitor positioning
 * - Market share analysis
 * - Threat assessment
 * - Competitive advantage measurement
 * - SWOT impact scoring
 */

export interface CompetitorData {
  id: string;
  name: string;
  marketShare: number; // As percentage
  growthRate: number;
  customerSatisfaction: number; // 0-100
  innovationScore: number; // 0-100
  pricePosition: "premium" | "standard" | "discount";
  strengths: string[];
  weaknesses: string[];
}

export interface CalculatedCompetitor {
  id: string;
  name: string;
  marketShare: number;
  marketShareTrend: "growing" | "stable" | "declining";
  competitivePosition: number; // 0-100
  positionRank: number;
  threatLevel: "high" | "medium" | "low";
  strengthCount: number;
  weaknessCount: number;
  netStrengthPosition: number;
  growthRate: number;
}

/**
 * Calculate competitive position score
 * 
 * Weighted combination of market metrics:
 * - Market Share (30%)
 * - Customer Satisfaction (30%)
 * - Innovation Score (25%)
 * - Growth Rate (15%)
 * 
 * @param marketShare - Market share percentage
 * @param satisfaction - Customer satisfaction (0-100)
 * @param innovation - Innovation score (0-100)
 * @param growth - Growth rate (%)
 * @returns Competitive position score (0-100)
 */
export function calculateCompetitivePosition(
  marketShare: number,
  satisfaction: number,
  innovation: number,
  growth: number
): number {
  // Normalize market share (assume max 50% is top)
  const shareScore = Math.min((marketShare / 50) * 100, 100);
  
  // Satisfaction is already 0-100
  const satScore = satisfaction;
  
  // Innovation is already 0-100
  const innovScore = innovation;
  
  // Growth score (assume 30% is excellent)
  const growthScore = Math.min((growth / 30) * 100, 100);
  
  // Weighted average
  const position = shareScore * 0.3 + satScore * 0.3 + innovScore * 0.25 + growthScore * 0.15;
  
  return Math.round(position);
}

/**
 * Determine threat level
 * 
 * Based on competitive position and growth
 * 
 * @param position - Competitive position score (0-100)
 * @param growth - Growth rate (%)
 * @param ourPosition - Our competitive position (for comparison)
 * @returns Threat level
 */
export function determineThreatLevel(
  position: number,
  growth: number,
  ourPosition: number = 50
): "high" | "medium" | "low" {
  // Growing competitor in strong position = high threat
  if (position >= ourPosition && growth > 15) {
    return "high";
  }
  
  // Strong competitor regardless of growth
  if (position > 75) {
    return "high";
  }
  
  // Fast growing
  if (growth > 25) {
    return "medium";
  }
  
  // Moderate threat
  if (position >= ourPosition) {
    return "medium";
  }
  
  // Weak competitor
  return "low";
}

/**
 * Determine market share trend
 * 
 * @param currentShare - Current market share
 * @param previousShare - Previous market share
 * @param growthRate - Growth rate (%)
 * @returns Market share trend
 */
export function determineMarketShareTrend(
  currentShare: number,
  previousShare: number,
  growthRate: number
): "growing" | "stable" | "declining" {
  const changePercent = ((currentShare - previousShare) / previousShare) * 100;
  
  if (changePercent > 5 || growthRate > 20) {
    return "growing";
  }
  
  if (changePercent < -5 || growthRate < 0) {
    return "declining";
  }
  
  return "stable";
}

/**
 * Calculate net strength position
 * 
 * Difference between strengths and weaknesses
 * Weighted by impact
 * 
 * @param strengthCount - Number of strengths
 * @param weaknessCount - Number of weaknesses
 * @returns Net strength position (can be negative)
 */
export function calculateNetStrengthPosition(strengthCount: number, weaknessCount: number): number {
  return strengthCount - weaknessCount;
}

/**
 * Calculate full competitor analysis
 * 
 * @param data - Raw competitor data
 * @param ourPosition - Our competitive position (for benchmarking)
 * @param previousMarketShare - Previous period market share (for trend)
 * @param competitorRank - Competitor's rank in market (1 = highest)
 * @returns Fully calculated competitor metrics
 */
export function calculateCompleteCompetitor(
  data: CompetitorData,
  ourPosition: number = 50,
  previousMarketShare: number = 0,
  competitorRank: number = 1
): CalculatedCompetitor {
  const position = calculateCompetitivePosition(
    data.marketShare,
    data.customerSatisfaction,
    data.innovationScore,
    data.growthRate
  );
  
  const threat = determineThreatLevel(position, data.growthRate, ourPosition);
  
  const trend = determineMarketShareTrend(
    data.marketShare,
    previousMarketShare || data.marketShare,
    data.growthRate
  );
  
  const netStrength = calculateNetStrengthPosition(data.strengths.length, data.weaknesses.length);
  
  return {
    id: data.id,
    name: data.name,
    marketShare: Math.round(data.marketShare * 100) / 100,
    marketShareTrend: trend,
    competitivePosition: position,
    positionRank: competitorRank,
    threatLevel: threat,
    strengthCount: data.strengths.length,
    weaknessCount: data.weaknesses.length,
    netStrengthPosition: netStrength,
    growthRate: data.growthRate,
  };
}

/**
 * Calculate batch of competitors
 * 
 * @param competitors - Array of competitor data
 * @param ourPosition - Our competitive position
 * @param previousMarketShares - Map of competitor to previous market share
 * @returns Array of calculated competitors, sorted by position
 */
export function calculateBatchCompetitors(
  competitors: CompetitorData[],
  ourPosition: number = 50,
  previousMarketShares: Record<string, number> = {}
): CalculatedCompetitor[] {
  // Sort by market share to assign ranks
  const sorted = [...competitors].sort((a, b) => b.marketShare - a.marketShare);
  
  return sorted.map((comp, index) => {
    const previous = previousMarketShares[comp.id] ?? comp.marketShare;
    return calculateCompleteCompetitor(comp, ourPosition, previous, index + 1);
  });
}

/**
 * Calculate competitive intensity
 * 
 * Measures how fragmented or concentrated the market is
 * Based on HHI (Herfindahl-Hirschman Index)
 * 
 * @param competitors - Array of calculated competitors
 * @returns Competitive intensity (0-10000)
 * Low: < 1500 (fragmented)
 * Medium: 1500-2500
 * High: > 2500 (concentrated)
 */
export function calculateCompetitiveIntensity(competitors: CalculatedCompetitor[]): number {
  const hhi = competitors.reduce((sum, comp) => {
    return sum + comp.marketShare * comp.marketShare;
  }, 0);
  
  return Math.round(hhi * 100); // Scale to 0-10000
}

/**
 * Identify market leaders
 * 
 * @param competitors - Array of calculated competitors
 * @param threshold - Minimum market share % to be considered leader
 * @returns Top competitors
 */
export function getMarketLeaders(
  competitors: CalculatedCompetitor[],
  threshold: number = 15
): CalculatedCompetitor[] {
  return competitors.filter((c) => c.marketShare >= threshold);
}

/**
 * Identify rising competitors
 * 
 * @param competitors - Array of calculated competitors
 * @param growthThreshold - Minimum growth rate to be rising
 * @returns Rising competitors
 */
export function getRisingCompetitors(
  competitors: CalculatedCompetitor[],
  growthThreshold: number = 20
): CalculatedCompetitor[] {
  return competitors.filter((c) => c.growthRate >= growthThreshold && c.marketShareTrend === "growing");
}

/**
 * Identify weakening competitors
 * 
 * @param competitors - Array of calculated competitors
 * @returns Declining competitors
 */
export function getWeakeningCompetitors(
  competitors: CalculatedCompetitor[]
): CalculatedCompetitor[] {
  return competitors.filter((c) => c.marketShareTrend === "declining" && c.growthRate < 0);
}

/**
 * Calculate competitive advantage assessment
 * 
 * Compares our position to each competitor
 * 
 * @param ourPosition - Our competitive position (0-100)
 * @param competitorPosition - Competitor's position (0-100)
 * @param ourStrengths - Our key strengths
 * @param competitorStrengths - Competitor's strengths
 * @returns Advantage assessment
 */
export function calculateAdvantageVsCompetitor(
  ourPosition: number,
  competitorPosition: number,
  ourStrengths: number,
  competitorStrengths: number
): {
  advantageGap: number;
  advantageType: "clear" | "slight" | "parity" | "disadvantage";
  strengthDifferential: number;
} {
  const advantageGap = ourPosition - competitorPosition;
  const strengthDiff = ourStrengths - competitorStrengths;
  
  let advantageType: "clear" | "slight" | "parity" | "disadvantage";
  if (advantageGap > 15) {
    advantageType = "clear";
  } else if (advantageGap > 5) {
    advantageType = "slight";
  } else if (advantageGap > -5) {
    advantageType = "parity";
  } else {
    advantageType = "disadvantage";
  }
  
  return {
    advantageGap,
    advantageType,
    strengthDifferential: strengthDiff,
  };
}

/**
 * Calculate competitive threat score
 * 
 * Comprehensive measure of competitive threat
 * 
 * @param threatLevel - Threat level assessment
 * @param position - Competitor's position (0-100)
 * @param growth - Competitor's growth rate
 * @param marketShare - Competitor's market share
 * @returns Threat score (0-100)
 */
export function calculateThreatScore(
  threatLevel: "high" | "medium" | "low",
  position: number,
  growth: number,
  marketShare: number
): number {
  let baseScore = 0;
  if (threatLevel === "high") baseScore = 70;
  else if (threatLevel === "medium") baseScore = 50;
  else baseScore = 30;
  
  // Adjust for position
  const positionBoost = (position / 100) * 20;
  
  // Adjust for growth
  const growthBoost = Math.min((growth / 30) * 10, 10);
  
  // Adjust for market share
  const shareBoost = Math.min((marketShare / 30) * 10, 10);
  
  const totalScore = baseScore + positionBoost + growthBoost + shareBoost;
  
  return Math.round(Math.min(totalScore, 100));
}

/**
 * Analyze competitive landscape
 * 
 * Overall market structure assessment
 * 
 * @param competitors - Array of calculated competitors
 * @returns Landscape analysis
 */
export function analyzeCompetitiveLandscape(competitors: CalculatedCompetitor[]): {
  structure: "monopoly" | "oligopoly" | "competitive" | "fragmented";
  leaderCount: number;
  averagePosition: number;
  marketConcentration: number;
  averageGrowth: number;
} {
  if (competitors.length === 0) {
    return {
      structure: "monopoly",
      leaderCount: 0,
      averagePosition: 0,
      marketConcentration: 0,
      averageGrowth: 0,
    };
  }
  
  const leaders = competitors.filter((c) => c.marketShare >= 15).length;
  const avgPosition = competitors.reduce((sum, c) => sum + c.competitivePosition, 0) / competitors.length;
  const intensity = calculateCompetitiveIntensity(competitors);
  const avgGrowth = competitors.reduce((sum, c) => sum + c.growthRate, 0) / competitors.length;
  
  let structure: "monopoly" | "oligopoly" | "competitive" | "fragmented";
  if (leaders === 1 && competitors[0].marketShare > 50) {
    structure = "monopoly";
  } else if (leaders <= 3 && intensity < 2500) {
    structure = "oligopoly";
  } else if (intensity < 1500) {
    structure = "fragmented";
  } else {
    structure = "competitive";
  }
  
  return {
    structure,
    leaderCount: leaders,
    averagePosition: Math.round(avgPosition),
    marketConcentration: Math.round(intensity),
    averageGrowth: Math.round(avgGrowth * 10) / 10,
  };
}

/**
 * Calculate market share if company reaches growth target
 * 
 * @param currentShare - Current market share
 * @param targetGrowth - Target growth rate
 * @param marketGrowth - Expected market growth
 * @param years - Years to project
 * @returns Projected market share
 */
export function projectMarketShare(
  currentShare: number,
  targetGrowth: number,
  marketGrowth: number,
  years: number = 1
): number {
  // Assuming competitor growth rates are similar to market
  const shareGain = currentShare * Math.pow(1 + (targetGrowth - marketGrowth) / 100, years);
  return Math.round(shareGain * 100) / 100;
}

/**
 * Identify competitive vulnerabilities
 * 
 * Areas where competitors are weak
 * 
 * @param competitors - Array of calculated competitors
 * @returns Map of competitor to vulnerabilities
 */
export function identifyVulnerabilities(
  competitors: CalculatedCompetitor[]
): Record<string, { weaknessCount: number; netPosition: number; opportunity: "high" | "medium" | "low" }> {
  const vulnerabilities: Record<string, any> = {};
  
  competitors.forEach((comp) => {
    const opportunityLevel =
      comp.weaknessCount >= 3 && comp.netStrengthPosition < 0
        ? "high"
        : comp.weaknessCount >= 2
          ? "medium"
          : "low";
    
    vulnerabilities[comp.id] = {
      weaknessCount: comp.weaknessCount,
      netPosition: comp.netStrengthPosition,
      opportunity: opportunityLevel,
    };
  });
  
  return vulnerabilities;
}
