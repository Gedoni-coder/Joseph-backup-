import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { TaxCalculation } from "@/lib/tax-compliance-data";
import {
  Calculator,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  FileText,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface SmartTaxCalculatorProps {
  calculations: TaxCalculation[];
  onUpdateCalculation: (id: string, updates: Partial<TaxCalculation>) => void;
  title?: string;
}

export function SmartTaxCalculator({
  calculations,
  onUpdateCalculation,
  title = "Smart Tax Calculator",
}: SmartTaxCalculatorProps) {
  const [selectedCalculation, setSelectedCalculation] = useState<string>(
    calculations[0]?.id || "",
  );
  const [isCalculating, setIsCalculating] = useState(false);

  const currentCalc = calculations.find((c) => c.id === selectedCalculation);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getStatusColor = (status: TaxCalculation["status"]) => {
    switch (status) {
      case "filed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "calculated":
        return "bg-green-100 text-green-800 border-green-200";
      case "amended":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: TaxCalculation["status"]) => {
    switch (status) {
      case "filed":
        return <CheckCircle className="h-4 w-4" />;
      case "calculated":
        return <Calculator className="h-4 w-4" />;
      case "amended":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const handleCalculate = async () => {
    if (!currentCalc) return;

    setIsCalculating(true);

    // Simulate calculation delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const taxableIncome = currentCalc.income - currentCalc.deductions;
    const estimatedTax = taxableIncome * (currentCalc.marginalRate / 100);
    const effectiveRate = (estimatedTax / currentCalc.income) * 100;

    onUpdateCalculation(currentCalc.id, {
      taxableIncome,
      estimatedTax,
      effectiveRate,
      status: "calculated",
    });

    setIsCalculating(false);
  };

  const handleInputChange = (field: keyof TaxCalculation, value: number) => {
    if (!currentCalc) return;
    onUpdateCalculation(currentCalc.id, { [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Calculator className="h-5 w-5 text-blue-600" />
          {title}
        </h3>
        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
          {calculations.length} entities
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Entity Selection */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm text-gray-700">Select Entity</h4>
          <div className="space-y-2">
            {calculations.map((calc) => (
              <Card
                key={calc.id}
                className={cn(
                  "cursor-pointer transition-all hover:shadow-md",
                  selectedCalculation === calc.id
                    ? "ring-2 ring-blue-500 bg-blue-50"
                    : "hover:bg-gray-50",
                )}
                onClick={() => setSelectedCalculation(calc.id)}
              >
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium text-sm">{calc.entity}</h5>
                      <Badge
                        className={cn("text-xs", getStatusColor(calc.status))}
                      >
                        {getStatusIcon(calc.status)}
                        <span className="ml-1">{calc.status}</span>
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-600">
                      Tax Year: {calc.taxYear}
                    </div>
                    <div className="text-sm font-semibold text-blue-600">
                      {formatCurrency(calc.estimatedTax)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Calculator Form */}
        <div className="lg:col-span-2 space-y-6">
          {currentCalc && (
            <>
              <Card className="border-blue-200">
                <CardHeader className="bg-blue-50">
                  <CardTitle className="text-base text-blue-800">
                    Tax Calculation - {currentCalc.entity}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="income" className="text-sm font-medium">
                        Gross Income
                      </Label>
                      <Input
                        id="income"
                        type="number"
                        value={currentCalc.income}
                        onChange={(e) =>
                          handleInputChange("income", Number(e.target.value))
                        }
                        className="text-right"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="deductions"
                        className="text-sm font-medium"
                      >
                        Total Deductions
                      </Label>
                      <Input
                        id="deductions"
                        type="number"
                        value={currentCalc.deductions}
                        onChange={(e) =>
                          handleInputChange(
                            "deductions",
                            Number(e.target.value),
                          )
                        }
                        className="text-right"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Taxable Income
                      </Label>
                      <div className="p-3 bg-gray-50 rounded-md text-right font-semibold">
                        {formatCurrency(currentCalc.taxableIncome)}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="marginalRate"
                        className="text-sm font-medium"
                      >
                        Marginal Tax Rate (%)
                      </Label>
                      <Input
                        id="marginalRate"
                        type="number"
                        step="0.1"
                        value={currentCalc.marginalRate}
                        onChange={(e) =>
                          handleInputChange(
                            "marginalRate",
                            Number(e.target.value),
                          )
                        }
                        className="text-right"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleCalculate}
                    disabled={isCalculating}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {isCalculating ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Calculating...
                      </>
                    ) : (
                      <>
                        <Calculator className="h-4 w-4 mr-2" />
                        Calculate Tax
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Results */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <DollarSign className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">
                          Estimated Tax
                        </div>
                        <div className="text-xl font-bold text-blue-600">
                          {formatCurrency(currentCalc.estimatedTax)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">
                          Effective Rate
                        </div>
                        <div className="text-xl font-bold text-blue-600">
                          {currentCalc.effectiveRate.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Calculator className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">
                          Tax Efficiency
                        </div>
                        <div className="text-xl font-bold text-blue-600">
                          {(100 - currentCalc.effectiveRate).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Tax Breakdown */}
              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="text-base">Tax Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Federal Income Tax</span>
                      <span className="font-semibold">
                        {formatCurrency(currentCalc.estimatedTax * 0.85)}
                      </span>
                    </div>
                    <Progress value={85} className="h-2" />

                    <div className="flex justify-between items-center">
                      <span className="text-sm">State Income Tax</span>
                      <span className="font-semibold">
                        {formatCurrency(currentCalc.estimatedTax * 0.12)}
                      </span>
                    </div>
                    <Progress value={12} className="h-2" />

                    <div className="flex justify-between items-center">
                      <span className="text-sm">Other Taxes</span>
                      <span className="font-semibold">
                        {formatCurrency(currentCalc.estimatedTax * 0.03)}
                      </span>
                    </div>
                    <Progress value={3} className="h-2" />

                    <div className="border-t pt-4 flex justify-between items-center font-semibold">
                      <span>Total Estimated Tax</span>
                      <span className="text-blue-600">
                        {formatCurrency(currentCalc.estimatedTax)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
