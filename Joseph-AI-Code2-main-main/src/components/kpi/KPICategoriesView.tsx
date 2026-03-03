import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Info } from "lucide-react";
import { useCurrency } from "@/hooks/useCurrency";

const KPICategory = ({ name, kpis }: { name: string; kpis: any[] }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {kpis.map((kpi, idx) => (
        <Card key={idx}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-base">{kpi.name}</CardTitle>
                <CardDescription className="text-xs mt-1">
                  {kpi.description}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {kpi.currentValue}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  {kpi.trendDirection === "up" ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                  <span
                    className={`text-sm font-semibold ${
                      kpi.trendDirection === "up"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {kpi.trendValue}
                  </span>
                  <span className="text-xs text-gray-500">vs last month</span>
                </div>
              </div>
              <hr className="my-2" />
              <div>
                <p className="text-xs text-gray-600 mb-1">Last Month</p>
                <p className="font-semibold text-gray-700">
                  {kpi.lastMonthValue}
                </p>
              </div>
              {kpi.explanation && (
                <div className="p-2 bg-blue-50 rounded border border-blue-100">
                  <p className="text-xs text-blue-700">{kpi.explanation}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export const KPICategoriesView = () => {
  const { format } = useCurrency();
  const [activeCategory, setActiveCategory] = useState("lead");

  const categories = {
    lead: {
      name: "Lead & Conversion KPIs",
      description:
        "Measure lead generation and qualification process effectiveness",
      kpis: [
        {
          name: "Leads Generated",
          description: "Total new leads in the period",
          currentValue: "45",
          lastMonthValue: "38",
          trendValue: "+7",
          trendDirection: "up",
          explanation:
            "Strong lead generation growth. Continue current outreach strategy.",
        },
        {
          name: "Lead Conversion Rate",
          description: "Percentage of leads becoming qualified",
          currentValue: "28%",
          lastMonthValue: "24%",
          trendValue: "+4%",
          trendDirection: "up",
          explanation:
            "Improved lead qualification. Better targeting is working.",
        },
        {
          name: "Meetings Booked",
          description: "Total meetings scheduled with prospects",
          currentValue: "18",
          lastMonthValue: "15",
          trendValue: "+3",
          trendDirection: "up",
          explanation: "Meeting cadence improving. Sales team is more engaged.",
        },
        {
          name: "Meetings Held",
          description: "Actual meetings conducted",
          currentValue: "16",
          lastMonthValue: "14",
          trendValue: "+2",
          trendDirection: "up",
          explanation: "Good meeting attendance rate at 89%.",
        },
        {
          name: "Demo-to-Close Rate",
          description: "Percentage of demos converting to closed deals",
          currentValue: "42%",
          lastMonthValue: "38%",
          trendValue: "+4%",
          trendDirection: "up",
          explanation:
            "Demos are more effective. Product positioning is strong.",
        },
        {
          name: "Cost per Lead",
          description: "Total lead generation cost divided by leads generated",
          currentValue: format(125),
          lastMonthValue: format(132),
          trendValue: `-${format(7)}`,
          trendDirection: "up",
          explanation:
            "Lead acquisition cost is decreasing. Channel optimization working.",
        },
      ],
    },
    deal: {
      name: "Deal & Closing KPIs",
      description: "Track sales effectiveness from opportunity to closed deal",
      kpis: [
        {
          name: "Opportunity Win Rate",
          description: "Percentage of opportunities closing as won deals",
          currentValue: "34%",
          lastMonthValue: "31%",
          trendValue: "+3%",
          trendDirection: "up",
          explanation:
            "Win rate trending positively. Sales execution improving.",
        },
        {
          name: "Close Rate",
          description: "Percentage of proposals converting to closed deals",
          currentValue: "48%",
          lastMonthValue: "45%",
          trendValue: "+3%",
          trendDirection: "up",
          explanation: "Better proposal quality and follow-up strategy.",
        },
        {
          name: "Quote-to-Close Ratio",
          description: "Number of quotes needed to close one deal",
          currentValue: "2.1",
          lastMonthValue: "2.5",
          trendValue: "-0.4",
          trendDirection: "up",
          explanation: "Fewer quotes needed. More targeted proposals.",
        },
        {
          name: "Sales Cycle Length",
          description: "Average days from opportunity to close",
          currentValue: "25 days",
          lastMonthValue: "28 days",
          trendValue: "-3 days",
          trendDirection: "up",
          explanation: "Sales cycles shortening. Process improvements working.",
        },
        {
          name: "Win/Loss Ratio",
          description: "Wins to losses comparison",
          currentValue: "1.9:1",
          lastMonthValue: "1.6:1",
          trendValue: "+0.3:1",
          trendDirection: "up",
          explanation: "Better competitive positioning. Team execution strong.",
        },
        {
          name: "Average Deal Size",
          description: "Average revenue per closed deal",
          currentValue: format(45200),
          lastMonthValue: format(42100),
          trendValue: `+${format(3100)}`,
          trendDirection: "up",
          explanation: "Deal sizes increasing. Upselling is effective.",
        },
      ],
    },
    revenue: {
      name: "Revenue Performance KPIs",
      description: "Measure overall revenue health and growth balance",
      kpis: [
        {
          name: "Sales Revenue",
          description: "Total closed revenue for the period",
          currentValue: format(245000, 0),
          lastMonthValue: format(235000, 0),
          trendValue: `+${format(10000, 0)}`,
          trendDirection: "up",
          explanation: "Revenue on track. Strong deal closures this period.",
        },
        {
          name: "Revenue Growth Rate",
          description: "Percentage growth compared to previous period",
          currentValue: "4.2%",
          lastMonthValue: "2.8%",
          trendValue: "+1.4%",
          trendDirection: "up",
          explanation: "Growth acceleration. Momentum building.",
        },
        {
          name: "Average Deal Size",
          description: "Mean revenue per closed deal",
          currentValue: format(45200),
          lastMonthValue: format(42100),
          trendValue: `+${format(3100)}`,
          trendDirection: "up",
          explanation: "Higher value deals. Premium positioning working.",
        },
        {
          name: "New vs Existing Mix",
          description:
            "Percentage of new revenue vs. existing customer revenue",
          currentValue: "62% / 38%",
          lastMonthValue: "58% / 42%",
          trendValue: "+4%",
          trendDirection: "up",
          explanation: "New business outpacing retention. Diversified revenue.",
        },
        {
          name: "Monthly Recurring Revenue",
          description: "Predictable monthly revenue from subscriptions",
          currentValue: format(185000, 0),
          lastMonthValue: format(178000, 0),
          trendValue: `+${format(7000, 0)}`,
          trendDirection: "up",
          explanation: "MRR growing steadily. Subscription base expanding.",
        },
        {
          name: "Revenue Target Achievement",
          description: "Percentage of monthly target achieved",
          currentValue: "98%",
          lastMonthValue: "95%",
          trendValue: "+3%",
          trendDirection: "up",
          explanation: "Nearly at target. On track for quarter.",
        },
      ],
    },
    pipeline: {
      name: "Pipeline & Forecast KPIs",
      description: "Show whether your future revenue is secure",
      kpis: [
        {
          name: "Pipeline Value",
          description: "Total value of all open opportunities",
          currentValue: format(450000, 0),
          lastMonthValue: format(420000, 0),
          trendValue: `+${format(30000, 0)}`,
          trendDirection: "up",
          explanation: "Pipeline strengthening. Good inflow of new deals.",
        },
        {
          name: "Pipeline Coverage Ratio",
          description: "Pipeline value divided by monthly target",
          currentValue: "1.8x",
          lastMonthValue: "1.7x",
          trendDirection: "up",
          trendValue: "+0.1x",
          explanation: "Healthy pipeline coverage. Future revenue secure.",
        },
        {
          name: "Forecast Accuracy",
          description: "Accuracy of sales forecast vs. actual results",
          currentValue: "87%",
          lastMonthValue: "82%",
          trendValue: "+5%",
          trendDirection: "up",
          explanation: "Forecasting improving. Better pipeline visibility.",
        },
        {
          name: "Pipeline by Stage",
          description: "Distribution of opportunities across sales stages",
          currentValue: "Balanced",
          lastMonthValue: "Top-Heavy",
          trendValue: "Improved",
          trendDirection: "up",
          explanation: "Better distribution. Early stage deals moving through.",
        },
        {
          name: "Deals at Risk",
          description: "Number of deals showing stall signals",
          currentValue: "3",
          lastMonthValue: "5",
          trendValue: "-2",
          trendDirection: "up",
          explanation: "Risk mitigation working. Fewer stalled deals.",
        },
        {
          name: "Next Month Forecast",
          description: "Projected revenue for next month",
          currentValue: format(238000, 0),
          lastMonthValue: format(245000, 0),
          trendValue: `-${format(7000, 0)}`,
          trendDirection: "down",
          explanation: "Conservative forecast. Some deals slipping.",
        },
      ],
    },
    cost: {
      name: "Sales Cost & Profitability KPIs",
      description: "Measure profitability and cost control in sales",
      kpis: [
        {
          name: "Cost per Sale",
          description: "Total sales cost divided by number of deals closed",
          currentValue: format(2850),
          lastMonthValue: format(3100),
          trendValue: `-${format(250)}`,
          trendDirection: "up",
          explanation: "Improving efficiency. Better cost control.",
        },
        {
          name: "Sales Cost Ratio",
          description: "Sales costs as percentage of revenue",
          currentValue: "14%",
          lastMonthValue: "16%",
          trendValue: "-2%",
          trendDirection: "up",
          explanation: "Ratio improving. Revenue growth outpacing costs.",
        },
        {
          name: "Margin per Deal",
          description: "Profit margin on average deal",
          currentValue: "68%",
          lastMonthValue: "65%",
          trendValue: "+3%",
          trendDirection: "up",
          explanation: "Better margins. Premium positioning effective.",
        },
        {
          name: "Discount Rate",
          description: "Average discount given on deals",
          currentValue: "8%",
          lastMonthValue: "12%",
          trendValue: "-4%",
          trendDirection: "up",
          explanation: "Less discounting. Pricing power improving.",
        },
        {
          name: "Sales Team Cost",
          description: "Total monthly salary and commission costs",
          currentValue: format(68000, 0),
          lastMonthValue: format(68000, 0),
          trendValue: "No change",
          trendDirection: "up",
          explanation: "Costs stable while revenue grows.",
        },
        {
          name: "ROI on Sales Investment",
          description: "Revenue generated per dollar of sales cost",
          currentValue: "7.1x",
          lastMonthValue: "6.3x",
          trendValue: "+0.8x",
          trendDirection: "up",
          explanation: "Better ROI. Sales investment paying off.",
        },
      ],
    },
    activity: {
      name: "Sales Activity & Productivity KPIs",
      description: "Track salesperson effort and productivity",
      kpis: [
        {
          name: "Calls per Rep",
          description: "Average outbound calls per sales rep per day",
          currentValue: "18",
          lastMonthValue: "16",
          trendValue: "+2",
          trendDirection: "up",
          explanation: "Activity increasing. Better engagement levels.",
        },
        {
          name: "Emails per Rep",
          description: "Average emails sent per sales rep per day",
          currentValue: "32",
          lastMonthValue: "28",
          trendValue: "+4",
          trendDirection: "up",
          explanation: "More outreach. Digital engagement up.",
        },
        {
          name: "Meetings per Rep",
          description: "Average meetings per sales rep per month",
          currentValue: "12",
          lastMonthValue: "11",
          trendValue: "+1",
          trendDirection: "up",
          explanation: "Better meeting cadence. More conversations.",
        },
        {
          name: "Activity-to-Opportunity Ratio",
          description: "Activities (calls + emails) to create one opportunity",
          currentValue: "42",
          lastMonthValue: "48",
          trendValue: "-6",
          trendDirection: "up",
          explanation: "More efficient prospecting. Better targeting.",
        },
        {
          name: "Deals per Rep per Month",
          description: "Average deals closed per sales rep monthly",
          currentValue: "3",
          lastMonthValue: "2.8",
          trendValue: "+0.2",
          trendDirection: "up",
          explanation: "Productivity improving. Better conversion.",
        },
        {
          name: "Activity Consistency",
          description: "Percentage of reps meeting activity targets",
          currentValue: "92%",
          lastMonthValue: "88%",
          trendValue: "+4%",
          trendDirection: "up",
          explanation: "Team alignment improving. More consistency.",
        },
      ],
    },
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>KPI Categories</CardTitle>
          <CardDescription>
            Choose a category to view detailed KPI metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeCategory}
            onValueChange={setActiveCategory}
            className="w-full space-y-6"
          >
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3">
              <TabsTrigger value="lead">Lead & Conversion</TabsTrigger>
              <TabsTrigger value="deal">Deal & Closing</TabsTrigger>
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
              <TabsTrigger value="pipeline">Pipeline & Forecast</TabsTrigger>
              <TabsTrigger value="cost">Cost & Profitability</TabsTrigger>
              <TabsTrigger value="activity">
                Activity & Productivity
              </TabsTrigger>
            </TabsList>

            {Object.entries(categories).map(([key, category]) => (
              <TabsContent key={key} value={key} className="space-y-4">
                <div className="mb-4">
                  <h3 className="text-xl font-bold">{category.name}</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {category.description}
                  </p>
                </div>
                <KPICategory name={category.name} kpis={category.kpis} />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
