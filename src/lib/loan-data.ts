export interface LoanEligibility {
  id: string;
  businessName: string;
  businessStage: "startup" | "early" | "growth" | "mature";
  creditScore: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
  collateralValue: number;
  industry: string;
  timeInBusiness: number; // months
  eligibilityScore: number;
  qualifiedPrograms: string[];
  recommendations: string[];
}

export interface FundingOption {
  id: string;
  name: string;
  type:
    | "bank-loan"
    | "government-grant"
    | "microfinance"
    | "angel-capital"
    | "venture-capital"
    | "crowdfunding"
    | "cooperative";
  provider: string;
  minAmount: number;
  maxAmount: number;
  interestRate: number;
  termMonths: number;
  eligibilityCriteria: string[];
  applicationDeadline?: Date;
  processingTime: number; // days
  collateralRequired: boolean;
  personalGuarantee: boolean;
  description: string;
  website: string;
  tags: string[];
}

export interface LoanComparison {
  id: string;
  loanName: string;
  provider: string;
  amount: number;
  interestRate: number;
  termMonths: number;
  monthlyPayment: number;
  totalInterest: number;
  fees: LoanFee[];
  conditions: string[];
  processingTime: number;
  approvalOdds: number;
  pros: string[];
  cons: string[];
  website?: string;
}

export interface LoanFee {
  type: string;
  amount: number;
  description: string;
}

export interface ApplicationDocument {
  id: string;
  name: string;
  type: "required" | "optional" | "conditional";
  description: string;
  template?: string;
  status: "pending" | "uploaded" | "verified" | "rejected";
  lastUpdated?: Date;
}

export interface BusinessPlan {
  id: string;
  sections: BusinessPlanSection[];
  completionPercentage: number;
  lastUpdated: Date;
  generatedContent: boolean;
}

export interface BusinessPlanSection {
  id: string;
  title: string;
  content: string;
  completed: boolean;
  wordCount: number;
  recommendations: string[];
}

export interface FundingStrategy {
  id: string;
  businessStage: string;
  recommendedType: "equity" | "debt" | "hybrid";
  reasoning: string;
  timeline: FundingTimeline[];
  impactAnalysis: {
    equity: EquityImpact;
    debt: DebtImpact;
  };
  readinessScore: number;
  recommendations: string[];
}

export interface FundingTimeline {
  phase: string;
  timeframe: string;
  amount: number;
  type: string;
  milestones: string[];
}

export interface EquityImpact {
  dilution: number;
  ownershipRetained: number;
  controlImpact: string;
  futureRounds: string[];
}

export interface DebtImpact {
  monthlyPayment: number;
  totalCost: number;
  cashFlowImpact: number;
  collateralRisk: string;
}

export interface InvestorMatch {
  id: string;
  name: string;
  type: "angel" | "vc" | "bank" | "government" | "alternative";
  focusIndustries: string[];
  investmentRange: {
    min: number;
    max: number;
  };
  stage: string[];
  location: string;
  matchScore: number;
  trustScore: number;
  portfolio: string[];
  recentInvestments: RecentInvestment[];
  contactInfo: ContactInfo;
  preferences: InvestorPreferences;
}

export interface RecentInvestment {
  company: string;
  amount: number;
  date: Date;
  industry: string;
}

export interface ContactInfo {
  email?: string;
  phone?: string;
  website: string;
  applicationProcess: string;
}

export interface InvestorPreferences {
  businessModel: string[];
  growthStage: string[];
  revenueRequirement: number;
  geographicFocus: string[];
  timeToDecision: number; // days
}

export interface LoanUpdate {
  id: string;
  type: "new-program" | "rate-change" | "deadline" | "policy-update";
  title: string;
  description: string;
  impact: "positive" | "negative" | "neutral";
  urgency: "high" | "medium" | "low";
  source: string;
  publishDate: Date;
  expiryDate?: Date;
  affectedPrograms: string[];
  actionRequired?: string;
}

