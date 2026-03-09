/**
 * Revenue Strategy Summary Generation Utilities
 * Contains all business logic for generating dynamic revenue strategy content
 */

import { RevenueStream, ChurnAnalysis, UpsellOpportunity, ChannelPerformance, RevenueMetric } from "@/lib/revenue-data";
import {
  getStreamSummary,
  calculateTotalRevenue,
  calculateAvgRevenueGrowth,
  formatRevenue,
} from "./revenue-stream-calculation";
import {
  getChurnSummary,
  calculateOverallChurnRate,
  calculateTotalRevenueAtRisk,
} from "./churn-analysis-calculation";
import {
  getUpsellSummary,
  calculateTotalPotentialMRR,
  calculateAnnualUpsellPotential,
  calculateAvgUpsellProbability,
} from "./upsell-analysis-calculation";

export interface RevenueSummaryMetrics {
  index: number;
  title: string;
  value: string;
  insight: string;
}

export interface RevenueActionItem {
  index: number;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  timeline: string;
}

/**
 * Calculate total revenue across all metrics
 * @param metrics - Array of revenue metrics
 * @returns Sum of all metric values
 */
export function calculateTotalMetricsValue(metrics: RevenueMetric[]): number {
  return metrics.reduce((sum, m) => sum + m.value, 0);
}

/**
 * Calculate average metric trend
 * @param metrics - Array of revenue metrics
 * @returns Average change percentage
 */
export function calculateAvgMetricTrend(metrics: RevenueMetric[]): number {
  if (metrics.length === 0) return 0;
  return metrics.reduce((sum, m) => sum + m.change, 0) / metrics.length;
}

/**
 * Get top performing metrics
 * @param metrics - Array of revenue metrics
 * @returns Metrics with upward trend
 */
export function getTopPerformingMetrics(metrics: RevenueMetric[]): RevenueMetric[] {
  return metrics.filter(m => m.trend === "up").slice(0, 3);
}

/**
 * Generate revenue strategy summary
 */
export function generateRevenueSummary(
  streams: RevenueStream[],
  churnSegments: ChurnAnalysis[],
  upsells: UpsellOpportunity[]
): string {
  const streamSummary = getStreamSummary(streams);
  const churnSummary = getChurnSummary(churnSegments);
  const upsellSummary = getUpsellSummary(upsells);

  return `1. REVENUE OVERVIEW
Total revenue across ${streamSummary.streamCount} active streams is ${formatRevenue(streamSummary.totalRevenue)}. The current revenue mix shows healthy diversification with an average growth rate of ${streamSummary.avgGrowth}% across all streams. Forecast indicates potential growth to ${formatRevenue(streamSummary.totalForecast)}.

2. KEY REVENUE METRICS
Revenue per stream is performing well with ${streamSummary.avgMargin}% average margin. Total customer base across streams is ${streamSummary.totalCustomers.toLocaleString()} customers contributing to ${formatRevenue(streamSummary.totalRevenue)} in annual revenue.

3. GROWTH DRIVERS
Revenue growth is being driven by ${upsellSummary.opportunityCount} identified upsell opportunities with ${upsellSummary.avgProbability}% average conversion probability. Annual expansion potential is estimated at ${formatRevenue(upsellSummary.annualPotential)}.

4. CUSTOMER RETENTION
Overall churn rate stands at ${churnSummary.overallChurnRate}%, with ${formatRevenue(churnSummary.totalRevenueAtRisk)} in revenue at risk. The highest churn segment is ${churnSummary.highestChurnSegment}, requiring targeted retention interventions.

5. EXPANSION OPPORTUNITIES
Analysis identifies ${upsellSummary.opportunityCount} high-probability upsell opportunities that could generate incremental monthly revenue of ${formatRevenue(upsellSummary.totalPotentialMRR)} (${formatRevenue(upsellSummary.annualPotential)} annually).`;
}

/**
 * Generate revenue recommendations
 */
export function generateRevenueRecommendations(
  streams: RevenueStream[],
  churnSegments: ChurnAnalysis[],
  upsells: UpsellOpportunity[]
): string {
  const streamSummary = getStreamSummary(streams);
  const churnSummary = getChurnSummary(churnSegments);
  const upsellSummary = getUpsellSummary(upsells);

  let recommendations = "";

  recommendations += `1. REVENUE ACCELERATION\n`;
  recommendations += `Focus on expanding the ${streamSummary.streamCount} revenue streams with ${upsellSummary.opportunityCount} active upsell opportunities. Prioritize high-probability conversions to maximize short-term revenue impact.\n\n`;

  recommendations += `2. CUSTOMER EXPANSION\n`;
  recommendations += `Target ${upsellSummary.opportunityCount} identified upsell opportunities with average probability of ${upsellSummary.avgProbability}%. Implement personalized campaigns for highest-value conversion paths.\n\n`;

  recommendations += `3. RETENTION OPTIMIZATION\n`;
  recommendations += `Address the ${churnSummary.overallChurnRate}% overall churn rate affecting ${formatRevenue(churnSummary.totalRevenueAtRisk)} in revenue at risk. Focus retention efforts on the ${churnSummary.highestChurnSegment} segment showing highest churn impact.\n\n`;

  recommendations += `4. MARGIN OPTIMIZATION\n`;
  recommendations += `Current average margin across streams is ${streamSummary.avgMargin}%. Review pricing strategies and cost structures to improve profitability while maintaining competitive positioning.\n\n`;

  recommendations += `5. GROWTH INVESTMENT\n`;
  recommendations += `With projected growth potential of ${streamSummary.growthPotential}%, allocate resources to highest-growth streams and explore new revenue channels to maximize market capture.`;

  return recommendations;
}

