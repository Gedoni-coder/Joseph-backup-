/**
 * Tax Compliance Service
 * Connected to Django REST API — all 7 Tax entities
 */

import { djangoGet, djangoPost, djangoPatch, djangoDelete } from "./django-client";

// ==================== Interfaces (matching Django models) ====================

export interface TaxRecord {
  id: number;
  entity: string;
  tax_year: number;
  income: number;
  deductions: number;
  taxable_income: number;
  estimated_tax: number;
  effective_rate: number;
  marginal_rate: number;
  status: "draft" | "calculated" | "filed" | "amended";
  created_at: string;
  updated_at: string;
}

export interface TaxRecommendation {
  id: number;
  title: string;
  description: string;
  category: "deduction" | "credit" | "timing" | "structure" | "investment";
  potential_savings: number;
  complexity: "low" | "medium" | "high";
  deadline: string | null;
  requirements: string[];
  implemented: boolean;
  priority: "low" | "medium" | "high";
  created_at: string;
}

export interface ComplianceUpdateRecord {
  id: number;
  title: string;
  description: string;
  type: "regulation" | "form" | "deadline" | "rate_change" | "guidance";
  jurisdiction: "federal" | "state" | "local";
  effective_date: string | null;
  deadline: string | null;
  impact: "low" | "medium" | "high";
  status: "new" | "reviewed" | "implemented" | "archived";
  action_required: boolean;
  created_at: string;
}

export interface TaxPlanningScenarioRecord {
  id: number;
  name: string;
  description: string;
  current_tax: number;
  projected_tax: number;
  savings: number;
  timeframe: string;
  risk_level: "low" | "medium" | "high";
  steps: string[];
  confidence: number;
  created_at: string;
}

export interface TaxAuditEvent {
  id: number;
  action: string;
  entity: string;
  details: string;
  ip_address: string | null;
  outcome: "success" | "failure" | "warning";
  category: "calculation" | "filing" | "document" | "planning" | "compliance";
  created_at: string;
}

export interface ComplianceObligationRecord {
  id: number;
  name: string;
  description: string;
  due_date: string | null;
  frequency: "monthly" | "quarterly" | "annually" | "event_based";
  agency: string;
  jurisdiction: string;
  consequence: "low" | "medium" | "high" | "critical";
  consequence_detail: string;
  status: "completed" | "pending" | "at_risk" | "overdue";
  assigned_to: string;
  dependencies: string[];
  documentation_required: string[];
  priority: "low" | "medium" | "high" | "critical";
  created_at: string;
}

export interface ComplianceReportRecord {
  id: number;
  title: string;
  description: string;
  period: string;
  type: "monthly" | "quarterly" | "annual" | "custom";
  status: "draft" | "pending" | "completed" | "overdue";
  due_date: string | null;
  completion_rate: number;
  risk_score: number;
  findings_count: number;
  findings: unknown[];
  assignee: string;
  created_at: string;
}

// ==================== Generic CRUD helpers ====================

// DRF PageNumberPagination wraps lists in { count, next, previous, results }
interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

function crudFor<T>(base: string) {
  return {
    list: async (): Promise<T[]> => {
      try {
        const res = await djangoGet<PaginatedResponse<T> | T[]>(base);
        // Handle both paginated and plain array responses
        if (Array.isArray(res)) return res;
        return res.results ?? [];
      }
      catch (e) { console.error(`[Tax API] GET ${base}`, e); return []; }
    },
    get: async (id: number): Promise<T | null> => {
      try { return await djangoGet<T>(`${base}${id}/`); }
      catch (e) { console.error(`[Tax API] GET ${base}${id}/`, e); return null; }
    },
    create: async (data: Partial<T>): Promise<T | null> => {
      try { return await djangoPost<T>(base, data); }
      catch (e) { console.error(`[Tax API] POST ${base}`, e); return null; }
    },
    update: async (id: number, data: Partial<T>): Promise<T | null> => {
      try { return await djangoPatch<T>(`${base}${id}/`, data); }
      catch (e) { console.error(`[Tax API] PATCH ${base}${id}/`, e); return null; }
    },
    remove: async (id: number): Promise<boolean> => {
      try { await djangoDelete(`${base}${id}/`); return true; }
      catch (e) { console.error(`[Tax API] DELETE ${base}${id}/`, e); return false; }
    },
  };
}

// ==================== Exported service objects ====================

export const taxRecordsAPI      = crudFor<TaxRecord>("/api/tax/tax-records/");
export const taxRecommendationsAPI = crudFor<TaxRecommendation>("/api/tax/tax-recommendations/");
export const complianceUpdatesAPI  = crudFor<ComplianceUpdateRecord>("/api/tax/compliance-updates/");
export const taxPlanningAPI     = crudFor<TaxPlanningScenarioRecord>("/api/tax/tax-planning-scenarios/");
export const taxAuditEventsAPI  = crudFor<TaxAuditEvent>("/api/tax/tax-audit-events/");
export const complianceObligationsAPI = crudFor<ComplianceObligationRecord>("/api/tax/compliance-obligations/");
export const complianceReportsAPI  = crudFor<ComplianceReportRecord>("/api/tax/compliance-reports/");
