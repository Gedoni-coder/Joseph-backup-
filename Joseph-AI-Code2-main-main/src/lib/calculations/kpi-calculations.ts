/**
 * KPI Calculations Module
 * 
 * Handles calculations for all 59 KPIs across:
 * - Financial KPIs (11)
 * - Customer KPIs (9)
 * - Sales & Marketing KPIs (10)
 * - Operational KPIs (8)
 * - HR & Employee KPIs (8)
 * - Project & Product KPIs (7)
 * - Innovation & Growth KPIs (6)
 * 
 * Each KPI has:
 * - Calculation formula
 * - Status determination (Excellent/Good/Fair/Needs Attention)
 * - Progress calculation
 * - Trend analysis
 */

export interface KPIData {
  id: string;
  name: string;
  current: number;
  target: number;
  unit: string;
  category: string;
  frequency: string;
}

export interface CalculatedKPI extends KPIData {
  progress: number;
  status: "Excellent" | "Good" | "Fair" | "Needs Attention";
  trend: "up" | "down" | "stable";
  gapToTarget: number;
  gapPercentage: number;
  statusColor: "green" | "blue" | "yellow" | "red";
}

/**
 * Calculate progress percentage toward target
 * 
 * Formula: (current / target) * 100
 * 
 * @param current - Current KPI value
 * @param target - Target KPI value
 * @returns Progress as percentage (0-100+)
 * 
 * @example
 * calculateKPIProgress(22.5, 25) // Returns 90
 */
export function calculateKPIProgress(current: number, target: number): number {
  if (target === 0) return 0;
  const progress = (current / target) * 100;
  return Math.round(progress * 10) / 10;
}

/**
 * Calculate gap to target
 * 
 * Formula: target - current
 * 
 * @param current - Current KPI value
 * @param target - Target KPI value
 * @returns Gap amount (can be positive or negative)
 */
export function calculateGapToTarget(current: number, target: number): number {
  return target - current;
}

/**
 * Calculate gap as percentage
 * 
 * Formula: ((target - current) / target) * 100
 * 
 * @param current - Current KPI value
 * @param target - Target KPI value
 * @returns Gap as percentage
 */
export function calculateGapPercentage(current: number, target: number): number {
  if (target === 0) return 0;
  const gap = ((target - current) / target) * 100;
  return Math.round(gap * 10) / 10;
}

/**
 * Determine KPI status based on progress toward target
 * 
 * Status mapping:
 * - Excellent: >= 95% of target
 * - Good: 80-94% of target
 * - Fair: 60-79% of target
 * - Needs Attention: < 60% of target
 * 
 * @param progress - Progress percentage (0-100+)
 * @returns Status level
 */
export function determineKPIStatus(progress: number): "Excellent" | "Good" | "Fair" | "Needs Attention" {
  if (progress >= 95) return "Excellent";
  if (progress >= 80) return "Good";
  if (progress >= 60) return "Fair";
  return "Needs Attention";
}

/**
 * Map status to color
 * 
 * @param status - KPI status
 * @returns Color code for UI
 */
export function statusToColor(status: "Excellent" | "Good" | "Fair" | "Needs Attention"): "green" | "blue" | "yellow" | "red" {
  switch (status) {
    case "Excellent":
      return "green";
    case "Good":
      return "blue";
    case "Fair":
      return "yellow";
    case "Needs Attention":
      return "red";
  }
}

/**
 * Determine trend direction (up/down/stable)
 * 
 * Compares progress toward target:
 * - up: Getting closer to target (good for "more is better" metrics)
 * - down: Moving away from target (bad for "more is better" metrics)
 * - stable: No significant change
 * 
 * @param current - Current KPI value
 * @param previous - Previous KPI value
 * @param isInverseMetric - true if lower is better (e.g., costs, churn rate)
 * @returns Trend direction
 */
