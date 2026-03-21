import React, { useState } from "react";
import {
  RecommendedStressTest,
  ScenarioResilienceMetric,
  ScenarioSummaryCard,
  ScenarioTest,
} from "../../lib/financial-advisory-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  AlertTriangle,
  ShieldAlert,
  Activity,
  TrendingDown,
  Calculator,
  PlayCircle,
  BarChart3,
} from "lucide-react";

interface ScenarioTestingProps {
  scenarioTests: ScenarioTest[];
  scenarioResilienceMetrics: ScenarioResilienceMetric[];
  recommendedStressTests: RecommendedStressTest[];
  scenarioSummaryCards: ScenarioSummaryCard[];
  onRunScenario: (scenario: Omit<ScenarioTest, "id" | "createdAt">) => void;
}

export function ScenarioTesting({
  scenarioTests,
  scenarioResilienceMetrics,
  recommendedStressTests,
  scenarioSummaryCards,
  onRunScenario,
}: ScenarioTestingProps) {
  const [selectedType, setSelectedType] = useState("all");
  const [testVariable, setTestVariable] = useState("Revenue");
  const [changePercent, setChangePercent] = useState("-30");
  const [testType, setTestType] = useState<"stress" | "sensitivity">("stress");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "critical":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "low":
        return <Activity className="h-4 w-4" />;
      case "medium":
        return <AlertTriangle className="h-4 w-4" />;
      case "high":
        return <ShieldAlert className="h-4 w-4" />;
      case "critical":
        return <TrendingDown className="h-4 w-4" />;
      default:
        return <BarChart3 className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "stress":
        return "bg-red-100 text-red-800";
      case "sensitivity":
        return "bg-blue-100 text-blue-800";
      case "monte_carlo":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredScenarios = scenarioTests.filter((scenario) => {
    if (selectedType !== "all" && scenario.type !== selectedType) return false;
    return true;
  });

  const createScenario = (
    variable: string,
    percentChange: number,
    type: "stress" | "sensitivity" | "monte_carlo",
  ): Omit<ScenarioTest, "id" | "createdAt"> => {
    const changeValue = percentChange;

    // Base financial values
    const baseRevenue = 2500000;
    const baseExpenses = 1500000;
    const baseNetIncome = baseRevenue - baseExpenses;

    // Get the base and test values based on the variable
    let baseValue: number;
    let testValue: number;
    let resultingRevenue: number;
    let resultingExpenses: number;
    let resultingNetIncome: number;
    let cashFlowImpact: number;

    switch (variable) {
      case "Revenue":
        baseValue = baseRevenue;
        testValue = baseRevenue * (1 + changeValue / 100);
        resultingRevenue = testValue;
        resultingExpenses = baseExpenses;
        resultingNetIncome = testValue - baseExpenses;
        cashFlowImpact = (testValue - baseRevenue) * 0.8; // 80% flows through to cash
        break;

      case "Expenses":
        baseValue = baseExpenses;
        testValue = baseExpenses * (1 + changeValue / 100);
        resultingRevenue = baseRevenue;
        resultingExpenses = testValue;
        resultingNetIncome = baseRevenue - testValue;
        cashFlowImpact = -(testValue - baseExpenses) * 0.8; // Negative impact to cash
        break;

      case "Market Share":
        baseValue = 100; // Market share in percentage
        testValue = baseValue + changeValue;
        // 1% market share increase typically increases revenue by ~0.5-1%
        const marketShareRevenueFactor = changeValue * 15000;
        resultingRevenue = baseRevenue + marketShareRevenueFactor;
        resultingExpenses = baseExpenses + marketShareRevenueFactor * 0.3; // 30% expense increase
        resultingNetIncome = resultingRevenue - resultingExpenses;
        cashFlowImpact = marketShareRevenueFactor * 0.7;
        break;

      case "Interest Rates":
        baseValue = 5; // Base interest rate
        testValue = baseValue + changeValue;
        // Interest rate impact on debt service (assume 20% of expenses)
        const debtServiceExpense = baseExpenses * 0.2;
        const rateChangeImpact = debtServiceExpense * (changeValue / 100);
        resultingRevenue = baseRevenue;
        resultingExpenses = baseExpenses + rateChangeImpact;
        resultingNetIncome = resultingRevenue - resultingExpenses;
        cashFlowImpact = -rateChangeImpact * 0.9;
        break;

      default:
        baseValue = 0;
        testValue = 0;
        resultingRevenue = baseRevenue;
        resultingExpenses = baseExpenses;
        resultingNetIncome = baseNetIncome;
        cashFlowImpact = 0;
    }

    // Calculate impact severity based on percentage change and impact magnitude
    const impactMagnitude = Math.abs(resultingNetIncome - baseNetIncome);
    const impactPercentage = (impactMagnitude / baseNetIncome) * 100;

    let impactSeverity: "low" | "medium" | "high" | "critical";
    if (impactPercentage > 30) {
      impactSeverity = "critical";
    } else if (impactPercentage > 15) {
      impactSeverity = "high";
    } else if (impactPercentage > 5) {
      impactSeverity = "medium";
    } else {
      impactSeverity = "low";
    }

    // Calculate probability based on magnitude (extreme changes are less likely)
    const probabilityBaseline = type === "stress" ? 30 : 50;
    const probability = Math.max(
      5,
      probabilityBaseline - Math.abs(changeValue) * 0.5,
    );

    return {
      name: `${variable} ${changeValue >= 0 ? "+" : ""}${changeValue}% Scenario (${type})`,
      description: `${Math.abs(changeValue)}% ${changeValue > 0 ? "increase" : "decrease"} in ${variable.toLowerCase()} using ${type} testing methodology`,
      type,
      parameters: [
        {
          variable,
          baseValue,
          testValue,
          changePercent: changeValue,
        },
      ],
      results: {
        revenue: Math.round(resultingRevenue),
        expenses: Math.round(resultingExpenses),
        netIncome: Math.round(resultingNetIncome),
        cashFlow: Math.round(cashFlowImpact),
        impactSeverity,
      },
      probability: Math.round(probability),
    };
  };

  const handleRunScenario = () => {
    const scenario = createScenario(testVariable, parseInt(changePercent, 10), testType);
    onRunScenario(scenario);
  };

  const handleRunTemplateScenario = (template: RecommendedStressTest["scenarioTemplate"]) => {
    const scenario = createScenario(
      template.testVariable ?? testVariable,
      template.changePercent ?? parseInt(changePercent, 10),
      template.testType ?? testType,
    );
    onRunScenario(scenario);
  };

  const summaryCardMap = scenarioSummaryCards.reduce(
    (acc, card) => {
      acc[card.key] = card;
      return acc;
    },
    {} as Record<ScenarioSummaryCard["key"], ScenarioSummaryCard>,
  );

  const getValueToneColor = (tone: string) => {
    switch (tone) {
      case "danger":
      case "red":
        return "text-red-600";
      case "warning":
      case "yellow":
        return "text-yellow-600";
      case "success":
      case "green":
        return "text-green-600";
      case "info":
      case "blue":
        return "text-blue-600";
      case "orange":
        return "text-orange-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Scenario & Stress Testing
          </h2>
          <p className="text-gray-600">
            What-if analysis and resilience testing for financial planning
          </p>
        </div>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Scenario Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="stress">Stress Test</SelectItem>
            <SelectItem value="sensitivity">Sensitivity</SelectItem>
            <SelectItem value="monte_carlo">Monte Carlo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Quick Scenario Builder */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Scenario Builder</CardTitle>
          <CardDescription>
            Build and run custom stress tests and sensitivity analyses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Test Variable
              </label>
              <Select value={testVariable} onValueChange={setTestVariable}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Revenue">Revenue</SelectItem>
                  <SelectItem value="Expenses">Operating Expenses</SelectItem>
                  <SelectItem value="Market Share">Market Share</SelectItem>
                  <SelectItem value="Interest Rates">Interest Rates</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Change Percentage
              </label>
              <Select value={changePercent} onValueChange={setChangePercent}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="-50">-50%</SelectItem>
                  <SelectItem value="-30">-30%</SelectItem>
                  <SelectItem value="-15">-15%</SelectItem>
                  <SelectItem value="-10">-10%</SelectItem>
                  <SelectItem value="-5">-5%</SelectItem>
                  <SelectItem value="5">+5%</SelectItem>
                  <SelectItem value="10">+10%</SelectItem>
                  <SelectItem value="15">+15%</SelectItem>
                  <SelectItem value="25">+25%</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Test Type
              </label>
              <Select
                value={testType}
                onValueChange={(value) =>
                  setTestType(value as "stress" | "sensitivity")
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stress">Stress Test</SelectItem>
                  <SelectItem value="sensitivity">
                    Sensitivity Analysis
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleRunScenario}
              className="flex items-center gap-2"
            >
              <PlayCircle className="h-4 w-4" />
              Run Scenario
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Scenario Results Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Scenarios
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {summaryCardMap.total_scenarios?.value ?? "0"}
                </p>
              </div>
              <Calculator className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Critical Scenarios
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {summaryCardMap.critical_scenarios?.value ?? "0"}
                </p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Avg Probability
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {summaryCardMap.average_probability?.value ?? "0%"}
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
                  Resilience Score
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {summaryCardMap.resilience_score?.value ?? "0"}
                </p>
              </div>
              <ShieldAlert className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scenario Results Table */}
      <Card>
        <CardHeader>
          <CardTitle>Scenario Test Results</CardTitle>
          <CardDescription>
            Detailed analysis of what-if scenarios and stress test outcomes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    Scenario Name
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900">
                    Type
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900">
                    Parameters
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">
                    Resulting Revenue
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">
                    Net Income Impact
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">
                    Cash Flow Impact
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900">
                    Impact Severity
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900">
                    Probability
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredScenarios.map((scenario) => (
                  <tr key={scenario.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <span className="font-medium text-gray-900">
                          {scenario.name}
                        </span>
                        <p className="text-sm text-gray-600">
                          {scenario.description}
                        </p>
                      </div>
                    </td>
                    <td className="text-center py-3 px-4">
                      <Badge className={getTypeColor(scenario.type)}>
                        {scenario.type.replace("_", " ")}
                      </Badge>
                    </td>
                    <td className="text-center py-3 px-4">
                      <div className="space-y-1">
                        {scenario.parameters.map((param, index) => (
                          <div key={index} className="text-sm">
                            <span className="font-medium">
                              {param.variable}
                            </span>
                            <span className="text-gray-600 ml-1">
                              {param.changePercent >= 0 ? "+" : ""}
                              {param.changePercent}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="text-right py-3 px-4 font-medium">
                      {formatCurrency(scenario.results.revenue)}
                    </td>
                    <td className="text-right py-3 px-4 font-medium">
                      <span
                        className={
                          scenario.results.netIncome >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {formatCurrency(scenario.results.netIncome)}
                      </span>
                    </td>
                    <td className="text-right py-3 px-4 font-medium">
                      <span
                        className={
                          scenario.results.cashFlow >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {formatCurrency(scenario.results.cashFlow)}
                      </span>
                    </td>
                    <td className="text-center py-3 px-4">
                      <div className="flex items-center justify-center gap-1">
                        {getSeverityIcon(scenario.results.impactSeverity)}
                        <Badge
                          className={getSeverityColor(
                            scenario.results.impactSeverity,
                          )}
                        >
                          {scenario.results.impactSeverity}
                        </Badge>
                      </div>
                    </td>
                    <td className="text-center py-3 px-4">
                      <span className="font-medium">
                        {scenario.probability}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Resilience Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Business Resilience Analysis</CardTitle>
            <CardDescription>
              How well the business withstands various stress scenarios
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scenarioResilienceMetrics.map((metric) => (
                <div key={metric.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{metric.name}</span>
                    <span
                      className={`text-sm font-medium ${getValueToneColor(metric.valueTone)}`}
                    >
                      {metric.value}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{metric.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommended Stress Tests</CardTitle>
            <CardDescription>
              Suggested scenarios based on current market conditions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendedStressTests.map((test) => (
                <div key={test.id} className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    {test.icon === "alert-triangle" && (
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    )}
                    {test.icon === "trending-down" && (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                    {test.icon === "activity" && (
                      <Activity className="h-4 w-4 text-blue-600" />
                    )}
                    <span className="font-medium text-gray-900">{test.title}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{test.description}</p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRunTemplateScenario(test.scenarioTemplate)}
                  >
                    Run Test
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
