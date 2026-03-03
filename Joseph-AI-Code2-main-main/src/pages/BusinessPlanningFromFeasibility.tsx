import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  STORAGE_KEY as FEASIBILITY_STORAGE_KEY,
  FeasibilityReport,
} from "@/lib/feasibility";
import { createEmptyBusinessPlan } from "@/lib/business-planning-types";
import type { BusinessPlan } from "@/lib/business-planning-types";

const BUSINESS_PLANS_STORAGE_KEY = "joseph_business_plans_v1";

export default function BusinessPlanningFromFeasibility() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!id) {
      navigate("/business-planning", { replace: true });
      return;
    }

    try {
      // Load feasibility reports from localStorage
      const feasibilityData = localStorage.getItem(FEASIBILITY_STORAGE_KEY);
      const reports: FeasibilityReport[] = feasibilityData
        ? JSON.parse(feasibilityData)
        : [];

      // Find the specific feasibility report
      const report = reports.find((r) => r.id === id);

      if (!report) {
        toast({
          title: "Feasibility Report Not Found",
          description:
            "The feasibility report you're trying to use no longer exists.",
          variant: "destructive",
        });
        navigate("/business-planning", { replace: true });
        return;
      }

      // Create a new business plan from the feasibility report
      const plan = createEmptyBusinessPlan(id, report.idea);
      plan.businessName = report.idea;

      // Save the new plan to localStorage
      const existingPlans = localStorage.getItem(BUSINESS_PLANS_STORAGE_KEY);
      const plans: BusinessPlan[] = existingPlans
        ? JSON.parse(existingPlans)
        : [];
      plans.unshift(plan);
      localStorage.setItem(BUSINESS_PLANS_STORAGE_KEY, JSON.stringify(plans));

      // Navigate to the planning flow
      navigate(`/business-planning-flow/${plan.id}`, { replace: true });
    } catch (error) {
      console.error("Error creating business plan from feasibility:", error);
      toast({
        title: "Error",
        description: "Failed to create business plan from feasibility report.",
        variant: "destructive",
      });
      navigate("/business-planning", { replace: true });
    }
  }, [id, navigate, toast]);

  // This component doesn't render anything - it just handles the redirect
  return null;
}
