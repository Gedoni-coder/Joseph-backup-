export interface Competitor {
  id: string;
  name: string;
  type: "direct" | "indirect" | "substitute";
  marketShare: number;
  revenue: number;
  employees: number;
  founded: number;
  headquarters: string;
  website: string;
  description: string;
  keyProducts: string[];
  targetMarkets: string[];
  fundingStage: string;
  lastFunding?: number;
}

export interface SWOTAnalysis {
  id: string;
  competitor: string;
  strengths: SWOTItem[];
  weaknesses: SWOTItem[];
  opportunities: SWOTItem[];
  threats: SWOTItem[];
  overallScore: number;
  lastUpdated: Date;
}

export interface SWOTItem {
  factor: string;
  description: string;
  impact: "high" | "medium" | "low";
  confidence: number;
}

export interface ProductComparison {
  id: string;
  competitor: string;
  product: string;
  pricing: {
    model: string;
    startingPrice: number;
    enterprisePrice?: number;
    currency: string;
  };
  features: FeatureComparison[];
  strengths: string[];
  weaknesses: string[];
  marketPosition: "leader" | "challenger" | "niche" | "follower";
}

export interface FeatureComparison {
  feature: string;
  ourProduct: "excellent" | "good" | "basic" | "missing";
  competitor: "excellent" | "good" | "basic" | "missing";
  importance: "critical" | "important" | "nice-to-have";
  notes?: string;
}

export interface MarketPosition {
  id: string;
  competitor: string;
  position: {
    value: number; // 1-10 scale
    price: number; // 1-10 scale (1 = low price, 10 = high price)
    volume: number; // Market share percentage
  };
  quadrant: "leader" | "challenger" | "niche" | "follower";
  movement: "rising" | "stable" | "declining";
  keyDifferentiators: string[];
}

export interface CompetitiveAdvantage {
  id: string;
  type:
    | "technology"
    | "cost"
    | "service"
    | "brand"
    | "distribution"
    | "partnerships";
  advantage: string;
  description: string;
  sustainability: "high" | "medium" | "low";
  competitorResponse: string[];
  timeToReplicate: number; // months
  strategicImportance: "critical" | "important" | "moderate";
}

export interface StrategyRecommendation {
  id: string;
  category:
    | "positioning"
    | "product"
    | "pricing"
    | "marketing"
    | "partnerships";
  title: string;
  description: string;
  rationale: string;
  expectedImpact: "high" | "medium" | "low";
  implementationComplexity: "high" | "medium" | "low";
  timeframe: "immediate" | "short-term" | "long-term";
  resources: string[];
  metrics: string[];
  risks: string[];
}

