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
import { usePricingDataAPI } from "@/hooks/usePricingDataAPI";
import { PricingStrategies } from "@/components/pricing/pricing-strategies";
import { CompetitiveAnalysis } from "@/components/pricing/competitive-analysis";
import { PriceTesting } from "@/components/pricing/price-testing";
import { DynamicPricingComponent } from "@/components/pricing/dynamic-pricing";
import { ModuleConversation } from "@/components/conversation/module-conversation";
import { SummaryRecommendationSection } from "@/components/module/summary-recommendation-section";
import {
  MARKET_PREMIUM,
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
  Home,
  Briefcase,
  Calculator,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function PricingStrategy() {
  const { companyInfo } = useCompanyInfo();
  const companyName = getCompanyName(companyInfo?.companyName);

  const {
    strategies,
    competitors,
    tests,
    metrics,
    dynamicPrices,
    isLoading,
    isConnected,
    lastUpdated,
    error,
    refreshData,
  } = usePricingDataAPI();
  const [activeTab, setActiveTab] = useState("overview");

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Connection Error</CardTitle>
            <CardDescription>
              Unable to load pricing data. Please check your connection and try
              again.
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
        icon={<Target className="h-6 w-6" />}
        title="Pricing Strategy"
        description={`${companyName} dynamic pricing models, competitive analysis, and optimization strategies for maximum profitability in the e-commerce marketplace`}
        isConnected={isConnected}
        lastUpdated={lastUpdated}
        onReconnect={refreshData}
        connectionLabel="Live"
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
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
                value="strategies"
                className="w-full justify-center data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Strategies
              </TabsTrigger>
              <TabsTrigger
                value="competitive"
                className="w-full justify-center data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Competitive
              </TabsTrigger>
              <TabsTrigger
                value="testing"
                className="w-full justify-center data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Testing
              </TabsTrigger>
              <TabsTrigger
                value="dynamic"
                className="w-full justify-center data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Dynamic
              </TabsTrigger>
              <TabsTrigger
                value="conversation"
                className="w-full justify-center data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                JOSEPH
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {metrics.map((metric) => (
                <Card key={metric.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-5 h-5 text-blue-600" />
                      <div className="flex-1">
                        <div className="text-sm text-gray-600">
                          {metric.name}
                        </div>
                        <div className="text-2xl font-bold text-gray-900">
                          {metric.value.toFixed(metric.unit === "$" ? 2 : 1)}
                          {metric.unit}
                        </div>
                        <div
                          className={`text-sm flex items-center ${
                            metric.trend === "up"
                              ? "text-green-600"
                              : metric.trend === "down"
                                ? "text-red-600"
                                : "text-gray-600"
                          }`}
                        >
                          <TrendingUp
                            className={`w-3 h-3 mr-1 ${
                              metric.trend === "down" ? "rotate-180" : ""
                            }`}
                          />
                          {metric.change > 0 ? "+" : ""}
                          {metric.change.toFixed(1)}% {metric.period}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
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
                    {strategies.slice(0, 3).map((strategy) => (
                      <div
                        key={strategy.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <div className="font-medium">{strategy.name}</div>
                          <div className="text-sm text-gray-600">
                            {strategy.type.replace("-", " ")}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">
                            ${strategy.suggestedPrice}
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {strategy.confidence}% confidence
                          </Badge>
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
                    {tests
                      .filter((t) => t.status === "running")
                      .map((test) => (
                        <div
                          key={test.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div>
                            <div className="font-medium">{test.name}</div>
                            <div className="text-sm text-gray-600">
                              {test.testType} test
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">{test.confidence}%</div>
                            <Badge className="bg-green-100 text-green-800 text-xs">
                              Running
                            </Badge>
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
                strategies.length,
                metrics.length,
                tests.filter((t) => t.status === "running").length,
              )}
              summaryMetrics={getSummaryMetrics(
                metrics.length > 0
                  ? metrics.reduce((a, m) => a + m.value, 0) / metrics.length
                  : 0,
                strategies.length,
                tests.filter((t) => t.status === "running").length,
              )}
              recommendationTitle="Pricing Recommendations"
              recommendationDescription={RECOMMENDATION_DESCRIPTION}
              recommendationText={getRecommendationContent()}
              actionItems={DEFAULT_PRICING_ACTION_ITEMS}
              nextSteps={DEFAULT_PRICING_NEXT_STEPS}
            />
          </TabsContent>

          <TabsContent value="strategies">
            <PricingStrategies strategies={strategies} />
          </TabsContent>

          <TabsContent value="competitive">
            <CompetitiveAnalysis
              competitors={competitors}
              onRefresh={refreshData}
            />
          </TabsContent>

          <TabsContent value="testing">
            <PriceTesting tests={tests} />
          </TabsContent>

          <TabsContent value="dynamic">
            <DynamicPricingComponent dynamicPrices={dynamicPrices} />
          </TabsContent>

          <TabsContent value="conversation" className="h-[600px]">
            <ModuleConversation
              module="pricing_strategy"
              moduleTitle="Pricing Strategy"
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
