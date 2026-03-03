import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, AlertCircle } from "lucide-react";
import { useCurrency } from "@/lib/currency-context";

export interface RevenueTargets {
  annualRevenue: number;
  monthlyRevenue: number;
  q1Revenue: number;
  q2Revenue: number;
  q3Revenue: number;
  q4Revenue: number;
}

interface RevenueTargetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (targets: RevenueTargets) => void;
  initialTargets?: RevenueTargets;
}

export function RevenueTargetsModal({
  isOpen,
  onClose,
  onSave,
  initialTargets,
}: RevenueTargetsModalProps) {
  const { formatCurrency } = useCurrency();
  
  const [annualRevenue, setAnnualRevenue] = useState(
    initialTargets?.annualRevenue || ""
  );
  const [monthlyRevenue, setMonthlyRevenue] = useState(
    initialTargets?.monthlyRevenue || ""
  );
  const [q1Revenue, setQ1Revenue] = useState(initialTargets?.q1Revenue || "");
  const [q2Revenue, setQ2Revenue] = useState(initialTargets?.q2Revenue || "");
  const [q3Revenue, setQ3Revenue] = useState(initialTargets?.q3Revenue || "");
  const [q4Revenue, setQ4Revenue] = useState(initialTargets?.q4Revenue || "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateAndSave = () => {
    const newErrors: Record<string, string> = {};

    if (!annualRevenue) newErrors.annualRevenue = "Annual revenue is required";
    else if (isNaN(Number(annualRevenue)) || Number(annualRevenue) < 0)
      newErrors.annualRevenue = "Must be a valid number";

    if (!monthlyRevenue) newErrors.monthlyRevenue = "Monthly revenue is required";
    else if (isNaN(Number(monthlyRevenue)) || Number(monthlyRevenue) < 0)
      newErrors.monthlyRevenue = "Must be a valid number";

    if (!q1Revenue) newErrors.q1Revenue = "Q1 revenue is required";
    else if (isNaN(Number(q1Revenue)) || Number(q1Revenue) < 0)
      newErrors.q1Revenue = "Must be a valid number";

    if (!q2Revenue) newErrors.q2Revenue = "Q2 revenue is required";
    else if (isNaN(Number(q2Revenue)) || Number(q2Revenue) < 0)
      newErrors.q2Revenue = "Must be a valid number";

    if (!q3Revenue) newErrors.q3Revenue = "Q3 revenue is required";
    else if (isNaN(Number(q3Revenue)) || Number(q3Revenue) < 0)
      newErrors.q3Revenue = "Must be a valid number";

    if (!q4Revenue) newErrors.q4Revenue = "Q4 revenue is required";
    else if (isNaN(Number(q4Revenue)) || Number(q4Revenue) < 0)
      newErrors.q4Revenue = "Must be a valid number";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Validate quarterly total matches annual
    const quarterlyTotal =
      Number(q1Revenue) + Number(q2Revenue) + Number(q3Revenue) + Number(q4Revenue);
    if (quarterlyTotal !== Number(annualRevenue)) {
      setErrors({
        quarterly: `Quarterly totals (${formatCurrency(quarterlyTotal)}) do not match annual revenue (${formatCurrency(Number(annualRevenue))})`,
      });
      return;
    }

    onSave({
      annualRevenue: Number(annualRevenue),
      monthlyRevenue: Number(monthlyRevenue),
      q1Revenue: Number(q1Revenue),
      q2Revenue: Number(q2Revenue),
      q3Revenue: Number(q3Revenue),
      q4Revenue: Number(q4Revenue),
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white flex items-center justify-between">
          <CardTitle className="text-xl">Set Revenue Targets</CardTitle>
          <button
            onClick={onClose}
            className="text-white hover:bg-blue-700 rounded-lg p-1 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          <p className="text-sm text-gray-600">
            Define your revenue goals for the year. These targets will be used to
            monitor and project your financial performance.
          </p>

          {/* Annual Revenue */}
          <div>
            <Label htmlFor="annualRevenue" className="text-sm font-medium">
              How much revenue do you want to make this year?
            </Label>
            <Input
              id="annualRevenue"
              type="number"
              value={annualRevenue}
              onChange={(e) => {
                setAnnualRevenue(e.target.value);
                setErrors((prev) => {
                  const newErrors = { ...prev };
                  delete newErrors.annualRevenue;
                  delete newErrors.quarterly;
                  return newErrors;
                });
              }}
              placeholder="0"
              min="0"
              className={`mt-1 ${errors.annualRevenue ? "border-red-500" : ""}`}
            />
            {errors.annualRevenue && (
              <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.annualRevenue}
              </p>
            )}
          </div>

          {/* Monthly Revenue */}
          <div>
            <Label htmlFor="monthlyRevenue" className="text-sm font-medium">
              How much revenue do you want to generate each month?
            </Label>
            <Input
              id="monthlyRevenue"
              type="number"
              value={monthlyRevenue}
              onChange={(e) => {
                setMonthlyRevenue(e.target.value);
                setErrors((prev) => {
                  const newErrors = { ...prev };
                  delete newErrors.monthlyRevenue;
                  return newErrors;
                });
              }}
              placeholder="0"
              min="0"
              className={`mt-1 ${errors.monthlyRevenue ? "border-red-500" : ""}`}
            />
            {errors.monthlyRevenue && (
              <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.monthlyRevenue}
              </p>
            )}
          </div>

          {/* Quarterly Breakdown */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-4">
              Quarterly Revenue Targets
            </h4>
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: "q1", label: "Q1 Revenue", value: q1Revenue, setValue: setQ1Revenue },
                { id: "q2", label: "Q2 Revenue", value: q2Revenue, setValue: setQ2Revenue },
                { id: "q3", label: "Q3 Revenue", value: q3Revenue, setValue: setQ3Revenue },
                { id: "q4", label: "Q4 Revenue", value: q4Revenue, setValue: setQ4Revenue },
              ].map(({ id, label, value, setValue }) => (
                <div key={id}>
                  <Label htmlFor={id} className="text-sm font-medium">
                    {label}
                  </Label>
                  <Input
                    id={id}
                    type="number"
                    value={value}
                    onChange={(e) => {
                      setValue(e.target.value);
                      setErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors.quarterly;
                        delete newErrors[id];
                        return newErrors;
                      });
                    }}
                    placeholder="0"
                    min="0"
                    className={`mt-1 ${errors[id] ? "border-red-500" : ""}`}
                  />
                  {errors[id] && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors[id]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {errors.quarterly && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {errors.quarterly}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="button"
              onClick={validateAndSave}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Save Revenue Targets
            </Button>
            <Button type="button" onClick={onClose} variant="outline" className="flex-1">
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
