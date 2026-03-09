/**
 * Tax Planning Calculation Utilities
 * Contains business logic for tax planning scenarios and projections
 */

import { TaxPlanningScenario } from "@/lib/tax-compliance-data";

/**
 * Calculate total savings across all scenarios
 */
export function calculateTotalScenarioSavings(scenarios: TaxPlanningScenario[]): number {
  return scenarios.reduce((sum, s) => sum + (s.savings || 0), 0);
}

/**
 * Calculate average confidence level for tax planning scenarios
 */
export function calculateAverageScenarioConfidence(scenarios: TaxPlanningScenario[]): number {
  if (scenarios.length === 0) return 0;
  const total = scenarios.reduce((sum, s) => sum + (s.confidence || 0), 0);
  return Math.round(total / scenarios.length);
}

/**
 * Get scenarios by risk level
 */
export function getScenariosByRiskLevel(scenarios: TaxPlanningScenario[]): Record<string, TaxPlanningScenario[]> {
  return scenarios.reduce((acc, scenario) => {
    const risk = scenario.riskLevel || "medium";
    if (!acc[risk]) acc[risk] = [];
    acc[risk].push(scenario);
    return acc;
  }, {} as Record<string, TaxPlanningScenario[]>);
}

/**
 * Get best scenario (highest savings)
 */
export function getBestScenario(scenarios: TaxPlanningScenario[]): TaxPlanningScenario | null {
  if (scenarios.length === 0) return null;
  return scenarios.reduce((best, current) => 
    (current.savings || 0) > (best.savings || 0) ? current : best
  );
}

/**
 * Get safest scenario (lowest risk)
 */
export function getSafestScenario(scenarios: TaxPlanningScenario[]): TaxPlanningScenario | null {
  const lowRiskScenarios = scenarios.filter(s => s.riskLevel === "low");
  if (lowRiskScenarios.length === 0) return null;
  return lowRiskScenarios.reduce((best, current) => 
    (current.savings || 0) > (best.savings || 0) ? current : best
  );
}

/**
 * Get highest confidence scenario
 */
export function getHighestConfidenceScenario(scenarios: TaxPlanningScenario[]): TaxPlanningScenario | null {
  if (scenarios.length === 0) return null;
  return scenarios.reduce((best, current) => 
    (current.confidence || 0) > (best.confidence || 0) ? current : best
  );
}

/**
 * Calculate risk-adjusted savings
 * Formula: Savings * (Confidence / 100)
 */
export function calculateRiskAdjustedSavings(scenario: TaxPlanningScenario): number {
  return (scenario.savings || 0) * ((scenario.confidence || 0) / 100);
}

/**
 * Get risk-adjusted savings for all scenarios
 */
export function getRiskAdjustedSavings(scenarios: TaxPlanningScenario[]): number {
  return scenarios.reduce((sum, s) => sum + calculateRiskAdjustedSavings(s), 0);
}

/**
 * Get planning summary
 */
export function getPlanningSummary(scenarios: TaxPlanningScenario[]) {
  const best = getBestScenario(scenarios);
  const safest = getSafestScenario(scenarios);
  const highestConfidence = getHighestConfidenceScenario(scenarios);
  
  return {
    totalScenarios: scenarios.length,
    totalPotentialSavings: calculateTotalScenarioSavings(scenarios),
    riskAdjustedSavings: getRiskAdjustedSavings(scenarios),
    averageConfidence: calculateAverageScenarioConfidence(scenarios),
    bestScenario: best ? {
      name: best.name,
      savings: best.savings,
      riskLevel: best.riskLevel,
    } : null,
    safestScenario: safest ? {
      name: safest.name,
      savings: safest.savings,
      confidence: safest.confidence,
    } : null,
    highestConfidenceScenario: highestConfidence ? {
      name: highestConfidence.name,
      savings: highestConfidence.savings,
      confidence: highestConfidence.confidence,
    } : null,
    lowRiskCount: scenarios.filter(s => s.riskLevel === "low").length,
    mediumRiskCount: scenarios.filter(s => s.riskLevel === "medium").length,
    highRiskCount: scenarios.filter(s => s.riskLevel === "high").length,
  };
}

