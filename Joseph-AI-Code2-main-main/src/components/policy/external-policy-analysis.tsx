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
  Globe,
  Building2,
  AlertTriangle,
  Calendar,
  Filter,
  Plus,
  Eye,
  FileText,
} from "lucide-react";
import { ExternalPolicy } from "../../lib/policy-economic-data";

interface ExternalPolicyAnalysisProps {
  externalPolicies: ExternalPolicy[];
  onAddPolicy: (policy: Omit<ExternalPolicy, "id" | "lastUpdated">) => void;
  onUpdatePolicy: (id: string, updates: Partial<ExternalPolicy>) => void;
}

export function ExternalPolicyAnalysis({
  externalPolicies,
  onAddPolicy,
  onUpdatePolicy,
}: ExternalPolicyAnalysisProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredPolicies = externalPolicies.filter((policy) => {
    const matchesSearch =
      policy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || policy.type === typeFilter;
    const matchesStatus =
      statusFilter === "all" || policy.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusColor = (status: ExternalPolicy["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "draft":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "expired":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getImpactColor = (impact: ExternalPolicy["impact"]) => {
    switch (impact) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeIcon = (type: ExternalPolicy["type"]) => {
    switch (type) {
      case "government":
        return <Building2 className="h-4 w-4" />;
      case "international":
        return <Globe className="h-4 w-4" />;
      case "trade":
        return <FileText className="h-4 w-4" />;
      case "regulatory":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const handleViewDetails = (policy: ExternalPolicy) => {
    alert(
      `Viewing details for: ${policy.title}\n\nJurisdiction: ${policy.jurisdiction}\nEffective Date: ${policy.effectiveDate}\nImpact: ${policy.impact}\n\nSummary: ${policy.summary}\n\nBusiness Areas Affected:\n${policy.businessAreas.join(", ")}`,
    );
  };

  const handleAddNewPolicy = () => {
    const newPolicy = {
      title: "New External Policy",
      type: "government" as const,
      status: "draft" as const,
      effectiveDate: new Date().toISOString().split("T")[0],
      jurisdiction: "Federal",
      summary: "New policy requiring analysis and implementation planning.",
      impact: "medium" as const,
      businessAreas: ["Legal", "Compliance"],
    };
    onAddPolicy(newPolicy);
  };

  const activePolicies = externalPolicies.filter((p) => p.status === "active");
  const pendingPolicies = externalPolicies.filter(
    (p) => p.status === "pending",
  );
  const highImpactPolicies = externalPolicies.filter(
    (p) => p.impact === "high",
  );

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Policies
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{externalPolicies.length}</div>
            <p className="text-xs text-muted-foreground">
              External policies tracked
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Policies
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activePolicies.length}</div>
            <p className="text-xs text-muted-foreground">Currently in effect</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Review
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingPolicies.length}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting implementation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Impact</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {highImpactPolicies.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Requiring immediate attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>External Policy Tracker</CardTitle>
              <CardDescription>
                Monitor government regulations, international policies, and
                trade agreements
              </CardDescription>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleAddNewPolicy}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Policy
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add new external policy for tracking</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search policies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="government">Government</SelectItem>
                <SelectItem value="international">International</SelectItem>
                <SelectItem value="trade">Trade</SelectItem>
                <SelectItem value="regulatory">Regulatory</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Policy List */}
          <div className="space-y-4">
            {filteredPolicies.map((policy) => (
              <Card key={policy.id} className="border-l-4 border-l-blue-500">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getTypeIcon(policy.type)}
                        <h3 className="font-semibold">{policy.title}</h3>
                        <Badge className={getStatusColor(policy.status)}>
                          {policy.status.replace("_", " ")}
                        </Badge>
                        <Badge className={getImpactColor(policy.impact)}>
                          {policy.impact} impact
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Jurisdiction
                          </p>
                          <p className="font-medium">{policy.jurisdiction}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Effective Date
                          </p>
                          <p className="font-medium">
                            {policy.effectiveDate
                              ? new Date(
                                  policy.effectiveDate,
                                ).toLocaleDateString()
                              : "N/A"}
                          </p>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3">
                        {policy.summary}
                      </p>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {policy.businessAreas.map((area) => (
                          <Badge
                            key={area}
                            variant="outline"
                            className="text-xs"
                          >
                            {area}
                          </Badge>
                        ))}
                      </div>

                      {policy.complianceDeadline && (
                        <div className="flex items-center gap-2 text-sm text-orange-600">
                          <Calendar className="h-4 w-4" />
                          <span>
                            Compliance deadline:{" "}
                            {new Date(
                              policy.complianceDeadline,
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(policy)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View policy details</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredPolicies.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No policies found matching your criteria.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