export interface Watchlist {
  id: string;
  userId: string;
  programs: string[];
  alertPreferences: {
    newPrograms: boolean;
    rateChanges: boolean;
    deadlines: boolean;
    policyUpdates: boolean;
  };
  lastNotified: Date;
}

// Mock data
export const loanEligibility: LoanEligibility = {
  id: "1",
  businessName: "TechStartup Inc",
  businessStage: "growth",
  creditScore: 745,
  monthlyRevenue: 125000,
  yearlyRevenue: 1500000,
  collateralValue: 450000,
  industry: "Technology",
  timeInBusiness: 28,
  eligibilityScore: 87,
  qualifiedPrograms: [
    "SBA 7(a) Loan",
    "Business Line of Credit",
    "Equipment Financing",
    "Revenue-Based Financing",
  ],
  recommendations: [
    "Consider SBA 7(a) for expansion capital with favorable terms",
    "Line of credit for working capital flexibility",
    "Equipment financing for technology upgrades at lower rates",
  ],
};

export const fundingOptions: FundingOption[] = [
  {
    id: "1",
    name: "SBA 7(a) General Business Loan",
    type: "government-grant",
    provider: "U.S. Small Business Administration",
    minAmount: 25000,
    maxAmount: 5000000,
    interestRate: 6.5,
    termMonths: 120,
    eligibilityCriteria: [
      "Small business as defined by SBA",
      "For-profit business",
      "Meet SBA size standards",
      "Good credit history",
    ],
    processingTime: 45,
    collateralRequired: true,
    personalGuarantee: true,
    description:
      "Flexible loan program for general business purposes including working capital, equipment, and real estate.",
    website: "https://www.sba.gov/funding-programs/loans/7a-loans",
    tags: ["Government", "Low Interest", "Flexible Terms"],
  },
  {
    id: "2",
    name: "Business Line of Credit",
    type: "bank-loan",
    provider: "First National Bank",
    minAmount: 10000,
    maxAmount: 1000000,
    interestRate: 8.25,
    termMonths: 12,
    eligibilityCriteria: [
      "Minimum $100K annual revenue",
      "2+ years in business",
      "Credit score 650+",
      "Positive cash flow",
    ],
    processingTime: 14,
    collateralRequired: false,
    personalGuarantee: true,
    description:
      "Revolving credit facility for short-term working capital needs with flexible draw and repayment options.",
    website:
      "https://www.fnb-online.com/business/loans-leasing/lending/short-term-financing/working-capital-lines-credit",
    tags: ["Flexible", "Quick Approval", "Working Capital"],
  },
  {
    id: "3",
    name: "Microfinance Business Loan",
    type: "microfinance",
    provider: "Community Development Financial Institution",
    minAmount: 500,
    maxAmount: 50000,
    interestRate: 12.5,
    termMonths: 60,
    eligibilityCriteria: [
      "Underserved communities",
      "Limited credit history acceptable",
      "Business plan required",
      "Mentorship participation",
    ],
    processingTime: 21,
    collateralRequired: false,
    personalGuarantee: false,
    description:
      "Small loans for entrepreneurs with limited access to traditional banking, includes business support services.",
    website: "https://www.cdfifund.gov/",
    tags: ["Accessible", "Support Services", "Community Focused"],
  },
  {
    id: "4",
    name: "Angel Investment Network",
    type: "angel-capital",
    provider: "Tech Angels Group",
    minAmount: 25000,
    maxAmount: 500000,
    interestRate: 0, // Equity investment
    termMonths: 0,
    eligibilityCriteria: [
      "Technology sector focus",
      "Scalable business model",
      "Strong management team",
      "Clear exit strategy",
    ],
    processingTime: 90,
    collateralRequired: false,
    personalGuarantee: false,
    description:
      "Early-stage equity investment from accredited angel investors with industry expertise and mentorship.",
    website: "https://tcaventuregroup.com/",
    tags: ["Equity", "Mentorship", "Technology", "No Repayment"],
  },
];

