export interface MarketSize {
  id: string;
  name: string;
  tam: number; // Total Addressable Market
  sam: number; // Serviceable Addressable Market
  som: number; // Serviceable Obtainable Market
  growthRate: number;
  timeframe: string;
  currency: string;
  region: string;
}

export interface CustomerSegment {
  id: string;
  name: string;
  size: number;
  percentage: number;
  avgSpending: number;
  growthRate: number;
  characteristics: string[];
  region: string;
  priority: "high" | "medium" | "low";
}

export interface MarketTrend {
  id: string;
  category: string;
  trend: string;
  impact: "high" | "medium" | "low";
  direction: "positive" | "negative" | "neutral";
  timeframe: string;
  description: string;
  sources: string[];
  confidence: number;
}

export interface DemandForecast {
  id: string;
  product: string;
  currentDemand: number;
  forecastDemand: number;
  timeframe: string;
  confidence: number;
  methodology: string;
  factors: DemandFactor[];
  scenarios: ForecastScenario[];
}

export interface DemandFactor {
  name: string;
  impact: number;
  weight: number;
  trend: "increasing" | "decreasing" | "stable";
}

export interface ForecastScenario {
  name: string;
  probability: number;
  demand: number;
  assumptions: string[];
}

export interface IndustryInsight {
  id: string;
  type: "challenge" | "opportunity";
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  timeframe: "immediate" | "short-term" | "long-term";
  probability: number;
  actionItems: string[];
  relatedTrends: string[];
}

export interface ReportNote {
  id: string;
  title: string;
  summary: string;
  keyMetrics: {
    label: string;
    value: string;
    trend: "up" | "down" | "stable";
  }[];
  insights: string[];
  recommendations: string[];
  nextSteps: string[];
  dateGenerated: Date;
  author: string;
  confidence: number;
}

// Mock data
export const marketSizes: MarketSize[] = [
  {
    id: "1",
    name: "Global SaaS Market",
    tam: 195000000000,
    sam: 45000000000,
    som: 2800000000,
    growthRate: 18.4,
    timeframe: "2024-2029",
    currency: "USD",
    region: "Global",
  },
  {
    id: "2",
    name: "North American Enterprise Software",
    tam: 89000000000,
    sam: 23000000000,
    som: 1200000000,
    growthRate: 15.2,
    timeframe: "2024-2027",
    currency: "USD",
    region: "North America",
  },
  {
    id: "3",
    name: "European Cloud Services",
    tam: 67000000000,
    sam: 18000000000,
    som: 890000000,
    growthRate: 22.1,
    timeframe: "2024-2028",
    currency: "USD",
    region: "Europe",
  },
];

export const customerSegments: CustomerSegment[] = [
  {
    id: "1",
    name: "Enterprise Corporations",
    size: 147000,
    percentage: 35.2,
    avgSpending: 125000,
    growthRate: 12.4,
    characteristics: [
      "500+ employees",
      "Multiple locations",
      "Complex IT infrastructure",
      "High security requirements",
    ],
    region: "Global",
    priority: "high",
  },
  {
    id: "2",
    name: "Mid-Market Companies",
    size: 234000,
    percentage: 28.7,
    avgSpending: 45000,
    growthRate: 18.9,
    characteristics: [
      "50-500 employees",
      "Growing rapidly",
      "Digital transformation focus",
      "Budget conscious",
    ],
    region: "Global",
    priority: "high",
  },
  {
    id: "3",
    name: "Small Businesses",
    size: 567000,
    percentage: 22.3,
    avgSpending: 8500,
    growthRate: 25.6,
    characteristics: [
      "5-50 employees",
      "Simple setup needs",
      "Price sensitive",
      "Self-service preference",
    ],
    region: "Global",
    priority: "medium",
  },
  {
    id: "4",
    name: "Startups & Scale-ups",
    size: 123000,
    percentage: 13.8,
    avgSpending: 15000,
    growthRate: 42.3,
    characteristics: [
      "Tech-savvy",
      "Rapid scaling",
      "Innovation focused",
      "Flexible requirements",
    ],
    region: "Global",
    priority: "medium",
  },
];

export const marketTrends: MarketTrend[] = [
  {
    id: "1",
    category: "Technology Adoption",
    trend: "AI Integration Acceleration",
    impact: "high",
    direction: "positive",
    timeframe: "2024-2026",
    description:
      "Rapid adoption of AI capabilities across enterprise software solutions, driving demand for intelligent automation.",
    sources: ["Gartner", "McKinsey", "Forrester"],
    confidence: 89,
  },
  {
    id: "2",
    category: "Regulatory Changes",
    trend: "Data Privacy Regulations",
    impact: "medium",
    direction: "neutral",
    timeframe: "Ongoing",
    description:
      "Increasing global focus on data privacy creating both compliance challenges and opportunities for privacy-focused solutions.",
    sources: ["Legal Dept", "Compliance Reports"],
    confidence: 95,
  },
  {
    id: "3",
    category: "Economic Factors",
    trend: "Remote Work Normalization",
    impact: "high",
    direction: "positive",
    timeframe: "2024-2025",
    description:
      "Permanent shift to hybrid work models driving sustained demand for cloud collaboration tools.",
    sources: ["HR Analytics", "Industry Surveys"],
    confidence: 92,
  },
  {
    id: "4",
    category: "Competitive Landscape",
    trend: "Market Consolidation",
    impact: "medium",
    direction: "negative",
    timeframe: "2024-2027",
    description:
      "Large players acquiring smaller competitors, potentially reducing market opportunities for new entrants.",
    sources: ["M&A Reports", "Market Analysis"],
    confidence: 76,
  },
];

