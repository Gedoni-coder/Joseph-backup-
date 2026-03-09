/**
 * Market Summary Generation Utilities
 * Contains all business logic for generating dynamic market analysis content
 */

import { MarketSize, CustomerSegment, MarketTrend, DemandForecast, IndustryInsight } from "@/lib/market-data";
import { 
  getMarketSizeSummary, 
  formatMarketSize, 
  getMarketAttractiveness,
  calculateMarketPotentialIndex 
} from "./market-size-calculation";
import { 
  getMarketSegmentSummary, 
  calculateTotalSegmentRevenuePotential,
  getMarketHighestGrowthSegment,
  getMarketHighestValueSegment 
} from "./customer-segment-calculation";
import { 
  getDemandForecastSummary, 
  calculateDemandGrowth,
  getTrendSummary 
} from "./demand-forecast-calculation";

export interface MarketSummaryMetrics {
  index: number;
  title: string;
  value: string;
  insight: string;
}

export interface MarketActionItem {
  index: number;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  timeline: string;
}

/**
 * Generate market analysis summary
 * @param marketSizes - Market sizes
 * @param customerSegments - Customer segments
 * @param trends - Market trends
 * @returns Summary text
 */
export function generateMarketSummary(
  marketSizes: MarketSize[],
  customerSegments: CustomerSegment[],
  trends: MarketTrend[]
): string {
  const marketSummary = getMarketSizeSummary(marketSizes);
  const segmentSummary = getMarketSegmentSummary(customerSegments);
  const trendSummary = getTrendSummary(trends);

  return `1. MARKET OPPORTUNITY
The total addressable market (TAM) is valued at ${formatMarketSize(marketSummary.totalTAM)} with a projected growth rate of ${marketSummary.avgGrowthRate}%. The serviceable addressable market (SAM) stands at ${formatMarketSize(marketSummary.totalSAM)}, representing ${Math.round((marketSummary.totalSAM / marketSummary.totalTAM) * 100)}% of the TAM.

2. CUSTOMER SEGMENTS
The business serves ${segmentSummary.segmentCount} distinct customer segments with a combined market size of ${segmentSummary.totalCustomers.toLocaleString()} potential customers. Average growth rate across segments is ${segmentSummary.avgGrowthRate}%, indicating ${segmentSummary.avgGrowthRate > 20 ? "strong" : segmentSummary.avgGrowthRate > 10 ? "moderate" : "steady"} market expansion potential.

3. MARKET DYNAMICS
${trendSummary.total} market trends identified, with ${trendSummary.positive} positive, ${trendSummary.negative} negative, and ${trendSummary.neutral} neutral trends. ${trendSummary.highImpact} high-impact trends require strategic attention.

4. COMPETITIVE POSITIONING
${segmentSummary.highPriorityCount} high-priority segments identified for immediate focus. Total revenue potential across segments is estimated at ${formatMarketSize(segmentSummary.totalRevenuePotential)}.

5. GROWTH TRAJECTORY
Market analysis indicates a ${marketSummary.avgGrowthRate > 15 ? "high-growth" : marketSummary.avgGrowthRate > 10 ? "moderate-growth" : "stable-growth"} environment. Strategic initiatives should align with dominant positive trends to maximize market capture.`;
}

/**
 * Generate market recommendations
 * @param marketSizes - Market sizes
 * @param customerSegments - Customer segments
 * @param trends - Market trends
 * @returns Recommendation text
 */
export function generateMarketRecommendations(
  marketSizes: MarketSize[],
  customerSegments: CustomerSegment[],
  trends: MarketTrend[]
): string {
  const marketSummary = getMarketSizeSummary(marketSizes);
  const segmentSummary = getMarketSegmentSummary(customerSegments);
  const trendSummary = getTrendSummary(trends);
  const highestGrowth = getMarketHighestGrowthSegment(customerSegments);
  const highestValue = getMarketHighestValueSegment(customerSegments);

  let recommendations = "";

  recommendations += `1. MARKET PENETRATION STRATEGY\n`;
  recommendations += `Target ${highestGrowth?.name || "high-growth segments"} which shows ${highestGrowth?.growthRate}% growth rate. Focus marketing resources on capturing market share in this expanding segment.\n\n`;

  recommendations += `2. REVENUE OPTIMIZATION\n`;
  recommendations += `Prioritize ${highestValue?.name || "high-value segments"} for maximum ROI. This segment represents the highest revenue potential at ${formatMarketSize(calculateTotalSegmentRevenuePotential(customerSegments))}.\n\n`;

  recommendations += `3. MARKET EXPANSION\n`;
  if (trendSummary.positive > trendSummary.negative) {
    recommendations += `Leverage the ${trendSummary.positive} positive market trends to expand into adjacent segments. Consider product line extensions that align with emerging customer needs.\n\n`;
  } else {
    recommendations += `Address the ${trendSummary.negative} negative trends through strategic differentiation. Focus on unique value propositions to maintain competitive advantage.\n\n`;
  }

  recommendations += `4. RISK MITIGATION\n`;
  recommendations += `Monitor ${trendSummary.highImpact} high-impact trends closely. Develop contingency plans for potential market shifts identified in the trend analysis.\n\n`;

  recommendations += `5. INVESTMENT PRIORITIES\n`;
  recommendations += `Allocate resources to segments with combined growth potential of ${segmentSummary.avgGrowthRate}%. Target market capture in ${marketSummary.marketCount} identified market opportunity areas.`;

  return recommendations;
}

