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
import { Download, FileText, Share2, Calendar } from "lucide-react";
import { useState } from "react";

interface Report {
  id: string;
  name: string;
  description: string;
  sections: string[];
  createdDate: string;
  format: "pdf" | "excel";
}

const ExportReporting = () => {
  const [selectedFormat, setSelectedFormat] = useState<"pdf" | "excel">("pdf");
  const [selectedPeriod, setSelectedPeriod] = useState("current");
  const [selectedSections, setSelectedSections] = useState<string[]>([
    "executive-summary",
    "revenue-summary",
    "lead-performance",
    "sales-team",
    "pipeline-health",
  ]);

  const [generatedReports, setGeneratedReports] = useState<Report[]>([
    {
      id: "report-1",
      name: "November KPI Report",
      description: "Complete KPI performance for November 2024",
      sections: [
        "Executive Summary",
        "Revenue Performance",
        "Lead Metrics",
        "Sales Team Performance",
      ],
      createdDate: "2024-11-30",
      format: "pdf",
    },
    {
      id: "report-2",
      name: "October Performance Analysis",
      description: "Detailed analysis with benchmarking comparison",
      sections: [
        "Executive Summary",
        "Revenue Performance",
        "Benchmarking Analysis",
      ],
      createdDate: "2024-10-31",
      format: "excel",
    },
  ]);

  const reportSections = [
    {
      id: "executive-summary",
      name: "Executive Summary",
      description: "High-level overview of key metrics",
    },
    {
      id: "revenue-summary",
      name: "Revenue Summary",
      description: "Revenue performance and growth metrics",
    },
    {
      id: "lead-performance",
      name: "Lead Performance",
      description: "Lead generation and conversion analytics",
    },
    {
      id: "sales-team",
      name: "Sales Team Performance",
      description: "Individual and team-level metrics",
    },
    {
      id: "pipeline-health",
      name: "Pipeline Health",
      description: "Pipeline metrics and forecast accuracy",
    },
    {
      id: "benchmarking",
      name: "Benchmarking Analysis",
      description: "Industry comparison and competitive insights",
    },
    {
      id: "trends",
      name: "Trend Analysis",
      description: "Historical trends and patterns",
    },
  ];

  const handleGenerateReport = () => {
    const newReport: Report = {
      id: `report-${Date.now()}`,
      name: `${selectedPeriod === "current" ? "Current Month" : selectedPeriod} KPI Report`,
      description: `KPI report for ${selectedPeriod}`,
      sections: selectedSections.map(
        (id) => reportSections.find((s) => s.id === id)?.name || "",
      ),
      createdDate: new Date().toISOString().split("T")[0],
      format: selectedFormat,
    };
    setGeneratedReports([newReport, ...generatedReports]);
  };

  const handleDownloadReport = (reportId: string, format: string) => {
    // Simulate report download
    console.log(`Downloading report ${reportId} as ${format}`);
    alert(`Report downloaded as ${format.toUpperCase()}`);
  };

  const handleShareReport = (reportId: string) => {
    // Simulate report sharing
    console.log(`Sharing report ${reportId}`);
    alert("Report link copied to clipboard!");
  };

  return (
    <div className="space-y-6">
      {/* Generate New Report */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Generate Report</CardTitle>
          <CardDescription>
            Create a custom KPI report tailored to your needs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Report Configuration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Report Format
              </label>
              <Select
                value={selectedFormat}
                onValueChange={(value: "pdf" | "excel") =>
                  setSelectedFormat(value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF Document</SelectItem>
                  <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Report Period
              </label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">Current Month</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="last-quarter">Last Quarter</SelectItem>
                  <SelectItem value="last-year">Last Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Section Selection */}
          <div>
            <label className="text-sm font-medium mb-3 block">
              Report Sections
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {reportSections.map((section) => (
                <div
                  key={section.id}
                  className="flex items-start gap-3 p-3 border rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer"
                  onClick={() =>
                    setSelectedSections(
                      selectedSections.includes(section.id)
                        ? selectedSections.filter((id) => id !== section.id)
                        : [...selectedSections, section.id],
                    )
                  }
                >
                  <input
                    type="checkbox"
                    checked={selectedSections.includes(section.id)}
                    onChange={() => {}}
                    className="mt-1"
                  />
                  <div>
                    <p className="text-sm font-medium">{section.name}</p>
                    <p className="text-xs text-gray-600">
                      {section.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerateReport}
            className="w-full gap-2"
            disabled={selectedSections.length === 0}
          >
            <Download className="h-4 w-4" />
            Generate {selectedFormat.toUpperCase()} Report
          </Button>
        </CardContent>
      </Card>

      {/* Generated Reports */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Generated Reports</h3>
        <div className="grid grid-cols-1 gap-4">
          {generatedReports.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="p-8 text-center">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600">
                  No reports generated yet. Create your first report above.
                </p>
              </CardContent>
            </Card>
          ) : (
            generatedReports.map((report) => (
              <Card
                key={report.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="h-5 w-5 text-gray-600" />
                        <h4 className="font-semibold text-sm">{report.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {report.format.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 mb-3">
                        {report.description}
                      </p>

                      {/* Report Sections */}
                      <div className="flex gap-2 flex-wrap mb-3">
                        {report.sections.map((section, idx) => (
                          <Badge
                            key={idx}
                            variant="secondary"
                            className="text-xs"
                          >
                            {section}
                          </Badge>
                        ))}
                      </div>

                      {/* Report Metadata */}
                      <div className="flex items-center gap-4 text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {report.createdDate}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleDownloadReport(report.id, report.format)
                        }
                        title="Download report"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleShareReport(report.id)}
                        title="Share report"
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Report Tips */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-base">Pro Tips for Reports</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-blue-900">
          <p>
            💡 <strong>Executive Summary:</strong> Perfect for sharing with
            management and stakeholders.
          </p>
          <p>
            💡 <strong>Excel Format:</strong> Choose this for detailed data
            analysis and further processing.
          </p>
          <p>
            💡 <strong>Benchmarking Section:</strong> Shows how you compare to
            industry standards.
          </p>
          <p>
            💡 <strong>Custom Ranges:</strong> Generate reports for specific
            date ranges for deep analysis.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExportReporting;
