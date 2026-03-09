/**
 * Pricing Strategy Summary Generation Utilities
 * Contains all business logic for generating dynamic pricing content
 */

import { PricingStrategy, CompetitorAnalysis, PriceTest } from "@/lib/pricing-data";
import {
  getStrategySummary,
  calculateTotalExpectedRevenue,
  calculateAvgConfidence,
  calculateAvgProfitMargin,
} from "./pricing-strategy-calculation";
import { getCompetitorSummary, calculateAvgCompetitorPrice } from "./competitor-analysis-calculation";
import { getAllTestsSummary } from "./price-testing-calculation";

export interface PricingSummaryMetrics {
  index: number;
  title: string;
  value: string;
  insight: string;
}

export interface PricingActionItem {
  index: number;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  timeline: string;
}

/**
 * Format currency for display
 * @param value - Number to format
 * @returns Formatted string
 */
export function formatPricingValue(value: number): string {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value.toFixed(2)}`;
}

/**
 * Generate pricing strategy summary
 */
export function generatePricingSummary(
  strategies: PricingStrategy[],
  competitors: CompetitorAnalysis[],
  tests: PriceTest[]
): string {
  const strategySummary = getStrategySummary(strategies);
  const competitorSummary = getCompetitorSummary(competitors);
  const testsSummary = getAllTestsSummary(tests);

  const runningTests = tests.filter(t => t.status === "running").length;

  return `1. PRICING OVERVIEW
Current pricing strategy encompasses ${strategySummary.strategyCount} distinct approaches with an average confidence level of ${strategySummary.avgConfidence}%. The combined expected revenue potential across all strategies is ${formatPricingValue(strategySummary.totalRevenue)} with an average profit margin of ${strategySummary.avgMargin}%.

2. COMPETITIVE POSITIONING
Analysis of ${competitorSummary.competitorCount} competitors reveals an average market price of ${formatPricingValue(competitorSummary.avgPrice)}. Our pricing position index stands at ${competitorSummary.priceIndex || 100}, indicating ${competitorSummary.priceIndex && competitorSummary.priceIndex > 100 ? 'premium' : 'competitive'} positioning relative to the market.

3. TESTING OPTIMIZATION
Currently running ${runningTests} price optimization tests with ${testsSummary.completedCount} completed tests. Total test revenue to date amounts to ${formatPricingValue(testsSummary.totalRevenue)} across ${testsSummary.totalConversions.toLocaleString()} conversions.

4. REVENUE OPTIMIZATION
Implementation of suggested pricing changes could yield additional revenue of ${formatPricingValue(strategySummary.totalRevenue * (strategySummary.avgPriceIncrease / 100))} based on the ${strategySummary.avgPriceIncrease}% average price increase opportunity identified across strategies.

