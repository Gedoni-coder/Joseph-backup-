// Note: FeasibilityReport is defined in BusinessFeasibility.tsx component

export type StepStatus = "pending" | "in_progress" | "completed" | "needs_update";

export interface StepContent {
  title: string;
  content: string;
  generatedAt: string;
  status: StepStatus;
}

export interface BusinessPlanStep {
  id: number;
  key: string;
  name: string;
  description: string;
  status: StepStatus;
  content: StepContent | null;
}

export interface BusinessPlan {
  id: string;
  feasibilityId: string;
  idea: string;
  businessName: string;
  createdAt: string;
  updatedAt: string;
  currentStep: number;
  steps: BusinessPlanStep[];
  fullDocument: {
    executiveSummary: string;
    companyOverview: string;
    problemStatement: string;
    valueProposition: string;
    productServiceDescription: string;
    businessModel: string;
    marketAnalysis: string;
    competitiveAnalysis: string;
    operationsPlan: string;
    financialProjections: string;
    fundingRequirements: string;
    goToMarketStrategy: string;
  };
}

export const BUSINESS_PLAN_STEPS: BusinessPlanStep[] = [
  {
    id: 1,
    key: "business-plan-generator",
    name: "Business Plan Generator",
    description: "Create a complete, investor-ready business plan tailored to your business",
    status: "pending",
    content: null,
  },
  {
    id: 2,
    key: "market-validation",
    name: "Industry & Market Validation",
    description: "Validate your business idea against real market data",
    status: "pending",
    content: null,
  },
  {
    id: 3,
    key: "business-model-canvas",
    name: "Business Model Canvas Builder",
    description: "Structure your business using proven frameworks",
    status: "pending",
    content: null,
  },
  {
    id: 4,
    key: "operational-planning",
    name: "Operational Planning Assistant",
    description: "Plan day-to-day and structural operations",
    status: "pending",
    content: null,
  },
  {
    id: 5,
    key: "financial-planning",
    name: "Financial Planning for Business Plans",
    description: "Build the financial engine for your business",
    status: "pending",
    content: null,
  },
  {
    id: 6,
    key: "gtm-strategy",
    name: "Go-To-Market Strategy Builder",
    description: "Design effective market entry strategies",
    status: "pending",
    content: null,
  },
  {
    id: 7,
    key: "compliance-guidance",
    name: "Compliance & Registration Guidance",
    description: "Guide through legal registrations and compliance",
    status: "pending",
    content: null,
  },
  {
    id: 8,
    key: "health-checker",
    name: "Business Planning Health Checker",
    description: "Evaluate your plan and identify weaknesses",
    status: "pending",
    content: null,
  },
  {
    id: 9,
    key: "investor-pitch",
    name: "Investor Pitch Preparation",
    description: "Prepare for fundraising with investor materials",
    status: "pending",
    content: null,
  },
  {
    id: 10,
    key: "continuous-updating",
    name: "Continuous Plan Updating",
    description: "Keep your plan current as your business evolves",
    status: "pending",
    content: null,
  },
];

export function createEmptyBusinessPlan(feasibilityId: string, idea: string): BusinessPlan {
  return {
    id: `plan_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    feasibilityId,
    idea,
    businessName: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    currentStep: 1,
    steps: BUSINESS_PLAN_STEPS.map((step) => ({ ...step })),
    fullDocument: {
      executiveSummary: "",
      companyOverview: "",
      problemStatement: "",
      valueProposition: "",
      productServiceDescription: "",
      businessModel: "",
      marketAnalysis: "",
      competitiveAnalysis: "",
      operationsPlan: "",
      financialProjections: "",
      fundingRequirements: "",
      goToMarketStrategy: "",
    },
  };
}
