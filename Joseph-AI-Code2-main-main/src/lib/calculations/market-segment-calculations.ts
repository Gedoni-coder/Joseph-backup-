/**
 * Market Segment Calculations Module
 * 
 * Handles customer and market segment analysis including:
 * - Segment sizing and TAM breakdown
 * - Customer value calculations
 * - Penetration rate analysis
 * - Segment growth and attractiveness
 * - Segment prioritization
 */

export interface SegmentData {
  segment: string;
  segmentTAM: number; // TAM for this segment
  avgCustomerValue: number;
  estimatedCustomers?: number;
  growthRate: number;
  penetrationRate?: number; // Current penetration (0-100)
  market: string;
}

export interface CalculatedSegment {
  segment: string;
  segmentTAM: number;
  percentageOfTAM: number;
  avgCustomerValue: number;
  estimatedCustomers: number;
  potentialCustomers: number;
  currentRevenue: number;
  potentialRevenue: number;
  growthRate: number;
  penetrationRate: number;
  attractivenessScore: number;
  priority: "high" | "medium" | "low";
}

/**
 * Calculate segment size as percentage of total TAM
 * 
 * @param segmentTAM - Segment TAM
 * @param totalTAM - Total TAM
 * @returns Percentage of total TAM
 */
export function calculateSegmentPercentage(segmentTAM: number, totalTAM: number): number {
  if (totalTAM === 0) return 0;
  return (segmentTAM / totalTAM) * 100;
}

/**
 * Calculate estimated number of customers in segment
 * 
 * Formula: Segment TAM / Average Customer Value
 * 
 * @param segmentTAM - Segment TAM
 * @param avgCustomerValue - Average annual value per customer
 * @returns Estimated customer count
 */
export function calculateCustomerCount(segmentTAM: number, avgCustomerValue: number): number {
  if (avgCustomerValue === 0) return 0;
  return Math.round(segmentTAM / avgCustomerValue);
}

/**
 * Calculate penetration rate for segment
 * 
 * @param currentCustomers - Number of current customers in segment
 * @param totalMarketCustomers - Total customers available in segment
 * @returns Penetration rate as percentage
 */
export function calculateSegmentPenetration(
  currentCustomers: number,
  totalMarketCustomers: number
): number {
  if (totalMarketCustomers === 0) return 0;
  return (currentCustomers / totalMarketCustomers) * 100;
}

/**
 * Calculate current revenue from segment
 * 
 * @param customers - Number of customers in segment
 * @param avgCustomerValue - Average value per customer
 * @return Revenue from segment
 */
export function calculateSegmentRevenue(customers: number, avgCustomerValue: number): number {
  return Math.round(customers * avgCustomerValue);
}

/**
 * Calculate revenue potential in segment
 * 
 * Based on total addressable customers
 * 
 * @param totalCustomers - Total addressable customers
 * @param avgCustomerValue - Average value per customer
 * @returns Total revenue potential
 */
export function calculateSegmentPotential(totalCustomers: number, avgCustomerValue: number): number {
  return Math.round(totalCustomers * avgCustomerValue);
}

/**
 * Calculate segment growth projection
 * 
 * @param currentRevenue - Current segment revenue
 * @param growthRate - Annual growth rate (%)
 * @param years - Years to project
 * @returns Projected revenue
 */
export function calculateSegmentGrowth(
  currentRevenue: number,
  growthRate: number,
  years: number = 1
): number {
  const projected = currentRevenue * Math.pow(1 + growthRate / 100, years);
  return Math.round(projected);
}

/**
 * Calculate segment market share
 * 
 * @param segmentRevenue - Revenue in segment
 * @param totalSegmentMarket - Total segment market size
 * @returns Market share percentage
 */
export function calculateSegmentMarketShare(
  segmentRevenue: number,
  totalSegmentMarket: number
): number {
  if (totalSegmentMarket === 0) return 0;
  return (segmentRevenue / totalSegmentMarket) * 100;
}

/**
 * Calculate segment attractiveness score
 * 
 * Based on:
 * - Market size (30%)
 * - Growth rate (30%)
 * - Profitability (20%)
 * - Competitive intensity (20%)
 * 
 * @param segmentTAM - Segment TAM
 * @param growthRate - Growth rate (%)
 * @param profitMargin - Profit margin (%)
 * @param competitorCount - Number of competitors
 * @returns Attractiveness score (0-100)
 */
