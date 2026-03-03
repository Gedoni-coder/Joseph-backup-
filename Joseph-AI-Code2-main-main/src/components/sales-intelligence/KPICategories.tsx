import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown } from "lucide-react";

interface KPI {
  name: string;
  current: string | number;
  previous: string | number;
  change: number;
  unit?: string;
  description?: string;
}

interface KPICategory {
  id: string;
  name: string;
  description: string;
  kpis: KPI[];
}

const kpiCategories: KPICategory[] = [
  {
    id: "lead-conversion",
    name: "Lead & Conversion KPIs",
    description:
      "How well you generate and qualify opportunities (Top of Funnel)",
    kpis: [
      {
        name: "Leads Generated",
        current: 145,
        previous: 134,
        change: 8.2,
        unit: "leads",
        description: "Total new leads created this period",
      },
      {
        name: "Lead Conversion Rate",
        current: "28.5%",
        previous: "26.2%",
        change: 8.8,
        description: "Percentage of leads converted to opportunities",
      },
      {
        name: "Meetings Booked",
        current: 42,
        previous: 38,
        change: 10.5,
        unit: "meetings",
        description: "Sales meetings scheduled",
      },
      {
        name: "Meetings Held",
        current: 38,
        previous: 35,
        change: 8.6,
        unit: "meetings",
        description: "Actual meetings completed",
      },
      {
        name: "Demo-to-Close Rate",
        current: "35.2%",
        previous: "32.1%",
        change: 9.6,
        description: "Percentage of demos that result in closed deals",
      },
    ],
  },
  {
    id: "deal-closing",
    name: "Deal & Closing KPIs",
    description:
      "How good your sales team is at closing business (Middle/Bottom of Funnel)",
    kpis: [
      {
        name: "Opportunity Win Rate",
        current: "22%",
        previous: "18%",
        change: 22.2,
        description: "Percentage of qualified opportunities won",
      },
      {
        name: "Close Rate",
        current: "18.5%",
        previous: "16.2%",
        change: 14.2,
        description: "Percentage of deals closed vs total pipeline",
      },
      {
        name: "Quote-to-Close Ratio",
        current: "65%",
        previous: "58%",
        change: 12.1,
        description: "Percentage of quotes that become closed deals",
      },
      {
        name: "Sales Cycle Length",
        current: "28 days",
        previous: "32 days",
        change: -12.5,
        description: "Average days from opportunity to closed deal",
      },
      {
        name: "Win/Loss Ratio",
        current: "3.2:1",
        previous: "2.8:1",
        change: 14.3,
        description: "Ratio of wins to losses",
      },
    ],
  },
  {
    id: "revenue-performance",
    name: "Revenue Performance KPIs",
    description: "How much money you are making and growing",
    kpis: [
      {
        name: "Sales Revenue",
        current: "$250K",
        previous: "$222K",
        change: 12.6,
        description: "Total revenue generated this period",
      },
      {
        name: "Revenue Growth Rate",
        current: "15.8%",
        previous: "12.3%",
        change: 28.5,
        description: "Month-over-month revenue growth",
      },
      {
        name: "Average Deal Size",
        current: "$13.9K",
        previous: "$12.7K",
        change: 9.4,
        description: "Average value of closed deals",
      },
      {
        name: "New vs Existing Mix",
        current: "45% / 55%",
        previous: "42% / 58%",
        change: 7.1,
        description: "Revenue split between new and existing customers",
      },
    ],
  },
  {
    id: "pipeline-forecast",
    name: "Pipeline & Forecast KPIs",
    description: "How healthy and reliable your pipeline is",
    kpis: [
      {
        name: "Pipeline Value",
        current: "$2.4M",
        previous: "$2.1M",
        change: 14.3,
        description: "Total value of open opportunities",
      },
      {
        name: "Pipeline Coverage Ratio",
        current: "8.5x",
        previous: "7.8x",
        change: 9.0,
        description: "Pipeline value vs quarterly sales target",
      },
      {
        name: "Forecast Accuracy",
        current: "92%",
        previous: "88%",
        change: 4.5,
        description: "Accuracy of revenue forecasts vs actuals",
      },
    ],
  },
  {
    id: "sales-cost",
    name: "Sales Cost & Profitability KPIs",
    description: "How efficient your sales spending is",
    kpis: [
      {
        name: "Cost per Sale",
        current: "$1,200",
        previous: "$1,450",
        change: -17.2,
        description: "Average cost to acquire one customer",
      },
      {
        name: "Sales Cost Ratio",
        current: "12.5%",
        previous: "14.2%",
        change: -12.0,
        description: "Sales costs as percentage of revenue",
      },
      {
        name: "Margin per Deal",
        current: "$4,250",
        previous: "$3,850",
        change: 10.4,
        description: "Average profit margin per closed deal",
      },
      {
        name: "Discount Rate",
        current: "8.5%",
        previous: "10.2%",
        change: -16.7,
        description: "Average discount given on deals",
      },
    ],
  },
  {
    id: "activity-productivity",
    name: "Sales Activity & Productivity KPIs",
    description: "How hard and smart your sales team is working",
    kpis: [
      {
        name: "Calls per Rep",
        current: 42,
        previous: 38,
        change: 10.5,
        unit: "calls/week",
        description: "Average calls made per sales rep per week",
      },
      {
        name: "Emails per Rep",
        current: 68,
        previous: 62,
        change: 9.7,
        unit: "emails/week",
        description: "Average emails sent per sales rep per week",
      },
      {
        name: "Demos Conducted",
        current: 24,
        previous: 20,
        change: 20.0,
        unit: "demos",
        description: "Product demonstrations given this period",
      },
    ],
  },
  {
    id: "growth-market",
    name: "Growth & Market KPIs",
    description: "How well you expand and penetrate the market",
    kpis: [
      {
        name: "Upsell/Cross-sell Rate",
        current: "18.5%",
        previous: "15.2%",
        change: 21.7,
        description:
          "Percentage of existing customers with upsells/cross-sells",
      },
      {
        name: "Territory Coverage",
        current: "92%",
        previous: "85%",
        change: 8.2,
        description: "Percentage of target market territories covered",
      },
      {
        name: "Market Penetration",
        current: "32.5%",
        previous: "28.0%",
        change: 16.1,
        description: "Percentage of addressable market captured",
      },
    ],
  },
];

