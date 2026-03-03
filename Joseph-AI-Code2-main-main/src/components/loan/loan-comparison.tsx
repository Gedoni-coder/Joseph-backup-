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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  TrendingUp,
  TrendingDown,
  Clock,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Calculator,
  ExternalLink,
} from "lucide-react";
import { type LoanComparison } from "@/lib/loan-data";
import { LoanCalculatorModal } from "./loan-calculator";

interface ConditionsModalState {
  isOpen: boolean;
  loanId: string | null;
  loanName: string;
  conditions: string[];
}

interface LoanComparisonProps {
  loanComparisons: LoanComparison[];
  onStartApplication?: (loan: LoanComparison) => void;
}

export function SmartLoanComparison({
  loanComparisons,
  onStartApplication,
}: LoanComparisonProps) {
  const [conditionsModal, setConditionsModal] = useState<ConditionsModalState>({
    isOpen: false,
    loanId: null,
    loanName: "",
    conditions: [],
  });
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getBestOption = (
    field: keyof Pick<
      LoanComparison,
      "interestRate" | "monthlyPayment" | "totalInterest" | "processingTime"
    >,
  ) => {
    if (loanComparisons.length === 0) return null;

    let best = loanComparisons[0];
    for (const loan of loanComparisons) {
      if (
        field === "interestRate" ||
        field === "monthlyPayment" ||
        field === "totalInterest" ||
        field === "processingTime"
      ) {
        if (loan[field] < best[field]) {
          best = loan;
        }
      }
    }
    return best.id;
  };

  const getApprovalColor = (odds: number) => {
    if (odds >= 80) return "text-green-600";
    if (odds >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getApprovalBadgeColor = (odds: number) => {
    if (odds >= 80) return "bg-green-100 text-green-800";
    if (odds >= 60) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const openConditionsModal = (loan: LoanComparison) => {
    setConditionsModal({
      isOpen: true,
      loanId: loan.id,
      loanName: loan.loanName,
      conditions: loan.conditions,
    });
  };

  const bestInterestRate = getBestOption("interestRate");
  const bestMonthlyPayment = getBestOption("monthlyPayment");
  const bestTotalInterest = getBestOption("totalInterest");
  const bestProcessingTime = getBestOption("processingTime");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Smart Loan Comparison
          </h2>
          <p className="text-gray-600">
            Side-by-side comparison to help you choose the best loan option
          </p>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setIsCalculatorOpen(true)}
        >
          <Calculator className="w-4 h-4 mr-2" />
          Loan Calculator
        </Button>
      </div>

      {/* Comparison Overview */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Comparison Summary</CardTitle>
          <CardDescription className="text-blue-700">
            Key metrics across all loan options
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-900">
                {loanComparisons.length}
              </div>
              <div className="text-sm text-blue-700">Loan Options</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-900">
                {loanComparisons.length > 0
                  ? Math.min(
                      ...loanComparisons.map((l) => l.interestRate),
                    ).toFixed(2)
                  : 0}
                %
              </div>
              <div className="text-sm text-blue-700">Lowest Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-900">
                {loanComparisons.length > 0
                  ? formatCurrency(
                      Math.min(...loanComparisons.map((l) => l.monthlyPayment)),
                    )
                  : "$0"}
              </div>
              <div className="text-sm text-blue-700">Lowest Payment</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-900">
                {loanComparisons.length > 0
                  ? Math.min(...loanComparisons.map((l) => l.processingTime))
                  : 0}
              </div>
              <div className="text-sm text-blue-700">
                Fastest Approval (days)
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loanComparisons.map((loan) => (
          <Card key={loan.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{loan.loanName}</CardTitle>
                  <CardDescription>{loan.provider}</CardDescription>
                </div>
                <Badge className={getApprovalBadgeColor(loan.approvalOdds)}>
                  {loan.approvalOdds}% approval odds
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Loan Amount</span>
                      {loan.id === bestInterestRate && (
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          Best
                        </Badge>
                      )}
                    </div>
                    <div className="text-xl font-bold">
                      {formatCurrency(loan.amount)}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Interest Rate
                      </span>
                      {loan.id === bestInterestRate && (
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          Best
                        </Badge>
                      )}
                    </div>
                    <div className="text-xl font-bold text-blue-600">
                      {loan.interestRate.toFixed(2)}%
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Term</span>
                    </div>
                    <div className="text-lg font-semibold">
                      {Math.floor(loan.termMonths / 12)} years{" "}
                      {loan.termMonths % 12} months
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Monthly Payment
                      </span>
                      {loan.id === bestMonthlyPayment && (
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          Best
                        </Badge>
                      )}
                    </div>
                    <div className="text-xl font-bold">
                      {formatCurrency(loan.monthlyPayment)}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Total Interest
                      </span>
                      {loan.id === bestTotalInterest && (
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          Best
                        </Badge>
                      )}
                    </div>
                    <div className="text-lg font-semibold">
                      {formatCurrency(loan.totalInterest)}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Processing Time
                      </span>
                      {loan.id === bestProcessingTime && (
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          Best
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-lg font-semibold">
                        {loan.processingTime} days
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Approval Odds */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Approval Probability</span>
                  <span
                    className={`font-medium ${getApprovalColor(loan.approvalOdds)}`}
                  >
                    {loan.approvalOdds}%
                  </span>
                </div>
                <Progress value={loan.approvalOdds} className="h-2" />
              </div>

              {/* Fees */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Fees</h4>
                <div className="space-y-2">
                  {loan.fees.map((fee, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">{fee.type}</span>
                      <span className="font-medium">
                        {formatCurrency(fee.amount)}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between text-sm font-semibold border-t pt-2">
                    <span>Total Fees</span>
                    <span>
                      {formatCurrency(
                        loan.fees.reduce((sum, fee) => sum + fee.amount, 0),
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Pros and Cons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-green-700 mb-2 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Pros
                  </h4>
                  <ul className="space-y-1">
                    {loan.pros.map((pro, index) => (
                      <li
                        key={index}
                        className="text-sm text-gray-700 flex items-start"
                      >
                        <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-red-700 mb-2 flex items-center">
                    <XCircle className="w-4 h-4 mr-1" />
                    Cons
                  </h4>
                  <ul className="space-y-1">
                    {loan.cons.map((con, index) => (
                      <li
                        key={index}
                        className="text-sm text-gray-700 flex items-start"
                      >
                        <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Conditions */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Key Conditions
                </h4>
                <ul className="space-y-1">
                  {loan.conditions.slice(0, 3).map((condition, index) => (
                    <li
                      key={index}
                      className="text-sm text-gray-700 flex items-start"
                    >
                      <AlertTriangle className="w-3 h-3 text-yellow-500 mr-2 mt-1 flex-shrink-0" />
                      {condition}
                    </li>
                  ))}
                  {loan.conditions.length > 3 && (
                    <li
                      className="text-sm text-blue-600 cursor-pointer hover:underline font-medium"
                      onClick={() => openConditionsModal(loan)}
                    >
                      View {loan.conditions.length - 3} more conditions...
                    </li>
                  )}
                </ul>
              </div>

              {/* Actions */}
              <div className="flex space-x-2 pt-3 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() =>
                    loan.website && window.open(loan.website, "_blank")
                  }
                  disabled={!loan.website}
                >
                  <ExternalLink className="w-3 h-3" />
                  More Details
                </Button>
                <Button
                  size="sm"
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  onClick={() => onStartApplication?.(loan)}
                >
                  Start Application
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Loan Calculator Modal */}
      <LoanCalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
      />
    </div>
  );
}
