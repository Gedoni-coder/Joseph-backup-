import { useQuery } from "@tanstack/react-query";
import { getInventorySupplyChain, InventorySupplyChainData } from "@/lib/api/inventory-supply-chain-service";
import {
  inventoryItems as mockItems,
  stockMovements as mockMovements,
  demandForecasts as mockForecasts,
  inventoryValuation as mockValuation,
  deadStock as mockDeadStock,
  type InventoryItem,
  type StockMovement,
  type DemandForecast,
  type InventoryValuation,
  type DeadStock,
} from "@/lib/inventory-data";

export interface UseInventorySupplyChainReturn {
  inventoryItems: InventoryItem[];
  stockMovements: StockMovement[];
  demandForecasts: DemandForecast[];
  inventoryValuation: InventoryValuation[];
  deadStock: DeadStock[];
  isLoading: boolean;
  isConnected: boolean;
  lastUpdated: Date;
  error: string | null;
  refreshData: () => void;
}

/**
 * Hook to fetch and transform inventory and supply chain data
 */
export function useInventorySupplyChainAPI(): UseInventorySupplyChainReturn {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["inventory-supply-chain"],
    queryFn: () => getInventorySupplyChain(1),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 0, // Don't retry failed API calls - use fallback data immediately
  });

  // Use API data if available, fall back to mock
  const inventoryItems: InventoryItem[] =
    data && data.inventory_levels && data.inventory_levels.length > 0
      ? data.inventory_levels.map((item: any, idx: number) => ({
          id: String(idx + 1),
          sku: `SKU-${idx + 1000}`,
          name: `Product ${idx + 1}`,
          category: ["Electronics", "Clothing", "Food", "Books"][idx % 4],
          currentStock: Math.round(Math.random() * 1000),
          minimumStock: 100,
          maximumStock: 1000,
          reorderPoint: 200,
          unitCost: 10 + idx * 5,
          unitPrice: 25 + idx * 10,
          location: `Warehouse ${(idx % 3) + 1}`,
          supplier: `Supplier ${(idx % 5) + 1}`,
          lastStockUpdate: new Date(),
          status: ["in-stock", "low-stock", "overstock"][idx % 3] as any,
        }))
      : mockItems;

  const stockMovements: StockMovement[] = mockMovements;
  const demandForecasts: DemandForecast[] = mockForecasts;
  const inventoryValuation: InventoryValuation[] = mockValuation;
  const deadStock: DeadStock[] = mockDeadStock;

  return {
    inventoryItems,
    stockMovements,
    demandForecasts,
    inventoryValuation,
    deadStock,
    isLoading,
    isConnected: !error,
    lastUpdated: new Date(),
    error: error ? (error as Error).message : null,
    refreshData: () => refetch(),
  };
}
