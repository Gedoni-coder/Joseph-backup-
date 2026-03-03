import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  Download,
  Upload,
  Zap,
  Target,
  CreditCard,
  AlertCircle,
  Loader,
  CheckCircle2,
  SaveIcon,
  Trash2,
} from "lucide-react";
import {
  type ApplicationDocument,
  type BusinessPlan,
  type LoanEligibility,
  type FundingOption,
} from "@/lib/loan-data";

interface ApplicationAssistanceProps {
  applicationDocuments: ApplicationDocument[];
  businessPlan: BusinessPlan;
  eligibility: LoanEligibility;
  onUpdateDocumentStatus: (
    docId: string,
    status: ApplicationDocument["status"],
  ) => void;
  selectedFundingOption?: FundingOption | null;
}

interface ApplicationFormData {
  businessName: string;
  industry: string;
  businessType: string;
  loanAmount: string;
  loanPurpose: string;
  businessAge: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  personalCreditScore: string;
  businessCreditScore: string;
  businessRevenue: string;
  collateralValue: string;
  additionalNotes: string;
}

interface UploadedDocument {
  id: string;
  name: string;
  file: File;
  uploadedAt: Date;
}

interface ApplicationSubmission {
  id: string;
  fundingOptionName: string;
  status: "draft" | "submitted" | "in-review" | "approved" | "rejected";
  submittedAt?: Date;
  progress: number;
}

