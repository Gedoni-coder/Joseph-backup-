// Business Forecast Module (Module 2) - Mock Data
// Tags: section types (assumptions, risks, competitive context) - HARDCODED
// Sub-tags: risk levels (high, medium, low), categories - HARDCODED
// Data: actual values and descriptions - MOVED TO MOCK

export interface KeyAssumption {
  label: string;
  value: string | number;
}

export const KEY_ASSUMPTIONS: KeyAssumption[] = [
  { label: "Market growth rate", value: "15% annually" },
  { label: "Customer retention", value: "85% average" },
  { label: "Cost inflation", value: "3-5% per year" },
  { label: "Technology adoption", value: "25% improvement" },
];

export interface RiskItem {
  label: string;
  level: "high" | "medium" | "low";
}

export const KEY_RISKS: RiskItem[] = [
  { label: "Market Competition", level: "high" },
  { label: "Supply Chain Disruption", level: "medium" },
  { label: "Regulatory Changes", level: "low" },
];

export interface CompetitiveMetric {
  label: string;
  currentValue: number | string;
  targetValue?: number | string;
  unit: string;
}

export const COMPETITIVE_METRICS: CompetitiveMetric[] = [
  { label: "Market Share", currentValue: 12.5, targetValue: 15, unit: "%" },
  { label: "Competitive Position", currentValue: "#3", unit: "rank" },
  { label: "Price Premium", currentValue: 8, unit: "%" },
];

export const FOOTER_COPYRIGHT_YEAR = 2024;
export const FOOTER_UPDATE_FREQUENCY = "Data updated every hour";
export const FOOTER_MODELS = "Models: Monte Carlo, Linear Regression, Scenario Analysis";
