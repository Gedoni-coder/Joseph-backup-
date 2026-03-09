import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ModuleHeader from "@/components/ui/module-header";
import {
  FileText,
  Download,
  Eye,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Activity,
  Search,
  Filter,
  BarChart3,
  Clock,
  Users,
  Shield,
} from "lucide-react";

const AuditReports = () => {
  const [selectedType, setSelectedType] = useState("all");

  const auditReports = [
    {
      id: 1,
      title: "Financial Compliance Audit Q4 2023",
      type: "Financial",
      status: "Completed",
      date: "2024-01-15",
      auditor: "External - KPMG",
      findings: 3,
      severity: "Medium",
      description: "Quarterly financial compliance review including SOX controls and financial reporting",
      recommendations: 5,
      size: "2.4 MB",
    },
    {
      id: 2,
      title: "Operational Risk Assessment",
      type: "Operational",
      status: "In Progress",
      date: "2024-01-10",
      auditor: "Internal Audit Team",
      findings: 7,
      severity: "High",
      description: "Assessment of operational processes and risk management procedures",
      recommendations: 12,
      size: "1.8 MB",
    },
    {
      id: 3,
      title: "IT Security Audit 2023",
      type: "Security",
      status: "Completed",
      date: "2023-12-20",
      auditor: "External - CyberSec Pro",
      findings: 2,
      severity: "Low",
      description: "Comprehensive cybersecurity assessment and penetration testing",
      recommendations: 8,
      size: "4.2 MB",
    },
    {
      id: 4,
      title: "Regulatory Compliance Review",
      type: "Compliance",
      status: "Draft",
      date: "2024-01-05",
      auditor: "Legal Department",
      findings: 4,
      severity: "Medium",
      description: "Review of compliance with industry regulations and standards",
      recommendations: 6,
      size: "1.2 MB",
    },
    {
      id: 5,
      title: "Supply Chain Audit",
      type: "Operational",
      status: "Completed",
      date: "2023-11-30",
      auditor: "Internal Audit Team",
      findings: 5,
      severity: "Medium",
      description: "Evaluation of supplier relationships and supply chain processes",
      recommendations: 9,
      size: "3.1 MB",
    },
  ];

  const auditMetrics = [
    {
      label: "Total Reports",
      value: auditReports.length,
      icon: <FileText className="h-5 w-5" />,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      label: "Completed",
      value: auditReports.filter(r => r.status === "Completed").length,
      icon: <CheckCircle className="h-5 w-5" />,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      label: "In Progress",
      value: auditReports.filter(r => r.status === "In Progress").length,
      icon: <Clock className="h-5 w-5" />,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      label: "High Priority",
      value: auditReports.filter(r => r.severity === "High").length,
      icon: <AlertTriangle className="h-5 w-5" />,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Draft":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "High":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-green-100 text-green-800";
    }
  };

  const filteredReports = selectedType === "all" 
    ? auditReports 
    : auditReports.filter(report => report.type.toLowerCase() === selectedType.toLowerCase());

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <ModuleHeader
        icon={<FileText className="h-6 w-6" />}
        title="Audit Reports & Documentation"
        description="Access and manage audit reports, findings, and compliance documentation"
        isConnected={true}
        lastUpdated={new Date()}
        connectionLabel="Live"
      />

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Audit Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {auditMetrics.map((metric, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 ${metric.bgColor} rounded-lg`}>
                    <div className={metric.color}>{metric.icon}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">{metric.label}</div>
                    <div className="text-lg font-bold">{metric.value}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="reports" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <TabsList>
              <TabsTrigger value="reports">All Reports</TabsTrigger>
              <TabsTrigger value="financial">Financial</TabsTrigger>
              <TabsTrigger value="operational">Operational</TabsTrigger>
              <TabsTrigger value="compliance">Compliance</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <select 
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-1 border rounded-md text-sm"
              >
                <option value="all">All Types</option>
                <option value="financial">Financial</option>
                <option value="operational">Operational</option>
                <option value="security">Security</option>
                <option value="compliance">Compliance</option>
              </select>
            </div>
          </div>

          <TabsContent value="reports" className="space-y-6">
            <div className="grid gap-6">
              {filteredReports.map((report) => (
                <Card key={report.id} className="transition-all hover:shadow-lg">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-lg">{report.title}</CardTitle>
                          <Badge variant="outline" className="text-xs">
                            {report.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {report.description}
                        </p>
                      </div>
                      <Badge className={getStatusColor(report.status)}>
                        {report.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
                      <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">Date</span>
                        <div className="text-sm font-medium flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(report.date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">Auditor</span>
                        <div className="text-sm font-medium flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {report.auditor}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">Findings</span>
                        <div className="text-sm font-medium">{report.findings}</div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">Severity</span>
                        <Badge className={getSeverityColor(report.severity)}>
                          {report.severity}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">Recommendations</span>
                        <div className="text-sm font-medium">{report.recommendations}</div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">Size</span>
                        <div className="text-sm font-medium">{report.size}</div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        View Report
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      {report.status === "Completed" && (
                        <Link to="/audit-trail">
                          <Button size="sm" variant="outline">
                            <Shield className="h-4 w-4 mr-2" />
                            View Trail
                          </Button>
                        </Link>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="financial" className="space-y-6">
            {auditReports
              .filter(report => report.type === "Financial")
              .map((report) => (
                <Card key={report.id} className="transition-all hover:shadow-lg border-green-200">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-lg">{report.title}</CardTitle>
                          <Badge className="bg-green-100 text-green-800">
                            {report.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {report.description}
                        </p>
                      </div>
                      <Badge className={getStatusColor(report.status)}>
                        {report.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        View Report
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Link to="/compliance-reports">
                        <Button size="sm" variant="outline">
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Compliance View
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>

          <TabsContent value="operational" className="space-y-6">
            {auditReports
              .filter(report => report.type === "Operational")
              .map((report) => (
                <Card key={report.id} className="transition-all hover:shadow-lg border-blue-200">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-lg">{report.title}</CardTitle>
                          <Badge className="bg-blue-100 text-blue-800">
                            {report.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {report.description}
                        </p>
                      </div>
                      <Badge className={getStatusColor(report.status)}>
                        {report.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        View Report
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Link to="/risk-management">
                        <Button size="sm" variant="outline">
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          Risk Assessment
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>

          <TabsContent value="compliance" className="space-y-6">
            {auditReports
              .filter(report => report.type === "Compliance")
              .map((report) => (
                <Card key={report.id} className="transition-all hover:shadow-lg border-orange-200">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-lg">{report.title}</CardTitle>
                          <Badge className="bg-orange-100 text-orange-800">
                            {report.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {report.description}
                        </p>
                      </div>
                      <Badge className={getStatusColor(report.status)}>
                        {report.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        View Report
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Link to="/compliance-reports">
                        <Button size="sm" variant="outline">
                          <Shield className="h-4 w-4 mr-2" />
                          Full Compliance
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>
        </Tabs>

        {/* Summary Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Audit Summary & Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold">Findings Overview</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Total Findings</span>
                    <span className="font-medium">
                      {auditReports.reduce((acc, report) => acc + report.findings, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>High Severity</span>
                    <span className="font-medium text-red-600">
                      {auditReports.filter(r => r.severity === "High").length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Total Recommendations</span>
                    <span className="font-medium">
                      {auditReports.reduce((acc, report) => acc + report.recommendations, 0)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold">Audit Coverage</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Financial Audits</span>
                    <span className="font-medium">
                      {auditReports.filter(r => r.type === "Financial").length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Operational Audits</span>
                    <span className="font-medium">
                      {auditReports.filter(r => r.type === "Operational").length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Compliance Reviews</span>
                    <span className="font-medium">
                      {auditReports.filter(r => r.type === "Compliance").length}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold">Quick Actions</h4>
                <div className="space-y-2">
                  <Link to="/all-reports">
                    <Button size="sm" variant="outline" className="w-full">
                      <FileText className="h-4 w-4 mr-2" />
                      View All Reports
                    </Button>
                  </Link>
                  <Link to="/compliance-reports">
                    <Button size="sm" variant="outline" className="w-full">
                      <Shield className="h-4 w-4 mr-2" />
                      Compliance Dashboard
                    </Button>
                  </Link>
                  <Link to="/audit-trail">
                    <Button size="sm" variant="outline" className="w-full">
                      <Activity className="h-4 w-4 mr-2" />
                      Audit Trail
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AuditReports;
