import { useState, useCallback } from "react";

export interface GrowthMetric {
  id: string;
  name: string;
  value: number;
  trend: "up" | "down" | "stable";
  change: number;
  unit: string;
  period: string;
}

export interface GrowthLever {
  name: string;
  current: number;
  target: number;
  impact: "High" | "Medium" | "Low";
  trend: "up" | "down";
  color: string;
  bgColor: string;
  unit?: string;
}

export interface UseGrowthPlanningReturn {
  metrics: GrowthMetric[];
  levers: GrowthLever[];
  isLoading: boolean;
  isConnected: boolean;
  lastUpdated: Date;
  error: string | null;
  refreshData: () => void;
}

/**
 * Adapter hook for Growth Planning that bridges mock data with API structure
 */
export function useGrowthPlanningAPI(): UseGrowthPlanningReturn {
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);

  // Mock metrics data
  const metrics: GrowthMetric[] = [
    {
      id: "1",
      name: "Current Growth Rate",
      value: 15.2,
      trend: "up",
      change: 2.3,
      unit: "%",
      period: "YoY",
    },
    {
      id: "2",
      name: "Target Growth Rate",
      value: 25.0,
      trend: "up",
      change: 0,
      unit: "%",
      period: "YoY",
    },
    {
      id: "3",
      name: "Revenue Target",
      value: 13.7,
      trend: "up",
      change: 1.5,
      unit: "M",
      period: "Next Year",
    },
  ];

  // Mock growth levers
  const levers: GrowthLever[] = [
    {
      name: "Sales Efficiency",
      current: 78,
      target: 85,
      impact: "High",
      trend: "up",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      name: "Customer Retention",
      current: 82,
      target: 90,
      impact: "High",
      trend: "up",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      name: "Market Expansion",
      current: 45,
      target: 65,
      impact: "Medium",
      trend: "up",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      name: "Product Innovation",
      current: 63,
      target: 75,
      impact: "Medium",
      trend: "up",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      name: "Marketing ROI",
      current: 340,
      target: 450,
      impact: "High",
      trend: "up",
      color: "text-green-600",
      bgColor: "bg-green-100",
      unit: "%",
    },
    {
      name: "Operational Efficiency",
      current: 71,
      target: 80,
      impact: "Medium",
      trend: "up",
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
    },
  ];

  const refreshData = useCallback(async () => {
    // Stub for future API integration
    console.log("Refreshing growth planning data...");
  }, []);

  return {
    metrics,
    levers,
    isLoading,
    isConnected: !error,
    lastUpdated: new Date(),
    error,
    refreshData,
  };
}
