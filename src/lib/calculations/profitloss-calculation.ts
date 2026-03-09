/**
 * Profit & Loss Calculation Utilities
 * Contains all business logic for P&L calculations
 */

import { CostStructure, RevenueProjection } from "@/lib/business-forecast-data";

/**
 * Calculate gross profit
 * @param revenue - Total revenue
 * @param cogs - Cost of Goods Sold
 * @returns Gross profit
 */
export function calculateGrossProfit(revenue: number, cogs: number): number {
  return revenue - cogs;
}

/**
 * Calculate gross profit margin percentage
 * @param grossProfit - Gross profit amount
 * @param revenue - Total revenue
 * @returns Gross margin percentage
 */
export function calculateGrossMargin(grossProfit: number, revenue: number): number {
  if (!revenue || revenue === 0) return 0;
  return Math.round((grossProfit / revenue) * 1000) / 10;
}

/**
 * Calculate net profit
 * @param grossProfit - Gross profit
 * @param operatingExpenses - Operating expenses
 * @returns Net profit
 */
export function calculateNetProfit(grossProfit: number, operatingExpenses: number): number {
  return grossProfit - operatingExpenses;
}

/**
 * Calculate net profit margin percentage
 * @param netProfit - Net profit amount
 * @param revenue - Total revenue
 * @returns Net margin percentage
 */
export function calculateNetMargin(netProfit: number, revenue: number): number {
  if (!revenue || revenue === 0) return 0;
  return Math.round((netProfit / revenue) * 1000) / 10;
}

/**
 * Calculate total COGS from cost structure
 * @param costStructure - Array of cost items
 * @returns Total COGS
 */
export function calculateTotalCOGS(costStructure: CostStructure[]): number {
  return costStructure
    .filter((c) => c.type === "COGS")
    .reduce((sum, c) => sum + c.amount, 0);
}

/**
 * Calculate total operating expenses from cost structure
 * @param costStructure - Array of cost items
 * @returns Total operating expenses
 */
export function calculateTotalOperatingExpenses(costStructure: CostStructure[]): number {
  return costStructure
    .filter((c) => c.type === "Operating")
    .reduce((sum, c) => sum + c.amount, 0);
}

/**
 * Calculate total costs (COGS + Operating)
 * @param costStructure - Array of cost structures
 * @returns Total costs
 */
export function calculateTotalCosts(costStructure: CostStructure[]): number {
  return costStructure.reduce((sum, c) => sum + c.amount, 0);
}

/**
 * Calculate operating expense ratio
 * @param operatingExpenses - Total operating expenses
 * @param revenue - Total revenue
 * @returns Operating expense ratio percentage
 */
export function calculateOperatingExpenseRatio(operatingExpenses: number, revenue: number): number {
  if (!revenue || revenue === 0) return 0;
  return Math.round((operatingExpenses / revenue) * 1000) / 10;
}

/**
 * Calculate profit projection from revenue projections and cost structure
 * @param revenueProjections - Array of revenue projections
 * @param costStructure - Array of cost structures
 * @returns P&L summary object
 */
export function calculateProfitProjection(
  revenueProjections: RevenueProjection[],
  costStructure: CostStructure[]
): {
  totalRevenue: number;
  totalCOGS: number;
  totalOperatingExpenses: number;
  grossProfit: number;
  netProfit: number;
  grossMargin: number;
  netMargin: number;
  operatingExpenseRatio: number;
} {
  // Calculate total projected revenue
  const totalRevenue = revenueProjections.reduce((sum, p) => sum + p.projected, 0);
  
  // Calculate total costs (annualized)
  const totalCOGS = calculateTotalCOGS(costStructure) * 12; // Monthly to annual
  const totalOperatingExpenses = calculateTotalOperatingExpenses(costStructure) * 12;
  
  // Calculate profits
  const grossProfit = calculateGrossProfit(totalRevenue, totalCOGS);
  const netProfit = calculateNetProfit(grossProfit, totalOperatingExpenses);
  
  // Calculate margins
  const grossMargin = calculateGrossMargin(grossProfit, totalRevenue);
  const netMargin = calculateNetMargin(netProfit, totalRevenue);
  const operatingExpenseRatio = calculateOperatingExpenseRatio(totalOperatingExpenses, totalRevenue);
  
  return {
    totalRevenue,
    totalCOGS,
    totalOperatingExpenses,
    grossProfit,
    netProfit,
    grossMargin,
    netMargin,
    operatingExpenseRatio,
  };
}