export function calculateSegmentAttractiveness(
  segmentTAM: number,
  growthRate: number,
  profitMargin: number,
  competitorCount: number,
  totalTAM: number = 50000000
): number {
  // Size score (normalize by average market size)
  const sizeScore = Math.min((segmentTAM / totalTAM) * 100, 100);
  
  // Growth score (assume 50% is target)
  const growthScore = Math.min((growthRate / 50) * 100, 100);
  
  // Profitability score
  const profitScore = Math.min((profitMargin / 40) * 100, 100);
  
  // Competitive score (fewer competitors = higher score, assume 10 is max)
  const competitiveScore = Math.max(100 - (competitorCount / 10) * 100, 0);
  
  // Weighted average
  const attractiveness =
    sizeScore * 0.3 + growthScore * 0.3 + profitScore * 0.2 + competitiveScore * 0.2;
  
  return Math.round(attractiveness);
}

/**
 * Determine segment priority
 * 
 * @param attractivenessScore - Segment attractiveness (0-100)
 * @param penetration - Current penetration rate
 * @param ourStrength - Our strength in segment (0-100)
 * @returns Priority level
 */
export function determineSegmentPriority(
  attractivenessScore: number,
  penetration: number,
  ourStrength: number
): "high" | "medium" | "low" {
  const priorityScore = attractivenessScore * 0.4 + ourStrength * 0.4 + (100 - penetration) * 0.2;
  
  if (priorityScore >= 70) return "high";
  if (priorityScore >= 40) return "medium";
  return "low";
}

/**
 * Calculate full segment analysis
 * 
 * @param data - Raw segment data
 * @param totalTAM - Total TAM for percentage calc
 * @param currentCustomers - Number of customers we have in segment
 * @param ourStrength - Our competitive strength (0-100)
 * @param profitMargin - Profit margin in segment
 * @param competitors - Number of competitors
 * @returns Fully calculated segment metrics
 */
export function calculateCompleteSegment(
  data: SegmentData,
  totalTAM: number,
  currentCustomers: number = 0,
  ourStrength: number = 50,
  profitMargin: number = 25,
  competitors: number = 5
): CalculatedSegment {
  const estimatedCustomers = calculateCustomerCount(data.segmentTAM, data.avgCustomerValue);
  const percentageOfTAM = calculateSegmentPercentage(data.segmentTAM, totalTAM);
  const penetrationRate = calculateSegmentPenetration(currentCustomers, estimatedCustomers);
  const currentRevenue = calculateSegmentRevenue(currentCustomers, data.avgCustomerValue);
  const potentialRevenue = calculateSegmentPotential(estimatedCustomers, data.avgCustomerValue);
  const attractivenessScore = calculateSegmentAttractiveness(
    data.segmentTAM,
    data.growthRate,
    profitMargin,
    competitors,
    totalTAM
  );
  const priority = determineSegmentPriority(attractivenessScore, penetrationRate, ourStrength);
  
  return {
    segment: data.segment,
    segmentTAM: Math.round(data.segmentTAM),
    percentageOfTAM: Math.round(percentageOfTAM * 100) / 100,
    avgCustomerValue: Math.round(data.avgCustomerValue),
    estimatedCustomers,
    potentialCustomers: Math.round(estimatedCustomers - currentCustomers),
    currentRevenue,
    potentialRevenue,
    growthRate: data.growthRate,
    penetrationRate: Math.round(penetrationRate * 100) / 100,
    attractivenessScore: Math.round(attractivenessScore),
    priority,
  };
}

/**
 * Calculate batch of segments
 * 
 * @param segments - Array of segment data
 * @param totalTAM - Total TAM
 * @param customerData - Map of segment to customer count
 * @param strengthData - Map of segment to our strength
 * @returns Array of calculated segments
 */
export function calculateBatchSegments(
  segments: SegmentData[],
  totalTAM: number,
  customerData: Record<string, number> = {},
  strengthData: Record<string, number> = {}
): CalculatedSegment[] {
  return segments.map((segment) => {
    const customers = customerData[segment.segment] ?? 0;
    const strength = strengthData[segment.segment] ?? 50;
    return calculateCompleteSegment(segment, totalTAM, customers, strength);
  });
}

/**
 * Rank segments by opportunity
 * 
 * Combines attractiveness and growth potential
 * 
 * @param segments - Array of calculated segments
 * @returns Segments sorted by opportunity (best first)
 */
export function rankSegmentsByOpportunity(segments: CalculatedSegment[]): CalculatedSegment[] {
  return [...segments].sort((a, b) => {
    const opportunityA = a.attractivenessScore * (1 + a.growthRate / 100);
    const opportunityB = b.attractivenessScore * (1 + b.growthRate / 100);
    return opportunityB - opportunityA;
  });
}

/**
 * Identify high-growth segments
 * 
 * @param segments - Array of calculated segments
 * @param growthThreshold - Minimum growth rate (%)
 * @returns Segments with growth >= threshold
 */
