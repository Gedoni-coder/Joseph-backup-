import { useState, useEffect } from "react";
import { useToast } from "./use-toast";

export interface Competitor {
  id: string;
  name: string;
  type: "direct" | "indirect" | "substitute";
  marketShare: number;
  revenue: number | null;
  employees: number | null;
  founded: number | null;
  headquarters: string;
  website: string;
  description: string;
  keyProducts: string[];
  targetMarkets: string[];
  fundingStage: string;
  lastFunding: number | null;
}

export interface SWOTItem {
  factor: string;
  description: string;
  impact: "high" | "medium" | "low";
  confidence: number | null;
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

export interface FeatureComparison {
  feature: string;
  ourProduct: "excellent" | "good" | "basic" | "missing" | null;
  competitor: "excellent" | "good" | "basic" | "missing" | null;
  importance: "critical" | "important" | "nice-to-have" | null;
  notes: string;
}

export interface ProductComparison {
  id: string;
  competitor: string;
  product: string;
  pricing: {
    model: string;
    startingPrice: number | null;
    enterprisePrice: number | null;
    currency: string;
  };
  features: FeatureComparison[];
  strengths: string[];
  weaknesses: string[];
  marketPosition: "leader" | "challenger" | "niche" | "follower" | null;
}

export interface MarketPosition {
  id: string;
  competitor: string;
  position: {
    value: number | null;
    price: number | null;
    volume: number | null;
  };
  quadrant: "leader" | "challenger" | "niche" | "follower" | null;
  movement: "rising" | "stable" | "declining" | null;
  keyDifferentiators: string[];
}

export interface CompetitiveAdvantage {
  id: string;
  type: "technology" | "cost" | "service" | "brand" | "distribution" | "partnerships";
  advantage: string;
  description: string;
  sustainability: "high" | "medium" | "low" | null;
  competitorResponse: string[];
  timeToReplicate: number | null;
  strategicImportance: "critical" | "important" | "moderate" | null;
}

export interface StrategyRecommendation {
  id: string;
  category: "positioning" | "product" | "pricing" | "marketing" | "partnerships";
  title: string;
  description: string;
  rationale: string;
  expectedImpact: "high" | "medium" | "low" | null;
  implementationComplexity: "high" | "medium" | "low" | null;
  timeframe: "immediate" | "short-term" | "long-term" | null;
  resources: string[];
  metrics: string[];
  risks: string[];
}

export interface UseCompetitiveDataReturn {
  competitors: Competitor[];
  swotAnalyses: SWOTAnalysis[];
  productComparisons: ProductComparison[];
  marketPositions: MarketPosition[];
  competitiveAdvantages: CompetitiveAdvantage[];
  strategyRecommendations: StrategyRecommendation[];
  isLoading: boolean;
  isConnected: boolean;
  lastUpdated: Date;
  error: string | null;
  refreshData: () => void;
}

/**
 * Hook that fetches all competitive data from Django API
 * Replaces previous Xano-based approach with direct database access
 */
export function useCompetitiveDataAPI(): UseCompetitiveDataReturn {
  const baseUrl = import.meta.env.VITE_DJANGO_API_URL || '/api';
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [swotAnalyses, setSWOTAnalyses] = useState<SWOTAnalysis[]>([]);
  const [productComparisons, setProductComparisons] = useState<ProductComparison[]>([]);
  const [marketPositions, setMarketPositions] = useState<MarketPosition[]>([]);
  const [competitiveAdvantages, setCompetitiveAdvantages] = useState<CompetitiveAdvantage[]>([]);
  const [strategyRecommendations, setStrategyRecommendations] = useState<StrategyRecommendation[]>([]);

  const fetchList = async (endpoint: string) => {
    const response = await fetch(`${baseUrl}${endpoint}`);
    if (!response.ok) {
      throw new Error(`${endpoint} returned ${response.status}`);
    }

    const payload = await response.json();
    return Array.isArray(payload) ? payload : payload.results || [];
  };

  const toSwotItems = (items: unknown): SWOTItem[] => {
    if (!Array.isArray(items)) {
      return [];
    }

    return items.map((item) => {
      if (typeof item === "string") {
        return {
          factor: item,
          description: item,
          impact: "medium" as const,
          confidence: 70,
        };
      }

      const source = item as Record<string, unknown>;
      return {
        factor: String(source.factor || source.name || "Item"),
        description: String(
          source.description || source.factor || source.name || "",
        ),
        impact:
          source.impact === "high" || source.impact === "medium" || source.impact === "low"
            ? source.impact
            : ("medium" as const),
        confidence:
          typeof source.confidence === "number" && Number.isFinite(source.confidence)
            ? source.confidence
            : null,
      };
    });
  };

  const toFeatureLevel = (value: unknown): "excellent" | "good" | "basic" | "missing" | null => {
    const normalized = String(value || "").toLowerCase();
    if (normalized === "excellent" || normalized === "good" || normalized === "basic" || normalized === "missing") {
      return normalized;
    }

    return null;
  };

  const toCategory = (strategyType: unknown): StrategyRecommendation["category"] => {
    switch (String(strategyType)) {
      case "pricing":
        return "pricing";
      case "product":
        return "product";
      case "marketing":
        return "marketing";
      case "partnership":
        return "partnerships";
      default:
        return "positioning";
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const [
        competitorsRes,
        swotRes,
        productsRes,
        positionsRes,
        advantagesRes,
        strategyRes,
      ] = await Promise.all([
        fetchList(`/market/competitors/`),
        fetchList(`/market/swot-analyses/`),
        fetchList(`/market/product-comparisons/`),
        fetchList(`/market/market-positions/`),
        fetchList(`/market/competitive-advantages/`),
        fetchList(`/market/strategy-recommendations/`),
      ]);

      const competitorsList: Competitor[] = competitorsRes.map((competitor: any) => ({
        id: String(competitor.id),
        name: competitor.name,
        type:
          competitor.competitor_type === "indirect" || competitor.competitor_type === "substitute"
            ? competitor.competitor_type
            : "direct",
        marketShare: Number(competitor.market_share || 0),
        revenue:
          typeof competitor.revenue === "number" && Number.isFinite(competitor.revenue)
            ? competitor.revenue
            : null,
        employees:
          typeof competitor.employees === "number" && Number.isFinite(competitor.employees)
            ? competitor.employees
            : null,
        founded:
          typeof competitor.founded === "number" && Number.isFinite(competitor.founded)
            ? competitor.founded
            : null,
        headquarters: String(competitor.headquarters || ""),
        website: competitor.website || "",
        description: competitor.description || "",
        keyProducts: Array.isArray(competitor.key_products) ? competitor.key_products : [],
        targetMarkets: Array.isArray(competitor.target_markets) ? competitor.target_markets : [],
        fundingStage: String(competitor.funding_stage || ""),
        lastFunding:
          typeof competitor.last_funding === "number" && Number.isFinite(competitor.last_funding)
            ? competitor.last_funding
            : null,
      }));

      const swotList: SWOTAnalysis[] = swotRes.map((swot: any) => ({
        id: String(swot.id),
        competitor: swot.competitor_name,
        strengths: toSwotItems(swot.strengths),
        weaknesses: toSwotItems(swot.weaknesses),
        opportunities: toSwotItems(swot.opportunities),
        threats: toSwotItems(swot.threats),
        overallScore: Number(swot.overall_score || 0),
        lastUpdated: swot.created_at ? new Date(swot.created_at) : new Date(),
      }));

      const productsList: ProductComparison[] = productsRes.map((product: any) => {
        const pricing = product.pricing_comparison && typeof product.pricing_comparison === "object"
          ? product.pricing_comparison
          : {};

        const featureEntries =
          product.features && typeof product.features === "object"
            ? Object.entries(product.features)
            : [];

        const marketPosition: ProductComparison["marketPosition"] =
          product.market_position === "premium"
            ? "leader"
            : product.market_position === "aligned"
              ? "challenger"
              : product.market_position === "competitive"
                ? "niche"
                : "follower";

        return {
          id: String(product.id),
          competitor: Array.isArray(product.competitor_products) && product.competitor_products.length > 0
            ? String(product.competitor_products[0])
            : "",
          product: product.product_name,
          pricing: {
            model: String(pricing.model || ""),
            startingPrice:
              typeof (pricing.startingPrice ?? pricing.starting_price) === "number"
                ? (pricing.startingPrice ?? pricing.starting_price)
                : null,
            enterprisePrice:
              typeof (pricing.enterprisePrice ?? pricing.enterprise_price) === "number"
                ? (pricing.enterprisePrice ?? pricing.enterprise_price)
                : null,
            currency: String(pricing.currency || ""),
          },
          features: featureEntries.map(([featureName, featureValue]) => ({
            feature: featureName,
            ourProduct:
              typeof featureValue === "object" && featureValue !== null
                ? toFeatureLevel((featureValue as any).ourProduct ?? (featureValue as any).our_product)
                : null,
            competitor:
              typeof featureValue === "object" && featureValue !== null
                ? toFeatureLevel((featureValue as any).competitor)
                : toFeatureLevel(featureValue),
            importance:
              typeof featureValue === "object" && featureValue !== null
                ? ((featureValue as any).importance as "critical" | "important" | "nice-to-have" | null) ?? null
                : null,
            notes:
              typeof featureValue === "string"
                ? featureValue
                : String((featureValue as any)?.notes || ""),
          })),
          strengths: Array.isArray(product.strengths) ? product.strengths : [],
          weaknesses: Array.isArray(product.weaknesses) ? product.weaknesses : [],
          marketPosition,
        };
      });

      const positionsList: MarketPosition[] = positionsRes.map((position: any) => {
        const marketShare =
          typeof position.market_share_estimate === "number" ? position.market_share_estimate : null;

        return {
          id: String(position.id),
          competitor: position.market_leader || position.market_segment,
          position: {
            value:
              typeof position.value_score === "number" && Number.isFinite(position.value_score)
                ? position.value_score
                : null,
            price:
              typeof position.price_score === "number" && Number.isFinite(position.price_score)
                ? position.price_score
                : null,
            volume: marketShare,
          },
          quadrant:
            position.quadrant === "leader" ||
            position.quadrant === "challenger" ||
            position.quadrant === "niche" ||
            position.quadrant === "follower"
              ? position.quadrant
              : null,
          movement:
            position.movement === "rising" ||
            position.movement === "stable" ||
            position.movement === "declining"
              ? position.movement
              : null,
          keyDifferentiators: Array.isArray(position.primary_competitors)
            ? position.primary_competitors
            : [],
        };
      });

      const advantagesList: CompetitiveAdvantage[] = advantagesRes.map((advantage: any) => {
        const mappedType: CompetitiveAdvantage["type"] =
          advantage.advantage_type === "price"
            ? "cost"
            : advantage.advantage_type === "service"
              ? "service"
              : advantage.advantage_type === "brand"
                ? "brand"
                : advantage.advantage_type === "distribution"
                  ? "distribution"
                  : advantage.advantage_type === "technology"
                    ? "technology"
                    : "partnerships";

        const sustainabilityScore =
          typeof advantage.sustainability === "number" && Number.isFinite(advantage.sustainability)
            ? advantage.sustainability
            : null;

        const mappedSustainability: CompetitiveAdvantage["sustainability"] =
          sustainabilityScore === null
            ? null
            : sustainabilityScore >= 70
              ? "high"
              : sustainabilityScore >= 40
                ? "medium"
                : "low";

        const mappedImportance: CompetitiveAdvantage["strategicImportance"] =
          advantage.strategic_importance === "critical" ||
          advantage.strategic_importance === "important" ||
          advantage.strategic_importance === "moderate"
            ? advantage.strategic_importance
            : null;

        return {
          id: String(advantage.id),
          type: mappedType,
          advantage: advantage.advantage,
          description: advantage.description,
          sustainability: mappedSustainability,
          competitorResponse: Array.isArray(advantage.competitor_response) ? advantage.competitor_response : [],
          timeToReplicate:
            typeof advantage.time_to_replicate === "number" && Number.isFinite(advantage.time_to_replicate)
              ? advantage.time_to_replicate
              : null,
          strategicImportance: mappedImportance,
        };
      });

      const strategyList: StrategyRecommendation[] = strategyRes.map((strategy: any) => {
        const steps = Array.isArray(strategy.implementation_steps)
          ? strategy.implementation_steps.map(String)
          : [];
        const outcomes = Array.isArray(strategy.expected_outcomes)
          ? strategy.expected_outcomes.map(String)
          : [];
        const metrics = Array.isArray(strategy.success_metrics)
          ? strategy.success_metrics.map(String)
          : [];

        return {
          id: String(strategy.id),
          category: toCategory(strategy.strategy_type),
          title: strategy.title,
          description: strategy.description,
          rationale: strategy.rationale || "",
          expectedImpact:
            strategy.expected_impact === "high" ||
            strategy.expected_impact === "medium" ||
            strategy.expected_impact === "low"
              ? strategy.expected_impact
              : null,
          implementationComplexity:
            strategy.implementation_complexity === "high" ||
            strategy.implementation_complexity === "medium" ||
            strategy.implementation_complexity === "low"
              ? strategy.implementation_complexity
              : null,
          timeframe:
            strategy.timeframe === "immediate" ||
            strategy.timeframe === "short-term" ||
            strategy.timeframe === "long-term"
              ? strategy.timeframe
              : null,
          resources: steps,
          metrics,
          risks: Array.isArray(strategy.risks) ? strategy.risks.map(String) : [],
        };
      });

      setCompetitors(competitorsList);
      setSWOTAnalyses(swotList);
      setProductComparisons(productsList);
      setMarketPositions(positionsList);
      setCompetitiveAdvantages(advantagesList);
      setStrategyRecommendations(strategyList);
      
      setIsConnected(true);
      setLastUpdated(new Date());
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load competitive data';
      setError(errorMsg);
      setIsConnected(false);
      console.error('Competitive Data API Error:', errorMsg);
      toast({
        title: "Error Loading Competitive Data",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    competitors,
    swotAnalyses,
    productComparisons,
    marketPositions,
    competitiveAdvantages,
    strategyRecommendations,
    isLoading,
    isConnected,
    lastUpdated,
    error,
    refreshData: fetchData,
  };
}
