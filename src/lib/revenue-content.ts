/**
 * Revenue Strategy Mock Content
 *
 * Contains all narrative content, metrics, and action items for the
 * Revenue Strategy module.
 */

/**
 * Estimated incremental revenue opportunity
 * Placeholder to be replaced with actual calculated values
 */
export const INCREMENTAL_REVENUE_ESTIMATE = "5-8M";

/**
 * Summary section content generator
 */
export const getSummaryContent = (
  streamsLength: number,
  churnLength: number,
  upsellsLength: number,
) => `1. REVENUE OVERVIEW
Total revenue streams are performing well with ${streamsLength} active channels contributing to top-line growth. Revenue mix shows healthy diversification across customer segments and product lines, reducing dependency on any single source.

2. KEY REVENUE METRICS
Revenue per customer and monthly recurring revenue (MRR) are tracking favorably against targets. Average customer lifetime value has improved through enhanced retention and upsell programs. Gross margin remains strong at industry-leading levels.

3. GROWTH DRIVERS
Revenue growth is being driven by three primary levers: new customer acquisition through expanded marketing, upsell and cross-sell to existing customer base, and improved pricing realization. Each lever contributes meaningfully to overall growth trajectory.

4. CUSTOMER RETENTION
Churn analysis shows stable retention rates with ${churnLength} customer cohorts being actively managed. Cohort analysis reveals improving retention in newer customer segments as onboarding and success processes mature.

5. EXPANSION OPPORTUNITIES
Analysis identifies ${upsellsLength} high-probability upsell and cross-sell opportunities that could generate incremental revenue of $${INCREMENTAL_REVENUE_ESTIMATE} annually without requiring new customer acquisition.`;

/**
 * Summary section description
 */
export const SUMMARY_DESCRIPTION =
  "Executive summary of revenue performance and growth opportunities";

/**
 * Recommendation section content
 */
export const getRecommendationContent = () => `1. REVENUE ACCELERATION
Implement aggressive customer acquisition targets in highest-LTV segments. Optimize go-to-market approach based on channel profitability analysis. Allocate marketing spend to highest-performing channels and campaigns.

2. CUSTOMER EXPANSION
Launch targeted upsell program focused on highest-probability expansion opportunities. Develop product bundling strategy to increase average order value. Implement usage-based upselling to monetize customer success.

3. RETENTION OPTIMIZATION
Implement proactive churn prevention program targeting at-risk cohorts. Enhance customer success resources to improve retention and expansion. Conduct win-loss analysis to improve competitive positioning.

4. PRICING OPTIMIZATION
Implement value-based pricing to capture more value from customers. Develop tier-based pricing structure to serve broader market. Implement price increases strategically to improve unit economics.

5. NEW REVENUE STREAMS
Evaluate adjacent market opportunities for new revenue streams. Develop partner channel strategy for market expansion. Consider marketplace or platform model to accelerate growth.`;

/**
 * Recommendation section description
 */
export const RECOMMENDATION_DESCRIPTION =
  "Strategic recommendations to accelerate revenue growth";

/**
 * Default action items for revenue strategy
 */
export const DEFAULT_REVENUE_ACTION_ITEMS = [
  {
    index: 1,
    title: "Upsell Campaign Launch",
    description:
      "Launch targeted upsell campaign to highest-probability customers with personalized value propositions and offers",
    priority: "high" as const,
    timeline: "Q1 2025",
  },
  {
    index: 2,
    title: "Retention Program Expansion",
    description:
      "Develop and implement comprehensive retention program targeting high-churn cohorts with targeted interventions",
    priority: "high" as const,
    timeline: "Q1 2025",
  },
  {
    index: 3,
    title: "Customer Lifetime Value Optimization",
    description:
      "Implement CLV-based customer segmentation and resource allocation for maximum profitability",
    priority: "medium" as const,
    timeline: "Q2 2025",
  },
  {
    index: 4,
    title: "Channel Strategy Review",
    description:
      "Conduct comprehensive review of all revenue channels and optimize channel mix based on profitability",
    priority: "medium" as const,
    timeline: "Q2 2025",
  },
  {
    index: 5,
    title: "New Revenue Stream Development",
    description:
      "Research and develop strategy for adjacent revenue opportunities to diversify revenue base",
    priority: "low" as const,
    timeline: "Q2-Q3 2025",
  },
];

/**
 * Default next steps for revenue strategy
 */
export const DEFAULT_REVENUE_NEXT_STEPS = [
  {
    index: 1,
    step: "Analyze revenue contribution by customer segment and product",
    owner: "Analytics Team",
    dueDate: "End of Week 1",
  },
  {
    index: 2,
    step: "Identify top upsell opportunities and prioritize by impact",
    owner: "Revenue Operations",
    dueDate: "End of Week 2",
  },
  {
    index: 3,
    step: "Develop and present revenue growth recommendations",
    owner: "Revenue Strategy Lead",
    dueDate: "Mid-Month",
  },
  {
    index: 4,
    step: "Begin executing high-priority revenue initiatives",
    owner: "Sales & CS Teams",
    dueDate: "End of Month",
  },
];

/**
 * Summary metrics generator for revenue strategy
 */
export const getSummaryMetrics = (
  streamsLength: number,
  metricsLength: number,
  metricsTotal: number,
  upsellsLength: number,
  channelsLength: number,
) => [
  {
    index: 1,
    title: "Total Revenue Streams",
    value: streamsLength,
    insight: "Active revenue-generating channels",
  },
  {
    index: 2,
    title: "Average Annual Value",
    value: `$${(metricsTotal / Math.max(metricsLength, 1) / 1000).toFixed(0)}K`,
    insight: "Per customer annual revenue",
  },
  {
    index: 3,
    title: "Upsell Opportunities",
    value: upsellsLength,
    insight: "Identified expansion revenue potential",
  },
  {
    index: 4,
    title: "Active Channels",
    value: channelsLength,
    insight: "Revenue distribution channels",
  },
];
