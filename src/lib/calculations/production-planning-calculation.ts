/**
 * Production Planning Calculation Utilities
 * Contains all business logic for production planning calculations
 */

import { ProductionPlan, MaterialRequirement, Bottleneck } from "@/lib/supply-chain-data";

export type ProductionStatus = "planned" | "in-progress" | "completed" | "delayed" | "cancelled";
export type Priority = "low" | "medium" | "high";
export type Criticality = "low" | "medium" | "high";

export interface ProductionMetrics {
  planId: string;
  productName: string;
  status: ProductionStatus;
  priority: Priority;
  efficiency: number;
  progress: number;
  isDelayed: boolean;
  daysRemaining: number;
  costVariance: number;
  materialStatus: "healthy" | "warning" | "critical";
}

export interface ProductionSummary {
  totalPlans: number;
  activePlans: number;
  completedPlans: number;
  delayedPlans: number;
  averageEfficiency: number;
  totalPlannedQuantity: number;
  totalActualQuantity: number;
  overallProgress: number;
  criticalBottlenecks: BottleneckInfo[];
  materialShortfalls: MaterialShortfallInfo[];
}

export interface BottleneckInfo {
  planId: string;
  productName: string;
  bottleneckType: string;
  description: string;
  impact: string;
  estimatedDelay: number;
  mitigationActions: string[];
}

export interface MaterialShortfallInfo {
  planId: string;
  productName: string;
  materialName: string;
  requiredQuantity: number;
  availableQuantity: number;
  shortfall: number;
  criticality: Criticality;
}

/**
 * Calculate production progress percentage
 * @param plannedQuantity - Planned production quantity
 * @param actualQuantity - Actual production quantity
 * @returns Progress percentage
 */
export function calculateProductionProgress(plannedQuantity: number, actualQuantity: number): number {
  if (plannedQuantity <= 0) return 0;
  return Math.round((actualQuantity / plannedQuantity) * 100 * 10) / 10;
}

/**
 * Calculate production efficiency
 * @param actualQuantity - Actual quantity produced
 * @param plannedQuantity - Planned quantity
 * @returns Efficiency percentage
 */
export function calculateProductionEfficiency(actualQuantity: number, plannedQuantity: number): number {
  if (plannedQuantity <= 0) return 0;
  return Math.round((actualQuantity / plannedQuantity) * 100 * 10) / 10;
}

/**
 * Calculate cost variance
 * @param actualCost - Actual cost
 * @param plannedCost - Planned cost
 * @returns Cost variance percentage
 */
export function calculateCostVariance(actualCost: number, plannedCost: number): number {
  if (plannedCost <= 0) return 0;
  return Math.round(((actualCost - plannedCost) / plannedCost) * 100 * 10) / 10;
}

/**
 * Determine if production is delayed
 * @param endDate - Planned end date
 * @param status - Production status
 * @returns True if delayed
 */
export function isProductionDelayed(endDate: Date, status: ProductionStatus): boolean {
  if (status === "completed" || status === "cancelled") return false;
  return new Date() > endDate;
}

/**
 * Calculate days remaining
 * @param endDate - End date
 * @returns Days remaining (negative if overdue)
 */
