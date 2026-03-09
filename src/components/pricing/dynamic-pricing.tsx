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
import { Clock, TrendingUp, TrendingDown, Settings, Zap } from "lucide-react";
import { type DynamicPricing } from "@/lib/pricing-data";

interface DynamicPricingProps {
  dynamicPrices: DynamicPricing[];
}

const algorithmColors = {
  "ai-driven": "bg-purple-100 text-purple-800",
  "demand-based": "bg-blue-100 text-blue-800",
  "competitor-based": "bg-green-100 text-green-800",
  "rule-based": "bg-orange-100 text-orange-800",
};

export function DynamicPricingComponent({
  dynamicPrices,
}: DynamicPricingProps) {
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    }).format(date);
  };

  const getTimeUntilUpdate = (nextUpdate: Date) => {
    const now = new Date();
    const diff = nextUpdate.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dynamic Pricing</h2>
          <p className="text-gray-600">
            Real-time algorithmic price optimization
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Settings className="w-4 h-4 mr-2" />
          Configure Rules
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {dynamicPrices.map((pricing) => {
          const priceChange =
            ((pricing.currentPrice - pricing.basePrice) / pricing.basePrice) *
            100;

          return (
            <Card
              key={pricing.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{pricing.product}</CardTitle>
                  <Badge className={algorithmColors[pricing.algorithm]}>
                    {pricing.algorithm.replace("-", " ")}
                  </Badge>
                </div>
                <CardDescription className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>
                    Next update in {getTimeUntilUpdate(pricing.nextUpdate)}
                  </span>
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-600">Base Price</div>
                    <div className="text-lg font-medium">
                      ${pricing.basePrice}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Current Price</div>
                    <div className="flex items-center space-x-2">
                      <div className="text-2xl font-bold text-blue-600">
                        ${pricing.currentPrice.toFixed(2)}
                      </div>
                      {priceChange > 0 ? (
                        <TrendingUp className="w-5 h-5 text-green-500" />
                      ) : priceChange < 0 ? (
                        <TrendingDown className="w-5 h-5 text-red-500" />
                      ) : null}
                    </div>
                    <div
                      className={`text-sm ${
                        priceChange > 0
                          ? "text-green-600"
                          : priceChange < 0
                            ? "text-red-600"
                            : "text-gray-600"
                      }`}
                    >
                      {priceChange > 0 ? "+" : ""}
                      {priceChange.toFixed(1)}%
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Pricing Factors</h4>
                  {pricing.factors.map((factor, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{factor.name}</span>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">
                            {(factor.currentValue * 100).toFixed(0)}%
                          </span>
                          <span
                            className={`text-xs ${
                              factor.impact > 0
                                ? "text-green-600"
                                : factor.impact < 0
                                  ? "text-red-600"
                                  : "text-gray-600"
                            }`}
                          >
                            {factor.impact > 0 ? "+" : ""}
                            {factor.impact}%
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Progress
                          value={factor.currentValue * 100}
                          className="flex-1 h-2"
                        />
                        <span className="text-xs text-gray-500 w-8">
                          {Math.round(factor.weight * 100)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Last Updated</span>
                    <span>{formatTime(pricing.lastUpdate)}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Zap className="w-3 h-3 mr-1" />
                    Manual Override
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    View History
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
            Dynamic Pricing Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-900">
                {
                  dynamicPrices.filter(
                    (p) => (p.currentPrice - p.basePrice) / p.basePrice > 0.05,
                  ).length
                }
              </div>
              <div className="text-sm text-blue-700">Products Above Base</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-900">
                {(
                  dynamicPrices.reduce(
                    (acc, p) =>
                      acc +
                      ((p.currentPrice - p.basePrice) / p.basePrice) * 100,
                    0,
                  ) / dynamicPrices.length
                ).toFixed(1)}
                %
              </div>
              <div className="text-sm text-blue-700">Avg Price Change</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-900">24/7</div>
              <div className="text-sm text-blue-700">Monitoring</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-900">4</div>
              <div className="text-sm text-blue-700">Active Algorithms</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
