export interface PricingStrategy {
  id: string;
  name: string;
  type:
    | "value-based"
    | "competitive"
    | "dynamic"
    | "tiered"
    | "penetration"
    | "skimming"
    | "discrimination";
  description: string;
  currentPrice: number;
  suggestedPrice: number;
  confidence: number;
  expectedRevenue: number;
  marketShare: number;
  profitMargin: number;
}

export interface CompetitorAnalysis {
  id: string;
  competitor: string;
  product: string;
  price: number;
  marketShare: number;
  features: string[];
  position: "premium" | "mid-market" | "budget";
  lastUpdated: Date;
}

export interface PriceTest {
  id: string;
  name: string;
  testType: "A/B" | "multivariate" | "sequential";
  status: "running" | "completed" | "paused";
  startDate: Date;
  endDate?: Date;
  variants: PriceVariant[];
  winningVariant?: string;
  confidence: number;
}

export interface PriceVariant {
  id: string;
  name: string;
  price: number;
  conversions: number;
  revenue: number;
  visitors: number;
  conversionRate: number;
}

export interface PricingMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  change: number;
  trend: "up" | "down" | "stable";
  period: string;
}

export interface DynamicPricing {
  id: string;
  product: string;
  basePrice: number;
  currentPrice: number;
  factors: PricingFactor[];
  algorithm: "demand-based" | "competitor-based" | "ai-driven" | "rule-based";
  lastUpdate: Date;
  nextUpdate: Date;
}

export interface PricingFactor {
  name: string;
  weight: number;
  currentValue: number;
  impact: number;
}

// Mock data
export const pricingStrategies: PricingStrategy[] = [
  {
    id: "1",
    name: "Premium Software License",
    type: "value-based",
    description:
      "Enterprise software pricing based on value delivered to customers",
    currentPrice: 299,
    suggestedPrice: 349,
    confidence: 87,
    expectedRevenue: 2840000,
    marketShare: 23.5,
    profitMargin: 68.2,
  },
  {
    id: "2",
    name: "Mobile App Pro",
    type: "tiered",
    description: "Freemium model with multiple subscription tiers",
    currentPrice: 9.99,
    suggestedPrice: 12.99,
    confidence: 74,
    expectedRevenue: 486000,
    marketShare: 15.8,
    profitMargin: 82.1,
  },
  {
    id: "3",
    name: "Cloud Storage Service",
    type: "dynamic",
    description: "AI-driven pricing based on demand and usage patterns",
    currentPrice: 19.99,
    suggestedPrice: 22.99,
    confidence: 91,
    expectedRevenue: 1560000,
    marketShare: 31.2,
    profitMargin: 45.6,
  },
  {
    id: "4",
    name: "Professional Consulting",
    type: "discrimination",
    description: "Segment-based pricing for different customer types",
    currentPrice: 150,
    suggestedPrice: 175,
    confidence: 82,
    expectedRevenue: 920000,
    marketShare: 18.4,
    profitMargin: 55.8,
  },
];

export const competitorAnalysis: CompetitorAnalysis[] = [
  {
    id: "1",
    competitor: "Jumia",
    product: "Marketplace Commission",
    price: 15.5,
    marketShare: 32.5,
    features: ["15% Commission", "Pan-African Reach", "JumiaPay Integration", "Logistics Network"],
    position: "premium",
    lastUpdated: new Date("2024-12-10T14:30:00"),
  },
  {
    id: "2",
    competitor: "Konga",
    product: "Seller Fees",
    price: 12.8,
    marketShare: 18.7,
    features: ["12-15% Commission", "Nigerian Focus", "KongaPay", "Trusted Brand"],
    position: "mid-market",
    lastUpdated: new Date("2024-12-11T09:15:00"),
  },
  {
    id: "3",
    competitor: "Temu",
    product: "Marketplace Fees",
    price: 8.5,
    marketShare: 15.8,
    features: ["Ultra-Low Fees", "Direct China Sourcing", "Social Commerce", "Free Shipping Threshold"],
    position: "budget",
    lastUpdated: new Date("2024-12-09T16:45:00"),
  },
  {
    id: "4",
    competitor: "Amazon",
    product: "Referral & FBA Fees",
    price: 20.2,
    marketShare: 12.3,
    features: ["15-20% Referral Fee", "FBA Services", "Prime Benefits", "Global Reach"],
    position: "premium",
    lastUpdated: new Date("2024-12-08T11:20:00"),
  },
];

