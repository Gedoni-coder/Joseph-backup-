export interface RevenueStream {
  id: string;
  name: string;
  type:
    | "subscription"
    | "one-time"
    | "usage-based"
    | "commission"
    | "advertising";
  currentRevenue: number;
  forecastRevenue: number;
  growth: number;
  margin: number;
  customers: number;
  avgRevenuePerCustomer: number;
}

export interface RevenueScenario {
  id: string;
  name: string;
  description: string;
  probability: number;
  timeframe: string;
  totalRevenue: number;
  revenueGrowth: number;
  keyAssumptions: string[];
  risks: string[];
}

export interface ChurnAnalysis {
  id: string;
  segment: string;
  churnRate: number;
  customers: number;
  revenueAtRisk: number;
  averageLifetime: number;
  retentionCost: number;
  churnReasons: ChurnReason[];
}

export interface ChurnReason {
  reason: string;
  percentage: number;
  impact: "high" | "medium" | "low";
}

export interface UpsellOpportunity {
  id: string;
  customer: string;
  currentPlan: string;
  suggestedPlan: string;
  currentMRR: number;
  potentialMRR: number;
  probabilityScore: number;
  timeToUpgrade: number;
  triggers: string[];
}

export interface RevenueMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  change: number;
  trend: "up" | "down" | "stable";
  period: string;
  benchmark?: number;
}

export interface DiscountAnalysis {
  id: string;
  discountType: string;
  discountRate: number;
  usage: number;
  revenueImpact: number;
  conversionLift: number;
  marginImpact: number;
  customerSegment: string;
}

export interface ChannelPerformance {
  id: string;
  channel: string;
  revenue: number;
  customers: number;
  avgOrderValue: number;
  acquisitionCost: number;
  profitability: number;
  growth: number;
}

// Mock data
export const revenueStreams: RevenueStream[] = [
  {
    id: "1",
    name: "SaaS Subscriptions",
    type: "subscription",
    currentRevenue: 2840000,
    forecastRevenue: 3420000,
    growth: 20.4,
    margin: 78.5,
    customers: 1247,
    avgRevenuePerCustomer: 2278,
  },
  {
    id: "2",
    name: "Professional Services",
    type: "one-time",
    currentRevenue: 920000,
    forecastRevenue: 1150000,
    growth: 25.0,
    margin: 45.2,
    customers: 186,
    avgRevenuePerCustomer: 4946,
  },
  {
    id: "3",
    name: "API Usage",
    type: "usage-based",
    currentRevenue: 486000,
    forecastRevenue: 683000,
    growth: 40.5,
    margin: 85.1,
    customers: 2341,
    avgRevenuePerCustomer: 208,
  },
  {
    id: "4",
    name: "Marketplace Commission",
    type: "commission",
    currentRevenue: 1560000,
    forecastRevenue: 1950000,
    growth: 25.0,
    margin: 92.3,
    customers: 856,
    avgRevenuePerCustomer: 1822,
  },
];

export const revenueScenarios: RevenueScenario[] = [
  {
    id: "1",
    name: "Optimistic Growth",
    description: "Strong market conditions with successful product launches",
    probability: 25,
    timeframe: "Next 12 months",
    totalRevenue: 8950000,
    revenueGrowth: 45.2,
    keyAssumptions: [
      "New product launch succeeds",
      "Market expansion in 3 regions",
      "Competitor loses market share",
    ],
    risks: ["Economic downturn", "Increased competition"],
  },
  {
    id: "2",
    name: "Base Case",
    description: "Expected performance under normal market conditions",
    probability: 50,
    timeframe: "Next 12 months",
    totalRevenue: 7200000,
    revenueGrowth: 28.6,
    keyAssumptions: [
      "Current growth rate maintained",
      "No major market disruptions",
      "Successful customer retention",
    ],
    risks: ["Pricing pressure", "Customer churn increase"],
  },
  {
    id: "3",
    name: "Conservative",
    description: "Cautious outlook considering market uncertainties",
    probability: 25,
    timeframe: "Next 12 months",
    totalRevenue: 5850000,
    revenueGrowth: 12.4,
    keyAssumptions: [
      "Slower market growth",
      "Increased competition",
      "Economic headwinds",
    ],
    risks: ["Recession impact", "Technology disruption"],
  },
];

