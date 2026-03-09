/**
 * Supply Chain Summary Generation Utilities
 * Contains all business logic for generating dynamic supply chain summaries
 */

import { Supplier, ProcurementOrder, ProductionPlan, DisruptionRisk } from "@/lib/supply-chain-data";
import { 
  calculateSupplierPerformanceSummary, 
  SupplierScore 
} from "./supplier-performance-calculation";
import { 
  calculateProcurementSummary, 
  ProcurementMetrics 
} from "./procurement-calculation";
import { 
  calculateProductionSummary, 
  ProductionMetrics 
} from "./production-planning-calculation";
import { 
  calculateRiskSummary, 
  RiskScore,
  RiskLevel
} from "./supply-chain-risk-calculation";

export interface SupplyChainSummaryContent {
  supplierOverview: string;
  procurementOverview: string;
  productionOverview: string;
  riskOverview: string;
  recommendations: string;
}

export interface SupplyChainMetricsSummary {
  totalSuppliers: number;
  averageSupplierScore: number;
  highRiskSuppliers: number;
  pendingOrders: number;
  lateOrders: number;
  activeProductions: number;
  delayedProductions: number;
  totalRisks: number;
  highRiskCount: number;
  mitigationCoverage: number;
}

/**
 * Generate supply chain summary content
 * @param suppliers - Suppliers array
 * @param orders - Procurement orders array
 * @param productions - Production plans array
 * @param risks - Disruption risks array
 * @returns Summary content
 */
export function generateSupplyChainSummary(
  suppliers: Supplier[],
  orders: ProcurementOrder[],
  productions: ProductionPlan[],
  risks: DisruptionRisk[]
): SupplyChainSummaryContent {
  const supplierScores = suppliers.map(s => ({
    supplierId: s.id,
    supplierName: s.name,
    overallScore: s.performanceMetrics.overallScore,
    onTimeDelivery: s.performanceMetrics.onTimeDelivery,
    qualityRating: s.performanceMetrics.qualityRating,
    costCompetitiveness: s.performanceMetrics.costCompetitiveness,
    responseTime: s.performanceMetrics.responseTime,
    riskLevel: s.riskAssessment.overallRisk,
    trend: "stable" as const
  }));
  
  const supplierSummary = calculateSupplierPerformanceSummary(supplierScores);
  const procurementSummary = calculateProcurementSummary(orders);
  const productionSummary = calculateProductionSummary(productions);
  
  const riskScores: RiskScore[] = risks.map(r => ({
    riskId: r.id,
    type: r.type,
    description: r.description,
    probability: r.probability,
    impact: r.impact,
    riskScore: r.riskScore,
    riskLevel: r.riskScore >= 50 ? "high" as RiskLevel : r.riskScore >= 25 ? "medium" as RiskLevel : "low" as RiskLevel,
    affectedSuppliers: r.affectedSuppliers,
    affectedRegions: r.affectedRegions,
    mitigationStatus: r.mitigationStrategies.length > 0 ? "partial" as const : "none" as const
  }));
  
  const riskSummary = calculateRiskSummary(riskScores);
  
  // Supplier Overview
  const supplierOverview = `Supplier Network: ${suppliers.length} active suppliers with average performance score of ${supplierSummary.averageScore}%. ` +
    `${supplierSummary.topPerformers.length} top performers identified. ` +
    `${supplierSummary.highRiskSuppliers} suppliers flagged as high risk. ` +
    `Average on-time delivery: ${supplierSummary.averageOnTimeDelivery}%.`;
  
  // Procurement Overview
  const procurementOverview = `Procurement: ${procurementSummary.totalOrders} total orders worth $${procurementSummary.totalValue.toLocaleString()}. ` +
    `${procurementSummary.pendingOrders} pending, ${procurementSummary.inTransitOrders} in transit. ` +
    `${procurementSummary.lateOrders} late deliveries. ` +
    `On-time delivery rate: ${procurementSummary.onTimeRate}%. Average lead time: ${procurementSummary.averageLeadTime} days.`;
  
  // Production Overview
  const productionOverview = `Production: ${productionSummary.totalPlans} production plans. ` +
    `${productionSummary.activePlans} active, ${productionSummary.completedPlans} completed, ${productionSummary.delayedPlans} delayed. ` +
    `Average efficiency: ${productionSummary.averageEfficiency}%. ` +
    `Overall progress: ${productionSummary.overallProgress}%. ` +
    `${productionSummary.criticalBottlenecks.length} critical bottlenecks identified.`;
  
  // Risk Overview
  const riskOverview = `Risk Profile: ${riskSummary.totalRisks} identified risks. ` +
    `${riskSummary.highRiskCount} high-risk, ${riskSummary.mediumRiskCount} medium-risk, ${riskSummary.lowRiskCount} low-risk. ` +
    `Average risk score: ${riskSummary.averageRiskScore}. ` +
    `Mitigation coverage: ${riskSummary.mitigationCoverage}%.`;
  
  // Recommendations
  let recommendations = "";
  
  if (supplierSummary.underperformers.length > 0) {
    recommendations += `1. Supplier Improvement: Address ${supplierSummary.underperformers.length} underperforming suppliers through QBRs and improvement plans. `;
  }
  
  if (procurementSummary.lateOrders > 0) {
    recommendations += `2. Delivery Performance: Review ${procurementSummary.lateOrders} late orders and implement corrective actions with suppliers. `;
  }
  
  if (productionSummary.delayedPlans > 0) {
    recommendations += `3. Production Recovery: Address ${productionSummary.delayedPlans} delayed production plans and resolve material shortfalls. `;
  }
  
  if (riskSummary.highRiskCount > 0) {
    recommendations += `4. Risk Mitigation: Develop contingency plans for ${riskSummary.highRiskCount} high-priority risks. `;
  }
  
  if (riskSummary.mitigationCoverage < 50) {
    recommendations += `5. Mitigation Gap: Only ${riskSummary.mitigationCoverage}% of risks have mitigation strategies. Increase coverage.`;
  }
  
  if (recommendations === "") {
    recommendations = "Supply chain operations are healthy. Continue monitoring and optimization efforts.";
  }
  
  return {
    supplierOverview,
    procurementOverview,
    productionOverview,
    riskOverview,
    recommendations
  };
}

