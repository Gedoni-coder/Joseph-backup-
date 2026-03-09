import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CreateSalesRepDialog from "./CreateSalesRepDialog";
import { Plus } from "lucide-react";

interface CreateSalesTargetFormProps {
  salesReps: Array<{ id: string; name: string }>;
  onSubmit: (data: CreateSalesTargetFormData) => void;
  onCancel: () => void;
  onSalesRepCreated?: (rep: { id: string; name: string }) => void;
}

export interface CreateSalesTargetFormData {
  salesRepId: string;
  salesRepName: string;
  targetPeriod: string;
  targetAmount: number;
  achievedAmount: number;
  status: string;
  dealsClosed: number;
  avgDealSize: number;
}

export default function CreateSalesTargetForm({
  salesReps,
  onSubmit,
  onCancel,
  onSalesRepCreated,
}: CreateSalesTargetFormProps) {
  const [formData, setFormData] = useState<CreateSalesTargetFormData>({
    salesRepId: "",
    salesRepName: "",
    targetPeriod: "",
    targetAmount: 0,
    achievedAmount: 0,
    status: "In Progress",
    dealsClosed: 0,
    avgDealSize: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [createRepOpen, setCreateRepOpen] = useState(false);
  const [currentSalesReps, setCurrentSalesReps] = useState(salesReps);

  const achievementPercentage = useMemo(() => {
    if (formData.targetAmount === 0) return 0;
    return (formData.achievedAmount / formData.targetAmount) * 100;
  }, [formData.targetAmount, formData.achievedAmount]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.salesRepId) {
      newErrors.salesRepId = "Sales representative is required";
    }
    if (!formData.targetPeriod.trim()) {
      newErrors.targetPeriod = "Target period is required";
    }
    if (formData.targetAmount <= 0) {
      newErrors.targetAmount = "Target amount must be greater than 0";
    }
    if (formData.achievedAmount < 0) {
      newErrors.achievedAmount = "Achieved amount cannot be negative";
    }
    if (formData.dealsClosed < 0) {
      newErrors.dealsClosed = "Deals closed cannot be negative";
    }
    if (formData.avgDealSize < 0) {
      newErrors.avgDealSize = "Average deal size cannot be negative";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSalesRepChange = (repId: string) => {
    const selectedRep = currentSalesReps.find((rep) => rep.id === repId);
    setFormData({
      ...formData,
      salesRepId: repId,
      salesRepName: selectedRep?.name || "",
    });
  };

  const handleSalesRepCreated = (newRep: { id: string; name: string }) => {
    // Add the new rep to the list
    setCurrentSalesReps([...currentSalesReps, newRep]);

    // Auto-select the newly created rep
    setFormData({
      ...formData,
      salesRepId: newRep.id,
      salesRepName: newRep.name,
    });

    // Notify parent component
    onSalesRepCreated?.(newRep);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        ...formData,
        // Calculate achievement % if not already set
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="salesRepId">Sales Representative</Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setCreateRepOpen(true)}
            className="text-xs h-auto py-0.5 px-2"
          >
            <Plus className="h-3 w-3 mr-1" />
            Create New
          </Button>
        </div>
        <Select value={formData.salesRepId} onValueChange={handleSalesRepChange}>
          <SelectTrigger
            id="salesRepId"
            className={errors.salesRepId ? "border-red-500" : ""}
          >
            <SelectValue placeholder="Select a sales representative" />
          </SelectTrigger>
          <SelectContent>
            {currentSalesReps.map((rep) => (
              <SelectItem key={rep.id} value={rep.id}>
                {rep.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.salesRepId && (
          <p className="text-xs text-red-500">{errors.salesRepId}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="targetPeriod">Target Period</Label>
        <Input
          id="targetPeriod"
          placeholder="e.g., January, Q1 2025, March (YTD)"
          value={formData.targetPeriod}
          onChange={(e) =>
            setFormData({ ...formData, targetPeriod: e.target.value })
          }
          className={errors.targetPeriod ? "border-red-500" : ""}
        />
        {errors.targetPeriod && (
          <p className="text-xs text-red-500">{errors.targetPeriod}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="targetAmount">Target ($)</Label>
          <Input
            id="targetAmount"
            type="number"
            placeholder="0"
            value={formData.targetAmount || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                targetAmount: parseFloat(e.target.value) || 0,
              })
            }
            className={errors.targetAmount ? "border-red-500" : ""}
          />
          {errors.targetAmount && (
            <p className="text-xs text-red-500">{errors.targetAmount}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="achievedAmount">Achieved ($)</Label>
          <Input
            id="achievedAmount"
            type="number"
            placeholder="0"
            value={formData.achievedAmount || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                achievedAmount: parseFloat(e.target.value) || 0,
              })
            }
            className={errors.achievedAmount ? "border-red-500" : ""}
          />
          {errors.achievedAmount && (
            <p className="text-xs text-red-500">{errors.achievedAmount}</p>
          )}
        </div>
      </div>

      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm font-semibold text-blue-900">
          Achievement %: <span className="text-lg">{achievementPercentage.toFixed(1)}%</span>
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select value={formData.status} onValueChange={(value) =>
          setFormData({ ...formData, status: value })
        }>
          <SelectTrigger id="status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="✓ Achieved">Achieved</SelectItem>
            <SelectItem value="At Risk">At Risk</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dealsClosed">Deals Closed</Label>
          <Input
            id="dealsClosed"
            type="number"
            placeholder="0"
            value={formData.dealsClosed || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                dealsClosed: parseInt(e.target.value) || 0,
              })
            }
            className={errors.dealsClosed ? "border-red-500" : ""}
          />
          {errors.dealsClosed && (
            <p className="text-xs text-red-500">{errors.dealsClosed}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="avgDealSize">Avg Deal Size ($)</Label>
          <Input
            id="avgDealSize"
            type="number"
            placeholder="0"
            value={formData.avgDealSize || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                avgDealSize: parseFloat(e.target.value) || 0,
              })
            }
            className={errors.avgDealSize ? "border-red-500" : ""}
          />
          {errors.avgDealSize && (
            <p className="text-xs text-red-500">{errors.avgDealSize}</p>
          )}
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          Back
        </Button>
        <Button type="submit" className="flex-1">
          Create Target
        </Button>
      </div>

      <CreateSalesRepDialog
        open={createRepOpen}
        onOpenChange={setCreateRepOpen}
        onRepCreated={handleSalesRepCreated}
      />
    </form>
  );
}
