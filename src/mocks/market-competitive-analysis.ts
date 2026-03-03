// Market & Competitive Analysis Module (Module 7) - Mock Data
// Tags: analysis types, segment types - HARDCODED
// Data: summary content, recommendations, action items - MOVED TO MOCK

/**
 * Summary description for the Summary & Recommendations tab
 */
export const SUMMARY_DESCRIPTION =
  "Executive summary of market conditions and competitive positioning";

/**
 * Generates the market analysis summary text with dynamic values
 */
export function getSummaryContent(
  totalTam: number,
  avgGrowthRate: number,
  competitorCount: number,
  customerSegmentCount: number,
): string {
  return `1. MARKET OVERVIEW
Total addressable market (TAM) stands at approximately $${totalTam.toFixed(0)}B with an average growth rate of ${avgGrowthRate.toFixed(1)}% across segments. The market is fragmented with ${competitorCount} active competitors.

2. CUSTOMER SEGMENTATION
We operate across ${customerSegmentCount} distinct customer segments with varying needs and willingness to pay. Each segment shows unique growth trajectories and profit margins.

3. COMPETITIVE LANDSCAPE
The market shows clear differentiation between pure-play competitors and diversified incumbents. Our unique value proposition addresses underserved segments with strong growth potential.

4. MARKET TRENDS
Key trends shaping the market include digital transformation, consolidation among mid-market players, and increasing price sensitivity. These trends create both opportunities and threats to current positioning.

5. STRATEGIC POSITIONING
Our competitive position is differentiated through superior customer service and faster innovation cycles. Market share growth is achievable through selective expansion into adjacent segments.`;
}

/**
 * Generates summary metrics for the market analysis
 */
export function getSummaryMetrics(
  totalTam: number,
  avgGrowthRate: number,
  customerSegmentCount: number,
  competitorCount: number,
) {
  return [
    {
      index: 1,
      title: "Total Market Size (TAM)",
      value: `$${totalTam.toFixed(0)}B`,
      insight: "Full addressable market across all segments",
    },
    {
      index: 2,
      title: "Market Growth Rate",
      value: `${avgGrowthRate.toFixed(1)}%`,
      insight: "Average annual growth across market segments",
    },
    {
      index: 3,
      title: "Customer Segments",
      value: customerSegmentCount,
      insight: "Distinct market segments identified",
    },
    {
      index: 4,
      title: "Competitors",
      value: competitorCount,
      insight: "Direct and indirect competitors in market",
    },
  ];
}

/**
 * Recommendation description for the Summary & Recommendations tab
 */
export const RECOMMENDATION_DESCRIPTION =
  "Strategic recommendations for market expansion and competitive positioning";

/**
 * Generates the market analysis recommendation text
 */
export function getRecommendationContent(): string {
  return `1. MARKET PENETRATION
Focus on deepening market penetration in high-growth segments. Increase marketing investment in channels with highest ROI. Consider strategic partnerships to expand distribution reach.

2. COMPETITIVE DIFFERENTIATION
Strengthen unique value proposition through continuous innovation. Invest in brand building to create higher switching costs. Develop thought leadership to attract talent and customers.

3. PRICING STRATEGY
Optimize pricing across customer segments based on willingness to pay analysis. Implement dynamic pricing for seasonal demand variations. Bundle complementary products to increase customer lifetime value.

4. MARKET EXPANSION
Identify and evaluate adjacent market opportunities with similar customer profiles. Develop entry strategy for new geographies with high growth potential. Build capability in new product categories.

5. COMPETITIVE MONITORING
Establish competitive intelligence function to monitor competitor moves. Track customer satisfaction and NPS relative to competitors. Conduct quarterly strategic reviews to adapt positioning.`;
}

/**
 * Default action items for the market analysis
 */
export const DEFAULT_ACTION_ITEMS = [
  {
    index: 1,
    title: "Market Segmentation Study",
    description:
      "Conduct detailed market segmentation analysis to identify highest-value customer segments and prioritize go-to-market strategy",
    priority: "high" as const,
    timeline: "Q1 2025",
  },
  {
    index: 2,
    title: "Competitive Benchmarking",
    description:
      "Establish quarterly competitive benchmarking process to track competitor performance, pricing, and customer perception",
    priority: "high" as const,
    timeline: "Q1 2025",
  },
  {
    index: 3,
    title: "Value Proposition Enhancement",
    description:
      "Refine and communicate unique value proposition through updated marketing materials and customer-facing messaging",
    priority: "medium" as const,
    timeline: "Q1-Q2 2025",
  },
  {
    index: 4,
    title: "Customer Win/Loss Analysis",
    description:
      "Conduct win/loss interviews with customers and prospects to understand decision drivers and competitive strengths/weaknesses",
    priority: "medium" as const,
    timeline: "Q2 2025",
  },
  {
    index: 5,
    title: "Market Entry Planning",
    description:
      "Develop detailed entry strategy for adjacent market segments including customer acquisition cost and revenue projections",
    priority: "low" as const,
    timeline: "Q2-Q3 2025",
  },
];

/**
 * Default next steps for the market analysis
 */
export const DEFAULT_NEXT_STEPS = [
  {
    index: 1,
    step: "Complete market sizing and TAM/SAM/SOM analysis",
    owner: "Strategy Team",
    dueDate: "End of Week 2",
  },
  {
    index: 2,
    step: "Conduct competitor SWOT analysis for top 5 competitors",
    owner: "Competitive Intel Team",
    dueDate: "End of Week 3",
  },
  {
    index: 3,
    step: "Develop customer persona profiles by segment",
    owner: "Product Marketing",
    dueDate: "End of Month",
  },
  {
    index: 4,
    step: "Present market recommendations to executive team",
    owner: "Chief Strategist",
    dueDate: "Mid-Month Review",
  },
];
