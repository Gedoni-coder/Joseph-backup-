import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ScrollArea } from "../ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import {
  AlertCircle,
  Clock,
  TrendingDown,
  TrendingUp,
  DollarSign,
  Users,
  FileText,
  Shield,
  RefreshCw,
  Zap,
  AlertTriangle,
} from "lucide-react";

interface PolicyFeed {
  id: string;
  type: "regulation" | "amendment" | "circular" | "trade" | "fiscal";
  title: string;
  summary: string;
  source: string;
  timestamp: string;
  reliabilityScore: number;
  urgencyLevel: "critical" | "high" | "medium" | "low";
}

interface ComplianceCost {
  id: string;
  description: string;
  estimatedCost: number;
  operationalCostChange: number;
  hiringNeeds: number;
  documentationReq: string;
  timeToComply: string;
}

interface ImpactMetric {
  category: string;
  icon: React.ReactNode;
  label: string;
  impactLevel: "low" | "medium" | "high";
  percentage: number;
}

export function PolicyWatchtower() {
  const [activeTab, setActiveTab] = useState("feed");
  const [searchTerm, setSearchTerm] = useState("");
  const [urgencyFilter, setUrgencyFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [refreshing, setRefreshing] = useState(false);

  const mockPolicyFeed: PolicyFeed[] = [
    {
      id: "1",
      type: "regulation",
      title: "New Environmental Compliance Standards",
      summary:
        "All manufacturing facilities must meet new emission standards by Q3 2024",
      source: "Federal Environmental Agency",
      timestamp: "2024-01-15T10:30:00Z",
      reliabilityScore: 98,
      urgencyLevel: "critical",
    },
    {
      id: "2",
      type: "amendment",
      title: "Tax Credit Amendment for Digital Investments",
      summary:
        "Updated tax credits available for companies investing in digital infrastructure",
      source: "Tax Authority",
      timestamp: "2024-01-14T14:20:00Z",
      reliabilityScore: 95,
      urgencyLevel: "high",
    },
    {
      id: "3",
      type: "circular",
      title: "Sector-Specific Import Guidelines Update",
      summary:
        "New guidelines for importation of raw materials in manufacturing sector",
      source: "Trade Ministry",
      timestamp: "2024-01-13T09:15:00Z",
      reliabilityScore: 92,
      urgencyLevel: "medium",
    },
    {
      id: "4",
      type: "trade",
      title: "Trade Agreement Modifications",
      summary:
        "Updated trade terms with regional partners effective next quarter",
      source: "International Trade Commission",
      timestamp: "2024-01-12T16:45:00Z",
      reliabilityScore: 97,
      urgencyLevel: "high",
    },
    {
      id: "5",
      type: "fiscal",
      title: "Monetary Policy Rate Adjustment",
      summary:
        "Central Bank announces interest rate changes affecting borrowing costs",
      source: "Central Bank",
      timestamp: "2024-01-11T11:00:00Z",
      reliabilityScore: 99,
      urgencyLevel: "high",
    },
  ];

  const mockComplianceCosts: ComplianceCost[] = [
    {
      id: "1",
      description: "Environmental Compliance Implementation",
      estimatedCost: 250000,
      operationalCostChange: 45000,
      hiringNeeds: 3,
      documentationReq: "Environmental audit reports, facility assessments",
      timeToComply: "6 months",
    },
    {
      id: "2",
      description: "Digital Infrastructure Investment",
      estimatedCost: 500000,
      operationalCostChange: -75000,
      hiringNeeds: 5,
      documentationReq: "Technical specifications, compliance certifications",
      timeToComply: "12 months",
    },
    {
      id: "3",
      description: "Import Process Updates",
      estimatedCost: 50000,
      operationalCostChange: 15000,
      hiringNeeds: 1,
      documentationReq: "New import permits, customs documentation",
      timeToComply: "3 months",
    },
  ];

  const impactMetrics: ImpactMetric[] = [
    {
      category: "operational",
      icon: <TrendingDown className="h-4 w-4" />,
      label: "Operational Impact",
      impactLevel: "high",
      percentage: 65,
    },
    {
      category: "revenue",
      icon: <TrendingUp className="h-4 w-4" />,
      label: "Revenue Impact",
      impactLevel: "medium",
      percentage: 35,
    },
    {
      category: "process",
      icon: <Zap className="h-4 w-4" />,
      label: "Process Changes",
      impactLevel: "high",
      percentage: 72,
    },
    {
      category: "administrative",
      icon: <FileText className="h-4 w-4" />,
      label: "Administrative Burden",
      impactLevel: "medium",
      percentage: 48,
    },
    {
      category: "financial",
      icon: <DollarSign className="h-4 w-4" />,
      label: "Financial Impact",
      impactLevel: "high",
      percentage: 58,
    },
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-300";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "low":
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "regulation":
        return <Shield className="h-4 w-4" />;
      case "amendment":
        return <AlertCircle className="h-4 w-4" />;
      case "circular":
        return <FileText className="h-4 w-4" />;
      case "trade":
        return <TrendingUp className="h-4 w-4" />;
      case "fiscal":
        return <DollarSign className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getImpactColor = (level: string) => {
    switch (level) {
      case "high":
        return "bg-red-100 border-red-300";
      case "medium":
        return "bg-yellow-100 border-yellow-300";
      case "low":
        return "bg-green-100 border-green-300";
      default:
        return "bg-gray-100";
    }
  };

  const filteredPolicies = mockPolicyFeed.filter((policy) => {
    const matchesSearch = policy.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesUrgency =
      urgencyFilter === "all" || policy.urgencyLevel === urgencyFilter;
    const matchesType = typeFilter === "all" || policy.type === typeFilter;
    return matchesSearch && matchesUrgency && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Policies
            </CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockPolicyFeed.length}</div>
            <p className="text-xs text-muted-foreground">Active regulations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Critical Issues
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                mockPolicyFeed.filter((p) => p.urgencyLevel === "critical")
                  .length
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Require immediate action
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Compliance Cost
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₦
              {mockComplianceCosts.reduce(
                (sum, c) => sum + c.estimatedCost,
                0,
              ) / 1000000}
              M
            </div>
            <p className="text-xs text-muted-foreground">
              Estimated investment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hiring Needs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockComplianceCosts.reduce((sum, c) => sum + c.hiringNeeds, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              New positions required
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Reliability
            </CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(
                mockPolicyFeed.reduce((sum, p) => sum + p.reliabilityScore, 0) /
                mockPolicyFeed.length
              ).toFixed(0)}
              %
            </div>
            <p className="text-xs text-muted-foreground">Data accuracy score</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <div className="grid grid-cols-2 sm:grid-cols-8 gap-2 w-full rounded-md bg-muted p-1 text-muted-foreground">
          <TabsList className="contents">
            <TabsTrigger
              value="feed"
              className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm px-2 sm:px-3"
            >
              Live Feed
            </TabsTrigger>
            <TabsTrigger
              value="compliance"
              className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm px-2 sm:px-3"
            >
              Costs
            </TabsTrigger>
            <TabsTrigger
              value="impact"
              className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm px-2 sm:px-3"
            >
              Impact
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Live Policy Feed Tab */}
        <TabsContent value="feed" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Live Policy Feed</CardTitle>
                  <CardDescription>
                    Real-time government regulations and policy updates
                  </CardDescription>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleRefresh}
                      size="sm"
                      variant="outline"
                      disabled={refreshing}
                    >
                      <RefreshCw
                        className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Refresh policy data</TooltipContent>
                </Tooltip>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search policies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full md:w-[150px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="regulation">Regulation</SelectItem>
                    <SelectItem value="amendment">Amendment</SelectItem>
                    <SelectItem value="circular">Circular</SelectItem>
                    <SelectItem value="trade">Trade</SelectItem>
                    <SelectItem value="fiscal">Fiscal</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
                  <SelectTrigger className="w-full md:w-[150px]">
                    <SelectValue placeholder="Urgency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Urgencies</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <ScrollArea className="h-[500px] rounded-md border p-4">
                <div className="space-y-4">
                  {filteredPolicies.map((policy) => (
                    <div
                      key={policy.id}
                      className="border rounded-lg p-4 space-y-3 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="mt-1">{getTypeIcon(policy.type)}</div>
                          <div className="flex-1">
                            <h4 className="font-semibold">{policy.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {policy.summary}
                            </p>
                          </div>
                        </div>
                        <Badge className={getUrgencyColor(policy.urgencyLevel)}>
                          {policy.urgencyLevel}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between text-sm pt-2 border-t">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <FileText className="h-3 w-3" />
                            <span>{policy.source}</span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>
                              {new Date(policy.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-muted-foreground">
                            Reliability:
                          </span>
                          <span className="font-semibold">
                            {policy.reliabilityScore}%
                          </span>
                        </div>
                      </div>

                      <div className="bg-muted/50 p-2 rounded text-sm">
                        <p className="font-semibold mb-1">AI Analysis:</p>
                        <ul className="space-y-1 text-muted-foreground">
                          <li>
                            • <strong>What changed:</strong> Updated compliance
                            requirements
                          </li>
                          <li>
                            • <strong>Who it affects:</strong> All operations in
                            this sector
                          </li>
                          <li>
                            • <strong>Action items:</strong> Conduct compliance
                            audit within 30 days
                          </li>
                          <li>
                            • <strong>Disruption level:</strong>{" "}
                            <Badge>
                              {policy.urgencyLevel === "critical"
                                ? "High"
                                : "Medium"}
                            </Badge>
                          </li>
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compliance Cost Tab */}
        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Cost Engine</CardTitle>
              <CardDescription>
                Automatic calculation of regulatory compliance costs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockComplianceCosts.map((cost) => (
                  <Card
                    key={cost.id}
                    className="border-l-4 border-l-orange-500"
                  >
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <h3 className="font-semibold">{cost.description}</h3>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                            <p className="text-xs text-muted-foreground mb-1">
                              Compliance Cost
                            </p>
                            <p className="text-xl font-bold text-red-600">
                              ₦{(cost.estimatedCost / 1000000).toFixed(1)}M
                            </p>
                          </div>

                          <div
                            className={`p-3 rounded-lg border ${
                              cost.operationalCostChange > 0
                                ? "bg-red-50 border-red-200"
                                : "bg-green-50 border-green-200"
                            }`}
                          >
                            <p className="text-xs text-muted-foreground mb-1">
                              Operational Cost Change
                            </p>
                            <p
                              className={`text-xl font-bold ${
                                cost.operationalCostChange > 0
                                  ? "text-red-600"
                                  : "text-green-600"
                              }`}
                            >
                              {cost.operationalCostChange > 0 ? "+" : ""}₦
                              {(cost.operationalCostChange / 1000).toFixed(0)}K
                            </p>
                          </div>

                          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                            <p className="text-xs text-muted-foreground mb-1">
                              Hiring Needs
                            </p>
                            <p className="text-xl font-bold text-blue-600">
                              {cost.hiringNeeds} positions
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t">
                          <div>
                            <p className="text-sm font-semibold mb-2">
                              Documentation Required
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {cost.documentationReq}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold mb-2">
                              Time to Comply
                            </p>
                            <Badge variant="outline">{cost.timeToComply}</Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Impact Mapping Tab */}
        <TabsContent value="impact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Business Impact Mapping</CardTitle>
              <CardDescription>
                Visual heat map showing severity of policy impacts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {impactMetrics.map((metric) => (
                  <div
                    key={metric.category}
                    className={`p-4 rounded-lg border-2 ${getImpactColor(metric.impactLevel)}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {metric.icon}
                        <h4 className="font-semibold">{metric.label}</h4>
                      </div>
                      <Badge
                        variant={
                          metric.impactLevel === "high"
                            ? "destructive"
                            : metric.impactLevel === "medium"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {metric.impactLevel} impact
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Impact Severity</span>
                        <span className="font-semibold">
                          {metric.percentage}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            metric.impactLevel === "high"
                              ? "bg-red-500"
                              : metric.impactLevel === "medium"
                                ? "bg-yellow-500"
                                : "bg-green-500"
                          }`}
                          style={{ width: `${metric.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