export const loanComparisons: LoanComparison[] = [
  {
    id: "1",
    loanName: "SBA 7(a) Loan",
    provider: "First Community Bank",
    amount: 250000,
    interestRate: 6.5,
    termMonths: 120,
    monthlyPayment: 2840,
    totalInterest: 90800,
    fees: [
      { type: "Origination", amount: 7500, description: "3% of loan amount" },
      {
        type: "Processing",
        amount: 500,
        description: "Application processing fee",
      },
    ],
    conditions: [
      "Personal guarantee required",
      "Collateral may be required for loans over $350K",
      "Business must meet SBA size standards",
      "Funds cannot be used for speculation or investment",
    ],
    processingTime: 45,
    approvalOdds: 78,
    pros: [
      "Low interest rate",
      "Long repayment term",
      "Government backing reduces lender risk",
    ],
    cons: [
      "Lengthy application process",
      "Strict qualification requirements",
      "Personal guarantee required",
    ],
    website: "https://www.sba.gov/funding-programs/loans/7a-loans",
  },
  {
    id: "2",
    loanName: "Traditional Business Loan",
    provider: "Regional Bank",
    amount: 250000,
    interestRate: 9.25,
    termMonths: 84,
    monthlyPayment: 3580,
    totalInterest: 116720,
    fees: [
      { type: "Origination", amount: 5000, description: "2% of loan amount" },
      {
        type: "Application",
        amount: 750,
        description: "Non-refundable application fee",
      },
    ],
    conditions: [
      "Minimum 2 years in business",
      "Personal and business credit review",
      "Debt service coverage ratio of 1.25x",
      "Annual financial statements required",
    ],
    processingTime: 30,
    approvalOdds: 65,
    pros: [
      "Faster processing than SBA",
      "Established banking relationship",
      "Flexible use of funds",
    ],
    cons: [
      "Higher interest rate",
      "Shorter repayment term",
      "Stricter cash flow requirements",
    ],
    website:
      "https://www.fnb-online.com/business/loans-leasing/lending/short-term-financing/working-capital-lines-credit",
  },
];

export const applicationDocuments: ApplicationDocument[] = [
  {
    id: "1",
    name: "Business Plan",
    type: "required",
    description:
      "Comprehensive business plan including market analysis, financial projections, and strategy",
    template: "SBA Business Plan Template",
    status: "pending",
  },
  {
    id: "2",
    name: "Financial Statements",
    type: "required",
    description:
      "Last 3 years of business financial statements (P&L, Balance Sheet, Cash Flow)",
    status: "pending",
  },
  {
    id: "3",
    name: "Tax Returns",
    type: "required",
    description: "Personal and business tax returns for the last 3 years",
    status: "pending",
  },
  {
    id: "4",
    name: "Bank Statements",
    type: "required",
    description: "Business bank statements for the last 12 months",
    status: "pending",
  },
  {
    id: "5",
    name: "Credit Report Authorization",
    type: "required",
    description:
      "Signed authorization for lender to pull personal and business credit reports",
    status: "pending",
  },
];

export const businessPlan: BusinessPlan = {
  id: "1",
  sections: [
    {
      id: "1",
      title: "Executive Summary",
      content:
        "TechStartup Inc is a growing technology company specializing in cloud-based analytics solutions...",
      completed: true,
      wordCount: 450,
      recommendations: [
        "Highlight unique value proposition",
        "Include key financial highlights",
      ],
    },
    {
      id: "2",
      title: "Market Analysis",
      content:
        "The cloud analytics market is projected to grow at 15.2% CAGR...",
      completed: true,
      wordCount: 680,
      recommendations: [
        "Add competitive landscape analysis",
        "Include addressable market size",
      ],
    },
    {
      id: "3",
      title: "Financial Projections",
      content: "",
      completed: false,
      wordCount: 0,
      recommendations: [
        "Include 5-year revenue projections",
        "Add break-even analysis",
      ],
    },
  ],
  completionPercentage: 67,
  lastUpdated: new Date("2024-12-10T14:30:00"),
  generatedContent: true,
};

