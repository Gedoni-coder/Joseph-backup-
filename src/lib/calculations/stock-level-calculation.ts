/**
 * Stock Level Calculation Utilities
 * Contains all business logic for inventory stock level calculations
 */

import { 
  InventoryItem, 
  StockMovement 
} from "@/lib/inventory-data";

export type StockStatus = "in-stock" | "low-stock" | "out-of-stock" | "overstock";

export interface StockLevelMetrics {
  itemId: string;
  itemName: string;
  currentStock: number;
  stockLevelPercent: number;
  status: StockStatus;
  urgencyScore: number;
  daysUntilStockout: number | null;
  reorderNeeded: boolean;
}

export interface StockSummary {
  totalItems: number;
  inStockCount: number;
  lowStockCount: number;
  outOfStockCount: number;
  overstockCount: number;
  totalStockValue: number;
  averageStockLevel: number;
  itemsNeedingReorder: StockLevelMetrics[];
}

/**
 * Calculate stock level percentage
 * @param currentStock - Current stock quantity
 * @param maximumStock - Maximum stock capacity
 * @returns Stock level as percentage (0-100)
 */
export function calculateStockLevelPercent(currentStock: number, maximumStock: number): number {
  if (maximumStock <= 0) return 0;
  const percent = (currentStock / maximumStock) * 100;
  return Math.round(percent * 10) / 10;
}

/**
 * Determine stock status based on current stock and thresholds
 * @param currentStock - Current stock quantity
 * @param minimumStock - Minimum stock threshold
 * @param reorderPoint - Reorder point threshold
 * @param maximumStock - Maximum stock capacity
 * @returns Stock status
 */
export function determineStockStatus(
  currentStock: number,
  minimumStock: number,
  reorderPoint: number,
  maximumStock: number
): StockStatus {
  if (currentStock === 0) return "out-of-stock";
  if (currentStock <= minimumStock) return "low-stock";
  if (currentStock >= maximumStock * 0.9) return "overstock";
  return "in-stock";
}

/**
 * Calculate reorder urgency score (0-100)
 * Higher score = more urgent
 * @param currentStock - Current stock quantity
 * @param reorderPoint - Reorder point threshold
 * @param leadTimeDays - Average lead time in days
 * @param averageDailyDemand - Average daily demand
 * @returns Urgency score (0-100)
 */
export function calculateReorderUrgency(
  currentStock: number,
  reorderPoint: number,
  leadTimeDays: number,
  averageDailyDemand: number
): number {
  if (currentStock <= 0) return 100;
  if (averageDailyDemand <= 0) return 0;
  
  const daysOfStock = currentStock / averageDailyDemand;
  const daysUntilReorderPoint = (currentStock - reorderPoint) / averageDailyDemand;
  
  // If already below reorder point
  if (daysUntilReorderPoint <= 0) return 100;
  
  // Calculate urgency based on how close to reorder point vs lead time
  const urgency = Math.max(0, Math.min(100, 
    ((leadTimeDays - daysUntilReorderPoint) / leadTimeDays) * 100 + 50
  ));
  
  return Math.round(urgency);
}

/**
 * Calculate days until stockout
 * @param currentStock - Current stock quantity
 * @param averageDailyDemand - Average daily demand
 * @returns Days until stockout or null if demand is zero
 */
export function calculateDaysUntilStockout(
  currentStock: number,
  averageDailyDemand: number
): number | null {
  if (averageDailyDemand <= 0) return null;
  return Math.floor(currentStock / averageDailyDemand);
}

/**
 * Get all stock level metrics for an inventory item
 * @param item - Inventory item
 * @param averageDailyDemand - Average daily demand (optional)
 * @param leadTimeDays - Lead time in days (optional)
 * @returns Stock level metrics
 */
export function getStockLevelMetrics(
  item: InventoryItem,
  averageDailyDemand: number = 50,
  leadTimeDays: number = 7
): StockLevelMetrics {
  const stockLevelPercent = calculateStockLevelPercent(
    item.currentStock,
    item.maximumStock
  );
  
  const status = determineStockStatus(
    item.currentStock,
    item.minimumStock,
    item.reorderPoint,
    item.maximumStock
  );
  
  const urgencyScore = calculateReorderUrgency(
    item.currentStock,
    item.reorderPoint,
    leadTimeDays,
    averageDailyDemand
  );
  
  const daysUntilStockout = calculateDaysUntilStockout(
    item.currentStock,
    averageDailyDemand
  );
  
  const reorderNeeded = status === "low-stock" || 
                        status === "out-of-stock" || 
                        urgencyScore > 75;
  
  return {
    itemId: item.id,
    itemName: item.name,
    currentStock: item.currentStock,
    stockLevelPercent,
    status,
    urgencyScore,
    daysUntilStockout,
    reorderNeeded
  };
}

