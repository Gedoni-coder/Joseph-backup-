export interface CustomerProfile {
  id: string;
  segment: string;
  demandAssumption: number;
  growthRate: number;
  retention: number;
  avgOrderValue: number;
  seasonality: number;
}

export interface RevenueProjection {
  id: string;
  period: string;
  projected: number;
  conservative: number;
  optimistic: number;
  actualToDate?: number;
  confidence: number;
}

export interface CostStructure {
  id: string;
  category: string;
  type: "COGS" | "Operating";
  amount: number;
  percentage: number;
  variability: "Fixed" | "Variable" | "Semi-Variable";
  trend: "up" | "down" | "stable";
}

export interface CashFlowForecast {
  id: string;
  month: string;
  cashInflow: number;
  cashOutflow: number;
  netCashFlow: number;
  cumulativeCash: number;
  workingCapital: number;
}

export interface KPI {
  id: string;
  name: string;
  current: number;
  target: number;
  unit: string;
  trend: "up" | "down" | "stable";
  category: string;
  frequency: string;
}

export interface ScenarioPlanning {
  id: string;
  scenario: "Best Case" | "Base Case" | "Worst Case";
  revenue: number;
  costs: number;
  profit: number;
  probability: number;
  keyAssumptions: string[];
}

// Mock Data
export const customerProfiles: CustomerProfile[] = [
  {
    id: "1",
    segment: "Enterprise",
    demandAssumption: 85,
    growthRate: 12.5,
    retention: 92,
    avgOrderValue: 25000,
    seasonality: 8,
  },
  {
    id: "2",
    segment: "SMB",
    demandAssumption: 280,
    growthRate: 25.6,
    retention: 78,
    avgOrderValue: 1200,
    seasonality: 22,
  },
];

export const revenueProjections: RevenueProjection[] = [
  {
    id: "1",
    period: "Q1 2025",
    projected: 2800000,
    conservative: 2520000,
    optimistic: 3220000,
    actualToDate: 2654000,
    confidence: 85,
  },
  {
    id: "2",
    period: "Q2 2025",
    projected: 3200000,
    conservative: 2880000,
    optimistic: 3680000,
    actualToDate: 2720000,
    confidence: 78,
  },
  {
    id: "3",
    period: "Q3 2025",
    projected: 3500000,
    conservative: 3150000,
    optimistic: 4025000,
    actualToDate: 1850000,
    confidence: 72,
  },
  {
    id: "4",
    period: "Q4 2025",
    projected: 4200000,
    conservative: 3780000,
    optimistic: 4860000,
    confidence: 68,
  },
];

