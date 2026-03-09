/**
 * Dead Stock Analysis Calculation Utilities
 * Contains all business logic for dead stock analysis calculations
 */

import { DeadStock } from "@/lib/inventory-data";

export type RecommendedAction = "markdown" | "liquidate" | "donate" | "dispose";

export interface DeadStockAnalysis {
  id: string;
  itemId: string;
  itemName: string;
  category: string;
  quantity: number;
  daysStagnant: number;
  originalValue: number;
  currentValue: number;
  depreciation: number;
  depreciationPercent: number;
  lastMovement: Date;
  recommendedAction: RecommendedAction;
  reason: string;
  urgency: "low" | "medium" | "high";
  potentialRecovery: number;
}

export interface DeadStockSummary {
  totalItems: number;
  totalOriginalValue: number;
  totalCurrentValue: number;
  totalPotentialLoss: number;
  averageDaysStagnant: number;
  actionBreakdown: Record<RecommendedAction, number>;
  categoryBreakdown: { category: string; count: number; value: number }[];
  highUrgencyItems: DeadStockAnalysis[];
}

/**
 * Calculate depreciation percentage
 * @param originalValue - Original value
 * @param currentValue - Current value
 * @returns Depreciation percentage
 */
export function calculateDepreciationPercent(originalValue: number, currentValue: number): number {
  if (originalValue <= 0) return 0;
  return Math.round(((originalValue - currentValue) / originalValue) * 1000) / 10;
}

/**
 * Determine recommended action based on days stagnant and depreciation
 * @param daysStagnant - Days without movement
 * @param depreciation - Depreciation percentage
 * @returns Recommended action
 */
export function determineRecommendedAction(daysStagnant: number, depreciation: number): RecommendedAction {
  if (daysStagnant >= 365) return "dispose";
  if (daysStagnant >= 240) return "liquidate";
  if (depreciation >= 60) return "markdown";
  if (depreciation >= 40 && daysStagnant >= 180) return "liquidate";
  return "markdown";
}

/**
 * Determine urgency level
 * @param daysStagnant - Days stagnant
 * @param potentialLoss - Potential value loss
 * @returns Urgency level
 */
export function determineUrgency(daysStagnant: number, potentialLoss: number): "low" | "medium" | "high" {
  if (daysStagnant >= 240 || potentialLoss > 5000) return "high";
  if (daysStagnant >= 180 || potentialLoss > 1000) return "medium";
  return "low";
}

/**
 * Calculate potential recovery value
 * @param currentValue - Current value
 * @param action - Recommended action
 * @returns Potential recovery percentage (0-100)
 */
export function calculatePotentialRecovery(currentValue: number, action: RecommendedAction): number {
  switch (action) {
    case "markdown":
      return 70; // Can recover 70% through markdown
    case "liquidate":
      return 30; // Can recover 30% through liquidation
    case "donate":
      return 0; // No monetary recovery
    case "dispose":
      return 5; // Minimal recovery (salvage value)
    default:
      return 0;
  }
}

/**
 * Analyze a single dead stock item
 * @param item - Dead stock item
 * @returns Dead stock analysis
 */
export function analyzeDeadStockItem(item: DeadStock): DeadStockAnalysis {
  const depreciationPercent = calculateDepreciationPercent(item.originalValue, item.currentValue);
  const recommendedAction = determineRecommendedAction(item.daysStagnant, item.depreciation);
  const urgency = determineUrgency(item.daysStagnant, item.originalValue - item.currentValue);
  const recoveryPercent = calculatePotentialRecovery(item.currentValue, recommendedAction);
  const potentialRecovery = (item.currentValue * recoveryPercent) / 100;
  
  return {
    id: item.id,
    itemId: item.itemId,
    itemName: item.itemName,
    category: item.category,
    quantity: item.quantity,
    daysStagnant: item.daysStagnant,
    originalValue: item.originalValue,
    currentValue: item.currentValue,
    depreciation: item.depreciation,
    depreciationPercent,
    lastMovement: item.lastMovement,
    recommendedAction,
    reason: item.reason,
    urgency,
    potentialRecovery: Math.round(potentialRecovery * 100) / 100
  };
}

/**
 * Analyze all dead stock items
 * @param items - Array of dead stock items
 * @returns Array of analyses
 */
export function analyzeAllDeadStock(items: DeadStock[]): DeadStockAnalysis[] {
  return items.map(analyzeDeadStockItem);
}

