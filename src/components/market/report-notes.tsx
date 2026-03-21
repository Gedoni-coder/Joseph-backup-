import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  FileText,
  TrendingUp,
  TrendingDown,
  Minus,
  Download,
  Share,
  Calendar,
  User,
} from "lucide-react";
import { type ReportNote } from "@/hooks/useMarketDataAPI";
import { ActionPlanDialog } from "@/components/market/action-plan-dialog";
import { useToast } from "@/hooks/use-toast";
import { generateReportPDF } from "@/lib/pdf-generator";

interface ReportNotesProps {
  reportNotes: ReportNote[];
}

interface ReportEngagementEvent {
  id: number;
  report_note: number | null;
  action_type: "generated_pdf" | "exported_csv" | "shared";
  channel: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

interface ReportActionPlanRecord {
  id: number;
  report_note: number | null;
  report_title: string;
  title: string;
  priority: "low" | "medium" | "high" | "critical";
  owner: string;
  target_date: string;
  created_at: string;
}

export function ReportNotes({ reportNotes }: ReportNotesProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [actionPlanOpen, setActionPlanOpen] = useState(false);
  const [actionPlanReportId, setActionPlanReportId] = useState<string | null>(null);
  const [actionPlanReport, setActionPlanReport] = useState<string | null>(null);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [reportEvents, setReportEvents] = useState<ReportEngagementEvent[]>([]);
  const [reportActionPlans, setReportActionPlans] = useState<ReportActionPlanRecord[]>([]);
  const baseUrl = import.meta.env.VITE_DJANGO_API_URL || "/api";

  const normalizedReports = reportNotes;
  const reportTitleMap = useMemo(
    () =>
      new Map(
        normalizedReports
          .map((report) => [Number(report.id), report.title] as const)
          .filter(([id]) => Number.isFinite(id)),
      ),
    [normalizedReports],
  );

  const formatDate = (dateValue: string) => {
    if (!dateValue) {
      return "-";
    }

    const parsedDate = new Date(dateValue);
    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(parsedDate);
  };

  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      case "stable":
        return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return "text-green-600";
      case "down":
        return "text-red-600";
      case "stable":
        return "text-gray-600";
    }
  };

  const getActionLabel = (actionType: ReportEngagementEvent["action_type"]) => {
    if (actionType === "generated_pdf") {
      return "Generated PDF";
    }

    if (actionType === "exported_csv") {
      return "Exported CSV";
    }

    return "Shared";
  };

  const extractList = <T,>(payload: unknown): T[] => {
    if (Array.isArray(payload)) {
      return payload as T[];
    }

    if (
      payload &&
      typeof payload === "object" &&
      "results" in payload &&
      Array.isArray((payload as { results?: unknown[] }).results)
    ) {
      return (payload as { results: T[] }).results;
    }

    return [];
  };

  const loadHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const [eventsResponse, actionPlansResponse] = await Promise.all([
        fetch(`${baseUrl}/market/report-events/`),
        fetch(`${baseUrl}/market/report-action-plans/`),
      ]);

      if (!eventsResponse.ok || !actionPlansResponse.ok) {
        throw new Error("Failed to load report history");
      }

      const eventsPayload = await eventsResponse.json();
      const actionPlansPayload = await actionPlansResponse.json();

      setReportEvents(extractList<ReportEngagementEvent>(eventsPayload));
      setReportActionPlans(extractList<ReportActionPlanRecord>(actionPlansPayload));
    } catch {
      setReportEvents([]);
      setReportActionPlans([]);
    } finally {
      setHistoryLoading(false);
    }
  }, [baseUrl]);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  const handleViewFullReport = (reportId: string, reportTitle: string) => {
    navigate(`/market-report/${reportId}`, { state: { title: reportTitle } });
  };

  const handleCreateActionPlanForReport = (report: ReportNote) => {
    setActionPlanReportId(report.id);
    setActionPlanReport(report.title);
    setActionPlanOpen(true);
  };

  const logReportEvent = async (
    reportId: string,
    actionType: "generated_pdf" | "exported_csv" | "shared",
    channel: string,
    metadata: Record<string, unknown> = {},
  ) => {
    const numericReportId = Number(reportId);
    if (!Number.isFinite(numericReportId)) {
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/market/report-events/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          report_note: numericReportId,
          action_type: actionType,
          channel,
          metadata,
        }),
      });

      if (response.ok) {
        void loadHistory();
      }
    } catch {
      // Ignore event logging failures so primary UX still works.
    }
  };

  const handleGenerateReport = async (report: ReportNote) => {
    setGeneratingPDF(true);
    try {
      const generatedAt = report.dateGenerated
        ? new Date(report.dateGenerated)
        : new Date();

      await generateReportPDF({
        id: report.id,
        title: report.title,
        summary: report.summary || report.content || "",
        dateGenerated: Number.isNaN(generatedAt.getTime()) ? new Date() : generatedAt,
        author: report.author || "",
        confidence: report.confidence ?? 0,
        keyMetrics: report.keyMetrics,
        insights: report.insights,
        recommendations: report.recommendations,
        nextSteps: report.nextSteps,
      });
      toast({
        title: "PDF Generated",
        description: "Report has been downloaded successfully",
      });
      await logReportEvent(report.id, "generated_pdf", "download", {
        title: report.title,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate PDF",
        variant: "destructive",
      });
    } finally {
      setGeneratingPDF(false);
    }
  };

  const handleExportReport = (report: ReportNote) => {
    const csvContent = [
      ['Market Analysis Report Export'],
      ['Title', report.title],
      ['Author', report.author || "-"],
      ['Generated', formatDate(report.dateGenerated)],
      ['Confidence', report.confidence !== null ? `${report.confidence}%` : "-"],
      [],
      ['KEY METRICS'],
      ['Metric', 'Value', 'Trend'],
      ...report.keyMetrics.map(m => [m.label, m.value, m.trend]),
      [],
      ['KEY INSIGHTS'],
      ...report.insights.map((i, idx) => [`${idx + 1}. ${i}`]),
      [],
      ['RECOMMENDATIONS'],
      ...report.recommendations.map((r, idx) => [`${idx + 1}. ${r}`]),
      [],
      ['NEXT STEPS'],
      ...report.nextSteps.map((s, idx) => [`${idx + 1}. ${s}`]),
    ]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `market-analysis-${report.id}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Report Exported",
      description: "Report exported as CSV successfully",
    });

    void logReportEvent(report.id, "exported_csv", "download", {
      title: report.title,
      format: "csv",
    });
  };

  const handleShareReport = (report: ReportNote) => {
    const shareText = `Check out this Market Analysis Report: "${report.title}"\n\nConfidence: ${report.confidence !== null ? `${report.confidence}%` : "-"}\n\n${report.summary || report.content || ""}`;

    if (navigator.share) {
      navigator.share({
        title: report.title,
        text: shareText,
      })
        .then(() => {
          void logReportEvent(report.id, "shared", "web-share", {
            title: report.title,
          });
        })
        .catch(() => {
          // Share dialog dismissed, copy to clipboard instead
          copyToClipboard(shareText, report);
        });
    } else {
      // Fallback: copy to clipboard
      copyToClipboard(shareText, report);
    }
  };

  const copyToClipboard = (text: string, report: ReportNote) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied to Clipboard",
        description: "Report summary copied successfully",
      });
      void logReportEvent(report.id, "shared", "clipboard", {
        title: report.title,
      });
    }).catch(() => {
      toast({
        title: "Share Failed",
        description: "Unable to share report",
        variant: "destructive",
      });
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Market Analysis Reports
          </h2>
          <p className="text-gray-600">
            Comprehensive insights, metrics, and strategic recommendations
          </p>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => {
            if (normalizedReports.length > 0) {
              handleGenerateReport(normalizedReports[0]);
            }
          }}
          disabled={generatingPDF || normalizedReports.length === 0}
        >
          <FileText className="w-4 h-4 mr-2" />
          {generatingPDF ? "Generating..." : "Generate Report"}
        </Button>
      </div>

      <div className="space-y-6">
        {normalizedReports.map((report) => (
          <Card key={report.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl mb-2">{report.title}</CardTitle>
                  <CardDescription className="text-base">
                    {report.summary || report.content || "-"}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <Badge variant="outline">
                    {report.confidence !== null
                      ? `${report.confidence}% confidence`
                      : "- confidence"}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExportReport(report)}
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Export
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShareReport(report)}
                  >
                    <Share className="w-3 h-3 mr-1" />
                    Share
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-sm text-gray-600 pt-2">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(report.dateGenerated)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>{report.author || "-"}</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Key Metrics */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Key Metrics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {(report.keyMetrics || []).map((metric, index) => (
                    <div
                      key={index}
                      className="p-3 bg-gray-50 rounded-lg text-center"
                    >
                      <div className="text-sm text-gray-600 mb-1">
                        {metric.label}
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <span className="text-xl font-bold text-gray-900">
                          {metric.value}
                        </span>
                        {getTrendIcon(metric.trend)}
                      </div>
                    </div>
                  ))}
                  {(report.keyMetrics || []).length === 0 && (
                    <div className="text-sm text-gray-500">No key metrics in database for this report.</div>
                  )}
                </div>
              </div>

              {/* Confidence Level */}
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Report Confidence Level</span>
                  <span className="font-medium">
                    {report.confidence !== null ? `${report.confidence}%` : "-"}
                  </span>
                </div>
                <Progress value={report.confidence ?? 0} className="h-2" />
              </div>

              {/* Insights */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Key Insights
                </h3>
                <ul className="space-y-2">
                  {(report.insights || []).map((insight, index) => (
                    <li
                      key={index}
                      className="flex items-start text-sm text-gray-700"
                    >
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      {insight}
                    </li>
                  ))}
                  {(report.insights || []).length === 0 && (
                    <li className="text-sm text-gray-500">No insights in database for this report.</li>
                  )}
                </ul>
              </div>

              {/* Recommendations */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Strategic Recommendations
                </h3>
                <ul className="space-y-2">
                  {(report.recommendations || []).map((recommendation, index) => (
                    <li
                      key={index}
                      className="flex items-start text-sm text-gray-700"
                    >
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      {recommendation}
                    </li>
                  ))}
                  {(report.recommendations || []).length === 0 && (
                    <li className="text-sm text-gray-500">No recommendations in database for this report.</li>
                  )}
                </ul>
              </div>

              {/* Next Steps */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Next Steps
                </h3>
                <ul className="space-y-2">
                  {(report.nextSteps || []).map((step, index) => (
                    <li
                      key={index}
                      className="flex items-start text-sm text-gray-700"
                    >
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      {step}
                    </li>
                  ))}
                  {(report.nextSteps || []).length === 0 && (
                    <li className="text-sm text-gray-500">No next steps in database for this report.</li>
                  )}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4 border-t">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleViewFullReport(report.id, report.title)}
                >
                  View Full Report
                </Button>
                <Button
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  onClick={() => handleCreateActionPlanForReport(report)}
                >
                  Create Action Plan
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Report Summary Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">
            Market Analysis Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-900">
                {normalizedReports.length}
              </div>
              <div className="text-sm text-blue-700">Reports Generated</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-900">
                {normalizedReports.length > 0
                  ? Math.round(
                      normalizedReports.reduce(
                        (acc, r) => acc + (r.confidence ?? 0),
                        0,
                      ) / normalizedReports.length,
                    )
                  : 0}
                %
              </div>
              <div className="text-sm text-blue-700">Avg Confidence</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-900">
                {normalizedReports.reduce(
                  (acc, r) => acc + (r.insights || []).length,
                  0,
                )}
              </div>
              <div className="text-sm text-blue-700">Total Insights</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Report Actions History</CardTitle>
          <CardDescription>
            Live audit trail for report generation, exports, shares, and action plans.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <h3 className="mb-3 text-sm font-semibold text-gray-900">Recent Events</h3>
              <div className="space-y-2">
                {historyLoading && reportEvents.length === 0 && (
                  <p className="text-sm text-gray-500">Loading history from database...</p>
                )}
                {!historyLoading && reportEvents.length === 0 && (
                  <p className="text-sm text-gray-500">No report events in database yet.</p>
                )}
                {reportEvents.slice(0, 8).map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between rounded-md border border-gray-200 p-2"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {event.report_note && reportTitleMap.get(event.report_note)
                          ? reportTitleMap.get(event.report_note)
                          : "Unknown Report"}
                      </p>
                      <p className="text-xs text-gray-600">{formatDate(event.created_at)}</p>
                    </div>
                    <Badge variant="outline">{getActionLabel(event.action_type)}</Badge>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold text-gray-900">Latest Action Plans</h3>
              <div className="space-y-2">
                {historyLoading && reportActionPlans.length === 0 && (
                  <p className="text-sm text-gray-500">Loading action plans from database...</p>
                )}
                {!historyLoading && reportActionPlans.length === 0 && (
                  <p className="text-sm text-gray-500">No action plans in database yet.</p>
                )}
                {reportActionPlans.slice(0, 6).map((plan) => (
                  <div
                    key={plan.id}
                    className="flex items-center justify-between rounded-md border border-gray-200 p-2"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="truncate text-sm font-medium text-gray-900">{plan.title}</p>
                      <p className="truncate text-xs text-gray-600">
                        {plan.report_title || "Unknown Report"}
                        {plan.owner ? ` | Owner: ${plan.owner}` : ""}
                      </p>
                    </div>
                    <Badge variant="outline">{plan.priority}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <ActionPlanDialog
        open={actionPlanOpen}
        onOpenChange={setActionPlanOpen}
        reportId={actionPlanReportId || undefined}
        reportTitle={actionPlanReport || "Market Analysis Report"}
        onCreated={loadHistory}
      />
    </div>
  );
}
