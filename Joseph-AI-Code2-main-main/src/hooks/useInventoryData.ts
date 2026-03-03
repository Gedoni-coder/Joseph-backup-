import { useState, useEffect, useCallback } from "react";
import {
  inventoryItems,
  stockMovements,
  demandForecasts,
  inventoryValuation,
  deadStock,
  locations,
  inventoryAudits,
  turnoverMetrics,
  type InventoryItem,
  type StockMovement,
  type DemandForecast,
  type InventoryValuation,
  type DeadStock,
  type Location,
  type InventoryAudit,
  type TurnoverMetrics,
} from "@/lib/inventory-data";

export interface UseInventoryDataReturn {
  inventoryItems: InventoryItem[];
  stockMovements: StockMovement[];
  demandForecasts: DemandForecast[];
  inventoryValuation: InventoryValuation;
  deadStock: DeadStock[];
  locations: Location[];
  inventoryAudits: InventoryAudit[];
  turnoverMetrics: TurnoverMetrics[];
  isLoading: boolean;
  isConnected: boolean;
  lastUpdated: Date;
  error: string | null;
  refreshData: () => void;
  updateStockLevel: (itemId: string, newStock: number) => void;
  addStockMovement: (movement: Omit<StockMovement, "id">) => void;
}

export function useInventoryData(): UseInventoryDataReturn {
  const [data, setData] = useState({
    inventoryItems,
    stockMovements,
    demandForecasts,
    inventoryValuation,
    deadStock,
    locations,
    inventoryAudits,
    turnoverMetrics,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [error, setError] = useState<string | null>(null);

  const refreshData = useCallback(() => {
    setIsLoading(true);
    setError(null);

    // Simulate API call with realistic delay
    setTimeout(
      () => {
        try {
          // Simulate inventory level updates
          const updatedInventoryItems = data.inventoryItems.map((item) => {
            const stockChange = Math.floor((Math.random() - 0.5) * 20);
            const newStock = Math.max(0, item.currentStock + stockChange);

            let newStatus = item.status;
            if (newStock === 0) {
              newStatus = "out-of-stock";
            } else if (newStock <= item.minimumStock) {
              newStatus = "low-stock";
            } else if (newStock >= item.maximumStock) {
              newStatus = "overstock";
            } else {
              newStatus = "in-stock";
            }

            return {
              ...item,
              currentStock: newStock,
              status: newStatus,
              lastStockUpdate: new Date(),
            };
          });

          // Simulate demand forecast updates
          const updatedDemandForecasts = data.demandForecasts.map(
            (forecast) => ({
              ...forecast,
              currentDemand: Math.max(
                0,
                forecast.currentDemand + Math.floor((Math.random() - 0.5) * 20),
              ),
              predictedDemand: Math.max(
                0,
                forecast.predictedDemand +
                  Math.floor((Math.random() - 0.5) * 30),
              ),
              confidence: Math.max(
                50,
                Math.min(100, forecast.confidence + (Math.random() - 0.5) * 5),
              ),
              factors: forecast.factors.map((factor) => ({
                ...factor,
                impact: factor.impact + (Math.random() - 0.5) * 2,
                confidence: Math.max(
                  50,
                  Math.min(100, factor.confidence + (Math.random() - 0.5) * 3),
                ),
              })),
            }),
          );

          // Simulate inventory valuation updates
          const updatedInventoryValuation = {
            ...data.inventoryValuation,
            totalValue:
              data.inventoryValuation.totalValue *
              (1 + (Math.random() - 0.5) * 0.02),
            variance: (Math.random() - 0.5) * 5,
            lastCalculated: new Date(),
            breakdown: data.inventoryValuation.breakdown.map((item) => ({
              ...item,
              totalValue: item.totalValue * (1 + (Math.random() - 0.5) * 0.03),
              averageCost:
                item.averageCost * (1 + (Math.random() - 0.5) * 0.02),
            })),
          };

          // Simulate turnover metrics updates
          const updatedTurnoverMetrics = data.turnoverMetrics.map((metric) => ({
            ...metric,
            turnoverRatio: Math.max(
              0.5,
              metric.turnoverRatio + (Math.random() - 0.5) * 0.5,
            ),
            daysOfSupply: Math.max(
              10,
              metric.daysOfSupply + Math.floor((Math.random() - 0.5) * 10),
            ),
          }));

          // Simulate warehouse utilization updates
          const updatedLocations = data.locations.map((location) => ({
            ...location,
            currentUtilization: Math.max(
              0,
              Math.min(
                location.capacity,
                location.currentUtilization +
                  Math.floor((Math.random() - 0.5) * 100),
              ),
            ),
          }));

          setData({
            inventoryItems: updatedInventoryItems,
            stockMovements: data.stockMovements,
            demandForecasts: updatedDemandForecasts,
            inventoryValuation: updatedInventoryValuation,
            deadStock: data.deadStock,
            locations: updatedLocations,
            inventoryAudits: data.inventoryAudits,
            turnoverMetrics: updatedTurnoverMetrics,
          });

          setLastUpdated(new Date());
          setIsConnected(true);
          setIsLoading(false);
        } catch (err) {
          setError("Failed to update inventory data");
          setIsLoading(false);
        }
      },
      800 + Math.random() * 1200,
    );
  }, [data]);

  const updateStockLevel = useCallback((itemId: string, newStock: number) => {
    setData((prev) => ({
      ...prev,
      inventoryItems: prev.inventoryItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              currentStock: newStock,
              lastStockUpdate: new Date(),
              status:
                newStock === 0
                  ? "out-of-stock"
                  : newStock <= item.minimumStock
                    ? "low-stock"
                    : newStock >= item.maximumStock
                      ? "overstock"
                      : "in-stock",
            }
          : item,
      ),
    }));
  }, []);

  const addStockMovement = useCallback(
    (movement: Omit<StockMovement, "id">) => {
      const newMovement: StockMovement = {
        ...movement,
        id: `SM-${Date.now()}`,
      };

      setData((prev) => ({
        ...prev,
        stockMovements: [newMovement, ...prev.stockMovements],
      }));

      // Update inventory levels based on movement
      updateStockLevel(
        movement.itemId,
        data.inventoryItems.find((item) => item.id === movement.itemId)
          ?.currentStock! + movement.quantity,
      );
    },
    [data.inventoryItems, updateStockLevel],
  );

  useEffect(() => {
    // Initial load
    refreshData();

    // Set up auto-refresh interval
    const interval = setInterval(refreshData, 30000); // Refresh every 30 seconds

    // Simulate WebSocket connection
    const connectWebSocket = () => {
      setIsConnected(true);
      // Simulate occasional disconnections
      const disconnectTimeout = setTimeout(
        () => {
          setIsConnected(false);
          setTimeout(connectWebSocket, 3000);
        },
        60000 + Math.random() * 120000,
      );

      return () => clearTimeout(disconnectTimeout);
    };

    const cleanup = connectWebSocket();

    return () => {
      clearInterval(interval);
      cleanup();
    };
  }, [refreshData]);

  return {
    inventoryItems: data.inventoryItems,
    stockMovements: data.stockMovements,
    demandForecasts: data.demandForecasts,
    inventoryValuation: data.inventoryValuation,
    deadStock: data.deadStock,
    locations: data.locations,
    inventoryAudits: data.inventoryAudits,
    turnoverMetrics: data.turnoverMetrics,
    isLoading,
    isConnected,
    lastUpdated,
    error,
    refreshData,
    updateStockLevel,
    addStockMovement,
  };
}
