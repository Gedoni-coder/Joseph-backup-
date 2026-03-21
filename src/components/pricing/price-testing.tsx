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
import { Play, Pause, Trophy, Plus, BarChart3 } from "lucide-react";

type TestStatus = "pending" | "running" | "completed" | "paused";
type TestType = "a-b" | "multivariate" | "split" | "sequential";

type PricingVariant = {
  id: string;
  name: string;
  price: number;
  conversions: number;
  revenue: number;
  conversionRate: number;
};

type PricingTestRecord = {
  id: number;
  name: string;
  test_type: TestType;
  status: TestStatus;
  confidence: number;
  start_date: string | null;
  end_date: string | null;
  sample_size: number;
  variant_count: number;
  results: {
    variants?: PricingVariant[];
  };
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

const statusColors: Record<TestStatus, string> = {
  pending: "bg-gray-100 text-gray-800",
  running: "bg-green-100 text-green-800",
  completed: "bg-blue-100 text-blue-800",
  paused: "bg-yellow-100 text-yellow-800",
};

const testTypeColors: Record<TestType, string> = {
  "a-b": "bg-purple-100 text-purple-800",
  multivariate: "bg-orange-100 text-orange-800",
  split: "bg-indigo-100 text-indigo-800",
  sequential: "bg-teal-100 text-teal-800",
};

const getTestTypeLabel = (testType: TestType): string => {
  if (testType === "a-b") {
    return "A/B";
  }
  if (testType === "multivariate") {
    return "multivariate";
  }
  if (testType === "split") {
    return "split";
  }
  return "sequential";
};

export function PriceTesting() {
  const [tests, setTests] = useState<PricingTestRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewTestOpen, setIsNewTestOpen] = useState(false);
  const [isResultsOpen, setIsResultsOpen] = useState(false);
  const [selectedResult, setSelectedResult] = useState<PricingTestRecord | null>(null);

  const [testName, setTestName] = useState("");
  const [testType, setTestType] = useState<TestType>("a-b");
  const [testStatus, setTestStatus] = useState<TestStatus>("running");
  const [confidence, setConfidence] = useState("73");
  const [startDate, setStartDate] = useState("2024-12-01");
  const [endDate, setEndDate] = useState("2024-12-31");
  const [variantAName, setVariantAName] = useState("Current Price");
  const [variantAPrice, setVariantAPrice] = useState("299");
  const [variantAConversions, setVariantAConversions] = useState("847");
  const [variantARevenue, setVariantARevenue] = useState("253153");
  const [variantAConvRate, setVariantAConvRate] = useState("6.8");
  const [variantBName, setVariantBName] = useState("Increased Price");
  const [variantBPrice, setVariantBPrice] = useState("349");
  const [variantBConversions, setVariantBConversions] = useState("721");
  const [variantBRevenue, setVariantBRevenue] = useState("251629");
  const [variantBConvRate, setVariantBConvRate] = useState("5.8");

  const formatDate = (dateValue: string | null) => {
    if (!dateValue) {
      return "Ongoing";
    }

    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) {
      return "Ongoing";
    }

    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const loadTests = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/pricing/pricing-tests/?ordering=-created_at");
      if (!response.ok) {
        setTests([]);
        return;
      }
      const payload = await response.json();
      setTests(extractList<PricingTestRecord>(payload));
    } catch (error) {
      console.error("Failed to load pricing tests", error);
      setTests([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadTests();
  }, []);

  const buildVariants = useMemo<PricingVariant[]>(() => {
    return [
      {
        id: "variant-a",
        name: variantAName.trim() || "Variant A",
        price: Number(variantAPrice),
        conversions: Number(variantAConversions),
        revenue: Number(variantARevenue),
        conversionRate: Number(variantAConvRate),
      },
      {
        id: "variant-b",
        name: variantBName.trim() || "Variant B",
        price: Number(variantBPrice),
        conversions: Number(variantBConversions),
        revenue: Number(variantBRevenue),
        conversionRate: Number(variantBConvRate),
      },
    ];
  }, [
    variantAName,
    variantAPrice,
    variantAConversions,
    variantARevenue,
    variantAConvRate,
    variantBName,
    variantBPrice,
    variantBConversions,
    variantBRevenue,
    variantBConvRate,
  ]);

  const getWinningVariant = (test: PricingTestRecord) => {
    const variants = test.results?.variants || [];
    if (!variants.length) {
      return null;
    }

    return variants.reduce((best, current) =>
      Number(current.revenue) > Number(best.revenue) ? current : best,
    );
  };

  const handleNewTest = async () => {
    if (!testName.trim()) {
      return;
    }

    const payload = {
      name: testName.trim(),
      test_type: testType,
      status: testStatus,
      confidence: Number(confidence) || 0,
      start_date: startDate ? new Date(`${startDate}T00:00:00`).toISOString() : null,
      end_date: endDate ? new Date(`${endDate}T23:59:59`).toISOString() : null,
      sample_size: buildVariants.reduce((total, variant) => total + Number(variant.conversions || 0), 0),
      variant_count: buildVariants.length,
      results: {
        variants: buildVariants,
      },
    };

    try {
      const response = await fetch("/api/pricing/pricing-tests/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setIsNewTestOpen(false);
        setTestName("");
        await loadTests();
      }
    } catch (error) {
      console.error("Failed to create pricing test", error);
    }
  };

  const handlePauseResume = async (test: PricingTestRecord) => {
    const action = test.status === "running" ? "pause" : "resume";
    try {
      await fetch(`/api/pricing/pricing-tests/${test.id}/${action}/`, {
        method: "POST",
      });
      await loadTests();
    } catch (error) {
      console.error(`Failed to ${action} test`, error);
    }
  };

  const handleViewResults = async (testId: number) => {
    try {
      const response = await fetch(`/api/pricing/pricing-tests/${testId}/results/`);
      if (!response.ok) {
        return;
      }
      const payload = (await response.json()) as PricingTestRecord;
      setSelectedResult(payload);
      setIsResultsOpen(true);
    } catch (error) {
      console.error("Failed to view pricing test results", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Price Testing & Optimization
          </h2>
          <p className="text-gray-600">
            A/B test different pricing strategies to maximize revenue
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsNewTestOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Test
        </Button>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="p-6 text-sm text-gray-600">Loading pricing tests...</CardContent>
        </Card>
      ) : null}

      {!isLoading && tests.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-sm text-gray-600">
            No pricing tests found in the database. Use <span className="font-medium">New Test</span> to create one.
          </CardContent>
        </Card>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {tests.map((test) => {
          const winningVariant = getWinningVariant(test);
          const variants = test.results?.variants || [];

          return (
            <Card key={test.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{test.name}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge className={testTypeColors[test.test_type]}>
                      {getTestTypeLabel(test.test_type)}
                    </Badge>
                    <Badge className={statusColors[test.status as TestStatus]}>
                      {test.status}
                    </Badge>
                  </div>
                </div>
                <CardDescription>
                  {formatDate(test.start_date)} - {formatDate(test.end_date)}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      Statistical Confidence
                    </span>
                    <span className="font-medium">{test.confidence}%</span>
                  </div>
                  <Progress value={test.confidence} className="h-2" />
                </div>

                <div className="space-y-3">
                  {variants.map((variant) => (
                    <div
                      key={variant.id}
                      className={`p-3 rounded-lg border ${
                        variant.id === winningVariant?.id
                          ? "bg-green-50 border-green-200"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{variant.name}</span>
                          {variant.id === winningVariant?.id && (
                            <Trophy className="w-4 h-4 text-green-600" />
                          )}
                        </div>
                        <div className="text-lg font-bold">
                          ${Number(variant.price).toLocaleString()}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <div className="text-gray-500">Conversions</div>
                          <div className="font-medium">
                            {variant.conversions.toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500">Revenue</div>
                          <div className="font-medium">
                            ${variant.revenue.toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500">Conv. Rate</div>
                          <div className="font-medium">
                            {Number(variant.conversionRate).toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex space-x-2 pt-2">
                  {test.status === "running" ? (
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => void handlePauseResume(test)}>
                      <Pause className="w-3 h-3 mr-1" />
                      Pause
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => void handlePauseResume(test)}>
                      <Play className="w-3 h-3 mr-1" />
                      Resume
                    </Button>
                  )}
                  <Button
                    size="sm"
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    onClick={() => void handleViewResults(test.id)}
                  >
                    <BarChart3 className="w-3 h-3 mr-1" />
                    View Results
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Testing Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">
                Best Practices
              </h4>
              <ul className="space-y-1 text-blue-700">
                <li>• Run tests for at least 2 weeks</li>
                <li>• Ensure sufficient sample size</li>
                <li>• Test one variable at a time</li>
                <li>• Monitor external factors</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">
                Success Metrics
              </h4>
              <ul className="space-y-1 text-blue-700">
                <li>• Statistical significance &gt; 95%</li>
                <li>• Practical significance &gt; 5%</li>
                <li>• Consistent results over time</li>
                <li>• Positive long-term impact</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isNewTestOpen} onOpenChange={setIsNewTestOpen}>
        <DialogContent className="max-h-[85vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>New Pricing Test</DialogTitle>
            <DialogDescription>
              Create a price test with two variants. Data is saved directly to the database.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="test-name">Test Name</Label>
              <Input id="test-name" value={testName} onChange={(event) => setTestName(event.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="test-type">Test Type</Label>
                <select
                  id="test-type"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={testType}
                  onChange={(event) => setTestType(event.target.value as TestType)}
                >
                  <option value="a-b">A/B</option>
                  <option value="multivariate">multivariate</option>
                  <option value="split">split</option>
                  <option value="sequential">sequential</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="test-status">Status</Label>
                <select
                  id="test-status"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={testStatus}
                  onChange={(event) => setTestStatus(event.target.value as TestStatus)}
                >
                  <option value="running">running</option>
                  <option value="paused">paused</option>
                  <option value="completed">completed</option>
                  <option value="pending">pending</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label htmlFor="test-confidence">Confidence %</Label>
                <Input id="test-confidence" type="number" value={confidence} onChange={(event) => setConfidence(event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="test-start">Start Date</Label>
                <Input id="test-start" type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="test-end">End Date</Label>
                <Input id="test-end" type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2 rounded-md border p-3">
                <Label>Variant A</Label>
                <Input placeholder="Name" value={variantAName} onChange={(event) => setVariantAName(event.target.value)} />
                <Input placeholder="Price" type="number" value={variantAPrice} onChange={(event) => setVariantAPrice(event.target.value)} />
                <Input placeholder="Conversions" type="number" value={variantAConversions} onChange={(event) => setVariantAConversions(event.target.value)} />
                <Input placeholder="Revenue" type="number" value={variantARevenue} onChange={(event) => setVariantARevenue(event.target.value)} />
                <Input placeholder="Conversion Rate %" type="number" value={variantAConvRate} onChange={(event) => setVariantAConvRate(event.target.value)} />
              </div>
              <div className="space-y-2 rounded-md border p-3">
                <Label>Variant B</Label>
                <Input placeholder="Name" value={variantBName} onChange={(event) => setVariantBName(event.target.value)} />
                <Input placeholder="Price" type="number" value={variantBPrice} onChange={(event) => setVariantBPrice(event.target.value)} />
                <Input placeholder="Conversions" type="number" value={variantBConversions} onChange={(event) => setVariantBConversions(event.target.value)} />
                <Input placeholder="Revenue" type="number" value={variantBRevenue} onChange={(event) => setVariantBRevenue(event.target.value)} />
                <Input placeholder="Conversion Rate %" type="number" value={variantBConvRate} onChange={(event) => setVariantBConvRate(event.target.value)} />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewTestOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => void handleNewTest()}>Create Test</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isResultsOpen} onOpenChange={setIsResultsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedResult?.name || "Test Results"}</DialogTitle>
            <DialogDescription>
              Statistical Confidence: {selectedResult?.confidence ?? 0}%
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            {(selectedResult?.results?.variants || []).map((variant) => (
              <div key={variant.id} className="rounded-md border p-3">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{variant.name}</div>
                  <div className="font-semibold">${Number(variant.price).toLocaleString()}</div>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-2 text-xs text-gray-600">
                  <div>Conversions: {Number(variant.conversions).toLocaleString()}</div>
                  <div>Revenue: ${Number(variant.revenue).toLocaleString()}</div>
                  <div>Conv. Rate: {Number(variant.conversionRate).toFixed(1)}%</div>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
