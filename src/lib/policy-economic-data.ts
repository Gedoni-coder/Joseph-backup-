export interface ExternalPolicy {
  id: string;
  title: string;
  type: "government" | "international" | "trade" | "regulatory";
  status: "active" | "pending" | "draft" | "expired";
  effectiveDate: string;
  jurisdiction: string;
  summary: string;
  impact: "high" | "medium" | "low";
  businessAreas: string[];
  complianceDeadline?: string;
  lastUpdated: string;
}

export interface InternalPolicy {
  id: string;
  title: string;
  department: string;
  type: "compliance" | "operational" | "hr" | "financial" | "environmental";
  status: "active" | "under_review" | "draft" | "archived";
  version: string;
  approvedBy: string;
  lastReviewed: string;
  nextReview: string;
  alignmentScore: number;
  relatedExternalPolicies: string[];
  implementationStatus: "fully_implemented" | "partial" | "planning" | "not_started";
}

export interface PolicyReport {
  id: string;
  title: string;
  type: "alignment" | "compliance" | "gap_analysis" | "impact_assessment";
  generatedDate: string;
  period: string;
  summary: string;
  findings: {
    id: string;
    category: string;
    description: string;
    severity: "critical" | "high" | "medium" | "low";
    recommendation: string;
    status: "open" | "in_progress" | "resolved";
  }[];
  complianceScore: number;
  recommendations: string[];
}

export interface EconomicIndicator {
  id: string;
  name: string;
  category: "macro" | "market" | "industry" | "financial";
  value: number;
  unit: string;
  previousValue: number;
  trend: "up" | "down" | "stable";
  changePercent: number;
  lastUpdated: string;
  impact: "high" | "medium" | "low";
  forecast: {
    period: string;
    value: number;
    confidence: number;
  }[];
}

export interface InternalImpact {
  id: string;
  economicIndicator: string;
  businessArea: string;
  impactType: "revenue" | "costs" | "operations" | "strategy";
  severity: "critical" | "high" | "medium" | "low";
  description: string;
  quantifiedImpact: {
    metric: string;
    value: number;
    unit: string;
    timeframe: string;
  };
  mitigationActions: string[];
  status: "identified" | "analyzing" | "mitigating" | "monitored";
  lastAssessed: string;
}

export interface StrategyRecommendation {
  id: string;
  title: string;
  category: "policy_adaptation" | "economic_mitigation" | "opportunity_leverage" | "risk_management";
  priority: "critical" | "high" | "medium" | "low";
  description: string;
  expectedOutcome: string;
  timeline: string;
  resources: string[];
  success_metrics: string[];
  dependencies: string[];
  status: "proposed" | "approved" | "in_progress" | "implemented" | "on_hold";
  assignedTo: string;
  estimatedCost: number;
  expectedROI: number;
}

// Mock Data
export const externalPolicies: ExternalPolicy[] = [
  {
    id: "ext-pol-001",
    title: "Corporate Tax Reform Act 2024",
    type: "government",
    status: "active",
    effectiveDate: "2024-01-01",
    jurisdiction: "Federal",
    summary: "New corporate tax rates and deduction limitations affecting business operations.",
    impact: "high",
    businessAreas: ["Finance", "Accounting", "Legal"],
    complianceDeadline: "2024-03-31",
    lastUpdated: "2024-01-15"
  },
  {
    id: "ext-pol-002",
    title: "International Trade Agreement Amendment",
    type: "international",
    status: "pending",
    effectiveDate: "2024-06-01",
    jurisdiction: "International",
    summary: "Revised tariff structures for international commerce affecting supply chain costs.",
    impact: "medium",
    businessAreas: ["Supply Chain", "Procurement", "Finance"],
    complianceDeadline: "2024-05-15",
    lastUpdated: "2024-01-10"
  },
  {
    id: "ext-pol-003",
    title: "Environmental Compliance Standards",
    type: "regulatory",
    status: "active",
    effectiveDate: "2023-07-01",
    jurisdiction: "State",
    summary: "Updated environmental regulations for manufacturing operations.",
    impact: "medium",
    businessAreas: ["Operations", "Environmental", "Legal"],
    lastUpdated: "2024-01-12"
  }
];

export const internalPolicies: InternalPolicy[] = [
  {
    id: "int-pol-001",
    title: "Data Privacy and Security Policy",
    department: "IT Security",
    type: "compliance",
    status: "active",
    version: "3.2",
    approvedBy: "Chief Security Officer",
    lastReviewed: "2023-12-01",
    nextReview: "2024-06-01",
    alignmentScore: 95,
    relatedExternalPolicies: ["ext-pol-003"],
    implementationStatus: "fully_implemented"
  },
  {
    id: "int-pol-002",
    title: "Financial Reporting Standards",
    department: "Finance",
    type: "financial",
    status: "under_review",
    version: "2.1",
    approvedBy: "CFO",
    lastReviewed: "2023-11-15",
    nextReview: "2024-02-15",
    alignmentScore: 87,
    relatedExternalPolicies: ["ext-pol-001"],
    implementationStatus: "partial"
  },
  {
    id: "int-pol-003",
    title: "Supplier Code of Conduct",
    department: "Procurement",
    type: "operational",
    status: "active",
    version: "1.8",
    approvedBy: "VP Operations",
    lastReviewed: "2023-10-01",
    nextReview: "2024-04-01",
    alignmentScore: 92,
    relatedExternalPolicies: ["ext-pol-002"],
    implementationStatus: "fully_implemented"
  }
];

