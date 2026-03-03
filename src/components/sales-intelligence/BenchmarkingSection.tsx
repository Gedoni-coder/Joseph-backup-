import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

interface Benchmark {
  metric: string;
  yourPerformance: string;
  industryAverage: string;
  difference: number;
  isPositive: boolean;
  insight: string;
}

const BenchmarkingSection = () => {
  const benchmarks: Benchmark[] = [
    {
      metric: "Win Rate",
      yourPerformance: "22%",
      industryAverage: "18%",
      difference: 22.2,
      isPositive: true,
      insight:
        "Your win rate is 22% higher than industry average. Excellent performance!",
    },
    {
      metric: "Sales Cycle Length",
      yourPerformance: "28 days",
      industryAverage: "35 days",
      difference: -20,
      isPositive: true,
      insight: "You close deals 7 days faster than the industry average.",
    },
    {
      metric: "Average Deal Size",
      yourPerformance: "$13.9K",
      industryAverage: "$12.5K",
      difference: 11.2,
      isPositive: true,
      insight: "Your average deal size is 11.2% higher than competitors.",
    },
    {
      metric: "Lead Conversion Rate",
      yourPerformance: "28.5%",
      industryAverage: "22%",
      difference: 29.5,
      isPositive: true,
      insight: "Your conversion rate exceeds industry standards significantly.",
    },
    {
      metric: "Cost per Sale",
      yourPerformance: "$1,200",
      industryAverage: "$1,500",
      difference: -20,
      isPositive: true,
      insight: "You acquire customers at 20% lower cost than industry average.",
    },
    {
      metric: "Sales Cost Ratio",
      yourPerformance: "12.5%",
      industryAverage: "15%",
      difference: -16.7,
      isPositive: true,
      insight: "Your sales efficiency is better than industry benchmarks.",
    },
  ];

  const performanceComparisons = [
    {
      title: "Performance vs Last Quarter",
      comparisons: [
        {
          metric: "Win Rate",
          thisQuarter: "22%",
          lastQuarter: "18%",
          change: 22.2,
        },
        {
          metric: "Revenue",
          thisQuarter: "$750K",
          lastQuarter: "$680K",
          change: 10.3,
        },
        {
          metric: "Sales Cycle",
          thisQuarter: "28 days",
          lastQuarter: "32 days",
          change: -12.5,
        },
      ],
    },
    {
      title: "Top Sales Rep Performance",
      comparisons: [
        {
          metric: "Deals Closed",
          thisQuarter: "18",
          lastQuarter: "14",
          change: 28.6,
        },
        {
          metric: "Revenue",
          thisQuarter: "$245K",
          lastQuarter: "$210K",
          change: 16.7,
        },
        {
          metric: "Win Rate",
          thisQuarter: "35%",
          lastQuarter: "28%",
          change: 25.0,
        },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Industry Benchmarking */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Industry Benchmarking</h3>
        <div className="grid grid-cols-1 gap-4">
          {benchmarks.map((benchmark, idx) => (
            <Card key={idx}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h4 className="font-semibold text-sm">
                        {benchmark.metric}
                      </h4>
                      {benchmark.isPositive ? (
                        <Badge
                          variant="default"
                          className="bg-green-100 text-green-800 border-0"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Above Average
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-orange-600">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Below Average
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">
                          Your Performance
                        </p>
                        <p className="text-lg font-bold text-blue-600">
                          {benchmark.yourPerformance}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">
                          Industry Average
                        </p>
                        <p className="text-lg font-bold text-gray-600">
                          {benchmark.industryAverage}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Difference</p>
                        <div className="flex items-center gap-1">
                          {benchmark.difference >= 0 ? (
                            <>
                              <TrendingUp className="h-4 w-4 text-green-600" />
                              <p className="text-lg font-bold text-green-600">
                                +{Math.abs(benchmark.difference).toFixed(1)}%
                              </p>
                            </>
                          ) : (
                            <>
                              <TrendingDown className="h-4 w-4 text-red-600" />
                              <p className="text-lg font-bold text-red-600">
                                {benchmark.difference.toFixed(1)}%
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-blue-50 rounded border border-blue-200">
                      <p className="text-sm text-blue-900">
                        💡 {benchmark.insight}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Performance Comparisons */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Performance Comparisons</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {performanceComparisons.map((comparison, idx) => (
            <Card key={idx}>
              <CardHeader>
                <CardTitle className="text-base">{comparison.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {comparison.comparisons.map((item, itemIdx) => (
                    <div
                      key={itemIdx}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.metric}</p>
                        <div className="flex gap-3 mt-2 text-xs text-gray-600">
                          <span>This: {item.thisQuarter}</span>
                          <span>•</span>
                          <span>Previous: {item.lastQuarter}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          {item.change >= 0 ? (
                            <>
                              <TrendingUp className="h-4 w-4 text-green-600" />
                              <p className="text-sm font-bold text-green-600">
                                +{item.change.toFixed(1)}%
                              </p>
                            </>
                          ) : (
                            <>
                              <TrendingDown className="h-4 w-4 text-red-600" />
                              <p className="text-sm font-bold text-red-600">
                                {item.change.toFixed(1)}%
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BenchmarkingSection;
