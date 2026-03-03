// Financial Advisory & Planning Module (Module 6) - Mock Data
// Tags: notification types, advice categories - HARDCODED
// Data: actual notification content, advice recommendations - MOVED TO MOCK

export interface AdvisoryNotification {
  id: string;
  type: "alert" | "update" | "insight";
  title: string;
  message: string;
  icon: "calculator" | "trending-up" | "target" | "lightbulb";
  timeAgo: string;
}

export interface AdvisoryAdvice {
  id: string;
  type: "optimization" | "performance" | "risk" | "strategic";
  title: string;
  message: string;
  icon: "help-circle" | "target" | "shield" | "trending-up";
}

/**
 * Default notifications displayed in the notifications popover
 */
export const DEFAULT_NOTIFICATIONS: AdvisoryNotification[] = [
  {
    id: "notif-1",
    type: "alert",
    title: "Budget Alert",
    message: "Q2 budget variance exceeds threshold",
    icon: "calculator",
    timeAgo: "15 minutes ago",
  },
  {
    id: "notif-2",
    type: "update",
    title: "Cash Flow Update",
    message: "Monthly projections updated successfully",
    icon: "trending-up",
    timeAgo: "1 hour ago",
  },
];

/**
 * Default advice items displayed in the advice popover
 */
export const DEFAULT_ADVICE: AdvisoryAdvice[] = [
  {
    id: "advice-1",
    type: "optimization",
    title: "Optimization Opportunity",
    message: "Consider refining your analysis parameters",
    icon: "help-circle",
  },
  {
    id: "advice-2",
    type: "performance",
    title: "Performance Insight",
    message: "Analysis accuracy has improved significantly",
    icon: "target",
  },
];

/**
 * Summary description for the Summary & Recommendations tab
 */
export const SUMMARY_DESCRIPTION =
  "Executive summary of financial position and key metrics";

/**
 * Generates the financial advisory summary text with dynamic values
 */
export function getSummaryContent(
  budgetForecastsLength: number,
  liquidityMetricsLength: number,
  riskAssessmentsLength: number,
): string {
  return `1. FINANCIAL POSITION OVERVIEW
The organization maintains a strong financial position with healthy liquidity and profitability metrics. Cash flow projections show positive trends with adequate reserves to support operational needs and strategic investments.

2. BUDGET PERFORMANCE
Current budget execution shows ${budgetForecastsLength} active forecasts tracking within acceptable variance ranges. Actual spending aligns with planning assumptions, indicating strong cost controls and forecast accuracy.

3. CASH FLOW MANAGEMENT
Monthly cash flow projections indicate stable operational liquidity with ${liquidityMetricsLength} key metrics within target parameters. Working capital management is efficient with appropriate levels of inventory and receivables.

4. FINANCIAL RISKS
${riskAssessmentsLength} financial risks have been identified and are being actively monitored. Mitigation strategies are in place for material risks. Scenario analysis shows resilience across multiple stress test scenarios.

5. STRATEGIC FINANCIAL INITIATIVES
Performance drivers analysis indicates key areas for financial optimization. Recommended initiatives focus on improving profitability, optimizing capital deployment, and enhancing shareholder value.`;
}

/**
 * Recommendation description for the Summary & Recommendations tab
 */
export const RECOMMENDATION_DESCRIPTION =
  "Strategic recommendations for financial optimization and risk management";

/**
 * Generates the financial advisory recommendation text
 */
export function getRecommendationContent(): string {
  return `1. BUDGET OPTIMIZATION
Implement zero-based budgeting approach for discretionary spending categories. Establish monthly variance analysis with accountability for budget managers. Consider rolling forecasts to improve planning accuracy and flexibility.

2. CASH FLOW MANAGEMENT
Implement daily cash position monitoring and forecasting. Optimize working capital through improved payables management and receivables collection. Establish cash reserve policy to ensure adequate liquidity buffers.

3. FINANCIAL PLANNING
Develop integrated financial plan linking operational and strategic objectives. Implement quarterly business reviews to track progress and adjust plans. Build scenario planning capability for strategic decision-making.

4. RISK MANAGEMENT
Implement enhanced financial risk monitoring and reporting. Develop mitigation strategies for material financial risks. Establish governance process for financial risk decisions.

5. PERFORMANCE MANAGEMENT
Implement comprehensive KPI dashboard for financial performance tracking. Establish targets and accountability for key financial drivers. Conduct regular variance analysis with root cause assessment.`;
}

/**
 * Default action items for the summary section
 */
export const DEFAULT_ACTION_ITEMS = [
  {
    index: 1,
    title: "Enhanced Budget Forecasting",
    description:
      "Implement advanced budgeting system with rolling forecasts and monthly variance tracking",
    priority: "high" as const,
    timeline: "Q1 2025",
  },
  {
    index: 2,
    title: "Cash Flow Optimization Program",
    description:
      "Launch comprehensive working capital optimization initiative to improve cash conversion and liquidity",
    priority: "high" as const,
    timeline: "Q1 2025",
  },
  {
    index: 3,
    title: "Financial Risk Framework",
    description:
      "Develop and implement financial risk management framework with regular monitoring and reporting",
    priority: "medium" as const,
    timeline: "Q2 2025",
  },
  {
    index: 4,
    title: "Performance Dashboard Implementation",
    description:
      "Build comprehensive financial performance dashboard with real-time KPI tracking and alerts",
    priority: "medium" as const,
    timeline: "Q2 2025",
  },
  {
    index: 5,
    title: "Strategic Planning Process",
    description:
      "Establish integrated strategic planning process linking financial and operational objectives",
    priority: "low" as const,
    timeline: "Q2-Q3 2025",
  },
];

/**
 * Default next steps for the summary section
 */
export const DEFAULT_NEXT_STEPS = [
  {
    index: 1,
    step: "Review and validate all budget assumptions and forecasts",
    owner: "Finance Team",
    dueDate: "End of Week 1",
  },
  {
    index: 2,
    step: "Conduct financial risk assessment and prioritize risks",
    owner: "Risk Management Team",
    dueDate: "End of Week 2",
  },
  {
    index: 3,
    step: "Develop financial recommendations for executive review",
    owner: "CFO",
    dueDate: "Mid-Month",
  },
  {
    index: 4,
    step: "Establish monthly financial review cadence",
    owner: "Controller",
    dueDate: "Ongoing",
  },
];

/**
 * Generates summary metrics for the summary section
 */
export function getSummaryMetrics(
  budgetForecastsLength: number,
  cashFlowProjectionsLength: number,
  scenarioTestsLength: number,
  riskAssessmentsLength: number,
) {
  return [
    {
      index: 1,
      title: "Budget Forecasts",
      value: budgetForecastsLength,
      insight: "Active financial forecasts being tracked",
    },
    {
      index: 2,
      title: "Cash Flow Projections",
      value: cashFlowProjectionsLength,
      insight: "Monthly cash flow forecasts available",
    },
    {
      index: 3,
      title: "Scenario Tests",
      value: scenarioTestsLength,
      insight: "Financial scenario models for planning",
    },
    {
      index: 4,
      title: "Risk Assessments",
      value: riskAssessmentsLength,
      insight: "Financial risks under active review",
    },
  ];
}

export const NOTIFICATION_TOOLTIP_WIDTH = "w-80";
export const ADVISOR_TOOLTIP_WIDTH = "w-96";
