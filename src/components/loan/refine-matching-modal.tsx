import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertCircle,
  DollarSign,
  Clock,
  Users,
  Globe,
  Zap,
  Upload,
  RotateCcw,
} from "lucide-react";
import { type InvestorMatch, type LoanEligibility } from "@/lib/loan-data";

interface RefineMatchingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  investorMatches: InvestorMatch[];
  eligibility: LoanEligibility;
  onRefine: (filters: RefinementFilters) => void;
}

export interface RefinementFilters {
  investmentAmountMin: number;
  investmentAmountMax: number;
  equityVsDebtPreference: "equity" | "debt" | "hybrid";
  approvalSpeedPreference: "slow" | "medium" | "fast";
  mentoringInterest: boolean;
  geographicPreference: "local" | "africa" | "global";
  investorTypes: string[];
  fundingStages: string[];
  trustScoreTolerance:
    | "balanced"
    | "high-trust"
    | "high-match"
    | "high-probability";
  improvementAreas: {
    pitchDeck: boolean;
    revenueHistory: boolean;
    unitEconomics: boolean;
    businessRegistration: boolean;
  };
}

const DEFAULT_FILTERS: RefinementFilters = {
  investmentAmountMin: 100000,
  investmentAmountMax: 5000000,
  equityVsDebtPreference: "hybrid",
  approvalSpeedPreference: "medium",
  mentoringInterest: true,
  geographicPreference: "global",
  investorTypes: ["vc", "angel", "bank", "government"],
  fundingStages: ["Seed", "Series A", "Growth"],
  trustScoreTolerance: "balanced",
  improvementAreas: {
    pitchDeck: false,
    revenueHistory: false,
    unitEconomics: false,
    businessRegistration: false,
  },
};

