import {
  type MarketSize,
  type CustomerSegment,
  type MarketTrend,
  type DemandForecast,
  type IndustryInsight
} from "@/lib/market-data";

export interface MarketAnalysisResponse {
  marketSizes: MarketSize[];
  customerSegments: CustomerSegment[];
  marketTrends: MarketTrend[];
  demandForecasts: DemandForecast[];
  industryInsights: IndustryInsight[];
}

interface OnboardingData {
  companyName?: string;
  industry?: string;
  description?: string;
  targetMarket?: string;
  businessStage?: string;
}

export async function generateMarketAnalysisWithGroq(
  onboardingData: OnboardingData
): Promise<MarketAnalysisResponse | null> {
  try {
    const prompt = buildMarketAnalysisPrompt(onboardingData);

    // Call the backend proxy endpoint instead of direct Groq API
    const response = await fetch("/api/ai/groq", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mixtral-8x7b-32768",
        messages: [
          {
            role: "system",
            content: `You are a market analysis expert. Generate comprehensive market analysis data in valid JSON format.
Always respond with ONLY valid JSON, no markdown, no code blocks, no explanations.`,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      console.debug(`Backend Groq API error: ${response.status}`);
      return null;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      console.debug("No content in Groq response");
      return null;
    }

    // Parse the JSON response
    const analysisData = parseMarketAnalysisResponse(content);
    return analysisData;
  } catch (error) {
    console.debug("Error calling Groq backend API:", error);
    return null;
  }
}

function buildMarketAnalysisPrompt(onboardingData: OnboardingData): string {
  const {
    companyName = "Your Company",
    industry = "Technology",
    description = "B2B SaaS",
    targetMarket = "Enterprise clients",
    businessStage = "Early growth",
  } = onboardingData;

  return `Generate a comprehensive market analysis for the following company in JSON format:

Company Name: ${companyName}
Industry: ${industry}
Description: ${description}
Target Market: ${targetMarket}
Business Stage: ${businessStage}

Generate realistic market data. Respond with ONLY valid JSON (no markdown or code blocks):

{
  "marketSizes": [
    {
      "id": "tam-primary",
      "name": "Total Addressable Market (TAM)",
      "tam": <number in millions>,
      "sam": <number in millions (20-40% of TAM)>,
      "som": <number in millions (5-15% of SAM)>,
      "growthRate": <number 8-25>,
      "timeframe": "2025-2027",
      "currency": "USD",
      "region": "Global"
    }
  ],
  "customerSegments": [
    {
      "id": "segment-enterprise",
      "name": "Enterprise",
      "size": <number in thousands>,
      "percentage": <number 30-50>,
      "avgSpending": <number in thousands>,
      "growthRate": <number 5-20>,
      "characteristics": ["Array", "of", "3-4", "characteristics"],
      "region": "Global",
      "priority": "high"
    }
  ],
  "marketTrends": [
    {
      "id": "trend-1",
      "category": "Technology",
      "trend": "Trend Name",
      "impact": "high|medium|low",
      "direction": "positive|negative|neutral",
      "timeframe": "2025-2027",
      "description": "2-3 sentence description",
      "sources": ["Source1", "Source2"],
      "confidence": <number 70-95>
    }
  ],
  "demandForecasts": [
    {
      "id": "forecast-1",
      "product": "Product Category",
      "currentDemand": <number>,
      "forecastDemand": <number>,
      "timeframe": "Next 18 months",
      "confidence": <number 70-95>,
      "methodology": "Growth analysis",
      "factors": [],
      "scenarios": []
    }
  ],
  "industryInsights": [
    {
      "id": "insight-1",
      "type": "opportunity|challenge",
      "title": "Insight Title",
      "description": "2-3 sentence description",
      "impact": "high|medium|low",
      "timeframe": "immediate|short-term|long-term",
      "probability": <number 60-95>,
      "actionItems": ["Action1", "Action2"],
      "relatedTrends": []
    }
  ]
}

Make numbers realistic and specific. Ensure all arrays contain 2-4 items. Use realistic growth rates (8-25%).`;
}

function parseMarketAnalysisResponse(content: string): MarketAnalysisResponse | null {
  try {
    // Clean the content in case there's markdown formatting
    let cleanedContent = content.trim();
    if (cleanedContent.startsWith("```json")) {
      cleanedContent = cleanedContent.replace(/^```json\n/, "").replace(/\n```$/, "");
    } else if (cleanedContent.startsWith("```")) {
      cleanedContent = cleanedContent.replace(/^```\n/, "").replace(/\n```$/, "");
    }

    const parsed = JSON.parse(cleanedContent);

    return {
      marketSizes: normalizeMarketSizes(parsed.marketSizes),
      customerSegments: normalizeCustomerSegments(parsed.customerSegments),
      marketTrends: normalizeMarketTrends(parsed.marketTrends),
      demandForecasts: normalizeDemandForecasts(parsed.demandForecasts),
      industryInsights: normalizeIndustryInsights(parsed.industryInsights),
    };
  } catch (error) {
    console.debug("Error parsing market analysis response:", error);
    return null;
  }
}

function normalizeMarketSizes(arr: any): MarketSize[] {
  if (!Array.isArray(arr) || arr.length === 0) return [];

  return arr.map((item, idx) => ({
    id: item.id || `market-${idx}`,
    name: item.name || "Market Size",
    tam: typeof item.tam === 'number' ? item.tam : 0,
    sam: typeof item.sam === 'number' ? item.sam : 0,
    som: typeof item.som === 'number' ? item.som : 0,
    growthRate: typeof item.growthRate === 'number' ? item.growthRate : 15,
    timeframe: item.timeframe || "2025-2027",
    currency: item.currency || "USD",
    region: item.region || "Global",
  }));
}

function normalizeCustomerSegments(arr: any): CustomerSegment[] {
  if (!Array.isArray(arr) || arr.length === 0) return [];

  return arr.map((item, idx) => ({
    id: item.id || `segment-${idx}`,
    name: item.name || "Segment",
    size: typeof item.size === 'number' ? item.size : 0,
    percentage: typeof item.percentage === 'number' ? item.percentage : 25,
    avgSpending: typeof item.avgSpending === 'number' ? item.avgSpending : 50000,
    growthRate: typeof item.growthRate === 'number' ? item.growthRate : 12,
    characteristics: Array.isArray(item.characteristics) ? item.characteristics : ["Key segment characteristic"],
    region: item.region || "Global",
    priority: (["high", "medium", "low"].includes(item.priority) ? item.priority : "medium") as "high" | "medium" | "low",
  }));
}

function normalizeMarketTrends(arr: any): MarketTrend[] {
  if (!Array.isArray(arr) || arr.length === 0) return [];

  return arr.map((item, idx) => ({
    id: item.id || `trend-${idx}`,
    category: item.category || "Market",
    trend: item.trend || item.title || "Market Trend",
    impact: (["high", "medium", "low"].includes(item.impact) ? item.impact : "medium") as "high" | "medium" | "low",
    direction: (["positive", "negative", "neutral"].includes(item.direction) ? item.direction : "neutral") as "positive" | "negative" | "neutral",
    timeframe: item.timeframe || "2025-2027",
    description: item.description || "Market trend description",
    sources: Array.isArray(item.sources) ? item.sources : ["Industry Research"],
    confidence: typeof item.confidence === 'number' ? Math.min(100, Math.max(0, item.confidence)) : 80,
  }));
}

function normalizeDemandForecasts(arr: any): DemandForecast[] {
  if (!Array.isArray(arr) || arr.length === 0) return [];

  return arr.map((item, idx) => ({
    id: item.id || `forecast-${idx}`,
    product: item.product || "Product Category",
    currentDemand: typeof item.currentDemand === 'number' ? item.currentDemand : 100000,
    forecastDemand: typeof item.forecastDemand === 'number' ? item.forecastDemand : 150000,
    timeframe: item.timeframe || "Next 18 months",
    confidence: typeof item.confidence === 'number' ? Math.min(100, Math.max(0, item.confidence)) : 80,
    methodology: item.methodology || "Market analysis",
    factors: Array.isArray(item.factors) ? item.factors : [],
    scenarios: Array.isArray(item.scenarios) ? item.scenarios : [],
  }));
}

function normalizeIndustryInsights(arr: any): IndustryInsight[] {
  if (!Array.isArray(arr) || arr.length === 0) return [];

  return arr.map((item, idx) => ({
    id: item.id || `insight-${idx}`,
    type: (["opportunity", "challenge"].includes(item.type) ? item.type : "opportunity") as "opportunity" | "challenge",
    title: item.title || "Market Insight",
    description: item.description || item.insight || "Industry insight",
    impact: (["high", "medium", "low"].includes(item.impact) ? item.impact : "medium") as "high" | "medium" | "low",
    timeframe: (["immediate", "short-term", "long-term"].includes(item.timeframe) ? item.timeframe : "short-term") as "immediate" | "short-term" | "long-term",
    probability: typeof item.probability === 'number' ? Math.min(100, Math.max(0, item.probability)) : 75,
    actionItems: Array.isArray(item.actionItems) ? item.actionItems : ["Continue monitoring"],
    relatedTrends: Array.isArray(item.relatedTrends) ? item.relatedTrends : [],
  }));
}

export async function getMarketAnalysisFromAI(
  companyInfo?: { name?: string; industry?: string; description?: string },
  onboardingData?: {
    targetMarket?: string;
    businessStage?: string;
  }
): Promise<MarketAnalysisResponse | null> {
  const mergedData: OnboardingData = {
    companyName: companyInfo?.name,
    industry: companyInfo?.industry,
    description: companyInfo?.description,
    targetMarket: onboardingData?.targetMarket,
    businessStage: onboardingData?.businessStage,
  };

  return generateMarketAnalysisWithGroq(mergedData);
}
