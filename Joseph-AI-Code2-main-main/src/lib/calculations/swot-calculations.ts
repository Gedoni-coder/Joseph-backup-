/**
 * SWOT Calculations Module
 * 
 * Handles SWOT analysis including:
 * - SWOT scoring
 * - Strategic position assessment
 * - Competitive advantage analysis
 * - Strategic recommendation
 */

export interface SWOTItem {
  name: string;
  impact: "high" | "medium" | "low";
}

export interface SWOTData {
  id: string;
  competitorId?: string;
  strengths: SWOTItem[];
  weaknesses: SWOTItem[];
  opportunities: SWOTItem[];
  threats: SWOTItem[];
}

export interface CalculatedSWOT {
  id: string;
  competitorId?: string;
  strengthScore: number;
  weaknessScore: number;
  opportunityScore: number;
  threatScore: number;
  swotScore: number; // Net score
  strategicPosition: "very-strong" | "strong" | "neutral" | "weak" | "very-weak";
  strategicFocus: string;
  recommendations: string[];
}

/**
 * Calculate strength score
 * 
 * Sum of strength impacts weighted
 * 
 * @param strengths - Array of strength items
 * @returns Strength score (0-100)
 */
export function calculateStrengthScore(strengths: SWOTItem[]): number {
  if (strengths.length === 0) return 0;
  
  const total = strengths.reduce((sum, s) => {
    const weight = s.impact === "high" ? 100 : s.impact === "medium" ? 50 : 25;
    return sum + weight;
  }, 0);
  
  const maxPossible = strengths.length * 100;
  return Math.round((total / maxPossible) * 100);
}

/**
 * Calculate weakness score
 * 
 * @param weaknesses - Array of weakness items
 * @returns Weakness score (0-100), where 100 = very weak
 */
export function calculateWeaknessScore(weaknesses: SWOTItem[]): number {
  if (weaknesses.length === 0) return 0;
  
  const total = weaknesses.reduce((sum, w) => {
    const weight = w.impact === "high" ? 100 : w.impact === "medium" ? 50 : 25;
    return sum + weight;
  }, 0);
  
  const maxPossible = weaknesses.length * 100;
  return Math.round((total / maxPossible) * 100);
}

/**
 * Calculate opportunity score
 * 
 * @param opportunities - Array of opportunity items
 * @returns Opportunity score (0-100)
 */
export function calculateOpportunityScore(opportunities: SWOTItem[]): number {
  if (opportunities.length === 0) return 0;
  
  const total = opportunities.reduce((sum, o) => {
    const weight = o.impact === "high" ? 100 : o.impact === "medium" ? 50 : 25;
    return sum + weight;
  }, 0);
  
  const maxPossible = opportunities.length * 100;
  return Math.round((total / maxPossible) * 100);
}

/**
 * Calculate threat score
 * 
 * @param threats - Array of threat items
 * @returns Threat score (0-100), where 100 = very threatened
 */
export function calculateThreatScore(threats: SWOTItem[]): number {
  if (threats.length === 0) return 0;
  
  const total = threats.reduce((sum, t) => {
    const weight = t.impact === "high" ? 100 : t.impact === "medium" ? 50 : 25;
    return sum + weight;
  }, 0);
  
  const maxPossible = threats.length * 100;
  return Math.round((total / maxPossible) * 100);
}

/**
 * Calculate overall SWOT score
 * 
 * Formula: (Strengths + Opportunities) - (Weaknesses + Threats)
 * Ranges from -100 to +100
 * 
 * @param strengthScore - Strength score
 * @param weaknessScore - Weakness score
 * @param opportunityScore - Opportunity score
 * @param threatScore - Threat score
 * @returns SWOT score
 */
export function calculateSWOTScore(
  strengthScore: number,
  weaknessScore: number,
  opportunityScore: number,
  threatScore: number
): number {
  const positive = strengthScore + opportunityScore;
  const negative = weaknessScore + threatScore;
  const score = (positive - negative) / 2; // Normalize to -100 to +100
  return Math.round(score);
}

/**
 * Determine strategic position
 * 
 * @param swotScore - Overall SWOT score (-100 to +100)
 * @returns Strategic position
 */
