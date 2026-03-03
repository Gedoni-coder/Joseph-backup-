import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, TrendingDown, Lightbulb, Zap } from "lucide-react";

export const KPIAlertsInsights = () => {
  const [alertsFilter, setAlertsFilter] = useState("all");

  const alerts = [
    {
      id: 1,
      type: "critical",
      icon: "🚨",
      title: "Revenue Below Target",
      message: "Current revenue is 10% below target this month",
      relatedKPI: "Monthly Revenue",
      currentValue: "$220K of $245K",
      recommendation: "Review pipeline and accelerate deals in advanced stages",
      timestamp: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      type: "warning",
      icon: "⚠️",
      title: "Sales Cycle Extended",
      message: "Average sales cycle has increased from 21 to 30 days",
      relatedKPI: "Sales Cycle Length",
      currentValue: "30 days (+9 days)",
      recommendation:
        "Check for bottlenecks in approval process and increase follow-up frequency",
      timestamp: "5 hours ago",
      read: false,
    },
    {
      id: 3,
      type: "critical",
      icon: "🚨",
      title: "Deal Pipeline Risk",
      message: "3 major deals showing stall signals in negotiation stage",
      relatedKPI: "Pipeline Health",
      currentValue: "$185K at risk",
      recommendation:
        "Implement rescue playbooks and schedule executive check-ins",
      timestamp: "8 hours ago",
      read: true,
    },
    {
      id: 4,
      type: "success",
      icon: "✅",
      title: "Lead Conversion Improved",
      message: "Lead conversion rate has improved to 28% (was 24% last month)",
      relatedKPI: "Lead Conversion Rate",
      currentValue: "28% (+4%)",
      recommendation:
        "Continue current qualification process and share training with team",
      timestamp: "1 day ago",
      read: true,
    },
    {
      id: 5,
      type: "warning",
      icon: "⚠️",
      title: "Win Rate Declining",
      message: "Deal win rate trending down in past 2 weeks",
      relatedKPI: "Win Rate",
      currentValue: "32% (-2%)",
      recommendation:
        "Analyze lost deals and competitive positioning strategy",
      timestamp: "1 day ago",
      read: true,
    },
    {
      id: 6,
      type: "success",
      icon: "✅",
      title: "Cost Efficiency Improved",
      message: "Sales cost ratio has decreased from 16% to 14%",
      relatedKPI: "Sales Cost Ratio",
      currentValue: "14% (-2%)",
      recommendation:
        "Revenue growth outpacing costs. Monitor to maintain ratio.",
      timestamp: "2 days ago",
      read: true,
    },
  ];

  const insights = [
    {
      id: 1,
      icon: "📊",
      title: "Weekly Performance Summary",
      insights: [
        "Team generated 12 new leads this week, on pace for 48/month",
        "Win rate remains strong at 34%, up from 31% last month",
        "Average deal size growing at $3.1K per month trend",
        "Sales cycle optimized: 25 days average (down from 28 days)",
      ],
    },
    {
      id: 2,
      icon: "👥",
      title: "Team Performance Insights",
      insights: [
        "Sarah Johnson continues to lead with 125% target achievement",
        "Mike Chen improving: 118% (up from 112% last month)",
        "Lisa Rodriguez needs support: coaching program recommended",
        "Team average: 111% of target (above expectations)",
      ],
    },
    {
      id: 3,
      icon: "💡",
      title: "Strategic Recommendations",
      insights: [
        "Pipeline expansion: Focus on more top-of-funnel activity",
        "Deal rescue: 3 deals at risk can generate $180K if recovered",
        "Team coaching: Share Sarah's best practices with underperformers",
        "Process optimization: Reduce sales cycle by 3-5 days target",
      ],
    },
    {
      id: 4,
      icon: "🎯",
      title: "Upcoming Targets & Forecasts",
      insights: [
        "February forecast: $238K (conservative estimate)",
        "Q1 projection: $515K (92% of annual target tracking)",
        "Pipeline health: 1.8x coverage (secure revenue base)",
        "Growth trajectory: On pace for 28% year-over-year growth",
      ],
    },
  ];

  const filteredAlerts = alerts.filter((alert) => {
    if (alertsFilter === "unread") return !alert.read;
    if (alertsFilter === "critical") return alert.type === "critical";
    return true;
  });

  const getAlertColor = (type: string) => {
    switch (type) {
      case "critical":
        return "bg-red-50 border-red-200";
      case "warning":
        return "bg-orange-50 border-orange-200";
      case "success":
        return "bg-green-50 border-green-200";
      default:
        return "bg-blue-50 border-blue-200";
    }
  };

  const getAlertBadgeVariant = (type: string) => {
    switch (type) {
      case "critical":
        return "destructive";
      case "warning":
        return "secondary";
      case "success":
        return "default";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-6">
      {/* Alerts Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>KPI Alerts & Notifications</CardTitle>
              <CardDescription>
                Real-time alerts for significant KPI changes
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 bg-red-100 px-3 py-1 rounded-full">
              <div className="h-2 w-2 bg-red-600 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-red-800">2 Active</span>
            </div>
          </div>
        </CardHeader>

        {/* Filter Tabs */}
        <div className="px-6 py-3 border-b flex gap-2">
          <Button
            variant={alertsFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setAlertsFilter("all")}
          >
            All ({alerts.length})
          </Button>
          <Button
            variant={alertsFilter === "unread" ? "default" : "outline"}
            size="sm"
            onClick={() => setAlertsFilter("unread")}
          >
            Unread ({alerts.filter((a) => !a.read).length})
          </Button>
          <Button
            variant={alertsFilter === "critical" ? "default" : "outline"}
            size="sm"
            onClick={() => setAlertsFilter("critical")}
          >
            Critical ({alerts.filter((a) => a.type === "critical").length})
          </Button>
        </div>

        <CardContent className="pt-6 space-y-4">
          {filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border-2 ${getAlertColor(
                alert.type
              )} ${alert.read ? "opacity-75" : ""}`}
            >
              <div className="flex items-start gap-4">
                {/* Alert Icon */}
                <div className="text-2xl mt-1">{alert.icon}</div>

                {/* Alert Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{alert.title}</h3>
                      <p className="text-sm text-gray-700 mt-1">
                        {alert.message}
                      </p>
                    </div>
                    {!alert.read && (
                      <div className="h-3 w-3 bg-red-600 rounded-full flex-shrink-0 mt-2"></div>
                    )}
                  </div>

                  {/* Alert Details */}
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-600">KPI:</span>
                      <Badge variant="outline">{alert.relatedKPI}</Badge>
                      <span className="font-semibold text-gray-700">
                        {alert.currentValue}
                      </span>
                    </div>

                    {/* Recommendation */}
                    <div className="p-3 bg-white rounded border flex items-start gap-2">
                      <Lightbulb className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-semibold text-gray-800">
                          Recommended Action:
                        </p>
                        <p className="text-gray-700">{alert.recommendation}</p>
                      </div>
                    </div>

                    {/* Timestamp */}
                    <p className="text-xs text-gray-500">{alert.timestamp}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredAlerts.length === 0 && (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
              <p className="text-gray-600">All KPIs are performing well!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Insights Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Weekly Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {insights.map((insight) => (
            <Card key={insight.id}>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <span className="text-2xl">{insight.icon}</span>
                  {insight.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {insight.insights.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-sm text-gray-700"
                    >
                      <Zap className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* AI Coaching Tips */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🤖</span>
            AI Sales Coaching
          </CardTitle>
          <CardDescription>
            Personalized recommendations based on your KPI performance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-lg border border-purple-200">
              <h4 className="font-semibold text-purple-900 mb-2">
                For Your Sales Team
              </h4>
              <ul className="space-y-2 text-sm text-purple-800">
                <li>✓ Implement 15-minute daily stand-ups to track pipeline</li>
                <li>✓ Use power words in your emails (results, guaranteed)</li>
                <li>
                  ✓ Schedule calls between 10 AM - 12 PM for best reach rates
                </li>
                <li>✓ Add video follow-up messages to increase engagement</li>
              </ul>
            </div>
            <div className="p-4 bg-white rounded-lg border border-purple-200">
              <h4 className="font-semibold text-purple-900 mb-2">
                For Sales Management
              </h4>
              <ul className="space-y-2 text-sm text-purple-800">
                <li>✓ Schedule coaching sessions with Lisa Rodriguez</li>
                <li>✓ Have Sarah mentor the team on deal sizing</li>
                <li>✓ Review competitive analysis for won/lost deals</li>
                <li>✓ Implement 1-on-1 check-ins for early-stage deals</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alert Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Alert Configuration</CardTitle>
          <CardDescription>
            Manage which KPI changes trigger notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="text-sm font-semibold">Revenue Alerts</span>
              <Badge variant="default">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="text-sm font-semibold">
                Pipeline Health Alerts
              </span>
              <Badge variant="default">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="text-sm font-semibold">
                Win Rate Changes (±5%)
              </span>
              <Badge variant="default">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="text-sm font-semibold">
                Sales Cycle Changes (±3 days)
              </span>
              <Badge variant="outline">Disabled</Badge>
            </div>
          </div>
          <Button variant="outline" className="mt-4 w-full">
            Customize Alert Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
