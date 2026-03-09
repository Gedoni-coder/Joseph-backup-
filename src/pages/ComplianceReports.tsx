import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield,
  FileText,
  CheckCircle,
  AlertTriangle,
  Clock,
  Download,
  Eye,
  Activity,
  TrendingUp,
  Calendar,
  Filter,
  Search,
  BarChart3,
  Users,
} from "lucide-react";

const ComplianceReports = () => {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("current");

  const complianceReports = [
    {
      id: 1,
      title: "SOX Compliance Review Q4 2023",
      type: "Financial Compliance",
      status: "Compliant",
      dueDate: "2024-01-31",
      completedDate: "2024-01-20",
      score: 98,
      findings: 2,
      recommendations: 3,
      responsible: "Finance Team",
      description: "Sarbanes-Oxley compliance assessment for financial controls and reporting",
    },
    {
      id: 2,
      title: "GDPR Data Protection Audit",
      type: "Data Privacy",
      status: "Non-Compliant",
      dueDate: "2024-02-15",
      completedDate: null,
      score: 75,
      findings: 8,
      recommendations: 12,
      responsible: "IT Security",
      description: "General Data Protection Regulation compliance review",
    },
    {
      id: 3,
      title: "ISO 27001 Security Assessment",
      type: "Information Security",
      status: "Partially Compliant",
      dueDate: "2024-01-25",
      completedDate: "2024-01-22",
      score: 85,
      findings: 5,
      recommendations: 8,
      responsible: "Security Team",
      description: "Information security management system compliance evaluation",
    },
    {
      id: 4,
      title: "Environmental Compliance Check",
      type: "Environmental",
      status: "Compliant",
      dueDate: "2024-01-30",
      completedDate: "2024-01-18",
      score: 92,
      findings: 1,
      recommendations: 2,
      responsible: "Operations",
      description: "Environmental regulations and sustainability compliance review",
    },
    {
      id: 5,
      title: "Healthcare Regulatory Compliance",
      type: "Healthcare",
      status: "In Progress",
      dueDate: "2024-02-10",
      completedDate: null,
      score: null,
      findings: 0,
      recommendations: 0,
      responsible: "Quality Assurance",
      description: "Healthcare industry specific regulatory compliance assessment",
    },
  ];

  const complianceMetrics = [
    {
      label: "Total Reports",
      value: complianceReports.length,
      icon: <FileText className="h-5 w-5" />,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      label: "Compliant",
      value: complianceReports.filter(r => r.status === "Compliant").length,
      icon: <CheckCircle className="h-5 w-5" />,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      label: "Non-Compliant",
      value: complianceReports.filter(r => r.status === "Non-Compliant").length,
      icon: <AlertTriangle className="h-5 w-5" />,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    {
      label: "In Progress",
      value: complianceReports.filter(r => r.status === "In Progress").length,
      icon: <Clock className="h-5 w-5" />,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Compliant":
        return "bg-green-100 text-green-800";
      case "Non-Compliant":
        return "bg-red-100 text-red-800";
      case "Partially Compliant":
        return "bg-orange-100 text-orange-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getScoreColor = (score: number | null) => {
    if (score === null) return "text-gray-500";
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-orange-600";
    return "text-red-600";
  };

  const filteredReports = complianceReports.filter(report => {
    if (selectedStatus !== "all" && report.status !== selectedStatus) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <ModuleHeader
        icon={<Shield className="h-6 w-6" />}
        title="Compliance Reports & Monitoring"
        description="Track regulatory compliance across all business areas"
        isConnected={true}
        lastUpdated={new Date()}
        connectionLabel="Live"
      />

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Compliance Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {complianceMetrics.map((metric, index) => (
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

        {/* Filter Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter & Sort Options
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Compliance Status</label>
                <select 
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                >
                  <option value="all">All Statuses</option>
                  <option value="Compliant">Compliant</option>
                  <option value="Non-Compliant">Non-Compliant</option>
                  <option value="Partially Compliant">Partially Compliant</option>
                  <option value="In Progress">In Progress</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Time Period</label>
                <select 
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                >
                  <option value="current">Current Period</option>
                  <option value="q4-2023">Q4 2023</option>
                  <option value="q3-2023">Q3 2023</option>
                  <option value="all-2023">All 2023</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Report Type</label>
                <select className="w-full px-3 py-2 border rounded-md text-sm">
                  <option value="all">All Types</option>
                  <option value="financial">Financial Compliance</option>
                  <option value="security">Information Security</option>
                  <option value="privacy">Data Privacy</option>
                  <option value="environmental">Environmental</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs defaultValue="reports" className="space-y-6">
          <TabsList>
            <TabsTrigger value="reports">Compliance Reports</TabsTrigger>
            <TabsTrigger value="dashboard">Compliance Dashboard</TabsTrigger>
            <TabsTrigger value="trends">Trends & Analytics</TabsTrigger>
            <TabsTrigger value="alerts">Policy Alerts</TabsTrigger>
          </TabsList>

          <TabsContent value="reports" className="space-y-6">
            <div className="space-y-4">
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
                        <span className="text-sm text-muted-foreground">Score</span>
                        <div className={`text-lg font-bold ${getScoreColor(report.score)}`}>
                          {report.score ? `${report.score}%` : "N/A"}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">Findings</span>
                        <div className="text-sm font-medium">{report.findings}</div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">Recommendations</span>
                        <div className="text-sm font-medium">{report.recommendations}</div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">Due Date</span>
                        <div className="text-sm font-medium">{report.dueDate}</div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">Completed</span>
                        <div className="text-sm font-medium">
                          {report.completedDate || "In Progress"}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">Responsible</span>
                        <div className="text-sm font-medium">{report.responsible}</div>
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
                      {report.status === "Non-Compliant" && (
                        <Link to="/policy-alerts">
                          <Button size="sm" variant="outline">
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            View Alerts
                          </Button>
                        </Link>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Compliance Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm">Compliance Status Distribution</h4>
                      <div className="space-y-2">
                        {["Compliant", "Partially Compliant", "Non-Compliant", "In Progress"].map((status) => {
                          const count = complianceReports.filter(r => r.status === status).length;
                          const percentage = (count / complianceReports.length) * 100;
                          return (
                            <div key={status} className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span>{status}</span>
                                <span className="font-medium">{count}</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${
                                    status === "Compliant" ? "bg-green-500" :
                                    status === "Partially Compliant" ? "bg-orange-500" :
                                    status === "Non-Compliant" ? "bg-red-500" : "bg-blue-500"
                                  }`}
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Compliance Scores
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm">Average Scores by Type</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-2 border rounded">
                          <span className="text-sm">Financial Compliance</span>
                          <span className="text-lg font-bold text-green-600">98%</span>
                        </div>
                        <div className="flex justify-between items-center p-2 border rounded">
                          <span className="text-sm">Information Security</span>
                          <span className="text-lg font-bold text-orange-600">85%</span>
                        </div>
                        <div className="flex justify-between items-center p-2 border rounded">
                          <span className="text-sm">Environmental</span>
                          <span className="text-lg font-bold text-green-600">92%</span>
                        </div>
                        <div className="flex justify-between items-center p-2 border rounded">
                          <span className="text-sm">Data Privacy</span>
                          <span className="text-lg font-bold text-red-600">75%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">87.5%</div>
                      <div className="text-sm text-muted-foreground">Overall Compliance Score</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Compliance Trends & Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Quarterly Trends</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Q4 2023</span>
                        <span className="font-medium text-green-600">+5%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Q3 2023</span>
                        <span className="font-medium text-orange-600">-2%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Q2 2023</span>
                        <span className="font-medium text-green-600">+3%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Q1 2023</span>
                        <span className="font-medium text-blue-600">+1%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Risk Areas</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 border rounded">
                        <span className="text-sm">Data Privacy</span>
                        <Badge className="bg-red-100 text-red-800">High Risk</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 border rounded">
                        <span className="text-sm">Cybersecurity</span>
                        <Badge className="bg-orange-100 text-orange-800">Medium Risk</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 border rounded">
                        <span className="text-sm">Financial Controls</span>
                        <Badge className="bg-green-100 text-green-800">Low Risk</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Upcoming Reviews</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>GDPR Review</span>
                        <span className="font-medium">Feb 15</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Healthcare Audit</span>
                        <span className="font-medium">Feb 10</span>
                      </div>
                      <div className="flex justify-between">
                        <span>SOX Assessment</span>
                        <span className="font-medium">Mar 31</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Policy Alerts & Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border-l-4 border-l-red-500 bg-red-50">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-red-800">Critical: GDPR Non-Compliance</h4>
                        <p className="text-sm text-red-700 mt-1">
                          Data protection audit revealed 8 non-compliant areas requiring immediate attention.
                        </p>
                        <div className="mt-2">
                          <Link to="/policy-alerts">
                            <Button size="sm" variant="outline" className="text-red-700 border-red-300">
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border-l-4 border-l-orange-500 bg-orange-50">
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-orange-500 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-orange-800">Warning: ISO 27001 Partial Compliance</h4>
                        <p className="text-sm text-orange-700 mt-1">
                          Security assessment shows 5 areas needing improvement to achieve full compliance.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border-l-4 border-l-green-500 bg-green-50">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-green-800">Success: SOX Compliance Achieved</h4>
                        <p className="text-sm text-green-700 mt-1">
                          Financial controls review completed with 98% compliance score.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-center mt-6">
                  <Link to="/policy-alerts">
                    <Button>
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      View All Policy Alerts
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Related Tools & Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Link to="/audit-reports">
                <Button variant="outline" className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  Audit Reports
                </Button>
              </Link>
              <Link to="/risk-management">
                <Button variant="outline" className="w-full">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Risk Management
                </Button>
              </Link>
              <Link to="/policy-alerts">
                <Button variant="outline" className="w-full">
                  <Shield className="h-4 w-4 mr-2" />
                  Policy Alerts
                </Button>
              </Link>
              <Link to="/all-reports">
                <Button variant="outline" className="w-full">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  All Reports
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ComplianceReports;
