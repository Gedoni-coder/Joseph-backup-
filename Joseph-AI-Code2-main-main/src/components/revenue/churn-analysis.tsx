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
import { AlertTriangle, Users, DollarSign, Clock, Shield } from "lucide-react";
import { type ChurnAnalysis } from "@/lib/revenue-data";
import { useCurrencyFormatter } from "@/components/currency-formatter";

interface ChurnAnalysisProps {
  churn: ChurnAnalysis[];
}

export function ChurnAnalysisComponent({ churn }: ChurnAnalysisProps) {
  const { compact } = useCurrencyFormatter();
  const formatCurrency = (amount: number) => compact(amount, 1);

  const getChurnRateColor = (rate: number) => {
    if (rate <= 3) return "text-green-600";
    if (rate <= 8) return "text-yellow-600";
    return "text-red-600";
  };

  const getImpactColor = (impact: "high" | "medium" | "low") => {
    switch (impact) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
    }
  };

  const totalRevenueAtRisk = churn.reduce((acc, c) => acc + c.revenueAtRisk, 0);
  const weightedChurnRate =
    churn.reduce((acc, c) => acc + c.churnRate * c.revenueAtRisk, 0) /
    totalRevenueAtRisk;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Churn Analysis</h2>
          <p className="text-gray-600">
            Monitor customer retention and revenue at risk
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Shield className="w-4 h-4 mr-2" />
          Retention Plan
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <div>
                <div className="text-sm text-red-700">Revenue at Risk</div>
                <div className="text-xl font-bold text-red-900">
                  {formatCurrency(totalRevenueAtRisk)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-orange-600" />
              <div>
                <div className="text-sm text-orange-700">
                  Weighted Churn Rate
                </div>
                <div className="text-xl font-bold text-orange-900">
                  {weightedChurnRate.toFixed(1)}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-sm text-blue-700">
                  Avg Customer Lifetime
                </div>
                <div className="text-xl font-bold text-blue-900">
                  {(
                    churn.reduce((acc, c) => acc + c.averageLifetime, 0) /
                    churn.length
                  ).toFixed(1)}{" "}
                  months
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <div>
                <div className="text-sm text-green-700">
                  Retention Investment
                </div>
                <div className="text-xl font-bold text-green-900">
                  {formatCurrency(
                    churn.reduce(
                      (acc, c) => acc + c.retentionCost * c.customers,
                      0,
                    ),
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {churn.map((segment) => (
          <Card key={segment.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{segment.segment}</CardTitle>
                <div
                  className={`text-xl font-bold ${getChurnRateColor(segment.churnRate)}`}
                >
                  {segment.churnRate}%
                </div>
              </div>
              <CardDescription>
                {segment.customers.toLocaleString()} customers •{" "}
                {formatCurrency(segment.revenueAtRisk)} at risk
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Avg Lifetime</div>
                  <div className="text-lg font-semibold">
                    {segment.averageLifetime} months
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Retention Cost</div>
                  <div className="text-lg font-semibold">
                    ${segment.retentionCost}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Churn Reasons</h4>
                {segment.churnReasons.map((reason, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-700">{reason.reason}</span>
                        <Badge
                          className={getImpactColor(reason.impact)}
                          variant="outline"
                        >
                          {reason.impact}
                        </Badge>
                      </div>
                      <span className="font-medium">{reason.percentage}%</span>
                    </div>
                    <Progress value={reason.percentage} className="h-1.5" />
                  </div>
                ))}
              </div>

              <div className="flex space-x-2 pt-3 border-t">
                <Button variant="outline" size="sm" className="flex-1">
                  View Details
                </Button>
                <Button
                  size="sm"
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Action Plan
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">
            Retention Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-blue-900 mb-3">
                Immediate Actions
              </h4>
              <ul className="space-y-2 text-sm text-blue-700">
                <li>
                  • Focus retention efforts on Enterprise segment (highest
                  revenue impact)
                </li>
                <li>• Address price sensitivity through value demonstration</li>
                <li>• Implement proactive support for at-risk accounts</li>
                <li>• Create customer success milestones</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 mb-3">
                Long-term Strategy
              </h4>
              <ul className="space-y-2 text-sm text-blue-700">
                <li>• Develop tiered support packages</li>
                <li>• Implement usage-based success metrics</li>
                <li>• Create loyalty and upgrade programs</li>
                <li>• Regular customer health score monitoring</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
