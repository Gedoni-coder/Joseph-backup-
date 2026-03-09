import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  PieChart,
  Calculator,
  Calendar,
  BarChart3,
} from "lucide-react";
import { type InventoryValuation } from "@/lib/inventory-data";

interface ValuationTrackingProps {
  inventoryValuation: InventoryValuation;
}

export function ValuationTracking({
  inventoryValuation,
}: ValuationTrackingProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getVarianceColor = (variance: number) => {
    if (variance > 0) return "text-green-600";
    if (variance < 0) return "text-red-600";
    return "text-gray-600";
  };

  const getVarianceIcon = (variance: number) => {
    if (variance > 0) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (variance < 0) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <DollarSign className="w-4 h-4 text-gray-600" />;
  };

  const getMethodDescription = (method: string) => {
    switch (method) {
      case "FIFO":
        return "First In, First Out - Uses oldest inventory costs first";
      case "LIFO":
        return "Last In, First Out - Uses newest inventory costs first";
      case "WeightedAverage":
        return "Weighted Average - Uses average cost of all inventory";
      default:
        return method;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const grossMargin =
    inventoryValuation.totalValue > 0
      ? ((inventoryValuation.totalValue - inventoryValuation.costOfGoodsSold) /
          inventoryValuation.totalValue) *
        100
      : 0;

  const turnoverRatio =
    inventoryValuation.totalValue > 0
      ? inventoryValuation.costOfGoodsSold / inventoryValuation.totalValue
      : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Inventory Valuation & Cost Tracking
          </h2>
          <p className="text-gray-600">
            Track inventory costs using FIFO, LIFO, or weighted average methods
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Calculator className="w-4 h-4 mr-2" />
          Recalculate
        </Button>
      </div>

      {/* Valuation Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-8 h-8 text-blue-600" />
              <div>
                <div className="text-sm text-blue-700">
                  Total Inventory Value
                </div>
                <div className="text-2xl font-bold text-blue-900">
                  {formatCurrency(inventoryValuation.totalValue)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-8 h-8 text-green-600" />
              <div>
                <div className="text-sm text-green-700">Cost of Goods Sold</div>
                <div className="text-2xl font-bold text-green-900">
                  {formatCurrency(inventoryValuation.costOfGoodsSold)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <PieChart className="w-8 h-8 text-purple-600" />
              <div>
                <div className="text-sm text-purple-700">Gross Margin</div>
                <div className="text-2xl font-bold text-purple-900">
                  {grossMargin.toFixed(1)}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-8 h-8 text-orange-600" />
              <div>
                <div className="text-sm text-orange-700">Turnover Ratio</div>
                <div className="text-2xl font-bold text-orange-900">
                  {turnoverRatio.toFixed(1)}x
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Valuation Method & Variance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calculator className="w-5 h-5 mr-2 text-blue-600" />
              Valuation Method
            </CardTitle>
            <CardDescription>
              Current inventory costing methodology
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-blue-900">
                  {inventoryValuation.method}
                </h3>
                <Badge className="bg-blue-100 text-blue-800">Active</Badge>
              </div>
              <p className="text-sm text-blue-800">
                {getMethodDescription(inventoryValuation.method)}
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Last Calculation:</span>
                <span className="font-medium">
                  {formatDate(inventoryValuation.lastCalculated)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Calculation Frequency:</span>
                <span className="font-medium">Daily</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Next Calculation:</span>
                <span className="font-medium">
                  {formatDate(
                    new Date(
                      inventoryValuation.lastCalculated.getTime() +
                        24 * 60 * 60 * 1000,
                    ),
                  )}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t">
              <Button variant="outline" className="w-full">
                Switch Method
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              {getVarianceIcon(inventoryValuation.variance)}
              <span className="ml-2">Valuation Variance</span>
            </CardTitle>
            <CardDescription>
              Difference from previous valuation period
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div
                className={`text-4xl font-bold ${getVarianceColor(inventoryValuation.variance)}`}
              >
                {inventoryValuation.variance > 0 ? "+" : ""}
                {inventoryValuation.variance.toFixed(2)}%
              </div>
              <div className="text-sm text-gray-600 mt-2">
                vs. Previous Period
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Variance Impact:</span>
                <span
                  className={`font-medium ${getVarianceColor(inventoryValuation.variance)}`}
                >
                  {formatCurrency(
                    (inventoryValuation.totalValue *
                      inventoryValuation.variance) /
                      100,
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Trend:</span>
                <span className="font-medium">
                  {inventoryValuation.variance > 2
                    ? "Increasing"
                    : inventoryValuation.variance < -2
                      ? "Decreasing"
                      : "Stable"}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t">
              <Button variant="outline" className="w-full">
                <Calendar className="w-4 h-4 mr-2" />
                View History
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <PieChart className="w-5 h-5 mr-2 text-blue-600" />
            Inventory Value Breakdown by Category
          </CardTitle>
          <CardDescription>
            Distribution of inventory value across product categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {inventoryValuation.breakdown.map((category, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="font-medium text-gray-900">
                      {category.category}
                    </span>
                    <Badge variant="outline">
                      {category.quantity.toLocaleString()} units
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">
                      {formatCurrency(category.totalValue)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {category.percentage.toFixed(1)}% of total
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <Progress value={category.percentage} className="h-3" />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>
                      Avg Cost: {formatCurrency(category.averageCost)}
                    </span>
                    <span>
                      Unit Value:{" "}
                      {formatCurrency(category.totalValue / category.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {inventoryValuation.breakdown
                    .reduce((acc, cat) => acc + cat.quantity, 0)
                    .toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Total Units</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(
                    inventoryValuation.breakdown.reduce(
                      (acc, cat) => acc + cat.averageCost,
                      0,
                    ) / inventoryValuation.breakdown.length,
                  )}
                </div>
                <div className="text-sm text-gray-600">Avg Unit Cost</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {inventoryValuation.breakdown.length}
                </div>
                <div className="text-sm text-gray-600">Categories</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Costing Methods Comparison */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardHeader>
          <CardTitle className="text-yellow-900">
            Inventory Costing Methods Comparison
          </CardTitle>
          <CardDescription className="text-yellow-700">
            Understanding different valuation approaches and their impact
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-yellow-900 mb-3">
                FIFO (First In, First Out)
              </h4>
              <ul className="space-y-2 text-sm text-yellow-800">
                <li>• Uses oldest inventory costs first</li>
                <li>• Higher profits in inflationary periods</li>
                <li>• Better reflects current inventory value</li>
                <li>• Most common method used</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-yellow-900 mb-3">
                LIFO (Last In, First Out)
              </h4>
              <ul className="space-y-2 text-sm text-yellow-800">
                <li>• Uses newest inventory costs first</li>
                <li>• Lower profits in inflationary periods</li>
                <li>• Tax advantages in some jurisdictions</li>
                <li>• May not reflect current inventory value</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-yellow-900 mb-3">
                Weighted Average
              </h4>
              <ul className="space-y-2 text-sm text-yellow-800">
                <li>• Uses average cost of all inventory</li>
                <li>• Smooths out price fluctuations</li>
                <li>• Simple to calculate and understand</li>
                <li>• Good for homogeneous products</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
