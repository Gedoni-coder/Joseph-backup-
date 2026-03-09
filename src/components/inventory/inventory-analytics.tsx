import React, { useState } from "react";
import {
  InventoryItem,
  InventoryAudit,
  TurnoverMetrics,
  DeadStock,
  Location,
} from "../../lib/inventory-data";
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
  BarChart3,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Package,
  DollarSign,
  Calendar,
  Target,
  Activity,
  FileText,
  MapPin,
  Zap,
} from "lucide-react";

interface InventoryAnalyticsProps {
  inventoryItems: InventoryItem[];
  inventoryAudits: InventoryAudit[];
  turnoverMetrics: TurnoverMetrics[];
  deadStock: DeadStock[];
  locations: Location[];
}

export function InventoryAnalytics({
  inventoryItems,
  inventoryAudits,
  turnoverMetrics,
  deadStock,
  locations,
}: InventoryAnalyticsProps) {
  const [selectedMetric, setSelectedMetric] = useState("turnover");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedTimeframe, setSelectedTimeframe] = useState("90d");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getTurnoverColor = (ratio: number) => {
    if (ratio >= 8) return "text-green-600";
    if (ratio >= 4) return "text-blue-600";
    if (ratio >= 2) return "text-yellow-600";
    return "text-red-600";
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 95) return "text-green-600 bg-green-100";
    if (accuracy >= 90) return "text-blue-600 bg-blue-100";
    if (accuracy >= 85) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getAuditStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "scheduled":
        return "bg-yellow-100 text-yellow-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDaysInStock = (item: InventoryItem) => {
    const turnover = turnoverMetrics.find((tm) => tm.itemId === item.id);
    if (!turnover || turnover.turnoverRatio === 0) return "N/A";
    return Math.round(365 / turnover.turnoverRatio);
  };

  const filteredItems = inventoryItems.filter((item) => {
    if (selectedLocation !== "all" && item.location !== selectedLocation)
      return false;
    return true;
  });

  const totalInventoryValue = filteredItems.reduce(
    (sum, item) => sum + item.currentStock * item.unitCost,
    0,
  );
  const avgTurnoverRatio =
    turnoverMetrics.reduce((sum, tm) => sum + tm.turnoverRatio, 0) /
      turnoverMetrics.length || 0;
  const deadStockValue = deadStock.reduce(
    (sum, ds) => sum + ds.currentValue,
    0,
  );
  const completedAudits = inventoryAudits.filter(
    (audit) => audit.status === "completed",
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Inventory Analytics & Reports
          </h2>
          <p className="text-gray-600">
            Comprehensive analysis and performance insights
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Metric" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="turnover">Turnover</SelectItem>
              <SelectItem value="deadstock">Dead Stock</SelectItem>
              <SelectItem value="audits">Audits</SelectItem>
              <SelectItem value="location">Location</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {locations.map((location) => (
                <SelectItem key={location.id} value={location.id}>
                  {location.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button>Generate Report</Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Inventory Value
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(totalInventoryValue)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Avg Turnover Ratio
                </p>
                <p
                  className={`text-2xl font-bold ${getTurnoverColor(avgTurnoverRatio)}`}
                >
                  {avgTurnoverRatio.toFixed(1)}x
                </p>
              </div>
              <Activity className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Dead Stock Value
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(deadStockValue)}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Completed Audits
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {completedAudits}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Turnover Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Turnover Analysis</CardTitle>
          <CardDescription>
            Analyze inventory velocity and identify slow-moving items
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    Item
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900">
                    Category
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">
                    Current Stock
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">
                    Turnover Ratio
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900">
                    Days in Stock
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">
                    Value
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900">
                    Performance
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.slice(0, 10).map((item) => {
                  const turnover = turnoverMetrics.find(
                    (tm) => tm.itemId === item.id,
                  );
                  const daysInStock = getDaysInStock(item);
                  const itemValue = (item.currentStock || 0) * (item.unitCost || 0);

                  return (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">{item.name}</span>
                        </div>
                      </td>
                      <td className="text-center py-3 px-4">
                        <Badge variant="secondary">{item.category}</Badge>
                      </td>
                      <td className="text-right py-3 px-4 font-medium">
                        {(item.currentStock || 0).toLocaleString()} units
                      </td>
                      <td className="text-right py-3 px-4">
                        <span
                          className={`font-medium ${
                            turnover
                              ? getTurnoverColor(turnover.turnoverRatio)
                              : "text-gray-600"
                          }`}
                        >
                          {turnover
                            ? `${turnover.turnoverRatio.toFixed(1)}x`
                            : "N/A"}
                        </span>
                      </td>
                      <td className="text-center py-3 px-4">
                        <span className="font-medium">{daysInStock}</span>
                      </td>
                      <td className="text-right py-3 px-4 font-medium">
                        {formatCurrency(itemValue)}
                      </td>
                      <td className="text-center py-3 px-4">
                        {turnover ? (
                          <div className="flex items-center justify-center">
                            {turnover.turnoverRatio >= 8 ? (
                              <TrendingUp className="h-4 w-4 text-green-600" />
                            ) : turnover.turnoverRatio >= 4 ? (
                              <Activity className="h-4 w-4 text-blue-600" />
                            ) : turnover.turnoverRatio >= 2 ? (
                              <TrendingDown className="h-4 w-4 text-yellow-600" />
                            ) : (
                              <AlertTriangle className="h-4 w-4 text-red-600" />
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Dead Stock Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Dead Stock Identification</CardTitle>
            <CardDescription>
              Items with no movement in the last 90+ days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {deadStock.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <span className="font-medium">{item.itemName}</span>
                    <div className="text-sm text-gray-600">
                      Last movement: {item.daysStagnant} days ago
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-red-600">
                      {formatCurrency(item.currentValue)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {item.quantity} units
                    </div>
                  </div>
                </div>
              ))}

              <div className="pt-4 border-t">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Total Dead Stock Value:</span>
                  <span className="font-bold text-red-600">
                    {formatCurrency(deadStockValue)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm mt-1">
                  <span className="text-gray-600">Percentage of Total:</span>
                  <span className="font-medium">
                    {((deadStockValue / totalInventoryValue) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Audit Summary</CardTitle>
            <CardDescription>
              Recent audit results and accuracy scores
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {inventoryAudits.slice(0, 5).map((audit) => (
                <div
                  key={audit.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <span className="font-medium">{audit.location}</span>
                    <div className="text-sm text-gray-600">
                      {audit.auditDate
                        ? new Date(audit.auditDate).toLocaleDateString()
                        : "N/A"}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      className={getAccuracyColor(audit.accuracy)}
                    >
                      {audit.accuracy.toFixed(1)}%
                    </Badge>
                    <div className="text-sm text-gray-600 mt-1">
                      <Badge className={getAuditStatusColor(audit.status)}>
                        {audit.status.replace("_", " ")}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}

              <div className="pt-4 border-t">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Avg Accuracy:</span>
                  <span className="font-bold">
                    {(
                      inventoryAudits
                        .filter((a) => a.status === "completed")
                        .reduce((sum, a) => sum + a.accuracy, 0) /
                      inventoryAudits.filter((a) => a.status === "completed")
                        .length
                    ).toFixed(1)}
                    %
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Location Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Multi-Location Performance</CardTitle>
          <CardDescription>
            Compare inventory performance across different locations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {locations.map((location) => {
              const locationItems = inventoryItems.filter(
                (item) => item.location === location.id,
              );
              const locationValue = locationItems.reduce(
                (sum, item) => sum + item.currentStock * item.unitCost,
                0,
              );
              const locationTurnover = turnoverMetrics.filter((tm) =>
                locationItems.some((item) => item.id === tm.itemId),
              );
              const avgLocationTurnover =
                locationTurnover.reduce(
                  (sum, tm) => sum + tm.turnoverRatio,
                  0,
                ) / locationTurnover.length || 0;

              return (
                <div key={location.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {location.name}
                      </h4>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        {location.address}
                      </div>
                    </div>
                    <Badge
                      className={
                        location.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      {location.status}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Value:</span>
                      <span className="font-medium">
                        {formatCurrency(locationValue)}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Items Count:</span>
                      <span className="font-medium">
                        {locationItems.length}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Avg Turnover:</span>
                      <span
                        className={`font-medium ${getTurnoverColor(avgLocationTurnover)}`}
                      >
                        {avgLocationTurnover.toFixed(1)}x
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Capacity:</span>
                      <span className="font-medium">
                        {(
                          (location.currentUtilization / location.capacity) *
                          100
                        ).toFixed(0)}
                        %
                      </span>
                    </div>

                    <Progress
                      value={
                        (location.currentUtilization / location.capacity) * 100
                      }
                      className="h-2"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Insights & Recommendations</CardTitle>
          <CardDescription>
            AI-powered insights and actionable recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Key Insights</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">
                      High Velocity Items
                    </p>
                    <p className="text-sm text-gray-600">
                      23% of inventory items have turnover ratio above 8x,
                      generating 67% of revenue
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">
                      Dead Stock Alert
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatCurrency(deadStockValue)} tied up in inventory with
                      no movement in 90+ days
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <BarChart3 className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Audit Accuracy</p>
                    <p className="text-sm text-gray-600">
                      Inventory accuracy improved by 12% over the last quarter
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Recommendations</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <Target className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">
                      Optimize Reorder Points
                    </p>
                    <p className="text-sm text-gray-600">
                      Reduce reorder points for slow-moving items to improve
                      cash flow
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <Zap className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">
                      Implement ABC Analysis
                    </p>
                    <p className="text-sm text-gray-600">
                      Focus inventory management efforts on high-value,
                      fast-moving items
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <Calendar className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">
                      Increase Audit Frequency
                    </p>
                    <p className="text-sm text-gray-600">
                      Schedule monthly cycle counts for high-value items to
                      maintain accuracy
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
