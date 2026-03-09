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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Percent,
  Target,
  BarChart3,
  Zap,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface TaxPolicy {
  type: string;
  currentRate: number;
  newRate: number;
  change: number;
  affectsYou: boolean;
  estimatedImpact: number;
  description: string;
}

interface PricingSensitivity {
  month: string;
  currentPrice: number;
  optimizedPrice: number;
  revenue: number;
  demandImpact: number;
  profitMargin: number;
}

interface ProfitabilityScenario {
  scenario: string;
  baseProfitMargin: number;
  afterTax: number;
  afterInflation: number;
  afterCustomerReaction: number;
  finalProfit: number;
  stability: number;
}

export function FiscalPolicyAnalyzer() {
  const [activeTab, setActiveTab] = useState("tax-breakdown");
  const [basePrice, setBasePrice] = useState(100000);

  const taxPolicies: TaxPolicy[] = [
    {
      type: "VAT",
      currentRate: 7.5,
      newRate: 7.5,
      change: 0,
      affectsYou: true,
      estimatedImpact: 0,
      description: "Value Added Tax - unchanged for now",
    },
    {
      type: "Corporate Income Tax",
      currentRate: 30,
      newRate: 33,
      change: 3,
      affectsYou: true,
      estimatedImpact: -450000,
      description: "Proposed 3% increase on corporate profits",
    },
    {
      type: "Industry Levies",
      currentRate: 2,
      newRate: 2.5,
      change: 0.5,
      affectsYou: true,
      estimatedImpact: -120000,
      description: "Manufacturing sector specific levy",
    },
    {
      type: "Customs Duties",
      currentRate: 15,
      newRate: 20,
      change: 5,
      affectsYou: true,
      estimatedImpact: -850000,
      description: "Tariff increase on imported materials",
    },
    {
      type: "Excise Duties",
      currentRate: 5,
      newRate: 5,
      change: 0,
      affectsYou: false,
      estimatedImpact: 0,
      description: "No change to specific commodity taxes",
    },
  ];

  const pricingSensitivityData: PricingSensitivity[] = [
    {
      month: "Jan",
      currentPrice: 100000,
      optimizedPrice: 105000,
      revenue: 525000000,
      demandImpact: -2,
      profitMargin: 25,
    },
    {
      month: "Feb",
      currentPrice: 100000,
      optimizedPrice: 108000,
      revenue: 540000000,
      demandImpact: -4,
      profitMargin: 26,
    },
    {
      month: "Mar",
      currentPrice: 100000,
      optimizedPrice: 110000,
      revenue: 550000000,
      demandImpact: -6,
      profitMargin: 27,
    },
    {
      month: "Apr",
      currentPrice: 100000,
      optimizedPrice: 112000,
      revenue: 560000000,
      demandImpact: -8,
      profitMargin: 26,
    },
    {
      month: "May",
      currentPrice: 100000,
      optimizedPrice: 115000,
      revenue: 575000000,
      demandImpact: -10,
      profitMargin: 25,
    },
  ];

  const profitabilityScenarios: ProfitabilityScenario[] = [
    {
      scenario: "Base Case (No Changes)",
      baseProfitMargin: 30,
      afterTax: 21,
      afterInflation: 18,
      afterCustomerReaction: 15,
      finalProfit: 15,
      stability: 85,
    },
    {
      scenario: "Tax Policy Applied",
      baseProfitMargin: 30,
      afterTax: 18,
      afterInflation: 15,
      afterCustomerReaction: 12,
      finalProfit: 12,
      stability: 72,
    },
    {
      scenario: "Tax + Price Optimization",
      baseProfitMargin: 30,
      afterTax: 18,
      afterInflation: 15,
      afterCustomerReaction: 14,
      finalProfit: 14,
      stability: 68,
    },
    {
      scenario: "Tax + Cost Reduction",
      baseProfitMargin: 30,
      afterTax: 18,
      afterInflation: 15,
      afterCustomerReaction: 15,
      finalProfit: 15,
      stability: 78,
    },
    {
      scenario: "Full Mitigation Strategy",
      baseProfitMargin: 30,
      afterTax: 18,
      afterInflation: 16,
      afterCustomerReaction: 16,
      finalProfit: 16,
      stability: 82,
    },
  ];

  const revenueForecast = [
    {
      month: "Current",
      baseRevenue: 5250000000,
      forecastedRevenue: 5250000000,
      loss: 0,
    },
    {
      month: "Month 1",
      baseRevenue: 5250000000,
      forecastedRevenue: 5145000000,
      loss: 105000000,
    },
    {
      month: "Month 2",
      baseRevenue: 5250000000,
      forecastedRevenue: 5082000000,
      loss: 168000000,
    },
    {
      month: "Month 3",
      baseRevenue: 5250000000,
      forecastedRevenue: 5040000000,
      loss: 210000000,
    },
    {
      month: "Month 4",
      baseRevenue: 5250000000,
      forecastedRevenue: 5097000000,
      loss: 153000000,
    },
    {
      month: "Month 5",
      baseRevenue: 5250000000,
      forecastedRevenue: 5175000000,
      loss: 75000000,
    },
  ];

  const calculateOptimalPrice = () => {
    const inflationRate = 0.285; // 28.5% CPI
    const taxIncrease = 0.03; // 3% corporate tax increase
    const customsDutyIncrease = 0.05; // 5% customs duty increase

    const inflationImpact = basePrice * inflationRate;
    const totalCostIncrease = basePrice * (taxIncrease + customsDutyIncrease);
    const optimalPrice = Math.round(
      basePrice + inflationImpact + totalCostIncrease * 0.5,
    );

    return optimalPrice;
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
              value="tax-breakdown"
              className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm px-2 sm:px-3"
            >
              Tax
            </TabsTrigger>
            <TabsTrigger
              value="pricing"
              className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm px-2 sm:px-3"
            >
              Pricing
            </TabsTrigger>
            <TabsTrigger
              value="profitability"
              className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm px-2 sm:px-3 hidden sm:flex"
            >
              Profit
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tax Policy Breakdown Tab */}
        <TabsContent value="tax-breakdown" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tax Policy Breakdown</CardTitle>
              <CardDescription>
                AI-powered analysis of fiscal policies and their impact on your
                business
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <div className="text-2xl font-bold text-red-600">
                    ₦
                    {taxPolicies.reduce(
                      (sum, p) => sum + Math.max(0, p.estimatedImpact),
                      0,
                    ) / 1000000}
                    M
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Total tax impact
                  </p>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <div className="text-2xl font-bold text-orange-600">
                    {taxPolicies.filter((p) => p.change > 0).length}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Policies affecting you
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round(
                      taxPolicies
                        .filter((p) => p.affectsYou)
                        .reduce((sum, p) => sum + p.change, 0),
                    )}
                    %
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Average rate increase
                  </p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <div className="text-2xl font-bold text-purple-600">
                    {taxPolicies.filter((p) => p.affectsYou).length}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Applicable policies
                  </p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="text-2xl font-bold text-green-600">
                    {taxPolicies.filter((p) => p.change === 0).length}
                  </div>
                  <p className="text-sm text-muted-foreground">Unchanged</p>
                </div>
              </div>

              <div className="space-y-4">
                {taxPolicies.map((policy) => (
                  <Card
                    key={policy.type}
                    className={`border-l-4 ${
                      policy.change > 0
                        ? "border-l-red-500 bg-red-50"
                        : "border-l-green-500 bg-green-50"
                    }`}
                  >
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">{policy.type}</h4>
                          {policy.affectsYou && (
                            <Badge variant="outline">
                              Affects Your Business
                            </Badge>
                          )}
                        </div>

                        <p className="text-sm text-muted-foreground">
                          {policy.description}
                        </p>

                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">
                              Current Rate
                            </p>
                            <p className="text-lg font-semibold">
                              {policy.currentRate}%
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-muted-foreground mb-1">
                              New Rate
                            </p>
                            <p className="text-lg font-semibold">
                              {policy.newRate}%
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-muted-foreground mb-1">
                              Change
                            </p>
                            <p
                              className={`text-lg font-semibold ${
                                policy.change > 0
                                  ? "text-red-600"
                                  : "text-green-600"
                              }`}
                            >
                              {policy.change > 0 ? "+" : ""}
                              {policy.change}%
                            </p>
                          </div>
                        </div>

                        {policy.estimatedImpact !== 0 && (
                          <div className="bg-white/50 p-2 rounded border">
                            <p className="text-sm font-semibold flex items-center gap-2">
                              <DollarSign className="h-4 w-4" />
                              "Impact to You" Summary
                            </p>
                            <p className="text-sm mt-1 text-muted-foreground">
                              Estimated impact on your bottom line:{" "}
                              <span
                                className={
                                  policy.estimatedImpact < 0
                                    ? "text-red-600 font-semibold"
                                    : "text-green-600 font-semibold"
                                }
                              >
                                ₦{(policy.estimatedImpact / 1000000).toFixed(1)}
                                M
                              </span>
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Price Sensitivity & Revenue Forecast Tab */}
        <TabsContent value="pricing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Price Sensitivity & Revenue Forecast</CardTitle>
              <CardDescription>
                Analyze how inflation and fiscal policy affect optimal pricing
                and revenue
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold mb-2 block">
                    Base Product Price (₦)
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={basePrice}
                      onChange={(e) => setBasePrice(Number(e.target.value))}
                      className="flex-1"
                    />
                    <div className="bg-blue-50 p-3 rounded border border-blue-200 text-right min-w-[200px]">
                      <p className="text-xs text-muted-foreground">
                        Optimal Price
                      </p>
                      <p className="text-xl font-bold text-blue-600">
                        ₦{calculateOptimalPrice().toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Revenue Impact Chart */}
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueForecast}>
                  <defs>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorLoss" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="baseRevenue"
                    stroke="#3b82f6"
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                    name="Base Revenue"
                  />
                  <Area
                    type="monotone"
                    dataKey="forecastedRevenue"
                    stroke="#ef4444"
                    fillOpacity={1}
                    fill="url(#colorLoss)"
                    name="Forecasted Revenue"
                  />
                </AreaChart>
              </ResponsiveContainer>

              {/* Pricing Strategy Table */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    AI-Optimized Pricing Strategy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {pricingSensitivityData.map((month) => (
                      <div
                        key={month.month}
                        className="border rounded-lg p-3 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-semibold">{month.month}</p>
                          <Badge variant="outline">
                            {month.demandImpact}% demand sensitivity
                          </Badge>
                        </div>

                        <div className="grid grid-cols-3 gap-3 text-sm">
                          <div>
                            <p className="text-muted-foreground">
                              Current Price
                            </p>
                            <p className="font-semibold">
                              ₦{month.currentPrice.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">
                              Optimal Price
                            </p>
                            <p className="font-semibold text-blue-600">
                              ₦{month.optimizedPrice.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">
                              Est. Profit Margin
                            </p>
                            <p className="font-semibold text-green-600">
                              {month.profitMargin}%
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Revenue Impact */}
              <Card className="border-l-4 border-l-red-500 bg-red-50">
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <p className="font-semibold flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      Revenue Impact Under Fiscal Regime
                    </p>
                    <p className="text-sm text-red-900">
                      Without pricing adjustments, you could lose approximately
                      ₦
                      {(
                        revenueForecast.reduce((sum, m) => sum + m.loss, 0) /
                        1000000000
                      ).toFixed(1)}
                      B in revenue over 5 months.
                    </p>
                    <p className="text-sm text-red-900 font-semibold">
                      Strategic price optimization can recover 60-80% of this
                      loss.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Profitability Stress Test Tab */}
        <TabsContent value="profitability" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profitability Stress Test</CardTitle>
              <CardDescription>
                Simulate different scenarios and their impact on profit
                stability
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profit Waterfall Chart */}
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={profitabilityScenarios}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="scenario"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis
                    label={{
                      value: "Profit Margin (%)",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="baseProfitMargin"
                    fill="#10b981"
                    name="Base Margin"
                  />
                  <Bar dataKey="afterTax" fill="#f97316" name="After Tax" />
                  <Bar
                    dataKey="afterInflation"
                    fill="#ef4444"
                    name="After Inflation"
                  />
                  <Bar
                    dataKey="finalProfit"
                    fill="#3b82f6"
                    name="Final Profit"
                  />
                </BarChart>
              </ResponsiveContainer>

              {/* Scenario Details */}
              <div className="space-y-3">
                {profitabilityScenarios.map((scenario) => (
                  <Card
                    key={scenario.scenario}
                    className={`border-l-4 ${
                      scenario.stability > 80
                        ? "border-l-green-500 bg-green-50"
                        : scenario.stability > 60
                          ? "border-l-yellow-500 bg-yellow-50"
                          : "border-l-red-500 bg-red-50"
                    }`}
                  >
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">{scenario.scenario}</h4>
                          <Badge
                            variant={
                              scenario.stability > 80
                                ? "outline"
                                : scenario.stability > 60
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            Stability: {scenario.stability}%
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
                          <div>
                            <p className="text-muted-foreground">Base Margin</p>
                            <p className="font-semibold">
                              {scenario.baseProfitMargin}%
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">After Tax</p>
                            <p className="font-semibold">
                              {scenario.afterTax}%
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">
                              After Inflation
                            </p>
                            <p className="font-semibold">
                              {scenario.afterInflation}%
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">
                              After Customer
                            </p>
                            <p className="font-semibold">
                              {scenario.afterCustomerReaction}%
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">
                              Final Profit
                            </p>
                            <p
                              className={`font-semibold ${
                                scenario.finalProfit > 15
                                  ? "text-green-600"
                                  : scenario.finalProfit > 10
                                    ? "text-yellow-600"
                                    : "text-red-600"
                              }`}
                            >
                              {scenario.finalProfit}%
                            </p>
                          </div>
                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              scenario.stability > 80
                                ? "bg-green-500"
                                : scenario.stability > 60
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                            }`}
                            style={{
                              width: `${scenario.stability}%`,
                            }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    Profit Maximization Strategy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-sm">
                          Pricing Optimization
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Implement dynamic pricing based on demand curves and
                          competitor analysis
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-sm">
                          Cost Optimization
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Reduce operational costs by 15-20% through process
                          automation
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-sm">
                          Revenue Diversification
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Develop new product lines or service offerings to
                          cushion tax impact
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-sm">Tax Planning</p>
                        <p className="text-xs text-muted-foreground">
                          Explore legitimate tax deductions and incentive
                          programs available to your sector
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Profit Stability Score */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <p className="font-semibold text-blue-900">
                      Recommended Scenario: "Full Mitigation Strategy"
                    </p>
                    <p className="text-sm text-blue-900">
                      This approach maintains 82% profit stability by combining
                      strategic pricing, cost optimization, and tax planning to
                      offset fiscal policy impacts.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
