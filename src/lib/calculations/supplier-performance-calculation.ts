/**
 * Supplier Performance Calculation Utilities
 * Contains all business logic for supplier performance calculations
 */

import { Supplier } from "@/lib/supply-chain-data";

export interface SupplierScore {
  supplierId: string;
  supplierName: string;
  overallScore: number;
  onTimeDelivery: number;
  qualityRating: number;
  costCompetitiveness: number;
  responseTime: number;
  riskLevel: "low" | "medium" | "high";
  trend: "improving" | "stable" | "declining";
}

export interface SupplierPerformanceSummary {
  totalSuppliers: number;
  averageScore: number;
  topPerformers: SupplierScore[];
  underperformers: SupplierScore[];
  averageOnTimeDelivery: number;
  averageQualityRating: number;
  highRiskSuppliers: number;
  categoryBreakdown: { category: string; avgScore: number; count: number }[];
}

/**
 * Calculate overall supplier score
 * @param onTimeDelivery - On-time delivery percentage
 * @param qualityRating - Quality rating
 * @param costCompetitiveness - Cost competitiveness score
 * @param responseTime - Response time score
 * @returns Overall score (0-100)
 */
export function calculateOverallScore(
  onTimeDelivery: number,
  qualityRating: number,
  costCompetitiveness: number,
  responseTime: number
): number {
  // Weighted average: Delivery 30%, Quality 30%, Cost 20%, Response 20%
  const score = 
    (onTimeDelivery * 0.30) +
    (qualityRating * 0.30) +
    (costCompetitiveness * 0.20) +
    (responseTime * 0.20);
  
  return Math.round(score * 10) / 10;
}

/**
 * Determine risk level based on supplier assessment
 * @param financialStability - Financial stability rating
 * @param geopoliticalRisk - Geopolitical risk rating
 * @param supplierDependency - Supplier dependency rating
 * @returns Risk level
 */
export function determineRiskLevel(
  financialStability: "low" | "medium" | "high",
  geopoliticalRisk: "low" | "medium" | "high",
  supplierDependency: "low" | "medium" | "high"
): "low" | "medium" | "high" {
  const riskValues = { low: 1, medium: 2, high: 3 };
  const totalRisk = 
    riskValues[financialStability] +
    riskValues[geopoliticalRisk] +
    riskValues[supplierDependency];
  
  if (totalRisk >= 7) return "high";
  if (totalRisk >= 4) return "medium";
  return "low";
}

/**
 * Get performance rating based on score
 * @param score - Overall score
 * @returns Rating label
 */
export function getPerformanceRating(score: number): string {
  if (score >= 90) return "Excellent";
  if (score >= 80) return "Good";
  if (score >= 70) return "Satisfactory";
  if (score >= 60) return "Fair";
  return "Poor";
}

/**
 * Calculate score for a single supplier
 * @param supplier - Supplier data
 * @returns Supplier score
 */
export function calculateSupplierScore(supplier: Supplier): SupplierScore {
  const { performanceMetrics, riskAssessment, name, id } = supplier;
  
  const overallScore = calculateOverallScore(
    performanceMetrics.onTimeDelivery,
    performanceMetrics.qualityRating,
    performanceMetrics.costCompetitiveness,
    performanceMetrics.responseTime
  );
  
  const riskLevel = determineRiskLevel(
    riskAssessment.financialStability,
    riskAssessment.geopoliticalRisk,
    riskAssessment.supplierDependency
  );
  
  // Determine trend (simplified - would need historical data)
  let trend: "improving" | "stable" | "declining" = "stable";
  if (overallScore >= 85) trend = "improving";
  if (overallScore < 70) trend = "declining";
  
  return {
    supplierId: id,
    supplierName: name,
    overallScore,
    onTimeDelivery: performanceMetrics.onTimeDelivery,
    qualityRating: performanceMetrics.qualityRating,
    costCompetitiveness: performanceMetrics.costCompetitiveness,
    responseTime: performanceMetrics.responseTime,
    riskLevel,
    trend
  };
}