/**
 * Get profit/loss status
 * @param netProfit - Net profit amount
 * @returns Status string
 */
export function getProfitStatus(netProfit: number): "profit" | "loss" | "break-even" {
  if (netProfit > 0) return "profit";
  if (netProfit < 0) return "loss";
  return "break-even";
}

/**
 * Get profit status color
 * @param netProfit - Net profit amount
 * @returns Color class string
 */
export function getProfitColor(netProfit: number): string {
  if (netProfit > 0) return "text-economic-positive";
  if (netProfit < 0) return "text-economic-negative";
  return "text-muted-foreground";
}

/**
 * Get margin status based on percentage
 * @param margin - Margin percentage
 * @param type - Type of margin (gross/net)
 * @returns Status string
 */
export function getMarginStatus(margin: number, type: "gross" | "net"): string {
  const thresholds = type === "gross" 
    ? { excellent: 40, good: 30, fair: 20 }
    : { excellent: 20, good: 15, fair: 10 };
  
  if (margin >= thresholds.excellent) return "Excellent";
  if (margin >= thresholds.good) return "Good";
  if (margin >= thresholds.fair) return "Fair";
  return "Needs Attention";
}

/**
 * Calculate cost breakdown by category
 * @param costStructure - Array of cost structures
 * @returns Object with costs grouped by category
 */
export function calculateCostBreakdown(costStructure: CostStructure[]): Record<string, number> {
  return costStructure.reduce((acc, c) => {
    acc[c.category] = (acc[c.category] || 0) + c.amount;
    return acc;
  }, {} as Record<string, number>);
}

/**
 * Calculate cost percentages
 * @param costStructure - Array of cost structures
 * @returns Object with cost percentages by category
 */
export function calculateCostPercentages(costStructure: CostStructure[]): Record<string, number> {
  const total = calculateTotalCosts(costStructure);
  if (total === 0) return {};
  
  return costStructure.reduce((acc, c) => {
    acc[c.category] = Math.round((c.amount / total) * 100);
    return acc;
  }, {} as Record<string, number>);
}

/**
 * Group costs by variability type
 * @param costStructure - Array of cost structures
 * @returns Object with costs grouped by variability
 */
export function groupByVariability(costStructure: CostStructure[]): Record<string, CostStructure[]> {
  return costStructure.reduce((acc, c) => {
    const variability = c.variability || "Unknown";
    if (!acc[variability]) {
      acc[variability] = [];
    }
    acc[variability].push(c);
    return acc;
  }, {} as Record<string, CostStructure[]>);
}

/**
 * Calculate total fixed costs
 * @param costStructure - Array of cost structures
 * @returns Total fixed costs
 */
export function calculateFixedCosts(costStructure: CostStructure[]): number {
  return costStructure
    .filter((c) => c.variability === "Fixed")
    .reduce((sum, c) => sum + c.amount, 0);
}

/**
 * Calculate total variable costs
 * @param costStructure - Array of cost structures
 * @returns Total variable costs
 */
export function calculateVariableCosts(costStructure: CostStructure[]): number {
  return costStructure
    .filter((c) => c.variability === "Variable")
    .reduce((sum, c) => sum + c.amount, 0);
}

/**
 * Calculate total semi-variable costs
 * @param costStructure - Array of cost structures
 * @returns Total semi-variable costs
 */
export function calculateSemiVariableCosts(costStructure: CostStructure[]): number {
  return costStructure
    .filter((c) => c.variability === "Semi-Variable")
    .reduce((sum, c) => sum + c.amount, 0);
}

/**
 * Format profit/loss amount for display
 * @param amount - Amount in currency
 * @returns Formatted string
 */
export function formatProfitAmount(amount: number): string {
  const prefix = amount >= 0 ? "" : "-";
  const absAmount = Math.abs(amount);
  
  if (absAmount >= 1000000) {
    return `${prefix}$${(absAmount / 1000000).toFixed(1)}M`;
  }
  if (absAmount >= 1000) {
    return `${prefix}$${(absAmount / 1000).toFixed(0)}K`;
  }
  return `${prefix}$${absAmount.toFixed(0)}`;
}

