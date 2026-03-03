import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity,
  Clock,
  User,
  FileText,
  Edit,
  Eye,
  Download,
  Filter,
  Search,
  Calendar,
  Shield,
  AlertTriangle,
  CheckCircle,
  Settings,
} from "lucide-react";

const AuditTrail = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState("7-days");
  const [selectedAction, setSelectedAction] = useState("all");

  const auditTrailEntries = [
    {
      id: 1,
      timestamp: "2024-01-20 14:30:25",
      user: "John Smith",
      userRole: "Financial Analyst",
      action: "Document Access",
      resource: "Financial Report Q4 2023",
      details: "Accessed financial compliance report for review",
      ipAddress: "192.168.1.45",
      userAgent: "Chrome 120.0",
      severity: "Low",
      category: "Access",
    },
    {
      id: 2,
      timestamp: "2024-01-20 13:15:42",
      user: "Sarah Johnson",
      userRole: "Audit Manager",
      action: "Report Generation",
      resource: "Risk Assessment Report",
      details: "Generated operational risk assessment report",
      ipAddress: "192.168.1.67",
      userAgent: "Firefox 121.0",
      severity: "Medium",
      category: "Creation",
    },
    {
      id: 3,
      timestamp: "2024-01-20 11:45:18",
      user: "Michael Brown",
      userRole: "Compliance Officer",
      action: "Document Modification",
      resource: "Compliance Policy Document",
      details: "Updated regulatory compliance procedures section 4.2",
      ipAddress: "192.168.1.89",
      userAgent: "Chrome 120.0",
      severity: "High",
      category: "Modification",
    },
    {
      id: 4,
      timestamp: "2024-01-20 10:22:33",
      user: "Emily Davis",
      userRole: "Internal Auditor",
      action: "Login Attempt",
      resource: "Audit System",
      details: "Successful login to audit management system",
      ipAddress: "192.168.1.123",
      userAgent: "Safari 17.2",
      severity: "Low",
      category: "Authentication",
    },
    {
      id: 5,
      timestamp: "2024-01-20 09:15:07",
      user: "Robert Wilson",
      userRole: "System Administrator",
      action: "User Permission Change",
      resource: "User Account: jane.doe@company.com",
      details: "Updated user permissions for audit report access",
      ipAddress: "192.168.1.10",
      userAgent: "Chrome 120.0",
      severity: "High",
      category: "Administration",
    },
    {
      id: 6,
      timestamp: "2024-01-19 16:45:12",
      user: "Lisa Anderson",
      userRole: "External Auditor",
      action: "Document Download",
      resource: "Supply Chain Audit Report",
      details: "Downloaded supplier assessment documentation",
      ipAddress: "203.45.67.89",
      userAgent: "Chrome 120.0",
      severity: "Medium",
      category: "Access",
    },
  ];

  const trailMetrics = [
    {
      label: "Total Activities",
      value: auditTrailEntries.length,
      icon: <Activity className="h-5 w-5" />,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      label: "High Severity",
      value: auditTrailEntries.filter(e => e.severity === "High").length,
      icon: <AlertTriangle className="h-5 w-5" />,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    {
      label: "Document Access",
      value: auditTrailEntries.filter(e => e.category === "Access").length,
      icon: <Eye className="h-5 w-5" />,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      label: "Modifications",
      value: auditTrailEntries.filter(e => e.category === "Modification").length,
      icon: <Edit className="h-5 w-5" />,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Access":
        return <Eye className="h-4 w-4" />;
      case "Creation":
        return <FileText className="h-4 w-4" />;
      case "Modification":
        return <Edit className="h-4 w-4" />;
      case "Authentication":
        return <Shield className="h-4 w-4" />;
      case "Administration":
        return <Settings className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Access":
        return "text-blue-600";
      case "Creation":
        return "text-green-600";
      case "Modification":
        return "text-orange-600";
      case "Authentication":
        return "text-purple-600";
      case "Administration":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const filteredEntries = auditTrailEntries.filter(entry => {
    if (selectedAction !== "all" && entry.category.toLowerCase() !== selectedAction.toLowerCase()) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <ModuleHeader
        icon={<Activity className="h-6 w-6" />}
        title="Audit Trail & Activity Log"
        description="Track all system activities and maintain compliance records"
        isConnected={true}
        lastUpdated={new Date()}
        connectionLabel="Live"
      />

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Trail Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {trailMetrics.map((metric, index) => (
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
              Filter Controls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Time Range</label>
                <select 
                  value={selectedTimeframe}
                  onChange={(e) => setSelectedTimeframe(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                >
                  <option value="1-day">Last 24 hours</option>
                  <option value="7-days">Last 7 days</option>
                  <option value="30-days">Last 30 days</option>
                  <option value="90-days">Last 90 days</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Action Type</label>
                <select 
                  value={selectedAction}
                  onChange={(e) => setSelectedAction(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                >
                  <option value="all">All Actions</option>
                  <option value="access">Document Access</option>
                  <option value="creation">Document Creation</option>
                  <option value="modification">Modifications</option>
                  <option value="authentication">Authentication</option>
                  <option value="administration">Administration</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Severity</label>
                <select className="w-full px-3 py-2 border rounded-md text-sm">
                  <option value="all">All Levels</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">User Role</label>
                <select className="w-full px-3 py-2 border rounded-md text-sm">
                  <option value="all">All Roles</option>
                  <option value="auditor">Auditors</option>
                  <option value="analyst">Analysts</option>
                  <option value="admin">Administrators</option>
                  <option value="external">External Users</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Audit Trail Entries */}
        <Tabs defaultValue="timeline" className="space-y-6">
          <TabsList>
            <TabsTrigger value="timeline">Timeline View</TabsTrigger>
            <TabsTrigger value="detailed">Detailed View</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
          </TabsList>

          <TabsContent value="timeline" className="space-y-4">
            <div className="space-y-4">
              {filteredEntries.map((entry, index) => (
                <Card key={entry.id} className="transition-all hover:shadow-md">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1">
                        <div className={`p-2 bg-gray-100 rounded-lg ${getCategoryColor(entry.category)}`}>
                          {getCategoryIcon(entry.category)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div>
                            <h3 className="font-semibold text-base">{entry.action}</h3>
                            <p className="text-sm text-muted-foreground">{entry.resource}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getSeverityColor(entry.severity)}>
                              {entry.severity}
                            </Badge>
                            <Badge variant="outline">
                              {entry.category}
                            </Badge>
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-3">{entry.details}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>{entry.user} ({entry.userRole})</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{entry.timestamp}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Activity className="h-3 w-3" />
                            <span>{entry.ipAddress}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Settings className="h-3 w-3" />
                            <span>{entry.userAgent}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="detailed" className="space-y-6">
            <div className="space-y-4">
              {filteredEntries.map((entry) => (
                <Card key={entry.id} className="transition-all hover:shadow-lg">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          {getCategoryIcon(entry.category)}
                          {entry.action}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          Resource: {entry.resource}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getSeverityColor(entry.severity)}>
                          {entry.severity}
                        </Badge>
                        <Badge variant="outline">
                          {entry.category}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Action Details</h4>
                        <p className="text-sm text-muted-foreground">{entry.details}</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <h4 className="font-semibold text-sm">User Information</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Name:</span>
                              <span className="font-medium">{entry.user}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Role:</span>
                              <span className="font-medium">{entry.userRole}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">IP Address:</span>
                              <span className="font-medium">{entry.ipAddress}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">User Agent:</span>
                              <span className="font-medium">{entry.userAgent}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <h4 className="font-semibold text-sm">System Information</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Timestamp:</span>
                              <span className="font-medium">{entry.timestamp}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Action Type:</span>
                              <span className="font-medium">{entry.category}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Severity:</span>
                              <Badge className={getSeverityColor(entry.severity)}>
                                {entry.severity}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="summary" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Activity Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm">Actions by Category</h4>
                      <div className="space-y-2">
                        {["Access", "Creation", "Modification", "Authentication", "Administration"].map((category) => {
                          const count = auditTrailEntries.filter(e => e.category === category).length;
                          const percentage = (count / auditTrailEntries.length) * 100;
                          return (
                            <div key={category} className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span>{category}</span>
                                <span className="font-medium">{count}</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-500 h-2 rounded-full"
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
                    <AlertTriangle className="h-5 w-5" />
                    Security Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm">Risk Indicators</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center p-2 border rounded">
                          <span className="text-sm">High Severity Events</span>
                          <Badge className="bg-red-100 text-red-800">
                            {auditTrailEntries.filter(e => e.severity === "High").length}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center p-2 border rounded">
                          <span className="text-sm">Failed Login Attempts</span>
                          <Badge variant="outline">0</Badge>
                        </div>
                        <div className="flex justify-between items-center p-2 border rounded">
                          <span className="text-sm">Permission Changes</span>
                          <Badge className="bg-orange-100 text-orange-800">1</Badge>
                        </div>
                        <div className="flex justify-between items-center p-2 border rounded">
                          <span className="text-sm">External Access</span>
                          <Badge className="bg-blue-100 text-blue-800">1</Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <Link to="/risk-management">
                        <Button size="sm">
                          <Shield className="h-4 w-4 mr-2" />
                          Risk Management
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AuditTrail;
