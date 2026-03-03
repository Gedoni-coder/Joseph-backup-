import { useState, useEffect, useCallback } from "react";

interface EconomicMetric {
  id: number;
  context: string;
  name: string;
  value: number;
  change: number;
  unit: string;
  trend: string;
  category: string;
}

interface EconomicNews {
  id: number;
  context: string;
  title: string;
  summary: string;
  source: string;
  timestamp: string;
  impact: string;
  category: string;
}

interface EconomicForecast {
  id: number;
  context: string;
  indicator: string;
  period: string;
  forecast: number;
  confidence: number;
  range_low: number;
  range_high: number;
}

interface EconomicEvent {
  id: number;
  context: string;
  title: string;
  date: string;
  description: string;
  impact: string;
  category: string;
}

interface EconomicDataState {
  metrics: Record<string, EconomicMetric[]>;
  news: Record<string, EconomicNews[]>;
  forecasts: Record<string, EconomicForecast[]>;
  events: Record<string, EconomicEvent[]>;
  lastUpdated: Date | null;
  isLoading: boolean;
  error: string | null;
  isConnected: boolean;
}

function groupByContext<T extends { context: string }>(
  items: T[],
): Record<string, T[]> {
  return items.reduce(
    (acc, item) => {
      if (!acc[item.context]) {
        acc[item.context] = [];
      }
      acc[item.context].push(item);
      return acc;
    },
    {} as Record<string, T[]>,
  );
}

