import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Eye, RefreshCw, Loader2 } from "lucide-react";

type CompetitorRecord = {
  id: number;
  name: string;
  market_position: "premium" | "mid-market" | "budget";
  pricing_model: string;
  pricing_summary: string;
  current_price: string;
  market_share: number;
  feature_highlights: string[];
  strengths: string;
  weaknesses: string;
  website: string;
  headquarters: string;
  updated_at: string;
};

type ComparePayload = {
  competitor: string;
  position: string;
  current_price: number;
  market_share: number;
  price_vs_average: number;
  market_share_vs_average: number;
  feature_highlights: string[];
  pricing_model: string;
  pricing_summary: string;
};

const positionColors: Record<string, string> = {
  premium: "bg-purple-100 text-purple-800",
  "mid-market": "bg-blue-100 text-blue-800",
  budget: "bg-green-100 text-green-800",
};

const extractList = <T,>(payload: unknown): T[] => {
  if (Array.isArray(payload)) {
    return payload as T[];
  }

  if (payload && typeof payload === "object" && "results" in payload) {
    const results = (payload as { results?: unknown }).results;
    return Array.isArray(results) ? (results as T[]) : [];
  }

  return [];
};

export function CompetitiveAnalysis() {
  const [competitors, setCompetitors] = useState<CompetitorRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeDetails, setActiveDetails] = useState<CompetitorRecord | null>(null);
  const [compareData, setCompareData] = useState<ComparePayload | null>(null);
  const [openDetails, setOpenDetails] = useState(false);
  const [openCompare, setOpenCompare] = useState(false);

  const loadCompetitors = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/market/competitors/?ordering=-updated_at");
      if (response.ok) {
        const payload = await response.json();
        setCompetitors(extractList<CompetitorRecord>(payload));
      }
    } catch (error) {
      console.error("Failed to load competitors", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadCompetitors();
  }, []);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await fetch("/api/market/competitors/refresh-data/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      await loadCompetitors();
    } catch (error) {
      console.error("Failed to refresh competitors", error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleViewDetails = async (id: number) => {
    try {
      const response = await fetch(`/api/market/competitors/${id}/details/`);
      if (!response.ok) {
        return;
      }
      const payload = (await response.json()) as CompetitorRecord;
      setActiveDetails(payload);
      setOpenDetails(true);
    } catch (error) {
      console.error("Failed to load competitor details", error);
    }
  };

  const handleCompareFeatures = async (id: number) => {
    try {
      const response = await fetch(`/api/market/competitors/${id}/compare-features/`);
      if (!response.ok) {
        return;
      }
      const payload = (await response.json()) as ComparePayload;
      setCompareData(payload);
      setOpenCompare(true);
    } catch (error) {
      console.error("Failed to compare features", error);
    }
  };

  const insights = useMemo(() => {
    if (!competitors.length) {
      return {
        averagePrice: 0,
        totalCoverage: 0,
        premiumCount: 0,
      };
    }

    const averagePrice =
      competitors.reduce((sum, item) => sum + Number(item.current_price), 0) / competitors.length;

    const totalCoverage = competitors.reduce((sum, item) => sum + Number(item.market_share), 0);

    const premiumCount = competitors.filter((item) => item.market_position === "premium").length;

    return {
      averagePrice,
      totalCoverage,
      premiumCount,
    };
  }, [competitors]);

  const formatUpdatedAt = (value: string) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Competitive Analysis</h2>
          <p className="text-gray-600">Monitor competitor pricing and market positioning</p>
        </div>
        <Button onClick={handleRefresh} variant="outline" disabled={refreshing}>
          {refreshing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Refreshing...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Data
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {competitors.map((competitor) => (
          <Card key={competitor.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{competitor.name}</h3>
                    <Badge className={positionColors[competitor.market_position] || "bg-gray-100 text-gray-800"}>
                      {competitor.market_position}
                    </Badge>
                    <span className="text-sm text-gray-500">Updated {formatUpdatedAt(competitor.updated_at)}</span>
                  </div>

                  <p className="text-gray-600 mb-3">{competitor.pricing_model}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {competitor.feature_highlights.map((feature, index) => (
                      <Badge key={`${competitor.id}-${index}`} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="text-right space-y-2">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">${Number(competitor.current_price).toFixed(1)}</div>
                    <div className="text-sm text-gray-500">Current Price</div>
                  </div>

                  <div>
                    <div className="text-lg font-semibold">{Number(competitor.market_share).toFixed(1)}%</div>
                    <div className="text-sm text-gray-500">Market Share</div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button variant="outline" size="sm" onClick={() => handleViewDetails(competitor.id)}>
                  <Eye className="w-3 h-3 mr-1" />
                  View Details
                </Button>
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => handleCompareFeatures(competitor.id)}
                >
                  Compare Features
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Pricing Insights</CardTitle>
          <CardDescription className="text-blue-700">Live metrics generated from competitor records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-900">${Math.round(insights.averagePrice)}</div>
              <div className="text-sm text-blue-700">Average Price</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-900">{Math.round(insights.totalCoverage)}%</div>
              <div className="text-sm text-blue-700">Total Market Coverage</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-900">{insights.premiumCount}</div>
              <div className="text-sm text-blue-700">Premium Competitors</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={openDetails} onOpenChange={setOpenDetails}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{activeDetails?.name} Details</DialogTitle>
            <DialogDescription>Detailed competitor profile from database records</DialogDescription>
          </DialogHeader>
          {activeDetails && (
            <div className="space-y-3 text-sm">
              <div><span className="font-medium">Pricing:</span> {activeDetails.pricing_model} ({activeDetails.pricing_summary})</div>
              <div><span className="font-medium">Strengths:</span> {activeDetails.strengths}</div>
              <div><span className="font-medium">Weaknesses:</span> {activeDetails.weaknesses || "N/A"}</div>
              <div><span className="font-medium">Website:</span> {activeDetails.website || "N/A"}</div>
              <div><span className="font-medium">Headquarters:</span> {activeDetails.headquarters || "N/A"}</div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={openCompare} onOpenChange={setOpenCompare}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{compareData?.competitor} Feature Comparison</DialogTitle>
            <DialogDescription>Comparison against average of other competitors</DialogDescription>
          </DialogHeader>
          {compareData && (
            <div className="space-y-3 text-sm">
              <div><span className="font-medium">Price vs Average:</span> {compareData.price_vs_average >= 0 ? "+" : ""}${compareData.price_vs_average.toFixed(2)}</div>
              <div><span className="font-medium">Market Share vs Average:</span> {compareData.market_share_vs_average >= 0 ? "+" : ""}{compareData.market_share_vs_average.toFixed(1)}%</div>
              <div><span className="font-medium">Pricing Model:</span> {compareData.pricing_model}</div>
              <div className="space-y-1">
                <div className="font-medium">Feature Highlights</div>
                {compareData.feature_highlights.map((item, idx) => (
                  <div key={`compare-${idx}`} className="text-gray-700">- {item}</div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
