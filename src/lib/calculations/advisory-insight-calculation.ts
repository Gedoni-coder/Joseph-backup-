/**
 * Advisory Insight Calculation Utilities
 * Contains all business logic for advisory insight calculations
 */

import { AdvisoryInsight } from "@/lib/financial-advisory-data";

/**
 * Get insights by type
 */
export function getInsightsByType(insights: AdvisoryInsight[]): Record<string, number> {
  return insights.reduce((acc, i) => {
    acc[i.type] = (acc[i.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

/**
 * Get insights by priority
 */
export function getInsightsByPriority(insights: AdvisoryInsight[]): Record<string, number> {
  return insights.reduce((acc, i) => {
    acc[i.priority] = (acc[i.priority] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

/**
 * Get insights by category
 */
export function getInsightsByCategory(insights: AdvisoryInsight[]): Record<string, number> {
  return insights.reduce((acc, i) => {
    acc[i.category] = (acc[i.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

/**
 * Get insights by status
 */
export function getInsightsByStatus(insights: AdvisoryInsight[]): Record<string, number> {
  return insights.reduce((acc, i) => {
    acc[i.status] = (acc[i.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

/**
 * Calculate total financial impact
 */
export function getTotalFinancialImpact(insights: AdvisoryInsight[]): number {
  return insights.reduce((sum, i) => sum + (i.financialImpact?.estimated || 0), 0);
}

/**
 * Get advisory insight summary
 */
export function getAdvisoryInsightSummary(insights: AdvisoryInsight[]) {
  return {
    total: insights.length,
    recommendations: insights.filter(i => i.type === "recommendation").length,
    alerts: insights.filter(i => i.type === "alert").length,
    opportunities: insights.filter(i => i.type === "opportunity").length,
    risks: insights.filter(i => i.type === "risk").length,
    highPriority: insights.filter(i => i.priority === "high").length,
    totalFinancialImpact: getTotalFinancialImpact(insights),
    byType: getInsightsByType(insights),
    byPriority: getInsightsByPriority(insights),
    byCategory: getInsightsByCategory(insights),
    byStatus: getInsightsByStatus(insights),
  };
}
