/**
 * Pricing Strategy Mock Content
 *
 * Contains all narrative content, metrics, and action items for the
 * Pricing Strategy module.
 */

/**
 * Market premium constant
 * Represents the price premium versus market average
 */
export const MARKET_PREMIUM = "8-12%";
export const MARKET_PREMIUM_VALUE = 8;
export const MARKET_PREMIUM_MAX = 12;

/**
 * Competitive positioning premium range
 * Shows how much above market average the company prices
 */
export const COMPETITIVE_PREMIUM_RANGE = {
  min: 5,
  max: 15,
  description:
    "Price premium versus market average, justified by value delivered",
};

/**
 * Summary section content generator
 */
export const getSummaryContent = (
  strategiesLength: number,
  metricsLength: number,
  runningTestsCount: number,
) => `1. CURRENT PRICING MODEL
The organization employs a ${strategiesLength > 0 ? "multi-strategy" : "value-based"} pricing model across ${metricsLength} key pricing metrics. Prices are optimized based on customer segment, competitive positioning, and willingness to pay analysis.

2. PRICING METRICS PERFORMANCE
Current metrics show strong performance with revenue per unit standing at optimal levels. Margin contribution and customer acquisition costs are within target ranges. Pricing elasticity analysis indicates room for strategic optimization.

3. ACTIVE PRICE TESTS
${runningTestsCount} price tests are currently running across different product lines and customer segments. These tests provide data-driven insights for permanent pricing adjustments.

4. COMPETITIVE POSITIONING
Our pricing positions the company as a premium player with differentiation based on superior features and customer service. Competitive intelligence shows our prices are ${COMPETITIVE_PREMIUM_RANGE.min}-${COMPETITIVE_PREMIUM_RANGE.max}% above market average, justified by value delivered.

5. OPTIMIZATION OPPORTUNITIES
Analysis identifies ${strategiesLength} distinct pricing strategies that could enhance revenue while maintaining customer satisfaction. Implementation priorities should consider implementation complexity and expected impact.`;

/**
 * Summary section description
 */
export const SUMMARY_DESCRIPTION =
  "Executive summary of pricing models and performance metrics";

/**
 * Recommendation section content
 */
export const getRecommendationContent = () => `1. PRICE OPTIMIZATION
Implement tiered pricing strategy that captures maximum value from high-willingness-to-pay segments. Use data from ongoing price tests to finalize optimal price points. Consider bundling strategies to increase average order value.

2. DYNAMIC PRICING
Deploy dynamic pricing algorithms for products with high demand volatility. Implement real-time price adjustments based on inventory levels and competitive actions. Ensure pricing transparency to maintain customer trust.

3. COMPETITIVE RESPONSE
Establish monthly competitive pricing review process to monitor market moves. Develop pricing decision framework for competitive threats. Build pricing flexibility into contracts to enable rapid response.

4. CUSTOMER SEGMENTATION
Implement segment-specific pricing that reflects value delivered to each customer type. Use customer profitability analysis to optimize acquisition strategy by segment. Develop retention pricing strategies for high-value segments.

5. REVENUE MANAGEMENT
Implement revenue management system to optimize price, volume, and mix. Establish revenue targets by product and segment. Create pricing governance framework to ensure consistency and compliance.`;

/**
 * Recommendation section description
 */
export const RECOMMENDATION_DESCRIPTION =
  "Strategic pricing recommendations for revenue optimization";

/**
 * Default action items for pricing strategy
 */
export const DEFAULT_PRICING_ACTION_ITEMS = [
  {
    index: 1,
    title: "Price Test Acceleration",
    description:
      "Expand price testing to cover all major product lines and customer segments to enable data-driven pricing decisions",
    priority: "high" as const,
    timeline: "Q1 2025",
  },
  {
    index: 2,
    title: "Pricing Strategy Framework",
    description:
      "Develop comprehensive pricing strategy framework that integrates cost structure, competitive dynamics, and customer value",
    priority: "high" as const,
    timeline: "Q1 2025",
  },
  {
    index: 3,
    title: "Dynamic Pricing Implementation",
    description:
      "Build and deploy dynamic pricing system for inventory-sensitive products with high demand variability",
    priority: "medium" as const,
    timeline: "Q2 2025",
  },
  {
    index: 4,
    title: "Competitor Monitoring System",
    description:
      "Establish automated competitive pricing intelligence system for continuous market monitoring",
    priority: "medium" as const,
    timeline: "Q2 2025",
  },
  {
    index: 5,
    title: "Customer Willingness-to-Pay Study",
    description:
      "Conduct comprehensive willingness-to-pay research across customer segments to inform pricing ceiling",
    priority: "low" as const,
    timeline: "Q2-Q3 2025",
  },
];

/**
 * Default next steps for pricing strategy
 */
export const DEFAULT_PRICING_NEXT_STEPS = [
  {
    index: 1,
    step: "Review and analyze results from active price tests",
    owner: "Pricing Analytics Team",
    dueDate: "End of Week 1",
  },
  {
    index: 2,
    step: "Conduct cost analysis to establish pricing floor",
    owner: "Finance Team",
    dueDate: "End of Week 2",
  },
  {
    index: 3,
    step: "Develop pricing recommendations for executive review",
    owner: "Pricing Strategy Lead",
    dueDate: "Mid-Month",
  },
  {
    index: 4,
    step: "Implement approved pricing changes across channels",
    owner: "Sales & Operations",
    dueDate: "End of Month",
  },
];

/**
 * Summary metrics generator for pricing strategy
 */
export const getSummaryMetrics = (
  averagePrice: number,
  strategiesCount: number,
  runningTests: number,
) => [
  {
    index: 1,
    title: "Average Price Point",
    value: `$${averagePrice.toFixed(0)}`,
    insight: "Weighted average across all products",
  },
  {
    index: 2,
    title: "Pricing Strategies",
    value: strategiesCount,
    insight: "Active pricing strategies deployed",
  },
  {
    index: 3,
    title: "Price Tests Running",
    value: runningTests,
    insight: "Active price optimization experiments",
  },
  {
    index: 4,
    title: "Market Premium",
    value: MARKET_PREMIUM,
    unit: "%",
    insight: "Price premium versus market average",
  },
];
