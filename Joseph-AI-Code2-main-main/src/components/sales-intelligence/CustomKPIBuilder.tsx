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
import { Plus, Trash2, Save } from "lucide-react";

interface CustomKPI {
  id: string;
  name: string;
  description: string;
  formula: string;
  dataSource: string;
  status: "draft" | "active";
}

const dataSourceOptions = [
  "Leads",
  "Deals",
  "Revenue",
  "Pipeline",
  "Sales Activity",
  "Costs",
];

const formulaTemplates = [
  {
    name: "Revenue per Sales Rep",
    formula: "Total Revenue ÷ Number of Sales Reps",
    datasource: "Revenue",
  },
  {
    name: "Lead Cost",
    formula: "Total Marketing Spend ÷ Leads Generated",
    datasource: "Leads",
  },
  {
    name: "Deal Efficiency",
    formula: "Deals Closed ÷ Total Opportunities",
    datasource: "Deals",
  },
  {
    name: "Pipeline Velocity",
    formula: "Pipeline Value ÷ Sales Cycle Length",
    datasource: "Pipeline",
  },
  {
    name: "Rep Productivity",
    formula: "Total Revenue ÷ Sales Activities",
    datasource: "Sales Activity",
  },
];

const CustomKPIBuilder = () => {
  const [customKPIs, setCustomKPIs] = useState<CustomKPI[]>([
    {
      id: "custom-1",
      name: "Revenue per Sales Rep",
      description: "Total Revenue ÷ Number of Sales Reps",
      formula: "Total Revenue ÷ Number of Sales Reps",
      dataSource: "Revenue",
      status: "active",
    },
  ]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    formula: "",
    dataSource: "",
  });

  const handleAddKPI = () => {
    if (!formData.name || !formData.formula || !formData.dataSource) return;

    const newKPI: CustomKPI = {
      id: `custom-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      formula: formData.formula,
      dataSource: formData.dataSource,
      status: "draft",
    };

    setCustomKPIs([...customKPIs, newKPI]);
    setFormData({ name: "", description: "", formula: "", dataSource: "" });
    setIsFormOpen(false);
  };

  const handleDeleteKPI = (id: string) => {
    setCustomKPIs(customKPIs.filter((kpi) => kpi.id !== id));
  };

  const handleActivateKPI = (id: string) => {
    setCustomKPIs(
      customKPIs.map((kpi) =>
        kpi.id === id ? { ...kpi, status: "active" as const } : kpi,
      ),
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Custom KPI Builder</h3>
          <p className="text-sm text-gray-600 mt-1">
            Create and manage custom KPIs tailored to your business needs
          </p>
        </div>
        <Button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="gap-2"
          size="sm"
        >
          <Plus className="h-4 w-4" />
          New KPI
        </Button>
      </div>

      {/* Create New KPI Form */}
      {isFormOpen && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-base">Create New Custom KPI</CardTitle>
            <CardDescription>
              Define a custom metric specific to your business
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">KPI Name</label>
              <input
                type="text"
                placeholder="e.g., Revenue per Sales Rep"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Description (Optional)
              </label>
              <textarea
                placeholder="What does this KPI measure?"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={2}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Formula</label>
              <textarea
                placeholder="e.g., Total Revenue ÷ Number of Sales Reps"
                value={formData.formula}
                onChange={(e) =>
                  setFormData({ ...formData, formula: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={2}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Data Source
              </label>
              <Select
                value={formData.dataSource}
                onValueChange={(value) =>
                  setFormData({ ...formData, dataSource: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select data source" />
                </SelectTrigger>
                <SelectContent>
                  {dataSourceOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="pt-2 flex gap-3">
              <Button onClick={handleAddKPI} className="gap-2" size="sm">
                <Save className="h-4 w-4" />
                Save KPI
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsFormOpen(false)}
                size="sm"
              >
                Cancel
              </Button>
            </div>

            {/* Formula Templates */}
            <div className="pt-4 border-t">
              <p className="text-xs font-semibold text-gray-600 mb-2">
                Quick Templates:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {formulaTemplates.map((template, idx) => (
                  <button
                    key={idx}
                    onClick={() =>
                      setFormData({
                        name: template.name,
                        formula: template.formula,
                        dataSource: template.datasource,
                        description: "",
                      })
                    }
                    className="p-2 text-left text-xs bg-white border border-gray-200 rounded hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    <p className="font-medium text-gray-900">{template.name}</p>
                    <p className="text-gray-600">{template.formula}</p>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Custom KPIs List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {customKPIs.map((kpi) => (
          <Card key={kpi.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-base">{kpi.name}</CardTitle>
                  {kpi.description && (
                    <CardDescription className="text-xs mt-1">
                      {kpi.description}
                    </CardDescription>
                  )}
                </div>
                <Badge
                  variant={kpi.status === "active" ? "default" : "secondary"}
                >
                  {kpi.status === "active" ? "Active" : "Draft"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-gray-600 mb-1">Formula:</p>
                <p className="text-sm font-mono bg-gray-50 p-2 rounded">
                  {kpi.formula}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-600 mb-1">Data Source:</p>
                <Badge variant="outline">{kpi.dataSource}</Badge>
              </div>

              <div className="flex gap-2 pt-2">
                {kpi.status === "draft" && (
                  <Button
                    onClick={() => handleActivateKPI(kpi.id)}
                    size="sm"
                    variant="outline"
                    className="flex-1"
                  >
                    Activate
                  </Button>
                )}
                <Button
                  onClick={() => handleDeleteKPI(kpi.id)}
                  size="sm"
                  variant="ghost"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CustomKPIBuilder;
