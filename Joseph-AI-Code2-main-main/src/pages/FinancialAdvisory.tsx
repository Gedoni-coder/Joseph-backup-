import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useFinancialAdvisoryAPI } from "../hooks/useFinancialAdvisoryAPI";
import { useCompanyInfo } from "../lib/company-context";
import { getCompanyName } from "../lib/get-company-name";
import ModuleNavigation from "../components/ui/module-navigation";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { ConnectionStatus } from "../components/ui/connection-status";
import {
  DEFAULT_NOTIFICATIONS,
  DEFAULT_ADVICE,
  SUMMARY_DESCRIPTION,
  getSummaryContent,
  RECOMMENDATION_DESCRIPTION,
  getRecommendationContent,
  DEFAULT_ACTION_ITEMS,
  DEFAULT_NEXT_STEPS,
  getSummaryMetrics,
} from "../mocks/financial-advisory";
import { StrategicBudgeting } from "../components/financial/strategic-budgeting";
import { CashFlowPlanning } from "../components/financial/cash-flow-planning";
import { BudgetValidation } from "../components/financial/budget-validation";
import { ScenarioTesting } from "../components/financial/scenario-testing";
import { RiskAssessmentComponent } from "../components/financial/risk-assessment";
import { PerformanceDrivers } from "../components/financial/performance-drivers";
import { AdvisoryInsights } from "../components/financial/advisory-insights";
import { SummaryRecommendationSection } from "../components/module/summary-recommendation-section";
import {
  Loader2,
  Calculator,
  TrendingUp,
  Target,
  AlertTriangle,
  Shield,
  BarChart3,
  Lightbulb,
  Bell,
  X,
  Activity,
  HelpCircle,
} from "lucide-react";

