// Inventory & Supply Chain Module (Module 12) - Mock Data
// Tags: status types, urgency levels, supplier types - HARDCODED
// Data: inventory items, supplier names, quantities, risk scores - MOVED TO MOCK

export interface InventoryStatus {
  key: string;
  label: string;
  color: string;
  severity: "critical" | "warning" | "info" | "success";
}

export const INVENTORY_STATUSES: Record<string, InventoryStatus> = {
  "in-stock": {
    key: "in-stock",
    label: "In Stock",
    color: "green",
    severity: "success",
  },
  "low-stock": {
    key: "low-stock",
    label: "Low Stock",
    color: "yellow",
    severity: "warning",
  },
  "out-of-stock": {
    key: "out-of-stock",
    label: "Out of Stock",
    color: "red",
    severity: "critical",
  },
  overstock: {
    key: "overstock",
    label: "Overstock",
    color: "blue",
    severity: "info",
  },
};

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  currentStock: number;
  minimumStock: number;
  reorderPoint: number;
  value: number;
  status: string;
  location: string;
  lastUpdated: string;
}

export const INVENTORY_ITEMS: InventoryItem[] = [
  {
    id: "inv-1",
    name: "Electronics Processor",
    sku: "ELEC-001",
    category: "Electronics",
    currentStock: 450,
    minimumStock: 100,
    reorderPoint: 200,
    value: 67500,
    status: "in-stock",
    location: "Warehouse A",
    lastUpdated: "2024-02-01",
  },
  {
    id: "inv-2",
    name: "Packaging Materials",
    sku: "PKG-002",
    category: "Packaging",
    currentStock: 45,
    minimumStock: 200,
    reorderPoint: 400,
    value: 2250,
    status: "low-stock",
    location: "Warehouse B",
    lastUpdated: "2024-02-01",
  },
  {
    id: "inv-3",
    name: "Raw Steel Sheets",
    sku: "STEEL-003",
    category: "Raw Materials",
    currentStock: 0,
    minimumStock: 500,
    reorderPoint: 800,
    value: 0,
    status: "out-of-stock",
    location: "Warehouse C",
    lastUpdated: "2024-02-01",
  },
  {
    id: "inv-4",
    name: "Plastic Components",
    sku: "PLASTIC-004",
    category: "Components",
    currentStock: 8500,
    minimumStock: 2000,
    reorderPoint: 3000,
    value: 42500,
    status: "overstock",
    location: "Warehouse A",
    lastUpdated: "2024-02-01",
  },
];

export interface Supplier {
  id: string;
  name: string;
  type: "primary" | "secondary" | "backup" | "specialized";
  location: string;
  leadTime: number; // days
  reliability: number; // percentage
  onTimeDeliveryRate: number; // percentage
  costPerUnit: number;
  minimumOrder: number;
  contacts: string[];
  lastDelivery: string;
  performanceRating: number; // 1-5 stars
}

export const SUPPLIERS: Supplier[] = [
  {
    id: "sup-1",
    name: "Global Parts Ltd",
    type: "primary",
    location: "Shanghai, China",
    leadTime: 30,
    reliability: 94,
    onTimeDeliveryRate: 96,
    costPerUnit: 150,
    minimumOrder: 100,
    contacts: ["john@globalparts.com", "+86-21-5888-1234"],
    lastDelivery: "2024-01-28",
    performanceRating: 4.8,
  },
  {
    id: "sup-2",
    name: "AfriTrade Partners",
    type: "secondary",
    location: "Lagos, Nigeria",
    leadTime: 7,
    reliability: 85,
    onTimeDeliveryRate: 82,
    costPerUnit: 180,
    minimumOrder: 50,
    contacts: ["support@afritrade.com", "+234-1-2345-6789"],
    lastDelivery: "2024-01-25",
    performanceRating: 4.2,
  },
  {
    id: "sup-3",
    name: "Emergency Components Inc",
    type: "backup",
    location: "Dubai, UAE",
    leadTime: 3,
    reliability: 92,
    onTimeDeliveryRate: 88,
    costPerUnit: 220,
    minimumOrder: 25,
    contacts: ["orders@emcomp.ae"],
    lastDelivery: "2024-02-01",
    performanceRating: 4.5,
  },
];

export interface RiskAlert {
  id: string;
  severity: "critical" | "high" | "medium" | "low";
  category: "supplier" | "logistics" | "demand" | "compliance" | "cost";
  title: string;
  description: string;
  affectedItems: string[];
  recommendedAction: string;
  daysUntilImpact: number;
}

export const RISK_ALERTS: RiskAlert[] = [
  {
    id: "risk-1",
    severity: "critical",
    category: "supplier",
    title: "Primary Supplier Disruption",
    description:
      "Global Parts Ltd experiencing production delays due to equipment failure. 2-3 week impact expected.",
    affectedItems: ["Electronics Processor", "Raw Steel Sheets"],
    recommendedAction:
      "Activate backup supplier (Emergency Components Inc) immediately",
    daysUntilImpact: 5,
  },
  {
    id: "risk-2",
    severity: "high",
    category: "logistics",
    title: "Port Strike - West Africa Region",
    description:
      "Potential port workers strike could affect shipments through Lagos and other West African ports.",
    affectedItems: ["All imported items"],
    recommendedAction:
      "Consider air freight for critical items; pre-position safety stock",
    daysUntilImpact: 10,
  },
];

export const INVENTORY_CONFIG = {
  riskThreshold: 20,
  currencyFormat: {
    millions: 1000000,
    millions_suffix: "M",
    thousands: 1000,
    thousands_suffix: "K",
  },
  defaultReorderLeadTime: 14, // days
};

export const SUPPLY_CHAIN_METRICS = {
  totalInventoryValue: 2150000,
  turnoverRate: 4.2,
  serviceLevel: 97.5,
  supplyChainEfficiency: 82,
  averageLeadTime: 18,
};

export const COMING_SOON_FEATURES = [
  "Demand forecasting with AI",
  "Automated reorder optimization",
  "Supplier performance scoring",
  "Multi-warehouse optimization",
  "Real-time tracking and visibility",
  "Sustainability reporting",
  "Advanced analytics and insights",
];

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
  pendingOrders: number,
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
  disruptionRisks: number,
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
  productionPlans: number,
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
