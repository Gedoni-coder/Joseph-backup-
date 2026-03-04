/**
 * Industry Insight Calculations Module
 * 
 * Handles opportunity and challenge assessment including:
 * - Opportunity scoring
 * - Challenge/threat assessment
 * - Action priority ranking
 * - Impact quantification
 */

export interface InsightData {
  id: string;
  type: "opportunity" | "challenge";
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  probability: number; // 0-100
  timeframe: string;
  actionItems: string[];
  relatedTrends: string[];
}

export interface CalculatedInsight {
  id: string;
  type: "opportunity" | "challenge";
  title: string;
  impactScore: number;
  probabilityScore: number;
  severityScore: number; // For challenges
  opportunityScore: number; // For opportunities
  priority: "critical" | "high" | "medium" | "low";
  actionCount: number;
  urgency: "immediate" | "near-term" | "long-term";
  recommendation: string;
}

/**
 * Calculate opportunity score
 * 
 * Formula: impact × probability × market_attractiveness
 * 
 * @param impact - Impact level (high=100, medium=50, low=25)
 * @param probability - Probability score (0-100)
 * @returns Opportunity score (0-100)
 */
export function calculateOpportunityScore(
  impact: "high" | "medium" | "low",
  probability: number
): number {
  const impactWeight = impact === "high" ? 100 : impact === "medium" ? 50 : 25;
  const score = (impactWeight * probability) / 100;
  return Math.round(score);
}

/**
 * Calculate challenge severity score
 * 
 * Similar to threat scoring
 * 
 * @param impact - Impact level
 * @param probability - Probability score
 * @returns Severity score (0-100)
 */
export function calculateChallengeSeverity(
  impact: "high" | "medium" | "low",
  probability: number
): number {
  const impactWeight = impact === "high" ? 100 : impact === "medium" ? 50 : 25;
  const severity = (impactWeight * probability) / 100;
  return Math.round(severity);
}

/**
 * Convert impact level to numeric value
 * 
 * @param impact - Impact level
 * @returns Numeric value
 */
export function convertImpactToScore(impact: "high" | "medium" | "low"): number {
  switch (impact) {
    case "high":
      return 100;
    case "medium":
      return 50;
    case "low":
      return 25;
  }
}

/**
 * Determine priority level
 * 
 * Based on score and type
 * 
 * @param score - Opportunity/severity score
 * @param type - Type (opportunity or challenge)
 * @returns Priority level
 */
export function determinePriority(
  score: number,
  type: "opportunity" | "challenge"
): "critical" | "high" | "medium" | "low" {
  if (type === "challenge") {
    // Challenges are more urgent
    if (score >= 70) return "critical";
    if (score >= 50) return "high";
    if (score >= 25) return "medium";
    return "low";
  } else {
    // Opportunities
    if (score >= 80) return "critical";
    if (score >= 60) return "high";
    if (score >= 40) return "medium";
    return "low";
  }
}

/**
 * Determine urgency based on timeframe and score
 * 
 * @param timeframeMonths - Months until opportunity/challenge manifests
 * @param score - Opportunity/severity score
 * @returns Urgency level
 */
export function determineUrgency(
  timeframeMonths: number,
  score: number
): "immediate" | "near-term" | "long-term" {
  if (score >= 70 && timeframeMonths <= 3) {
    return "immediate";
  }
  
  if (timeframeMonths <= 12 && score >= 50) {
    return "near-term";
  }
  
  return "long-term";
}

/**
 * Generate actionable recommendation
 * 
 * @param insight - Calculated insight
 * @returns Recommendation text
 */
export function generateRecommendation(insight: CalculatedInsight): string {
  const baseMsg =
    insight.type === "opportunity"
      ? `Opportunity: ${insight.title}`
      : `Challenge Alert: ${insight.title}`;
  
  if (insight.urgency === "immediate") {
    return `${baseMsg} - Requires immediate action`;
  }
  
  if (insight.priority === "critical") {
    return `${baseMsg} - High priority, requires strategy`;
  }
  
  if (insight.priority === "high") {
    return `${baseMsg} - Plan response carefully`;
  }
  
  return `${baseMsg} - Monitor and prepare`;
}

