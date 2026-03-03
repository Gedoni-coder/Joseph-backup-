import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import KPIDashboard from "@/components/sales-intelligence/KPIDashboard";
import KPICategories from "@/components/sales-intelligence/KPICategories";
import CustomKPIBuilder from "@/components/sales-intelligence/CustomKPIBuilder";
import BenchmarkingSection from "@/components/sales-intelligence/BenchmarkingSection";
import KPIAlerts from "@/components/sales-intelligence/KPIAlerts";
import ExportReporting from "@/components/sales-intelligence/ExportReporting";

const KPIDashboardPage = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">KPI Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Comprehensive KPI tracking and analytics for sales performance
            monitoring
          </p>
        </div>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full space-y-6"
        >
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="custom">Custom Builder</TabsTrigger>
            <TabsTrigger value="benchmarking">Benchmarking</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Tab Content */}
          <div className="space-y-6">
            <TabsContent value="dashboard" className="space-y-6">
              <KPIDashboard />
            </TabsContent>

            <TabsContent value="categories" className="space-y-6">
              <KPICategories />
            </TabsContent>

            <TabsContent value="custom" className="space-y-6">
              <CustomKPIBuilder />
            </TabsContent>

            <TabsContent value="benchmarking" className="space-y-6">
              <BenchmarkingSection />
            </TabsContent>

            <TabsContent value="alerts" className="space-y-6">
              <KPIAlerts />
            </TabsContent>

            <TabsContent value="reports" className="space-y-6">
              <ExportReporting />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default KPIDashboardPage;
