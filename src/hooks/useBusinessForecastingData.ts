import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCustomerProfiles,
  getRevenueProjections,
  getCostStructures,
  getCashFlowForecasts,
  getKPIs,
  getScenarioPlannings,
  createCustomerProfile,
  updateCustomerProfile,
  deleteCustomerProfile,
  createRevenueProjection,
  updateRevenueProjection,
  deleteRevenueProjection,
  createCostStructure,
  updateCostStructure,
  deleteCostStructure,
  createCashFlowForecast,
  updateCashFlowForecast,
  deleteCashFlowForecast,
  createKPI,
  updateKPI,
  deleteKPI,
  createScenarioPlanning,
  updateScenarioPlanning,
  deleteScenarioPlanning,
  type CustomerProfile as ApiCustomerProfile,
  type RevenueProjection as ApiRevenueProjection,
  type CostStructure as ApiCostStructure,
  type CashFlowForecast as ApiCashFlowForecast,
  type KPI as ApiKPI,
  type ScenarioPlanning as ApiScenarioPlanning,
} from "@/lib/api/business-forecasting-service";
import {
  CustomerProfile,
  RevenueProjection,
  KPI,
  ScenarioPlanning,
  costStructure as mockCosts,
  cashFlowForecast as mockCashFlow,
  customerProfiles as mockCustomerProfiles,
  revenueProjections as mockRevenueProjections,
  kpis as mockKpis,
  scenarioPlanning as mockScenarios,
  CostStructure,
  CashFlowForecast,
} from "@/lib/business-forecast-data";

// Transform API CustomerProfile to UI format
function transformCustomerProfile(apiProfile: ApiCustomerProfile): CustomerProfile {
  return {
    id: String(apiProfile.id),
    segment: apiProfile.segment.charAt(0).toUpperCase() + apiProfile.segment.slice(1),
    demandAssumption: apiProfile.lifetime_value / 10000, // Approximate
    growthRate: apiProfile.order_frequency * 5, // Approximate
    retention: 85 - (apiProfile.risk_score === 'high' ? 20 : apiProfile.risk_score === 'medium' ? 10 : 0),
    avgOrderValue: apiProfile.average_order_value,
    seasonality: 10,
  };
}

// Transform API RevenueProjection to UI format
function transformRevenueProjection(apiProjection: ApiRevenueProjection): RevenueProjection {
  const periodMap: Record<string, string> = {
    '1m': 'Month 1',
    '3m': 'Q1 2025',
    '6m': 'H1 2025',
    '1y': '2025',
  };
  return {
    id: String(apiProjection.id),
    period: periodMap[apiProjection.period] || apiProjection.period,
    projected: apiProjection.projected_revenue,
    conservative: apiProjection.projected_revenue * 0.8,
    optimistic: apiProjection.projected_revenue * 1.2,
    confidence: apiProjection.confidence,
  };
}

// Transform API KPI to UI format
function transformKPI(apiKPI: ApiKPI): KPI {
  const trend = apiKPI.current_value > apiKPI.target_value * 0.9 ? 'up' : 
                apiKPI.current_value < apiKPI.target_value * 0.7 ? 'down' : 'stable';
  const categoryMap: Record<string, string> = {
    'on_track': 'Financial',
    'at_risk': 'Customer',
    'off_track': 'Operational',
  };
  return {
    id: String(apiKPI.id),
    name: apiKPI.name,
    current: apiKPI.current_value,
    target: apiKPI.target_value,
    unit: apiKPI.unit,
    trend: trend as 'up' | 'down' | 'stable',
    category: categoryMap[apiKPI.status] || 'Financial',
    frequency: 'Monthly',
  };
}

