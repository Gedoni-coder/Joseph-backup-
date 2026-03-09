/**
 * Compliance Updates Calculation Utilities
 * Dynamic generation of compliance updates and notifications
 */

import { differenceInDays } from "date-fns";
import { ComplianceUpdate } from "@/lib/tax-compliance-data";

export interface ComplianceUpdateInput {
  id: string;
  title: string;
  description: string;
  type: "regulation" | "form" | "deadline" | "rate_change" | "guidance";
  jurisdiction: "federal" | "state" | "local";
  effectiveDate: Date;
  deadline?: Date;
  impact: "high" | "medium" | "low";
  actionRequired: boolean;
  status: "new" | "reviewed" | "implemented" | "archived";
}

// Base compliance updates that will be dynamically scheduled
const baseComplianceUpdates: ComplianceUpdateInput[] = [
  {
    id: "1",
    title: "Corporate Tax Rate Update for 2025",
    description: "The corporate tax rate remains at 21% for tax year 2025.",
    type: "rate_change",
    jurisdiction: "federal",
    effectiveDate: new Date(new Date().getFullYear(), 0, 1),
    impact: "medium",
    actionRequired: false,
    status: "new",
  },
  {
    id: "2",
    title: "New Form 941 Requirements",
    description: "Updated reporting requirements for quarterly federal tax returns.",
    type: "form",
    jurisdiction: "federal",
    effectiveDate: new Date(new Date().getFullYear(), 2, 1),
    deadline: new Date(new Date().getFullYear(), 2, 15),
    impact: "medium",
    actionRequired: true,
    status: "new",
  },
  {
    id: "3",
    title: "State Sales Tax Nexus Changes",
    description: "New economic nexus thresholds for out-of-state sellers.",
    type: "regulation",
    jurisdiction: "state",
    effectiveDate: new Date(new Date().getFullYear(), 5, 1),
    impact: "high",
    actionRequired: true,
    status: "new",
  },
  {
    id: "4",
    title: "Digital Goods Taxation Guidelines",
    description: "Updated guidance on taxation of digital goods and services.",
    type: "guidance",
    jurisdiction: "federal",
    effectiveDate: new Date(new Date().getFullYear(), 3, 1),
    impact: "medium",
    actionRequired: false,
    status: "new",
  },
  {
    id: "5",
    title: "Q1 Estimated Tax Payment Due",
    description: "First quarter estimated tax payment due date.",
    type: "deadline",
    jurisdiction: "federal",
    effectiveDate: new Date(new Date().getFullYear(), 3, 15),
    deadline: new Date(new Date().getFullYear(), 3, 15),
    impact: "high",
    actionRequired: true,
    status: "new",
  },
  {
    id: "6",
    title: "Payroll Tax Credit Extension",
    description: "Extended availability of employer payroll tax credits.",
    type: "regulation",
    jurisdiction: "federal",
    effectiveDate: new Date(new Date().getFullYear(), 0, 1),
    impact: "low",
    actionRequired: false,
    status: "reviewed",
  },
  {
    id: "7",
    title: "Local Business License Renewal",
    description: "Annual business license renewal period opening.",
    type: "deadline",
    jurisdiction: "local",
    effectiveDate: new Date(new Date().getFullYear(), 5, 1),
    deadline: new Date(new Date().getFullYear(), 5, 30),
    impact: "medium",
    actionRequired: true,
    status: "new",
  },
  {
    id: "8",
    title: "International Tax Reporting Changes",
    description: "Updated requirements for foreign account reporting.",
    type: "regulation",
    jurisdiction: "federal",
    effectiveDate: new Date(new Date().getFullYear(), 6, 1),
    impact: "high",
    actionRequired: true,
    status: "new",
  },
];

/**
 * Generate compliance updates with dynamic dates
 */
export function generateComplianceUpdates(
  completedUpdateIds: string[] = [],
  referenceDate: Date = new Date()
): ComplianceUpdate[] {
  const currentYear = referenceDate.getFullYear();
  
  return baseComplianceUpdates.map(update => {
    // Calculate days until effective date
    const daysUntilEffective = differenceInDays(update.effectiveDate, referenceDate);
    
    // Determine status based on completion
    let status = update.status;
    if (completedUpdateIds.includes(update.id)) {
      status = "implemented";
    } else if (daysUntilEffective > 60) {
      status = "new";
    } else if (daysUntilEffective > 0) {
      status = "reviewed";
    } else {
      status = "implemented";
    }
    
    return {
      ...update,
      effectiveDate: new Date(currentYear, update.effectiveDate.getMonth(), update.effectiveDate.getDate()),
      deadline: update.deadline ? new Date(currentYear, update.deadline.getMonth(), update.deadline.getDate()) : undefined,
      status,
    };
  });
}

/**
 * Get urgent updates requiring action
 */
