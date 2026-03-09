/**
 * Budget Forecast Calculation Utilities
 * Contains all business logic for budget forecasting calculations
 */

import { BudgetForecast } from "@/lib/financial-advisory-data";

/**
 * Calculate total revenue across all forecasts
 */
export function calculateTotalBudgetRevenue(forecasts: BudgetForecast[]): number {
  return forecasts.reduce((sum, f) => sum + (f.revenue || 0), 0);
}

/**
 * Calculate total expenses across all forecasts
 */
export function calculateTotalBudgetExpenses(forecasts: BudgetForecast[]): number {
  return forecasts.reduce((sum, f) => sum + (f.expenses || 0), 0);
}

/**
 * Calculate total net income across all forecasts
 */
export function calculateTotalNetIncome(forecasts: BudgetForecast[]): number {
  return forecasts.reduce((sum, f) => sum + (f.netIncome || 0), 0);
}

/**
 * Calculate average confidence across all forecasts
 */
export function calculateAvgBudgetConfidence(forecasts: BudgetForecast[]): number {
  if (forecasts.length === 0) return 0;
  const total = forecasts.reduce((sum, f) => sum + f.confidence, 0);
  return Math.round(total / forecasts.length);
}

/**
 * Calculate average variance
 */
export function calculateAvgVariance(forecasts: BudgetForecast[]): number {
  if (forecasts.length === 0) return 0;
  const total = forecasts.reduce((sum, f) => sum + (f.variance || 0), 0);
  return Math.round((total / forecasts.length) * 10) / 10;
}

/**
 * Calculate profit margin
 */
export function calculateProfitMargin(forecast: BudgetForecast): number {
  if (!forecast.revenue || forecast.revenue === 0) return 0;
  return Math.round((forecast.netIncome / forecast.revenue) * 1000) / 10;
}

/**
 * Get forecast summary
 */
export function getBudgetForecastSummary(forecasts: BudgetForecast[]) {
  return {
    totalRevenue: calculateTotalBudgetRevenue(forecasts),
    totalExpenses: calculateTotalBudgetExpenses(forecasts),
    totalNetIncome: calculateTotalNetIncome(forecasts),
    avgConfidence: calculateAvgBudgetConfidence(forecasts),
    avgVariance: calculateAvgVariance(forecasts),
    forecastCount: forecasts.length,
  };
}
