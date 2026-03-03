import { useQuery } from "@tanstack/react-query";
import {
  getBusinessForecasts,
  BusinessForecastingData,
} from "@/lib/api/business-forecasting-service";
import {
  CustomerProfile,
  RevenueProjection,
  KPI,
  ScenarioPlanning,
  revenueProjections as mockRevenueProjections,
  customerProfiles as mockCustomerProfiles,
  kpis as mockKpis,
  scenarioPlanning as mockScenarios,
} from "@/lib/business-forecast-data";

interface TransformedBusinessData {
  customerProfiles: CustomerProfile[];
  revenueProjections: RevenueProjection[];
  kpis: KPI[];
  scenarios: ScenarioPlanning[];
  lastUpdated: Date;
  isLoading: boolean;
  error: string | null;
  isConnected: boolean;
}

/**
 * Transform Xano API response to component-ready data structures
 */
function transformBusinessForecastingData(
  data: BusinessForecastingData[],
): TransformedBusinessData {
  if (!data || data.length === 0) {
    return {
      customerProfiles: mockCustomerProfiles,
      revenueProjections: mockRevenueProjections,
      kpis: mockKpis,
      scenarios: mockScenarios,
      lastUpdated: new Date(),
      isLoading: false,
      error: null,
      isConnected: true,
    };
  }

  const forecast = data[0]; // Typically you'd have one main forecast record

  // Transform to customer profiles
  const customerProfiles: CustomerProfile[] = [
    {
      id: "enterprise",
      segment: "Enterprise",
      demandAssumption: forecast.enterprise_units,
      growthRate: forecast.enterprise_growth_rate,
      retention: forecast.enterprise_retention,
      avgOrderValue: forecast.enterprise_avg_order,
      seasonality: forecast.enterprise_seasonality,
    },
    {
      id: "smb",
      segment: "SMB",
      demandAssumption: forecast.smb_units,
      growthRate: forecast.smb_growth_rate,
      retention: forecast.smb_retention,
      avgOrderValue: forecast.smb_avg_order,
      seasonality: forecast.smb_seasonality,
    },
  ];

  // Transform to revenue projections
  const baseRevenueProjections: RevenueProjection[] = [
    {
      id: "q1-2025",
      period: "Q1 2025",
      projected: forecast.q1_2025_projected_revenue,
      conservative: forecast.q1_2025_scenario_range_min,
      optimistic: forecast.q1_2025_scenario_range_max,
      actualToDate: forecast.q1_2025_actual_to_date,
      confidence:
        forecast.q1_2025_confidence === "High"
          ? 85
          : forecast.q1_2025_confidence === "Medium"
            ? 70
            : 55,
    },
    {
      id: "q2-2025",
      period: "Q2 2025",
      projected: forecast.q2_2025_projected_revenue,
      conservative: forecast.q2_2025_scenario_range_min,
      optimistic: forecast.q2_2025_scenario_range_max,
      actualToDate: forecast.q2_2025_actual_to_date,
      confidence:
        forecast.q2_2025_confidence === "High"
          ? 85
          : forecast.q2_2025_confidence === "Medium"
            ? 70
            : 55,
    },
  ];

  // Add Q3 if available in API, otherwise use fallback
  if (forecast.q3_2025_projected_revenue) {
    baseRevenueProjections.push({
      id: "q3-2025",
      period: "Q3 2025",
      projected: forecast.q3_2025_projected_revenue,
      conservative: forecast.q3_2025_scenario_range_min || 3150000,
      optimistic: forecast.q3_2025_scenario_range_max || 4025000,
      actualToDate: forecast.q3_2025_actual_to_date,
      confidence:
        forecast.q3_2025_confidence === "High"
          ? 85
          : forecast.q3_2025_confidence === "Medium"
            ? 70
            : 72,
    });
  } else {
    baseRevenueProjections.push({
      id: "q3-2025",
      period: "Q3 2025",
      projected: 3500000,
      conservative: 3150000,
      optimistic: 4025000,
      actualToDate: 1850000,
      confidence: 72,
    });
  }

  // Add Q4 if available in API, otherwise use fallback
  if (forecast.q4_2025_projected_revenue) {
    baseRevenueProjections.push({
      id: "q4-2025",
      period: "Q4 2025",
      projected: forecast.q4_2025_projected_revenue,
      conservative: forecast.q4_2025_scenario_range_min || 3780000,
      optimistic: forecast.q4_2025_scenario_range_max || 4860000,
      actualToDate: forecast.q4_2025_actual_to_date,
      confidence:
        forecast.q4_2025_confidence === "High"
          ? 85
          : forecast.q4_2025_confidence === "Medium"
            ? 70
            : 68,
    });
  } else {
    baseRevenueProjections.push({
      id: "q4-2025",
      period: "Q4 2025",
      projected: 4200000,
      conservative: 3780000,
      optimistic: 4860000,
      confidence: 68,
    });
  }

  const revenueProjections = baseRevenueProjections;

  // Transform to KPIs - use comprehensive mock KPIs as base
  const kpis: KPI[] = mockKpis.map((kpi) => {
    // Allow API to override specific KPI values if available
    if (kpi.category === "Revenue" || kpi.category === "Financial") {
      return {
        ...kpi,
        current: forecast.total_revenue_target
          ? forecast.total_revenue_target * 0.85
          : kpi.current,
      };
    }
    if (kpi.category === "Customer" && kpi.name.includes("Retention")) {
      return {
        ...kpi,
        current: forecast.overall_retention || kpi.current,
      };
    }
    if (kpi.category === "Growth" || kpi.name.includes("Growth Rate")) {
      return {
        ...kpi,
        current: forecast.weighted_avg_growth || kpi.current,
      };
    }
    return kpi;
  });

  // Transform to scenarios
  const scenarios: ScenarioPlanning[] = [
    {
      id: "best-case",
      scenario: "Best Case",
      revenue: forecast.q1_2025_scenario_range_max * 4, // Annualized
      costs: forecast.q1_2025_scenario_range_max * 4 * 0.65, // Assuming 65% of revenue as costs
      profit: forecast.q1_2025_scenario_range_max * 4 * 0.35,
      probability: 25,
      keyAssumptions: [
        `Enterprise units reach ${forecast.enterprise_units} with ${forecast.enterprise_growth_rate}% growth`,
        `SMB retention stays at ${forecast.smb_retention}%`,
      ],
    },
    {
      id: "base-case",
      scenario: "Base Case",
      revenue: forecast.total_revenue_target,
      costs: forecast.total_revenue_target * 0.75,
      profit: forecast.total_revenue_target * 0.25,
      probability: 50,
      keyAssumptions: [
        `Market opportunity: $${(forecast.total_market_opportunity / 1000000).toFixed(1)}M`,
        `Weighted growth rate: ${forecast.weighted_avg_growth}%`,
      ],
    },
    {
      id: "worst-case",
      scenario: "Worst Case",
      revenue: forecast.q1_2025_scenario_range_min * 4, // Annualized
      costs: forecast.q1_2025_scenario_range_min * 4 * 0.75, // Higher cost percentage in worst case
      profit: forecast.q1_2025_scenario_range_min * 4 * 0.25,
      probability: 25,
      keyAssumptions: [
        `Conservative scenario assumes 75% of base case revenue`,
        `Retention drops by 5% across all segments`,
      ],
    },
  ];

  return {
    customerProfiles,
    revenueProjections,
    kpis,
    scenarios,
    lastUpdated: new Date(),
    isLoading: false,
    error: null,
    isConnected: true,
  };
}

/**
 * Hook to fetch and transform business forecasting data
 */
export function useBusinessForecastingData() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["business-forecasting"],
    queryFn: () => getBusinessForecasts(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
  });

  // Use mock data as fallback when API fails or returns no data
  const transformed = transformBusinessForecastingData(data || []);

  return {
    ...transformed,
    isLoading,
    error: error ? (error as Error).message : null,
    refreshData: () => refetch(),
    updateKPI: (id: string, newValue: number) => {
      // TODO: Implement API call to update KPI
      console.log("Update KPI:", id, newValue);
    },
    updateScenario: (id: string, updates: Partial<ScenarioPlanning>) => {
      // TODO: Implement API call to update scenario
      console.log("Update scenario:", id, updates);
    },
    reconnect: () => refetch(),
  };
}