export const kpis: KPI[] = [
  // ==================== FINANCIAL KPIs ====================
  {
    id: "f1",
    name: "Revenue Growth Rate",
    current: 22.5,
    target: 25.0,
    unit: "%",
    trend: "up",
    category: "Financial",
    frequency: "Monthly",
  },
  {
    id: "f2",
    name: "Gross Profit Margin",
    current: 62.0,
    target: 65.0,
    unit: "%",
    trend: "up",
    category: "Financial",
    frequency: "Monthly",
  },
  {
    id: "f3",
    name: "Net Profit Margin",
    current: 18.5,
    target: 20.0,
    unit: "%",
    trend: "up",
    category: "Financial",
    frequency: "Monthly",
  },
  {
    id: "f4",
    name: "Operating Cash Flow",
    current: 2840000,
    target: 3200000,
    unit: "USD",
    trend: "up",
    category: "Financial",
    frequency: "Monthly",
  },
  {
    id: "f5",
    name: "Return on Investment (ROI)",
    current: 35.8,
    target: 40.0,
    unit: "%",
    trend: "up",
    category: "Financial",
    frequency: "Quarterly",
  },
  {
    id: "f6",
    name: "Accounts Receivable Turnover",
    current: 8.2,
    target: 9.0,
    unit: "times",
    trend: "up",
    category: "Financial",
    frequency: "Monthly",
  },
  {
    id: "f7",
    name: "Accounts Payable Turnover",
    current: 6.5,
    target: 7.0,
    unit: "times",
    trend: "up",
    category: "Financial",
    frequency: "Monthly",
  },
  {
    id: "f8",
    name: "Budget Variance",
    current: 2.8,
    target: 2.0,
    unit: "%",
    trend: "down",
    category: "Financial",
    frequency: "Monthly",
  },
  {
    id: "f9",
    name: "Operating Margin",
    current: 22.8,
    target: 25.0,
    unit: "%",
    trend: "up",
    category: "Financial",
    frequency: "Monthly",
  },
  {
    id: "f10",
    name: "Cash Burn Rate",
    current: 125000,
    target: 100000,
    unit: "USD",
    trend: "down",
    category: "Financial",
    frequency: "Monthly",
  },
  {
    id: "f11",
    name: "Runway (Months)",
    current: 18,
    target: 24,
    unit: "months",
    trend: "up",
    category: "Financial",
    frequency: "Quarterly",
  },

  // ==================== CUSTOMER KPIs ====================
  {
    id: "c1",
    name: "Customer Acquisition Cost (CAC)",
    current: 285,
    target: 250,
    unit: "USD",
    trend: "down",
    category: "Customer",
    frequency: "Monthly",
  },
  {
    id: "c2",
    name: "Customer Lifetime Value (CLV)",
    current: 4200,
    target: 4800,
    unit: "USD",
    trend: "up",
    category: "Customer",
    frequency: "Quarterly",
  },
  {
    id: "c3",
    name: "Net Promoter Score (NPS)",
    current: 52,
    target: 60,
    unit: "points",
    trend: "up",
    category: "Customer",
    frequency: "Monthly",
  },
  {
    id: "c4",
    name: "Customer Retention Rate",
    current: 91.5,
    target: 95.0,
    unit: "%",
    trend: "up",
    category: "Customer",
    frequency: "Monthly",
  },
  {
    id: "c5",
    name: "Churn Rate",
    current: 2.1,
    target: 1.5,
    unit: "%",
    trend: "down",
    category: "Customer",
    frequency: "Monthly",
  },
  {
    id: "c6",
    name: "Average Response Time",
    current: 4.2,
    target: 2.0,
    unit: "hours",
    trend: "down",
    category: "Customer",
    frequency: "Monthly",
  },
  {
    id: "c7",
    name: "Customer Satisfaction Score (CSAT)",
    current: 78.5,
    target: 85.0,
    unit: "%",
    trend: "up",
    category: "Customer",
    frequency: "Monthly",
  },
  {
    id: "c8",
    name: "Repeat Purchase Rate",
    current: 68.5,
    target: 75.0,
    unit: "%",
    trend: "up",
    category: "Customer",
    frequency: "Monthly",
  },
  {
    id: "c9",
    name: "Customer Complaints Rate",
    current: 3.2,
    target: 2.0,
    unit: "%",
    trend: "down",
    category: "Customer",
    frequency: "Monthly",
  },

  // ==================== SALES & MARKETING KPIs ====================
  {
    id: "sm1",
    name: "Leads Generated",
    current: 1240,
    target: 1500,
    unit: "count",
    trend: "up",
    category: "Sales & Marketing",
    frequency: "Monthly",
  },
  {
    id: "sm2",
    name: "Lead Conversion Rate",
    current: 8.5,
    target: 10.0,
    unit: "%",
    trend: "up",
    category: "Sales & Marketing",
    frequency: "Monthly",
  },
  {
    id: "sm3",
    name: "Sales Growth Rate",
    current: 22.5,
    target: 25.0,
    unit: "%",
    trend: "up",
    category: "Sales & Marketing",
    frequency: "Monthly",
  },
  {
    id: "sm4",
    name: "Marketing ROI",
    current: 380,
    target: 450,
    unit: "%",
    trend: "up",
    category: "Sales & Marketing",
    frequency: "Monthly",
  },
  {
    id: "sm5",
    name: "Website Conversion Rate",
    current: 3.2,
    target: 4.0,
    unit: "%",
    trend: "up",
    category: "Sales & Marketing",
    frequency: "Monthly",
  },
  {
    id: "sm6",
    name: "Cost per Lead",
    current: 85,
    target: 75,
    unit: "USD",
    trend: "down",
    category: "Sales & Marketing",
    frequency: "Monthly",
  },
  {
    id: "sm7",
    name: "Cost per Acquisition",
    current: 250,
    target: 220,
    unit: "USD",
    trend: "down",
    category: "Sales & Marketing",
    frequency: "Monthly",
  },
  {
    id: "sm8",
    name: "Pipeline Coverage Ratio",
    current: 3.8,
    target: 4.0,
    unit: "ratio",
    trend: "up",
    category: "Sales & Marketing",
    frequency: "Weekly",
  },
  {
    id: "sm9",
    name: "Average Deal Size",
    current: 45000,
    target: 50000,
    unit: "USD",
    trend: "up",
    category: "Sales & Marketing",
    frequency: "Monthly",
  },
  {
    id: "sm10",
    name: "Sales Cycle Length",
    current: 45,
    target: 35,
    unit: "days",
    trend: "down",
    category: "Sales & Marketing",
    frequency: "Monthly",
  },

  // ==================== OPERATIONAL / PROCESS KPIs ====================
  {
    id: "op1",
    name: "Cycle Time",
    current: 6.2,
    target: 5.0,
    unit: "days",
    trend: "down",
    category: "Operational",
    frequency: "Monthly",
  },
  {
    id: "op2",
    name: "Order Fulfillment Time",
    current: 3.5,
    target: 2.5,
    unit: "days",
    trend: "down",
    category: "Operational",
    frequency: "Monthly",
  },
  {
    id: "op3",
    name: "Inventory Turnover Rate",
    current: 4.2,
    target: 5.0,
    unit: "times",
    trend: "up",
    category: "Operational",
    frequency: "Monthly",
  },
  {
    id: "op4",
    name: "Manufacturing Defect Rate",
    current: 1.2,
    target: 0.8,
    unit: "%",
    trend: "down",
    category: "Operational",
    frequency: "Monthly",
  },
  {
    id: "op5",
    name: "On-Time Delivery Rate",
    current: 94.5,
    target: 98.0,
    unit: "%",
    trend: "up",
    category: "Operational",
    frequency: "Monthly",
  },
  {
    id: "op6",
    name: "Process Downtime",
    current: 1.8,
    target: 0.5,
    unit: "%",
    trend: "down",
    category: "Operational",
    frequency: "Monthly",
  },
  {
    id: "op7",
    name: "Capacity Utilization",
    current: 78.5,
    target: 85.0,
    unit: "%",
    trend: "up",
    category: "Operational",
    frequency: "Monthly",
  },
  {
    id: "op8",
    name: "Waste Rate",
    current: 4.2,
    target: 2.5,
    unit: "%",
    trend: "down",
    category: "Operational",
    frequency: "Monthly",
  },

  // ==================== EMPLOYEE / HR KPIs ====================
  {
    id: "hr1",
    name: "Employee Turnover Rate",
    current: 8.5,
    target: 5.0,
    unit: "%",
    trend: "down",
    category: "HR & Employee",
    frequency: "Monthly",
  },
  {
    id: "hr2",
    name: "Employee Engagement Score",
    current: 72,
    target: 80,
    unit: "points",
    trend: "up",
    category: "HR & Employee",
    frequency: "Quarterly",
  },
  {
    id: "hr3",
    name: "Average Time to Hire",
    current: 32,
    target: 25,
    unit: "days",
    trend: "down",
    category: "HR & Employee",
    frequency: "Monthly",
  },
  {
    id: "hr4",
    name: "Training Completion Rate",
    current: 82.5,
    target: 95.0,
    unit: "%",
    trend: "up",
    category: "HR & Employee",
    frequency: "Monthly",
  },
  {
    id: "hr5",
    name: "Absenteeism Rate",
    current: 3.2,
    target: 2.0,
    unit: "%",
    trend: "down",
    category: "HR & Employee",
    frequency: "Monthly",
  },
  {
    id: "hr6",
    name: "Revenue per Employee",
    current: 385000,
    target: 420000,
    unit: "USD",
    trend: "up",
    category: "HR & Employee",
    frequency: "Quarterly",
  },
  {
    id: "hr7",
    name: "Employee Productivity",
    current: 92.5,
    target: 95.0,
    unit: "%",
    trend: "up",
    category: "HR & Employee",
    frequency: "Monthly",
  },
  {
    id: "hr8",
    name: "Employee Satisfaction",
    current: 76.5,
    target: 85.0,
    unit: "%",
    trend: "up",
    category: "HR & Employee",
    frequency: "Quarterly",
  },

  // ==================== PROJECT / PRODUCT KPIs ====================
  {
    id: "pp1",
    name: "Project On-Time Delivery Rate",
    current: 88.5,
    target: 95.0,
    unit: "%",
    trend: "up",
    category: "Project & Product",
    frequency: "Monthly",
  },
  {
    id: "pp2",
    name: "Product Defect Rate",
    current: 0.8,
    target: 0.5,
    unit: "%",
    trend: "down",
    category: "Project & Product",
    frequency: "Monthly",
  },
  {
    id: "pp3",
    name: "Feature Adoption Rate",
    current: 68.5,
    target: 75.0,
    unit: "%",
    trend: "up",
    category: "Project & Product",
    frequency: "Monthly",
  },
  {
    id: "pp4",
    name: "Time to Market",
    current: 5.2,
    target: 4.0,
    unit: "months",
    trend: "down",
    category: "Project & Product",
    frequency: "Quarterly",
  },
  {
    id: "pp5",
    name: "Project Budget Variance",
    current: 2.5,
    target: 2.0,
    unit: "%",
    trend: "down",
    category: "Project & Product",
    frequency: "Monthly",
  },
  {
    id: "pp6",
    name: "Sprint Velocity",
    current: 42,
    target: 50,
    unit: "points",
    trend: "up",
    category: "Project & Product",
    frequency: "Weekly",
  },
  {
    id: "pp7",
    name: "Product ROI",
    current: 380,
    target: 450,
    unit: "%",
    trend: "up",
    category: "Project & Product",
    frequency: "Quarterly",
  },

  // ==================== INNOVATION / GROWTH KPIs ====================
  {
    id: "ig1",
    name: "New Product Revenue Percentage",
    current: 18.5,
    target: 22.0,
    unit: "%",
    trend: "up",
    category: "Innovation & Growth",
    frequency: "Monthly",
  },
  {
    id: "ig2",
    name: "R&D Spend Ratio",
    current: 8.5,
    target: 10.0,
    unit: "%",
    trend: "up",
    category: "Innovation & Growth",
    frequency: "Monthly",
  },
  {
    id: "ig3",
    name: "Market Share Growth",
    current: 3.8,
    target: 5.0,
    unit: "%",
    trend: "up",
    category: "Innovation & Growth",
    frequency: "Quarterly",
  },
  {
    id: "ig4",
    name: "Number of Patents Filed",
    current: 7,
    target: 10,
    unit: "count",
    trend: "up",
    category: "Innovation & Growth",
    frequency: "Quarterly",
  },
  {
    id: "ig5",
    name: "Expansion into New Markets",
    current: 2,
    target: 3,
    unit: "markets",
    trend: "up",
    category: "Innovation & Growth",
    frequency: "Quarterly",
  },
  {
    id: "ig6",
    name: "Overall Business Growth Rate",
    current: 22.5,
    target: 25.0,
    unit: "%",
    trend: "up",
    category: "Innovation & Growth",
    frequency: "Monthly",
  },
];