export const policyReports: PolicyReport[] = [
  {
    id: "rep-001",
    title: "Q4 2023 Policy Compliance Assessment",
    type: "compliance",
    generatedDate: "2024-01-05",
    period: "Q4 2023",
    summary: "Comprehensive review of policy compliance across all business units.",
    findings: [
      {
        id: "finding-001",
        category: "Tax Compliance",
        description: "New tax regulations require updated reporting procedures",
        severity: "high",
        recommendation: "Implement new reporting framework by Q1 2024",
        status: "in_progress"
      },
      {
        id: "finding-002",
        category: "Environmental",
        description: "Minor gaps in environmental reporting documentation",
        severity: "medium",
        recommendation: "Update documentation templates and training materials",
        status: "open"
      }
    ],
    complianceScore: 89,
    recommendations: [
      "Enhance automated compliance monitoring",
      "Increase training frequency for policy updates",
      "Implement quarterly compliance reviews"
    ]
  }
];

export const economicIndicators: EconomicIndicator[] = [
  {
    id: "econ-001",
    name: "Federal Interest Rate",
    category: "macro",
    value: 5.25,
    unit: "%",
    previousValue: 5.0,
    trend: "up",
    changePercent: 5.0,
    lastUpdated: "2024-01-15",
    impact: "high",
    forecast: [
      { period: "Q2 2024", value: 5.5, confidence: 85 },
      { period: "Q3 2024", value: 5.75, confidence: 70 },
      { period: "Q4 2024", value: 5.5, confidence: 60 }
    ]
  },
  {
    id: "econ-002",
    name: "USD Exchange Rate (EUR)",
    category: "financial",
    value: 1.08,
    unit: "EUR/USD",
    previousValue: 1.12,
    trend: "down",
    changePercent: -3.6,
    lastUpdated: "2024-01-15",
    impact: "medium",
    forecast: [
      { period: "Q2 2024", value: 1.06, confidence: 75 },
      { period: "Q3 2024", value: 1.05, confidence: 65 },
      { period: "Q4 2024", value: 1.07, confidence: 55 }
    ]
  },
  {
    id: "econ-003",
    name: "Industry Growth Rate",
    category: "industry",
    value: 3.2,
    unit: "%",
    previousValue: 2.8,
    trend: "up",
    changePercent: 14.3,
    lastUpdated: "2024-01-10",
    impact: "high",
    forecast: [
      { period: "Q2 2024", value: 3.5, confidence: 80 },
      { period: "Q3 2024", value: 3.8, confidence: 75 },
      { period: "Q4 2024", value: 3.6, confidence: 70 }
    ]
  }
];

export const internalImpacts: InternalImpact[] = [
  {
    id: "impact-001",
    economicIndicator: "Federal Interest Rate",
    businessArea: "Finance",
    impactType: "costs",
    severity: "high",
    description: "Rising interest rates increase borrowing costs for expansion projects",
    quantifiedImpact: {
      metric: "Additional Interest Expense",
      value: 250000,
      unit: "USD",
      timeframe: "Annual"
    },
    mitigationActions: [
      "Accelerate debt refinancing at current rates",
      "Defer non-critical capital expenditures",
      "Explore alternative financing options"
    ],
    status: "mitigating",
    lastAssessed: "2024-01-15"
  },
  {
    id: "impact-002",
    economicIndicator: "USD Exchange Rate (EUR)",
    businessArea: "International Sales",
    impactType: "revenue",
    severity: "medium",
    description: "Weakening USD improves competitiveness in European markets",
    quantifiedImpact: {
      metric: "Revenue Increase",
      value: 180000,
      unit: "USD",
      timeframe: "Quarterly"
    },
    mitigationActions: [
      "Increase marketing spend in European markets",
      "Expand European distribution network",
      "Lock in favorable exchange rates"
    ],
    status: "monitored",
    lastAssessed: "2024-01-12"
  }
];

export const strategyRecommendations: StrategyRecommendation[] = [
  {
    id: "strat-001",
    title: "Implement Dynamic Tax Planning Framework",
    category: "policy_adaptation",
    priority: "high",
    description: "Develop automated system to adapt to changing tax regulations",
    expectedOutcome: "Reduce compliance risk and optimize tax efficiency",
    timeline: "6 months",
    resources: ["Tax Advisory Team", "IT Development", "External Tax Consultant"],
    success_metrics: ["Compliance score >95%", "Tax optimization >10%", "Response time <30 days"],
    dependencies: ["Budget approval", "IT infrastructure upgrade"],
    status: "approved",
    assignedTo: "Tax Strategy Team",
    estimatedCost: 150000,
    expectedROI: 3.2
  },
  {
    id: "strat-002",
    title: "Interest Rate Hedging Strategy",
    category: "economic_mitigation",
    priority: "critical",
    description: "Implement hedging instruments to mitigate interest rate risk",
    expectedOutcome: "Stabilize financing costs and improve cash flow predictability",
    timeline: "3 months",
    resources: ["Treasury Team", "Risk Management", "External Financial Advisor"],
    success_metrics: ["Cost volatility reduction >50%", "Cash flow variance <5%"],
    dependencies: ["Board approval", "Credit facility amendments"],
    status: "in_progress",
    assignedTo: "Treasury Department",
    estimatedCost: 75000,
    expectedROI: 4.1
  },
  {
    id: "strat-003",
    title: "European Market Expansion",
    category: "opportunity_leverage",
    priority: "medium",
    description: "Capitalize on favorable exchange rates to expand European operations",
    expectedOutcome: "Increase European revenue by 25% within 12 months",
    timeline: "12 months",
    resources: ["International Sales", "Marketing", "Legal", "Operations"],
    success_metrics: ["Revenue growth >25%", "Market share increase >15%", "Customer acquisition >200"],
    dependencies: ["Regulatory approvals", "Distribution partnerships"],
    status: "proposed",
    assignedTo: "International Business Development",
    estimatedCost: 500000,
    expectedROI: 2.8
  }
];
