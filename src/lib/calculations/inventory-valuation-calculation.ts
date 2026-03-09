/**
 * Inventory Valuation Calculation Utilities
 * Contains all business logic for inventory valuation calculations
 */

import {
  InventoryItem,
  InventoryValuation,
  ValuationBreakdown
} from "@/lib/inventory-data";

export type ValuationMethod = "FIFO" | "LIFO" | "WeightedAverage";

export interface ValuationMetrics {
  totalValue: number;
  method: ValuationMethod;
  breakdown: CategoryValuation[];
  costOfGoodsSold: number;
  variance: number;
  lastCalculated: Date;
}

export interface CategoryValuation {
  category: string;
  quantity: number;
  averageCost: number;
  totalValue: number;
  percentage: number;
  itemCount: number;
}

export interface InventoryMetrics {
  totalItems: number;
  totalQuantity: number;
  totalValue: number;
  averageItemValue: number;
  averageCost: number;
  averagePrice: number;
  potentialRevenue: number;
  potentialProfit: number;
}

/**
 * Calculate inventory value using weighted average method
 * @param items - Array of inventory items
 * @returns Total inventory value
 */
export function calculateWeightedAverageValue(items: InventoryItem[]): number {
  if (items.length === 0) return 0;
  
  const totalValue = items.reduce(
    (sum, item) => sum + (item.currentStock * item.unitCost),
    0
  );
  
  return Math.round(totalValue * 100) / 100;
}

/**
 * Calculate FIFO (First In, First Out) valuation
 * Assumes oldest items are sold first
 * @param items - Array of inventory items with batch info
 * @returns FIFO total value
 */
export function calculateFIFOValue(items: InventoryItem[]): number {
  // In a real implementation, this would track batches with dates
  // For now, we'll use a simplified approach
  return calculateWeightedAverageValue(items);
}

/**
 * Calculate LIFO (Last In, First Out) valuation
 * Assumes newest items are sold first
 * @param items - Array of inventory items
 * @returns LIFO total value
 */
export function calculateLIFOValue(items: InventoryItem[]): number {
  // In a real implementation, this would track batches with dates
  // For now, we'll use a simplified approach
  return calculateWeightedAverageValue(items);
}

/**
 * Calculate valuation by category
 * @param items - Array of inventory items
 * @returns Category-wise valuation breakdown
 */
export function calculateCategoryValuation(items: InventoryItem[]): CategoryValuation[] {
  const categoryMap = new Map<string, { quantity: number; value: number; count: number }>();
  
  items.forEach(item => {
    const existing = categoryMap.get(item.category) || { quantity: 0, value: 0, count: 0 };
    categoryMap.set(item.category, {
      quantity: existing.quantity + item.currentStock,
      value: existing.value + (item.currentStock * item.unitCost),
      count: existing.count + 1
    });
  });
  
  const totalValue = Array.from(categoryMap.values()).reduce((sum, cat) => sum + cat.value, 0);
  
  return Array.from(categoryMap.entries()).map(([category, data]) => ({
    category,
    quantity: data.quantity,
    averageCost: data.quantity > 0 ? Math.round((data.value / data.quantity) * 100) / 100 : 0,
    totalValue: Math.round(data.value * 100) / 100,
    percentage: totalValue > 0 ? Math.round((data.value / totalValue) * 1000) / 10 : 0,
    itemCount: data.count
  })).sort((a, b) => b.totalValue - a.totalValue);
}

/**
 * Calculate complete inventory valuation
 * @param items - Array of inventory items
 * @param method - Valuation method (FIFO, LIFO, WeightedAverage)
 * @param previousValue - Previous period's total value for variance calculation
 * @param cogs - Cost of goods sold
 * @returns Complete valuation metrics
 */
export function calculateInventoryValuation(
  items: InventoryItem[],
  method: ValuationMethod = "WeightedAverage",
  previousValue: number = 0,
  cogs: number = 0
): ValuationMetrics {
  let totalValue: number;
  
  switch (method) {
    case "FIFO":
      totalValue = calculateFIFOValue(items);
      break;
    case "LIFO":
      totalValue = calculateLIFOValue(items);
      break;
    case "WeightedAverage":
    default:
      totalValue = calculateWeightedAverageValue(items);
      break;
  }
  
  const breakdown = calculateCategoryValuation(items);
  const variance = previousValue > 0 
    ? Math.round(((totalValue - previousValue) / previousValue) * 1000) / 10 
    : 0;
  
  return {
    totalValue: Math.round(totalValue * 100) / 100,
    method,
    breakdown,
    costOfGoodsSold: cogs,
    variance,
    lastCalculated: new Date()
  };
}

