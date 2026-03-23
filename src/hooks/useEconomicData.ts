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

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

const normalizeContextKey = (rawContext: string): string => {
  const key = rawContext.toLowerCase().trim();
  if (key === "us" || key === "usa" || key === "country") return "national";
  if (key === "global") return "international";
  return key;
};

const isPaginatedResponse = <T>(payload: unknown): payload is PaginatedResponse<T> => {
  if (!payload || typeof payload !== "object") {
    return false;
  }
  return Array.isArray((payload as PaginatedResponse<T>).results);
};

function groupByContext<T extends { context: string }>(
  items: T[],
): Record<string, T[]> {
  return items.reduce(
    (acc, item) => {
      const contextKey = normalizeContextKey(item.context);
      if (!acc[contextKey]) {
        acc[contextKey] = [];
      }
      acc[contextKey].push({ ...item, context: contextKey });
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

  void companyName;

  const RAW_API_BASE =
    (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() || "";
  const RAW_ECON_ENDPOINT =
    (import.meta.env.VITE_ECONOMIC_API_ENDPOINT as string | undefined)?.trim() ||
    "/api/economic";
  const API_BASE_URL =
    RAW_API_BASE && RAW_ECON_ENDPOINT
      ? `${RAW_API_BASE.replace(/\/$/, "")}${RAW_ECON_ENDPOINT.startsWith("/") ? RAW_ECON_ENDPOINT : `/${RAW_ECON_ENDPOINT}`}`
      : "";
  const HAS_VALID_API = /^https?:\/\//i.test(API_BASE_URL);
  const ECON_ENABLED =
    (
      import.meta.env.VITE_ECONOMIC_API_ENABLED as string | undefined
    )?.toLowerCase() === "true";

  const assertApiConfiguration = useCallback(() => {
    if (!ECON_ENABLED) {
      throw new Error("Economic API is disabled. Set VITE_ECONOMIC_API_ENABLED=true.");
    }
    if (!HAS_VALID_API) {
      throw new Error(
        "Economic API base URL is invalid or missing. Set VITE_API_BASE_URL and VITE_ECONOMIC_API_ENDPOINT.",
      );
    }
  }, [ECON_ENABLED, HAS_VALID_API]);

  const fetchJson = useCallback(
    async <T>(path: string): Promise<T[]> => {
      assertApiConfiguration();
      const response = await fetch(`${API_BASE_URL}${path}`);
      if (!response.ok) {
        throw new Error(`Economic API request failed (${response.status}) for ${path}`);
      }

      const payload = (await response.json()) as unknown;
      if (Array.isArray(payload)) {
        return payload as T[];
      }
      if (isPaginatedResponse<T>(payload)) {
        return payload.results;
      }
      throw new Error(`Economic API returned unsupported payload shape for ${path}`);
    },
    [API_BASE_URL, assertApiConfiguration],
  );

  const fetchMetrics = useCallback(
    async (context?: string): Promise<Record<string, EconomicMetric[]>> => {
      const path = context
        ? `/metrics/?context=${encodeURIComponent(context)}`
        : "/metrics/";
      const data = await fetchJson<EconomicMetric>(path);
      return groupByContext<EconomicMetric>(data);
    },
    [fetchJson],
  );

  const fetchNews = useCallback(
    async (context?: string): Promise<Record<string, EconomicNews[]>> => {
      const path = context
        ? `/news/?context=${encodeURIComponent(context)}`
        : "/news/";
      const data = await fetchJson<EconomicNews>(path);
      return groupByContext<EconomicNews>(data);
    },
    [fetchJson],
  );

  const fetchForecasts = useCallback(
    async (context?: string): Promise<Record<string, EconomicForecast[]>> => {
      const path = context
        ? `/forecasts/?context=${encodeURIComponent(context)}`
        : "/forecasts/";
      const data = await fetchJson<EconomicForecast>(path);
      return groupByContext<EconomicForecast>(data);
    },
    [fetchJson],
  );

  const fetchEvents = useCallback(
    async (context?: string): Promise<Record<string, EconomicEvent[]>> => {
      const path = context
        ? `/events/?context=${encodeURIComponent(context)}`
        : "/events/";
      const data = await fetchJson<EconomicEvent>(path);
      return groupByContext<EconomicEvent>(data);
    },
    [fetchJson],
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
        setIsConnected(true);
      } catch (err) {
        setMetrics({});
        setNews({});
        setForecasts({});
        setEvents({});
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
