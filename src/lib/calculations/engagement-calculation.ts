/**
 * Engagement Calculation Utilities
 * Contains all business logic for multi-channel engagement analysis
 */

export interface EngagementData {
  id: string;
  personName: string;
  companyName: string;
  dealDescription: string;
  channel: string;
  engagementScore: number;
  avgResponseRate: number;
  avgResponseTimeMinutes: number;
  followUpRate: number;
  timesContacted: number;
}

/**
 * Calculate engagement rate
 */
export function calculateEngagementRate(engagements: EngagementData[]): number {
  if (engagements.length === 0) return 0;
  const totalResponseRate = engagements.reduce(
    (sum, e) => sum + e.avgResponseRate,
    0
  );
  return Math.round(totalResponseRate / engagements.length);
}

/**
 * Get optimal timing
 */
export function getOptimalTiming(engagements: EngagementData[]): string {
  if (engagements.length === 0) return "N/A";
  
  const avgTime =
    engagements.reduce((sum, e) => sum + e.avgResponseTimeMinutes, 0) /
    engagements.length;

  const hour = Math.floor(avgTime / 60);
  if (hour >= 8 && hour <= 10) return "8AM-10AM";
  if (hour >= 10 && hour <= 12) return "10AM-12PM";
  if (hour >= 12 && hour <= 14) return "12PM-2PM";
  if (hour >= 14 && hour <= 16) return "2PM-4PM";
  if (hour >= 16 && hour <= 18) return "4PM-6PM";
  return "9AM-11AM";
}

/**
 * Get top channel
 */
export function getTopChannel(engagements: EngagementData[]): string {
  if (engagements.length === 0) return "N/A";

  const channelScores: Record<string, number> = {
    whatsapp: 0,
    sms: 0,
    email: 0,
    linkedin: 0,
  };

  engagements.forEach(eng => {
    if (channelScores.hasOwnProperty(eng.channel)) {
      channelScores[eng.channel] += eng.engagementScore;
    }
  });

  const topChannelKey = Object.keys(channelScores).reduce((a, b) =>
    channelScores[a] > channelScores[b] ? a : b
  );

  const channelNames: Record<string, string> = {
    whatsapp: "WhatsApp",
    sms: "SMS",
    email: "Email",
    linkedin: "LinkedIn",
  };

  return channelNames[topChannelKey] || "N/A";
}

/**
 * Calculate average calls per day
 */
export function calculateAvgCallsPerDay(
  engagements: EngagementData[],
  repsCount: number
): number {
  if (engagements.length === 0 || repsCount === 0) return 0;
  const totalCalls = engagements.reduce(
    (sum, e) => sum + e.timesContacted,
    0
  );
  return Math.round(totalCalls / repsCount);
}

/**
 * Calculate activity rate
 */
export function calculateActivityRate(
  engagements: EngagementData[],
  targets: any[],
  repsCount: number
): number {
  if (repsCount === 0) return 0;
  
  const activeReps = new Set<string>();

  targets.forEach(target => {
    activeReps.add(target.salesRepId);
  });

  const activeCount = Math.min(activeReps.size, repsCount);
  return Math.round((activeCount / repsCount) * 100);
}

/**
 * Calculate coaching moments
 */
export function calculateCoachingMoments(engagements: EngagementData[]): number {
  return engagements.length;
}

/**
 * Calculate rep improvement
 */
export function calculateRepImprovement(engagements: EngagementData[]): number {
  if (engagements.length < 2) return 0;
  
  const recentEngagements = engagements.slice(-Math.ceil(engagements.length / 2));
  const olderEngagements = engagements.slice(0, Math.floor(engagements.length / 2));

  const recentAvg =
    recentEngagements.reduce((sum, e) => sum + e.engagementScore, 0) /
    recentEngagements.length;
  const olderAvg =
    olderEngagements.reduce((sum, e) => sum + e.engagementScore, 0) /
    olderEngagements.length;

  if (olderAvg === 0) return 0;
  const improvement = ((recentAvg - olderAvg) / olderAvg) * 100;
  return Math.round(improvement);
}

/**
 * Calculate call success rate
 */
export function calculateCallSuccessRate(engagements: EngagementData[]): number {
  if (engagements.length === 0) return 0;
  const avgResponseRate =
    engagements.reduce((sum, e) => sum + e.avgResponseRate, 0) /
    engagements.length;
  return Math.round(avgResponseRate);
}

/**
 * Calculate average response time
 */
export function calculateAvgResponseTime(engagements: EngagementData[]): number {
  if (engagements.length === 0) return 0;
  return engagements.reduce((sum, e) => sum + e.avgResponseTimeMinutes, 0) /
    engagements.length;
}

/**
 * Calculate average follow-up rate
 */
export function calculateAvgFollowUpRate(engagements: EngagementData[]): number {
  if (engagements.length === 0) return 0;
  return engagements.reduce((sum, e) => sum + e.followUpRate, 0) /
    engagements.length;
}

/**
 * Get channel performance
 */
export function getChannelPerformance(
  engagements: EngagementData[]
): { channel: string; count: number; avgScore: number }[] {
  const channels = ["whatsapp", "sms", "email", "linkedin"];
  
  return channels.map(channel => {
    const channelEnagagements = engagements.filter(e => e.channel === channel);
    const count = channelEnagagements.length;
    const avgScore = count > 0
      ? channelEnagagements.reduce((sum, e) => sum + e.engagementScore, 0) / count
      : 0;
    
    return {
      channel,
      count,
      avgScore: Math.round(avgScore * 10) / 10,
    };
  });
}

/**
 * Get engagement summary
 */
export function getEngagementSummary(
  engagements: EngagementData[],
  repsCount: number
): {
  totalEngagements: number;
  avgEngagementRate: number;
  avgResponseTime: number;
  avgFollowUpRate: number;
  topChannel: string;
  optimalTiming: string;
} {
  return {
    totalEngagements: engagements.length,
    avgEngagementRate: calculateEngagementRate(engagements),
    avgResponseTime: calculateAvgResponseTime(engagements),
    avgFollowUpRate: calculateAvgFollowUpRate(engagements),
    topChannel: getTopChannel(engagements),
    optimalTiming: getOptimalTiming(engagements),
  };
}
