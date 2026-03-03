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
import { ConnectionStatus } from "@/components/ui/connection-status";
import ModuleHeader from "@/components/ui/module-header";
import { useCompanyInfo } from "@/lib/company-context";
import { getCompanyName } from "@/lib/get-company-name";
import { useRevenueDataAPI } from "@/hooks/useRevenueDataAPI";
import { RevenueStreams } from "@/components/revenue/revenue-streams";
import { RevenueForecasting } from "@/components/revenue/revenue-forecasting";
import { ChurnAnalysisComponent } from "@/components/revenue/churn-analysis";
import { UpsellOpportunities } from "@/components/revenue/upsell-opportunities";
import { ModuleConversation } from "@/components/conversation/module-conversation";
import { SummaryRecommendationSection } from "@/components/module/summary-recommendation-section";
import {
  getSummaryContent,
  SUMMARY_DESCRIPTION,
  getRecommendationContent,
  RECOMMENDATION_DESCRIPTION,
  DEFAULT_REVENUE_ACTION_ITEMS,
  DEFAULT_REVENUE_NEXT_STEPS,
  getSummaryMetrics,
} from "@/mocks/revenue-strategy";
import {
  DollarSign,
  TrendingUp,
  Users,
  AlertTriangle,
  Home,
  Briefcase,
  Calculator,
  ArrowLeft,
  Target,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function RevenueStrategy() {
  const { companyInfo } = useCompanyInfo();
  const companyName = getCompanyName(companyInfo?.companyName);

  const {
    streams: initialStreams,
    scenarios,
    churn,
    upsells,
    metrics,
    discounts,
    channels,
    isLoading,
    isConnected,
    lastUpdated,
    error,
    refreshData,
  } = useRevenueDataAPI();
  const [activeTab, setActiveTab] = useState("overview");
  const [streams, setStreams] = useState(initialStreams);

  const handleAddStream = (newStream: (typeof initialStreams)[0]) => {
    setStreams([...streams, newStream]);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Connection Error</CardTitle>
            <CardDescription>
              Unable to load revenue data. Please check your connection and try
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
        icon={<TrendingUp className="h-6 w-6" />}
        title="Revenue Strategy & Analysis"
        description={`Grow and protect ${companyName} revenue across marketplace products, seller commissions, and advertising channels`}
        isConnected={isConnected}
        lastUpdated={lastUpdated}
        onReconnect={refreshData}
        error={error}
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
                value="streams"
                className="w-full justify-center data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Streams
              </TabsTrigger>
              <TabsTrigger
                value="forecasting"
                className="w-full justify-center data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Forecasting
              </TabsTrigger>
              <TabsTrigger
                value="churn"
                className="w-full justify-center data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Churn
              </TabsTrigger>
              <TabsTrigger
                value="upsell"
                className="w-full justify-center data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Upsell
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
              {metrics.slice(0, 6).map((metric) => (
                <Card key={metric.id}>
                  <CardContent className="p-3 sm:p-4 md:p-6">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 sm:w-5 h-4 sm:h-5 text-blue-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs sm:text-sm text-gray-600 truncate">
                          {metric.name}
                        </div>
                        <div className="text-lg sm:text-2xl font-bold text-gray-900 truncate">
                          {metric.unit === "$" ? "$" : ""}
                          {metric.value.toLocaleString()}
                          {metric.unit !== "$" ? metric.unit : ""}
                        </div>
                        <div
                          className={`text-xs sm:text-sm flex items-center gap-1 ${
                            metric.trend === "up"
                              ? "text-green-600"
                              : metric.trend === "down"
                                ? "text-red-600"
                                : "text-gray-600"
                          }`}
                        >
                          <TrendingUp
                            className={`w-3 h-3 flex-shrink-0 ${
                              metric.trend === "down" ? "rotate-180" : ""
                            }`}
                          />
                          <span className="truncate">
                            {metric.change > 0 ? "+" : ""}
                            {metric.change.toFixed(1)}% {metric.period}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="w-5 h-5 mr-2 text-blue-600" />
                    Top Revenue Streams
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {streams.slice(0, 3).map((stream) => (
                      <div
                        key={stream.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <div className="font-medium">{stream.name}</div>
                          <div className="text-sm text-gray-600">
                            {stream.type.replace("-", " ")}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">
                            ${(stream.currentRevenue / 1000000).toFixed(1)}M
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {stream.growth > 0 ? "+" : ""}
                            {stream.growth.toFixed(1)}% growth
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
                    <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                    Churn Risk Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {churn.map((segment) => (
                      <div
                        key={segment.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <div className="font-medium">{segment.segment}</div>
                          <div className="text-sm text-gray-600">
                            {segment.customers.toLocaleString()} customers
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-red-600">
                            {segment.churnRate}%
                          </div>
                          <div className="text-xs text-gray-600">
                            ${(segment.revenueAtRisk / 1000).toFixed(0)}K at
                            risk
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
                    <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                    Top Upsell Opportunities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {upsells.slice(0, 3).map((upsell) => (
                      <div
                        key={upsell.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <div className="font-medium">{upsell.customer}</div>
                          <div className="text-sm text-gray-600">
                            {upsell.currentPlan} → {upsell.suggestedPlan}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-green-600">
                            +$
                            {(
                              upsell.potentialMRR - upsell.currentMRR
                            ).toLocaleString()}
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {upsell.probabilityScore}% likely
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
                    <Users className="w-5 h-5 mr-2 text-purple-600" />
                    Channel Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {channels.slice(0, 3).map((channel) => (
                      <div
                        key={channel.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <div className="font-medium">{channel.channel}</div>
                          <div className="text-sm text-gray-600">
                            {channel.customers.toLocaleString()} customers
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">
                            ${(channel.revenue / 1000000).toFixed(1)}M
                          </div>
                          <div className="text-xs text-gray-600">
                            {channel.profitability.toFixed(1)}% margin
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
              summaryTitle="Revenue Strategy Summary"
              summaryDescription={SUMMARY_DESCRIPTION}
              summaryText={getSummaryContent(
                streams.length,
                churn.length,
                upsells.length,
              )}
              summaryMetrics={getSummaryMetrics(
                streams.length,
                metrics.length,
                metrics.reduce((a, m) => a + m.value, 0),
                upsells.length,
                channels.length,
              )}
              recommendationTitle="Revenue Strategy Recommendations"
              recommendationDescription={RECOMMENDATION_DESCRIPTION}
              recommendationText={getRecommendationContent()}
              actionItems={DEFAULT_REVENUE_ACTION_ITEMS}
              nextSteps={DEFAULT_REVENUE_NEXT_STEPS}
            />
          </TabsContent>

          <TabsContent value="streams">
            <RevenueStreams streams={streams} onAddStream={handleAddStream} />
          </TabsContent>

          <TabsContent value="forecasting">
            <RevenueForecasting scenarios={scenarios} />
          </TabsContent>

          <TabsContent value="churn">
            <ChurnAnalysisComponent churn={churn} />
          </TabsContent>

          <TabsContent value="upsell">
            <UpsellOpportunities upsells={upsells} />
          </TabsContent>

          <TabsContent value="conversation" className="h-[600px]">
            <ModuleConversation
              module="revenue_strategy"
              moduleTitle="Revenue Strategy"
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
