import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
import { type CompetitorAnalysis } from "@/lib/pricing-data";

interface CompetitiveAnalysisProps {
  competitors: CompetitorAnalysis[];
  onRefresh: () => void;
}

const positionColors = {
  premium: "bg-purple-100 text-purple-800",
  "mid-market": "bg-blue-100 text-blue-800",
  budget: "bg-green-100 text-green-800",
};

export function CompetitiveAnalysis({
  competitors,
  onRefresh,
}: CompetitiveAnalysisProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Competitive Analysis
          </h2>
          <p className="text-gray-600">
            Monitor competitor pricing and market positioning
          </p>
        </div>
        <Button onClick={onRefresh} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {competitors.map((competitor) => (
          <Card
            key={competitor.id}
            className="hover:shadow-md transition-shadow"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {competitor.competitor}
                    </h3>
                    <Badge className={positionColors[competitor.position]}>
                      {competitor.position}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      Updated {formatDate(competitor.lastUpdated)}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-3">{competitor.product}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {competitor.features.map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="text-right space-y-2">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      ${competitor.price}
                    </div>
                    <div className="text-sm text-gray-500">Current Price</div>
                  </div>

                  <div>
                    <div className="flex items-center justify-end space-x-1">
                      <span className="text-lg font-semibold">
                        {competitor.marketShare}%
                      </span>
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    </div>
                    <div className="text-sm text-gray-500">Market Share</div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button variant="outline" size="sm">
                  <Eye className="w-3 h-3 mr-1" />
                  View Details
                </Button>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Compare Features
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Pricing Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-900">
                $
                {Math.round(
                  competitors.reduce((acc, c) => acc + c.price, 0) /
                    competitors.length,
                )}
              </div>
              <div className="text-sm text-blue-700">Average Price</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-900">
                {Math.round(
                  competitors.reduce((acc, c) => acc + c.marketShare, 0),
                )}
                %
              </div>
              <div className="text-sm text-blue-700">Total Market Coverage</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-900">
                {competitors.filter((c) => c.position === "premium").length}
              </div>
              <div className="text-sm text-blue-700">Premium Competitors</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
