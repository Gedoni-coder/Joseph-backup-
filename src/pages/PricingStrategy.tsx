import { useMemo, useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import ModuleHeader from "@/components/ui/module-header";
import { useCompanyInfo } from "@/lib/company-context";
import { getCompanyName } from "@/lib/get-company-name";
import { usePricingDataAPI } from "@/hooks/usePricingDataAPI";
import { PricingStrategies } from "@/components/pricing/pricing-strategies";
import { CompetitiveAnalysis } from "@/components/pricing/competitive-analysis";
import { PriceTesting } from "@/components/pricing/price-testing";
import { DynamicPricingComponent } from "@/components/pricing/dynamic-pricing";
import { ModuleConversation } from "@/components/conversation/module-conversation";
import { SummaryRecommendationSection } from "@/components/module/summary-recommendation-section";
import {
  getSummaryContent,
  SUMMARY_DESCRIPTION,
  getRecommendationContent,
  RECOMMENDATION_DESCRIPTION,
  DEFAULT_PRICING_ACTION_ITEMS,
  DEFAULT_PRICING_NEXT_STEPS,
  getSummaryMetrics,
} from "@/mocks/pricing-strategy";
import {
  DollarSign,
  Target,
  TrendingUp,
  BarChart3,
  Plus,
} from "lucide-react";

type PricingItemRecord = {
  id: number;
  name: string;
  price: number;
  elasticity: number;
  elasticity_change: number;
  elasticity_period: string;
  competitive_score: number;
  competitive_change: number;
  competitive_period: string;
  acceptance_rate: number;
  acceptance_change: number;
  acceptance_period: string;
};

type PricingStrategyRecord = {
  id: number;
  name: string;
  strategy_type: string;
  suggested_price: number;
  confidence: number;
};

type PricingTestRecord = {
  id: number;
  name: string;
  test_type: string;
  status: string;
  confidence: number;
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

export default function PricingStrategy() {
  const { companyInfo } = useCompanyInfo();
  const companyName = getCompanyName(companyInfo?.companyName);

  const {
    strategies,
    tests,
    metrics,
    isLoading,
    isConnected,
    lastUpdated,
    error,
    refreshData,
  } = usePricingDataAPI();

  const [activeTab, setActiveTab] = useState("overview");
  const [isAddPriceOpen, setIsAddPriceOpen] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [overviewLoading, setOverviewLoading] = useState(true);
  const [pricingItems, setPricingItems] = useState<PricingItemRecord[]>([]);
  const [pricingStrategiesDb, setPricingStrategiesDb] = useState<PricingStrategyRecord[]>([]);
  const [pricingTestsDb, setPricingTestsDb] = useState<PricingTestRecord[]>([]);

  const loadOverviewData = async () => {
    try {
      setOverviewLoading(true);
      const [itemsRes, strategiesRes, testsRes] = await Promise.all([
        fetch("/api/pricing/pricing-items/?ordering=-updated_at"),
        fetch("/api/pricing/pricing-strategies/?ordering=-updated_at"),
        fetch("/api/pricing/pricing-tests/?ordering=-created_at"),
      ]);

      if (itemsRes.ok) {
        const payload = await itemsRes.json();
        setPricingItems(extractList<PricingItemRecord>(payload));
      }

      if (strategiesRes.ok) {
        const payload = await strategiesRes.json();
        setPricingStrategiesDb(extractList<PricingStrategyRecord>(payload));
      }

      if (testsRes.ok) {
        const payload = await testsRes.json();
        setPricingTestsDb(extractList<PricingTestRecord>(payload));
      }
    } catch (fetchError) {
      console.error("Failed to load pricing overview data", fetchError);
    } finally {
      setOverviewLoading(false);
    }
  };

  useEffect(() => {
    void loadOverviewData();
  }, []);

  const averageSellingPrice = useMemo(() => {
    if (!pricingItems.length) {
      return 0;
    }

    return pricingItems.reduce((sum, entry) => sum + Number(entry.price), 0) / pricingItems.length;
  }, [pricingItems, metrics]);

  const derivedMetrics = useMemo(() => {
    if (!pricingItems.length) {
      return [
        {
          id: "elasticity",
          name: "Price Elasticity",
          value: 0,
          unit: "",
          trend: "neutral",
          change: 0,
          period: "Q3 2024",
        },
        {
          id: "competitive",
          name: "Competitive Position",
          value: 0,
          unit: "Score",
          trend: "neutral",
          change: 0,
          period: "This quarter",
        },
        {
          id: "acceptance",
          name: "Price Acceptance Rate",
          value: 0,
          unit: "%",
          trend: "neutral",
          change: 0,
          period: "Last 7 days",
        },
      ];
    }

    const avgElasticity = pricingItems.reduce((sum, item) => sum + Number(item.elasticity), 0) / pricingItems.length;
    const avgElasticityChange = pricingItems.reduce((sum, item) => sum + Number(item.elasticity_change), 0) / pricingItems.length;

    const avgCompetitiveScore = pricingItems.reduce((sum, item) => sum + Number(item.competitive_score), 0) / pricingItems.length;
    const avgCompetitiveChange = pricingItems.reduce((sum, item) => sum + Number(item.competitive_change), 0) / pricingItems.length;

    const avgAcceptanceRate = pricingItems.reduce((sum, item) => sum + Number(item.acceptance_rate), 0) / pricingItems.length;
    const avgAcceptanceChange = pricingItems.reduce((sum, item) => sum + Number(item.acceptance_change), 0) / pricingItems.length;

    return [
      {
        id: "elasticity",
        name: "Price Elasticity",
        value: avgElasticity,
        unit: "",
        trend: avgElasticityChange >= 0 ? "up" : "down",
        change: avgElasticityChange,
        period: pricingItems[0]?.elasticity_period ?? "Q3 2024",
      },
      {
        id: "competitive",
        name: "Competitive Position",
        value: avgCompetitiveScore,
        unit: "Score",
        trend: avgCompetitiveChange >= 0 ? "up" : "down",
        change: avgCompetitiveChange,
        period: pricingItems[0]?.competitive_period ?? "This quarter",
      },
      {
        id: "acceptance",
        name: "Price Acceptance Rate",
        value: avgAcceptanceRate,
        unit: "%",
        trend: avgAcceptanceChange >= 0 ? "up" : "down",
        change: avgAcceptanceChange,
        period: pricingItems[0]?.acceptance_period ?? "Last 7 days",
      },
    ];
  }, [pricingItems]);

  const averageSellingChange = useMemo(() => {
    return {
      value: 8.4,
      period: "Last 30 days",
      trend: "up",
    };
  }, []);

  const displayStrategies = useMemo(() => {
    if (pricingStrategiesDb.length) {
      return pricingStrategiesDb.map((strategy) => ({
        id: String(strategy.id),
        name: strategy.name,
        type: strategy.strategy_type,
        suggestedPrice: Number(strategy.suggested_price),
        confidence: strategy.confidence,
      }));
    }
    return strategies;
  }, [pricingStrategiesDb, strategies]);

  const displayTests = useMemo(() => {
    if (pricingTestsDb.length) {
      return pricingTestsDb.map((test) => ({
        id: String(test.id),
        name: test.name,
        testType: test.test_type,
        status: test.status,
        confidence: test.confidence,
      }));
    }
    return tests;
  }, [pricingTestsDb, tests]);

  const hasOverviewData = pricingItems.length > 0 || pricingStrategiesDb.length > 0 || pricingTestsDb.length > 0;

  const handleAddNewItemPrice = async () => {
    const parsedPrice = Number(newItemPrice);
    if (!newItemName.trim() || !Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      return;
    }

    try {
      const response = await fetch("/api/pricing/pricing-items/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newItemName.trim(),
          price: parsedPrice,
          elasticity: -1.0,
          elasticity_change: 0,
          elasticity_period: "Q3 2024",
          competitive_score: 85.0,
          competitive_change: 0,
          competitive_period: "This quarter",
          acceptance_rate: 75.0,
          acceptance_change: 0,
          acceptance_period: "Last 7 days",
        }),
      });

      if (response.ok) {
        await loadOverviewData();
        setNewItemName("");
        setNewItemPrice("");
        setIsAddPriceOpen(false);
      }
    } catch (postError) {
      console.error("Failed to add pricing item", postError);
    }
  };

  if (error && !hasOverviewData && !overviewLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Connection Error</CardTitle>
            <CardDescription>
              Unable to load pricing data. Please check your connection and try again.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => {
                refreshData();
                void loadOverviewData();
              }}
              className="w-full"
            >
              Retry Connection
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <LoadingSpinner isVisible={isLoading || overviewLoading} />

      <ModuleHeader
        icon={<Target className="h-6 w-6" />}
        title="Pricing Strategy"
        description={`${companyName} dynamic pricing models, competitive analysis, and optimization strategies for maximum profitability in the e-commerce marketplace`}
        isConnected={isConnected}
        lastUpdated={lastUpdated}
        onReconnect={() => {
          refreshData();
          void loadOverviewData();
        }}
        connectionLabel="Live"
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-8 gap-2 w-full rounded-md bg-muted p-1 text-muted-foreground">
            <TabsList className="contents">
              <TabsTrigger value="overview" className="w-full justify-center data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">Overview</TabsTrigger>
              <TabsTrigger value="summary-recommendation" className="w-full justify-center data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">Summary & Rec</TabsTrigger>
              <TabsTrigger value="strategies" className="w-full justify-center data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">Strategies</TabsTrigger>
              <TabsTrigger value="competitive" className="w-full justify-center data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">Competitive</TabsTrigger>
              <TabsTrigger value="testing" className="w-full justify-center data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">Testing</TabsTrigger>
              <TabsTrigger value="dynamic" className="w-full justify-center data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">Dynamic</TabsTrigger>
              <TabsTrigger value="conversation" className="w-full justify-center data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">JOSEPH</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-4 sm:space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-5 h-5 text-blue-600" />
                        <div className="text-sm text-gray-600">Average Selling Price</div>
                      </div>

                      <div className="text-2xl font-bold text-gray-900">{averageSellingPrice.toFixed(2)}$</div>

                      <div className={`text-sm flex items-center ${averageSellingChange.trend === "down" ? "text-red-600" : "text-green-600"}`}>
                        <TrendingUp className={`w-3 h-3 mr-1 ${averageSellingChange.trend === "down" ? "rotate-180" : ""}`} />
                        {averageSellingChange.value > 0 ? "+" : ""}
                        {averageSellingChange.value.toFixed(1)}% {averageSellingChange.period}
                      </div>

                      <div className="relative overflow-hidden rounded-md border bg-gray-50 py-2">
                        <div className="flex w-max gap-2 px-2" style={{ animation: "asp-ticker 18s linear infinite" }}>
                          {[...pricingItems, ...pricingItems].map((entry, index) => (
                            <div key={`${entry.id}-${index}`} className="whitespace-nowrap rounded-full border bg-white px-3 py-1 text-xs text-gray-700">
                              {entry.name} Average Selling Price {Number(entry.price).toFixed(2)}$
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {derivedMetrics.map((metric) => (
                  <Card key={metric.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-5 h-5 text-blue-600" />
                        <div className="flex-1">
                          <div className="text-sm text-gray-600">{metric.name}</div>
                          <div className="text-2xl font-bold text-gray-900">
                            {metric.value.toFixed(metric.unit === "$" ? 2 : 1)}
                            {metric.unit}
                          </div>
                          <div className={`text-sm flex items-center ${metric.trend === "up" ? "text-green-600" : metric.trend === "down" ? "text-red-600" : "text-gray-600"}`}>
                            <TrendingUp className={`w-3 h-3 mr-1 ${metric.trend === "down" ? "rotate-180" : ""}`} />
                            {metric.change > 0 ? "+" : ""}
                            {metric.change.toFixed(1)}% {metric.period}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Button onClick={() => setIsAddPriceOpen(true)} className="w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Add price for a new item
              </Button>

              <Card>
                <CardHeader>
                  <CardTitle>Item Performance Metrics</CardTitle>
                  <CardDescription>
                    Price Elasticity, Competitive Position, and Price Acceptance Rate for each item
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-3">Price Elasticity</div>
                      <div className="relative overflow-hidden rounded-md border bg-gray-50 py-3">
                        <div className="flex w-max gap-3 px-3" style={{ animation: "metric-ticker 24s linear infinite" }}>
                          {[...pricingItems, ...pricingItems].map((entry, index) => (
                            <div key={`elasticity-${entry.id}-${index}`} className="whitespace-nowrap rounded-md border bg-white px-4 py-2 text-sm flex flex-col gap-1">
                              <div className="font-medium text-gray-900">{entry.name}</div>
                              <div className="text-lg font-bold text-gray-900">{Number(entry.elasticity).toFixed(1)}</div>
                              <div className={`text-xs ${entry.elasticity_change < 0 ? "text-red-600" : "text-green-600"}`}>
                                {entry.elasticity_change > 0 ? "+" : ""}{Number(entry.elasticity_change).toFixed(1)}% {entry.elasticity_period}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-3">Competitive Position</div>
                      <div className="relative overflow-hidden rounded-md border bg-gray-50 py-3">
                        <div className="flex w-max gap-3 px-3" style={{ animation: "metric-ticker 24s linear infinite" }}>
                          {[...pricingItems, ...pricingItems].map((entry, index) => (
                            <div key={`competitive-${entry.id}-${index}`} className="whitespace-nowrap rounded-md border bg-white px-4 py-2 text-sm flex flex-col gap-1">
                              <div className="font-medium text-gray-900">{entry.name}</div>
                              <div className="text-lg font-bold text-gray-900">{Number(entry.competitive_score).toFixed(1)}Score</div>
                              <div className={`text-xs ${entry.competitive_change > 0 ? "text-green-600" : "text-red-600"}`}>
                                {entry.competitive_change > 0 ? "+" : ""}{Number(entry.competitive_change).toFixed(1)}% {entry.competitive_period}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-3">Price Acceptance Rate</div>
                      <div className="relative overflow-hidden rounded-md border bg-gray-50 py-3">
                        <div className="flex w-max gap-3 px-3" style={{ animation: "metric-ticker 24s linear infinite" }}>
                          {[...pricingItems, ...pricingItems].map((entry, index) => (
                            <div key={`acceptance-${entry.id}-${index}`} className="whitespace-nowrap rounded-md border bg-white px-4 py-2 text-sm flex flex-col gap-1">
                              <div className="font-medium text-gray-900">{entry.name}</div>
                              <div className="text-lg font-bold text-gray-900">{Number(entry.acceptance_rate).toFixed(1)}%</div>
                              <div className={`text-xs ${entry.acceptance_change < 0 ? "text-red-600" : "text-green-600"}`}>
                                {entry.acceptance_change > 0 ? "+" : ""}{Number(entry.acceptance_change).toFixed(1)}% {entry.acceptance_period}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="w-5 h-5 mr-2 text-blue-600" />
                    Active Pricing Strategies
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {displayStrategies.slice(0, 3).map((strategy) => (
                      <div key={strategy.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium">{strategy.name}</div>
                          <div className="text-sm text-gray-600">{strategy.type.replace("-", " ")}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">${strategy.suggestedPrice}</div>
                          <Badge variant="outline" className="text-xs">{strategy.confidence}% confidence</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                    Running Price Tests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {displayTests
                      .filter((t) => t.status === "running")
                      .map((test) => (
                        <div key={test.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium">{test.name}</div>
                            <div className="text-sm text-gray-600">{test.testType} test</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">{test.confidence}%</div>
                            <Badge className="bg-green-100 text-green-800 text-xs">Running</Badge>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="summary-recommendation" className="space-y-8">
            <SummaryRecommendationSection
              summaryTitle="Pricing Strategy Summary"
              summaryDescription={SUMMARY_DESCRIPTION}
              summaryText={getSummaryContent(
                displayStrategies.length,
                derivedMetrics.length,
                displayTests.filter((t) => t.status === "running").length,
              )}
              summaryMetrics={getSummaryMetrics(
                derivedMetrics.length > 0
                  ? derivedMetrics.reduce((a, m) => a + m.value, 0) / derivedMetrics.length
                  : 0,
                displayStrategies.length,
                displayTests.filter((t) => t.status === "running").length,
              )}
              recommendationTitle="Pricing Recommendations"
              recommendationDescription={RECOMMENDATION_DESCRIPTION}
              recommendationText={getRecommendationContent()}
              actionItems={DEFAULT_PRICING_ACTION_ITEMS}
              nextSteps={DEFAULT_PRICING_NEXT_STEPS}
            />
          </TabsContent>

          <TabsContent value="strategies">
            <PricingStrategies />
          </TabsContent>

          <TabsContent value="competitive">
            <CompetitiveAnalysis />
          </TabsContent>

          <TabsContent value="testing">
            <PriceTesting />
          </TabsContent>

          <TabsContent value="dynamic">
            <DynamicPricingComponent />
          </TabsContent>

          <TabsContent value="conversation" className="h-[600px]">
            <ModuleConversation module="pricing_strategy" moduleTitle="Pricing Strategy" />
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={isAddPriceOpen} onOpenChange={setIsAddPriceOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add price for a new item</DialogTitle>
            <DialogDescription>
              Enter the item name and its selling price to include it in pricing overview metrics.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="item-name">Item</Label>
              <Input
                id="item-name"
                placeholder="e.g., Coca Cola"
                value={newItemName}
                onChange={(event) => setNewItemName(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="item-price">Selling Price ($)</Label>
              <Input
                id="item-price"
                type="number"
                min="0"
                step="0.01"
                placeholder="e.g., 156.78"
                value={newItemPrice}
                onChange={(event) => setNewItemPrice(event.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddPriceOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => void handleAddNewItemPrice()}>Save Item Price</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <style>{`
        @keyframes asp-ticker {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes metric-ticker {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
