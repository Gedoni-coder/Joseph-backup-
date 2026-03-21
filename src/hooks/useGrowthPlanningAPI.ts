import { useState, useEffect, useCallback } from "react";
import {
  type BusinessMetricApi,
  type ForecastActionItemApi,
  type KeyAssumption,
  type KeyRisk,
  type RevenueScenarioSnapshotApi,
  type RevenueTargetApi,
  getBusinessMetrics,
  getForecastActionItems,
  getKeyAssumptions,
  getKeyRisks,
  getRevenueScenarioSnapshots,
  getRevenueTargets,
} from "@/lib/api/business-forecasting-service";

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

export interface GrowthScenario {
  key: string;
  label: string;
  probability: number;
  annualRevenue: number;
  operatingCosts: number;
  netProfit: number;
  growthRate: number;
}

export interface GrowthRoadmapItem {
  timeline: string;
  milestone: string;
  description: string;
  priority: "low" | "medium" | "high";
  progress: number;
  status: "On Track" | "In Progress" | "Planning";
}

export interface GrowthInsight {
  kind: "opportunity" | "risk" | "tip";
  title: string;
  message: string;
}

export interface UseGrowthPlanningReturn {
  metrics: GrowthMetric[];
  levers: GrowthLever[];
  scenarios: GrowthScenario[];
  roadmapItems: GrowthRoadmapItem[];
  insights: GrowthInsight[];
  isLoading: boolean;
  isConnected: boolean;
  lastUpdated: Date | null;
  error: string | null;
  refreshData: () => void;
}

const toNumber = (value: string | number): number => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }
  const parsed = Number.parseFloat(String(value).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
};

const mapBusinessMetricToLever = (metric: BusinessMetricApi): GrowthLever => {
  const current = toNumber(metric.current);
  const target = toNumber(metric.target);
  const unit =
    metric.current.includes("%") || metric.target.includes("%") ? "%" : "";

  let impact: "High" | "Medium" | "Low" = "Medium";
  if (metric.status === "excellent") impact = "High";
  if (metric.status === "fair") impact = "Low";

  const color =
    metric.trend === "up"
      ? "text-green-700"
      : metric.trend === "down"
        ? "text-red-700"
        : "text-slate-700";
  const bgColor =
    metric.trend === "up"
      ? "bg-green-100"
      : metric.trend === "down"
        ? "bg-red-100"
        : "bg-slate-100";

  return {
    name: metric.metric,
    current,
    target,
    impact,
    trend: metric.trend === "down" ? "down" : "up",
    color,
    bgColor,
    unit,
  };
};

const mapScenario = (
  snapshot: RevenueScenarioSnapshotApi,
  baselineAnnualRevenue: number,
): GrowthScenario => {
  const key = snapshot.scenario.toLowerCase().trim();
  const growthRate =
    baselineAnnualRevenue > 0
      ? ((snapshot.annual_revenue - baselineAnnualRevenue) / baselineAnnualRevenue) * 100
      : 0;

  return {
    key,
    label: snapshot.scenario,
    probability: snapshot.probability,
    annualRevenue: snapshot.annual_revenue,
    operatingCosts: snapshot.operating_costs,
    netProfit: snapshot.net_profit,
    growthRate,
  };
};

const mapRoadmapItems = (actionItems: ForecastActionItemApi[]): GrowthRoadmapItem[] => {
  return actionItems.map((item, index) => {
    const progress =
      actionItems.length > 0
        ? Math.round(((index + 1) / actionItems.length) * 100)
        : 0;
    const status =
      progress >= 75 ? "On Track" : progress >= 40 ? "In Progress" : "Planning";

    return {
      timeline: item.timeline,
      milestone: item.title,
      description: item.description,
      priority: item.priority,
      progress,
      status,
    };
  });
};

