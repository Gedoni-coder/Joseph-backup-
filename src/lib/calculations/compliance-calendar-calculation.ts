/**
 * Compliance Calendar Calculation Utilities
 * Dynamic generation of compliance obligations, alerts, and todo items
 */

import { differenceInDays, addDays, addMonths, addQuarters, isBefore } from "date-fns";

export interface ComplianceObligationInput {
  id: string;
  name: string;
  description: string;
  baseDueDate: Date;
  frequency: "monthly" | "quarterly" | "annually" | "event_based";
  agency: string;
  jurisdiction: string;
  consequence: "low" | "medium" | "high" | "critical";
  consequenceDetail: string;
  assignedTo: string;
  dependencies: string[];
  documentationRequired: string[];
  priority: "low" | "medium" | "high" | "critical";
}

export interface ComplianceObligation extends ComplianceObligationInput {
  dueDate: Date;
  status: "completed" | "pending" | "at_risk" | "overdue";
  daysUntilDue: number;
}

export interface ComplianceAlert {
  id: string;
  obligationId: string;
  type: "early-warning" | "upcoming" | "urgent" | "dependency" | "overdue";
  message: string;
  daysUntilDue: number;
  role: string;
  read: boolean;
  createdAt: Date;
}

export interface TodoItem {
  id: string;
  task: string;
  description: string;
  completed: boolean;
  obligationId: string;
  obligationName: string;
  priority: "low" | "medium" | "high" | "critical";
  dueDate: Date;
}

// Base obligations that will be dynamically scheduled
const baseObligations: Omit<ComplianceObligation, "dueDate" | "status" | "daysUntilDue">[] = [
  {
    id: "vat-001",
    name: "VAT Return Filing",
    description: "Monthly VAT return and payment submission",
    baseDueDate: new Date(2025, 0, 15),
    frequency: "monthly",
    agency: "Tax Authority",
    jurisdiction: "National",
    consequence: "high",
    consequenceDetail: "Interest accrual, penalties up to 10% of unpaid amount",
    assignedTo: "Finance Manager",
    dependencies: ["invoice-reconciliation", "bank-reconciliation"],
    documentationRequired: ["Sales Invoices", "Purchase Invoices", "Bank Statements"],
    priority: "high",
  },
  {
    id: "paye-001",
    name: "PAYE / Payroll Remittance",
    description: "Monthly employee tax and social contribution withholdings",
    baseDueDate: new Date(2025, 0, 10),
    frequency: "monthly",
    agency: "Labor Authority",
    jurisdiction: "National",
    consequence: "critical",
    consequenceDetail: "Personal liability of officers, criminal penalties, employee claims",
    assignedTo: "HR Manager",
    dependencies: ["payroll-processing", "employee-verification"],
    documentationRequired: ["Payroll Register", "Employee Information", "Deduction Records"],
    priority: "critical",
  },
  {
    id: "corporate-tax-001",
    name: "Corporate Income Tax Filing",
    description: "Annual corporate income tax return",
    baseDueDate: new Date(2025, 3, 30),
    frequency: "annually",
    agency: "Revenue Authority",
    jurisdiction: "National",
    consequence: "high",
    consequenceDetail: "Audit triggers, penalties, interest on late payment",
    assignedTo: "Chief Financial Officer",
    dependencies: ["financial-statements", "balance-sheet", "income-statement"],
    documentationRequired: ["Audited Financial Statements", "Supporting Schedules", "Asset Register"],
    priority: "high",
  },
  {
    id: "withholding-001",
    name: "Withholding Tax Filing",
    description: "Quarterly withholding tax on contractor payments",
    baseDueDate: new Date(2025, 0, 20),
    frequency: "quarterly",
    agency: "Tax Authority",
    jurisdiction: "National",
    consequence: "medium",
    consequenceDetail: "Interest charges, administrative penalties",
    assignedTo: "Finance Manager",
    dependencies: ["invoice-processing", "contractor-verification"],
    documentationRequired: ["Contractor Invoices", "Payment Records"],
    priority: "medium",
  },
  {
    id: "license-renewal-001",
    name: "Business License Renewal",
    description: "Annual business operating license renewal",
    baseDueDate: new Date(2025, 5, 30),
    frequency: "annually",
    agency: "Business Registration Authority",
    jurisdiction: "Local",
    consequence: "high",
    consequenceDetail: "Suspension of business operations, legal penalties",
    assignedTo: "Legal Compliance Officer",
    dependencies: [],
    documentationRequired: ["Previous License", "Identity Verification", "Address Proof"],
    priority: "high",
  },
  {
    id: "audit-001",
    name: "Annual Audit Submission",
    description: "Auditor report and financial audit submission",
    baseDueDate: new Date(2025, 4, 31),
    frequency: "annually",
    agency: "Regulatory Authority",
    jurisdiction: "National",
    consequence: "medium",
    consequenceDetail: "Regulatory scrutiny, compliance certification delays",
    assignedTo: "Chief Financial Officer",
    dependencies: ["financial-statements", "internal-controls"],
    documentationRequired: ["Audit Report", "Management Letter", "Financial Statements"],
    priority: "critical",
  },
];