/**
 * Calculate dead stock summary
 * @param analyses - Array of dead stock analyses
 * @returns Summary metrics
 */
export function calculateDeadStockSummary(analyses: DeadStockAnalysis[]): DeadStockSummary {
  if (analyses.length === 0) {
    return {
      totalItems: 0,
      totalOriginalValue: 0,
      totalCurrentValue: 0,
      totalPotentialLoss: 0,
      averageDaysStagnant: 0,
      actionBreakdown: { markdown: 0, liquidate: 0, donate: 0, dispose: 0 },
      categoryBreakdown: [],
      highUrgencyItems: []
    };
  }
  
  const totalOriginalValue = analyses.reduce((sum, a) => sum + a.originalValue, 0);
  const totalCurrentValue = analyses.reduce((sum, a) => sum + a.currentValue, 0);
  const totalPotentialLoss = totalOriginalValue - totalCurrentValue;
  const averageDaysStagnant = Math.round(
    analyses.reduce((sum, a) => sum + a.daysStagnant, 0) / analyses.length
  );
  
  // Action breakdown
  const actionBreakdown: Record<RecommendedAction, number> = {
    markdown: analyses.filter(a => a.recommendedAction === "markdown").length,
    liquidate: analyses.filter(a => a.recommendedAction === "liquidate").length,
    donate: analyses.filter(a => a.recommendedAction === "donate").length,
    dispose: analyses.filter(a => a.recommendedAction === "dispose").length
  };
  
  // Category breakdown
  const categoryMap = new Map<string, { count: number; value: number }>();
  analyses.forEach(a => {
    const existing = categoryMap.get(a.category) || { count: 0, value: 0 };
    categoryMap.set(a.category, {
      count: existing.count + 1,
      value: existing.value + a.currentValue
    });
  });
  
  const categoryBreakdown = Array.from(categoryMap.entries())
    .map(([category, data]) => ({
      category,
      count: data.count,
      value: Math.round(data.value * 100) / 100
    }))
    .sort((a, b) => b.value - a.value);
  
  // High urgency items
  const highUrgencyItems = analyses
    .filter(a => a.urgency === "high")
    .sort((a, b) => b.originalValue - b.originalValue);
  
  return {
    totalItems: analyses.length,
    totalOriginalValue: Math.round(totalOriginalValue * 100) / 100,
    totalCurrentValue: Math.round(totalCurrentValue * 100) / 100,
    totalPotentialLoss: Math.round(totalPotentialLoss * 100) / 100,
    averageDaysStagnant,
    actionBreakdown,
    categoryBreakdown,
    highUrgencyItems
  };
}

/**
 * Get items by recommended action
 * @param analyses - Array of analyses
 * @param action - Action to filter by
 * @returns Filtered items
 */
export function getItemsByAction(
  analyses: DeadStockAnalysis[],
  action: RecommendedAction
): DeadStockAnalysis[] {
  return analyses.filter(a => a.recommendedAction === action);
}

/**
 * Get highest value items to recover
 * @param analyses - Array of analyses
 * @param limit - Number of items
 * @returns Top items by recovery potential
 */
export function getHighestRecoveryPotential(
  analyses: DeadStockAnalysis[],
  limit: number = 10
): DeadStockAnalysis[] {
  return [...analyses]
    .sort((a, b) => b.potentialRecovery - a.potentialRecovery)
    .slice(0, limit);
}

/**
 * Calculate total potential recovery value
 * @param analyses - Array of analyses
 * @returns Total potential recovery
 */
export function calculateTotalPotentialRecovery(analyses: DeadStockAnalysis[]): number {
  return Math.round(
    analyses.reduce((sum, a) => sum + a.potentialRecovery, 0) * 100
  ) / 100;
}

/**
 * Format days stagnant for display
 * @param days - Days stagnant
 * @returns Formatted string
 */
export function formatDaysStagnant(days: number): string {
  if (days >= 365) return `${Math.floor(days / 365)} year(s)`;
  if (days >= 30) return `${Math.floor(days / 30)} month(s)`;
  return `${days} days`;
}

/**
 * Get action color
 * @param action - Recommended action
 * @returns Color code
 */
export function getActionColor(action: RecommendedAction): string {
  switch (action) {
    case "markdown": return "#3b82f6"; // blue
    case "liquidate": return "#f59e0b"; // amber
    case "donate": return "#10b981"; // green
    case "dispose": return "#ef4444"; // red
    default: return "#6b7280"; // gray
  }
}

