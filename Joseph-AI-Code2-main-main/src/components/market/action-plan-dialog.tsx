import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2 } from "lucide-react";

interface ActionPlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportTitle?: string;
}

interface ActionPlanFormData {
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "critical";
  owner: string;
  timeline: "immediate" | "short-term" | "medium-term" | "long-term";
  targetDate: string;
  budget: string;
  resources: string;
  successMetrics: string;
  risks: string;
  mitigation: string;
}

export function ActionPlanDialog({
  open,
  onOpenChange,
  reportTitle = "Market Analysis",
}: ActionPlanDialogProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ActionPlanFormData>({
    title: "",
    description: "",
    priority: "medium",
    owner: "",
    timeline: "short-term",
    targetDate: "",
    budget: "",
    resources: "",
    successMetrics: "",
    risks: "",
    mitigation: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    field: keyof ActionPlanFormData,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.title.trim() || !formData.description.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (!formData.targetDate) {
      toast({
        title: "Missing Date",
        description: "Please set a target completion date",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      toast({
        title: "Action Plan Created",
        description: `"${formData.title}" has been created and saved successfully.`,
      });

      // Reset form and close dialog
      setFormData({
        title: "",
        description: "",
        priority: "medium",
        owner: "",
        timeline: "short-term",
        targetDate: "",
        budget: "",
        resources: "",
        successMetrics: "",
        risks: "",
        mitigation: "",
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create action plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Action Plan</DialogTitle>
          <DialogDescription>
            Based on: <span className="font-semibold">{reportTitle}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Title */}
          <div>
            <Label htmlFor="plan-title">Action Plan Title *</Label>
            <Input
              id="plan-title"
              placeholder="e.g., Implement Premium Market Positioning Strategy"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="plan-description">Description & Objectives *</Label>
            <Textarea
              id="plan-description"
              placeholder="Describe what you want to accomplish and explain your vision for this action plan..."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          {/* Priority & Owner Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="plan-priority">Priority Level</Label>
              <select
                id="plan-priority"
                value={formData.priority}
                onChange={(e) =>
                  handleInputChange("priority", e.target.value)
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div>
              <Label htmlFor="plan-owner">Responsible Owner</Label>
              <Input
                id="plan-owner"
                placeholder="Person or team responsible"
                value={formData.owner}
                onChange={(e) => handleInputChange("owner", e.target.value)}
              />
            </div>
          </div>

          {/* Timeline & Target Date Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="plan-timeline">Timeline</Label>
              <select
                id="plan-timeline"
                value={formData.timeline}
                onChange={(e) =>
                  handleInputChange("timeline", e.target.value)
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="immediate">Immediate (0-1 week)</option>
                <option value="short-term">Short-term (1-3 months)</option>
                <option value="medium-term">Medium-term (3-6 months)</option>
                <option value="long-term">Long-term (6+ months)</option>
              </select>
            </div>
            <div>
              <Label htmlFor="plan-target-date">Target Completion Date *</Label>
              <Input
                id="plan-target-date"
                type="date"
                value={formData.targetDate}
                onChange={(e) =>
                  handleInputChange("targetDate", e.target.value)
                }
              />
            </div>
          </div>

          {/* Budget & Resources Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="plan-budget">Budget</Label>
              <Input
                id="plan-budget"
                placeholder="e.g., $50,000"
                value={formData.budget}
                onChange={(e) => handleInputChange("budget", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="plan-resources">Required Resources</Label>
              <Input
                id="plan-resources"
                placeholder="e.g., Team, Tools, Infrastructure"
                value={formData.resources}
                onChange={(e) => handleInputChange("resources", e.target.value)}
              />
            </div>
          </div>

          {/* Success Metrics */}
          <div>
            <Label htmlFor="plan-metrics">Success Metrics & KPIs</Label>
            <Textarea
              id="plan-metrics"
              placeholder="Define how you'll measure success (one per line)"
              value={formData.successMetrics}
              onChange={(e) =>
                handleInputChange("successMetrics", e.target.value)
              }
              className="min-h-[80px]"
            />
          </div>

          {/* Risks */}
          <div>
            <Label htmlFor="plan-risks">Potential Risks</Label>
            <Textarea
              id="plan-risks"
              placeholder="Identify potential risks and obstacles"
              value={formData.risks}
              onChange={(e) => handleInputChange("risks", e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          {/* Mitigation */}
          <div>
            <Label htmlFor="plan-mitigation">Risk Mitigation Strategy</Label>
            <Textarea
              id="plan-mitigation"
              placeholder="How will you mitigate or address these risks?"
              value={formData.mitigation}
              onChange={(e) =>
                handleInputChange("mitigation", e.target.value)
              }
              className="min-h-[80px]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            {isSubmitting ? "Creating..." : "Create Action Plan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
