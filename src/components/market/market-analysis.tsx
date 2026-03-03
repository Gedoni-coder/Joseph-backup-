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
  Users,
  DollarSign,
  Globe,
  Target,
  AlertTriangle,
  Lightbulb,
} from "lucide-react";
import {
  type MarketSize,
  type CustomerSegment,
  type MarketTrend,
  type DemandForecast,
  type IndustryInsight,
} from "@/lib/market-data";

interface MarketAnalysisProps {
  marketSizes: MarketSize[];
  customerSegments: CustomerSegment[];
  marketTrends: MarketTrend[];
  demandForecasts: DemandForecast[];
  industryInsights: IndustryInsight[];
  isDataAvailable?: boolean;
  dataSource?: "ai-generated" | "onboarding" | "business-forecast" | "placeholder";
}

export function MarketAnalysis({
  marketSizes,
  customerSegments,
  marketTrends,
  demandForecasts,
  industryInsights,
  isDataAvailable = true,
  dataSource = "placeholder",
}: MarketAnalysisProps) {
  const formatCurrency = (amount: number) => {
    if (amount >= 1000000000) {
      return `$${(amount / 1000000000).toFixed(1)}B`;
    }
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    return `$${amount.toLocaleString()}`;
  };

  const getTrendColor = (direction: string, impact: string) => {
    if (impact === "high") {
      return direction === "positive"
        ? "bg-green-100 text-green-800"
        : direction === "negative"
          ? "bg-red-100 text-red-800"
          : "bg-yellow-100 text-yellow-800";
    }
    return "bg-gray-100 text-gray-800";
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "text-red-600";
      case "medium":
        return "text-yellow-600";
      case "low":
        return "text-green-600";
      default:
        return "text-gray-600";
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

  // Placeholder section component
  const PlaceholderSection = ({ title, description }: { title: string; description: string }) => (
    <Card className="border-dashed border-2 border-gray-300 bg-gray-50">
      <CardContent className="py-8 text-center">
        <Lightbulb className="w-10 h-10 text-gray-400 mx-auto mb-3" />
        <h3 className="font-semibold text-gray-700 mb-1">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </CardContent>
    </Card>
  );

  return (
    <div id="market-analysis-print" className="space-y-8">
      {/* Data Source Indicator */}
      {!isDataAvailable && dataSource === "placeholder" && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-amber-900">Market Analysis Data Pending</p>
                <p className="text-sm text-amber-800 mt-1">
                  This market analysis will be populated by the AI Agent using data from your onboarding form and business forecasting module. Complete your onboarding profile to see market insights.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {isDataAvailable && dataSource !== "ai-generated" && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-blue-900">Market Analysis - Enhanced View Available</p>
                <p className="text-sm text-blue-800 mt-1">
                  AI Agent integration will provide deeper market insights and TAM analysis. Current view based on {dataSource === "business-forecast" ? "business forecasting data" : dataSource === "onboarding" ? "onboarding information" : "placeholder data"}.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Market Size & Growth */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            Market Size & Growth Rate
          </h2>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => { document.body.setAttribute('data-print-scope','market-analysis'); setTimeout(() => window.print(), 50); setTimeout(() => document.body.removeAttribute('data-print-scope'), 2000); }}>
            <Target className="w-4 h-4 mr-2" />
            Export Analysis
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {marketSizes.map((market) => (
            <Card key={market.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{market.name}</CardTitle>
                <CardDescription>
                  {market.region} • {market.timeframe}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">TAM</span>
                    <span className="text-lg font-bold text-blue-600">
                      {formatCurrency(market.tam)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">SAM</span>
                    <span className="text-lg font-semibold">
                      {formatCurrency(market.sam)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">SOM</span>
                    <span className="text-lg font-semibold">
                      {formatCurrency(market.som)}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Growth Rate</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-green-600">
                        {market.growthRate.toFixed(1)}%
                      </span>
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Customer Segments */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Customer Segments</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {customerSegments.map((segment) => (
            <Card
              key={segment.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{segment.name}</CardTitle>
                  <Badge className={getPriorityColor(segment.priority)}>
                    {segment.priority} priority
                  </Badge>
                </div>
                <CardDescription>
                  {segment.size.toLocaleString()} customers •{" "}
                  {segment.percentage}% of market
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Avg Spending</div>
                    <div className="text-lg font-bold">
                      {formatCurrency(segment.avgSpending)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Growth Rate</div>
                    <div className="flex items-center space-x-1">
                      <span className="text-lg font-bold text-green-600">
                        {segment.growthRate.toFixed(1)}%
                      </span>
                      <TrendingUp className="w-3 h-3 text-green-600" />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-600 mb-2">
                    Key Characteristics
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {segment.characteristics.map((char, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {char}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Market Trends */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">
          Market Trends & Dynamics
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {marketTrends.map((trend) => (
            <Card key={trend.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{trend.trend}</CardTitle>
                  <Badge
                    className={getTrendColor(trend.direction, trend.impact)}
                  >
                    {trend.impact} impact
                  </Badge>
                </div>
                <CardDescription>
                  {trend.category} • {trend.timeframe}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-700">{trend.description}</p>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Confidence Level</span>
                    <span className="font-medium">{trend.confidence}%</span>
                  </div>
                  <Progress value={trend.confidence} className="h-2" />
                </div>

                <div>
                  <div className="text-sm text-gray-600 mb-2">Sources</div>
                  <div className="flex flex-wrap gap-1">
                    {trend.sources.map((source, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {source}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Demand Forecasting */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Demand Forecasting</h2>

        {demandForecasts.map((forecast) => (
          <Card key={forecast.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{forecast.product}</CardTitle>
                <Badge variant="outline">
                  {forecast.confidence}% confidence
                </Badge>
              </div>
              <CardDescription>
                {forecast.methodology} • {forecast.timeframe}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-sm text-gray-600">Current Demand</div>
                  <div className="text-2xl font-bold">
                    {forecast.currentDemand.toLocaleString()}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600">Forecast Demand</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {forecast.forecastDemand.toLocaleString()}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600">Growth</div>
                  <div className="text-2xl font-bold text-green-600">
                    {(
                      ((forecast.forecastDemand - forecast.currentDemand) /
                        forecast.currentDemand) *
                      100
                    ).toFixed(1)}
                    %
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Key Factors</h4>
                {forecast.factors.map((factor, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">{factor.name}</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">
                          {factor.impact > 0 ? "+" : ""}
                          {factor.impact.toFixed(1)}%
                        </span>
                        <span className="text-xs text-gray-500">
                          (weight: {Math.round(factor.weight * 100)}%)
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {forecast.scenarios.map((scenario, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gray-50 rounded-lg text-center"
                  >
                    <div className="font-medium">{scenario.name}</div>
                    <div className="text-lg font-bold text-blue-600">
                      {scenario.demand.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">
                      {scenario.probability}% probability
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Industry Challenges & Opportunities */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">
          Industry Challenges & Opportunities
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {industryInsights.map((insight) => (
            <Card
              key={insight.id}
              className={`hover:shadow-lg transition-shadow ${
                insight.type === "opportunity"
                  ? "border-green-200 bg-green-50"
                  : "border-red-200 bg-red-50"
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {insight.type === "opportunity" ? (
                      <Lightbulb className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    )}
                    <CardTitle className="text-lg">{insight.title}</CardTitle>
                  </div>
                  <Badge
                    className={
                      insight.type === "opportunity"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }
                  >
                    {insight.type}
                  </Badge>
                </div>
                <CardDescription>
                  <span className={getImpactColor(insight.impact)}>
                    {insight.impact} impact
                  </span>{" "}
                  • {insight.timeframe}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-700">{insight.description}</p>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Probability</span>
                    <span className="font-medium">{insight.probability}%</span>
                  </div>
                  <Progress value={insight.probability} className="h-2" />
                </div>

                <div>
                  <div className="text-sm font-medium text-gray-900 mb-2">
                    Action Items
                  </div>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {insight.actionItems.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
