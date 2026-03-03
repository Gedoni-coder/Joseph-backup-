import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ModuleHeader from "@/components/ui/module-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, FileText, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BusinessPlanFull as BusinessPlan } from "@/mocks/business-planning";
import { createEmptyBusinessPlan } from "@/mocks/business-planning";
import { STORAGE_KEYS } from "@/lib/app-config";

// Use mock data configuration for storage key
const STORAGE_KEY = STORAGE_KEYS.BUSINESS_PLANS;

function extractBusinessName(idea: string): string {
  const words = idea.split(" ");
  const businessName = words.slice(0, Math.min(3, words.length)).join(" ");
  return businessName || "My Business Plan";
}

export function BusinessPlanningContent() {
  const navigate = useNavigate();
  const [planInput, setPlanInput] = useState("");
  const [plans, setPlans] = useState<BusinessPlan[]>([]);

  // Load plans from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setPlans(JSON.parse(raw));
    } catch {}
  }, []);

  // Save plans to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
    } catch {}
  }, [plans]);

  const startPlan = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = planInput.trim();
    if (!text) return;

    // Create new plan without requiring a feasibility ID
    const plan = createEmptyBusinessPlan("", text);
    plan.businessName = extractBusinessName(text);

    setPlans((prev) => [plan, ...prev]);
    setPlanInput("");

    // Navigate to the planning flow
    setTimeout(() => {
      navigate(`/business-planning-flow/${plan.id}`);
    }, 100);
  };

  const deletePlan = (id: string) => {
    setPlans((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <>
      {/* Plan Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Make a Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={startPlan} className="flex gap-2">
            <Input
              value={planInput}
              onChange={(e) => setPlanInput(e.target.value)}
              placeholder="Make a Plan"
            />
            <Button type="submit">Plan</Button>
          </form>
          <div className="text-xs text-muted-foreground mt-2">
            Tip: describe your business idea or concept to get started with
            planning.
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Past Business Plans</h3>
          <Badge variant="secondary">{plans.length}</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {plans.map((plan) => {
            const completedSteps = plan.steps.filter(
              (s) => s.status === "completed",
            ).length;
            const progress = Math.round(
              (completedSteps / plan.steps.length) * 100,
            );

            return (
              <Card
                key={plan.id}
                className={cn(
                  "cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 bg-gradient-to-br from-white to-muted/20",
                )}
                onClick={() => {
                  navigate(`/business-planning-flow/${plan.id}`);
                }}
              >
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded bg-blue-100 text-blue-700">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium line-clamp-2">
                        {plan.businessName || plan.idea}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {new Date(plan.createdAt).toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {completedSteps}/{plan.steps.length} steps completed
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        deletePlan(plan.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">Progress</span>
                      <span className="text-xs text-muted-foreground">
                        {progress}%
                      </span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="default"
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/business-planning-flow/${plan.id}`);
                    }}
                  >
                    Continue Planning
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
        {plans.length === 0 && (
          <div className="text-xs text-muted-foreground">
            No business plans created yet. Enter a plan idea above to get
            started.
          </div>
        )}
      </div>
    </>
  );
}

export default function BusinessPlanning() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <ModuleHeader
        icon={<CheckCircle className="h-6 w-6" />}
        title="Business Planning"
        description="Create comprehensive, investor-ready business plans tailored to your business"
        showConnectionStatus={false}
      />

      <main className="container mx-auto px-4 py-8 space-y-8">
        <BusinessPlanningContent />
      </main>
    </div>
  );
}
