import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TaxAvoidanceRecommendation } from "@/lib/tax-compliance-data";
import {
  Lightbulb,
  DollarSign,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Award,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TaxRecommendationsProps {
  recommendations: TaxAvoidanceRecommendation[];
  onImplement: (id: string) => void;
  title?: string;
}

export function TaxRecommendations({
  recommendations,
  onImplement,
  title = "Tax Avoidance Recommendations",
}: TaxRecommendationsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getCategoryIcon = (
    category: TaxAvoidanceRecommendation["category"],
  ) => {
    switch (category) {
      case "deduction":
        return <TrendingUp className="h-4 w-4 text-blue-600" />;
      case "credit":
        return <Award className="h-4 w-4 text-green-600" />;
      case "timing":
        return <Clock className="h-4 w-4 text-orange-600" />;
      case "structure":
        return <Lightbulb className="h-4 w-4 text-purple-600" />;
      case "investment":
        return <DollarSign className="h-4 w-4 text-indigo-600" />;
      default:
        return <Lightbulb className="h-4 w-4 text-gray-600" />;
    }
  };

  const getCategoryColor = (
    category: TaxAvoidanceRecommendation["category"],
  ) => {
    switch (category) {
      case "deduction":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "credit":
        return "bg-green-100 text-green-800 border-green-200";
      case "timing":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "structure":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "investment":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getComplexityColor = (
    complexity: TaxAvoidanceRecommendation["complexity"],
  ) => {
    switch (complexity) {
      case "low":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "high":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (
    priority: TaxAvoidanceRecommendation["priority"],
  ) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const totalSavings = recommendations.reduce(
    (sum, rec) => sum + rec.potentialSavings,
    0,
  );
  const implementedSavings = recommendations
    .filter((rec) => rec.implemented)
    .reduce((sum, rec) => sum + rec.potentialSavings, 0);

  const groupedRecommendations = recommendations.reduce(
    (acc, rec) => {
      if (!acc[rec.category]) {
        acc[rec.category] = [];
      }
      acc[rec.category].push(rec);
      return acc;
    },
    {} as Record<string, TaxAvoidanceRecommendation[]>,
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-blue-600" />
          {title}
        </h3>
        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
          {recommendations.length} recommendations
        </Badge>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">
                  Total Potential Savings
                </div>
                <div className="text-xl font-bold text-blue-600">
                  {formatCurrency(totalSavings)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Implemented Savings</div>
                <div className="text-xl font-bold text-green-600">
                  {formatCurrency(implementedSavings)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">
                  Remaining Opportunity
                </div>
                <div className="text-xl font-bold text-orange-600">
                  {formatCurrency(totalSavings - implementedSavings)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Implementation Progress */}
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="text-base">Implementation Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Savings Realized</span>
              <span className="font-semibold">
                {((implementedSavings / totalSavings) * 100).toFixed(1)}%
              </span>
            </div>
            <Progress
              value={(implementedSavings / totalSavings) * 100}
              className="h-3"
            />
            <div className="flex justify-between text-xs text-gray-600">
              <span>{formatCurrency(implementedSavings)} implemented</span>
              <span>{formatCurrency(totalSavings)} total potential</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations by Category */}
      <div className="space-y-6">
        {Object.entries(groupedRecommendations).map(([category, recs]) => (
          <div key={category}>
            <div className="flex items-center gap-2 mb-4">
              {getCategoryIcon(category as any)}
              <h4 className="font-semibold capitalize">
                {category} Strategies
              </h4>
              <Badge
                className={cn("text-xs", getCategoryColor(category as any))}
              >
                {recs.length}
              </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {recs.map((rec) => (
                <Card
                  key={rec.id}
                  className={cn(
                    "transition-all hover:shadow-md",
                    rec.implemented
                      ? "border-green-200 bg-green-50"
                      : "border-gray-200",
                  )}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-sm font-medium">
                          {rec.title}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={cn(
                              "text-xs",
                              getPriorityColor(rec.priority),
                            )}
                          >
                            {rec.priority} priority
                          </Badge>
                          <Badge
                            className={cn(
                              "text-xs",
                              getComplexityColor(rec.complexity),
                            )}
                          >
                            {rec.complexity} complexity
                          </Badge>
                        </div>
                      </div>
                      {rec.implemented && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {rec.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-gray-500">
                          Potential Savings
                        </div>
                        <div className="text-lg font-bold text-blue-600">
                          {formatCurrency(rec.potentialSavings)}
                        </div>
                      </div>
                      {rec.deadline && (
                        <div className="text-right">
                          <div className="text-xs text-gray-500">Deadline</div>
                          <div className="text-sm font-medium text-red-600">
                            {rec.deadline.toLocaleDateString()}
                          </div>
                        </div>
                      )}
                    </div>

                    {rec.requirements.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-xs font-medium text-gray-700">
                          Requirements:
                        </div>
                        <ul className="space-y-1">
                          {rec.requirements.map((req, index) => (
                            <li
                              key={index}
                              className="text-xs text-gray-600 flex items-start gap-2"
                            >
                              <div className="w-1 h-1 rounded-full bg-gray-400 mt-2 flex-shrink-0" />
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {!rec.implemented && (
                      <Button
                        onClick={() => onImplement(rec.id)}
                        size="sm"
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Implement Strategy
                      </Button>
                    )}

                    {rec.implemented && (
                      <div className="flex items-center gap-2 text-sm text-green-700 bg-green-100 p-2 rounded">
                        <CheckCircle className="h-4 w-4" />
                        Strategy Implemented
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
