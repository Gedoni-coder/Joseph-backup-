// Loan Funding Module (Module 11) - Mock Data
// Tags: funding types, loan types - HARDCODED
// Data: lender names, amounts, rates, eligibility criteria - MOVED TO MOCK

export interface LoanProduct {
  id: string;
  name: string;
  type: "term-loan" | "line-of-credit" | "invoice-financing" | "equipment-financing" | "equipment";
  lender: string;
  minAmount: number;
  maxAmount: number;
  interestRate: number;
  termMonths: number;
  eligibilityScore: number; // minimum required score
  processingTime: string;
  features: string[];
}

export const LOAN_PRODUCTS: LoanProduct[] = [
  {
    id: "loan-1",
    name: "Growth Capital Loan",
    type: "term-loan",
    lender: "Access Bank",
    minAmount: 50000,
    maxAmount: 5000000,
    interestRate: 14.5,
    termMonths: 60,
    eligibilityScore: 65,
    processingTime: "7-14 days",
    features: [
      "Flexible repayment terms",
      "No collateral required up to $500K",
      "Quick approval process",
    ],
  },
  {
    id: "loan-2",
    name: "Working Capital Line",
    type: "line-of-credit",
    lender: "Zenith Bank",
    minAmount: 100000,
    maxAmount: 10000000,
    interestRate: 16.0,
    termMonths: 36,
    eligibilityScore: 70,
    processingTime: "10-21 days",
    features: [
      "Draw funds as needed",
      "Interest on used portion only",
      "Renewable after first year",
    ],
  },
  {
    id: "loan-3",
    name: "Equipment Financing",
    type: "equipment-financing",
    lender: "Guaranty Trust Bank",
    minAmount: 200000,
    maxAmount: 50000000,
    interestRate: 12.5,
    termMonths: 84,
    eligibilityScore: 60,
    processingTime: "14-21 days",
    features: [
      "Equipment as collateral",
      "Longer repayment terms",
      "100% financing available",
    ],
  },
  {
    id: "loan-4",
    name: "Invoice Financing",
    type: "invoice-financing",
    lender: "FirstBank",
    minAmount: 10000,
    maxAmount: 1000000,
    interestRate: 18.0,
    termMonths: 12,
    eligibilityScore: 55,
    processingTime: "2-5 days",
    features: [
      "Immediate cash against invoices",
      "Fast approval",
      "No collateral needed",
    ],
  },
];

export interface InvestorProfile {
  id: string;
  name: string;
  type: "angel" | "venture-capital" | "private-equity" | "impact-investor";
  minimumInvestment: number;
  maximumInvestment: number;
  focusAreas: string[];
  successRate: number; // percentage of funded deals
  avgTimeToFunding: string;
  portfolio?: number; // number of companies
}

export const INVESTOR_PROFILES: InvestorProfile[] = [
  {
    id: "investor-1",
    name: "West Africa Tech Fund",
    type: "venture-capital",
    minimumInvestment: 200000,
    maximumInvestment: 5000000,
    focusAreas: ["E-commerce", "FinTech", "AgriTech"],
    successRate: 68,
    avgTimeToFunding: "4-6 months",
    portfolio: 45,
  },
  {
    id: "investor-2",
    name: "Nigeria Enterprise Fund",
    type: "venture-capital",
    minimumInvestment: 100000,
    maximumInvestment: 2000000,
    focusAreas: ["E-commerce", "SaaS", "Logistics"],
    successRate: 72,
    avgTimeToFunding: "3-5 months",
    portfolio: 28,
  },
  {
    id: "investor-3",
    name: "African Angel Syndicate",
    type: "angel",
    minimumInvestment: 25000,
    maximumInvestment: 500000,
    focusAreas: ["All sectors"],
    successRate: 45,
    avgTimeToFunding: "2-3 months",
    portfolio: 15,
  },
  {
    id: "investor-4",
    name: "Impact Africa Ventures",
    type: "impact-investor",
    minimumInvestment: 150000,
    maximumInvestment: 3000000,
    focusAreas: ["Social enterprises", "Sustainable businesses"],
    successRate: 58,
    avgTimeToFunding: "5-7 months",
    portfolio: 22,
  },
];

export interface GrantProgram {
  id: string;
  name: string;
  provider: string;
  amount: number;
  deadline: string;
  eligibility: string[];
  competitiveness: "high" | "medium" | "low";
}

export const GRANT_PROGRAMS: GrantProgram[] = [
  {
    id: "grant-1",
    name: "FIRS SME Support",
    provider: "Federal Government",
    amount: 500000,
    deadline: "2024-06-30",
    eligibility: ["Nigerian SMEs", "Registered business", "2+ years operation"],
    competitiveness: "high",
  },
  {
    id: "grant-2",
    name: "Tech Hub Development",
    provider: "Tech Innovation Foundation",
    amount: 1000000,
    deadline: "2024-09-30",
    eligibility: ["Tech startups", "Innovation-focused"],
    competitiveness: "high",
  },
];

export const FUNDING_METRICS = {
  eligibilityScore: 72,
  fundingPotential: "High",
  recommendedApproach: "Hybrid approach - combination of loans and equity",
  estimatedTimeToFunding: "3-6 months",
};

export const CURRENCY_FORMATTING = {
  millions: 1000000,
  millions_suffix: "M",
  thousands: 1000,
  thousands_suffix: "K",
};

export const LOCALE_CONFIG = {
  locale: "en-US",
  currency: "USD",
};

export const COMPANY_EXPANSION_CONTEXT = "expansion opportunities in emerging markets";
