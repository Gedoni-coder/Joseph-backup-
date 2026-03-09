/**
 * Inventory & Supply Chain Mock Content
 *
 * Contains all narrative content, action items, and next steps for the
 * Inventory & Supply Chain Management module.
 */

/**
 * Summary description for the Summary & Recommendations tab
 */
export const SUMMARY_DESCRIPTION =
  "Key observations across inventory levels, supplier performance, and risk profile";

/**
 * Generates the inventory summary text with dynamic values
 */
export function getSummaryContent(
  formattedInventoryValue: string,
  locationsCount: number,
  lowStockItems: number,
  auditsCount: number,
  supplierPerformance: number,
  suppliersCount: number,
  disruptionRisks: number,
  productionPlans: number,
  pendingOrders: number
): string {
  return `1. INVENTORY VALUE
Total on-hand inventory value stands at ${formattedInventoryValue} across ${locationsCount} locations.

2. STOCK STATUS
There are ${lowStockItems} items in low/out-of-stock status requiring attention. Inventory audits recorded ${auditsCount} recent entries.

3. SUPPLIER PERFORMANCE
Average supplier performance score is ${supplierPerformance.toFixed(1)}% across ${suppliersCount} active suppliers.

4. RISK OVERVIEW
${disruptionRisks} high-risk disruption alerts identified. Market volatility and regulatory changes are being monitored.

5. OPERATIONS OUTLOOK
Production plans: ${productionPlans}. Procurement orders pending: ${pendingOrders}. Focus remains on service levels and turnover improvement.`;
}

/**
 * Generates summary metrics for inventory analysis
 */
export function getSummaryMetrics(
  formattedInventoryValue: string,
  lowStockItems: number,
  supplierPerformance: number,
  disruptionRisks: number
) {
  return [
    {
      index: 1,
      title: "Inventory Value",
      value: formattedInventoryValue,
      insight: "Current total value of inventory",
    },
    {
      index: 2,
      title: "Low/Out-of-Stock Items",
      value: lowStockItems,
      insight: "SKUs needing replenishment",
    },
    {
      index: 3,
      title: "Avg Supplier Score",
      value: `${supplierPerformance.toFixed(1)}%`,
      unit: "%",
      insight: "Overall supplier performance",
    },
    {
      index: 4,
      title: "High-Risk Disruptions",
      value: disruptionRisks,
      insight: "Risks requiring mitigation",
    },
  ];
}

/**
 * Recommendation description for the Summary & Recommendations tab
 */
export const RECOMMENDATION_DESCRIPTION =
  "Practical actions to improve availability, efficiency, and resilience";

/**
 * Generates the inventory recommendation text with dynamic values
 */
export function getRecommendationContent(
  lowStockItems: number,
  disruptionRisks: number,
  productionPlans: number
): string {
  return `1. REPLENISHMENT & FORECASTING
Tighten reorder points using recent demand forecasts and lead-time variability. Prioritize ${lowStockItems} low/out-of-stock items.

2. SUPPLIER PERFORMANCE PROGRAM
Engage suppliers below target to improve on-time delivery and quality; expand scorecards and quarterly reviews.

3. RISK MITIGATION
Create mitigation plans for ${disruptionRisks} high-risk disruptions; diversify lanes and review safety stock.

4. PRODUCTION & PROCUREMENT ALIGNMENT
Synchronize production plans (${productionPlans}) with procurement orders to reduce bottlenecks and expedite critical materials.

5. ANALYTICS & GOVERNANCE
Enhance inventory analytics, turnover monitoring, and audit cadence; set weekly dashboards and alerts.`;
}

/**
 * Default action items for inventory management
 */
export const DEFAULT_ACTION_ITEMS = [
  {
    index: 1,
    title: "Reorder Point Review",
    description:
      "Recalculate reorder points using demand forecast error and supplier lead-time variability",
    priority: "high" as const,
    timeline: "This Month",
  },
  {
    index: 2,
    title: "Supplier QBRs",
    description:
      "Run quarterly business reviews for underperforming suppliers and agree on improvement plans",
    priority: "high" as const,
    timeline: "Quarterly",
  },
  {
    index: 3,
    title: "Risk Playbooks",
    description:
      "Draft disruption playbooks for top risk scenarios; pre-approve alternates and routes",
    priority: "medium" as const,
    timeline: "Next 6 Weeks",
  },
  {
    index: 4,
    title: "Demand-Procurement Sync",
    description:
      "Align MRP with latest forecasts and production constraints to reduce expedite costs",
    priority: "medium" as const,
    timeline: "Biweekly",
  },
  {
    index: 5,
    title: "Turnover Dashboard",
    description:
      "Deploy SKU-level turnover and dead-stock dashboard with alerting",
    priority: "low" as const,
    timeline: "Next Quarter",
  },
];

/**
 * Default next steps for inventory management
 */
export const DEFAULT_NEXT_STEPS = [
  {
    index: 1,
    step: "Publish replenishment list for low/out-of-stock SKUs",
    owner: "Inventory Ops",
    dueDate: "End of Week 1",
  },
  {
    index: 2,
    step: "Run supplier performance review and notify corrective actions",
    owner: "Procurement",
    dueDate: "End of Week 2",
  },
  {
    index: 3,
    step: "Approve risk mitigation plans and safety stock updates",
    owner: "Supply Chain Director",
    dueDate: "Mid-Month",
  },
  {
    index: 4,
    step: "Sync production and procurement schedules",
    owner: "Planning",
    dueDate: "Weekly",
  },
];
