/**
 * Scenario Test Calculation Utilities
 * Contains all business logic for scenario testing calculations
 */

import { ScenarioTest } from "@/lib/financial-advisory-data";

/**
 * Calculate scenario impact percentage
 */
export function calculateScenarioImpact(test: ScenarioTest): number {
  if (!test.results.revenue || !test.parameters[0]?.baseValue) return 0;
  const baseRevenue = test.parameters[0].baseValue;
  const resultRevenue = test.results.revenue;
  return Math.round(((resultRevenue - baseRevenue) / baseRevenue) * 1000) / 10;
}

/**
 * Get scenario severity color
 */
export function getScenarioSeverityColor(severity: string): string {
  const colors: Record<string, string> = {
    critical: "text-red-600",
    high: "text-orange-600",
    medium: "text-yellow-600",
    low: "text-green-600",
  };
  return colors[severity] || "text-gray-600";
}

/**
 * Get scenarios by type
 */
export function getScenariosByType(tests: ScenarioTest[]): Record<string, number> {
  return tests.reduce((acc, t) => {
    acc[t.type] = (acc[t.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

/**
 * Get weighted risk score
 */
export function getWeightedRiskScore(tests: ScenarioTest[]): number {
  if (tests.length === 0) return 0;
  const total = tests.reduce((sum, t) => {
    const severityWeight = t.results.impactSeverity === "critical" ? 4 : 
                          t.results.impactSeverity === "high" ? 3 : 
                          t.results.impactSeverity === "medium" ? 2 : 1;
    return sum + severityWeight * (t.probability / 100);
  }, 0);
  return Math.round(total * 100);
}

/**
 * Get scenario summary
 */
export function getScenarioSummary(tests: ScenarioTest[]) {
  return {
    total: tests.length,
    stress: tests.filter(t => t.type === "stress").length,
    sensitivity: tests.filter(t => t.type === "sensitivity").length,
    monteCarlo: tests.filter(t => t.type === "monte_carlo").length,
    byType: getScenariosByType(tests),
    weightedRiskScore: getWeightedRiskScore(tests),
  };
}
