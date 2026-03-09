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
  Clock,
  Target,
  DollarSign,
  ArrowRight,
} from "lucide-react";
import { type UpsellOpportunity } from "@/lib/revenue-data";

interface UpsellOpportunitiesProps {
  upsells: UpsellOpportunity[];
}

export function UpsellOpportunities({ upsells }: UpsellOpportunitiesProps) {
  const getProbabilityColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getProbabilityBadgeColor = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800";
    if (score >= 60) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getTimeUrgency = (days: number) => {
    if (days <= 15) return "bg-red-100 text-red-800";
    if (days <= 30) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  const totalPotentialRevenue = upsells.reduce(
    (acc, u) => acc + (u.potentialMRR - u.currentMRR),
    0,
  );
  const totalCurrentMRR = upsells.reduce((acc, u) => acc + u.currentMRR, 0);
  const averageProbability =
    upsells.reduce((acc, u) => acc + u.probabilityScore, 0) / upsells.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Upsell Opportunities
          </h2>
          <p className="text-gray-600">
            Identify and prioritize customer expansion opportunities
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Target className="w-4 h-4 mr-2" />
          Campaign Manager
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <div>
                <div className="text-sm text-green-700">
                  Potential MRR Increase
                </div>
                <div className="text-xl font-bold text-green-900">
                  ${totalPotentialRevenue.toLocaleString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-sm text-blue-700">Current MRR</div>
                <div className="text-xl font-bold text-blue-900">
                  ${totalCurrentMRR.toLocaleString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-purple-600" />
              <div>
                <div className="text-sm text-purple-700">Avg Success Rate</div>
                <div className="text-xl font-bold text-purple-900">
                  {averageProbability.toFixed(0)}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-orange-600" />
              <div>
                <div className="text-sm text-orange-700">
                  Active Opportunities
                </div>
                <div className="text-xl font-bold text-orange-900">
                  {upsells.length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {upsells
          .sort((a, b) => b.probabilityScore - a.probabilityScore)
          .map((upsell) => {
            const revenueIncrease = upsell.potentialMRR - upsell.currentMRR;
            const percentageIncrease =
              (revenueIncrease / upsell.currentMRR) * 100;

            return (
              <Card
                key={upsell.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{upsell.customer}</CardTitle>
                    <Badge
                      className={getProbabilityBadgeColor(
                        upsell.probabilityScore,
                      )}
                    >
                      {upsell.probabilityScore}% likely
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center space-x-4">
                    <span>{upsell.currentPlan}</span>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-blue-600">
                      {upsell.suggestedPlan}
                    </span>
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-600">Current MRR</div>
                      <div className="text-lg font-semibold">
                        ${upsell.currentMRR.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Potential MRR</div>
                      <div className="text-xl font-bold text-green-600">
                        ${upsell.potentialMRR.toLocaleString()}
                      </div>
                      <div className="text-sm text-green-600">
                        +{percentageIncrease.toFixed(0)}% increase
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Success Probability</span>
                      <span
                        className={`font-medium ${getProbabilityColor(upsell.probabilityScore)}`}
                      >
                        {upsell.probabilityScore}%
                      </span>
                    </div>
                    <Progress value={upsell.probabilityScore} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">Time to Upgrade</div>
                    <Badge className={getTimeUrgency(upsell.timeToUpgrade)}>
                      {upsell.timeToUpgrade} days
                    </Badge>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Upgrade Triggers
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {upsell.triggers.map((trigger, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {trigger}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-3 border-t">
                    <Button variant="outline" size="sm" className="flex-1">
                      View Profile
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      Start Outreach
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">
            Upsell Strategy Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-blue-900 mb-3">
                High-Priority Actions
              </h4>
              <ul className="space-y-2 text-sm text-blue-700">
                <li>• Focus on customers with 80%+ probability scores</li>
                <li>• Prioritize accounts nearing upgrade triggers</li>
                <li>• Create personalized upgrade presentations</li>
                <li>• Offer limited-time upgrade incentives</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 mb-3">
                Success Factors
              </h4>
              <ul className="space-y-2 text-sm text-blue-700">
                <li>• API usage approaching limits</li>
                <li>• Multiple team member requests</li>
                <li>• Strong engagement metrics</li>
                <li>• Security/compliance requirements</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
