import { useState, useEffect, useCallback } from "react";
import {
  competitors,
  swotAnalyses,
  productComparisons,
  marketPositions,
  competitiveAdvantages,
  strategyRecommendations,
  type Competitor,
  type SWOTAnalysis,
  type ProductComparison,
  type MarketPosition,
  type CompetitiveAdvantage,
  type StrategyRecommendation,
} from "@/lib/competitive-data";

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

export function useCompetitiveData(): UseCompetitiveDataReturn {
  const [data, setData] = useState({
    competitors,
    swotAnalyses,
    productComparisons,
    marketPositions,
    competitiveAdvantages,
    strategyRecommendations,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [error, setError] = useState<string | null>(null);

  const refreshData = useCallback(() => {
    setIsLoading(true);
    setError(null);

    // Simulate API call with realistic delay
    setTimeout(
      () => {
        try {
          // Simulate competitor data updates
          const updatedCompetitors = data.competitors.map((competitor) => ({
            ...competitor,
            marketShare: Math.max(
              0,
              competitor.marketShare + (Math.random() - 0.5) * 1,
            ),
            revenue: competitor.revenue * (1 + (Math.random() - 0.5) * 0.05),
            employees:
              competitor.employees + Math.floor((Math.random() - 0.5) * 100),
          }));

          // Simulate SWOT analysis updates
          const updatedSwotAnalyses = data.swotAnalyses.map((swot) => ({
            ...swot,
            overallScore: Math.max(
              40,
              Math.min(100, swot.overallScore + (Math.random() - 0.5) * 3),
            ),
            lastUpdated: new Date(),
            strengths: swot.strengths.map((item) => ({
              ...item,
              confidence: Math.max(
                60,
                Math.min(100, item.confidence + (Math.random() - 0.5) * 2),
              ),
            })),
            weaknesses: swot.weaknesses.map((item) => ({
              ...item,
              confidence: Math.max(
                60,
                Math.min(100, item.confidence + (Math.random() - 0.5) * 2),
              ),
            })),
            opportunities: swot.opportunities.map((item) => ({
              ...item,
              confidence: Math.max(
                60,
                Math.min(100, item.confidence + (Math.random() - 0.5) * 2),
              ),
            })),
            threats: swot.threats.map((item) => ({
              ...item,
              confidence: Math.max(
                60,
                Math.min(100, item.confidence + (Math.random() - 0.5) * 2),
              ),
            })),
          }));

          // Simulate market position updates
          const updatedMarketPositions = data.marketPositions.map(
            (position) => ({
              ...position,
              position: {
                value: Math.max(
                  1,
                  Math.min(10, position.position.value + (Math.random() - 0.5)),
                ),
                price: Math.max(
                  1,
                  Math.min(10, position.position.price + (Math.random() - 0.5)),
                ),
                volume: Math.max(
                  0,
                  position.position.volume + (Math.random() - 0.5) * 0.5,
                ),
              },
            }),
          );

          // Simulate competitive advantage time to replicate updates
          const updatedCompetitiveAdvantages = data.competitiveAdvantages.map(
            (advantage) => ({
              ...advantage,
              timeToReplicate: Math.max(
                6,
                advantage.timeToReplicate + (Math.random() - 0.5) * 2,
              ),
            }),
          );

          setData({
            competitors: updatedCompetitors,
            swotAnalyses: updatedSwotAnalyses,
            productComparisons: data.productComparisons, // These change less frequently
            marketPositions: updatedMarketPositions,
            competitiveAdvantages: updatedCompetitiveAdvantages,
            strategyRecommendations: data.strategyRecommendations, // These are static
          });

          setLastUpdated(new Date());
          setIsConnected(true);
          setIsLoading(false);
        } catch (err) {
          setError("Failed to update competitive data");
          setIsLoading(false);
        }
      },
      1000 + Math.random() * 1800,
    );
  }, [data]);

  useEffect(() => {
    // Initial load
    refreshData();

    // Set up auto-refresh interval
    const interval = setInterval(refreshData, 35000); // Refresh every 35 seconds

    // Simulate WebSocket connection
    const connectWebSocket = () => {
      setIsConnected(true);
      // Simulate occasional disconnections
      const disconnectTimeout = setTimeout(
        () => {
          setIsConnected(false);
          setTimeout(connectWebSocket, 3500);
        },
        60000 + Math.random() * 120000,
      );

      return () => clearTimeout(disconnectTimeout);
    };

    const cleanup = connectWebSocket();

    return () => {
      clearInterval(interval);
      cleanup();
    };
  }, [refreshData]);

  return {
    competitors: data.competitors,
    swotAnalyses: data.swotAnalyses,
    productComparisons: data.productComparisons,
    marketPositions: data.marketPositions,
    competitiveAdvantages: data.competitiveAdvantages,
    strategyRecommendations: data.strategyRecommendations,
    isLoading,
    isConnected,
    lastUpdated,
    error,
    refreshData,
  };
}
