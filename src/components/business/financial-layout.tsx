import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calculator,
  PieChart,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/lib/currency-context";
import { useQuery } from "@tanstack/react-query";
import {
  getFinancialLineItems,
  type FinancialLineItem,
} from "@/lib/api/financial-layout-service";

interface FinancialLayoutProps {
  title?: string;
}

export function FinancialLayout({
  title = "Financial Layout & Metrics Analysis",
}: FinancialLayoutProps) {
  const { getCurrencySymbol } = useCurrency();

  const {
    data: financialData = [],
    isLoading,
    isError,
  } = useQuery<FinancialLineItem[]>({
    queryKey: ["financial", "line-items"],
    queryFn: getFinancialLineItems,
    staleTime: 5 * 60 * 1000,
  });

  const formatCurrency = (value: number) => {
    const symbol = getCurrencySymbol();
    if (value >= 1000000) {
      return `${symbol}${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${symbol}${(value / 1000).toFixed(0)}K`;
    }
    return `${symbol}${value.toLocaleString()}`;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Revenue":
        return <TrendingUp className="h-4 w-4 text-economic-positive" />;
      case "Expenses":
        return <TrendingDown className="h-4 w-4 text-economic-negative" />;
      case "Profit":
        return <DollarSign className="h-4 w-4 text-primary" />;
      case "Assets":
        return <BarChart3 className="h-4 w-4 text-blue-600" />;
      case "Liabilities":
        return <Calculator className="h-4 w-4 text-orange-600" />;
      case "Equity":
        return <PieChart className="h-4 w-4 text-purple-600" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Revenue":
        return "bg-green-100 text-green-800 border-green-200";
      case "Expenses":
        return "bg-red-100 text-red-800 border-red-200";
      case "Profit":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Assets":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Liabilities":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Equity":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getVariance = (item: FinancialLineItem) => {
    if (!item.budget_amount) {
      return 0;
    }
    return ((item.current_amount - item.budget_amount) / item.budget_amount) * 100;
  };

  const getVarianceColor = (variance: number) => {
    if (variance > 0) return "text-economic-positive";
    if (variance < 0) return "text-economic-negative";
    return "text-economic-neutral";
  };

  const groupedData = financialData.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    },
    {} as Record<string, FinancialLineItem[]>,
  );

  const calculateCategoryTotals = (category: string) => {
    const items = groupedData[category] || [];
    return items.reduce((sum, item) => sum + item.current_amount, 0);
  };

  const getPercentOfTotal = (item: FinancialLineItem) => {
    const categoryTotal = calculateCategoryTotals(item.category);
    if (!categoryTotal) {
      return 0;
    }
    return (item.current_amount / categoryTotal) * 100;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-sm text-muted-foreground">
          Loading financial layout data...
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-sm text-economic-negative">
          Failed to load financial layout data from the database.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          {title}
        </h3>
        <Badge variant="outline" className="text-xs">
          {financialData.length} line items
        </Badge>
      </div>

      {financialData.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            No financial line items found in the database.
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(groupedData).map(([category, items]) => (
              <Card key={category} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    {getCategoryIcon(category)}
                    <Badge
                      variant="secondary"
                      className={cn("text-xs", getCategoryColor(category))}
                    >
                      {category}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold">
                      {formatCurrency(calculateCategoryTotals(category))}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {items.length} line items
                    </div>
                    <div className="space-y-1">
                      {items.slice(0, 3).map((item) => (
                        <div key={item.id} className="flex justify-between text-xs">
                          <span className="truncate">{item.item}</span>
                          <span className="font-medium">
                            {formatCurrency(item.current_amount)}
                          </span>
                        </div>
                      ))}
                      {items.length > 3 && (
                        <div className="text-xs text-muted-foreground">
                          +{items.length - 3} more...
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Detailed Financial Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold">Category</TableHead>
                      <TableHead className="font-semibold">Line Item</TableHead>
                      <TableHead className="font-semibold text-right">Current</TableHead>
                      <TableHead className="font-semibold text-right">Budget</TableHead>
                      <TableHead className="font-semibold text-right">Last Year</TableHead>
                      <TableHead className="font-semibold text-right">Variance</TableHead>
                      <TableHead className="font-semibold text-right">% of Total</TableHead>
                      <TableHead className="font-semibold text-center">Performance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {financialData.map((item) => {
                      const variance = getVariance(item);
                      const percentOfTotal = getPercentOfTotal(item);

                      return (
                        <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getCategoryIcon(item.category)}
                              <Badge
                                variant="secondary"
                                className={cn("text-xs", getCategoryColor(item.category))}
                              >
                                {item.category}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{item.item}</TableCell>
                          <TableCell className="text-right font-bold">
                            {formatCurrency(item.current_amount)}
                          </TableCell>
                          <TableCell className="text-right text-muted-foreground">
                            {formatCurrency(item.budget_amount)}
                          </TableCell>
                          <TableCell className="text-right text-muted-foreground">
                            {formatCurrency(item.last_year_amount)}
                          </TableCell>
                          <TableCell className="text-right">
                            <span className={cn("font-medium", getVarianceColor(variance))}>
                              {variance > 0 ? "+" : ""}
                              {variance.toFixed(1)}%
                            </span>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {percentOfTotal.toFixed(1)}%
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center gap-2">
                              <Progress value={Math.min(Math.abs(variance) * 10, 100)} className="h-2 w-16" />
                              <span
                                className={cn(
                                  "text-xs font-medium",
                                  Math.abs(variance) > 5
                                    ? "text-economic-warning"
                                    : "text-economic-positive",
                                )}
                              >
                                {Math.abs(variance) > 5 ? "High" : "Normal"}
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-economic-positive/10 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-economic-positive" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Total Revenue</div>
                    <div className="text-lg font-bold">
                      {formatCurrency(calculateCategoryTotals("Revenue"))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-economic-negative/10 rounded-lg">
                    <TrendingDown className="h-5 w-5 text-economic-negative" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Total Expenses</div>
                    <div className="text-lg font-bold">
                      {formatCurrency(calculateCategoryTotals("Expenses"))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Net Profit</div>
                    <div className="text-lg font-bold">
                      {formatCurrency(
                        calculateCategoryTotals("Revenue") -
                          calculateCategoryTotals("Expenses"),
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Total Assets</div>
                    <div className="text-lg font-bold">
                      {formatCurrency(calculateCategoryTotals("Assets"))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
