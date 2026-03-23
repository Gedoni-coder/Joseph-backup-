import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingOverlay } from "@/components/ui/loading-spinner";
import ModuleHeader from "@/components/ui/module-header";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useCompanyInfo } from "@/lib/company-context";
import { useCurrency } from "@/lib/currency-context";
import { getCompanyName } from "@/lib/get-company-name";
import { useBusinessForecastingData } from "@/hooks/useBusinessForecastingData";
import { CustomerProfileComponent } from "@/components/business/customer-profile";
import { RevenueProjections } from "@/components/business/revenue-projections";
import { KPIDashboard } from "@/components/business/kpi-dashboard";
import { ScenarioPlanningComponent } from "@/components/business/scenario-planning";
import { BusinessMetricsTable } from "@/components/business/business-metrics-table";
import { FinancialLayout } from "@/components/business/financial-layout";
import { DocumentsSection } from "@/components/business/documents-section";
import { PricingStrategies } from "@/components/pricing/pricing-strategies";
import { SummaryRecommendationSection } from "@/components/module/summary-recommendation-section";
import { RevenueTargetsModal, type RevenueTargets } from "@/components/business/revenue-targets-modal";
import {
  getSummaryContent,
  SUMMARY_DESCRIPTION,
  getRecommendationContent,
  RECOMMENDATION_DESCRIPTION,
  getSummaryMetrics,
} from "@/lib/business-forecast-content";
import {
  Building2,
  RefreshCw,
  Calendar,
  TrendingUp,
  DollarSign,
  Users,
  Target,
  PieChart,
  BarChart3,
  AlertTriangle,
  Activity,
  Briefcase,
  Wifi,
  Bell,
  X,
  Lightbulb,
} from "lucide-react";

