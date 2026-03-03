import { useState } from "react";
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
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import ModuleHeader from "@/components/ui/module-header";
import { useCompanyInfo } from "@/lib/company-context";
import { getCompanyName } from "@/lib/get-company-name";
import { useMarketDataAPI } from "@/hooks/useMarketDataAPI";
import { useCompetitiveDataAPI } from "@/hooks/useCompetitiveDataAPI";
import { useMarketAnalysisData } from "@/hooks/useMarketAnalysisData";
import { MarketAnalysis } from "@/components/market/market-analysis";
import { ReportNotes } from "@/components/market/report-notes";
import { CompetitiveAnalysis } from "@/components/competitive/competitive-analysis";
import { CompetitiveStrategy } from "@/components/competitive/competitive-strategy";
import { ModuleConversation } from "@/components/conversation/module-conversation";
import { SummaryRecommendationSection } from "@/components/module/summary-recommendation-section";
import {
  SUMMARY_DESCRIPTION,
  getSummaryContent,
  getSummaryMetrics,
  RECOMMENDATION_DESCRIPTION,
  getRecommendationContent,
  DEFAULT_ACTION_ITEMS,
  DEFAULT_NEXT_STEPS,
} from "@/mocks/market-competitive-analysis";
import {
  BarChart3,
  TrendingUp,
  Target,
  Users,
  Globe,
  Home,
  Briefcase,
  Calculator,
  DollarSign,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function MarketCompetitiveAnalysis() {
  const { companyInfo } = useCompanyInfo();
  const companyName = getCompanyName(companyInfo?.companyName);

  const {
    marketSizes,
    customerSegments,
    marketTrends,
    demandForecasts,
    industryInsights,
    reportNotes,
    isLoading: marketLoading,
    isConnected: marketConnected,
    lastUpdated: marketLastUpdated,
    error: marketError,
    refreshData: refreshMarketData,
  } = useMarketDataAPI();

  const {
    competitors,
    swotAnalyses,
    productComparisons,
    marketPositions,
    competitiveAdvantages,
    strategyRecommendations,
    isLoading: competitiveLoading,
    isConnected: competitiveConnected,
    lastUpdated: competitiveLastUpdated,
    error: competitiveError,
    refreshData: refreshCompetitiveData,
  } = useCompetitiveDataAPI();

  const {
    marketSizes: dynamicMarketSizes,
    customerSegments: dynamicCustomerSegments,
    marketTrends: dynamicMarketTrends,
    demandForecasts: dynamicDemandForecasts,
    industryInsights: dynamicIndustryInsights,
    isDataAvailable,
    dataSource,
  } = useMarketAnalysisData();

  const [activeTab, setActiveTab] = useState("overview");

  const isLoading = marketLoading || competitiveLoading;
  const isConnected = marketConnected && competitiveConnected;
  const lastUpdated = new Date(
    Math.max(marketLastUpdated.getTime(), competitiveLastUpdated.getTime()),
  );
  const error = marketError || competitiveError;

  const refreshData = () => {
    refreshMarketData();
    refreshCompetitiveData();
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Connection Error</CardTitle>
            <CardDescription>
              Unable to load market and competitive data. Please check your
              connection and try again.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={refreshData} className="w-full">
              Retry Connection
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <LoadingSpinner isVisible={isLoading} />

      <ModuleHeader
        icon={<BarChart3 className="h-6 w-6" />}
        title="Market Analysis"
        description={`${companyName} competitive intelligence, e-commerce market trends, and strategic positioning analysis for informed business decisions`}
        isConnected={isConnected}
        lastUpdated={lastUpdated}
        onReconnect={refreshData}
        connectionLabel="Live"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <div className="grid grid-cols-2 sm:grid-cols-8 gap-2 w-full rounded-md bg-muted p-1 text-muted-foreground">
            <TabsList className="contents">
              <TabsTrigger
                value="overview"
                className="w-full justify-center data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="summary-recommendation"
                className="w-full justify-center data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Summary & Rec
              </TabsTrigger>
              <TabsTrigger
                value="market"
                className="w-full justify-center data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Market Analysis
              </TabsTrigger>
              <TabsTrigger
                value="competitive"
                className="w-full justify-center data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Competitive Analysis
              </TabsTrigger>
              <TabsTrigger
                value="strategy"
                className="w-full justify-center data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Strategy & Advantages
              </TabsTrigger>
              <TabsTrigger
                value="reports"
                className="w-full justify-center data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Report Notes
              </TabsTrigger>
              <TabsTrigger
                value="conversation"
                className="w-full justify-center data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                JOSEPH
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-6">
            {/* Market Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Globe className="w-5 h-5 text-blue-600" />
                    <div className="flex-1">
                      <div className="text-sm text-gray-600">Total TAM</div>
                      <div className="text-2xl font-bold text-gray-900">
                        $
                        {(
                          marketSizes.reduce((acc, m) => acc + m.tam, 0) /
                          1000000000
                        ).toFixed(0)}
                        B
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-green-600" />
                    <div className="flex-1">
                      <div className="text-sm text-gray-600">
                        Customer Segments
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        {customerSegments.length}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Target className="w-5 h-5 text-purple-600" />
                    <div className="flex-1">
                      <div className="text-sm text-gray-600">Competitors</div>
                      <div className="text-2xl font-bold text-gray-900">
                        {competitors.length}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5 text-orange-600" />
                    <div className="flex-1">
                      <div className="text-sm text-gray-600">Market Growth</div>
                      <div className="text-2xl font-bold text-gray-900">
                        {(
                          marketSizes.reduce(
                            (acc, m) => acc + m.growthRate,
                            0,
                          ) / marketSizes.length
                        ).toFixed(1)}
                        %
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                    Market Trends Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {marketTrends.slice(0, 3).map((trend) => (
                      <div
                        key={trend.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <div className="font-medium">{trend.trend}</div>
                          <div className="text-sm text-gray-600">
                            {trend.category}
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge
                            className={
                              trend.impact === "high"
                                ? "bg-red-100 text-red-800"
                                : trend.impact === "medium"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                            }
                          >
                            {trend.impact} impact
                          </Badge>
                          <div className="text-sm text-gray-600">
                            {trend.confidence}% confidence
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="w-5 h-5 mr-2 text-red-600" />
                    Top Competitors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {competitors.slice(0, 3).map((competitor) => (
                      <div
                        key={competitor.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <div className="font-medium">{competitor.name}</div>
                          <div className="text-sm text-gray-600">
                            {competitor.type} competitor
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">
                            {competitor.marketShare}%
                          </div>
                          <div className="text-sm text-gray-600">
                            market share
                          </div>
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
              summaryTitle="Market & Competitive Analysis Summary"
              summaryDescription={SUMMARY_DESCRIPTION}
              summaryText={getSummaryContent(
                marketSizes.reduce((acc, m) => acc + m.tam, 0) / 1000000000,
                marketSizes.reduce((acc, m) => acc + m.growthRate, 0) /
                  marketSizes.length,
                competitors.length,
                customerSegments.length,
              )}
              summaryMetrics={getSummaryMetrics(
                marketSizes.reduce((acc, m) => acc + m.tam, 0) / 1000000000,
                marketSizes.reduce((acc, m) => acc + m.growthRate, 0) /
                  marketSizes.length,
                customerSegments.length,
                competitors.length,
              )}
              recommendationTitle="Market & Competitive Recommendations"
              recommendationDescription={RECOMMENDATION_DESCRIPTION}
              recommendationText={getRecommendationContent()}
              actionItems={DEFAULT_ACTION_ITEMS}
              nextSteps={DEFAULT_NEXT_STEPS}
            />
          </TabsContent>

          <TabsContent value="market">
            <MarketAnalysis
              marketSizes={dynamicMarketSizes.length > 0 ? dynamicMarketSizes : marketSizes}
              customerSegments={dynamicCustomerSegments.length > 0 ? dynamicCustomerSegments : customerSegments}
              marketTrends={dynamicMarketTrends.length > 0 ? dynamicMarketTrends : marketTrends}
              demandForecasts={dynamicDemandForecasts.length > 0 ? dynamicDemandForecasts : demandForecasts}
              industryInsights={dynamicIndustryInsights.length > 0 ? dynamicIndustryInsights : industryInsights}
              isDataAvailable={isDataAvailable}
              dataSource={dataSource}
            />
          </TabsContent>

          <TabsContent value="competitive">
            <CompetitiveAnalysis
              competitors={competitors}
              swotAnalyses={swotAnalyses}
              productComparisons={productComparisons}
              marketPositions={marketPositions}
            />
          </TabsContent>

          <TabsContent value="strategy">
            <CompetitiveStrategy
              competitiveAdvantages={competitiveAdvantages}
              strategyRecommendations={strategyRecommendations}
            />
          </TabsContent>

          <TabsContent value="reports">
            <ReportNotes reportNotes={reportNotes} />
          </TabsContent>

          <TabsContent value="conversation" className="h-[600px]">
            <ModuleConversation
              module="market_analysis"
              moduleTitle="Market Analysis"
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
