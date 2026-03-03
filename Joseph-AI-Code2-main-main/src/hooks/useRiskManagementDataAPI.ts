import { useRiskManagementAPI } from "./useRiskManagementAPI";

/**
 * Adapter hook - currently just passes through useRiskManagementAPI
 * Maintains backward compatibility if a useRiskManagementData hook existed
 */
export function useRiskManagementDataAPI() {
  const {
    totalRisksIdentified,
    criticalRisksCount,
    riskMitigationCoverage,
    overallRiskScore,
    riskRegister,
    riskAssessments,
    mitigationStrategies,
    contingencyPlans,
    businessContinuityPlans,
    isLoading,
    error,
    isConnected,
    lastUpdated,
    refreshData,
    reconnect,
  } = useRiskManagementAPI();

  // Transform to component-compatible structure
  const risks = {
    total: totalRisksIdentified,
    critical: criticalRisksCount,
    coverage: riskMitigationCoverage,
    score: overallRiskScore,
    register: riskRegister,
    assessments: riskAssessments,
    strategies: mitigationStrategies,
    contingencies: contingencyPlans,
    continuity: businessContinuityPlans,
  };

  return {
    risks,
    isLoading,
    error,
    isConnected,
    lastUpdated,
    refreshData,
    reconnect,
  };
}