export const churnAnalysis: ChurnAnalysis[] = [
  {
    id: "1",
    segment: "Enterprise",
    churnRate: 3.2,
    customers: 147,
    revenueAtRisk: 890000,
    averageLifetime: 31.2,
    retentionCost: 2400,
    churnReasons: [
      { reason: "Price sensitivity", percentage: 35, impact: "high" },
      { reason: "Lack of features", percentage: 28, impact: "medium" },
      { reason: "Poor support", percentage: 22, impact: "high" },
      { reason: "Competitor switch", percentage: 15, impact: "medium" },
    ],
  },
  {
    id: "2",
    segment: "SMB",
    churnRate: 8.7,
    customers: 823,
    revenueAtRisk: 245000,
    averageLifetime: 11.5,
    retentionCost: 180,
    churnReasons: [
      { reason: "Budget constraints", percentage: 42, impact: "high" },
      { reason: "Complexity", percentage: 25, impact: "medium" },
      { reason: "Limited usage", percentage: 20, impact: "low" },
      { reason: "Better alternative", percentage: 13, impact: "medium" },
    ],
  },
  {
    id: "3",
    segment: "Startup",
    churnRate: 12.4,
    customers: 1456,
    revenueAtRisk: 178000,
    averageLifetime: 8.1,
    retentionCost: 95,
    churnReasons: [
      { reason: "Business closure", percentage: 38, impact: "high" },
      { reason: "Cost optimization", percentage: 32, impact: "high" },
      { reason: "Outgrown product", percentage: 18, impact: "low" },
      { reason: "Technical issues", percentage: 12, impact: "medium" },
    ],
  },
];

export const upsellOpportunities: UpsellOpportunity[] = [
  {
    id: "1",
    customer: "TechCorp Industries",
    currentPlan: "Professional",
    suggestedPlan: "Enterprise",
    currentMRR: 2499,
    potentialMRR: 4999,
    probabilityScore: 87,
    timeToUpgrade: 45,
    triggers: ["High API usage", "Multiple team requests", "Growth indicators"],
  },
  {
    id: "2",
    customer: "StartupX Inc",
    currentPlan: "Basic",
    suggestedPlan: "Professional",
    currentMRR: 99,
    potentialMRR: 299,
    probabilityScore: 72,
    timeToUpgrade: 30,
    triggers: ["User limit reached", "Advanced features requested"],
  },
  {
    id: "3",
    customer: "GlobalSoft Ltd",
    currentPlan: "Professional",
    suggestedPlan: "Enterprise",
    currentMRR: 1899,
    potentialMRR: 3499,
    probabilityScore: 94,
    timeToUpgrade: 15,
    triggers: [
      "Security compliance needs",
      "Scale requirements",
      "Support upgrade",
    ],
  },
];

export const revenueMetrics: RevenueMetric[] = [
  {
    id: "1",
    name: "Monthly Recurring Revenue",
    value: 486750,
    unit: "$",
    change: 12.8,
    trend: "up",
    period: "This month",
    benchmark: 450000,
  },
  {
    id: "2",
    name: "Annual Contract Value",
    value: 28400,
    unit: "$",
    change: 8.4,
    trend: "up",
    period: "Q3 2024",
  },
  {
    id: "3",
    name: "Customer Lifetime Value",
    value: 14250,
    unit: "$",
    change: -2.1,
    trend: "down",
    period: "Last 90 days",
  },
  {
    id: "4",
    name: "Revenue per Customer",
    value: 2847,
    unit: "$",
    change: 15.6,
    trend: "up",
    period: "This quarter",
  },
  {
    id: "5",
    name: "Gross Revenue Retention",
    value: 94.2,
    unit: "%",
    change: 1.8,
    trend: "up",
    period: "Last 12 months",
  },
  {
    id: "6",
    name: "Net Revenue Retention",
    value: 118.5,
    unit: "%",
    change: 4.2,
    trend: "up",
    period: "Last 12 months",
  },
];

export const discountAnalysis: DiscountAnalysis[] = [
  {
    id: "1",
    discountType: "Early Bird",
    discountRate: 15,
    usage: 23.4,
    revenueImpact: -8.2,
    conversionLift: 34.6,
    marginImpact: -12.1,
    customerSegment: "New Customers",
  },
  {
    id: "2",
    discountType: "Volume Discount",
    discountRate: 20,
    usage: 12.7,
    revenueImpact: 18.5,
    conversionLift: 67.8,
    marginImpact: -15.3,
    customerSegment: "Enterprise",
  },
  {
    id: "3",
    discountType: "Loyalty Discount",
    discountRate: 10,
    usage: 8.9,
    revenueImpact: 2.4,
    conversionLift: 12.3,
    marginImpact: -7.8,
    customerSegment: "Existing Customers",
  },
];

export const channelPerformance: ChannelPerformance[] = [
  {
    id: "1",
    channel: "Direct Sales",
    revenue: 3240000,
    customers: 456,
    avgOrderValue: 7105,
    acquisitionCost: 840,
    profitability: 68.5,
    growth: 22.4,
  },
  {
    id: "2",
    channel: "Partner Network",
    revenue: 1890000,
    customers: 1247,
    avgOrderValue: 1516,
    acquisitionCost: 245,
    profitability: 45.2,
    growth: 35.8,
  },
  {
    id: "3",
    channel: "Online Marketplace",
    revenue: 920000,
    customers: 2341,
    avgOrderValue: 393,
    acquisitionCost: 48,
    profitability: 38.7,
    growth: 67.2,
  },
  {
    id: "4",
    channel: "Referral Program",
    revenue: 485000,
    customers: 823,
    avgOrderValue: 589,
    acquisitionCost: 32,
    profitability: 82.1,
    growth: 45.6,
  },
];
