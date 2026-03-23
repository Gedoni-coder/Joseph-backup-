import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  taxRecordsAPI,
  taxRecommendationsAPI,
  complianceUpdatesAPI,
  taxPlanningAPI,
  taxAuditEventsAPI,
  complianceObligationsAPI,
  complianceReportsAPI,
  type TaxRecord,
  type TaxRecommendation as APITaxRecommendation,
  type ComplianceUpdateRecord,
  type TaxPlanningScenarioRecord,
  type TaxAuditEvent,
  type ComplianceObligationRecord,
  type ComplianceReportRecord,
} from "@/lib/api/tax-compliance-service";
import type {
  TaxCalculation,
  TaxAvoidanceRecommendation,
  ComplianceUpdate,
  TaxPlanningScenario,
  AuditEvent,
  ComplianceObligation,
  ComplianceReport,
} from "@/lib/tax-compliance-data";

const STALE = 5 * 60 * 1000;

// ---- snake_case → camelCase mappers ----

function mapRecord(r: TaxRecord): TaxCalculation {
  return {
    id: r.id,
    entity: r.entity,
    taxYear: r.tax_year,
    income: r.income,
    deductions: r.deductions,
    taxableIncome: r.taxable_income,
    estimatedTax: r.estimated_tax,
    effectiveRate: r.effective_rate,
    marginalRate: r.marginal_rate,
    status: r.status,
    lastUpdated: r.updated_at,
  };
}

function mapRecommendation(r: APITaxRecommendation): TaxAvoidanceRecommendation {
  return {
    id: r.id,
    title: r.title,
    description: r.description,
    category: r.category,
    potentialSavings: r.potential_savings,
    complexity: r.complexity,
    deadline: r.deadline,
    requirements: r.requirements,
    implemented: r.implemented,
    priority: r.priority,
  };
}

function mapUpdate(u: ComplianceUpdateRecord): ComplianceUpdate {
  return {
    id: u.id,
    title: u.title,
    description: u.description,
    type: u.type,
    jurisdiction: u.jurisdiction,
    effectiveDate: u.effective_date,
    deadline: u.deadline,
    impact: u.impact,
    status: u.status,
    actionRequired: u.action_required,
  };
}

function mapScenario(s: TaxPlanningScenarioRecord): TaxPlanningScenario {
  return {
    id: s.id,
    name: s.name,
    description: s.description,
    currentTax: s.current_tax,
    projectedTax: s.projected_tax,
    savings: s.savings,
    timeframe: s.timeframe,
    riskLevel: s.risk_level,
    steps: s.steps,
    confidence: s.confidence,
  };
}

function mapAudit(a: TaxAuditEvent): AuditEvent {
  return {
    id: a.id,
    timestamp: a.created_at,
    action: a.action,
    entity: a.entity,
    details: a.details,
    ipAddress: a.ip_address,
    outcome: a.outcome,
    category: a.category,
  };
}

function mapObligation(o: ComplianceObligationRecord): ComplianceObligation {
  return {
    id: o.id,
    name: o.name,
    description: o.description,
    dueDate: o.due_date,
    frequency: o.frequency,
    agency: o.agency,
    jurisdiction: o.jurisdiction,
    consequence: o.consequence,
    consequenceDetail: o.consequence_detail,
    status: o.status,
    assignedTo: o.assigned_to,
    dependencies: Array.isArray(o.dependencies) ? o.dependencies : [],
    documentationRequired: Array.isArray(o.documentation_required) ? o.documentation_required : [],
    priority: o.priority,
  };
}

function mapReport(r: ComplianceReportRecord): ComplianceReport {
  return {
    id: r.id,
    title: r.title,
    description: r.description,
    period: r.period,
    type: r.type,
    status: r.status,
    dueDate: r.due_date,
    completionRate: r.completion_rate,
    riskScore: r.risk_score,
    findings: r.findings_count,
    assignee: r.assignee,
  };
}

/**
 * Main hook for the Tax Compliance page — fetches all 7 entity types from Django API.
 * No mock fallbacks. Returns real data + mutations.
 */