export function determineStrategicPosition(
  swotScore: number
): "very-strong" | "strong" | "neutral" | "weak" | "very-weak" {
  if (swotScore >= 60) return "very-strong";
  if (swotScore >= 20) return "strong";
  if (swotScore >= -20) return "neutral";
  if (swotScore >= -60) return "weak";
  return "very-weak";
}

/**
 * Recommend strategic focus
 * 
 * Based on SWOT scores
 * 
 * @param strengthScore - Strength score
 * @param weaknessScore - Weakness score
 * @param opportunityScore - Opportunity score
 * @param threatScore - Threat score
 * @returns Strategic focus recommendation
 */
export function recommendStrategicFocus(
  strengthScore: number,
  weaknessScore: number,
  opportunityScore: number,
  threatScore: number
): string {
  // SO Strategy: Aggressive Growth (Strengths + Opportunities)
  if (strengthScore >= 60 && opportunityScore >= 60) {
    return "SO: Leverage strengths to capitalize on opportunities - Aggressive Growth";
  }
  
  // WO Strategy: Development (Weaknesses + Opportunities)
  if (weaknessScore >= 60 && opportunityScore >= 60) {
    return "WO: Build capabilities to seize opportunities - Capability Development";
  }
  
  // ST Strategy: Defense (Strengths + Threats)
  if (strengthScore >= 60 && threatScore >= 60) {
    return "ST: Use strengths to counter threats - Defensive Positioning";
  }
  
  // WT Strategy: Survival (Weaknesses + Threats)
  if (weaknessScore >= 60 && threatScore >= 60) {
    return "WT: Address critical weaknesses and threats - Survival Mode";
  }
  
  // Balanced approach
  return "Balanced approach: Address weaknesses while leveraging opportunities";
}

/**
 * Generate strategic recommendations
 * 
 * @param position - Strategic position
 * @param strengthScore - Strength score
 * @param weaknessScore - Weakness score
 * @returns Array of recommendations
 */
export function generateRecommendations(
  position: "very-strong" | "strong" | "neutral" | "weak" | "very-weak",
  strengthScore: number,
  weaknessScore: number
): string[] {
  const recommendations: string[] = [];
  
  switch (position) {
    case "very-strong":
      recommendations.push("Pursue aggressive expansion and market share growth");
      recommendations.push("Invest in R&D to maintain competitive advantage");
      recommendations.push("Consider strategic partnerships or acquisitions");
      break;
    
    case "strong":
      recommendations.push("Focus on selective growth in high-potential areas");
      recommendations.push("Strengthen brand positioning");
      recommendations.push("Invest in capability enhancement");
      break;
    
    case "neutral":
      recommendations.push("Focus on differentiating capabilities");
      recommendations.push("Address critical weaknesses");
      recommendations.push("Stabilize market position");
      break;
    
    case "weak":
      recommendations.push("Address fundamental weaknesses urgently");
      recommendations.push("Consider strategic partnerships for strength");
      recommendations.push("Focus on niche markets for stability");
      break;
    
    case "very-weak":
      recommendations.push("Consider strategic restructuring or repositioning");
      recommendations.push("Seek strategic partnerships or mergers");
      recommendations.push("Focus on core competencies for survival");
      break;
  }
  
  return recommendations;
}

/**
 * Calculate complete SWOT analysis
 * 
 * @param data - Raw SWOT data
 * @returns Fully calculated SWOT analysis
 */
export function calculateCompleteSWOT(data: SWOTData): CalculatedSWOT {
  const strengthScore = calculateStrengthScore(data.strengths);
  const weaknessScore = calculateWeaknessScore(data.weaknesses);
  const opportunityScore = calculateOpportunityScore(data.opportunities);
  const threatScore = calculateThreatScore(data.threats);
  
  const swotScore = calculateSWOTScore(strengthScore, weaknessScore, opportunityScore, threatScore);
  const position = determineStrategicPosition(swotScore);
  const focus = recommendStrategicFocus(strengthScore, weaknessScore, opportunityScore, threatScore);
  const recommendations = generateRecommendations(position, strengthScore, weaknessScore);
  
  return {
    id: data.id,
    competitorId: data.competitorId,
    strengthScore,
    weaknessScore,
    opportunityScore,
    threatScore,
    swotScore,
    strategicPosition: position,
    strategicFocus: focus,
    recommendations,
  };
}

