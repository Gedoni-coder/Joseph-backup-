/**
 * Compliance Status Calculation Utilities
 * Contains business logic for compliance tracking and status calculations
 */

import { ComplianceUpdate, ComplianceReport } from "@/lib/tax-compliance-data";

/**
 * Calculate overall compliance score
 */
export function calculateComplianceScore(updates: ComplianceUpdate[]): number {
  if (updates.length === 0) return 0;
  const reviewed = updates.filter(u => u.status === "reviewed" || u.status === "implemented").length;
  return Math.round((reviewed / updates.length) * 100);
}

/**
 * Get updates by status
 */
export function getUpdatesByStatus(updates: ComplianceUpdate[]): Record<string, ComplianceUpdate[]> {
  return updates.reduce((acc, update) => {
    const status = update.status || "new";
    if (!acc[status]) acc[status] = [];
    acc[status].push(update);
    return acc;
  }, {} as Record<string, ComplianceUpdate[]>);
}

/**
 * Get updates by type
 */
export function getUpdatesByType(updates: ComplianceUpdate[]): Record<string, ComplianceUpdate[]> {
  return updates.reduce((acc, update) => {
    const type = update.type || "other";
    if (!acc[type]) acc[type] = [];
    acc[type].push(update);
    return acc;
  }, {} as Record<string, ComplianceUpdate[]>);
}

/**
 * Get updates by jurisdiction
 */
export function getUpdatesByJurisdiction(updates: ComplianceUpdate[]): Record<string, ComplianceUpdate[]> {
  return updates.reduce((acc, update) => {
    const jurisdiction = update.jurisdiction || "federal";
    if (!acc[jurisdiction]) acc[jurisdiction] = [];
    acc[jurisdiction].push(update);
    return acc;
  }, {} as Record<string, ComplianceUpdate[]>);
}

/**
 * Get updates requiring action
 */
export function getActionRequiredUpdates(updates: ComplianceUpdate[]): ComplianceUpdate[] {
  return updates.filter(u => u.actionRequired && u.status !== "implemented");
}

/**
 * Get upcoming deadlines (within 30 days)
 */
export function getUpcomingDeadlines(updates: ComplianceUpdate[]): ComplianceUpdate[] {
  const now = new Date();
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  
  return updates.filter(u => 
    u.deadline && 
    new Date(u.deadline) <= thirtyDaysFromNow &&
    u.status !== "implemented"
  );
}

/**
 * Get high impact updates
 */
export function getHighImpactUpdates(updates: ComplianceUpdate[]): ComplianceUpdate[] {
  return updates.filter(u => u.impact === "high" && u.status !== "implemented");
}

/**
 * Calculate report completion rate
 */
export function calculateReportCompletionRate(report: ComplianceReport): number {
  return report.completionRate || 0;
}

/**
 * Get reports by status
 */
export function getReportsByStatus(reports: ComplianceReport[]): Record<string, ComplianceReport[]> {
  return reports.reduce((acc, report) => {
    const status = report.status || "draft";
    if (!acc[status]) acc[status] = [];
    acc[status].push(report);
    return acc;
  }, {} as Record<string, ComplianceReport[]>);
}

/**
 * Get overdue reports
 */
export function getOverdueReports(reports: ComplianceReport[]): ComplianceReport[] {
  const now = new Date();
  return reports.filter(r => 
    r.status !== "completed" && 
    r.dueDate && 
    new Date(r.dueDate) < now
  );
}

/**
 * Get upcoming report deadlines
 */
export function getUpcomingReportDeadlines(reports: ComplianceReport[]): ComplianceReport[] {
  const now = new Date();
  const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  
  return reports.filter(r => 
    r.status !== "completed" && 
    r.dueDate && 
    new Date(r.dueDate) <= sevenDaysFromNow
  );
}

/**
 * Calculate average risk score
 */
export function calculateAverageRiskScore(reports: ComplianceReport[]): number {
  if (reports.length === 0) return 0;
  const total = reports.reduce((sum, r) => sum + (r.riskScore || 0), 0);
  return Math.round(total / reports.length);
}

/**
 * Get compliance summary
 */
export function getComplianceSummary(updates: ComplianceUpdate[], reports: ComplianceReport[]) {
  return {
    totalUpdates: updates.length,
    pendingUpdates: updates.filter(u => u.status !== "implemented").length,
    actionRequired: getActionRequiredUpdates(updates).length,
    upcomingDeadlines: getUpcomingDeadlines(updates).length,
    highImpactPending: getHighImpactUpdates(updates).length,
    totalReports: reports.length,
    overdueReports: getOverdueReports(reports).length,
    upcomingReportDeadlines: getUpcomingReportDeadlines(reports).length,
    averageRiskScore: calculateAverageRiskScore(reports),
    complianceScore: calculateComplianceScore(updates),
  };
}

