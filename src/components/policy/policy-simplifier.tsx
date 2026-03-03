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
import { Textarea } from "../ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  AlertCircle,
  FileText,
  Globe,
  CheckCircle2,
  AlertTriangle,
  Clock,
  DollarSign,
  Upload,
  Zap,
  Percent,
  BookOpen,
} from "lucide-react";

interface Incentive {
  id: string;
  type: "grant" | "fund" | "msme" | "tax" | "export" | "loan" | "state";
  title: string;
  description: string;
  expectedBenefit: number;
  deadline: string;
  qualifyingFactors: string[];
  missingRequirements: string[];
  applicationProcess: string[];
  businessQualifies: boolean;
  successLikelihood: number;
}

interface ApplicationScore {
  overallScore: number;
  documentation: number;
  compliance: number;
  readiness: number;
  suggestions: string[];
}

export function PolicySimplifier() {
  const [activeTab, setActiveTab] = useState("interpreter");
  const [policyText, setPolicyText] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("english");
  const [interpretedText, setInterpretedText] = useState("");
  const [openInterpretDialog, setOpenInterpretDialog] = useState(false);
  const [selectedIncentive, setSelectedIncentive] = useState<Incentive | null>(
    null,
  );

  const mockIncentives: Incentive[] = [
    {
      id: "1",
      type: "grant",
      title: "Manufacturing Excellence Grant",
      description:
        "Federal government grant for companies investing in advanced manufacturing",
      expectedBenefit: 5000000,
      deadline: "2024-03-31",
      qualifyingFactors: [
        "Registered business entity",
        "Active for 2+ years",
        "Revenue above ₦10M",
        "Nigerian ownership >51%",
      ],
      missingRequirements: [
        "Detailed project proposal",
        "Environmental impact assessment",
      ],
      applicationProcess: [
        "Submit online application at grants.gov.ng",
        "Upload project documentation",
        "Attend verification meeting",
        "Contract signing",
      ],
      businessQualifies: true,
      successLikelihood: 78,
    },
    {
      id: "2",
      type: "msme",
      title: "Small Business Growth Fund",
      description: "Low-interest funding for MSME sector development",
      expectedBenefit: 2000000,
      deadline: "2024-02-28",
      qualifyingFactors: [
        "Annual turnover between ₦5M-₦500M",
        "MSME registration",
        "Active tax compliance",
      ],
      missingRequirements: ["BVN verification", "Tax clearance certificate"],
      applicationProcess: [
        "Visit nearest MSME office",
        "Complete application form",
        "Submit financial statements",
        "Loan disbursement within 30 days",
      ],
      businessQualifies: true,
      successLikelihood: 85,
    },
    {
      id: "3",
      type: "tax",
      title: "Technology Investment Tax Holiday",
      description: "3-year tax exemption for companies investing in tech",
      expectedBenefit: 750000,
      deadline: "2024-04-30",
      qualifyingFactors: [
        "Investment in approved technologies",
        "Job creation (min 5 positions)",
        "Tech innovation component",
      ],
      missingRequirements: ["Project approval from tech authority"],
      applicationProcess: [
        "Apply to Technology Authority",
        "Submit project details",
        "Receive provisional approval",
        "File tax exemption claim",
      ],
      businessQualifies: false,
      successLikelihood: 45,
    },
    {
      id: "4",
      type: "export",
      title: "Export Expansion Incentive",
      description: "Rebates and support for businesses expanding exports",
      expectedBenefit: 1500000,
      deadline: "2024-05-15",
      qualifyingFactors: [
        "Current exporter status",
        "ISO certification",
        "Stable export records",
      ],
      missingRequirements: ["Updated ISO certificate"],
      applicationProcess: [
        "Register at export authority",
        "Submit export records",
        "Get verification",
        "Receive rebate",
      ],
      businessQualifies: true,
      successLikelihood: 72,
    },
    {
      id: "5",
      type: "state",
      title: "State Level Investment Incentive",
      description: "State government incentives for job creation",
      expectedBenefit: 3000000,
      deadline: "2024-06-30",
      qualifyingFactors: [
        "Operations in incentive state",
        "Minimum 20 job creation",
        "Local content >40%",
      ],
      missingRequirements: ["Employment commitment letter"],
      applicationProcess: [
        "Apply to state investment agency",
        "Present business plan",
        "Attend review meeting",
        "Sign MOU",
      ],
      businessQualifies: true,
      successLikelihood: 68,
    },
  ];

  const applicationScore: ApplicationScore = {
    overallScore: 72,
    documentation: 80,
    compliance: 65,
    readiness: 71,
    suggestions: [
      "Update compliance certifications within 30 days",
      "Prepare detailed project implementation timeline",
      "Gather all financial statements for past 3 years",
      "Get board approval for incentive application",
    ],
  };

  const handleInterpretPolicy = () => {
    if (!policyText.trim()) {
      alert("Please enter policy text to interpret");
      return;
    }

    const languages: Record<string, string> = {
      english: "English",
      igbo: "Igbo",
      hausa: "Hausa",
      yoruba: "Yoruba",
    };

    const interpretation = `
POLICY INTERPRETATION (${languages[selectedLanguage]})

PLAIN ENGLISH SUMMARY:
This policy updates requirements for business operations in the manufacturing sector. 
Key changes include new environmental compliance standards, updated labor regulations, 
and modified trade protocols.

ACTION ITEMS FOR YOUR BUSINESS:
1. Conduct environmental audit of facilities
2. Review current labor practices for compliance
3. Update import/export procedures
4. Train staff on new requirements
5. Document compliance by the deadline

WHAT THIS MEANS FOR YOU:
• Operational changes: You'll need to update processes (estimated 2-3 months)
• Cost impact: One-time compliance costs around ₦200K-₦500K
• Timeline: Must comply within 6 months of policy effective date
• Risk: Non-compliance may result in penalties or operational restrictions

KEY DEADLINES:
• Initial assessment required: 30 days
• Full implementation: 6 months
• Compliance verification: Ongoing
    `;

    setInterpretedText(interpretation);
  };

  const filteredIncentives = mockIncentives.filter(
    (incentive) =>
      incentive.businessQualifies || incentive.successLikelihood > 50,
  );

  const getIncentiveColor = (type: string) => {
    switch (type) {
      case "grant":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "fund":
        return "bg-green-100 text-green-800 border-green-200";
      case "msme":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "tax":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "export":
        return "bg-red-100 text-red-800 border-red-200";
      case "loan":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "state":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <div className="grid grid-cols-2 sm:grid-cols-8 gap-2 w-full rounded-md bg-muted p-1 text-muted-foreground">
          <TabsList className="contents">
            <TabsTrigger
              value="interpreter"
              className="flex items-center gap-1 sm:gap-2 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm px-1 sm:px-2"
            >
              <BookOpen className="h-3 sm:h-4 w-3 sm:w-4 flex-shrink-0" />
              <span className="hidden lg:inline line-clamp-1">
                Policy Interpreter
              </span>
              <span className="hidden sm:inline lg:hidden line-clamp-1">
                Interpreter
              </span>
              <span className="sm:hidden line-clamp-1">Policy</span>
            </TabsTrigger>
            <TabsTrigger
              value="incentives"
              className="flex items-center gap-1 sm:gap-2 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm px-1 sm:px-2"
            >
              <DollarSign className="h-3 sm:h-4 w-3 sm:w-4 flex-shrink-0" />
              <span className="hidden lg:inline line-clamp-1">
                Incentive Scanner
              </span>
              <span className="hidden sm:inline lg:hidden line-clamp-1">
                Incentives
              </span>
              <span className="sm:hidden line-clamp-1">Incentive</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Policy Interpreter Tab */}
        <TabsContent value="interpreter" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Policy Interpreter</CardTitle>
              <CardDescription>
                Upload or paste government policy documents for instant
                interpretation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold mb-2 block">
                    Policy Document (PDF or Text)
                  </label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Drag and drop a PDF or click to upload
                    </p>
                    <input type="file" className="hidden" accept=".pdf" />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold mb-2 block">
                    Or Paste Policy Text
                  </label>
                  <Textarea
                    placeholder="Paste the policy text here..."
                    value={policyText}
                    onChange={(e) => setPolicyText(e.target.value)}
                    className="min-h-[200px]"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold mb-2 block">
                    Interpretation Language
                  </label>
                  <Select
                    value={selectedLanguage}
                    onValueChange={setSelectedLanguage}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">Plain English</SelectItem>
                      <SelectItem value="igbo">Igbo Translation</SelectItem>
                      <SelectItem value="hausa">Hausa Translation</SelectItem>
                      <SelectItem value="yoruba">Yoruba Translation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleInterpretPolicy} className="w-full">
                  <Zap className="h-4 w-4 mr-2" />
                  Interpret Policy
                </Button>
              </div>

              {interpretedText && (
                <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <h3 className="font-semibold">Interpretation Results</h3>
                  </div>
                  <pre className="text-sm whitespace-pre-wrap font-mono text-muted-foreground overflow-auto max-h-[400px]">
                    {interpretedText}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Incentive Scanner Tab */}
        <TabsContent value="incentives" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Eligibility Scanner for Incentives</CardTitle>
              <CardDescription>
                Discover grants, funds, and incentives your business qualifies
                for
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="text-2xl font-bold text-blue-600">
                    {
                      filteredIncentives.filter((i) => i.businessQualifies)
                        .length
                    }
                  </div>
                  <p className="text-sm text-muted-foreground">
                    You likely qualify
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="text-2xl font-bold text-green-600">
                    ₦
                    {(
                      filteredIncentives.reduce(
                        (sum, i) => sum + i.expectedBenefit,
                        0,
                      ) / 1000000
                    ).toFixed(0)}
                    M
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Potential benefits
                  </p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <div className="text-2xl font-bold text-orange-600">
                    {
                      filteredIncentives.filter((i) => {
                        const today = new Date();
                        const deadline = new Date(i.deadline);
                        const daysLeft = Math.floor(
                          (deadline.getTime() - today.getTime()) /
                            (1000 * 60 * 60 * 24),
                        );
                        return daysLeft < 60 && daysLeft > 0;
                      }).length
                    }
                  </div>
                  <p className="text-sm text-muted-foreground">Ending soon</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <div className="text-2xl font-bold text-purple-600">
                    {filteredIncentives.length}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Total opportunities
                  </p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <div className="text-2xl font-bold text-red-600">
                    {
                      filteredIncentives.filter(
                        (i) => i.missingRequirements.length > 0,
                      ).length
                    }
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Need documents
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {filteredIncentives.map((incentive) => (
                  <Card
                    key={incentive.id}
                    className={`border-2 border-l-4 ${getIncentiveColor(incentive.type)}`}
                  >
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg">
                                {incentive.title}
                              </h3>
                              {incentive.businessQualifies && (
                                <Badge
                                  variant="outline"
                                  className="bg-green-50 text-green-700 border-green-300"
                                >
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  You Qualify
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {incentive.description}
                            </p>
                          </div>
                          <Dialog
                            open={openInterpretDialog}
                            onOpenChange={setOpenInterpretDialog}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedIncentive(incentive)}
                              >
                                View Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>
                                  {selectedIncentive?.title}
                                </DialogTitle>
                                <DialogDescription>
                                  {selectedIncentive?.description}
                                </DialogDescription>
                              </DialogHeader>
                              {selectedIncentive && (
                                <div className="space-y-6">
                                  <div>
                                    <h4 className="font-semibold mb-2">
                                      Expected Benefit
                                    </h4>
                                    <div className="text-3xl font-bold text-green-600">
                                      ₦
                                      {(
                                        selectedIncentive.expectedBenefit /
                                        1000000
                                      ).toFixed(1)}
                                      M
                                    </div>
                                  </div>

                                  <div>
                                    <h4 className="font-semibold mb-3">
                                      Your Qualification Status
                                    </h4>
                                    <div className="space-y-2">
                                      <div>
                                        <p className="text-sm font-semibold mb-1">
                                          Success Likelihood
                                        </p>
                                        <div className="flex items-center gap-2">
                                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                                            <div
                                              className="bg-green-500 h-2 rounded-full"
                                              style={{
                                                width: `${selectedIncentive.successLikelihood}%`,
                                              }}
                                            />
                                          </div>
                                          <span className="font-semibold">
                                            {
                                              selectedIncentive.successLikelihood
                                            }
                                            %
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div>
                                    <h4 className="font-semibold mb-2">
                                      Qualifying Factors
                                    </h4>
                                    <ul className="space-y-1">
                                      {selectedIncentive.qualifyingFactors.map(
                                        (factor, idx) => (
                                          <li
                                            key={idx}
                                            className="text-sm flex items-start gap-2"
                                          >
                                            <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                            <span>{factor}</span>
                                          </li>
                                        ),
                                      )}
                                    </ul>
                                  </div>

                                  {selectedIncentive.missingRequirements
                                    .length > 0 && (
                                    <div>
                                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                                        Missing Requirements
                                      </h4>
                                      <ul className="space-y-1">
                                        {selectedIncentive.missingRequirements.map(
                                          (req, idx) => (
                                            <li
                                              key={idx}
                                              className="text-sm flex items-start gap-2"
                                            >
                                              <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                                              <span>{req}</span>
                                            </li>
                                          ),
                                        )}
                                      </ul>
                                    </div>
                                  )}

                                  <div>
                                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                                      <Clock className="h-4 w-4 text-blue-600" />
                                      How to Apply
                                    </h4>
                                    <ol className="space-y-2">
                                      {selectedIncentive.applicationProcess.map(
                                        (step, idx) => (
                                          <li
                                            key={idx}
                                            className="text-sm flex items-start gap-2"
                                          >
                                            <span className="font-semibold text-blue-600">
                                              {idx + 1}.
                                            </span>
                                            <span>{step}</span>
                                          </li>
                                        ),
                                      )}
                                    </ol>
                                  </div>

                                  <div className="bg-red-50 p-3 rounded border border-red-200">
                                    <p className="text-sm font-semibold text-red-900 flex items-center gap-2">
                                      <Clock className="h-4 w-4" />
                                      Deadline:{" "}
                                      {new Date(
                                        selectedIncentive.deadline,
                                      ).toLocaleDateString()}
                                    </p>
                                  </div>

                                  <Button className="w-full">
                                    Start Application
                                  </Button>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">
                              Expected Benefit
                            </span>
                            <p className="font-semibold text-green-600">
                              ₦
                              {(incentive.expectedBenefit / 1000000).toFixed(1)}
                              M
                            </p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Deadline
                            </span>
                            <p className="font-semibold">
                              {new Date(
                                incentive.deadline,
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Success Rate
                            </span>
                            <p className="font-semibold">
                              {incentive.successLikelihood}%
                            </p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Status
                            </span>
                            <Badge
                              variant="outline"
                              className={
                                incentive.businessQualifies
                                  ? "bg-green-50"
                                  : "bg-gray-50"
                              }
                            >
                              {incentive.businessQualifies
                                ? "Eligible"
                                : "Check"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Application Readiness Score */}
          <Card>
            <CardHeader>
              <CardTitle>Application Readiness Score</CardTitle>
              <CardDescription>
                How prepared is your business for incentive applications?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-green-50 p-6 rounded-lg border-2 border-green-200 text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    {applicationScore.overallScore}
                  </div>
                  <p className="text-sm font-semibold text-green-900">
                    Overall Readiness
                  </p>
                </div>

                <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200 text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {applicationScore.documentation}
                  </div>
                  <p className="text-sm font-semibold text-blue-900">
                    Documentation
                  </p>
                </div>

                <div className="bg-orange-50 p-6 rounded-lg border-2 border-orange-200 text-center">
                  <div className="text-4xl font-bold text-orange-600 mb-2">
                    {applicationScore.compliance}
                  </div>
                  <p className="text-sm font-semibold text-orange-900">
                    Compliance
                  </p>
                </div>

                <div className="bg-purple-50 p-6 rounded-lg border-2 border-purple-200 text-center">
                  <div className="text-4xl font-bold text-purple-600 mb-2">
                    {applicationScore.readiness}
                  </div>
                  <p className="text-sm font-semibold text-purple-900">
                    Readiness
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Improvement Suggestions</h4>
                <ul className="space-y-2">
                  {applicationScore.suggestions.map((suggestion, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <Zap className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
