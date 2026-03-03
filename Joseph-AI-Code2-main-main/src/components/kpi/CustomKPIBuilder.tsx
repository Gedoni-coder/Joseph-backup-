import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Save } from "lucide-react";

export const CustomKPIBuilder = () => {
  const [customKPIs, setCustomKPIs] = useState([
    {
      id: 1,
      name: "Revenue per Sales Rep",
      description: "Total Revenue ÷ Number of Sales Reps",
      dataSource: "Revenue, Team",
      formula: "Total Revenue ÷ Sales Reps Count",
      currentValue: "$61.25K",
      lastValue: "$58.75K",
    },
    {
      id: 2,
      name: "Deals per Activity",
      description: "Total Deals ÷ Total Activities",
      dataSource: "Deals, Activities",
      formula: "Deals Closed ÷ (Calls + Emails)",
      currentValue: "0.038",
      lastValue: "0.032",
    },
  ]);

  const [showBuilder, setShowBuilder] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    dataSource: "revenue",
    numerator: "total-revenue",
    operator: "divide",
    denominator: "sales-reps",
  });

  const dataSources = [
    { value: "revenue", label: "Revenue Data" },
    { value: "deals", label: "Deals Data" },
    { value: "leads", label: "Leads Data" },
    { value: "activities", label: "Activities Data" },
    { value: "team", label: "Team Data" },
    { value: "custom", label: "Custom Data" },
  ];

  const numeratorOptions = {
    revenue: [
      { value: "total-revenue", label: "Total Revenue" },
      { value: "new-revenue", label: "New Revenue" },
      { value: "recurring-revenue", label: "Recurring Revenue" },
    ],
    deals: [
      { value: "deals-closed", label: "Deals Closed" },
      { value: "deals-in-pipeline", label: "Deals in Pipeline" },
      { value: "deals-lost", label: "Deals Lost" },
    ],
    leads: [
      { value: "leads-generated", label: "Leads Generated" },
      { value: "leads-qualified", label: "Leads Qualified" },
      { value: "leads-lost", label: "Leads Lost" },
    ],
    activities: [
      { value: "total-calls", label: "Total Calls" },
      { value: "total-emails", label: "Total Emails" },
      { value: "total-activities", label: "Total Activities" },
    ],
  };

  const denominatorOptions = {
    revenue: [
      { value: "sales-reps", label: "Number of Sales Reps" },
      { value: "leads", label: "Leads Generated" },
    ],
    deals: [
      { value: "proposals", label: "Proposals Sent" },
      { value: "meetings", label: "Meetings Held" },
      { value: "leads", label: "Leads Qualified" },
    ],
    activities: [
      { value: "sales-reps", label: "Number of Sales Reps" },
      { value: "total-calls", label: "Total Calls" },
      { value: "total-emails", label: "Total Emails" },
    ],
  };

  const operators = [
    { value: "divide", label: "÷ (Divide)" },
    { value: "multiply", label: "× (Multiply)" },
    { value: "subtract", label: "− (Subtract)" },
    { value: "add", label: "+ (Add)" },
    { value: "percentage", label: "% (Percentage)" },
  ];

  const handleAddKPI = () => {
    const newKPI = {
      id: Math.max(...customKPIs.map((k) => k.id), 0) + 1,
      name: formData.name,
      description: formData.description,
      dataSource: formData.dataSource,
      formula: `${numeratorOptions[formData.dataSource as keyof typeof numeratorOptions]
        ?.find((o) => o.value === formData.numerator)
        ?.label || formData.numerator} ${
        operators.find((o) => o.value === formData.operator)?.label || "÷"
      } ${
        denominatorOptions[formData.dataSource as keyof typeof denominatorOptions]
          ?.find((o) => o.value === formData.denominator)
          ?.label || formData.denominator
      }`,
      currentValue: "$0",
      lastValue: "$0",
    };

    setCustomKPIs([...customKPIs, newKPI]);
    setFormData({
      name: "",
      description: "",
      dataSource: "revenue",
      numerator: "total-revenue",
      operator: "divide",
      denominator: "sales-reps",
    });
    setShowBuilder(false);
  };

  const handleDeleteKPI = (id: number) => {
    setCustomKPIs(customKPIs.filter((kpi) => kpi.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Custom KPI Builder */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Create Your Own KPI</CardTitle>
              <CardDescription>
                Build custom KPIs tailored to your business needs
              </CardDescription>
            </div>
            <Button
              onClick={() => setShowBuilder(!showBuilder)}
              variant="outline"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              New KPI
            </Button>
          </div>
        </CardHeader>

        {showBuilder && (
          <CardContent className="space-y-6">
            {/* KPI Name Input */}
            <div>
              <label className="text-sm font-semibold block mb-2">
                KPI Name
              </label>
              <Input
                placeholder="e.g., Revenue per Sales Rep"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            {/* Description Input */}
            <div>
              <label className="text-sm font-semibold block mb-2">
                Description
              </label>
              <Input
                placeholder="Brief description of what this KPI measures"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            {/* Data Source Selection */}
            <div>
              <label className="text-sm font-semibold block mb-2">
                Data Source
              </label>
              <Select
                value={formData.dataSource}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    dataSource: value,
                    numerator: "total-revenue",
                    denominator: "sales-reps",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {dataSources.map((source) => (
                    <SelectItem key={source.value} value={source.value}>
                      {source.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Formula Builder */}
            <div className="space-y-4">
              <label className="text-sm font-semibold block">
                Formula: Numerator Operator Denominator
              </label>
              <div className="grid grid-cols-3 gap-4">
                {/* Numerator */}
                <div>
                  <label className="text-xs text-gray-600 block mb-2">
                    Numerator (Top)
                  </label>
                  <Select value={formData.numerator} onValueChange={(value) =>
                    setFormData({ ...formData, numerator: value })
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(
                        numeratorOptions[
                          formData.dataSource as keyof typeof numeratorOptions
                        ] || []
                      ).map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Operator */}
                <div>
                  <label className="text-xs text-gray-600 block mb-2">
                    Operator
                  </label>
                  <Select value={formData.operator} onValueChange={(value) =>
                    setFormData({ ...formData, operator: value })
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {operators.map((op) => (
                        <SelectItem key={op.value} value={op.value}>
                          {op.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Denominator */}
                <div>
                  <label className="text-xs text-gray-600 block mb-2">
                    Denominator (Bottom)
                  </label>
                  <Select value={formData.denominator} onValueChange={(value) =>
                    setFormData({ ...formData, denominator: value })
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(
                        denominatorOptions[
                          formData.dataSource as keyof typeof denominatorOptions
                        ] || []
                      ).map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Formula Preview */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Formula Preview</p>
              <p className="text-lg font-semibold text-blue-900">
                {formData.name || "Your KPI Name"} ={" "}
                {
                  numeratorOptions[formData.dataSource as keyof typeof numeratorOptions]
                    ?.find((o) => o.value === formData.numerator)
                    ?.label
                }{" "}
                {operators.find((o) => o.value === formData.operator)?.label}{" "}
                {
                  denominatorOptions[
                    formData.dataSource as keyof typeof denominatorOptions
                  ]
                    ?.find((o) => o.value === formData.denominator)
                    ?.label
                }
              </p>
            </div>

            {/* Save Button */}
            <div className="flex gap-3">
              <Button onClick={handleAddKPI} variant="default">
                <Save className="h-4 w-4 mr-2" />
                Save KPI
              </Button>
              <Button
                onClick={() => setShowBuilder(false)}
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Saved Custom KPIs */}
      <Card>
        <CardHeader>
          <CardTitle>Your Custom KPIs</CardTitle>
          <CardDescription>
            Manage and track your custom KPIs in one place
          </CardDescription>
        </CardHeader>
        <CardContent>
          {customKPIs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No custom KPIs created yet</p>
              <Button onClick={() => setShowBuilder(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First KPI
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {customKPIs.map((kpi) => (
                <Card key={kpi.id} className="border-2">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-base">{kpi.name}</CardTitle>
                        <CardDescription className="text-xs mt-1">
                          {kpi.description}
                        </CardDescription>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteKPI(kpi.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Formula</p>
                      <p className="text-sm font-mono bg-gray-50 p-2 rounded">
                        {kpi.formula}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Current</p>
                        <p className="font-bold text-green-600">{kpi.currentValue}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Last Period</p>
                        <p className="font-bold text-gray-600">{kpi.lastValue}</p>
                      </div>
                    </div>
                    <Badge variant="outline">
                      {kpi.dataSource.charAt(0).toUpperCase() +
                        kpi.dataSource.slice(1)}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Custom KPI Guidelines */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <CardTitle className="text-base">💡 Custom KPI Best Practices</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-purple-600 font-bold">•</span>
              <span>
                <strong>Keep it Simple:</strong> Use straightforward formulas that are easy to understand and explain.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 font-bold">•</span>
              <span>
                <strong>Actionable:</strong> Ensure your KPI directly relates to business decisions.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 font-bold">•</span>
              <span>
                <strong>Measurable:</strong> Use data sources that can be reliably tracked.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 font-bold">•</span>
              <span>
                <strong>Aligned:</strong> Make sure the KPI supports your business goals.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 font-bold">•</span>
              <span>
                <strong>Benchmarked:</strong> Compare against industry standards or historical data.
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
