import { useState, useEffect } from "react";
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
  DialogTrigger,
} from "@/components/ui/dialog";
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
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  BarChart3,
  Loader2,
} from "lucide-react";

// Type definition
interface PricingStrategyRecord {
  id: number;
  name: string;
  strategy_type: string;
  description: string;
  current_price: string;
  suggested_price: string;
  confidence: number;
  expected_revenue: string;
  market_share: string;
  margin: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const strategyTypeColors: Record<string, string> = {
  "value-based": "bg-blue-100 text-blue-800",
  competitive: "bg-green-100 text-green-800",
  dynamic: "bg-purple-100 text-purple-800",
  tiered: "bg-orange-100 text-orange-800",
  penetration: "bg-red-100 text-red-800",
  skimming: "bg-indigo-100 text-indigo-800",
  discrimination: "bg-yellow-100 text-yellow-800",
  "cost-plus": "bg-cyan-100 text-cyan-800",
};

const STRATEGY_TYPES = [
  { value: "value-based", label: "Value Based" },
  { value: "tiered", label: "Tiered" },
  { value: "dynamic", label: "Dynamic" },
  { value: "cost-plus", label: "Cost Plus" },
  { value: "penetration", label: "Penetration" },
  { value: "discrimination", label: "Price Discrimination" },
];

export function PricingStrategies() {
  const [strategies, setStrategies] = useState<PricingStrategyRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [analyzingId, setAnalyzingId] = useState<number | null>(null);
  const [applyingId, setApplyingId] = useState<number | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    strategy_type: "value-based",
    description: "",
    current_price: "",
    suggested_price: "",
    confidence: 50,
  });

  // Fetch strategies from API
  const loadStrategies = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/pricing/pricing-strategies/?ordering=-updated_at");
      if (response.ok) {
        const payload = await response.json();
        const data = Array.isArray(payload) ? payload : payload.results || [];
        setStrategies(data);
      }
    } catch (error) {
      console.error("Failed to load pricing strategies", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadStrategies();
  }, []);

  // Handle create strategy
  const handleCreateStrategy = async () => {
    try {
      const response = await fetch("/api/pricing/pricing-strategies/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          strategy_type: formData.strategy_type,
          description: formData.description.trim(),
          current_price: parseFloat(formData.current_price) || 0,
          suggested_price: parseFloat(formData.suggested_price) || 0,
          confidence: formData.confidence,
          expected_revenue: 0,
          market_share: 0,
          margin: 0,
          is_active: true,
        }),
      });

      if (response.ok) {
        await loadStrategies();
        setFormData({
          name: "",
          strategy_type: "value-based",
          description: "",
          current_price: "",
          suggested_price: "",
          confidence: 50,
        });
        setIsCreateOpen(false);
      }
    } catch (error) {
      console.error("Failed to create strategy", error);
    }
  };

  // Handle analyze
  const handleAnalyze = async (id: number) => {
    setAnalyzingId(id);
    try {
      // Simulate analysis
      await new Promise((resolve) => setTimeout(resolve, 1500));
      alert("Analysis complete! Review the metrics and confidence scores above.");
    } finally {
      setAnalyzingId(null);
    }
  };

  // Handle apply price
  const handleApplyPrice = async (id: number, strategy: PricingStrategyRecord) => {
    setApplyingId(id);
    try {
      const response = await fetch(`/api/pricing/pricing-strategies/${id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          current_price: strategy.suggested_price,
        }),
      });

      if (response.ok) {
        await loadStrategies();
        alert(`Price applied! New current price: $${strategy.suggested_price}`);
      }
    } catch (error) {
      console.error("Failed to apply price", error);
    } finally {
      setApplyingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Pricing Strategies
          </h2>
          <p className="text-gray-600">
            Optimize pricing across your product portfolio
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Target className="w-4 h-4 mr-2" />
              Create Strategy
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Pricing Strategy</DialogTitle>
              <DialogDescription>
                Define a new pricing strategy for your products
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Strategy Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Premium Tier Pricing"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="type">Strategy Type</Label>
                <Select
                  value={formData.strategy_type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, strategy_type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STRATEGY_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Describe the strategy..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="current_price">Current Price ($)</Label>
                  <Input
                    id="current_price"
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                    value={formData.current_price}
                    onChange={(e) =>
                      setFormData({ ...formData, current_price: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="suggested_price">Suggested Price ($)</Label>
                  <Input
                    id="suggested_price"
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                    value={formData.suggested_price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        suggested_price: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="confidence">Confidence (%)</Label>
                <Input
                  id="confidence"
                  type="range"
                  min="0"
                  max="100"
                  value={formData.confidence}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confidence: parseInt(e.target.value),
                    })
                  }
                />
                <div className="text-sm text-gray-600 mt-1">
                  {formData.confidence}%
                </div>
              </div>
              <Button
                onClick={handleCreateStrategy}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Create Strategy
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {strategies.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">No pricing strategies yet. Create one to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {strategies.map((strategy) => (
            <Card
              key={strategy.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{strategy.name}</CardTitle>
                  <Badge
                    className={
                      strategyTypeColors[strategy.strategy_type] ||
                      "bg-gray-100 text-gray-800"
                    }
                  >
                    {strategy.strategy_type.replace("-", " ")}
                  </Badge>
                </div>
                <CardDescription className="text-sm">
                  {strategy.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-600">Current Price</span>
                  </div>
                  <span className="text-xl font-bold">
                    ${Number(strategy.current_price).toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-600">Suggested Price</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-blue-600">
                      ${Number(strategy.suggested_price).toFixed(2)}
                    </span>
                    {Number(strategy.suggested_price) > Number(strategy.current_price) ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Confidence</span>
                    <span className="font-medium">{strategy.confidence}%</span>
                  </div>
                  <Progress value={strategy.confidence} className="h-2" />
                </div>

                <div className="grid grid-cols-3 gap-4 pt-3 border-t">
                  <div className="text-center">
                    <div className="text-xs text-gray-500">Expected Revenue</div>
                    <div className="font-semibold">
                      ${Number(strategy.expected_revenue).toFixed(1)}M
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500">Market Share</div>
                    <div className="font-semibold">
                      {Number(strategy.market_share).toFixed(1)}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500">Margin</div>
                    <div className="font-semibold">
                      {Number(strategy.margin).toFixed(1)}%
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleAnalyze(strategy.id)}
                    disabled={analyzingId === strategy.id}
                  >
                    {analyzingId === strategy.id ? (
                      <>
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <BarChart3 className="w-3 h-3 mr-1" />
                        Analyze
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleApplyPrice(strategy.id, strategy)}
                    disabled={applyingId === strategy.id}
                  >
                    {applyingId === strategy.id ? (
                      <>
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                        Applying...
                      </>
                    ) : (
                      "Apply Price"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
