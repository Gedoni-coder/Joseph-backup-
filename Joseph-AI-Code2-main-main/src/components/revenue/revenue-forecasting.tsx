import { useState } from "react";
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
import { TrendingUp, AlertTriangle, CheckCircle, Calendar } from "lucide-react";
import { type RevenueScenario } from "@/lib/revenue-data";
import { ScenarioComparisonDialog } from "./scenario-comparison-dialog";
import { useCurrencyFormatter } from "@/components/currency-formatter";

interface RevenueForecastingProps {
  scenarios: RevenueScenario[];
}

export function RevenueForecasting({ scenarios }: RevenueForecastingProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { compact, format } = useCurrencyFormatter();
  const currentRevenue = scenarios.reduce((sum, s) => sum + s.totalRevenue, 0) / scenarios.length;
  const formatCurrency = (amount: number) => compact(amount, 1);

  const getScenarioColor = (probability: number) => {
    if (probability >= 40) return "bg-green-100 text-green-800";
    if (probability >= 20) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getGrowthColor = (growth: number) => {
    if (growth >= 30) return "text-green-600";
    if (growth >= 15) return "text-blue-600";
    return "text-orange-600";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Revenue Forecasting
          </h2>
          <p className="text-gray-600">
            Scenario planning and revenue projections
          </p>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setDialogOpen(true)}
        >
          <Calendar className="w-4 h-4 mr-2" />
          Create Scenario
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {scenarios.map((scenario) => (
          <Card key={scenario.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <CardTitle className="text-xl">{scenario.name}</CardTitle>
                    <Badge className={getScenarioColor(scenario.probability)}>
                      {scenario.probability}% probability
                    </Badge>
                  </div>
                  <CardDescription className="text-base">
                    {scenario.description}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Total Revenue</div>
                  <div className="text-3xl font-bold text-blue-600">
                    {formatCurrency(scenario.totalRevenue)}
                  </div>
                  <div
                    className={`text-lg font-semibold ${getGrowthColor(scenario.revenueGrowth)}`}
                  >
                    +{scenario.revenueGrowth}% growth
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Scenario Confidence</span>
                  <span className="font-medium">{scenario.probability}%</span>
                </div>
                <Progress value={scenario.probability} className="h-2" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Key Assumptions
                  </h4>
                  <ul className="space-y-2">
                    {scenario.keyAssumptions.map((assumption, index) => (
                      <li
                        key={index}
                        className="text-sm text-gray-700 flex items-start"
                      >
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                        {assumption}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <AlertTriangle className="w-4 h-4 text-orange-600 mr-2" />
                    Risk Factors
                  </h4>
                  <ul className="space-y-2">
                    {scenario.risks.map((risk, index) => (
                      <li
                        key={index}
                        className="text-sm text-gray-700 flex items-start"
                      >
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                        {risk}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Timeframe: {scenario.timeframe}</span>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    Edit Scenario
                  </Button>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">
            Scenario Analysis Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-900">
                {formatCurrency(
                  scenarios.reduce(
                    (acc, s) => acc + (s.totalRevenue * s.probability) / 100,
                    0,
                  ),
                )}
              </div>
              <div className="text-sm text-blue-700">
                Weighted Average Revenue
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-900">
                {scenarios
                  .reduce(
                    (acc, s) => acc + (s.revenueGrowth * s.probability) / 100,
                    0,
                  )
                  .toFixed(1)}
                %
              </div>
              <div className="text-sm text-blue-700">Expected Growth Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-900">
                {
                  scenarios.find(
                    (s) =>
                      s.probability ===
                      Math.max(...scenarios.map((sc) => sc.probability)),
                  )?.name
                }
              </div>
              <div className="text-sm text-blue-700">Most Likely Scenario</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <ScenarioComparisonDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        currentRevenue={currentRevenue}
        onSave={(scenarios) => {
          console.log("Scenarios saved:", scenarios);
        }}
      />
    </div>
  );
}