/**
 * Calculate scores for all suppliers
 * @param suppliers - Array of suppliers
 * @returns Array of supplier scores
 */
export function calculateAllSupplierScores(suppliers: Supplier[]): SupplierScore[] {
  return suppliers.map(calculateSupplierScore);
}

/**
 * Calculate supplier performance summary
 * @param scores - Array of supplier scores
 * @returns Summary metrics
 */
export function calculateSupplierPerformanceSummary(scores: SupplierScore[]): SupplierPerformanceSummary {
  if (scores.length === 0) {
    return {
      totalSuppliers: 0,
      averageScore: 0,
      topPerformers: [],
      underperformers: [],
      averageOnTimeDelivery: 0,
      averageQualityRating: 0,
      highRiskSuppliers: 0,
      categoryBreakdown: []
    };
  }
  
  const averageScore = Math.round(
    scores.reduce((sum, s) => sum + s.overallScore, 0) / scores.length * 10
  ) / 10;
  
  const averageOnTimeDelivery = Math.round(
    scores.reduce((sum, s) => sum + s.onTimeDelivery, 0) / scores.length * 10
  ) / 10;
  
  const averageQualityRating = Math.round(
    scores.reduce((sum, s) => sum + s.qualityRating, 0) / scores.length * 10
  ) / 10;
  
  const highRiskSuppliers = scores.filter(s => s.riskLevel === "high").length;
  
  // Top performers (score >= 85)
  const topPerformers = scores
    .filter(s => s.overallScore >= 85)
    .sort((a, b) => b.overallScore - a.overallScore)
    .slice(0, 5);
  
  // Underperformers (score < 70)
  const underperformers = scores
    .filter(s => s.overallScore < 70)
    .sort((a, b) => a.overallScore - b.overallScore)
    .slice(0, 5);
  
  return {
    totalSuppliers: scores.length,
    averageScore,
    topPerformers,
    underperformers,
    averageOnTimeDelivery,
    averageQualityRating,
    highRiskSuppliers,
    categoryBreakdown: [] // Would need supplier category data
  };
}

/**
 * Get suppliers by risk level
 * @param scores - Array of supplier scores
 * @param riskLevel - Risk level to filter
 * @returns Filtered suppliers
 */
export function getSuppliersByRiskLevel(
  scores: SupplierScore[],
  riskLevel: "low" | "medium" | "high"
): SupplierScore[] {
  return scores.filter(s => s.riskLevel === riskLevel);
}

/**
 * Get top performing suppliers
 * @param scores - Array of supplier scores
 * @param limit - Number of suppliers to return
 * @returns Top performers
 */
export function getTopPerformingSuppliers(
  scores: SupplierScore[],
  limit: number = 5
): SupplierScore[] {
  return [...scores]
    .sort((a, b) => b.overallScore - a.overallScore)
    .slice(0, limit);
}

/**
 * Get underperforming suppliers
 * @param scores - Array of supplier scores
 * @param limit - Number of suppliers to return
 * @returns Underperformers
 */
export function getUnderperformingSuppliers(
  scores: SupplierScore[],
  limit: number = 5
): SupplierScore[] {
  return [...scores]
    .sort((a, b) => a.overallScore - b.overallScore)
    .slice(0, limit);
}

/**
 * Format score for display
 * @param score - Score to format
 * @returns Formatted string
 */
export function formatScore(score: number): string {
  return `${score.toFixed(1)}%`;
}

/**
 * Get score color
 * @param score - Score value
 * @returns Color hex code
 */
export function getScoreColor(score: number): string {
  if (score >= 85) return "#22c55e"; // green
  if (score >= 70) return "#3b82f6"; // blue
  if (score >= 60) return "#f59e0b"; // yellow
  return "#ef4444"; // red
}

