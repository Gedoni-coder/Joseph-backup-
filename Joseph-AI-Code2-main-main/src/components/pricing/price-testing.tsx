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
import { Play, Pause, Trophy, Plus, BarChart3 } from "lucide-react";
import { type PriceTest } from "@/lib/pricing-data";

interface PriceTestingProps {
  tests: PriceTest[];
}

const statusColors = {
  running: "bg-green-100 text-green-800",
  completed: "bg-blue-100 text-blue-800",
  paused: "bg-yellow-100 text-yellow-800",
};

const testTypeColors = {
  "A/B": "bg-purple-100 text-purple-800",
  multivariate: "bg-orange-100 text-orange-800",
  sequential: "bg-teal-100 text-teal-800",
};

export function PriceTesting({ tests }: PriceTestingProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const getWinningVariant = (test: PriceTest) => {
    if (test.winningVariant) {
      return test.variants.find((v) => v.id === test.winningVariant);
    }
    // For running tests, show the variant with highest revenue
    return test.variants.reduce((best, current) =>
      current.revenue > best.revenue ? current : best,
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Price Testing & Optimization
          </h2>
          <p className="text-gray-600">
            A/B test different pricing strategies to maximize revenue
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          New Test
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {tests.map((test) => {
          const winningVariant = getWinningVariant(test);

          return (
            <Card key={test.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{test.name}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge className={testTypeColors[test.testType]}>
                      {test.testType}
                    </Badge>
                    <Badge className={statusColors[test.status]}>
                      {test.status}
                    </Badge>
                  </div>
                </div>
                <CardDescription>
                  {formatDate(test.startDate)} -{" "}
                  {test.endDate ? formatDate(test.endDate) : "Ongoing"}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      Statistical Confidence
                    </span>
                    <span className="font-medium">{test.confidence}%</span>
                  </div>
                  <Progress value={test.confidence} className="h-2" />
                </div>

                <div className="space-y-3">
                  {test.variants.map((variant) => (
                    <div
                      key={variant.id}
                      className={`p-3 rounded-lg border ${
                        variant.id === winningVariant?.id
                          ? "bg-green-50 border-green-200"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{variant.name}</span>
                          {variant.id === winningVariant?.id && (
                            <Trophy className="w-4 h-4 text-green-600" />
                          )}
                        </div>
                        <div className="text-lg font-bold">
                          ${variant.price}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <div className="text-gray-500">Conversions</div>
                          <div className="font-medium">
                            {variant.conversions.toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500">Revenue</div>
                          <div className="font-medium">
                            ${variant.revenue.toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500">Conv. Rate</div>
                          <div className="font-medium">
                            {variant.conversionRate}%
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex space-x-2 pt-2">
                  {test.status === "running" ? (
                    <Button variant="outline" size="sm" className="flex-1">
                      <Pause className="w-3 h-3 mr-1" />
                      Pause
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" className="flex-1">
                      <Play className="w-3 h-3 mr-1" />
                      Resume
                    </Button>
                  )}
                  <Button
                    size="sm"
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    <BarChart3 className="w-3 h-3 mr-1" />
                    View Results
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Testing Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">
                Best Practices
              </h4>
              <ul className="space-y-1 text-blue-700">
                <li>• Run tests for at least 2 weeks</li>
                <li>• Ensure sufficient sample size</li>
                <li>• Test one variable at a time</li>
                <li>• Monitor external factors</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">
                Success Metrics
              </h4>
              <ul className="space-y-1 text-blue-700">
                <li>• Statistical significance &gt; 95%</li>
                <li>• Practical significance &gt; 5%</li>
                <li>• Consistent results over time</li>
                <li>• Positive long-term impact</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
