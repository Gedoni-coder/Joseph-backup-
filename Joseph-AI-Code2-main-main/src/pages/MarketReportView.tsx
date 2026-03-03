import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Download,
  Share,
  Printer,
  FileText,
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar as CalendarIcon,
  User,
} from "lucide-react";
import { generateReportPDF } from "@/lib/pdf-generator";
import { useToast } from "@/hooks/use-toast";

interface ReportData {
  id: string;
  title: string;
  summary: string;
  dateGenerated: Date;
  author: string;
  confidence: number;
  keyMetrics: Array<{
    label: string;
    value: string;
    trend: "up" | "down" | "stable";
  }>;
  insights: string[];
  recommendations: string[];
  nextSteps: string[];
}

export default function MarketReportView() {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Mock data - in production, fetch from API using reportId
  const report: ReportData = {
    id: reportId || "report-001",
    title: "Q4 2024 Market Analysis Summary",
    summary:
      "Comprehensive analysis of market trends, competitive positioning, and strategic recommendations for the upcoming quarter.",
    dateGenerated: new Date(),
    author: "Joseph AI Analysis",
    confidence: 87,
    keyMetrics: [
      { label: "Total TAM", value: "$2.5B", trend: "up" },
      { label: "Market Growth", value: "12.5%", trend: "up" },
      { label: "Customer Segments", value: "8", trend: "stable" },
      { label: "Competitors", value: "15", trend: "down" },
    ],
    insights: [
      "Market shows strong growth trajectory with 12.5% YoY increase",
      "Customer preferences shifting towards digital-first solutions",
      "Competitive landscape consolidating with 3 major players gaining market share",
      "Price sensitivity increasing in lower-tier segments",
      "New market entrants targeting niche segments with innovation-focused strategies",
    ],
    recommendations: [
      "Accelerate product development in high-growth segments",
      "Implement dynamic pricing strategy based on segment analysis",
      "Strengthen partnerships with key distribution channels",
      "Invest in digital marketing to capture emerging customer segments",
      "Develop competitive differentiation through service excellence",
    ],
    nextSteps: [
      "Conduct deep-dive analysis on top 3 customer segments",
      "Develop competitive response strategies for major players",
      "Update pricing model based on market trends",
      "Create go-to-market plan for Q1 2025",
      "Schedule stakeholder review meeting",
    ],
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

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const handleGeneratePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      await generateReportPDF(report);
      toast({
        title: "PDF Generated",
        description: "Report has been downloaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate PDF",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    const csvContent = [
      ['Market Analysis Report Export'],
      ['Title', report.title],
      ['Author', report.author],
      ['Generated', formatDate(report.dateGenerated)],
      ['Confidence', `${report.confidence}%`],
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
  };

  const handleShare = () => {
    const shareText = `Check out this Market Analysis Report: "${report.title}"\n\nConfidence: ${report.confidence}%\n\n${report.summary}`;

    if (navigator.share) {
      navigator.share({
        title: report.title,
        text: shareText,
      }).catch(() => {
        copyToClipboard(shareText);
      });
    } else {
      copyToClipboard(shareText);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied to Clipboard",
        description: "Report summary copied successfully",
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {report.title}
              </h1>
              <p className="text-gray-600 text-lg">{report.summary}</p>
            </div>
            <div className="flex gap-2">
              <Button
              variant="outline"
              onClick={handlePrint}
            >
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button
              variant="outline"
              onClick={handleExport}
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button
              variant="outline"
              onClick={handleShare}
            >
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
              <Button
                onClick={handleGeneratePDF}
                disabled={isGeneratingPDF}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Download className="w-4 h-4 mr-2" />
                {isGeneratingPDF ? "Generating..." : "Download PDF"}
              </Button>
            </div>
          </div>
        </div>

        {/* Meta Information */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-600">
                    {formatDate(report.dateGenerated)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-600">{report.author}</span>
                </div>
              </div>
              <Badge variant="outline">
                {report.confidence}% confidence
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Confidence Level */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Report Confidence Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Overall Confidence</span>
              <span className="font-semibold">{report.confidence}%</span>
            </div>
            <Progress value={report.confidence} className="h-3" />
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Key Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {report.keyMetrics.map((metric, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-2">{metric.label}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900">
                      {metric.value}
                    </span>
                    {getTrendIcon(metric.trend)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Key Insights */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Key Insights</CardTitle>
            <CardDescription>
              Critical findings from the market analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {report.insights.map((insight, index) => (
                <li key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">{insight}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Strategic Recommendations */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Strategic Recommendations</CardTitle>
            <CardDescription>
              Actionable recommendations based on analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {report.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">{recommendation}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Next Steps</CardTitle>
            <CardDescription>
              Recommended actions to take following this analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {report.nextSteps.map((step, index) => (
                <li key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">{step}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => navigate(-1)}
          >
            Close Report
          </Button>
          <Button
            onClick={handleGeneratePDF}
            disabled={isGeneratingPDF}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            <FileText className="w-4 h-4 mr-2" />
            {isGeneratingPDF ? "Generating PDF..." : "Generate & Download Report"}
          </Button>
        </div>
      </div>
    </div>
  );
}
