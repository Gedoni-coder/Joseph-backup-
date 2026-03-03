import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Share2, Clock, FileText, BarChart3 } from "lucide-react";

export const KPIExportReporting = () => {
  const [selectedFormat, setSelectedFormat] = useState("pdf");
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const [selectedSections, setSelectedSections] = useState({
    summary: true,
    revenue: true,
    leads: true,
    teamPerformance: true,
    pipeline: true,
    recommendations: true,
  });

  const reportTemplates = [
    {
      id: 1,
      name: "Executive Summary Report",
      description: "High-level KPI overview for executives and stakeholders",
      sections: ["Summary", "Revenue Performance", "Key Metrics"],
      frequency: "Weekly",
      lastGenerated: "2 days ago",
      format: ["PDF", "Excel"],
    },
    {
      id: 2,
      name: "Sales Team Performance Report",
      description: "Detailed performance metrics for each sales representative",
      sections: [
        "Team Overview",
        "Individual Performance",
        "Rankings",
        "Coaching Recommendations",
      ],
      frequency: "Weekly",
      lastGenerated: "5 days ago",
      format: ["PDF", "Excel"],
    },
    {
      id: 3,
      name: "Pipeline Health Report",
      description: "In-depth pipeline analysis and forecast accuracy",
      sections: [
        "Pipeline Summary",
        "Stage Distribution",
        "Risk Assessment",
        "Forecast vs Actual",
      ],
      frequency: "Bi-weekly",
      lastGenerated: "1 week ago",
      format: ["PDF", "Excel"],
    },
    {
      id: 4,
      name: "Revenue & Forecasting Report",
      description: "Revenue performance and next month/quarter projections",
      sections: ["Revenue Summary", "Growth Trends", "Forecast", "Gap Analysis"],
      frequency: "Monthly",
      lastGenerated: "Never",
      format: ["PDF", "Excel"],
    },
    {
      id: 5,
      name: "KPI Benchmark Report",
      description: "Performance comparison against industry benchmarks",
      sections: [
        "Benchmark Comparison",
        "Performance Gaps",
        "Top Performer Analysis",
        "Recommendations",
      ],
      frequency: "Monthly",
      lastGenerated: "3 days ago",
      format: ["PDF", "Excel"],
    },
    {
      id: 6,
      name: "Custom Detailed Report",
      description: "Create a custom report with selected KPIs and sections",
      sections: [
        "Select Sections",
        "Choose KPIs",
        "Set Time Range",
        "Add Insights",
      ],
      frequency: "On-demand",
      lastGenerated: "N/A",
      format: ["PDF", "Excel"],
    },
  ];

  const handleExport = (templateId: number, format: string) => {
    alert(
      `Generating ${reportTemplates.find((t) => t.id === templateId)?.name} as ${format}...`
    );
  };

  const toggleSection = (section: keyof typeof selectedSections) => {
    setSelectedSections({
      ...selectedSections,
      [section]: !selectedSections[section],
    });
  };

  return (
    <div className="space-y-6">
      {/* Quick Export */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Export</CardTitle>
          <CardDescription>
            Download the latest KPI report in your preferred format
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Format Selection */}
            <div>
              <label className="text-sm font-semibold block mb-2">
                Export Format
              </label>
              <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF (High Quality)</SelectItem>
                  <SelectItem value="excel">Excel (Editable)</SelectItem>
                  <SelectItem value="csv">CSV (Data Only)</SelectItem>
                  <SelectItem value="powerpoint">PowerPoint (Slides)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Period Selection */}
            <div>
              <label className="text-sm font-semibold block mb-2">
                Report Period
              </label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Last Week</SelectItem>
                  <SelectItem value="monthly">This Month</SelectItem>
                  <SelectItem value="quarterly">This Quarter</SelectItem>
                  <SelectItem value="annual">This Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Export Button */}
            <div className="flex items-end">
              <Button className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Custom Report Builder */}
      <Card>
        <CardHeader>
          <CardTitle>Custom Report Builder</CardTitle>
          <CardDescription>
            Select the sections you want to include in your report
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {[
              {
                key: "summary",
                label: "KPI Summary",
                description: "Overview of all KPIs with current values and trends",
              },
              {
                key: "revenue",
                label: "Revenue Analysis",
                description: "Revenue trends, forecasts, and performance metrics",
              },
              {
                key: "leads",
                label: "Lead Generation",
                description: "Leads generated, conversion rates, and funnel analysis",
              },
              {
                key: "teamPerformance",
                label: "Team Performance",
                description: "Individual sales rep performance and rankings",
              },
              {
                key: "pipeline",
                label: "Pipeline Health",
                description: "Pipeline value, stage distribution, and risk assessment",
              },
              {
                key: "recommendations",
                label: "AI Recommendations",
                description: "AI-generated insights and strategic recommendations",
              },
            ].map((section) => (
              <label
                key={section.key}
                className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition"
              >
                <input
                  type="checkbox"
                  checked={
                    selectedSections[section.key as keyof typeof selectedSections]
                  }
                  onChange={() =>
                    toggleSection(section.key as keyof typeof selectedSections)
                  }
                  className="w-4 h-4 rounded"
                />
                <div className="ml-3 flex-1">
                  <p className="font-semibold text-sm">{section.label}</p>
                  <p className="text-xs text-gray-600">{section.description}</p>
                </div>
              </label>
            ))}
          </div>

          <div className="flex gap-3">
            <Button variant="default">
              <Download className="h-4 w-4 mr-2" />
              Generate Custom Report
            </Button>
            <Button variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              Share Report Link
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Pre-built Report Templates */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Pre-built Report Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reportTemplates.map((template) => (
            <Card key={template.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base">{template.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {template.description}
                    </CardDescription>
                  </div>
                  <FileText className="h-5 w-5 text-blue-600 flex-shrink-0" />
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                {/* Sections */}
                <div>
                  <p className="text-xs text-gray-600 mb-2 font-semibold">
                    INCLUDED SECTIONS
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {template.sections.map((section, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {section}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Frequency & Last Generated */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-gray-600">Frequency</p>
                    <p className="font-semibold">{template.frequency}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Last Generated</p>
                    <p className="font-semibold">{template.lastGenerated}</p>
                  </div>
                </div>

                {/* Export Buttons */}
                <div className="flex gap-2 pt-2">
                  {template.format.includes("PDF") && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleExport(template.id, "PDF")}
                    >
                      <Download className="h-3 w-3 mr-1" />
                      PDF
                    </Button>
                  )}
                  {template.format.includes("Excel") && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleExport(template.id, "Excel")}
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Excel
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Scheduled Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Scheduled Reports
          </CardTitle>
          <CardDescription>
            Set up automatic report generation and delivery
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {[
              {
                name: "Weekly Executive Summary",
                schedule: "Every Monday at 8:00 AM",
                recipients: "CEO, Sales Director",
                format: "PDF",
                status: "Active",
              },
              {
                name: "Monthly KPI Deep Dive",
                schedule: "First day of month at 9:00 AM",
                recipients: "Sales Team, Management",
                format: "Excel",
                status: "Active",
              },
              {
                name: "Daily Pipeline Alert",
                schedule: "Every weekday at 5:00 PM",
                recipients: "Sales Director",
                format: "PDF",
                status: "Active",
              },
            ].map((report, idx) => (
              <div key={idx} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold">{report.name}</h4>
                    <p className="text-sm text-gray-600">{report.schedule}</p>
                  </div>
                  <Badge variant="default">
                    {report.status === "Active" ? "✓ Active" : "Inactive"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <span className="text-gray-600">Recipients: </span>
                    <span className="font-semibold">{report.recipients}</span>
                    <span className="text-gray-600 ml-4">Format: </span>
                    <span className="font-semibold">{report.format}</span>
                  </div>
                  <Button size="sm" variant="outline">
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <Button variant="outline" className="w-full">
            Add New Scheduled Report
          </Button>
        </CardContent>
      </Card>

      {/* Report History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Report History
          </CardTitle>
          <CardDescription>View and download previously generated reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                name: "Executive Summary - January 2025",
                date: "Feb 3, 2025 at 8:00 AM",
                size: "2.4 MB",
                format: "PDF",
              },
              {
                name: "Sales Team Performance - January 2025",
                date: "Feb 1, 2025 at 9:00 AM",
                size: "1.8 MB",
                format: "Excel",
              },
              {
                name: "Pipeline Analysis - Late January",
                date: "Jan 31, 2025 at 4:30 PM",
                size: "3.2 MB",
                format: "PDF",
              },
              {
                name: "Revenue Forecast - January 2025",
                date: "Jan 29, 2025 at 10:15 AM",
                size: "1.5 MB",
                format: "Excel",
              },
            ].map((report, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex-1">
                  <p className="font-semibold text-sm">{report.name}</p>
                  <p className="text-xs text-gray-600">{report.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline">{report.format}</Badge>
                  <span className="text-xs text-gray-600">{report.size}</span>
                  <Button size="sm" variant="ghost">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
