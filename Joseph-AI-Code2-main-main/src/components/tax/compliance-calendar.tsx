import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  FileText,
  Bell,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Zap,
  Filter,
} from "lucide-react";

interface ComplianceObligation {
  id: string;
  name: string;
  description: string;
  dueDate: Date;
  frequency: "monthly" | "quarterly" | "annually" | "event-based";
  agency: string;
  jurisdiction: string;
  consequence: "low" | "medium" | "high" | "critical";
  consequence_detail: string;
  status: "completed" | "pending" | "at-risk" | "overdue";
  assignedTo: string;
  dependencies: string[];
  documentationRequired: string[];
  priority: "low" | "medium" | "high" | "critical";
}

interface DependencyAlert {
  obligationId: string;
  missingDependencies: string[];
  riskLevel: "low" | "medium" | "high" | "critical";
}

interface Alert {
  id: string;
  obligationId: string;
  type: "early-warning" | "upcoming" | "urgent" | "dependency" | "overdue";
  message: string;
  daysUntilDue: number;
  role: string;
  read: boolean;
  createdAt: Date;
}

interface TodoItem {
  id: string;
  task: string;
  description: string;
  completed: boolean;
  obligationId: string;
  obligationName: string;
  priority: "low" | "medium" | "high" | "critical";
  dueDate: Date;
}