export function determineTrend(
  current: number,
  previous: number,
  isInverseMetric: boolean = false
): "up" | "down" | "stable" {
  const change = current - previous;
  const percentChange = Math.abs(change) / (previous || 1);
  
  // Less than 0.5% change = stable
  if (percentChange < 0.005) return "stable";
  
  if (isInverseMetric) {
    // For inverse metrics (lower is better), down is good
    return change < 0 ? "up" : "down";
  } else {
    // For normal metrics (higher is better), up is good
    return change > 0 ? "up" : "down";
  }
}

/**
 * Calculate complete KPI with all metrics
 * 
 * @param data - Raw KPI data
 * @param previous - Previous KPI value (for trend)
 * @param isInverseMetric - true if lower is better
 * @returns Fully calculated KPI ready for UI
 */
export function calculateCompleteKPI(
  data: KPIData,
  previous: number = data.current,
  isInverseMetric: boolean = false
): CalculatedKPI {
  const progress = calculateKPIProgress(data.current, data.target);
  const status = determineKPIStatus(progress);
  const trend = determineTrend(data.current, previous, isInverseMetric);
  const gapToTarget = calculateGapToTarget(data.current, data.target);
  const gapPercentage = calculateGapPercentage(data.current, data.target);
  const statusColor = statusToColor(status);
  
  return {
    ...data,
    progress,
    status,
    trend,
    gapToTarget,
    gapPercentage,
    statusColor,
  };
}

/**
 * Calculate batch of KPIs
 * 
 * @param dataArray - Array of raw KPI data
 * @param previousValues - Map of previous values for trend (optional)
 * @param inverseMetrics - Set of KPI IDs where lower is better
 * @returns Array of calculated KPIs
 */
export function calculateBatchKPIs(
  dataArray: KPIData[],
  previousValues?: Record<string, number>,
  inverseMetrics?: Set<string>
): CalculatedKPI[] {
  return dataArray.map((data) => {
    const previous = previousValues?.[data.id] ?? data.current;
    const isInverse = inverseMetrics?.has(data.id) ?? false;
    return calculateCompleteKPI(data, previous, isInverse);
  });
}

/**
 * Count KPIs by status
 * 
 * @param kpis - Array of calculated KPIs
 * @returns Object with count of each status
 */
export function countKPIsByStatus(kpis: CalculatedKPI[]): {
  excellent: number;
  good: number;
  fair: number;
  needsAttention: number;
} {
  return {
    excellent: kpis.filter((k) => k.status === "Excellent").length,
    good: kpis.filter((k) => k.status === "Good").length,
    fair: kpis.filter((k) => k.status === "Fair").length,
    needsAttention: kpis.filter((k) => k.status === "Needs Attention").length,
  };
}

/**
 * Get KPIs that need review (status is not Excellent/Good)
 * 
 * @param kpis - Array of calculated KPIs
 * @returns Array of KPIs needing attention
 */
export function getKPIsNeedingReview(kpis: CalculatedKPI[]): CalculatedKPI[] {
  return kpis.filter((k) => k.status === "Fair" || k.status === "Needs Attention");
}

/**
 * Sort KPIs by priority (status + gap to target)
 * 
 * @param kpis - Array of calculated KPIs
 * @returns Sorted array (worst performers first)
 */
export function prioritizeKPIs(kpis: CalculatedKPI[]): CalculatedKPI[] {
  return [...kpis].sort((a, b) => {
    // Sort by status first (worse statuses first)
    const statusOrder = {
      "Needs Attention": 0,
      Fair: 1,
      Good: 2,
      Excellent: 3,
    };
    const statusDiff = statusOrder[a.status] - statusOrder[b.status];
    if (statusDiff !== 0) return statusDiff;
    
    // Then by gap to target (larger gap first)
    return Math.abs(b.gapPercentage) - Math.abs(a.gapPercentage);
  });
}

// ==================== INDIVIDUAL KPI FORMULAS ====================

/**
 * Financial KPIs (11 KPIs)
 */