/**
 * Generate summary metrics
 */
export function generateRevenueSummaryMetrics(
  streams: RevenueStream[],
  churnSegments: ChurnAnalysis[],
  upsells: UpsellOpportunity[],
  metrics: RevenueMetric[]
): RevenueSummaryMetrics[] {
  const streamSummary = getStreamSummary(streams);
  const churnSummary = getChurnSummary(churnSegments);
  const upsellSummary = getUpsellSummary(upsells);

  return [
    {
      index: 1,
      title: "Total Revenue",
      value: formatRevenue(streamSummary.totalRevenue),
      insight: "Combined revenue from all streams",
    },
    {
      index: 2,
      title: "Growth Rate",
      value: `${streamSummary.avgGrowth}%`,
      insight: "Average growth across streams",
    },
    {
      index: 3,
      title: "Upsell Potential",
      value: formatRevenue(upsellSummary.annualPotential),
      insight: "Annual expansion opportunity",
    },
    {
      index: 4,
      title: "Churn Rate",
      value: `${churnSummary.overallChurnRate}%`,
      insight: "Weighted average churn across segments",
    },
    {
      index: 5,
      title: "Revenue at Risk",
      value: formatRevenue(churnSummary.totalRevenueAtRisk),
      insight: "Revenue threatened by churn",
    },
    {
      index: 6,
      title: "Avg Margin",
      value: `${streamSummary.avgMargin}%`,
      insight: "Profitability across streams",
    },
  ];
}

/**
 * Generate action items
 */
export function generateRevenueActionItems(
  streams: RevenueStream[],
  churnSegments: ChurnAnalysis[],
  upsells: UpsellOpportunity[]
): RevenueActionItem[] {
  const churnSummary = getChurnSummary(churnSegments);
  const upsellSummary = getUpsellSummary(upsells);
  const items: RevenueActionItem[] = [];

  // High priority items
  if (upsellSummary.opportunityCount > 0) {
    items.push({
      index: items.length + 1,
      title: "Upsell Campaign Launch",
      description: `Launch targeted upsell campaign to ${upsellSummary.opportunityCount} identified opportunities with ${upsellSummary.avgProbability}% average conversion probability.`,
      priority: "high",
      timeline: "Q1 2025",
    });
  }

  if (churnSummary.overallChurnRate > 5) {
    items.push({
      index: items.length + 1,
      title: "Retention Program Expansion",
      description: `Develop comprehensive retention program targeting ${churnSummary.highestChurnSegment} segment showing ${churnSummary.overallChurnRate}% churn rate.`,
      priority: "high",
      timeline: "Q1 2025",
    });
  }

  // Medium priority
  items.push({
    index: items.length + 1,
    title: "Revenue Stream Optimization",
    description: "Analyze and optimize underperforming revenue streams to improve overall growth rate.",
    priority: "medium",
    timeline: "Q2 2025",
  });

  items.push({
    index: items.length + 1,
    title: "Margin Improvement Initiative",
    description: "Review pricing strategies and cost structures to improve profitability across all streams.",
    priority: "medium",
    timeline: "Q2 2025",
  });

  // Low priority
  items.push({
    index: items.length + 1,
    title: "New Revenue Stream Development",
    description: "Research and develop strategy for adjacent revenue opportunities to diversify revenue base.",
    priority: "low",
    timeline: "Q3 2025",
  });

  return items;
}

/**
 * Generate revenue strategy alerts
 */
export function generateRevenueStrategyAlerts(
  streams: RevenueStream[],
  churnSegments: ChurnAnalysis[],
  upsells: UpsellOpportunity[]
): { type: string; title: string; description: string; severity: "high" | "medium" | "low" }[] {
  const alerts: { type: string; title: string; description: string; severity: "high" | "medium" | "low" }[] = [];
  const churnSummary = getChurnSummary(churnSegments);
  const upsellSummary = getUpsellSummary(upsells);

  // Check for high churn
  if (churnSummary.overallChurnRate > 10) {
    alerts.push({
      type: "warning",
      title: "High Churn Rate Alert",
      description: `Overall churn rate is ${churnSummary.overallChurnRate}%, exceeding healthy thresholds. Immediate retention focus required.`,
      severity: "high",
    });
  } else if (churnSummary.overallChurnRate > 5) {
    alerts.push({
      type: "warning",
      title: "Elevated Churn Rate",
      description: `Churn rate of ${churnSummary.overallChurnRate}% warrants attention. Monitor retention metrics closely.`,
      severity: "medium",
    });
  }

  // Check for significant upsell opportunity
  if (upsellSummary.opportunityCount > 0) {
    alerts.push({
      type: "opportunity",
      title: "Upsell Opportunities Available",
      description: `${upsellSummary.opportunityCount} upsell opportunities identified with ${formatRevenue(upsellSummary.totalPotentialMRR)} monthly potential.`,
      severity: "medium",
    });
  }

  // Check for declining streams
  const decliningStreams = streams.filter(s => s.growth < 0);
  if (decliningStreams.length > 0) {
    alerts.push({
      type: "warning",
      title: "Declining Revenue Streams",
      description: `${decliningStreams.length} revenue stream(s) showing negative growth. Review and optimize.`,
      severity: "medium",
    });
  }

  return alerts;
}

