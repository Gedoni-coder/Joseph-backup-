/**
 * Inventory Turnover Calculation Utilities
 * Contains all business logic for inventory turnover calculations
 */

import { InventoryItem, TurnoverMetrics } from "@/lib/inventory-data";

export type VelocityRating = "fast" | "medium" | "slow";

export interface CategoryTurnover {
  category: string;
  averageTurnover: number;
  itemCount: number;
}

export interface TurnoverAnalysis {
  itemId: string;
  itemName: string;
  category: string;
  turnoverRatio: number;
  averageInventory: number;
  costOfGoodsSold: number;
  daysOfSupply: number;
  velocityRating: VelocityRating;
  recommendation: string;
  trend: "improving" | "stable" | "declining";
}

export interface TurnoverSummary {
  averageTurnover: number;
  averageDaysOfSupply: number;
  fastMovingCount: number;
  mediumMovingCount: number;
  slowMovingCount: number;
  totalCOGS: number;
  totalAverageInventory: number;
  categoryAnalysis: CategoryTurnover[];
}

/**
 * Calculate inventory turnover ratio
 * @param costOfGoodsSold - Cost of goods sold for period
 * @param averageInventory - Average inventory value
 * @returns Turnover ratio
 */
export function calculateTurnoverRatio(costOfGoodsSold: number, averageInventory: number): number {
  if (averageInventory <= 0) return 0;
  const ratio = costOfGoodsSold / averageInventory;
  return Math.round(ratio * 100) / 100;
}

/**
 * Calculate days of supply (how many days until inventory runs out)
 * @param averageInventory - Average inventory quantity
 * @param dailyDemand - Average daily demand
 * @returns Days of supply
 */
export function calculateDaysOfSupply(averageInventory: number, dailyDemand: number): number {
  if (dailyDemand <= 0) return Infinity;
  return Math.round(averageInventory / dailyDemand);
}

/**
 * Calculate average inventory
 * @param currentStock - Current stock quantity
 * @param previousStock - Previous period stock
 * @returns Average inventory
 */
export function calculateAverageInventory(currentStock: number, previousStock: number): number {
  return Math.round((currentStock + previousStock) / 2);
}

/**
 * Determine velocity rating based on turnover ratio
 * @param turnoverRatio - Turnover ratio
 * @returns Velocity rating
 */
export function getVelocityRating(turnoverRatio: number): VelocityRating {
  if (turnoverRatio >= 6) return "fast";
  if (turnoverRatio >= 3) return "medium";
  return "slow";
}

/**
 * Get recommendation based on velocity rating
 * @param velocity - Velocity rating
 * @param itemName - Item name for context
 * @returns Recommendation text
 */
export function getVelocityRecommendation(velocity: VelocityRating, itemName: string): string {
  switch (velocity) {
    case "fast":
      return `Maintain current stock levels for ${itemName}. Strong performer with high demand.`;
    case "medium":
      return `Monitor ${itemName} demand patterns. Consider promotional activity to increase velocity.`;
    case "slow":
      return `Review pricing strategy for ${itemName} and consider reducing inventory levels.`;
    default:
      return `Review ${itemName} inventory strategy.`;
  }
}

/**
 * Calculate turnover metrics for a single item
 * @param item - Inventory item
 * @param cogs - Cost of goods sold for this item
 * @param periodDays - Number of days in period (default 365)
 * @returns Turnover analysis
 */
export function calculateItemTurnover(
  item: InventoryItem,
  cogs: number,
  periodDays: number = 365
): TurnoverAnalysis {
  const averageInventory = item.currentStock; // Simplified - should use average
  const turnoverRatio = calculateTurnoverRatio(cogs, averageInventory * item.unitCost);
  const dailyDemand = cogs / periodDays;
  const daysOfSupply = calculateDaysOfSupply(item.currentStock, dailyDemand);
  const velocityRating = getVelocityRating(turnoverRatio);
  const recommendation = getVelocityRecommendation(velocityRating, item.name);
  
  // Determine trend based on stock level vs reorder point
  let trend: "improving" | "stable" | "declining" = "stable";
  if (item.currentStock > item.reorderPoint * 2) trend = "improving";
  if (item.currentStock < item.reorderPoint) trend = "declining";
  
  return {
    itemId: item.id,
    itemName: item.name,
    category: item.category,
    turnoverRatio,
    averageInventory: Math.round(averageInventory),
    costOfGoodsSold: cogs,
    daysOfSupply: daysOfSupply === Infinity ? 999 : daysOfSupply,
    velocityRating,
    recommendation,
    trend
  };
}

/**
 * Calculate turnover for multiple items
 * @param items - Array of inventory items
 * @param cogsData - Map of item ID to COGS
 * @param periodDays - Number of days in period
 * @returns Array of turnover analyses
 */
export function calculateAllTurnover(
  items: InventoryItem[],
  cogsData: Record<string, number> = {},
  periodDays: number = 365
): TurnoverAnalysis[] {
  return items.map(item => {
    const cogs = cogsData[item.id] || (item.currentStock * item.unitCost * 0.5); // Default estimate
    return calculateItemTurnover(item, cogs, periodDays);
  });
}

