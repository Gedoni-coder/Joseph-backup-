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
import { useInventorySupplyChainAPI } from "@/hooks/useInventorySupplyChainAPI";
import { StockMonitoring } from "@/components/inventory/stock-monitoring";
import { DemandForecasting } from "@/components/inventory/demand-forecasting";
import { ValuationTracking } from "@/components/inventory/valuation-tracking";
import { InventoryAnalytics } from "@/components/inventory/inventory-analytics";
import { SupplierManagement } from "@/components/supply-chain/supplier-management";
import { ProcurementTracking } from "@/components/supply-chain/procurement-tracking";
import { ProductionPlanning } from "@/components/supply-chain/production-planning";
import { SupplyChainAnalytics } from "@/components/supply-chain/supply-chain-analytics";
import ModuleHeader from "@/components/ui/module-header";
import { useCompanyInfo } from "@/lib/company-context";
import { getCompanyName } from "@/lib/get-company-name";
import { SummaryRecommendationSection } from "@/components/module/summary-recommendation-section";
import {
  SUMMARY_DESCRIPTION,
  getSummaryContent,
  getSummaryMetrics,
  RECOMMENDATION_DESCRIPTION,
  getRecommendationContent,
  DEFAULT_ACTION_ITEMS,
  DEFAULT_NEXT_STEPS,
  INVENTORY_CONFIG,
} from "@/mocks/inventory-supply-chain";
import {
  Package,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Truck,
  Factory,
  Users,
  BarChart3,
  Home,
  Briefcase,
  Calculator,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function InventorySupplyChain() {
  const { companyInfo } = useCompanyInfo();
  const companyName = getCompanyName(companyInfo?.companyName);

  const {
    inventoryItems,
    stockMovements,
    demandForecasts,
    inventoryValuation,
    deadStock,
    isLoading,
    isConnected,
    lastUpdated,
    error,
    refreshData,
  } = useInventorySupplyChainAPI();

  const [activeTab, setActiveTab] = useState("overview");

  // Placeholder data for supply chain (future API integration)
  const locations = [];
  const inventoryAudits = [];
  const turnoverMetrics = [];
  const suppliers = [];
  const procurementOrders = [];
  const productionPlans = [];
  const warehouseOperations = [];
  const logisticsMetrics = [];
  const marketVolatility = [];
  const regulatoryCompliance = [];
  const disruptionRisks = [];
  const sustainabilityMetrics = [];

  const updateStockLevel = () => {};
  const addStockMovement = () => {};
  const updateSupplierPerformance = () => {};
  const updateOrderStatus = () => {};

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Connection Error</CardTitle>
            <CardDescription>
              Unable to load inventory and supply chain data. Please check your
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

  const formatCurrency = (amount: number) => {
    const { millions, millions_suffix, thousands, thousands_suffix } =
      INVENTORY_CONFIG.currencyFormat;
    if (amount >= millions) {
      return `$${(amount / millions).toFixed(1)}${millions_suffix}`;
    }
    if (amount >= thousands) {
      return `$${(amount / thousands).toFixed(0)}${thousands_suffix}`;
    }
    return `$${amount.toLocaleString()}`;
  };

  // Calculate key metrics
  const totalInventoryValue = inventoryValuation.totalValue;
  const lowStockItems = inventoryItems.filter(
    (item) => item.status === "low-stock" || item.status === "out-of-stock",
  ).length;
  const avgSupplierPerformance =
    suppliers.reduce((acc, s) => acc + s.performanceMetrics.overallScore, 0) /
    suppliers.length;
  const highRiskDisruptions = disruptionRisks.filter(
    (risk) => risk.riskScore > INVENTORY_CONFIG.riskThreshold,
  ).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <LoadingSpinner isVisible={isLoading} />

      <ModuleHeader
        icon={<Package className="h-6 w-6" />}
        title="Inventory & Supply Chain Management"
        description={`${companyName} comprehensive inventory management and supply chain optimization for marketplace fulfillment`}
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
                value="stock-monitoring"
                className="w-full justify-center data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Stock
              </TabsTrigger>
              <TabsTrigger
                value="demand-forecasting"
                className="w-full justify-center data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Demand
              </TabsTrigger>
              <TabsTrigger
                value="valuation"
                className="w-full justify-center data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Valuation
              </TabsTrigger>
              <TabsTrigger
                value="suppliers"
                className="w-full justify-center data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Suppliers
              </TabsTrigger>
              <TabsTrigger
                value="procurement"
                className="w-full justify-center data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Procurement
              </TabsTrigger>
              <TabsTrigger
                value="production"
                className="w-full justify-center data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Production
              </TabsTrigger>
            </TabsList>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 w-full rounded-md bg-muted p-1 text-muted-foreground">
            <TabsList className="contents">
              <TabsTrigger
                value="supply-analytics"
                className="w-full justify-center data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                SC Analytics
              </TabsTrigger>
              <TabsTrigger
                value="inventory-analytics"
                className="w-full justify-center data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Inv Analytics
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-4 sm:space-y-6">
            {/* Key Metrics Dashboard */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-8 h-8 text-blue-600" />
                    <div>
                      <div className="text-sm text-blue-700">
                        Inventory Value
                      </div>
                      <div className="text-2xl font-bold text-blue-900">
                        {formatCurrency(totalInventoryValue)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-red-50 border-red-200">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-8 h-8 text-red-600" />
                    <div>
                      <div className="text-sm text-red-700">Stock Alerts</div>
                      <div className="text-2xl font-bold text-red-900">
                        {lowStockItems}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Users className="w-8 h-8 text-green-600" />
                    <div>
                      <div className="text-sm text-green-700">
                        Supplier Performance
                      </div>
                      <div className="text-2xl font-bold text-green-900">
                        {avgSupplierPerformance.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-orange-50 border-orange-200">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-8 h-8 text-orange-600" />
                    <div>
                      <div className="text-sm text-orange-700">Risk Alerts</div>
                      <div className="text-2xl font-bold text-orange-900">
                        {highRiskDisruptions}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Package className="w-5 h-5 mr-2 text-blue-600" />
                    Inventory Status Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {[
                      {
                        status: "in-stock",
                        count: inventoryItems.filter(
                          (item) => item.status === "in-stock",
                        ).length,
                        color: "text-green-600",
                        label: "In Stock",
                      },
                      {
                        status: "low-stock",
                        count: inventoryItems.filter(
                          (item) => item.status === "low-stock",
                        ).length,
                        color: "text-yellow-600",
                        label: "Low Stock",
                      },
                      {
                        status: "out-of-stock",
                        count: inventoryItems.filter(
                          (item) => item.status === "out-of-stock",
                        ).length,
                        color: "text-red-600",
                        label: "Out of Stock",
                      },
                      {
                        status: "overstock",
                        count: inventoryItems.filter(
                          (item) => item.status === "overstock",
                        ).length,
                        color: "text-blue-600",
                        label: "Overstock",
                      },
                    ].map((item) => (
                      <div
                        key={item.status}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <span className="font-medium">{item.label}</span>
                        <span className={`text-xl font-bold ${item.color}`}>
                          {item.count}
                        </span>
                      </div>
                    ))}
                  </div>
                  <Button
                    onClick={() => setActiveTab("stock-monitoring")}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    View Detailed Monitoring
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Truck className="w-5 h-5 mr-2 text-green-600" />
                    Supply Chain Health
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Active Suppliers</span>
                      <span className="text-xl font-bold text-blue-600">
                        {suppliers.length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Pending Orders</span>
                      <span className="text-xl font-bold text-yellow-600">
                        {
                          procurementOrders.filter(
                            (order) => order.status === "pending",
                          ).length
                        }
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Production Plans</span>
                      <span className="text-xl font-bold text-green-600">
                        {productionPlans.length}
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={() => setActiveTab("supply-chain")}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    View Supply Chain Details
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
                    Demand Forecasting Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {demandForecasts.slice(0, 3).map((forecast) => (
                    <div
                      key={forecast.id}
                      className="p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="font-medium text-sm">
                        {forecast.itemName}
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-gray-600">
                          Predicted: {forecast.predictedDemand}
                        </span>
                        <Badge
                          className={
                            forecast.reorderSuggestion.urgency === "high"
                              ? "bg-red-100 text-red-800"
                              : forecast.reorderSuggestion.urgency === "medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                          }
                        >
                          {forecast.reorderSuggestion.urgency}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  <Button
                    onClick={() => setActiveTab("demand-forecasting")}
                    variant="outline"
                    className="w-full"
                  >
                    View All Forecasts
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Factory className="w-5 h-5 mr-2 text-orange-600" />
                    Warehouse Operations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {warehouseOperations.map((warehouse) => (
                    <div
                      key={warehouse.id}
                      className="p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="font-medium text-sm">
                        {warehouse.warehouseName}
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                        <div>
                          <span className="text-gray-600">Utilization:</span>
                          <span className="ml-1 font-medium">
                            {warehouse.efficiency.storageUtilization.toFixed(1)}
                            %
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Accuracy:</span>
                          <span className="ml-1 font-medium">
                            {warehouse.efficiency.pickingAccuracy.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button
                    onClick={() => setActiveTab("supply-chain")}
                    variant="outline"
                    className="w-full"
                  >
                    View Operations Details
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="summary-recommendation" className="space-y-8">
            <SummaryRecommendationSection
              summaryTitle="Inventory & Supply Chain Summary"
              summaryDescription={SUMMARY_DESCRIPTION}
              summaryText={getSummaryContent(
                formatCurrency(totalInventoryValue),
                locations.length,
                lowStockItems,
                inventoryAudits.length,
                avgSupplierPerformance,
                suppliers.length,
                highRiskDisruptions,
                productionPlans.length,
                procurementOrders.filter((o) => o.status === "pending").length,
              )}
              summaryMetrics={getSummaryMetrics(
                formatCurrency(totalInventoryValue),
                lowStockItems,
                avgSupplierPerformance,
                highRiskDisruptions,
              )}
              recommendationTitle="Inventory & Supply Chain Recommendations"
              recommendationDescription={RECOMMENDATION_DESCRIPTION}
              recommendationText={getRecommendationContent(
                lowStockItems,
                highRiskDisruptions,
                productionPlans.length,
              )}
              actionItems={DEFAULT_ACTION_ITEMS}
              nextSteps={DEFAULT_NEXT_STEPS}
            />
          </TabsContent>

          <TabsContent value="stock-monitoring">
            <StockMonitoring
              inventoryItems={inventoryItems}
              onUpdateStock={updateStockLevel}
              onRefresh={refreshData}
            />
          </TabsContent>

          <TabsContent value="demand-forecasting">
            <DemandForecasting demandForecasts={demandForecasts} />
          </TabsContent>

          <TabsContent value="valuation">
            <ValuationTracking inventoryValuation={inventoryValuation} />
          </TabsContent>

          <TabsContent value="suppliers">
            <SupplierManagement
              suppliers={suppliers}
              procurementOrders={procurementOrders}
            />
          </TabsContent>

          <TabsContent value="procurement">
            <ProcurementTracking
              procurementOrders={procurementOrders}
              suppliers={suppliers}
              productionPlans={productionPlans}
            />
          </TabsContent>

          <TabsContent value="production">
            <ProductionPlanning
              productionPlans={productionPlans}
              warehouseOperations={warehouseOperations}
              disruptionRisks={disruptionRisks}
            />
          </TabsContent>

          <TabsContent value="supply-analytics">
            <SupplyChainAnalytics
              marketVolatility={marketVolatility}
              disruptionRisks={disruptionRisks}
              sustainabilityMetrics={sustainabilityMetrics}
              regulatoryCompliance={regulatoryCompliance}
            />
          </TabsContent>

          <TabsContent value="analytics">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Analytics & Reporting</CardTitle>
                  <CardDescription>
                    Advanced analytics and comprehensive reporting tools
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Advanced Analytics Coming Soon
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Comprehensive inventory analytics, turnover analysis, and
                      automated reporting features are in development.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                      <div className="p-4 bg-purple-50 rounded-lg text-left">
                        <h4 className="font-semibold text-purple-900 mb-2">
                          Inventory Analytics
                        </h4>
                        <ul className="text-sm text-purple-800 space-y-1">
                          <li>• Turnover ratio analysis</li>
                          <li>• Dead stock identification</li>
                          <li>• Audit reporting</li>
                          <li>• Multi-location sync</li>
                        </ul>
                      </div>
                      <div className="p-4 bg-orange-50 rounded-lg text-left">
                        <h4 className="font-semibold text-orange-900 mb-2">
                          Performance Reports
                        </h4>
                        <ul className="text-sm text-orange-800 space-y-1">
                          <li>• Supplier scorecards</li>
                          <li>• Cost analysis reports</li>
                          <li>• Efficiency metrics</li>
                          <li>• Trend analysis</li>
                        </ul>
                      </div>
                      <div className="p-4 bg-teal-50 rounded-lg text-left">
                        <h4 className="font-semibold text-teal-900 mb-2">
                          Automated Insights
                        </h4>
                        <ul className="text-sm text-teal-800 space-y-1">
                          <li>• Predictive analytics</li>
                          <li>• Anomaly detection</li>
                          <li>• Recommendation engine</li>
                          <li>• Real-time dashboards</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="inventory-analytics">
            <InventoryAnalytics
              inventoryItems={inventoryItems}
              inventoryAudits={inventoryAudits}
              turnoverMetrics={turnoverMetrics}
              deadStock={deadStock}
              locations={locations}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
