import { useState, useEffect } from "react";
import { useToast } from "./use-toast";

export interface MarketSize {
  id: string;
  name: string;
  tam: number;
  sam: number;
  som: number;
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
  priority: 'high' | 'medium' | 'low';
}

export interface MarketTrend {
  id: string;
  category: string;
  trend: string;
  impact: 'high' | 'medium' | 'low';
  direction: 'positive' | 'negative' | 'neutral';
  timeframe: string;
  description: string;
  sources: string[];
  confidence: number | null;
}

export interface DemandFactor {
  name: string;
  impact: number;
  weight: number;
}

export interface ForecastScenario {
  name: string;
  probability: number;
  demand: number;
}

export interface DemandForecast {
  id: string;
  segment: string;
  period: string;
  currentDemand: number | null;
  forecastDemand: number;
  confidence: number;
  assumptions: string;
  factors: DemandFactor[];
  scenarios: ForecastScenario[];
}

export interface IndustryInsight {
  id: string;
  title: string;
  description: string;
  type: 'trend' | 'threat' | 'opportunity' | 'observation';
  impact: 'high' | 'medium' | 'low';
  timeframe: string;
  probability: number | null;
  actionItems: string[];
  sources: string[];
}

export interface ReportMetric {
  label: string;
  value: string;
  trend: "up" | "down" | "stable";
}

export interface ReportNote {
  id: string;
  title: string;
  content: string;
  summary: string;
  author: string;
  confidence: number | null;
  dateGenerated: string;
  keyMetrics: ReportMetric[];
  insights: string[];
  recommendations: string[];
  nextSteps: string[];
  category: string;
  importance: 'critical' | 'high' | 'medium' | 'low';
}

interface MarketSummary {
  id: string;
  title: string;
  content: string;
  keyPoints: string[];
}

interface MarketRecommendation {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  implementationTimeline: string;
  expectedImpact: string;
}

interface MarketActionItem {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  timeline: string;
  owner: string;
}

interface MarketNextStep {
  id: string;
  step: string;
  owner: string;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed';
}

export interface UseMarketDataReturn {
  marketSizes: MarketSize[];
  customerSegments: CustomerSegment[];
  marketTrends: MarketTrend[];
  demandForecasts: DemandForecast[];
  industryInsights: IndustryInsight[];
  reportNotes: ReportNote[];
  marketSummaries: MarketSummary[];
  marketRecommendations: MarketRecommendation[];
  marketActionItems: MarketActionItem[];
  marketNextSteps: MarketNextStep[];
  isLoading: boolean;
  isConnected: boolean;
  lastUpdated: Date;
  error: string | null;
  refreshData: () => void;
}

/**
 * Hook that fetches all market data from Django API
 * Replaces previous Xano-based approach with direct database access
 */