export function useEconomicData(companyName?: string) {
  const [metrics, setMetrics] = useState<Record<string, EconomicMetric[]>>({});
  const [news, setNews] = useState<Record<string, EconomicNews[]>>({});
  const [forecasts, setForecasts] = useState<
    Record<string, EconomicForecast[]>
  >({});
  const [events, setEvents] = useState<Record<string, EconomicEvent[]>>({});
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Use default if not provided
  const effectiveCompanyName = companyName || "E-buy";

  const RAW_API_BASE =
    (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() || "";
  const RAW_ECON_ENDPOINT =
    (
      import.meta.env.VITE_ECONOMIC_API_ENDPOINT as string | undefined
    )?.trim() || "";
  const API_BASE_URL =
    RAW_API_BASE && RAW_ECON_ENDPOINT
      ? `${RAW_API_BASE.replace(/\/$/, "")}${RAW_ECON_ENDPOINT.startsWith("/") ? RAW_ECON_ENDPOINT : `/${RAW_ECON_ENDPOINT}`}`
      : "";
  const HAS_VALID_API = /^https?:\/\//i.test(API_BASE_URL);
  const ECON_ENABLED =
    (
      import.meta.env.VITE_ECONOMIC_API_ENABLED as string | undefined
    )?.toLowerCase() === "true";

  const fetchMetrics = useCallback(
    async (context?: string): Promise<Record<string, EconomicMetric[]>> => {
      try {
        if (!ECON_ENABLED || !HAS_VALID_API)
          throw new Error("Economic API disabled or not configured");
        const url = context
          ? `${API_BASE_URL}/metrics/?context=${encodeURIComponent(context)}`
          : `${API_BASE_URL}/metrics/`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch economic metrics");
        const data = await response.json();
        return groupByContext<EconomicMetric>(data);
      } catch {
        return getMockMetricsData(effectiveCompanyName);
      }
    },
    [effectiveCompanyName],
  );

  const fetchNews = useCallback(
    async (context?: string): Promise<Record<string, EconomicNews[]>> => {
      try {
        if (!ECON_ENABLED || !HAS_VALID_API)
          throw new Error("Economic API disabled or not configured");
        const url = context
          ? `${API_BASE_URL}/news/?context=${encodeURIComponent(context)}`
          : `${API_BASE_URL}/news/`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch economic news");
        const data = await response.json();
        return groupByContext<EconomicNews>(data);
      } catch {
        return getMockNewsData(effectiveCompanyName);
      }
    },
    [effectiveCompanyName],
  );

  const fetchForecasts = useCallback(
    async (context?: string): Promise<Record<string, EconomicForecast[]>> => {
      try {
        if (!ECON_ENABLED || !HAS_VALID_API)
          throw new Error("Economic API disabled or not configured");
        const url = context
          ? `${API_BASE_URL}/forecasts/?context=${encodeURIComponent(context)}`
          : `${API_BASE_URL}/forecasts/`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch economic forecasts");
        const data = await response.json();
        return groupByContext<EconomicForecast>(data);
      } catch {
        return getMockForecastsData(effectiveCompanyName);
      }
    },
    [effectiveCompanyName],
  );

  const fetchEvents = useCallback(
    async (context?: string): Promise<Record<string, EconomicEvent[]>> => {
      try {
        if (!ECON_ENABLED || !HAS_VALID_API)
          throw new Error("Economic API disabled or not configured");
        const url = context
          ? `${API_BASE_URL}/events/?context=${encodeURIComponent(context)}`
          : `${API_BASE_URL}/events/`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch economic events");
        const data = await response.json();
        return groupByContext<EconomicEvent>(data);
      } catch {
        return getMockEventsData(effectiveCompanyName);
      }
    },
    [effectiveCompanyName],
  );

  const fetchAllData = useCallback(
    async (context?: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const [metricsData, newsData, forecastsData, eventsData] =
          await Promise.all([
            fetchMetrics(context),
            fetchNews(context),
            fetchForecasts(context),
            fetchEvents(context),
          ]);
        setMetrics(metricsData);
        setNews(newsData);
        setForecasts(forecastsData);
        setEvents(eventsData);
        setLastUpdated(new Date());
        setIsConnected(HAS_VALID_API);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        setIsConnected(false);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchMetrics, fetchNews, fetchForecasts, fetchEvents],
  );

  const reconnect = useCallback(async () => {
    setIsConnected(false);
    await fetchAllData();
  }, [fetchAllData]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  return {
    metrics,
    news,
    forecasts,
    events,
    lastUpdated,
    isLoading,
    error,
    isConnected,
    refreshData: fetchAllData,
    reconnect,
  };
}

// Mock data functions for fallback - E-commerce Focus
function getMockMetricsData(companyName: string = "E-buy"): Record<string, EconomicMetric[]> {
  const now = new Date();
  return {
    national: [
      {
        id: 1,
        context: "national",
        name: "E-commerce GMV Growth",
        value: 18.5,
        change: 2.3,
        unit: "% YoY",
        trend: "up",
        category: "E-commerce",
      },
      {
        id: 2,
        context: "national",
        name: "Consumer Confidence Index",
        value: 98.2,
        change: 1.5,
        unit: "Index",
        trend: "up",
        category: "Sentiment",
      },
      {
        id: 3,
        context: "national",
        name: "Digital Payment Adoption",
        value: 42.0,
        change: 4.2,
        unit: "% of Transactions",
        trend: "up",
        category: "Payments",
      },
      {
        id: 4,
        context: "national",
        name: "Mobile Commerce Share",
        value: 87.3,
        change: 3.1,
        unit: "%",
        trend: "up",
        category: "E-commerce",
      },
      {
        id: 5,
        context: "national",
        name: "Inflation (CPI)",
        value: 11.2,
        change: -0.2,
        unit: "% YoY",
        trend: "down",
        category: "Macro",
      },
      {
        id: 6,
        context: "national",
        name: "FX USD/NGN",
        value: 1450.0,
        change: -25.0,
        unit: "rate",
        trend: "down",
        category: "FX",
      },
      {
        id: 7,
        context: "national",
        name: "Logistics Cost Index",
        value: 102.5,
        change: -7.0,
        unit: "Index",
        trend: "down",
        category: "Logistics",
      },
      {
        id: 8,
        context: "national",
        name: "Online Retail Penetration",
        value: 8.5,
        change: 1.2,
        unit: "%",
        trend: "up",
        category: "E-commerce",
      },
    ],
    international: [
      {
        id: 9,
        context: "international",
        name: "Global E-commerce Growth",
        value: 12.8,
        change: 0.5,
        unit: "%",
        trend: "up",
        category: "E-commerce",
      },
      {
        id: 10,
        context: "international",
        name: "Cross-border Trade Volume",
        value: 325.0,
        change: 22.0,
        unit: "B USD",
        trend: "up",
        category: "Trade",
      },
    ],
    local: [
      {
        id: 11,
        context: "local",
        name: "Lagos E-commerce Activity",
        value: 145.0,
        change: 12.5,
        unit: "Index",
        trend: "up",
        category: "Regional",
      },
    ],
    state: [
      {
        id: 12,
        context: "state",
        name: "Lagos State Digital Economy",
        value: 68.0,
        change: 5.2,
        unit: "Index",
        trend: "up",
        category: "Regional",
      },
    ],
  };
}

function getMockNewsData(companyName: string = "E-buy"): Record<string, EconomicNews[]> {
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  const threeHoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000);
  const sixHoursAgo = new Date(now.getTime() - 6 * 60 * 60 * 1000);
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  return {
    national: [
      {
        id: 1,
        context: "national",
        title: "E-commerce Logistics Costs Decline 7% Month-over-Month",
        summary: `Improved last-mile delivery infrastructure and bulk freight agreements reduce fulfillment costs for online marketplaces like ${companyName}. Logistics bottlenecks ease ahead of peak shopping seasons. Major courier services expand capacity in Lagos and Abuja.`,
        source: "MarketWatch",
        timestamp: oneHourAgo.toISOString(),
        impact: "high",
        category: "Logistics",
      },
      {
        id: 2,
        context: "national",
        title: "Digital Payment Adoption Surges in Online Retail",
        summary: `Wallet and BNPL (Buy Now Pay Later) share rises to 42% of marketplace checkouts. Mobile money transactions in e-commerce up 28% YoY, benefiting platforms like ${companyName}, Jumia, and Konga. Paystack and Flutterwave report record transaction volumes.`,
        source: "FinDaily",
        timestamp: threeHoursAgo.toISOString(),
        impact: "high",
        category: "Payments",
      },
      {
        id: 3,
        context: "national",
        title: "Consumer Spending on Online Marketplaces Grows 15%",
        summary: "Nigerian consumers increasing online purchases across categories. Electronics, fashion, and groceries drive GMV growth for major e-commerce platforms. Average order value increases to ₦24,500.",
        source: "NBS",
        timestamp: sixHoursAgo.toISOString(),
        impact: "positive",
        category: "Consumer Spending",
      },
      {
        id: 4,
        context: "national",
        title: "Cross-border E-commerce Trade Increases 22%",
        summary: "International marketplace orders up significantly as consumers access global products. Currency stability improves import affordability. Customs processes streamlined for small parcel deliveries.",
        source: "TradeMonitor",
        timestamp: oneDayAgo.toISOString(),
        impact: "positive",
        category: "Trade",
      },
      {
        id: 5,
        context: "national",
        title: "Mobile Commerce Dominates: 87% of Transactions",
        summary: "Mobile-first shopping behavior accelerates. E-commerce platforms investing heavily in app optimization and mobile payment integration. PWA adoption increases among marketplaces.",
        source: "TechCrunch Africa",
        timestamp: oneDayAgo.toISOString(),
        impact: "medium",
        category: "Technology",
      },
      {
        id: 6,
        context: "national",
        title: "Holiday Shopping Season Boosts E-commerce GMV",
        summary: `Black Friday and December sales drive 45% GMV increase for major marketplaces. ${companyName}, Jumia, and Konga report record daily transaction volumes. Consumer electronics and fashion lead categories.`,
        source: "BusinessDay",
        timestamp: oneDayAgo.toISOString(),
        impact: "high",
        category: "Seasonal",
      },
    ],
    international: [
      {
        id: 7,
        context: "international",
        title: "Global E-commerce Market Expands 12.8%",
        summary: "Worldwide online retail continues strong growth trajectory. African e-commerce markets show fastest expansion rates. Investment in logistics infrastructure accelerates.",
        source: "Statista",
        timestamp: oneDayAgo.toISOString(),
        impact: "positive",
        category: "Global Trends",
      },
    ],
  };
}

function getMockForecastsData(companyName: string = "E-buy"): Record<string, EconomicForecast[]> {
  return {
    national: [
      {
        id: 1,
        context: "national",
        indicator: "E-commerce GMV Growth",
        period: "Next 6M",
        forecast: 18.5,
        confidence: 75,
        range_low: 15.0,
        range_high: 22.0,
      },
      {
        id: 2,
        context: "national",
        indicator: "Retail Sales (Online)",
        period: "Next 6M",
        forecast: 12.3,
        confidence: 72,
        range_low: 9.5,
        range_high: 15.1,
      },
      {
        id: 3,
        context: "national",
        indicator: "Parcel Volume Growth",
        period: "Next 6M",
        forecast: 14.2,
        confidence: 68,
        range_low: 11.0,
        range_high: 17.5,
      },
      {
        id: 4,
        context: "national",
        indicator: "Digital Payment Transaction Volume",
        period: "Next 6M",
        forecast: 25.0,
        confidence: 70,
        range_low: 20.0,
        range_high: 30.0,
      },
      {
        id: 5,
        context: "national",
        indicator: "Mobile Commerce Penetration",
        period: "Next 12M",
        forecast: 92.0,
        confidence: 80,
        range_low: 88.0,
        range_high: 95.0,
      },
      {
        id: 6,
        context: "national",
        indicator: "Average Order Value (AOV)",
        period: "Next 6M",
        forecast: 26.5,
        confidence: 65,
        range_low: 23.0,
        range_high: 29.5,
      },
    ],
    international: [
      {
        id: 7,
        context: "international",
        indicator: "Cross-border E-commerce Growth",
        period: "Next 12M",
        forecast: 28.0,
        confidence: 70,
        range_low: 22.0,
        range_high: 34.0,
      },
    ],
  };
}

function getMockEventsData(companyName: string = "E-buy"): Record<string, EconomicEvent[]> {
  const now = new Date();
  return {
    national: [
      {
        id: 1,
        context: "national",
        title: "E-commerce Regulatory Framework Review",
        date: new Date(now.getFullYear(), 1, 15).toISOString().split('T')[0],
        description: `Government review of online marketplace regulations, consumer protection, and digital payment policies affecting ${companyName} and competitors. Expected to clarify VAT treatment and seller liability rules.`,
        impact: "high",
        category: "Policy",
      },
      {
        id: 2,
        context: "national",
        title: "Black Friday & Holiday Shopping Season",
        date: new Date(now.getFullYear(), 10, 29).toISOString().split('T')[0],
        description: `Peak e-commerce sales period. Marketplaces expect 40-60% GMV increase. Logistics and payment systems under pressure. ${companyName} and competitors launching major promotional campaigns.`,
        impact: "high",
        category: "Seasonal",
      },
      {
        id: 3,
        context: "national",
        title: "VAT Policy Review for Digital Services",
        date: new Date(now.getFullYear(), 3, 10).toISOString().split('T')[0],
        description: "Potential VAT rate adjustment for online marketplaces and digital services under consideration. Could impact seller commission structures and pricing.",
        impact: "medium",
        category: "Tax Policy",
      },
      {
        id: 4,
        context: "national",
        title: "Nigerian E-commerce Summit 2025",
        date: new Date(now.getFullYear(), 5, 20).toISOString().split('T')[0],
        description: `Annual industry conference featuring ${companyName}, Jumia, Konga, and other major players. Focus on logistics innovation, payment solutions, and market growth strategies.`,
        impact: "medium",
        category: "Industry Event",
      },
      {
        id: 5,
        context: "national",
        title: "Mobile Money Regulation Update",
        date: new Date(now.getFullYear(), 2, 5).toISOString().split('T')[0],
        description: "Central Bank updates mobile money and digital wallet regulations. Expected to expand BNPL options and improve payment integration for e-commerce.",
        impact: "high",
        category: "Financial Services",
      },
    ],
    international: [
      {
        id: 6,
        context: "international",
        title: "Global E-commerce Innovation Summit",
        date: new Date(now.getFullYear(), 8, 15).toISOString().split('T')[0],
        description: `International conference on e-commerce trends, AI in retail, and cross-border trade. Insights relevant for ${companyName}'s expansion strategy.`,
        impact: "medium",
        category: "Global Event",
      },
    ],
  };
}
