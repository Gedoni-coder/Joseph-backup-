import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ModuleHeader from "@/components/ui/module-header";
import { useRiskManagementDataAPI } from "@/hooks/useRiskManagementDataAPI";
import {
  AlertTriangle,
  Shield,
  TrendingDown,
  Activity,
  Target,
  BarChart3,
  CheckCircle,
  Clock,
  Users,
  DollarSign,
  Filter,
  Plus,
  Download,
} from "lucide-react";

const RiskManagement = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const {
    risks: apiRisks,
    isLoading,
    isConnected,
    lastUpdated,
    refreshData,
  } = useRiskManagementDataAPI();

  const risks =
    apiRisks && apiRisks.length > 0
      ? apiRisks
      : [
          {
            id: 1,
            title: "Supply Chain Disruption",
            category: "Operational",
            severity: "High",
            probability: "Medium",
            impact: "$2.5M",
            status: "Active",
            owner: "Operations Team",
            lastUpdated: "2 days ago",
            description:
              "Potential disruption in key supplier relationships affecting production capacity",
            mitigation: [
              "Diversify supplier base across 3 regions",
              "Maintain 90-day inventory buffer",
              "Establish backup supplier contracts",
            ],
            timeline: "Q1 2024",
          },
          {
            id: 2,
            title: "Market Competition",
            category: "Strategic",
            severity: "High",
            probability: "High",
            impact: "$5.2M",
            status: "Monitoring",
            owner: "Strategy Team",
            lastUpdated: "1 week ago",
            description:
              "Increased competition from new market entrants with lower pricing",
            mitigation: [
              "Enhance product differentiation",
              "Improve customer retention programs",
              "Optimize pricing strategy",
            ],
            timeline: "Q2 2024",
          },
          {
            id: 3,
            title: "Regulatory Changes",
            category: "Compliance",
            severity: "Medium",
            probability: "Medium",
            impact: "$1.8M",
            status: "Planning",
            owner: "Legal Team",
            lastUpdated: "3 days ago",
            description:
              "Upcoming regulatory changes requiring system modifications and compliance updates",
            mitigation: [
              "Monitor regulatory developments",
              "Engage compliance consultants",
              "Update internal processes",
            ],
            timeline: "Q3 2024",
          },
          {
            id: 4,
            title: "Cybersecurity Threats",
            category: "Technology",
            severity: "High",
            probability: "Low",
            impact: "$3.1M",
            status: "Mitigated",
            owner: "IT Security",
            lastUpdated: "1 day ago",
            description:
              "Potential cybersecurity breaches affecting customer data and operations",
            mitigation: [
              "Implement advanced threat detection",
              "Regular security audits",
              "Employee training programs",
            ],
            timeline: "Ongoing",
          },
        ];

  const riskMetrics = [
    {
      label: "Total Risks",
      value: risks.length,
      icon: <AlertTriangle className="h-5 w-5" />,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      label: "High Severity",
      value: risks.filter((r) => r.severity === "High").length,
      icon: <TrendingDown className="h-5 w-5" />,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    {
      label: "Active Monitoring",
      value: risks.filter(
        (r) => r.status === "Active" || r.status === "Monitoring",
      ).length,
      icon: <Activity className="h-5 w-5" />,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      label: "Mitigated",
      value: risks.filter((r) => r.status === "Mitigated").length,
      icon: <CheckCircle className="h-5 w-5" />,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "High":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-green-100 text-green-800";
    }
  };

  const getProbabilityColor = (probability: string) => {
    switch (probability) {
      case "High":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-green-100 text-green-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-red-100 text-red-800";
      case "Monitoring":
        return "bg-orange-100 text-orange-800";
      case "Planning":
        return "bg-blue-100 text-blue-800";
      case "Mitigated":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredRisks =
    selectedCategory === "all"
      ? risks
      : risks.filter(
          (risk) =>
            risk.category.toLowerCase() === selectedCategory.toLowerCase(),
        );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <ModuleHeader
        icon={<Shield className="h-6 w-6" />}
        title="Risk Management Center"
        description="Identify, assess, and mitigate business risks across all operations"
        isConnected={isConnected}
        lastUpdated={lastUpdated}
        onReconnect={refreshData}
        connectionLabel="Live"
      />

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Risk Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {riskMetrics.map((metric, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 ${metric.bgColor} rounded-lg`}>
                    <div className={metric.color}>{metric.icon}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      {metric.label}
                    </div>
                    <div className="text-lg font-bold">{metric.value}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <TabsList>
              <TabsTrigger value="overview">Risk Overview</TabsTrigger>
              <TabsTrigger value="assessment">Risk Assessment</TabsTrigger>
              <TabsTrigger value="mitigation">Mitigation Plans</TabsTrigger>
              <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-1 border rounded-md text-sm"
              >
                <option value="all">All Categories</option>
                <option value="operational">Operational</option>
                <option value="strategic">Strategic</option>
                <option value="compliance">Compliance</option>
                <option value="technology">Technology</option>
              </select>
            </div>
          </div>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6">
              {filteredRisks.map((risk) => (
                <Card key={risk.id} className="transition-all hover:shadow-lg">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-lg">
                            {risk.title}
                          </CardTitle>
                          <Badge variant="outline" className="text-xs">
                            {risk.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {risk.description}
                        </p>
                      </div>
                      <Badge className={getStatusColor(risk.status)}>
                        {risk.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                      <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">
                          Severity
                        </span>
                        <Badge className={getSeverityColor(risk.severity)}>
                          {risk.severity}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">
                          Probability
                        </span>
                        <Badge
                          className={getProbabilityColor(risk.probability)}
                        >
                          {risk.probability}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">
                          Impact
                        </span>
                        <div className="text-sm font-medium text-red-600">
                          {risk.impact}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">
                          Owner
                        </span>
                        <div className="text-sm font-medium">{risk.owner}</div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">
                          Updated
                        </span>
                        <div className="text-sm text-muted-foreground">
                          {risk.lastUpdated}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-sm mb-2">
                          Mitigation Actions:
                        </h4>
                        <ul className="space-y-1">
                          {risk.mitigation.map((action, index) => (
                            <li
                              key={index}
                              className="text-sm text-muted-foreground flex items-start gap-2"
                            >
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Target className="h-4 w-4 mr-2" />
                          Update Status
                        </Button>
                        <Button size="sm" variant="outline">
                          <Users className="h-4 w-4 mr-2" />
                          Assign Owner
                        </Button>
                        <Button size="sm" variant="outline">
                          <BarChart3 className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="assessment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Risk Assessment Matrix
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">
                      Risk Distribution by Category
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded">
                        <span className="text-sm">Operational</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-orange-500 h-2 rounded-full"
                              style={{ width: "25%" }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">1</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded">
                        <span className="text-sm">Strategic</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-red-500 h-2 rounded-full"
                              style={{ width: "25%" }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">1</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded">
                        <span className="text-sm">Compliance</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: "25%" }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">1</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded">
                        <span className="text-sm">Technology</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: "25%" }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">1</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Risk Priority Matrix</h4>
                    <div className="space-y-2">
                      <div className="grid grid-cols-4 gap-1 text-xs text-center">
                        <div></div>
                        <div className="font-medium">Low</div>
                        <div className="font-medium">Medium</div>
                        <div className="font-medium">High</div>
                      </div>
                      <div className="grid grid-cols-4 gap-1">
                        <div className="text-xs font-medium flex items-center">
                          High
                        </div>
                        <div className="h-8 bg-orange-200 flex items-center justify-center text-xs">
                          0
                        </div>
                        <div className="h-8 bg-red-300 flex items-center justify-center text-xs">
                          1
                        </div>
                        <div className="h-8 bg-red-500 flex items-center justify-center text-xs text-white">
                          2
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-1">
                        <div className="text-xs font-medium flex items-center">
                          Medium
                        </div>
                        <div className="h-8 bg-green-200 flex items-center justify-center text-xs">
                          0
                        </div>
                        <div className="h-8 bg-orange-200 flex items-center justify-center text-xs">
                          1
                        </div>
                        <div className="h-8 bg-red-300 flex items-center justify-center text-xs">
                          0
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-1">
                        <div className="text-xs font-medium flex items-center">
                          Low
                        </div>
                        <div className="h-8 bg-green-100 flex items-center justify-center text-xs">
                          0
                        </div>
                        <div className="h-8 bg-green-200 flex items-center justify-center text-xs">
                          0
                        </div>
                        <div className="h-8 bg-orange-200 flex items-center justify-center text-xs">
                          0
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mitigation" className="space-y-6">
            <div className="grid gap-6">
              {risks.map((risk) => (
                <Card key={risk.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      {risk.title} - Mitigation Plan
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <span className="text-sm text-muted-foreground">
                            Timeline
                          </span>
                          <div className="font-medium">{risk.timeline}</div>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">
                            Owner
                          </span>
                          <div className="font-medium">{risk.owner}</div>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">
                            Status
                          </span>
                          <Badge className={getStatusColor(risk.status)}>
                            {risk.status}
                          </Badge>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-sm mb-2">
                          Action Items:
                        </h4>
                        <div className="space-y-2">
                          {risk.mitigation.map((action, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-3 p-2 border rounded"
                            >
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-sm flex-1">{action}</span>
                              <Badge variant="outline" className="text-xs">
                                {index === 0 ? "In Progress" : "Planned"}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Risk Monitoring Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium">
                          Active Monitoring
                        </span>
                      </div>
                      <div className="text-2xl font-bold">
                        {
                          risks.filter(
                            (r) =>
                              r.status === "Active" ||
                              r.status === "Monitoring",
                          ).length
                        }
                      </div>
                      <div className="text-sm text-muted-foreground">
                        risks under active monitoring
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-red-500" />
                        <span className="text-sm font-medium">
                          Total Exposure
                        </span>
                      </div>
                      <div className="text-2xl font-bold">$12.6M</div>
                      <div className="text-sm text-muted-foreground">
                        potential financial impact
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <TrendingDown className="h-4 w-4 text-orange-500" />
                        <span className="text-sm font-medium">Risk Trend</span>
                      </div>
                      <div className="text-2xl font-bold">-15%</div>
                      <div className="text-sm text-muted-foreground">
                        reduction from last quarter
                      </div>
                    </div>
                  </Card>
                </div>

                <div className="mt-6 text-center">
                  <Link to="/audit-reports">
                    <Button>
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View Audit Reports
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default RiskManagement;