/**
 * Calculate inventory metrics
 * @param items - Array of inventory items
 * @returns Comprehensive inventory metrics
 */
export function calculateInventoryMetrics(items: InventoryItem[]): InventoryMetrics {
  if (items.length === 0) {
    return {
      totalItems: 0,
      totalQuantity: 0,
      totalValue: 0,
      averageItemValue: 0,
      averageCost: 0,
      averagePrice: 0,
      potentialRevenue: 0,
      potentialProfit: 0
    };
  }
  
  const totalQuantity = items.reduce((sum, item) => sum + item.currentStock, 0);
  const totalValue = items.reduce((sum, item) => sum + (item.currentStock * item.unitCost), 0);
  const totalCost = items.reduce((sum, item) => sum + (item.currentStock * item.unitCost), 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.currentStock * item.unitPrice), 0);
  
  const averageItemValue = totalValue / items.length;
  const averageCost = totalCost / totalQuantity;
  const averagePrice = totalPrice / totalQuantity;
  
  return {
    totalItems: items.length,
    totalQuantity,
    totalValue: Math.round(totalValue * 100) / 100,
    averageItemValue: Math.round(averageItemValue * 100) / 100,
    averageCost: Math.round(averageCost * 100) / 100,
    averagePrice: Math.round(averagePrice * 100) / 100,
    potentialRevenue: Math.round(totalPrice * 100) / 100,
    potentialProfit: Math.round((totalPrice - totalCost) * 100) / 100
  };
}

/**
 * Calculate inventory value change
 * @param currentValue - Current inventory value
 * @param previousValue - Previous inventory value
 * @returns Value change and percentage
 */
export function calculateValueChange(
  currentValue: number,
  previousValue: number
): { change: number; percentChange: number; trend: "up" | "down" | "stable" } {
  const change = currentValue - previousValue;
  const percentChange = previousValue > 0 
    ? Math.round((change / previousValue) * 1000) / 10 
    : 0;
  
  let trend: "up" | "down" | "stable" = "stable";
  if (change > 0) trend = "up";
  if (change < 0) trend = "down";
  
  return {
    change: Math.round(change * 100) / 100,
    percentChange,
    trend
  };
}

/**
 * Get top valued items by stock value
 * @param items - Array of inventory items
 * @param limit - Number of items to return
 * @returns Top valued items
 */
export function getTopValuedItems(items: InventoryItem[], limit: number = 10): InventoryItem[] {
  return [...items]
    .map(item => ({
      item,
      value: item.currentStock * item.unitCost
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit)
    .map(({ item }) => item);
}

/**
 * Get top revenue items
 * @param items - Array of inventory items
 * @param limit - Number of items to return
 * @returns Top revenue items
 */
export function getTopRevenueItems(items: InventoryItem[], limit: number = 10): InventoryItem[] {
  return [...items]
    .map(item => ({
      item,
      revenue: item.currentStock * item.unitPrice
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit)
    .map(({ item }) => item);
}

/**
 * Calculate profit margin by category
 * @param items - Array of inventory items
 * @returns Category-wise profit margins
 */
export function calculateCategoryMargins(
  items: InventoryItem[]
): { category: string; margin: number; totalProfit: number }[] {
  const categoryMap = new Map<string, { cost: number; revenue: number }>();
  
  items.forEach(item => {
    const existing = categoryMap.get(item.category) || { cost: 0, revenue: 0 };
    categoryMap.set(item.category, {
      cost: existing.cost + (item.currentStock * item.unitCost),
      revenue: existing.revenue + (item.currentStock * item.unitPrice)
    });
  });
  
  return Array.from(categoryMap.entries()).map(([category, data]) => ({
    category,
    margin: data.revenue > 0 
      ? Math.round(((data.revenue - data.cost) / data.revenue) * 1000) / 10 
      : 0,
    totalProfit: Math.round((data.revenue - data.cost) * 100) / 100
  })).sort((a, b) => b.margin - a.margin);
}

/**
 * Format currency value
 * @param value - Value to format
 * @returns Formatted string
 */
export function formatCurrencyValue(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

/**
 * Format percentage
 * @param value - Value to format
 * @returns Formatted percentage string
 */
export function formatPercentage(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

