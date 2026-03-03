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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import {
  TrendingUp,
  DollarSign,
  Building,
  Cog,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { InternalImpact } from "../../lib/policy-economic-data";

interface InternalImpactAnalysisProps {
  internalImpacts: InternalImpact[];
  onAddImpact: (impact: Omit<InternalImpact, "id" | "lastAssessed">) => void;
  onUpdateStatus: (id: string, status: InternalImpact["status"]) => void;
}

export function InternalImpactAnalysis({
  internalImpacts,
  onAddImpact,
  onUpdateStatus,
}: InternalImpactAnalysisProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [areaFilter, setAreaFilter] = useState<string>("all");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredImpacts = internalImpacts.filter((impact) => {
    const matchesSearch =
      impact.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      impact.businessArea.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesArea =
      areaFilter === "all" || impact.businessArea === areaFilter;
    const matchesSeverity =
      severityFilter === "all" || impact.severity === severityFilter;
    const matchesStatus =
      statusFilter === "all" || impact.status === statusFilter;

    return matchesSearch && matchesArea && matchesSeverity && matchesStatus;
  });

  const getSeverityColor = (severity: InternalImpact["severity"]) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: InternalImpact["status"]) => {
    switch (status) {
      case "identified":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "analyzing":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "mitigating":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "monitored":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getImpactTypeIcon = (type: InternalImpact["impactType"]) => {
    switch (type) {
      case "revenue":
        return <TrendingUp className="h-4 w-4" />;
      case "costs":
        return <DollarSign className="h-4 w-4" />;
      case "operations":
        return <Cog className="h-4 w-4" />;
      case "strategy":
        return <Target className="h-4 w-4" />;
      default:
        return <Building className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (status: InternalImpact["status"]) => {
    switch (status) {
      case "identified":
        return <AlertTriangle className="h-4 w-4" />;
      case "analyzing":
        return <Clock className="h-4 w-4" />;
      case "mitigating":
        return <Cog className="h-4 w-4" />;
      case "monitored":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const handleViewDetails = (impact: InternalImpact) => {
    const mitigations = impact.mitigationActions
      .map((action) => `• ${action}`)
      .join("\n");

    alert(
      `Internal Impact Analysis: ${impact.businessArea}\n\nEconomic Indicator: ${impact.economicIndicator}\nImpact Type: ${impact.impactType}\nSeverity: ${impact.severity}\n\nDescription: ${impact.description}\n\nQuantified Impact:\n${impact.quantifiedImpact.metric}: ${impact.quantifiedImpact.value} ${impact.quantifiedImpact.unit} (${impact.quantifiedImpact.timeframe})\n\nMitigation Actions:\n${mitigations}\n\nStatus: ${impact.status}\nLast Assessed: ${new Date(impact.lastAssessed).toLocaleDateString()}`,
    );
  };

  const handleStatusUpdate = (impact: InternalImpact) => {
    const statuses: InternalImpact["status"][] = [
      "identified",
      "analyzing",
      "mitigating",
      "monitored",
    ];
    const currentIndex = statuses.indexOf(impact.status);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];

    onUpdateStatus(impact.id, nextStatus);
  };

  const handleAddNewImpact = () => {
    const newImpact = {
      economicIndicator: "New Economic Indicator",
      businessArea: "Operations",
      impactType: "costs" as const,
      severity: "medium" as const,
      description: "New economic impact requiring analysis and monitoring",
      quantifiedImpact: {
        metric: "Cost Impact",
        value: 50000,
        unit: "USD",
        timeframe: "Annual",
      },
      mitigationActions: [
        "Assess current exposure",
        "Develop mitigation strategy",
        "Implement monitoring system",
      ],
      status: "identified" as const,
    };
    onAddImpact(newImpact);
  };

  const totalImpactValue = internalImpacts.reduce(
    (sum, impact) => sum + Math.abs(impact.quantifiedImpact.value),
    0,
  );
  const criticalImpacts = internalImpacts.filter(
    (i) => i.severity === "critical",
  ).length;
  const mitigatingImpacts = internalImpacts.filter(
    (i) => i.status === "mitigating",
  ).length;
  const monitoredImpacts = internalImpacts.filter(
    (i) => i.status === "monitored",
  ).length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Impacts</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{internalImpacts.length}</div>
            <p className="text-xs text-muted-foreground">
              Internal impacts tracked
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Critical Issues
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{criticalImpacts}</div>
            <p className="text-xs text-muted-foreground">
              Requiring immediate action
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Being Mitigated
            </CardTitle>
            <Cog className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mitigatingImpacts}</div>
            <p className="text-xs text-muted-foreground">
              Active mitigation efforts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Under Control</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monitoredImpacts}</div>
            <p className="text-xs text-muted-foreground">
              Successfully monitored
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Internal Business Impact Analysis</CardTitle>
              <CardDescription>
                Track how external economic factors affect specific business
                areas
              </CardDescription>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleAddNewImpact}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Impact
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add new internal impact for tracking</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search by description or business area..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={areaFilter} onValueChange={setAreaFilter}>
              <SelectTrigger className="w-full lg:w-[180px]">
                <SelectValue placeholder="Business Area" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Areas</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="Operations">Operations</SelectItem>
                <SelectItem value="International Sales">
                  International Sales
                </SelectItem>
                <SelectItem value="Supply Chain">Supply Chain</SelectItem>
              </SelectContent>
            </Select>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-full lg:w-[150px]">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full lg:w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="identified">Identified</SelectItem>
                <SelectItem value="analyzing">Analyzing</SelectItem>
                <SelectItem value="mitigating">Mitigating</SelectItem>
                <SelectItem value="monitored">Monitored</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Impact Cards */}
          <div className="space-y-4">
            {filteredImpacts.map((impact) => (
              <Card key={impact.id} className="border-l-4 border-l-orange-500">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        {getImpactTypeIcon(impact.impactType)}
                        <h3 className="font-semibold">{impact.businessArea}</h3>
                        <Badge className={getSeverityColor(impact.severity)}>
                          {impact.severity}
                        </Badge>
                        <Badge className={getStatusColor(impact.status)}>
                          {getStatusIcon(impact.status)}
                          <span className="ml-1">{impact.status}</span>
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Economic Indicator
                          </p>
                          <p className="font-medium">
                            {impact.economicIndicator}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Impact Type
                          </p>
                          <div className="flex items-center gap-1">
                            {getImpactTypeIcon(impact.impactType)}
                            <span className="font-medium capitalize">
                              {impact.impactType}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3">
                        {impact.description}
                      </p>

                      {/* Quantified Impact */}
                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <p className="text-sm font-medium mb-1">
                          Quantified Impact
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold">
                            {impact.quantifiedImpact.value >= 0 ? "+" : ""}
                            {impact.quantifiedImpact.value.toLocaleString()}{" "}
                            {impact.quantifiedImpact.unit}
                          </span>
                          {impact.impactType === "revenue" &&
                            impact.quantifiedImpact.value > 0 && (
                              <ArrowUpRight className="h-4 w-4 text-green-600" />
                            )}
                          {impact.impactType === "costs" &&
                            impact.quantifiedImpact.value > 0 && (
                              <ArrowUpRight className="h-4 w-4 text-red-600" />
                            )}
                          <span className="text-sm text-muted-foreground">
                            ({impact.quantifiedImpact.timeframe})
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {impact.quantifiedImpact.metric}
                        </p>
                      </div>

                      {/* Mitigation Actions */}
                      <div className="mb-3">
                        <p className="text-sm font-medium mb-2">
                          Mitigation Actions
                        </p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {impact.mitigationActions
                            .slice(0, 3)
                            .map((action, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-1"
                              >
                                <span>•</span>
                                <span>{action}</span>
                              </li>
                            ))}
                          {impact.mitigationActions.length > 3 && (
                            <li className="text-xs">
                              +{impact.mitigationActions.length - 3} more
                              actions...
                            </li>
                          )}
                        </ul>
                      </div>

                      <div className="text-xs text-muted-foreground">
                        Last assessed:{" "}
                        {impact.lastAssessed
                          ? new Date(impact.lastAssessed).toLocaleDateString()
                          : "N/A"}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(impact)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View full impact details</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusUpdate(impact)}
                          >
                            {getStatusIcon(impact.status)}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Update status to next stage</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredImpacts.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No internal impacts found matching your criteria.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