// Mock data - E-commerce Marketplace Competitors
export const competitors: Competitor[] = [
  {
    id: "1",
    name: "Jumia",
    type: "direct",
    marketShare: 32.5,
    revenue: 950000000,
    employees: 8500,
    founded: 2012,
    headquarters: "Lagos, Nigeria",
    website: "jumia.com",
    description:
      "Africa's leading e-commerce marketplace with pan-African presence across 11 countries",
    keyProducts: [
      "Electronics",
      "Fashion",
      "Home & Living",
      "Groceries",
      "Phones & Tablets",
    ],
    targetMarkets: ["Nigeria", "Kenya", "Egypt", "Ghana", "Morocco"],
    fundingStage: "Public",
    lastFunding: 240000000,
  },
  {
    id: "2",
    name: "Konga",
    type: "direct",
    marketShare: 18.7,
    revenue: 520000000,
    employees: 3200,
    founded: 2012,
    headquarters: "Lagos, Nigeria",
    website: "konga.com",
    description:
      "Nigerian-focused e-commerce platform known for trusted service and quality products",
    keyProducts: ["Electronics", "Fashion", "Home & Garden", "Health & Beauty"],
    targetMarkets: ["Nigeria"],
    fundingStage: "Acquired",
    lastFunding: 180000000,
  },
  {
    id: "3",
    name: "Temu",
    type: "direct",
    marketShare: 15.8,
    revenue: 680000000,
    employees: 1200,
    founded: 2022,
    headquarters: "Boston, MA, USA",
    website: "temu.com",
    description:
      "Ultra-low price marketplace with direct China sourcing and social commerce features",
    keyProducts: [
      "Fashion",
      "Home Decor",
      "Electronics",
      "Beauty",
      "Accessories",
    ],
    targetMarkets: ["Nigeria", "Global", "Cross-border"],
    fundingStage: "Private",
    lastFunding: 2000000000,
  },
  {
    id: "4",
    name: "Amazon",
    type: "indirect",
    marketShare: 12.3,
    revenue: 574780000000,
    employees: 1541000,
    founded: 1994,
    headquarters: "Seattle, WA, USA",
    website: "amazon.com",
    description:
      "Global e-commerce giant with international shipping to Nigeria, though limited local presence",
    keyProducts: ["Everything", "Prime Services", "AWS", "Kindle", "Alexa"],
    targetMarkets: ["Global", "Nigeria (International)"],
    fundingStage: "Public",
  },
  {
    id: "5",
    name: "AliExpress",
    type: "indirect",
    marketShare: 9.2,
    revenue: 83000000000,
    employees: 117600,
    founded: 2010,
    headquarters: "Hangzhou, China",
    website: "aliexpress.com",
    description:
      "Global B2C marketplace owned by Alibaba, specializing in cross-border e-commerce",
    keyProducts: [
      "Electronics",
      "Fashion",
      "Home & Garden",
      "Automotive",
      "Sports",
    ],
    targetMarkets: ["Global", "Nigeria (Cross-border)"],
    fundingStage: "Public",
  },
];

export const swotAnalyses: SWOTAnalysis[] = [
  {
    id: "1",
    competitor: "Jumia",
    strengths: [
      {
        factor: "Pan-African Market Leadership",
        description:
          "32.5% market share across 11 African countries. Established brand recognition and trust",
        impact: "high",
        confidence: 92,
      },
      {
        factor: "Strong Logistics Network",
        description:
          "Built-in fulfillment and last-mile delivery infrastructure across major cities",
        impact: "high",
        confidence: 88,
      },
      {
        factor: "Diverse Product Catalog",
        description:
          "Wide range across electronics, fashion, groceries, and services",
        impact: "medium",
        confidence: 85,
      },
    ],
    weaknesses: [
      {
        factor: "High Customer Acquisition Costs",
        description:
          "Marketing spend remains high due to intense competition and low brand awareness",
        impact: "medium",
        confidence: 83,
      },
      {
        factor: "Thin Profit Margins",
        description:
          "Aggressive pricing and high fulfillment costs compress margins",
        impact: "high",
        confidence: 90,
      },
    ],
    opportunities: [
      {
        factor: "Mobile-First Growth",
        description:
          "85%+ transactions on mobile. Opportunity to enhance mobile experience and apps",
        impact: "high",
        confidence: 88,
      },
      {
        factor: "Financial Services Integration",
        description:
          "JumiaPay expansion into lending, insurance, and merchant financing",
        impact: "high",
        confidence: 75,
      },
    ],
    threats: [
      {
        factor: "Price Competition",
        description: "Temu and AliExpress undercutting with ultra-low prices",
        impact: "high",
        confidence: 85,
      },
      {
        factor: "Regulatory Changes",
        description:
          "Potential e-commerce regulations affecting marketplace operations",
        impact: "medium",
        confidence: 70,
      },
    ],
    overallScore: 72,
    lastUpdated: new Date("2024-12-10T15:30:00"),
  },
  {
    id: "2",
    competitor: "Konga",
    strengths: [
      {
        factor: "Nigerian Market Focus",
        description:
          "Deep understanding of local consumer preferences and trusted brand",
        impact: "high",
        confidence: 88,
      },
      {
        factor: "Customer Service",
        description:
          "Reputation for responsive customer support and dispute resolution",
        impact: "medium",
        confidence: 82,
      },
    ],
    weaknesses: [
      {
        factor: "Limited Geographic Expansion",
        description:
          "Focused only on Nigeria, missing pan-African opportunities",
        impact: "high",
        confidence: 90,
      },
      {
        factor: "Smaller GMV Scale",
        description:
          "Lower transaction volume compared to Jumia limits economies of scale",
        impact: "medium",
        confidence: 85,
      },
    ],
    opportunities: [
      {
        factor: "Hyperlocal Services",
        description: "Same-city delivery and local seller partnerships",
        impact: "medium",
        confidence: 75,
      },
    ],
    threats: [
      {
        factor: "Market Consolidation",
        description:
          "Risk of being acquired or losing market share to larger players",
        impact: "high",
        confidence: 78,
      },
    ],
    overallScore: 68,
    lastUpdated: new Date("2024-12-10T15:30:00"),
  },
  {
    id: "3",
    competitor: "Temu",
    strengths: [
      {
        factor: "Ultra-Competitive Pricing",
        description:
          "Direct China sourcing enables 30-50% lower prices than competitors",
        impact: "high",
        confidence: 92,
      },
      {
        factor: "Social Commerce Integration",
        description:
          "Viral marketing and social sharing features driving rapid growth",
        impact: "high",
        confidence: 88,
      },
    ],
    weaknesses: [
      {
        factor: "Quality Perception",
        description: "Low prices create quality concerns among some consumers",
        impact: "medium",
        confidence: 80,
      },
      {
        factor: "Long Shipping Times",
        description:
          "Cross-border fulfillment takes 7-21 days vs local 2-5 days",
        impact: "high",
        confidence: 85,
      },
    ],
    opportunities: [
      {
        factor: "Young Demographics",
        description:
          "Strong appeal to price-conscious Gen Z and Millennial shoppers",
        impact: "high",
        confidence: 82,
      },
    ],
    threats: [
      {
        factor: "Trade Policy Changes",
        description:
          "Import duties or restrictions could impact cost advantage",
        impact: "medium",
        confidence: 70,
      },
    ],
    overallScore: 75,
    lastUpdated: new Date("2024-12-10T15:30:00"),
  },
];