export function RefineMatchingModal({
  open,
  onOpenChange,
  investorMatches,
  eligibility,
  onRefine,
}: RefineMatchingModalProps) {
  const [filters, setFilters] = useState<RefinementFilters>(DEFAULT_FILTERS);
  const [hasChanges, setHasChanges] = useState(false);

  const handleFilterChange = (updates: Partial<RefinementFilters>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
    setHasChanges(true);
  };

  const handleApplyFilters = () => {
    onRefine(filters);
    onOpenChange(false);
  };

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
    setHasChanges(false);
  };

  const getMatchImprovementAreas = () => {
    const areas = [];

    if (!filters.improvementAreas.pitchDeck) {
      areas.push({
        name: "Add or update pitch deck",
        impact: "Could improve match by 10-15%",
      });
    }

    if (!filters.improvementAreas.revenueHistory) {
      areas.push({
        name: "Add 12-month revenue history",
        impact: "Could improve match by 8-12%",
      });
    }

    if (!filters.improvementAreas.unitEconomics) {
      areas.push({
        name: "Add CAC or unit economics data",
        impact: "Could improve match by 5-10%",
      });
    }

    if (!filters.improvementAreas.businessRegistration) {
      areas.push({
        name: "Verify business registration",
        impact: "Could improve trust score by 10%",
      });
    }

    return areas;
  };

  const matchImprovements = getMatchImprovementAreas();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Refine Investor/Lender Matching</DialogTitle>
          <DialogDescription>
            Adjust your preferences and filters to get better-matched funding
            partners
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="preferences" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="filters">Filters</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="improve">Improve</TabsTrigger>
          </TabsList>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            {/* Investment Amount Range */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Investment Amount Range
                </CardTitle>
                <CardDescription>
                  Adjust the funding amount you're looking to raise
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-semibold">
                      Min: ₦{(filters.investmentAmountMin / 1000000).toFixed(1)}
                      M
                    </span>
                    <span className="text-sm font-semibold">
                      Max: ₦{(filters.investmentAmountMax / 1000000).toFixed(1)}
                      M
                    </span>
                  </div>
                  <Slider
                    value={[filters.investmentAmountMin]}
                    onValueChange={([value]) =>
                      handleFilterChange({
                        ...filters,
                        investmentAmountMin: Math.min(
                          value,
                          filters.investmentAmountMax,
                        ),
                      })
                    }
                    min={50000}
                    max={10000000}
                    step={100000}
                    className="mb-4"
                  />
                  <Slider
                    value={[filters.investmentAmountMax]}
                    onValueChange={([value]) =>
                      handleFilterChange({
                        ...filters,
                        investmentAmountMax: Math.max(
                          value,
                          filters.investmentAmountMin,
                        ),
                      })
                    }
                    min={50000}
                    max={10000000}
                    step={100000}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Equity vs Debt */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Equity vs Debt Preference
                </CardTitle>
                <CardDescription>
                  Choose your preferred financing structure
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  {
                    value: "equity",
                    label: "Equity",
                    description: "Give up ownership stake",
                  },
                  {
                    value: "debt",
                    label: "Debt",
                    description: "Maintain full control",
                  },
                  {
                    value: "hybrid",
                    label: "Hybrid",
                    description: "Mix of both",
                  },
                ].map((option) => (
                  <div
                    key={option.value}
                    onClick={() =>
                      handleFilterChange({
                        equityVsDebtPreference: option.value as any,
                      })
                    }
                    className={`p-3 rounded-lg border-2 cursor-pointer transition ${
                      filters.equityVsDebtPreference === option.value
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <p className="font-semibold text-gray-900">
                      {option.label}
                    </p>
                    <p className="text-sm text-gray-600">
                      {option.description}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Approval Speed */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base">
                  <Clock className="w-4 h-4 mr-2" />
                  Speed of Approval
                </CardTitle>
                <CardDescription>
                  How quickly do you need the funds?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  {
                    value: "fast",
                    label: "Fast (30-45 days)",
                    description: "I need funds urgently",
                  },
                  {
                    value: "medium",
                    label: "Medium (45-90 days)",
                    description: "Standard timeline",
                  },
                  {
                    value: "slow",
                    label: "Slow (90+ days)",
                    description: "I have time to find the best deal",
                  },
                ].map((option) => (
                  <div
                    key={option.value}
                    onClick={() =>
                      handleFilterChange({
                        approvalSpeedPreference: option.value as any,
                      })
                    }
                    className={`p-3 rounded-lg border-2 cursor-pointer transition ${
                      filters.approvalSpeedPreference === option.value
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <p className="font-semibold text-gray-900">
                      {option.label}
                    </p>
                    <p className="text-sm text-gray-600">
                      {option.description}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Mentorship Interest */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base">
                  <Users className="w-4 h-4 mr-2" />
                  Mentorship & Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  <Checkbox
                    checked={filters.mentoringInterest}
                    onCheckedChange={(checked) =>
                      handleFilterChange({
                        mentoringInterest: checked as boolean,
                      })
                    }
                  />
                  <label className="text-sm cursor-pointer flex-1">
                    <p className="font-semibold text-gray-900">
                      I'm interested in investor mentorship
                    </p>
                    <p className="text-gray-600">
                      Get business guidance beyond just funding
                    </p>
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Geographic Preference */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base">
                  <Globe className="w-4 h-4 mr-2" />
                  Geographic Preference
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  {
                    value: "local",
                    label: "Local",
                    description: "Same country",
                  },
                  {
                    value: "africa",
                    label: "Africa",
                    description: "African investors",
                  },
                  {
                    value: "global",
                    label: "Global",
                    description: "Open to international",
                  },
                ].map((option) => (
                  <div
                    key={option.value}
                    onClick={() =>
                      handleFilterChange({
                        geographicPreference: option.value as any,
                      })
                    }
                    className={`p-3 rounded-lg border-2 cursor-pointer transition ${
                      filters.geographicPreference === option.value
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <p className="font-semibold text-gray-900">
                      {option.label}
                    </p>
                    <p className="text-sm text-gray-600">
                      {option.description}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Filters Tab */}
          <TabsContent value="filters" className="space-y-6">
            {/* Investor Type */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Investor Type</CardTitle>
                <CardDescription>
                  Select the types of investors you want to see
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { value: "vc", label: "Venture Capital" },
                  { value: "angel", label: "Angel Investors" },
                  { value: "bank", label: "Banks" },
                  { value: "government", label: "Government Programs" },
                  { value: "alternative", label: "Alternative Lenders" },
                ].map((option) => (
                  <div
                    key={option.value}
                    className="flex items-center space-x-3"
                  >
                    <Checkbox
                      checked={filters.investorTypes.includes(option.value)}
                      onCheckedChange={(checked) => {
                        const newTypes = checked
                          ? [...filters.investorTypes, option.value]
                          : filters.investorTypes.filter(
                              (t) => t !== option.value,
                            );
                        handleFilterChange({ investorTypes: newTypes });
                      }}
                    />
                    <label className="text-sm cursor-pointer font-medium text-gray-900">
                      {option.label}
                    </label>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Funding Stages */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Funding Stages</CardTitle>
                <CardDescription>
                  Which stages match your business?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {["Seed", "Series A", "Series B", "Growth", "Expansion"].map(
                  (stage) => (
                    <div key={stage} className="flex items-center space-x-3">
                      <Checkbox
                        checked={filters.fundingStages.includes(stage)}
                        onCheckedChange={(checked) => {
                          const newStages = checked
                            ? [...filters.fundingStages, stage]
                            : filters.fundingStages.filter((s) => s !== stage);
                          handleFilterChange({ fundingStages: newStages });
                        }}
                      />
                      <label className="text-sm cursor-pointer font-medium text-gray-900">
                        {stage}
                      </label>
                    </div>
                  ),
                )}
              </CardContent>
            </Card>

            {/* Trust Score Tolerance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base">
                  <Zap className="w-4 h-4 mr-2" />
                  Trust Score Tolerance
                </CardTitle>
                <CardDescription>
                  How strict should we be with investor verification?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  {
                    value: "balanced",
                    label: "Balanced",
                    description: "Mix of match quality and trust",
                  },
                  {
                    value: "high-trust",
                    label: "High Trust Only",
                    description: "Only verified, trusted investors",
                  },
                  {
                    value: "high-match",
                    label: "High Match Only",
                    description: "Best profile matches regardless of trust",
                  },
                  {
                    value: "high-probability",
                    label: "High Funding Probability",
                    description:
                      "Investors likely to fund your type of business",
                  },
                ].map((option) => (
                  <div
                    key={option.value}
                    onClick={() =>
                      handleFilterChange({
                        trustScoreTolerance: option.value as any,
                      })
                    }
                    className={`p-3 rounded-lg border-2 cursor-pointer transition ${
                      filters.trustScoreTolerance === option.value
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <p className="font-semibold text-gray-900">
                      {option.label}
                    </p>
                    <p className="text-sm text-gray-600">
                      {option.description}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Business Details Tab */}
          <TabsContent value="details" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Current Business Information
                </CardTitle>
                <CardDescription>
                  These metrics help us find better matches
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Monthly Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ₦{(eligibility.monthlyRevenue / 1000000).toFixed(1)}M
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Credit Score</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {eligibility.creditScore}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Business Stage</p>
                    <p className="text-xl font-bold text-gray-900 capitalize">
                      {eligibility.businessStage}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">In Business</p>
                    <p className="text-xl font-bold text-gray-900">
                      {eligibility.timeInBusiness} months
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 p-3 bg-blue-50 rounded-lg">
                  💡 Tip: Update these metrics in your business profile to
                  improve match accuracy
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Optional Details</CardTitle>
                <CardDescription>
                  Add more information for better precision
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900">
                    Updated Monthly Revenue (Optional)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 150000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900">
                    Growth Rate (% per month)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900">
                    Recent Milestones (Optional)
                  </label>
                  <textarea
                    placeholder="e.g., Reached 1000 customers, Launched new product..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Improve Matching Tab */}
          <TabsContent value="improve" className="space-y-6">
            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="flex items-center text-base text-yellow-900">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Areas to Improve Your Matching Score
                </CardTitle>
                <CardDescription className="text-yellow-700">
                  Complete these to get better investor matches
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {matchImprovements.length > 0 ? (
                  matchImprovements.map((area, index) => (
                    <div
                      key={index}
                      className="flex items-start justify-between p-4 bg-white rounded-lg border border-yellow-200"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">
                          {area.name}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {area.impact}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" className="ml-4">
                        <Upload className="w-4 h-4 mr-1" />
                        Add
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-900 font-semibold">
                      ✓ All key areas complete!
                    </p>
                    <p className="text-sm text-green-700 mt-1">
                      Your profile is well-optimized for matching.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Improvements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  {
                    key: "pitchDeck",
                    label: "Pitch Deck",
                    description: "Professional pitch presentation",
                  },
                  {
                    key: "revenueHistory",
                    label: "12-Month Revenue History",
                    description: "Show consistent revenue trends",
                  },
                  {
                    key: "unitEconomics",
                    label: "CAC & Unit Economics",
                    description: "Customer acquisition cost and metrics",
                  },
                  {
                    key: "businessRegistration",
                    label: "Business Registration",
                    description: "Verified business documents",
                  },
                ].map((item) => (
                  <div key={item.key} className="flex items-center space-x-3">
                    <Checkbox
                      checked={
                        filters.improvementAreas[
                          item.key as keyof typeof filters.improvementAreas
                        ]
                      }
                      onCheckedChange={(checked) =>
                        handleFilterChange({
                          improvementAreas: {
                            ...filters.improvementAreas,
                            [item.key]: checked,
                          },
                        })
                      }
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">
                        {item.label}
                      </p>
                      <p className="text-xs text-gray-600">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-6 border-t">
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={!hasChanges}
            className="flex-1"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button
            onClick={() => onOpenChange(false)}
            variant="outline"
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleApplyFilters}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            Apply & Refresh Matches
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