export function calculateRevenueGrowthRate(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

export function calculateGrossProfitMargin(grossProfit: number, revenue: number): number {
  if (revenue === 0) return 0;
  return (grossProfit / revenue) * 100;
}

export function calculateNetProfitMargin(netProfit: number, revenue: number): number {
  if (revenue === 0) return 0;
  return (netProfit / revenue) * 100;
}

export function calculateOperatingCashFlow(
  cashInflows: number,
  cashOutflows: number
): number {
  return cashInflows - cashOutflows;
}

export function calculateROI(profit: number, investment: number): number {
  if (investment === 0) return 0;
  return (profit / investment) * 100;
}

export function calculateAccountsReceivableTurnover(revenue: number, avgAR: number): number {
  if (avgAR === 0) return 0;
  return revenue / avgAR;
}

export function calculateAccountsPayableTurnover(cogs: number, avgAP: number): number {
  if (avgAP === 0) return 0;
  return cogs / avgAP;
}

export function calculateBudgetVariance(actual: number, budgeted: number): number {
  if (budgeted === 0) return 0;
  return Math.abs(actual - budgeted) / budgeted * 100;
}

export function calculateOperatingMargin(operatingProfit: number, revenue: number): number {
  if (revenue === 0) return 0;
  return (operatingProfit / revenue) * 100;
}

export function calculateCashBurnRate(totalCashOutflow: number, daysElapsed: number): number {
  if (daysElapsed === 0) return 0;
  return totalCashOutflow / daysElapsed * 30; // Monthly burn rate
}

export function calculateRunway(cash: number, monthlyBurnRate: number): number {
  if (monthlyBurnRate === 0) return Infinity;
  return Math.round(cash / monthlyBurnRate);
}

/**
 * Customer KPIs (9 KPIs)
 */

export function calculateCAC(totalMarketingSpend: number, newCustomers: number): number {
  if (newCustomers === 0) return 0;
  return totalMarketingSpend / newCustomers;
}

export function calculateCLV(
  avgOrderValue: number,
  purchaseFrequency: number,
  customerLifespan: number
): number {
  return avgOrderValue * purchaseFrequency * customerLifespan;
}

export function calculateNPS(promoters: number, detractors: number, total: number): number {
  if (total === 0) return 0;
  return ((promoters - detractors) / total) * 100;
}

export function calculateRetentionRate(
  customersEndOfPeriod: number,
  customersStartOfPeriod: number,
  newCustomers: number
): number {
  if (customersStartOfPeriod === 0) return 0;
  return (
    ((customersEndOfPeriod - newCustomers) / customersStartOfPeriod) * 100
  );
}

export function calculateChurnRate(customersLost: number, customersStartOfPeriod: number): number {
  if (customersStartOfPeriod === 0) return 0;
  return (customersLost / customersStartOfPeriod) * 100;
}

export function calculateAvgResponseTime(
  totalResponseTime: number,
  ticketsResponded: number
): number {
  if (ticketsResponded === 0) return 0;
  return totalResponseTime / ticketsResponded;
}

export function calculateCSAT(satisfiedResponses: number, totalResponses: number): number {
  if (totalResponses === 0) return 0;
  return (satisfiedResponses / totalResponses) * 100;
}

export function calculateRepeatPurchaseRate(
  customersWithRepeatPurchase: number,
  totalCustomers: number
): number {
  if (totalCustomers === 0) return 0;
  return (customersWithRepeatPurchase / totalCustomers) * 100;
}

export function calculateComplaintsRate(complaints: number, transactions: number): number {
  if (transactions === 0) return 0;
  return (complaints / transactions) * 100;
}

/**
 * Sales & Marketing KPIs (10 KPIs)
 */

export function calculateLeadsGenerated(
  impressions: number,
  conversionRate: number
): number {
  return Math.round(impressions * (conversionRate / 100));
}

export function calculateLeadConversionRate(
  conversions: number,
  leads: number
): number {
  if (leads === 0) return 0;
  return (conversions / leads) * 100;
}

export function calculateSalesGrowthRate(currentSales: number, previousSales: number): number {
  if (previousSales === 0) return 0;
  return ((currentSales - previousSales) / previousSales) * 100;
}

export function calculateMarketingROI(revenue: number, spend: number): number {
  if (spend === 0) return 0;
  return ((revenue - spend) / spend) * 100;
}

export function calculateWebsiteConversionRate(
  conversions: number,
  visitors: number
): number {
  if (visitors === 0) return 0;
  return (conversions / visitors) * 100;
}

export function calculateCostPerLead(marketingSpend: number, leads: number): number {
  if (leads === 0) return 0;
  return marketingSpend / leads;
}

export function calculateCostPerAcquisition(
  totalAcquisitionCost: number,
  newCustomers: number
): number {
  if (newCustomers === 0) return 0;
  return totalAcquisitionCost / newCustomers;
}

export function calculatePipelineCoverageRatio(
  pipelineValue: number,
  targetRevenue: number
): number {
  if (targetRevenue === 0) return 0;
  return pipelineValue / targetRevenue;
}

export function calculateAvgDealSize(totalRevenue: number, dealsClosed: number): number {
  if (dealsClosed === 0) return 0;
  return totalRevenue / dealsClosed;
}

export function calculateSalesCycleLength(totalDays: number, dealsClosed: number): number {
  if (dealsClosed === 0) return 0;
  return totalDays / dealsClosed;
}

/**
 * Operational KPIs (8 KPIs)
 */

export function calculateCycleTime(totalCycleTime: number, itemsProcessed: number): number {
  if (itemsProcessed === 0) return 0;
  return totalCycleTime / itemsProcessed;
}

export function calculateOrderFulfillmentTime(
  totalFulfillmentTime: number,
  ordersCompleted: number
): number {
  if (ordersCompleted === 0) return 0;
  return totalFulfillmentTime / ordersCompleted;
}

export function calculateInventoryTurnover(cogs: number, avgInventory: number): number {
  if (avgInventory === 0) return 0;
  return cogs / avgInventory;
}

export function calculateDefectRate(defects: number, unitsProduced: number): number {
  if (unitsProduced === 0) return 0;
  return (defects / unitsProduced) * 100;
}

export function calculateOnTimeDeliveryRate(
  onTimeDeliveries: number,
  totalDeliveries: number
): number {
  if (totalDeliveries === 0) return 0;
  return (onTimeDeliveries / totalDeliveries) * 100;
}

export function calculateProcessDowntime(downtimeHours: number, totalHours: number): number {
  if (totalHours === 0) return 0;
  return (downtimeHours / totalHours) * 100;
}

export function calculateCapacityUtilization(
  utilisedCapacity: number,
  totalCapacity: number
): number {
  if (totalCapacity === 0) return 0;
  return (utilisedCapacity / totalCapacity) * 100;
}

export function calculateWasteRate(wasteAmount: number, totalProduction: number): number {
  if (totalProduction === 0) return 0;
  return (wasteAmount / totalProduction) * 100;
}

/**
 * HR & Employee KPIs (8 KPIs)
 */

export function calculateEmployeeTurnoverRate(
  employeesLeft: number,
  avgEmployeeCount: number
): number {
  if (avgEmployeeCount === 0) return 0;
  return (employeesLeft / avgEmployeeCount) * 100;
}

export function calculateEmployeeEngagementScore(score: number, maxScore: number): number {
  if (maxScore === 0) return 0;
  return (score / maxScore) * 100;
}

export function calculateTimeToHire(totalDays: number, hiresMade: number): number {
  if (hiresMade === 0) return 0;
  return totalDays / hiresMade;
}

export function calculateTrainingCompletionRate(
  completed: number,
  total: number
): number {
  if (total === 0) return 0;
  return (completed / total) * 100;
}

export function calculateAbsenteeismRate(absenceDays: number, totalDays: number): number {
  if (totalDays === 0) return 0;
  return (absenceDays / totalDays) * 100;
}

export function calculateRevenuePerEmployee(totalRevenue: number, employeeCount: number): number {
  if (employeeCount === 0) return 0;
  return totalRevenue / employeeCount;
}

export function calculateProductivityRate(output: number, expectedOutput: number): number {
  if (expectedOutput === 0) return 0;
  return (output / expectedOutput) * 100;
}

export function calculateEmployeeSatisfaction(score: number, maxScore: number): number {
  if (maxScore === 0) return 0;
  return (score / maxScore) * 100;
}

/**
 * Project & Product KPIs (7 KPIs)
 */

export function calculateOnTimeDeliveryProject(
  onTimeProjects: number,
  totalProjects: number
): number {
  if (totalProjects === 0) return 0;
  return (onTimeProjects / totalProjects) * 100;
}

export function calculateProductDefectRate(defects: number, totalUnits: number): number {
  if (totalUnits === 0) return 0;
  return (defects / totalUnits) * 100;
}

export function calculateFeatureAdoptionRate(
  activeUsers: number,
  totalUsers: number
): number {
  if (totalUsers === 0) return 0;
  return (activeUsers / totalUsers) * 100;
}

export function calculateTimeToMarket(monthsToDevelop: number): number {
  return monthsToDevelop;
}

export function calculateProjectBudgetVariance(
  actualSpend: number,
  budgetedSpend: number
): number {
  if (budgetedSpend === 0) return 0;
  return Math.abs(actualSpend - budgetedSpend) / budgetedSpend * 100;
}

export function calculateSprintVelocity(storyPointsCompleted: number): number {
  return storyPointsCompleted;
}

export function calculateProductROI(revenue: number, investment: number): number {
  if (investment === 0) return 0;
  return ((revenue - investment) / investment) * 100;
}

/**
 * Innovation & Growth KPIs (6 KPIs)
 */

export function calculateNewProductRevenuePercentage(
  newProductRevenue: number,
  totalRevenue: number
): number {
  if (totalRevenue === 0) return 0;
  return (newProductRevenue / totalRevenue) * 100;
}

export function calculateRnDSpendRatio(rdSpend: number, totalRevenue: number): number {
  if (totalRevenue === 0) return 0;
  return (rdSpend / totalRevenue) * 100;
}

export function calculateMarketShareGrowth(
  currentMarketShare: number,
  previousMarketShare: number
): number {
  return currentMarketShare - previousMarketShare;
}

export function calculatePatentsFiled(patentCount: number): number {
  return patentCount;
}

export function calculateNewMarketExpansion(newMarkets: number): number {
  return newMarkets;
}

export function calculateOverallBusinessGrowthRate(
  currentValue: number,
  previousValue: number
): number {
  if (previousValue === 0) return 0;
  return ((currentValue - previousValue) / previousValue) * 100;
}

// ==================== INVERSE METRICS ====================

/**
 * Set of KPI IDs where lower is better (cost/reduction metrics)
 */
export const INVERSE_METRICS = new Set([
  "f8", // Budget Variance
  "f10", // Cash Burn Rate
  "c1", // CAC
  "c5", // Churn Rate
  "c6", // Avg Response Time
  "c9", // Complaints Rate
  "sm6", // Cost per Lead
  "sm7", // Cost per Acquisition
  "sm10", // Sales Cycle Length
  "op1", // Cycle Time
  "op2", // Order Fulfillment Time
  "op4", // Defect Rate
  "op6", // Process Downtime
  "op8", // Waste Rate
  "hr1", // Employee Turnover
  "hr3", // Time to Hire
  "hr5", // Absenteeism
  "pp2", // Product Defect Rate
  "pp5", // Project Budget Variance
  "pp4", // Time to Market
]);