export const demandForecasts: DemandForecast[] = [
  {
    id: "1",
    product: "Cloud Analytics Platform",
    currentDemand: 125000,
    forecastDemand: 185000,
    timeframe: "Next 18 months",
    confidence: 83,
    methodology: "Time series analysis with external factors",
    factors: [
      {
        name: "Digital Transformation",
        impact: 25,
        weight: 0.3,
        trend: "increasing",
      },
      { name: "Economic Growth", impact: 15, weight: 0.2, trend: "stable" },
      { name: "Competition", impact: -8, weight: 0.15, trend: "increasing" },
      {
        name: "Technology Adoption",
        impact: 20,
        weight: 0.25,
        trend: "increasing",
      },
      { name: "Regulatory Changes", impact: 5, weight: 0.1, trend: "stable" },
    ],
    scenarios: [
      {
        name: "Optimistic",
        probability: 25,
        demand: 210000,
        assumptions: ["High economic growth", "Accelerated digital adoption"],
      },
      {
        name: "Base Case",
        probability: 50,
        demand: 185000,
        assumptions: ["Steady growth", "Normal market conditions"],
      },
      {
        name: "Conservative",
        probability: 25,
        demand: 155000,
        assumptions: ["Economic slowdown", "Delayed technology adoption"],
      },
    ],
  },
];

export const industryInsights: IndustryInsight[] = [
  {
    id: "1",
    type: "opportunity",
    title: "AI-Powered Analytics Demand Surge",
    description:
      "Growing enterprise demand for AI-integrated analytics solutions presents significant market expansion opportunity.",
    impact: "high",
    timeframe: "immediate",
    probability: 85,
    actionItems: [
      "Accelerate AI feature development",
      "Partner with AI technology providers",
      "Expand technical team capabilities",
    ],
    relatedTrends: ["AI Integration Acceleration", "Digital Transformation"],
  },
  {
    id: "2",
    type: "challenge",
    title: "Increasing Customer Acquisition Costs",
    description:
      "Rising competition and market saturation leading to higher marketing and sales costs.",
    impact: "medium",
    timeframe: "short-term",
    probability: 78,
    actionItems: [
      "Optimize conversion funnel",
      "Improve referral programs",
      "Focus on organic growth channels",
    ],
    relatedTrends: ["Market Consolidation", "Competitive Landscape"],
  },
  {
    id: "3",
    type: "opportunity",
    title: "Emerging Market Expansion",
    description:
      "Rapid digitalization in emerging markets creating new customer segments and revenue opportunities.",
    impact: "high",
    timeframe: "long-term",
    probability: 72,
    actionItems: [
      "Research target emerging markets",
      "Develop localized solutions",
      "Establish regional partnerships",
    ],
    relatedTrends: ["Global Digital Adoption", "Economic Growth"],
  },
  {
    id: "4",
    type: "challenge",
    title: "Data Privacy Compliance Complexity",
    description:
      "Evolving global privacy regulations requiring significant compliance investments and operational changes.",
    impact: "medium",
    timeframe: "immediate",
    probability: 92,
    actionItems: [
      "Implement privacy-by-design principles",
      "Invest in compliance automation",
      "Establish data governance framework",
    ],
    relatedTrends: ["Data Privacy Regulations", "Regulatory Changes"],
  },
];

export const reportNotes: ReportNote[] = [
  {
    id: "1",
    title: "Q4 2024 Market Analysis Summary",
    summary:
      "Strong market momentum continues with AI integration driving significant growth opportunities. Customer demand remains robust across all segments, with particular strength in enterprise and mid-market categories.",
    keyMetrics: [
      { label: "Total Addressable Market", value: "$195B", trend: "up" },
      { label: "Market Growth Rate", value: "18.4%", trend: "up" },
      { label: "Customer Segments", value: "4 Primary", trend: "stable" },
      { label: "Demand Forecast Confidence", value: "83%", trend: "up" },
    ],
    insights: [
      "AI integration is the primary growth driver across all customer segments",
      "Enterprise segment shows highest revenue potential but longer sales cycles",
      "Emerging markets present untapped growth opportunities",
      "Remote work trends continue to drive cloud solution adoption",
    ],
    recommendations: [
      "Prioritize AI feature development to capitalize on market demand",
      "Expand sales team to capture enterprise opportunities",
      "Develop market entry strategy for 2-3 emerging markets",
      "Increase investment in customer success to improve retention",
    ],
    nextSteps: [
      "Conduct detailed AI feature roadmap planning session",
      "Initiate emerging markets feasibility study",
      "Develop enterprise sales enablement program",
      "Schedule quarterly customer segment review",
    ],
    dateGenerated: new Date("2024-12-12T10:00:00"),
    author: "Market Research Team",
    confidence: 87,
  },
];
