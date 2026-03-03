import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type RevenueStream } from "@/lib/revenue-data";
import { X } from "lucide-react";

interface AddRevenueStreamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (stream: RevenueStream) => void;
}

const streamTypes = [
  { value: "subscription", label: "Subscription" },
  { value: "one-time", label: "One-time" },
  { value: "usage-based", label: "Usage-based" },
  { value: "commission", label: "Commission" },
  { value: "advertising", label: "Advertising" },
];

export function AddRevenueStreamDialog({
  open,
  onOpenChange,
  onAdd,
}: AddRevenueStreamDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    type: "subscription" as const,
    currentRevenue: "",
    forecastRevenue: "",
    growth: "",
    margin: "",
    customers: "",
    avgRevenuePerCustomer: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Stream name is required";
    }

    if (!formData.currentRevenue || Number(formData.currentRevenue) < 0) {
      newErrors.currentRevenue = "Current revenue must be a positive number";
    }

    if (!formData.forecastRevenue || Number(formData.forecastRevenue) < 0) {
      newErrors.forecastRevenue = "Forecast revenue must be a positive number";
    }

    if (formData.growth === "" || Number(formData.growth) < -100) {
      newErrors.growth = "Growth must be a valid percentage";
    }

    if (!formData.margin || Number(formData.margin) < 0 || Number(formData.margin) > 100) {
      newErrors.margin = "Margin must be between 0 and 100";
    }

    if (!formData.customers || Number(formData.customers) < 0) {
      newErrors.customers = "Customers must be a positive number";
    }

    if (!formData.avgRevenuePerCustomer || Number(formData.avgRevenuePerCustomer) < 0) {
      newErrors.avgRevenuePerCustomer =
        "Average revenue per customer must be a positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const newStream: RevenueStream = {
      id: Date.now().toString(),
      name: formData.name,
      type: formData.type as RevenueStream["type"],
      currentRevenue: Number(formData.currentRevenue),
      forecastRevenue: Number(formData.forecastRevenue),
      growth: Number(formData.growth),
      margin: Number(formData.margin),
      customers: Number(formData.customers),
      avgRevenuePerCustomer: Number(formData.avgRevenuePerCustomer),
    };

    onAdd(newStream);
    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      type: "subscription",
      currentRevenue: "",
      forecastRevenue: "",
      growth: "",
      margin: "",
      customers: "",
      avgRevenuePerCustomer: "",
    });
    setErrors({});
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetForm();
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-full max-w-sm sm:max-w-md mx-4">
        <DialogHeader>
          <DialogTitle>Add New Revenue Stream</DialogTitle>
          <DialogDescription>
            Enter the details of the new revenue stream to add it to your
            tracking system.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm font-medium text-gray-700">
              Stream Name *
            </label>
            <Input
              placeholder="e.g., Mobile App Subscriptions"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-xs sm:text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm font-medium text-gray-700">
              Stream Type *
            </label>
            <Select value={formData.type} onValueChange={(value) =>
              setFormData({ ...formData, type: value as any })
            }>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {streamTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm font-medium text-gray-700">
              Current Revenue ($) *
            </label>
            <Input
              type="number"
              placeholder="0"
              min="0"
              step="1"
              value={formData.currentRevenue}
              onChange={(e) =>
                setFormData({ ...formData, currentRevenue: e.target.value })
              }
              className={errors.currentRevenue ? "border-red-500" : ""}
            />
            {errors.currentRevenue && (
              <p className="text-xs sm:text-sm text-red-500">{errors.currentRevenue}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm font-medium text-gray-700">
              Forecast Revenue ($) *
            </label>
            <Input
              type="number"
              placeholder="0"
              min="0"
              step="1"
              value={formData.forecastRevenue}
              onChange={(e) =>
                setFormData({ ...formData, forecastRevenue: e.target.value })
              }
              className={errors.forecastRevenue ? "border-red-500" : ""}
            />
            {errors.forecastRevenue && (
              <p className="text-xs sm:text-sm text-red-500">{errors.forecastRevenue}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm font-medium text-gray-700">
              Growth Rate (%) *
            </label>
            <Input
              type="number"
              placeholder="0"
              step="0.1"
              value={formData.growth}
              onChange={(e) =>
                setFormData({ ...formData, growth: e.target.value })
              }
              className={errors.growth ? "border-red-500" : ""}
            />
            {errors.growth && (
              <p className="text-xs sm:text-sm text-red-500">{errors.growth}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm font-medium text-gray-700">
              Margin (%) *
            </label>
            <Input
              type="number"
              placeholder="0"
              min="0"
              max="100"
              step="0.1"
              value={formData.margin}
              onChange={(e) =>
                setFormData({ ...formData, margin: e.target.value })
              }
              className={errors.margin ? "border-red-500" : ""}
            />
            {errors.margin && (
              <p className="text-xs sm:text-sm text-red-500">{errors.margin}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm font-medium text-gray-700">
              Customers *
            </label>
            <Input
              type="number"
              placeholder="0"
              min="0"
              step="1"
              value={formData.customers}
              onChange={(e) =>
                setFormData({ ...formData, customers: e.target.value })
              }
              className={errors.customers ? "border-red-500" : ""}
            />
            {errors.customers && (
              <p className="text-xs sm:text-sm text-red-500">{errors.customers}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm font-medium text-gray-700">
              Avg Revenue Per Customer ($) *
            </label>
            <Input
              type="number"
              placeholder="0"
              min="0"
              step="1"
              value={formData.avgRevenuePerCustomer}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  avgRevenuePerCustomer: e.target.value,
                })
              }
              className={errors.avgRevenuePerCustomer ? "border-red-500" : ""}
            />
            {errors.avgRevenuePerCustomer && (
              <p className="text-xs sm:text-sm text-red-500">
                {errors.avgRevenuePerCustomer}
              </p>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-3 flex-col sm:flex-row pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto order-1 sm:order-2"
            >
              Add Stream
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
