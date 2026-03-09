/**
 * Sales Intelligence Summary Generation Utilities
 * Contains all business logic for generating dynamic sales intelligence content
 */

import {
  calculatePipelineValue,
  calculatePipelineWinRate,
  calculatePipelineAvgDealSize,
  calculateAvgSalesCycle,
  calculateAvgLeadScore,
  calculatePipelineHealth,
  calculateAvgProbability,
  getTotalLeads,
  getQualifiedLeads,
  calculateLeadSourceDistribution,
} from "./lead-pipeline-calculation";

import {
  calculateTotalTeamTarget,
  calculateTotalAchieved,
  calculateAvgTeamAchievement,
  calculateRepAchievements,
  getTopPerformer,
  calculateQuotaAchievementAvg,
  calculateForecastAccuracy,
  calculateNextQuarterForecast,
  calculateKpisOnTarget,
  calculateOverallHealth,
} from "./sales-target-calculation";

import {
  calculateEngagementRate,
  getOptimalTiming,
  getTopChannel,
  calculateAvgCallsPerDay,
  calculateActivityRate,
  calculateCoachingMoments,
  calculateRepImprovement,
  calculateCallSuccessRate,
} from "./engagement-calculation";

export interface SalesSummaryMetrics {
  index: number;
  title: string;
  value: string;
  insight: string;
}

export interface SalesActionItem {
  index: number;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  timeline: string;
}

/**
 * Generate sales intelligence summary
 */
export function generateSalesSummary(
  leads: any[],
  targets: any[],
  engagements: any[],
  repsList: any[]
): string {
  const totalPipeline = calculatePipelineValue(leads);
  const winRate = calculatePipelineWinRate(leads);
  const avgDealSize = calculatePipelineAvgDealSize(leads);
  const salesCycle = calculateAvgSalesCycle(leads);
  const pipelineHealth = calculatePipelineHealth(leads);
  const totalLeads = getTotalLeads(leads);
  const qualifiedLeads = getQualifiedLeads(leads);

  const achievements = calculateRepAchievements(targets);
  const teamAchievement = calculateAvgTeamAchievement(targets);
  const topPerformer = getTopPerformer(achievements, repsList);

  const engagementRate = calculateEngagementRate(engagements);
  const topChannel = getTopChannel(engagements);

  return `1. PIPELINE OVERVIEW
Total pipeline value stands at $${(totalPipeline / 1000000).toFixed(1)}M with ${totalLeads} active leads. Win rate is ${winRate.toFixed(0)}% with average deal size of $${(avgDealSize / 1000).toFixed(0)}K.

2. LEAD QUALITY
${qualifiedLeads} of ${totalLeads} leads are qualified (score >= 60), representing ${pipelineHealth.toFixed(0)}% pipeline health. Average lead score is ${calculateAvgLeadScore(leads).toFixed(1)}/100.

3. TEAM PERFORMANCE
Team has achieved ${teamAchievement.toFixed(0)}% of total targets. ${topPerformer.name} is the top performer with ${topPerformer.achievement}% achievement.

4. ENGAGEMENT METRICS
Engagement rate is ${engagementRate}%. ${topChannel} is the most effective channel for customer engagement.

5. SALES CYCLE
Average sales cycle is ${salesCycle} days. Focus on reducing cycle time for faster revenue realization.`;
}

/**
 * Generate sales recommendations
 */
export function generateSalesRecommendations(
  leads: any[],
  targets: any[],
  engagements: any[]
): string {
  const winRate = calculatePipelineWinRate(leads);
  const pipelineHealth = calculatePipelineHealth(leads);
  const teamAchievement = calculateAvgTeamAchievement(targets);
  const engagementRate = calculateEngagementRate(engagements);

  let recommendations = "";

  recommendations += `1. PIPELINE OPTIMIZATION\n`;
  recommendations += `Current pipeline health is ${pipelineHealth.toFixed(0)}%. Focus on moving cold leads to warmer stages through targeted nurturing campaigns.\n\n`;

  recommendations += `2. WIN RATE IMPROVEMENT\n`;
  recommendations += `Win rate is ${winRate.toFixed(0)}%. Implement best practices from top performers to improve close rates.\n\n`;

  recommendations += `3. TARGET ACHIEVEMENT\n`;
  recommendations += `Team achievement is at ${teamAchievement.toFixed(0)}%. Review underperforming targets and adjust strategies.\n\n`;

  recommendations += `4. ENGAGEMENT EFFICIENCY\n`;
  recommendations += `Engagement rate is ${engagementRate}%. Optimize follow-up timing and channel selection based on performance data.\n\n`;

  recommendations += `5. SALES CYCLE OPTIMIZATION\n`;
  recommendations += `Identify bottlenecks in the sales process and implement automation where possible to reduce cycle time.`;

  return recommendations;
}

