import { useEffect, useMemo, useState } from "react";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock, TrendingUp, TrendingDown, Settings, Zap } from "lucide-react";

type AlgorithmType = "ai-driven" | "demand-based" | "competitor-based" | "rule-based";

type DynamicFactor = {
  name: string;
  currentValue: number;
  impact: number;
  weight: number;
};

type PriceHistoryRecord = {
  timestamp: string;
  type?: string;
  previous_price?: number;
  new_price?: number;
  change_percent?: number;
  reason?: string;
};

type PriceSettingRecord = {
  id: number;
  product: string;
  base_price: number;
  current_price: number;
  strategy: string;
  algorithm: AlgorithmType;
  min_price: number | null;
  max_price: number | null;
  next_update: string | null;
  factors: DynamicFactor[];
  history: PriceHistoryRecord[];
  created_at: string;
  updated_at: string;
};

const extractList = <T,>(payload: unknown): T[] => {
  if (Array.isArray(payload)) {
    return payload as T[];
  }

  if (payload && typeof payload === "object" && "results" in payload) {
    const results = (payload as { results?: unknown }).results;
    return Array.isArray(results) ? (results as T[]) : [];
  }

  return [];
};

const algorithmColors = {
  "ai-driven": "bg-purple-100 text-purple-800",
  "demand-based": "bg-blue-100 text-blue-800",
  "competitor-based": "bg-green-100 text-green-800",
  "rule-based": "bg-orange-100 text-orange-800",
};

