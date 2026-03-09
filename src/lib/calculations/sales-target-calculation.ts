/**
 * Sales Target Calculation Utilities
 * Contains all business logic for sales target and rep performance analysis
 */

export interface SalesTarget {
  id: string;
  salesRepId: string;
  salesRepName: string;
  targetPeriod: string;
  targetAmount: number;
  achievedAmount: number;
  status: string;
  dealsClosed: number;
  avgDealSize: number;
}

export interface RepAchievement {
  target: number;
  achieved: number;
  percentage: number;
}

/**
 * Calculate total team target
 */
export function calculateTotalTeamTarget(targets: SalesTarget[]): number {
  if (targets.length === 0) return 0;
  return targets.reduce((sum, t) => sum + t.targetAmount, 0);
}

/**
 * Calculate total achieved amount
 */
export function calculateTotalAchieved(targets: SalesTarget[]): number {
  if (targets.length === 0) return 0;
  return targets.reduce((sum, t) => sum + t.achievedAmount, 0);
}

/**
 * Calculate average team achievement percentage
 */
export function calculateAvgTeamAchievement(targets: SalesTarget[]): number {
  const target = calculateTotalTeamTarget(targets);
  const achieved = calculateTotalAchieved(targets);
  if (target === 0) return 0;
  return (achieved / target) * 100;
}

/**
 * Calculate rep achievements
 */
export function calculateRepAchievements(
  targets: SalesTarget[]
): Record<string, RepAchievement> {
  const achievements: Record<string, RepAchievement> = {};

  targets.forEach(target => {
    if (!achievements[target.salesRepId]) {
      achievements[target.salesRepId] = {
        target: 0,
        achieved: 0,
        percentage: 0,
      };
    }
    achievements[target.salesRepId].target += target.targetAmount;
    achievements[target.salesRepId].achieved += target.achievedAmount;
  });

  // Calculate percentage for each rep
  Object.keys(achievements).forEach(repId => {
    const data = achievements[repId];
    if (data.target > 0) {
      data.percentage = (data.achieved / data.target) * 100;
    }
  });

  return achievements;
}

/**
 * Get top performer
 */
export function getTopPerformer(
  achievements: Record<string, RepAchievement>,
  repsList: Array<{ id: string; name: string }>
): { name: string; achievement: number } {
  if (Object.keys(achievements).length === 0) {
    return { name: "N/A", achievement: 0 };
  }

  let topRepId = "";
  let maxPercentage = 0;

  Object.entries(achievements).forEach(([repId, data]) => {
    if (data.percentage > maxPercentage) {
      maxPercentage = data.percentage;
      topRepId = repId;
    }
  });

  const rep = repsList.find(r => r.id === topRepId);
  return { name: rep?.name || "Unknown", achievement: Math.round(maxPercentage) };
}

/**
 * Calculate quota achievement average
 */
export function calculateQuotaAchievementAvg(
  achievements: Record<string, RepAchievement>
): number {
  if (Object.keys(achievements).length === 0) return 0;
  const total = Object.values(achievements).reduce(
    (sum, rep) => sum + rep.percentage,
    0
  );
  return Math.round(total / Object.keys(achievements).length);
}

/**
 * Calculate forecast accuracy
 */
export function calculateForecastAccuracy(targets: SalesTarget[]): number {
  if (targets.length === 0) return 0;
  const achieved = targets.filter(
    t => (t.achievedAmount / t.targetAmount) * 100 >= 100
  ).length;
  return Math.round((achieved / targets.length) * 100);
}

/**
 * Calculate next quarter forecast (remaining targets)
 */
export function calculateNextQuarterForecast(targets: SalesTarget[]): number {
  if (targets.length === 0) return 0;
  return targets.reduce((sum, t) => {
    const shortfall = Math.max(0, t.targetAmount - t.achievedAmount);
    return sum + shortfall;
  }, 0);
}

/**
 * Calculate KPIs on target
 */
export function calculateKpisOnTarget(targets: SalesTarget[]): number {
  return targets.filter(t => t.achievedAmount >= t.targetAmount).length;
}

/**
 * Calculate overall health
 */
export function calculateOverallHealth(targets: SalesTarget[]): number {
  if (targets.length === 0) return 0;
  const kpisOnTarget = calculateKpisOnTarget(targets);
  return Math.round((kpisOnTarget / targets.length) * 100);
}

/**
 * Get target summary
 */
export function getTargetSummary(
  targets: SalesTarget[],
  repsList: Array<{ id: string; name: string }>
): {
  totalTarget: number;
  totalAchieved: number;
  achievement: number;
  targetsCount: number;
  onTarget: number;
  topPerformer: string;
} {
  const achievements = calculateRepAchievements(targets);
  const topPerformer = getTopPerformer(achievements, repsList);

  return {
    totalTarget: calculateTotalTeamTarget(targets),
    totalAchieved: calculateTotalAchieved(targets),
    achievement: calculateAvgTeamAchievement(targets),
    targetsCount: targets.length,
    onTarget: calculateKpisOnTarget(targets),
    topPerformer: topPerformer.name,
  };
}