/**
 * Generate summary metrics
 * @param marketSizes - Market sizes
 * @param customerSegments - Customer segments
 * @param demandForecasts - Demand forecasts
 * @returns Array of metrics
 */
export function generateMarketSummaryMetrics(
  marketSizes: MarketSize[],
  customerSegments: CustomerSegment[],
  demandForecasts: DemandForecast[]
): MarketSummaryMetrics[] {
  const marketSummary = getMarketSizeSummary(marketSizes);
  const segmentSummary = getMarketSegmentSummary(customerSegments);
  const demandSummary = getDemandForecastSummary(demandForecasts);

  return [
    {
      index: 1,
      title: "Total Addressable Market",
      value: formatMarketSize(marketSummary.totalTAM),
      insight: "Total market opportunity available",
    },
    {
      index: 2,
      title: "Serviceable Market",
      value: formatMarketSize(marketSummary.totalSAM),
      insight: "Market segment you can realistically target",
    },
    {
      index: 3,
      title: "Customer Segments",
      value: segmentSummary.segmentCount.toString(),
      insight: "Active market segments identified",
    },
    {
      index: 4,
      title: "Revenue Potential",
      value: formatMarketSize(segmentSummary.totalRevenuePotential),
      insight: "Combined revenue potential across segments",
    },
    {
      index: 5,
      title: "Demand Growth",
      value: `${demandSummary.avgGrowth}%`,
      insight: "Average projected demand growth",
    },
    {
      index: 6,
      title: "Forecast Confidence",
      value: `${demandSummary.avgConfidence}%`,
      insight: "Average confidence in demand forecasts",
    },
  ];
}

/**
 * Generate action items based on market data
 * @param marketSizes - Market sizes
 * @param customerSegments - Customer segments
 * @param trends - Market trends
 * @returns Array of action items
 */
export function generateMarketActionItems(
  marketSizes: MarketSize[],
  customerSegments: CustomerSegment[],
  trends: MarketTrend[]
): MarketActionItem[] {
  const trendSummary = getTrendSummary(trends);
  const highestGrowth = getMarketHighestGrowthSegment(customerSegments);
  const items: MarketActionItem[] = [];

  // High priority items
  if (trendSummary.highImpact > 0) {
    items.push({
      index: items.length + 1,
      title: "High-Impact Trend Analysis",
      description: `Analyze and develop strategies for ${trendSummary.highImpact} high-impact market trends identified in the analysis.`,
      priority: "high",
      timeline: "Q1 2025",
    });
  }

  if (highestGrowth) {
    items.push({
      index: items.length + 1,
      title: `${highestGrowth.name} Segment Expansion`,
      description: `Focus marketing and sales efforts on the ${highestGrowth.name} segment showing ${highestGrowth.growthRate}% growth rate.`,
      priority: "high",
      timeline: "Q1-Q2 2025",
    });
  }

  // Medium priority
  items.push({
    index: items.length + 1,
    title: "Market Penetration Strategy",
    description: "Develop comprehensive market penetration plan based on TAM/SAM/SOM analysis.",
    priority: "medium",
    timeline: "Q2 2025",
  });

  items.push({
    index: items.length + 1,
    title: "Competitive Positioning Review",
    description: "Evaluate competitive position relative to market trends and customer segment preferences.",
    priority: "medium",
    timeline: "Q2 2025",
  });

  // Low priority
  items.push({
    index: items.length + 1,
    title: "New Market Opportunity Research",
    description: "Explore expansion into adjacent markets identified in the analysis.",
    priority: "low",
    timeline: "Q3 2025",
  });

  return items;
}

/**
 * Generate market alerts based on data
 * @param trends - Market trends
 * @param insights - Industry insights
 * @returns Array of alerts
 */
export function generateMarketAlerts(
  trends: MarketTrend[],
  insights: IndustryInsight[]
): { type: string; title: string; description: string; severity: "high" | "medium" | "low" }[] {
  const alerts: { type: string; title: string; description: string; severity: "high" | "medium" | "low" }[] = [];

  // Check for negative trends
  const negativeTrends = trends.filter(t => t.direction === 'negative' && t.impact === 'high');
  if (negativeTrends.length > 0) {
    alerts.push({
      type: "warning",
      title: "High-Impact Negative Trends",
      description: `${negativeTrends.length} high-impact negative trend(s) detected. Review strategic plans accordingly.`,
      severity: "high",
    });
  }

  // Check for opportunities
  const opportunities = insights.filter(i => i.type === 'opportunity' && i.impact === 'high');
  if (opportunities.length > 0) {
    alerts.push({
      type: "opportunity",
      title: "High-Impact Opportunities",
      description: `${opportunities.length} high-impact opportunity identified. Consider prioritizing these for maximum growth.`,
      severity: "high",
    });
  }

  // Check for challenges
  const challenges = insights.filter(i => i.type === 'challenge' && i.impact === 'high');
  if (challenges.length > 0) {
    alerts.push({
      type: "challenge",
      title: "High-Impact Challenges",
      description: `${challenges.length} high-impact challenge(s) require attention. Develop mitigation strategies.`,
      severity: "medium",
    });
  }

  return alerts;
}