export function DynamicPricingComponent() {
  const [dynamicPrices, setDynamicPrices] = useState<PriceSettingRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isOverrideOpen, setIsOverrideOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [selectedSetting, setSelectedSetting] = useState<PriceSettingRecord | null>(null);
  const [selectedHistory, setSelectedHistory] = useState<PriceHistoryRecord[]>([]);

  const [ruleName, setRuleName] = useState("");
  const [ruleCondition, setRuleCondition] = useState("time");
  const [ruleAdjustmentType, setRuleAdjustmentType] = useState("percentage");
  const [ruleAdjustmentValue, setRuleAdjustmentValue] = useState("5");

  const [overridePrice, setOverridePrice] = useState("");
  const [overrideReason, setOverrideReason] = useState("Manual override");

  const loadDynamicPrices = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/pricing/price-settings/?strategy=dynamic&ordering=product");
      if (!response.ok) {
        setDynamicPrices([]);
        return;
      }
      const payload = await response.json();
      setDynamicPrices(extractList<PriceSettingRecord>(payload));
    } catch (error) {
      console.error("Failed to load dynamic pricing records", error);
      setDynamicPrices([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadDynamicPrices();
  }, []);

  const formatTime = (dateValue: string | null) => {
    if (!dateValue) {
      return "N/A";
    }

    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) {
      return "N/A";
    }

    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "shortOffset",
    }).format(date);
  };

  const getTimeUntilUpdate = (nextUpdateValue: string | null) => {
    if (!nextUpdateValue) {
      return "N/A";
    }

    const nextUpdate = new Date(nextUpdateValue);
    if (Number.isNaN(nextUpdate.getTime())) {
      return "N/A";
    }

    const now = new Date();
    const diff = nextUpdate.getTime() - now.getTime();
    const sign = diff < 0 ? "-" : "";
    const absDiff = Math.abs(diff);
    const hours = Math.floor(absDiff / (1000 * 60 * 60));
    const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));
    return `${sign}${hours}h ${sign}${minutes}m`;
  };

  const performance = useMemo(() => {
    const productsAboveBase = dynamicPrices.filter(
      (pricing) =>
        pricing.base_price > 0 &&
        (pricing.current_price - pricing.base_price) / pricing.base_price > 0.05,
    ).length;

    const avgPriceChange = dynamicPrices.length
      ? dynamicPrices.reduce((total, pricing) => {
          if (!pricing.base_price) {
            return total;
          }
          return total + ((pricing.current_price - pricing.base_price) / pricing.base_price) * 100;
        }, 0) / dynamicPrices.length
      : 0;

    const activeAlgorithms = new Set(dynamicPrices.map((pricing) => pricing.algorithm)).size;

    return {
      productsAboveBase,
      avgPriceChange,
      activeAlgorithms,
    };
  }, [dynamicPrices]);

  const handleConfigureRules = async () => {
    if (!ruleName.trim()) {
      return;
    }

    try {
      await fetch("/api/pricing/price-settings/configure-rules/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: ruleName.trim(),
          condition: ruleCondition,
          condition_value: { source: "dynamic-pricing-tab" },
          adjustment_type: ruleAdjustmentType,
          adjustment_value: Number(ruleAdjustmentValue) || 0,
          is_active: true,
        }),
      });
      setIsRulesOpen(false);
      setRuleName("");
    } catch (error) {
      console.error("Failed to configure pricing rule", error);
    }
  };

  const openOverride = (setting: PriceSettingRecord) => {
    setSelectedSetting(setting);
    setOverridePrice(String(setting.current_price));
    setOverrideReason("Manual override");
    setIsOverrideOpen(true);
  };

  const handleManualOverride = async () => {
    if (!selectedSetting) {
      return;
    }

    try {
      await fetch(`/api/pricing/price-settings/${selectedSetting.id}/manual-override/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          override_price: Number(overridePrice),
          reason: overrideReason,
        }),
      });
      setIsOverrideOpen(false);
      setSelectedSetting(null);
      await loadDynamicPrices();
    } catch (error) {
      console.error("Failed to apply manual override", error);
    }
  };

  const handleViewHistory = async (setting: PriceSettingRecord) => {
    try {
      const response = await fetch(`/api/pricing/price-settings/${setting.id}/history/`);
      if (!response.ok) {
        return;
      }
      const payload = (await response.json()) as { history?: PriceHistoryRecord[] };
      setSelectedSetting(setting);
      setSelectedHistory(payload.history || []);
      setIsHistoryOpen(true);
    } catch (error) {
      console.error("Failed to load pricing history", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dynamic Pricing</h2>
          <p className="text-gray-600">
            Real-time algorithmic price optimization
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsRulesOpen(true)}>
          <Settings className="w-4 h-4 mr-2" />
          Configure Rules
        </Button>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="p-6 text-sm text-gray-600">Loading dynamic pricing records...</CardContent>
        </Card>
      ) : null}

      {!isLoading && dynamicPrices.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-sm text-gray-600">
            No dynamic pricing records found in the database.
          </CardContent>
        </Card>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {dynamicPrices.map((pricing) => {
          const priceChange =
            ((pricing.current_price - pricing.base_price) / pricing.base_price) *
            100;

          return (
            <Card
              key={pricing.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{pricing.product}</CardTitle>
                  <Badge className={algorithmColors[pricing.algorithm]}>
                    {pricing.algorithm.replace("-", " ")}
                  </Badge>
                </div>
                <CardDescription className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>
                    Next update in {getTimeUntilUpdate(pricing.next_update)}
                  </span>
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-600">Base Price</div>
                    <div className="text-lg font-medium">
                      ${pricing.base_price}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Current Price</div>
                    <div className="flex items-center space-x-2">
                      <div className="text-2xl font-bold text-blue-600">
                        ${Number(pricing.current_price).toFixed(2)}
                      </div>
                      {priceChange > 0 ? (
                        <TrendingUp className="w-5 h-5 text-green-500" />
                      ) : priceChange < 0 ? (
                        <TrendingDown className="w-5 h-5 text-red-500" />
                      ) : null}
                    </div>
                    <div
                      className={`text-sm ${
                        priceChange > 0
                          ? "text-green-600"
                          : priceChange < 0
                            ? "text-red-600"
                            : "text-gray-600"
                      }`}
                    >
                      {priceChange > 0 ? "+" : ""}
                      {priceChange.toFixed(1)}%
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Pricing Factors</h4>
                  {(pricing.factors || []).map((factor, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{factor.name}</span>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">
                            {(factor.currentValue * 100).toFixed(0)}%
                          </span>
                          <span
                            className={`text-xs ${
                              factor.impact > 0
                                ? "text-green-600"
                                : factor.impact < 0
                                  ? "text-red-600"
                                  : "text-gray-600"
                            }`}
                          >
                            {factor.impact > 0 ? "+" : ""}
                            {factor.impact}%
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Progress
                          value={factor.currentValue * 100}
                          className="flex-1 h-2"
                        />
                        <span className="text-xs text-gray-500 w-8">
                          {Math.round(factor.weight * 100)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Last Updated</span>
                    <span>{formatTime(pricing.updated_at)}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => openOverride(pricing)}>
                    <Zap className="w-3 h-3 mr-1" />
                    Manual Override
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    onClick={() => void handleViewHistory(pricing)}
                  >
                    View History
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">
            Dynamic Pricing Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-900">
                {performance.productsAboveBase}
              </div>
              <div className="text-sm text-blue-700">Products Above Base</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-900">
                {performance.avgPriceChange.toFixed(1)}
                %
              </div>
              <div className="text-sm text-blue-700">Avg Price Change</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-900">24/7</div>
              <div className="text-sm text-blue-700">Monitoring</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-900">{performance.activeAlgorithms}</div>
              <div className="text-sm text-blue-700">Active Algorithms</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isRulesOpen} onOpenChange={setIsRulesOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configure Dynamic Pricing Rule</DialogTitle>
            <DialogDescription>
              Create a rule that can be consumed by dynamic pricing algorithms.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="rule-name">Rule Name</Label>
              <Input id="rule-name" value={ruleName} onChange={(event) => setRuleName(event.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="rule-condition">Condition</Label>
                <select
                  id="rule-condition"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={ruleCondition}
                  onChange={(event) => setRuleCondition(event.target.value)}
                >
                  <option value="time">time</option>
                  <option value="volume">volume</option>
                  <option value="customer">customer</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="rule-adjustment-type">Adjustment Type</Label>
                <select
                  id="rule-adjustment-type"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={ruleAdjustmentType}
                  onChange={(event) => setRuleAdjustmentType(event.target.value)}
                >
                  <option value="percentage">percentage</option>
                  <option value="fixed">fixed</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="rule-adjustment-value">Adjustment Value</Label>
              <Input
                id="rule-adjustment-value"
                type="number"
                value={ruleAdjustmentValue}
                onChange={(event) => setRuleAdjustmentValue(event.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRulesOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => void handleConfigureRules()}>Save Rule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isOverrideOpen} onOpenChange={setIsOverrideOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manual Override</DialogTitle>
            <DialogDescription>
              Override the current dynamic price for {selectedSetting?.product || "selected product"}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="override-price">Override Price</Label>
              <Input
                id="override-price"
                type="number"
                value={overridePrice}
                onChange={(event) => setOverridePrice(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="override-reason">Reason</Label>
              <Input
                id="override-reason"
                value={overrideReason}
                onChange={(event) => setOverrideReason(event.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOverrideOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => void handleManualOverride()}>Apply Override</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedSetting?.product || "Price"} History</DialogTitle>
            <DialogDescription>
              Historical dynamic pricing events from the database.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 max-h-72 overflow-auto">
            {selectedHistory.length === 0 ? (
              <div className="text-sm text-gray-600">No history records available.</div>
            ) : (
              selectedHistory.map((entry, index) => (
                <div key={`${entry.timestamp}-${index}`} className="rounded-md border p-3 text-sm">
                  <div className="font-medium">{entry.reason || entry.type || "Price change"}</div>
                  <div className="text-gray-600">{formatTime(entry.timestamp)}</div>
                  <div className="text-gray-700 mt-1">
                    {typeof entry.previous_price === "number" ? `$${entry.previous_price}` : "-"}
                    {" -> "}
                    {typeof entry.new_price === "number" ? `$${entry.new_price}` : "-"}
                    {typeof entry.change_percent === "number" ? ` (${entry.change_percent > 0 ? "+" : ""}${entry.change_percent.toFixed(1)}%)` : ""}
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
