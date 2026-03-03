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
import { SummaryRecommendationSection } from "@/components/module/summary-recommendation-section";
import { RevenueTargetsModal, type RevenueTargets } from "@/components/business/revenue-targets-modal";
import {
  costStructure as mockCosts,
  cashFlowForecast as mockCashFlow,
} from "@/lib/business-forecast-data";
import {
  BUSINESS_FORECAST_DEFAULTS,
  getSummaryContent,
  SUMMARY_DESCRIPTION,
  getRecommendationContent,
  RECOMMENDATION_DESCRIPTION,
  DEFAULT_ACTION_ITEMS,
  DEFAULT_NEXT_STEPS,
  GROWTH_TRAJECTORY,
  getSummaryMetrics,
} from "@/lib/business-forecast-content";
import {
  KEY_ASSUMPTIONS,
  KEY_RISKS,
  COMPETITIVE_METRICS,
} from "@/mocks/business-forecast";
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
    lastUpdated,
    isLoading,
    error,
    isConnected,
    refreshData,
    updateKPI,
    updateScenario,
    reconnect,
  } = useBusinessForecastingData();

  // Revenue targets state
  const [showRevenueModal, setShowRevenueModal] = useState(false);
  const [revenueTargets, setRevenueTargets] = useState<RevenueTargets | null>(null);

  // Load revenue targets from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("joseph:revenueTargets");
    if (saved) {
      try {
        setRevenueTargets(JSON.parse(saved));
      } catch (error) {
        console.error("Failed to load revenue targets:", error);
      }
    }
  }, []);

  // Auto-popup modal for new users (3 seconds after page load)
  useEffect(() => {
    const isNewUser = !localStorage.getItem("joseph:revenueTargets");
    if (isNewUser) {
      const timer = setTimeout(() => {
        setShowRevenueModal(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSaveRevenueTargets = (targets: RevenueTargets) => {
    setRevenueTargets(targets);
    localStorage.setItem("joseph:revenueTargets", JSON.stringify(targets));
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
                        : formatCurrency(parseFloat(BUSINESS_FORECAST_DEFAULTS.ANNUAL_REVENUE_TARGET.replace(/[^\d.-]/g, '')))}
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {revenueTargets ? "Set" : "Click to set"}
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
                                  (sum, p) => sum + (p.value || 0),
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
                                  (sum, p) => sum + (p.value || 0),
                                  0,
                                ) /
                                  revenueTargets.annualRevenue) *
                                100 || 0
                              ).toFixed(0)}
                              %
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
                          {mockCashFlow.slice(0, 6).map((flow) => (
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
                      <Card className="p-4">
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-muted-foreground">
                            Gross Profit Margin
                          </h4>
                          <div className="text-3xl font-bold text-economic-positive">
                            {(
                              revenueProjections.reduce(
                                (sum, p) => sum + (p.value || 0),
                                0,
                              ) * 0.62
                            ).toFixed(0)}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            After COGS
                          </p>
                        </div>
                      </Card>
                      <Card className="p-4">
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-muted-foreground">
                            Operating Expense
                          </h4>
                          <div className="text-3xl font-bold text-economic-negative">
                            $
                            {(
                              revenueProjections.reduce(
                                (sum, p) => sum + (p.value || 0),
                                0,
                              ) * 0.25
                            ).toFixed(0)}
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
                          <div className="text-3xl font-bold text-economic-positive">
                            $
                            {(
                              revenueProjections.reduce(
                                (sum, p) => sum + (p.value || 0),
                                0,
                              ) * 0.37
                            ).toFixed(0)}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Bottom line
                          </p>
                        </div>
                      </Card>
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
                      <div className="flex items-start gap-3 p-3 bg-white rounded border border-orange-200">
                        <AlertTriangle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm text-orange-900">
                            Revenue Below Target
                          </h4>
                          <p className="text-xs text-orange-800 mt-1">
                            Current projection is slightly below annual target.
                            Review customer segment assumptions.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 bg-white rounded border border-orange-200">
                        <AlertTriangle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm text-orange-900">
                            Cash Flow Variability
                          </h4>
                          <p className="text-xs text-orange-800 mt-1">
                            Q2 and Q3 show significant fluctuations. Consider
                            adjusting payment terms.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 bg-white rounded border border-orange-200">
                        <AlertTriangle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm text-orange-900">
                            Cost Increase Trend
                          </h4>
                          <p className="text-xs text-orange-800 mt-1">
                            Operating expenses trending upward. Monitor cost
                            structure closely.
                          </p>
                        </div>
                      </div>
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
                )}
                summaryMetrics={getSummaryMetrics(
                  customerProfiles.length,
                  kpis.length,
                  scenarios.length,
                )}
                recommendationTitle="Business Forecast Recommendations"
                recommendationDescription={RECOMMENDATION_DESCRIPTION}
                recommendationText={getRecommendationContent()}
                actionItems={DEFAULT_ACTION_ITEMS}
                nextSteps={DEFAULT_NEXT_STEPS}
              />
            </TabsContent>

            <TabsContent value="tables" className="space-y-8">
              {/* Business Metrics Table */}
              <section>
                <BusinessMetricsTable />
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="p-4">
                        <div className="space-y-3">
                          <h4 className="font-semibold text-sm">
                            Core Platform
                          </h4>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                2025 Projection
                              </span>
                              <span className="font-bold">$5.2M</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                Growth Rate
                              </span>
                              <span className="font-bold text-economic-positive">
                                +18%
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                Market Share
                              </span>
                              <span className="font-bold">42%</span>
                            </div>
                          </div>
                        </div>
                      </Card>

                      <Card className="p-4">
                        <div className="space-y-3">
                          <h4 className="font-semibold text-sm">
                            Premium Tier
                          </h4>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                2025 Projection
                              </span>
                              <span className="font-bold">$3.1M</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                Growth Rate
                              </span>
                              <span className="font-bold text-economic-positive">
                                +28%
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                Market Share
                              </span>
                              <span className="font-bold">25%</span>
                            </div>
                          </div>
                        </div>
                      </Card>

                      <Card className="p-4">
                        <div className="space-y-3">
                          <h4 className="font-semibold text-sm">
                            Professional Services
                          </h4>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                2025 Projection
                              </span>
                              <span className="font-bold">$2.8M</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                Growth Rate
                              </span>
                              <span className="font-bold text-economic-positive">
                                +22%
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                Market Share
                              </span>
                              <span className="font-bold">23%</span>
                            </div>
                          </div>
                        </div>
                      </Card>

                      <Card className="p-4">
                        <div className="space-y-3">
                          <h4 className="font-semibold text-sm">
                            Support & Maintenance
                          </h4>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                2025 Projection
                              </span>
                              <span className="font-bold">$2.6M</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                Growth Rate
                              </span>
                              <span className="font-bold text-economic-positive">
                                +15%
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                Market Share
                              </span>
                              <span className="font-bold">10%</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </div>
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
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <Card className="p-4">
                            <div className="space-y-2">
                              <h5 className="font-medium text-sm">
                                North America
                              </h5>
                              <div className="text-2xl font-bold">$6.5M</div>
                              <p className="text-xs text-muted-foreground">
                                52% of revenue
                              </p>
                              <div className="flex justify-between text-xs mt-2">
                                <span>Growth:</span>
                                <span className="text-economic-positive font-bold">
                                  +14%
                                </span>
                              </div>
                            </div>
                          </Card>
                          <Card className="p-4">
                            <div className="space-y-2">
                              <h5 className="font-medium text-sm">Europe</h5>
                              <div className="text-2xl font-bold">$3.8M</div>
                              <p className="text-xs text-muted-foreground">
                                30% of revenue
                              </p>
                              <div className="flex justify-between text-xs mt-2">
                                <span>Growth:</span>
                                <span className="text-economic-positive font-bold">
                                  +22%
                                </span>
                              </div>
                            </div>
                          </Card>
                          <Card className="p-4">
                            <div className="space-y-2">
                              <h5 className="font-medium text-sm">
                                Asia-Pacific
                              </h5>
                              <div className="text-2xl font-bold">$2.4M</div>
                              <p className="text-xs text-muted-foreground">
                                18% of revenue
                              </p>
                              <div className="flex justify-between text-xs mt-2">
                                <span>Growth:</span>
                                <span className="text-economic-positive font-bold">
                                  +38%
                                </span>
                              </div>
                            </div>
                          </Card>
                        </div>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="p-4 bg-muted/30">
                        <div className="space-y-3">
                          <h4 className="font-semibold text-sm">
                            2024 Performance
                          </h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm">Total Revenue</span>
                              <span className="font-bold">$11.2M</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">YoY Growth</span>
                              <span className="font-bold text-economic-positive">
                                +16%
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Q4 Actual</span>
                              <span className="font-bold">$3.1M</span>
                            </div>
                          </div>
                        </div>
                      </Card>

                      <Card className="p-4 bg-blue-50">
                        <div className="space-y-3">
                          <h4 className="font-semibold text-sm">
                            2025 Projection
                          </h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm">Total Revenue</span>
                              <span className="font-bold">$13.7M</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Projected Growth</span>
                              <span className="font-bold text-economic-positive">
                                +22%
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Confidence Level</span>
                              <span className="font-bold">80%</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </div>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="border rounded-lg p-4">
                          <h4 className="font-semibold text-sm mb-2">
                            Linear Regression
                          </h4>
                          <p className="text-xs text-muted-foreground mb-3">
                            Baseline trend assuming steady growth
                          </p>
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>2025 Projection</span>
                              <span className="font-bold">$13.2M</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>R² Score</span>
                              <span className="font-bold">0.92</span>
                            </div>
                          </div>
                        </div>

                        <div className="border rounded-lg p-4">
                          <h4 className="font-semibold text-sm mb-2">
                            Moving Average (12-Month)
                          </h4>
                          <p className="text-xs text-muted-foreground mb-3">
                            Smoothed trend accounting for seasonality
                          </p>
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>2025 Projection</span>
                              <span className="font-bold">$13.5M</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Trend Direction</span>
                              <span className="font-bold text-economic-positive">
                                ↗ Up
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="border rounded-lg p-4">
                          <h4 className="font-semibold text-sm mb-2">
                            Exponential Smoothing
                          </h4>
                          <p className="text-xs text-muted-foreground mb-3">
                            Recent data weighted more heavily
                          </p>
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>2025 Projection</span>
                              <span className="font-bold">$13.9M</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>α Parameter</span>
                              <span className="font-bold">0.15</span>
                            </div>
                          </div>
                        </div>

                        <div className="border rounded-lg p-4">
                          <h4 className="font-semibold text-sm mb-2">
                            AI-Based Prediction
                          </h4>
                          <p className="text-xs text-muted-foreground mb-3">
                            Machine learning model incorporating market factors
                          </p>
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>2025 Projection</span>
                              <span className="font-bold">$14.1M</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Model Accuracy</span>
                              <span className="font-bold">87%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
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
                      <Card className="p-4 border-2 border-destructive/30">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-sm">
                              Worst Case
                            </h4>
                            <Badge
                              variant="outline"
                              className="border-destructive text-destructive"
                            >
                              25%
                            </Badge>
                          </div>

                          <div className="space-y-2">
                            <div className="border-t pt-2">
                              <p className="text-xs text-muted-foreground mb-1">
                                Annual Revenue
                              </p>
                              <p className="text-2xl font-bold">$11.8M</p>
                            </div>

                            <div className="border-t pt-2">
                              <p className="text-xs text-muted-foreground mb-1">
                                Operating Costs
                              </p>
                              <p className="font-bold">$9.8M</p>
                            </div>

                            <div className="border-t pt-2">
                              <p className="text-xs text-muted-foreground mb-1">
                                Net Profit
                              </p>
                              <p className="text-lg font-bold text-economic-negative">
                                $2.0M
                              </p>
                            </div>

                            <div className="border-t pt-2">
                              <p className="text-xs font-semibold mb-1">
                                Key Assumptions
                              </p>
                              <ul className="text-xs space-y-1">
                                <li className="text-muted-foreground">
                                  • Market slowdown
                                </li>
                                <li className="text-muted-foreground">
                                  • Increased competition
                                </li>
                                <li className="text-muted-foreground">
                                  • Customer churn
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </Card>
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Card className="p-5 border-l-4 border-l-blue-500 bg-blue-50/50">
                            <div className="space-y-3">
                              <h5 className="font-semibold text-sm text-blue-900">
                                Enterprise
                              </h5>
                              <div className="text-3xl font-bold text-blue-600">
                                $2.0M
                              </div>
                              <div className="space-y-2 text-xs text-muted-foreground">
                                <div className="flex justify-between">
                                  <span>% of Total Revenue:</span>
                                  <span className="font-medium">45%</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Growth Rate:</span>
                                  <span className="font-medium text-economic-positive">
                                    +28%
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Customer Count:</span>
                                  <span className="font-medium">12</span>
                                </div>
                              </div>
                            </div>
                          </Card>

                          <Card className="p-5 border-l-4 border-l-emerald-500 bg-emerald-50/50">
                            <div className="space-y-3">
                              <h5 className="font-semibold text-sm text-emerald-900">
                                SMB
                              </h5>
                              <div className="text-3xl font-bold text-emerald-600">
                                $0.3M
                              </div>
                              <div className="space-y-2 text-xs text-muted-foreground">
                                <div className="flex justify-between">
                                  <span>% of Total Revenue:</span>
                                  <span className="font-medium">6%</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Growth Rate:</span>
                                  <span className="font-medium text-economic-positive">
                                    +15%
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Customer Count:</span>
                                  <span className="font-medium">87</span>
                                </div>
                              </div>
                            </div>
                          </Card>
                        </div>
                      </div>

                      {/* Growth Trajectory */}
                      <div className="border-t pt-6">
                        <h4 className="font-semibold text-sm mb-4">
                          Growth Trajectory
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                          <Card className="p-4 border-2 border-amber-100">
                            <div className="space-y-2">
                              <h5 className="font-semibold text-xs text-amber-900">
                                Q1 2025
                              </h5>
                              <p className="text-sm text-muted-foreground">
                                Foundation building phase
                              </p>
                              <div className="text-xl font-bold text-amber-600 mt-2">
                                $3.0M
                              </div>
                            </div>
                          </Card>

                          <Card className="p-4 border-2 border-blue-100">
                            <div className="space-y-2">
                              <h5 className="font-semibold text-xs text-blue-900">
                                Q2 2025
                              </h5>
                              <p className="text-sm text-muted-foreground">
                                Accelerated growth period
                              </p>
                              <div className="text-xl font-bold text-blue-600 mt-2">
                                $3.3M
                              </div>
                            </div>
                          </Card>

                          <Card className="p-4 border-2 border-purple-100">
                            <div className="space-y-2">
                              <h5 className="font-semibold text-xs text-purple-900">
                                Q3 2025
                              </h5>
                              <p className="text-sm text-muted-foreground">
                                Market expansion phase
                              </p>
                              <div className="text-xl font-bold text-purple-600 mt-2">
                                $3.6M
                              </div>
                            </div>
                          </Card>

                          <Card className="p-4 border-2 border-green-100">
                            <div className="space-y-2">
                              <h5 className="font-semibold text-xs text-green-900">
                                Q4 2025
                              </h5>
                              <p className="text-sm text-muted-foreground">
                                Optimization and scaling
                              </p>
                              <div className="text-xl font-bold text-green-600 mt-2">
                                $3.8M
                              </div>
                            </div>
                          </Card>
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
                      <Card className="p-4 border-2 border-orange-200 bg-orange-50">
                        <div className="space-y-3">
                          <h4 className="font-semibold text-sm text-orange-900">
                            Fixed Costs
                          </h4>
                          <p className="text-xs text-orange-800">
                            Rent, salaries, subscriptions, insurance
                          </p>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm">Annual Total</span>
                              <span className="font-bold text-lg">$3.2M</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Monthly Avg</span>
                              <span className="font-bold">$267K</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">% of Revenue</span>
                              <span className="font-bold">23%</span>
                            </div>
                          </div>
                          <div className="border-t pt-2 mt-2">
                            <div className="flex items-center gap-2">
                              <TrendingUp className="h-4 w-4 text-orange-600" />
                              <span className="text-xs text-orange-800 font-semibold">
                                Stable and predictable
                              </span>
                            </div>
                          </div>
                        </div>
                      </Card>

                      <Card className="p-4 border-2 border-purple-200 bg-purple-50">
                        <div className="space-y-3">
                          <h4 className="font-semibold text-sm text-purple-900">
                            Variable Costs
                          </h4>
                          <p className="text-xs text-purple-800">
                            Raw materials, commissions, production costs
                          </p>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm">Annual Total</span>
                              <span className="font-bold text-lg">$5.1M</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Monthly Avg</span>
                              <span className="font-bold">$425K</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">% of Revenue</span>
                              <span className="font-bold">37%</span>
                            </div>
                          </div>
                          <div className="border-t pt-2 mt-2">
                            <div className="flex items-center gap-2">
                              <TrendingUp className="h-4 w-4 text-purple-600" />
                              <span className="text-xs text-purple-800 font-semibold">
                                Scales with revenue
                              </span>
                            </div>
                          </div>
                        </div>
                      </Card>
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
                      {mockCosts.map((cost) => (
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
                        <Card className="p-4 bg-blue-50">
                          <div className="space-y-2">
                            <h5 className="font-semibold text-sm text-blue-900">
                              Budget 2025
                            </h5>
                            <div className="text-3xl font-bold text-blue-600">
                              $8.8M
                            </div>
                            <p className="text-xs text-blue-800">
                              Target spending
                            </p>
                          </div>
                        </Card>

                        <Card className="p-4 bg-purple-50">
                          <div className="space-y-2">
                            <h5 className="font-semibold text-sm text-purple-900">
                              Forecast 2025
                            </h5>
                            <div className="text-3xl font-bold text-purple-600">
                              $8.3M
                            </div>
                            <p className="text-xs text-purple-800">
                              Projected spending
                            </p>
                          </div>
                        </Card>

                        <Card className="p-4 bg-green-50">
                          <div className="space-y-2">
                            <h5 className="font-semibold text-sm text-green-900">
                              Variance
                            </h5>
                            <div className="text-3xl font-bold text-green-600">
                              +$500K
                            </div>
                            <p className="text-xs text-green-800">
                              Under budget (5.7%)
                            </p>
                          </div>
                        </Card>
                      </div>

                      <div className="border rounded-lg p-4 space-y-4">
                        <h4 className="font-semibold text-sm">
                          Monthly Comparison
                        </h4>
                        <div className="space-y-3">
                          {[
                            {
                              month: "January",
                              budget: 750,
                              forecast: 680,
                              actual: 690,
                            },
                            {
                              month: "February",
                              budget: 750,
                              forecast: 720,
                              actual: 750,
                            },
                            {
                              month: "March",
                              budget: 750,
                              forecast: 700,
                              actual: 680,
                            },
                            {
                              month: "April",
                              budget: 750,
                              forecast: 710,
                              actual: null,
                            },
                          ].map((row) => (
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
                                      ${row.budget}K
                                    </div>
                                  </div>
                                </div>
                                <div className="flex-1 flex items-center gap-2">
                                  <Badge variant="outline" className="text-xs">
                                    Forecast
                                  </Badge>
                                  <div className="flex-1">
                                    <div className="h-6 bg-purple-200 rounded flex items-center justify-center text-xs font-semibold">
                                      ${row.forecast}K
                                    </div>
                                  </div>
                                </div>
                                {row.actual && (
                                  <div className="flex-1 flex items-center gap-2">
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      Actual
                                    </Badge>
                                    <div className="flex-1">
                                      <div className="h-6 bg-green-200 rounded flex items-center justify-center text-xs font-semibold">
                                        ${row.actual}K
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
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
                      <Card className="p-4 border-l-4 border-l-blue-500">
                        <div className="space-y-3">
                          <h5 className="font-semibold text-sm">
                            Marketing & Sales
                          </h5>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">
                                Digital Marketing
                              </span>
                              <span className="font-bold">$480K</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">
                                Sales Team Salaries
                              </span>
                              <span className="font-bold">$620K</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">
                                Events & Conferences
                              </span>
                              <span className="font-bold">$150K</span>
                            </div>
                            <div className="border-t pt-2 flex justify-between font-bold">
                              <span>Total</span>
                              <span>$1.25M</span>
                            </div>
                          </div>
                        </div>
                      </Card>

                      <Card className="p-4 border-l-4 border-l-purple-500">
                        <div className="space-y-3">
                          <h5 className="font-semibold text-sm">
                            Research & Development
                          </h5>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">
                                R&D Team Salaries
                              </span>
                              <span className="font-bold">$850K</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">
                                Tools & Infrastructure
                              </span>
                              <span className="font-bold">$220K</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">
                                Licenses & Software
                              </span>
                              <span className="font-bold">$180K</span>
                            </div>
                            <div className="border-t pt-2 flex justify-between font-bold">
                              <span>Total</span>
                              <span>$1.25M</span>
                            </div>
                          </div>
                        </div>
                      </Card>

                      <Card className="p-4 border-l-4 border-l-orange-500">
                        <div className="space-y-3">
                          <h5 className="font-semibold text-sm">
                            General & Administrative
                          </h5>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">
                                Office Rent
                              </span>
                              <span className="font-bold">$360K</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">
                                Admin Staff Salaries
                              </span>
                              <span className="font-bold">$420K</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">
                                Utilities & Services
                              </span>
                              <span className="font-bold">$140K</span>
                            </div>
                            <div className="border-t pt-2 flex justify-between font-bold">
                              <span>Total</span>
                              <span>$0.92M</span>
                            </div>
                          </div>
                        </div>
                      </Card>

                      <Card className="p-4 border-l-4 border-l-green-500">
                        <div className="space-y-3">
                          <h5 className="font-semibold text-sm">
                            Forecasted COGS
                          </h5>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">
                                Raw Materials
                              </span>
                              <span className="font-bold">$2.1M</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">
                                Manufacturing
                              </span>
                              <span className="font-bold">$1.8M</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">
                                Shipping & Logistics
                              </span>
                              <span className="font-bold">$620K</span>
                            </div>
                            <div className="border-t pt-2 flex justify-between font-bold">
                              <span>Total</span>
                              <span>$4.52M</span>
                            </div>
                          </div>
                        </div>
                      </Card>
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
                        <Card className="p-4">
                          <div className="space-y-3">
                            <h5 className="font-semibold text-sm">
                              Cost Growth Rate
                            </h5>
                            <div className="text-3xl font-bold text-orange-600">
                              +4.2%
                            </div>
                            <p className="text-xs text-muted-foreground">
                              YoY increase from 2024 to 2025
                            </p>
                            <div className="border-t pt-2 mt-2">
                              <p className="text-xs text-muted-foreground">
                                Primary drivers:
                              </p>
                              <ul className="text-xs space-y-1 mt-1">
                                <li>• Salary increases (+2%)</li>
                                <li>• Material cost inflation (+3%)</li>
                                <li>• Headcount expansion (+1.2%)</li>
                              </ul>
                            </div>
                          </div>
                        </Card>

                        <Card className="p-4">
                          <div className="space-y-3">
                            <h5 className="font-semibold text-sm">
                              COGS as % of Revenue
                            </h5>
                            <div className="text-3xl font-bold text-green-600">
                              37%
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Below industry average of 42%
                            </p>
                            <div className="border-t pt-2 mt-2">
                              <p className="text-xs text-muted-foreground">
                                Cost efficiency opportunity:
                              </p>
                              <ul className="text-xs space-y-1 mt-1">
                                <li>• Potential 1-2% improvement</li>
                                <li>• Supplier optimization needed</li>
                                <li>• Process automation benefits</li>
                              </ul>
                            </div>
                          </div>
                        </Card>
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
                          {mockCashFlow.map((flow) => (
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
                          <div className="flex items-center justify-between p-2 border rounded">
                            <span className="text-sm">Market Competition</span>
                            <Badge variant="destructive" className="text-xs">
                              High
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between p-2 border rounded">
                            <span className="text-sm">
                              Supply Chain Disruption
                            </span>
                            <Badge className="text-xs bg-economic-warning text-economic-warning-foreground">
                              Medium
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between p-2 border rounded">
                            <span className="text-sm">Regulatory Changes</span>
                            <Badge variant="secondary" className="text-xs">
                              Low
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm">
                          Key Assumptions
                        </h4>
                        <div className="space-y-2 text-sm text-muted-foreground">
                          {KEY_ASSUMPTIONS.map((assumption, idx) => (
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
                        {COMPETITIVE_METRICS.map((metric, idx) => (
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
