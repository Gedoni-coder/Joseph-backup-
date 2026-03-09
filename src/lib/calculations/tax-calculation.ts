/**
 * Tax Calculation Utilities
 * Contains all business logic for tax calculations
 */

import { TaxCalculation } from "@/lib/tax-compliance-data";

/**
 * Calculate effective tax rate from taxable income and estimated tax
 */
export function calculateEffectiveTaxRate(calculation: TaxCalculation): number {
  if (!calculation.taxableIncome || calculation.taxableIncome === 0) return 0;
  return Math.round((calculation.estimatedTax / calculation.taxableIncome) * 10000) / 100;
}

/**
 * Calculate total tax liability
 */
export function calculateTotalTaxLiability(calculations: TaxCalculation[]): number {
  return calculations.reduce((sum, calc) => sum + (calc.estimatedTax || 0), 0);
}

/**
 * Calculate total deductions
 */
export function calculateTotalDeductions(calculations: TaxCalculation[]): number {
  return calculations.reduce((sum, calc) => sum + (calc.deductions || 0), 0);
}

/**
 * Calculate total income
 */
export function calculateTotalIncome(calculations: TaxCalculation[]): number {
  return calculations.reduce((sum, calc) => sum + (calc.income || 0), 0);
}

/**
 * Calculate total taxable income
 */
export function calculateTotalTaxableIncome(calculations: TaxCalculation[]): number {
  return calculations.reduce((sum, calc) => sum + (calc.taxableIncome || 0), 0);
}

/**
 * Calculate tax savings from deductions
 */
export function calculateTaxSavings(calculation: TaxCalculation): number {
  if (!calculation.taxableIncome || !calculation.deductions) return 0;
  // Savings = deductions * marginal rate
  const savings = calculation.deductions * (calculation.marginalRate / 100);
  return Math.round(savings);
}

/**
 * Get calculations by entity
 */
export function getCalculationsByEntity(calculations: TaxCalculation[]): Record<string, TaxCalculation[]> {
  return calculations.reduce((acc, calc) => {
    const entity = calc.entity || "other";
    if (!acc[entity]) acc[entity] = [];
    acc[entity].push(calc);
    return acc;
  }, {} as Record<string, TaxCalculation[]>);
}

/**
 * Get calculations by status
 */
export function getCalculationsByStatus(calculations: TaxCalculation[]): Record<string, TaxCalculation[]> {
  return calculations.reduce((acc, calc) => {
    const status = calc.status || "draft";
    if (!acc[status]) acc[status] = [];
    acc[status].push(calc);
    return acc;
  }, {} as Record<string, TaxCalculation[]>);
}

/**
 * Get tax summary
 */
export function getTaxSummary(calculations: TaxCalculation[]) {
  return {
    totalLiability: calculateTotalTaxLiability(calculations),
    totalDeductions: calculateTotalDeductions(calculations),
    totalIncome: calculateTotalIncome(calculations),
    totalTaxableIncome: calculateTotalTaxableIncome(calculations),
    entityCount: calculations.length,
    avgEffectiveRate: calculations.length > 0 
      ? Math.round(calculations.reduce((sum, c) => sum + calculateEffectiveTaxRate(c), 0) / calculations.length * 100) / 100
      : 0,
  };
}

/**
 * Get progress percentage for tax filing status
 */
export function getFilingProgress(calculation: TaxCalculation): number {
  const statusProgress: Record<string, number> = {
    draft: 25,
    calculated: 50,
    filed: 75,
    amended: 100,
  };
  return statusProgress[calculation.status] || 0;
}

/**
 * Format tax rate for display
 */
export function formatTaxRate(rate: number): string {
  return `${rate.toFixed(1)}%`;
}
