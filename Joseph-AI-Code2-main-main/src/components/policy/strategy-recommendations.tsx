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
  Target,
  Shield,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Pause,
  Eye,
  Plus,
  DollarSign,
  Calendar,
  Users,
} from "lucide-react";
import { StrategyRecommendation } from "../../lib/policy-economic-data";

interface StrategyRecommendationsProps {
  strategyRecommendations: StrategyRecommendation[];
  onAddRecommendation: (recommendation: Omit<StrategyRecommendation, "id">) => void;
  onUpdateStatus: (id: string, status: StrategyRecommendation["status"]) => void;
}

export function StrategyRecommendations({ 
  strategyRecommendations, 
  onAddRecommendation, 
  onUpdateStatus 
}: StrategyRecommendationsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredRecommendations = strategyRecommendations.filter(rec => {
    const matchesSearch = rec.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rec.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || rec.category === categoryFilter;
    const matchesPriority = priorityFilter === "all" || rec.priority === priorityFilter;
    const matchesStatus = statusFilter === "all" || rec.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
  });

  const getPriorityColor = (priority: StrategyRecommendation["priority"]) => {
    switch (priority) {
      case "critical": return "bg-red-100 text-red-800 border-red-200";
      case "high": return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: StrategyRecommendation["status"]) => {
    switch (status) {
      case "proposed": return "bg-blue-100 text-blue-800 border-blue-200";
      case "approved": return "bg-green-100 text-green-800 border-green-200";
      case "in_progress": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "implemented": return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "on_hold": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getCategoryIcon = (category: StrategyRecommendation["category"]) => {
    switch (category) {
      case "policy_adaptation": return <Shield className="h-4 w-4" />;
      case "economic_mitigation": return <TrendingUp className="h-4 w-4" />;
      case "opportunity_leverage": return <Target className="h-4 w-4" />;
      case "risk_management": return <AlertTriangle className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (status: StrategyRecommendation["status"]) => {
    switch (status) {
      case "proposed": return <Clock className="h-4 w-4" />;
      case "approved": return <CheckCircle className="h-4 w-4" />;
      case "in_progress": return <Target className="h-4 w-4" />;
      case "implemented": return <CheckCircle className="h-4 w-4" />;
      case "on_hold": return <Pause className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleViewDetails = (recommendation: StrategyRecommendation) => {
    const resources = recommendation.resources.join(', ');
    const metrics = recommendation.success_metrics.join(', ');
    const dependencies = recommendation.dependencies.join(', ');
    
    alert(`Strategy Recommendation: ${recommendation.title}\n\nCategory: ${recommendation.category.replace('_', ' ')}\nPriority: ${recommendation.priority}\nStatus: ${recommendation.status.replace('_', ' ')}\n\nDescription: ${recommendation.description}\n\nExpected Outcome: ${recommendation.expectedOutcome}\n\nTimeline: ${recommendation.timeline}\nAssigned To: ${recommendation.assignedTo}\n\nEstimated Cost: $${recommendation.estimatedCost.toLocaleString()}\nExpected ROI: ${recommendation.expectedROI}x\n\nResources Needed: ${resources}\n\nSuccess Metrics: ${metrics}\n\nDependencies: ${dependencies}`);
  };

  const handleStatusUpdate = (recommendation: StrategyRecommendation) => {
    const statuses: StrategyRecommendation["status"][] = ["proposed", "approved", "in_progress", "implemented"];
    const currentIndex = statuses.indexOf(recommendation.status);
    const nextStatus = statuses[Math.min(currentIndex + 1, statuses.length - 1)];
    
    if (nextStatus !== recommendation.status) {
      onUpdateStatus(recommendation.id, nextStatus);
    }
  };

  const handleAddNewRecommendation = () => {
    const newRecommendation = {
      title: "New Strategic Recommendation",
      category: "policy_adaptation" as const,
      priority: "medium" as const,
      description: "New strategic recommendation for policy or economic adaptation",
      expectedOutcome: "Improved business resilience and compliance",
      timeline: "6 months",
      resources: ["Strategy Team", "Legal", "Finance"],
      success_metrics: ["Implementation completion", "Compliance improvement", "Cost savings"],
      dependencies: ["Management approval", "Budget allocation"],
      status: "proposed" as const,
      assignedTo: "Strategy Department",
      estimatedCost: 100000,
      expectedROI: 2.5
    };
    onAddRecommendation(newRecommendation);
  };

  const getStatusProgress = (status: StrategyRecommendation["status"]) => {
    switch (status) {
      case "proposed": return 20;
      case "approved": return 40;
      case "in_progress": return 70;
      case "implemented": return 100;
      case "on_hold": return 30;
      default: return 0;
    }
  };

  const totalCost = strategyRecommendations.reduce((sum, rec) => sum + rec.estimatedCost, 0);
  const avgROI = strategyRecommendations.reduce((sum, rec) => sum + rec.expectedROI, 0) / (strategyRecommendations.length || 1);
  const criticalRecommendations = strategyRecommendations.filter(r => r.priority === "critical").length;
  const implementedRecommendations = strategyRecommendations.filter(r => r.status === "implemented").length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Strategies</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{strategyRecommendations.length}</div>
            <p className="text-xs text-muted-foreground">
              Strategic recommendations
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Priority</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{criticalRecommendations}</div>
            <p className="text-xs text-muted-foreground">
              Requiring immediate action
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Implemented</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{implementedRecommendations}</div>
            <p className="text-xs text-muted-foreground">
              Successfully completed
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg ROI</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgROI.toFixed(1)}x</div>
            <p className="text-xs text-muted-foreground">
              Expected return on investment
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Strategic Recommendations</CardTitle>
              <CardDescription>
                Actionable strategies for policy adaptation and economic risk mitigation
              </CardDescription>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={handleAddNewRecommendation} size="sm" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Strategy
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Create new strategic recommendation</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search strategies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full lg:w-[200px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="policy_adaptation">Policy Adaptation</SelectItem>
                <SelectItem value="economic_mitigation">Economic Mitigation</SelectItem>
                <SelectItem value="opportunity_leverage">Opportunity Leverage</SelectItem>
                <SelectItem value="risk_management">Risk Management</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full lg:w-[150px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
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
                <SelectItem value="proposed">Proposed</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="implemented">Implemented</SelectItem>
                <SelectItem value="on_hold">On Hold</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Recommendations Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredRecommendations.map((recommendation) => (
              <Card key={recommendation.id} className="border-l-4 border-l-blue-500">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(recommendation.category)}
                      <h3 className="font-semibold text-sm">{recommendation.title}</h3>
                    </div>
                    <div className="flex gap-1">
                      <Badge className={getPriorityColor(recommendation.priority)}>
                        {recommendation.priority}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-muted-foreground">Status</span>
                        <Badge className={getStatusColor(recommendation.status)}>
                          {getStatusIcon(recommendation.status)}
                          <span className="ml-1">{recommendation.status.replace('_', ' ')}</span>
                        </Badge>
                      </div>
                      <Progress value={getStatusProgress(recommendation.status)} className="h-1" />
                    </div>
                    
                    <p className="text-sm text-muted-foreground">{recommendation.description}</p>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-muted-foreground">Timeline</p>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span className="font-medium">{recommendation.timeline}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Assigned To</p>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span className="font-medium text-xs">{recommendation.assignedTo}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-muted-foreground">Estimated Cost</p>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          <span className="font-bold">${recommendation.estimatedCost.toLocaleString()}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Expected ROI</p>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          <span className="font-bold">{recommendation.expectedROI}x</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-2 border-t">
                      <p className="text-xs text-muted-foreground mb-1">Expected Outcome</p>
                      <p className="text-xs">{recommendation.expectedOutcome}</p>
                    </div>
                    
                    {recommendation.success_metrics.length > 0 && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Success Metrics</p>
                        <div className="flex flex-wrap gap-1">
                          {recommendation.success_metrics.slice(0, 2).map((metric, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {metric}
                            </Badge>
                          ))}
                          {recommendation.success_metrics.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{recommendation.success_metrics.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2 mt-4 pt-3 border-t">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(recommendation)}
                          className="flex-1"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Details
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>View full recommendation details</p>
                      </TooltipContent>
                    </Tooltip>
                    {recommendation.status !== "implemented" && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusUpdate(recommendation)}
                          >
                            {getStatusIcon(recommendation.status)}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Advance to next status</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredRecommendations.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No strategic recommendations found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