/**
 * Calculate complete insight
 * 
 * @param data - Raw insight data
 * @returns Fully calculated insight
 */
export function calculateCompleteInsight(data: InsightData): CalculatedInsight {
  let score: number;
  let priority: "critical" | "high" | "medium" | "low";
  
  if (data.type === "opportunity") {
    score = calculateOpportunityScore(data.impact, data.probability);
  } else {
    score = calculateChallengeSeverity(data.impact, data.probability);
  }
  
  const timeframeMonths = parseTimeframeToMonths(data.timeframe);
  priority = determinePriority(score, data.type);
  const urgency = determineUrgency(timeframeMonths, score);
  const recommendation = generateRecommendation({
    id: data.id,
    type: data.type,
    title: data.title,
    impactScore: convertImpactToScore(data.impact),
    probabilityScore: data.probability,
    severityScore: data.type === "challenge" ? score : 0,
    opportunityScore: data.type === "opportunity" ? score : 0,
    priority,
    actionCount: data.actionItems.length,
    urgency,
    recommendation: "",
  });
  
  return {
    id: data.id,
    type: data.type,
    title: data.title,
    impactScore: convertImpactToScore(data.impact),
    probabilityScore: data.probability,
    severityScore: data.type === "challenge" ? score : 0,
    opportunityScore: data.type === "opportunity" ? score : 0,
    priority,
    actionCount: data.actionItems.length,
    urgency,
    recommendation,
  };
}

/**
 * Calculate batch of insights
 * 
 * @param insights - Array of insight data
 * @returns Array of calculated insights
 */
export function calculateBatchInsights(insights: InsightData[]): CalculatedInsight[] {
  return insights.map((insight) => calculateCompleteInsight(insight));
}

/**
 * Rank insights by priority
 * 
 * @param insights - Array of calculated insights
 * @returns Sorted insights (critical first)
 */
export function rankInsightsByPriority(insights: CalculatedInsight[]): CalculatedInsight[] {
  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  const urgencyOrder = { immediate: 0, "near-term": 1, "long-term": 2 };
  
  return [...insights].sort((a, b) => {
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDiff !== 0) return priorityDiff;
    
    return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
  });
}

/**
 * Filter opportunities
 * 
 * @param insights - Array of calculated insights
 * @returns Opportunity insights only
 */
export function getOpportunities(insights: CalculatedInsight[]): CalculatedInsight[] {
  return insights.filter((i) => i.type === "opportunity");
}

/**
 * Filter challenges
 * 
 * @param insights - Array of calculated insights
 * @returns Challenge insights only
 */
export function getChallenges(insights: CalculatedInsight[]): CalculatedInsight[] {
  return insights.filter((i) => i.type === "challenge");
}

/**
 * Identify critical action items
 * 
 * @param insights - Array of calculated insights
 * @returns Insights requiring immediate action
 */
export function getCriticalActionItems(insights: CalculatedInsight[]): CalculatedInsight[] {
  return insights.filter(
    (i) => i.priority === "critical" || (i.priority === "high" && i.urgency === "immediate")
  );
}

/**
 * Calculate portfolio balance (opportunities vs challenges)
 * 
 * @param insights - Array of calculated insights
 * @returns Balance assessment
 */
