/**
 * Supply Chain Risk Calculation Utilities
 * Contains all business logic for supply chain risk calculations
 */

import { DisruptionRisk, MitigationStrategy } from "@/lib/supply-chain-data";

export type RiskLevel = "low" | "medium" | "high";
export type RiskType = "natural-disaster" | "geopolitical" | "pandemic" | "cyber" | "supplier-failure";

export interface RiskScore {
  riskId: string;
  type: RiskType;
  description: string;
  probability: number;
  impact: number;
  riskScore: number;
  riskLevel: RiskLevel;
  affectedSuppliers: string[];
  affectedRegions: string[];
  mitigationStatus: "none" | "planned" | "partial" | "complete";
}

export interface RiskSummary {
  totalRisks: number;
  highRiskCount: number;
  mediumRiskCount: number;
  lowRiskCount: number;
  averageRiskScore: number;
  topRisks: RiskScore[];
  risksByType: Record<RiskType, number>;
  mitigationCoverage: number;
}

/**
 * Calculate risk score
 * @param probability - Probability (0-100)
 * @param impact - Impact (0-100)
 * @returns Risk score (0-100)
 */
export function calculateRiskScore(probability: number, impact: number): number {
  // Risk Score = Probability × Impact (normalized to 0-100)
  return Math.round((probability * impact) / 100);
}

/**
 * Determine risk level based on score
 * @param score - Risk score
 * @returns Risk level
 */
export function determineRiskLevel(score: number): RiskLevel {
  if (score >= 50) return "high";
  if (score >= 25) return "medium";
  return "low";
}

/**
 * Determine mitigation status
 * @param strategies - Array of mitigation strategies
 * @returns Mitigation status
 */
export function determineMitigationStatus(strategies: MitigationStrategy[]): "none" | "planned" | "partial" | "complete" {
  if (strategies.length === 0) return "none";
  
  const allCompleted = strategies.every(s => s.status === "completed");
  const anyActive = strategies.some(s => s.status === "active" || s.status === "implementing");
  const anyPlanned = strategies.some(s => s.status === "planned");
  
  if (allCompleted) return "complete";
  if (anyActive) return "partial";
  if (anyPlanned) return "planned";
  return "none";
}

/**
 * Calculate effectiveness of mitigation strategies
 * @param strategies - Array of mitigation strategies
 * @returns Average effectiveness (0-100)
 */
export function calculateMitigationEffectiveness(strategies: MitigationStrategy[]): number {
  if (strategies.length === 0) return 0;
  const total = strategies.reduce((sum, s) => sum + s.effectiveness, 0);
  return Math.round(total / strategies.length);
}

/**
 * Analyze a single risk
 * @param risk - Disruption risk
 * @returns Risk score
 */
export function analyzeRisk(risk: DisruptionRisk): RiskScore {
  const riskScore = calculateRiskScore(risk.probability, risk.impact);
  const riskLevel = determineRiskLevel(riskScore);
  const mitigationStatus = determineMitigationStatus(risk.mitigationStrategies);
  
  return {
    riskId: risk.id,
    type: risk.type,
    description: risk.description,
    probability: risk.probability,
    impact: risk.impact,
    riskScore,
    riskLevel,
    affectedSuppliers: risk.affectedSuppliers,
    affectedRegions: risk.affectedRegions,
    mitigationStatus
  };
}

/**
 * Analyze all risks
 * @param risks - Array of disruption risks
 * @returns Array of risk scores
 */
export function analyzeAllRisks(risks: DisruptionRisk[]): RiskScore[] {
  return risks.map(analyzeRisk);
}

/**
 * Calculate risk summary
 * @param risks - Array of risk scores
 * @returns Summary metrics
 */
