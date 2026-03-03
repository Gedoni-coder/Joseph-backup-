// Economic Indicators Module (Module 1) - Mock Data
// Tags: context (local, state, national, international) - HARDCODED
// Sub-tags: title, description - STAY IN COMPONENT LOGIC but values below
// Data: actual context descriptions and alert messages - MOVED TO MOCK

export type EconomicContext = "local" | "state" | "national" | "international";

export interface EconomicContextConfig {
  context: EconomicContext;
  titleBase: string;
  descriptionTemplate: string; // Will be interpolated with companyName
}

export const ECONOMIC_CONTEXT_CONFIG: EconomicContextConfig[] = [
  {
    context: "local",
    titleBase: "Local Economic Dashboard",
    descriptionTemplate: `Real-time economic data and forecasts for {companyName}'s local market area`,
  },
  {
    context: "state",
    titleBase: "State Economic Overview",
    descriptionTemplate: `Comprehensive state-level economic analysis and trends for {companyName} operations`,
  },
  {
    context: "national",
    titleBase: "National Economic Indicators",
    descriptionTemplate: `Key national economic indicators and market insights for {companyName} marketplace`,
  },
  {
    context: "international",
    titleBase: "Global Economic Monitor",
    descriptionTemplate: `Global economic trends and international market data relevant to {companyName} expansion`,
  },
];

export const ECONOMIC_REFRESH_ALERT = `Economic data refreshed successfully!

Updated:
- All economic indicators
- Market forecasts
- Regional data
- International trends`;

export const UPDATE_TYPES = ["metrics", "news", "forecasts"];

export const STREAM_UPDATE_INTERVAL = 2000; // milliseconds
export const STREAM_JITTER = 3000; // milliseconds
export const ACTIVE_UPDATE_TIMEOUT = 3000; // milliseconds