export function calculateDaysRemaining(endDate: Date): number {
  const now = new Date();
  const diffTime = endDate.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Determine material status
 * @param required - Required quantity
 * @param available - Available quantity
 * @returns Material status
 */
export function determineMaterialStatus(required: number, available: number): "healthy" | "warning" | "critical" {
  if (required <= 0) return "healthy";
  const ratio = available / required;
  if (ratio >= 1) return "healthy";
  if (ratio >= 0.7) return "warning";
  return "critical";
}

/**
 * Calculate material shortfall
 * @param required - Required quantity
 * @param available - Available quantity
 * @returns Shortfall quantity
 */
export function calculateMaterialShortfall(required: number, available: number): number {
  return Math.max(0, required - available);
}

/**
 * Get priority weight
 * @param priority - Priority level
 * @returns Weight number
 */
export function getPriorityWeight(priority: Priority): number {
  switch (priority) {
    case "high": return 3;
    case "medium": return 2;
    case "low": return 1;
    default: return 0;
  }
}

/**
 * Calculate metrics for a single production plan
 * @param plan - Production plan
 * @returns Production metrics
 */
export function calculatePlanMetrics(plan: ProductionPlan): ProductionMetrics {
  const progress = calculateProductionProgress(plan.plannedQuantity, plan.actualQuantity);
  const isDelayed = isProductionDelayed(plan.endDate, plan.status);
  const daysRemaining = calculateDaysRemaining(plan.endDate);
  
  // Determine material status from requirements
  let materialStatus: "healthy" | "warning" | "critical" = "healthy";
  plan.requiredMaterials.forEach(mat => {
    const status = determineMaterialStatus(mat.requiredQuantity, mat.availableQuantity);
    if (status === "critical") materialStatus = "critical";
    else if (status === "warning" && materialStatus === "healthy") materialStatus = "warning";
  });
  
  return {
    planId: plan.id,
    productName: plan.productName,
    status: plan.status,
    priority: plan.priority,
    efficiency: plan.efficiency,
    progress,
    isDelayed,
    daysRemaining,
    costVariance: plan.costVariance,
    materialStatus
  };
}

/**
 * Calculate metrics for all production plans
 * @param plans - Array of production plans
 * @returns Array of metrics
 */
export function calculateAllPlanMetrics(plans: ProductionPlan[]): ProductionMetrics[] {
  return plans.map(calculatePlanMetrics);
}

/**
 * Calculate production summary
 * @param plans - Array of production plans
 * @returns Summary metrics
 */
export function calculateProductionSummary(plans: ProductionPlan[]): ProductionSummary {
  if (plans.length === 0) {
    return {
      totalPlans: 0,
      activePlans: 0,
      completedPlans: 0,
      delayedPlans: 0,
      averageEfficiency: 0,
      totalPlannedQuantity: 0,
      totalActualQuantity: 0,
      overallProgress: 0,
      criticalBottlenecks: [],
      materialShortfalls: []
    };
  }
  
  const activePlans = plans.filter(p => p.status === "in-progress").length;
  const completedPlans = plans.filter(p => p.status === "completed").length;
  const delayedPlans = plans.filter(p => p.status === "delayed").length;
  
  const totalPlannedQuantity = plans.reduce((sum, p) => sum + p.plannedQuantity, 0);
  const totalActualQuantity = plans.reduce((sum, p) => sum + p.actualQuantity, 0);
  
  const averageEfficiency = Math.round(
    plans.reduce((sum, p) => sum + p.efficiency, 0) / plans.length * 10
  ) / 10;
  
  const overallProgress = calculateProductionProgress(totalPlannedQuantity, totalActualQuantity);
  
  // Collect critical bottlenecks
  const criticalBottlenecks: BottleneckInfo[] = [];
  plans.forEach(plan => {
    plan.bottlenecks.forEach(b => {
      if (b.impact === "high") {
        criticalBottlenecks.push({
          planId: plan.id,
          productName: plan.productName,
          bottleneckType: b.type,
          description: b.description,
          impact: b.impact,
          estimatedDelay: b.estimatedDelay,
          mitigationActions: b.mitigationActions
        });
      }
    });
  });
  
  // Collect material shortfalls
  const materialShortfalls: MaterialShortfallInfo[] = [];
  plans.forEach(plan => {
    plan.requiredMaterials.forEach(mat => {
      const shortfall = calculateMaterialShortfall(mat.requiredQuantity, mat.availableQuantity);
      if (shortfall > 0) {
        materialShortfalls.push({
          planId: plan.id,
          productName: plan.productName,
          materialName: mat.materialName,
          requiredQuantity: mat.requiredQuantity,
          availableQuantity: mat.availableQuantity,
          shortfall,
          criticality: mat.criticality
        });
      }
    });
  });
  
  return {
    totalPlans: plans.length,
    activePlans,
    completedPlans,
    delayedPlans,
    averageEfficiency,
    totalPlannedQuantity,
    totalActualQuantity,
    overallProgress,
    criticalBottlenecks,
    materialShortfalls
  };
}

/**
 * Get plans by status
 * @param plans - Array of production plans
 * @param status - Status to filter
 * @returns Filtered plans
 */
export function getPlansByStatus(plans: ProductionPlan[], status: ProductionStatus): ProductionPlan[] {
  return plans.filter(p => p.status === status);
}

/**
 * Get delayed plans
 * @param plans - Array of production plans
 * @returns Delayed plans
 */
export function getDelayedPlans(plans: ProductionPlan[]): ProductionPlan[] {
  return plans.filter(p => isProductionDelayed(p.endDate, p.status));
}

/**
 * Get critical material shortfalls
 * @param plans - Array of production plans
 * @returns Critical shortfalls
 */
export function getCriticalShortfalls(plans: ProductionPlan[]): MaterialShortfallInfo[] {
  const shortfalls: MaterialShortfallInfo[] = [];
  plans.forEach(plan => {
    plan.requiredMaterials.forEach(mat => {
      const shortfall = calculateMaterialShortfall(mat.requiredQuantity, mat.availableQuantity);
      if (shortfall > 0 && mat.criticality === "high") {
        shortfalls.push({
          planId: plan.id,
          productName: plan.productName,
          materialName: mat.materialName,
          requiredQuantity: mat.requiredQuantity,
          availableQuantity: mat.availableQuantity,
          shortfall,
          criticality: mat.criticality
        });
      }
    });
  });
  return shortfalls.sort((a, b) => b.shortfall - a.shortfall);
}

/**
 * Format efficiency for display
 * @param efficiency - Efficiency percentage
 * @returns Formatted string
 */
export function formatEfficiency(efficiency: number): string {
  if (efficiency >= 100) return `${efficiency.toFixed(1)}% (Excellent)`;
  if (efficiency >= 85) return `${efficiency.toFixed(1)}% (Good)`;
  if (efficiency >= 70) return `${efficiency.toFixed(1)}% (Fair)`;
  return `${efficiency.toFixed(1)}% (Needs Attention)`;
}

/**
 * Get status color
 * @param status - Production status
 * @returns Color hex code
 */
export function getStatusColor(status: ProductionStatus): string {
  switch (status) {
    case "planned": return "#6b7280";
    case "in-progress": return "#3b82f6";
    case "completed": return "#22c55e";
    case "delayed": return "#ef4444";
    case "cancelled": return "#9ca3af";
    default: return "#6b7280";
  }
}

