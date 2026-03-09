import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScenarioPlanning } from "@/lib/business-forecast-data";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/lib/currency-context";

interface ScenarioPlanningProps {
  scenarios: ScenarioPlanning[];
  title?: string;
}

export function ScenarioPlanningComponent({
  scenarios,
  title = "Scenario Planning & Stress Testing",
}: ScenarioPlanningProps) {
  const { formatCurrency } = useCurrency();

  const getScenarioColor = (scenario: string) => {
    switch (scenario) {
      case "Best Case":
        return "bg-economic-positive text-economic-positive-foreground";
      case "Base Case":
        return "bg-primary text-primary-foreground";
      case "Worst Case":
        return "bg-economic-negative text-economic-negative-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getScenarioIcon = (scenario: string) => {
    switch (scenario) {
      case "Best Case":
        return <TrendingUp className="h-5 w-5" />;
      case "Base Case":
        return <BarChart3 className="h-5 w-5" />;
      case "Worst Case":
        return <TrendingDown className="h-5 w-5" />;
      default:
        return <AlertTriangle className="h-5 w-5" />;
    }
  };

  const getProfitMargin = (scenario: ScenarioPlanning) => {
    return ((scenario.profit / scenario.revenue) * 100).toFixed(1);
  };

  const baseCase = scenarios.find((s) => s.scenario === "Base Case");
  const bestCase = scenarios.find((s) => s.scenario === "Best Case");
  const worstCase = scenarios.find((s) => s.scenario === "Worst Case");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          {title}
        </h3>
        <Badge variant="outline" className="text-xs">
          {scenarios.length} scenarios modeled
        </Badge>
      </div>

      {/* Scenario Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {scenarios.map((scenario) => (
          <Card
            key={scenario.id}
            className={cn(
              "hover:shadow-lg transition-all duration-200",
              scenario.scenario === "Base Case" && "ring-2 ring-primary/20",
            )}
          >
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getScenarioIcon(scenario.scenario)}
                  <CardTitle className="text-base">
                    {scenario.scenario}
                  </CardTitle>
                </div>
                <Badge
                  className={cn("text-xs", getScenarioColor(scenario.scenario))}
                >
                  {scenario.probability}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Revenue</span>
                  <span className="font-semibold">
                    {formatCurrency(scenario.revenue)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Costs</span>
                  <span className="font-semibold">
                    {formatCurrency(scenario.costs)}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t pt-2">
                  <span className="text-sm font-medium">Profit</span>
                  <span className="font-bold text-lg">
                    {formatCurrency(scenario.profit)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Margin</span>
                  <span className="font-medium">
                    {getProfitMargin(scenario)}%
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Probability</div>
                <Progress value={scenario.probability} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Key Assumptions</div>
                <ul className="space-y-1">
                  {scenario.keyAssumptions.map((assumption, index) => (
                    <li key={index} className="flex items-start gap-2 text-xs">
                      <div className="w-1 h-1 rounded-full bg-muted-foreground mt-2 flex-shrink-0" />
                      <span className="text-muted-foreground leading-relaxed">
                        {assumption}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Comparative Analysis */}
      {baseCase && bestCase && worstCase && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Scenario Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Revenue Range</span>
                    <span className="font-medium">
                      {formatCurrency(worstCase.revenue)} -{" "}
                      {formatCurrency(bestCase.revenue)}
                    </span>
                  </div>
                  <div className="relative">
                    <Progress
                      value={
                        ((baseCase.revenue - worstCase.revenue) /
                          (bestCase.revenue - worstCase.revenue)) *
                        100
                      }
                      className="h-3"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-1 h-5 bg-primary rounded-full" />
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Worst: {formatCurrency(worstCase.revenue)}</span>
                    <span>Best: {formatCurrency(bestCase.revenue)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Profit Range</span>
                    <span className="font-medium">
                      {formatCurrency(worstCase.profit)} -{" "}
                      {formatCurrency(bestCase.profit)}
                    </span>
                  </div>
                  <div className="relative">
                    <Progress
                      value={
                        ((baseCase.profit - worstCase.profit) /
                          (bestCase.profit - worstCase.profit)) *
                        100
                      }
                      className="h-3"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-1 h-5 bg-primary rounded-full" />
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Worst: {formatCurrency(worstCase.profit)}</span>
                    <span>Best: {formatCurrency(bestCase.profit)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Risk Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-economic-positive/10 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-economic-positive" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">Upside Potential</div>
                    <div className="text-lg font-bold text-economic-positive">
                      {formatCurrency(bestCase.profit - baseCase.profit)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Additional profit in best case
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-economic-negative/10 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-economic-negative" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">Downside Risk</div>
                    <div className="text-lg font-bold text-economic-negative">
                      {formatCurrency(baseCase.profit - worstCase.profit)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Potential profit loss in worst case
                    </div>
                  </div>
                </div>

                <div className="border-t pt-3">
                  <div className="text-sm font-medium mb-2">Expected Value</div>
                  <div className="text-xl font-bold">
                    {formatCurrency(
                      scenarios.reduce(
                        (sum, s) => sum + (s.profit * s.probability) / 100,
                        0,
                      ),
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Probability-weighted average profit
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
