/**
 * Market Size Calculations Module
 * 
 * Handles all market sizing calculations including:
 * - Total Addressable Market (TAM)
 * - Serviceable Addressable Market (SAM)
 * - Serviceable Obtainable Market (SOM)
 * - Market penetration analysis
 * - Growth projections
 * - Market opportunity sizing
 */

export interface MarketSizeData {
  tam: number;
  tamGrowthRate: number;
  samPercentage: number; // SAM as % of TAM
  somPercentage: number; // SOM as % of SAM
  currency: string;
  timeframe: string;
  region: string;
}

export interface CalculatedMarketSize {
  tam: number;
  sam: number;
  som: number;
  tamGrowth: number;
  samGrowth: number;
  somGrowth: number;
  tamCurrency: string;
  penetrationRate: number;
  marketOpportunity: number;
  growthPotential: number;
}

/**
 * Calculate SAM (Serviceable Addressable Market)
 * 
 * Formula: TAM × (SAM Percentage / 100)
 * 
 * @param tam - Total Addressable Market
 * @param samPercentage - SAM as percentage of TAM (0-100)
 * @returns SAM value
 * 
 * @example
 * calculateSAM(50000000, 20) // Returns 10000000
 */
export function calculateSAM(tam: number, samPercentage: number): number {
  return Math.round(tam * (samPercentage / 100));
}

/**
 * Calculate SOM (Serviceable Obtainable Market)
 * 
 * Formula: SAM × (SOM Percentage / 100)
 * 
 * @param sam - Serviceable Addressable Market
 * @param somPercentage - SOM as percentage of SAM (0-100)
 * @returns SOM value
 * 
 * @example
 * calculateSOM(10000000, 10) // Returns 1000000
 */
export function calculateSOM(sam: number, somPercentage: number): number {
  return Math.round(sam * (somPercentage / 100));
}

/**
 * Direct calculation of SOM from TAM
 * 
 * Formula: TAM × (SAM%) × (SOM%) / 10000
 * 
 * @param tam - Total Addressable Market
 * @param samPercentage - SAM as percentage of TAM
 * @param somPercentage - SOM as percentage of SAM
 * @returns SOM value
 */
export function calculateSOMFromTAM(
  tam: number,
  samPercentage: number,
  somPercentage: number
): number {
  const sam = calculateSAM(tam, samPercentage);
  return calculateSOM(sam, somPercentage);
}

/**
 * Calculate market penetration rate
 * 
 * Formula: (Current Revenue / TAM) × 100
 * 
 * @param currentRevenue - Current company revenue
 * @param tam - Total Addressable Market
 * @returns Penetration rate as percentage
 * 
 * @example
 * calculatePenetrationRate(1000000, 50000000) // Returns 2.0
 */
export function calculatePenetrationRate(currentRevenue: number, tam: number): number {
  if (tam === 0) return 0;
  return (currentRevenue / tam) * 100;
}

/**
 * Calculate market growth projection
 * 
 * Formula: MarketSize × (1 + growth_rate/100)
 * 
 * @param currentMarketSize - Current market size
 * @param growthRate - Annual growth rate as percentage
 * @param years - Number of years to project
 * @returns Projected market size
 * 
 * @example
 * calculateMarketGrowth(50000000, 12.5, 1) // Returns 56250000
 */
export function calculateMarketGrowth(
  currentMarketSize: number,
  growthRate: number,
  years: number = 1
): number {
  const compounded = currentMarketSize * Math.pow(1 + growthRate / 100, years);
  return Math.round(compounded);
}

/**
 * Calculate market growth amount (not percentage)
 * 
 * @param projectedSize - Projected market size
 * @param currentSize - Current market size
 * @returns Growth amount in currency units
 */
export function calculateMarketGrowthAmount(projectedSize: number, currentSize: number): number {
  return projectedSize - currentSize;
}

/**
 * Calculate CAGR (Compound Annual Growth Rate)
 * 
 * Formula: (Final Value / Initial Value)^(1/Years) - 1
 * 
 * @param initialValue - Starting market size
 * @param finalValue - Ending market size
 * @param years - Number of years
 * @returns CAGR as percentage
 * 
 * @example
 * calculateCAGR(50000000, 63814000, 3) // Returns ~12.5
 */