/**
 * Generate supply chain metrics summary
 * @param suppliers - Suppliers array
 * @param orders - Procurement orders array
 * @param productions - Production plans array
 * @param risks - Disruption risks array
 * @returns Metrics summary
 */
export function generateSupplyChainMetricsSummary(
  suppliers: Supplier[],
  orders: ProcurementOrder[],
  productions: ProductionPlan[],
  risks: DisruptionRisk[]
): SupplyChainMetricsSummary {
  const supplierScores = suppliers.map(s => ({
    supplierId: s.id,
    supplierName: s.name,
    overallScore: s.performanceMetrics.overallScore,
    onTimeDelivery: s.performanceMetrics.onTimeDelivery,
    qualityRating: s.performanceMetrics.qualityRating,
    costCompetitiveness: s.performanceMetrics.costCompetitiveness,
    responseTime: s.performanceMetrics.responseTime,
    riskLevel: s.riskAssessment.overallRisk,
    trend: "stable" as const
  }));
  
  const supplierSummary = calculateSupplierPerformanceSummary(supplierScores);
  const procurementSummary = calculateProcurementSummary(orders);
  const productionSummary = calculateProductionSummary(productions);
  
  const riskScores: RiskScore[] = risks.map(r => ({
    riskId: r.id,
    type: r.type,
    description: r.description,
    probability: r.probability,
    impact: r.impact,
    riskScore: r.riskScore,
    riskLevel: r.riskScore >= 50 ? "high" as RiskLevel : r.riskScore >= 25 ? "medium" as RiskLevel : "low" as RiskLevel,
    affectedSuppliers: r.affectedSuppliers,
    affectedRegions: r.affectedRegions,
    mitigationStatus: r.mitigationStrategies.length > 0 ? "partial" as const : "none" as const
  }));
  
  const riskSummary = calculateRiskSummary(riskScores);
  
  return {
    totalSuppliers: suppliers.length,
    averageSupplierScore: supplierSummary.averageScore,
    highRiskSuppliers: supplierSummary.highRiskSuppliers,
    pendingOrders: procurementSummary.pendingOrders,
    lateOrders: procurementSummary.lateOrders,
    activeProductions: productionSummary.activePlans,
    delayedProductions: productionSummary.delayedPlans,
    totalRisks: riskSummary.totalRisks,
    highRiskCount: riskSummary.highRiskCount,
    mitigationCoverage: riskSummary.mitigationCoverage
  };
}

/**
 * Generate action items for supply chain
 * @param suppliers - Suppliers array
 * @param orders - Procurement orders array
 * @param productions - Production plans array
 * @param risks - Disruption risks array
 * @returns Array of action items
 */
