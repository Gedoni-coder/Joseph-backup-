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
  FileText,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus,
  Eye,
  Download,
  BarChart3,
} from "lucide-react";
import { PolicyReport } from "../../lib/policy-economic-data";

interface PolicyReportsProps {
  policyReports: PolicyReport[];
  onGenerateReport: (type: PolicyReport["type"], period: string) => void;
  isLoading?: boolean;
}

export function PolicyReports({
  policyReports,
  onGenerateReport,
  isLoading = false,
}: PolicyReportsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const filteredReports = policyReports.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || report.type === typeFilter;

    return matchesSearch && matchesType;
  });

  const getTypeColor = (type: PolicyReport["type"]) => {
    switch (type) {
      case "compliance":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "alignment":
        return "bg-green-100 text-green-800 border-green-200";
      case "gap_analysis":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "impact_assessment":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getSeverityColor = (severity: string) => {
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

  const getFindingStatusIcon = (status: string) => {
    switch (status) {
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "in_progress":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "open":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const handleViewReport = (report: PolicyReport) => {
    const findings = report.findings
      .map(
        (f) =>
          `• ${f.category}: ${f.description} (${f.severity}) - ${f.recommendation}`,
      )
      .join("\n");

    alert(
      `Policy Report: ${report.title}\n\nGenerated: ${report.generatedDate ? new Date(report.generatedDate).toLocaleDateString() : "N/A"}\nPeriod: ${report.period}\nCompliance Score: ${report.complianceScore}%\n\nSummary: ${report.summary}\n\nKey Findings:\n${findings}\n\nRecommendations:\n${report.recommendations.map((r) => `• ${r}`).join("\n")}`,
    );
  };

  const handleDownloadReport = (report: PolicyReport) => {
    alert(
      `Downloading report: ${report.title}\n\nReport would be exported as PDF with all findings and recommendations.`,
    );
  };

  const handleGenerateNewReport = () => {
    const reportTypes: PolicyReport["type"][] = [
      "compliance",
      "alignment",
      "gap_analysis",
      "impact_assessment",
    ];
    const randomType =
      reportTypes[Math.floor(Math.random() * reportTypes.length)];
    const currentPeriod = `Q${Math.floor(new Date().getMonth() / 3 + 1)} ${new Date().getFullYear()}`;

    onGenerateReport(randomType, currentPeriod);
  };

  const averageCompliance = Math.round(
    policyReports.reduce((sum, report) => sum + report.complianceScore, 0) /
      (policyReports.length || 1),
  );
  const totalFindings = policyReports.reduce(
    (sum, report) => sum + report.findings.length,
    0,
  );
  const criticalFindings = policyReports.reduce(
    (sum, report) =>
      sum + report.findings.filter((f) => f.severity === "critical").length,
    0,
  );
  const resolvedFindings = policyReports.reduce(
    (sum, report) =>
      sum + report.findings.filter((f) => f.status === "resolved").length,
    0,
  );

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{policyReports.length}</div>
            <p className="text-xs text-muted-foreground">Reports generated</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Compliance
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageCompliance}%</div>
            <p className="text-xs text-muted-foreground">
              Average compliance score
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
            <div className="text-2xl font-bold">{criticalFindings}</div>
            <p className="text-xs text-muted-foreground">
              Requiring immediate action
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Resolution Rate
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalFindings > 0
                ? Math.round((resolvedFindings / totalFindings) * 100)
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground">Issues resolved</p>
          </CardContent>
        </Card>
      </div>

      {/* Actions and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Policy Analysis Reports</CardTitle>
              <CardDescription>
                Comprehensive policy compliance and alignment analysis reports
              </CardDescription>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleGenerateNewReport}
                  size="sm"
                  className="flex items-center gap-2"
                  disabled={isLoading}
                >
                  <Plus className="h-4 w-4" />
                  {isLoading ? "Generating..." : "Generate Report"}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Generate new policy analysis report</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search reports..."
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
                <SelectItem value="alignment">Alignment</SelectItem>
                <SelectItem value="gap_analysis">Gap Analysis</SelectItem>
                <SelectItem value="impact_assessment">
                  Impact Assessment
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reports List */}
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <Card key={report.id} className="border-l-4 border-l-purple-500">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="h-4 w-4" />
                        <h3 className="font-semibold">{report.title}</h3>
                        <Badge className={getTypeColor(report.type)}>
                          {report.type.replace("_", " ")}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Generated
                          </p>
                          <p className="font-medium">
                            {report.generatedDate
                              ? new Date(
                                  report.generatedDate,
                                ).toLocaleDateString()
                              : "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Period
                          </p>
                          <p className="font-medium">{report.period}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Findings
                          </p>
                          <p className="font-medium">
                            {report.findings.length} issues
                          </p>
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm text-muted-foreground">
                            Compliance Score
                          </p>
                          <span className="text-sm font-medium">
                            {report.complianceScore}%
                          </span>
                        </div>
                        <Progress
                          value={report.complianceScore}
                          className="h-2"
                        />
                      </div>

                      <p className="text-sm text-muted-foreground mb-3">
                        {report.summary}
                      </p>

                      {/* Key Findings */}
                      {report.findings.length > 0 && (
                        <div className="mb-3">
                          <p className="text-sm font-medium mb-2">
                            Key Findings
                          </p>
                          <div className="space-y-2">
                            {report.findings.slice(0, 3).map((finding) => (
                              <div
                                key={finding.id}
                                className="flex items-center gap-2 text-sm"
                              >
                                {getFindingStatusIcon(finding.status)}
                                <Badge
                                  className={getSeverityColor(finding.severity)}
                                  variant="outline"
                                >
                                  {finding.severity}
                                </Badge>
                                <span className="text-muted-foreground">
                                  {finding.category}:
                                </span>
                                <span className="flex-1 truncate">
                                  {finding.description}
                                </span>
                              </div>
                            ))}
                            {report.findings.length > 3 && (
                              <p className="text-xs text-muted-foreground">
                                +{report.findings.length - 3} more findings...
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Top Recommendations */}
                      {report.recommendations.length > 0 && (
                        <div>
                          <p className="text-sm font-medium mb-1">
                            Key Recommendations
                          </p>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            {report.recommendations
                              .slice(0, 2)
                              .map((rec, index) => (
                                <li
                                  key={index}
                                  className="flex items-start gap-1"
                                >
                                  <span>•</span>
                                  <span>{rec}</span>
                                </li>
                              ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewReport(report)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View full report</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadReport(report)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Download report</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredReports.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No reports found matching your criteria.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