export function calculateCAGR(
  initialValue: number,
  finalValue: number,
  years: number
): number {
  if (initialValue === 0 || years === 0) return 0;
  const cagr = Math.pow(finalValue / initialValue, 1 / years) - 1;
  return Math.round(cagr * 1000) / 10; // Round to 1 decimal place
}

/**
 * Calculate market opportunity potential
 * 
 * Difference between SAM and current served market
 * 
 * @param sam - Serviceable Addressable Market
 * @param currentServedMarket - Current market served by company
 * @returns Market opportunity (white space)
 */
export function calculateMarketOpportunity(
  sam: number,
  currentServedMarket: number
): number {
  return Math.round(sam - currentServedMarket);
}

/**
 * Calculate addressable market share
 * 
 * @param currentRevenue - Company's current revenue
 * @param addressableMarket - TAM/SAM/SOM to calculate share of
 * @returns Market share as percentage
 */
export function calculateMarketShare(currentRevenue: number, addressableMarket: number): number {
  if (addressableMarket === 0) return 0;
  return (currentRevenue / addressableMarket) * 100;
}

/**
 * Calculate total market value at risk
 * 
 * Useful for competitive threat analysis
 * 
 * @param tam - Total Addressable Market
 * @param riskPercentage - Percentage of market at risk
 * @returns Market value at risk
 */
export function calculateMarketAtRisk(tam: number, riskPercentage: number): number {
  return Math.round(tam * (riskPercentage / 100));
}

/**
 * Calculate price-based market sizing
 * 
 * When you know units but need to estimate market value
 * 
 * @param totalUnits - Total units in market
 * @param avgPrice - Average price per unit
 * @returns Market size estimate
 */
export function calculateMarketFromUnits(totalUnits: number, avgPrice: number): number {
  return Math.round(totalUnits * avgPrice);
}

/**
 * Calculate potential revenue based on SOM
 * 
 * @param som - Serviceable Obtainable Market
 * @param captureRate - Expected capture rate (0-100)
 * @returns Potential revenue
 */
export function calculatePotentialRevenue(som: number, captureRate: number): number {
  return Math.round(som * (captureRate / 100));
}

/**
 * Full market size calculation pipeline
 * 
 * Calculates all market metrics at once
 * 
 * @param data - Raw market size data
 * @param currentRevenue - Current company revenue for penetration calc
 * @returns Fully calculated market metrics
 */
export function calculateCompleteMarketSize(
  data: MarketSizeData,
  currentRevenue: number = 0
): CalculatedMarketSize {
  const tam = data.tam;
  const sam = calculateSAM(tam, data.samPercentage);
  const som = calculateSOM(sam, data.somPercentage);
  
  const tamGrowth = calculateMarketGrowth(tam, data.tamGrowthRate);
  const samGrowth = calculateMarketGrowth(sam, data.tamGrowthRate); // Use same growth rate
  const somGrowth = calculateMarketGrowth(som, data.tamGrowthRate);
  
  const penetrationRate = calculatePenetrationRate(currentRevenue, tam);
  const marketOpportunity = calculateMarketOpportunity(sam, currentRevenue);
  const growthPotential = calculateMarketGrowthAmount(tamGrowth, tam);
  
  return {
    tam: Math.round(tam),
    sam,
    som,
    tamGrowth,
    samGrowth,
    somGrowth,
    tamCurrency: data.currency,
    penetrationRate: Math.round(penetrationRate * 100) / 100,
    marketOpportunity,
    growthPotential,
  };
}

/**
 * Compare market size across regions
 * 
 * @param regions - Array of region data with TAM values
 * @returns Ranking of regions by size
 */
export function rankRegionsBySize(
  regions: Array<{ region: string; tam: number }>
): Array<{ region: string; tam: number; percentage: number }> {
  const totalTAM = regions.reduce((sum, r) => sum + r.tam, 0);
  
  return [...regions]
    .sort((a, b) => b.tam - a.tam)
    .map((region) => ({
      ...region,
      percentage: (region.tam / totalTAM) * 100,
    }));
}

