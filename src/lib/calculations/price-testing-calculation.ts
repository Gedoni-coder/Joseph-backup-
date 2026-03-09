/**
 * Price Testing Calculation Utilities
 * Contains all business logic for A/B and multivariate testing calculations
 */

import { PriceTest, PriceVariant } from "@/lib/pricing-data";

/**
 * Calculate total conversions across all variants
 * @param variants - Array of price variants
 * @returns Total conversions
 */
export function calculateTotalConversions(variants: PriceVariant[]): number {
  return variants.reduce((sum, v) => sum + (v.conversions || 0), 0);
}

/**
 * Calculate total revenue across all variants
 * @param variants - Array of price variants
 * @returns Total revenue
 */
export function calculateTotalTestRevenue(variants: PriceVariant[]): number {
  return variants.reduce((sum, v) => sum + (v.revenue || 0), 0);
}

/**
 * Calculate total visitors across all variants
 * @param variants - Array of price variants
 * @returns Total visitors
 */
export function calculateTotalVisitors(variants: PriceVariant[]): number {
  return variants.reduce((sum, v) => sum + (v.visitors || 0), 0);
}

/**
 * Calculate average conversion rate across all variants
 * @param variants - Array of price variants
 * @returns Average conversion rate
 */
export function calculateAvgConversionRate(variants: PriceVariant[]): number {
  if (variants.length === 0) return 0;
  const totalRate = variants.reduce((sum, v) => sum + (v.conversionRate || 0), 0);
  return Math.round((totalRate / variants.length) * 100) / 100;
}

/**
 * Get winning variant based on revenue
 * @param variants - Array of price variants
 * @returns Variant with highest revenue
 */
export function getWinningVariant(variants: PriceVariant[]): PriceVariant | null {
  if (variants.length === 0) return null;
  
  return variants.reduce((winner, v) => {
    if (!winner || (v.revenue || 0) > (winner.revenue || 0)) {
      return v;
    }
    return winner;
  }, variants[0]);
}

/**
 * Get winning variant based on conversion rate
 * @param variants - Array of price variants
 * @returns Variant with highest conversion rate
 */
export function getHighestConversionVariant(variants: PriceVariant[]): PriceVariant | null {
  if (variants.length === 0) return null;
  
  return variants.reduce((winner, v) => {
    if (!winner || (v.conversionRate || 0) > (winner.conversionRate || 0)) {
      return v;
    }
    return winner;
  }, variants[0]);
}

/**
 * Calculate conversion rate difference between variants
 * @param variants - Array of price variants
 * @returns Difference in percentage points
 */
export function calculateConversionDifference(variants: PriceVariant[]): number {
  if (variants.length < 2) return 0;
  
  const rates = variants.map(v => v.conversionRate || 0);
  const max = Math.max(...rates);
  const min = Math.min(...rates);
  
  return Math.round((max - min) * 100) / 100;
}

/**
 * Calculate revenue per visitor for a variant
 * @param variant - Price variant
 * @returns Revenue per visitor
 */
export function calculateRevenuePerVisitor(variant: PriceVariant): number {
  if (!variant.visitors || variant.visitors === 0) return 0;
  return Math.round((variant.revenue / variant.visitors) * 100) / 100;
}

/**
 * Calculate test progress percentage
 * @param test - Price test
 * @returns Progress percentage
 */
export function calculateTestProgress(test: PriceTest): number {
  if (!test.startDate) return 0;
  
  const start = new Date(test.startDate).getTime();
  const now = Date.now();
  
  let end = now;
  if (test.endDate) {
    end = new Date(test.endDate).getTime();
  }
  
  if (end <= start) return 100;
  
  const progress = ((now - start) / (end - start)) * 100;
  return Math.min(Math.round(progress), 100);
}

/**
 * Get test summary object
 * @param test - Price test
 * @returns Summary object
 */
export function getTestSummary(test: PriceTest) {
  const totalConversions = calculateTotalConversions(test.variants);
  const totalRevenue = calculateTotalTestRevenue(test.variants);
  const totalVisitors = calculateTotalVisitors(test.variants);
  const winningByRevenue = getWinningVariant(test.variants);
  const winningByConversion = getHighestConversionVariant(test.variants);
  
  return {
    totalConversions,
    totalRevenue,
    totalVisitors,
    avgConversionRate: calculateAvgConversionRate(test.variants),
    winningVariant: winningByRevenue,
    highestConversionVariant: winningByConversion,
    conversionDifference: calculateConversionDifference(test.variants),
    progress: calculateTestProgress(test),
    isComplete: test.status === 'completed',
    isRunning: test.status === 'running',
  };
}

/**
 * Get summary of all tests
 * @param tests - Array of price tests
 * @returns Summary object
 */
export function getAllTestsSummary(tests: PriceTest[]) {
  const runningTests = tests.filter(t => t.status === 'running');
  const completedTests = tests.filter(t => t.status === 'completed');
  const pausedTests = tests.filter(t => t.status === 'paused');
  
  return {
    totalTests: tests.length,
    runningCount: runningTests.length,
    completedCount: completedTests.length,
    pausedCount: pausedTests.length,
    totalRevenue: tests.reduce((sum, t) => sum + calculateTotalTestRevenue(t.variants), 0),
    totalConversions: tests.reduce((sum, t) => sum + calculateTotalConversions(t.variants), 0),
  };
}
