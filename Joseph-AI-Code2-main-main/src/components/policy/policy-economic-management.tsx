import React, { useState } from "react";
import { usePolicyEconomicData } from "../../hooks/usePolicyEconomicData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ExternalPolicyAnalysis } from "./external-policy-analysis";
import { InternalPolicyAnalysis } from "./internal-policy-analysis";
import { PolicyReports } from "./policy-reports";
import { EconomicImpactAnalysis } from "./economic-impact-analysis";
import { InternalImpactAnalysis } from "./internal-impact-analysis";
import { StrategyRecommendations } from "./strategy-recommendations";
import {
  Globe,
  Building,
  FileText,
  TrendingUp,
  Target,
  Shield,
} from "lucide-react";

export function PolicyEconomicManagement() {
  const {
    externalPolicies,
    internalPolicies,
    policyReports,
    economicIndicators,
    internalImpacts,
    strategyRecommendations,
    isLoading,
    addExternalPolicy,
    updateExternalPolicy,
    addInternalPolicy,
    updateInternalPolicy,
    generatePolicyReport,
    addInternalImpact,
    updateImpactStatus,
    addStrategyRecommendation,
    updateStrategyStatus,
  } = usePolicyEconomicData();

  const [activeTab, setActiveTab] = useState("external-policy");

  return (
    <div className="space-y-4">
      {/* Nested Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <div className="grid grid-cols-2 sm:grid-cols-8 gap-2 w-full rounded-md bg-muted p-1 text-muted-foreground">
          <TabsList className="contents">
            <TabsTrigger
              value="external-policy"
              className="flex items-center gap-1 sm:gap-2 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm px-1 sm:px-2"
            >
              <Globe className="h-3 sm:h-4 w-3 sm:w-4 flex-shrink-0" />
              <span className="hidden lg:inline line-clamp-1">
                External Policy
              </span>
              <span className="hidden sm:inline lg:hidden line-clamp-1">
                External
              </span>
              <span className="sm:hidden line-clamp-1">External</span>
            </TabsTrigger>
            <TabsTrigger
              value="internal-policy"
              className="flex items-center gap-1 sm:gap-2 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm px-1 sm:px-2"
            >
              <Building className="h-3 sm:h-4 w-3 sm:w-4 flex-shrink-0" />
              <span className="hidden lg:inline line-clamp-1">
                Internal Policy
              </span>
              <span className="hidden sm:inline lg:hidden line-clamp-1">
                Internal
              </span>
              <span className="sm:hidden line-clamp-1">Internal</span>
            </TabsTrigger>
            <TabsTrigger
              value="policy-reports"
              className="flex items-center gap-1 sm:gap-2 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm px-1 sm:px-2"
            >
              <FileText className="h-3 sm:h-4 w-3 sm:w-4 flex-shrink-0" />
              <span className="hidden lg:inline line-clamp-1">Reports</span>
              <span className="lg:hidden line-clamp-1">Reports</span>
            </TabsTrigger>
            <TabsTrigger
              value="economic-impact"
              className="flex items-center gap-1 sm:gap-2 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm px-1 sm:px-2"
            >
              <TrendingUp className="h-3 sm:h-4 w-3 sm:w-4 flex-shrink-0" />
              <span className="hidden lg:inline line-clamp-1">
                Economic Impact
              </span>
              <span className="hidden sm:inline lg:hidden line-clamp-1">
                Economic
              </span>
              <span className="sm:hidden line-clamp-1">Impact</span>
            </TabsTrigger>
            <TabsTrigger
              value="internal-impact"
              className="flex items-center gap-1 sm:gap-2 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm px-1 sm:px-2"
            >
              <Target className="h-3 sm:h-4 w-3 sm:w-4 flex-shrink-0" />
              <span className="hidden lg:inline line-clamp-1">
                Internal Impact
              </span>
              <span className="hidden sm:inline lg:hidden line-clamp-1">
                Int.Impact
              </span>
              <span className="sm:hidden line-clamp-1">Internal</span>
            </TabsTrigger>
            <TabsTrigger
              value="strategy"
              className="flex items-center gap-1 sm:gap-2 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm px-1 sm:px-2"
            >
              <Shield className="h-3 sm:h-4 w-3 sm:w-4 flex-shrink-0" />
              <span className="hidden lg:inline line-clamp-1">Strategy</span>
              <span className="lg:hidden line-clamp-1">Strategy</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="external-policy" className="space-y-4">
          <ExternalPolicyAnalysis
            externalPolicies={externalPolicies}
            onAddPolicy={addExternalPolicy}
            onUpdatePolicy={updateExternalPolicy}
          />
        </TabsContent>

        <TabsContent value="internal-policy" className="space-y-4">
          <InternalPolicyAnalysis
            internalPolicies={internalPolicies}
            onAddPolicy={addInternalPolicy}
            onUpdatePolicy={updateInternalPolicy}
          />
        </TabsContent>

        <TabsContent value="policy-reports" className="space-y-4">
          <PolicyReports
            policyReports={policyReports}
            onGenerateReport={generatePolicyReport}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="economic-impact" className="space-y-4">
          <EconomicImpactAnalysis
            economicIndicators={economicIndicators}
            onRefreshData={() => {}}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="internal-impact" className="space-y-4">
          <InternalImpactAnalysis
            internalImpacts={internalImpacts}
            onAddImpact={addInternalImpact}
            onUpdateStatus={updateImpactStatus}
          />
        </TabsContent>

        <TabsContent value="strategy" className="space-y-4">
          <StrategyRecommendations
            strategyRecommendations={strategyRecommendations}
            onAddRecommendation={addStrategyRecommendation}
            onUpdateStatus={updateStrategyStatus}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
