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
  DollarSign,
  Target,
  BarChart3,
} from "lucide-react";
import { type PricingStrategy } from "@/lib/pricing-data";

interface PricingStrategiesProps {
  strategies: PricingStrategy[];
}

const strategyTypeColors = {
  "value-based": "bg-blue-100 text-blue-800",
  competitive: "bg-green-100 text-green-800",
  dynamic: "bg-purple-100 text-purple-800",
  tiered: "bg-orange-100 text-orange-800",
  penetration: "bg-red-100 text-red-800",
  skimming: "bg-indigo-100 text-indigo-800",
  discrimination: "bg-yellow-100 text-yellow-800",
};

export function PricingStrategies({ strategies }: PricingStrategiesProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Pricing Strategies
          </h2>
          <p className="text-gray-600">
            Optimize pricing across your product portfolio
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Target className="w-4 h-4 mr-2" />
          Create Strategy
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {strategies.map((strategy) => (
          <Card key={strategy.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{strategy.name}</CardTitle>
                <Badge className={strategyTypeColors[strategy.type]}>
                  {strategy.type.replace("-", " ")}
                </Badge>
              </div>
              <CardDescription className="text-sm">
                {strategy.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-600">Current Price</span>
                </div>
                <span className="text-xl font-bold">
                  ${strategy.currentPrice}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-600">Suggested Price</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-bold text-blue-600">
                    ${strategy.suggestedPrice}
                  </span>
                  {strategy.suggestedPrice > strategy.currentPrice ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Confidence</span>
                  <span className="font-medium">{strategy.confidence}%</span>
                </div>
                <Progress value={strategy.confidence} className="h-2" />
              </div>

              <div className="grid grid-cols-3 gap-4 pt-3 border-t">
                <div className="text-center">
                  <div className="text-xs text-gray-500">Expected Revenue</div>
                  <div className="font-semibold">
                    ${(strategy.expectedRevenue / 1000000).toFixed(1)}M
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500">Market Share</div>
                  <div className="font-semibold">{strategy.marketShare}%</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500">Margin</div>
                  <div className="font-semibold">{strategy.profitMargin}%</div>
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <BarChart3 className="w-3 h-3 mr-1" />
                  Analyze
                </Button>
                <Button
                  size="sm"
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Apply Price
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
