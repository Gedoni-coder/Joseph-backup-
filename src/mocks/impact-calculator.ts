// Impact Calculator Module (Module 3) - Mock Data
// Tags: calculator types, scenario templates - HARDCODED
// Data: input field labels, default values, scenario descriptions - MOVED TO MOCK

export interface InputField {
  id: string;
  label: string;
  placeholder: string;
  unit?: string;
  type: "number" | "text" | "select";
}

export const POLICY_IMPACT_FIELDS: InputField[] = [
  {
    id: "policyName",
    label: "Policy Name",
    placeholder: "e.g., Carbon Tax",
    type: "text",
  },
  {
    id: "taxRate",
    label: "Tax Rate (%)",
    placeholder: "Enter tax rate",
    unit: "%",
    type: "number",
  },
  {
    id: "targetSector",
    label: "Target Sector",
    placeholder: "e.g., Manufacturing",
    type: "text",
  },
  {
    id: "affectedPopulation",
    label: "Affected Population",
    placeholder: "Number or percentage",
    type: "number",
  },
  {
    id: "implementationDate",
    label: "Implementation Date",
    placeholder: "YYYY-MM-DD",
    type: "text",
  },
  {
    id: "expectedImpact",
    label: "Expected Impact",
    placeholder: "Describe expected outcomes",
    type: "text",
  },
];

export const ECONOMIC_IMPACT_FIELDS: InputField[] = [
  {
    id: "scenario",
    label: "Economic Scenario",
    placeholder: "e.g., Recession",
    type: "text",
  },
  {
    id: "gdpChange",
    label: "GDP Change (%)",
    placeholder: "Enter GDP percentage change",
    unit: "%",
    type: "number",
  },
  {
    id: "inflationRate",
    label: "Inflation Rate (%)",
    placeholder: "Enter inflation rate",
    unit: "%",
    type: "number",
  },
  {
    id: "unemploymentChange",
    label: "Unemployment Change (%)",
    placeholder: "Enter change",
    unit: "%",
    type: "number",
  },
  {
    id: "interestRate",
    label: "Interest Rate (%)",
    placeholder: "Enter interest rate",
    unit: "%",
    type: "number",
  },
  {
    id: "marketReaction",
    label: "Market Reaction",
    placeholder: "Expected market changes",
    type: "text",
  },
];

export interface ScenarioTemplate {
  id: string;
  name: string;
  type: "policy" | "economic";
  description: string;
  icon: string;
}

export const SCENARIO_TEMPLATES: ScenarioTemplate[] = [
  {
    id: "carbon-tax",
    name: "Carbon Tax Implementation",
    type: "policy",
    description: "Analyze impact of new carbon taxation on industries",
    icon: "Leaf",
  },
  {
    id: "minimum-wage",
    name: "Minimum Wage Increase",
    type: "policy",
    description: "Calculate effects on employment and business costs",
    icon: "Users",
  },
  {
    id: "recession",
    name: "Economic Recession",
    type: "economic",
    description: "Model business impact during economic downturn",
    icon: "TrendingDown",
  },
  {
    id: "inflation-spike",
    name: "Inflation Spike",
    type: "economic",
    description: "Analyze effects of sudden inflation increase",
    icon: "DollarSign",
  },
];

export const CALCULATION_CONFIG = {
  simulatedDelayMs: 2500,
  algorithmConstants: {
    factor100: 100,
    monthsDivider: 12,
    impactMultiplier: 0.4,
  },
};

export const CALCULATION_MESSAGES = {
  calculating: "Calculating Policy/Economic Impact...",
  analyzing: "Analyzing scenarios...",
  optimizing: "Optimizing recommendations...",
  complete: "Impact calculation complete",
};

// ============ POLICY & ECONOMIC INPUTS ============

export interface PolicyInputs {
  complianceCost: number;
  implementationTime: number;
  affectedEmployees: number;
  trainingCost: number;
  systemUpgrades: number;
  consultingFees: number;
  ongoingMaintenance: number;
  riskReduction: number;
  regulatoryFines: number;
  reputationalImpact: "Low" | "Medium" | "High";
}

export interface EconomicInputs {
  gdpChange: number;
  inflationRate: number;
  interestRates: number;
  unemploymentRate: number;
  marketVolatility: number;
  consumerConfidence: number;
  businessInvestment: number;
  tradeBalance: number;
  currencyStrength: number;
  sectorImpact:
    | "Technology"
    | "Financial Services"
    | "Healthcare"
    | "Manufacturing"
    | "Retail"
    | "All Sectors";
}