export default function FinancialAdvisory() {
  const { companyInfo } = useCompanyInfo();
  const companyName = getCompanyName(companyInfo?.companyName);

  const {
    budgetForecasts,
    cashFlowProjections,
    currentCashFlows,
    scenarioTests,
    riskAssessments,
    performanceDrivers,
    advisoryInsights,
    budgetAssumptions,
    liquidityMetrics,
    isLoading,
    error,
    lastUpdated,
    createBudgetForecast,
    updateBudgetAssumption,
    runScenarioTest,
    updateRiskStatus,
    updateInsightStatus,
    addCashFlowProjection,
    addRisk,
    addPerformanceDriver,
  } = useFinancialAdvisoryAPI();

  const [activeTab, setActiveTab] = useState("strategic-budgeting");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [ideasOpen, setIdeasOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="text-lg font-medium text-gray-700">
            Loading Financial Advisory Data...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Data
          </h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header */}
        <header className="bg-white/60 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-3 md:py-4">
            <div className="flex flex-col gap-2 sm:gap-3 md:gap-4">
              <div>
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="flex items-center justify-center w-8 sm:w-10 h-8 sm:h-10 bg-blue-600 rounded-xl text-white flex-shrink-0">
                    <Calculator className="w-4 sm:w-5 h-4 sm:h-5" />
                  </div>
                  <div className="min-w-0">
                    <h1 className="text-base sm:text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
                      Financial Advisory & Planning
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                      {companyName} strategic budgeting, cash flow management,
                      and financial advisory insights for marketplace operations
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <ModuleNavigation />
                <div className="hidden sm:block">
                  <ConnectionStatus lastUpdated={lastUpdated} />
                </div>

                {/* Notifications Tab */}
                <Popover
                  open={notificationsOpen}
                  onOpenChange={setNotificationsOpen}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1 sm:gap-2 relative text-xs sm:text-sm p-1.5 sm:p-2"
                        >
                          <Bell className="h-3.5 sm:h-4 w-3.5 sm:w-4 flex-shrink-0" />
                          <span className="hidden sm:inline">
                            Notifications
                          </span>
                          <Badge
                            variant="destructive"
                            className="absolute -top-2 -right-2 px-1.5 py-0.5 text-xs min-w-5 h-5 flex items-center justify-center rounded-full"
                          >
                            {DEFAULT_NOTIFICATIONS.length}
                          </Badge>
                        </Button>
                      </PopoverTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>View notifications and alerts</p>
                    </TooltipContent>
                  </Tooltip>
                  <PopoverContent className="w-64 sm:w-80" align="end">
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-sm sm:text-base">
                          Notifications
                        </h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setNotificationsOpen(false)}
                          className="p-1 h-8 w-8"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-2 sm:space-y-3 max-h-96 overflow-y-auto">
                        {DEFAULT_NOTIFICATIONS.map((notification) => {
                          const iconMap = {
                            calculator: Calculator,
                            "trending-up": TrendingUp,
                            target: Target,
                            lightbulb: Lightbulb,
                          };
                          const Icon =
                            iconMap[notification.icon as keyof typeof iconMap];
                          const colorMap = {
                            alert: "text-blue-500",
                            update: "text-green-500",
                            insight: "text-orange-500",
                          };
                          return (
                            <div
                              key={notification.id}
                              className="p-2 sm:p-3 rounded-lg border bg-card"
                            >
                              <div className="flex items-start gap-2 sm:gap-3">
                                <Icon
                                  className={`h-4 w-4 ${colorMap[notification.type]} mt-0.5 flex-shrink-0`}
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs sm:text-sm font-medium line-clamp-2">
                                    {notification.title}
                                  </p>
                                  <p className="text-xs text-muted-foreground line-clamp-2">
                                    {notification.message}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {notification.timeAgo}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <Link to="/notifications">
                        <Button variant="outline" className="w-full" size="sm">
                          View All Notifications
                        </Button>
                      </Link>
                    </div>
                  </PopoverContent>
                </Popover>

                {/* Advice Tab */}
                <Popover open={ideasOpen} onOpenChange={setIdeasOpen}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm p-1.5 sm:p-2"
                        >
                          <HelpCircle className="h-3.5 sm:h-4 w-3.5 sm:w-4 flex-shrink-0" />
                          <span className="hidden sm:inline">Advice</span>
                        </Button>
                      </PopoverTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Get expert advice and recommendations</p>
                    </TooltipContent>
                  </Tooltip>
                  <PopoverContent className="w-64 sm:w-80" align="end">
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-sm sm:text-base">
                          Advice
                        </h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIdeasOpen(false)}
                          className="p-1 h-8 w-8"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-2 sm:space-y-3 max-h-96 overflow-y-auto">
                        {DEFAULT_ADVICE.map((advice) => {
                          const iconMap = {
                            "help-circle": HelpCircle,
                            target: Target,
                            shield: Shield,
                            "trending-up": TrendingUp,
                          };
                          const Icon =
                            iconMap[advice.icon as keyof typeof iconMap];
                          const colorMap = {
                            optimization: "text-blue-500",
                            performance: "text-green-500",
                            risk: "text-red-500",
                            strategic: "text-purple-500",
                          };
                          return (
                            <div
                              key={advice.id}
                              className="p-2 sm:p-3 rounded-lg border bg-card"
                            >
                              <div className="flex items-start gap-2 sm:gap-3">
                                <Icon
                                  className={`h-4 w-4 ${colorMap[advice.type]} mt-0.5 flex-shrink-0`}
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs sm:text-sm font-medium line-clamp-2">
                                    {advice.title}
                                  </p>
                                  <p className="text-xs text-muted-foreground line-clamp-2">
                                    {advice.message}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <Link to="/ai-insights">
                        <Button variant="outline" className="w-full" size="sm">
                          Get More Advice
                        </Button>
                      </Link>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4 sm:space-y-6"
          >
            <div className="overflow-x-auto -mx-3 sm:mx-0 px-3 sm:px-0 rounded-md bg-muted text-muted-foreground">
              <TabsList className="inline-flex sm:grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-0.5 sm:gap-2 p-1 w-full">
                <TabsTrigger
                  value="strategic-budgeting"
                  className="flex items-center gap-1 sm:gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 px-2 sm:px-3 py-1.5 sm:py-2 min-w-max sm:min-w-0 text-xs sm:text-sm whitespace-nowrap sm:whitespace-normal"
                >
                  <TrendingUp className="w-3.5 sm:w-4 h-3.5 sm:h-4 flex-shrink-0" />
                  <span className="hidden lg:inline line-clamp-1">
                    Strategic Budgeting
                  </span>
                  <span className="hidden sm:inline lg:hidden line-clamp-1">
                    Budgeting
                  </span>
                  <span className="sm:hidden line-clamp-1">Budget</span>
                </TabsTrigger>

                <TabsTrigger
                  value="summary-recommendation"
                  className="flex items-center gap-1 sm:gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 px-2 sm:px-3 py-1.5 sm:py-2 min-w-max sm:min-w-0 text-xs sm:text-sm whitespace-nowrap sm:whitespace-normal"
                >
                  <BarChart3 className="w-3.5 sm:w-4 h-3.5 sm:h-4 flex-shrink-0" />
                  <span className="hidden lg:inline line-clamp-1">
                    Summary & Rec
                  </span>
                  <span className="lg:hidden line-clamp-1">Summary</span>
                </TabsTrigger>

                <TabsTrigger
                  value="cash-flow"
                  className="flex items-center gap-1 sm:gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 px-2 sm:px-3 py-1.5 sm:py-2 min-w-max sm:min-w-0 text-xs sm:text-sm whitespace-nowrap sm:whitespace-normal"
                >
                  <Target className="w-3.5 sm:w-4 h-3.5 sm:h-4 flex-shrink-0" />
                  <span className="hidden lg:inline line-clamp-1">
                    Cash Flow
                  </span>
                  <span className="lg:hidden line-clamp-1">Cash</span>
                </TabsTrigger>

                <TabsTrigger
                  value="budget-validation"
                  className="flex items-center gap-1 sm:gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 px-2 sm:px-3 py-1.5 sm:py-2 min-w-max sm:min-w-0 text-xs sm:text-sm whitespace-nowrap sm:whitespace-normal"
                >
                  <BarChart3 className="w-3.5 sm:w-4 h-3.5 sm:h-4 flex-shrink-0" />
                  <span className="hidden lg:inline line-clamp-1">
                    Validation
                  </span>
                  <span className="lg:hidden line-clamp-1">Val</span>
                </TabsTrigger>

                <TabsTrigger
                  value="scenario-testing"
                  className="flex items-center gap-1 sm:gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 px-2 sm:px-3 py-1.5 sm:py-2 min-w-max sm:min-w-0 text-xs sm:text-sm whitespace-nowrap sm:whitespace-normal"
                >
                  <Calculator className="w-3.5 sm:w-4 h-3.5 sm:h-4 flex-shrink-0" />
                  <span className="hidden lg:inline line-clamp-1">
                    Scenarios
                  </span>
                  <span className="lg:hidden line-clamp-1">Scenario</span>
                </TabsTrigger>

                <TabsTrigger
                  value="risk-assessment"
                  className="flex items-center gap-1 sm:gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 px-2 sm:px-3 py-1.5 sm:py-2 min-w-max sm:min-w-0 text-xs sm:text-sm whitespace-nowrap sm:whitespace-normal"
                >
                  <Shield className="w-3.5 sm:w-4 h-3.5 sm:h-4 flex-shrink-0" />
                  <span className="hidden lg:inline line-clamp-1">
                    Risk Assessment
                  </span>
                  <span className="lg:hidden line-clamp-1">Risk</span>
                </TabsTrigger>

                <TabsTrigger
                  value="performance-drivers"
                  className="flex items-center gap-1 sm:gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 px-2 sm:px-3 py-1.5 sm:py-2 min-w-max sm:min-w-0 text-xs sm:text-sm whitespace-nowrap sm:whitespace-normal"
                >
                  <Target className="w-3.5 sm:w-4 h-3.5 sm:h-4 flex-shrink-0" />
                  <span className="hidden lg:inline line-clamp-1">
                    Performance KPIs
                  </span>
                  <span className="lg:hidden line-clamp-1">KPIs</span>
                </TabsTrigger>

                <TabsTrigger
                  value="advisory-insights"
                  className="flex items-center gap-1 sm:gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 px-2 sm:px-3 py-1.5 sm:py-2 min-w-max sm:min-w-0 text-xs sm:text-sm whitespace-nowrap sm:whitespace-normal"
                >
                  <Lightbulb className="w-3.5 sm:w-4 h-3.5 sm:h-4 flex-shrink-0" />
                  <span className="hidden lg:inline line-clamp-1">
                    Advisory Insights
                  </span>
                  <span className="lg:hidden line-clamp-1">Insights</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent
              value="strategic-budgeting"
              className="space-y-3 sm:space-y-4 md:space-y-6"
            >
              <StrategicBudgeting
                budgetForecasts={budgetForecasts}
                budgetAssumptions={budgetAssumptions}
                onCreateForecast={createBudgetForecast}
                onUpdateAssumption={updateBudgetAssumption}
              />
            </TabsContent>

            <TabsContent
              value="summary-recommendation"
              className="space-y-4 sm:space-y-6 md:space-y-8"
            >
              <SummaryRecommendationSection
                summaryTitle="Financial Advisory Summary"
                summaryDescription={SUMMARY_DESCRIPTION}
                summaryText={getSummaryContent(
                  budgetForecasts.length,
                  liquidityMetrics.length,
                  riskAssessments.length,
                )}
                summaryMetrics={getSummaryMetrics(
                  budgetForecasts.length,
                  cashFlowProjections.length,
                  scenarioTests.length,
                  riskAssessments.length,
                )}
                recommendationTitle="Financial Advisory Recommendations"
                recommendationDescription={RECOMMENDATION_DESCRIPTION}
                recommendationText={getRecommendationContent()}
                actionItems={DEFAULT_ACTION_ITEMS}
                nextSteps={DEFAULT_NEXT_STEPS}
              />
            </TabsContent>

            <TabsContent
              value="cash-flow"
              className="space-y-3 sm:space-y-4 md:space-y-6"
            >
              <CashFlowPlanning
                currentCashFlows={currentCashFlows}
                cashFlowProjections={cashFlowProjections}
                liquidityMetrics={liquidityMetrics}
                onAddProjection={addCashFlowProjection}
              />
            </TabsContent>

            <TabsContent
              value="budget-validation"
              className="space-y-3 sm:space-y-4 md:space-y-6"
            >
              <BudgetValidation budgetForecasts={budgetForecasts} />
            </TabsContent>

            <TabsContent
              value="scenario-testing"
              className="space-y-3 sm:space-y-4 md:space-y-6"
            >
              <ScenarioTesting
                scenarioTests={scenarioTests}
                onRunScenario={runScenarioTest}
              />
            </TabsContent>

            <TabsContent
              value="risk-assessment"
              className="space-y-3 sm:space-y-4 md:space-y-6"
            >
              <RiskAssessmentComponent
                riskAssessments={riskAssessments}
                onUpdateRiskStatus={updateRiskStatus}
                onAddRisk={addRisk}
              />
            </TabsContent>

            <TabsContent
              value="performance-drivers"
              className="space-y-3 sm:space-y-4 md:space-y-6"
            >
              <PerformanceDrivers
                performanceDrivers={performanceDrivers}
                onAddDriver={addPerformanceDriver}
                risks={riskAssessments}
                budgets={budgetForecasts}
                insights={advisoryInsights}
              />
            </TabsContent>

            <TabsContent
              value="advisory-insights"
              className="space-y-3 sm:space-y-4 md:space-y-6"
            >
              <AdvisoryInsights
                advisoryInsights={advisoryInsights}
                onUpdateInsightStatus={updateInsightStatus}
                budgets={budgetForecasts}
                cashFlows={currentCashFlows}
                drivers={performanceDrivers}
                risks={riskAssessments}
              />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </TooltipProvider>
  );
}