export function useMarketDataAPI(): UseMarketDataReturn {
  const baseUrl = import.meta.env.VITE_DJANGO_API_URL || '/api';
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const [marketSizes, setMarketSizes] = useState<MarketSize[]>([]);
  const [customerSegments, setCustomerSegments] = useState<CustomerSegment[]>([]);
  const [marketTrends, setMarketTrends] = useState<MarketTrend[]>([]);
  const [demandForecasts, setDemandForecasts] = useState<DemandForecast[]>([]);
  const [industryInsights, setIndustryInsights] = useState<IndustryInsight[]>([]);
  const [reportNotes, setReportNotes] = useState<ReportNote[]>([]);
  const [marketSummaries, setMarketSummaries] = useState<MarketSummary[]>([]);
  const [marketRecommendations, setMarketRecommendations] = useState<MarketRecommendation[]>([]);
  const [marketActionItems, setMarketActionItems] = useState<MarketActionItem[]>([]);
  const [marketNextSteps, setMarketNextSteps] = useState<MarketNextStep[]>([]);

  const fetchList = async (endpoint: string) => {
    const response = await fetch(`${baseUrl}${endpoint}`);
    if (!response.ok) {
      throw new Error(`${endpoint} returned ${response.status}`);
    }

    const payload = await response.json();
    return Array.isArray(payload) ? payload : payload.results || [];
  };

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const endpointEntries = [
        { key: "sizes", endpoint: "/market/market-sizes/" },
        { key: "segments", endpoint: "/market/customer-segments/" },
        { key: "trends", endpoint: "/market/market-trends/" },
        { key: "forecasts", endpoint: "/market/demand-forecasts/" },
        { key: "insights", endpoint: "/market/industry-insights/" },
        { key: "notes", endpoint: "/market/report-notes/" },
        { key: "summaries", endpoint: "/market/market-summary/" },
        { key: "recommendations", endpoint: "/market/market-recommendations/" },
        { key: "actions", endpoint: "/market/market-actions/" },
        { key: "nextSteps", endpoint: "/market/market-next-steps/" },
      ] as const;

      const settledResults = await Promise.allSettled(
        endpointEntries.map(({ endpoint }) => fetchList(endpoint)),
      );

      const failedEndpoints: string[] = [];
      const datasets: Record<string, any[]> = {};

      settledResults.forEach((result, index) => {
        const { key, endpoint } = endpointEntries[index];
        if (result.status === "fulfilled") {
          datasets[key] = result.value;
          return;
        }

        failedEndpoints.push(endpoint);
        datasets[key] = [];
      });

      const sizes = datasets.sizes;
      const segments = datasets.segments;
      const trends = datasets.trends;
      const forecasts = datasets.forecasts;
      const insights = datasets.insights;
      const notes = datasets.notes;
      const summaries = datasets.summaries;
      const recommendations = datasets.recommendations;
      const actions = datasets.actions;
      const nextSteps = datasets.nextSteps;

      // Transform data to match component expectations
      const transformedSizes: MarketSize[] = sizes.map((size: any) => ({
        id: String(size.id),
        name: size.name,
        tam: size.tam,
        sam: size.sam,
        som: size.som,
        growthRate: size.growth_rate,
        timeframe: size.timeframe,
        currency: size.currency,
        region: size.region,
      }));

      const transformedSegments: CustomerSegment[] = segments.map((seg: any) => ({
        id: String(seg.id),
        name: seg.name,
        size: seg.market_size,
        percentage: seg.percentage_of_total,
        avgSpending: seg.avg_spending,
        growthRate: seg.growth_rate,
        characteristics: seg.characteristics,
        region: seg.region,
        priority: seg.priority as 'high' | 'medium' | 'low',
      }));

      const transformedTrends: MarketTrend[] = trends.map((trend: any) => ({
        id: String(trend.id),
        category: trend.category,
        trend: trend.name,
        impact: trend.impact as 'high' | 'medium' | 'low',
        direction: trend.direction as 'positive' | 'negative' | 'neutral',
        timeframe: trend.timeframe,
        description: trend.description,
        sources: Array.isArray(trend.sources) ? trend.sources : [],
        confidence:
          typeof trend.confidence === 'number' && Number.isFinite(trend.confidence)
            ? trend.confidence
            : null,
      }));

      const transformedForecasts: DemandForecast[] = forecasts.map((forecast: any) => ({
        id: String(forecast.id),
        segment: forecast.segment,
        period: forecast.period,
        currentDemand:
          typeof forecast.current_demand === 'number' && Number.isFinite(forecast.current_demand)
            ? forecast.current_demand
            : null,
        forecastDemand: forecast.forecasted_demand,
        confidence: forecast.confidence_level,
        assumptions: forecast.assumptions,
        factors: Array.isArray(forecast.key_factors) ? forecast.key_factors : [],
        scenarios: Array.isArray(forecast.scenarios) ? forecast.scenarios : [],
      }));

      const transformedInsights: IndustryInsight[] = insights.map((insight: any) => ({
        id: String(insight.id),
        title: insight.title,
        description: insight.description,
        type: insight.insight_type as 'trend' | 'threat' | 'opportunity' | 'observation',
        impact: insight.impact_level as 'high' | 'medium' | 'low',
        timeframe: insight.timeframe,
        probability:
          typeof insight.probability === 'number' && Number.isFinite(insight.probability)
            ? insight.probability
            : null,
        actionItems: Array.isArray(insight.action_items) ? insight.action_items : [],
        sources: Array.isArray(insight.sources) ? insight.sources : [],
      }));

      const transformedNotes: ReportNote[] = notes.map((note: any) => ({
        id: String(note.id),
        title: note.title,
        content: note.content,
        summary: String(note.summary || ""),
        author: String(note.author || ""),
        confidence:
          typeof note.confidence === 'number' && Number.isFinite(note.confidence)
            ? note.confidence
            : null,
        dateGenerated: String(note.date_generated || note.created_at || ""),
        keyMetrics: Array.isArray(note.key_metrics)
          ? note.key_metrics
              .map((metric: any) => ({
                label: String(metric?.label || ""),
                value: String(metric?.value || ""),
                trend:
                  metric?.trend === 'up' || metric?.trend === 'down' || metric?.trend === 'stable'
                    ? metric.trend
                    : 'stable',
              }))
              .filter((metric: ReportMetric) => metric.label.length > 0)
          : [],
        insights: Array.isArray(note.insights) ? note.insights.map(String) : [],
        recommendations: Array.isArray(note.recommendations)
          ? note.recommendations.map(String)
          : [],
        nextSteps: Array.isArray(note.next_steps) ? note.next_steps.map(String) : [],
        category: note.category,
        importance: note.importance as 'critical' | 'high' | 'medium' | 'low',
      }));

      const transformedSummaries: MarketSummary[] = summaries.map((summary: any) => ({
        id: String(summary.id),
        title: summary.title,
        content: summary.content,
        keyPoints: Array.isArray(summary.key_points) ? summary.key_points : [],
      }));

      const transformedRecommendations: MarketRecommendation[] = recommendations.map((recommendation: any) => ({
        id: String(recommendation.id),
        title: recommendation.title,
        description: recommendation.description,
        priority: recommendation.priority as 'high' | 'medium' | 'low',
        implementationTimeline: recommendation.implementation_timeline || "",
        expectedImpact: recommendation.expected_impact || "",
      }));

      const transformedActions: MarketActionItem[] = actions.map((action: any) => ({
        id: String(action.id),
        title: action.title,
        description: action.description,
        priority: action.priority as 'high' | 'medium' | 'low',
        timeline: action.timeline || "",
        owner: action.owner || "",
      }));

      const transformedNextSteps: MarketNextStep[] = nextSteps.map((nextStep: any) => ({
        id: String(nextStep.id),
        step: nextStep.step,
        owner: nextStep.owner || "",
        dueDate: nextStep.due_date || "",
        status: nextStep.status as 'pending' | 'in_progress' | 'completed',
      }));

      setMarketSizes(transformedSizes);
      setCustomerSegments(transformedSegments);
      setMarketTrends(transformedTrends);
      setDemandForecasts(transformedForecasts);
      setIndustryInsights(transformedInsights);
      setReportNotes(transformedNotes);
      setMarketSummaries(transformedSummaries);
      setMarketRecommendations(transformedRecommendations);
      setMarketActionItems(transformedActions);
      setMarketNextSteps(transformedNextSteps);

      if (failedEndpoints.length > 0) {
        const errorMsg = `Partial market data load failure: ${failedEndpoints.join(", ")}`;
        setError(errorMsg);
        setIsConnected(false);
        console.warn("Market Data API Warning:", errorMsg);
      } else {
        setError(null);
        setIsConnected(true);
      }

      setLastUpdated(new Date());
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load market data';
      setError(errorMsg);
      setIsConnected(false);
      console.error('Market Data API Error:', errorMsg);
      toast({
        title: "Error Loading Market Data",
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
    marketSizes,
    customerSegments,
    marketTrends,
    demandForecasts,
    industryInsights,
    reportNotes,
    marketSummaries,
    marketRecommendations,
    marketActionItems,
    marketNextSteps,
    isLoading,
    isConnected,
    lastUpdated,
    error,
    refreshData: fetchData,
  };
}
