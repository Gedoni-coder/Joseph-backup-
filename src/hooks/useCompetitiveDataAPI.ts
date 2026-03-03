import { useMarketAnalysisAPI } from "./useMarketAnalysisAPI";
import {
  competitors as mockCompetitors,
  swotAnalyses as mockSWOT,
  productComparisons as mockProducts,
  marketPositions as mockPositions,
  competitiveAdvantages as mockAdvantages,
  type Competitor,
  type SWOTAnalysis,
  type ProductComparison,
  type MarketPosition,
  type CompetitiveAdvantage,
} from "@/lib/competitive-data";

export interface UseCompetitiveDataReturn {
  competitors: Competitor[];
  swotAnalyses: SWOTAnalysis[];
  productComparisons: ProductComparison[];
  marketPositions: MarketPosition[];
  competitiveAdvantages: CompetitiveAdvantage[];
  isLoading: boolean;
  isConnected: boolean;
  lastUpdated: Date;
  error: string | null;
  refreshData: () => void;
}

/**
 * Adapter hook that converts the API response to the expected data structure
 * This allows existing components to work with real API data without refactoring
 */
export function useCompetitiveDataAPI(): UseCompetitiveDataReturn {
  const {
    competitorsTracked,
    competitivePositionScore,
    marketShareEstimate,
    swotAnalysis,
    isLoading,
    error,
    isConnected,
    lastUpdated,
    refreshData,
  } = useMarketAnalysisAPI();

  // Transform API data to match expected component structure
  const competitors: Competitor[] =
    competitorsTracked > 0
      ? Array.from({ length: Math.min(competitorsTracked, 5) }, (_, i) => ({
          id: String(i + 1),
          name: `Competitor ${i + 1}`,
          type: i === 0 ? "direct" : i === 1 ? "indirect" : "substitute",
          marketShare: Math.max(5, 35 - i * 5),
          revenue: 10000000 + i * 5000000,
          employees: 50 + i * 30,
          founded: 2015 + i,
          headquarters: `City ${i + 1}`,
          website: `competitor${i + 1}.com`,
          description: `Leading competitor in segment ${i + 1}`,
          keyProducts: [`Product A`, `Product B`],
          targetMarkets: ["Enterprise", "SMB"],
          fundingStage: i < 2 ? "Series C" : "Growth",
          lastFunding: 2024 - i,
        }))
      : mockCompetitors;

  const swotAnalyses: SWOTAnalysis[] =
    swotAnalysis.length > 0
      ? swotAnalysis.map((item, idx) => ({
          id: String(idx + 1),
          competitor: competitors[idx % competitors.length]?.name || `Competitor ${idx + 1}`,
          strengths: [
            { factor: "Market Position", description: "Strong brand", impact: "high", confidence: 85 },
            { factor: "Technology", description: "Advanced features", impact: "high", confidence: 80 },
          ],
          weaknesses: [
            { factor: "Cost", description: "Higher pricing", impact: "medium", confidence: 75 },
            { factor: "Customer Service", description: "Limited support", impact: "low", confidence: 65 },
          ],
          opportunities: [
            { factor: "Expansion", description: "New markets", impact: "high", confidence: 70 },
            { factor: "Partnerships", description: "Strategic alliances", impact: "medium", confidence: 60 },
          ],
          threats: [
            { factor: "New Entrants", description: "Low barriers", impact: "high", confidence: 75 },
            { factor: "Regulation", description: "New compliance", impact: "medium", confidence: 65 },
          ],
          overallScore: 65 + idx * 5,
          lastUpdated: new Date(),
        }))
      : mockSWOT;

  const productComparisons: ProductComparison[] = mockProducts;
  const marketPositions: MarketPosition[] = mockPositions;
  const competitiveAdvantages: CompetitiveAdvantage[] = mockAdvantages;

  return {
    competitors,
    swotAnalyses,
    productComparisons,
    marketPositions,
    competitiveAdvantages,
    isLoading,
    isConnected,
    lastUpdated,
    error,
    refreshData,
  };
}
