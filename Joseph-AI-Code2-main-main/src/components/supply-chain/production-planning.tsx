import React, { useState } from "react";
import {
  ProductionPlan,
  WarehouseOperation,
  DisruptionRisk,
} from "../../lib/supply-chain-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Factory,
  AlertTriangle,
  Clock,
  CheckCircle,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  Target,
  Zap,
  Users,
  Package,
  Settings,
} from "lucide-react";

interface ProductionPlanningProps {
  productionPlans: ProductionPlan[];
  warehouseOperations: WarehouseOperation[];
  disruptionRisks: DisruptionRisk[];
}

export function ProductionPlanning({
  productionPlans,
  warehouseOperations,
  disruptionRisks,
}: ProductionPlanningProps) {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState("all");

  const filteredPlans = productionPlans.filter((plan) => {
    if (selectedStatus !== "all" && plan.status !== selectedStatus)
      return false;
    if (selectedProduct !== "all" && plan.productionLine !== selectedProduct)
      return false;
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "planned":
        return "bg-blue-100 text-blue-800";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "delayed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "planned":
        return <Calendar className="h-4 w-4" />;
      case "in_progress":
        return <Clock className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "delayed":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Factory className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return "text-green-600";
    if (efficiency >= 80) return "text-yellow-600";
    return "text-red-600";
  };

  const calculateProgress = (plan: ProductionPlan) => {
    const total = plan.plannedQuantity;
    const produced = plan.actualQuantity || 0;
    return Math.min(100, (produced / total) * 100);
  };

  const getBottlenecks = () => {
    return productionPlans
      .filter((plan) => plan.efficiency < 80)
      .sort((a, b) => a.efficiency - b.efficiency);
  };

  const totalPlannedQuantity = filteredPlans.reduce(
    (sum, plan) => sum + plan.plannedQuantity,
    0,
  );
  const totalActualQuantity = filteredPlans.reduce(
    (sum, plan) => sum + (plan.actualQuantity || 0),
    0,
  );
  const avgEfficiency =
    filteredPlans.reduce((sum, plan) => sum + plan.efficiency, 0) /
      filteredPlans.length || 0;
  const completedPlans = filteredPlans.filter(
    (plan) => plan.status === "completed",
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Production Planning & Optimization
          </h2>
          <p className="text-gray-600">
            Monitor production schedules and identify bottlenecks
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="planned">Planned</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="delayed">Delayed</SelectItem>
            </SelectContent>
          </Select>
          <Button>New Plan</Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Active Plans
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {filteredPlans.length}
                </p>
              </div>
              <Factory className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Avg Efficiency
                </p>
                <p
                  className={`text-2xl font-bold ${getEfficiencyColor(avgEfficiency)}`}
                >
                  {avgEfficiency.toFixed(1)}%
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Production Rate
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {(
                    (totalActualQuantity / totalPlannedQuantity) * 100 || 0
                  ).toFixed(1)}
                  %
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Completed Plans
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {completedPlans}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Production Plans Table */}
      <Card>
        <CardHeader>
          <CardTitle>Production Plans</CardTitle>
          <CardDescription>
            Current production schedules and progress tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    Plan ID
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    Production Line
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">
                    Planned Qty
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">
                    Actual Qty
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900">
                    Progress
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900">
                    Efficiency
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900">
                    Status
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900">
                    Priority
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900">
                    Schedule
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPlans.map((plan) => {
                  const progress = calculateProgress(plan);

                  return (
                    <tr key={plan.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(plan.status)}
                          <span className="font-medium">{plan.id}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium">
                          {plan.productionLine}
                        </span>
                      </td>
                      <td className="text-right py-3 px-4 font-medium">
                        {plan.plannedQuantity.toLocaleString()}
                      </td>
                      <td className="text-right py-3 px-4 font-medium">
                        {(plan.actualQuantity || 0).toLocaleString()}
                      </td>
                      <td className="text-center py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-16">
                            <Progress value={progress} className="h-2" />
                          </div>
                          <span className="text-sm font-medium">
                            {progress.toFixed(0)}%
                          </span>
                        </div>
                      </td>
                      <td className="text-center py-3 px-4">
                        <span
                          className={`font-medium ${getEfficiencyColor(plan.efficiency)}`}
                        >
                          {plan.efficiency}%
                        </span>
                      </td>
                      <td className="text-center py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                          {getStatusIcon(plan.status)}
                          <Badge className={getStatusColor(plan.status)}>
                            {plan.status.replace("_", " ")}
                          </Badge>
                        </div>
                      </td>
                      <td className="text-center py-3 px-4">
                        <Badge className={getPriorityColor(plan.priority)}>
                          {plan.priority}
                        </Badge>
                      </td>
                      <td className="text-center py-3 px-4">
                        <div className="text-sm">
                          <div className="font-medium">
                            {plan.startDate
                              ? new Date(plan.startDate).toLocaleDateString()
                              : "N/A"}
                          </div>
                          <div className="text-gray-600">
                            to{" "}
                            {plan.endDate
                              ? new Date(plan.endDate).toLocaleDateString()
                              : "N/A"}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Bottleneck Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Production Bottlenecks</CardTitle>
            <CardDescription>
              Production lines with efficiency below 80%
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getBottlenecks()
                .slice(0, 5)
                .map((plan) => (
                  <div
                    key={plan.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <span className="font-medium">{plan.productionLine}</span>
                      <div className="text-sm text-gray-600">
                        Plan ID: {plan.id}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-red-600 font-bold">
                        {plan.efficiency}%
                      </div>
                      <div className="flex items-center gap-1">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span className="text-xs text-red-600">Bottleneck</span>
                      </div>
                    </div>
                  </div>
                ))}
              {getBottlenecks().length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
                  <p>No production bottlenecks detected</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Production Metrics</CardTitle>
            <CardDescription>Key performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  Overall Equipment Effectiveness (OEE)
                </span>
                <div className="flex items-center gap-2">
                  <Progress value={88} className="w-16 h-2" />
                  <span className="text-sm font-bold text-green-600">88%</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Quality Rate</span>
                <div className="flex items-center gap-2">
                  <Progress value={95} className="w-16 h-2" />
                  <span className="text-sm font-bold text-green-600">95%</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Availability Rate</span>
                <div className="flex items-center gap-2">
                  <Progress value={92} className="w-16 h-2" />
                  <span className="text-sm font-bold text-blue-600">92%</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Performance Rate</span>
                <div className="flex items-center gap-2">
                  <Progress value={85} className="w-16 h-2" />
                  <span className="text-sm font-bold text-yellow-600">85%</span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium text-gray-900 mb-3">
                  Optimization Recommendations
                </h4>
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">
                    • Increase maintenance frequency on Line B
                  </div>
                  <div className="text-sm text-gray-600">
                    • Optimize material flow between stations
                  </div>
                  <div className="text-sm text-gray-600">
                    • Implement predictive maintenance system
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Warehouse Operations */}
      <Card>
        <CardHeader>
          <CardTitle>Warehouse Operations</CardTitle>
          <CardDescription>
            Current warehouse activities and optimization metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {warehouseOperations.slice(0, 3).map((operation) => (
              <div key={operation.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {operation.warehouseName}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Warehouse Operations
                    </p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    Active
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Storage Utilization:</span>
                    <span
                      className={`font-medium ${getEfficiencyColor(operation.efficiency.storageUtilization)}`}
                    >
                      {operation.efficiency.storageUtilization}%
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Area:</span>
                    <span className="font-medium">
                      {operation.layout.totalArea.toLocaleString()} sq ft
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Staff:</span>
                    <span className="font-medium">
                      {operation.staffing.totalStaff} employees
                    </span>
                  </div>

                  <div>
                    <Progress value={operation.efficiency.storageUtilization} className="h-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