export const priceTests: PriceTest[] = [
  {
    id: "1",
    name: "Premium Tier Price Optimization",
    testType: "A/B",
    status: "running",
    startDate: new Date("2024-12-01T00:00:00"),
    endDate: new Date("2024-12-31T23:59:59"),
    variants: [
      {
        id: "A",
        name: "Current Price",
        price: 299,
        conversions: 847,
        revenue: 253153,
        visitors: 12450,
        conversionRate: 6.8,
      },
      {
        id: "B",
        name: "Increased Price",
        price: 349,
        conversions: 721,
        revenue: 251629,
        visitors: 12380,
        conversionRate: 5.8,
      },
    ],
    confidence: 73,
  },
  {
    id: "2",
    name: "Mobile App Subscription Test",
    testType: "multivariate",
    status: "completed",
    startDate: new Date("2024-11-01T00:00:00"),
    endDate: new Date("2024-11-30T23:59:59"),
    variants: [
      {
        id: "A",
        name: "Monthly $9.99",
        price: 9.99,
        conversions: 2341,
        revenue: 23383,
        visitors: 45600,
        conversionRate: 5.1,
      },
      {
        id: "B",
        name: "Monthly $12.99",
        price: 12.99,
        conversions: 1876,
        revenue: 24365,
        visitors: 45820,
        conversionRate: 4.1,
      },
    ],
    winningVariant: "B",
    confidence: 89,
  },
];

export const pricingMetrics: PricingMetric[] = [
  {
    id: "1",
    name: "Average Selling Price",
    value: 156.78,
    unit: "$",
    change: 8.4,
    trend: "up",
    period: "Last 30 days",
  },
  {
    id: "2",
    name: "Price Elasticity",
    value: -1.24,
    unit: "",
    change: -0.18,
    trend: "down",
    period: "Q3 2024",
  },
  {
    id: "3",
    name: "Competitive Position",
    value: 94.2,
    unit: "Score",
    change: 2.8,
    trend: "up",
    period: "This quarter",
  },
  {
    id: "4",
    name: "Price Acceptance Rate",
    value: 78.5,
    unit: "%",
    change: -1.2,
    trend: "down",
    period: "Last 7 days",
  },
];

export const dynamicPricing: DynamicPricing[] = [
  {
    id: "1",
    product: "Cloud Storage Pro",
    basePrice: 19.99,
    currentPrice: 22.99,
    algorithm: "ai-driven",
    lastUpdate: new Date("2024-12-12T08:30:00"),
    nextUpdate: new Date("2024-12-12T14:30:00"),
    factors: [
      { name: "Demand Level", weight: 0.4, currentValue: 0.85, impact: 15 },
      {
        name: "Competitor Pricing",
        weight: 0.3,
        currentValue: 0.72,
        impact: 8,
      },
      { name: "Inventory Level", weight: 0.2, currentValue: 0.91, impact: -2 },
      { name: "Time of Day", weight: 0.1, currentValue: 0.65, impact: 3 },
    ],
  },
  {
    id: "2",
    product: "Professional Services",
    basePrice: 150,
    currentPrice: 165,
    algorithm: "demand-based",
    lastUpdate: new Date("2024-12-12T06:00:00"),
    nextUpdate: new Date("2024-12-12T18:00:00"),
    factors: [
      { name: "Market Demand", weight: 0.5, currentValue: 0.88, impact: 10 },
      {
        name: "Resource Availability",
        weight: 0.3,
        currentValue: 0.45,
        impact: 12,
      },
      { name: "Seasonal Trends", weight: 0.2, currentValue: 0.75, impact: -2 },
    ],
  },
];