/**
 * Calculate the next due date based on frequency
 */
export function calculateNextDueDate(
  baseDate: Date,
  frequency: "monthly" | "quarterly" | "annually" | "event_based",
  referenceDate: Date = new Date()
): Date {
  let nextDue = new Date(baseDate);

  while (isBefore(nextDue, referenceDate)) {
    switch (frequency) {
      case "monthly":
        nextDue = addMonths(nextDue, 1);
        break;
      case "quarterly":
        nextDue = addQuarters(nextDue, 1);
        break;
      case "annually":
        nextDue = addMonths(nextDue, 12);
        break;
      case "event_based":
        return nextDue;
    }
  }

  return nextDue;
}

/**
 * Calculate obligation status based on due date
 */
export function calculateObligationStatus(
  dueDate: Date,
  referenceDate: Date = new Date()
): "completed" | "pending" | "at_risk" | "overdue" {
  const daysUntil = differenceInDays(dueDate, referenceDate);

  if (daysUntil < 0) {
    return "overdue";
  } else if (daysUntil <= 7) {
    return "at_risk";
  } else {
    return "pending";
  }
}

/**
 * Calculate days until due
 */
export function calculateDaysUntilDue(
  dueDate: Date,
  referenceDate: Date = new Date()
): number {
  return differenceInDays(dueDate, referenceDate);
}

/**
 * Generate all compliance obligations dynamically
 */
export function generateComplianceObligations(
  completedObligationIds: string[] = [],
  referenceDate: Date = new Date()
): ComplianceObligation[] {
  return baseObligations.map((obl) => {
    let dueDate = calculateNextDueDate(obl.baseDueDate, obl.frequency, referenceDate);

    switch (obl.id) {
      case "vat-001":
        dueDate = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 15);
        break;
      case "paye-001":
        dueDate = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 10);
        break;
      case "corporate-tax-001":
        dueDate = new Date(referenceDate.getFullYear() + 1, 3, 30);
        break;
      case "withholding-001":
        const quarter = Math.floor(referenceDate.getMonth() / 3);
        dueDate = new Date(referenceDate.getFullYear(), quarter * 3 + 3, 20);
        break;
      case "license-renewal-001":
        dueDate = new Date(referenceDate.getFullYear() + 1, 5, 30);
        break;
      case "audit-001":
        dueDate = new Date(referenceDate.getFullYear() + 1, 4, 31);
        break;
    }

    const status = completedObligationIds.includes(obl.id)
      ? "completed"
      : calculateObligationStatus(dueDate, referenceDate);

    const daysUntilDue = calculateDaysUntilDue(dueDate, referenceDate);

    return {
      ...obl,
      dueDate,
      status,
      daysUntilDue,
    };
  });
}

/**
 * Generate alerts based on obligations
 */
export function generateAlerts(
  obligations: ComplianceObligation[],
  referenceDate: Date = new Date()
): ComplianceAlert[] {
  const alerts: ComplianceAlert[] = [];

  obligations.forEach((obl) => {
    if (obl.status === "completed") return;

    if (obl.daysUntilDue < 0) {
      alerts.push({
        id: `alert-${obl.id}-overdue`,
        obligationId: obl.id,
        type: "overdue",
        message: `${obl.name} is ${Math.abs(obl.daysUntilDue)} days overdue`,
        daysUntilDue: obl.daysUntilDue,
        role: obl.assignedTo,
        read: false,
        createdAt: referenceDate,
      });
    }

    if (obl.daysUntilDue >= 0 && obl.daysUntilDue <= 3) {
      alerts.push({
        id: `alert-${obl.id}-urgent`,
        obligationId: obl.id,
        type: "urgent",
        message: `${obl.name} is due in ${obl.daysUntilDue} days - immediate action required`,
        daysUntilDue: obl.daysUntilDue,
        role: obl.assignedTo,
        read: false,
        createdAt: referenceDate,
      });
    }

    if (obl.daysUntilDue > 3 && obl.daysUntilDue <= 7) {
      alerts.push({
        id: `alert-${obl.id}-upcoming`,
        obligationId: obl.id,
        type: "upcoming",
        message: `${obl.name} is due in ${obl.daysUntilDue} days`,
        daysUntilDue: obl.daysUntilDue,
        role: obl.assignedTo,
        read: false,
        createdAt: referenceDate,
      });
    }

    if (obl.daysUntilDue > 7 && obl.daysUntilDue <= 14) {
      alerts.push({
        id: `alert-${obl.id}-early`,
        obligationId: obl.id,
        type: "early-warning",
        message: `${obl.name} due in ${obl.daysUntilDue} days - start preparation`,
        daysUntilDue: obl.daysUntilDue,
        role: obl.assignedTo,
        read: false,
        createdAt: referenceDate,
      });
    }

    if (obl.dependencies.length > 0 && obl.daysUntilDue <= 14) {
      alerts.push({
        id: `alert-${obl.id}-dependency`,
        obligationId: obl.id,
        type: "dependency",
        message: `${obl.name} requires ${obl.dependencies.length} prerequisite(s) to be completed`,
        daysUntilDue: obl.daysUntilDue,
        role: obl.assignedTo,
        read: false,
        createdAt: referenceDate,
      });
    }
  });

  return alerts.sort((a, b) => a.daysUntilDue - b.daysUntilDue);
}

