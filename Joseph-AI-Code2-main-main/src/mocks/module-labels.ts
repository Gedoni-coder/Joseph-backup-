// Module UI Labels and Content - Shared across multiple modules
// Tags: module types, tab names, section titles - HARDCODED PATTERNS
// Data: actual label text and descriptions - MOVED TO MOCK

export interface ModuleLabel {
  moduleName: string;
  header: string;
  descriptionTemplate: string; // Will be interpolated with companyName
  tabLabels: string[];
  cardLabels: string[];
}

export const MODULE_LABELS: Record<string, ModuleLabel> = {
  economicIndicators: {
    moduleName: "Economic Indicators",
    header: "Economic Indicators",
    descriptionTemplate:
      "Real-time economic data and forecasts for {companyName}",
    tabLabels: ["Overview", "Summary & Rec"],
    cardLabels: ["Market Alerts & Notifications", "Economic Analysis Summary"],
  },
  businessForecast: {
    moduleName: "Business Forecast",
    header: "Business Forecasting",
    descriptionTemplate:
      "Comprehensive business forecasting and scenario planning for {companyName}",
    tabLabels: [
      "Overview",
      "Summary & Rec",
      "Tables",
      "Revenue",
      "Costs",
      "Planning",
      "Analytics",
      "Documents",
    ],
    cardLabels: [
      "Annual Revenue Target",
      "Customer Segments",
      "KPIs Tracked",
      "Scenarios Modeled",
    ],
  },
  impactCalculator: {
    moduleName: "Impact Calculator",
    header: "Impact Calculator",
    descriptionTemplate:
      "Policy and economic impact analysis and simulation for {companyName}",
    tabLabels: ["Impact Analysis", "Results", "Recommendations"],
    cardLabels: ["Impact Type", "Calculation Results"],
  },
  pricingStrategy: {
    moduleName: "Pricing Strategy",
    header: "Pricing Strategy",
    descriptionTemplate:
      "Dynamic pricing optimization and competitive analysis for {companyName}",
    tabLabels: [
      "Overview",
      "Summary & Rec",
      "Strategies",
      "Competitive",
      "Testing",
      "Dynamic",
      "JOSEPH",
    ],
    cardLabels: ["Active Pricing Strategies", "Running Price Tests"],
  },
  revenueStrategy: {
    moduleName: "Revenue Strategy",
    header: "Revenue Strategy & Analysis",
    descriptionTemplate:
      "Revenue optimization and stream analysis for {companyName}",
    tabLabels: [
      "Overview",
      "Summary & Rec",
      "Streams",
      "Segments",
      "Churn",
      "Upsell",
      "Channels",
      "JOSEPH",
    ],
    cardLabels: [
      "Top Revenue Streams",
      "Churn Risk Summary",
      "Top Upsell Opportunities",
      "Channel Performance",
    ],
  },
  financialAdvisory: {
    moduleName: "Financial Advisory & Planning",
    header: "Financial Advisory & Planning",
    descriptionTemplate:
      "Financial planning and advisory services for {companyName}",
    tabLabels: [
      "Overview",
      "Summary & Rec",
      "Planning",
      "Forecasts",
      "Analysis",
      "Optimization",
      "Reports",
      "JOSEPH",
    ],
    cardLabels: ["Financial Overview", "Planning Recommendations"],
  },
  marketCompetitiveAnalysis: {
    moduleName: "Market & Competitive Analysis",
    header: "Market Analysis",
    descriptionTemplate:
      "{companyName} competitive intelligence, e-commerce market trends, and strategic positioning analysis for informed business decisions",
    tabLabels: [
      "Overview",
      "Summary & Rec",
      "Market Analysis",
      "Competitive Analysis",
      "Strategy & Advantages",
      "Report Notes",
      "JOSEPH",
    ],
    cardLabels: [
      "Total TAM",
      "Customer Segments",
      "Competitors",
      "Market Growth",
    ],
  },
  taxCompliance: {
    moduleName: "Tax & Compliance",
    header: "Tax & Compliance Module",
    descriptionTemplate:
      "Comprehensive tax planning and compliance monitoring for {companyName}",
    tabLabels: [
      "Overview",
      "Summary & Rec",
      "Liabilities",
      "Planning",
      "Filings",
      "Compliance",
    ],
    cardLabels: [
      "Tax Liabilities",
      "Compliance Status",
      "Planning Opportunities",
    ],
  },
  businessFeasibility: {
    moduleName: "Business Feasibility",
    header: "Business Plan and Feasibility Analysis",
    descriptionTemplate:
      "Analyze and validate business ideas for {companyName}",
    tabLabels: ["Ideas", "Analysis", "Recommendations"],
    cardLabels: ["Feasibility Score", "Analysis Details"],
  },
  businessPlanning: {
    moduleName: "Business Planning",
    header: "Business Planning",
    descriptionTemplate:
      "Create comprehensive, investor-ready business plans for {companyName}",
    tabLabels: ["Plans", "Templates", "Examples"],
    cardLabels: ["My Business Plans", "Plan Details"],
  },
  loanFunding: {
    moduleName: "Loan Funding",
    header: "Funding and Loan Hub",
    descriptionTemplate:
      "Funding and loan options to support {companyName} expansion",
    tabLabels: [
      "Overview",
      "Summary & Rec",
      "Loans",
      "Investors",
      "Grants",
      "Partners",
      "JOSEPH",
    ],
    cardLabels: [
      "Eligibility Score",
      "Funding Options",
      "Investor Matches",
      "New Updates",
    ],
  },
  inventorySupplyChain: {
    moduleName: "Inventory & Supply Chain",
    header: "Inventory & Supply Chain Management",
    descriptionTemplate:
      "Inventory optimization and supply chain management for {companyName}",
    tabLabels: [
      "Overview",
      "Summary & Rec",
      "Inventory",
      "Suppliers",
      "Logistics",
      "Orders",
      "Forecasting",
      "Optimization",
      "Analytics",
      "JOSEPH",
    ],
    cardLabels: [
      "Inventory Value",
      "Stock Alerts",
      "Supplier Performance",
      "Risk Alerts",
    ],
  },
};

export const COMMON_ERROR_MESSAGES = {
  connectionError: "Connection Error",
  unableToLoad: "Unable to load data. Please check your connection and try again.",
  retryConnection: "Retry Connection",
};

export const COMMON_LOADING_MESSAGES = {
  updating: "Updating...",
  calculating: "Calculating...",
  analyzing: "Analyzing...",
  fetching: "Fetching latest data...",
};
