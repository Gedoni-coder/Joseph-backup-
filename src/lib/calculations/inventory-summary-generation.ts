/**
 * Inventory Summary Generation Utilities
 * Contains all business logic for generating dynamic inventory summaries
 */

import { InventoryItem, DeadStock, DemandForecast } from "@/lib/inventory-data";
import { 
  getStockSummary, 
  StockLevelMetrics 
} from "./stock-level-calculation";
import { 
  calculateInventoryMetrics, 
  calculateCategoryValuation 
} from "./inventory-valuation-calculation";
import { 
  calculateTurnoverSummary, 
  TurnoverAnalysis 
} from "./turnover-calculation";
import { 
  calculateDeadStockSummary, 
  DeadStockAnalysis 
} from "./dead-stock-calculation";

export interface InventorySummaryContent {
  overview: string;
  stockStatus: string;
  valuation: string;
  turnover: string;
  alerts: string;
  recommendations: string;
}

export interface InventoryMetricsSummary {
  totalItems: number;
  totalValue: number;
  lowStockCount: number;
  outOfStockCount: number;
  overstockCount: number;
  deadStockValue: number;
  averageTurnover: number;
  daysOfSupply: number;
}

/**
 * Generate inventory summary content
 * @param items - Inventory items
 * @param turnoverData - Turnover analysis data
 * @param deadStockData - Dead stock analysis data
 * @param forecasts - Demand forecasts
 * @returns Summary content
 */
export function generateInventorySummary(
  items: InventoryItem[],
  turnoverData: TurnoverAnalysis[],
  deadStockData: DeadStockAnalysis[],
  forecasts: DemandForecast[]
): InventorySummaryContent {
  const stockSummary = getStockSummary(items);
  const metrics = calculateInventoryMetrics(items);
  const turnoverSummary = calculateTurnoverSummary(turnoverData);
  const deadStockSummary = calculateDeadStockSummary(deadStockData);
  
  // Overview
  const overview = `Total inventory value stands at $${metrics.totalValue.toLocaleString()} across ${items.length} SKUs. ` +
    `Average item value is $${metrics.averageItemValue.toLocaleString()}. ` +
    `Potential revenue from current stock: $${metrics.potentialRevenue.toLocaleString()}.`;
  
  // Stock Status
  const stockStatus = `Stock Status: ${stockSummary.inStockCount} in-stock, ` +
    `${stockSummary.lowStockCount} low-stock, ${stockSummary.outOfStockCount} out-of-stock, ` +
    `${stockSummary.overstockCount} overstock. ${stockSummary.itemsNeedingReorder.length} items need reorder attention.`;
  
  // Valuation
  const valuation = `Inventory breakdown by category shows ` +
    `${metrics.potentialProfit.toLocaleString()} potential profit. ` +
    `Average turnover ratio: ${turnoverSummary.averageTurnover.toFixed(1)}x. ` +
    `Average days of supply: ${turnoverSummary.averageDaysOfSupply} days.`;
  
  // Turnover
  const turnover = `Velocity Analysis: ${turnoverSummary.fastMovingCount} fast-moving, ` +
    `${turnoverSummary.mediumMovingCount} medium-moving, ${turnoverSummary.slowMovingCount} slow-moving items. ` +
    `Total COGS: $${turnoverSummary.totalCOGS.toLocaleString()}.`;
  
  // Alerts
  let alerts = "";
  if (stockSummary.outOfStockCount > 0) {
    alerts += `${stockSummary.outOfStockCount} items are out-of-stock and require immediate attention. `;
  }
  if (stockSummary.lowStockCount > 0) {
    alerts += `${stockSummary.lowStockCount} items are at low stock levels. `;
  }
  if (deadStockSummary.totalItems > 0) {
    alerts += `${deadStockSummary.totalItems} dead stock items valued at $${deadStockSummary.totalCurrentValue.toLocaleString()} need attention. `;
  }
  if (deadStockSummary.highUrgencyItems.length > 0) {
    alerts += `${deadStockSummary.highUrgencyItems.length} high-urgency actions required for dead stock.`;
  }
  if (alerts === "") {
    alerts = "No critical inventory alerts at this time.";
  }
  
  // Recommendations
  let recommendations = "";
  if (stockSummary.itemsNeedingReorder.length > 0) {
    recommendations += `1. Reorder Priority: Review ${Math.min(5, stockSummary.itemsNeedingReorder.length)} items with lowest stock levels. `;
  }
  if (turnoverSummary.slowMovingCount > 0) {
    recommendations += `2. Slow Inventory: Consider promotions or price adjustments for ${turnoverSummary.slowMovingCount} slow-moving items. `;
  }
  if (deadStockSummary.totalItems > 0) {
    recommendations += `3. Dead Stock: Execute recovery plan for ${deadStockSummary.totalItems} dead stock items. `;
  }
  if (forecasts.length > 0) {
    const highDemandItems = forecasts.filter(f => f.predictedDemand > f.currentDemand * 1.2);
    if (highDemandItems.length > 0) {
      recommendations += `4. Demand Planning: ${highDemandItems.length} items predicted to have high demand increase.`;
    }
  }
  if (recommendations === "") {
    recommendations = "Inventory levels are healthy. Continue regular monitoring.";
  }
  
  return {
    overview,
    stockStatus,
    valuation,
    turnover,
    alerts,
    recommendations
  };
}

