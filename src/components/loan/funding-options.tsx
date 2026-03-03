import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Clock,
  DollarSign,
  Shield,
  AlertTriangle,
  ExternalLink,
  Filter,
  Search,
} from "lucide-react";
import { useState } from "react";
import { type FundingOption } from "@/lib/loan-data";

interface FundingOptionsProps {
  fundingOptions: FundingOption[];
  onStartApplication?: (option: FundingOption) => void;
}

export function FundingOptionsExplorer({
  fundingOptions,
  onStartApplication,
}: FundingOptionsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [amountFilter, setAmountFilter] = useState<string>("all");

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount.toLocaleString()}`;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "bank-loan":
        return "bg-blue-100 text-blue-800";
      case "government-grant":
        return "bg-green-100 text-green-800";
      case "microfinance":
        return "bg-purple-100 text-purple-800";
      case "angel-capital":
        return "bg-orange-100 text-orange-800";
      case "venture-capital":
        return "bg-red-100 text-red-800";
      case "crowdfunding":
        return "bg-yellow-100 text-yellow-800";
      case "cooperative":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "bank-loan":
        return "Bank Loan";
      case "government-grant":
        return "Government Grant";
      case "microfinance":
        return "Microfinance";
      case "angel-capital":
        return "Angel Capital";
      case "venture-capital":
        return "Venture Capital";
      case "crowdfunding":
        return "Crowdfunding";
      case "cooperative":
        return "Cooperative";
      default:
        return type;
    }
  };

  const filteredOptions = fundingOptions.filter((option) => {
    const matchesSearch =
      option.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      option.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
      option.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === "all" || option.type === typeFilter;

    const matchesAmount = (() => {
      switch (amountFilter) {
        case "small":
          return option.maxAmount <= 100000;
        case "medium":
          return option.maxAmount > 100000 && option.maxAmount <= 1000000;
        case "large":
          return option.maxAmount > 1000000;
        default:
          return true;
      }
    })();

    return matchesSearch && matchesType && matchesAmount;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Funding Options Explorer
          </h2>
          <p className="text-gray-600">
            Discover funding sources tailored to your business needs
          </p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          {filteredOptions.length} Options Available
        </Badge>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2 text-blue-600" />
            Filter Options
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Search
              </label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Search funding options..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Type</label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="bank-loan">Bank Loans</SelectItem>
                  <SelectItem value="government-grant">
                    Government Grants
                  </SelectItem>
                  <SelectItem value="microfinance">Microfinance</SelectItem>
                  <SelectItem value="angel-capital">Angel Capital</SelectItem>
                  <SelectItem value="venture-capital">
                    Venture Capital
                  </SelectItem>
                  <SelectItem value="crowdfunding">Crowdfunding</SelectItem>
                  <SelectItem value="cooperative">Cooperative</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Amount Range
              </label>
              <Select value={amountFilter} onValueChange={setAmountFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Amounts</SelectItem>
                  <SelectItem value="small">Up to $100K</SelectItem>
                  <SelectItem value="medium">$100K - $1M</SelectItem>
                  <SelectItem value="large">$1M+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Funding Options Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredOptions.map((option) => (
          <Card key={option.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{option.name}</CardTitle>
                  <CardDescription className="text-base">
                    {option.provider}
                  </CardDescription>
                </div>
                <Badge className={getTypeColor(option.type)}>
                  {getTypeLabel(option.type)}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-sm text-gray-700">{option.description}</p>

              {/* Key Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-500">Amount Range</div>
                  <div className="font-semibold">
                    {formatCurrency(option.minAmount)} -{" "}
                    {formatCurrency(option.maxAmount)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Interest Rate</div>
                  <div className="font-semibold">
                    {option.interestRate === 0
                      ? "Equity Investment"
                      : `${option.interestRate.toFixed(2)}%`}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Term</div>
                  <div className="font-semibold">
                    {option.termMonths === 0
                      ? "N/A"
                      : `${option.termMonths} months`}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Processing Time</div>
                  <div className="font-semibold">
                    {option.processingTime} days
                  </div>
                </div>
              </div>

              {/* Requirements */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    Requirements
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {option.eligibilityCriteria
                    .slice(0, 2)
                    .map((criteria, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {criteria}
                      </Badge>
                    ))}
                  {option.eligibilityCriteria.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{option.eligibilityCriteria.length - 2} more
                    </Badge>
                  )}
                </div>
              </div>

              {/* Conditions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        option.collateralRequired
                          ? "bg-red-500"
                          : "bg-green-500"
                      }`}
                    ></div>
                    <span className="text-xs text-gray-600">
                      {option.collateralRequired
                        ? "Collateral"
                        : "No Collateral"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        option.personalGuarantee ? "bg-red-500" : "bg-green-500"
                      }`}
                    ></div>
                    <span className="text-xs text-gray-600">
                      {option.personalGuarantee
                        ? "Personal Guarantee"
                        : "No Personal Guarantee"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {option.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Application Deadline */}
              {option.applicationDeadline && (
                <div className="flex items-center space-x-2 p-2 bg-yellow-50 rounded-lg border border-yellow-200">
                  <Clock className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm text-yellow-800">
                    Application deadline:{" "}
                    {new Intl.DateTimeFormat("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }).format(option.applicationDeadline)}
                  </span>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-2 pt-3 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => window.open(option.website, "_blank")}
                >
                  <ExternalLink className="w-3 h-3" />
                  Learn More
                </Button>
                <Button
                  size="sm"
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  onClick={() => onStartApplication?.(option)}
                >
                  Start Application
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOptions.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No funding options found
            </h3>
            <p className="text-gray-600">
              Try adjusting your filters or search terms to find more options.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
