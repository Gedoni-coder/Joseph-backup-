import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface LoanCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoanCalculatorModal({
  isOpen,
  onClose,
}: LoanCalculatorModalProps) {
  const [loanAmount, setLoanAmount] = useState<number>(250000);
  const [interestRate, setInterestRate] = useState<number>(9.5);
  const [rateType, setRateType] = useState<"annual" | "monthly">("annual");
  const [tenure, setTenure] = useState<number>(60);
  const [tenureType, setTenureType] = useState<"months" | "years">("months");
  const [currency, setCurrency] = useState<string>("USD");
  const [frequency, setFrequency] = useState<"monthly" | "weekly" | "daily">(
    "monthly",
  );

  // Calculate tenure in months
  const tenureInMonths = tenureType === "months" ? tenure : tenure * 12;

  // Calculate monthly interest rate
  const monthlyRate =
    rateType === "annual" ? interestRate / 12 / 100 : interestRate / 100;

  // Calculate monthly payment using EMI formula
  const calculateMonthlyPayment = (): number => {
    if (tenureInMonths === 0 || monthlyRate === 0) return 0;

    const numerator =
      loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureInMonths);
    const denominator = Math.pow(1 + monthlyRate, tenureInMonths) - 1;

    return numerator / denominator;
  };

  const monthlyPayment = calculateMonthlyPayment();
  const totalPayment = monthlyPayment * tenureInMonths;
  const totalInterest = totalPayment - loanAmount;

  // Calculate frequency-adjusted payment
  const getFrequencyPayment = (): { amount: number; label: string } => {
    switch (frequency) {
      case "weekly":
        return {
          amount: monthlyPayment / 4.33,
          label: "Weekly",
        };
      case "daily":
        return {
          amount: monthlyPayment / 30.44,
          label: "Daily",
        };
      default:
        return {
          amount: monthlyPayment,
          label: "Monthly",
        };
    }
  };

  const frequencyPayment = getFrequencyPayment();

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const currencySymbols: Record<string, string> = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    NGN: "₦",
    JPY: "¥",
    INR: "₹",
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Joseph AI Loan Calculator</DialogTitle>
          <DialogDescription>
            Calculate your loan repayment across different frequencies
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Input Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Loan Amount */}
            <div className="space-y-2">
              <Label htmlFor="loan-amount">Loan Amount</Label>
              <div className="flex gap-2">
                <span className="flex items-center px-3 bg-gray-100 rounded-md">
                  {currencySymbols[currency] || "$"}
                </span>
                <Input
                  id="loan-amount"
                  type="number"
                  value={loanAmount}
                  onChange={(e) =>
                    setLoanAmount(parseFloat(e.target.value) || 0)
                  }
                  className="flex-1"
                  min="0"
                />
              </div>
            </div>

            {/* Currency */}
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger id="currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                  <SelectItem value="NGN">NGN (₦)</SelectItem>
                  <SelectItem value="JPY">JPY (¥)</SelectItem>
                  <SelectItem value="INR">INR (₹)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Interest Rate */}
            <div className="space-y-2">
              <Label>Interest Rate</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={interestRate}
                  onChange={(e) =>
                    setInterestRate(parseFloat(e.target.value) || 0)
                  }
                  step="0.1"
                  min="0"
                  className="flex-1"
                  placeholder="Rate"
                />
                <div className="flex gap-1 bg-gray-100 p-1 rounded-md">
                  <button
                    onClick={() => setRateType("annual")}
                    className={cn(
                      "px-3 py-1 text-xs font-medium rounded transition-all",
                      rateType === "annual"
                        ? "bg-blue-600 text-white"
                        : "bg-transparent text-gray-700 hover:text-gray-900",
                    )}
                  >
                    Annual
                  </button>
                  <button
                    onClick={() => setRateType("monthly")}
                    className={cn(
                      "px-3 py-1 text-xs font-medium rounded transition-all",
                      rateType === "monthly"
                        ? "bg-blue-600 text-white"
                        : "bg-transparent text-gray-700 hover:text-gray-900",
                    )}
                  >
                    Monthly
                  </button>
                </div>
              </div>
            </div>

            {/* Tenure */}
            <div className="space-y-2">
              <Label>Tenure</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={tenure}
                  onChange={(e) => setTenure(parseFloat(e.target.value) || 0)}
                  min="0"
                  className="flex-1"
                  placeholder="Duration"
                />
                <div className="flex gap-1 bg-gray-100 p-1 rounded-md">
                  <button
                    onClick={() => setTenureType("months")}
                    className={cn(
                      "px-3 py-1 text-xs font-medium rounded transition-all",
                      tenureType === "months"
                        ? "bg-blue-600 text-white"
                        : "bg-transparent text-gray-700 hover:text-gray-900",
                    )}
                  >
                    Months
                  </button>
                  <button
                    onClick={() => setTenureType("years")}
                    className={cn(
                      "px-3 py-1 text-xs font-medium rounded transition-all",
                      tenureType === "years"
                        ? "bg-blue-600 text-white"
                        : "bg-transparent text-gray-700 hover:text-gray-900",
                    )}
                  >
                    Years
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Repayment Frequency Selector */}
          <div className="space-y-2">
            <Label>View Repayment As</Label>
            <div className="flex gap-2 w-full">
              {["monthly", "weekly", "daily"].map((freq) => (
                <button
                  key={freq}
                  onClick={() =>
                    setFrequency(freq as "monthly" | "weekly" | "daily")
                  }
                  className={cn(
                    "flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all",
                    frequency === freq
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                  )}
                >
                  {freq.charAt(0).toUpperCase() + freq.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Results Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Repayment Payment */}
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-600">
                  {frequencyPayment.label} Repayment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(frequencyPayment.amount)}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Per {frequencyPayment.label.toLowerCase()}
                </div>
              </CardContent>
            </Card>

            {/* Total Interest */}
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-600">
                  Total Interest
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {formatCurrency(totalInterest)}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Over {tenureInMonths} months
                </div>
              </CardContent>
            </Card>

            {/* Total Payment */}
            <Card className="border-green-200 bg-green-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-600">
                  Total Payment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(totalPayment)}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Principal + Interest
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary */}
          <Card className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 border-blue-300">
            <CardContent className="pt-6">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Principal (Loan Amount):
                  </span>
                  <span className="font-semibold">
                    {formatCurrency(loanAmount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Annual Interest Rate:</span>
                  <span className="font-semibold">
                    {rateType === "annual"
                      ? interestRate.toFixed(2)
                      : (interestRate * 12).toFixed(2)}
                    %
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tenure:</span>
                  <span className="font-semibold">
                    {tenureInMonths} months ({Math.floor(tenureInMonths / 12)}{" "}
                    years {tenureInMonths % 12} months)
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Button */}
          <Button
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Close Calculator
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