/**
 * Get stock summary for all inventory items
 * @param items - Array of inventory items
 * @param averageDailyDemand - Default average daily demand per item
 * @param leadTimeDays - Default lead time in days
 * @returns Stock summary
 */
export function getStockSummary(
  items: InventoryItem[],
  averageDailyDemand: number = 50,
  leadTimeDays: number = 7
): StockSummary {
  const stockLevels = items.map(item => 
    getStockLevelMetrics(item, averageDailyDemand, leadTimeDays)
  );
  
  const inStockCount = stockLevels.filter(s => s.status === "in-stock").length;
  const lowStockCount = stockLevels.filter(s => s.status === "low-stock").length;
  const outOfStockCount = stockLevels.filter(s => s.status === "out-of-stock").length;
  const overstockCount = stockLevels.filter(s => s.status === "overstock").length;
  
  const totalStockValue = items.reduce(
    (sum, item) => sum + (item.currentStock * item.unitCost),
    0
  );
  
  const averageStockLevel = items.length > 0
    ? stockLevels.reduce((sum, s) => sum + s.stockLevelPercent, 0) / items.length
    : 0;
  
  const itemsNeedingReorder = stockLevels
    .filter(s => s.reorderNeeded)
    .sort((a, b) => b.urgencyScore - a.urgencyScore);
  
  return {
    totalItems: items.length,
    inStockCount,
    lowStockCount,
    outOfStockCount,
    overstockCount,
    totalStockValue: Math.round(totalStockValue * 100) / 100,
    averageStockLevel: Math.round(averageStockLevel * 10) / 10,
    itemsNeedingReorder
  };
}

/**
 * Calculate stock value for an item
 * @param item - Inventory item
 * @returns Total stock value
 */
export function calculateItemStockValue(item: InventoryItem): number {
  return item.currentStock * item.unitCost;
}

/**
 * Calculate potential revenue for an item
 * @param item - Inventory item
 * @returns Potential revenue
 */
export function calculateItemPotentialRevenue(item: InventoryItem): number {
  return item.currentStock * item.unitPrice;
}

/**
 * Calculate profit margin for an item
 * @param item - Inventory item
 * @returns Profit margin as percentage
 */
export function calculateItemProfitMargin(item: InventoryItem): number {
  if (item.unitPrice === 0) return 0;
  const margin = ((item.unitPrice - item.unitCost) / item.unitPrice) * 100;
  return Math.round(margin * 10) / 10;
}

/**
 * Get items sorted by urgency
 * @param items - Array of inventory items
 * @param averageDailyDemand - Default average daily demand
 * @param leadTimeDays - Lead time in days
 * @returns Sorted array of stock level metrics
 */
export function getItemsByUrgency(
  items: InventoryItem[],
  averageDailyDemand: number = 50,
  leadTimeDays: number = 7
): StockLevelMetrics[] {
  return items
    .map(item => getStockLevelMetrics(item, averageDailyDemand, leadTimeDays))
    .sort((a, b) => b.urgencyScore - a.urgencyScore);
}

/**
 * Filter items by stock status
 * @param items - Array of inventory items
 * @param status - Status to filter by
 * @returns Filtered items
 */
export function filterItemsByStatus(
  items: InventoryItem[],
  status: StockStatus
): InventoryItem[] {
  return items.filter(item => {
    const detectedStatus = determineStockStatus(
      item.currentStock,
      item.minimumStock,
      item.reorderPoint,
      item.maximumStock
    );
    return detectedStatus === status;
  });
}

/**
 * Calculate net stock movement from movements array
 * @param movements - Array of stock movements
 * @param itemId - Item ID to filter by
 * @returns Net quantity change
 */
export function calculateNetStockMovement(
  movements: StockMovement[],
  itemId: string
): number {
  const itemMovements = movements.filter(m => m.itemId === itemId);
  return itemMovements.reduce((sum, m) => sum + m.quantity, 0);
}

/**
 * Format stock level for display
 * @param percent - Stock level percentage
 * @returns Formatted string
 */
export function formatStockLevel(percent: number): string {
  if (percent >= 90) return "Critical (Overstock)";
  if (percent >= 70) return "Healthy";
  if (percent >= 40) return "Moderate";
  if (percent >= 20) return "Low";
  return "Critical";
}

/**
 * Get status color code
 * @param status - Stock status
 * @returns Color code
 */
export function getStatusColor(status: StockStatus): string {
  switch (status) {
    case "in-stock": return "#22c55e"; // green
    case "low-stock": return "#eab308"; // yellow
    case "out-of-stock": return "#ef4444"; // red
    case "overstock": return "#3b82f6"; // blue
    default: return "#6b7280"; // gray
  }
}