const BusinessForecast = () => {
  const { companyInfo } = useCompanyInfo();
  const { formatCurrency } = useCurrency();
  const companyName = getCompanyName(companyInfo?.companyName);

  const {
    customerProfiles,
    revenueProjections,
    kpis,
    scenarios,
    costStructure,
    cashFlowForecast,
    keyAssumptions,
    keyRisks,
    competitiveMetrics,
    actionItems,
    nextSteps,
    growthTrajectory,
    revenueTargetData,
    businessMetrics,
    revenueProductServiceForecasts,
    revenueRegionalForecasts,
    revenueHistoricalComparisons,
    revenueForecastMethods,
    revenueScenarioSnapshots,
    revenueSegmentBreakdowns,
    costOverviewMetrics,
    costBudgetScenarios,
    costMonthlyComparisons,
    operationalExpenseCategories,
    operationalExpenseItems,
    costTrendAnalyses,
    overviewProfitLossSnapshots,
    overviewKpiSummaries,
    overviewAlerts,
    alerts,
    lastUpdated,
    isLoading,
    error,
    isConnected,
    refreshData,
    updateKPI,
    updateScenario,
    saveRevenueTargets,
    reconnect,
  } = useBusinessForecastingData();

  // Revenue targets state
  const [showRevenueModal, setShowRevenueModal] = useState(false);
  const [revenueTargets, setRevenueTargets] = useState<RevenueTargets | null>(null);

  useEffect(() => {
    if (revenueTargetData) {
      setRevenueTargets({
        annualRevenue: revenueTargetData.annualRevenue,
        monthlyRevenue: revenueTargetData.monthlyTarget,
        q1Revenue: revenueTargetData.q1Revenue,
        q2Revenue: revenueTargetData.q2Revenue,
        q3Revenue: revenueTargetData.q3Revenue,
        q4Revenue: revenueTargetData.q4Revenue,
      });
    }
  }, [revenueTargetData]);

  // Auto-popup modal for new users (3 seconds after page load)
  useEffect(() => {
    const isNewUser = !revenueTargetData;
    if (isNewUser) {
      const timer = setTimeout(() => {
        setShowRevenueModal(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [revenueTargetData]);

  const handleSaveRevenueTargets = async (targets: RevenueTargets) => {
    setRevenueTargets(targets);
    await saveRevenueTargets({
      id: revenueTargetData?.id,
      annualRevenue: targets.annualRevenue,
      monthlyRevenue: targets.monthlyRevenue,
      q1Revenue: targets.q1Revenue,
      q2Revenue: targets.q2Revenue,
      q3Revenue: targets.q3Revenue,
      q4Revenue: targets.q4Revenue,
    });
  };

  const handleRefresh = async () => {
    await refreshData();
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <ModuleHeader
          icon={<TrendingUp className="h-6 w-6" />}
          title="Business Forecasting"
          description={`Advanced predictive analytics for ${companyName} revenue projections, growth forecasts, and comprehensive business planning`}
          isConnected={isConnected}
          lastUpdated={lastUpdated}
          onReconnect={reconnect}
          error={error}
          connectionLabel="Live"
        />

        <main className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 space-y-6 sm:space-y-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <Card className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setShowRevenueModal(true)}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-economic-positive/10 rounded-lg">
                    <DollarSign className="h-5 w-5 text-economic-positive" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-muted-foreground">
                      Annual Revenue Target
                    </div>
                    <div className="text-lg font-bold">
{revenueTargets
                        ? formatCurrency(revenueTargets.annualRevenue)
                        : revenueTargetData
                          ? formatCurrency(revenueTargetData.annualRevenue)
                        : "Not set"}
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {revenueTargets || revenueTargetData ? "Set" : "Click to set"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Customer Segments
                    </div>
                    <div className="text-lg font-bold">
                      {customerProfiles.length}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-economic-warning/10 rounded-lg">
                    <Target className="h-5 w-5 text-economic-warning" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      KPIs Tracked
                    </div>
                    <div className="text-lg font-bold">{kpis.length}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-economic-neutral/10 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-economic-neutral" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Scenarios Modeled
                    </div>
                    <div className="text-lg font-bold">{scenarios.length}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
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
                  value="tables"
                  className="w-full justify-center data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                >
                  Tables
                </TabsTrigger>
                <TabsTrigger
                  value="revenue"
                  className="w-full justify-center data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                >
                  Revenue
                </TabsTrigger>
                <TabsTrigger
                  value="costs"
                  className="w-full justify-center data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                >
                  Costs
                </TabsTrigger>
                <TabsTrigger
                  value="planning"
                  className="w-full justify-center data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                >
                  Planning
                </TabsTrigger>
                <TabsTrigger
                  value="analytics"
                  className="w-full justify-center data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                >
                  Analytics
                </TabsTrigger>
                <TabsTrigger
                  value="pricing"
                  className="w-full justify-center data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                >
                  Pricing
                </TabsTrigger>
                <TabsTrigger
                  value="documents"
                  className="w-full justify-center data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                >
                  Documents
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview" className="space-y-8">
              {/* Revenue Forecast vs Target Summary */}
              <section>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Revenue Forecast vs Target
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {!revenueTargets ? (
                      <div className="flex flex-col items-center justify-center py-12 px-4">
                        <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-center text-muted-foreground mb-4">
                          Please set your revenue targets to view forecasts and projections
                        </p>
                        <Button
                          onClick={() => setShowRevenueModal(true)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Set Revenue Targets
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="p-4">
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium text-muted-foreground">
                              Annual Target
                            </h4>
                            <div className="text-3xl font-bold text-economic-positive">
                              {formatCurrency(revenueTargets.annualRevenue)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Total yearly revenue goal
                            </p>
                          </div>
                        </Card>
                        <Card className="p-4">
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium text-muted-foreground">
                              Projected Revenue
                            </h4>
                          <div className="text-3xl font-bold">
                              {formatCurrency(
                                revenueProjections.reduce(
                                  (sum, p) => sum + (p.projected || 0),
                                  0,
                                )
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Based on current forecasts
                            </p>
                          </div>
                        </Card>
                        <Card className="p-4">
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium text-muted-foreground">
                              Achievement %
                            </h4>
                            <div className="text-3xl font-bold">
                              {(
                                (revenueProjections.reduce(
                                  (sum, p) => sum + (p.projected || 0),
                                  0,
                                ) /
                                  revenueTargets.annualRevenue) *
                                100 || 0
                              ).toFixed(0)}%
                            </div>
                            <p className="text-xs text-muted-foreground">
                              On track to goal
                            </p>
                          </div>
                        </Card>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </section>

              {/* Monthly/Quarterly/Annual Revenue */}
              <section>
                {!revenueTargets ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Revenue Projections
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center justify-center py-12 px-4">
                        <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-center text-muted-foreground mb-4">
                          Please set your revenue targets to view detailed projections and forecasts
                        </p>
                        <Button
                          onClick={() => setShowRevenueModal(true)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Set Revenue Targets
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <LoadingOverlay
                    isLoading={isLoading}
                    loadingText="Calculating revenue projections..."
                  >
                    <RevenueProjections projections={revenueProjections} />
                  </LoadingOverlay>
                )}
              </section>

              {/* Cash Flow Forecast */}
              <section>
                <LoadingOverlay
                  isLoading={isLoading}
                  loadingText="Updating cash flow..."
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Cash Flow Forecast
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
{cashFlowForecast.slice(0, 6).map((flow) => (
                            <Card key={flow.id} className="p-3">
                              <div className="space-y-2">
                                <h4 className="font-medium text-sm">
                                  {flow.month}
                                </h4>
                                <div className="space-y-1">
                                  <div className="flex justify-between text-xs">
                                    <span className="text-muted-foreground">
                                      Inflow
                                    </span>
                                    <span className="text-economic-positive">
                                      ${(flow.cashInflow / 1000000).toFixed(1)}M
                                    </span>
                                  </div>
                                  <div className="flex justify-between text-xs">
                                    <span className="text-muted-foreground">
                                      Outflow
                                    </span>
                                    <span className="text-economic-negative">
                                      ${(flow.cashOutflow / 1000000).toFixed(1)}
                                      M
                                    </span>
                                  </div>
                                  <div className="flex justify-between text-sm border-t pt-1">
                                    <span className="font-medium">Net</span>
                                    <span
                                      className={
                                        flow.netCashFlow > 0
                                          ? "text-economic-positive"
                                          : "text-economic-negative"
                                      }
                                    >
                                      ${(flow.netCashFlow / 1000000).toFixed(1)}
                                      M
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </LoadingOverlay>
              </section>

              {/* Profit/Loss Projection */}
              <section>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Profit/Loss Projection
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {overviewProfitLossSnapshots.length > 0 ? (
                        <>
                          <Card className="p-4">
                            <div className="space-y-2">
                              <h4 className="text-sm font-medium text-muted-foreground">
                                Gross Profit
                              </h4>
                              <div className="text-3xl font-bold text-economic-positive">
                                {formatCurrency(overviewProfitLossSnapshots[0].grossProfit)}
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {overviewProfitLossSnapshots[0].grossMargin.toFixed(1)}% margin (After COGS)
                              </p>
                            </div>
                          </Card>
                          <Card className="p-4">
                            <div className="space-y-2">
                              <h4 className="text-sm font-medium text-muted-foreground">
                                Operating Expense
                              </h4>
                              <div className="text-3xl font-bold text-economic-negative">
                                {formatCurrency(overviewProfitLossSnapshots[0].operatingExpense)}
                              </div>
                              <p className="text-xs text-muted-foreground">
                                Annual overhead
                              </p>
                            </div>
                          </Card>
                          <Card className="p-4">
                            <div className="space-y-2">
                              <h4 className="text-sm font-medium text-muted-foreground">
                                Net Profit
                              </h4>
                              <div className={`text-3xl font-bold ${overviewProfitLossSnapshots[0].netProfit >= 0 ? 'text-economic-positive' : 'text-economic-negative'}`}>
                                {formatCurrency(overviewProfitLossSnapshots[0].netProfit)}
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {overviewProfitLossSnapshots[0].netMargin.toFixed(1)}% margin (Bottom line)
                              </p>
                            </div>
                          </Card>
                        </>
                      ) : (
                        <p className="text-sm text-muted-foreground">No profit/loss snapshot available.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Key Performance Indicators */}
              <section>
                <LoadingOverlay
                  isLoading={isLoading}
                  loadingText="Refreshing KPIs..."
                >
                  <KPIDashboard
                    kpis={kpis.slice(0, 6)}
                    title="Key Performance Indicators"
                  />
                  {overviewKpiSummaries.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-3">
                      <Card className="p-3">
                        <p className="text-xs text-muted-foreground">Metrics Tracked</p>
                        <p className="text-xl font-bold">{overviewKpiSummaries[0].metricsTracked}</p>
                      </Card>
                      <Card className="p-3">
                        <p className="text-xs text-muted-foreground">Excellent</p>
                        <p className="text-xl font-bold">{overviewKpiSummaries[0].excellentCount}</p>
                      </Card>
                      <Card className="p-3">
                        <p className="text-xs text-muted-foreground">Good</p>
                        <p className="text-xl font-bold">{overviewKpiSummaries[0].goodCount}</p>
                      </Card>
                      <Card className="p-3">
                        <p className="text-xs text-muted-foreground">Fair</p>
                        <p className="text-xl font-bold">{overviewKpiSummaries[0].fairCount}</p>
                      </Card>
                      <Card className="p-3">
                        <p className="text-xs text-muted-foreground">Needs Attention</p>
                        <p className="text-xl font-bold">{overviewKpiSummaries[0].needsAttentionCount}</p>
                      </Card>
                    </div>
                  )}
                </LoadingOverlay>
              </section>

              {/* Alerts & Warnings */}
              <section>
                <Card className="border-orange-200 bg-orange-50">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2 text-orange-900">
                      <AlertTriangle className="h-5 w-5 text-orange-600" />
                      Alerts & Warnings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {overviewAlerts.map((alert) => (
                        <div key={`${alert.type}-${alert.title}`} className="flex items-start gap-3 p-3 bg-white rounded border border-orange-200">
                          <AlertTriangle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm text-orange-900">
                              {alert.title}
                            </h4>
                            <p className="text-xs text-orange-800 mt-1">
                              {alert.description}
                            </p>
                          </div>
                        </div>
                      ))}
                      {!overviewAlerts.length && (
                        <p className="text-sm text-muted-foreground">
                          No alerts at this time.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Customer Profiles */}
              <section>
                <LoadingOverlay
                  isLoading={isLoading}
                  loadingText="Updating customer data..."
                >
                  <CustomerProfileComponent profiles={customerProfiles} />
                </LoadingOverlay>
              </section>
            </TabsContent>

            <TabsContent value="summary-recommendation" className="space-y-8">
              <SummaryRecommendationSection
                summaryTitle="Business Forecast Summary"
                summaryDescription={SUMMARY_DESCRIPTION}
                summaryText={getSummaryContent(
                  customerProfiles.length,
                  scenarios.length,
                  kpis.length,
                  revenueTargets
                    ? formatCurrency(revenueTargets.annualRevenue)
                    : revenueTargetData
                    ? formatCurrency(revenueTargetData.annualRevenue)
                    : "Not set",
                )}
                summaryMetrics={getSummaryMetrics(
                  customerProfiles.length,
                  kpis.length,
                  scenarios.length,
                  revenueTargets
                    ? formatCurrency(revenueTargets.annualRevenue)
                    : revenueTargetData
                    ? formatCurrency(revenueTargetData.annualRevenue)
                    : "Not set",
                )}
                recommendationTitle="Business Forecast Recommendations"
                recommendationDescription={RECOMMENDATION_DESCRIPTION}
                recommendationText={getRecommendationContent()}
                actionItems={actionItems}
                nextSteps={nextSteps}
              />
            </TabsContent>

            <TabsContent value="tables" className="space-y-8">
              {/* Business Metrics Table */}
              <section>
                <BusinessMetricsTable metrics={businessMetrics} />
              </section>

              {/* Financial Layout Metrics */}
              <section>
                <FinancialLayout />
              </section>
            </TabsContent>

            <TabsContent value="revenue" className="space-y-8">
              {/* Monthly/Quarterly/Yearly Views - Revenue Projections */}
              <section>
                {!revenueTargets ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Revenue Projections
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center justify-center py-12 px-4">
                        <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-center text-muted-foreground mb-4">
                          Please set your revenue targets to view detailed projections and forecasts
                        </p>
                        <Button
                          onClick={() => setShowRevenueModal(true)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Set Revenue Targets
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <RevenueProjections projections={revenueProjections} />
                )}
              </section>

              {/* Forecast by Product/Service */}
              <section>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Forecast by Product/Service
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {revenueProductServiceForecasts.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No product/service forecast data found.</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {revenueProductServiceForecasts.map((item) => (
                          <Card key={item.id} className="p-4">
                            <div className="space-y-3">
                              <h4 className="font-semibold text-sm">{item.name}</h4>
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">{item.projection_year} Projection</span>
                                  <span className="font-bold">{formatCurrency(item.projected_revenue)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Growth Rate</span>
                                  <span className="font-bold text-economic-positive">+{item.growth_rate}%</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Market Share</span>
                                  <span className="font-bold">{item.market_share}%</span>
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </section>

              {/* Forecast by Region/Market/Customer Segment */}
              <section>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Forecast by Region, Market & Customer Segment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-sm mb-3">
                          By Geographic Region
                        </h4>
                        {revenueRegionalForecasts.length === 0 ? (
                          <p className="text-sm text-muted-foreground">No geographic forecast data found.</p>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {revenueRegionalForecasts.map((region) => (
                              <Card key={region.id} className="p-4">
                                <div className="space-y-2">
                                  <h5 className="font-medium text-sm">{region.region}</h5>
                                  <div className="text-2xl font-bold">{formatCurrency(region.projected_revenue)}</div>
                                  <p className="text-xs text-muted-foreground">{region.revenue_share}% of revenue</p>
                                  <div className="flex justify-between text-xs mt-2">
                                    <span>Growth:</span>
                                    <span className="text-economic-positive font-bold">+{region.growth_rate}%</span>
                                  </div>
                                </div>
                              </Card>
                            ))}
                          </div>
                        )}
                      </div>

                      <div>
                        <h4 className="font-semibold text-sm mb-3">
                          By Customer Segment
                        </h4>
                        <div className="space-y-2">
                          {customerProfiles.map((profile) => (
                            <div
                              key={profile.id}
                              className="flex items-center justify-between p-3 border rounded-lg"
                            >
                              <div className="flex-1">
                                <p className="font-medium text-sm">
                                  {profile.segment}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Growth Rate: {profile.growthRate}%
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-sm">
                                  $
                                  {(
                                    (profile.demandAssumption *
                                      profile.avgOrderValue) /
                                    1000000
                                  ).toFixed(1)}
                                  M
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Retention: {profile.retention}%
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Historical Revenue Comparison */}
              <section>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Historical Revenue Comparison
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {revenueHistoricalComparisons.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No historical comparison data found.</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {revenueHistoricalComparisons.map((item, idx) => (
                          <Card key={item.id} className={`p-4 ${idx === 0 ? 'bg-muted/30' : 'bg-blue-50'}`}>
                            <div className="space-y-3">
                              <h4 className="font-semibold text-sm">{item.label}</h4>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-sm">Total Revenue</span>
                                  <span className="font-bold">{formatCurrency(item.total_revenue)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm">{item.growth_label}</span>
                                  <span className="font-bold text-economic-positive">+{item.growth_percent}%</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm">{item.supporting_metric_label}</span>
                                  <span className="font-bold">{item.supporting_metric_value}</span>
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </section>

              {/* Trend Analysis & Forecasting Methods */}
              <section>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Trend Analysis & Forecasting Methods
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {revenueForecastMethods.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No forecasting method data found.</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[0, 1].map((column) => (
                          <div key={column} className="space-y-4">
                            {revenueForecastMethods
                              .filter((_, idx) => idx % 2 === column)
                              .map((method) => (
                                <div key={method.id} className="border rounded-lg p-4">
                                  <h4 className="font-semibold text-sm mb-2">{method.name}</h4>
                                  <p className="text-xs text-muted-foreground mb-3">{method.description}</p>
                                  <div className="space-y-1">
                                    <div className="flex justify-between text-sm">
                                      <span>2025 Projection</span>
                                      <span className="font-bold">{formatCurrency(method.projected_revenue)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <span>{method.metric_label}</span>
                                      <span className="font-bold">{method.metric_value}</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </section>

              {/* Scenario-Based Forecasting */}
              <section>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      Scenario-Based Forecasting
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {scenarios.map((scenario) => (
                        <Card key={scenario.id} className="p-4 border-2">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold text-sm">
                                {scenario.scenario}
                              </h4>
                              <Badge
                                variant={
                                  scenario.scenario === "Best Case"
                                    ? "default"
                                    : scenario.scenario === "Base Case"
                                      ? "secondary"
                                      : "destructive"
                                }
                              >
                                {scenario.probability}%
                              </Badge>
                            </div>

                            <div className="space-y-2">
                              <div className="border-t pt-2">
                                <p className="text-xs text-muted-foreground mb-1">
                                  Annual Revenue
                                </p>
                                <p className="text-2xl font-bold">
                                  ${(scenario.revenue / 1000000).toFixed(1)}M
                                </p>
                              </div>

                              <div className="border-t pt-2">
                                <p className="text-xs text-muted-foreground mb-1">
                                  Operating Costs
                                </p>
                                <p className="font-bold">
                                  ${(scenario.costs / 1000000).toFixed(1)}M
                                </p>
                              </div>

                              <div className="border-t pt-2">
                                <p className="text-xs text-muted-foreground mb-1">
                                  Net Profit
                                </p>
                                <p className="text-lg font-bold text-economic-positive">
                                  ${(scenario.profit / 1000000).toFixed(1)}M
                                </p>
                              </div>

                              <div className="border-t pt-2">
                                <p className="text-xs font-semibold mb-1">
                                  Key Assumptions
                                </p>
                                <ul className="text-xs space-y-1">
                                  {scenario.keyAssumptions.map(
                                    (assumption, idx) => (
                                      <li
                                        key={idx}
                                        className="text-muted-foreground"
                                      >
                                        • {assumption}
                                      </li>
                                    ),
                                  )}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                      {revenueScenarioSnapshots.map((snapshot) => (
                        <Card key={snapshot.id} className="p-4 border-2 border-destructive/30">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold text-sm">{snapshot.scenario}</h4>
                              <Badge variant="outline" className="border-destructive text-destructive">
                                {snapshot.probability}%
                              </Badge>
                            </div>

                            <div className="space-y-2">
                              <div className="border-t pt-2">
                                <p className="text-xs text-muted-foreground mb-1">Annual Revenue</p>
                                <p className="text-2xl font-bold">{formatCurrency(snapshot.annual_revenue)}</p>
                              </div>

                              <div className="border-t pt-2">
                                <p className="text-xs text-muted-foreground mb-1">Operating Costs</p>
                                <p className="font-bold">{formatCurrency(snapshot.operating_costs)}</p>
                              </div>

                              <div className="border-t pt-2">
                                <p className="text-xs text-muted-foreground mb-1">Net Profit</p>
                                <p className="text-lg font-bold text-economic-negative">{formatCurrency(snapshot.net_profit)}</p>
                              </div>

                              <div className="border-t pt-2">
                                <p className="text-xs font-semibold mb-1">Key Assumptions</p>
                                <ul className="text-xs space-y-1">
                                  {snapshot.key_assumptions.map((item: string, idx: number) => (
                                    <li key={idx} className="text-muted-foreground">• {item}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Customer Demand Analysis */}
              <section>
                <CustomerProfileComponent profiles={customerProfiles} />
              </section>

              {/* Revenue Breakdown Analysis */}
              <section>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Revenue Breakdown Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      {/* By Customer Segment */}
                      <div>
                        <h4 className="font-semibold text-sm mb-4">
                          By Customer Segment
                        </h4>
                        {revenueSegmentBreakdowns.length === 0 ? (
                          <p className="text-sm text-muted-foreground">No segment breakdown data found.</p>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {revenueSegmentBreakdowns.map((segment, idx) => {
                              const leftAccent = idx % 2 === 0 ? 'border-l-blue-500 bg-blue-50/50' : 'border-l-emerald-500 bg-emerald-50/50';
                              const headingColor = idx % 2 === 0 ? 'text-blue-900' : 'text-emerald-900';
                              const valueColor = idx % 2 === 0 ? 'text-blue-600' : 'text-emerald-600';
                              return (
                                <Card key={segment.id} className={`p-5 border-l-4 ${leftAccent}`}>
                                  <div className="space-y-3">
                                    <h5 className={`font-semibold text-sm ${headingColor}`}>{segment.segment}</h5>
                                    <div className={`text-3xl font-bold ${valueColor}`}>{formatCurrency(segment.revenue)}</div>
                                    <div className="space-y-2 text-xs text-muted-foreground">
                                      <div className="flex justify-between">
                                        <span>% of Total Revenue:</span>
                                        <span className="font-medium">{segment.percentage_of_total}%</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Growth Rate:</span>
                                        <span className="font-medium text-economic-positive">+{segment.growth_rate}%</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Customer Count:</span>
                                        <span className="font-medium">{segment.customer_count}</span>
                                      </div>
                                    </div>
                                  </div>
                                </Card>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Growth Trajectory */}
                      <div className="border-t pt-6">
                        <h4 className="font-semibold text-sm mb-4">
                          Growth Trajectory
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                          {growthTrajectory.map((item, idx) => {
                            const colors = [
                              { border: 'border-amber-100', heading: 'text-amber-900', value: 'text-amber-600' },
                              { border: 'border-blue-100', heading: 'text-blue-900', value: 'text-blue-600' },
                              { border: 'border-purple-100', heading: 'text-purple-900', value: 'text-purple-600' },
                              { border: 'border-green-100', heading: 'text-green-900', value: 'text-green-600' },
                            ];
                            const color = colors[idx % colors.length];
                            return (
                              <Card key={idx} className={`p-4 border-2 ${color.border}`}>
                                <div className="space-y-2">
                                  <h5 className={`font-semibold text-xs ${color.heading}`}>
                                    {item.quarter}
                                  </h5>
                                  <p className="text-sm text-muted-foreground">
                                    {item.description}
                                  </p>
                                  <div className={`text-xl font-bold ${color.value} mt-2`}>
                                    {formatCurrency(item.revenueTarget)}
                                  </div>
                                </div>
                              </Card>
                            );
                          })}
                        </div>
                      </div>

                      {/* Plan Growth Strategy */}
                      <div className="border-t pt-6">
                        <Link to="/revenue-strategy">
                          <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                            <TrendingUp className="h-4 w-4 mr-2" />
                            Plan Growth Strategy
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>
            </TabsContent>

            <TabsContent value="costs" className="space-y-8">
              {/* Cost & Expense Forecasting Header */}
              <section>
                <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <DollarSign className="h-6 w-6 text-blue-600" />
                      Cost & Expense Forecasting
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-2">
                      Predicts future spending to ensure profitability.
                      Comprehensive view of fixed costs, variable costs, and
                      forecasted expenses.
                    </p>
                  </CardHeader>
                </Card>
              </section>

              {/* Fixed vs Variable Costs Overview */}
              <section>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Fixed vs Variable Costs Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {costOverviewMetrics.map((metric) => {
                        const fixed = metric.costType === "fixed";
                        return (
                          <Card
                            key={metric.id}
                            className={`p-4 border-2 ${
                              fixed
                                ? "border-orange-200 bg-orange-50"
                                : "border-purple-200 bg-purple-50"
                            }`}
                          >
                            <div className="space-y-3">
                              <h4
                                className={`font-semibold text-sm ${
                                  fixed ? "text-orange-900" : "text-purple-900"
                                }`}
                              >
                                {fixed ? "Fixed Costs" : "Variable Costs"}
                              </h4>
                              <p
                                className={`text-xs ${
                                  fixed ? "text-orange-800" : "text-purple-800"
                                }`}
                              >
                                {metric.description}
                              </p>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-sm">Annual Total</span>
                                  <span className="font-bold text-lg">
                                    {formatCurrency(metric.annualTotal)}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm">Monthly Avg</span>
                                  <span className="font-bold">
                                    {formatCurrency(metric.monthlyAverage)}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm">% of Revenue</span>
                                  <span className="font-bold">
                                    {metric.percentOfRevenue}%
                                  </span>
                                </div>
                              </div>
                              <div className="border-t pt-2 mt-2">
                                <div className="flex items-center gap-2">
                                  <TrendingUp
                                    className={`h-4 w-4 ${
                                      fixed ? "text-orange-600" : "text-purple-600"
                                    }`}
                                  />
                                  <span
                                    className={`text-xs font-semibold ${
                                      fixed ? "text-orange-800" : "text-purple-800"
                                    }`}
                                  >
                                    {metric.insight}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </Card>
                        );
                      })}
                      {!costOverviewMetrics.length && (
                        <p className="text-sm text-muted-foreground">
                          No cost overview metrics available.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Detailed Cost Breakdown */}
              <section>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <PieChart className="h-5 w-5" />
                      Detailed Cost Breakdown by Category
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
{costStructure.map((cost) => (
                        <Card key={cost.id} className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-sm">
                                {cost.category}
                              </h4>
                              <Badge
                                variant={
                                  cost.type === "COGS" ? "default" : "secondary"
                                }
                              >
                                {cost.type}
                              </Badge>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                  Amount
                                </span>
                                <span className="font-semibold">
                                  ${(cost.amount / 1000).toFixed(0)}K
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                  % of Total
                                </span>
                                <span className="font-medium">
                                  {cost.percentage}%
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                  Type
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {cost.variability}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Forecast vs Actual vs Budget Comparison */}
              <section>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Forecast vs Actual vs Budget Comparison
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {costBudgetScenarios.map((scenario) => {
                          const key = scenario.label.toLowerCase();
                          const cardClasses = key.includes("budget")
                            ? "bg-blue-50"
                            : key.includes("variance")
                            ? "bg-green-50"
                            : "bg-purple-50";
                          const titleClasses = key.includes("budget")
                            ? "text-blue-900"
                            : key.includes("variance")
                            ? "text-green-900"
                            : "text-purple-900";
                          const valueClasses = key.includes("budget")
                            ? "text-blue-600"
                            : key.includes("variance")
                            ? "text-green-600"
                            : "text-purple-600";
                          const subtitleClasses = key.includes("budget")
                            ? "text-blue-800"
                            : key.includes("variance")
                            ? "text-green-800"
                            : "text-purple-800";

                          return (
                            <Card key={scenario.id} className={`p-4 ${cardClasses}`}>
                              <div className="space-y-2">
                                <h5 className={`font-semibold text-sm ${titleClasses}`}>
                                  {scenario.label}
                                </h5>
                                <div className={`text-3xl font-bold ${valueClasses}`}>
                                  {formatCurrency(scenario.amount)}
                                </div>
                                <p className={`text-xs ${subtitleClasses}`}>
                                  {scenario.subtitle || scenario.note}
                                </p>
                              </div>
                            </Card>
                          );
                        })}
                        {!costBudgetScenarios.length && (
                          <p className="text-sm text-muted-foreground">
                            No budget scenarios available.
                          </p>
                        )}
                      </div>

                      <div className="border rounded-lg p-4 space-y-4">
                        <h4 className="font-semibold text-sm">
                          Monthly Comparison
                        </h4>
                        <div className="space-y-3">
                          {costMonthlyComparisons.map((row) => (
                            <div key={row.month} className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-sm">
                                  {row.month}
                                </span>
                              </div>
                              <div className="flex gap-2">
                                <div className="flex-1 flex items-center gap-2">
                                  <Badge variant="outline" className="text-xs">
                                    Budget
                                  </Badge>
                                  <div className="flex-1">
                                    <div className="h-6 bg-blue-200 rounded flex items-center justify-center text-xs font-semibold">
                                      ${(row.budgetAmount / 1000).toFixed(0)}K
                                    </div>
                                  </div>
                                </div>
                                <div className="flex-1 flex items-center gap-2">
                                  <Badge variant="outline" className="text-xs">
                                    Forecast
                                  </Badge>
                                  <div className="flex-1">
                                    <div className="h-6 bg-purple-200 rounded flex items-center justify-center text-xs font-semibold">
                                      ${(row.forecastAmount / 1000).toFixed(0)}K
                                    </div>
                                  </div>
                                </div>
                                {row.actualAmount !== null && (
                                  <div className="flex-1 flex items-center gap-2">
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      Actual
                                    </Badge>
                                    <div className="flex-1">
                                      <div className="h-6 bg-green-200 rounded flex items-center justify-center text-xs font-semibold">
                                        ${(row.actualAmount / 1000).toFixed(0)}K
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                          {!costMonthlyComparisons.length && (
                            <p className="text-sm text-muted-foreground">
                              No monthly cost comparisons available.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Operational Expense Categories */}
              <section>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      Operational Expense Categories
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {operationalExpenseCategories.map((category, index) => {
                        const borderColors = [
                          "border-l-blue-500",
                          "border-l-purple-500",
                          "border-l-orange-500",
                          "border-l-green-500",
                        ];
                        const categoryItems = operationalExpenseItems.filter(
                          (item) => item.categoryId === category.id,
                        );

                        return (
                          <Card
                            key={category.id}
                            className={`p-4 border-l-4 ${borderColors[index % borderColors.length]}`}
                          >
                            <div className="space-y-3">
                              <h5 className="font-semibold text-sm">{category.name}</h5>
                              <div className="space-y-2">
                                {categoryItems.map((item) => (
                                  <div key={item.id} className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">
                                      {item.name}
                                    </span>
                                    <span className="font-bold">
                                      {formatCurrency(item.amount)}
                                    </span>
                                  </div>
                                ))}
                                <div className="border-t pt-2 flex justify-between font-bold">
                                  <span>Total</span>
                                  <span>{formatCurrency(category.totalAmount)}</span>
                                </div>
                              </div>
                            </div>
                          </Card>
                        );
                      })}
                      {!operationalExpenseCategories.length && (
                        <p className="text-sm text-muted-foreground">
                          No operational expense categories available.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Cost Trend Analysis */}
              <section>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Cost Trend Analysis & Projections
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {costTrendAnalyses.map((trend, index) => (
                          <Card key={trend.id} className="p-4">
                            <div className="space-y-3">
                              <h5 className="font-semibold text-sm">{trend.title}</h5>
                              <div
                                className={`text-3xl font-bold ${
                                  index % 2 === 0 ? "text-orange-600" : "text-green-600"
                                }`}
                              >
                                {trend.value}
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {trend.description}
                              </p>
                              <div className="border-t pt-2 mt-2">
                                <p className="text-xs text-muted-foreground">
                                  {trend.benchmark}
                                </p>
                                <ul className="text-xs space-y-1 mt-1">
                                  {trend.bulletPoints.map((point) => (
                                    <li key={point}>• {point}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </Card>
                        ))}
                        {!costTrendAnalyses.length && (
                          <p className="text-sm text-muted-foreground">
                            No cost trend analyses available.
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Cash Flow Forecast */}
              <section>
                <LoadingOverlay
                  isLoading={isLoading}
                  loadingText="Updating cash flow..."
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Monthly Cash Flow Forecast
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
                          {cashFlowForecast.map((flow) => (
                            <Card key={flow.id} className="p-3">
                              <div className="space-y-2">
                                <h4 className="font-medium text-sm">
                                  {flow.month}
                                </h4>
                                <div className="space-y-1">
                                  <div className="flex justify-between text-xs">
                                    <span className="text-muted-foreground">
                                      Inflow
                                    </span>
                                    <span className="text-economic-positive">
                                      ${(flow.cashInflow / 1000000).toFixed(1)}M
                                    </span>
                                  </div>
                                  <div className="flex justify-between text-xs">
                                    <span className="text-muted-foreground">
                                      Outflow
                                    </span>
                                    <span className="text-economic-negative">
                                      ${(flow.cashOutflow / 1000000).toFixed(1)}
                                      M
                                    </span>
                                  </div>
                                  <div className="flex justify-between text-sm border-t pt-1">
                                    <span className="font-medium">Net</span>
                                    <span
                                      className={
                                        flow.netCashFlow > 0
                                          ? "text-economic-positive"
                                          : "text-economic-negative"
                                      }
                                    >
                                      ${(flow.netCashFlow / 1000000).toFixed(1)}
                                      M
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </LoadingOverlay>
              </section>
            </TabsContent>

            <TabsContent value="planning" className="space-y-8">
              {/* Scenario Planning */}
              <section>
                <LoadingOverlay
                  isLoading={isLoading}
                  loadingText="Updating scenarios..."
                >
                  <ScenarioPlanningComponent scenarios={scenarios} />
                </LoadingOverlay>
              </section>

              {/* Risk & Assumption Analysis */}
              <section>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Risk & Assumption Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm">Key Risks</h4>
                        <div className="space-y-2">
                          {keyRisks.map((risk, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2 border rounded">
                              <span className="text-sm">{risk.label}</span>
                              <Badge
                                variant={risk.level === 'high' ? 'destructive' : risk.level === 'low' ? 'secondary' : 'default'}
                                className={`text-xs ${risk.level === 'medium' ? 'bg-economic-warning text-economic-warning-foreground' : ''}`}
                              >
                                {risk.level.charAt(0).toUpperCase() + risk.level.slice(1)}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm">
                          Key Assumptions
                        </h4>
                        <div className="space-y-2 text-sm text-muted-foreground">
                          {keyAssumptions.map((assumption, idx) => (
                            <p key={idx}>
                              • {assumption.label}: {assumption.value}
                            </p>
                          ))}
                          <div className="mt-3">
                            <Link to="/risk-management">
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-orange-200 text-orange-700"
                              >
                                <AlertTriangle className="h-4 w-4 mr-2" />
                                Risk Management
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-8">
              {/* Performance Metrics & KPIs */}
              <section>
                <KPIDashboard kpis={kpis} />
              </section>

              {/* Competitive & Market Context */}
              <section>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Competitive & Market Context
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {competitiveMetrics.map((metric, idx) => (
                          <Card key={idx} className="p-4">
                            <div className="space-y-2">
                              <h4 className="font-medium text-sm">
                                {metric.label}
                              </h4>
                              <div className="text-2xl font-bold">
                                {metric.currentValue}
                                {metric.unit}
                              </div>
                              {metric.targetValue && (
                                <div className="text-xs text-muted-foreground">
                                  Target: {metric.targetValue}
                                  {metric.unit}
                                </div>
                              )}
                            </div>
                          </Card>
                        ))}
                      </div>
                      <div className="mt-6 text-center">
                        <Link to="/market-competitive-analysis">
                          <Button
                            variant="outline"
                            className="border-blue-200 text-blue-700"
                          >
                            <BarChart3 className="h-4 w-4 mr-2" />
                            Detailed Market Analysis
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>
            </TabsContent>

            <TabsContent value="pricing" className="space-y-8">
              <section>
                <PricingStrategies />
              </section>
            </TabsContent>

            <TabsContent value="documents" className="space-y-8">
              <section>
                <DocumentsSection />
              </section>
            </TabsContent>
          </Tabs>
        </main>

        {/* Footer */}
        <footer className="border-t bg-muted/30 mt-12 sm:mt-16">
          <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                <span>© 2024 Business Forecast Platform</span>
                <span className="hidden sm:inline">•</span>
                <span>Data updated every hour</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                <span>
                  Models: Monte Carlo, Linear Regression, Scenario Analysis
                </span>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Revenue Targets Modal */}
      <RevenueTargetsModal
        isOpen={showRevenueModal}
        onClose={() => setShowRevenueModal(false)}
        onSave={handleSaveRevenueTargets}
        initialTargets={revenueTargets || undefined}
      />
    </TooltipProvider>
  );
};

export default BusinessForecast;
