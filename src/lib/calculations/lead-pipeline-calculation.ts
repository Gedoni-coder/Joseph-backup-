/**
 * Lead Pipeline Calculation Utilities
 * Contains all business logic for lead and pipeline analysis
 */

export interface LeadMetrics {
  score: number;
  probability: number;
}

// Stage-based lead metrics mapping
const stageMetrics: Record<string, LeadMetrics> = {
  "Outreach Attempted": { score: 25, probability: 9 },
  Unresponsive: { score: 31, probability: 12 },
  "No Response Yet": { score: 28, probability: 7 },
  "Lead Contacted": { score: 68, probability: 48 },
  "Initial Qualification": { score: 61, probability: 40 },
  "Product Demo Booked": { score: 72, probability: 54 },
  "Proposal Sent": { score: 92, probability: 88 },
  Negotiation: { score: 95, probability: 93 },
  "Decision Pending": { score: 89, probability: 80 },
};

/**
 * Get metrics for a pipeline stage
 */
export function getStageMetrics(stage: string): LeadMetrics {
  return stageMetrics[stage] || { score: 50, probability: 35 };
}

/**
 * Categorize lead as Hot, Warm, or Cold based on score
 */
export function categorizeLeadByScore(score: number): "hot" | "warm" | "cold" {
  if (score >= 80) return "hot";
  if (score >= 60) return "warm";
  return "cold";
}

/**
 * Calculate pipeline value: sum of (Deal Value x Win Probability)
 */
export function calculatePipelineValue(leads: any[]): number {
  if (leads.length === 0) return 0;
  const baseDealValue = 50000;
  return leads.reduce((sum, lead) => {
    const dealValue = (lead.probability / 100) * baseDealValue;
    return sum + dealValue;
  }, 0);
}

/**
 * Calculate win rate: (Hot Leads / Total Leads) x 100
 */
export function calculatePipelineWinRate(leads: any[]): number {
  if (leads.length === 0) return 0;
  const hotCount = leads.filter(l => categorizeLeadByScore(l.leadScore) === "hot").length;
  return (hotCount / leads.length) * 100;
}

/**
 * Calculate average deal size
 */
export function calculatePipelineAvgDealSize(leads: any[]): number {
  if (leads.length === 0) return 0;
  const pipelineValue = calculatePipelineValue(leads);
  return pipelineValue / leads.length;
}

/**
 * Calculate average sales cycle length in days
 */
export function calculateAvgSalesCycle(leads: any[]): number {
  if (leads.length === 0) return 0;
  const totalDays = leads.reduce((sum, lead) => {
    const opening = new Date(lead.opening);
    const close = new Date(lead.expectedClose);
    const days = Math.ceil((close.getTime() - opening.getTime()) / (1000 * 60 * 60 * 24));
    return sum + days;
  }, 0);
  return Math.round(totalDays / leads.length);
}

/**
 * Calculate average lead score
 */
export function calculateAvgLeadScore(leads: any[]): number {
  if (leads.length === 0) return 0;
  const totalScore = leads.reduce((sum, lead) => sum + lead.leadScore, 0);
  return totalScore / leads.length;
}

/**
 * Calculate pipeline health: (Hot + Warm) / Total x 100
 */
export function calculatePipelineHealth(leads: any[]): number {
  if (leads.length === 0) return 0;
  const healthyLeads = leads.filter(l => {
    const category = categorizeLeadByScore(l.leadScore);
    return category === "hot" || category === "warm";
  }).length;
  return (healthyLeads / leads.length) * 100;
}

/**
 * Calculate average deal probability
 */
export function calculateAvgProbability(leads: any[]): number {
  if (leads.length === 0) return 0;
  const totalProbability = leads.reduce((sum, lead) => sum + lead.probability, 0);
  return totalProbability / leads.length / 100;
}

/**
 * Get total leads count
 */
export function getTotalLeads(leads: any[]): number {
  return leads.length;
}

/**
 * Get qualified leads (score >= 60)
 */
export function getQualifiedLeads(leads: any[]): number {
  return leads.filter(l => l.leadScore >= 60).length;
}

/**
 * Get leads by category
 */
export function getLeadsByCategory(leads: any[]): { hot: any[]; warm: any[]; cold: any[] } {
  return {
    hot: leads.filter(l => categorizeLeadByScore(l.leadScore) === "hot"),
    warm: leads.filter(l => categorizeLeadByScore(l.leadScore) === "warm"),
    cold: leads.filter(l => categorizeLeadByScore(l.leadScore) === "cold"),
  };
}

/**
 * Get lead source distribution
 */