export function useTaxDataAPI() {
  const qc = useQueryClient();

  // ---- Queries ----
  const records = useQuery({ queryKey: ["tax-records"], queryFn: taxRecordsAPI.list, staleTime: STALE });
  const recs    = useQuery({ queryKey: ["tax-recommendations"], queryFn: taxRecommendationsAPI.list, staleTime: STALE });
  const updates = useQuery({ queryKey: ["compliance-updates"], queryFn: complianceUpdatesAPI.list, staleTime: STALE });
  const plans   = useQuery({ queryKey: ["tax-planning-scenarios"], queryFn: taxPlanningAPI.list, staleTime: STALE });
  const audits  = useQuery({ queryKey: ["tax-audit-events"], queryFn: taxAuditEventsAPI.list, staleTime: STALE });
  const obligs  = useQuery({ queryKey: ["compliance-obligations"], queryFn: complianceObligationsAPI.list, staleTime: STALE });
  const reportQ = useQuery({ queryKey: ["compliance-reports"], queryFn: complianceReportsAPI.list, staleTime: STALE });

  // ---- Mutations ----
  const updateRecordMut = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<TaxRecord> }) => taxRecordsAPI.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tax-records"] }),
  });

  const createRecordMut = useMutation({
    mutationFn: (data: Partial<TaxRecord>) => taxRecordsAPI.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tax-records"] }),
  });

  const implementRecMut = useMutation({
    mutationFn: (id: number) => taxRecommendationsAPI.update(id, { implemented: true }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tax-recommendations"] }),
  });

  const updateComplianceStatusMut = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      complianceUpdatesAPI.update(id, { status: status as ComplianceUpdateRecord["status"] }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["compliance-updates"] }),
  });

  const createObligationMut = useMutation({
    mutationFn: (data: Partial<ComplianceObligationRecord>) => complianceObligationsAPI.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["compliance-obligations"] }),
  });

  const updateObligationMut = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ComplianceObligationRecord> }) =>
      complianceObligationsAPI.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["compliance-obligations"] }),
  });

  const createReportMut = useMutation({
    mutationFn: (data: Partial<ComplianceReportRecord>) => complianceReportsAPI.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["compliance-reports"] }),
  });

  // ---- State ----
  const isLoading = records.isLoading || recs.isLoading || updates.isLoading ||
    plans.isLoading || audits.isLoading || obligs.isLoading || reportQ.isLoading;

  const errorObj = records.error || recs.error || updates.error ||
    plans.error || audits.error || obligs.error || reportQ.error;

  const isConnected = !errorObj;

  const refreshData = () => {
    qc.invalidateQueries({ queryKey: ["tax-records"] });
    qc.invalidateQueries({ queryKey: ["tax-recommendations"] });
    qc.invalidateQueries({ queryKey: ["compliance-updates"] });
    qc.invalidateQueries({ queryKey: ["tax-planning-scenarios"] });
    qc.invalidateQueries({ queryKey: ["tax-audit-events"] });
    qc.invalidateQueries({ queryKey: ["compliance-obligations"] });
    qc.invalidateQueries({ queryKey: ["compliance-reports"] });
  };

  return {
    // Data (mapped to camelCase)
    calculations: (records.data ?? []).map(mapRecord),
    recommendations: (recs.data ?? []).map(mapRecommendation),
    complianceUpdates: (updates.data ?? []).map(mapUpdate),
    planningScenarios: (plans.data ?? []).map(mapScenario),
    auditTrail: (audits.data ?? []).map(mapAudit),
    obligations: (obligs.data ?? []).map(mapObligation),
    reports: (reportQ.data ?? []).map(mapReport),

    // State
    lastUpdated: new Date(),
    isLoading,
    error: errorObj ? (errorObj as Error).message : null,
    isConnected,

    // Actions
    refreshData,
    reconnect: refreshData,
    createRecord: (data: Partial<TaxRecord>) => createRecordMut.mutateAsync(data),
    updateCalculation: (id: number, data: Partial<TaxRecord>) => updateRecordMut.mutateAsync({ id, data }),
    implementRecommendation: (id: number) => implementRecMut.mutateAsync(id),
    updateComplianceStatus: (id: number, status: string) => updateComplianceStatusMut.mutateAsync({ id, status }),
    createObligation: (data: Partial<ComplianceObligationRecord>) => createObligationMut.mutateAsync(data),
    updateObligation: (id: number, data: Partial<ComplianceObligationRecord>) => updateObligationMut.mutateAsync({ id, data }),
    createReport: (data: Partial<ComplianceReportRecord>) => createReportMut.mutateAsync(data),
  };
}
