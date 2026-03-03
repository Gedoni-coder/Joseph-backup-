/**
 * Economic Indicators Mock Content
 *
 * Contains all narrative content and insights for the Economic Indicators
 * (Index) module. This separates static content from the UI component.
 */

/**
 * Market alert data structure for economic indicators
 */
export interface MarketAlert {
  type: "positive" | "warning" | "update";
  title: string;
  message: string;
}

/**
 * Market alerts shown in the Economic Signals section
 * These provide real-time signals about economic conditions
 */
export const MARKET_ALERTS: MarketAlert[] = [
  {
    type: "positive",
    title: "Positive Signal",
    message:
      "Manufacturing sector shows strong growth momentum with increasing orders.",
  },
  {
    type: "warning",
    title: "Watch Signal",
    message:
      "Inflation indicators showing mixed signals requiring close monitoring.",
  },
  {
    type: "update",
    title: "Market Update",
    message:
      "Central bank maintains current monetary policy stance as expected.",
  },
];

/**
 * Key takeaways from economic analysis
 * These highlight the most important insights from the data
 */
export const KEY_TAKEAWAYS = [
  {
    id: "growth",
    text: "Economic growth maintains moderate pace with positive employment trends",
    sentiment: "positive" as const,
  },
  {
    id: "inflation",
    text: "Inflation pressures showing signs of moderation but remain elevated",
    sentiment: "warning" as const,
  },
  {
    id: "volatility",
    text: "Market volatility expected to continue amid policy uncertainty",
    sentiment: "neutral" as const,
  },
];

/**
 * Economic outlook narrative
 * Provides forward-looking perspective on economic conditions
 */
export const ECONOMIC_OUTLOOK = {
  summary:
    "The economic landscape shows resilience despite global headwinds. Continued monitoring of key indicators will be essential for policy makers and market participants as we navigate through changing economic conditions.",
  riskAssessment: "Moderate",
  confidence: "High",
};

/**
 * Footer content for the Economic Indicators page
 */
export const ECONOMIC_FOOTER = {
  copyright: "© 2024 Economic Forecasting Platform",
  updateFrequency: "Data updated every 15 minutes",
  dataSources: "Federal Reserve, BLS, BEA, International Organizations",
};

/**
 * Color mapping for alert types
 * Used to style market alerts consistently
 */
export const ALERT_STYLE_MAP = {
  positive: {
    borderColor: "economic-positive/20",
    backgroundColor: "economic-positive/5",
    textColor: "economic-positive",
  },
  warning: {
    borderColor: "economic-warning/20",
    backgroundColor: "economic-warning/5",
    textColor: "economic-warning",
  },
  update: {
    borderColor: "primary/20",
    backgroundColor: "primary/5",
    textColor: "primary",
  },
};

/**
 * Sentiment color mapping for key takeaways
 */
export const SENTIMENT_COLOR_MAP = {
  positive: "economic-positive",
  warning: "economic-warning",
  neutral: "primary",
};
