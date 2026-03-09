/**
 * KPI Calculation Utilities
 * Contains all business logic for KPI calculations
 */

import { KPI } from "@/lib/business-forecast-data";

/**
 * Calculate progress percentage toward KPI target
 * @param current - Current value
 * @param target - Target value
 * @returns Progress percentage (0-100+)
 */
export function calculateKPIProgress(current: number, target: number): number {
  if (!target || target === 0) return 0;
  const progress = (current / target) * 100;
  return Math.round(progress);
}

/**
 * Determine KPI status based on progress
 * @param progress - Progress percentage
 * @returns Status string: "Excellent", "Good", "Fair", or "Needs Attention"
 */
export function determineKPIStatus(progress: number): string {
  if (progress >= 95) return "Excellent";
  if (progress >= 80) return "Good";
  if (progress >= 60) return "Fair";
  return "Needs Attention";
}

/**
 * Determine KPI status for display (Good/Fair/Needs Attention)
 * @param progress - Progress percentage
 * @returns Simplified status
 */
export function determineSimpleStatus(progress: number): "Good" | "Fair" | "Needs Attention" {
  if (progress >= 80) return "Good";
  if (progress >= 60) return "Fair";
  return "Needs Attention";
}

/**
 * Get status color class based on status
 * @param status - KPI status
 * @returns Color class string
 */
export function getStatusColor(status: string): string {
  switch (status) {
    case "Excellent":
    case "Good":
      return "text-economic-positive";
    case "Fair":
      return "text-economic-warning";
    case "Needs Attention":
      return "text-economic-negative";
    default:
      return "text-muted-foreground";
  }
}

/**
 * Get status badge variant based on status
 * @param status - KPI status
 * @returns Badge variant
 */
export function getStatusBadgeVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "Excellent":
    case "Good":
      return "default";
    case "Fair":
      return "secondary";
    case "Needs Attention":
      return "destructive";
    default:
      return "outline";
  }
}

/**
 * Calculate KPI summary counts by status
 * @param kpis - Array of KPIs
 * @returns Object with counts
 */
export function calculateKPISummary(kpis: KPI[]): {
  excellent: number;
  good: number;
  fair: number;
  needsAttention: number;
  total: number;
} {
  const summary = {
    excellent: 0,
    good: 0,
    fair: 0,
    needsAttention: 0,
    total: kpis.length,
  };

  kpis.forEach((kpi) => {
    const progress = calculateKPIProgress(kpi.current, kpi.target);
    const status = determineKPIStatus(progress);
    
    switch (status) {
      case "Excellent":
        summary.excellent++;
        break;
      case "Good":
        summary.good++;
        break;
      case "Fair":
        summary.fair++;
        break;
      case "Needs Attention":
        summary.needsAttention++;
        break;
    }
  });

  return summary;
}

/**
 * Group KPIs by category
 * @param kpis - Array of KPIs
 * @returns Object with KPIs grouped by category
 */
export function groupKPIsByCategory(kpis: KPI[]): Record<string, KPI[]> {
  return kpis.reduce((acc, kpi) => {
    const category = kpi.category || "Other";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(kpi);
    return acc;
  }, {} as Record<string, KPI[]>);
}

/**
 * Group KPIs by frequency
 * @param kpis - Array of KPIs
 * @returns Object with KPIs grouped by frequency
 */
export function groupKPIsByFrequency(kpis: KPI[]): Record<string, KPI[]> {
  return kpis.reduce((acc, kpi) => {
    const frequency = kpi.frequency || "Other";
    if (!acc[frequency]) {
      acc[frequency] = [];
    }
    acc[frequency].push(kpi);
    return acc;
  }, {} as Record<string, KPI[]>);
}

/**
 * Get top performing KPIs
 * @param kpis - Array of KPIs
 * @param count - Number of KPIs to return
 * @returns Array of top performing KPIs
 */
export function getTopPerformingKPIs(kpis: KPI[], count: number = 5): KPI[] {
  return [...kpis]
    .sort((a, b) => {
      const progressA = calculateKPIProgress(a.current, a.target);
      const progressB = calculateKPIProgress(b.current, b.target);
      return progressB - progressA;
    })
    .slice(0, count);
}

/**
 * Get KPIs needing attention
 * @param kpis - Array of KPIs
 * @returns Array of KPIs below target
 */
export function getKPIsNeedingAttention(kpis: KPI[]): KPI[] {
  return kpis.filter((kpi) => {
    const progress = calculateKPIProgress(kpi.current, kpi.target);
    return progress < 80;
  });
}

/**
 * Calculate average progress across all KPIs
 * @param kpis - Array of KPIs
 * @returns Average progress percentage
 */
export function calculateAverageKPIProgress(kpis: KPI[]): number {
  if (kpis.length === 0) return 0;
  
  const totalProgress = kpis.reduce((sum, kpi) => {
    return sum + calculateKPIProgress(kpi.current, kpi.target);
  }, 0);
  
  return Math.round(totalProgress / kpis.length);
}

/**
 * Format KPI value with unit
 * @param value - KPI value
 * @param unit - Unit string
 * @returns Formatted string
 */
export function formatKPIValue(value: number, unit: string): string {
  if (unit === "%") {
    return `${value.toFixed(1)}%`;
  }
  if (unit === "USD" || unit === "$") {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toFixed(0)}`;
  }
  if (unit === "times") {
    return `${value.toFixed(1)} times`;
  }
  if (unit === "months") {
    return `${value} months`;
  }
  if (unit === "days") {
    return `${value} days`;
  }
  if (unit === "count") {
    return value.toLocaleString();
  }
  return `${value} ${unit}`;
}

