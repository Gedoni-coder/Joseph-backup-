import { useState, useEffect, useCallback } from "react";
import {
  suppliers,
  procurementOrders,
  productionPlans,
  warehouseOperations,
  logisticsMetrics,
  marketVolatility,
  regulatoryCompliance,
  disruptionRisks,
  sustainabilityMetrics,
  type Supplier,
  type ProcurementOrder,
  type ProductionPlan,
  type WarehouseOperation,
  type LogisticsMetrics,
  type MarketVolatility,
  type RegulatoryCompliance,
  type DisruptionRisk,
  type SustainabilityMetrics,
} from "@/lib/supply-chain-data";

export interface UseSupplyChainDataReturn {
  suppliers: Supplier[];
  procurementOrders: ProcurementOrder[];
  productionPlans: ProductionPlan[];
  warehouseOperations: WarehouseOperation[];
  logisticsMetrics: LogisticsMetrics[];
  marketVolatility: MarketVolatility[];
  regulatoryCompliance: RegulatoryCompliance[];
  disruptionRisks: DisruptionRisk[];
  sustainabilityMetrics: SustainabilityMetrics[];
  isLoading: boolean;
  isConnected: boolean;
  lastUpdated: Date;
  error: string | null;
  refreshData: () => void;
  updateSupplierPerformance: (
    supplierId: string,
    metrics: Partial<Supplier["performanceMetrics"]>,
  ) => void;
  updateOrderStatus: (
    orderId: string,
    status: ProcurementOrder["status"],
  ) => void;
}

