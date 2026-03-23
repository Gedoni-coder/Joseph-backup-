import React, { useState, useMemo } from "react";
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
import type { ComplianceObligation } from "@/lib/tax-compliance-data";

interface DependencyAlert {
  obligationId: number;
  missingDependencies: string[];
  riskLevel: "low" | "medium" | "high" | "critical";
}

interface Alert {
  id: string;
  obligationId: number;
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
  obligationId: number;
  obligationName: string;
  priority: "low" | "medium" | "high" | "critical";
  dueDate: string | null;
}

interface ComplianceCalendarProps {
  obligations: ComplianceObligation[];
}

export function ComplianceCalendar({ obligations }: ComplianceCalendarProps) {
  const [selectedObligation, setSelectedObligation] =
    useState<ComplianceObligation | null>(null);
  const [filter, setFilter] = useState<
    "all" | "pending" | "at_risk" | "overdue"
  >("all");

  // Derive alerts from obligations
  const alerts = useMemo<Alert[]>(() => {
    const now = new Date();
    return obligations
      .filter((o) => o.status !== "completed")
      .map((o) => {
        const due = o.dueDate ? new Date(o.dueDate) : now;
        const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        let alertType: Alert["type"] = "upcoming";
        if (diffDays < 0) alertType = "overdue";
        else if (diffDays <= 3) alertType = "urgent";
        else if (diffDays <= 7) alertType = "upcoming";
        else alertType = "early-warning";
        if (o.status === "at_risk" && (o.dependencies ?? []).length > 0) alertType = "dependency";
        return {
          id: `alert-${o.id}`,
          obligationId: o.id,
          type: alertType,
          message: diffDays < 0
            ? `${o.name} is ${Math.abs(diffDays)} days overdue`
            : `${o.name} due in ${diffDays} days`,
          daysUntilDue: diffDays,
          role: o.assignedTo || "Unassigned",
          read: false,
          createdAt: now,
        } as Alert;
      });
  }, [obligations]);

  // Derive todo items from obligations' documentation requirements
  const [todoCompleted, setTodoCompleted] = useState<Set<string>>(new Set());
  const todoItems = useMemo<TodoItem[]>(() => {
    return obligations.flatMap((o) =>
      (o.documentationRequired ?? []).map((doc, i) => ({
        id: `todo-${o.id}-${i}`,
        task: doc,
        description: `Prepare ${doc} for ${o.name}`,
        completed: todoCompleted.has(`todo-${o.id}-${i}`),
        obligationId: o.id,
        obligationName: o.name,
        priority: o.priority,
        dueDate: o.dueDate,
      })),
    );
  }, [obligations, todoCompleted]);

  const filteredObligations = obligations.filter((obl) => {
    if (filter === "all") return true;
    return obl.status === filter;
  });

  const dependencyAlerts: DependencyAlert[] = obligations
    .filter((obl) => obl.status === "at_risk" && (obl.dependencies ?? []).length > 0)
    .map((obl) => ({
      obligationId: obl.id,
      missingDependencies: obl.dependencies ?? [],
      riskLevel: obl.consequence as any,
    }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "at_risk":
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
                  {obligations.filter((o) => o.status === "at_risk").length}
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
                    <option value="at_risk">At Risk</option>
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
                            {obl.dueDate ? new Date(obl.dueDate).toLocaleDateString() : "N/A"}
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

                      {(obl.dependencies ?? []).length > 0 && (
                        <div className="mt-3 pt-3 border-t border-blue-100">
                          <p className="text-xs text-gray-600 mb-2">
                            Prerequisites required:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {(obl.dependencies ?? []).map((dep) => (
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
                          {selectedObligation.dueDate ? new Date(selectedObligation.dueDate).toLocaleDateString() : "N/A"}
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
                        {selectedObligation.consequenceDetail}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">
                    Required Documentation
                  </h4>
                  <ul className="space-y-1 text-sm">
                    {(selectedObligation.documentationRequired ?? []).map(
                      (doc, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          {doc}
                        </li>
                      ),
                    )}
                  </ul>
                </div>

                {(selectedObligation.dependencies ?? []).length > 0 && (
                  <div className="pt-4 border-t border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2">
                      Prerequisites
                    </h4>
                    <div className="space-y-2">
                      {(selectedObligation.dependencies ?? []).map((dep) => (
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
                            disabled
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
                              setTodoCompleted((prev) => {
                                const next = new Set(prev);
                                if (next.has(item.id)) next.delete(item.id);
                                else next.add(item.id);
                                return next;
                              })
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
                                {item.dueDate
                                  ? new Date(item.dueDate).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                    })
                                  : "N/A"}
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
                  .sort((a, b) => new Date(a.dueDate || "").getTime() - new Date(b.dueDate || "").getTime())
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
                          Due: {obl.dueDate ? new Date(obl.dueDate).toLocaleDateString() : "N/A"}
                        </div>
                        <div className="flex gap-2 mt-1">
                          <Badge
                            className={`text-xs ${getStatusColor(obl.status)}`}
                          >
                            {obl.status}
                          </Badge>
                          {(obl.dependencies ?? []).length > 0 && (
                            <Badge variant="outline" className="text-xs">
                              {(obl.dependencies ?? []).length} prerequisites
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
