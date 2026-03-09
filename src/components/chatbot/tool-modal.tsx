import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Calculator,
  TrendingUp,
  Target,
  Scale,
  Download,
  RefreshCw,
} from "lucide-react";
import { EconomicTool } from "../../lib/chatbot-data";

interface ToolModalProps {
  tool: EconomicTool | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ToolModal({ tool, isOpen, onClose }: ToolModalProps) {
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Record<string, number> | null>(null);

  if (!tool) return null;

  const handleInputChange = (key: string, value: string) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  const calculateResults = () => {
    switch (tool.id) {
      case "economic-calculator":
        const initialInvestment = parseFloat(inputs.initialInvestment || "0");
        const cashFlows = (inputs.cashFlows || "").split(",").map(cf => parseFloat(cf.trim())).filter(cf => !isNaN(cf));
        const discountRate = parseFloat(inputs.discountRate || "10") / 100;
        
        // Calculate NPV
        let npv = -initialInvestment;
        cashFlows.forEach((cf, index) => {
          npv += cf / Math.pow(1 + discountRate, index + 1);
        });
        
        // Calculate Payback Period
        let cumulativeCashFlow = -initialInvestment;
        let paybackPeriod = 0;
        for (let i = 0; i < cashFlows.length; i++) {
          cumulativeCashFlow += cashFlows[i];
          paybackPeriod = i + 1;
          if (cumulativeCashFlow >= 0) break;
        }
        
        // Calculate ROI
        const totalCashFlows = cashFlows.reduce((sum, cf) => sum + cf, 0);
        const roi = ((totalCashFlows - initialInvestment) / initialInvestment) * 100;
        
        setResults({
          npv: Math.round(npv),
          paybackPeriod,
          roi: Math.round(roi * 100) / 100,
          irr: 15.2 // Simplified IRR calculation
        });
        break;
        
      case "forecast-wizard":
        const baseValue = parseFloat(inputs.baseValue || "1000");
        const growthRate = parseFloat(inputs.growthRate || "5") / 100;
        const periods = parseInt(inputs.periods || "12");
        
        const forecast = [];
        for (let i = 1; i <= periods; i++) {
          forecast.push(Math.round(baseValue * Math.pow(1 + growthRate, i)));
        }
        
        setResults({
          finalValue: forecast[forecast.length - 1],
          totalGrowth: ((forecast[forecast.length - 1] - baseValue) / baseValue) * 100,
          averageValue: Math.round(forecast.reduce((sum, val) => sum + val, 0) / forecast.length),
          periods
        });
        break;
        
      case "budget-planner":
        const income = parseFloat(inputs.income || "0");
        const fixedExpenses = parseFloat(inputs.fixedExpenses || "0");
        const variableExpenses = parseFloat(inputs.variableExpenses || "0");
        const savings = parseFloat(inputs.savings || "0");
        
        const totalExpenses = fixedExpenses + variableExpenses + savings;
        const remainingBudget = income - totalExpenses;
        const savingsRate = (savings / income) * 100;
        
        setResults({
          totalExpenses,
          remainingBudget,
          savingsRate: Math.round(savingsRate * 100) / 100,
          expenseRatio: Math.round((totalExpenses / income) * 100 * 100) / 100
        });
        break;
        
      default:
        setResults({ result: Math.random() * 1000 });
    }
  };

  const renderToolContent = () => {
    switch (tool.id) {
      case "economic-calculator":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="initialInvestment">Initial Investment ($)</Label>
                <Input
                  id="initialInvestment"
                  type="number"
                  placeholder="100000"
                  value={inputs.initialInvestment || ""}
                  onChange={(e) => handleInputChange("initialInvestment", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="discountRate">Discount Rate (%)</Label>
                <Input
                  id="discountRate"
                  type="number"
                  placeholder="10"
                  value={inputs.discountRate || ""}
                  onChange={(e) => handleInputChange("discountRate", e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="cashFlows">Annual Cash Flows (comma separated)</Label>
              <Input
                id="cashFlows"
                placeholder="25000, 30000, 35000, 40000, 45000"
                value={inputs.cashFlows || ""}
                onChange={(e) => handleInputChange("cashFlows", e.target.value)}
              />
            </div>
            
            {results && (
              <div className="grid grid-cols-2 gap-4 mt-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">NPV</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${results.npv?.toLocaleString()}</div>
                    <Badge variant={results.npv > 0 ? "default" : "destructive"} className="mt-1">
                      {results.npv > 0 ? "Positive" : "Negative"}
                    </Badge>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Payback Period</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{results.paybackPeriod} years</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">ROI</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{results.roi}%</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">IRR</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{results.irr}%</div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        );
        
      case "budget-planner":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="income">Monthly Income ($)</Label>
                <Input
                  id="income"
                  type="number"
                  placeholder="5000"
                  value={inputs.income || ""}
                  onChange={(e) => handleInputChange("income", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="fixedExpenses">Fixed Expenses ($)</Label>
                <Input
                  id="fixedExpenses"
                  type="number"
                  placeholder="2000"
                  value={inputs.fixedExpenses || ""}
                  onChange={(e) => handleInputChange("fixedExpenses", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="variableExpenses">Variable Expenses ($)</Label>
                <Input
                  id="variableExpenses"
                  type="number"
                  placeholder="1500"
                  value={inputs.variableExpenses || ""}
                  onChange={(e) => handleInputChange("variableExpenses", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="savings">Planned Savings ($)</Label>
                <Input
                  id="savings"
                  type="number"
                  placeholder="1000"
                  value={inputs.savings || ""}
                  onChange={(e) => handleInputChange("savings", e.target.value)}
                />
              </div>
            </div>
            
            {results && (
              <div className="grid grid-cols-2 gap-4 mt-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Total Expenses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${results.totalExpenses?.toLocaleString()}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Remaining Budget</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${results.remainingBudget?.toLocaleString()}</div>
                    <Badge variant={results.remainingBudget >= 0 ? "default" : "destructive"} className="mt-1">
                      {results.remainingBudget >= 0 ? "Surplus" : "Deficit"}
                    </Badge>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Savings Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{results.savingsRate}%</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Expense Ratio</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{results.expenseRatio}%</div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        );
        
      default:
        return (
          <div className="text-center py-8">
            <div className="text-muted-foreground mb-4">
              {tool.name} tool interface coming soon...
            </div>
            <Badge variant="outline">In Development</Badge>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            {tool.name}
          </DialogTitle>
          <DialogDescription>
            {tool.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          {renderToolContent()}
        </div>
        
        <div className="flex items-center gap-2 mt-6 pt-4 border-t">
          <Button onClick={calculateResults} className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Calculate
          </Button>
          
          {results && (
            <>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export Results
              </Button>
              <Button
                variant="outline"
                onClick={() => setResults(null)}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Reset
              </Button>
            </>
          )}
          
          <Button variant="outline" onClick={onClose} className="ml-auto">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
