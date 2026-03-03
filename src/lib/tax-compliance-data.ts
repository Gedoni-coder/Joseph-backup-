export interface TaxCalculation {
  id: string;
  entity: string;
  taxYear: number;
  income: number;
  deductions: number;
  taxableIncome: number;
  estimatedTax: number;
  effectiveRate: number;
  marginalRate: number;
  status: "draft" | "calculated" | "filed" | "amended";
  lastUpdated: Date;
}

export interface TaxAvoidanceRecommendation {
  id: string;
  title: string;
  description: string;
  category: "deduction" | "credit" | "timing" | "structure" | "investment";
  potentialSavings: number;
  complexity: "low" | "medium" | "high";
  deadline?: Date;
  requirements: string[];
  implemented: boolean;
  priority: "high" | "medium" | "low";
}

export interface ComplianceUpdate {
  id: string;
  title: string;
  description: string;
  type: "regulation" | "form" | "deadline" | "rate_change" | "guidance";
  jurisdiction: "federal" | "state" | "local";
  effectiveDate: Date;
  deadline?: Date;
  impact: "high" | "medium" | "low";
  status: "new" | "reviewed" | "implemented" | "archived";
  actionRequired: boolean;
}

export interface TaxPlanningScenario {
  id: string;
  name: string;
  description: string;
  currentTax: number;
  projectedTax: number;
  savings: number;
  timeframe: string;
  riskLevel: "low" | "medium" | "high";
  steps: string[];
  confidence: number;
}

export interface AuditEvent {
  id: string;
  timestamp: Date;
  user: string;
  action: string;
  entity: string;
  details: string;
  ipAddress: string;
  outcome: "success" | "failure" | "warning";
  category: "calculation" | "filing" | "document" | "planning" | "compliance";
}

export interface ComplianceDocument {
  id: string;
  name: string;
  type:
    | "tax_return"
    | "schedule"
    | "supporting_doc"
    | "correspondence"
    | "audit_trail";
  entity: string;
  taxYear: number;
  uploadDate: Date;
  size: number;
  status: "pending" | "processed" | "approved" | "rejected";
  tags: string[];
  retention: Date;
}

export interface ComplianceReport {
  id: string;
  title: string;
  period: string;
  type: "quarterly" | "annual" | "monthly" | "custom";
  status: "draft" | "pending" | "completed" | "overdue";
  dueDate: Date;
  completionRate: number;
  riskScore: number;
  findings: number;
  assignee: string;
}

// Mock Data
export const taxCalculations: TaxCalculation[] = [
  {
    id: "1",
    entity: "ABC Corporation",
    taxYear: 2024,
    income: 5200000,
    deductions: 1150000,
    taxableIncome: 4050000,
    estimatedTax: 850500,
    effectiveRate: 21.0,
    marginalRate: 21.0,
    status: "calculated",
    lastUpdated: new Date("2024-12-15T10:30:00"),
  },
];

export const taxRecommendations: TaxAvoidanceRecommendation[] = [
  {
    id: "1",
    title: "Maximize 401(k) Contributions",
    description:
      "Increase pre-tax retirement contributions to reduce current tax liability.",
    category: "deduction",
    potentialSavings: 8500,
    complexity: "low",
    deadline: new Date("2024-12-31"),
    requirements: ["Eligible retirement plan", "Sufficient earned income"],
    implemented: false,
    priority: "high",
  },
];

export const complianceUpdates: ComplianceUpdate[] = [
  {
    id: "1",
    title: "Corporate Tax Rate Update for 2025",
    description: "The corporate tax rate remains at 21% for tax year 2025.",
    type: "rate_change",
    jurisdiction: "federal",
    effectiveDate: new Date("2025-01-01"),
    impact: "medium",
    status: "new",
    actionRequired: false,
  },
];

export const planningScenarios: TaxPlanningScenario[] = [
  {
    id: "1",
    name: "Retirement Contribution Optimization",
    description:
      "Maximize tax-deferred retirement savings across all available plans",
    currentTax: 245000,
    projectedTax: 221500,
    savings: 23500,
    timeframe: "2024 Tax Year",
    riskLevel: "low",
    steps: ["Maximize 401(k) contribution to $23,000"],
    confidence: 95,
  },
];

export const auditTrail: AuditEvent[] = [
  {
    id: "1",
    timestamp: new Date("2024-12-15T10:30:15"),
    user: "john.smith@company.com",
    action: "Tax Calculation Updated",
    entity: "ABC Corporation",
    details: "Modified deductions from $1,100,000 to $1,150,000",
    ipAddress: "192.168.1.100",
    outcome: "success",
    category: "calculation",
  },
];

export const complianceDocuments: ComplianceDocument[] = [
  {
    id: "1",
    name: "Form 1120 - ABC Corporation 2024",
    type: "tax_return",
    entity: "ABC Corporation",
    taxYear: 2024,
    uploadDate: new Date("2024-12-15T10:30:00"),
    size: 2048576,
    status: "processed",
    tags: ["corporate", "annual", "federal"],
    retention: new Date("2031-12-31"),
  },
];

export const complianceReports: ComplianceReport[] = [
  {
    id: "1",
    title: "Q4 2024 Compliance Review",
    period: "Q4 2024",
    type: "quarterly",
    status: "completed",
    dueDate: new Date("2025-01-15"),
    completionRate: 95,
    riskScore: 15,
    findings: 2,
    assignee: "Sarah Johnson",
  },
];