export function getHighGrowthSegments(
  segments: CalculatedSegment[],
  growthThreshold: number = 15
): CalculatedSegment[] {
  return segments.filter((s) => s.growthRate >= growthThreshold);
}

/**
 * Identify underserved segments
 * 
 * High attractiveness but low penetration
 * 
 * @param segments - Array of calculated segments
 * @returns Underserved segments
 */
export function getUnderservedSegments(segments: CalculatedSegment[]): CalculatedSegment[] {
  return segments.filter((s) => s.attractivenessScore >= 70 && s.penetrationRate <= 20);
}

/**
 * Calculate total addressable market across segments
 * 
 * @param segments - Array of calculated segments
 * @returns Sum of segment TAMs
 */
export function calculateTotalSegmentMarket(segments: CalculatedSegment[]): number {
  return segments.reduce((sum, s) => sum + s.segmentTAM, 0);
}

/**
 * Calculate total current revenue from all segments
 * 
 * @param segments - Array of calculated segments
 * @returns Sum of current revenues
 */
export function calculateTotalCurrentRevenue(segments: CalculatedSegment[]): number {
  return segments.reduce((sum, s) => sum + s.currentRevenue, 0);
}

/**
 * Calculate total revenue potential across all segments
 * 
 * @param segments - Array of calculated segments
 * @returns Sum of potential revenues
 */
export function calculateTotalPotentialRevenue(segments: CalculatedSegment[]): number {
  return segments.reduce((sum, s) => sum + s.potentialRevenue, 0);
}

/**
 * Calculate market expansion opportunity
 * 
 * Revenue gap between current and potential
 * 
 * @param segments - Array of calculated segments
 * @returns Total expansion opportunity
 */
export function calculateExpansionOpportunity(segments: CalculatedSegment[]): number {
  const current = calculateTotalCurrentRevenue(segments);
  const potential = calculateTotalPotentialRevenue(segments);
  return potential - current;
}

/**
 * Estimate market saturation level
 * 
 * Average penetration across all segments
 * 
 * @param segments - Array of calculated segments
 * @returns Average penetration rate
 */
export function calculateAveragePenetration(segments: CalculatedSegment[]): number {
  if (segments.length === 0) return 0;
  const avg = segments.reduce((sum, s) => sum + s.penetrationRate, 0) / segments.length;
  return Math.round(avg * 100) / 100;
}

/**
 * Calculate weighted average growth rate
 * 
 * Weighted by segment size
 * 
 * @param segments - Array of calculated segments
 * @returns Weighted average growth rate
 */
export function calculateWeightedGrowthRate(segments: CalculatedSegment[]): number {
  const totalTAM = calculateTotalSegmentMarket(segments);
  if (totalTAM === 0) return 0;
  
  const weightedGrowth = segments.reduce((sum, s) => {
    const weight = s.segmentTAM / totalTAM;
    return sum + s.growthRate * weight;
  }, 0);
  
  return Math.round(weightedGrowth * 10) / 10;
}

/**
 * Segment overlap analysis
 * 
 * For products/services serving multiple segments
 * 
 * @param segments - Array of segments
 * @param overlapPercentage - % of revenue that serves multiple segments
 * @returns Overlap metrics
 */
export function analyzeSegmentOverlap(
  segments: CalculatedSegment[],
  overlapPercentage: number = 0
): {
  totalRevenue: number;
  overlapValue: number;
  uniqueRevenue: number;
} {
  const totalRevenue = calculateTotalCurrentRevenue(segments);
  const overlapValue = Math.round(totalRevenue * (overlapPercentage / 100));
  const uniqueRevenue = totalRevenue - overlapValue;
  
  return {
    totalRevenue,
    overlapValue,
    uniqueRevenue,
  };
}

/**
 * Calculate segment-specific customer acquisition cost
 * 
 * @param marketingSpend - Marketing spend in segment
 * @param newCustomers - New customers acquired
 * @returns CAC for segment
 */
export function calculateSegmentCAC(marketingSpend: number, newCustomers: number): number {
  if (newCustomers === 0) return 0;
  return Math.round(marketingSpend / newCustomers);
}

/**
 * Calculate segment lifetime value
 * 
 * @param avgCustomerValue - Average annual value
 * @param customerRetention - Retention rate (%)
 * @param years - Expected customer lifespan (years)
 * @returns CLV for segment
 */
export function calculateSegmentCLV(
  avgCustomerValue: number,
  customerRetention: number,
  years: number = 3
): number {
  const annualRetention = customerRetention / 100;
  let clv = 0;
  
  for (let year = 0; year < years; year++) {
    const survivalRate = Math.pow(annualRetention, year);
    clv += avgCustomerValue * survivalRate;
  }
  
  return Math.round(clv);
}
