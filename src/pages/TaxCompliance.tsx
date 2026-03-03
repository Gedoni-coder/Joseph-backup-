import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingOverlay } from "@/components/ui/loading-spinner";
import {
  ConnectionStatus,
  DataFreshness,
} from "@/components/ui/connection-status";
import ModuleHeader from "@/components/ui/module-header";
import { useCompanyInfo } from "@/lib/company-context";
import { getCompanyName } from "@/lib/get-company-name";
import { useTaxDataAPI } from "@/hooks/useTaxDataAPI";
import { SmartTaxCalculator } from "@/components/tax/smart-tax-calculator";
import { TaxRecommendations } from "@/components/tax/tax-recommendations";
import { ComplianceUpdates } from "@/components/tax/compliance-updates";
import { ComplianceCalendar } from "@/components/tax/compliance-calendar";
import {
  CURRENCY_CONFIG,
  FOOTER_COMPLIANCE_TEXT,
  FOOTER_DATA_SECURITY,
} from "@/mocks/tax-compliance";
import {
  Calculator,
  RefreshCw,
  Calendar,
  TrendingUp,
  DollarSign,
  Users,
  FileText,
  Shield,
  AlertTriangle,
  Activity,
  Scale,
  Wifi,
} from "lucide-react";

const TaxCompliance = () => {
  const { companyInfo } = useCompanyInfo();
  const companyName = getCompanyName(companyInfo?.companyName);

  const {
    calculations,
    recommendations,
    complianceUpdates,
    planningScenarios,
    auditTrail,
    documents,
    reports,
    lastUpdated,
    isLoading,
    error,
    isConnected,
    refreshData,
    updateCalculation,
    implementRecommendation,
    updateComplianceStatus,
    reconnect,
  } = useTaxDataAPI();

  const handleRefresh = async () => {
    await refreshData();
  };

  const totalTaxLiability = calculations.reduce(
    (sum, calc) => sum + calc.estimatedTax,
    0,
  );
  const potentialSavings = recommendations.reduce(
    (sum, rec) => sum + rec.potentialSavings,
    0,
  );
  const implementedSavings = recommendations
    .filter((rec) => rec.implemented)
    .reduce((sum, rec) => sum + rec.potentialSavings, 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(CURRENCY_CONFIG.locale, {
      style: "currency",
      currency: CURRENCY_CONFIG.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <ModuleHeader
        icon={<Scale className="h-6 w-6" />}
        title="Tax & Compliance Module"
        description={`${companyName} smart tax planning and automated compliance management for e-commerce operations`}
        isConnected={isConnected}
        lastUpdated={lastUpdated}
        onReconnect={reconnect}
        error={error}
        connectionLabel="Live"
      />

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-sm text-blue-700">
                    Total Tax Liability
                  </div>
                  <div className="text-lg font-bold text-blue-900">
                    {formatCurrency(totalTaxLiability)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-600 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-sm text-green-700">
                    Potential Savings
                  </div>
                  <div className="text-lg font-bold text-green-900">
                    {formatCurrency(potentialSavings)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-600 rounded-lg">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-sm text-orange-700">
                    Compliance Updates
                  </div>
                  <div className="text-lg font-bold text-orange-900">
                    {complianceUpdates.length}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-600 rounded-lg">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-sm text-purple-700">Active Entities</div>
                  <div className="text-lg font-bold text-purple-900">
                    {calculations.length}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="calculator" className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-8 gap-2 w-full rounded-md bg-muted p-1 text-muted-foreground">
            <TabsList className="contents">
              <TabsTrigger
                value="calculator"
                className="w-full justify-center data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Calculator
              </TabsTrigger>
              <TabsTrigger
                value="recommendations"
                className="w-full justify-center data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Recommendations
              </TabsTrigger>
              <TabsTrigger
                value="compliance"
                className="w-full justify-center data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Compliance
              </TabsTrigger>
              <TabsTrigger
                value="planning"
                className="w-full justify-center data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Planning
              </TabsTrigger>
              <TabsTrigger
                value="audit"
                className="w-full justify-center data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Audit Trail
              </TabsTrigger>
              <TabsTrigger
                value="documents"
                className="w-full justify-center data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Documents
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div></div>
            <div className="flex items-center gap-2">
              <Badge
                variant={isConnected ? "default" : "destructive"}
                className="flex items-center gap-1"
              >
                {isConnected ? (
                  <Wifi className="h-3 w-3" />
                ) : (
                  <Activity className="h-3 w-3" />
                )}
                {isConnected ? "Live Data" : "Offline Mode"}
              </Badge>
              <Badge
                variant="outline"
                className="flex items-center gap-1 border-blue-200 text-blue-700"
              >
                <Calculator className="h-3 w-3" />
                Tax Module Active
              </Badge>
              {error && (
                <Badge
                  variant="destructive"
                  className="flex items-center gap-1"
                >
                  <AlertTriangle className="h-3 w-3" />
                  Sync Issue
                </Badge>
              )}
            </div>
          </div>

          <TabsContent value="calculator" className="space-y-8">
            <section>
              <LoadingOverlay
                isLoading={isLoading}
                loadingText="Calculating tax liabilities..."
              >
                <SmartTaxCalculator
                  calculations={calculations}
                  onUpdateCalculation={updateCalculation}
                />
              </LoadingOverlay>
            </section>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-8">
            <section>
              <LoadingOverlay
                isLoading={isLoading}
                loadingText="Analyzing tax opportunities..."
              >
                <TaxRecommendations
                  recommendations={recommendations}
                  onImplement={implementRecommendation}
                />
              </LoadingOverlay>
            </section>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-8">
            <section>
              <LoadingOverlay
                isLoading={isLoading}
                loadingText="Fetching compliance updates..."
              >
                <ComplianceUpdates
                  updates={complianceUpdates}
                  onUpdateStatus={updateComplianceStatus}
                />
              </LoadingOverlay>
            </section>

            <section>
              <LoadingOverlay
                isLoading={isLoading}
                loadingText="Loading compliance calendar and updates..."
              >
                <ComplianceCalendar />
              </LoadingOverlay>
            </section>
          </TabsContent>

          <TabsContent value="planning" className="space-y-8">
            <section>
              <Card className="border-blue-200">
                <CardHeader className="bg-blue-50">
                  <CardTitle className="text-lg text-blue-900">
                    Tax Planning & Advisory Support
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {planningScenarios.map((scenario) => (
                      <Card key={scenario.id} className="border-blue-100">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">
                            {scenario.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <p className="text-sm text-gray-700">
                            {scenario.description}
                          </p>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Current Tax:</span>
                              <span className="font-medium">
                                {formatCurrency(scenario.currentTax)}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Projected Tax:</span>
                              <span className="font-medium text-blue-600">
                                {formatCurrency(scenario.projectedTax)}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm border-t pt-2">
                              <span className="font-medium">Savings:</span>
                              <span className="font-bold text-green-600">
                                {formatCurrency(scenario.savings)}
                              </span>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-xs text-gray-600">
                              Confidence: {scenario.confidence}%
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${scenario.confidence}%` }}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>
          </TabsContent>

          <TabsContent value="audit" className="space-y-8">
            <section>
              <Card className="border-blue-200">
                <CardHeader className="bg-blue-50">
                  <CardTitle className="text-lg text-blue-900">
                    Audit Trail
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-semibold text-blue-800">
                        Recent Activity
                      </h4>
                      <div className="flex gap-2">
                        <Link to="/audit-reports">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-blue-200 text-blue-700"
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            Generate Report
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-blue-200 text-blue-700"
                          onClick={() => window.print()}
                        >
                          <Activity className="h-4 w-4 mr-2" />
                          Export Log
                        </Button>
                      </div>
                    </div>
                    {auditTrail.slice(0, 10).map((event) => (
                      <div
                        key={event.id}
                        className="flex items-start justify-between p-3 border border-blue-100 rounded-lg"
                      >
                        <div className="space-y-1">
                          <div className="font-medium text-sm">
                            {event.action}
                          </div>
                          <div className="text-xs text-gray-600">
                            {event.entity} • {event.details}
                          </div>
                          <div className="text-xs text-gray-500">
                            {event.timestamp.toLocaleString()} • {event.user}
                          </div>
                        </div>
                        <Badge
                          className={
                            event.outcome === "success"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }
                        >
                          {event.outcome}
                        </Badge>
                      </div>
                    ))}
                    <div className="text-center mt-4">
                      <Link to="/audit-trail">
                        <Button
                          variant="outline"
                          className="border-blue-200 text-blue-700"
                        >
                          View Complete Audit Trail
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
              <Card className="border-blue-200">
                <CardHeader className="bg-blue-50">
                  <CardTitle className="text-lg text-blue-900">
                    Document Management & Compliance Reporting
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 text-blue-800">
                        Recent Documents
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center mb-3">
                          <span></span>
                          <Link to="/document-upload">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-blue-200 text-blue-700"
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              Upload Documents
                            </Button>
                          </Link>
                        </div>
                        {documents.slice(0, 5).map((doc) => (
                          <div
                            key={doc.id}
                            className="flex items-center justify-between p-2 border border-blue-100 rounded"
                          >
                            <div>
                              <div className="text-sm font-medium">
                                {doc.name}
                              </div>
                              <div className="text-xs text-gray-600">
                                {doc.entity} • {doc.taxYear}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  window.open(`/documents/${doc.id}`)
                                }
                              >
                                View
                              </Button>
                              <Badge
                                className={
                                  doc.status === "processed"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }
                              >
                                {doc.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                        <div className="text-center mt-3">
                          <Link to="/document-manager">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-blue-200 text-blue-700"
                            >
                              Manage All Documents
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3 text-blue-800">
                        Compliance Reports
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center mb-3">
                          <span></span>
                          <Link to="/compliance-reports">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-blue-200 text-blue-700"
                            >
                              <Shield className="h-4 w-4 mr-2" />
                              Generate Report
                            </Button>
                          </Link>
                        </div>
                        {reports.map((report) => (
                          <div
                            key={report.id}
                            className="p-3 border border-blue-100 rounded-lg"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div className="font-medium text-sm">
                                {report.title}
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    window.open(`/reports/${report.id}`)
                                  }
                                >
                                  View
                                </Button>
                                <Badge
                                  className={
                                    report.status === "completed"
                                      ? "bg-green-100 text-green-800"
                                      : report.status === "overdue"
                                        ? "bg-red-100 text-red-800"
                                        : "bg-yellow-100 text-yellow-800"
                                  }
                                >
                                  {report.status}
                                </Badge>
                              </div>
                            </div>
                            <div className="text-xs text-gray-600">
                              Due: {report.dueDate.toLocaleDateString()} •{" "}
                              {report.completionRate}% complete
                            </div>
                          </div>
                        ))}
                        <div className="text-center mt-3">
                          <Link to="/all-reports">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-blue-200 text-blue-700"
                            >
                              View All Reports
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
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t bg-blue-50 mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4 text-sm text-blue-700">
              <span>
                © {new Date().getFullYear()} Tax & Compliance Platform
              </span>
              <span>•</span>
              <span>{FOOTER_DATA_SECURITY}</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-blue-600">
              <span>{FOOTER_COMPLIANCE_TEXT}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TaxCompliance;
