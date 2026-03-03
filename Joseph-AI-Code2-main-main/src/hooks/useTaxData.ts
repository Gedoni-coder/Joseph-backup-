import { useState, useEffect, useCallback, useRef } from "react";
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

export function useTaxData() {
  const [state, setState] = useState<TaxDataState>({
    calculations: mockCalculations,
    recommendations: mockRecommendations,
    complianceUpdates: mockUpdates,
    planningScenarios: mockScenarios,
    auditTrail: mockAuditTrail,
    documents: mockDocuments,
    reports: mockReports,
    lastUpdated: new Date(),
    isLoading: false,
    error: null,
    isConnected: false,
  });

  const wsRef = useRef<WebSocket | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout>();

  // Simulate tax data fetching
  const fetchTaxData = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      await new Promise((resolve) =>
        setTimeout(resolve, 1200 + Math.random() * 800),
      );

      // Simulate tax calculation updates
      const updatedCalculations = mockCalculations.map((calc) => ({
        ...calc,
        estimatedTax: calc.estimatedTax * (0.98 + Math.random() * 0.04),
        effectiveRate: Math.max(
          15,
          Math.min(35, calc.effectiveRate + (Math.random() - 0.5) * 2),
        ),
        lastUpdated: new Date(),
      }));

      // Simulate new compliance updates
      const updatedCompliance = mockUpdates.map((update) => ({
        ...update,
        status:
          Math.random() > 0.8
            ? (["new", "reviewed", "implemented"] as const)[
                Math.floor(Math.random() * 3)
              ]
            : update.status,
      }));

      // Simulate recommendation changes
      const updatedRecommendations = mockRecommendations.map((rec) => ({
        ...rec,
        potentialSavings: rec.potentialSavings * (0.95 + Math.random() * 0.1),
        implemented: Math.random() > 0.9 ? !rec.implemented : rec.implemented,
      }));

      setState((prev) => ({
        ...prev,
        calculations: updatedCalculations,
        complianceUpdates: updatedCompliance,
        recommendations: updatedRecommendations,
        lastUpdated: new Date(),
        isLoading: false,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error:
          error instanceof Error ? error.message : "Failed to fetch tax data",
        isLoading: false,
      }));
    }
  }, []);

  // Real-time tax updates simulation
  const connectTaxWebSocket = useCallback(() => {
    setState((prev) => ({ ...prev, isConnected: true }));

    const simulateTaxUpdates = () => {
      const updateType = Math.random();

      if (updateType < 0.3) {
        // Update tax calculations
        setState((prev) => ({
          ...prev,
          calculations: prev.calculations.map((calc) => {
            if (Math.random() < 0.3) {
              return {
                ...calc,
                estimatedTax:
                  calc.estimatedTax * (0.999 + Math.random() * 0.002),
                lastUpdated: new Date(),
              };
            }
            return calc;
          }),
          lastUpdated: new Date(),
        }));
      } else if (updateType < 0.6) {
        // Add new audit events
        const newAuditEvent: AuditEvent = {
          id: Date.now().toString(),
          timestamp: new Date(),
          user: [
            "john.smith@company.com",
            "maria.garcia@company.com",
            "system",
          ][Math.floor(Math.random() * 3)],
          action: [
            "Tax Calculation Updated",
            "Document Accessed",
            "Compliance Check",
            "Report Generated",
          ][Math.floor(Math.random() * 4)],
          entity: ["ABC Corporation", "XYZ Holdings LLC", "Smith Family Trust"][
            Math.floor(Math.random() * 3)
          ],
          details: "Automated system update",
          ipAddress: "192.168.1." + Math.floor(Math.random() * 255),
          outcome: "success",
          category: ["calculation", "document", "compliance"][
            Math.floor(Math.random() * 3)
          ] as any,
        };

        setState((prev) => ({
          ...prev,
          auditTrail: [newAuditEvent, ...prev.auditTrail.slice(0, 19)],
          lastUpdated: new Date(),
        }));
      } else {
        // Update compliance reports
        setState((prev) => ({
          ...prev,
          reports: prev.reports.map((report) => ({
            ...report,
            completionRate: Math.min(
              100,
              report.completionRate + Math.random() * 2,
            ),
            riskScore: Math.max(
              0,
              report.riskScore + (Math.random() - 0.5) * 5,
            ),
          })),
          lastUpdated: new Date(),
        }));
      }
    };

    // Simulate updates every 10-25 seconds for tax data
    const updateInterval = setInterval(
      simulateTaxUpdates,
      10000 + Math.random() * 15000,
    );

    wsRef.current = {
      readyState: WebSocket.OPEN,
      close: () => clearInterval(updateInterval),
    } as WebSocket;

    return () => {
      clearInterval(updateInterval);
    };
  }, []);

  // Manual refresh
  const refreshData = useCallback(async () => {
    await fetchTaxData();
  }, [fetchTaxData]);

  // Update specific tax calculation
  const updateCalculation = useCallback(
    (id: string, updates: Partial<TaxCalculation>) => {
      setState((prev) => ({
        ...prev,
        calculations: prev.calculations.map((calc) =>
          calc.id === id
            ? { ...calc, ...updates, lastUpdated: new Date() }
            : calc,
        ),
        lastUpdated: new Date(),
      }));

      // Add audit event
      const auditEvent: AuditEvent = {
        id: Date.now().toString(),
        timestamp: new Date(),
        user: "current.user@company.com",
        action: "Tax Calculation Modified",
        entity: prev.calculations.find((c) => c.id === id)?.entity || "Unknown",
        details: `Updated calculation: ${Object.keys(updates).join(", ")}`,
        ipAddress: "192.168.1.100",
        outcome: "success",
        category: "calculation",
      };

      setState((prev) => ({
        ...prev,
        auditTrail: [auditEvent, ...prev.auditTrail.slice(0, 19)],
      }));
    },
    [],
  );

  // Implement recommendation
  const implementRecommendation = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      recommendations: prev.recommendations.map((rec) =>
        rec.id === id ? { ...rec, implemented: true } : rec,
      ),
      lastUpdated: new Date(),
    }));

    // Add audit event
    const auditEvent: AuditEvent = {
      id: Date.now().toString(),
      timestamp: new Date(),
      user: "current.user@company.com",
      action: "Tax Recommendation Implemented",
      entity: "Tax Planning",
      details: `Implemented recommendation: ${id}`,
      ipAddress: "192.168.1.100",
      outcome: "success",
      category: "planning",
    };

    setState((prev) => ({
      ...prev,
      auditTrail: [auditEvent, ...prev.auditTrail.slice(0, 19)],
    }));
  }, []);

  // Update compliance status
  const updateComplianceStatus = useCallback(
    (id: string, status: "new" | "reviewed" | "implemented" | "archived") => {
      setState((prev) => ({
        ...prev,
        complianceUpdates: prev.complianceUpdates.map((update) =>
          update.id === id ? { ...update, status } : update,
        ),
        lastUpdated: new Date(),
      }));
    },
    [],
  );

  // Initialize
  useEffect(() => {
    connectTaxWebSocket();
    fetchTaxData();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [connectTaxWebSocket, fetchTaxData]);

  return {
    ...state,
    refreshData,
    updateCalculation,
    implementRecommendation,
    updateComplianceStatus,
    reconnect: connectTaxWebSocket,
  };
}
