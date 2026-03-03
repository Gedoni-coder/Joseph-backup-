import { useState, useEffect, useCallback } from "react";
import {
  ExternalPolicy,
  InternalPolicy,
  PolicyReport,
  EconomicIndicator,
  InternalImpact,
  StrategyRecommendation,
  externalPolicies as initialExternalPolicies,
  internalPolicies as initialInternalPolicies,
  policyReports as initialPolicyReports,
  economicIndicators as initialEconomicIndicators,
  internalImpacts as initialInternalImpacts,
  strategyRecommendations as initialStrategyRecommendations,
} from "../lib/policy-economic-data";

export function usePolicyEconomicData() {
  const [externalPolicies, setExternalPolicies] = useState<ExternalPolicy[]>(initialExternalPolicies);
  const [internalPolicies, setInternalPolicies] = useState<InternalPolicy[]>(initialInternalPolicies);
  const [policyReports, setPolicyReports] = useState<PolicyReport[]>(initialPolicyReports);
  const [economicIndicators, setEconomicIndicators] = useState<EconomicIndicator[]>(initialEconomicIndicators);
  const [internalImpacts, setInternalImpacts] = useState<InternalImpact[]>(initialInternalImpacts);
  const [strategyRecommendations, setStrategyRecommendations] = useState<StrategyRecommendation[]>(initialStrategyRecommendations);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString());
  const [isConnected, setIsConnected] = useState(true);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date().toISOString());
      
      // Simulate random economic indicator updates
      setEconomicIndicators(prev => 
        prev.map(indicator => ({
          ...indicator,
          value: indicator.value * (1 + (Math.random() - 0.5) * 0.01),
          lastUpdated: new Date().toISOString(),
        }))
      );
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Simulate connection status
  useEffect(() => {
    const connectionInterval = setInterval(() => {
      setIsConnected(Math.random() > 0.1); // 90% uptime simulation
    }, 5000);

    return () => clearInterval(connectionInterval);
  }, []);

  const addExternalPolicy = useCallback((policy: Omit<ExternalPolicy, "id" | "lastUpdated">) => {
    const newPolicy: ExternalPolicy = {
      ...policy,
      id: `ext-pol-${Date.now()}`,
      lastUpdated: new Date().toISOString(),
    };
    setExternalPolicies(prev => [newPolicy, ...prev]);
    setLastUpdated(new Date().toISOString());
  }, []);

  const updateExternalPolicy = useCallback((id: string, updates: Partial<ExternalPolicy>) => {
    setExternalPolicies(prev =>
      prev.map(policy =>
        policy.id === id
          ? { ...policy, ...updates, lastUpdated: new Date().toISOString() }
          : policy
      )
    );
    setLastUpdated(new Date().toISOString());
  }, []);

  const addInternalPolicy = useCallback((policy: Omit<InternalPolicy, "id" | "lastReviewed">) => {
    const newPolicy: InternalPolicy = {
      ...policy,
      id: `int-pol-${Date.now()}`,
      lastReviewed: new Date().toISOString(),
    };
    setInternalPolicies(prev => [newPolicy, ...prev]);
    setLastUpdated(new Date().toISOString());
  }, []);

  const updateInternalPolicy = useCallback((id: string, updates: Partial<InternalPolicy>) => {
    setInternalPolicies(prev =>
      prev.map(policy =>
        policy.id === id
          ? { ...policy, ...updates, lastReviewed: new Date().toISOString() }
          : policy
      )
    );
    setLastUpdated(new Date().toISOString());
  }, []);

  const generatePolicyReport = useCallback((type: PolicyReport["type"], period: string) => {
    setIsLoading(true);
    
    // Simulate report generation delay
    setTimeout(() => {
      const newReport: PolicyReport = {
        id: `rep-${Date.now()}`,
        title: `${type.replace('_', ' ').toUpperCase()} Report - ${period}`,
        type,
        generatedDate: new Date().toISOString(),
        period,
        summary: `Automated ${type} analysis for ${period} period.`,
        findings: [
          {
            id: `finding-${Date.now()}`,
            category: "Generated Finding",
            description: "Automated analysis identified this item for review",
            severity: "medium" as const,
            recommendation: "Review and update relevant policies",
            status: "open" as const,
          }
        ],
        complianceScore: Math.floor(Math.random() * 20) + 80, // 80-100%
        recommendations: [
          "Continue monitoring policy alignment",
          "Schedule quarterly reviews",
          "Update training materials"
        ]
      };
      
      setPolicyReports(prev => [newReport, ...prev]);
      setLastUpdated(new Date().toISOString());
      setIsLoading(false);
    }, 2000);
  }, []);

  const addInternalImpact = useCallback((impact: Omit<InternalImpact, "id" | "lastAssessed">) => {
    const newImpact: InternalImpact = {
      ...impact,
      id: `impact-${Date.now()}`,
      lastAssessed: new Date().toISOString(),
    };
    setInternalImpacts(prev => [newImpact, ...prev]);
    setLastUpdated(new Date().toISOString());
  }, []);

  const updateImpactStatus = useCallback((id: string, status: InternalImpact["status"]) => {
    setInternalImpacts(prev =>
      prev.map(impact =>
        impact.id === id
          ? { ...impact, status, lastAssessed: new Date().toISOString() }
          : impact
      )
    );
    setLastUpdated(new Date().toISOString());
  }, []);

  const addStrategyRecommendation = useCallback((recommendation: Omit<StrategyRecommendation, "id">) => {
    const newRecommendation: StrategyRecommendation = {
      ...recommendation,
      id: `strat-${Date.now()}`,
    };
    setStrategyRecommendations(prev => [newRecommendation, ...prev]);
    setLastUpdated(new Date().toISOString());
  }, []);

  const updateStrategyStatus = useCallback((id: string, status: StrategyRecommendation["status"]) => {
    setStrategyRecommendations(prev =>
      prev.map(strategy =>
        strategy.id === id ? { ...strategy, status } : strategy
      )
    );
    setLastUpdated(new Date().toISOString());
  }, []);

  const refreshData = useCallback(() => {
    setIsLoading(true);
    setError(null);
    
    // Simulate data refresh
    setTimeout(() => {
      setLastUpdated(new Date().toISOString());
      setIsLoading(false);
    }, 1000);
  }, []);

  return {
    // Data
    externalPolicies,
    internalPolicies,
    policyReports,
    economicIndicators,
    internalImpacts,
    strategyRecommendations,
    
    // State
    isLoading,
    error,
    lastUpdated,
    isConnected,
    
    // Actions
    addExternalPolicy,
    updateExternalPolicy,
    addInternalPolicy,
    updateInternalPolicy,
    generatePolicyReport,
    addInternalImpact,
    updateImpactStatus,
    addStrategyRecommendation,
    updateStrategyStatus,
    refreshData,
  };
}