5. MARKET EXPANSION
With current total market share of ${strategySummary.totalMarketShare.toFixed(1)}% across strategic segments, there remains significant room for growth through optimized pricing strategies.`;
}

/**
 * Generate pricing recommendations
 */
export function generatePricingRecommendations(
  strategies: PricingStrategy[],
  competitors: CompetitorAnalysis[],
  tests: PriceTest[]
): string {
  const strategySummary = getStrategySummary(strategies);
  const competitorSummary = getCompetitorSummary(competitors);
  const testsSummary = getAllTestsSummary(tests);

  let recommendations = "";

  recommendations += `1. PRICE OPTIMIZATION\n`;
  recommendations += `Focus on implementing the ${strategySummary.strategyCount} identified pricing strategies with highest confidence levels. Prioritize strategies showing ${strategySummary.avgMargin}% average profit margin for immediate revenue impact.\n\n`;

  recommendations += `2. COMPETITIVE RESPONSE\n`;
  recommendations += `Monitor ${competitorSummary.lowestCompetitor?.competitor || 'key competitor'} as the lowest-priced competitor at ${formatPricingValue(competitorSummary.lowestPrice)}. Consider strategic pricing adjustments to maintain market share while protecting margins.\n\n`;

  recommendations += `3. TEST-BASED PRICING\n`;
  recommendations += `Complete the ${testsSummary.runningCount} ongoing price tests to gather data-driven insights. Implement winning variants from ${testsSummary.completedCount} completed tests to optimize conversion rates.\n\n`;

  recommendations += `4. MARGIN PROTECTION\n`;
  recommendations += `Current average margin of ${strategySummary.avgMargin}% should be protected during any pricing changes. Target price increases of ${strategySummary.avgPriceIncrease}% where customer acceptance allows.\n\n`;

  recommendations += `5. SEGMENT STRATEGY\n`;
  recommendations += `Develop differentiated pricing for ${Object.keys(strategySummary.byType).length} strategy types to maximize revenue across different customer segments and market conditions.`;

  return recommendations;
}

/**
 * Generate summary metrics
 */
export function generatePricingSummaryMetrics(
  strategies: PricingStrategy[],
  competitors: CompetitorAnalysis[],
  tests: PriceTest[]
): PricingSummaryMetrics[] {
  const strategySummary = getStrategySummary(strategies);
  const competitorSummary = getCompetitorSummary(competitors);
  const testsSummary = getAllTestsSummary(tests);

  return [
    {
      index: 1,
      title: "Expected Revenue",
      value: formatPricingValue(strategySummary.totalRevenue),
      insight: "Combined revenue potential from all strategies",
    },
    {
      index: 2,
      title: "Avg Confidence",
      value: `${strategySummary.avgConfidence}%`,
      insight: "Average confidence across all pricing strategies",
    },
    {
      index: 3,
      title: "Avg Profit Margin",
      value: `${strategySummary.avgMargin}%`,
      insight: "Weighted average margin across strategies",
    },
    {
      index: 4,
      title: "Market Position",
      value: `${competitorSummary.priceIndex || 100}`,
      insight: competitorSummary.priceIndex && competitorSummary.priceIndex > 100 ? "Premium vs competitors" : "Competitive vs competitors",
    },
    {
      index: 5,
      title: "Tests Running",
      value: `${testsSummary.runningCount}`,
      insight: "Active price optimization experiments",
    },
    {
      index: 6,
      title: "Market Share",
      value: `${strategySummary.totalMarketShare.toFixed(1)}%`,
      insight: "Combined share across strategic segments",
    },
  ];
}

/**
 * Generate action items
 */
export function generatePricingActionItems(
  strategies: PricingStrategy[],
  competitors: CompetitorAnalysis[],
  tests: PriceTest[]
): PricingActionItem[] {
  const strategySummary = getStrategySummary(strategies);
  const testsSummary = getAllTestsSummary(tests);
  const items: PricingActionItem[] = [];

  // High priority
  if (strategySummary.highestRevenue) {
    items.push({
      index: items.length + 1,
      title: "Implement Top Revenue Strategy",
      description: `Deploy "${strategySummary.highestRevenue.name}" strategy targeting ${formatPricingValue(strategySummary.highestRevenue.expectedRevenue)} in additional revenue.`,
      priority: "high",
      timeline: "Q1 2025",
    });
  }

  if (testsSummary.runningCount > 0) {
    items.push({
      index: items.length + 1,
      title: "Complete Running Price Tests",
      description: `Finalize the ${testsSummary.runningCount} ongoing price tests and implement winning variants.`,
      priority: "high",
      timeline: "Q1 2025",
    });
  }

  // Medium priority
  items.push({
    index: items.length + 1,
    title: "Competitive Price Analysis",
    description: `Review pricing against ${competitors.length} tracked competitors and adjust positioning as needed.`,
    priority: "medium",
    timeline: "Q2 2025",
  });

  items.push({
    index: items.length + 1,
    title: "New Price Test Design",
    description: "Design next set of price optimization tests based on current learnings.",
    priority: "medium",
    timeline: "Q2 2025",
  });

  // Low priority
  items.push({
    index: items.length + 1,
    title: "Dynamic Pricing Expansion",
    description: "Expand AI-driven dynamic pricing to additional product categories.",
    priority: "low",
    timeline: "Q3 2025",
  });

  return items;
}

/**
 * Generate pricing alerts
 */
export function generatePricingAlerts(
  strategies: PricingStrategy[],
  competitors: CompetitorAnalysis[],
  tests: PriceTest[]
): { type: string; title: string; description: string; severity: "high" | "medium" | "low" }[] {
  const alerts: { type: string; title: string; description: string; severity: "high" | "medium" | "low" }[] = [];
  const strategySummary = getStrategySummary(strategies);
  const competitorSummary = getCompetitorSummary(competitors);
  const testsSummary = getAllTestsSummary(tests);

  // Check for low confidence strategies
  const lowConfidenceStrategies = strategies.filter(s => s.confidence < 70);
  if (lowConfidenceStrategies.length > 0) {
    alerts.push({
      type: "warning",
      title: "Low Confidence Strategies",
      description: `${lowConfidenceStrategies.length} strategy(s) have confidence below 70%. Consider gathering more data before implementation.`,
      severity: "medium",
    });
  }

  // Check for price being too high vs competitors
  if (competitorSummary.priceIndex && competitorSummary.priceIndex > 120) {
    alerts.push({
      type: "danger",
      title: "Premium Pricing Risk",
      description: `Our prices are 20%+ above market average. Monitor conversion rates closely for potential impact.`,
      severity: "high",
    });
  }

  // Check for too many running tests
  if (testsSummary.runningCount > 5) {
    alerts.push({
      type: "info",
      title: "Multiple Running Tests",
      description: `${testsSummary.runningCount} price tests running simultaneously. Ensure adequate traffic for statistical significance.`,
      severity: "low",
    });
  }

  // Check for low margins
  if (strategySummary.avgMargin < 40) {
    alerts.push({
      type: "warning",
      title: "Low Profit Margins",
      description: `Average profit margin of ${strategySummary.avgMargin}% is below target. Review cost structure and pricing levels.`,
      severity: "high",
    });
  }

  return alerts;
}