// Transform API ScenarioPlanning to UI format
function transformScenarioPlanning(apiScenario: ApiScenarioPlanning): ScenarioPlanning {
  const scenarioMap: Record<string, 'Best Case' | 'Base Case' | 'Worst Case'> = {
    'optimistic': 'Best Case',
    'base': 'Base Case',
    'pessimistic': 'Worst Case',
  };
  return {
    id: String(apiScenario.id),
    scenario: scenarioMap[apiScenario.type] || 'Base Case',
    revenue: apiScenario.probability * 100000, // Approximate
    costs: apiScenario.probability * 70000, // Approximate
    profit: apiScenario.probability * 30000, // Approximate
    probability: apiScenario.probability,
    keyAssumptions: [apiScenario.description],
  };
}

// Transform API CostStructure to UI format
function transformCostStructure(apiCost: ApiCostStructure): CostStructure {
  return {
    id: String(apiCost.id),
    category: apiCost.name,
    type: apiCost.category === 'fixed' ? 'COGS' : 'Operating',
    amount: apiCost.amount,
    percentage: 0, // Calculate if needed
    variability: apiCost.category === 'fixed' ? 'Fixed' : 
                  apiCost.category === 'variable' ? 'Variable' : 'Semi-Variable',
    trend: 'stable' as const,
  };
}

// Transform API CashFlowForecast to UI format
function transformCashFlowForecast(apiCashFlow: ApiCashFlowForecast): CashFlowForecast {
  return {
    id: String(apiCashFlow.id),
    month: apiCashFlow.period,
    cashInflow: apiCashFlow.cash_inflow,
    cashOutflow: apiCashFlow.cash_outflow,
    netCashFlow: apiCashFlow.net_position,
    cumulativeCash: apiCashFlow.cash_inflow - apiCashFlow.cash_outflow,
    workingCapital: apiCashFlow.cash_inflow * 0.2,
  };
}

interface BusinessForecastingData {
  customerProfiles: CustomerProfile[];
  revenueProjections: RevenueProjection[];
  kpis: KPI[];
  scenarios: ScenarioPlanning[];
  costStructure: CostStructure[];
  cashFlowForecast: CashFlowForecast[];
  lastUpdated: Date;
  isLoading: boolean;
  error: string | null;
  isConnected: boolean;
}

/**
 * Hook to fetch and transform business forecasting data from Django API
 */