export interface Scenario<T> {
  name: string;
  description: string;
  inputs: T;
}

/**
 * Default policy impact inputs
 * Used as initial state and for reset button
 */
export const DEFAULT_POLICY_INPUTS: PolicyInputs = {
  complianceCost: 75000,
  implementationTime: 8,
  affectedEmployees: 150,
  trainingCost: 25000,
  systemUpgrades: 50000,
  consultingFees: 35000,
  ongoingMaintenance: 15000,
  riskReduction: 75,
  regulatoryFines: 250000,
  reputationalImpact: "Medium",
};

/**
 * Default economic impact inputs
 * Used as initial state and for reset button
 */
export const DEFAULT_ECONOMIC_INPUTS: EconomicInputs = {
  gdpChange: 2.5,
  inflationRate: 3.2,
  interestRates: 4.5,
  unemploymentRate: 3.8,
  marketVolatility: 15,
  consumerConfidence: 120,
  businessInvestment: 1500000,
  tradeBalance: -25000,
  currencyStrength: 105,
  sectorImpact: "Technology",
};

/**
 * Pre-defined policy impact scenarios
 * Users can quickly load a scenario to see how different compliance
 * situations impact the business
 */
export const POLICY_SCENARIOS: Scenario<PolicyInputs>[] = [
  {
    name: "GDPR Compliance",
    description: "Full GDPR compliance implementation",
    inputs: {
      complianceCost: 85000,
      implementationTime: 6,
      affectedEmployees: 200,
      trainingCost: 30000,
      systemUpgrades: 65000,
      consultingFees: 45000,
      ongoingMaintenance: 20000,
      riskReduction: 85,
      regulatoryFines: 500000,
      reputationalImpact: "High",
    },
  },
  {
    name: "SOX Compliance Update",
    description: "Sarbanes-Oxley compliance enhancement",
    inputs: {
      complianceCost: 120000,
      implementationTime: 10,
      affectedEmployees: 100,
      trainingCost: 40000,
      systemUpgrades: 80000,
      consultingFees: 60000,
      ongoingMaintenance: 25000,
      riskReduction: 90,
      regulatoryFines: 1000000,
      reputationalImpact: "High",
    },
  },
  {
    name: "Tax Rate Change",
    description: "Corporate tax rate increase impact",
    inputs: {
      complianceCost: 35000,
      implementationTime: 4,
      affectedEmployees: 50,
      trainingCost: 15000,
      systemUpgrades: 25000,
      consultingFees: 20000,
      ongoingMaintenance: 8000,
      riskReduction: 60,
      regulatoryFines: 150000,
      reputationalImpact: "Low",
    },
  },
];

/**
 * Pre-defined economic impact scenarios
 * Users can quickly load a scenario to analyze how different
 * economic conditions affect business strategy
 */
export const ECONOMIC_SCENARIOS: Scenario<EconomicInputs>[] = [
  {
    name: "Economic Recession",
    description: "Moderate economic downturn scenario",
    inputs: {
      gdpChange: -1.5,
      inflationRate: 2.1,
      interestRates: 2.0,
      unemploymentRate: 6.5,
      marketVolatility: 35,
      consumerConfidence: 85,
      businessInvestment: 800000,
      tradeBalance: -45000,
      currencyStrength: 95,
      sectorImpact: "All Sectors",
    },
  },
  {
    name: "Economic Growth",
    description: "Strong economic expansion scenario",
    inputs: {
      gdpChange: 4.2,
      inflationRate: 2.8,
      interestRates: 5.5,
      unemploymentRate: 2.8,
      marketVolatility: 8,
      consumerConfidence: 140,
      businessInvestment: 2200000,
      tradeBalance: 15000,
      currencyStrength: 115,
      sectorImpact: "Technology",
    },
  },
  {
    name: "Market Volatility",
    description: "High market uncertainty scenario",
    inputs: {
      gdpChange: 1.1,
      inflationRate: 4.5,
      interestRates: 6.0,
      unemploymentRate: 4.2,
      marketVolatility: 45,
      consumerConfidence: 95,
      businessInvestment: 1000000,
      tradeBalance: -18000,
      currencyStrength: 98,
      sectorImpact: "Financial Services",
    },
  },
];

/**
 * Sector options for economic impact analysis
 */
export const SECTOR_OPTIONS = [
  "Technology",
  "Financial Services",
  "Healthcare",
  "Manufacturing",
  "Retail",
  "All Sectors",
] as const;

/**
 * Reputational impact levels
 */
export const REPUTATIONAL_IMPACT_OPTIONS = ["Low", "Medium", "High"] as const;