export function generateSupplyChainActionItems(
  suppliers: Supplier[],
  orders: ProcurementOrder[],
  productions: ProductionPlan[],
  risks: DisruptionRisk[]
): { title: string; description: string; priority: "high" | "medium" | "low" }[] {
  const actions: { title: string; description: string; priority: "high" | "medium" | "low" }[] = [];
  
  // Supplier actions
  const supplierScores = suppliers.map(s => ({
    supplierId: s.id,
    supplierName: s.name,
    overallScore: s.performanceMetrics.overallScore,
    onTimeDelivery: s.performanceMetrics.onTimeDelivery,
    qualityRating: s.performanceMetrics.qualityRating,
    costCompetitiveness: s.performanceMetrics.costCompetitiveness,
    responseTime: s.performanceMetrics.responseTime,
    riskLevel: s.riskAssessment.overallRisk,
    trend: "stable" as const
  }));
  
  const supplierSummary = calculateSupplierPerformanceSummary(supplierScores);
  
  if (supplierSummary.underperformers.length > 0) {
    actions.push({
      title: "Supplier Performance Review",
      description: `${supplierSummary.underperformers.length} suppliers below performance threshold`,
      priority: "high"
    });
  }
  
  // Procurement actions
  const procurementSummary = calculateProcurementSummary(orders);
  
  if (procurementSummary.lateOrders > 0) {
    actions.push({
      title: "Late Order Resolution",
      description: `${procurementSummary.lateOrders} orders past expected delivery date`,
      priority: "high"
    });
  }
  
  if (procurementSummary.pendingOrders > 3) {
    actions.push({
      title: "Pending Order Follow-up",
      description: `${procurementSummary.pendingOrders} orders awaiting confirmation`,
      priority: "medium"
    });
  }
  
  // Production actions
  const productionSummary = calculateProductionSummary(productions);
  
  if (productionSummary.delayedPlans > 0) {
    actions.push({
      title: "Production Delay Recovery",
      description: `${productionSummary.delayedPlans} production plans delayed`,
      priority: "high"
    });
  }
  
  if (productionSummary.materialShortfalls.length > 0) {
    actions.push({
      title: "Material Shortage Resolution",
      description: `${productionSummary.materialShortfalls.length} materials below required quantity`,
      priority: "high"
    });
  }
  
  // Risk actions
  const riskScores: RiskScore[] = risks.map(r => ({
    riskId: r.id,
    type: r.type,
    description: r.description,
    probability: r.probability,
    impact: r.impact,
    riskScore: r.riskScore,
    riskLevel: r.riskScore >= 50 ? "high" as RiskLevel : r.riskScore >= 25 ? "medium" as RiskLevel : "low" as RiskLevel,
    affectedSuppliers: r.affectedSuppliers,
    affectedRegions: r.affectedRegions,
    mitigationStatus: r.mitigationStrategies.length > 0 ? "partial" as const : "none" as const
  }));
  
  const riskSummary = calculateRiskSummary(riskScores);
  
  if (riskSummary.highRiskCount > 0) {
    actions.push({
      title: "High Risk Mitigation",
      description: `${riskSummary.highRiskCount} risks require immediate mitigation plans`,
      priority: "high"
    });
  }
  
  if (riskSummary.mitigationCoverage < 50) {
    actions.push({
      title: "Risk Mitigation Expansion",
      description: `Only ${riskSummary.mitigationCoverage}% of risks have mitigation strategies`,
      priority: "medium"
    });
  }
  
  return actions;
}

/**
 * Generate next steps for supply chain
 * @param suppliers - Suppliers array
 * @param orders - Procurement orders array
 * @returns Array of next steps
 */
export function generateSupplyChainNextSteps(
  suppliers: Supplier[],
  orders: ProcurementOrder[]
): { step: string; owner: string; timeline: string }[] {
  const steps: { step: string; owner: string; timeline: string }[] = [];
  
  steps.push({
    step: "Review supplier scorecards and schedule QBRs with underperformers",
    owner: "Procurement Lead",
    timeline: "This Week"
  });
  
  steps.push({
    step: "Follow up on pending procurement orders",
    owner: "Procurement Team",
    timeline: "This Week"
  });
  
  steps.push({
    step: "Update production schedules and material requirements",
    owner: "Production Manager",
    timeline: "Next Week"
  });
  
  steps.push({
    step: "Review and update risk mitigation strategies",
    owner: "Supply Chain Director",
    timeline: "Bi-weekly"
  });
  
  return steps;
}

/**
 * Format score for display
 * @param score - Score value
 * @returns Formatted string
 */
export function formatScore(score: number): string {
  return `${score.toFixed(1)}%`;
}

/**
 * Format currency for display
 * @param value - Currency value
 * @returns Formatted string
 */
export function formatCurrency(value: number): string {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value.toFixed(0)}`;
}

