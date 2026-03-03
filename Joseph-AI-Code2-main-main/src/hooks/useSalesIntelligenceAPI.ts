import { useState, useCallback } from "react";

export interface SalesMetric {
  id: string;
  name: string;
  value: string;
  change?: string;
  trend?: "up" | "down" | "stable";
}

export interface SalesSubModule {
  id: string;
  name: string;
  icon: string;
  description: string;
  metrics: Record<string, string>;
  status: "active" | "inactive";
}

export interface UseSalesIntelligenceReturn {
  subModules: SalesSubModule[];
  metrics: SalesMetric[];
  isLoading: boolean;
  isConnected: boolean;
  lastUpdated: Date;
  error: string | null;
  refreshData: () => void;
}

/**
 * Adapter hook for Sales Intelligence that bridges mock data with API structure
 */
export function useSalesIntelligenceAPI(): UseSalesIntelligenceReturn {
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);

  // Mock sales metrics
  const metrics: SalesMetric[] = [
    {
      id: "1",
      name: "Total Pipeline Value",
      value: "$2.5M",
      change: "+15%",
      trend: "up",
    },
    {
      id: "2",
      name: "Conversion Rate",
      value: "28%",
      change: "+3%",
      trend: "up",
    },
    {
      id: "3",
      name: "Avg Deal Size",
      value: "$45K",
      change: "-2%",
      trend: "down",
    },
    {
      id: "4",
      name: "Sales Velocity",
      value: "18 days",
      change: "-3 days",
      trend: "up",
    },
  ];

  // Mock sub-modules
  const subModules: SalesSubModule[] = [
    {
      id: "lead-pipeline",
      name: "Lead Intelligence & Pipeline",
      icon: "Target",
      description: "Lead qualification, pipeline forecasting, deal rescue",
      metrics: {
        "Lead Score": "8.2/10",
        "Pipeline Health": "92%",
        "Deal Probability": "68%",
      },
      status: "active",
    },
    {
      id: "sales-coaching",
      name: "Sales Coaching Engine",
      icon: "Brain",
      description:
        "Real-time coaching, call analysis, performance optimization",
      metrics: {
        "Coaching Moments": "245",
        "Rep Improvement": "+12%",
        "Call Success Rate": "74%",
      },
      status: "active",
    },
    {
      id: "engagement-optimizer",
      name: "Engagement Optimizer",
      icon: "MessageCircle",
      description:
        "Multi-channel engagement, timing optimization, content recommendation",
      metrics: {
        "Engagement Rate": "52%",
        "Optimal Timing": "8AM-10AM",
        "Top Channel": "Email",
      },
      status: "active",
    },
    {
      id: "competitive-intel",
      name: "Competitive Intelligence",
      icon: "BarChart3",
      description: "Win/loss analysis, competitive positioning, battle cards",
      metrics: {
        "Win Rate vs Competitor": "62%",
        "Market Share": "18%",
        "Pricing Benchmark": "-8%",
      },
      status: "active",
    },
    {
      id: "sales-forecasting",
      name: "Sales Forecasting",
      icon: "TrendingUp",
      description: "AI-powered forecasting, scenario modeling, risk assessment",
      metrics: {
        "Forecast Accuracy": "89%",
        "Next Quarter": "$4.2M",
        "Best Case": "$5.1M",
      },
      status: "active",
    },
    {
      id: "rep-productivity",
      name: "Rep Productivity Dashboard",
      icon: "Users",
      description: "Activity tracking, quota progress, performance leaderboard",
      metrics: {
        "Avg Calls/Day": "24",
        "Quota Achievement": "87%",
        "Activity Rate": "95%",
      },
      status: "active",
    },
  ];

  const refreshData = useCallback(async () => {
    // Stub for future API integration
    console.log("Refreshing sales intelligence data...");
  }, []);

  return {
    subModules,
    metrics,
    isLoading,
    isConnected: !error,
    lastUpdated: new Date(),
    error,
    refreshData,
  };
}