const buildInsights = (
  assumptions: KeyAssumption[],
  risks: KeyRisk[],
  scenarios: GrowthScenario[],
): GrowthInsight[] => {
  const insights: GrowthInsight[] = [];

  if (assumptions.length > 0) {
    const assumption = assumptions[0];
    insights.push({
      kind: "opportunity",
      title: assumption.label,
      message: assumption.value,
    });
  }

  const highestRisk = risks.find((risk) => risk.level === "high") ?? risks[0];
  if (highestRisk) {
    insights.push({
      kind: "risk",
      title: "Risk Alert",
      message: `${highestRisk.label} (${highestRisk.level} priority).`,
    });
  }

  const bestScenario = [...scenarios].sort((a, b) => b.netProfit - a.netProfit)[0];
  if (bestScenario) {
    insights.push({
      kind: "tip",
      title: "Strategy Tip",
      message: `${bestScenario.label} has the strongest projected net profit at $${(
        bestScenario.netProfit / 1_000_000
      ).toFixed(2)}M.`,
    });
  }

  return insights;
};

export function useGrowthPlanningAPI(): UseGrowthPlanningReturn {
  const [metrics, setMetrics] = useState<GrowthMetric[]>([]);
  const [levers, setLevers] = useState<GrowthLever[]>([]);
  const [scenarios, setScenarios] = useState<GrowthScenario[]>([]);
  const [roadmapItems, setRoadmapItems] = useState<GrowthRoadmapItem[]>([]);
  const [insights, setInsights] = useState<GrowthInsight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchAllData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [
        revenueTargets,
        businessMetrics,
        scenarioSnapshots,
        actionItems,
        keyRisks,
        keyAssumptions,
      ] = await Promise.all([
        getRevenueTargets(),
        getBusinessMetrics(),
        getRevenueScenarioSnapshots(),
        getForecastActionItems(),
        getKeyRisks(),
        getKeyAssumptions(),
      ]);

      const target = revenueTargets[0] as RevenueTargetApi | undefined;
      const annualRevenue = target?.annual_revenue ?? 0;
      const growthRate = target?.growth_rate ?? 0;

      const scenarioData = scenarioSnapshots.map((scenario) =>
        mapScenario(scenario, annualRevenue),
      );

      const bestScenario = [...scenarioData].sort((a, b) => b.growthRate - a.growthRate)[0];
      const targetGrowth = bestScenario?.growthRate ?? growthRate;

      const metricsData: GrowthMetric[] = [
        {
          id: "current-growth",
          name: "Current Growth Rate",
          value: growthRate,
          trend: growthRate >= 0 ? "up" : "down",
          change: 0,
          unit: "%",
          period: "Annual",
        },
        {
          id: "target-growth",
          name: "Target Growth Rate",
          value: targetGrowth,
          trend: targetGrowth >= growthRate ? "up" : "down",
          change: Math.abs(targetGrowth - growthRate),
          unit: "%",
          period: "Scenario",
        },
        {
          id: "revenue-target",
          name: "Revenue Target",
          value: annualRevenue / 1_000_000,
          trend: annualRevenue >= 0 ? "up" : "down",
          change: 0,
          unit: "M",
          period: "Annual",
        },
      ];

      const leverCandidates = businessMetrics
        .filter(
          (item) =>
            item.category === "Innovation & Growth" ||
            item.category === "Sales & Marketing" ||
            item.category === "Customer",
        )
        .slice(0, 8)
        .map(mapBusinessMetricToLever);

      setMetrics(metricsData);
      setLevers(leverCandidates);
      setScenarios(scenarioData);
      setRoadmapItems(mapRoadmapItems(actionItems));
      setInsights(buildInsights(keyAssumptions, keyRisks, scenarioData));
      setIsConnected(true);
      setLastUpdated(new Date());
    } catch (err) {
      setMetrics([]);
      setLevers([]);
      setScenarios([]);
      setRoadmapItems([]);
      setInsights([]);
      setIsConnected(false);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load growth planning data.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchAllData();
  }, [fetchAllData]);

  const refreshData = useCallback(() => {
    void fetchAllData();
  }, [fetchAllData]);

  return {
    metrics,
    levers,
    scenarios,
    roadmapItems,
    insights,
    isLoading,
    isConnected,
    lastUpdated,
    error,
    refreshData,
  };
}
