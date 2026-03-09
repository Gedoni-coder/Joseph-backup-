import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import ModuleHeader from "@/components/ui/module-header";
import { PolicyEconomicManagement } from "../components/policy/policy-economic-management";
import { PolicyWatchtower } from "../components/policy/policy-watchtower";
import { PolicySimplifier } from "../components/policy/policy-simplifier";
import { EconomicPulseboard } from "../components/policy/economic-pulseboard";
import { ScenarioSimulation } from "../components/policy/scenario-simulation";
import { FiscalPolicyAnalyzer } from "../components/policy/fiscal-policy-analyzer";
import ImpactCalculator from "./ImpactCalculator";
import {
  Settings,
  Radio,
  BookOpen,
  Activity,
  Zap,
  DollarSign,
  TrendingUp,
  Target,
  Shield,
  Calculator,
  AlertTriangle,
} from "lucide-react";

export default function PolicyEconomicAnalysis() {
  const [activeTab, setActiveTab] = useState("watchtower");

  return (
    <div className="space-y-6">
      <ModuleHeader
        icon={<AlertTriangle className="h-6 w-6" />}
        title="Policy and Economic Impact"
        description="Policy analysis, economic impact assessment, and regulatory compliance impact calculations for E-buy operations"
        showConnectionStatus={false}
      />

      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Main Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 sm:grid-cols-8 gap-2 w-full rounded-md bg-muted p-1 text-muted-foreground">
            <TabsList className="contents">
              <TabsTrigger
                value="watchtower"
                className="flex items-center gap-1 sm:gap-2 px-1 sm:px-2 min-w-0"
              >
                <Radio className="h-3 sm:h-4 w-3 sm:w-4 flex-shrink-0" />
                <span className="hidden lg:inline line-clamp-1">
                  Watchtower
                </span>
                <span className="lg:hidden line-clamp-1">Watch</span>
              </TabsTrigger>
              <TabsTrigger
                value="fiscal"
                className="flex items-center gap-1 sm:gap-2 px-1 sm:px-2 min-w-0"
              >
                <DollarSign className="h-3 sm:h-4 w-3 sm:w-4 flex-shrink-0" />
                <span className="hidden lg:inline line-clamp-1">
                  Fiscal Policy
                </span>
                <span className="lg:hidden line-clamp-1">Fiscal</span>
              </TabsTrigger>
              <TabsTrigger
                value="management"
                className="flex items-center gap-1 sm:gap-2 px-1 sm:px-2 min-w-0"
              >
                <Settings className="h-3 sm:h-4 w-3 sm:w-4 flex-shrink-0" />
                <span className="hidden lg:inline line-clamp-1">
                  Management
                </span>
                <span className="lg:hidden line-clamp-1">Manage</span>
              </TabsTrigger>
              <TabsTrigger
                value="simplifier"
                className="flex items-center gap-1 sm:gap-2 px-1 sm:px-2 min-w-0"
              >
                <BookOpen className="h-3 sm:h-4 w-3 sm:w-4 flex-shrink-0" />
                <span className="hidden lg:inline line-clamp-1">
                  Simplifier
                </span>
                <span className="lg:hidden line-clamp-1">Simplify</span>
              </TabsTrigger>
              <TabsTrigger
                value="pulseboard"
                className="flex items-center gap-1 sm:gap-2 px-1 sm:px-2 min-w-0"
              >
                <Activity className="h-3 sm:h-4 w-3 sm:w-4 flex-shrink-0" />
                <span className="hidden lg:inline line-clamp-1">
                  Pulseboard
                </span>
                <span className="lg:hidden line-clamp-1">Pulse</span>
              </TabsTrigger>
              <TabsTrigger
                value="scenario"
                className="flex items-center gap-1 sm:gap-2 px-1 sm:px-2 min-w-0"
              >
                <Zap className="h-3 sm:h-4 w-3 sm:w-4 flex-shrink-0" />
                <span className="hidden lg:inline line-clamp-1">
                  Scenario Sim
                </span>
                <span className="lg:hidden line-clamp-1">Scenario</span>
              </TabsTrigger>
              <TabsTrigger
                value="calculator"
                className="flex items-center gap-1 sm:gap-2 px-1 sm:px-2 min-w-0"
              >
                <Calculator className="h-3 sm:h-4 w-3 sm:w-4 flex-shrink-0" />
                <span className="hidden lg:inline line-clamp-1">
                  Impact Calc
                </span>
                <span className="lg:hidden line-clamp-1">Calc</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="watchtower" className="space-y-4">
            <PolicyWatchtower />
          </TabsContent>

          <TabsContent value="fiscal" className="space-y-4">
            <FiscalPolicyAnalyzer />
          </TabsContent>

          <TabsContent value="management" className="space-y-4">
            <PolicyEconomicManagement />
          </TabsContent>

          <TabsContent value="simplifier" className="space-y-4">
            <PolicySimplifier />
          </TabsContent>

          <TabsContent value="pulseboard" className="space-y-4">
            <EconomicPulseboard />
          </TabsContent>

          <TabsContent value="scenario" className="space-y-4">
            <ScenarioSimulation />
          </TabsContent>

          <TabsContent value="calculator" className="space-y-4">
            <ImpactCalculator />
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="border-t bg-muted/30 mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>© 2024 Policy & Economic Analysis Platform</span>
              <span>•</span>
              <span>Data updated continuously</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>
                Analysis: Policy Impact, Economic Modeling, Strategic Planning
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