export function getUrgentUpdates(
  updates: ComplianceUpdate[],
  referenceDate: Date = new Date()
): ComplianceUpdate[] {
  return updates.filter(update => {
    if (!update.actionRequired) return false;
    if (update.status === "implemented" || update.status === "archived") return false;
    
    // Check if deadline is approaching
    if (update.deadline) {
      const daysUntilDeadline = differenceInDays(update.deadline, referenceDate);
      return daysUntilDeadline <= 14; // Within 14 days
    }
    
    // Check if effective date is approaching
    const daysUntilEffective = differenceInDays(update.effectiveDate, referenceDate);
    return daysUntilEffective <= 30 && update.impact === "high"; // Within 30 days for high impact
  });
}

/**
 * Get updates grouped by type
 */
export function getUpdatesByType(
  updates: ComplianceUpdate[]
): Record<string, ComplianceUpdate[]> {
  return updates.reduce((acc, update) => {
    if (!acc[update.type]) {
      acc[update.type] = [];
    }
    acc[update.type].push(update);
    return acc;
  }, {} as Record<string, ComplianceUpdate[]>);
}

/**
 * Get updates grouped by jurisdiction
 */
export function getUpdatesByJurisdiction(
  updates: ComplianceUpdate[]
): Record<string, ComplianceUpdate[]> {
  return updates.reduce((acc, update) => {
    if (!acc[update.jurisdiction]) {
      acc[update.jurisdiction] = [];
    }
    acc[update.jurisdiction].push(update);
    return acc;
  }, {} as Record<string, ComplianceUpdate[]>);
}

/**
 * Get updates grouped by impact level
 */
export function getUpdatesByImpact(
  updates: ComplianceUpdate[]
): Record<string, ComplianceUpdate[]> {
  return updates.reduce((acc, update) => {
    if (!acc[update.impact]) {
      acc[update.impact] = [];
    }
    acc[update.impact].push(update);
    return acc;
  }, {} as Record<string, ComplianceUpdate[]>);
}

/**
 * Calculate compliance health score
 */
export function calculateComplianceHealthScore(
  updates: ComplianceUpdate[]
): number {
  const total = updates.length;
  if (total === 0) return 100;
  
  const implemented = updates.filter(u => u.status === "implemented" || u.status === "archived").length;
  const urgent = getUrgentUpdates(updates).length;
  
  // Base score from implementation
  const implementationScore = (implemented / total) * 70;
  
  // Urgency penalty
  const urgencyPenalty = Math.min(urgent * 10, 30);
  
  return Math.max(0, Math.round(implementationScore + 30 - urgencyPenalty));
}

/**
 * Get update statistics
 */
export function getUpdateStats(updates: ComplianceUpdate[]) {
  const byType = getUpdatesByType(updates);
  const byJurisdiction = getUpdatesByJurisdiction(updates);
  const byImpact = getUpdatesByImpact(updates);
  const urgent = getUrgentUpdates(updates);
  
  return {
    total: updates.length,
    new: updates.filter(u => u.status === "new").length,
    reviewed: updates.filter(u => u.status === "reviewed").length,
    implemented: updates.filter(u => u.status === "implemented").length,
    archived: updates.filter(u => u.status === "archived").length,
    actionRequired: updates.filter(u => u.actionRequired).length,
    urgentCount: urgent.length,
    healthScore: calculateComplianceHealthScore(updates),
    typeCount: Object.keys(byType).length,
    jurisdictionCount: Object.keys(byJurisdiction).length,
  };
}

/**
 * Update status of a compliance update
 */
export function updateStatus(
  updates: ComplianceUpdate[],
  updateId: string,
  newStatus: "new" | "reviewed" | "implemented" | "archived"
): ComplianceUpdate[] {
  return updates.map(update =>
    update.id === updateId ? { ...update, status: newStatus } : update
  );
}

/**
 * Mark update as requiring action
 */
export function markActionRequired(
  updates: ComplianceUpdate[],
  updateId: string,
  required: boolean
): ComplianceUpdate[] {
  return updates.map(update =>
    update.id === updateId ? { ...update, actionRequired: required } : update
  );
}

/**
 * Filter updates by status
 */
export function filterUpdatesByStatus(
  updates: ComplianceUpdate[],
  status: "new" | "reviewed" | "implemented" | "archived" | "all"
): ComplianceUpdate[] {
  if (status === "all") return updates;
  return updates.filter(u => u.status === status);
}

/**
 * Filter updates by impact
 */
export function filterUpdatesByImpact(
  updates: ComplianceUpdate[],
  impact: "high" | "medium" | "low" | "all"
): ComplianceUpdate[] {
  if (impact === "all") return updates;
  return updates.filter(u => u.impact === impact);
}

/**
 * Get upcoming deadlines
 */
export function getUpcomingDeadlines(
  updates: ComplianceUpdate[],
  daysThreshold: number = 30,
  referenceDate: Date = new Date()
): ComplianceUpdate[] {
  return updates
    .filter(update => {
      if (!update.deadline || update.status === "implemented" || update.status === "archived") return false;
      const daysUntilDeadline = differenceInDays(update.deadline, referenceDate);
      return daysUntilDeadline >= 0 && daysUntilDeadline <= daysThreshold;
    })
    .sort((a, b) => {
      if (!a.deadline || !b.deadline) return 0;
      return a.deadline.getTime() - b.deadline.getTime();
    });
}

