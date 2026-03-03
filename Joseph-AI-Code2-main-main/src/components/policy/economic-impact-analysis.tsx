import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  DollarSign,
  Globe,
  Building2,
  BarChart3,
  AlertTriangle,
  RefreshCw,
  LineChart,
} from "lucide-react";
import { EconomicIndicator } from "../../lib/policy-economic-data";

interface EconomicImpactAnalysisProps {
  economicIndicators: EconomicIndicator[];
  onRefreshData: () => void;
  isLoading?: boolean;
}

export function EconomicImpactAnalysis({
  economicIndicators,
  onRefreshData,
  isLoading = false,
}: EconomicImpactAnalysisProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [impactFilter, setImpactFilter] = useState<string>("all");

  const filteredIndicators = economicIndicators.filter((indicator) => {
    const matchesSearch = indicator.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || indicator.category === categoryFilter;
    const matchesImpact =
      impactFilter === "all" || indicator.impact === impactFilter;

    return matchesSearch && matchesCategory && matchesImpact;
  });

  const getTrendIcon = (trend: EconomicIndicator["trend"]) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      case "stable":
        return <Minus className="h-4 w-4 text-gray-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: EconomicIndicator["trend"]) => {
    switch (trend) {
      case "up":
        return "text-green-600";
      case "down":
        return "text-red-600";
      case "stable":
        return "text-gray-600";
      default:
        return "text-gray-600";
    }
  };

  const getImpactColor = (impact: EconomicIndicator["impact"]) => {
    switch (impact) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getCategoryIcon = (category: EconomicIndicator["category"]) => {
    switch (category) {
      case "macro":
        return <Globe className="h-4 w-4" />;
      case "market":
        return <BarChart3 className="h-4 w-4" />;
      case "industry":
        return <Building2 className="h-4 w-4" />;
      case "financial":
        return <DollarSign className="h-4 w-4" />;
      default:
        return <BarChart3 className="h-4 w-4" />;
    }
  };

  const handleViewForecast = (indicator: EconomicIndicator) => {
    const forecast = indicator.forecast
      .map(
        (f) =>
          `${f.period}: ${f.value}${indicator.unit} (${f.confidence}% confidence)`,
      )
      .join("\n");

    alert(
      `Economic Indicator Forecast: ${indicator.name}\n\nCurrent Value: ${indicator.value}${indicator.unit}\nPrevious Value: ${indicator.previousValue}${indicator.unit}\nChange: ${indicator.changePercent > 0 ? "+" : ""}${indicator.changePercent.toFixed(2)}%\n\nForecast:\n${forecast}\n\nLast Updated: ${new Date(indicator.lastUpdated).toLocaleString()}`,
    );
  };

  const macroIndicators = economicIndicators.filter(
    (i) => i.category === "macro",
  );
  const marketIndicators = economicIndicators.filter(
    (i) => i.category === "market",
  );
  const industryIndicators = economicIndicators.filter(
    (i) => i.category === "industry",
  );
  const financialIndicators = economicIndicators.filter(
    (i) => i.category === "financial",
  );
  const highImpactIndicators = economicIndicators.filter(
    (i) => i.impact === "high",
  );

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Indicators
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {economicIndicators.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Economic metrics tracked
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Macro Economic
            </CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{macroIndicators.length}</div>
            <p className="text-xs text-muted-foreground">
              National/global indicators
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Market Indicators
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{marketIndicators.length}</div>
            <p className="text-xs text-muted-foreground">
              Market performance metrics
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Industry Specific
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {industryIndicators.length}
            </div>
            <p className="text-xs text-muted-foreground">Sector performance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Impact</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {highImpactIndicators.length}
            </div>
            <p className="text-xs text-muted-foreground">Critical indicators</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Economic Impact Dashboard</CardTitle>
              <CardDescription>
                Monitor external economic indicators and their potential
                business impact
              </CardDescription>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={onRefreshData}
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-2"
                  disabled={isLoading}
                >
                  <RefreshCw
                    className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                  />
                  Refresh Data
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Update economic indicators</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search indicators..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="macro">Macro Economic</SelectItem>
                <SelectItem value="market">Market</SelectItem>
                <SelectItem value="industry">Industry</SelectItem>
                <SelectItem value="financial">Financial</SelectItem>
              </SelectContent>
            </Select>
            <Select value={impactFilter} onValueChange={setImpactFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by impact" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Impact Levels</SelectItem>
                <SelectItem value="high">High Impact</SelectItem>
                <SelectItem value="medium">Medium Impact</SelectItem>
                <SelectItem value="low">Low Impact</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Indicators Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredIndicators.map((indicator) => (
              <Card key={indicator.id} className="border-l-4 border-l-blue-500">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(indicator.category)}
                      <h3 className="font-semibold">{indicator.name}</h3>
                      <Badge className={getImpactColor(indicator.impact)}>
                        {indicator.impact} impact
                      </Badge>
                    </div>
                    {getTrendIcon(indicator.trend)}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Current Value
                      </span>
                      <span className="text-2xl font-bold">
                        {indicator.value.toFixed(2)}
                        {indicator.unit}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Previous Value
                      </span>
                      <span className="font-medium">
                        {indicator.previousValue.toFixed(2)}
                        {indicator.unit}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Change
                      </span>
                      <div
                        className={`flex items-center gap-1 font-medium ${getTrendColor(indicator.trend)}`}
                      >
                        {getTrendIcon(indicator.trend)}
                        <span>
                          {indicator.changePercent > 0 ? "+" : ""}
                          {indicator.changePercent.toFixed(2)}%
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Category</span>
                        <Badge variant="outline">{indicator.category}</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm mt-1">
                        <span className="text-muted-foreground">
                          Last Updated
                        </span>
                        <span>
                          {indicator.lastUpdated
                            ? new Date(
                                indicator.lastUpdated,
                              ).toLocaleDateString()
                            : "N/A"}
                        </span>
                      </div>
                    </div>

                    {/* Quick Forecast Preview */}
                    {indicator.forecast.length > 0 && (
                      <div className="pt-2 border-t">
                        <p className="text-sm text-muted-foreground mb-2">
                          Next Period Forecast
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            {indicator.forecast[0].period}
                          </span>
                          <div className="text-right">
                            <div className="text-sm font-bold">
                              {indicator.forecast[0].value.toFixed(2)}
                              {indicator.unit}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {indicator.forecast[0].confidence}% confidence
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewForecast(indicator)}
                          className="flex-1"
                        >
                          <LineChart className="h-4 w-4 mr-2" />
                          View Forecast
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>View detailed forecast and historical data</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredIndicators.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No economic indicators found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
