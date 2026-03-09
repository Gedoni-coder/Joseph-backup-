import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import ModuleHeader from "@/components/ui/module-header";
import {
  FileText,
  BarChart3,
  Download,
  Eye,
  Search,
  Filter,
  Calendar,
  User,
  Clock,
  Activity,
  TrendingUp,
  Shield,
  DollarSign,
  Target,
  AlertTriangle,
  Brain,
  Upload,
  Star,
  MoreHorizontal,
  Archive,
  Share,
  PieChart,
  Zap,
  Bot,
  Users,
  Globe,
  Building,
  RefreshCw,
  Plus,
} from "lucide-react";

const AllReports = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSource, setSelectedSource] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTimeframe, setSelectedTimeframe] = useState("all");

  // Joseph AI-Generated Reports
  const josephReports = [
    {
      id: "j1",
      title: "AI Economic Impact Analysis Q4 2024",
      category: "Economic Intelligence",
      type: "AI Analysis",
      source: "joseph",
      status: "Published",
      date: "2024-01-22",
      confidence: 94,
      size: "3.2 MB",
      views: 128,
      description: "Comprehensive AI-driven analysis of economic indicators and market predictions",
      insights: ["GDP growth forecast: +2.8%", "Market volatility assessment", "Investment recommendations"],
      tags: ["Economic Forecast", "Market Analysis", "AI Predictions"],
    },
    {
      id: "j2",
      title: "Joseph's Business Strategy Recommendations",
      category: "Strategic Planning",
      type: "AI Strategy",
      source: "joseph",
      status: "Published",
      date: "2024-01-21",
      confidence: 89,
      size: "2.1 MB",
      views: 95,
      description: "AI-generated strategic recommendations based on market analysis and business metrics",
      insights: ["Revenue optimization strategies", "Cost reduction opportunities", "Market expansion analysis"],
      tags: ["Strategy", "Business Planning", "AI Insights"],
    },
    {
      id: "j3",
      title: "Automated Risk Assessment Report",
      category: "Risk Management",
      type: "AI Risk Analysis",
      source: "joseph",
      status: "Published",
      date: "2024-01-20",
      confidence: 92,
      size: "2.8 MB",
      views: 76,
      description: "Machine learning-powered risk identification and mitigation strategies",
      insights: ["Operational risk score: 3.2/10", "Financial risk trends", "Compliance gaps identified"],
      tags: ["Risk Analysis", "Machine Learning", "Compliance"],
    },
    {
      id: "j4",
      title: "AI-Powered Market Intelligence Digest",
      category: "Market Intelligence",
      type: "AI Intelligence",
      source: "joseph",
      status: "Published",
      date: "2024-01-19",
      confidence: 87,
      size: "4.1 MB",
      views: 142,
      description: "Automated market scanning and competitive intelligence analysis",
      insights: ["Competitor activity monitoring", "Market trend predictions", "Opportunity identification"],
      tags: ["Market Research", "Competitive Analysis", "AI Intelligence"],
    },
    {
      id: "j5",
      title: "Joseph's Financial Health Check",
      category: "Financial",
      type: "AI Audit",
      source: "joseph",
      status: "Published",
      date: "2024-01-18",
      confidence: 96,
      size: "1.9 MB",
      views: 184,
      description: "AI-driven financial performance analysis and optimization recommendations",
      insights: ["Cash flow projections", "Profitability analysis", "Investment prioritization"],
      tags: ["Financial Analysis", "Performance", "AI Audit"],
    },
    {
      id: "j6",
      title: "Compliance Automation Report",
      category: "Compliance",
      type: "AI Compliance",
      source: "joseph",
      status: "Draft",
      date: "2024-01-17",
      confidence: 91,
      size: "2.5 MB",
      views: 32,
      description: "Automated compliance monitoring and regulatory change impact assessment",
      insights: ["Regulatory changes impact", "Compliance score: 94%", "Action items identified"],
      tags: ["Compliance", "Automation", "Regulatory"],
    },
  ];

  // User-Fed/Uploaded Reports
  const userReports = [
    {
      id: "u1",
      title: "Q4 2023 Financial Statements",
      category: "Financial",
      type: "Financial Report",
      source: "user",
      status: "Published",
      date: "2024-01-20",
      author: "John Smith, CFO",
      size: "5.4 MB",
      views: 67,
      description: "Official quarterly financial statements and balance sheet analysis",
      department: "Finance",
      tags: ["Quarterly Report", "Financial Statements", "Official"],
    },
    {
      id: "u2",
      title: "Annual Compliance Audit Report",
      category: "Compliance",
      type: "Audit Report",
      source: "user",
      status: "Published",
      date: "2024-01-19",
      author: "Sarah Johnson, Compliance",
      size: "3.8 MB",
      views: 89,
      description: "Comprehensive compliance audit conducted by external auditors",
      department: "Legal & Compliance",
      tags: ["Annual Report", "External Audit", "Compliance"],
    },
    {
      id: "u3",
      title: "Market Research Survey Results",
      category: "Market Intelligence",
      type: "Survey Report",
      source: "user",
      status: "Published",
      date: "2024-01-18",
      author: "Emily Davis, Marketing",
      size: "2.2 MB",
      views: 45,
      description: "Customer satisfaction and market positioning survey analysis",
      department: "Marketing",
      tags: ["Customer Survey", "Market Research", "External"],
    },
    {
      id: "u4",
      title: "IT Security Assessment Report",
      category: "Security",
      type: "Security Report",
      source: "user",
      status: "Published",
      date: "2024-01-17",
      author: "Michael Brown, IT Security",
      size: "4.1 MB",
      views: 52,
      description: "Third-party cybersecurity assessment and vulnerability report",
      department: "IT Security",
      tags: ["Security Assessment", "Third-party", "Vulnerability"],
    },
    {
      id: "u5",
      title: "Operational Efficiency Study",
      category: "Operations",
      type: "Performance Report",
      source: "user",
      status: "Published",
      date: "2024-01-16",
      author: "David Lee, Operations",
      size: "1.7 MB",
      views: 38,
      description: "Internal process optimization and efficiency improvement analysis",
      department: "Operations",
      tags: ["Process Optimization", "Internal Study", "Efficiency"],
    },
    {
      id: "u6",
      title: "Business Continuity Plan",
      category: "Risk Management",
      type: "Planning Document",
      source: "user",
      status: "Draft",
      date: "2024-01-15",
      author: "Lisa Anderson, Risk Management",
      size: "2.9 MB",
      views: 23,
      description: "Comprehensive business continuity and disaster recovery planning document",
      department: "Risk Management",
      tags: ["BCP", "Disaster Recovery", "Planning"],
    },
  ];

  const allReports = [...josephReports, ...userReports];

  const reportMetrics = [
    {
      label: "Total Reports",
      value: allReports.length,
      icon: <FileText className="h-5 w-5" />,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      label: "Joseph AI Reports",
      value: josephReports.length,
      icon: <Brain className="h-5 w-5" />,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      label: "User Reports",
      value: userReports.length,
      icon: <Users className="h-5 w-5" />,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      label: "Total Views",
      value: allReports.reduce((sum, r) => sum + r.views, 0),
      icon: <TrendingUp className="h-5 w-5" />,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Financial":
        return <DollarSign className="h-4 w-4" />;
      case "Risk Management":
        return <AlertTriangle className="h-4 w-4" />;
      case "Compliance":
        return <Shield className="h-4 w-4" />;
      case "Strategic Planning":
        return <Target className="h-4 w-4" />;
      case "Market Intelligence":
        return <BarChart3 className="h-4 w-4" />;
      case "Economic Intelligence":
        return <Globe className="h-4 w-4" />;
      case "Security":
        return <Shield className="h-4 w-4" />;
      case "Operations":
        return <Building className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Financial":
        return "bg-blue-100 text-blue-800";
      case "Risk Management":
        return "bg-red-100 text-red-800";
      case "Compliance":
        return "bg-green-100 text-green-800";
      case "Strategic Planning":
        return "bg-purple-100 text-purple-800";
      case "Market Intelligence":
        return "bg-orange-100 text-orange-800";
      case "Economic Intelligence":
        return "bg-indigo-100 text-indigo-800";
      case "Security":
        return "bg-gray-100 text-gray-800";
      case "Operations":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case "joseph":
        return "bg-purple-100 text-purple-800";
      case "user":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Published":
        return "bg-green-100 text-green-800";
      case "Draft":
        return "bg-orange-100 text-orange-800";
      case "Review":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredReports = allReports.filter(report => {
    if (selectedCategory !== "all" && report.category !== selectedCategory) {
      return false;
    }
    if (selectedSource !== "all" && report.source !== selectedSource) {
      return false;
    }
    if (searchQuery && !report.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !report.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const reportsByCategory = allReports.reduce((acc, report) => {
    acc[report.category] = (acc[report.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const ReportCard = ({ report }: { report: any }) => (
    <Card className="transition-all hover:shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 mt-1">
            <div className={`p-2 rounded-lg ${getCategoryColor(report.category)}`}>
              {getCategoryIcon(report.category)}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-lg">{report.title}</h3>
                  {report.source === "joseph" && (
                    <div className="flex items-center gap-1">
                      <Bot className="h-4 w-4 text-purple-600" />
                      <span className="text-xs text-purple-600 font-medium">AI Generated</span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{report.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(report.status)}>
                  {report.status}
                </Badge>
                <Badge className={getSourceColor(report.source)}>
                  {report.source === "joseph" ? "Joseph AI" : "User Upload"}
                </Badge>
              </div>
            </div>
            
            {report.source === "joseph" && report.insights && (
              <div className="mb-3 p-3 bg-purple-50 rounded-lg">
                <h4 className="text-sm font-semibold text-purple-800 mb-2 flex items-center gap-1">
                  <Brain className="h-3 w-3" />
                  AI Insights
                </h4>
                <ul className="text-xs text-purple-700 space-y-1">
                  {report.insights.slice(0, 2).map((insight: string, idx: number) => (
                    <li key={idx}>• {insight}</li>
                  ))}
                </ul>
                {report.confidence && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs text-purple-600">Confidence:</span>
                    <div className="flex-1 bg-purple-200 rounded-full h-1.5">
                      <div 
                        className="bg-purple-600 h-1.5 rounded-full"
                        style={{ width: `${report.confidence}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium text-purple-800">{report.confidence}%</span>
                  </div>
                )}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{report.date}</span>
              </div>
              <div className="flex items-center gap-1">
                {report.source === "joseph" ? <Brain className="h-3 w-3" /> : <User className="h-3 w-3" />}
                <span>{report.source === "joseph" ? "Joseph AI" : report.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                <span>{report.size}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                <span>{report.views} views</span>
              </div>
              <div>
                <Badge className={getCategoryColor(report.category)}>
                  {report.category}
                </Badge>
              </div>
            </div>

            {report.tags && (
              <div className="mb-3">
                <div className="flex flex-wrap gap-1">
                  {report.tags.slice(0, 3).map((tag: string, idx: number) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                View
              </Button>
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              {report.source === "joseph" && (
                <Link to="/ai-insights">
                  <Button size="sm" variant="outline">
                    <Brain className="h-4 w-4 mr-2" />
                    Chat with Joseph
                  </Button>
                </Link>
              )}
              <Button size="sm" variant="outline">
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <ModuleHeader
        icon={<FileText className="h-6 w-6" />}
        title="All Reports Repository"
        description="Centralized access to Joseph AI-generated reports and user-uploaded documents"
        isConnected={true}
        lastUpdated={new Date()}
        connectionLabel="Live"
      />

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Report Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {reportMetrics.map((metric, index) => (
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

        {/* Search and Filter Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search & Filter Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Search Reports</label>
                <Input
                  placeholder="Search titles, descriptions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Source</label>
                <select 
                  value={selectedSource}
                  onChange={(e) => setSelectedSource(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                >
                  <option value="all">All Sources</option>
                  <option value="joseph">Joseph AI Generated</option>
                  <option value="user">User Uploaded</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                >
                  <option value="all">All Categories</option>
                  <option value="Financial">Financial</option>
                  <option value="Risk Management">Risk Management</option>
                  <option value="Compliance">Compliance</option>
                  <option value="Strategic Planning">Strategic Planning</option>
                  <option value="Market Intelligence">Market Intelligence</option>
                  <option value="Economic Intelligence">Economic Intelligence</option>
                  <option value="Security">Security</option>
                  <option value="Operations">Operations</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Time Period</label>
                <select 
                  value={selectedTimeframe}
                  onChange={(e) => setSelectedTimeframe(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                >
                  <option value="all">All Time</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="quarter">This Quarter</option>
                  <option value="year">This Year</option>
                </select>
              </div>
              <div className="flex items-end">
                <Button variant="outline" className="w-full">
                  <Filter className="h-4 w-4 mr-2" />
                  Advanced Filter
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Reports ({filteredReports.length})</TabsTrigger>
            <TabsTrigger value="joseph">Joseph AI ({josephReports.filter(r => selectedCategory === "all" || r.category === selectedCategory).length})</TabsTrigger>
            <TabsTrigger value="user">User Reports ({userReports.filter(r => selectedCategory === "all" || r.category === selectedCategory).length})</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="space-y-4">
              {filteredReports.length > 0 ? (
                filteredReports.map((report) => (
                  <ReportCard key={report.id} report={report} />
                ))
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Reports Found</h3>
                    <p className="text-muted-foreground">Try adjusting your search criteria or filters</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="joseph" className="space-y-4">
            <div className="mb-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="h-5 w-5 text-purple-600" />
                <h3 className="font-semibold text-purple-800">Joseph AI Generated Reports</h3>
              </div>
              <p className="text-sm text-purple-700">
                Reports automatically generated by Joseph AI based on your business data, market analysis, and predictive modeling.
              </p>
            </div>
            <div className="space-y-4">
              {josephReports
                .filter(report => selectedCategory === "all" || report.category === selectedCategory)
                .map((report) => (
                  <ReportCard key={report.id} report={report} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="user" className="space-y-4">
            <div className="mb-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Upload className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold text-green-800">User Uploaded Reports</h3>
              </div>
              <p className="text-sm text-green-700">
                Reports uploaded by team members, external auditors, and third-party consultants.
              </p>
            </div>
            <div className="space-y-4">
              {userReports
                .filter(report => selectedCategory === "all" || report.category === selectedCategory)
                .map((report) => (
                  <ReportCard key={report.id} report={report} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Report Sources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <div className="flex items-center gap-2">
                          <Brain className="h-4 w-4 text-purple-600" />
                          <span>Joseph AI Reports</span>
                        </div>
                        <span className="font-medium">{josephReports.length} ({((josephReports.length / allReports.length) * 100).toFixed(1)}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-500 h-2 rounded-full"
                          style={{ width: `${(josephReports.length / allReports.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-green-600" />
                          <span>User Reports</span>
                        </div>
                        <span className="font-medium">{userReports.length} ({((userReports.length / allReports.length) * 100).toFixed(1)}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${(userReports.length / allReports.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-2">
                    <h4 className="font-semibold text-sm">AI Report Insights</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>• Average AI confidence: {Math.round(josephReports.reduce((sum, r) => sum + (r.confidence || 0), 0) / josephReports.length)}%</p>
                      <p>• Most generated category: {Object.entries(
                        josephReports.reduce((acc, r) => ({ ...acc, [r.category]: (acc[r.category] || 0) + 1 }), {} as Record<string, number>)
                      ).sort(([,a], [,b]) => b - a)[0]?.[0]}</p>
                      <p>• AI reports viewed: {josephReports.reduce((sum, r) => sum + r.views, 0)} times</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Category Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(reportsByCategory).map(([category, count]) => {
                      const percentage = (count / allReports.length) * 100;
                      return (
                        <div key={category} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <div className="flex items-center gap-2">
                              {getCategoryIcon(category)}
                              <span>{category}</span>
                            </div>
                            <span className="font-medium">{count} ({percentage.toFixed(1)}%)</span>
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
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Top Performing Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {allReports
                    .sort((a, b) => b.views - a.views)
                    .slice(0, 5)
                    .map((report, index) => (
                      <div key={report.id} className="flex items-center gap-4 p-3 border rounded">
                        <div className="text-xl font-bold text-blue-600">#{index + 1}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{report.title}</h4>
                            {report.source === "joseph" && <Bot className="h-4 w-4 text-purple-600" />}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {report.views} views • {report.source === "joseph" ? "Joseph AI" : report.author}
                          </div>
                        </div>
                        <Badge className={getCategoryColor(report.category)}>
                          {report.category}
                        </Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Quick Actions & Related Tools
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Link to="/ai-insights">
                <Button variant="outline" className="w-full">
                  <Brain className="h-4 w-4 mr-2" />
                  Generate AI Report
                </Button>
              </Link>
              <Link to="/document-upload">
                <Button variant="outline" className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Report
                </Button>
              </Link>
              <Link to="/compliance-reports">
                <Button variant="outline" className="w-full">
                  <Shield className="h-4 w-4 mr-2" />
                  Compliance Hub
                </Button>
              </Link>
              <Link to="/audit-reports">
                <Button variant="outline" className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  Audit Reports
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AllReports;
