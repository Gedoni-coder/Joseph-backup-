import { useTaxComplianceAPI } from "./useTaxComplianceAPI";
import {
  TaxCalculation,
  TaxAvoidanceRecommendation,
  ComplianceUpdate,
  TaxPlanningScenario,
  AuditEvent,
  ComplianceDocument,
  ComplianceReport,
  taxCalculations as mockCalculations,
  taxRecommendations as mockRecommendations,
  complianceUpdates as mockUpdates,
  planningScenarios as mockScenarios,
  auditTrail as mockAuditTrail,
  complianceDocuments as mockDocuments,
  complianceReports as mockReports,
} from "@/lib/tax-compliance-data";

interface TaxDataState {
  calculations: TaxCalculation[];
  recommendations: TaxAvoidanceRecommendation[];
  complianceUpdates: ComplianceUpdate[];
  planningScenarios: TaxPlanningScenario[];
  auditTrail: AuditEvent[];
  documents: ComplianceDocument[];
  reports: ComplianceReport[];
  lastUpdated: Date;
  isLoading: boolean;
  error: string | null;
  isConnected: boolean;
}

/**
 * Adapter hook that converts the API response to the expected data structure
 * This allows existing components to work with real API data without refactoring
 */
export function useTaxDataAPI() {
  const {
    totalTaxLiability,
    potentialSavings,
    complianceUpdatesCount,
    recommendations: apiRecommendations,
    isLoading,
    error,
    isConnected,
    lastUpdated,
    refreshData,
    reconnect,
  } = useTaxComplianceAPI();

  // Transform API data to match expected component structure
  const calculations: TaxCalculation[] =
    totalTaxLiability > 0
      ? [
          {
            id: "1",
            taxType: "Income Tax",
            estimatedTax: totalTaxLiability * 0.6,
            filingDeadline: "April 15",
            status: "On Track",
            taxRate: 0.24,
          },
          {
            id: "2",
            taxType: "Sales Tax",
            estimatedTax: totalTaxLiability * 0.25,
            filingDeadline: "Monthly",
            status: "Compliant",
            taxRate: 0.08,
          },
          {
            id: "3",
            taxType: "Employment Tax",
            estimatedTax: totalTaxLiability * 0.15,
            filingDeadline: "Quarterly",
            status: "On Track",
            taxRate: 0.153,
          },
        ]
      : mockCalculations;

  const recommendations: TaxAvoidanceRecommendation[] =
    potentialSavings > 0
      ? [
          {
            id: "1",
            title: "Optimize Deductions",
            description: `Review and maximize eligible business deductions. Potential savings: $${Math.round(potentialSavings * 0.4)}`,
            potentialSavings: potentialSavings * 0.4,
            implemented: false,
            complexity: "Medium",
            deadline: "2025-04-15",
          },
          {
            id: "2",
            title: "Retirement Plan Strategy",
            description: `Maximize contributions to retirement accounts. Potential savings: $${Math.round(potentialSavings * 0.35)}`,
            potentialSavings: potentialSavings * 0.35,
            implemented: false,
            complexity: "Low",
            deadline: "2025-01-31",
          },
          {
            id: "3",
            title: "Entity Structure Optimization",
            description: `Evaluate S-Corp vs LLC benefits. Potential savings: $${Math.round(potentialSavings * 0.25)}`,
            potentialSavings: potentialSavings * 0.25,
            implemented: false,
            complexity: "High",
            deadline: "2025-03-31",
          },
        ]
      : mockRecommendations;

  const complianceUpdates: ComplianceUpdate[] =
    complianceUpdatesCount > 0
      ? [
          {
            id: "1",
            title: "Q4 2024 Tax Deadline",
            description: "Q4 estimated tax payment due",
            date: new Date(),
            priority: "High",
            status: "Upcoming",
          },
          {
            id: "2",
            title: "New Sales Tax Rules",
            description: "Marketplace facilitator rule updated in 3 states",
            date: new Date(),
            priority: "Medium",
            status: "Review Required",
          },
        ]
      : mockUpdates;

  const planningScenarios: TaxPlanningScenario[] = mockScenarios;
  const auditTrail: AuditEvent[] = mockAuditTrail;
  const documents: ComplianceDocument[] = mockDocuments;
  const reports: ComplianceReport[] = mockReports;

  return {
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
    updateCalculation: (id: string, data: Partial<TaxCalculation>) => {
      // Stub for now - would call API update
      console.log("Update calculation:", id, data);
    },
    implementRecommendation: (id: string) => {
      // Stub for now - would call API to implement
      console.log("Implement recommendation:", id);
    },
    updateComplianceStatus: (id: string, status: string) => {
      // Stub for now - would call API
      console.log("Update compliance status:", id, status);
    },
    reconnect,
  };
}
