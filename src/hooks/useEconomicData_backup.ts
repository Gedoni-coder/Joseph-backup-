import { useState, useEffect, useCallback } from "react";

interface EconomicMetric {
  id: string;
  name: string;
  value: number;
  change: number;
  timestamp?: Date;
}

interface EconomicNews {
  id: string;
  title: string;
  content: string;
  date: string;
}

interface EconomicForecast {
  id: string;
  title: string;
  forecastValue: number;
  date: string;
}

interface EconomicEvent {
  id: string;
  name: string;
  date: string;
  description: string;
}

interface EconomicDataState {
  metrics: EconomicMetric[];
  news: EconomicNews[];
  forecasts: EconomicForecast[];
  events: EconomicEvent[];
  lastUpdated: Date | null;
  isLoading: boolean;
  error: string | null;
}

export function useEconomicData() {
  const [metrics, setMetrics] = useState<EconomicMetric[]>([]);
  const [news, setNews] = useState<EconomicNews[]>([]);
  const [forecasts, setForecasts] = useState<EconomicForecast[]>([]);
  const [events, setEvents] = useState<EconomicEvent[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + import.meta.env.VITE_ECONOMIC_API_ENDPOINT;

  const fetchMetrics = useCallback(async () => {
    const response = await fetch(`${API_BASE_URL}/metrics/`);
    if (!response.ok) throw new Error("Failed to fetch economic metrics");
    return response.json();
  }, []);

  const fetchNews = useCallback(async () => {
    const response = await fetch(`${API_BASE_URL}/news/`);
    if (!response.ok) throw new Error("Failed to fetch economic news");
    return response.json();
  }, []);

  const fetchForecasts = useCallback(async () => {
    const response = await fetch(`${API_BASE_URL}/forecasts/`);
    if (!response.ok) throw new Error("Failed to fetch economic forecasts");
    return response.json();
  }, []);

  const fetchEvents = useCallback(async () => {
    const response = await fetch(`${API_BASE_URL}/events/`);
    if (!response.ok) throw new Error("Failed to fetch economic events");
    return response.json();
  }, []);

  const fetchAllData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [metricsData, newsData, forecastsData, eventsData] = await Promise.all([
        fetchMetrics(),
        fetchNews(),
        fetchForecasts(),
        fetchEvents(),
      ]);
      setMetrics(metricsData);
      setNews(newsData);
      setForecasts(forecastsData);
      setEvents(eventsData);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, [fetchMetrics, fetchNews, fetchForecasts, fetchEvents]);

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
    refreshData: fetchAllData,
  };
}