export function useBusinessForecastingData() {
  const queryClient = useQueryClient();

  // Fetch all data in parallel
  const customerProfilesQuery = useQuery({
    queryKey: ['business', 'customer-profiles'],
    queryFn: getCustomerProfiles,
    staleTime: 5 * 60 * 1000,
  });

  const revenueProjectionsQuery = useQuery({
    queryKey: ['business', 'revenue-projections'],
    queryFn: getRevenueProjections,
    staleTime: 5 * 60 * 1000,
  });

  const costStructuresQuery = useQuery({
    queryKey: ['business', 'cost-structures'],
    queryFn: getCostStructures,
    staleTime: 5 * 60 * 1000,
  });

  const cashFlowForecastsQuery = useQuery({
    queryKey: ['business', 'cash-flow-forecasts'],
    queryFn: getCashFlowForecasts,
    staleTime: 5 * 60 * 1000,
  });

  const kpisQuery = useQuery({
    queryKey: ['business', 'kpis'],
    queryFn: getKPIs,
    staleTime: 5 * 60 * 1000,
  });

  const scenarioPlanningsQuery = useQuery({
    queryKey: ['business', 'scenario-plannings'],
    queryFn: getScenarioPlannings,
    staleTime: 5 * 60 * 1000,
  });

  // Check if any query has error
  const hasError = customerProfilesQuery.isError || 
                   revenueProjectionsQuery.isError || 
                   costStructuresQuery.isError ||
                   cashFlowForecastsQuery.isError ||
                   kpisQuery.isError ||
                   scenarioPlanningsQuery.isError;

  const isConnected = !hasError;

  // Transform data or use mock as fallback
  const customerProfiles = customerProfilesQuery.data && customerProfilesQuery.data.length > 0
    ? customerProfilesQuery.data.map(transformCustomerProfile)
    : mockCustomerProfiles;

  const revenueProjections = revenueProjectionsQuery.data && revenueProjectionsQuery.data.length > 0
    ? revenueProjectionsQuery.data.map(transformRevenueProjection)
    : mockRevenueProjections;

  const costStructure = costStructuresQuery.data && costStructuresQuery.data.length > 0
    ? costStructuresQuery.data.map(transformCostStructure)
    : mockCosts;

  const cashFlowForecast = cashFlowForecastsQuery.data && cashFlowForecastsQuery.data.length > 0
    ? cashFlowForecastsQuery.data.map(transformCashFlowForecast)
    : mockCashFlow;

  const kpis = kpisQuery.data && kpisQuery.data.length > 0
    ? kpisQuery.data.map(transformKPI)
    : mockKpis;

  const scenarios = scenarioPlanningsQuery.data && scenarioPlanningsQuery.data.length > 0
    ? scenarioPlanningsQuery.data.map(transformScenarioPlanning)
    : mockScenarios;

  const isLoading = customerProfilesQuery.isLoading || 
                    revenueProjectionsQuery.isLoading || 
                    costStructuresQuery.isLoading ||
                    cashFlowForecastsQuery.isLoading ||
                    kpisQuery.isLoading ||
                    scenarioPlanningsQuery.isLoading;

  const error = hasError ? 'Failed to fetch some data from API' : null;

  // Refresh all queries
  const refreshData = () => {
    queryClient.invalidateQueries({ queryKey: ['business'] });
  };

  // ==================== MUTATIONS ====================

  // Customer Profile mutations
  const createCustomerProfileMutation = useMutation({
    mutationFn: createCustomerProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business', 'customer-profiles'] });
    },
  });

  const updateCustomerProfileMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ApiCustomerProfile> }) => 
      updateCustomerProfile(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business', 'customer-profiles'] });
    },
  });

  const deleteCustomerProfileMutation = useMutation({
    mutationFn: deleteCustomerProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business', 'customer-profiles'] });
    },
  });

  // Revenue Projection mutations
  const createRevenueProjectionMutation = useMutation({
    mutationFn: createRevenueProjection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business', 'revenue-projections'] });
    },
  });

  const updateRevenueProjectionMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ApiRevenueProjection> }) => 
      updateRevenueProjection(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business', 'revenue-projections'] });
    },
  });

  const deleteRevenueProjectionMutation = useMutation({
    mutationFn: deleteRevenueProjection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business', 'revenue-projections'] });
    },
  });

  // Cost Structure mutations
  const createCostStructureMutation = useMutation({
    mutationFn: createCostStructure,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business', 'cost-structures'] });
    },
  });

  const updateCostStructureMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ApiCostStructure> }) => 
      updateCostStructure(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business', 'cost-structures'] });
    },
  });

  const deleteCostStructureMutation = useMutation({
    mutationFn: deleteCostStructure,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business', 'cost-structures'] });
    },
  });

  // Cash Flow Forecast mutations
  const createCashFlowForecastMutation = useMutation({
    mutationFn: createCashFlowForecast,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business', 'cash-flow-forecasts'] });
    },
  });

  const updateCashFlowForecastMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ApiCashFlowForecast> }) => 
      updateCashFlowForecast(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business', 'cash-flow-forecasts'] });
    },
  });

  const deleteCashFlowForecastMutation = useMutation({
    mutationFn: deleteCashFlowForecast,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business', 'cash-flow-forecasts'] });
    },
  });

  // KPI mutations
  const createKPIMutation = useMutation({
    mutationFn: createKPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business', 'kpis'] });
    },
  });

  const updateKPIMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ApiKPI> }) => 
      updateKPI(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business', 'kpis'] });
    },
  });

  const deleteKPIMutation = useMutation({
    mutationFn: deleteKPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business', 'kpis'] });
    },
  });

  // Scenario Planning mutations
  const createScenarioPlanningMutation = useMutation({
    mutationFn: createScenarioPlanning,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business', 'scenario-plannings'] });
    },
  });

  const updateScenarioPlanningMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ApiScenarioPlanning> }) => 
      updateScenarioPlanning(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business', 'scenario-plannings'] });
    },
  });

  const deleteScenarioPlanningMutation = useMutation({
    mutationFn: deleteScenarioPlanning,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business', 'scenario-plannings'] });
    },
  });

  return {
    // Data
    customerProfiles,
    revenueProjections,
    kpis,
    scenarios,
    costStructure,
    cashFlowForecast,
    
    // Status
    lastUpdated: new Date(),
    isLoading,
    error,
    isConnected,
    
    // Actions
    refreshData,
    reconnect: refreshData,
    
    // Update functions (for backward compatibility)
    updateKPI: async (id: string, newValue: number) => {
      // Find the KPI in the current data and update via API
      const kpi = kpis.find(k => k.id === id);
      if (kpi) {
        await updateKPIMutation.mutateAsync({ 
          id: parseInt(id), 
          data: { current_value: newValue } 
        });
      }
    },
    
    updateScenario: async (id: string, updates: Partial<ScenarioPlanning>) => {
      await updateScenarioPlanningMutation.mutateAsync({
        id: parseInt(id),
        data: {
          description: updates.keyAssumptions?.join(', ') || '',
          probability: updates.probability,
        },
      });
    },
    
    // CRUD operations for each entity type
    // Customer Profiles
    addCustomerProfile: (data: Partial<CustomerProfile>) => {
      return createCustomerProfileMutation.mutateAsync({
        name: data.segment,
        email: 'info@example.com',
        segment: data.segment?.toLowerCase() as 'enterprise' | 'smb' | 'retail' | 'wholesale',
        lifetime_value: data.demandAssumption || 0,
        average_order_value: data.avgOrderValue || 0,
        order_frequency: Math.round((data.growthRate || 0) / 5),
        risk_score: data.retention && data.retention > 80 ? 'low' : 
                    data.retention && data.retention > 60 ? 'medium' : 'high',
        preferences: {},
      });
    },
    
    // Revenue Projections
    addRevenueProjection: (data: Partial<RevenueProjection>) => {
      return createRevenueProjectionMutation.mutateAsync({
        name: data.period || 'New Projection',
        period: '1y',
        projected_revenue: data.projected || 0,
        confidence: data.confidence || 75,
        assumptions: '',
      });
    },
    
    // Cost Structures
    addCostStructure: (data: Partial<CostStructure>) => {
      return createCostStructureMutation.mutateAsync({
        name: data.category || 'New Cost',
        category: data.variability?.toLowerCase() as 'fixed' | 'variable' | 'semi_variable' || 'variable',
        amount: data.amount || 0,
        period: 'monthly',
        description: '',
      });
    },
    
    // Cash Flow Forecasts
    addCashFlowForecast: (data: Partial<CashFlowForecast>) => {
      return createCashFlowForecastMutation.mutateAsync({
        name: data.month || 'New Period',
        period: 'monthly',
        cash_inflow: data.cashInflow || 0,
        cash_outflow: data.cashOutflow || 0,
        net_position: data.netCashFlow || 0,
        notes: '',
      });
    },
    
    // KPIs
    addKPI: (data: Partial<KPI>) => {
      return createKPIMutation.mutateAsync({
        name: data.name || 'New KPI',
        current_value: data.current || 0,
        target_value: data.target || 100,
        unit: data.unit || '%',
        status: data.trend === 'up' ? 'on_track' : data.trend === 'down' ? 'off_track' : 'at_risk',
        description: '',
      });
    },
    
    // Scenario Planning
    addScenarioPlanning: (data: Partial<ScenarioPlanning>) => {
      return createScenarioPlanningMutation.mutateAsync({
        name: data.scenario || 'New Scenario',
        type: data.scenario === 'Best Case' ? 'optimistic' : 
              data.scenario === 'Worst Case' ? 'pessimistic' : 'base',
        probability: data.probability || 50,
        description: data.keyAssumptions?.join(', ') || '',
        impact_analysis: {},
      });
    },
  };
}
