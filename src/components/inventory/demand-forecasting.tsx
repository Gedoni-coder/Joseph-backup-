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
  TrendingUp,
  TrendingDown,
  Clock,
  AlertTriangle,
  Target,
  Calendar,
  BarChart3,
} from "lucide-react";
import { type DemandForecast } from "@/lib/inventory-data";

interface DemandForecastingProps {
  demandForecasts: DemandForecast[];
}

export function DemandForecasting({ demandForecasts }: DemandForecastingProps) {
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
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

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case "high":
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case "medium":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case "low":
        return <Target className="w-4 h-4 text-green-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-green-600";
    if (confidence >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getDemandTrend = (current: number, predicted: number) => {
    const change = ((predicted - current) / current) * 100;
    return {
      change: change.toFixed(1),
      direction: change > 0 ? "up" : change < 0 ? "down" : "stable",
      icon:
        change > 0 ? (
          <TrendingUp className="w-4 h-4 text-green-600" />
        ) : change < 0 ? (
          <TrendingDown className="w-4 h-4 text-red-600" />
        ) : (
          <Target className="w-4 h-4 text-gray-600" />
        ),
    };
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Demand Forecasting & Reorder Alerts
          </h2>
          <p className="text-gray-600">
            Predict product demand and receive restocking notifications
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <BarChart3 className="w-4 h-4 mr-2" />
          Generate Report
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {demandForecasts.length}
            </div>
            <div className="text-sm text-blue-700">Active Forecasts</div>
          </CardContent>
        </Card>
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {
                demandForecasts.filter(
                  (f) => f.reorderSuggestion.urgency === "high",
                ).length
              }
            </div>
            <div className="text-sm text-red-700">High Priority</div>
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {Math.round(
                demandForecasts.reduce((acc, f) => acc + f.confidence, 0) /
                  demandForecasts.length,
              )}
              %
            </div>
            <div className="text-sm text-green-700">Avg Confidence</div>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {demandForecasts.reduce(
                (acc, f) => acc + f.reorderSuggestion.quantity,
                0,
              )}
            </div>
            <div className="text-sm text-purple-700">Total Reorder Qty</div>
          </CardContent>
        </Card>
      </div>

      {/* Demand Forecasts */}
      <div className="space-y-6">
        {demandForecasts.map((forecast) => {
          const trend = getDemandTrend(
            forecast.currentDemand,
            forecast.predictedDemand,
          );

          return (
            <Card
              key={forecast.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">
                      {forecast.itemName}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {forecast.forecastPeriod} forecast analysis with{" "}
                      <span
                        className={`font-semibold ${getConfidenceColor(forecast.confidence)}`}
                      >
                        {forecast.confidence}% confidence
                      </span>
                    </CardDescription>
                  </div>
                  <Badge
                    className={getUrgencyColor(
                      forecast.reorderSuggestion.urgency,
                    )}
                  >
                    {getUrgencyIcon(forecast.reorderSuggestion.urgency)}
                    <span className="ml-1">
                      {forecast.reorderSuggestion.urgency} priority
                    </span>
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Demand Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">
                      Current Demand
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {forecast.currentDemand.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {forecast.forecastPeriod}
                    </div>
                  </div>

                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-sm text-blue-600 mb-1">
                      Predicted Demand
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      {forecast.predictedDemand.toLocaleString()}
                    </div>
                    <div className="flex items-center justify-center space-x-1 text-sm">
                      {trend.icon}
                      <span
                        className={
                          trend.direction === "up"
                            ? "text-green-600"
                            : trend.direction === "down"
                              ? "text-red-600"
                              : "text-gray-600"
                        }
                      >
                        {trend.direction === "up" ? "+" : ""}
                        {trend.change}%
                      </span>
                    </div>
                  </div>

                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-sm text-green-600 mb-1">
                      Confidence Level
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      {forecast.confidence}%
                    </div>
                    <Progress
                      value={forecast.confidence}
                      className="mt-2 h-2"
                    />
                  </div>
                </div>

                {/* Seasonal and Trend Factors */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">
                      Market Factors
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Seasonal Factor
                        </span>
                        <span className="font-medium">
                          {forecast.seasonalFactor.toFixed(2)}x
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Trend Factor
                        </span>
                        <span className="font-medium">
                          {forecast.trendFactor.toFixed(2)}x
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">
                      Influencing Factors
                    </h4>
                    <div className="space-y-2">
                      {forecast.factors.map((factor, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-700">{factor.name}</span>
                            <div className="flex items-center space-x-2">
                              <span
                                className={
                                  factor.impact > 0
                                    ? "text-green-600"
                                    : factor.impact < 0
                                      ? "text-red-600"
                                      : "text-gray-600"
                                }
                              >
                                {factor.impact > 0 ? "+" : ""}
                                {factor.impact.toFixed(1)}%
                              </span>
                              <span className="text-xs text-gray-500">
                                ({factor.confidence}% conf.)
                              </span>
                            </div>
                          </div>
                          <Progress
                            value={Math.abs(factor.impact) * 2}
                            className="h-1.5"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Reorder Suggestion */}
                <div className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-orange-900 mb-2 flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        Reorder Recommendation
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <div className="text-sm text-orange-700">
                            Suggested Quantity
                          </div>
                          <div className="text-xl font-bold text-orange-900">
                            {forecast.reorderSuggestion.quantity.toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-orange-700">
                            Recommended Timing
                          </div>
                          <div className="font-semibold text-orange-900">
                            {formatDate(forecast.reorderSuggestion.timing)}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-orange-700">
                            Urgency Level
                          </div>
                          <Badge
                            className={getUrgencyColor(
                              forecast.reorderSuggestion.urgency,
                            )}
                          >
                            {forecast.reorderSuggestion.urgency}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Button variant="outline" size="sm">
                        Adjust
                      </Button>
                      <Button
                        size="sm"
                        className="bg-orange-600 hover:bg-orange-700"
                      >
                        Create Order
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Forecasting Tips */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">
            Forecasting Accuracy Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-blue-900 mb-3">
                Improve Accuracy
              </h4>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• Regular data quality audits and cleansing</li>
                <li>• Incorporate external market indicators</li>
                <li>• Monitor and adjust seasonal factors</li>
                <li>• Track promotional impact on demand</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 mb-3">
                Best Practices
              </h4>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• Review forecasts weekly for high-velocity items</li>
                <li>• Use multiple forecasting methods for validation</li>
                <li>• Collaborate with sales teams for insights</li>
                <li>• Document significant forecast variances</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