export function assessPortfolioBalance(insights: CalculatedInsight[]): {
  opportunityCount: number;
  challengeCount: number;
  netOpportunity: number;
  opportunityPotential: number;
  challengeRisk: number;
  balance: "favorable" | "balanced" | "challenging";
} {
  const opportunities = getOpportunities(insights);
  const challenges = getChallenges(insights);
  
  const oppCount = opportunities.length;
  const chalCount = challenges.length;
  const netOpp = oppCount - chalCount;
  
  const oppPotential = opportunities.reduce((sum, o) => sum + o.opportunityScore, 0) / (oppCount || 1);
  const chalRisk = challenges.reduce((sum, c) => sum + c.severityScore, 0) / (chalCount || 1);
  
  let balance: "favorable" | "balanced" | "challenging";
  if (oppPotential > chalRisk && netOpp > 0) {
    balance = "favorable";
  } else if (Math.abs(netOpp) <= 2 && oppPotential >= chalRisk) {
    balance = "balanced";
  } else {
    balance = "challenging";
  }
  
  return {
    opportunityCount: oppCount,
    challengeCount: chalCount,
    netOpportunity: netOpp,
    opportunityPotential: Math.round(oppPotential),
    challengeRisk: Math.round(chalRisk),
    balance,
  };
}

/**
 * Calculate total potential value from opportunities
 * 
 * @param insights - Array of calculated insights
 * @param marketSize - Total addressable market size
 * @returns Potential revenue value
 */
export function calculateOpportunitiesPotentialValue(
  insights: CalculatedInsight[],
  marketSize: number
): number {
  const opportunities = getOpportunities(insights);
  
  const totalScore = opportunities.reduce((sum, o) => sum + o.opportunityScore, 0);
  const avgScore = opportunities.length > 0 ? totalScore / opportunities.length : 0;
  
  // Potential value = market size × avg opportunity score
  const potentialValue = (marketSize * avgScore) / 100;
  
  return Math.round(potentialValue);
}

/**
 * Calculate total exposure to challenges
 * 
 * @param insights - Array of calculated insights
 * @param currentRevenue - Current company revenue
 * @returns Risk exposure value
 */
export function calculateChallengeRiskExposure(
  insights: CalculatedInsight[],
  currentRevenue: number
): number {
  const challenges = getChallenges(insights);
  
  const totalScore = challenges.reduce((sum, c) => sum + c.severityScore, 0);
  const avgScore = challenges.length > 0 ? totalScore / challenges.length : 0;
  
  // Risk exposure = current revenue × avg challenge severity
  const riskExposure = (currentRevenue * avgScore) / 100;
  
  return Math.round(riskExposure);
}

/**
 * Helper: Parse timeframe to months
 * 
 * @param timeframe - Timeframe string
 * @returns Months
 */
function parseTimeframeToMonths(timeframe: string): number {
  const lower = timeframe.toLowerCase();
  
  if (lower.includes("month")) {
    const match = lower.match(/(\d+)\s*month/);
    if (match) return parseInt(match[1]);
  }
  
  if (lower.includes("q")) {
    const match = lower.match(/q(\d)/);
    if (match) {
      const q = parseInt(match[1]);
      return q * 3;
    }
  }
  
  if (lower.includes("year")) {
    const match = lower.match(/(\d+)\s*year/);
    if (match) return parseInt(match[1]) * 12;
  }
  
  return 6;
}

/**
 * Create action plan from insight
 * 
 * @param insight - Calculated insight
 * @param actionItems - Initial action items
 * @returns Structured action plan
 */
export function createActionPlan(
  insight: CalculatedInsight,
  actionItems: string[]
): {
  title: string;
  priority: string;
  actions: Array<{ step: number; action: string; owner?: string; deadline?: string }>;
  successMetrics: string[];
  riskMitigation: string;
} {
  return {
    title: insight.title,
    priority: insight.priority,
    actions: actionItems.map((action, index) => ({
      step: index + 1,
      action,
    })),
    successMetrics: [
      `Achieve ${insight.opportunityScore || insight.severityScore}% target`,
      "Monitor key progress indicators",
      "Review quarterly",
    ],
    riskMitigation:
      insight.type === "opportunity"
        ? "Validate market assumptions before major investment"
        : "Establish contingency plans",
  };
}
