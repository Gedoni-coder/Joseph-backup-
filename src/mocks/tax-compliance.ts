// Tax Compliance Module (Module 8) - Mock Data
// Tags: liability types, filing status, compliance items - HARDCODED
// Data: specific amounts, jurisdictions, dates - MOVED TO MOCK

export interface TaxLiability {
  id: string;
  type: "federal" | "state" | "local" | "payroll" | "sales";
  name: string;
  amount: number;
  dueDate: string;
  status: "current" | "upcoming" | "overdue" | "paid";
  percentage: number; // percentage of total tax burden
}

export const TAX_LIABILITIES: TaxLiability[] = [
  {
    id: "fed-1",
    type: "federal",
    name: "Federal Income Tax",
    amount: 185000,
    dueDate: "2024-04-15",
    status: "upcoming",
    percentage: 42,
  },
  {
    id: "state-1",
    type: "state",
    name: "State Income Tax",
    amount: 68500,
    dueDate: "2024-04-15",
    status: "upcoming",
    percentage: 15,
  },
  {
    id: "payroll-1",
    type: "payroll",
    name: "Payroll Tax Deposit",
    amount: 125000,
    dueDate: "2024-02-15",
    status: "current",
    percentage: 28,
  },
  {
    id: "sales-1",
    type: "sales",
    name: "Sales Tax (Multi-State)",
    amount: 65000,
    dueDate: "2024-02-20",
    status: "upcoming",
    percentage: 15,
  },
];

export interface TaxFilingItem {
  id: string;
  form: string;
  name: string;
  dueDate: string;
  status: "not-started" | "in-progress" | "completed" | "submitted";
  priority: "critical" | "high" | "medium";
}

export const TAX_FILINGS: TaxFilingItem[] = [
  {
    id: "filing-1",
    form: "1040",
    name: "Individual Income Tax Return",
    dueDate: "2024-04-15",
    status: "in-progress",
    priority: "critical",
  },
  {
    id: "filing-2",
    form: "1120-S",
    name: "S-Corp Tax Return",
    dueDate: "2024-03-15",
    status: "not-started",
    priority: "critical",
  },
  {
    id: "filing-3",
    form: "941",
    name: "Quarterly Payroll Tax",
    dueDate: "2024-02-15",
    status: "completed",
    priority: "high",
  },
  {
    id: "filing-4",
    form: "941-X",
    name: "Amended Payroll Tax",
    dueDate: "2024-05-15",
    status: "not-started",
    priority: "medium",
  },
];

export interface ComplianceItem {
  id: string;
  area: "federal" | "state" | "local" | "industry" | "data-protection";
  requirement: string;
  status: "compliant" | "non-compliant" | "pending" | "na";
  nextReviewDate: string;
  notes: string;
}

export const COMPLIANCE_CHECKLIST: ComplianceItem[] = [
  {
    id: "comp-1",
    area: "federal",
    requirement: "IRS Employment Identification Number (EIN)",
    status: "compliant",
    nextReviewDate: "2024-12-31",
    notes: "Valid through all years",
  },
  {
    id: "comp-2",
    area: "state",
    requirement: "State Business License",
    status: "compliant",
    nextReviewDate: "2024-06-30",
    notes: "Renewal required by June 30",
  },
  {
    id: "comp-3",
    area: "local",
    requirement: "Local Tax Compliance (Lagos)",
    status: "compliant",
    nextReviewDate: "2024-12-31",
    notes: "All payments current",
  },
  {
    id: "comp-4",
    area: "data-protection",
    requirement: "GDPR Compliance",
    status: "compliant",
    nextReviewDate: "2025-03-15",
    notes: "Data processing agreements updated",
  },
];

export const TAX_OPTIMIZATION_TIPS = [
  "Maximize retirement plan contributions ($66,000 limit for 2024)",
  "Track all business expenses meticulously",
  "Consider timing of large purchases for deductions",
  "Review estimated quarterly tax payments",
  "Evaluate S-Corp vs LLC tax treatment",
  "Utilize qualified business income deduction (QBI)",
];

export const FOOTER_COPYRIGHT_YEAR = 2024;
export const FOOTER_DATA_SECURITY = "Data secured and encrypted";
export const FOOTER_COMPLIANCE_TEXT = "Compliance: IRS, State Tax Codes, Local Regulations";

export const CURRENCY_CONFIG = {
  locale: "en-US",
  currency: "USD",
};

export const PRINT_CONFIG = {
  includeCharts: true,
  includeDetails: true,
  colorPrint: true,
};
