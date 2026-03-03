import React, { useState } from "react";
import {
  MarketVolatility,
  DisruptionRisk,
  SustainabilityMetric,
  RegulatoryCompliance,
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
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Shield,
  Leaf,
  FileCheck,
  BarChart3,
  Activity,
  Globe,
  Zap,
  Target,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

interface SupplyChainAnalyticsProps {
  marketVolatility: MarketVolatility[];
  disruptionRisks: DisruptionRisk[];
  sustainabilityMetrics: SustainabilityMetric[];
  regulatoryCompliance: RegulatoryCompliance[];
}

export function SupplyChainAnalytics({
  marketVolatility,
  disruptionRisks,
  sustainabilityMetrics,
  regulatoryCompliance,
}: SupplyChainAnalyticsProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState("7d");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const getVolatilityColor = (level: string) => {
    switch (level) {
      case "low":
        return "text-green-600 bg-green-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "high":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getRiskLevel = (probability: number, impact: number) => {
    const riskScore = probability * impact;
    if (riskScore >= 70) return { level: "critical", color: "text-red-600" };
    if (riskScore >= 40) return { level: "high", color: "text-orange-600" };
    if (riskScore >= 20) return { level: "medium", color: "text-yellow-600" };
    return { level: "low", color: "text-green-600" };
  };

  const getComplianceIcon = (status: string) => {
    switch (status) {
      case "compliant":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "non_compliant":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getComplianceColor = (status: string) => {
    switch (status) {
      case "compliant":
        return "bg-green-100 text-green-800";
      case "non_compliant":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const avgSustainabilityScore =
    sustainabilityMetrics.reduce(
      (sum, metric) => sum + metric.currentValue,
      0,
    ) / sustainabilityMetrics.length;

  const criticalRisks = disruptionRisks.filter((risk) => {
    const riskLevel = getRiskLevel(risk.probability, risk.impact);
    return riskLevel.level === "critical" || riskLevel.level === "high";
  });

  const complianceRate =
    (regulatoryCompliance.filter((item) => item.status === "compliant").length /
      regulatoryCompliance.length) *
    100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Supply Chain Analytics
          </h2>
          <p className="text-gray-600">
            Monitor risks, sustainability, and regulatory compliance
          </p>
        </div>
        <div className="flex gap-2">
          <Select
            value={selectedTimeframe}
            onValueChange={setSelectedTimeframe}
          >
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button>Generate Report</Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Critical Risks
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {criticalRisks.length}
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
                  Sustainability Score
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {avgSustainabilityScore.toFixed(1)}
                </p>
              </div>
              <Leaf className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Compliance Rate
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {complianceRate.toFixed(0)}%
                </p>
              </div>
              <FileCheck className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Market Volatility
                </p>
                <p className="text-2xl font-bold text-purple-600">Medium</p>
              </div>
              <Activity className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Market Volatility */}
      <Card>
        <CardHeader>
          <CardTitle>Market Volatility Tracking</CardTitle>
          <CardDescription>
            Monitor commodity price fluctuations and market conditions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    Commodity
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">
                    Current Price
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900">
                    Price Change
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900">
                    Volatility Level
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900">
                    Trend
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900">
                    Impact
                  </th>
                </tr>
              </thead>
              <tbody>
                {marketVolatility.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <span className="font-medium">{item.commodity}</span>
                    </td>
                    <td className="text-right py-3 px-4 font-medium">
                      ${item.currentPrice.toFixed(2)}
                    </td>
                    <td className="text-center py-3 px-4">
                      <div
                        className={`flex items-center justify-center gap-1 ${
                          item.priceChange >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {item.priceChange >= 0 ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                        <span className="font-medium">
                          {item.priceChange >= 0 ? "+" : ""}
                          {item.priceChange.toFixed(2)}%
                        </span>
                      </div>
                    </td>
                    <td className="text-center py-3 px-4">
                      <Badge
                        className={getVolatilityColor(item.volatilityLevel)}
                      >
                        {item.volatilityLevel}
                      </Badge>
                    </td>
                    <td className="text-center py-3 px-4">
                      <div className="flex items-center justify-center gap-1">
                        {item.trend === "up" ? (
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        ) : item.trend === "down" ? (
                          <TrendingDown className="h-4 w-4 text-red-600" />
                        ) : (
                          <Activity className="h-4 w-4 text-gray-600" />
                        )}
                        <span className="capitalize">{item.trend}</span>
                      </div>
                    </td>
                    <td className="text-center py-3 px-4">
                      <Badge
                        className={
                          item.impact === "high"
                            ? "bg-red-100 text-red-800"
                            : item.impact === "medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                        }
                      >
                        {item.impact}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Risk Assessment and Sustainability */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Disruption Risk Assessment</CardTitle>
            <CardDescription>
              Critical risks that could impact supply chain operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {disruptionRisks.slice(0, 5).map((risk) => {
                const riskLevel = getRiskLevel(risk.probability, risk.impact);

                return (
                  <div key={risk.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">
                        {risk.riskType}
                      </h4>
                      <Badge
                        className={
                          riskLevel.level === "critical"
                            ? "bg-red-100 text-red-800"
                            : riskLevel.level === "high"
                              ? "bg-orange-100 text-orange-800"
                              : riskLevel.level === "medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                        }
                      >
                        {riskLevel.level}
                      </Badge>
                    </div>

                    <p className="text-sm text-gray-600 mb-3">
                      {risk.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Probability:</span>
                        <div className="flex items-center gap-2 mt-1">
                          <Progress
                            value={risk.probability}
                            className="flex-1 h-2"
                          />
                          <span className="font-medium">
                            {risk.probability}%
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">Impact:</span>
                        <div className="flex items-center gap-2 mt-1">
                          <Progress
                            value={risk.impact}
                            className="flex-1 h-2"
                          />
                          <span className="font-medium">{risk.impact}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 text-xs text-gray-500">
                      Affected Region: {risk.affectedRegion}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sustainability Metrics</CardTitle>
            <CardDescription>
              Environmental and social responsibility indicators
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sustainabilityMetrics.map((metric) => {
                const progress =
                  (metric.currentValue / metric.targetValue) * 100;
                const isOnTarget = progress >= 95;

                return (
                  <div key={metric.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">
                        {metric.metricName}
                      </span>
                      <div className="flex items-center gap-2">
                        {isOnTarget ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <Target className="h-4 w-4 text-gray-400" />
                        )}
                        <span
                          className={`text-sm font-medium ${
                            isOnTarget ? "text-green-600" : "text-gray-600"
                          }`}
                        >
                          {metric.currentValue}/{metric.targetValue}{" "}
                          {metric.unit}
                        </span>
                      </div>
                    </div>

                    <Progress value={Math.min(100, progress)} className="h-2" />

                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Progress: {progress.toFixed(0)}%</span>
                      <span>Category: {metric.category}</span>
                    </div>
                  </div>
                );
              })}

              <div className="pt-4 border-t">
                <h4 className="font-medium text-gray-900 mb-3">
                  Sustainability Score
                </h4>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Progress
                      value={avgSustainabilityScore * 10}
                      className="h-3"
                    />
                  </div>
                  <span className="text-lg font-bold text-green-600">
                    {avgSustainabilityScore.toFixed(1)}/10
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Regulatory Compliance */}
      <Card>
        <CardHeader>
          <CardTitle>Regulatory Compliance Monitoring</CardTitle>
          <CardDescription>
            Track compliance status across different regulations and regions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {regulatoryCompliance.map((compliance) => (
              <div key={compliance.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {compliance.regulation}
                    </h4>
                    <p className="text-sm text-gray-600">{compliance.region}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getComplianceIcon(compliance.status)}
                    <Badge className={getComplianceColor(compliance.status)}>
                      {compliance.status.replace("_", " ")}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="text-gray-600">Last Audit:</span>
                    <span className="ml-2 font-medium">
                      {compliance.lastAuditDate
                        ? new Date(
                            compliance.lastAuditDate,
                          ).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>

                  <div className="text-sm">
                    <span className="text-gray-600">Next Review:</span>
                    <span className="ml-2 font-medium">
                      {compliance.nextReviewDate
                        ? new Date(
                            compliance.nextReviewDate,
                          ).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>

                  <div className="text-sm">
                    <span className="text-gray-600">Compliance Score:</span>
                    <span className="ml-2 font-medium">
                      {compliance.complianceScore}%
                    </span>
                  </div>

                  <Progress
                    value={compliance.complianceScore}
                    className="h-2"
                  />
                </div>

                {compliance.notes && (
                  <div className="mt-3 p-2 bg-gray-50 rounded text-xs text-gray-600">
                    {compliance.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Analytics Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Supply Chain Health Summary</CardTitle>
          <CardDescription>
            Overall assessment and key recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Risk Assessment</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Overall Risk Level:</span>
                  <span className="font-medium text-yellow-600">Medium</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Critical Risks:</span>
                  <span className="font-medium text-red-600">
                    {criticalRisks.length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Risk Mitigation:</span>
                  <span className="font-medium text-green-600">85%</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Sustainability</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>ESG Score:</span>
                  <span className="font-medium text-green-600">
                    {avgSustainabilityScore.toFixed(1)}/10
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Carbon Footprint:</span>
                  <span className="font-medium text-yellow-600">Improving</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Supplier ESG:</span>
                  <span className="font-medium text-blue-600">92%</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Compliance</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Compliance Rate:</span>
                  <span className="font-medium text-green-600">
                    {complianceRate.toFixed(0)}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Pending Reviews:</span>
                  <span className="font-medium text-yellow-600">
                    {
                      regulatoryCompliance.filter((c) => c.status === "pending")
                        .length
                    }
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Audit Score:</span>
                  <span className="font-medium text-blue-600">94%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
