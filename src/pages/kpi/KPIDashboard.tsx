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
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Target,
  Users,
  DollarSign,
  AlertCircle,
  Download,
  Plus,
} from "lucide-react";
import { KPIDashboardHome } from "@/components/kpi/KPIDashboardHome";
import { KPICategoriesView } from "@/components/kpi/KPICategoriesView";
import { CustomKPIBuilder } from "@/components/kpi/CustomKPIBuilder";
import { BenchmarkingSection } from "@/components/kpi/BenchmarkingSection";
import { KPIAlertsInsights } from "@/components/kpi/KPIAlertsInsights";
import { KPIExportReporting } from "@/components/kpi/KPIExportReporting";

const KPIDashboard = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [isLoading, setIsLoading] = useState(false);
  const isConnected = true;
  const lastUpdated = new Date();

  return (
    <div className="min-h-screen bg-gray-50">
      <LoadingSpinner isVisible={isLoading} />

      <ModuleHeader
        icon={<BarChart3 className="h-6 w-6" />}
        title="KPI Dashboard"
        description="Comprehensive KPI tracking and analytics for sales performance monitoring"
        isConnected={isConnected}
        lastUpdated={lastUpdated}
        connectionLabel="Live"
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 w-full rounded-md bg-muted p-1 text-muted-foreground">
            <TabsList className="contents">
              <TabsTrigger
                value="home"
                className="w-full justify-center data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Home
              </TabsTrigger>
              <TabsTrigger
                value="categories"
                className="w-full justify-center data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Categories
              </TabsTrigger>
              <TabsTrigger
                value="custom"
                className="w-full justify-center data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Custom
              </TabsTrigger>
              <TabsTrigger
                value="benchmarking"
                className="w-full justify-center data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Benchmark
              </TabsTrigger>
              <TabsTrigger
                value="alerts"
                className="w-full justify-center data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Alerts
              </TabsTrigger>
              <TabsTrigger
                value="export"
                className="w-full justify-center data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Export
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Home Tab - Dashboard Overview */}
          <TabsContent value="home" className="space-y-6">
            <KPIDashboardHome />
          </TabsContent>

          {/* Categories Tab - KPI Categories View */}
          <TabsContent value="categories" className="space-y-6">
            <KPICategoriesView />
          </TabsContent>

          {/* Custom KPI Tab */}
          <TabsContent value="custom" className="space-y-6">
            <CustomKPIBuilder />
          </TabsContent>

          {/* Benchmarking Tab */}
          <TabsContent value="benchmarking" className="space-y-6">
            <BenchmarkingSection />
          </TabsContent>

          {/* Alerts & Insights Tab */}
          <TabsContent value="alerts" className="space-y-6">
            <KPIAlertsInsights />
          </TabsContent>

          {/* Export & Reporting Tab */}
          <TabsContent value="export" className="space-y-6">
            <KPIExportReporting />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default KPIDashboard;
