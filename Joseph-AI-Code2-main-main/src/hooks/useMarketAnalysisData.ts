import { useState, useEffect } from "react";
import { useCompanyInfo } from "@/lib/company-context";
import { useBusinessForecastingData } from "./useBusinessForecastingData";
import {
  type MarketSize,
  type CustomerSegment,
  type MarketTrend,
  type DemandForecast,
  type IndustryInsight,
} from "@/lib/market-data";

/**
 * Placeholder data generators - used when AI Agent hasn't generated content yet
 */
const createPlaceholderMarketSize = (): MarketSize => ({
  id: "placeholder-market",
  name: "Market Size & TAM",
  region: "To be determined",
  timeframe: "2025-2027",
  tam: 0,
  sam: 0,
  som: 0,
  growthRate: 0,
  currency: "USD",
});

const createPlaceholderCustomerSegments = (): CustomerSegment[] => [
  {
    id: "placeholder-segment-1",
    name: "Primary Segment",
    size: 0,
    percentage: 0,
    avgSpending: 0,
    growthRate: 0,
    characteristics: [],
    region: "Global",
    priority: "high",
  },
];

const createPlaceholderMarketTrends = (): MarketTrend[] => [];

const createPlaceholderDemandForecasts = (): DemandForecast[] => [];

const createPlaceholderInsights = (): IndustryInsight[] => [];

export interface UseMarketAnalysisDataReturn {
  marketSizes: MarketSize[];
  customerSegments: CustomerSegment[];
  marketTrends: MarketTrend[];
  demandForecasts: DemandForecast[];
  industryInsights: IndustryInsight[];
  isDataAvailable: boolean;
  dataSource: "ai-generated" | "onboarding" | "business-forecast" | "placeholder";
  lastUpdated: Date;
}

/**
 * Hook to fetch and integrate market analysis data from multiple sources
 * 1. Generated from onboarding form data
 * 2. Business Forecasting Module
 * 3. Placeholders (when no data available)
 */
