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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle,
  AlertCircle,
  TrendingUp,
  DollarSign,
  Building,
  Calendar,
  Target,
} from "lucide-react";
import { useState } from "react";
import { type LoanEligibility } from "@/lib/loan-data";

interface LoanEligibilityProps {
  eligibility: LoanEligibility;
  onUpdateEligibility: (updates: Partial<LoanEligibility>) => void;
}

export function LoanEligibilityAssessment({
  eligibility,
  onUpdateEligibility,
}: LoanEligibilityProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    monthlyRevenue: eligibility.monthlyRevenue,
    creditScore: eligibility.creditScore,
    collateralValue: eligibility.collateralValue,
    businessStage: eligibility.businessStage,
    timeInBusiness: eligibility.timeInBusiness,
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800";
    if (score >= 60) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getCreditScoreColor = (score: number) => {
    if (score >= 750) return "text-green-600";
    if (score >= 700) return "text-blue-600";
    if (score >= 650) return "text-yellow-600";
    return "text-red-600";
  };

  const handleSave = () => {
    onUpdateEligibility(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      monthlyRevenue: eligibility.monthlyRevenue,
      creditScore: eligibility.creditScore,
      collateralValue: eligibility.collateralValue,
      businessStage: eligibility.businessStage,
      timeInBusiness: eligibility.timeInBusiness,
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Loan Eligibility Assessment
          </h2>
          <p className="text-gray-600">
            Evaluate your business qualification for various loan programs
          </p>
        </div>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          variant={isEditing ? "outline" : "default"}
          className={isEditing ? "" : "bg-blue-600 hover:bg-blue-700"}
        >
          <Target className="w-4 h-4 mr-2" />
          {isEditing ? "Cancel" : "Update Info"}
        </Button>
      </div>

      {/* Overall Eligibility Score */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-blue-900">
            Overall Eligibility Score
          </CardTitle>
          <CardDescription className="text-blue-700">
            Based on your business profile and financial metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="text-5xl font-bold text-blue-600">
              {eligibility.eligibilityScore}
            </div>
            <Badge className={getScoreBadgeColor(eligibility.eligibilityScore)}>
              {eligibility.eligibilityScore >= 80
                ? "Excellent"
                : eligibility.eligibilityScore >= 60
                  ? "Good"
                  : "Needs Improvement"}
            </Badge>
          </div>
          <Progress value={eligibility.eligibilityScore} className="h-3 mb-2" />
          <div className="text-sm text-blue-700">
            You qualify for {eligibility.qualifiedPrograms.length} loan programs
          </div>
        </CardContent>
      </Card>

      {/* Business Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="w-5 h-5 mr-2 text-blue-600" />
              Business Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="businessStage">Business Stage</Label>
                  <Select
                    value={formData.businessStage}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        businessStage: value as any,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="startup">Startup</SelectItem>
                      <SelectItem value="early">Early Stage</SelectItem>
                      <SelectItem value="growth">Growth</SelectItem>
                      <SelectItem value="mature">Mature</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="timeInBusiness">
                    Time in Business (months)
                  </Label>
                  <Input
                    id="timeInBusiness"
                    type="number"
                    value={formData.timeInBusiness}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        timeInBusiness: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Business Name</span>
                  <span className="font-medium">
                    {eligibility.businessName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Stage</span>
                  <Badge variant="outline">{eligibility.businessStage}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Industry</span>
                  <span className="font-medium">{eligibility.industry}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time in Business</span>
                  <span className="font-medium">
                    {Math.floor(eligibility.timeInBusiness / 12)} years{" "}
                    {eligibility.timeInBusiness % 12} months
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-green-600" />
              Financial Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="monthlyRevenue">Monthly Revenue ($)</Label>
                  <Input
                    id="monthlyRevenue"
                    type="number"
                    value={formData.monthlyRevenue}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        monthlyRevenue: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="creditScore">Credit Score</Label>
                  <Input
                    id="creditScore"
                    type="number"
                    min="300"
                    max="850"
                    value={formData.creditScore}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        creditScore: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="collateralValue">Collateral Value ($)</Label>
                  <Input
                    id="collateralValue"
                    type="number"
                    value={formData.collateralValue}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        collateralValue: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div className="flex space-x-2">
                  <Button onClick={handleSave} className="flex-1">
                    Save Changes
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monthly Revenue</span>
                  <span className="font-medium">
                    {formatCurrency(eligibility.monthlyRevenue)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Annual Revenue</span>
                  <span className="font-medium">
                    {formatCurrency(eligibility.yearlyRevenue)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Credit Score</span>
                  <span
                    className={`font-bold ${getCreditScoreColor(eligibility.creditScore)}`}
                  >
                    {eligibility.creditScore}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Collateral Value</span>
                  <span className="font-medium">
                    {formatCurrency(eligibility.collateralValue)}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Qualified Programs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
            Qualified Loan Programs
          </CardTitle>
          <CardDescription>
            Based on your current business profile, you qualify for these
            programs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {eligibility.qualifiedPrograms.map((program, index) => (
              <div
                key={index}
                className="flex items-center p-3 bg-green-50 rounded-lg border border-green-200"
              >
                <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                <span className="font-medium text-green-900">{program}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
            Recommendations to Improve Eligibility
          </CardTitle>
          <CardDescription>
            Actions you can take to qualify for additional programs or better
            terms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {eligibility.recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start">
                <AlertCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{recommendation}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
