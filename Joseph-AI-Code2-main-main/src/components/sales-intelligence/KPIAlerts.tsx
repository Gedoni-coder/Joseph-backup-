import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Lightbulb,
  X,
} from "lucide-react";
import { useState } from "react";

interface Alert {
  id: string;
  type: "critical" | "warning" | "success" | "info";
  title: string;
  description: string;
  metric: string;
  value: string;
  action?: string;
}

interface Insight {
  id: string;
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  recommendation: string;
}

const KPIAlerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: "alert-1",
      type: "critical",
      title: "Revenue Below Target",
      description: "Revenue is 10% below target this month.",
      metric: "Monthly Revenue",
      value: "$250K vs $280K target",
      action: "Review sales pipeline and increase outreach",
    },
    {
      id: "alert-2",
      type: "warning",
      title: "Sales Cycle Increasing",
      description: "Sales cycle has increased from 21 to 30 days.",
      metric: "Sales Cycle Length",
      value: "30 days (+43% vs average)",
      action: "Identify bottlenecks in deal closure process",
    },
    {
      id: "alert-3",
      type: "success",
      title: "Lead Conversion Rate Improved",
      description: "Lead conversion rate has improved significantly.",
      metric: "Lead Conversion Rate",
      value: "28.5% (+8.8% vs last month)",
    },
    {
      id: "alert-4",
      type: "warning",
      title: "Win Rate Declining",
      description:
        "Your win rate is trending downward for the second consecutive month.",
      metric: "Win Rate",
      value: "18% (-5% vs last month)",
      action: "Review competitive positioning and pricing strategy",
    },
    {
      id: "alert-5",
      type: "info",
      title: "Pipeline Coverage Healthy",
      description: "Your pipeline coverage ratio remains strong at 8.5x.",
      metric: "Pipeline Coverage",
      value: "8.5x (well above 3x recommendation)",
    },
    {
      id: "alert-6",
      type: "critical",
      title: "Cost per Sale Increasing",
      description: "Cost per sale has increased by 12% this month.",
      metric: "Cost per Sale",
      value: "$1,200 (+12% vs average)",
      action: "Optimize marketing spend and sales efficiency",
    },
  ]);

  const insights: Insight[] = [
    {
      id: "insight-1",
      title: "Demo-to-Close Rate Opportunity",
      description:
        "Your demo-to-close rate (35.2%) is above industry average (28%), but there's room for improvement.",
      impact: "medium",
      recommendation:
        "Focus on improving demo quality and addressing objections early in the process. Consider implementing a demo coaching program.",
    },
    {
      id: "insight-2",
      title: "Cross-Sell Opportunity Gap",
      description:
        "Your upsell/cross-sell rate (18.5%) lags behind high-performing companies (25-30%).",
      impact: "high",
      recommendation:
        "Implement a structured cross-sell program targeting existing customers. Identify products that complement recent purchases.",
    },
    {
      id: "insight-3",
      title: "Sales Rep Productivity Variance",
      description:
        "Top performer has 3x the conversion rate of average performers.",
      impact: "high",
      recommendation:
        "Document best practices from top performers. Create a mentorship program to share effective sales techniques.",
    },
    {
      id: "insight-4",
      title: "Deal Size Growth Trend",
      description:
        "Average deal size has grown 12% over the last 6 months, indicating successful upselling.",
      impact: "medium",
      recommendation:
        "Continue current sales strategies. Consider raising deal size targets for Q3.",
    },
    {
      id: "insight-5",
      title: "Pipeline Velocity Strong",
      description:
        "Your pipeline velocity (value flowing through pipeline) is 15% ahead of plan.",
      impact: "low",
      recommendation:
        "Maintain current pace. Monitor for seasonal fluctuations and plan for Q4 accordingly.",
    },
  ];

  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);

  const getAlertIcon = (type: Alert["type"]) => {
    switch (type) {
      case "critical":
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-orange-600" />;
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "info":
        return <TrendingUp className="h-5 w-5 text-blue-600" />;
    }
  };

  const getAlertColor = (type: Alert["type"]) => {
    switch (type) {
      case "critical":
        return "border-red-200 bg-red-50";
      case "warning":
        return "border-orange-200 bg-orange-50";
      case "success":
        return "border-green-200 bg-green-50";
      case "info":
        return "border-blue-200 bg-blue-50";
    }
  };

  const getImpactColor = (impact: Insight["impact"]) => {
    switch (impact) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-orange-100 text-orange-800";
      case "low":
        return "bg-green-100 text-green-800";
    }
  };

  const visibleAlerts = alerts.filter(
    (alert) => !dismissedAlerts.includes(alert.id),
  );

  return (
    <div className="space-y-6">
      {/* KPI Alerts */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Active Alerts</h3>
        {visibleAlerts.length === 0 ? (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-6 text-center">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
              <p className="text-lg font-semibold text-green-900">All Clear!</p>
              <p className="text-sm text-green-800 mt-1">
                No active alerts. Your KPIs are performing within expected
                ranges.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {visibleAlerts.map((alert) => (
              <Card
                key={alert.id}
                className={`border-2 ${getAlertColor(alert.type)}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3 flex-1">
                      {getAlertIcon(alert.type)}
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{alert.title}</h4>
                        <p className="text-sm text-gray-700 mt-1">
                          {alert.description}
                        </p>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          <Badge variant="outline" className="text-xs">
                            {alert.metric}: {alert.value}
                          </Badge>
                        </div>
                        {alert.action && (
                          <div className="mt-3 p-2 bg-white bg-opacity-50 rounded">
                            <p className="text-xs font-medium text-gray-900">
                              💡 Recommended action: {alert.action}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        setDismissedAlerts([...dismissedAlerts, alert.id])
                      }
                      className="text-gray-500 hover:text-gray-700 ml-2"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* AI-Generated Insights */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Smart Insights</h3>
        <div className="grid grid-cols-1 gap-4">
          {insights.map((insight) => (
            <Card key={insight.id}>
              <CardContent className="p-6">
                <div className="flex gap-3">
                  <Lightbulb className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-sm">{insight.title}</h4>
                      <Badge
                        className={`text-xs ${getImpactColor(insight.impact)}`}
                      >
                        {insight.impact === "high"
                          ? "High Impact"
                          : insight.impact === "medium"
                            ? "Medium Impact"
                            : "Low Impact"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">
                      {insight.description}
                    </p>
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                      <p className="text-xs font-medium text-blue-900">
                        ✅ Recommendation:
                      </p>
                      <p className="text-xs text-blue-800 mt-1">
                        {insight.recommendation}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KPIAlerts;