/**
 * Calculate batch of SWOT analyses
 * 
 * @param swots - Array of SWOT data
 * @returns Array of calculated SWOTs
 */
export function calculateBatchSWOT(swots: SWOTData[]): CalculatedSWOT[] {
  return swots.map((swot) => calculateCompleteSWOT(swot));
}

/**
 * Compare SWOT profiles
 * 
 * Useful for competitive comparison
 * 
 * @param swot1 - First SWOT (usually company)
 * @param swot2 - Second SWOT (usually competitor)
 * @returns Comparison metrics
 */
export function compareSWOTProfiles(
  swot1: CalculatedSWOT,
  swot2: CalculatedSWOT
): {
  strengthDifference: number;
  weaknessDifference: number;
  opportunityDifference: number;
  threatDifference: number;
  scoreDifference: number;
  winner: "first" | "second" | "tied";
} {
  const strengthDiff = swot1.strengthScore - swot2.strengthScore;
  const weaknessDiff = swot2.weaknessScore - swot1.weaknessScore; // Lower weakness is better
  const oppDiff = swot1.opportunityScore - swot2.opportunityScore;
  const threatDiff = swot2.threatScore - swot1.threatScore; // Lower threat is better
  const scoreDiff = swot1.swotScore - swot2.swotScore;
  
  let winner: "first" | "second" | "tied";
  if (scoreDiff > 5) winner = "first";
  else if (scoreDiff < -5) winner = "second";
  else winner = "tied";
  
  return {
    strengthDifference: strengthDiff,
    weaknessDifference: weaknessDiff,
    opportunityDifference: oppDiff,
    threatDifference: threatDiff,
    scoreDifference: scoreDiff,
    winner,
  };
}

/**
 * Identify critical focus areas
 * 
 * Areas that need immediate attention
 * 
 * @param swot - Calculated SWOT
 * @returns Critical focus areas
 */
export function identifyCriticalFocusAreas(swot: CalculatedSWOT): {
  fixWeaknesses: boolean;
  mitigateThreats: boolean;
  seizeOpportunities: boolean;
  leverageStrengths: boolean;
  focusAreas: string[];
} {
  const fixWeaknesses = swot.weaknessScore >= 60;
  const mitigateThreats = swot.threatScore >= 60;
  const seizeOpportunities = swot.opportunityScore >= 60;
  const leverageStrengths = swot.strengthScore >= 60;
  
  const focusAreas: string[] = [];
  
  if (fixWeaknesses) focusAreas.push("Address critical weaknesses");
  if (mitigateThreats) focusAreas.push("Mitigate major threats");
  if (seizeOpportunities) focusAreas.push("Capitalize on opportunities");
  if (leverageStrengths) focusAreas.push("Leverage key strengths");
  
  return {
    fixWeaknesses,
    mitigateThreats,
    seizeOpportunities,
    leverageStrengths,
    focusAreas,
  };
}

/**
 * Calculate strategic balance
 * 
 * Measures if SWOT is balanced or skewed
 * 
 * @param swot - Calculated SWOT
 * @returns Balance assessment
 */
export function assessStrategicBalance(swot: CalculatedSWOT): {
  isBalanced: boolean;
  dominantFactor: "strengths" | "weaknesses" | "opportunities" | "threats" | "none";
  balanceScore: number;
} {
  const scores = [swot.strengthScore, swot.weaknessScore, swot.opportunityScore, swot.threatScore];
  const maxScore = Math.max(...scores);
  const minScore = Math.min(...scores);
  const spread = maxScore - minScore;
  
  let dominant: "strengths" | "weaknesses" | "opportunities" | "threats" | "none" = "none";
  
  if (maxScore === swot.strengthScore) dominant = "strengths";
  else if (maxScore === swot.weaknessScore) dominant = "weaknesses";
  else if (maxScore === swot.opportunityScore) dominant = "opportunities";
  else if (maxScore === swot.threatScore) dominant = "threats";
  
  const balanceScore = 100 - spread; // Higher = more balanced
  const isBalanced = spread <= 30;
  
  return {
    isBalanced,
    dominantFactor: dominant,
    balanceScore: Math.round(balanceScore),
  };
}
