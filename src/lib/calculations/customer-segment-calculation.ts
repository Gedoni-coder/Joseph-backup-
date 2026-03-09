/**
 * Customer Segment Calculation Utilities
 * Contains all business logic for customer segment analysis (Market Module)
 */

import { CustomerSegment } from "@/lib/market-data";

/**
 * Calculate segment revenue potential
 * @param segment - Customer segment
 * @returns Total revenue potential
 */
export function calculateSegmentRevenuePotential(segment: CustomerSegment): number {
  return segment.size * segment.avgSpending;
}

/**
 * Calculate total market size across all segments
 * @param segments - Array of customer segments
 * @returns Total market size
 */
export function calculateTotalMarketSize(segments: CustomerSegment[]): number {
  return segments.reduce((sum, s) => sum + s.size, 0);
}

/**
 * Calculate total revenue potential across all segments
 * @param segments - Array of customer segments
 * @returns Total revenue potential
 */
export function calculateTotalSegmentRevenuePotential(segments: CustomerSegment[]): number {
  return segments.reduce((sum, s) => sum + calculateSegmentRevenuePotential(s), 0);
}

/**
 * Calculate weighted average growth rate
 * @param segments - Array of customer segments
 * @returns Weighted average growth rate
 */
export function calculateSegmentWeightedAvgGrowth(segments: CustomerSegment[]): number {
  if (segments.length === 0) return 0;
  
  const totalSize = calculateTotalMarketSize(segments);
  if (totalSize === 0) return 0;
  
  const weightedSum = segments.reduce((sum, s) => {
    const weight = s.size / totalSize;
    return sum + (s.growthRate * weight);
  }, 0);
  
  return Math.round(weightedSum * 10) / 10;
}

/**
 * Calculate average spending across segments
 * @param segments - Array of customer segments
 * @returns Average spending weighted by segment size
 */
export function calculateAvgSegmentSpending(segments: CustomerSegment[]): number {
  const totalRevenue = calculateTotalSegmentRevenuePotential(segments);
  const totalSize = calculateTotalMarketSize(segments);
  
  if (totalSize === 0) return 0;
  return Math.round(totalRevenue / totalSize);
}

/**
 * Get priority segments (high priority first)
 * @param segments - Array of customer segments
 * @returns Sorted segments by priority
 */
export function getPrioritySegments(segments: CustomerSegment[]): CustomerSegment[] {
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  return [...segments].sort((a, b) => 
    priorityOrder[a.priority] - priorityOrder[b.priority]
  );
}

/**
 * Get highest growth segment
 * @param segments - Array of customer segments
 * @returns Segment with highest growth rate
 */
export function getMarketHighestGrowthSegment(segments: CustomerSegment[]): CustomerSegment | null {
  if (segments.length === 0) return null;
  return segments.reduce((highest, s) => 
    s.growthRate > (highest?.growthRate || 0) ? s : highest, segments[0]
  );
}

/**
 * Get highest value segment (by revenue potential)
 * @param segments - Array of customer segments
 * @returns Segment with highest revenue potential
 */
export function getMarketHighestValueSegment(segments: CustomerSegment[]): CustomerSegment | null {
  if (segments.length === 0) return null;
  return segments.reduce((highest, s) => {
    const currentPotential = calculateSegmentRevenuePotential(s);
    const highestPotential = highest ? calculateSegmentRevenuePotential(highest) : 0;
    return currentPotential > highestPotential ? s : highest;
  }, segments[0]);
}

/**
 * Calculate segment distribution
 * @param segments - Array of customer segments
 * @returns Object with segment percentages
 */
export function calculateMarketSegmentDistribution(segments: CustomerSegment[]): Record<string, number> {
  const total = calculateTotalMarketSize(segments);
  if (total === 0) return {};
  
  return segments.reduce((acc, s) => {
    acc[s.name] = Math.round((s.size / total) * 100);
    return acc;
  }, {} as Record<string, number>);
}

/**
 * Calculate revenue distribution
 * @param segments - Array of customer segments
 * @returns Object with revenue percentages
 */
export function calculateMarketRevenueDistribution(segments: CustomerSegment[]): Record<string, number> {
  const total = calculateTotalSegmentRevenuePotential(segments);
  if (total === 0) return {};
  
  return segments.reduce((acc, s) => {
    const segmentRevenue = calculateSegmentRevenuePotential(s);
    acc[s.name] = Math.round((segmentRevenue / total) * 100);
    return acc;
  }, {} as Record<string, number>);
}

/**
 * Get segment summary
 * @param segments - Array of customer segments
 * @returns Summary object
 */
export function getMarketSegmentSummary(segments: CustomerSegment[]): {
  totalCustomers: number;
  totalRevenuePotential: number;
  avgGrowthRate: number;
  avgSpending: number;
  segmentCount: number;
  highPriorityCount: number;
} {
  return {
    totalCustomers: calculateTotalMarketSize(segments),
    totalRevenuePotential: calculateTotalSegmentRevenuePotential(segments),
    avgGrowthRate: calculateSegmentWeightedAvgGrowth(segments),
    avgSpending: calculateAvgSegmentSpending(segments),
    segmentCount: segments.length,
    highPriorityCount: segments.filter(s => s.priority === 'high').length,
  };
}

/**
 * Format segment size for display
 * @param size - Number of customers
 * @returns Formatted string
 */
export function formatSegmentSize(size: number): string {
  if (size >= 1000000) {
    return `${(size / 1000000).toFixed(1)}M`;
  }
  if (size >= 1000) {
    return `${(size / 1000).toFixed(0)}K`;
  }
  return size.toLocaleString();
}

