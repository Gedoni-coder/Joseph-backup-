import React, { useState } from "react";
import { RiskAssessment } from "../../lib/financial-advisory-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Slider } from "../ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  AlertTriangle,
  Shield,
  TrendingUp,
  Eye,
  CheckCircle,
  XCircle,
  DollarSign,
  CreditCard,
  BarChart3,
  Settings,
  FileText,
} from "lucide-react";

interface RiskAssessmentProps {
  riskAssessments: RiskAssessment[];
  onUpdateRiskStatus: (id: string, status: RiskAssessment["status"]) => void;
  onAddRisk: (risk: Omit<RiskAssessment, "id" | "lastReviewed">) => void;
}

export function RiskAssessmentComponent({
  riskAssessments,
  onUpdateRiskStatus,
  onAddRisk,
}: RiskAssessmentProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({
    riskName: "",
    description: "",
    category: "operational" as RiskAssessment["category"],
    probability: 50,
    impact: 50,
    status: "identified" as RiskAssessment["status"],
    currentMitigation: "",
    recommendedActions: "",
  });

  const riskScore = Math.round((form.probability * form.impact) / 100);

  const handleAddRisk = () => {
    if (!form.riskName.trim()) return;
    setAdding(true);
    setTimeout(() => {
      const newRisk: Omit<RiskAssessment, "id" | "lastReviewed"> = {
        riskName: form.riskName.trim(),
        description: form.description.trim() || "Added via assistant",
        category: form.category,
        probability: form.probability,
        impact: form.impact,
        riskScore,
        status: form.status,
        currentMitigation: form.currentMitigation
          .split("\n")
          .map((item) => item.trim())
          .filter((item) => item.length > 0),
        recommendedActions: form.recommendedActions
          .split("\n")
          .map((item) => item.trim())
          .filter((item) => item.length > 0),
      };
      onAddRisk(newRisk);
      setAdding(false);
      setShowAddForm(false);
      setForm({
        riskName: "",
        description: "",
        category: "operational",
        probability: 50,
        impact: 50,
        status: "identified",
        currentMitigation: "",
        recommendedActions: "",
      });
    }, 800);
  };

  const filteredRisks = riskAssessments.filter((risk) => {
    if (selectedCategory !== "all" && risk.category !== selectedCategory)
      return false;
    if (selectedStatus !== "all" && risk.status !== selectedStatus)
      return false;
    return true;
  });

  const getRiskScoreColor = (score: number) => {
    if (score >= 70) return "text-red-600 bg-red-100";
    if (score >= 40) return "text-yellow-600 bg-yellow-100";
    return "text-green-600 bg-green-100";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "identified":
        return "bg-blue-100 text-blue-800";
      case "monitoring":
        return "bg-yellow-100 text-yellow-800";
      case "mitigating":
        return "bg-orange-100 text-orange-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "liquidity":
        return <DollarSign className="h-4 w-4" />;
      case "credit":
        return <CreditCard className="h-4 w-4" />;
      case "market":
        return <BarChart3 className="h-4 w-4" />;
      case "operational":
        return <Settings className="h-4 w-4" />;
      case "regulatory":
        return <FileText className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "identified":
        return <AlertTriangle className="h-4 w-4" />;
      case "monitoring":
        return <Eye className="h-4 w-4" />;
      case "mitigating":
        return <Shield className="h-4 w-4" />;
      case "resolved":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <XCircle className="h-4 w-4" />;
    }
  };

  const riskDistribution = riskAssessments.reduce(
    (acc, risk) => {
      acc[risk.category] = (acc[risk.category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const averageRiskScore =
    riskAssessments.reduce((sum, risk) => sum + risk.riskScore, 0) /
    riskAssessments.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Risk Assessment & Management
          </h2>
          <p className="text-gray-600">
            Identify, monitor, and mitigate financial risks
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="liquidity">Liquidity</SelectItem>
              <SelectItem value="credit">Credit</SelectItem>
              <SelectItem value="market">Market</SelectItem>
              <SelectItem value="operational">Operational</SelectItem>
              <SelectItem value="regulatory">Regulatory</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="identified">Identified</SelectItem>
              <SelectItem value="monitoring">Monitoring</SelectItem>
              <SelectItem value="mitigating">Mitigating</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => setShowAddForm((s) => !s)}
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            {showAddForm ? "Close" : "Add Risk"}
          </Button>
        </div>
      </div>

      {/* Add Risk Form */}
      {showAddForm && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="space-y-4">
              {/* Row 1: Risk Name, Category, Status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Risk Name *
                  </label>
                  <Input
                    placeholder="e.g., Decline in Customer Demand"
                    value={form.riskName}
                    onChange={(e) =>
                      setForm({ ...form, riskName: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <Select
                    value={form.category}
                    onValueChange={(value: any) =>
                      setForm({ ...form, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="liquidity">Liquidity</SelectItem>
                      <SelectItem value="credit">Credit</SelectItem>
                      <SelectItem value="market">Market</SelectItem>
                      <SelectItem value="operational">Operational</SelectItem>
                      <SelectItem value="regulatory">Regulatory</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <Select
                    value={form.status}
                    onValueChange={(value: any) =>
                      setForm({ ...form, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="identified">Identified</SelectItem>
                      <SelectItem value="monitoring">Monitoring</SelectItem>
                      <SelectItem value="mitigating">Mitigating</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Row 2: Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Description
                </label>
                <Textarea
                  placeholder="Brief description of the risk"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="min-h-[60px]"
                />
              </div>

              {/* Row 3: Probability and Impact Sliders */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">
                      Probability (%)
                    </label>
                    <span className="text-lg font-bold text-blue-600">
                      {form.probability}%
                    </span>
                  </div>
                  <Slider
                    min={0}
                    max={100}
                    step={1}
                    value={[form.probability]}
                    onValueChange={(value) =>
                      setForm({ ...form, probability: value[0] })
                    }
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0%</span>
                    <span>100%</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">
                      Impact (%)
                    </label>
                    <span className="text-lg font-bold text-orange-600">
                      {form.impact}%
                    </span>
                  </div>
                  <Slider
                    min={0}
                    max={100}
                    step={1}
                    value={[form.impact]}
                    onValueChange={(value) =>
                      setForm({ ...form, impact: value[0] })
                    }
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>

              {/* Row 4: Risk Score Display */}
              <div className="p-3 bg-white rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Risk Score (Auto-calculated)
                  </span>
                  <Badge
                    className={
                      riskScore >= 70
                        ? "bg-red-100 text-red-800"
                        : riskScore >= 40
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                    }
                  >
                    {riskScore}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Formula: Probability × Impact = {form.probability} ×{" "}
                  {form.impact} = {riskScore}
                </p>
              </div>

              {/* Row 5: Current Mitigation */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Current Mitigation
                </label>
                <Textarea
                  placeholder="Steps already being taken (one per line)"
                  value={form.currentMitigation}
                  onChange={(e) =>
                    setForm({ ...form, currentMitigation: e.target.value })
                  }
                  className="min-h-[70px]"
                />
              </div>

              {/* Row 6: Recommended Actions */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Recommended Actions
                </label>
                <Textarea
                  placeholder="Suggested additional steps (one per line)"
                  value={form.recommendedActions}
                  onChange={(e) =>
                    setForm({ ...form, recommendedActions: e.target.value })
                  }
                  className="min-h-[70px]"
                />
              </div>

              {/* Row 7: Action Buttons */}
              <div className="flex gap-2 justify-end pt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false);
                    setForm({
                      riskName: "",
                      description: "",
                      category: "operational",
                      probability: 50,
                      impact: 50,
                      status: "identified",
                      currentMitigation: "",
                      recommendedActions: "",
                    });
                  }}
                  disabled={adding}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddRisk}
                  disabled={adding || !form.riskName.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {adding ? "Saving..." : "Save Risk"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Risk Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Risks</p>
                <p className="text-2xl font-bold text-blue-600">
                  {filteredRisks.length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  High Risk Items
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {filteredRisks.filter((r) => r.riskScore >= 70).length}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Avg Risk Score
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {averageRiskScore.toFixed(0)}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Resolved Risks
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {
                    riskAssessments.filter((r) => r.status === "resolved")
                      .length
                  }
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Assessment Table */}
      <Card>
        <CardHeader>
          <CardTitle>Risk Register</CardTitle>
          <CardDescription>
            Comprehensive risk tracking with mitigation strategies and status
            monitoring
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    Risk
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900">
                    Category
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900">
                    Probability
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900">
                    Impact
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900">
                    Risk Score
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    Current Mitigation
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredRisks.map((risk) => (
                  <tr key={risk.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <span className="font-medium text-gray-900">
                          {risk.riskName}
                        </span>
                        <p className="text-sm text-gray-600 mt-1">
                          {risk.description}
                        </p>
                      </div>
                    </td>
                    <td className="text-center py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        {getCategoryIcon(risk.category)}
                        <Badge variant="secondary">{risk.category}</Badge>
                      </div>
                    </td>
                    <td className="text-center py-3 px-4">
                      <div className="flex flex-col items-center">
                        <span className="font-medium">{risk.probability}%</span>
                        <Progress
                          value={risk.probability}
                          className="w-12 h-1 mt-1"
                        />
                      </div>
                    </td>
                    <td className="text-center py-3 px-4">
                      <div className="flex flex-col items-center">
                        <span className="font-medium">{risk.impact}</span>
                        <Progress
                          value={risk.impact}
                          className="w-12 h-1 mt-1"
                        />
                      </div>
                    </td>
                    <td className="text-center py-3 px-4">
                      <Badge className={getRiskScoreColor(risk.riskScore)}>
                        {risk.riskScore}
                      </Badge>
                    </td>
                    <td className="text-center py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        {getStatusIcon(risk.status)}
                        <Badge className={getStatusColor(risk.status)}>
                          {risk.status}
                        </Badge>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="max-w-xs">
                        {risk.currentMitigation
                          .slice(0, 2)
                          .map((mitigation, index) => (
                            <div
                              key={index}
                              className="text-sm text-gray-600 mb-1"
                            >
                              • {mitigation}
                            </div>
                          ))}
                        {risk.currentMitigation.length > 2 && (
                          <span className="text-xs text-gray-500">
                            +{risk.currentMitigation.length - 2} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="text-center py-3 px-4">
                      <Select
                        value={risk.status}
                        onValueChange={(status) =>
                          onUpdateRiskStatus(
                            risk.id,
                            status as RiskAssessment["status"],
                          )
                        }
                      >
                        <SelectTrigger className="w-28">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="identified">Identified</SelectItem>
                          <SelectItem value="monitoring">Monitoring</SelectItem>
                          <SelectItem value="mitigating">Mitigating</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Risk Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Risk Category Distribution</CardTitle>
            <CardDescription>Breakdown of risks by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(riskDistribution).map(([category, count]) => (
                <div
                  key={category}
                  className="flex justify-between items-center"
                >
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(category)}
                    <span className="capitalize font-medium">{category}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24">
                      <Progress
                        value={(count / riskAssessments.length) * 100}
                        className="h-2"
                      />
                    </div>
                    <span className="font-medium w-8 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk Mitigation Strategies</CardTitle>
            <CardDescription>
              Recommended actions for high-priority risks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredRisks
                .filter((risk) => risk.riskScore >= 40)
                .slice(0, 4)
                .map((risk) => (
                  <div key={risk.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900">
                        {risk.riskName}
                      </h4>
                      <Badge className={getRiskScoreColor(risk.riskScore)}>
                        {risk.riskScore}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        Recommended Actions:
                      </p>
                      {risk.recommendedActions
                        .slice(0, 2)
                        .map((action, index) => (
                          <div
                            key={index}
                            className="text-sm text-gray-600 pl-2"
                          >
                            • {action}
                          </div>
                        ))}
                    </div>
                    <div className="mt-3 text-xs text-gray-500">
                      Last reviewed:{" "}
                      {risk.lastReviewed
                        ? new Date(risk.lastReviewed).toLocaleDateString()
                        : "N/A"}
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