const KPICategories = () => {
  const [activeCategory, setActiveCategory] = useState("lead-conversion");

  const currentCategory = kpiCategories.find(
    (cat) => cat.id === activeCategory,
  );

  return (
    <div className="space-y-6">
      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 h-auto p-2">
          {kpiCategories.map((category) => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="text-xs sm:text-sm whitespace-normal py-3"
            >
              {category.name.split(" ")[0]}
            </TabsTrigger>
          ))}
        </TabsList>

        {kpiCategories.map((category) => (
          <TabsContent
            key={category.id}
            value={category.id}
            className="space-y-4"
          >
            <div>
              <h3 className="text-lg font-semibold">{category.name}</h3>
              <p className="text-sm text-gray-600 mt-1">
                {category.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {category.kpis.map((kpi, idx) => (
                <Card key={idx}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{kpi.name}</h4>
                        {kpi.description && (
                          <p className="text-xs text-gray-600 mt-1">
                            {kpi.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-2xl font-bold text-gray-900">
                          {kpi.current}
                        </p>
                        {kpi.unit && (
                          <p className="text-xs text-gray-500 mt-1">
                            {kpi.unit}
                          </p>
                        )}
                      </div>

                      <div className="text-right">
                        <div className="flex items-center gap-1 justify-end">
                          {kpi.change >= 0 ? (
                            <>
                              <TrendingUp className="h-4 w-4 text-green-600" />
                              <span className="text-sm font-medium text-green-600">
                                +{kpi.change.toFixed(1)}%
                              </span>
                            </>
                          ) : (
                            <>
                              <TrendingDown className="h-4 w-4 text-red-600" />
                              <span className="text-sm font-medium text-red-600">
                                {kpi.change.toFixed(1)}%
                              </span>
                            </>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          vs {kpi.previous}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default KPICategories;
