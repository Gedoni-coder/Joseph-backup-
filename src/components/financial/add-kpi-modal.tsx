import React, { useState } from "react";
import { PerformanceDriver } from "../../lib/financial-advisory-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Slider } from "../ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { AlertTriangle, Plus } from "lucide-react";

interface AddKPIModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    kpi: Omit<
      PerformanceDriver,
      "id" | "createdAt" | "lastUpdated" | "kpiHistory"
    >,
  ) => void;
  linkedBudgetItems: string[];
}

export function AddKPIModal({
  isOpen,
  onClose,
  onSave,
  linkedBudgetItems,
}: AddKPIModalProps) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "financial" as PerformanceDriver["category"],
    currentValue: 0,
    targetValue: 0,
    unit: "%",
    driverType: "leading" as const,
    unitOfMeasure: "%" as PerformanceDriver["unitOfMeasure"],
    warningThreshold: 0,
    criticalThreshold: 0,
    dataSource: "manual" as const,
    status: "on_track" as const,
    impact: "medium" as const,
    trend: "stable" as const,
    linkedBudgetItems: [] as string[],
    driverLink: [] as string[],
  });

  const handleSave = () => {
    if (!form.name.trim()) return;
    setSaving(true);
    setTimeout(() => {
      onSave(form);
      setSaving(false);
      onClose();
      setForm({
        name: "",
        description: "",
        category: "financial",
        currentValue: 0,
        targetValue: 0,
        unit: "%",
        driverType: "leading",
        unitOfMeasure: "%",
        warningThreshold: 0,
        criticalThreshold: 0,
        dataSource: "manual",
        status: "on_track",
        impact: "medium",
        trend: "stable",
        linkedBudgetItems: [],
        driverLink: [],
      });
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="sticky top-0 bg-white border-b">
          <CardTitle>Add KPI</CardTitle>
          <CardDescription>
            Create a new key performance indicator
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  KPI Name *
                </label>
                <Input
                  placeholder="e.g., Customer Acquisition Cost"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Category
                </label>
                <Select
                  value={form.category}
                  onValueChange={(value: any) =>
                    setForm({ ...form, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="financial">Financial</SelectItem>
                    <SelectItem value="operational">Operational</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="productivity">Productivity</SelectItem>
                    <SelectItem value="risk">Risk</SelectItem>
                    <SelectItem value="growth">Growth</SelectItem>
                    <SelectItem value="revenue">Revenue</SelectItem>
                    <SelectItem value="cost">Cost</SelectItem>
                    <SelectItem value="efficiency">Efficiency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Description
              </label>
              <Textarea
                placeholder="What does this KPI measure?"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* KPI Type & Measurement */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-semibold text-gray-900">
              KPI Type & Measurement
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Driver Type
                </label>
                <Select
                  value={form.driverType}
                  onValueChange={(value: any) =>
                    setForm({ ...form, driverType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="leading">Leading Indicator</SelectItem>
                    <SelectItem value="lagging">Lagging Indicator</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Unit of Measure
                </label>
                <Select
                  value={form.unitOfMeasure}
                  onValueChange={(value: any) =>
                    setForm({ ...form, unitOfMeasure: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="%">Percentage (%)</SelectItem>
                    <SelectItem value="$">Currency ($)</SelectItem>
                    <SelectItem value="ratio">Ratio</SelectItem>
                    <SelectItem value="count">Count</SelectItem>
                    <SelectItem value="days">Days</SelectItem>
                    <SelectItem value="hours">Hours</SelectItem>
                    <SelectItem value="score">Score</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Impact Level
                </label>
                <Select
                  value={form.impact}
                  onValueChange={(value: any) =>
                    setForm({ ...form, impact: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Values & Targets */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-semibold text-gray-900">Values & Targets</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Current Value
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  value={form.currentValue}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      currentValue: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Target Value
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  value={form.targetValue}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      targetValue: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* Thresholds */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-semibold text-gray-900">Thresholds</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Warning Threshold
                  </label>
                  <span className="text-lg font-bold text-yellow-600">
                    {form.warningThreshold}
                  </span>
                </div>
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  value={[form.warningThreshold]}
                  onValueChange={(value) =>
                    setForm({ ...form, warningThreshold: value[0] })
                  }
                  className="w-full"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Critical Threshold
                  </label>
                  <span className="text-lg font-bold text-red-600">
                    {form.criticalThreshold}
                  </span>
                </div>
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  value={[form.criticalThreshold]}
                  onValueChange={(value) =>
                    setForm({ ...form, criticalThreshold: value[0] })
                  }
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Data Source */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-semibold text-gray-900">Data Source</h3>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Data Source Method
              </label>
              <Select
                value={form.dataSource}
                onValueChange={(value: any) =>
                  setForm({ ...form, dataSource: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manual Entry</SelectItem>
                  <SelectItem value="upload">Upload Data</SelectItem>
                  <SelectItem value="auto_sync">Auto-Sync</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Status */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-semibold text-gray-900">Status</h3>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Initial Status
              </label>
              <Select
                value={form.status}
                onValueChange={(value: any) =>
                  setForm({ ...form, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="on_track">On Track</SelectItem>
                  <SelectItem value="at_risk">At Risk</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="exceeding_target">
                    Exceeding Target
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 justify-end pt-4 border-t">
            <Button variant="outline" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || !form.name.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {saving ? "Creating..." : "Create KPI"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