export const productComparisons: ProductComparison[] = [
  {
    id: "1",
    competitor: "Jumia",
    product: "E-commerce Marketplace Platform",
    pricing: {
      model: "Commission-based (15-17% of GMV)",
      startingPrice: 15.5,
      enterprisePrice: 17.0,
      currency: "%",
    },
    features: [
      {
        feature: "Mobile App Experience",
        ourProduct: "excellent",
        competitor: "good",
        importance: "critical",
        notes:
          "Our platform's mobile-first design vs Jumia's traditional approach",
      },
      {
        feature: "Logistics Network",
        ourProduct: "good",
        competitor: "excellent",
        importance: "critical",
        notes: "Jumia has established pan-African fulfillment network",
      },
      {
        feature: "Payment Integration",
        ourProduct: "good",
        competitor: "excellent",
        importance: "critical",
        notes: "JumiaPay offers integrated wallet and BNPL",
      },
      {
        feature: "Product Catalog Size",
        ourProduct: "good",
        competitor: "excellent",
        importance: "important",
        notes: "Jumia has larger seller base and inventory",
      },
      {
        feature: "Seller Tools",
        ourProduct: "excellent",
        competitor: "good",
        importance: "critical",
        notes: "Our platform provides better analytics and seller dashboard",
      },
      {
        feature: "Customer Service",
        ourProduct: "good",
        competitor: "good",
        importance: "important",
      },
    ],
    strengths: [
      "Pan-African presence",
      "Established logistics",
      "JumiaPay integration",
    ],
    weaknesses: [
      "Higher commission rates",
      "Slower UI updates",
      "Less flexible seller terms",
    ],
    marketPosition: "leader",
  },
];

