import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Target, Award } from "lucide-react";
import { useCurrency } from "@/hooks/useCurrency";

export const BenchmarkingSection = () => {
  const { format } = useCurrency();
  const benchmarks = [
    {
      kpi: "Win Rate",
      yourValue: "34%",
      industryAvg: "28%",
      topPerformer: "42%",
      lastQuarter: "31%",
      status: "above",
      insight:
        "Your win rate is higher than the industry average. Good job! Keep this momentum.",
    },
    {
      kpi: "Sales Cycle Length",
      yourValue: "25 days",
      industryAvg: "30 days",
      topPerformer: "18 days",
      lastQuarter: "28 days",
      status: "above",
      insight:
        "You're closing deals faster than average. Continue optimizing your process.",
    },
    {
      kpi: "Average Deal Size",
      yourValue: format(45200),
      industryAvg: format(38000),
      topPerformer: format(62000),
      lastQuarter: format(42100),
      status: "above",
      insight:
        "Deal sizes are growing. Your premium positioning is working effectively.",
    },
    {
      kpi: "Lead Conversion Rate",
      yourValue: "28%",
      industryAvg: "22%",
      topPerformer: "35%",
      lastQuarter: "24%",
      status: "above",
      insight:
        "Lead qualification process is strong. Consider sharing best practices.",
    },
    {
      kpi: "Sales Cost Ratio",
      yourValue: "14%",
      industryAvg: "18%",
      topPerformer: "10%",
      lastQuarter: "16%",
      status: "above",
      insight:
        "Cost efficiency is improving. Revenue growth is outpacing expenses.",
    },
    {
      kpi: "Customer Retention Rate",
      yourValue: "82%",
      industryAvg: "85%",
      topPerformer: "92%",
      lastQuarter: "79%",
      status: "below",
      insight:
        "Retention is below average. Focus on customer success programs.",
    },
  ];

  const getStatusColor = (status: string) => {
    return status === "above"
      ? "bg-green-50 border-green-200"
      : "bg-orange-50 border-orange-200";
  };

  const getStatusIcon = (status: string) => {
    return status === "above" ? (
      <TrendingUp className="h-5 w-5 text-green-600" />
    ) : (
      <TrendingDown className="h-5 w-5 text-orange-600" />
    );
  };

  return (
    <div className="space-y-6">
      {/* Benchmarking Overview */}
      <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-blue-600" />
            Benchmarking Overview
          </CardTitle>
          <CardDescription>
            Compare your KPIs against industry averages and top performers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">Your Performance</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-blue-700">4</span>
                <span className="text-gray-600">KPIs Above Average</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Industry Average</p>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-gray-700">SaaS</span>
                <Badge variant="outline">B2B Sales</Badge>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Performance Gap</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-green-600">+15%</span>
                <span className="text-gray-600">vs Average</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Benchmarks */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">KPI Benchmarking Details</h2>
        {benchmarks.map((benchmark, idx) => (
          <Card key={idx} className={getStatusColor(benchmark.status)}>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {/* Header with KPI name and status */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{benchmark.kpi}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(benchmark.status)}
                    <Badge
                      variant={
                        benchmark.status === "above" ? "default" : "secondary"
                      }
                    >
                      {benchmark.status === "above" ? "Above Avg" : "Below Avg"}
                    </Badge>
                  </div>
                </div>

                {/* Comparison Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-3 bg-white rounded-lg border">
                    <p className="text-xs text-gray-600 mb-1">Your Value</p>
                    <p className="text-xl font-bold text-gray-900">
                      {benchmark.yourValue}
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded-lg border">
                    <p className="text-xs text-gray-600 mb-1">Industry Avg</p>
                    <p className="text-lg font-semibold text-gray-700">
                      {benchmark.industryAvg}
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded-lg border">
                    <p className="text-xs text-gray-600 mb-1">Top Performer</p>
                    <p className="text-lg font-semibold text-green-700">
                      {benchmark.topPerformer}
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded-lg border">
                    <p className="text-xs text-gray-600 mb-1">Last Quarter</p>
                    <p className="text-lg font-semibold text-blue-700">
                      {benchmark.lastQuarter}
                    </p>
                  </div>
                </div>

                {/* Insight Box */}
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800">
                    💡 {benchmark.insight}
                  </p>
                </div>

                {/* Progress Bar showing comparison */}
                <div>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-gray-600">Industry Average</span>
                    <span className="text-gray-600">You</span>
                    <span className="text-gray-600">Top Performer</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 relative">
                    {/* Industry Average marker */}
                    <div
                      className="absolute h-2 w-1 bg-blue-500 top-0 rounded-full -ml-0.5"
                      style={{ left: "40%" }}
                    ></div>
                    {/* Your Value marker */}
                    <div
                      className="absolute h-2 w-1 bg-green-600 top-0 rounded-full -ml-0.5"
                      style={{ left: "60%" }}
                    ></div>
                    {/* Top Performer marker */}
                    <div
                      className="absolute h-2 w-1 bg-purple-600 top-0 rounded-full -ml-0.5"
                      style={{ left: "85%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Peer Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Performance vs Your Top Sales Rep</CardTitle>
          <CardDescription>
            Learn from your highest performer to set aspirational targets
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">KPI</th>
                  <th className="text-center py-3 px-4 font-semibold">
                    Team Avg
                  </th>
                  <th className="text-center py-3 px-4 font-semibold">
                    Top Rep (Sarah)
                  </th>
                  <th className="text-center py-3 px-4 font-semibold">Gap</th>
                  <th className="text-left py-3 px-4 font-semibold">Insight</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    kpi: "Calls per Day",
                    teamAvg: "16",
                    topRep: "22",
                    gap: "+38%",
                    insight: "Sarah makes 38% more calls daily",
                  },
                  {
                    kpi: "Win Rate",
                    teamAvg: "31%",
                    topRep: "45%",
                    gap: "+45%",
                    insight:
                      "Her superior positioning skills show in closing rates",
                  },
                  {
                    kpi: "Avg Deal Size",
                    teamAvg: "$42K",
                    topRep: "$58K",
                    gap: "+38%",
                    insight: "Focuses on high-value opportunities",
                  },
                  {
                    kpi: "Sales Cycle",
                    teamAvg: "28 days",
                    topRep: "19 days",
                    gap: "-32%",
                    insight: "Faster decision-making with clients",
                  },
                  {
                    kpi: "Customer Retention",
                    teamAvg: "79%",
                    topRep: "94%",
                    gap: "+19%",
                    insight: "Excellent customer relationship management",
                  },
                ].map((row, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-semibold">{row.kpi}</td>
                    <td className="text-center py-3 px-4">{row.teamAvg}</td>
                    <td className="text-center py-3 px-4 text-green-700 font-semibold">
                      {row.topRep}
                    </td>
                    <td className="text-center py-3 px-4">
                      <Badge variant="outline">{row.gap}</Badge>
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-600">
                      {row.insight}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Actionable Recommendations */}
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg mt-4">
            <h4 className="font-semibold text-green-900 mb-2">
              🎯 How to Close the Gap
            </h4>
            <ul className="space-y-1 text-sm text-green-800">
              <li>
                • Schedule daily coaching call with Sarah to learn her
                prospecting approach
              </li>
              <li>
                • Implement her lead qualification framework across the team
              </li>
              <li>
                • Set up mentoring sessions to improve deal sizing and
                positioning
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
