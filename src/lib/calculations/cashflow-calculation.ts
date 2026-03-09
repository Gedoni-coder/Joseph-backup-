/**
 * Cash Flow Calculation Utilities
 * Contains all business logic for cash flow calculations
 */

import { CashFlowForecast } from "@/lib/business-forecast-data";

/**
 * Calculate net cash flow
 * @param cashInflow - Total cash inflow
 * @param cashOutflow - Total cash outflow
 * @returns Net cash flow
 */
export function calculateNetCashFlow(cashInflow: number, cashOutflow: number): number {
  return cashInflow - cashOutflow;
}

/**
 * Calculate cumulative cash position
 * @param previousCumulative - Previous period cumulative cash
 * @param currentNetFlow - Current period net cash flow
 * @returns Cumulative cash position
 */
export function calculateCumulativeCash(previousCumulative: number, currentNetFlow: number): number {
  return previousCumulative + currentNetFlow;
}

/**
 * Calculate working capital estimate
 * @param cashInflow - Cash inflow
 * @param cashOutflow - Cash outflow
 * @returns Working capital estimate
 */
export function calculateWorkingCapital(cashInflow: number, cashOutflow: number): number {
  // Working capital = Current Assets - Current Liabilities
  // Simplified: Using a portion of cash flow as working capital
  const netPosition = calculateNetCashFlow(cashInflow, cashOutflow);
  return Math.abs(netPosition) * 0.2; // 20% of net position as working capital
}

/**
 * Calculate total cash inflow across periods
 * @param cashFlows - Array of cash flow forecasts
 * @returns Total cash inflow
 */
export function calculateTotalCashInflow(cashFlows: CashFlowForecast[]): number {
  return cashFlows.reduce((sum, cf) => sum + cf.cashInflow, 0);
}

/**
 * Calculate total cash outflow across periods
 * @param cashFlows - Array of cash flow forecasts
 * @returns Total cash outflow
 */
export function calculateTotalCashOutflow(cashFlows: CashFlowForecast[]): number {
  return cashFlows.reduce((sum, cf) => sum + cf.cashOutflow, 0);
}

/**
 * Calculate total net cash flow across periods
 * @param cashFlows - Array of cash flow forecasts
 * @returns Total net cash flow
 */
export function calculateTotalNetCashFlow(cashFlows: CashFlowForecast[]): number {
  return cashFlows.reduce((sum, cf) => sum + cf.netCashFlow, 0);
}

/**
 * Calculate average monthly net cash flow
 * @param cashFlows - Array of cash flow forecasts
 * @returns Average net cash flow
 */
export function calculateAvgNetCashFlow(cashFlows: CashFlowForecast[]): number {
  if (cashFlows.length === 0) return 0;
  const total = calculateTotalNetCashFlow(cashFlows);
  return Math.round(total / cashFlows.length);
}

/**
 * Determine cash flow status
 * @param netCashFlow - Net cash flow
 * @returns Status string
 */
export function getCashFlowStatus(netCashFlow: number): "positive" | "neutral" | "negative" {
  if (netCashFlow > 0) return "positive";
  if (netCashFlow < 0) return "negative";
  return "neutral";
}

/**
 * Get cash flow status color
 * @param netCashFlow - Net cash flow
 * @returns Color class string
 */
export function getCashFlowColor(netCashFlow: number): string {
  if (netCashFlow > 0) return "text-economic-positive";
  if (netCashFlow < 0) return "text-economic-negative";
  return "text-muted-foreground";
}

/**
 * Calculate cash flow variance (inflow vs outflow ratio)
 * @param cashInflow - Cash inflow
 * @param cashOutflow - Cash outflow
 * @returns Ratio (1.0 = balanced, >1 = more inflow, <1 = more outflow)
 */
export function calculateCashFlowRatio(cashInflow: number, cashOutflow: number): number {
  if (!cashOutflow || cashOutflow === 0) return 0;
  return Math.round((cashInflow / cashOutflow) * 100) / 100;
}

/**
 * Calculate cumulative cash positions for all periods
 * @param cashFlows - Array of cash flow forecasts
 * @returns Array with cumulative cash calculated
 */
export function calculateCumulativeCashFlows(cashFlows: CashFlowForecast[]): CashFlowForecast[] {
  let cumulative = 0;
  
  return cashFlows.map((cf) => {
    cumulative += cf.netCashFlow;
    return {
      ...cf,
      cumulativeCash: cumulative,
    };
  });
}

/**
 * Get periods with negative cash flow
 * @param cashFlows - Array of cash flow forecasts
 * @returns Array of periods with negative cash flow
 */
export function getNegativeCashFlowPeriods(cashFlows: CashFlowForecast[]): CashFlowForecast[] {
  return cashFlows.filter((cf) => cf.netCashFlow < 0);
}

/**
 * Get peak cash flow period
 * @param cashFlows - Array of cash flow forecasts
 * @returns Period with highest net cash flow
 */
export function getPeakCashFlowPeriod(cashFlows: CashFlowForecast[]): CashFlowForecast | null {
  if (cashFlows.length === 0) return null;
  
  return cashFlows.reduce((peak, cf) => {
    if (!peak || cf.netCashFlow > peak.netCashFlow) {
      return cf;
    }
    return peak;
  }, cashFlows[0]);
}

/**
 * Get lowest cash flow period
 * @param cashFlows - Array of cash flow forecasts
 * @returns Period with lowest net cash flow
 */
export function getLowestCashFlowPeriod(cashFlows: CashFlowForecast[]): CashFlowForecast | null {
  if (cashFlows.length === 0) return null;
  
  return cashFlows.reduce((lowest, cf) => {
    if (!lowest || cf.netCashFlow < lowest.netCashFlow) {
      return cf;
    }
    return lowest;
  }, cashFlows[0]);
}

/**
 * Calculate cash flow trend
 * @param cashFlows - Array of cash flow forecasts
 * @returns Trend direction: "improving", "declining", or "stable"
 */
export function getCashFlowTrend(cashFlows: CashFlowForecast[]): "improving" | "declining" | "stable" {
  if (cashFlows.length < 2) return "stable";
  
  const firstHalf = cashFlows.slice(0, Math.floor(cashFlows.length / 2));
  const secondHalf = cashFlows.slice(Math.floor(cashFlows.length / 2));
  
  const firstAvg = calculateAvgNetCashFlow(firstHalf);
  const secondAvg = calculateAvgNetCashFlow(secondHalf);
  
  const difference = secondAvg - firstAvg;
  const threshold = Math.abs(firstAvg) * 0.1; // 10% threshold
  
  if (difference > threshold) return "improving";
  if (difference < -threshold) return "declining";
  return "stable";
}

/**
 * Format cash flow amount for display
 * @param amount - Amount in currency
 * @returns Formatted string (e.g., "$2.4M")
 */
export function formatCashFlowAmount(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`;
  }
  return `$${amount.toFixed(0)}`;
}