export function ApplicationAssistance({
  applicationDocuments,
  businessPlan,
  eligibility,
  onUpdateDocumentStatus,
  selectedFundingOption,
}: ApplicationAssistanceProps) {
  const [activeStep, setActiveStep] = useState<"form" | "documents" | "review">(
    "form",
  );
  const [useAIAssistance, setUseAIAssistance] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [applicationProgress, setApplicationProgress] = useState(0);
  const [agentStatus, setAgentStatus] = useState<
    "idle" | "processing" | "complete" | "error"
  >("idle");

  const [formData, setFormData] = useState<ApplicationFormData>({
    businessName: eligibility.businessName || "",
    industry: eligibility.industry || "",
    businessType: eligibility.businessStage || "",
    loanAmount: selectedFundingOption
      ? `${selectedFundingOption.minAmount + selectedFundingOption.maxAmount / 2}`
      : "",
    loanPurpose: "",
    businessAge: eligibility.timeInBusiness?.toString() || "",
    ownerName: "",
    ownerEmail: "",
    ownerPhone: "",
    personalCreditScore: eligibility.creditScore?.toString() || "",
    businessCreditScore: "",
    businessRevenue: eligibility.monthlyRevenue?.toString() || "",
    collateralValue: eligibility.collateralValue?.toString() || "",
    additionalNotes: "",
  });

  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>(
    [],
  );
  const [submissions, setSubmissions] = useState<ApplicationSubmission[]>([]);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800";
      case "uploaded":
        return "bg-blue-100 text-blue-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "uploaded":
        return <Clock className="w-4 h-4 text-blue-600" />;
      case "rejected":
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case "pending":
        return <FileText className="w-4 h-4 text-gray-600" />;
      default:
        return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "required":
        return "bg-red-100 text-red-800";
      case "optional":
        return "bg-blue-100 text-blue-800";
      case "conditional":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSubmissionStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "submitted":
        return "bg-blue-100 text-blue-800";
      case "in-review":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const completedDocuments = applicationDocuments.filter(
    (doc) => doc.status === "verified" || doc.status === "uploaded",
  ).length;

  const completionPercentage = Math.round(
    (completedDocuments / applicationDocuments.length) * 100,
  );

  const handleFormChange = (
    field: keyof ApplicationFormData,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const newDoc: UploadedDocument = {
          id: `doc-${Date.now()}-${Math.random()}`,
          name: file.name,
          file: file,
          uploadedAt: new Date(),
        };
        setUploadedDocuments((prev) => [...prev, newDoc]);
      });
    }
  };

  const removeUploadedDocument = (id: string) => {
    setUploadedDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  const saveDraft = () => {
    const draft: ApplicationSubmission = {
      id: `draft-${Date.now()}`,
      fundingOptionName: selectedFundingOption?.name || "Custom Application",
      status: "draft",
      progress: Math.round(
        (Object.values(formData).filter((v) => v).length / Object.keys(formData).length) * 100,
      ),
    };
    setSubmissions((prev) => [...prev, draft]);
    setShowSaveConfirm(true);
    setTimeout(() => setShowSaveConfirm(false), 3000);
  };

  const simulateAIAgentExecution = async () => {
    setIsApplying(true);
    setAgentStatus("processing");
    setApplicationProgress(0);

    const steps = [
      { label: "Validating application data", duration: 1500 },
      { label: "Processing documents with OCR", duration: 2000 },
      { label: "Analyzing financial information", duration: 2500 },
      { label: "Checking eligibility criteria", duration: 1500 },
      { label: "Submitting to lender", duration: 2000 },
      { label: "Generating submission confirmation", duration: 1000 },
    ];

    let currentProgress = 0;
    for (const step of steps) {
      setApplicationProgress(currentProgress);
      await new Promise((resolve) => setTimeout(resolve, step.duration));
      currentProgress += Math.round(100 / steps.length);
    }

    setApplicationProgress(100);
    setAgentStatus("complete");
    setIsApplying(false);

    const submission: ApplicationSubmission = {
      id: `app-${Date.now()}`,
      fundingOptionName: selectedFundingOption?.name || "Custom Application",
      status: "submitted",
      submittedAt: new Date(),
      progress: 100,
    };
    setSubmissions((prev) => [...prev, submission]);
  };

  const isFormValid = Object.values(formData).every((val) => val.trim());
  const hasRequiredDocuments = uploadedDocuments.length > 0;

  return (
    <div className="space-y-6">
      {selectedFundingOption && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-blue-900">
                  {selectedFundingOption.name}
                </CardTitle>
                <CardDescription className="text-blue-700">
                  {selectedFundingOption.provider} •{" "}
                  {selectedFundingOption.type.replace("-", " ")}
                </CardDescription>
              </div>
              <Badge className="bg-blue-200 text-blue-900">Selected</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-xs text-blue-700">Amount Range</div>
                <div className="font-semibold text-blue-900">
                  ${(selectedFundingOption.minAmount / 1000).toFixed(0)}K -{" "}
                  ${(selectedFundingOption.maxAmount / 1000000).toFixed(1)}M
                </div>
              </div>
              <div>
                <div className="text-xs text-blue-700">Interest Rate</div>
                <div className="font-semibold text-blue-900">
                  {selectedFundingOption.interestRate === 0
                    ? "Equity"
                    : `${selectedFundingOption.interestRate.toFixed(2)}%`}
                </div>
              </div>
              <div>
                <div className="text-xs text-blue-700">Processing Time</div>
                <div className="font-semibold text-blue-900">
                  {selectedFundingOption.processingTime} days
                </div>
              </div>
              <div>
                <div className="text-xs text-blue-700">Collateral</div>
                <div className="font-semibold text-blue-900">
                  {selectedFundingOption.collateralRequired ? "Required" : "Not Required"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step Indicator */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveStep("form")}
          className={`flex-1 p-4 rounded-lg border-2 transition-all ${
            activeStep === "form"
              ? "border-blue-600 bg-blue-50"
              : "border-gray-200 bg-white hover:border-gray-300"
          }`}
        >
          <div className="font-semibold text-sm">Step 1: Application Form</div>
          <div className="text-xs text-gray-600 mt-1">Your information</div>
        </button>
        <button
          onClick={() => setActiveStep("documents")}
          className={`flex-1 p-4 rounded-lg border-2 transition-all ${
            activeStep === "documents"
              ? "border-blue-600 bg-blue-50"
              : "border-gray-200 bg-white hover:border-gray-300"
          }`}
        >
          <div className="font-semibold text-sm">Step 2: Documents</div>
          <div className="text-xs text-gray-600 mt-1">
            {uploadedDocuments.length} uploaded
          </div>
        </button>
        <button
          onClick={() => setActiveStep("review")}
          className={`flex-1 p-4 rounded-lg border-2 transition-all ${
            activeStep === "review"
              ? "border-blue-600 bg-blue-50"
              : "border-gray-200 bg-white hover:border-gray-300"
          }`}
        >
          <div className="font-semibold text-sm">Step 3: Review & Submit</div>
          <div className="text-xs text-gray-600 mt-1">Final submission</div>
        </button>
      </div>

      {/* Step 1: Application Form */}
      {activeStep === "form" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Application Form
              </CardTitle>
              <CardDescription>
                Please provide detailed information about your business and loan
                requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">
                    AI Assistance
                  </span>
                </div>
                <Switch
                  checked={useAIAssistance}
                  onCheckedChange={setUseAIAssistance}
                />
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">
                  Business Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Business Name
                    </label>
                    <Input
                      value={formData.businessName}
                      onChange={(e) =>
                        handleFormChange("businessName", e.target.value)
                      }
                      placeholder="Your business name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Industry
                    </label>
                    <Input
                      value={formData.industry}
                      onChange={(e) =>
                        handleFormChange("industry", e.target.value)
                      }
                      placeholder="e.g., Technology, Healthcare"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Business Type
                    </label>
                    <Select
                      value={formData.businessType}
                      onValueChange={(value) =>
                        handleFormChange("businessType", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select business type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="startup">Startup</SelectItem>
                        <SelectItem value="early">Early Stage</SelectItem>
                        <SelectItem value="growth">Growth</SelectItem>
                        <SelectItem value="mature">Mature</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Years in Business
                    </label>
                    <Input
                      type="number"
                      value={formData.businessAge}
                      onChange={(e) =>
                        handleFormChange("businessAge", e.target.value)
                      }
                      placeholder="Number of months/years"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Owner Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Owner Name
                    </label>
                    <Input
                      value={formData.ownerName}
                      onChange={(e) =>
                        handleFormChange("ownerName", e.target.value)
                      }
                      placeholder="Full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <Input
                      type="email"
                      value={formData.ownerEmail}
                      onChange={(e) =>
                        handleFormChange("ownerEmail", e.target.value)
                      }
                      placeholder="your@email.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Phone
                    </label>
                    <Input
                      value={formData.ownerPhone}
                      onChange={(e) =>
                        handleFormChange("ownerPhone", e.target.value)
                      }
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Personal Credit Score
                    </label>
                    <Input
                      type="number"
                      value={formData.personalCreditScore}
                      onChange={(e) =>
                        handleFormChange("personalCreditScore", e.target.value)
                      }
                      placeholder="e.g., 750"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">
                  Financial Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Requested Loan Amount
                    </label>
                    <Input
                      type="number"
                      value={formData.loanAmount}
                      onChange={(e) =>
                        handleFormChange("loanAmount", e.target.value)
                      }
                      placeholder="Amount in dollars"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Loan Purpose
                    </label>
                    <Select
                      value={formData.loanPurpose}
                      onValueChange={(value) =>
                        handleFormChange("loanPurpose", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select purpose" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="working-capital">
                          Working Capital
                        </SelectItem>
                        <SelectItem value="expansion">Expansion</SelectItem>
                        <SelectItem value="equipment">Equipment</SelectItem>
                        <SelectItem value="debt-consolidation">
                          Debt Consolidation
                        </SelectItem>
                        <SelectItem value="inventory">Inventory</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Monthly Business Revenue
                    </label>
                    <Input
                      type="number"
                      value={formData.businessRevenue}
                      onChange={(e) =>
                        handleFormChange("businessRevenue", e.target.value)
                      }
                      placeholder="Amount in dollars"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Available Collateral Value
                    </label>
                    <Input
                      type="number"
                      value={formData.collateralValue}
                      onChange={(e) =>
                        handleFormChange("collateralValue", e.target.value)
                      }
                      placeholder="Amount in dollars"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Additional Notes
                </label>
                <textarea
                  value={formData.additionalNotes}
                  onChange={(e) =>
                    handleFormChange("additionalNotes", e.target.value)
                  }
                  className="w-full h-24 p-3 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Any additional information you'd like to share"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={saveDraft}
                  variant="outline"
                  className="flex-1"
                  disabled={!isFormValid}
                >
                  <SaveIcon className="w-4 h-4 mr-2" />
                  Save as Draft
                </Button>
                <Button
                  onClick={() => setActiveStep("documents")}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={!isFormValid}
                >
                  Continue to Documents
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 2: Document Upload */}
      {activeStep === "documents" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-green-600" />
                Upload Documents
              </CardTitle>
              <CardDescription>
                Upload required and supporting documents for your application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Required Documents Checklist */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">
                  Required Documents
                </h3>
                <div className="space-y-3">
                  {applicationDocuments
                    .filter((doc) => doc.type === "required")
                    .map((document) => (
                      <div
                        key={document.id}
                        className="flex items-center justify-between p-4 border rounded-lg bg-white hover:bg-gray-50"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">
                              {document.name}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {document.description}
                            </p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(document.status)}>
                          {document.status}
                        </Badge>
                      </div>
                    ))}
                </div>
              </div>

              {/* Drag and Drop Area */}
              <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 bg-blue-50 text-center">
                <Upload className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 mb-1">
                  Drag and drop documents here
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  or click to browse files (PDF, DOC, DOCX, Images)
                </p>
                <input
                  type="file"
                  id="file-upload"
                  multiple
                  onChange={handleDocumentUpload}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                <label htmlFor="file-upload">
                  <Button
                    variant="outline"
                    className="cursor-pointer"
                    onClick={() =>
                      document.getElementById("file-upload")?.click()
                    }
                  >
                    Choose Files
                  </Button>
                </label>
              </div>

              {/* Uploaded Documents List */}
              {uploadedDocuments.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Uploaded Documents ({uploadedDocuments.length})
                  </h3>
                  <div className="space-y-2">
                    {uploadedDocuments.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <div className="text-sm">
                            <div className="font-medium text-green-900">
                              {doc.name}
                            </div>
                            <div className="text-xs text-green-700">
                              {doc.uploadedAt.toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeUploadedDocument(doc.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => setActiveStep("form")}
                  variant="outline"
                  className="flex-1"
                >
                  Back to Form
                </Button>
                <Button
                  onClick={() => setActiveStep("review")}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={!hasRequiredDocuments}
                >
                  Continue to Review
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 3: Review & Submit */}
      {activeStep === "review" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-purple-600" />
                Review & Submit Application
              </CardTitle>
              <CardDescription>
                Review your information before submitting to the lender
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Application Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">
                    Business Details
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Business Name:</span>
                      <span className="font-medium">{formData.businessName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Industry:</span>
                      <span className="font-medium">{formData.industry}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Business Type:</span>
                      <span className="font-medium">{formData.businessType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Monthly Revenue:</span>
                      <span className="font-medium">
                        ${parseInt(formData.businessRevenue).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Loan Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Requested Amount:</span>
                      <span className="font-medium">
                        ${parseInt(formData.loanAmount).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Loan Purpose:</span>
                      <span className="font-medium">{formData.loanPurpose}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Collateral Value:</span>
                      <span className="font-medium">
                        ${parseInt(formData.collateralValue).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Documents ({uploadedDocuments.length} uploaded)
                </h3>
                <div className="space-y-2">
                  {uploadedDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center gap-2 p-2 text-sm text-gray-700"
                    >
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      {doc.name}
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Agent Status */}
              {isApplying && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Loader className="w-5 h-5 text-blue-600 animate-spin" />
                    <span className="font-semibold text-blue-900">
                      AI Agent Processing Your Application
                    </span>
                  </div>
                  <Progress value={applicationProgress} className="h-2 mb-3" />
                  <p className="text-sm text-blue-700">
                    {applicationProgress}% complete
                  </p>
                </div>
              )}

              {agentStatus === "complete" && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-900">
                      Application Submitted Successfully!
                    </span>
                  </div>
                  <p className="text-sm text-green-700">
                    Your application has been submitted to{" "}
                    {selectedFundingOption?.provider}. We'll notify you of any
                    updates.
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => setActiveStep("documents")}
                  variant="outline"
                  className="flex-1"
                  disabled={isApplying}
                >
                  Back to Documents
                </Button>
                <Button
                  onClick={saveDraft}
                  variant="outline"
                  className="flex-1"
                  disabled={isApplying}
                >
                  Save as Draft
                </Button>
                <Button
                  onClick={simulateAIAgentExecution}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={isApplying || !isFormValid || !hasRequiredDocuments}
                >
                  {isApplying ? (
                    <>
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                      Applying...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Apply with AI Agent
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Saved Confirmation */}
      {showSaveConfirm && (
        <div className="fixed bottom-4 right-4 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3 shadow-lg">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-green-900 font-medium">
            Draft saved successfully!
          </span>
        </div>
      )}

      {/* Status Tracking Section */}
      {submissions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-600" />
              Application Status Tracking
            </CardTitle>
            <CardDescription>
              Track all your submitted and draft applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {submissions.map((submission) => (
                <div
                  key={submission.id}
                  className="flex items-center justify-between p-4 border rounded-lg bg-gray-50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">
                        {submission.fundingOptionName}
                      </span>
                      <Badge
                        className={getSubmissionStatusColor(submission.status)}
                      >
                        {submission.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      {submission.submittedAt
                        ? `Submitted on ${submission.submittedAt.toLocaleDateString()}`
                        : "Draft - not yet submitted"}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">
                      {submission.progress}%
                    </div>
                    <Progress value={submission.progress} className="w-32 h-2 mt-1" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Original Document Checklist - Optional */}
      {!selectedFundingOption && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-600" />
              Document Checklist
            </CardTitle>
            <CardDescription>
              Standard documents needed for loan applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {applicationDocuments.map((document) => (
                <div
                  key={document.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(document.status)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-gray-900">
                          {document.name}
                        </h3>
                        <Badge className={getTypeColor(document.type)}>
                          {document.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {document.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(document.status)}>
                      {document.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
