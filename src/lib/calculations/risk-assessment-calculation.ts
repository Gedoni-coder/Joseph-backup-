/**
 * Risk Assessment Calculation Utilities
 * Contains all business logic for risk assessment calculations
 */

import { RiskAssessment } from "@/lib/financial-advisory-data";

/**
 * Calculate risk score
 */
export function calculateRiskScore(probability: number, impact: number): number {
  return Math.round((probability * impact) / 10);
}

/**
 * Get risk status based on score
 */
export function getRiskStatus(score: number): "low" | "medium" | "high" | "critical" {
  if (score >= 60) return "critical";
  if (score >= 40) return "high";
  if (score >= 20) return "medium";
  return "low";
}

/**
 * Get count by category
 */
export function getRisksByCategory(risks: RiskAssessment[]): Record<string, number> {
  return risks.reduce((acc, r) => {
    acc[r.category] = (acc[r.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

/**
 * Get count by status
 */
export function getRisksByStatus(risks: RiskAssessment[]): Record<string, number> {
  return risks.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

/**
 * Get highest risk
 */
export function getHighestRisk(risks: RiskAssessment[]): RiskAssessment | null {
  if (risks.length === 0) return null;
  return risks.reduce((highest, r) => {
    if (!highest || r.riskScore > highest.riskScore) return r;
    return highest;
  }, risks[0]);
}

/**
 * Get risk summary
 */
export function getRiskSummary(risks: RiskAssessment[]) {
  const critical = risks.filter(r => r.riskScore >= 60).length;
  const high = risks.filter(r => r.riskScore >= 40 && r.riskScore < 60).length;
  const medium = risks.filter(r => r.riskScore >= 20 && r.riskScore < 40).length;
  const low = risks.filter(r => r.riskScore < 20).length;
  
  return {
    total: risks.length,
    critical,
    high,
    medium,
    low,
    byCategory: getRisksByCategory(risks),
    byStatus: getRisksByStatus(risks),
    highestRisk: getHighestRisk(risks),
  };
}