export const marketPositions: MarketPosition[] = [
  {
    id: "1",
    competitor: "Jumia",
    position: { value: 8.5, price: 8.2, volume: 32.5 },
    quadrant: "leader",
    movement: "stable",
    keyDifferentiators: [
      "Pan-African logistics network",
      "JumiaPay integration",
      "Wide product catalog",
    ],
  },
  {
    id: "2",
    competitor: "Konga",
    position: { value: 7.2, price: 7.5, volume: 18.7 },
    quadrant: "challenger",
    movement: "stable",
    keyDifferentiators: [
      "Nigerian market focus",
      "Customer service reputation",
      "Trusted brand",
    ],
  },
  {
    id: "3",
    competitor: "Temu",
    position: { value: 6.5, price: 9.8, volume: 15.8 },
    quadrant: "challenger",
    movement: "rising",
    keyDifferentiators: [
      "Ultra-low prices",
      "Social commerce",
      "Direct China sourcing",
    ],
  },
  {
    id: "4",
    competitor: "Our Platform",
    position: { value: 7.8, price: 7.0, volume: 12.5 },
    quadrant: "challenger",
    movement: "rising",
    keyDifferentiators: [
      "Mobile-first experience",
      "Advanced seller analytics",
      "Competitive commission rates",
    ],
  },
];

export const competitiveAdvantages: CompetitiveAdvantage[] = [
  {
    id: "1",
    type: "technology",
    advantage: "Real-time Processing Engine",
    description:
      "Proprietary technology delivering 3x faster real-time analytics processing than competitors",
    sustainability: "high",
    competitorResponse: [
      "Invest in infrastructure upgrades",
      "Acquire real-time technology companies",
    ],
    timeToReplicate: 18,
    strategicImportance: "critical",
  },
  {
    id: "2",
    type: "service",
    advantage: "Rapid Implementation Methodology",
    description:
      "Standardized deployment process reducing implementation time from 6 months to 6 weeks",
    sustainability: "medium",
    competitorResponse: [
      "Develop similar methodologies",
      "Increase implementation team size",
    ],
    timeToReplicate: 12,
    strategicImportance: "important",
  },
  {
    id: "3",
    type: "cost",
    advantage: "Efficient Cloud Architecture",
    description:
      "Optimized cloud infrastructure providing 40% cost savings compared to traditional architectures",
    sustainability: "medium",
    competitorResponse: [
      "Modernize infrastructure",
      "Renegotiate cloud contracts",
    ],
    timeToReplicate: 24,
    strategicImportance: "important",
  },
];

export const strategyRecommendations: StrategyRecommendation[] = [
  {
    id: "1",
    category: "positioning",
    title: "Emphasize Real-time Analytics Leadership",
    description:
      "Position ourselves as the real-time analytics leader, highlighting our 3x speed advantage",
    rationale:
      "Market research shows real-time capabilities are increasingly critical for competitive advantage",
    expectedImpact: "high",
    implementationComplexity: "low",
    timeframe: "immediate",
    resources: ["Marketing team", "Product marketing", "Sales enablement"],
    metrics: ["Brand awareness", "Win rate vs competitors", "Sales velocity"],
    risks: [
      "Competitors may challenge claims",
      "Need to maintain technical lead",
    ],
  },
  {
    id: "2",
    category: "product",
    title: "Accelerate AI Feature Development",
    description:
      "Fast-track AI/ML capabilities to close the gap with DataCorp Analytics",
    rationale:
      "AI is becoming table stakes; we risk losing deals without competitive AI features",
    expectedImpact: "high",
    implementationComplexity: "high",
    timeframe: "short-term",
    resources: ["Engineering team", "Data science team", "Product management"],
    metrics: [
      "Feature adoption",
      "Customer satisfaction",
      "Competitive win rate",
    ],
    risks: ["Resource constraints", "Technical complexity", "Time to market"],
  },
  {
    id: "3",
    category: "pricing",
    title: "Introduce Mid-market Pricing Tier",
    description:
      "Create a specialized pricing tier to better compete with InsightFlow in the mid-market",
    rationale:
      "Mid-market segment is growing fastest but we're losing deals to lower-priced competitors",
    expectedImpact: "medium",
    implementationComplexity: "medium",
    timeframe: "short-term",
    resources: ["Product team", "Sales team", "Finance"],
    metrics: ["Mid-market win rate", "Average deal size", "Market share"],
    risks: ["Cannibalization of enterprise deals", "Margin pressure"],
  },
];
