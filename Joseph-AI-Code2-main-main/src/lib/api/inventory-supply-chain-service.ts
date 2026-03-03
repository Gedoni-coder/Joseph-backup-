/**
 * Inventory & Supply Chain Service
 * Connected to Django REST API
 */

import { djangoGet, djangoPost, djangoPatch, djangoDelete } from "./django-client";

export interface InventorySupplyChainData {
  id: number;
  created_at: string;
  account_id: number;
  total_inventory_value: number;
  inventory_turnover_ratio: number;
  stockout_incidents: number;
  supplier_count: number;
  supply_chain_efficiency_score: number;
  lead_time_days: number;
  inventory_levels: string[];
  sku_performance: string[];
  supplier_performance: string[];
  demand_forecasts: string[];
  reorder_points: string[];
  safety_stock_levels: string[];
  supply_chain_risks: string[];
  optimization_recommendations: string[];
}

export type InventorySupplyChainCreateData = Omit<InventorySupplyChainData, "id" | "created_at">;
export type InventorySupplyChainUpdateData = Partial<InventorySupplyChainCreateData>;

/**
 * Get all inventory and supply chain records
 */
export async function getInventorySupplyChainRecords(): Promise<InventorySupplyChainData[]> {
  try {
    return await djangoGet<InventorySupplyChainData[]>("/api/inventory/items/");
  } catch (error) {
    console.error("[Django API] Error fetching inventory supply chain records:", error);
    return [];
  }
}

/**
 * Get a specific inventory and supply chain record by ID
 */
export async function getInventorySupplyChain(id: number): Promise<InventorySupplyChainData | null> {
  try {
    return await djangoGet<InventorySupplyChainData>(`/api/inventory/items/${id}/`);
  } catch (error) {
    console.error(`[Django API] Error fetching inventory supply chain ${id}:`, error);
    return null;
  }
}

/**
 * Create a new inventory and supply chain record
 */
export async function createInventorySupplyChain(data: InventorySupplyChainCreateData): Promise<InventorySupplyChainData | null> {
  try {
    return await djangoPost<InventorySupplyChainData>("/api/inventory/items/", data);
  } catch (error) {
    console.error("[Django API] Error creating inventory supply chain:", error);
    return null;
  }
}

/**
 * Update an existing inventory and supply chain record
 */
export async function updateInventorySupplyChain(id: number, data: InventorySupplyChainUpdateData): Promise<InventorySupplyChainData | null> {
  try {
    return await djangoPatch<InventorySupplyChainData>(`/api/inventory/items/${id}/`, data);
  } catch (error) {
    console.error(`[Django API] Error updating inventory supply chain ${id}:`, error);
    return null;
  }
}

/**
 * Delete an inventory and supply chain record
 */
export async function deleteInventorySupplyChain(id: number): Promise<boolean> {
  try {
    await djangoDelete(`/api/inventory/items/${id}/`);
    return true;
  } catch (error) {
    console.error(`[Django API] Error deleting inventory supply chain ${id}:`, error);
    return false;
  }
}
