import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ModuleHeader from "@/components/ui/module-header";
import {
  AlertTriangle,
  Bell,
  Inbox,
  Star,
  Archive,
  Search,
  Filter,
  RefreshCw,
  MoreVertical,
  CheckSquare,
  Square,
  ArrowLeft,
  Activity,
  Clock,
  CheckCircle,
  User,
  Calendar,
  ExternalLink,
  Download,
  Shield,
  TrendingUp,
  DollarSign,
  Users,
} from "lucide-react";

const PolicyAlerts = () => {
  const [selectedCategory, setSelectedCategory] = useState("inbox");
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [selectedMessages, setSelectedMessages] = useState([]);

  const policyAlerts = [
    {
      id: 1,
      sender: "EU Regulatory Commission",
      subject: "GDPR Data Protection Regulation Update - Immediate compliance required",
      preview: "New requirements for data processing consent and breach notification procedures. Compliance deadline: February 15, 2024...",
      body: `URGENT: GDPR Data Protection Regulation Update

Dear Compliance Team,

The European Union has issued updated GDPR requirements that affect your data processing operations.

**Key Changes:**
• Enhanced consent mechanisms for data collection
• Stricter breach notification timelines (12 hours vs 72 hours)
• Expanded right to be forgotten procedures
• New cross-border data transfer restrictions

**Immediate Actions Required:**
1. Review current consent collection processes
2. Update privacy policies and terms of service
3. Implement enhanced breach detection systems
4. Train staff on new procedures

**Compliance Deadline:** February 15, 2024

**Estimated Implementation Cost:** €50,000 - €75,000
**Affected Departments:** IT, Legal, HR, Marketing

**Penalties for Non-Compliance:**
• Fines up to 4% of annual global turnover
• Operational restrictions
• Reputational damage

**Resources:**
- Updated GDPR guidelines: [link]
- Implementation checklist: [link]
- Legal consultation contacts: [link]

Please confirm receipt and provide implementation timeline by end of business today.

Best regards,
EU Regulatory Compliance Monitor`,
      timestamp: "2 hours ago",
      category: "Data Privacy",
      severity: "urgent",
      priority: "high",
      read: false,
      starred: true,
      archived: false,
      source: "EU Commission",
      deadline: "2024-02-15",
      estimatedCost: "€50,000 - €75,000",
      affectedDepartments: ["IT", "Legal", "HR", "Marketing"],
    },
    {
      id: 2,
      sender: "US Treasury Department",
      subject: "Corporate Tax Rate Changes - Q2 2024 Implementation",
      preview: "New corporate tax regulations will take effect Q2 2024. Rate changes from 21% to 23% for corporations over $50M revenue...",
      body: `Corporate Tax Rate Changes - Effective Q2 2024

The US Treasury Department announces significant changes to corporate tax rates.

**Rate Changes:**
• Corporations with revenue >$50M: 21% → 23%
• Small businesses (<$5M revenue): 15% → 17%
• R&D tax credits: Enhanced by 25%

**Implementation Timeline:**
• Effective Date: April 1, 2024
• First filing: Q2 2024 quarterly reports
• Annual adjustments: 2024 tax year

**Financial Impact Assessment:**
Based on your current revenue levels, estimated additional tax liability: $125,000 annually

**Recommended Actions:**
1. Review current tax planning strategies
2. Consult with tax advisory team
3. Adjust quarterly payment schedules
4. Update financial forecasting models

**Documentation Required:**
- Updated tax provision calculations
- Revised cash flow projections
- Board resolution for tax strategy changes

US Treasury Department
Tax Policy Division`,
      timestamp: "1 day ago",
      category: "Tax & Finance",
      severity: "high",
      priority: "high",
      read: false,
      starred: false,
      archived: false,
      source: "US Treasury",
      deadline: "2024-04-01",
      estimatedCost: "$125,000 annually",
      affectedDepartments: ["Finance", "Accounting", "Legal"],
    },
    {
      id: 3,
      sender: "Financial Industry Regulatory Authority",
      subject: "Updated SOX Compliance Requirements - Annual Filing Changes",
      preview: "Sarbanes-Oxley compliance requirements have been updated for 2024. New internal control documentation standards...",
      body: `SOX Compliance Update - 2024 Requirements

FINRA announces updated Sarbanes-Oxley compliance requirements.

**Key Updates:**
• Enhanced internal control documentation
• Quarterly CEO/CFO certifications now required
• Expanded auditor independence requirements
• New IT general controls framework

**Documentation Requirements:**
1. Detailed process flowcharts for all financial processes
2. Risk assessment matrices
3. Control testing procedures
4. Management representation letters

**Timeline:**
• Implementation: March 31, 2024
• First compliance report: June 30, 2024
• Annual assessment: December 31, 2024

**Compliance Costs:**
• External audit fees: $45,000
• Internal resources: 200 hours
• Technology updates: $25,000

The updated framework aims to strengthen financial reporting integrity and investor protection.

FINRA Compliance Division`,
      timestamp: "3 days ago",
      category: "Financial Compliance",
      severity: "medium",
      priority: "normal",
      read: true,
      starred: false,
      archived: false,
      source: "FINRA",
      deadline: "2024-03-31",
      estimatedCost: "$70,000",
      affectedDepartments: ["Finance", "Audit", "IT"],
    },
    {
      id: 4,
      sender: "Environmental Protection Agency",
      subject: "New Environmental Sustainability Reporting Mandate",
      preview: "Mandatory environmental impact disclosure requirements for companies with >$100M revenue. Scope 1, 2, and 3 emissions reporting...",
      body: `Environmental Sustainability Reporting Mandate

The EPA announces mandatory environmental impact disclosure requirements.

**Scope of Requirements:**
• Scope 1 emissions: Direct greenhouse gas emissions
• Scope 2 emissions: Indirect emissions from purchased energy
• Scope 3 emissions: Supply chain and product lifecycle
��� Water usage and waste management metrics

**Reporting Standards:**
• Annual sustainability reports
• Third-party verification required
• Public disclosure on company website
• SEC filing integration

**Implementation Timeline:**
• Phase 1 (Scope 1 & 2): June 1, 2024
• Phase 2 (Scope 3): January 1, 2025
• First annual report: March 31, 2025

**Support Resources:**
- EPA guidance documents
- Approved third-party verifiers
- Software tools for data collection
- Industry best practices

Environmental Protection Agency
Corporate Sustainability Division`,
      timestamp: "5 days ago",
      category: "Environmental",
      severity: "medium",
      priority: "normal",
      read: true,
      starred: false,
      archived: false,
      source: "EPA",
      deadline: "2024-06-01",
      estimatedCost: "$35,000",
      affectedDepartments: ["Operations", "Legal", "Sustainability"],
    },
    {
      id: 5,
      sender: "Cybersecurity & Infrastructure Security Agency",
      subject: "Enhanced Cybersecurity Framework Requirements",
      preview: "New cybersecurity framework mandates for critical infrastructure sectors. Enhanced incident reporting within 24 hours...",
      body: `Enhanced Cybersecurity Framework Requirements

CISA announces strengthened cybersecurity requirements for critical infrastructure.

**New Requirements:**
• 24-hour incident reporting (reduced from 72 hours)
• Quarterly vulnerability assessments
• Annual penetration testing
• Supply chain security certifications

**Affected Organizations:**
• Critical infrastructure sectors
• Government contractors
• Companies handling sensitive data
• Financial services firms

**Implementation Steps:**
1. Update incident response procedures
2. Establish 24/7 monitoring capabilities
3. Contract certified security assessors
4. Implement supply chain security controls

**Compliance Timeline:**
• Incident reporting: Immediate
• Vulnerability assessments: March 1, 2024
• Annual testing: By December 31, 2024

**Resources:**
- CISA framework guidelines
- Approved assessment providers
- Training materials
- Incident reporting portal

Cybersecurity & Infrastructure Security Agency`,
      timestamp: "1 week ago",
      category: "Cybersecurity",
      severity: "low",
      priority: "normal",
      read: true,
      starred: false,
      archived: true,
      source: "CISA",
      deadline: "2024-03-01",
      estimatedCost: "$40,000",
      affectedDepartments: ["IT Security", "Operations"],
    },
  ];

  const categories = [
    { id: "inbox", label: "Inbox", icon: <Inbox className="h-4 w-4" />, count: policyAlerts.filter(a => !a.archived).length },
    { id: "urgent", label: "Urgent", icon: <AlertTriangle className="h-4 w-4" />, count: policyAlerts.filter(a => a.severity === "urgent").length },
    { id: "starred", label: "Starred", icon: <Star className="h-4 w-4" />, count: policyAlerts.filter(a => a.starred).length },
    { id: "archived", label: "Archived", icon: <Archive className="h-4 w-4" />, count: policyAlerts.filter(a => a.archived).length },
  ];

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case "urgent":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "high":
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case "medium":
        return <Bell className="h-4 w-4 text-blue-600" />;
      default:
        return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case "urgent":
        return <Badge className="bg-red-100 text-red-800">Urgent</Badge>;
      case "high":
        return <Badge className="bg-orange-100 text-orange-800">High</Badge>;
      case "medium":
        return <Badge className="bg-blue-100 text-blue-800">Medium</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Low</Badge>;
    }
  };

  const getCategoryBadge = (category) => {
    const colors = {
      "Data Privacy": "bg-purple-100 text-purple-800",
      "Tax & Finance": "bg-green-100 text-green-800",
      "Financial Compliance": "bg-blue-100 text-blue-800",
      "Environmental": "bg-emerald-100 text-emerald-800",
      "Cybersecurity": "bg-red-100 text-red-800",
    };
    return <Badge className={colors[category] || "bg-gray-100 text-gray-800"}>{category}</Badge>;
  };

  const filteredAlerts = policyAlerts.filter(alert => {
    switch (selectedCategory) {
      case "urgent":
        return alert.severity === "urgent";
      case "starred":
        return alert.starred;
      case "archived":
        return alert.archived;
      default:
        return !alert.archived;
    }
  });

  const toggleMessageSelection = (alertId) => {
    setSelectedMessages(prev => 
      prev.includes(alertId) 
        ? prev.filter(id => id !== alertId)
        : [...prev, alertId]
    );
  };

  const selectAllMessages = () => {
    if (selectedMessages.length === filteredAlerts.length) {
      setSelectedMessages([]);
    } else {
      setSelectedMessages(filteredAlerts.map(a => a.id));
    }
  };

  if (selectedAlert) {
    const alert = policyAlerts.find(a => a.id === selectedAlert);
    
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="border-b bg-white sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSelectedAlert(null)}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Alerts
              </Button>
              <div className="flex-1">
                <h1 className="text-xl font-semibold">{alert?.subject}</h1>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Star className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Archive className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Alert Content */}
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-5xl mx-auto">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{alert?.sender}</h3>
                      {getSeverityBadge(alert?.severity)}
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <span>Policy Alert</span>
                      <span>•</span>
                      <Calendar className="h-3 w-3" />
                      <span>{alert?.timestamp}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getSeverityIcon(alert?.severity)}
                  {getCategoryBadge(alert?.category)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Alert Details */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <span className="text-sm text-muted-foreground">Source</span>
                    <div className="font-medium">{alert?.source}</div>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Deadline</span>
                    <div className="font-medium text-red-600">{alert?.deadline}</div>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Est. Cost</span>
                    <div className="font-medium">{alert?.estimatedCost}</div>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Departments</span>
                    <div className="font-medium">{alert?.affectedDepartments?.length || 0}</div>
                  </div>
                </div>

                {/* Alert Body */}
                <div className="prose max-w-none">
                  <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans">
                    {alert?.body}
                  </pre>
                </div>

                {/* Affected Departments */}
                <div>
                  <h4 className="font-semibold mb-2">Affected Departments:</h4>
                  <div className="flex gap-2 flex-wrap">
                    {alert?.affectedDepartments?.map((dept, index) => (
                      <Badge key={index} variant="outline">
                        {dept}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4 border-t">
                  <Link to="/impact-calculator">
                    <Button>
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Calculate Impact
                    </Button>
                  </Link>
                  <Link to="/compliance-reports">
                    <Button variant="outline">
                      <Shield className="h-4 w-4 mr-2" />
                      Check Compliance
                    </Button>
                  </Link>
                  <Button variant="outline">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Source
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Alert
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ModuleHeader
        icon={<AlertTriangle className="h-6 w-6" />}
        title="Policy Alerts & Updates"
        description="Critical policy updates and regulatory alerts requiring immediate attention"
        isConnected={true}
        lastUpdated={new Date()}
        connectionLabel="Live"
      />

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-64 space-y-2">
            <div className="bg-white rounded-lg border p-4">
              <Button className="w-full mb-4">
                <Bell className="h-4 w-4 mr-2" />
                New Alert
              </Button>
              
              <nav className="space-y-1">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors ${
                      selectedCategory === category.id
                        ? "bg-red-100 text-red-700"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {category.icon}
                      <span>{category.label}</span>
                    </div>
                    {category.count > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {category.count}
                      </Badge>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={selectAllMessages}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      {selectedMessages.length === filteredAlerts.length && filteredAlerts.length > 0 ? (
                        <CheckSquare className="h-4 w-4" />
                      ) : (
                        <Square className="h-4 w-4" />
                      )}
                    </button>
                    <CardTitle className="capitalize">{selectedCategory} Alerts</CardTitle>
                  </div>
                  
                  {selectedMessages.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Archive className="h-4 w-4 mr-2" />
                        Archive ({selectedMessages.length})
                      </Button>
                      <Button variant="outline" size="sm">
                        <Star className="h-4 w-4 mr-2" />
                        Star ({selectedMessages.length})
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                <div className="divide-y">
                  {filteredAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                        !alert.read ? "bg-red-50 border-l-4 border-l-red-500" : ""
                      }`}
                      onClick={() => setSelectedAlert(alert.id)}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMessageSelection(alert.id);
                        }}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        {selectedMessages.includes(alert.id) ? (
                          <CheckSquare className="h-4 w-4" />
                        ) : (
                          <Square className="h-4 w-4" />
                        )}
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Toggle starred
                        }}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <Star className={`h-4 w-4 ${alert.starred ? "fill-yellow-400 text-yellow-400" : ""}`} />
                      </button>
                      
                      <div className="flex-shrink-0">
                        {getSeverityIcon(alert.severity)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-sm ${!alert.read ? "font-semibold" : "font-medium"}`}>
                            {alert.sender}
                          </span>
                          {getSeverityBadge(alert.severity)}
                          {getCategoryBadge(alert.category)}
                        </div>
                        <div className={`text-sm ${!alert.read ? "font-medium" : ""} truncate`}>
                          {alert.subject}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {alert.preview}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                          <span>Deadline: {alert.deadline}</span>
                          <span>•</span>
                          <span>Cost: {alert.estimatedCost}</span>
                        </div>
                      </div>
                      
                      <div className="flex-shrink-0 text-right">
                        <div className="text-xs text-muted-foreground">
                          {alert.timestamp}
                        </div>
                        <Button variant="ghost" size="sm" className="mt-1">
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                {filteredAlerts.length === 0 && (
                  <div className="text-center py-12">
                    <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No policy alerts</h3>
                    <p className="text-muted-foreground">
                      Your {selectedCategory} is empty. New alerts will appear here.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyAlerts;