export function ComplianceCalendar() {
  const [obligations, setObligations] = useState<ComplianceObligation[]>([
    {
      id: "vat-001",
      name: "VAT Return Filing",
      description: "Monthly VAT return and payment submission",
      dueDate: new Date(2025, 0, 15),
      frequency: "monthly",
      agency: "Tax Authority",
      jurisdiction: "National",
      consequence: "high",
      consequence_detail:
        "Interest accrual, penalties up to 10% of unpaid amount",
      status: "pending",
      assignedTo: "Finance Manager",
      dependencies: ["invoice-reconciliation", "bank-reconciliation"],
      documentationRequired: [
        "Sales Invoices",
        "Purchase Invoices",
        "Bank Statements",
      ],
      priority: "high",
    },
    {
      id: "paye-001",
      name: "PAYE / Payroll Remittance",
      description: "Monthly employee tax and social contribution withholdings",
      dueDate: new Date(2025, 0, 10),
      frequency: "monthly",
      agency: "Labor Authority",
      jurisdiction: "National",
      consequence: "critical",
      consequence_detail:
        "Personal liability of officers, criminal penalties, employee claims",
      status: "pending",
      assignedTo: "HR Manager",
      dependencies: ["payroll-processing", "employee-verification"],
      documentationRequired: [
        "Payroll Register",
        "Employee Information",
        "Deduction Records",
      ],
      priority: "critical",
    },
    {
      id: "corporate-tax-001",
      name: "Corporate Income Tax Filing",
      description: "Annual corporate income tax return",
      dueDate: new Date(2025, 3, 30),
      frequency: "annually",
      agency: "Revenue Authority",
      jurisdiction: "National",
      consequence: "high",
      consequence_detail: "Audit triggers, penalties, interest on late payment",
      status: "pending",
      assignedTo: "Chief Financial Officer",
      dependencies: [
        "financial-statements",
        "balance-sheet",
        "income-statement",
      ],
      documentationRequired: [
        "Audited Financial Statements",
        "Supporting Schedules",
        "Asset Register",
      ],
      priority: "high",
    },
    {
      id: "withholding-001",
      name: "Withholding Tax Filing",
      description: "Quarterly withholding tax on contractor payments",
      dueDate: new Date(2025, 0, 20),
      frequency: "quarterly",
      agency: "Tax Authority",
      jurisdiction: "National",
      consequence: "medium",
      consequence_detail: "Interest charges, administrative penalties",
      status: "at-risk",
      assignedTo: "Finance Manager",
      dependencies: ["invoice-processing", "contractor-verification"],
      documentationRequired: ["Contractor Invoices", "Payment Records"],
      priority: "medium",
    },
    {
      id: "license-renewal-001",
      name: "Business License Renewal",
      description: "Annual business operating license renewal",
      dueDate: new Date(2025, 5, 30),
      frequency: "annually",
      agency: "Business Registration Authority",
      jurisdiction: "Local",
      consequence: "high",
      consequence_detail: "Suspension of business operations, legal penalties",
      status: "pending",
      assignedTo: "Legal Compliance Officer",
      dependencies: [],
      documentationRequired: [
        "Previous License",
        "Identity Verification",
        "Address Proof",
      ],
      priority: "high",
    },
    {
      id: "audit-001",
      name: "Annual Audit Submission",
      description: "Auditor report and financial audit submission",
      dueDate: new Date(2025, 4, 31),
      frequency: "annually",
      agency: "Regulatory Authority",
      jurisdiction: "National",
      consequence: "medium",
      consequence_detail:
        "Regulatory scrutiny, compliance certification delays",
      status: "overdue",
      assignedTo: "Chief Financial Officer",
      dependencies: ["financial-statements", "internal-controls"],
      documentationRequired: [
        "Audit Report",
        "Management Letter",
        "Financial Statements",
      ],
      priority: "critical",
    },
  ]);

  const [selectedObligation, setSelectedObligation] =
    useState<ComplianceObligation | null>(null);
  const [filter, setFilter] = useState<
    "all" | "pending" | "at-risk" | "overdue"
  >("all");
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: "alert-1",
      obligationId: "vat-001",
      type: "dependency",
      message: "Invoice reconciliation not completed. VAT filing at risk.",
      daysUntilDue: 3,
      role: "Finance Manager",
      read: false,
      createdAt: new Date(),
    },
    {
      id: "alert-2",
      obligationId: "paye-001",
      type: "upcoming",
      message: "PAYE remittance due in 5 days",
      daysUntilDue: 5,
      role: "HR Manager",
      read: false,
      createdAt: new Date(),
    },
    {
      id: "alert-3",
      obligationId: "audit-001",
      type: "overdue",
      message: "Annual audit submission is 10 days overdue",
      daysUntilDue: -10,
      role: "Chief Financial Officer",
      read: false,
      createdAt: new Date(),
    },
  ]);

  const [todoItems, setTodoItems] = useState<TodoItem[]>([
    {
      id: "todo-1",
      task: "Invoice Reconciliation",
      description: "Reconcile all sales and purchase invoices for the month",
      completed: false,
      obligationId: "vat-001",
      obligationName: "VAT Return Filing",
      priority: "high",
      dueDate: new Date(2025, 0, 10),
    },
    {
      id: "todo-2",
      task: "Bank Reconciliation",
      description: "Reconcile bank statements with general ledger",
      completed: false,
      obligationId: "vat-001",
      obligationName: "VAT Return Filing",
      priority: "high",
      dueDate: new Date(2025, 0, 10),
    },
    {
      id: "todo-3",
      task: "Payroll Processing",
      description: "Process monthly payroll and calculate withholdings",
      completed: false,
      obligationId: "paye-001",
      obligationName: "PAYE / Payroll Remittance",
      priority: "critical",
      dueDate: new Date(2025, 0, 8),
    },
    {
      id: "todo-4",
      task: "Employee Verification",
      description: "Verify employee information and deduction records",
      completed: true,
      obligationId: "paye-001",
      obligationName: "PAYE / Payroll Remittance",
      priority: "critical",
      dueDate: new Date(2025, 0, 5),
    },
    {
      id: "todo-5",
      task: "Financial Statements Preparation",
      description: "Prepare audited financial statements and supporting schedules",
      completed: false,
      obligationId: "corporate-tax-001",
      obligationName: "Corporate Income Tax Filing",
      priority: "high",
      dueDate: new Date(2025, 3, 20),
    },
    {
      id: "todo-6",
      task: "Balance Sheet Review",
      description: "Review and finalize balance sheet with audit adjustments",
      completed: false,
      obligationId: "corporate-tax-001",
      obligationName: "Corporate Income Tax Filing",
      priority: "high",
      dueDate: new Date(2025, 3, 20),
    },
    {
      id: "todo-7",
      task: "Contractor Invoice Processing",
      description: "Process and verify all contractor invoices",
      completed: false,
      obligationId: "withholding-001",
      obligationName: "Withholding Tax Filing",
      priority: "medium",
      dueDate: new Date(2025, 0, 15),
    },
    {
      id: "todo-8",
      task: "Audit Report Collection",
      description: "Obtain final audit report and management letter",
      completed: false,
      obligationId: "audit-001",
      obligationName: "Annual Audit Submission",
      priority: "critical",
      dueDate: new Date(2025, 4, 15),
    },
  ]);

  const filteredObligations = obligations.filter((obl) => {
    if (filter === "all") return true;
    return obl.status === filter;
  });

  const dependencyAlerts: DependencyAlert[] = obligations
    .filter((obl) => obl.status === "at-risk" && obl.dependencies.length > 0)
    .map((obl) => ({
      obligationId: obl.id,
      missingDependencies: obl.dependencies,
      riskLevel: obl.consequence as any,
    }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "at-risk":
        return "bg-orange-100 text-orange-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getConsequenceIcon = (consequence: string) => {
    switch (consequence) {
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "high":
        return <AlertCircle className="h-4 w-4 text-orange-600" />;
      case "medium":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <CheckCircle className="h-4 w-4 text-green-600" />;
    }
  };

  const unreadAlertCount = alerts.filter((a) => !a.read).length;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-600 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-sm text-orange-700">At Risk</div>
                <div className="text-lg font-bold text-orange-900">
                  {obligations.filter((o) => o.status === "at-risk").length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-600 rounded-lg">
                <AlertCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-sm text-red-700">Overdue</div>
                <div className="text-lg font-bold text-red-900">
                  {obligations.filter((o) => o.status === "overdue").length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Bell className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-sm text-blue-700">Active Alerts</div>
                <div className="text-lg font-bold text-blue-900">
                  {unreadAlertCount}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-600 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-sm text-green-700">Completed</div>
                <div className="text-lg font-bold text-green-900">
                  {obligations.filter((o) => o.status === "completed").length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="calendar" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Obligations Calendar</span>
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">
              Alerts ({unreadAlertCount})
            </span>
          </TabsTrigger>
          <TabsTrigger value="todo" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span className="hidden sm:inline">To-Do List</span>
          </TabsTrigger>
          <TabsTrigger value="dependencies" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            <span className="hidden sm:inline">Dependencies</span>
          </TabsTrigger>
          <TabsTrigger value="timeline" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Timeline</span>
          </TabsTrigger>
        </TabsList>

        {/* Obligations Calendar Tab */}
        <TabsContent value="calendar" className="space-y-4">
          <Card className="border-blue-200">
            <CardHeader className="bg-blue-50">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-blue-900">
                  <Calendar className="h-5 w-5" />
                  Compliance Obligations Calendar
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-600" />
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as any)}
                    className="px-3 py-1 rounded border border-blue-200 bg-white text-sm"
                  >
                    <option value="all">All Obligations</option>
                    <option value="pending">Pending</option>
                    <option value="at-risk">At Risk</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {filteredObligations.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
                    <p className="text-gray-600">
                      No obligations in this category
                    </p>
                  </div>
                ) : (
                  filteredObligations.map((obl) => (
                    <div
                      key={obl.id}
                      onClick={() => setSelectedObligation(obl)}
                      className="p-4 border border-blue-100 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900">
                              {obl.name}
                            </h4>
                            <Badge
                              className={`text-xs ${getStatusColor(obl.status)}`}
                            >
                              {obl.status}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="text-xs bg-white"
                            >
                              {obl.frequency}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            {obl.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          {getConsequenceIcon(obl.consequence)}
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                        <div>
                          <span className="text-gray-600">Due Date:</span>
                          <div className="font-medium">
                            {obl.dueDate.toLocaleDateString()}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-600">Agency:</span>
                          <div className="font-medium">{obl.agency}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Assigned To:</span>
                          <div className="font-medium text-blue-600">
                            {obl.assignedTo}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-600">Consequence:</span>
                          <div
                            className={`font-medium capitalize text-${obl.consequence}-600`}
                          >
                            {obl.consequence}
                          </div>
                        </div>
                      </div>

                      {obl.dependencies.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-blue-100">
                          <p className="text-xs text-gray-600 mb-2">
                            Prerequisites required:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {obl.dependencies.map((dep) => (
                              <Badge
                                key={dep}
                                variant="secondary"
                                className="text-xs"
                              >
                                {dep}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Detailed View */}
          {selectedObligation && (
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-blue-900">
                    {selectedObligation.name} - Details
                  </CardTitle>
                  <button
                    onClick={() => setSelectedObligation(null)}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    ✕
                  </button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-2">
                      Obligation Details
                    </h4>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="text-gray-600">Status:</span>
                        <Badge
                          className={`ml-2 ${getStatusColor(selectedObligation.status)}`}
                        >
                          {selectedObligation.status}
                        </Badge>
                      </p>
                      <p>
                        <span className="text-gray-600">Due Date:</span>
                        <span className="ml-2 font-medium">
                          {selectedObligation.dueDate.toLocaleDateString()}
                        </span>
                      </p>
                      <p>
                        <span className="text-gray-600">Frequency:</span>
                        <span className="ml-2 font-medium capitalize">
                          {selectedObligation.frequency}
                        </span>
                      </p>
                      <p>
                        <span className="text-gray-600">Assigned To:</span>
                        <span className="ml-2 font-medium text-blue-600">
                          {selectedObligation.assignedTo}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-blue-900 mb-2">
                      Regulatory Impact
                    </h4>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="text-gray-600">
                          Regulatory Agency:
                        </span>
                        <span className="ml-2 font-medium">
                          {selectedObligation.agency}
                        </span>
                      </p>
                      <p>
                        <span className="text-gray-600">Jurisdiction:</span>
                        <span className="ml-2 font-medium">
                          {selectedObligation.jurisdiction}
                        </span>
                      </p>
                      <p>
                        <span className="text-gray-600">
                          Non-Compliance Risk:
                        </span>
                        <span
                          className={`ml-2 font-medium capitalize text-${selectedObligation.consequence}-600`}
                        >
                          {selectedObligation.consequence}
                        </span>
                      </p>
                      <p className="text-xs text-gray-700 mt-2 italic">
                        {selectedObligation.consequence_detail}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">
                    Required Documentation
                  </h4>
                  <ul className="space-y-1 text-sm">
                    {selectedObligation.documentationRequired.map(
                      (doc, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          {doc}
                        </li>
                      ),
                    )}
                  </ul>
                </div>

                {selectedObligation.dependencies.length > 0 && (
                  <div className="pt-4 border-t border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2">
                      Prerequisites
                    </h4>
                    <div className="space-y-2">
                      {selectedObligation.dependencies.map((dep) => (
                        <div
                          key={dep}
                          className="flex items-center gap-2 text-sm"
                        >
                          <Clock className="h-4 w-4 text-yellow-600" />
                          <span>{dep}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Mark as Completed
                  </Button>
                  <Button variant="outline" className="border-blue-200">
                    Reschedule
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts" className="space-y-4">
          <Card className="border-blue-200">
            <CardHeader className="bg-blue-50">
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <Bell className="h-5 w-5" />
                Role-Based Alerts & Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {alerts.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto mb-2" />
                    <p className="text-gray-600">No active alerts</p>
                  </div>
                ) : (
                  alerts.map((alert) => {
                    const obligation = obligations.find(
                      (o) => o.id === alert.obligationId,
                    );
                    return (
                      <div
                        key={alert.id}
                        className={`p-4 border rounded-lg ${alert.read ? "bg-gray-50 border-gray-200" : "bg-orange-50 border-orange-200"}`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="p-2 rounded-lg bg-orange-100 mt-0.5">
                              <Bell className="h-4 w-4 text-orange-600" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">
                                {obligation?.name}
                              </h4>
                              <p className="text-sm text-gray-700 mt-1">
                                {alert.message}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className="text-xs">
                                  {alert.role}
                                </Badge>
                                <span className="text-xs text-gray-600">
                                  {alert.type.replace("-", " ")}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setAlerts(
                                alerts.map((a) =>
                                  a.id === alert.id ? { ...a, read: true } : a,
                                ),
                              );
                            }}
                          >
                            {alert.read ? "Read" : "Mark Read"}
                          </Button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* To-Do List Tab */}
        <TabsContent value="todo" className="space-y-4">
          <Card className="border-blue-200">
            <CardHeader className="bg-blue-50">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-blue-900">
                  <CheckCircle className="h-5 w-5" />
                  Compliance To-Do List
                </CardTitle>
                <div className="text-sm text-gray-600">
                  {todoItems.filter((t) => t.completed).length} of{" "}
                  {todoItems.length} completed
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {todoItems.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
                    <p className="text-gray-600">All tasks completed!</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {todoItems.map((item) => (
                      <div
                        key={item.id}
                        className={`p-4 border rounded-lg transition-all ${
                          item.completed
                            ? "bg-green-50 border-green-200"
                            : "bg-white border-gray-200 hover:border-blue-200"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() =>
                              setTodoItems(
                                todoItems.map((t) =>
                                  t.id === item.id
                                    ? { ...t, completed: !t.completed }
                                    : t,
                                ),
                              )
                            }
                            className="flex-shrink-0 mt-1"
                          >
                            {item.completed ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : (
                              <div className="h-5 w-5 border-2 border-gray-300 rounded-full" />
                            )}
                          </button>
                          <div className="flex-1 min-w-0">
                            <div
                              className={`font-medium ${
                                item.completed
                                  ? "text-gray-500 line-through"
                                  : "text-gray-900"
                              }`}
                            >
                              {item.task}
                            </div>
                            <p
                              className={`text-sm ${
                                item.completed
                                  ? "text-gray-400"
                                  : "text-gray-600"
                              }`}
                            >
                              {item.description}
                            </p>
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                              <Badge
                                variant="outline"
                                className="text-xs bg-white"
                              >
                                {item.obligationName}
                              </Badge>
                              <Badge
                                className={`text-xs ${
                                  item.priority === "critical"
                                    ? "bg-red-100 text-red-800"
                                    : item.priority === "high"
                                      ? "bg-orange-100 text-orange-800"
                                      : item.priority === "medium"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-green-100 text-green-800"
                                }`}
                              >
                                {item.priority}
                              </Badge>
                              <span className="text-xs text-gray-600">
                                Due:{" "}
                                {item.dueDate.toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Dependencies Tab */}
        <TabsContent value="dependencies" className="space-y-4">
          <Card className="border-blue-200">
            <CardHeader className="bg-blue-50">
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <Zap className="h-5 w-5" />
                Dependency Awareness
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {dependencyAlerts.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
                  <p className="text-gray-600">
                    All prerequisites are on track
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {dependencyAlerts.map((alert) => {
                    const obligation = obligations.find(
                      (o) => o.id === alert.obligationId,
                    );
                    return (
                      <div
                        key={alert.obligationId}
                        className="p-4 border border-orange-200 bg-orange-50 rounded-lg"
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <AlertTriangle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <h4 className="font-semibold text-orange-900">
                              {obligation?.name}
                            </h4>
                            <p className="text-sm text-orange-800 mt-1">
                              Cannot proceed: prerequisite tasks not completed
                            </p>
                          </div>
                          <Badge
                            className={`text-xs ${alert.riskLevel === "critical" ? "bg-red-100 text-red-800" : "bg-orange-100 text-orange-800"}`}
                          >
                            {alert.riskLevel} risk
                          </Badge>
                        </div>

                        <div className="ml-8">
                          <p className="text-sm text-gray-700 mb-2">
                            Missing prerequisites:
                          </p>
                          <ul className="space-y-2">
                            {alert.missingDependencies.map((dep) => (
                              <li
                                key={dep}
                                className="flex items-center gap-2 text-sm"
                              >
                                <AlertCircle className="h-4 w-4 text-red-500" />
                                <span className="text-gray-700">{dep}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-3 border-orange-300 text-orange-700 hover:bg-orange-100"
                        >
                          Review & Escalate
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline" className="space-y-4">
          <Card className="border-blue-200">
            <CardHeader className="bg-blue-50">
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <Calendar className="h-5 w-5" />
                Compliance Timeline - Next 90 Days
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {[...obligations]
                  .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
                  .slice(0, 10)
                  .map((obl, idx) => (
                    <div key={obl.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                          {idx + 1}
                        </div>
                        {idx < 9 && (
                          <div className="w-0.5 h-12 bg-blue-200 my-1" />
                        )}
                      </div>
                      <div className="pb-4">
                        <div className="font-semibold text-gray-900">
                          {obl.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          Due: {obl.dueDate.toLocaleDateString()}
                        </div>
                        <div className="flex gap-2 mt-1">
                          <Badge
                            className={`text-xs ${getStatusColor(obl.status)}`}
                          >
                            {obl.status}
                          </Badge>
                          {obl.dependencies.length > 0 && (
                            <Badge variant="outline" className="text-xs">
                              {obl.dependencies.length} prerequisites
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