/**
 * Generate summary metrics
 */
export function generateSalesSummaryMetrics(
  leads: any[],
  targets: any[],
  engagements: any[],
  repsList: any[]
): SalesSummaryMetrics[] {
  const achievements = calculateRepAchievements(targets);

  return [
    {
      index: 1,
      title: "Pipeline Value",
      value: `$${(calculatePipelineValue(leads) / 1000000).toFixed(1)}M`,
      insight: "Total weighted pipeline value",
    },
    {
      index: 2,
      title: "Win Rate",
      value: `${calculatePipelineWinRate(leads).toFixed(0)}%`,
      insight: "Hot leads / Total leads",
    },
    {
      index: 3,
      title: "Avg Deal Size",
      value: `$${(calculatePipelineAvgDealSize(leads) / 1000).toFixed(0)}K`,
      insight: "Pipeline value / Total leads",
    },
    {
      index: 4,
      title: "Sales Cycle",
      value: `${calculateAvgSalesCycle(leads)} days`,
      insight: "Average days to close",
    },
    {
      index: 5,
      title: "Team Achievement",
      value: `${calculateAvgTeamAchievement(targets).toFixed(0)}%`,
      insight: "Total achieved / Total target",
    },
    {
      index: 6,
      title: "Engagement Rate",
      value: `${calculateEngagementRate(engagements)}%`,
      insight: "Average response rate",
    },
  ];
}

/**
 * Generate action items
 */
export function generateSalesActionItems(
  leads: any[],
  targets: any[],
  engagements: any[]
): SalesActionItem[] {
  const pipelineHealth = calculatePipelineHealth(leads);
  const teamAchievement = calculateAvgTeamAchievement(targets);
  const engagementRate = calculateEngagementRate(engagements);

  const items: SalesActionItem[] = [];

  if (pipelineHealth < 70) {
    items.push({
      index: items.length + 1,
      title: "Pipeline Health Improvement",
      description: `Pipeline health is at ${pipelineHealth.toFixed(0)}%. Implement lead nurturing campaigns to move cold leads to warmer stages.`,
      priority: "high",
      timeline: "This Week",
    });
  }

  if (teamAchievement < 80) {
    items.push({
      index: items.length + 1,
      title: "Target Achievement Review",
      description: `Team achievement is at ${teamAchievement.toFixed(0)}%. Conduct one-on-one sessions with underperforming reps.`,
      priority: "high",
      timeline: "This Week",
    });
  }

  if (engagementRate < 50) {
    items.push({
      index: items.length + 1,
      title: "Engagement Optimization",
      description: `Engagement rate is ${engagementRate}%. Review and optimize communication strategies.`,
      priority: "medium",
      timeline: "Next Week",
    });
  }

  items.push({
    index: items.length + 1,
    title: "Sales Coaching Session",
    description: "Schedule coaching sessions to share best practices and improve team performance.",
    priority: "medium",
    timeline: "This Month",
  });

  items.push({
    index: items.length + 1,
    title: "Process Automation Review",
    description: "Identify opportunities to automate repetitive tasks and reduce sales cycle time.",
    priority: "low",
    timeline: "Next Month",
  });

  return items;
}

/**
 * Generate sales alerts
 */
export function generateSalesAlerts(
  leads: any[],
  targets: any[],
  engagements: any[]
): { type: string; title: string; description: string; severity: "high" | "medium" | "low" }[] {
  const alerts: { type: string; title: string; description: string; severity: "high" | "medium" | "low" }[] = [];

  const pipelineHealth = calculatePipelineHealth(leads);
  if (pipelineHealth < 50) {
    alerts.push({
      type: "warning",
      title: "Low Pipeline Health",
      description: `Only ${pipelineHealth.toFixed(0)}% of leads are in healthy stages. Immediate action required.`,
      severity: "high",
    });
  }

  const teamAchievement = calculateAvgTeamAchievement(targets);
  if (teamAchievement < 50) {
    alerts.push({
      type: "warning",
      title: "Low Target Achievement",
      description: `Team achievement is at ${teamAchievement.toFixed(0)}%. Review and adjust targets.`,
      severity: "high",
    });
  }

  const coldLeads = leads.filter(l => l.leadScore < 60).length;
  if (coldLeads > leads.length * 0.5) {
    alerts.push({
      type: "warning",
      title: "High Cold Lead Ratio",
      description: `${coldLeads} leads need nurturing. Implement targeted campaigns.`,
      severity: "medium",
    });
  }

  if (engagements.length === 0) {
    alerts.push({
      type: "info",
      title: "No Engagement Data",
      description: "Start creating engagements to track communication effectiveness.",
      severity: "medium",
    });
  }

  return alerts;
}
