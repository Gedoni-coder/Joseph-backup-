import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Building,
  Users,
  DollarSign,
  Globe,
  TrendingUp,
  Eye,
  Star,
  AlertTriangle,
} from "lucide-react";
import {
  type Competitor,
  type SWOTAnalysis,
  type ProductComparison,
  type MarketPosition,
} from "@/lib/competitive-data";

interface CompetitiveAnalysisProps {
  competitors: Competitor[];
  swotAnalyses: SWOTAnalysis[];
  productComparisons: ProductComparison[];
  marketPositions: MarketPosition[];
}

export function CompetitiveAnalysis({
  competitors,
  swotAnalyses,
  productComparisons,
  marketPositions,
}: CompetitiveAnalysisProps) {
  const navigate = useNavigate();
  const [showAddForm, setShowAddForm] = useState(false);
  const [adding, setAdding] = useState(false);
  const [localCompetitors, setLocalCompetitors] = useState<Competitor[]>([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    website: "",
    type: "direct" as Competitor["type"],
  });

  const displayCompetitors = [...competitors, ...localCompetitors];

  const handleAdd = () => {
    if (!form.name.trim()) return;
    setAdding(true);
    setTimeout(() => {
      const newComp: Competitor = {
        id: Date.now().toString(),
        name: form.name.trim(),
        description: form.description.trim() || "Added via assistant",
        type: form.type,
        marketShare: 0,
        revenue: 0,
        employees: 0,
        keyProducts: [],
        founded: new Date().getFullYear().toString(),
        headquarters: "",
      };
      setLocalCompetitors((prev) => [newComp, ...prev]);
      setAdding(false);
      setShowAddForm(false);
      setForm({ name: "", description: "", website: "", type: "direct" });
    }, 800);
  };
  const formatCurrency = (amount: number) => {
    if (amount >= 1000000000) {
      return `$${(amount / 1000000000).toFixed(1)}B`;
    }
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    return `$${amount.toLocaleString()}`;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "direct":
        return "bg-red-100 text-red-800";
      case "indirect":
        return "bg-yellow-100 text-yellow-800";
      case "substitute":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getQuadrantColor = (quadrant: string) => {
    switch (quadrant) {
      case "leader":
        return "bg-green-100 text-green-800";
      case "challenger":
        return "bg-blue-100 text-blue-800";
      case "niche":
        return "bg-purple-100 text-purple-800";
      case "follower":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getFeatureColor = (level: string) => {
    switch (level) {
      case "excellent":
        return "text-green-600";
      case "good":
        return "text-blue-600";
      case "basic":
        return "text-yellow-600";
      case "missing":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getFeatureScore = (level: string) => {
    switch (level) {
      case "excellent":
        return 100;
      case "good":
        return 75;
      case "basic":
        return 50;
      case "missing":
        return 0;
      default:
        return 0;
    }
  };

  return (
    <div className="space-y-8">
      {/* Key Competitor Identification */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            Key Competitor Identification
          </h2>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowAddForm((s) => !s)}>
            <Building className="w-4 h-4 mr-2" />
            {showAddForm ? "Close" : "Add Competitor"}
          </Button>
        </div>

        {showAddForm && (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <Input
                  placeholder="Competitor Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <Input
                  placeholder="Website (optional)"
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                />
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value as Competitor["type"] })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="direct">Direct</option>
                  <option value="indirect">Indirect</option>
                  <option value="substitute">Substitute</option>
                </select>
                <Button onClick={handleAdd} disabled={adding || !form.name} className="bg-blue-600 hover:bg-blue-700">
                  {adding ? "Adding..." : "Go"}
                </Button>
              </div>
              <div className="mt-3">
                <Textarea
                  placeholder="Short description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="min-h-[70px]"
                />
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {displayCompetitors.map((competitor) => (
            <Card
              key={competitor.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{competitor.name}</CardTitle>
                  <Badge className={getTypeColor(competitor.type)}>
                    {competitor.type}
                  </Badge>
                </div>
                <CardDescription>{competitor.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-xs text-gray-500">Market Share</div>
                    <div className="text-lg font-bold text-blue-600">
                      {competitor.marketShare}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500">Revenue</div>
                    <div className="text-lg font-bold">
                      {formatCurrency(competitor.revenue)}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500">Employees</div>
                    <div className="text-lg font-bold">
                      {competitor.employees.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-900">
                    Key Products
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {competitor.keyProducts.map((product, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {product}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Founded {competitor.founded}</span>
                  <span>{competitor.headquarters}</span>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => navigate(`/market-competitive-analysis/profile/${competitor.id}`)}>
                    <Eye className="w-3 h-3 mr-1" />
                    View Profile
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    onClick={() => navigate(`/market-competitive-analysis/swot?company=${encodeURIComponent(competitor.name)}`)}
                  >
                    SWOT Analysis
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* SWOT Analysis */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">SWOT Analysis</h2>

        {swotAnalyses.map((swot) => (
          <Card key={swot.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{swot.competitor}</CardTitle>
                <div className="flex items-center space-x-3">
                  <Badge variant="outline">
                    Overall Score: {swot.overallScore}/100
                  </Badge>
                  <Progress value={swot.overallScore} className="w-24 h-2" />
                </div>
              </div>
              <CardDescription>
                Last updated:{" "}
                {new Intl.DateTimeFormat("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }).format(swot.lastUpdated)}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Strengths */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-green-700 flex items-center">
                    <Star className="w-5 h-5 mr-2" />
                    Strengths
                  </h3>
                  {swot.strengths.map((item, index) => (
                    <div key={index} className="p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-green-900">
                          {item.factor}
                        </span>
                        <Badge
                          className={
                            item.impact === "high"
                              ? "bg-green-100 text-green-800"
                              : item.impact === "medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                          }
                        >
                          {item.impact}
                        </Badge>
                      </div>
                      <p className="text-sm text-green-700">
                        {item.description}
                      </p>
                      <div className="mt-2">
                        <Progress value={item.confidence} className="h-1.5" />
                        <div className="text-xs text-green-600 mt-1">
                          {item.confidence}% confidence
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Weaknesses */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-red-700 flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    Weaknesses
                  </h3>
                  {swot.weaknesses.map((item, index) => (
                    <div key={index} className="p-3 bg-red-50 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-red-900">
                          {item.factor}
                        </span>
                        <Badge
                          className={
                            item.impact === "high"
                              ? "bg-red-100 text-red-800"
                              : item.impact === "medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                          }
                        >
                          {item.impact}
                        </Badge>
                      </div>
                      <p className="text-sm text-red-700">{item.description}</p>
                      <div className="mt-2">
                        <Progress value={item.confidence} className="h-1.5" />
                        <div className="text-xs text-red-600 mt-1">
                          {item.confidence}% confidence
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Opportunities */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-blue-700 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Opportunities
                  </h3>
                  {swot.opportunities.map((item, index) => (
                    <div key={index} className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-blue-900">
                          {item.factor}
                        </span>
                        <Badge
                          className={
                            item.impact === "high"
                              ? "bg-blue-100 text-blue-800"
                              : item.impact === "medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                          }
                        >
                          {item.impact}
                        </Badge>
                      </div>
                      <p className="text-sm text-blue-700">
                        {item.description}
                      </p>
                      <div className="mt-2">
                        <Progress value={item.confidence} className="h-1.5" />
                        <div className="text-xs text-blue-600 mt-1">
                          {item.confidence}% confidence
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Threats */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-orange-700 flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    Threats
                  </h3>
                  {swot.threats.map((item, index) => (
                    <div key={index} className="p-3 bg-orange-50 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-orange-900">
                          {item.factor}
                        </span>
                        <Badge
                          className={
                            item.impact === "high"
                              ? "bg-orange-100 text-orange-800"
                              : item.impact === "medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                          }
                        >
                          {item.impact}
                        </Badge>
                      </div>
                      <p className="text-sm text-orange-700">
                        {item.description}
                      </p>
                      <div className="mt-2">
                        <Progress value={item.confidence} className="h-1.5" />
                        <div className="text-xs text-orange-600 mt-1">
                          {item.confidence}% confidence
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Product & Feature Comparison */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">
          Pricing, Product & Feature Comparison
        </h2>

        {productComparisons.map((comparison) => (
          <Card
            key={comparison.id}
            className="hover:shadow-lg transition-shadow"
          >
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">
                    {comparison.competitor}
                  </CardTitle>
                  <CardDescription>{comparison.product}</CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Starting Price</div>
                  <div className="text-2xl font-bold text-blue-600">
                    ${comparison.pricing.startingPrice}/
                    {comparison.pricing.model.includes("month") ? "mo" : "user"}
                  </div>
                  <Badge
                    className={getQuadrantColor(comparison.marketPosition)}
                  >
                    {comparison.marketPosition}
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Feature Comparison */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Feature Comparison
                </h3>
                <div className="space-y-3">
                  {comparison.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="font-medium">{feature.feature}</div>
                        {feature.notes && (
                          <div className="text-sm text-gray-600">
                            {feature.notes}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className="text-xs text-gray-500">Us</div>
                          <div
                            className={`font-medium ${getFeatureColor(feature.ourProduct)}`}
                          >
                            {feature.ourProduct}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-500">Them</div>
                          <div
                            className={`font-medium ${getFeatureColor(feature.competitor)}`}
                          >
                            {feature.competitor}
                          </div>
                        </div>
                        <div className="w-24">
                          <Progress
                            value={
                              getFeatureScore(feature.ourProduct) -
                              getFeatureScore(feature.competitor) +
                              50
                            }
                            className="h-2"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strengths & Weaknesses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-green-700 mb-2">
                    Their Strengths
                  </h4>
                  <ul className="space-y-1">
                    {comparison.strengths.map((strength, index) => (
                      <li
                        key={index}
                        className="text-sm text-gray-700 flex items-start"
                      >
                        <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-red-700 mb-2">
                    Their Weaknesses
                  </h4>
                  <ul className="space-y-1">
                    {comparison.weaknesses.map((weakness, index) => (
                      <li
                        key={index}
                        className="text-sm text-gray-700 flex items-start"
                      >
                        <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {weakness}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Market Share & Positioning Map */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">
          Market Share & Positioning Map
        </h2>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Competitive Positioning Matrix</CardTitle>
            <CardDescription>
              Value vs Price positioning with market share volume
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {marketPositions.map((position) => (
                <div
                  key={position.id}
                  className={`p-4 rounded-lg border-2 ${
                    position.competitor === "Our Product"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{position.competitor}</h3>
                    <Badge className={getQuadrantColor(position.quadrant)}>
                      {position.quadrant}
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Value:</span>
                      <span className="font-medium">
                        {position.position.value}/10
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Price:</span>
                      <span className="font-medium">
                        {position.position.price}/10
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Market Share:
                      </span>
                      <span className="font-medium">
                        {position.position.volume}%
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-gray-600">
                    <div className="mb-1">Key Differentiators:</div>
                    <ul className="space-y-1">
                      {position.keyDifferentiators.map((diff, index) => (
                        <li key={index}>• {diff}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
