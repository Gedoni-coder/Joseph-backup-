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
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Shield,
  AlertTriangle,
  Target,
  Calendar,
  PieChart,
} from "lucide-react";
import {
  type FundingStrategy,
  type LoanEligibility,
  type FundingOption,
} from "@/lib/loan-data";
import { StrategyReportGenerator } from "@/components/loan/strategy-report";
import {
  RefineMatchingModal,
  type RefinementFilters,
} from "@/components/loan/refine-matching-modal";

interface FundingStrategyProps {
  fundingStrategy: FundingStrategy;
  eligibility: LoanEligibility;
  fundingOptions: FundingOption[];
}

export function FundingStrategyAnalysis({
  fundingStrategy,
  eligibility,
  fundingOptions,
}: FundingStrategyProps) {
  const [showRefineModal, setShowRefineModal] = useState(false);

  const handleRefinementFilters = (filters: RefinementFilters) => {
    console.log("Applied refinement filters:", filters);
    // In a real implementation, these filters would be sent to an API
    // to recalculate investor matches
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

  const getReadinessColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getReadinessBadgeColor = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800";
    if (score >= 60) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getRecommendedTypeColor = (type: string) => {
    switch (type) {
      case "equity":
        return "bg-blue-100 text-blue-800";
      case "debt":
        return "bg-green-100 text-green-800";
      case "hybrid":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Funding Strategy & Readiness Analysis
          </h2>
          <p className="text-gray-600">
            Strategic guidance for choosing the right funding approach
          </p>
        </div>
        <StrategyReportGenerator
          fundingStrategy={fundingStrategy}
          eligibility={eligibility}
          fundingOptions={fundingOptions}
        />
      </div>

      {/* Readiness Score */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <CardTitle className="text-purple-900">
            Funding Readiness Score
          </CardTitle>
          <CardDescription className="text-purple-700">
            Assessment of your business's readiness for funding
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="text-5xl font-bold text-purple-600">
              {fundingStrategy.readinessScore}
            </div>
            <Badge
              className={getReadinessBadgeColor(fundingStrategy.readinessScore)}
            >
              {fundingStrategy.readinessScore >= 80
                ? "Ready"
                : fundingStrategy.readinessScore >= 60
                  ? "Nearly Ready"
                  : "Needs Preparation"}
            </Badge>
          </div>
          <Progress
            value={fundingStrategy.readinessScore}
            className="h-3 mb-2"
          />
          <div className="text-sm text-purple-700">
            Based on business stage: {fundingStrategy.businessStage}
          </div>
        </CardContent>
      </Card>

      {/* Recommended Strategy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="w-5 h-5 mr-2 text-blue-600" />
            Recommended Funding Strategy
          </CardTitle>
          <CardDescription>
            Optimal funding approach based on your business profile
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">Recommended Type:</span>
            <Badge
              className={getRecommendedTypeColor(
                fundingStrategy.recommendedType,
              )}
            >
              {fundingStrategy.recommendedType.toUpperCase()}
            </Badge>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">
              Strategic Reasoning
            </h3>
            <p className="text-blue-800">{fundingStrategy.reasoning}</p>
          </div>
        </CardContent>
      </Card>

      {/* Funding Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-green-600" />
            Funding Timeline
          </CardTitle>
          <CardDescription>
            Recommended funding phases and milestones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {fundingStrategy.timeline.map((phase, index) => (
              <div key={index} className="relative">
                {index < fundingStrategy.timeline.length - 1 && (
                  <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-300"></div>
                )}
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {phase.phase}
                      </h3>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">
                          {formatCurrency(phase.amount)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {phase.timeframe}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="outline">{phase.type}</Badge>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        Key Milestones
                      </h4>
                      <ul className="space-y-1">
                        {phase.milestones.map((milestone, milestoneIndex) => (
                          <li
                            key={milestoneIndex}
                            className="text-sm text-gray-700 flex items-start"
                          >
                            <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                            {milestone}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Impact Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Equity Impact */}
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-900">
              <Users className="w-5 h-5 mr-2" />
              Equity Financing Impact
            </CardTitle>
            <CardDescription>
              Effects of raising equity investment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {fundingStrategy.impactAnalysis.equity.dilution}%
                </div>
                <div className="text-sm text-blue-700">Dilution</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {fundingStrategy.impactAnalysis.equity.ownershipRetained}%
                </div>
                <div className="text-sm text-green-700">Ownership Retained</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Control Impact
              </h4>
              <p className="text-sm text-gray-700">
                {fundingStrategy.impactAnalysis.equity.controlImpact}
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Future Rounds
              </h4>
              <ul className="space-y-1">
                {fundingStrategy.impactAnalysis.equity.futureRounds.map(
                  (round, index) => (
                    <li
                      key={index}
                      className="text-sm text-gray-700 flex items-start"
                    >
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      {round}
                    </li>
                  ),
                )}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Debt Impact */}
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center text-green-900">
              <DollarSign className="w-5 h-5 mr-2" />
              Debt Financing Impact
            </CardTitle>
            <CardDescription>
              Effects of taking on debt financing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(
                    fundingStrategy.impactAnalysis.debt.monthlyPayment,
                  )}
                </div>
                <div className="text-sm text-green-700">Monthly Payment</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(
                    fundingStrategy.impactAnalysis.debt.totalCost,
                  )}
                </div>
                <div className="text-sm text-red-700">Total Cost</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600">Cash Flow Impact</div>
                <div className="flex items-center space-x-1">
                  <TrendingDown className="w-4 h-4 text-red-500" />
                  <span className="font-semibold text-red-600">
                    {fundingStrategy.impactAnalysis.debt.cashFlowImpact}%
                  </span>
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Collateral Risk</div>
                <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Risk Assessment
              </h4>
              <p className="text-sm text-gray-700">
                {fundingStrategy.impactAnalysis.debt.collateralRisk}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2 text-purple-600" />
            Strategic Recommendations
          </CardTitle>
          <CardDescription>
            Actions to improve your funding position
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {fundingStrategy.recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-purple-600 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{recommendation}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Decision Framework */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardHeader>
          <CardTitle className="text-yellow-900">
            Equity vs Debt Decision Framework
          </CardTitle>
          <CardDescription className="text-yellow-700">
            Key factors to consider when choosing funding type
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-yellow-900 mb-3">
                Choose Equity When:
              </h4>
              <ul className="space-y-2 text-sm text-yellow-800">
                <li>• High growth potential and scalability</li>
                <li>• Need substantial capital for expansion</li>
                <li>• Want access to investor expertise</li>
                <li>• Cash flow is unpredictable</li>
                <li>• Looking for strategic partnerships</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-yellow-900 mb-3">
                Choose Debt When:
              </h4>
              <ul className="space-y-2 text-sm text-yellow-800">
                <li>• Stable, predictable cash flows</li>
                <li>• Want to maintain full control</li>
                <li>• Lower capital requirements</li>
                <li>• Strong credit profile</li>
                <li>• Tax benefits from interest deduction</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
