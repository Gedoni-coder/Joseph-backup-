/**
 * Upsell Analysis Calculation Utilities
 * Contains all business logic for upsell opportunity analysis
 */

import { UpsellOpportunity } from "@/lib/revenue-data";

/**
 * Calculate total potential MRR from upsells
 * @param upsells - Array of upsell opportunities
 * @returns Total potential MRR increase
 */
export function calculateTotalPotentialMRR(upsells: UpsellOpportunity[]): number {
  return upsells.reduce((sum, u) => sum + (u.potentialMRR - u.currentMRR), 0);
}

/**
 * Calculate weighted average probability score
 * @param upsells - Array of upsell opportunities
 * @returns Average probability score
 */
export function calculateAvgUpsellProbability(upsells: UpsellOpportunity[]): number {
  if (upsells.length === 0) return 0;
  const total = upsells.reduce((sum, u) => sum + u.probabilityScore, 0);
  return Math.round(total / upsells.length);
}

/**
 * Calculate expected MRR (probability-weighted)
 * @param upsells - Array of upsell opportunities
 * @returns Expected MRR value
 */
export function calculateExpectedMRR(upsells: UpsellOpportunity[]): number {
  return upsells.reduce((sum, u) => {
    const potentialIncrease = u.potentialMRR - u.currentMRR;
    return sum + (potentialIncrease * u.probabilityScore / 100);
  }, 0);
}

/**
 * Calculate total annual revenue potential
 * @param upsells - Array of upsell opportunities
 * @returns Annual revenue potential
 */
export function calculateAnnualUpsellPotential(upsells: UpsellOpportunity[]): number {
  return calculateTotalPotentialMRR(upsells) * 12;
}

/**
 * Get highest probability upsell
 * @param upsells - Array of upsell opportunities
 * @returns Upsell with highest probability
 */
export function getHighestProbabilityUpsell(upsells: UpsellOpportunity[]): UpsellOpportunity | null {
  if (upsells.length === 0) return null;
  return upsells.reduce((highest, u) => 
    u.probabilityScore > (highest?.probabilityScore || 0) ? u : highest, upsells[0]
  );
}

/**
 * Get highest value upsell (by MRR increase)
 * @param upsells - Array of upsell opportunities
 * @returns Upsell with highest MRR increase
 */
export function getHighestValueUpsell(upsells: UpsellOpportunity[]): UpsellOpportunity | null {
  if (upsells.length === 0) return null;
  return upsells.reduce((highest, u) => {
    const currentIncrease = u.potentialMRR - u.currentMRR;
    const highestIncrease = highest ? highest.potentialMRR - highest.currentMRR : 0;
    return currentIncrease > highestIncrease ? u : highest;
  }, upsells[0]);
}

/**
 * Get upsells by priority (probability × value)
 * @param upsells - Array of upsell opportunities
 * @returns Sorted upsells by priority score
 */
export function getPriorityUpsells(upsells: UpsellOpportunity[]): UpsellOpportunity[] {
  return [...upsells].sort((a, b) => {
    const aValue = (a.potentialMRR - a.currentMRR) * a.probabilityScore;
    const bValue = (b.potentialMRR - b.currentMRR) * b.probabilityScore;
    return bValue - aValue;
  });
}

/**
 * Calculate upsell opportunity score (0-100)
 * @param upsell - Single upsell opportunity
 * @returns Priority score
 */
export function calculateUpsellScore(upsell: UpsellOpportunity): number {
  const valueScore = Math.min((upsell.potentialMRR - upsell.currentMRR) / 100, 50); // Max 50 points
  const probabilityScore = upsell.probabilityScore / 2; // Max 50 points
  const timeScore = Math.max(0, 30 - upsell.timeToUpgrade) / 30 * 10; // Max 10 points
  
  return Math.round(valueScore + probabilityScore + timeScore);
}

/**
 * Get upsell summary
 * @param upsells - Array of upsell opportunities
 * @returns Summary object
 */
export function getUpsellSummary(upsells: UpsellOpportunity[]): {
  totalPotentialMRR: number;
  expectedMRR: number;
  annualPotential: number;
  avgProbability: number;
  opportunityCount: number;
  avgTimeToUpgrade: number;
} {
  const totalTime = upsells.reduce((sum, u) => sum + u.timeToUpgrade, 0);
  
  return {
    totalPotentialMRR: calculateTotalPotentialMRR(upsells),
    expectedMRR: calculateExpectedMRR(upsells),
    annualPotential: calculateAnnualUpsellPotential(upsells),
    avgProbability: calculateAvgUpsellProbability(upsells),
    opportunityCount: upsells.length,
    avgTimeToUpgrade: upsells.length > 0 ? Math.round(totalTime / upsells.length) : 0,
  };
}

/**
 * Format MRR for display
 * @param amount - MRR amount
 * @returns Formatted string
 */
export function formatMRR(amount: number): string {
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`;
  }
  return `$${amount}`;
}

