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
} from "@/hooks/useCompetitiveDataAPI";

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
  const asArray = <T,>(value: T[] | undefined | null): T[] =>
    Array.isArray(value) ? value : [];

  const toValidNumber = (value: unknown): number | null =>
    typeof value === "number" && Number.isFinite(value) ? value : null;

  const normalizeSwotItem = (item: any) => {
    if (typeof item === "string") {
      return {
        factor: item,
        description: item,
        impact: "medium",
        confidence: 70,
      };
    }

    return {
      factor: item?.factor || item?.name || "Item",
      description: item?.description || item?.factor || item?.name || "",
      impact: item?.impact || "medium",
      confidence: toValidNumber(item?.confidence) ?? 70,
    };
  };

  const normalizeFeatures = (features: any) => {
    if (Array.isArray(features)) {
      return features;
    }

    if (features && typeof features === "object") {
      return Object.entries(features).map(([name, value]) => ({
        feature: name,
        ourProduct: "good",
        competitor: typeof value === "string" ? value : "basic",
        notes: typeof value === "string" ? value : "",
      }));
    }

    return [];
  };

  const navigate = useNavigate();
  const displayCompetitors = competitors;
  const formatCurrency = (amount: unknown, fallback = "N/A") => {
    const validAmount = toValidNumber(amount);
    if (validAmount === null) {
      return fallback;
    }

    if (validAmount >= 1000000000) {
      return `$${(validAmount / 1000000000).toFixed(1)}B`;
    }
    if (validAmount >= 1000000) {
      return `$${(validAmount / 1000000).toFixed(1)}M`;
    }
    return `$${validAmount.toLocaleString()}`;
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
          <Button className="bg-blue-600 hover:bg-blue-700" disabled>
            <Building className="w-4 h-4 mr-2" />
            Database Records
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {displayCompetitors.map((competitor) => {
            const competitorAny = competitor as any;
            const competitorType = competitorAny.type || "direct";
            const marketShare = toValidNumber(competitorAny.marketShare ?? competitorAny.market_share);
            const revenue = competitorAny.revenue;
            const employees = toValidNumber(competitorAny.employees);
            const keyProducts = asArray(competitorAny.keyProducts);
            const founded = competitorAny.founded;
            const headquarters = competitorAny.headquarters ?? "";

            return (
            <Card
              key={competitor.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{competitor.name}</CardTitle>
                  <Badge className={getTypeColor(competitorType)}>
                    {competitorType}
                  </Badge>
                </div>
                <CardDescription>{competitor.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-xs text-gray-500">Market Share</div>
                    <div className="text-lg font-bold text-blue-600">
                      {typeof marketShare === "number" ? `${marketShare}%` : "-"}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500">Revenue</div>
                    <div className="text-lg font-bold">
                      {formatCurrency(revenue)}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500">Employees</div>
                    <div className="text-lg font-bold">
                      {typeof employees === "number" ? employees.toLocaleString() : "-"}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-900">
                    Key Products
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {keyProducts.map((product, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {product}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Founded {typeof founded === "number" ? founded : "-"}</span>
                  <span>{headquarters}</span>
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
          );
          })}
        </div>
      </div>

      {/* SWOT Analysis */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">SWOT Analysis</h2>

        {swotAnalyses.map((swot) => {
          const swotAny = swot as any;
          const swotCompetitor = swotAny.competitor || swotAny.competitor_name || "Competitor";
          const overallScore = toValidNumber(swotAny.overallScore ?? swotAny.overall_score) ?? 0;
          const lastUpdated = swotAny.lastUpdated || swotAny.created_at;

          return (
          <Card key={swot.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{swotCompetitor}</CardTitle>
                <div className="flex items-center space-x-3">
                  <Badge variant="outline">
                    Overall Score: {overallScore}/100
                  </Badge>
                  <Progress value={overallScore} className="w-24 h-2" />
                </div>
              </div>
              <CardDescription>
                Last updated:{" "}
                {new Intl.DateTimeFormat("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }).format(lastUpdated ? new Date(lastUpdated) : new Date())}
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
                  {asArray(swotAny.strengths).map((item, index) => {
                    const normalized = normalizeSwotItem(item);
                    return (
                    <div key={index} className="p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-green-900">
                          {normalized.factor}
                        </span>
                        <Badge
                          className={
                            normalized.impact === "high"
                              ? "bg-green-100 text-green-800"
                              : normalized.impact === "medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                          }
                        >
                          {normalized.impact}
                        </Badge>
                      </div>
                      <p className="text-sm text-green-700">
                        {normalized.description}
                      </p>
                      <div className="mt-2">
                        <Progress value={normalized.confidence} className="h-1.5" />
                        <div className="text-xs text-green-600 mt-1">
                          {normalized.confidence}% confidence
                        </div>
                      </div>
                    </div>
                    );
                  })}
                </div>

                {/* Weaknesses */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-red-700 flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    Weaknesses
                  </h3>
                  {asArray(swotAny.weaknesses).map((item, index) => {
                    const normalized = normalizeSwotItem(item);
                    return (
                    <div key={index} className="p-3 bg-red-50 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-red-900">
                          {normalized.factor}
                        </span>
                        <Badge
                          className={
                            normalized.impact === "high"
                              ? "bg-red-100 text-red-800"
                              : normalized.impact === "medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                          }
                        >
                          {normalized.impact}
                        </Badge>
                      </div>
                      <p className="text-sm text-red-700">{normalized.description}</p>
                      <div className="mt-2">
                        <Progress value={normalized.confidence} className="h-1.5" />
                        <div className="text-xs text-red-600 mt-1">
                          {normalized.confidence}% confidence
                        </div>
                      </div>
                    </div>
                    );
                  })}
                </div>

                {/* Opportunities */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-blue-700 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Opportunities
                  </h3>
                  {asArray(swotAny.opportunities).map((item, index) => {
                    const normalized = normalizeSwotItem(item);
                    return (
                    <div key={index} className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-blue-900">
                          {normalized.factor}
                        </span>
                        <Badge
                          className={
                            normalized.impact === "high"
                              ? "bg-blue-100 text-blue-800"
                              : normalized.impact === "medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                          }
                        >
                          {normalized.impact}
                        </Badge>
                      </div>
                      <p className="text-sm text-blue-700">
                        {normalized.description}
                      </p>
                      <div className="mt-2">
                        <Progress value={normalized.confidence} className="h-1.5" />
                        <div className="text-xs text-blue-600 mt-1">
                          {normalized.confidence}% confidence
                        </div>
                      </div>
                    </div>
                    );
                  })}
                </div>

                {/* Threats */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-orange-700 flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    Threats
                  </h3>
                  {asArray(swotAny.threats).map((item, index) => {
                    const normalized = normalizeSwotItem(item);
                    return (
                    <div key={index} className="p-3 bg-orange-50 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-orange-900">
                          {normalized.factor}
                        </span>
                        <Badge
                          className={
                            normalized.impact === "high"
                              ? "bg-orange-100 text-orange-800"
                              : normalized.impact === "medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                          }
                        >
                          {normalized.impact}
                        </Badge>
                      </div>
                      <p className="text-sm text-orange-700">
                        {normalized.description}
                      </p>
                      <div className="mt-2">
                        <Progress value={normalized.confidence} className="h-1.5" />
                        <div className="text-xs text-orange-600 mt-1">
                          {normalized.confidence}% confidence
                        </div>
                      </div>
                    </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
          );
        })}
      </div>

      {/* Product & Feature Comparison */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">
          Pricing, Product & Feature Comparison
        </h2>

        {productComparisons.map((comparison) => {
          const comparisonAny = comparison as any;
          const pricing = comparisonAny.pricing || comparisonAny.pricing_comparison || {};
          const features = normalizeFeatures(comparisonAny.features);
          const strengths = asArray(comparisonAny.strengths);
          const weaknesses = asArray(comparisonAny.weaknesses);

          return (
          <Card
            key={comparison.id}
            className="hover:shadow-lg transition-shadow"
          >
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">
                    {comparisonAny.competitor || comparisonAny.product_name || "Competitor"}
                  </CardTitle>
                  <CardDescription>{comparisonAny.product || comparisonAny.product_name || "Product"}</CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Starting Price</div>
                  <div className="text-2xl font-bold text-blue-600">
                    ${toValidNumber(pricing.startingPrice ?? pricing.starting_price) ?? 0}/
                    {String(pricing.model || "user").includes("month") ? "mo" : "user"}
                  </div>
                  <Badge
                    className={getQuadrantColor(comparisonAny.marketPosition || comparisonAny.market_position || "niche")}
                  >
                    {comparisonAny.marketPosition || comparisonAny.market_position || "niche"}
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
                  {features.map((feature, index) => (
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
                    {strengths.map((strength, index) => (
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
                    {weaknesses.map((weakness, index) => (
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
          );
        })}
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
              {marketPositions.map((position) => {
                const positionAny = position as any;
                const competitorName = positionAny.competitor || positionAny.our_position || positionAny.market_segment || "Market Position";
                const quadrant = positionAny.quadrant || "niche";
                const valueScore = toValidNumber(positionAny?.position?.value) ?? 0;
                const priceScore = toValidNumber(positionAny?.position?.price) ?? 0;
                const volumeScore = toValidNumber(positionAny?.position?.volume ?? positionAny.market_share_estimate) ?? 0;
                const keyDifferentiators = asArray(positionAny.keyDifferentiators || positionAny.primary_competitors);

                return (
                <div
                  key={position.id}
                  className={`p-4 rounded-lg border-2 ${
                    competitorName === "Our Product"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{competitorName}</h3>
                    <Badge className={getQuadrantColor(quadrant)}>
                      {quadrant}
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Value:</span>
                      <span className="font-medium">
                        {valueScore}/10
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Price:</span>
                      <span className="font-medium">
                        {priceScore}/10
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Market Share:
                      </span>
                      <span className="font-medium">
                        {volumeScore}%
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-gray-600">
                    <div className="mb-1">Key Differentiators:</div>
                    <ul className="space-y-1">
                      {keyDifferentiators.map((diff, index) => (
                        <li key={index}>• {diff}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