/**
 * Generate inventory metrics summary
 * @param items - Inventory items
 * @param turnoverData - Turnover data
 * @param deadStockData - Dead stock data
 * @returns Metrics summary
 */
export function generateInventoryMetricsSummary(
  items: InventoryItem[],
  turnoverData: TurnoverAnalysis[],
  deadStockData: DeadStockAnalysis[]
): InventoryMetricsSummary {
  const stockSummary = getStockSummary(items);
  const metrics = calculateInventoryMetrics(items);
  const turnoverSummary = calculateTurnoverSummary(turnoverData);
  const deadStockSummary = calculateDeadStockSummary(deadStockData);
  
  return {
    totalItems: items.length,
    totalValue: metrics.totalValue,
    lowStockCount: stockSummary.lowStockCount,
    outOfStockCount: stockSummary.outOfStockCount,
    overstockCount: stockSummary.overstockCount,
    deadStockValue: deadStockSummary.totalCurrentValue,
    averageTurnover: turnoverSummary.averageTurnover,
    daysOfSupply: turnoverSummary.averageDaysOfSupply
  };
}

/**
 * Generate action items for inventory
 * @param items - Inventory items
 * @param turnoverData - Turnover data
 * @param deadStockData - Dead stock data
 * @returns Array of action items
 */
export function generateInventoryActionItems(
  items: InventoryItem[],
  turnoverData: TurnoverAnalysis[],
  deadStockData: DeadStockAnalysis[]
): { title: string; description: string; priority: "high" | "medium" | "low" }[] {
  const actions: { title: string; description: string; priority: "high" | "medium" | "low" }[] = [];
  const stockSummary = getStockSummary(items);
  const deadStockSummary = calculateDeadStockSummary(deadStockData);
  const turnoverSummary = calculateTurnoverSummary(turnoverData);
  
  // High priority - Out of stock
  if (stockSummary.outOfStockCount > 0) {
    actions.push({
      title: "Reorder Out-of-Stock Items",
      description: `${stockSummary.outOfStockCount} items are out of stock. Immediate reorder required.`,
      priority: "high"
    });
  }
  
  // High priority - Dead stock
  if (deadStockSummary.highUrgencyItems.length > 0) {
    actions.push({
      title: "Dead Stock Resolution",
      description: `${deadStockSummary.highUrgencyItems.length} items require immediate action to recover value.`,
      priority: "high"
    });
  }
  
  // Medium priority - Low stock
  if (stockSummary.lowStockCount > 0) {
    actions.push({
      title: "Low Stock Review",
      description: `${stockSummary.lowStockCount} items at low stock. Review reorder points.`,
      priority: "medium"
    });
  }
  
  // Medium priority - Slow moving
  if (turnoverSummary.slowMovingCount > 0) {
    actions.push({
      title: "Slow-Moving Inventory Analysis",
      description: `${turnoverSummary.slowMovingCount} items have slow turnover. Consider promotions.`,
      priority: "medium"
    });
  }
  
  // Low priority - Overstock
  if (stockSummary.overstockCount > 0) {
    actions.push({
      title: "Overstock Optimization",
      description: `${stockSummary.overstockCount} items overstocked. Review maximum levels.`,
      priority: "low"
    });
  }
  
  return actions;
}

/**
 * Generate next steps for inventory management
 * @param items - Inventory items
 * @returns Array of next steps
 */
export function generateInventoryNextSteps(
  items: InventoryItem[]
): { step: string; owner: string; timeline: string }[] {
  const stockSummary = getStockSummary(items);
  const steps: { step: string; owner: string; timeline: string }[] = [];
  
  if (stockSummary.itemsNeedingReorder.length > 0) {
    steps.push({
      step: `Generate reorder report for ${Math.min(10, stockSummary.itemsNeedingReorder.length)} priority items`,
      owner: "Inventory Manager",
      timeline: "This Week"
    });
  }
  
  steps.push({
    step: "Review inventory turnover report and identify optimization opportunities",
    owner: "Supply Chain Lead",
    timeline: "This Week"
  });
  
  steps.push({
    step: "Update safety stock levels based on demand forecasts",
    owner: "Planning Analyst",
    timeline: "Next Week"
  });
  
  steps.push({
    step: "Schedule dead stock liquidation review",
    owner: "Finance",
    timeline: "Bi-weekly"
  });
  
  return steps;
}

/**
 * Format inventory value for display
 * @param value - Value to format
 * @returns Formatted string
 */
export function formatInventoryValue(value: number): string {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value.toFixed(0)}`;
}

