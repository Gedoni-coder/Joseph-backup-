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
import { Progress } from "../ui/progress";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import {
  Building,
  Users,
  Shield,
  DollarSign,
  Leaf,
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus,
  Eye,
  Edit,
} from "lucide-react";
import { InternalPolicy } from "../../lib/policy-economic-data";

interface InternalPolicyAnalysisProps {
  internalPolicies: InternalPolicy[];
  onAddPolicy: (policy: Omit<InternalPolicy, "id" | "lastReviewed">) => void;
  onUpdatePolicy: (id: string, updates: Partial<InternalPolicy>) => void;
}

export function InternalPolicyAnalysis({
  internalPolicies,
  onAddPolicy,
  onUpdatePolicy,
}: InternalPolicyAnalysisProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredPolicies = internalPolicies.filter((policy) => {
    const matchesSearch =
      policy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || policy.type === typeFilter;
    const matchesStatus =
      statusFilter === "all" || policy.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusColor = (status: InternalPolicy["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "under_review":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "draft":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "archived":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getImplementationColor = (
    status: InternalPolicy["implementationStatus"],
  ) => {
    switch (status) {
      case "fully_implemented":
        return "bg-green-100 text-green-800 border-green-200";
      case "partial":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "planning":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "not_started":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeIcon = (type: InternalPolicy["type"]) => {
    switch (type) {
      case "compliance":
        return <Shield className="h-4 w-4" />;
      case "operational":
        return <Building className="h-4 w-4" />;
      case "hr":
        return <Users className="h-4 w-4" />;
      case "financial":
        return <DollarSign className="h-4 w-4" />;
      case "environmental":
        return <Leaf className="h-4 w-4" />;
      default:
        return <Building className="h-4 w-4" />;
    }
  };

  const getImplementationIcon = (
    status: InternalPolicy["implementationStatus"],
  ) => {
    switch (status) {
      case "fully_implemented":
        return <CheckCircle className="h-4 w-4" />;
      case "partial":
        return <Clock className="h-4 w-4" />;
      case "planning":
        return <AlertTriangle className="h-4 w-4" />;
      case "not_started":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const handleViewDetails = (policy: InternalPolicy) => {
    alert(
      `Policy Details: ${policy.title}\n\nDepartment: ${policy.department}\nType: ${policy.type}\nVersion: ${policy.version}\nApproved by: ${policy.approvedBy}\n\nLast Reviewed: ${policy.lastReviewed ? new Date(policy.lastReviewed).toLocaleDateString() : "N/A"}\nNext Review: ${policy.nextReview ? new Date(policy.nextReview).toLocaleDateString() : "N/A"}\n\nAlignment Score: ${policy.alignmentScore}%\nImplementation: ${policy.implementationStatus.replace("_", " ")}`,
    );
  };

  const handleEditPolicy = (policy: InternalPolicy) => {
    const updatedScore = Math.min(
      100,
      policy.alignmentScore + Math.floor(Math.random() * 10),
    );
    onUpdatePolicy(policy.id, { alignmentScore: updatedScore });
    alert(`Updated alignment score for "${policy.title}" to ${updatedScore}%`);
  };

  const handleAddNewPolicy = () => {
    const newPolicy = {
      title: "New Internal Policy",
      department: "Operations",
      type: "operational" as const,
      status: "draft" as const,
      version: "1.0",
      approvedBy: "Department Head",
      nextReview: new Date(
        Date.now() + 180 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      alignmentScore: 85,
      relatedExternalPolicies: [],
      implementationStatus: "planning" as const,
    };
    onAddPolicy(newPolicy);
  };

  const averageAlignment = Math.round(
    internalPolicies.reduce((sum, policy) => sum + policy.alignmentScore, 0) /
      internalPolicies.length,
  );
  const fullyImplemented = internalPolicies.filter(
    (p) => p.implementationStatus === "fully_implemented",
  ).length;
  const needsReview = internalPolicies.filter(
    (p) =>
      new Date(p.nextReview) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  ).length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Policies
            </CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{internalPolicies.length}</div>
            <p className="text-xs text-muted-foreground">
              Internal policies managed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Alignment</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageAlignment}%</div>
            <p className="text-xs text-muted-foreground">
              Policy alignment score
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Fully Implemented
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fullyImplemented}</div>
            <p className="text-xs text-muted-foreground">
              Complete implementation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Review Needed</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{needsReview}</div>
            <p className="text-xs text-muted-foreground">
              Due for review this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Internal Policy Management</CardTitle>
              <CardDescription>
                Track company policies, compliance status, and alignment with
                external regulations
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
                <p>Create new internal policy</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search policies by title or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="compliance">Compliance</SelectItem>
                <SelectItem value="operational">Operational</SelectItem>
                <SelectItem value="hr">HR</SelectItem>
                <SelectItem value="financial">Financial</SelectItem>
                <SelectItem value="environmental">Environmental</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Policy List */}
          <div className="space-y-4">
            {filteredPolicies.map((policy) => (
              <Card key={policy.id} className="border-l-4 border-l-green-500">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getTypeIcon(policy.type)}
                        <h3 className="font-semibold">{policy.title}</h3>
                        <Badge className={getStatusColor(policy.status)}>
                          {policy.status.replace("_", " ")}
                        </Badge>
                        <Badge
                          className={getImplementationColor(
                            policy.implementationStatus,
                          )}
                        >
                          {getImplementationIcon(policy.implementationStatus)}
                          <span className="ml-1">
                            {policy.implementationStatus.replace("_", " ")}
                          </span>
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Department
                          </p>
                          <p className="font-medium">{policy.department}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Version
                          </p>
                          <p className="font-medium">{policy.version}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Approved By
                          </p>
                          <p className="font-medium">{policy.approvedBy}</p>
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm text-muted-foreground">
                            Alignment Score
                          </p>
                          <span className="text-sm font-medium">
                            {policy.alignmentScore}%
                          </span>
                        </div>
                        <Progress
                          value={policy.alignmentScore}
                          className="h-2"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Last Reviewed</p>
                          <p className="font-medium">
                            {policy.lastReviewed
                              ? new Date(
                                  policy.lastReviewed,
                                ).toLocaleDateString()
                              : "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Next Review</p>
                          <p className="font-medium">
                            {policy.nextReview
                              ? new Date(policy.nextReview).toLocaleDateString()
                              : "N/A"}
                          </p>
                        </div>
                      </div>

                      {policy.relatedExternalPolicies.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm text-muted-foreground mb-1">
                            Related External Policies
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {policy.relatedExternalPolicies.map((extId) => (
                              <Badge
                                key={extId}
                                variant="outline"
                                className="text-xs"
                              >
                                {extId}
                              </Badge>
                            ))}
                          </div>
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
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditPolicy(policy)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Update policy alignment</p>
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