export const scenarioPlanning: ScenarioPlanning[] = [
  {
    id: "1",
    scenario: "Best Case",
    revenue: 15200000,
    costs: 10640000,
    profit: 4560000,
    probability: 25,
    keyAssumptions: [
      "Market expansion accelerates",
      "New product launch succeeds",
    ],
  },
  {
    id: "2",
    scenario: "Base Case",
    revenue: 13700000,
    costs: 10275000,
    profit: 3425000,
    probability: 50,
    keyAssumptions: ["Steady market growth", "Current trends continue"],
  },
];

export const costStructure: CostStructure[] = [
  {
    id: "1",
    category: "Raw Materials",
    type: "COGS",
    amount: 850000,
    percentage: 32.5,
    variability: "Variable",
    trend: "up",
  },
  {
    id: "2",
    category: "Sales & Marketing",
    type: "Operating",
    amount: 480000,
    percentage: 18.3,
    variability: "Variable",
    trend: "up",
  },
];

export const cashFlowForecast: CashFlowForecast[] = [
  {
    id: "1",
    month: "Jan 2025",
    cashInflow: 2400000,
    cashOutflow: 2100000,
    netCashFlow: 300000,
    cumulativeCash: 1650000,
    workingCapital: 420000,
  },
  {
    id: "2",
    month: "Feb 2025",
    cashInflow: 2650000,
    cashOutflow: 2280000,
    netCashFlow: 370000,
    cumulativeCash: 2020000,
    workingCapital: 485000,
  },
];