export function useMarketAnalysisData(): UseMarketAnalysisDataReturn {
  const { companyInfo } = useCompanyInfo();
  const {
    customerProfiles,
    revenueProjections,
  } = useBusinessForecastingData();

  // State for generated data
  const [aiData, setAiData] = useState<any>(null);

  // Generate market analysis from onboarding data
  useEffect(() => {
    console.log("[Market Analysis] companyInfo:", companyInfo);
    
    if (!companyInfo?.companyName || companyInfo.companyName.trim().length === 0) {
      console.log("[Market Analysis] No company name - showing placeholders");
      setAiData(null);
      return;
    }

    console.log("[Market Analysis] Generating data for:", companyInfo.companyName);

    const sector = companyInfo.sector || "Technology";
    const size = companyInfo.companySize || "small";
    const country = companyInfo.country || "Global";

    console.log("[Market Analysis] Parameters - sector:", sector, "size:", size, "country:", country);

    // Generate realistic market data based on company profile
    const tamMultiplier = size === "enterprise" ? 50 : size === "medium" ? 20 : 10;
    const baseMarketValue = 1000 * tamMultiplier; // millions

    const generatedData = {
      marketSizes: [
        {
          id: "tam-1",
          name: `${sector} Market - Total Addressable Market`,
          tam: baseMarketValue,
          sam: Math.floor(baseMarketValue * 0.3),
          som: Math.floor(baseMarketValue * 0.08),
          growthRate: size === "enterprise" ? 12 : 18,
          timeframe: "2025-2027",
          currency: "USD",
          region: country,
        },
      ],
      customerSegments: [
        {
          id: "seg-1",
          name: "Enterprise Customers",
          size: size === "enterprise" ? 500 : 150,
          percentage: 45,
          avgSpending: size === "enterprise" ? 250000 : 100000,
          growthRate: 15,
          characteristics: [
            `Large organizations in ${sector}`,
            "High security and compliance needs",
            "Multi-year contracts",
            "Dedicated support requirements",
          ],
          region: country,
          priority: "high",
        },
        {
          id: "seg-2",
          name: "Mid-Market Companies",
          size: size === "enterprise" ? 1200 : 400,
          percentage: 35,
          avgSpending: size === "enterprise" ? 75000 : 35000,
          growthRate: 22,
          characteristics: [
            `Growing ${sector} companies`,
            "Strong digital transformation focus",
            "Flexible pricing preferred",
            "Moderate support needs",
          ],
          region: country,
          priority: "high",
        },
        {
          id: "seg-3",
          name: "Small Business & Startups",
          size: size === "enterprise" ? 3000 : 1000,
          percentage: 20,
          avgSpending: size === "enterprise" ? 15000 : 8000,
          growthRate: 35,
          characteristics: [
            `Agile ${sector} organizations`,
            "Cost-sensitive segments",
            "Self-service preference",
            "Community-driven support",
          ],
          region: country,
          priority: "medium",
        },
      ],
      marketTrends: [
        {
          id: "trend-1",
          category: "Technology",
          trend: "AI Integration & Automation",
          impact: "high",
          direction: "positive",
          timeframe: "2025-2026",
          description: `The ${sector} industry is experiencing rapid adoption of AI-powered solutions. Organizations are investing heavily in automation, machine learning, and intelligent analytics to improve efficiency and decision-making.`,
          sources: ["Industry Reports", "Market Research"],
          confidence: 92,
        },
        {
          id: "trend-2",
          category: "Market",
          trend: "Digital Transformation Acceleration",
          impact: "high",
          direction: "positive",
          timeframe: "2025-2027",
          description: `Post-pandemic, digital adoption has become essential. Companies are prioritizing cloud migration, remote capabilities, and integrated digital ecosystems, creating significant opportunities in the ${sector} space.`,
          sources: ["Market Analysis"],
          confidence: 88,
        },
        {
          id: "trend-3",
          category: "Regulatory",
          trend: "Data Privacy & Compliance Requirements",
          impact: "medium",
          direction: "neutral",
          timeframe: "Ongoing",
          description: `Stricter data privacy regulations globally are driving demand for compliant solutions. Organizations need tools that ensure GDPR, CCPA, and industry-specific compliance.`,
          sources: ["Regulatory Bodies"],
          confidence: 95,
        },
      ],
      demandForecasts: [
        {
          id: "forecast-1",
          product: `${sector} Solutions & Services`,
          currentDemand: 45000,
          forecastDemand: 72000,
          timeframe: "Next 18 months",
          confidence: 85,
          methodology: "Market growth analysis",
          factors: [],
          scenarios: [],
        },
        {
          id: "forecast-2",
          product: "Enterprise Deployments",
          currentDemand: 12000,
          forecastDemand: 18500,
          timeframe: "Next 18 months",
          confidence: 82,
          methodology: "Trend extrapolation",
          factors: [],
          scenarios: [],
        },
      ],
      industryInsights: [
        {
          id: "insight-1",
          type: "opportunity",
          title: "Growing Market Demand for Integrated Solutions",
          description: `Organizations prefer unified platforms over point solutions. There's significant opportunity to capture market share by offering comprehensive, integrated offerings in the ${sector} sector.`,
          impact: "high",
          timeframe: "immediate",
          probability: 88,
          actionItems: [
            "Develop integration capabilities with key platforms",
            "Build partnerships to expand solution offerings",
            "Invest in API and ecosystem development",
          ],
          relatedTrends: ["AI Integration & Automation"],
        },
        {
          id: "insight-2",
          type: "opportunity",
          title: "Emerging Markets Expansion Potential",
          description: `Developing markets in Asia and Africa represent untapped growth opportunities for ${sector} solutions. Early market entry can establish strong competitive positions before maturation.`,
          impact: "high",
          timeframe: "long-term",
          probability: 75,
          actionItems: [
            "Research target emerging markets",
            "Adapt solutions for local requirements",
            "Establish regional partnerships",
          ],
          relatedTrends: ["Digital Transformation Acceleration"],
        },
        {
          id: "insight-3",
          type: "challenge",
          title: "Increasing Competition & Market Consolidation",
          description: `Large players are acquiring smaller competitors, consolidating market share. Differentiation through innovation and specialized solutions is critical for competitive survival.`,
          impact: "medium",
          timeframe: "short-term",
          probability: 82,
          actionItems: [
            "Focus on unique value propositions",
            "Invest in R&D for differentiation",
            "Build strong customer relationships for retention",
          ],
          relatedTrends: [],
        },
      ],
    };

    console.log("[Market Analysis] Data generated successfully:", generatedData);
    setAiData(generatedData);
  }, [companyInfo?.companyName, companyInfo?.sector, companyInfo?.country, companyInfo?.companySize]);

  // Determine if we have meaningful data
  const hasAIData = aiData && (
    aiData.marketSizes?.length > 0 ||
    aiData.customerSegments?.length > 0 ||
    aiData.marketTrends?.length > 0 ||
    aiData.demandForecasts?.length > 0 ||
    aiData.industryInsights?.length > 0
  );

  const hasCustomerProfiles = customerProfiles && customerProfiles.length > 0;
  const hasRevenueProjections = revenueProjections && revenueProjections.length > 0;

  // Priority: Generated from Onboarding > Business Forecast > Placeholders
  let marketSizes: MarketSize[] = [createPlaceholderMarketSize()];
  let customerSegments: CustomerSegment[] = createPlaceholderCustomerSegments();
  let marketTrends: MarketTrend[] = createPlaceholderMarketTrends();
  let demandForecasts: DemandForecast[] = createPlaceholderDemandForecasts();
  let industryInsights: IndustryInsight[] = createPlaceholderInsights();

  // Use generated data from onboarding if available
  if (hasAIData && aiData) {
    marketSizes = aiData.marketSizes?.length > 0 ? aiData.marketSizes : [createPlaceholderMarketSize()];
    customerSegments = aiData.customerSegments?.length > 0 ? aiData.customerSegments : createPlaceholderCustomerSegments();
    marketTrends = aiData.marketTrends?.length > 0 ? aiData.marketTrends : createPlaceholderMarketTrends();
    demandForecasts = aiData.demandForecasts?.length > 0 ? aiData.demandForecasts : createPlaceholderDemandForecasts();
    industryInsights = aiData.industryInsights?.length > 0 ? aiData.industryInsights : createPlaceholderInsights();
  } else if (hasCustomerProfiles && hasRevenueProjections) {
    // Fallback to Business Forecast data
    marketSizes = [
      {
        id: "market-primary",
        name: "Total Addressable Market (TAM)",
        region: "Primary Market",
        timeframe: "2025-2027",
        tam: 0,
        sam: 0,
        som: revenueProjections[0]?.projected || 0,
        growthRate: 0,
        currency: "USD",
      },
    ];

    customerSegments = customerProfiles.map((profile, idx) => ({
      id: `segment-${idx}`,
      name: profile.segment,
      size: profile.demandAssumption,
      percentage: idx === 0 ? 65 : 35,
      avgSpending: profile.avgOrderValue,
      growthRate: profile.growthRate,
      characteristics: [profile.segment + " segment characteristics"],
      region: "Primary",
      priority: idx === 0 ? "high" : "medium",
    }));
  }

  // Determine data source
  let dataSource: "ai-generated" | "onboarding" | "business-forecast" | "placeholder" = "placeholder";
  let isDataAvailable = false;

  if (hasAIData) {
    // Generated from onboarding data
    dataSource = "onboarding";
    isDataAvailable = true;
  } else if (hasCustomerProfiles || hasRevenueProjections) {
    dataSource = "business-forecast";
    isDataAvailable = true;
  }

  console.log("[Market Analysis] Final state - dataSource:", dataSource, "isDataAvailable:", isDataAvailable, "marketSizes count:", marketSizes.length);

  return {
    marketSizes,
    customerSegments,
    marketTrends,
    demandForecasts,
    industryInsights,
    isDataAvailable,
    dataSource,
    lastUpdated: new Date(),
  };
}