/**
 * Calculate market expansion opportunity
 * 
 * For entering new geographic or product markets
 * 
 * @param newMarketTAM - TAM of new market
 * @param newMarketGrowthRate - Growth rate in new market
 * @param captureRatePotential - Expected capture rate (0-100)
 * @param timeToMarket - Months to establish market presence
 * @returns Expansion potential analysis
 */
export function calculateExpansionOpportunity(
  newMarketTAM: number,
  newMarketGrowthRate: number,
  captureRatePotential: number,
  timeToMarket: number
): {
  potentialRevenue: number;
  yearOneRevenue: number;
  paybackPeriod: number;
  investmentRequired: number;
} {
  // Assume $10k investment per month to market
  const investmentRequired = timeToMarket * 10000;
  
  // Full market capture at growth rate
  const fullMarketRevenue = (newMarketTAM * captureRatePotential) / 100;
  
  // Year 1 is partial (months delayed by time-to-market, then accelerating)
  const monthsInYear1 = 12 - timeToMarket;
  const rampUpFactor = monthsInYear1 / 12;
  const yearOneRevenue = Math.round(fullMarketRevenue * rampUpFactor);
  
  // Payback period (months)
  const monthlyRevenue = yearOneRevenue / 12;
  const paybackPeriod = monthlyRevenue > 0 ? Math.round(investmentRequired / monthlyRevenue) : 0;
  
  return {
    potentialRevenue: Math.round(fullMarketRevenue),
    yearOneRevenue,
    paybackPeriod,
    investmentRequired,
  };
}

/**
 * Estimate TAM using top-down approach
 * 
 * Starting from industry, working down to addressable market
 * 
 * @param industrySize - Total industry size
 * @param relevantSegmentPercentage - % of industry relevant to company
 * @param addressablePercentage - % of segment that's addressable
 * @returns Estimated TAM
 */
export function estimateTAMTopDown(
  industrySize: number,
  relevantSegmentPercentage: number,
  addressablePercentage: number
): number {
  const relevantSegment = industrySize * (relevantSegmentPercentage / 100);
  const tam = relevantSegment * (addressablePercentage / 100);
  return Math.round(tam);
}

/**
 * Estimate TAM using bottom-up approach
 * 
 * Starting from units and building up
 * 
 * @param totalPotentialCustomers - Total potential customers in market
 * @param avgAnnualValuePerCustomer - Average annual spend per customer
 * @returns Estimated TAM
 */
export function estimateTAMBottomUp(
  totalPotentialCustomers: number,
  avgAnnualValuePerCustomer: number
): number {
  return Math.round(totalPotentialCustomers * avgAnnualValuePerCustomer);
}

/**
 * Validate market size estimates (sanity check)
 * 
 * @param tam - TAM estimate
 * @param sam - SAM estimate
 * @param som - SOM estimate
 * @returns Validation result with issues if any
 */
export function validateMarketSizes(
  tam: number,
  sam: number,
  som: number
): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  
  if (sam > tam) {
    issues.push("SAM cannot be greater than TAM");
  }
  
  if (som > sam) {
    issues.push("SOM cannot be greater than SAM");
  }
  
  if (tam === 0) {
    issues.push("TAM must be greater than 0");
  }
  
  if (sam / tam > 1) {
    issues.push("SAM ratio should not exceed 100% of TAM");
  }
  
  if (som / sam > 1) {
    issues.push("SOM ratio should not exceed 100% of SAM");
  }
  
  return {
    valid: issues.length === 0,
    issues,
  };
}

/**
 * Calculate 3-year market projection
 * 
 * @param currentMarketSize - Current market size
 * @param growthRate - Annual growth rate
 * @returns Array of projections for years 1, 2, 3
 */
export function projectMarket3Years(
  currentMarketSize: number,
  growthRate: number
): Array<{
  year: number;
  marketSize: number;
  growth: number;
}> {
  const projections = [];
  let previous = currentMarketSize;
  
  for (let year = 1; year <= 3; year++) {
    const marketSize = calculateMarketGrowth(currentMarketSize, growthRate, year);
    const growth = marketSize - previous;
    
    projections.push({
      year,
      marketSize,
      growth,
    });
    
    previous = marketSize;
  }
  
  return projections;
}
