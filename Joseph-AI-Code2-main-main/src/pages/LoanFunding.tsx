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
import { useLoanFundingAPI } from "@/hooks/useLoanFundingAPI";
import { CURRENCY_FORMATTING } from "@/mocks/loan-funding";
import { LoanEligibilityAssessment } from "@/components/loan/loan-eligibility";
import { FundingOptionsExplorer } from "@/components/loan/funding-options";
import { SmartLoanComparison } from "@/components/loan/loan-comparison";
import { ApplicationAssistance } from "@/components/loan/application-assistance";
import { FundingStrategyAnalysis } from "@/components/loan/funding-strategy";
import { InvestorMatchingEngine } from "@/components/loan/investor-matching";
import { LoanResearchUpdates } from "@/components/loan/loan-research";
import { type FundingOption } from "@/lib/loan-data";
import { useCompanyInfo } from "@/lib/company-context";
import { getCompanyName } from "@/lib/get-company-name";
import {
  DollarSign,
  TrendingUp,
  Users,
  FileText,
  Target,
  Search,
  Bell,
  Home,
  Briefcase,
  Calculator,
  BarChart3,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function LoanFunding() {
  const { companyInfo } = useCompanyInfo();
  const companyName = getCompanyName(companyInfo?.companyName);

  const {
    eligibility,
    fundingOptions,
    loanComparisons,
    applicationDocuments,
    businessPlan,
    fundingStrategy,
    investorMatches,
    loanUpdates,
    isLoading,
    isConnected,
    lastUpdated,
    error,
    refreshData,
    updateEligibility,
    updateDocumentStatus,
  } = useLoanFundingAPI();

  const [activeTab, setActiveTab] = useState("overview");
  const [selectedFundingOption, setSelectedFundingOption] =
    useState<FundingOption | null>(null);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Connection Error</CardTitle>
            <CardDescription>
              Unable to load loan and funding data. Please check your connection
              and try again.
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

  const formatCurrency = (amount: number) => {
    const { millions, millions_suffix, thousands, thousands_suffix } =
      CURRENCY_FORMATTING;
    if (amount >= millions) {
      return `$${(amount / millions).toFixed(1)}${millions_suffix}`;
    }
    if (amount >= thousands) {
      return `$${(amount / thousands).toFixed(0)}${thousands_suffix}`;
    }
    return `$${amount.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <LoadingSpinner isVisible={isLoading} />

      <ModuleHeader
        icon={<DollarSign className="h-6 w-6" />}
        title="Funding and Loan Hub"
        description={`Complete financing solutions and funding opportunities for ${companyName} expansion, operations, and strategic growth`}
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
                value="eligibility"
                className="w-full justify-center data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Eligibility
              </TabsTrigger>
              <TabsTrigger
                value="options"
                className="w-full justify-center data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Options
              </TabsTrigger>
              <TabsTrigger
                value="comparison"
                className="w-full justify-center data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Compare
              </TabsTrigger>
              <TabsTrigger
                value="application"
                className="w-full justify-center data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Application
              </TabsTrigger>
              <TabsTrigger
                value="strategy"
                className="w-full justify-center data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Strategy
              </TabsTrigger>
              <TabsTrigger
                value="research"
                className="w-full justify-center data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Research
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-4 sm:space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    <div className="flex-1">
                      <div className="text-sm text-gray-600">
                        Eligibility Score
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        {eligibility.eligibilityScore}%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Search className="w-5 h-5 text-green-600" />
                    <div className="flex-1">
                      <div className="text-sm text-gray-600">
                        Funding Options
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        {fundingOptions.length}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-purple-600" />
                    <div className="flex-1">
                      <div className="text-sm text-gray-600">
                        Investor Matches
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        {investorMatches.length}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Bell className="w-5 h-5 text-orange-600" />
                    <div className="flex-1">
                      <div className="text-sm text-gray-600">New Updates</div>
                      <div className="text-2xl font-bold text-gray-900">
                        {loanUpdates.filter((u) => u.urgency === "high").length}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="w-5 h-5 mr-2 text-blue-600" />
                    Eligibility Quick Check
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Business:</span>
                    <span className="font-medium">
                      {eligibility.businessName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Credit Score:</span>
                    <span className="font-bold text-blue-600">
                      {eligibility.creditScore}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Monthly Revenue:</span>
                    <span className="font-medium">
                      {formatCurrency(eligibility.monthlyRevenue)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Qualified Programs:</span>
                    <Badge variant="outline">
                      {eligibility.qualifiedPrograms.length}
                    </Badge>
                  </div>
                  <Button
                    onClick={() => setActiveTab("eligibility")}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    View Full Assessment
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                    Top Funding Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {fundingOptions.slice(0, 3).map((option) => (
                    <div
                      key={option.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <div className="font-medium">{option.name}</div>
                        <div className="text-sm text-gray-600">
                          {option.provider}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">
                          {option.interestRate === 0
                            ? "Equity"
                            : `${option.interestRate}%`}
                        </div>
                        <div className="text-sm text-gray-600">
                          {formatCurrency(option.maxAmount)} max
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button
                    onClick={() => setActiveTab("options")}
                    variant="outline"
                    className="w-full"
                  >
                    Explore All Options
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-purple-600" />
                    Application Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Documents:</span>
                    <span className="font-medium">
                      {
                        applicationDocuments.filter(
                          (d) =>
                            d.status === "verified" || d.status === "uploaded",
                        ).length
                      }{" "}
                      of {applicationDocuments.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Business Plan:</span>
                    <span className="font-medium">
                      {businessPlan.completionPercentage}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Readiness Score:</span>
                    <span className="font-bold text-purple-600">
                      {fundingStrategy.readinessScore}%
                    </span>
                  </div>
                  <Button
                    onClick={() => setActiveTab("application")}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    Continue Application
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="w-5 h-5 mr-2 text-orange-600" />
                    Recent Updates
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {loanUpdates.slice(0, 3).map((update) => (
                    <div key={update.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium text-sm">{update.title}</div>
                      <div className="text-xs text-gray-600 mt-1">
                        {update.source} •{" "}
                        {new Intl.DateTimeFormat("en-US", {
                          month: "short",
                          day: "numeric",
                        }).format(update.publishDate)}
                      </div>
                      <Badge
                        className={
                          update.urgency === "high"
                            ? "bg-red-100 text-red-800"
                            : update.urgency === "medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                        }
                      >
                        {update.urgency}
                      </Badge>
                    </div>
                  ))}
                  <Button
                    onClick={() => setActiveTab("research")}
                    variant="outline"
                    className="w-full"
                  >
                    View All Updates
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="eligibility">
            <LoanEligibilityAssessment
              eligibility={eligibility}
              onUpdateEligibility={updateEligibility}
            />
          </TabsContent>

          <TabsContent value="options">
            <FundingOptionsExplorer
              fundingOptions={fundingOptions}
              onStartApplication={(option) => {
                setSelectedFundingOption(option);
                setActiveTab("application");
              }}
            />
          </TabsContent>

          <TabsContent value="comparison">
            <SmartLoanComparison
              loanComparisons={loanComparisons}
              onStartApplication={(loan) => {
                setActiveTab("application");
              }}
            />
          </TabsContent>

          <TabsContent value="application">
            <ApplicationAssistance
              applicationDocuments={applicationDocuments}
              businessPlan={businessPlan}
              eligibility={eligibility}
              onUpdateDocumentStatus={updateDocumentStatus}
              selectedFundingOption={selectedFundingOption}
            />
          </TabsContent>

          <TabsContent value="strategy">
            <div className="space-y-8">
              <FundingStrategyAnalysis
                fundingStrategy={fundingStrategy}
                eligibility={eligibility}
                fundingOptions={fundingOptions}
              />
              <InvestorMatchingEngine
                investorMatches={investorMatches}
                eligibility={eligibility}
              />
            </div>
          </TabsContent>

          <TabsContent value="research">
            <LoanResearchUpdates loanUpdates={loanUpdates} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
