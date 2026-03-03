import { useState, useEffect, useCallback, useRef } from "react";
import {
  CustomerProfile,
  RevenueProjection,
  KPI,
  ScenarioPlanning,
  customerProfiles as mockProfiles,
  revenueProjections as mockRevenue,
  kpis as mockKPIs,
  scenarioPlanning as mockScenarios,
  costStructure as mockCosts,
  cashFlowForecast as mockCashFlow,
  CostStructure,
  CashFlowForecast,
} from "@/lib/business-forecast-data";

interface BusinessDataState {
  customerProfiles: CustomerProfile[];
  revenueProjections: RevenueProjection[];
  kpis: KPI[];
  scenarios: ScenarioPlanning[];
  costStructure: CostStructure[];
  cashFlow: CashFlowForecast[];
  lastUpdated: Date;
  isLoading: boolean;
  error: string | null;
  isConnected: boolean;
}

export function useBusinessData() {
  const [state, setState] = useState<BusinessDataState>({
    customerProfiles: mockProfiles,
    revenueProjections: mockRevenue,
    kpis: mockKPIs,
    scenarios: mockScenarios,
    costStructure: mockCosts,
    cashFlow: mockCashFlow,
    lastUpdated: new Date(),
    isLoading: false,
    error: null,
    isConnected: false,
  });

  const wsRef = useRef<WebSocket | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout>();

  // Simulate real-time business data updates
  const fetchBusinessData = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      await new Promise((resolve) =>
        setTimeout(resolve, 800 + Math.random() * 800),
      );

      // Simulate KPI updates
      const updatedKPIs = mockKPIs.map((kpi) => ({
        ...kpi,
        current: kpi.current * (0.95 + Math.random() * 0.1),
        trend:
          Math.random() > 0.7
            ? (["up", "down", "stable"] as const)[Math.floor(Math.random() * 3)]
            : kpi.trend,
      }));

      // Simulate revenue projection updates
      const updatedRevenue = mockRevenue.map((projection) => ({
        ...projection,
        actualToDate: projection.actualToDate
          ? projection.actualToDate * (0.96 + Math.random() * 0.08)
          : undefined,
        confidence: Math.max(
          50,
          Math.min(95, projection.confidence + (Math.random() - 0.5) * 10),
        ),
      }));

      // Simulate customer profile updates
      const updatedProfiles = mockProfiles.map((profile) => ({
        ...profile,
        demandAssumption: Math.round(
          profile.demandAssumption * (0.95 + Math.random() * 0.1),
        ),
        retention: Math.max(
          60,
          Math.min(95, profile.retention + (Math.random() - 0.5) * 5),
        ),
      }));

      setState((prev) => ({
        ...prev,
        kpis: updatedKPIs,
        revenueProjections: updatedRevenue,
        customerProfiles: updatedProfiles,
        lastUpdated: new Date(),
        isLoading: false,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch business data",
        isLoading: false,
      }));
    }
  }, []);

  // Real-time business metrics simulation
  const connectBusinessWebSocket = useCallback(() => {
    setState((prev) => ({ ...prev, isConnected: true }));

    const simulateBusinessUpdates = () => {
      // Randomly update different business metrics
      const updateType = Math.random();

      if (updateType < 0.4) {
        // Update KPIs
        setState((prev) => ({
          ...prev,
          kpis: prev.kpis.map((kpi) => {
            if (Math.random() < 0.3) {
              return {
                ...kpi,
                current: kpi.current * (0.98 + Math.random() * 0.04),
              };
            }
            return kpi;
          }),
          lastUpdated: new Date(),
        }));
      } else if (updateType < 0.7) {
        // Update customer metrics
        setState((prev) => ({
          ...prev,
          customerProfiles: prev.customerProfiles.map((profile) => ({
            ...profile,
            demandAssumption: Math.round(
              profile.demandAssumption * (0.99 + Math.random() * 0.02),
            ),
          })),
          lastUpdated: new Date(),
        }));
      } else {
        // Update cash flow
        setState((prev) => ({
          ...prev,
          cashFlow: prev.cashFlow.map((flow) => ({
            ...flow,
            cashInflow: flow.cashInflow * (0.95 + Math.random() * 0.1),
            cashOutflow: flow.cashOutflow * (0.95 + Math.random() * 0.1),
            netCashFlow: flow.cashInflow - flow.cashOutflow,
          })),
          lastUpdated: new Date(),
        }));
      }
    };

    // Simulate updates every 8-20 seconds for business data
    const updateInterval = setInterval(
      simulateBusinessUpdates,
      8000 + Math.random() * 12000,
    );

    wsRef.current = {
      readyState: WebSocket.OPEN,
      close: () => clearInterval(updateInterval),
    } as WebSocket;

    return () => {
      clearInterval(updateInterval);
    };
  }, []);

  // Manual refresh
  const refreshData = useCallback(async () => {
    await fetchBusinessData();
  }, [fetchBusinessData]);

  // Update specific KPI
  const updateKPI = useCallback((id: string, newValue: number) => {
    setState((prev) => ({
      ...prev,
      kpis: prev.kpis.map((kpi) =>
        kpi.id === id ? { ...kpi, current: newValue } : kpi,
      ),
      lastUpdated: new Date(),
    }));
  }, []);

  // Update scenario planning
  const updateScenario = useCallback(
    (id: string, updates: Partial<ScenarioPlanning>) => {
      setState((prev) => ({
        ...prev,
        scenarios: prev.scenarios.map((scenario) =>
          scenario.id === id ? { ...scenario, ...updates } : scenario,
        ),
        lastUpdated: new Date(),
      }));
    },
    [],
  );

  // Initialize
  useEffect(() => {
    connectBusinessWebSocket();
    fetchBusinessData();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [connectBusinessWebSocket, fetchBusinessData]);

  return {
    ...state,
    refreshData,
    updateKPI,
    updateScenario,
    reconnect: connectBusinessWebSocket,
  };
}
