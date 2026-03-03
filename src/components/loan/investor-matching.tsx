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
import {
  Users,
  MapPin,
  DollarSign,
  TrendingUp,
  Clock,
  Building,
  ExternalLink,
  Star,
  Target,
} from "lucide-react";
import { type InvestorMatch, type LoanEligibility } from "@/lib/loan-data";
import {
  RefineMatchingModal,
  type RefinementFilters,
} from "@/components/loan/refine-matching-modal";

interface InvestorMatchingProps {
  investorMatches: InvestorMatch[];
  eligibility: LoanEligibility;
}

export function InvestorMatchingEngine({
  investorMatches,
  eligibility,
}: InvestorMatchingProps) {
  const [showRefineModal, setShowRefineModal] = useState(false);

  const handleRefinementFilters = (filters: RefinementFilters) => {
    console.log("Applied refinement filters:", filters);
    // In a real implementation, these filters would be sent to an API
    // to recalculate investor matches based on user preferences
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount.toLocaleString()}`;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "vc":
        return "bg-purple-100 text-purple-800";
      case "angel":
        return "bg-blue-100 text-blue-800";
      case "bank":
        return "bg-green-100 text-green-800";
      case "government":
        return "bg-red-100 text-red-800";
      case "alternative":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "vc":
        return "Venture Capital";
      case "angel":
        return "Angel Investor";
      case "bank":
        return "Bank";
      case "government":
        return "Government";
      case "alternative":
        return "Alternative Lender";
      default:
        return type;
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 75) return "text-blue-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getMatchScoreBadgeColor = (score: number) => {
    if (score >= 90) return "bg-green-100 text-green-800";
    if (score >= 75) return "bg-blue-100 text-blue-800";
    if (score >= 60) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getTrustScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Investor/Lender Matching Engine
          </h2>
          <p className="text-gray-600">
            AI-powered matching with suitable investors and lenders
          </p>
        </div>
        <Button
          onClick={() => setShowRefineModal(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Target className="w-4 h-4 mr-2" />
          Refine Matching
        </Button>
      </div>

      <RefineMatchingModal
        open={showRefineModal}
        onOpenChange={setShowRefineModal}
        investorMatches={investorMatches}
        eligibility={eligibility}
        onRefine={handleRefinementFilters}
      />

      {/* Matching Summary */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-900">Matching Results</CardTitle>
          <CardDescription className="text-green-700">
            Your business profile has been matched with potential funding
            sources
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-900">
                {investorMatches.length}
              </div>
              <div className="text-sm text-green-700">Total Matches</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-900">
                {investorMatches.filter((m) => m.matchScore >= 90).length}
              </div>
              <div className="text-sm text-green-700">High Match</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-900">
                {Math.round(
                  investorMatches.reduce((acc, m) => acc + m.matchScore, 0) /
                    investorMatches.length,
                )}
                %
              </div>
              <div className="text-sm text-green-700">Avg Match Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-900">
                {Math.round(
                  investorMatches.reduce((acc, m) => acc + m.trustScore, 0) /
                    investorMatches.length,
                )}
                %
              </div>
              <div className="text-sm text-green-700">Avg Trust Score</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Investor Matches */}
      <div className="space-y-6">
        {investorMatches
          .sort((a, b) => b.matchScore - a.matchScore)
          .map((investor) => (
            <Card
              key={investor.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <CardTitle className="text-xl">{investor.name}</CardTitle>
                      <Badge className={getTypeColor(investor.type)}>
                        {getTypeLabel(investor.type)}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{investor.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="w-4 h-4" />
                        <span>
                          {formatCurrency(investor.investmentRange.min)} -{" "}
                          {formatCurrency(investor.investmentRange.max)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <Badge
                      className={getMatchScoreBadgeColor(investor.matchScore)}
                    >
                      {investor.matchScore}% Match
                    </Badge>
                    <div className="text-sm text-gray-600">
                      Trust:{" "}
                      <span className={getTrustScoreColor(investor.trustScore)}>
                        {investor.trustScore}%
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Match and Trust Scores */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Match Score</span>
                      <span
                        className={`font-medium ${getMatchScoreColor(investor.matchScore)}`}
                      >
                        {investor.matchScore}%
                      </span>
                    </div>
                    <Progress value={investor.matchScore} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Trust Score</span>
                      <span
                        className={`font-medium ${getTrustScoreColor(investor.trustScore)}`}
                      >
                        {investor.trustScore}%
                      </span>
                    </div>
                    <Progress value={investor.trustScore} className="h-2" />
                  </div>
                </div>

                {/* Focus Areas */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Focus Industries
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {investor.focusIndustries.map((industry, index) => (
                      <Badge key={index} variant="outline" className="text-sm">
                        {industry}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Investment Stages */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Investment Stages
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {investor.stage.map((stage, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-sm"
                      >
                        {stage}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Portfolio Companies */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Portfolio Highlights
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {investor.portfolio.slice(0, 3).map((company, index) => (
                      <Badge
                        key={index}
                        className="bg-gray-100 text-gray-800 text-sm"
                      >
                        {company}
                      </Badge>
                    ))}
                    {investor.portfolio.length > 3 && (
                      <Badge className="bg-gray-100 text-gray-800 text-sm">
                        +{investor.portfolio.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Recent Investments */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Recent Investments
                  </h4>
                  <div className="space-y-2">
                    {investor.recentInvestments.map((investment, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded"
                      >
                        <div>
                          <div className="font-medium text-sm">
                            {investment.company}
                          </div>
                          <div className="text-xs text-gray-600">
                            {investment.industry}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-sm">
                            {formatCurrency(investment.amount)}
                          </div>
                          <div className="text-xs text-gray-600">
                            {formatDate(investment.date)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Investment Preferences */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Preferences
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Min Revenue:</span>
                        <span className="font-medium">
                          {formatCurrency(
                            investor.preferences.revenueRequirement,
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Decision Time:</span>
                        <span className="font-medium">
                          {investor.preferences.timeToDecision} days
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Business Models
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {investor.preferences.businessModel
                        .slice(0, 2)
                        .map((model, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {model}
                          </Badge>
                        ))}
                      {investor.preferences.businessModel.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{investor.preferences.businessModel.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Application Process */}
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-1">
                    Application Process
                  </h4>
                  <p className="text-sm text-blue-800">
                    {investor.contactInfo.applicationProcess}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex space-x-3 pt-4 border-t">
                  <Button variant="outline" className="flex-1">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Visit Website
                  </Button>
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                    <Star className="w-4 h-4 mr-2" />
                    Connect
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      {/* Matching Tips */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Improve Your Matches</CardTitle>
          <CardDescription className="text-blue-700">
            Tips to increase your matching score with investors and lenders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-blue-900 mb-3">
                Profile Optimization
              </h4>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>
                  • Complete your business profile with detailed information
                </li>
                <li>• Add financial projections and growth metrics</li>
                <li>• Highlight unique value propositions</li>
                <li>• Include team background and expertise</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 mb-3">
                Matching Strategy
              </h4>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• Research investor portfolio and preferences</li>
                <li>• Tailor your pitch to investor focus areas</li>
                <li>• Leverage warm introductions when possible</li>
                <li>• Follow up consistently but respectfully</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