/**
 * Calculate turnover summary
 * @param turnoverData - Array of turnover analyses
 * @returns Summary metrics
 */
export function calculateTurnoverSummary(turnoverData: TurnoverAnalysis[]): TurnoverSummary {
  if (turnoverData.length === 0) {
    return {
      averageTurnover: 0,
      averageDaysOfSupply: 0,
      fastMovingCount: 0,
      mediumMovingCount: 0,
      slowMovingCount: 0,
      totalCOGS: 0,
      totalAverageInventory: 0,
      categoryAnalysis: []
    };
  }
  
  const fastMovingCount = turnoverData.filter(t => t.velocityRating === "fast").length;
  const mediumMovingCount = turnoverData.filter(t => t.velocityRating === "medium").length;
  const slowMovingCount = turnoverData.filter(t => t.velocityRating === "slow").length;
  
  const totalCOGS = turnoverData.reduce((sum, t) => sum + t.costOfGoodsSold, 0);
  const totalAverageInventory = turnoverData.reduce((sum, t) => sum + t.averageInventory, 0);
  
  // Calculate category-wise analysis
  const categoryMap = new Map<string, { turnover: number; count: number }>();
  turnoverData.forEach(t => {
    const existing = categoryMap.get(t.category) || { turnover: 0, count: 0 };
    categoryMap.set(t.category, {
      turnover: existing.turnover + t.turnoverRatio,
      count: existing.count + 1
    });
  });
  
  const categoryAnalysis = Array.from(categoryMap.entries()).map(([category, data]) => ({
    category,
    averageTurnover: Math.round((data.turnover / data.count) * 100) / 100,
    itemCount: data.count
  }));
  
  // Filter out infinite days of supply
  const validDaysOfSupply = turnoverData
    .map(t => t.daysOfSupply)
    .filter(d => d !== Infinity && d < 999);
  
  const averageDaysOfSupply = validDaysOfSupply.length > 0
    ? Math.round(validDaysOfSupply.reduce((sum, d) => sum + d, 0) / validDaysOfSupply.length)
    : 0;
  
  return {
    averageTurnover: Math.round((totalCOGS / totalAverageInventory) * 100) / 100 || 0,
    averageDaysOfSupply,
    fastMovingCount,
    mediumMovingCount,
    slowMovingCount,
    totalCOGS: Math.round(totalCOGS * 100) / 100,
    totalAverageInventory,
    categoryAnalysis
  };
}

/**
 * Get slow moving items that need attention
 * @param turnoverData - Array of turnover analyses
 * @param limit - Number of items to return
 * @returns Slow moving items
 */
export function getSlowMovingItems(turnoverData: TurnoverAnalysis[], limit: number = 10): TurnoverAnalysis[] {
  return turnoverData
    .filter(t => t.velocityRating === "slow")
    .sort((a, b) => a.daysOfSupply - b.daysOfSupply)
    .slice(0, limit);
}

/**
 * Get fast moving items (best performers)
 * @param turnoverData - Array of turnover analyses
 * @param limit - Number of items to return
 * @returns Fast moving items
 */
export function getFastMovingItems(turnoverData: TurnoverAnalysis[], limit: number = 10): TurnoverAnalysis[] {
  return turnoverData
    .filter(t => t.velocityRating === "fast")
    .sort((a, b) => b.turnoverRatio - a.turnoverRatio)
    .slice(0, limit);
}

/**
 * Calculate inventory days of supply by category
 * @param turnoverData - Array of turnover analyses
 * @returns Category-wise days of supply
 */
export function getCategoryDaysOfSupply(turnoverData: TurnoverAnalysis[]): { category: string; daysOfSupply: number }[] {
  const categoryMap = new Map<string, { total: number; count: number }>();
  
  turnoverData.forEach(t => {
    if (t.daysOfSupply === Infinity || t.daysOfSupply >= 999) return;
    const existing = categoryMap.get(t.category) || { total: 0, count: 0 };
    categoryMap.set(t.category, {
      total: existing.total + t.daysOfSupply,
      count: existing.count + 1
    });
  });
  
  return Array.from(categoryMap.entries()).map(([category, data]) => ({
    category,
    daysOfSupply: Math.round(data.total / data.count)
  }));
}

/**
 * Format turnover ratio for display
 * @param ratio - Turnover ratio
 * @returns Formatted string
 */
export function formatTurnoverRatio(ratio: number): string {
  if (ratio >= 10) return `${ratio.toFixed(1)}x (Excellent)`;
  if (ratio >= 6) return `${ratio.toFixed(1)}x (Good)`;
  if (ratio >= 3) return `${ratio.toFixed(1)}x (Fair)`;
  return `${ratio.toFixed(1)}x (Slow)`;
}

/**
 * Format days of supply for display
 * @param days - Days of supply
 * @returns Formatted string
 */
export function formatDaysOfSupply(days: number): string {
  if (days >= 999) return "N/A";
  if (days > 90) return `${Math.round(days / 30)} months`;
  return `${Math.round(days)} days`;
}