export const fundingStrategy: FundingStrategy = {
  id: "1",
  businessStage: "Growth Stage",
  recommendedType: "hybrid",
  reasoning:
    "Based on your growth stage and capital needs, a combination of debt and equity financing would optimize cost of capital while maintaining control.",
  timeline: [
    {
      phase: "Immediate (0-6 months)",
      timeframe: "Q1 2025",
      amount: 250000,
      type: "SBA Loan",
      milestones: [
        "Product development completion",
        "Team expansion",
        "Market entry",
      ],
    },
    {
      phase: "Growth (6-18 months)",
      timeframe: "Q2-Q4 2025",
      amount: 750000,
      type: "Series A",
      milestones: [
        "Revenue growth",
        "Market validation",
        "Operational scaling",
      ],
    },
  ],
  impactAnalysis: {
    equity: {
      dilution: 25,
      ownershipRetained: 75,
      controlImpact: "Maintain majority control with board seat to investor",
      futureRounds: [
        "Series B potential in 18-24 months",
        "Exit opportunities in 5-7 years",
      ],
    },
    debt: {
      monthlyPayment: 2840,
      totalCost: 340800,
      cashFlowImpact: -15,
      collateralRisk: "Business assets at risk, personal guarantee required",
    },
  },
  readinessScore: 82,
  recommendations: [
    "Strengthen financial projections before Series A",
    "Build strategic advisory board",
    "Improve operational metrics for investor presentation",
  ],
};

export const investorMatches: InvestorMatch[] = [
  {
    id: "1",
    name: "TechVentures Capital",
    type: "vc",
    focusIndustries: ["Technology", "SaaS", "AI/ML"],
    investmentRange: { min: 500000, max: 5000000 },
    stage: ["Seed", "Series A", "Series B"],
    location: "San Francisco, CA",
    matchScore: 94,
    trustScore: 89,
    portfolio: [
      "CloudTech Solutions",
      "DataDriven Analytics",
      "AI Innovations",
    ],
    recentInvestments: [
      {
        company: "CloudFlow Inc",
        amount: 2000000,
        date: new Date("2024-11-15"),
        industry: "Cloud Infrastructure",
      },
      {
        company: "Analytics Pro",
        amount: 1500000,
        date: new Date("2024-10-08"),
        industry: "Business Intelligence",
      },
    ],
    contactInfo: {
      email: "investments@techventures.com",
      website: "https://techventures.com",
      applicationProcess:
        "Online application with pitch deck and executive summary",
    },
    preferences: {
      businessModel: ["B2B SaaS", "Subscription", "Marketplace"],
      growthStage: ["Early Growth", "Scaling"],
      revenueRequirement: 1000000,
      geographicFocus: ["North America", "Europe"],
      timeToDecision: 45,
    },
  },
];

export const loanUpdates: LoanUpdate[] = [
  {
    id: "1",
    type: "rate-change",
    title: "SBA Prime Rate Decreased to 6.5%",
    description:
      "The SBA has announced a 0.25% reduction in prime lending rates, effective immediately for new loan applications.",
    impact: "positive",
    urgency: "medium",
    source: "U.S. Small Business Administration",
    publishDate: new Date("2024-12-12T09:00:00"),
    affectedPrograms: ["SBA 7(a)", "SBA 504", "SBA Microloans"],
    actionRequired: "Consider applying for SBA loans while rates are favorable",
  },
  {
    id: "2",
    type: "new-program",
    title: "New State Technology Grant Program Launched",
    description:
      "$50M grant program for technology companies in early growth stage, offering up to $100K per business.",
    impact: "positive",
    urgency: "high",
    source: "State Economic Development",
    publishDate: new Date("2024-12-11T10:30:00"),
    expiryDate: new Date("2025-03-15T23:59:59"),
    affectedPrograms: ["State Tech Grant 2025"],
    actionRequired:
      "Applications due March 15, 2025 - prepare application materials",
  },
];
