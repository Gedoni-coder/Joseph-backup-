/**
 * Performance Driver Calculation Utilities
 * Contains all business logic for performance driver calculations
 */

import { PerformanceDriver } from "@/lib/financial-advisory-data";

/**
 * Calculate progress toward target
 */
export function calculateDriverProgress(driver: PerformanceDriver): number {
  if (!driver.targetValue || driver.targetValue === 0) return 0;
  return Math.round((driver.currentValue / driver.targetValue) * 100);
}

/**
 * Get driver status based on progress
 */
export function getDriverStatus(driver: PerformanceDriver): "on_track" | "at_risk" | "critical" | "exceeding_target" {
  const progress = calculateDriverProgress(driver);
  if (progress >= 100) return "exceeding_target";
  if (progress >= 80) return "on_track";
  if (progress >= 60) return "at_risk";
  return "critical";
}

/**
 * Get drivers by category
 */
export function getDriversByCategory(drivers: PerformanceDriver[]): Record<string, number> {
  return drivers.reduce((acc, d) => {
    acc[d.category] = (acc[d.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

/**
 * Get drivers by status
 */
export function getDriversByStatus(drivers: PerformanceDriver[]): Record<string, number> {
  return drivers.reduce((acc, d) => {
    const status = getDriverStatus(d);
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

/**
 * Get drivers by impact
 */
export function getDriversByImpact(drivers: PerformanceDriver[]): Record<string, number> {
  return drivers.reduce((acc, d) => {
    acc[d.impact] = (acc[d.impact] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

/**
 * Get performance driver summary
 */
export function getPerformanceDriverSummary(drivers: PerformanceDriver[]) {
  return {
    total: drivers.length,
    onTrack: drivers.filter(d => getDriverStatus(d) === "on_track").length,
    atRisk: drivers.filter(d => getDriverStatus(d) === "at_risk").length,
    critical: drivers.filter(d => getDriverStatus(d) === "critical").length,
    exceeding: drivers.filter(d => getDriverStatus(d) === "exceeding_target").length,
    byCategory: getDriversByCategory(drivers),
    byImpact: getDriversByImpact(drivers),
  };
}