/**
 * Generate todo items based on obligations
 */
export function generateTodoItems(
  obligations: ComplianceObligation[],
  completedTaskIds: string[] = []
): TodoItem[] {
  const todoItems: TodoItem[] = [];

  obligations.forEach((obl) => {
    if (obl.status === "completed") return;

    obl.dependencies.forEach((dep, idx) => {
      const taskId = `${obl.id}-task-${idx}`;
      todoItems.push({
        id: taskId,
        task: formatDependencyTask(dep),
        description: `Complete prerequisite task for ${obl.name}`,
        completed: completedTaskIds.includes(taskId),
        obligationId: obl.id,
        obligationName: obl.name,
        priority: obl.priority,
        dueDate: addDays(obl.dueDate, -7),
      });
    });

    if (obl.dependencies.length === 0) {
      const taskId = `${obl.id}-task-main`;
      todoItems.push({
        id: taskId,
        task: `Complete ${obl.name}`,
        description: obl.description,
        completed: completedTaskIds.includes(taskId),
        obligationId: obl.id,
        obligationName: obl.name,
        priority: obl.priority,
        dueDate: obl.dueDate,
      });
    }
  });

  const priorityOrder: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
  return todoItems.sort((a, b) => {
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDiff !== 0) return priorityDiff;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });
}

function formatDependencyTask(dependency: string): string {
  const taskNames: Record<string, string> = {
    "invoice-reconciliation": "Invoice Reconciliation",
    "bank-reconciliation": "Bank Reconciliation",
    "payroll-processing": "Payroll Processing",
    "employee-verification": "Employee Verification",
    "financial-statements": "Financial Statements Preparation",
    "balance-sheet": "Balance Sheet Review",
    "income-statement": "Income Statement Finalization",
    "invoice-processing": "Contractor Invoice Processing",
    "contractor-verification": "Contractor Verification",
    "internal-controls": "Internal Controls Review",
  };

  return taskNames[dependency] || dependency.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

/**
 * Get calendar statistics
 */
export function getCalendarStats(obligations: ComplianceObligation[]) {
  return {
    total: obligations.length,
    completed: obligations.filter(o => o.status === "completed").length,
    pending: obligations.filter(o => o.status === "pending").length,
    atRisk: obligations.filter(o => o.status === "at_risk").length,
    overdue: obligations.filter(o => o.status === "overdue").length,
    criticalCount: obligations.filter(o => o.priority === "critical" && o.status !== "completed").length,
    highPriorityCount: obligations.filter(o => o.priority === "high" && o.status !== "completed").length,
  };
}

/**
 * Filter obligations by status
 */
export function filterObligationsByStatus(
  obligations: ComplianceObligation[],
  status: "all" | "completed" | "pending" | "at_risk" | "overdue"
): ComplianceObligation[] {
  if (status === "all") return obligations;
  return obligations.filter(o => o.status === status);
}

/**
 * Get upcoming obligations for timeline
 */
export function getUpcomingObligations(
  obligations: ComplianceObligation[],
  days: number = 90
): ComplianceObligation[] {
  return obligations
    .filter(o => o.daysUntilDue >= 0 && o.daysUntilDue <= days && o.status !== "completed")
    .sort((a, b) => a.daysUntilDue - b.daysUntilDue);
}

/**
 * Mark obligation as completed
 */
export function markObligationCompleted(
  obligations: ComplianceObligation[],
  obligationId: string
): ComplianceObligation[] {
  return obligations.map(obl =>
    obl.id === obligationId ? { ...obl, status: "completed" as const } : obl
  );
}

/**
 * Mark alert as read
 */
export function markAlertAsRead(alerts: ComplianceAlert[], alertId: string): ComplianceAlert[] {
  return alerts.map(alert =>
    alert.id === alertId ? { ...alert, read: true } : alert
  );
}

/**
 * Mark todo as completed
 */
export function markTodoCompleted(todoItems: TodoItem[], todoId: string): TodoItem[] {
  return todoItems.map(todo =>
    todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
  );
}

