import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ModuleHeader from "@/components/ui/module-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Trash2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BusinessPlan } from "@/lib/business-planning-types";

const STORAGE_KEY = "joseph_business_plans_v1";

export default function BusinessPlansList() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<BusinessPlan[]>([]);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const loadedPlans: BusinessPlan[] = stored ? JSON.parse(stored) : [];
    setPlans(loadedPlans);
  };

  const deletePlan = (id: string) => {
    const filtered = plans.filter((p) => p.id !== id);
    setPlans(filtered);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  };

  const getProgressPercentage = (plan: BusinessPlan) => {
    const completed = plan.steps.filter((s) => s.status === "completed").length;
    return Math.round((completed / plan.steps.length) * 100);
  };

  const getStatusBadge = (plan: BusinessPlan) => {
    const completed = plan.steps.filter((s) => s.status === "completed").length;
    if (completed === 0) return <Badge variant="secondary">Not Started</Badge>;
    if (completed === plan.steps.length) return <Badge variant="default" className="bg-green-600">Completed</Badge>;
    return <Badge variant="outline">In Progress</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <ModuleHeader
        icon={<CheckCircle className="h-6 w-6" />}
        title="My Business Plans"
        description="Manage and view all your business plans created through the Business Planning workflow"
        showConnectionStatus={false}
      />

      <main className="container mx-auto px-4 py-8">
        {plans.length === 0 ? (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <CheckCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No Business Plans Yet</h3>
              <p className="text-muted-foreground mb-6">
                Start creating a business plan from a feasibility analysis to see your plans here.
              </p>
              <Button onClick={() => navigate("/business-feasibility")}>
                Go to Business Feasibility
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {plans.map((plan) => {
              const progress = getProgressPercentage(plan);
              const completedSteps = plan.steps.filter((s) => s.status === "completed").length;

              return (
                <Card
                  key={plan.id}
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1",
                    "bg-gradient-to-br from-white to-muted/20"
                  )}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="line-clamp-2">{plan.businessName}</CardTitle>
                        <p className="text-xs text-muted-foreground mt-1">
                          Created {new Date(plan.createdAt).toLocaleDateString()}
                        </p>
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
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium">Progress</span>
                        <span className="text-xs text-muted-foreground">
                          {completedSteps}/{plan.steps.length} steps
                        </span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getStatusBadge(plan)}
                        <span className="text-xs text-muted-foreground">{progress}%</span>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-2">
                      Based on: {plan.idea}
                    </p>

                    <Button
                      className="w-full gap-2"
                      onClick={() => navigate(`/business-planning/${plan.feasibilityId}`)}
                    >
                      Continue Planning
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