export function calculateLeadSourceDistribution(leads: any[]): Record<string, number> {
  const total = leads.length;
  if (total === 0) return { Website: 0, "Social Media": 0, "Email Campaign": 0, Referrals: 0 };

  const sources: Record<string, number> = {
    Website: 0,
    "Social Media": 0,
    "Email Campaign": 0,
    Referrals: 0,
  };

  leads.forEach(lead => {
    if (lead.leadSource && sources.hasOwnProperty(lead.leadSource)) {
      sources[lead.leadSource]++;
    }
  });

  // Convert to percentages
  Object.keys(sources).forEach(key => {
    sources[key] = Math.round((sources[key] / total) * 100);
  });

  return sources;
}

/**
 * Calculate deal value from lead
 */
export function getLeadDealValue(lead: any): number {
  const baseDealValue = 50000;
  return (lead.probability / 100) * baseDealValue;
}

/**
 * Calculate total revenue from leads
 */
export function calculateTotalRevenueFromLeads(leads: any[]): number {
  return leads.reduce((sum, lead) => sum + getLeadDealValue(lead), 0);
}

/**
 * Calculate revenue by product/category
 */
export function calculateRevenueByProduct(leads: any[]): { category: string; revenue: number; percentage: number }[] {
  const products: Record<string, { revenue: number; count: number }> = {};
  
  leads.forEach(lead => {
    const product = lead.product || "Product A";
    if (!products[product]) {
      products[product] = { revenue: 0, count: 0 };
    }
    products[product].revenue += getLeadDealValue(lead);
    products[product].count++;
  });

  const total = calculateTotalRevenueFromLeads(leads);
  
  return Object.entries(products)
    .map(([category, data]) => ({
      category,
      revenue: Math.round(data.revenue),
      percentage: total > 0 ? Math.round((data.revenue / total) * 100) : 0,
    }))
    .sort((a, b) => b.revenue - a.revenue);
}

/**
 * Calculate revenue by region
 */
export function calculateRevenueByRegion(leads: any[]): { category: string; revenue: number; percentage: number }[] {
  const regions: Record<string, { revenue: number; count: number }> = {};
  
  leads.forEach(lead => {
    const region = lead.region || "North America";
    if (!regions[region]) {
      regions[region] = { revenue: 0, count: 0 };
    }
    regions[region].revenue += getLeadDealValue(lead);
    regions[region].count++;
  });

  const total = calculateTotalRevenueFromLeads(leads);
  
  return Object.entries(regions)
    .map(([category, data]) => ({
      category,
      revenue: Math.round(data.revenue),
      percentage: total > 0 ? Math.round((data.revenue / total) * 100) : 0,
    }))
    .sort((a, b) => b.revenue - a.revenue);
}

/**
 * Calculate revenue by industry
 */
export function calculateRevenueByIndustry(leads: any[]): { category: string; revenue: number; percentage: number }[] {
  const industries: Record<string, { revenue: number; count: number }> = {};
  
  leads.forEach(lead => {
    const industry = lead.industry || "Technology";
    if (!industries[industry]) {
      industries[industry] = { revenue: 0, count: 0 };
    }
    industries[industry].revenue += getLeadDealValue(lead);
    industries[industry].count++;
  });

  const total = calculateTotalRevenueFromLeads(leads);
  
  return Object.entries(industries)
    .map(([category, data]) => ({
      category,
      revenue: Math.round(data.revenue),
      percentage: total > 0 ? Math.round((data.revenue / total) * 100) : 0,
    }))
    .sort((a, b) => b.revenue - a.revenue);
}

/**
 * Calculate revenue by segment
 */
export function calculateRevenueBySegment(leads: any[]): { category: string; revenue: number; percentage: number }[] {
  const segments: Record<string, { revenue: number; count: number }> = {};
  
  leads.forEach(lead => {
    let segment = lead.segment;
    if (!segment) {
      // Assign segment based on lead score
      if (lead.leadScore >= 80) segment = "Enterprise";
      else if (lead.leadScore >= 60) segment = "Mid-Market";
      else segment = "SMB";
    }
    
    if (!segments[segment]) {
      segments[segment] = { revenue: 0, count: 0 };
    }
    segments[segment].revenue += getLeadDealValue(lead);
    segments[segment].count++;
  });

  const total = calculateTotalRevenueFromLeads(leads);
  
  return Object.entries(segments)
    .map(([category, data]) => ({
      category,
      revenue: Math.round(data.revenue),
      percentage: total > 0 ? Math.round((data.revenue / total) * 100) : 0,
    }))
    .sort((a, b) => b.revenue - a.revenue);
}
