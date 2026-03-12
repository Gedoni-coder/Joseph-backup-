// ==================== Tax Compliance Interfaces ====================
// These match the Django models via snake→camelCase mapping in useTaxDataAPI

export interface TaxCalculation {
  id: number;
  entity: string;
  taxYear: number;
  income: number;
  deductions: number;
  taxableIncome: number;
  estimatedTax: number;
  effectiveRate: number;
  marginalRate: number;
  status: "draft" | "calculated" | "filed" | "amended";
  lastUpdated: string;
}

export interface TaxAvoidanceRecommendation {
  id: number;
  title: string;
  description: string;
  category: "deduction" | "credit" | "timing" | "structure" | "investment";
  potentialSavings: number;
  complexity: "low" | "medium" | "high";
  deadline?: string | null;
  requirements: string[];
  implemented: boolean;
  priority: "high" | "medium" | "low";
}

export interface ComplianceUpdate {
  id: number;
  title: string;
  description: string;
  type: "regulation" | "form" | "deadline" | "rate_change" | "guidance";
  jurisdiction: "federal" | "state" | "local";
  effectiveDate?: string | null;
  deadline?: string | null;
  impact: "high" | "medium" | "low";
  status: "new" | "reviewed" | "implemented" | "archived";
  actionRequired: boolean;
}

export interface TaxPlanningScenario {
  id: number;
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
  id: number;
  timestamp: string;
  action: string;
  entity: string;
  details: string;
  ipAddress: string | null;
  outcome: "success" | "failure" | "warning";
  category: "calculation" | "filing" | "document" | "planning" | "compliance";
}

export interface ComplianceObligation {
  id: number;
  name: string;
  description: string;
  dueDate?: string | null;
  frequency: "monthly" | "quarterly" | "annually" | "event_based";
  agency: string;
  jurisdiction: string;
  consequence: "low" | "medium" | "high" | "critical";
  consequenceDetail: string;
  status: "completed" | "pending" | "at_risk" | "overdue";
  assignedTo: string;
  dependencies: string[];
  documentationRequired: string[];
  priority: "low" | "medium" | "high" | "critical";
}

export interface ComplianceReport {
  id: number;
  title: string;
  description: string;
  period: string;
  type: "monthly" | "quarterly" | "annual" | "custom";
  status: "draft" | "pending" | "completed" | "overdue";
  dueDate?: string | null;
  completionRate: number;
  riskScore: number;
  findings: number;
  assignee: string;
}