export function useSupplyChainData(): UseSupplyChainDataReturn {
  const [data, setData] = useState({
    suppliers,
    procurementOrders,
    productionPlans,
    warehouseOperations,
    logisticsMetrics,
    marketVolatility,
    regulatoryCompliance,
    disruptionRisks,
    sustainabilityMetrics,
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
          // Simulate supplier performance updates
          const updatedSuppliers = data.suppliers.map((supplier) => ({
            ...supplier,
            performanceMetrics: {
              ...supplier.performanceMetrics,
              onTimeDelivery: Math.max(
                70,
                Math.min(
                  100,
                  supplier.performanceMetrics.onTimeDelivery +
                    (Math.random() - 0.5) * 3,
                ),
              ),
              qualityRating: Math.max(
                80,
                Math.min(
                  100,
                  supplier.performanceMetrics.qualityRating +
                    (Math.random() - 0.5) * 2,
                ),
              ),
              responseTime: Math.max(
                70,
                Math.min(
                  100,
                  supplier.performanceMetrics.responseTime +
                    (Math.random() - 0.5) * 4,
                ),
              ),
              overallScore: Math.max(
                75,
                Math.min(
                  100,
                  supplier.performanceMetrics.overallScore +
                    (Math.random() - 0.5) * 2,
                ),
              ),
            },
            sustainabilityScore: Math.max(
              60,
              Math.min(
                100,
                supplier.sustainabilityScore + (Math.random() - 0.5) * 3,
              ),
            ),
          }));

          // Simulate production plan progress
          const updatedProductionPlans = data.productionPlans.map((plan) => ({
            ...plan,
            actualQuantity: Math.min(
              plan.plannedQuantity,
              plan.actualQuantity + Math.floor(Math.random() * 20),
            ),
            efficiency: Math.max(
              70,
              Math.min(100, plan.efficiency + (Math.random() - 0.5) * 5),
            ),
            costVariance: plan.costVariance + (Math.random() - 0.5) * 2,
          }));

          // Simulate warehouse efficiency updates
          const updatedWarehouseOperations = data.warehouseOperations.map(
            (warehouse) => ({
              ...warehouse,
              efficiency: {
                ...warehouse.efficiency,
                storageUtilization: Math.max(
                  60,
                  Math.min(
                    95,
                    warehouse.efficiency.storageUtilization +
                      (Math.random() - 0.5) * 3,
                  ),
                ),
                pickingAccuracy: Math.max(
                  95,
                  Math.min(
                    100,
                    warehouse.efficiency.pickingAccuracy +
                      (Math.random() - 0.5) * 0.5,
                  ),
                ),
                orderFulfillmentTime: Math.max(
                  12,
                  warehouse.efficiency.orderFulfillmentTime +
                    (Math.random() - 0.5) * 4,
                ),
              },
              staffing: {
                ...warehouse.staffing,
                productivityIndex: Math.max(
                  80,
                  Math.min(
                    100,
                    warehouse.staffing.productivityIndex +
                      (Math.random() - 0.5) * 3,
                  ),
                ),
              },
            }),
          );

          // Simulate logistics performance updates
          const updatedLogisticsMetrics = data.logisticsMetrics.map(
            (logistics) => ({
              ...logistics,
              deliveryPerformance: {
                ...logistics.deliveryPerformance,
                onTimeRate: Math.max(
                  85,
                  Math.min(
                    100,
                    logistics.deliveryPerformance.onTimeRate +
                      (Math.random() - 0.5) * 2,
                  ),
                ),
                averageTransitTime: Math.max(
                  1.5,
                  logistics.deliveryPerformance.averageTransitTime +
                    (Math.random() - 0.5) * 0.3,
                ),
                damageRate: Math.max(
                  0,
                  Math.min(
                    5,
                    logistics.deliveryPerformance.damageRate +
                      (Math.random() - 0.5) * 0.2,
                  ),
                ),
              },
              fleetUtilization: Math.max(
                70,
                Math.min(
                  95,
                  logistics.fleetUtilization + (Math.random() - 0.5) * 3,
                ),
              ),
            }),
          );

          // Simulate market volatility updates
          const updatedMarketVolatility = data.marketVolatility.map(
            (market) => ({
              ...market,
              currentPrice: Math.max(
                0,
                market.currentPrice * (1 + (Math.random() - 0.5) * 0.05),
              ),
              priceChange: (Math.random() - 0.5) * 20,
              volatilityIndex: Math.max(
                20,
                Math.min(
                  100,
                  market.volatilityIndex + (Math.random() - 0.5) * 10,
                ),
              ),
              factors: market.factors.map((factor) => ({
                ...factor,
                impact: factor.impact + (Math.random() - 0.5) * 3,
                likelihood: Math.max(
                  30,
                  Math.min(100, factor.likelihood + (Math.random() - 0.5) * 5),
                ),
              })),
            }),
          );

          // Simulate disruption risk updates
          const updatedDisruptionRisks = data.disruptionRisks.map((risk) => ({
            ...risk,
            probability: Math.max(
              10,
              Math.min(90, risk.probability + (Math.random() - 0.5) * 5),
            ),
            riskScore: Math.max(
              5,
              Math.min(50, risk.riskScore + (Math.random() - 0.5) * 3),
            ),
          }));

          // Simulate sustainability metrics updates
          const updatedSustainabilityMetrics = data.sustainabilityMetrics.map(
            (sustainability) => ({
              ...sustainability,
              carbonFootprint: Math.max(
                1.0,
                sustainability.carbonFootprint + (Math.random() - 0.5) * 0.2,
              ),
              energyEfficiency: Math.max(
                70,
                Math.min(
                  100,
                  sustainability.energyEfficiency + (Math.random() - 0.5) * 2,
                ),
              ),
              sustainabilityScore: Math.max(
                60,
                Math.min(
                  100,
                  sustainability.sustainabilityScore +
                    (Math.random() - 0.5) * 2,
                ),
              ),
            }),
          );

          setData({
            suppliers: updatedSuppliers,
            procurementOrders: data.procurementOrders,
            productionPlans: updatedProductionPlans,
            warehouseOperations: updatedWarehouseOperations,
            logisticsMetrics: updatedLogisticsMetrics,
            marketVolatility: updatedMarketVolatility,
            regulatoryCompliance: data.regulatoryCompliance,
            disruptionRisks: updatedDisruptionRisks,
            sustainabilityMetrics: updatedSustainabilityMetrics,
          });

          setLastUpdated(new Date());
          setIsConnected(true);
          setIsLoading(false);
        } catch (err) {
          setError("Failed to update supply chain data");
          setIsLoading(false);
        }
      },
      1000 + Math.random() * 1500,
    );
  }, [data]);

  const updateSupplierPerformance = useCallback(
    (supplierId: string, metrics: Partial<Supplier["performanceMetrics"]>) => {
      setData((prev) => ({
        ...prev,
        suppliers: prev.suppliers.map((supplier) =>
          supplier.id === supplierId
            ? {
                ...supplier,
                performanceMetrics: {
                  ...supplier.performanceMetrics,
                  ...metrics,
                },
              }
            : supplier,
        ),
      }));
    },
    [],
  );

  const updateOrderStatus = useCallback(
    (orderId: string, status: ProcurementOrder["status"]) => {
      setData((prev) => ({
        ...prev,
        procurementOrders: prev.procurementOrders.map((order) =>
          order.id === orderId ? { ...order, status } : order,
        ),
      }));
    },
    [],
  );

  useEffect(() => {
    // Initial load
    refreshData();

    // Set up auto-refresh interval
    const interval = setInterval(refreshData, 35000); // Refresh every 35 seconds

    // Simulate WebSocket connection
    const connectWebSocket = () => {
      setIsConnected(true);
      // Simulate occasional disconnections
      const disconnectTimeout = setTimeout(
        () => {
          setIsConnected(false);
          setTimeout(connectWebSocket, 4000);
        },
        70000 + Math.random() * 100000,
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
    suppliers: data.suppliers,
    procurementOrders: data.procurementOrders,
    productionPlans: data.productionPlans,
    warehouseOperations: data.warehouseOperations,
    logisticsMetrics: data.logisticsMetrics,
    marketVolatility: data.marketVolatility,
    regulatoryCompliance: data.regulatoryCompliance,
    disruptionRisks: data.disruptionRisks,
    sustainabilityMetrics: data.sustainabilityMetrics,
    isLoading,
    isConnected,
    lastUpdated,
    error,
    refreshData,
    updateSupplierPerformance,
    updateOrderStatus,
  };
}
