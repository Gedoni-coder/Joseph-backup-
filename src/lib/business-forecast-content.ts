/**
 * Business Forecast Mock Content
 *
 * Contains all narrative content, templates, and constants for the
 * Business Forecast module. This separates content from the UI component.
 *
 * Content can be easily updated, localized, or templated without
 * modifying component code.
 */

export const BUSINESS_FORECAST_DEFAULTS = {
  /**
   * Annual revenue target - primary business goal
   * This is a default value that should come from actual business data
   */
  ANNUAL_REVENUE_TARGET: "$13.7M",
  ANNUAL_REVENUE_TARGET_VALUE: 13700000,
};

/**
 * Summary section content template
 * Uses template literals with placeholders for dynamic data
 *
 * @param customerCount - Number of customer segments
 * @param scenarioCount - Number of forecast scenarios
 * @param kpiCount - Number of KPIs being tracked
 */
export const getSummaryContent = (
  customerCount: number,
  scenarioCount: number,
  kpiCount: number,
) => `1. REVENUE OVERVIEW
Current annual revenue target is set at ${BUSINESS_FORECAST_DEFAULTS.ANNUAL_REVENUE_TARGET} with ${customerCount} distinct customer segments identified. The forecast includes ${scenarioCount} scenario models to cover conservative, base, and aggressive growth cases.

2. CUSTOMER BASE
The business operates across multiple customer segments with varying demand patterns. Average order values and segment preferences have been analyzed to inform revenue projections and marketing strategies.

3. KEY PERFORMANCE METRICS
${kpiCount} key performance indicators are being tracked across operational, financial, and strategic dimensions. These KPIs provide early signals of business health and market opportunity.

4. FORECAST METHODOLOGY
The forecast employs Monte Carlo simulations, linear regression analysis, and scenario planning to account for uncertainty and provide a range of potential outcomes.

5. NEXT QUARTER OUTLOOK
Q1 2025 focuses on foundation building, with emphasis on customer retention and operational efficiency improvements. Expected growth rate aligns with market expansion strategy.`;

/**
 * Summary recommendation section description
 */
export const SUMMARY_DESCRIPTION =
  "Executive summary with key metrics and insights";

/**
 * Recommendation content template
 */
export const getRecommendationContent = () => `1. REVENUE OPTIMIZATION
Prioritize high-margin customer segments that show strongest growth potential. Consider dynamic pricing strategies for products with high elasticity. Implement customer lifetime value modeling to focus acquisition and retention efforts on most valuable segments.

2. SCENARIO PLANNING
Develop contingency plans for downside scenarios (20% revenue below base case). Establish trigger points for strategy adjustments based on key leading indicators. Quarterly scenario reviews to adapt planning assumptions as market conditions evolve.

3. OPERATIONAL EFFICIENCY
Target 10-15% improvement in cost structure through process optimization. Invest in automation for repetitive tasks. Negotiate supplier contracts aligned with growth trajectory.

4. CASH FLOW MANAGEMENT
Establish working capital reserves equivalent to 60 days of operating expenses. Monitor cash conversion cycle monthly. Implement early warning system for cash flow stress signals.

5. MARKET EXPANSION
Identify 2-3 new market segments or geographies for expansion in next 12 months. Allocate 15-20% of resources to innovation and market testing. Build partnerships with complementary service providers.`;

/**
 * Recommendation section description
 */
export const RECOMMENDATION_DESCRIPTION =
  "Strategic recommendations and action items based on forecast analysis";

/**
 * Default action items for business forecast
 * These can be customized based on actual business analysis
 */
export const DEFAULT_ACTION_ITEMS = [
  {
    index: 1,
    title: "Segment Revenue Analysis",
    description:
      "Conduct detailed profitability analysis for each customer segment to identify high-margin opportunities and optimize pricing strategy",
    priority: "high" as const,
    timeline: "Q1 2025",
  },
  {
    index: 2,
    title: "Cash Flow Forecasting System",
    description:
      "Implement daily cash flow tracking and weekly rolling forecasts to improve liquidity management and decision-making",
    priority: "high" as const,
    timeline: "Q1 2025",
  },
  {
    index: 3,
    title: "Cost Reduction Initiative",
    description:
      "Launch cross-functional program to identify and eliminate wasteful spending while maintaining service quality",
    priority: "medium" as const,
    timeline: "Q2 2025",
  },
  {
    index: 4,
    title: "KPI Dashboard Enhancement",
    description:
      "Expand KPI dashboard with real-time alerts for critical metrics and predictive analytics for early warning signals",
    priority: "medium" as const,
    timeline: "Q2 2025",
  },
  {
    index: 5,
    title: "Market Expansion Strategy",
    description:
      "Research and develop entry strategy for adjacent market segments or geographies with strong growth potential",
    priority: "low" as const,
    timeline: "Q2-Q3 2025",
  },
];

/**
 * Default next steps for forecast review
 */
export const DEFAULT_NEXT_STEPS = [
  {
    index: 1,
    step: "Review and validate all revenue assumptions in the forecast model",
    owner: "Finance Team",
    dueDate: "End of Week 1",
  },
  {
    index: 2,
    step: "Conduct sensitivity analysis on key input variables",
    owner: "Analytics Team",
    dueDate: "End of Week 2",
  },
  {
    index: 3,
    step: "Present scenarios to executive team with recommended strategy",
    owner: "CFO",
    dueDate: "End of Month",
  },
  {
    index: 4,
    step: "Establish monthly forecast review cadence with updates",
    owner: "Planning Manager",
    dueDate: "Ongoing",
  },
];

/**
 * Growth trajectory quarters
 * Used in the revenue breakdown section
 */
export const GROWTH_TRAJECTORY = [
  {
    quarter: "Q1 2025",
    description: "Foundation building phase",
  },
  {
    quarter: "Q2 2025",
    description: "Accelerated growth period",
  },
  {
    quarter: "Q3 2025",
    description: "Market expansion phase",
  },
  {
    quarter: "Q4 2025",
    description: "Optimization and scaling",
  },
];

/**
 * Summary metrics that always appear in the summary section
 * These are composed from data + content
 */
export const getSummaryMetrics = (
  customerCount: number,
  kpiCount: number,
  scenarioCount: number,
) => [
  {
    index: 1,
    title: "Annual Revenue Target",
    value: BUSINESS_FORECAST_DEFAULTS.ANNUAL_REVENUE_TARGET,
    insight: "Primary revenue goal for fiscal year",
  },
  {
    index: 2,
    title: "Customer Segments",
    value: customerCount,
    insight: "Active market segments being served",
  },
  {
    index: 3,
    title: "KPIs Tracked",
    value: kpiCount,
    insight: "Performance metrics under active monitoring",
  },
  {
    index: 4,
    title: "Scenario Models",
    value: scenarioCount,
    insight: "Planning scenarios for different market conditions",
  },
];
