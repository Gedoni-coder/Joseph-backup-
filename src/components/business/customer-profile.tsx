import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CustomerProfile } from "@/lib/business-forecast-data";
import { Users, TrendingUp, Percent, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/lib/currency-context";

interface CustomerProfileProps {
  profiles: CustomerProfile[];
  title?: string;
}

export function CustomerProfileComponent({
  profiles,
  title = "Customer Profile & Demand Assumptions",
}: CustomerProfileProps) {
  const { formatCurrency } = useCurrency();

  const getSegmentColor = (segment: string) => {
    const colors = {
      Enterprise: "bg-primary text-primary-foreground",
      "Mid-Market": "bg-economic-positive text-economic-positive-foreground",
      SMB: "bg-economic-warning text-economic-warning-foreground",
      Startup: "bg-economic-neutral text-economic-neutral-foreground",
    };
    return (
      colors[segment as keyof typeof colors] || "bg-muted text-muted-foreground"
    );
  };

  const getTotalDemand = () => {
    return profiles.reduce((sum, profile) => sum + profile.demandAssumption, 0);
  };

  const getWeightedAvgOrderValue = () => {
    const totalValue = profiles.reduce(
      (sum, profile) => sum + profile.avgOrderValue * profile.demandAssumption,
      0,
    );
    return totalValue / getTotalDemand();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Users className="h-5 w-5" />
          {title}
        </h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Total Demand: {getTotalDemand()} units</span>
          <span>•</span>
          <span>Avg Order: {formatCurrency(getWeightedAvgOrderValue())}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {profiles.map((profile) => (
          <Card key={profile.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">
                  {profile.segment}
                </CardTitle>
                <Badge
                  className={cn("text-xs", getSegmentColor(profile.segment))}
                >
                  {profile.demandAssumption} units
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-economic-positive" />
                    <span className="text-muted-foreground">Growth Rate</span>
                  </div>
                  <span className="font-medium text-economic-positive">
                    +{profile.growthRate}%
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Retention</span>
                    <span className="font-medium">{profile.retention}%</span>
                  </div>
                  <Progress value={profile.retention} className="h-2" />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Avg Order</span>
                  </div>
                  <span className="font-medium">
                    {formatCurrency(profile.avgOrderValue)}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Percent className="h-4 w-4 text-economic-warning" />
                      <span className="text-muted-foreground">Seasonality</span>
                    </div>
                    <span className="font-medium text-economic-warning">
                      ±{profile.seasonality}%
                    </span>
                  </div>
                  <Progress
                    value={profile.seasonality}
                    className="h-2"
                    max={50}
                  />
                </div>
              </div>

              <div className="border-t pt-3">
                <div className="text-xs text-muted-foreground text-center">
                  Total Revenue Potential
                </div>
                <div className="text-lg font-bold text-center">
                  {formatCurrency(
                    profile.demandAssumption * profile.avgOrderValue,
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Demand Summary & Key Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Total Market Opportunity</h4>
              <p className="text-2xl font-bold">
                {formatCurrency(
                  profiles.reduce(
                    (sum, p) => sum + p.demandAssumption * p.avgOrderValue,
                    0,
                  ),
                )}
              </p>
              <p className="text-xs text-muted-foreground">
                Based on current demand assumptions
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm">Weighted Avg Growth</h4>
              <p className="text-2xl font-bold text-economic-positive">
                +
                {(
                  profiles.reduce(
                    (sum, p) => sum + p.growthRate * p.demandAssumption,
                    0,
                  ) / getTotalDemand()
                ).toFixed(1)}
                %
              </p>
              <p className="text-xs text-muted-foreground">
                Growth rate weighted by demand volume
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm">Overall Retention</h4>
              <p className="text-2xl font-bold">
                {(
                  profiles.reduce(
                    (sum, p) => sum + p.retention * p.demandAssumption,
                    0,
                  ) / getTotalDemand()
                ).toFixed(1)}
                %
              </p>
              <p className="text-xs text-muted-foreground">
                Customer retention weighted by segment size
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