export function calculateRiskSummary(risks: RiskScore[]): RiskSummary {
  if (risks.length === 0) {
    return {
      totalRisks: 0,
      highRiskCount: 0,
      mediumRiskCount: 0,
      lowRiskCount: 0,
      averageRiskScore: 0,
      topRisks: [],
      risksByType: {
        "natural-disaster": 0,
        geopolitical: 0,
        pandemic: 0,
        cyber: 0,
        "supplier-failure": 0
      },
      mitigationCoverage: 0
    };
  }
  
  const highRiskCount = risks.filter(r => r.riskLevel === "high").length;
  const mediumRiskCount = risks.filter(r => r.riskLevel === "medium").length;
  const lowRiskCount = risks.filter(r => r.riskLevel === "low").length;
  
  const averageRiskScore = Math.round(
    risks.reduce((sum, r) => sum + r.riskScore, 0) / risks.length
  );
  
  // Top 5 risks by score
  const topRisks = [...risks]
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 5);
  
  // Risks by type
  const risksByType: Record<RiskType, number> = {
    "natural-disaster": risks.filter(r => r.type === "natural-disaster").length,
    geopolitical: risks.filter(r => r.type === "geopolitical").length,
    pandemic: risks.filter(r => r.type === "pandemic").length,
    cyber: risks.filter(r => r.type === "cyber").length,
    "supplier-failure": risks.filter(r => r.type === "supplier-failure").length
  };
  
  // Mitigation coverage (risks with at least partial mitigation)
  const mitigatedRisks = risks.filter(r => r.mitigationStatus !== "none").length;
  const mitigationCoverage = Math.round((mitigatedRisks / risks.length) * 100);
  
  return {
    totalRisks: risks.length,
    highRiskCount,
    mediumRiskCount,
    lowRiskCount,
    averageRiskScore,
    topRisks,
    risksByType,
    mitigationCoverage
  };
}

/**
 * Get risks by level
 * @param risks - Array of risk scores
 * @param level - Risk level to filter
 * @returns Filtered risks
 */
export function getRisksByLevel(risks: RiskScore[], level: RiskLevel): RiskScore[] {
  return risks.filter(r => r.riskLevel === level);
}

/**
 * Get high priority risks
 * @param risks - Array of risk scores
 * @returns High priority risks
 */
export function getHighPriorityRisks(risks: RiskScore[]): RiskScore[] {
  return risks
    .filter(r => r.riskLevel === "high" && r.mitigationStatus !== "complete")
    .sort((a, b) => b.riskScore - a.riskScore);
}

/**
 * Get unprotected risks (no mitigation)
 * @param risks - Array of risk scores
 * @returns Unprotected risks
 */
export function getUnprotectedRisks(risks: RiskScore[]): RiskScore[] {
  return risks.filter(r => r.mitigationStatus === "none");
}

/**
 * Get risks by type
 * @param risks - Array of risk scores
 * @param type - Risk type to filter
 * @returns Filtered risks
 */
export function getRisksByType(risks: RiskScore[], type: RiskType): RiskScore[] {
  return risks.filter(r => r.type === type);
}

/**
 * Format risk score for display
 * @param score - Risk score
 * @returns Formatted string
 */
export function formatRiskScore(score: number): string {
  if (score >= 50) return `${score} (High)`;
  if (score >= 25) return `${score} (Medium)`;
  return `${score} (Low)`;
}

/**
 * Get risk level color
 * @param level - Risk level
 * @returns Color hex code
 */
export function getRiskLevelColor(level: RiskLevel): string {
  switch (level) {
    case "high": return "#ef4444";
    case "medium": return "#f59e0b";
    case "low": return "#22c55e";
    default: return "#6b7280";
  }
}

/**
 * Get risk type icon name
 * @param type - Risk type
 * @returns Icon name
 */
export function getRiskTypeIcon(type: RiskType): string {
  switch (type) {
    case "natural-disaster": return "cloud-lightning";
    case "geopolitical": return "globe";
    case "pandemic": return "virus";
    case "cyber": return "shield";
    case "supplier-failure": return "truck";
    default: return "alert-triangle";
  }
}

