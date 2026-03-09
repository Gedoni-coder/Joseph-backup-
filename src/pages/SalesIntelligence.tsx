import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCurrency } from "@/hooks/useCurrency";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import ModuleHeader from "@/components/ui/module-header";
import { useSalesIntelligenceAPI } from "@/hooks/useSalesIntelligenceAPI";
import CreateLeadDialog from "@/components/sales-intelligence/CreateLeadDialog";
import CreateSalesTargetDialog from "@/components/sales-intelligence/CreateSalesTargetDialog";
import CreateEngagementDialog, {
  EngagementData,
} from "@/components/sales-intelligence/CreateEngagementDialog";
import KPIDashboard from "@/components/sales-intelligence/KPIDashboard";
import KPICategories from "@/components/sales-intelligence/KPICategories";
import CustomKPIBuilder from "@/components/sales-intelligence/CustomKPIBuilder";
import BenchmarkingSection from "@/components/sales-intelligence/BenchmarkingSection";
import KPIAlerts from "@/components/sales-intelligence/KPIAlerts";
import ExportReporting from "@/components/sales-intelligence/ExportReporting";
import DealsAnalytics from "@/components/sales-intelligence/DealsAnalytics";
import {
  TrendingUp,
  Users,
  MessageSquare,
  Target,
  BarChart3,
  Zap,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Mail,
  MessageCircle,
  MessageSquareDot,
  Linkedin,
  CheckCircle2,
  Lightbulb,
  Plus,
  Trash2,
  ChevronDown,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Lead {
  company: string;
  description: string;
  opening: string;
  expectedClose: string;
  stage: string;
  leadScore: number;
  probability: number;
  stall: string;
  playbook: string;
  leadSource: string;
  product?: string;
  region?: string;
  industry?: string;
  segment?: string;
  dealSize?: number;
  salesRep?: string;
}

interface SalesTarget {
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

const SalesIntelligence = () => {
  const { format } = useCurrency();
  const location = useLocation();
  const isKPIDashboard = location.pathname === "/kpi-dashboard";
  const [activeTab, setActiveTab] = useState(
    isKPIDashboard ? "kpi" : "overview",
  );
  const [selectedChannel, setSelectedChannel] = useState("whatsapp");
  const [selectedSalesRep, setSelectedSalesRep] = useState<string>("");
  const [createLeadOpen, setCreateLeadOpen] = useState(false);
  const [createTargetOpen, setCreateTargetOpen] = useState(false);
  const [createEngagementOpen, setCreateEngagementOpen] = useState(false);
  const [salesRepsList, setSalesRepsList] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [salesTargets, setSalesTargets] = useState<SalesTarget[]>([]);

  // Lead data state - starts empty
  const [hotLeads, setHotLeads] = useState<Lead[]>([]);
  const [warmLeads, setWarmLeads] = useState<Lead[]>([]);
  const [coldLeads, setColdLeads] = useState<Lead[]>([]);

  // Engagement data state - starts empty
  const [engagements, setEngagements] = useState<EngagementData[]>([]);

  const {
    subModules,
    metrics,
    isLoading,
    isConnected,
    lastUpdated,
    refreshData,
  } = useSalesIntelligenceAPI();

  // Function to calculate AI lead score and probability based on stage
  const calculateLeadMetrics = (stage: string) => {
    const stageMetrics: Record<string, { score: number; probability: number }> =
      {
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

    return stageMetrics[stage] || { score: 50, probability: 35 };
  };

  // Function to categorize lead as Hot, Warm, or Cold based on score
  const categorizeLead = (
    score: number,
    stage: string,
  ): "hot" | "warm" | "cold" => {
    if (score >= 80) return "hot";
    if (score >= 60) return "warm";
    return "cold";
  };

  const handleLeadCreated = (leadData: any) => {
    console.log("New lead created:", leadData);

    if (leadData.type === "document") {
      // TODO: Handle document parsing and bulk lead creation
      return;
    }

    // Create new lead from form data
    const metrics = calculateLeadMetrics(leadData.pipelineStage);
    const newLead: Lead = {
      company: leadData.companyName,
      description: leadData.dealDescription,
      opening: leadData.openingDate,
      expectedClose: leadData.expectedClose,
      stage: leadData.pipelineStage,
      leadScore: metrics.score,
      probability: metrics.probability,
      stall: "No",
      playbook: "Monitor",
      leadSource: leadData.leadSource,
      product: leadData.product,
      region: leadData.region,
      industry: leadData.industry,
      segment: leadData.segment,
      dealSize: leadData.dealSize,
    };

    const category = categorizeLead(metrics.score, leadData.pipelineStage);

    // Add lead to appropriate category
    if (category === "hot") {
      setHotLeads([...hotLeads, newLead]);
    } else if (category === "warm") {
      setWarmLeads([...warmLeads, newLead]);
    } else {
      setColdLeads([...coldLeads, newLead]);
    }
  };

  const handleTargetCreated = (targetData: any) => {
    console.log("New sales target created:", targetData);

    if (targetData.type === "document") {
      // TODO: Handle document parsing and bulk target creation
      return;
    }

    // Create new target with unique ID
    const newTarget: SalesTarget = {
      id: `target-${Date.now()}`,
      salesRepId: targetData.salesRepId,
      salesRepName: targetData.salesRepName,
      targetPeriod: targetData.targetPeriod,
      targetAmount: targetData.targetAmount,
      achievedAmount: targetData.achievedAmount,
      status: targetData.status,
      dealsClosed: targetData.dealsClosed,
      avgDealSize: targetData.avgDealSize,
    };

    // Add target to list
    setSalesTargets([...salesTargets, newTarget]);

    // Auto-select the rep if targets list was empty
    if (!selectedSalesRep) {
      setSelectedSalesRep(targetData.salesRepId);
    }
  };

  const handleSalesRepCreated = (newRep: { id: string; name: string }) => {
    console.log("New sales representative created:", newRep);
    // Add the new rep to the list
    setSalesRepsList([...salesRepsList, newRep]);
    // Auto-select the newly created rep
    setSelectedSalesRep(newRep.id);
  };

  const handleEngagementCreated = (engagementData: EngagementData) => {
    console.log("New engagement created:", engagementData);
    // Add engagement to list
    setEngagements([...engagements, engagementData]);
  };

  // ============================================================
  // ASSET CALCULATION FUNCTIONS
  // ============================================================

  // Calculate Proposals
  // Proposals = Leads at "Proposal Sent" stage or higher + Engagements with score > 7.0
  const calculateProposals = () => {
    const allLeads = [...hotLeads, ...warmLeads, ...coldLeads];

    // Count leads at proposal stage or beyond
    const proposalStages = [
      "Proposal Sent",
      "Negotiation",
      "Decision Pending",
      "Won",
    ];
    const proposalLeads = allLeads.filter((lead) =>
      proposalStages.includes(lead.stage),
    ).length;

    // Count high-quality engagements (score > 7.0)
    const highEngagements = engagements.filter(
      (e) => e.engagementScore > 7.0,
    ).length;

    return proposalLeads + highEngagements;
  };

  // Calculate Quotations with score-based conversion tiers
  // Conversion tiers: Score > 8.0 = 80%, 7.0-8.0 = 60%, 6.0-7.0 = 40%, < 6.0 = 20%
  const calculateQuotations = () => {
    const proposals = calculateProposals();

    // Calculate conversion rate based on engagement scores
    if (engagements.length === 0) return 0;

    let totalConversions = 0;
    engagements.forEach((eng) => {
      if (eng.engagementScore > 8.0) {
        totalConversions += 0.8; // 80% conversion
      } else if (eng.engagementScore >= 7.0) {
        totalConversions += 0.6; // 60% conversion
      } else if (eng.engagementScore >= 6.0) {
        totalConversions += 0.4; // 40% conversion
      } else {
        totalConversions += 0.2; // 20% conversion
      }
    });

    const avgConversion = totalConversions / engagements.length;
    return Math.round(proposals * avgConversion);
  };

  // Calculate Pitch Decks (mixed criteria)
  // Union of: High engagement (>7.0) + Demo booked stage + High probability deals + Warm leads
  const calculatePitchDecks = () => {
    const allLeads = [...hotLeads, ...warmLeads, ...coldLeads];
    const pitchDeckIds = new Set<string>();

    // A) Engagements with score > 7.0
    engagements.forEach((eng) => {
      if (eng.engagementScore > 7.0) {
        pitchDeckIds.add(`engagement-${eng.id}`);
      }
    });

    // B) Leads at "Product Demo Booked" stage or beyond
    const demoStages = [
      "Product Demo Booked",
      "Proposal Sent",
      "Negotiation",
      "Decision Pending",
      "Won",
    ];
    allLeads.forEach((lead) => {
      if (demoStages.includes(lead.stage)) {
        pitchDeckIds.add(`lead-${lead.company}`);
      }
    });

    // C) Leads with high probability (> 70%) - approximate with hot leads that have high probability
    hotLeads.forEach((lead) => {
      if (lead.probability > 70) {
        pitchDeckIds.add(`lead-high-prob-${lead.company}`);
      }
    });

    // D) All warm leads
    warmLeads.forEach((lead) => {
      pitchDeckIds.add(`lead-warm-${lead.company}`);
    });

    return pitchDeckIds.size;
  };

  // Calculate Lead Sources percentages
  const calculateLeadSources = () => {
    const allLeads = [...hotLeads, ...warmLeads, ...coldLeads];
    const total = allLeads.length;

    if (total === 0) {
      return {
        Website: 0,
        "Social Media": 0,
        "Email Campaign": 0,
        Referrals: 0,
      };
    }

    const sources = {
      Website: 0,
      "Social Media": 0,
      "Email Campaign": 0,
      Referrals: 0,
    };

    allLeads.forEach((lead) => {
      if (
        lead.leadSource === "Website" ||
        lead.leadSource === "Social Media" ||
        lead.leadSource === "Email Campaign" ||
        lead.leadSource === "Referrals"
      ) {
        sources[lead.leadSource as keyof typeof sources]++;
      }
    });

    // Convert to percentages
    const percentages = {
      Website: Math.round((sources.Website / total) * 100),
      "Social Media": Math.round((sources["Social Media"] / total) * 100),
      "Email Campaign": Math.round((sources["Email Campaign"] / total) * 100),
      Referrals: Math.round((sources.Referrals / total) * 100),
    };

    return percentages;
  };

  // Lead management functions
  const handleDeleteLead = (
    leadIndex: number,
    category: "hot" | "warm" | "cold",
  ) => {
    if (category === "hot") {
      setHotLeads(hotLeads.filter((_, idx) => idx !== leadIndex));
    } else if (category === "warm") {
      setWarmLeads(warmLeads.filter((_, idx) => idx !== leadIndex));
    } else {
      setColdLeads(coldLeads.filter((_, idx) => idx !== leadIndex));
    }
  };

  const handleChangePipelineStage = (
    lead: Lead,
    newStage: string,
    currentCategory: "hot" | "warm" | "cold",
  ) => {
    // Calculate new metrics based on new stage
    const newMetrics = calculateLeadMetrics(newStage);
    const newCategory = categorizeLead(newMetrics.score, newStage);

    // Create updated lead
    const updatedLead: Lead = {
      ...lead,
      stage: newStage,
      leadScore: newMetrics.score,
      probability: newMetrics.probability,
    };

    // Remove from current category
    if (currentCategory === "hot") {
      setHotLeads(hotLeads.filter((l) => l.company !== lead.company));
    } else if (currentCategory === "warm") {
      setWarmLeads(warmLeads.filter((l) => l.company !== lead.company));
    } else {
      setColdLeads(coldLeads.filter((l) => l.company !== lead.company));
    }

    // Add to new category
    if (newCategory === "hot") {
      setHotLeads([
        ...hotLeads.filter((l) => l.company !== lead.company),
        updatedLead,
      ]);
    } else if (newCategory === "warm") {
      setWarmLeads([
        ...warmLeads.filter((l) => l.company !== lead.company),
        updatedLead,
      ]);
    } else {
      setColdLeads([
        ...coldLeads.filter((l) => l.company !== lead.company),
        updatedLead,
      ]);
    }
  };

  // Sales target management functions
  const handleDeleteTarget = (targetId: string) => {
    setSalesTargets(salesTargets.filter((t) => t.id !== targetId));
  };

  const handleChangeTargetStatus = (targetId: string, newStatus: string) => {
    setSalesTargets(
      salesTargets.map((t) =>
        t.id === targetId ? { ...t, status: newStatus } : t,
      ),
    );
  };

  // ============================================================
  // KPI CALCULATION FUNCTIONS (FORMULAS)
  // ============================================================

  // Get all leads combined
  const allLeads = [...hotLeads, ...warmLeads, ...coldLeads];

  // 1. TOTAL PIPELINE VALUE = ∑(Deal Value × Win Probability)
  // Weighted pipeline formula #26
  const calculatePipelineValue = () => {
    if (allLeads.length === 0) return 0;
    return allLeads.reduce((sum, lead) => {
      // Assume a base deal value based on stage and probability
      // Using probability as a proxy for deal value (0-100 scale)
      const baseDealValue = 50000; // $50K base
      const dealValue = (lead.probability / 100) * baseDealValue;
      return sum + dealValue;
    }, 0);
  };

  // 2. WIN RATE = (Deals Won / Total Opportunities) × 100
  // In our context: Hot leads that are likely to win / Total leads
  // Formula #9
  const calculateWinRate = () => {
    if (allLeads.length === 0) return 0;
    const hotLeadsCount = hotLeads.length;
    return (hotLeadsCount / allLeads.length) * 100;
  };

  // 3. AVERAGE DEAL SIZE = Total Pipeline Value / Total Leads
  // Formula #20
  const calculateAvgDealSize = () => {
    if (allLeads.length === 0) return 0;
    return calculatePipelineValue() / allLeads.length;
  };

  // 4. SALES CYCLE LENGTH = ∑Days to Close / Deals
  // Formula #11
  const calculateSalesCycle = () => {
    if (allLeads.length === 0) return 0;
    const totalDays = allLeads.reduce((sum, lead) => {
      const opening = new Date(lead.opening);
      const close = new Date(lead.expectedClose);
      const days = Math.ceil(
        (close.getTime() - opening.getTime()) / (1000 * 60 * 60 * 24),
      );
      return sum + days;
    }, 0);
    return Math.round(totalDays / allLeads.length);
  };

  // 5. AVERAGE LEAD SCORE = ∑Lead Scores / Total Leads
  // Formula #3
  const calculateAvgLeadScore = () => {
    if (allLeads.length === 0) return 0;
    const totalScore = allLeads.reduce((sum, lead) => sum + lead.leadScore, 0);
    return (totalScore / allLeads.length).toFixed(1);
  };

  // 6. PIPELINE HEALTH = (Hot + Warm Leads / Total Leads) × 100
  // Percentage of leads in active/healthy stages
  const calculatePipelineHealth = () => {
    if (allLeads.length === 0) return 0;
    const healthyLeads = hotLeads.length + warmLeads.length;
    return ((healthyLeads / allLeads.length) * 100).toFixed(0);
  };

  // 7. AVERAGE DEAL PROBABILITY = ∑Probabilities / Total Leads
  const calculateAvgProbability = () => {
    if (allLeads.length === 0) return 0;
    const totalProbability = allLeads.reduce(
      (sum, lead) => sum + lead.probability,
      0,
    );
    return (totalProbability / allLeads.length / 100).toFixed(1);
  };

  // 8. TOTAL TEAM TARGET = ∑All Target Amounts
  // Formula based on targets created
  const calculateTotalTeamTarget = () => {
    if (salesTargets.length === 0) return 0;
    return salesTargets.reduce((sum, target) => sum + target.targetAmount, 0);
  };

  // 9. TOTAL ACHIEVED = ∑All Achieved Amounts
  const calculateTotalAchieved = () => {
    if (salesTargets.length === 0) return 0;
    return salesTargets.reduce((sum, target) => sum + target.achievedAmount, 0);
  };

  // 10. AVERAGE TEAM ACHIEVEMENT = (Total Achieved / Total Team Target) × 100
  // Formula #31
  const calculateAvgTeamAchievement = () => {
    const target = calculateTotalTeamTarget();
    const achieved = calculateTotalAchieved();
    if (target === 0) return 0;
    return ((achieved / target) * 100).toFixed(0);
  };

  // 11. LEADS GENERATED = Count of new leads in period
  // Formula #1
  const leadsGenerated = allLeads.length;

  // 12. QUALIFIED LEADS = Leads with score >= 60 (Warm + Hot)
  // Formula #2
  const qualifiedLeads = hotLeads.length + warmLeads.length;

  // Calculate rep achievements dynamically from sales targets
  const calculateRepAchievements = (): Record<
    string,
    { target: number; achieved: number; percentage: number }
  > => {
    const achievements: Record<
      string,
      { target: number; achieved: number; percentage: number }
    > = {};

    salesTargets.forEach((target) => {
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
    Object.keys(achievements).forEach((repId) => {
      const data = achievements[repId];
      if (data.target > 0) {
        data.percentage = (data.achieved / data.target) * 100;
      }
    });

    return achievements;
  };

  const repAchievements = calculateRepAchievements();

  // 13. GET TOP PERFORMER = Rep with highest achievement percentage
  const getTopPerformer = () => {
    if (Object.keys(repAchievements).length === 0) {
      return { name: "N/A", achievement: 0 };
    }

    let topRep = "N/A";
    let maxPercentage = 0;

    Object.entries(repAchievements).forEach(([repId, data]) => {
      if (data.percentage > maxPercentage) {
        maxPercentage = data.percentage;
        const rep = salesRepsList.find((r) => r.id === repId);
        if (rep) {
          topRep = rep.name;
        }
      }
    });

    return { name: topRep, achievement: Math.round(maxPercentage) };
  };

  // ============================================================
  // SUB-MODULE METRICS CALCULATION FUNCTIONS
  // ============================================================

  // ENGAGEMENT OPTIMIZER CALCULATIONS
  const calculateEngagementRate = () => {
    if (engagements.length === 0) return 0;
    const totalResponseRate = engagements.reduce(
      (sum, e) => sum + e.avgResponseRate,
      0,
    );
    return Math.round(totalResponseRate / engagements.length);
  };

  const getOptimalTiming = () => {
    if (engagements.length === 0) return "N/A";
    // Calculate average response time and map to time range
    const avgTime =
      engagements.reduce((sum, e) => sum + e.avgResponseTimeMinutes, 0) /
      engagements.length;

    // Convert minutes to hour and return range
    const hour = Math.floor(avgTime / 60);
    if (hour >= 8 && hour <= 10) return "8AM-10AM";
    if (hour >= 10 && hour <= 12) return "10AM-12PM";
    if (hour >= 12 && hour <= 14) return "12PM-2PM";
    if (hour >= 14 && hour <= 16) return "2PM-4PM";
    if (hour >= 16 && hour <= 18) return "4PM-6PM";
    return "9AM-11AM"; // Default
  };

  const getTopChannel = () => {
    if (engagements.length === 0) return "N/A";

    const channelScores = {
      whatsapp: 0,
      sms: 0,
      email: 0,
      linkedin: 0,
    };

    engagements.forEach((eng) => {
      channelScores[eng.channel as keyof typeof channelScores] +=
        eng.engagementScore;
    });

    const topChannelKey = Object.keys(channelScores).reduce((a, b) =>
      channelScores[a as keyof typeof channelScores] >
      channelScores[b as keyof typeof channelScores]
        ? a
        : b,
    );

    const channelNames: Record<string, string> = {
      whatsapp: "WhatsApp",
      sms: "SMS",
      email: "Email",
      linkedin: "LinkedIn",
    };

    return channelNames[topChannelKey] || "N/A";
  };

  // COMPETITIVE INTELLIGENCE CALCULATIONS
  const calculateWinRateVsCompetitor = () => {
    // Win Rate (Hot leads percentage)
    return Math.round(calculateWinRate());
  };

  const calculateMarketShare = () => {
    // Based on lead source distribution - Website leads as proxy for market presence
    const leadSources = calculateLeadSources();
    return leadSources.Website; // Website % as market share proxy
  };

  const calculatePricingBenchmark = () => {
    // Based on deal probability trend - if avg probability is declining, pricing may be high
    if (allLeads.length === 0) return 0;
    const avgProb =
      allLeads.reduce((sum, l) => sum + l.probability, 0) / allLeads.length;
    // If probability below 50%, pricing might be too high (-8%)
    return avgProb >= 70 ? 8 : avgProb >= 50 ? 0 : -8;
  };

  // SALES FORECASTING CALCULATIONS
  const calculateForecastAccuracy = () => {
    // Based on how many targets are achieved vs expected
    if (salesTargets.length === 0) return 0;
    const achieved = salesTargets.filter(
      (t) => (t.achievedAmount / t.targetAmount) * 100 >= 100,
    ).length;
    return Math.round((achieved / salesTargets.length) * 100);
  };

  const calculateNextQuarterForecast = () => {
    // Sum of remaining target amounts not yet achieved
    if (salesTargets.length === 0) return 0;
    const remaining = salesTargets.reduce((sum, t) => {
      const shortfall = Math.max(0, t.targetAmount - t.achievedAmount);
      return sum + shortfall;
    }, 0);
    return remaining;
  };

  const calculateBestCaseForecast = () => {
    // Pipeline value if all hot leads close + remaining targets
    const hotLeadsValue = hotLeads.reduce((sum, lead) => {
      const baseDealValue = 50000;
      return sum + (lead.probability / 100) * baseDealValue;
    }, 0);

    const remainingTargets = calculateNextQuarterForecast();
    return hotLeadsValue + remainingTargets;
  };

  // REP PRODUCTIVITY CALCULATIONS
  const calculateAvgCallsPerDay = () => {
    if (engagements.length === 0 || salesRepsList.length === 0) return 0;
    // Calls = total times contacted across all engagements
    const totalCalls = engagements.reduce(
      (sum, e) => sum + e.timesContacted,
      0,
    );
    return Math.round(totalCalls / Math.max(1, salesRepsList.length));
  };

  const calculateQuotaAchievementAvg = () => {
    if (Object.keys(repAchievements).length === 0) return 0;
    const total = Object.values(repAchievements).reduce(
      (sum, rep) => sum + rep.percentage,
      0,
    );
    return Math.round(total / Object.keys(repAchievements).length);
  };

  const calculateActivityRate = () => {
    // Percentage of reps with at least one engagement or target
    if (salesRepsList.length === 0) return 0;
    const activeReps = new Set<string>();

    engagements.forEach((eng) => {
      // Find rep from engagement if possible, or assume all are active
      activeReps.add("active");
    });

    salesTargets.forEach((target) => {
      activeReps.add(target.salesRepId);
    });

    const activeCount = Math.min(activeReps.size, salesRepsList.length);
    return Math.round((activeCount / salesRepsList.length) * 100);
  };

  // COACHING ENGINE CALCULATIONS
  const calculateCoachingMoments = () => {
    // Total engagements count
    return engagements.length;
  };

  const calculateRepImprovement = () => {
    // Calculate improvement in average engagement scores over time
    // Simplified: improvement based on engagement quality trend
    if (engagements.length < 2) return 0;
    const recentEngagements = engagements.slice(
      -Math.ceil(engagements.length / 2),
    );
    const olderEngagements = engagements.slice(
      0,
      Math.floor(engagements.length / 2),
    );

    const recentAvg =
      recentEngagements.reduce((sum, e) => sum + e.engagementScore, 0) /
      recentEngagements.length;
    const olderAvg =
      olderEngagements.reduce((sum, e) => sum + e.engagementScore, 0) /
      olderEngagements.length;

    const improvement = ((recentAvg - olderAvg) / olderAvg) * 100;
    return Math.round(improvement);
  };

  const calculateCallSuccessRate = () => {
    // Based on average response rate of engagements
    if (engagements.length === 0) return 0;
    const avgResponseRate =
      engagements.reduce((sum, e) => sum + e.avgResponseRate, 0) /
      engagements.length;
    return Math.round(avgResponseRate);
  };

  // INSIGHTS CALCULATIONS
  const getTopPerformers = () => {
    const topReps = Object.entries(repAchievements)
      .sort(([, a], [, b]) => b.percentage - a.percentage)
      .slice(0, 3)
      .map(([repId]) => {
        const rep = salesRepsList.find((r) => r.id === repId);
        return rep?.name || "Unknown";
      });

    return topReps.length > 0 ? topReps : ["No sales reps yet"];
  };

  const getAreasToImprove = () => {
    const issues = [];

    // Check follow-up rate
    const avgFollowUpRate =
      engagements.length > 0
        ? engagements.reduce((sum, e) => sum + e.followUpRate, 0) /
          engagements.length
        : 0;
    if (avgFollowUpRate < 70) {
      issues.push("Follow-up consistency");
    }

    // Check win rate
    if (calculateWinRate() < 50) {
      issues.push("Deal closure rate");
    }

    // Check engagement quality
    const avgEngagementScore =
      engagements.length > 0
        ? engagements.reduce((sum, e) => sum + e.engagementScore, 0) /
          engagements.length
        : 0;
    if (avgEngagementScore < 6) {
      issues.push("Customer retention");
    }

    // Default if no issues
    if (issues.length === 0) {
      return [
        "Follow-up consistency",
        "Deal closure rate",
        "Customer retention",
      ];
    }

    return issues.slice(0, 3);
  };

  const getAiCoachingTips = () => {
    const tips = [];

    // Tip 1: Response time
    const avgResponseTime =
      engagements.length > 0
        ? engagements.reduce((sum, e) => sum + e.avgResponseTimeMinutes, 0) /
          engagements.length
        : 0;
    if (avgResponseTime > 60) {
      tips.push("Use power words in emails");
    } else {
      tips.push("Use power words in emails");
    }

    // Tip 2: Timing
    const topChan = getTopChannel();
    if (topChan === "Email") {
      tips.push("Schedule calls earlier");
    } else {
      tips.push("Schedule calls earlier");
    }

    // Tip 3: Personalization
    tips.push("Personalize 1st contact");

    return tips;
  };

  const calculateFollowUpRateImprovement = () => {
    // Change in follow-up rate (simplified as +12%)
    if (engagements.length < 2) return 0;
    return 12; // Default positive improvement
  };

  const calculateDealCycleDays = () => {
    // Average days from opening to expected close
    if (allLeads.length === 0) return 0;
    const totalDays = allLeads.reduce((sum, lead) => {
      const opening = new Date(lead.opening);
      const close = new Date(lead.expectedClose);
      const days = Math.ceil(
        (close.getTime() - opening.getTime()) / (1000 * 60 * 60 * 24),
      );
      return sum + days;
    }, 0);
    return Math.round(totalDays / allLeads.length);
  };

  const calculateConversionRateTrend = () => {
    // Trend in conversion rate (simplified as +8%)
    return 8; // Default positive trend
  };

  // ============================================================
  // KPI DASHBOARD METRICS CALCULATION FUNCTIONS
  // ============================================================

  // Calculate total KPIs being tracked (based on sales targets)
  const calculateKpisTracked = () => {
    return salesTargets.length;
  };

  // Calculate KPIs that are on target (achieved >= target amount)
  const calculateKpisOnTarget = () => {
    return salesTargets.filter(
      (target) => target.achievedAmount >= target.targetAmount,
    ).length;
  };

  // Calculate overall health percentage
  const calculateOverallHealth = () => {
    if (salesTargets.length === 0) return 0;
    const kpisOnTarget = calculateKpisOnTarget();
    return Math.round((kpisOnTarget / salesTargets.length) * 100);
  };

  // ============================================================
  // DEAL & REVENUE METRICS CALCULATION FUNCTIONS
  // ============================================================

  // Helper function to get or assign product to a lead
  const getLeadProduct = (lead: Lead): string => {
    if (lead.product) return lead.product;
    // Assign product based on company name patterns or default
    const products = ["Product A", "Product B", "Product C", "Product D"];
    const productIndex =
      (lead.company.charCodeAt(0) + lead.company.length) % products.length;
    return products[productIndex];
  };

  // Helper function to get or assign region to a lead
  const getLeadRegion = (lead: Lead): string => {
    if (lead.region) return lead.region;
    // Assign region based on company name patterns or default
    const regions = ["North America", "Europe", "Asia Pacific", "LATAM"];
    const regionIndex =
      (lead.company.charCodeAt(0) + lead.company.length) % regions.length;
    return regions[regionIndex];
  };

  // Helper function to get or assign industry to a lead
  const getLeadIndustry = (lead: Lead): string => {
    if (lead.industry) return lead.industry;
    // Assign industry based on company name patterns or default
    const industries = [
      "Technology",
      "Financial Services",
      "Healthcare",
      "Retail",
    ];
    const industryIndex =
      (lead.company.charCodeAt(0) + lead.company.length) % industries.length;
    return industries[industryIndex];
  };

  // Helper function to get or assign segment to a lead
  const getLeadSegment = (lead: Lead): string => {
    if (lead.segment) return lead.segment;
    // Assign segment based on lead score
    if (lead.leadScore >= 80) return "Enterprise";
    if (lead.leadScore >= 60) return "Mid-Market";
    return "SMB";
  };

  // Helper function to get deal size
  const getLeadDealSize = (lead: Lead): number => {
    if (lead.dealSize) return lead.dealSize;
    // Estimate deal size based on probability and segment
    const segment = getLeadSegment(lead);
    const baseSizes = { Enterprise: 300000, "Mid-Market": 100000, SMB: 30000 };
    const baseSize = baseSizes[segment as keyof typeof baseSizes] || 50000;
    return Math.round((lead.probability / 100) * baseSize);
  };

  // Calculate total revenue (sum of all deal sizes weighted by probability)
  const calculateTotalRevenue = () => {
    return allLeads.reduce((sum, lead) => sum + getLeadDealSize(lead), 0);
  };

  // Calculate revenue by product
  const calculateRevenueByProduct = () => {
    const products = allLeads.reduce(
      (acc, lead) => {
        const product = getLeadProduct(lead);
        if (!acc[product]) {
          acc[product] = { revenue: 0, count: 0, percentage: 0 };
        }
        acc[product].revenue += getLeadDealSize(lead);
        acc[product].count++;
        return acc;
      },
      {} as Record<
        string,
        { revenue: number; count: number; percentage: number }
      >,
    );

    const total = calculateTotalRevenue();
    Object.keys(products).forEach((product) => {
      products[product].percentage =
        total > 0 ? Math.round((products[product].revenue / total) * 100) : 0;
    });

    return Object.entries(products)
      .map(([category, data]) => ({
        category,
        revenue: Math.round(data.revenue),
        percentage: data.percentage,
      }))
      .sort((a, b) => b.revenue - a.revenue);
  };

  // Calculate revenue by region
  const calculateRevenueByRegion = () => {
    const regions = allLeads.reduce(
      (acc, lead) => {
        const region = getLeadRegion(lead);
        if (!acc[region]) {
          acc[region] = { revenue: 0, count: 0, percentage: 0 };
        }
        acc[region].revenue += getLeadDealSize(lead);
        acc[region].count++;
        return acc;
      },
      {} as Record<
        string,
        { revenue: number; count: number; percentage: number }
      >,
    );

    const total = calculateTotalRevenue();
    Object.keys(regions).forEach((region) => {
      regions[region].percentage =
        total > 0 ? Math.round((regions[region].revenue / total) * 100) : 0;
    });

    return Object.entries(regions)
      .map(([category, data]) => ({
        category,
        revenue: Math.round(data.revenue),
        percentage: data.percentage,
      }))
      .sort((a, b) => b.revenue - a.revenue);
  };

  // Calculate revenue by sales rep
  const calculateRevenueBySalesRep = () => {
    const reps = allLeads.reduce(
      (acc, lead) => {
        const rep = lead.salesRep || "Unassigned";
        if (!acc[rep]) {
          acc[rep] = { revenue: 0, count: 0, percentage: 0 };
        }
        acc[rep].revenue += getLeadDealSize(lead);
        acc[rep].count++;
        return acc;
      },
      {} as Record<
        string,
        { revenue: number; count: number; percentage: number }
      >,
    );

    const total = calculateTotalRevenue();
    Object.keys(reps).forEach((rep) => {
      reps[rep].percentage =
        total > 0 ? Math.round((reps[rep].revenue / total) * 100) : 0;
    });

    return Object.entries(reps)
      .map(([category, data]) => ({
        category,
        revenue: Math.round(data.revenue),
        percentage: data.percentage,
      }))
      .sort((a, b) => b.revenue - a.revenue);
  };

  // Calculate revenue by industry
  const calculateRevenueByIndustry = () => {
    const industries = allLeads.reduce(
      (acc, lead) => {
        const industry = getLeadIndustry(lead);
        if (!acc[industry]) {
          acc[industry] = { revenue: 0, count: 0, percentage: 0 };
        }
        acc[industry].revenue += getLeadDealSize(lead);
        acc[industry].count++;
        return acc;
      },
      {} as Record<
        string,
        { revenue: number; count: number; percentage: number }
      >,
    );

    const total = calculateTotalRevenue();
    Object.keys(industries).forEach((industry) => {
      industries[industry].percentage =
        total > 0
          ? Math.round((industries[industry].revenue / total) * 100)
          : 0;
    });

    return Object.entries(industries)
      .map(([category, data]) => ({
        category,
        revenue: Math.round(data.revenue),
        percentage: data.percentage,
      }))
      .sort((a, b) => b.revenue - a.revenue);
  };

  // Calculate revenue by customer segment
  const calculateRevenueBySegment = () => {
    const segments = allLeads.reduce(
      (acc, lead) => {
        const segment = getLeadSegment(lead);
        if (!acc[segment]) {
          acc[segment] = { revenue: 0, count: 0, percentage: 0 };
        }
        acc[segment].revenue += getLeadDealSize(lead);
        acc[segment].count++;
        return acc;
      },
      {} as Record<
        string,
        { revenue: number; count: number; percentage: number }
      >,
    );

    const total = calculateTotalRevenue();
    Object.keys(segments).forEach((segment) => {
      segments[segment].percentage =
        total > 0 ? Math.round((segments[segment].revenue / total) * 100) : 0;
    });

    return Object.entries(segments)
      .map(([category, data]) => ({
        category,
        revenue: Math.round(data.revenue),
        percentage: data.percentage,
      }))
      .sort((a, b) => b.revenue - a.revenue);
  };

  // Calculate forecast data based on current pipeline
  const calculateForecastDataPoints = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    const baselineMonthly = calculateTotalRevenue() / 6;

    return months.map((month, index) => {
      // Apply growth trend: 5% increase per month
      const growthFactor = Math.pow(1.05, index);
      const baseCase = Math.round(baselineMonthly * growthFactor);
      const variability = baseCase * 0.25;

      return {
        month,
        forecast: baseCase,
        bestCase: Math.round(baseCase + variability),
        baseCase: baseCase,
        worstCase: Math.round(Math.max(0, baseCase - variability)),
      };
    });
  };

  // ============================================================
  // RISK & TREND METRICS CALCULATION FUNCTIONS
  // ============================================================

  // Calculate pipeline risk (% of deals in healthy stages)
  const calculatePipelineRisk = () => {
    if (allLeads.length === 0) return 0;
    const healthyLeads = hotLeads.length + warmLeads.length;
    return Math.round((healthyLeads / allLeads.length) * 100);
  };

  // Calculate deal velocity risk (% of deals on track for expected close)
  const calculateDealVelocityRisk = () => {
    if (allLeads.length === 0) return 0;
    const today = new Date();
    const dealsOnTrack = allLeads.filter((lead) => {
      const expectedClose = new Date(lead.expectedClose);
      const daysUntilClose = Math.ceil(
        (expectedClose.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
      );
      // On track if expected close is still in future
      return daysUntilClose > 0;
    }).length;

    return Math.round((dealsOnTrack / allLeads.length) * 100);
  };

  // Calculate rep performance risk (average quota achievement)
  const calculateRepPerformanceRisk = () => {
    if (Object.keys(repAchievements).length === 0) return 0;
    const total = Object.values(repAchievements).reduce(
      (sum, rep) => sum + rep.percentage,
      0,
    );
    return Math.round(total / Object.keys(repAchievements).length);
  };

  // Calculate repeat revenue rate (% of deals from existing customers)
  const calculateRepeatRevenueRate = () => {
    if (allLeads.length === 0) return 0;
    // Estimate based on lead probability - higher probability = likely repeat customer
    const repeatLeads = allLeads.filter(
      (lead) => lead.probability >= 70,
    ).length;
    return Math.round((repeatLeads / allLeads.length) * 100);
  };

  // Calculate trend for total revenue (vs hypothetical last month)
  const calculateRevenueTrend = () => {
    // If no leads, trend is 0
    if (allLeads.length === 0) return 0;
    // Estimate: assume each new hot lead adds value, calculate growth
    const hotLeadRevenue = hotLeads.reduce(
      (sum, lead) => sum + getLeadDealSize(lead),
      0,
    );
    const totalRevenue = calculateTotalRevenue();
    if (totalRevenue === 0) return 0;
    const trend = ((hotLeadRevenue / totalRevenue) * 100) / 10;
    return Math.round(Math.min(trend, 25)); // Cap at 25%
  };

  // Calculate trend for win rate
  const calculateWinRateTrend = () => {
    // Based on hot leads percentage change
    if (allLeads.length === 0) return 0;
    return Math.round(calculateWinRate() / 20); // Scale to reasonable percentage
  };

  // Calculate trend for deal size
  const calculateDealSizeTrend = () => {
    if (allLeads.length === 0) return 0;
    // Check if hot leads have larger average sizes
    const hotAvg =
      hotLeads.length > 0
        ? hotLeads.reduce((sum, lead) => sum + getLeadDealSize(lead), 0) /
          hotLeads.length
        : 0;
    const coldAvg =
      coldLeads.length > 0
        ? coldLeads.reduce((sum, lead) => sum + getLeadDealSize(lead), 0) /
          coldLeads.length
        : 0;
    if (coldAvg === 0) return 5;
    const trend = ((hotAvg - coldAvg) / coldAvg) * 100;
    return Math.round(Math.min(trend, 25)); // Cap at 25%
  };

  // Calculate sales cycle trend
  const calculateSalesCycleTrend = () => {
    if (allLeads.length === 0) return 0;
    // Negative trend is good for sales cycle (shorter is better)
    // Estimate reduction based on number of hot leads
    const hotPercentage = (hotLeads.length / allLeads.length) * 100;
    return Math.round((hotPercentage / 10) * 3); // 3 days reduction per 10% hot leads
  };

  // Calculate repeat revenue trend (growth in repeat customers)
  const calculateRepeatRevenueTrend = () => {
    if (allLeads.length === 0) return 0;
    // Estimate based on high probability deals (repeat customers typically have higher probability)
    return 12; // Default positive trend of 12%
  };

  // Chart data calculation functions for KPI Dashboard
  const calculateRevenueTrendData = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    const totalRevenue = calculateTotalRevenue();
    const baselineMonthly = totalRevenue / 6;

    return months.map((month, index) => {
      // Simulate growth trend: 8% increase per month
      const growthFactor = Math.pow(1.08, index);
      const revenue = Math.round(baselineMonthly * growthFactor);

      return {
        month,
        revenue,
      };
    });
  };

  const calculateLeadsVsDealsData = () => {
    const totalLeads = allLeads.length;
    const quotas = calculateQuotations();
    const proposals = calculateProposals();
    const deals = hotLeads.length; // Approximate deals as hot leads

    return [
      { stage: "Total Leads", count: totalLeads },
      { stage: "Proposals", count: proposals },
      { stage: "Quotations", count: quotas },
      { stage: "Deals", count: deals },
    ];
  };

  const calculateSalesCycleTrendData = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    const baseSalesCycle = calculateSalesCycle();

    return months.map((month, index) => {
      // Simulate improvement: 2 days reduction per month
      const improvement = index * 2;
      const cycle = Math.max(baseSalesCycle - improvement, 10);

      return {
        month,
        days: Math.round(cycle),
      };
    });
  };

  const calculatePipelineVsTargetData = () => {
    const target = calculateTotalTeamTarget();
    const pipeline = calculatePipelineValue();
    const achieved = calculateTotalAchieved();

    return [
      {
        name: "Pipeline",
        value: Math.round(pipeline),
      },
      {
        name: "Achieved",
        value: Math.round(achieved),
      },
      {
        name: "Target",
        value: Math.round(target),
      },
    ];
  };

  // Sub-modules with CALCULATED metrics (TAGS hardcoded, VALUES calculated)
  const staticSubModules = [
    {
      id: "kpi-dashboard",
      name: "KPI Dashboard",
      icon: <BarChart3 className="h-5 w-5" />,
      description:
        "Comprehensive KPI tracking and analytics for sales performance monitoring",
      metrics: {
        "KPIs Tracked": `${calculateKpisTracked()}`,
        "KPIs On Target": `${calculateKpisOnTarget()}`,
        "Overall Health": `${calculateOverallHealth()}%`,
      },
      link: "/kpi-dashboard",
      isNew: true,
    },
    {
      id: "lead-pipeline",
      name: "Lead Intelligence & Pipeline",
      icon: <Target className="h-5 w-5" />,
      description: "Lead qualification, pipeline forecasting, deal rescue",
      metrics: {
        "Lead Score": `${calculateAvgLeadScore()}/10`,
        "Pipeline Health": `${calculatePipelineHealth()}%`,
        "Deal Probability": `${(parseFloat(calculateAvgProbability()) * 100).toFixed(0)}%`,
      },
    },
    {
      id: "sales-coaching",
      name: "Sales Coaching Engine",
      icon: <Lightbulb className="h-5 w-5" />,
      description:
        "Real-time coaching, call analysis, performance optimization",
      metrics: {
        "Coaching Moments": `${calculateCoachingMoments()}`,
        "Rep Improvement": `${calculateRepImprovement() >= 0 ? "+" : ""}${calculateRepImprovement()}%`,
        "Call Success Rate": `${calculateCallSuccessRate()}%`,
      },
    },
    {
      id: "engagement-optimizer",
      name: "Engagement Optimizer",
      icon: <MessageCircle className="h-5 w-5" />,
      description:
        "Multi-channel engagement, timing optimization, content recommendation",
      metrics: {
        "Engagement Rate": `${calculateEngagementRate()}%`,
        "Optimal Timing": getOptimalTiming(),
        "Top Channel": getTopChannel(),
      },
    },
    {
      id: "competitive-intelligence",
      name: "Competitive Intelligence",
      icon: <BarChart3 className="h-5 w-5" />,
      description: "Win/loss analysis, competitive positioning, battle cards",
      metrics: {
        "Win Rate vs Competitor": `${calculateWinRateVsCompetitor()}%`,
        "Market Share": `${calculateMarketShare()}%`,
        "Pricing Benchmark": `${calculatePricingBenchmark() > 0 ? "+" : ""}${calculatePricingBenchmark()}%`,
      },
    },
    {
      id: "sales-forecasting",
      name: "Sales Forecasting",
      icon: <TrendingUp className="h-5 w-5" />,
      description: "AI-powered forecasting, scenario modeling, risk assessment",
      metrics: {
        "Forecast Accuracy": `${calculateForecastAccuracy()}%`,
        "Next Quarter": `$${(calculateNextQuarterForecast() / 1000000).toFixed(1)}M`,
        "Best Case": `$${(calculateBestCaseForecast() / 1000000).toFixed(1)}M`,
      },
    },
    {
      id: "rep-productivity",
      name: "Rep Productivity Dashboard",
      icon: <Users className="h-5 w-5" />,
      description: "Activity tracking, quota progress, performance leaderboard",
      metrics: {
        "Avg Calls/Day": `${calculateAvgCallsPerDay()}`,
        "Quota Achievement": `${calculateQuotaAchievementAvg()}%`,
        "Activity Rate": `${calculateActivityRate()}%`,
      },
    },
  ];

  // Performance metrics with calculated values (TAGS HARDCODED, VALUES CALCULATED)
  const performanceMetrics = [
    {
      label: "Total Pipeline Value",
      value: format(2400000),
      change: "+12%",
      label: "Total Pipeline Value", // TAG: Hardcoded
      value: `$${(calculatePipelineValue() / 1000000).toFixed(2)}M`, // VALUE: Calculated
      change: "+12%", // TODO: Calculate change from previous period
      color: "text-green-600",
    },
    {
      label: "Win Rate", // TAG: Hardcoded
      value: `${calculateWinRate().toFixed(0)}%`, // VALUE: Calculated
      change: "+5%", // TODO: Calculate change from previous period
      color: "text-blue-600",
    },
    {
      label: "Avg Deal Size",
      value: format(45200),
      change: "+8%",
      label: "Avg Deal Size", // TAG: Hardcoded
      value: `$${(calculateAvgDealSize() / 1000).toFixed(1)}K`, // VALUE: Calculated
      change: "+8%", // TODO: Calculate change from previous period
      color: "text-purple-600",
    },
    {
      label: "Sales Cycle", // TAG: Hardcoded
      value: `${calculateSalesCycle()} days`, // VALUE: Calculated
      change: "-3 days", // TODO: Calculate change from previous period
      color: "text-orange-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <LoadingSpinner isVisible={isLoading} />

      <ModuleHeader
        icon={<Users className="h-6 w-6" />}
        title="Sales Intelligence"
        description="Universal sales intelligence module helping businesses improve lead handling, sales performance, revenue conversion, and pipeline forecasting"
        isConnected={isConnected}
        lastUpdated={lastUpdated}
        onReconnect={refreshData}
        connectionLabel="Live"
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <div className="grid grid-cols-2 sm:grid-cols-8 gap-2 w-full rounded-md bg-muted p-1 text-muted-foreground">
            <TabsList className="contents">
              <TabsTrigger
                value="overview"
                className="w-full justify-center data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="kpi"
                className="w-full justify-center data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                KPI
              </TabsTrigger>
              <TabsTrigger
                value="lead-pipeline"
                className="w-full justify-center data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Lead Pipeline
              </TabsTrigger>
              <TabsTrigger
                value="engagement"
                className="w-full justify-center data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Engagement
              </TabsTrigger>
              <TabsTrigger
                value="targets"
                className="w-full justify-center data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Targets
              </TabsTrigger>
              <TabsTrigger
                value="assets"
                className="w-full justify-center data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Assets
              </TabsTrigger>
              <TabsTrigger
                value="deals"
                className="w-full justify-center data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Deals
              </TabsTrigger>
              <TabsTrigger
                value="insights"
                className="w-full justify-center data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Insights
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {performanceMetrics.map((metric, idx) => (
                <Card key={idx}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-2">
                          {metric.label}
                        </p>
                        <p className={`text-2xl font-bold ${metric.color}`}>
                          {metric.value}
                        </p>
                      </div>
                      <Badge variant="secondary">{metric.change}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {staticSubModules.map((module) => (
                <Card
                  key={module.id}
                  className={`hover:shadow-lg transition-shadow cursor-pointer ${
                    (module as any).link ? "hover:border-blue-300" : ""
                  }`}
                  onClick={() => {
                    if ((module as any).link) {
                      window.location.href = (module as any).link;
                    }
                  }}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          {module.icon}
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {module.name}
                          </CardTitle>
                          <CardDescription className="text-sm">
                            {module.description}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {(module as any).isNew && (
                          <Badge variant="default" className="bg-green-600">
                            NEW
                          </Badge>
                        )}
                        <Badge variant="outline">Active</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(module.metrics).map(([key, value]) => (
                        <div
                          key={key}
                          className="flex justify-between items-center text-sm"
                        >
                          <span className="text-gray-600">{key}</span>
                          <span className="font-semibold text-gray-900">
                            {value}
                          </span>
                        </div>
                      ))}
                    </div>
                    {(module as any).link && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-xs text-blue-600 font-semibold flex items-center gap-1">
                          Click to open <ArrowRight className="h-3 w-3" />
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* KPI Tab */}
          <TabsContent value="kpi" className="space-y-6">
            <Tabs defaultValue="dashboard" className="w-full">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="categories">Categories</TabsTrigger>
                <TabsTrigger value="custom">Custom Builder</TabsTrigger>
                <TabsTrigger value="benchmarking">Benchmarking</TabsTrigger>
                <TabsTrigger value="alerts">Alerts</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
              </TabsList>

              <TabsContent value="dashboard">
                <KPIDashboard
                  totalRevenue={calculateTotalRevenue()}
                  totalTarget={calculateTotalTeamTarget()}
                  leadsGenerated={leadsGenerated}
                  winRate={calculateWinRate()}
                  avgDealSize={calculateAvgDealSize()}
                  salesCycle={calculateSalesCycle()}
                  revenueTrend={calculateRevenueTrend()}
                  winRateTrend={calculateWinRateTrend()}
                  dealSizeTrend={calculateDealSizeTrend()}
                  salesCycleTrend={calculateSalesCycleTrend()}
                  revenueTrendData={calculateRevenueTrendData()}
                  leadsVsDealsData={calculateLeadsVsDealsData()}
                  salesCycleTrendData={calculateSalesCycleTrendData()}
                  pipelineVsTargetData={calculatePipelineVsTargetData()}
                />
              </TabsContent>

              <TabsContent value="categories">
                <KPICategories />
              </TabsContent>

              <TabsContent value="custom">
                <CustomKPIBuilder />
              </TabsContent>

              <TabsContent value="benchmarking">
                <BenchmarkingSection />
              </TabsContent>

              <TabsContent value="alerts">
                <KPIAlerts />
              </TabsContent>

              <TabsContent value="reports">
                <ExportReporting />
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* Lead Intelligence Tab */}
          <TabsContent value="lead-pipeline" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 flex-1">
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">
                      Pipeline Health Alert
                    </h4>
                    <p className="text-sm text-blue-800">
                      3 deals at risk detected. AI suggests intervention
                      strategies for rescue.
                    </p>
                  </div>
                </div>
              </div>
              <Button
                onClick={() => setCreateLeadOpen(true)}
                className="ml-4 whitespace-nowrap"
                size="lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Lead
              </Button>
            </div>

            {/* Hot Leads Table */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <CardTitle>
                    🔥 Hot Leads (High Conversion Probability)
                  </CardTitle>
                </div>
                <CardDescription>
                  Deals in advanced stages with high probability scores
                </CardDescription>
              </CardHeader>
              <CardContent>
                {hotLeads.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="text-gray-500 mb-2">No hot leads yet</p>
                    <p className="text-sm text-gray-400">
                      Leads with proposal sent, negotiation in progress, or
                      decision pending will appear here
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-gray-50">
                          <th className="text-left py-3 px-4 font-semibold">
                            Company Name
                          </th>
                          <th className="text-left py-3 px-4 font-semibold">
                            Deal Description
                          </th>
                          <th className="text-left py-3 px-4 font-semibold">
                            Opening Date
                          </th>
                          <th className="text-left py-3 px-4 font-semibold">
                            Expected Close
                          </th>
                          <th className="text-left py-3 px-4 font-semibold">
                            Pipeline Stage
                          </th>
                          <th className="text-center py-3 px-4 font-semibold">
                            AI Lead Score
                          </th>
                          <th className="text-center py-3 px-4 font-semibold">
                            Deal Probability
                          </th>
                          <th className="text-center py-3 px-4 font-semibold">
                            Stall?
                          </th>
                          <th className="text-left py-3 px-4 font-semibold">
                            AI Rescue Playbook
                          </th>
                          <th className="text-center py-3 px-4 font-semibold">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {hotLeads.map((deal, idx) => (
                          <tr key={idx} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">{deal.company}</td>
                            <td className="py-3 px-4">{deal.description}</td>
                            <td className="py-3 px-4">{deal.opening}</td>
                            <td className="py-3 px-4">{deal.expectedClose}</td>
                            <td className="py-3 px-4">
                              <Select
                                value={deal.stage}
                                onValueChange={(newStage) =>
                                  handleChangePipelineStage(
                                    deal,
                                    newStage,
                                    "hot",
                                  )
                                }
                              >
                                <SelectTrigger className="w-40 h-8 text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Outreach Attempted">
                                    Outreach Attempted
                                  </SelectItem>
                                  <SelectItem value="Lead Contacted">
                                    Lead Contacted
                                  </SelectItem>
                                  <SelectItem value="Initial Qualification">
                                    Initial Qualification
                                  </SelectItem>
                                  <SelectItem value="Product Demo Booked">
                                    Product Demo Booked
                                  </SelectItem>
                                  <SelectItem value="Proposal Sent">
                                    Proposal Sent
                                  </SelectItem>
                                  <SelectItem value="Negotiation">
                                    Negotiation
                                  </SelectItem>
                                  <SelectItem value="Decision Pending">
                                    Decision Pending
                                  </SelectItem>
                                  <SelectItem value="Won">Won</SelectItem>
                                </SelectContent>
                              </Select>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <Badge className="bg-green-100 text-green-800">
                                {deal.leadScore}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <Badge className="bg-green-100 text-green-800">
                                {deal.probability}%
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span
                                className={`font-semibold ${deal.stall === "Yes" ? "text-red-600" : "text-green-600"}`}
                              >
                                {deal.stall}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-xs">
                              {deal.playbook}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <button
                                onClick={() => handleDeleteLead(idx, "hot")}
                                className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                title="Delete lead"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Warm Leads Table */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <CardTitle>
                    🌤 Warm Leads (Medium Conversion Probability)
                  </CardTitle>
                </div>
                <CardDescription>
                  Leads in qualification and early engagement stages
                </CardDescription>
              </CardHeader>
              <CardContent>
                {warmLeads.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="text-gray-500 mb-2">No warm leads yet</p>
                    <p className="text-sm text-gray-400">
                      Leads with product demo booked, lead contacted, or initial
                      qualification will appear here
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-gray-50">
                          <th className="text-left py-3 px-4 font-semibold">
                            Company Name
                          </th>
                          <th className="text-left py-3 px-4 font-semibold">
                            Deal Description
                          </th>
                          <th className="text-left py-3 px-4 font-semibold">
                            Opening Date
                          </th>
                          <th className="text-left py-3 px-4 font-semibold">
                            Expected Close
                          </th>
                          <th className="text-left py-3 px-4 font-semibold">
                            Pipeline Stage
                          </th>
                          <th className="text-center py-3 px-4 font-semibold">
                            AI Lead Score
                          </th>
                          <th className="text-center py-3 px-4 font-semibold">
                            Deal Probability
                          </th>
                          <th className="text-center py-3 px-4 font-semibold">
                            Stall?
                          </th>
                          <th className="text-left py-3 px-4 font-semibold">
                            AI Rescue Playbook
                          </th>
                          <th className="text-center py-3 px-4 font-semibold">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {warmLeads.map((deal, idx) => (
                          <tr key={idx} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">{deal.company}</td>
                            <td className="py-3 px-4">{deal.description}</td>
                            <td className="py-3 px-4">{deal.opening}</td>
                            <td className="py-3 px-4">{deal.expectedClose}</td>
                            <td className="py-3 px-4">
                              <Select
                                value={deal.stage}
                                onValueChange={(newStage) =>
                                  handleChangePipelineStage(
                                    deal,
                                    newStage,
                                    "warm",
                                  )
                                }
                              >
                                <SelectTrigger className="w-40 h-8 text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Outreach Attempted">
                                    Outreach Attempted
                                  </SelectItem>
                                  <SelectItem value="Lead Contacted">
                                    Lead Contacted
                                  </SelectItem>
                                  <SelectItem value="Initial Qualification">
                                    Initial Qualification
                                  </SelectItem>
                                  <SelectItem value="Product Demo Booked">
                                    Product Demo Booked
                                  </SelectItem>
                                  <SelectItem value="Proposal Sent">
                                    Proposal Sent
                                  </SelectItem>
                                  <SelectItem value="Negotiation">
                                    Negotiation
                                  </SelectItem>
                                  <SelectItem value="Decision Pending">
                                    Decision Pending
                                  </SelectItem>
                                  <SelectItem value="Won">Won</SelectItem>
                                </SelectContent>
                              </Select>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <Badge className="bg-yellow-100 text-yellow-800">
                                {deal.leadScore}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <Badge className="bg-yellow-100 text-yellow-800">
                                {deal.probability}%
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span
                                className={`font-semibold ${deal.stall === "Yes" ? "text-orange-600" : "text-green-600"}`}
                              >
                                {deal.stall}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-xs">
                              {deal.playbook}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <button
                                onClick={() => handleDeleteLead(idx, "warm")}
                                className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                title="Delete lead"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Cold Leads Table */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <CardTitle>
                    ❄ Cold Leads (Low Conversion Probability - Nurturing)
                  </CardTitle>
                </div>
                <CardDescription>
                  Outreach and early engagement stage - requires nurturing
                </CardDescription>
              </CardHeader>
              <CardContent>
                {coldLeads.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="text-gray-500 mb-2">No cold leads yet</p>
                    <p className="text-sm text-gray-400">
                      Leads with outreach attempted, unresponsive, or no
                      response yet will appear here
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-gray-50">
                          <th className="text-left py-3 px-4 font-semibold">
                            Company Name
                          </th>
                          <th className="text-left py-3 px-4 font-semibold">
                            Deal Description
                          </th>
                          <th className="text-left py-3 px-4 font-semibold">
                            Opening Date
                          </th>
                          <th className="text-left py-3 px-4 font-semibold">
                            Expected Close
                          </th>
                          <th className="text-left py-3 px-4 font-semibold">
                            Pipeline Stage
                          </th>
                          <th className="text-center py-3 px-4 font-semibold">
                            AI Lead Score
                          </th>
                          <th className="text-center py-3 px-4 font-semibold">
                            Deal Probability
                          </th>
                          <th className="text-center py-3 px-4 font-semibold">
                            Stall?
                          </th>
                          <th className="text-left py-3 px-4 font-semibold">
                            AI Rescue Playbook
                          </th>
                          <th className="text-center py-3 px-4 font-semibold">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {coldLeads.map((deal, idx) => (
                          <tr key={idx} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">{deal.company}</td>
                            <td className="py-3 px-4">{deal.description}</td>
                            <td className="py-3 px-4">{deal.opening}</td>
                            <td className="py-3 px-4">{deal.expectedClose}</td>
                            <td className="py-3 px-4">
                              <Select
                                value={deal.stage}
                                onValueChange={(newStage) =>
                                  handleChangePipelineStage(
                                    deal,
                                    newStage,
                                    "cold",
                                  )
                                }
                              >
                                <SelectTrigger className="w-40 h-8 text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Outreach Attempted">
                                    Outreach Attempted
                                  </SelectItem>
                                  <SelectItem value="Lead Contacted">
                                    Lead Contacted
                                  </SelectItem>
                                  <SelectItem value="Initial Qualification">
                                    Initial Qualification
                                  </SelectItem>
                                  <SelectItem value="Product Demo Booked">
                                    Product Demo Booked
                                  </SelectItem>
                                  <SelectItem value="Proposal Sent">
                                    Proposal Sent
                                  </SelectItem>
                                  <SelectItem value="Negotiation">
                                    Negotiation
                                  </SelectItem>
                                  <SelectItem value="Decision Pending">
                                    Decision Pending
                                  </SelectItem>
                                  <SelectItem value="Won">Won</SelectItem>
                                </SelectContent>
                              </Select>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <Badge className="bg-blue-100 text-blue-800">
                                {deal.leadScore}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <Badge className="bg-blue-100 text-blue-800">
                                {deal.probability}%
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span
                                className={`font-semibold ${deal.stall === "Yes" ? "text-red-600" : "text-green-600"}`}
                              >
                                {deal.stall}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-xs">
                              {deal.playbook}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <button
                                onClick={() => handleDeleteLead(idx, "cold")}
                                className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                title="Delete lead"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Engagement Tab */}
          <TabsContent value="engagement" className="space-y-6">
            {/* Create Engagement Button */}
            <div className="flex items-center justify-end mb-4">
              <Button onClick={() => setCreateEngagementOpen(true)} size="lg">
                <Plus className="h-4 w-4 mr-2" />
                Create Engagement
              </Button>
            </div>

            {/* Channel Selection */}
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Select Engagement Channel
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  {
                    id: "whatsapp",
                    name: "WhatsApp",
                    icon: <MessageCircle className="h-8 w-8 text-green-600" />,
                    color: "border-green-300 bg-green-50",
                  },
                  {
                    id: "sms",
                    name: "SMS",
                    icon: (
                      <MessageSquareDot className="h-8 w-8 text-blue-600" />
                    ),
                    color: "border-blue-300 bg-blue-50",
                  },
                  {
                    id: "email",
                    name: "Email",
                    icon: <Mail className="h-8 w-8 text-red-600" />,
                    color: "border-red-300 bg-red-50",
                  },
                  {
                    id: "linkedin",
                    name: "LinkedIn",
                    icon: <Linkedin className="h-8 w-8 text-blue-700" />,
                    color: "border-blue-400 bg-blue-100",
                  },
                ].map((channel) => (
                  <button
                    key={channel.id}
                    onClick={() => setSelectedChannel(channel.id)}
                    className={`p-6 rounded-lg border-2 transition-all ${
                      selectedChannel === channel.id
                        ? `${channel.color} border-solid shadow-lg scale-105`
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      {channel.icon}
                      <span className="font-semibold text-sm">
                        {channel.name}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Engagement Data Table */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedChannel === "whatsapp" && "WhatsApp Engagement"}
                  {selectedChannel === "sms" && "SMS Engagement"}
                  {selectedChannel === "email" && "Email Engagement"}
                  {selectedChannel === "linkedin" && "LinkedIn Engagement"}
                </CardTitle>
                <CardDescription>
                  Engagement metrics by contact for the selected channel
                </CardDescription>
              </CardHeader>
              <CardContent>
                {engagements.filter((e) => e.channel === selectedChannel)
                  .length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="text-gray-500 mb-2">
                      No engagements for this channel yet
                    </p>
                    <p className="text-sm text-gray-400">
                      Create an engagement to see it appear in this table
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-gray-50">
                          <th className="text-left py-3 px-4 font-semibold">
                            Name
                          </th>
                          <th className="text-left py-3 px-4 font-semibold">
                            Company
                          </th>
                          <th className="text-left py-3 px-4 font-semibold">
                            Deal Description
                          </th>
                          <th className="text-center py-3 px-4 font-semibold">
                            Avg Response Rate
                          </th>
                          <th className="text-center py-3 px-4 font-semibold">
                            Avg Response Time
                          </th>
                          <th className="text-center py-3 px-4 font-semibold">
                            Engagement Score
                          </th>
                          <th className="text-center py-3 px-4 font-semibold">
                            Follow-up Rate
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {engagements
                          .filter((e) => e.channel === selectedChannel)
                          .map((engagement) => {
                            const mins = engagement.avgResponseTimeMinutes;
                            const hours = Math.floor(mins / 60);
                            const remainingMins = mins % 60;
                            let responseTimeStr = "";
                            if (hours > 0) {
                              responseTimeStr = `${hours}h ${remainingMins}m`;
                            } else {
                              responseTimeStr = `${mins}m`;
                            }

                            return (
                              <tr
                                key={engagement.id}
                                className="border-b hover:bg-gray-50"
                              >
                                <td className="py-3 px-4 font-medium">
                                  {engagement.personName}
                                </td>
                                <td className="py-3 px-4">
                                  {engagement.companyName}
                                </td>
                                <td className="py-3 px-4">
                                  {engagement.dealDescription}
                                </td>
                                <td className="py-3 px-4 text-center">
                                  <Badge className="bg-green-100 text-green-800">
                                    {engagement.avgResponseRate.toFixed(1)}%
                                  </Badge>
                                </td>
                                <td className="py-3 px-4 text-center text-sm">
                                  {responseTimeStr}
                                </td>
                                <td className="py-3 px-4 text-center">
                                  <Badge className="bg-blue-100 text-blue-800">
                                    {engagement.engagementScore.toFixed(1)}/10
                                  </Badge>
                                </td>
                                <td className="py-3 px-4 text-center">
                                  <Badge className="bg-purple-100 text-purple-800">
                                    {engagement.followUpRate.toFixed(1)}%
                                  </Badge>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Automated Engagement & CRM Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle>Automated Engagement & CRM</CardTitle>
                <CardDescription>
                  Overall engagement statistics and automation metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {(() => {
                  // Calculate channel performance (average engagement score by channel)
                  const channelPerformance = {
                    whatsapp: {
                      engagements: engagements.filter(
                        (e) => e.channel === "whatsapp",
                      ),
                      color: "bg-green-600",
                    },
                    sms: {
                      engagements: engagements.filter(
                        (e) => e.channel === "sms",
                      ),
                      color: "bg-blue-600",
                    },
                    email: {
                      engagements: engagements.filter(
                        (e) => e.channel === "email",
                      ),
                      color: "bg-red-600",
                    },
                    linkedin: {
                      engagements: engagements.filter(
                        (e) => e.channel === "linkedin",
                      ),
                      color: "bg-blue-700",
                    },
                  };

                  // Calculate overall stats
                  const totalEngagements = engagements.length;
                  const avgResponseRate =
                    totalEngagements > 0
                      ? (
                          engagements.reduce(
                            (sum, e) => sum + e.avgResponseRate,
                            0,
                          ) / totalEngagements
                        ).toFixed(1)
                      : 0;
                  const avgResponseTime =
                    totalEngagements > 0
                      ? engagements.reduce(
                          (sum, e) => sum + e.avgResponseTimeMinutes,
                          0,
                        ) / totalEngagements
                      : 0;
                  const avgFollowUpRate =
                    totalEngagements > 0
                      ? (
                          engagements.reduce(
                            (sum, e) => sum + e.followUpRate,
                            0,
                          ) / totalEngagements
                        ).toFixed(1)
                      : 0;

                  // Format response time
                  const formatTime = (minutes: number) => {
                    if (minutes === 0) return "0 min";
                    const hours = Math.floor(minutes / 60);
                    const mins = Math.round(minutes % 60);
                    if (hours > 0) return `${hours}h ${mins}m`;
                    return `${Math.round(minutes)}m`;
                  };

                  // Get max engagement score for normalization (0-10 scale)
                  const getChannelBarWidth = (
                    engagementsList: EngagementData[],
                  ) => {
                    if (engagementsList.length === 0) return 0;
                    const avgScore =
                      engagementsList.reduce(
                        (sum, e) => sum + e.engagementScore,
                        0,
                      ) / engagementsList.length;
                    return (avgScore / 10) * 100; // Convert to percentage
                  };

                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-4">
                          Channel Performance
                        </h4>
                        <div className="space-y-3">
                          {[
                            { name: "WhatsApp", key: "whatsapp" },
                            { name: "SMS", key: "sms" },
                            { name: "Email", key: "email" },
                            { name: "LinkedIn", key: "linkedin" },
                          ].map((channel) => {
                            const performance =
                              channelPerformance[
                                channel.key as keyof typeof channelPerformance
                              ];
                            const barWidth = getChannelBarWidth(
                              performance.engagements,
                            );
                            const avgScore =
                              performance.engagements.length > 0
                                ? (
                                    performance.engagements.reduce(
                                      (sum, e) => sum + e.engagementScore,
                                      0,
                                    ) / performance.engagements.length
                                  ).toFixed(1)
                                : 0;

                            return (
                              <div key={channel.key}>
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-sm">
                                    {channel.name}
                                  </span>
                                  <span className="text-xs text-gray-600">
                                    {performance.engagements.length} engagement
                                    {performance.engagements.length !== 1
                                      ? "s"
                                      : ""}
                                    {performance.engagements.length > 0 &&
                                      ` - Score: ${avgScore}/10`}
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className={`${performance.color} h-2 rounded-full transition-all`}
                                    style={{ width: `${barWidth}%` }}
                                  ></div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-4">Follow-up Stats</h4>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Total Engagements</span>
                              <span className="font-semibold">
                                {totalEngagements}
                              </span>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Overall Response Rate</span>
                              <span className="font-semibold">
                                {avgResponseRate}%
                              </span>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Avg Response Time</span>
                              <span className="font-semibold">
                                {formatTime(avgResponseTime)}
                              </span>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Avg Follow-up Rate</span>
                              <span className="font-semibold">
                                {avgFollowUpRate}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Targets Tab */}
          <TabsContent value="targets" className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Sales Target Management</h3>
              <Button onClick={() => setCreateTargetOpen(true)} size="lg">
                <Plus className="h-4 w-4 mr-2" />
                Create new Sales Target
              </Button>
            </div>

            {/* Sales Rep Selection */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  Select Sales Representative ({salesRepsList.length})
                </h3>
              </div>
              {salesRepsList.length === 0 ? (
                <div className="py-12 text-center border-2 border-dashed border-gray-300 rounded-lg">
                  <p className="text-gray-500 mb-2">
                    No sales representatives yet
                  </p>
                  <p className="text-sm text-gray-400">
                    Create a new sales target to add your first sales
                    representative
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {salesRepsList.map((rep) => {
                    const repData = repAchievements[rep.id];
                    const achievement = repData?.percentage || 0;
                    return (
                      <button
                        key={rep.id}
                        onClick={() => setSelectedSalesRep(rep.id)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          selectedSalesRep === rep.id
                            ? "border-blue-500 bg-blue-50 shadow-lg scale-105"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                            {rep.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{rep.name}</p>
                            <p
                              className={`text-xs font-bold ${
                                achievement >= 100
                                  ? "text-green-600"
                                  : "text-orange-600"
                              }`}
                            >
                              {achievement.toFixed(0) || "N/A"}%
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Sales Rep Target Details Table */}
            {selectedSalesRep ? (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {salesRepsList.find((r) => r.id === selectedSalesRep)?.name}{" "}
                    - Target Tracking
                  </CardTitle>
                  <CardDescription>
                    Comprehensive target achievement and performance metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {salesTargets.filter((t) => t.salesRepId === selectedSalesRep)
                    .length === 0 ? (
                    <div className="py-12 text-center">
                      <p className="text-gray-500 mb-2">
                        No targets created yet
                      </p>
                      <p className="text-sm text-gray-400">
                        Create a sales target for this representative to view
                        their performance
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b bg-gray-50">
                            <th className="text-left py-3 px-4 font-semibold">
                              Target Period
                            </th>
                            <th className="text-center py-3 px-4 font-semibold">
                              Target ($)
                            </th>
                            <th className="text-center py-3 px-4 font-semibold">
                              Achieved ($)
                            </th>
                            <th className="text-center py-3 px-4 font-semibold">
                              Achievement %
                            </th>
                            <th className="text-center py-3 px-4 font-semibold">
                              Status
                            </th>
                            <th className="text-center py-3 px-4 font-semibold">
                              Deals Closed
                            </th>
                            <th className="text-center py-3 px-4 font-semibold">
                              Avg Deal Size
                            </th>
                            <th className="text-left py-3 px-4 font-semibold">
                              AI Recommendation
                            </th>
                            <th className="text-center py-3 px-4 font-semibold">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {salesTargets
                            .filter((t) => t.salesRepId === selectedSalesRep)
                            .map((target) => {
                              const achievement =
                                (target.achievedAmount / target.targetAmount) *
                                100;
                              const isAchieved = achievement >= 100;
                              return (
                                <tr
                                  key={target.id}
                                  className="border-b hover:bg-gray-50"
                                >
                                  <td className="py-3 px-4 font-medium">
                                    {target.targetPeriod}
                                  </td>
                                  <td className="py-3 px-4 text-center">
                                    ${(target.targetAmount / 1000).toFixed(0)}K
                                  </td>
                                  <td className="py-3 px-4 text-center font-semibold">
                                    ${(target.achievedAmount / 1000).toFixed(0)}
                                    K
                                  </td>
                                  <td className="py-3 px-4 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                      <Badge
                                        className={
                                          isAchieved
                                            ? "bg-green-100 text-green-800"
                                            : "bg-yellow-100 text-yellow-800"
                                        }
                                      >
                                        {achievement.toFixed(0)}%
                                      </Badge>
                                      {isAchieved && (
                                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                                      )}
                                    </div>
                                  </td>
                                  <td className="py-3 px-4 text-center">
                                    <Select
                                      value={target.status}
                                      onValueChange={(newStatus) =>
                                        handleChangeTargetStatus(
                                          target.id,
                                          newStatus,
                                        )
                                      }
                                    >
                                      <SelectTrigger className="w-32 h-8 text-xs">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="In Progress">
                                          In Progress
                                        </SelectItem>
                                        <SelectItem value="✓ Achieved">
                                          ✓ Achieved
                                        </SelectItem>
                                        <SelectItem value="At Risk">
                                          At Risk
                                        </SelectItem>
                                        <SelectItem value="Completed">
                                          Completed
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </td>
                                  <td className="py-3 px-4 text-center font-semibold">
                                    {target.dealsClosed}
                                  </td>
                                  <td className="py-3 px-4 text-center text-sm">
                                    ${(target.avgDealSize / 1000).toFixed(1)}K
                                  </td>
                                  <td className="py-3 px-4 text-xs">
                                    <div className="flex items-start gap-1">
                                      <Lightbulb className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                                      <span>
                                        {achievement >= 100
                                          ? "Excellent performance - target achieved!"
                                          : achievement >= 75
                                            ? "On track - continue momentum"
                                            : "Below target - increase effort"}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="py-3 px-4 text-center">
                                    <button
                                      onClick={() =>
                                        handleDeleteTarget(target.id)
                                      }
                                      className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                      title="Delete target"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Sales Rep Target Tracking</CardTitle>
                  <CardDescription>
                    Select a sales representative to view their targets
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="py-12 text-center">
                    <p className="text-gray-500 mb-2">
                      No sales representative selected
                    </p>
                    <p className="text-sm text-gray-400">
                      Select a representative from the list above or create a
                      new target
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Overall Team Performance Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Team Target Summary</CardTitle>
                <CardDescription>
                  Overall team performance across all periods
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">
                      Total Team Target {/* TAG: Hardcoded */}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${(calculateTotalTeamTarget() / 1000).toFixed(0)}K
                    </p>{" "}
                    {/* VALUE: Calculated */}
                    <p className="text-xs text-gray-500 mt-2">Q1 Total</p>
                  </div>
                  <div className="p-4 border rounded-lg bg-green-50">
                    <p className="text-sm text-gray-600 mb-1">Total Achieved</p>{" "}
                    {/* TAG: Hardcoded */}
                    <p className="text-2xl font-bold text-green-700">
                      ${(calculateTotalAchieved() / 1000).toFixed(1)}K
                    </p>{" "}
                    {/* VALUE: Calculated */}
                    <p className="text-xs text-green-600 mt-2">
                      {calculateAvgTeamAchievement()}% Completion{" "}
                      {/* VALUE: Calculated */}
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Top Performer</p>{" "}
                    {/* TAG: Hardcoded */}
                    <p className="text-2xl font-bold text-blue-700">
                      {getTopPerformer().name}
                    </p>{" "}
                    {/* VALUE: Calculated */}
                    <p className="text-xs text-blue-600 mt-2">
                      {getTopPerformer().achievement}% Achievement{" "}
                      {/* VALUE: Calculated */}
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">
                      Avg Team Achievement {/* TAG: Hardcoded */}
                    </p>
                    <p className="text-2xl font-bold text-purple-700">
                      {calculateAvgTeamAchievement()}%
                    </p>{" "}
                    {/* VALUE: Calculated */}
                    <p className="text-xs text-purple-600 mt-2">
                      {parseInt(calculateAvgTeamAchievement()) >= 100
                        ? "Above Target"
                        : "In Progress"}{" "}
                      {/* VALUE: Calculated */}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sales Assets Tab */}
          <TabsContent value="assets" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sales Assets & Marketing Intelligence</CardTitle>
                <CardDescription>
                  Auto-generated proposals, marketing channel effectiveness, and
                  lead source attribution
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {(() => {
                  const proposals = calculateProposals();
                  const quotations = calculateQuotations();
                  const pitchDecks = calculatePitchDecks();
                  const leadSources = calculateLeadSources();

                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-4">Generated Assets</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-semibold">Proposals</p>
                              <p className="text-sm text-gray-600">
                                Auto-generated
                              </p>
                            </div>
                            <p className="text-2xl font-bold text-blue-600">
                              {proposals}
                            </p>
                          </div>
                          <hr />
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-semibold">Quotations</p>
                              <p className="text-sm text-gray-600">
                                Customized pricing
                              </p>
                            </div>
                            <p className="text-2xl font-bold text-green-600">
                              {quotations}
                            </p>
                          </div>
                          <hr />
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-semibold">Pitch Decks</p>
                              <p className="text-sm text-gray-600">
                                Interactive
                              </p>
                            </div>
                            <p className="text-2xl font-bold text-purple-600">
                              {pitchDecks}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-4">Lead Sources</h4>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Website</span>
                              <span className="font-semibold">
                                {leadSources.Website}%
                              </span>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Social Media</span>
                              <span className="font-semibold">
                                {leadSources["Social Media"]}%
                              </span>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Email Campaign</span>
                              <span className="font-semibold">
                                {leadSources["Email Campaign"]}%
                              </span>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Referrals</span>
                              <span className="font-semibold">
                                {leadSources.Referrals}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Deals Tab */}
          <TabsContent value="deals" className="space-y-6">
            <DealsAnalytics
              revenueByProduct={calculateRevenueByProduct()}
              revenueByRegion={calculateRevenueByRegion()}
              revenueBySalesRep={calculateRevenueBySalesRep()}
              revenueByIndustry={calculateRevenueByIndustry()}
              revenueBySegment={calculateRevenueBySegment()}
              forecastData={calculateForecastDataPoints()}
              totalRevenue={calculateTotalRevenue()}
              repeatRevenueRate={calculateRepeatRevenueRate()}
              repeatRevenueTrend={calculateRepeatRevenueTrend()}
              pipelineRisk={calculatePipelineRisk()}
              dealVelocityRisk={calculateDealVelocityRisk()}
              repPerformanceRisk={calculateRepPerformanceRisk()}
            />
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Insights Engine & AI Sales Coaching</CardTitle>
                <CardDescription>
                  Data-driven insights, top performer analysis, and personalized
                  coaching
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      Top Performers
                    </h4>
                    <div className="space-y-2">
                      {getTopPerformers().map((name) => (
                        <div
                          key={name}
                          className="text-sm flex items-center gap-2"
                        >
                          <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                          {name}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-orange-600" />
                      Areas to Improve
                    </h4>
                    <ul className="space-y-2 text-sm">
                      {getAreasToImprove().map((area) => (
                        <li key={area} className="flex items-center gap-2">
                          <span className="text-orange-600">•</span>
                          {area}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Zap className="h-5 w-5 text-blue-600" />
                      AI Coaching Tips
                    </h4>
                    <ul className="space-y-2 text-sm">
                      {getAiCoachingTips().map((tip) => (
                        <li key={tip} className="flex items-center gap-2">
                          <span className="text-blue-600">→</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-base">
                      Weekly Insights Report
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>
                          Team improved follow-up response rate by{" "}
                          {calculateFollowUpRateImprovement()}%
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                        <span>
                          Deal cycle time is {calculateDealCycleDays()} days
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <TrendingUp className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>
                          Conversion rate trending upward ( +
                          {calculateConversionRateTrend()}%)
                        </span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Strategic Recommendations Card */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Strategic Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 border rounded-lg">
                <div className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">
                      Focus on Pipeline Expansion
                    </h4>
                    <p className="text-sm text-gray-600">
                      Current pipeline is healthy but needs more top-of-funnel
                      activity to maintain growth
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-start gap-3">
                  <Target className="h-5 w-5 text-orange-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">
                      Implement Deal Rescue Playbooks
                    </h4>
                    <p className="text-sm text-gray-600">
                      3 deals at risk detected. Using AI-recommended
                      intervention strategies can recover $180K
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">
                      Personalized Coaching for Mid-Tier Reps
                    </h4>
                    <p className="text-sm text-gray-600">
                      John and Lisa can reach top performer status with focused
                      1-on-1 coaching
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Action Items</h4>
              <ul className="space-y-2">
                {[
                  "Increase daily prospecting activity by 25%",
                  "Implement automated follow-up for warm leads",
                  "Launch sales enablement training program",
                  "Optimize proposal turnaround time to < 24 hours",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <CreateLeadDialog
        open={createLeadOpen}
        onOpenChange={setCreateLeadOpen}
        onLeadCreated={handleLeadCreated}
      />

      <CreateSalesTargetDialog
        open={createTargetOpen}
        onOpenChange={setCreateTargetOpen}
        salesReps={salesRepsList}
        onTargetCreated={handleTargetCreated}
        onSalesRepCreated={handleSalesRepCreated}
      />

      <CreateEngagementDialog
        open={createEngagementOpen}
        onOpenChange={setCreateEngagementOpen}
        onEngagementCreated={handleEngagementCreated}
      />
    </div>
  );
};

export default SalesIntelligence;
