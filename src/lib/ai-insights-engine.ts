import {
  BudgetForecast,
  CashFlowProjection,
  PerformanceDriver,
  RiskAssessment,
  AdvisoryInsight,
} from "./financial-advisory-data";

export interface GeneratedInsightReport {
  id: string;
  generatedAt: string;
  executiveSummary: {
    overallHealthScore: number;
    financialPosition: string;
    keyMetrics: {
      totalRevenue: number;
      totalExpenses: number;
      netIncome: number;
      liquidityCash: number;
    };
  };
  keyObservations: {
    title: string;
    description: string;
    severity: "critical" | "high" | "medium" | "low";
    impact: number;
  }[];
  recommendations: {
    id: string;
    title: string;
    description: string;
    rationale: string;
    estimatedImpact: number;
    timeframe: string;
    priority: "high" | "medium" | "low";
    actionItems: string[];
  }[];
  strategicScenarios: {
    name: "best-case" | "expected" | "worst-case";
    description: string;
    assumptions: string[];
    projections: {
      revenue: number;
      expenses: number;
      netIncome: number;
      liquidityCash: number;
      profitMargin: number;
    };
    probability: number;
  }[];
  riskAlerts: {
    riskName: string;
    category: string;
    severity: "critical" | "high" | "medium" | "low";
    description: string;
    recommendedActions: string[];
  }[];
  strategicRoadmap: {
    phase: "week" | "month" | "quarter";
    timeframe: string;
    objectives: string[];
    keyInitiatives: string[];
    expectedOutcomes: string[];
  }[];
}

export function generateInsightsReport(
  budgets: BudgetForecast[],
  cashFlows: CashFlowProjection[],
  drivers: PerformanceDriver[],
  risks: RiskAssessment[],
): GeneratedInsightReport {
  // Calculate aggregate metrics
  const totalRevenue = budgets.reduce((sum, b) => sum + b.revenue, 0);
  const totalExpenses = budgets.reduce((sum, b) => sum + b.expenses, 0);
  const netIncome = totalRevenue - totalExpenses;
  const liquidityCash = cashFlows.length > 0 ? cashFlows[0].closingBalance : 0;

  // Generate health score (0-100)
  const healthScore = calculateHealthScore(budgets, cashFlows, drivers, risks);

  // Identify key observations
  const observations = identifyKeyObservations(budgets, cashFlows, drivers, risks);

  // Generate strategic recommendations
  const recommendations = generateRecommendations(budgets, cashFlows, drivers);

  // Generate scenario projections
  const scenarios = generateScenarios(totalRevenue, totalExpenses, netIncome);

  // Extract and prioritize risk alerts
  const riskAlerts = generateRiskAlerts(risks);

  // Create strategic roadmap
  const roadmap = createStrategicRoadmap(observations, recommendations);

  return {
    id: `report-${Date.now()}`,
    generatedAt: new Date().toISOString(),
    executiveSummary: {
      overallHealthScore: healthScore,
      financialPosition:
        healthScore >= 75
          ? "Strong"
          : healthScore >= 50
            ? "Moderate"
            : "Concerning",
      keyMetrics: {
        totalRevenue,
        totalExpenses,
        netIncome,
        liquidityCash,
      },
    },
    keyObservations: observations,
    recommendations,
    strategicScenarios: scenarios,
    riskAlerts,
    strategicRoadmap: roadmap,
  };
}

function calculateHealthScore(
  budgets: BudgetForecast[],
  cashFlows: CashFlowProjection[],
  drivers: PerformanceDriver[],
  risks: RiskAssessment[],
): number {
  let score = 100;

  // Budget performance (30%)
  const avgConfidence = budgets.length > 0
    ? budgets.reduce((sum, b) => sum + b.confidence, 0) / budgets.length
    : 80;
  score -= (100 - avgConfidence) * 0.3;

  // Cash flow health (25%)
  if (cashFlows.length > 0) {
    const latestCashFlow = cashFlows[0];
    if (latestCashFlow.daysOfCash < 30) score -= 15;
    else if (latestCashFlow.daysOfCash < 60) score -= 10;
    if (latestCashFlow.liquidityRatio < 1.5) score -= 15;
  }

  // KPI performance (25%)
  const atRiskDrivers = drivers.filter(
    (d) => d.status === "at_risk" || d.status === "critical",
  ).length;
  score -= (atRiskDrivers / Math.max(drivers.length, 1)) * 25;

  // Risk assessment (20%)
  const highRisks = risks.filter((r) => r.riskScore > 70).length;
  score -= (highRisks / Math.max(risks.length, 1)) * 20;

  return Math.max(0, Math.min(100, Math.round(score)));
}

function identifyKeyObservations(
  budgets: BudgetForecast[],
  cashFlows: CashFlowProjection[],
  drivers: PerformanceDriver[],
  risks: RiskAssessment[],
) {
  const observations: GeneratedInsightReport["keyObservations"] = [];

  // Revenue trends
  if (budgets.length > 0) {
    const avgVariance =
      budgets.reduce((sum, b) => sum + b.variance, 0) / budgets.length;
    if (avgVariance < -3) {
      observations.push({
        title: "Revenue Under-Performance",
        description: `Average variance of ${avgVariance.toFixed(1)}% indicates revenue is tracking below forecast`,
        severity: "high",
        impact: Math.abs(avgVariance),
      });
    } else if (avgVariance > 2) {
      observations.push({
        title: "Revenue Over-Performance",
        description: `Revenue is exceeding forecasts by ${avgVariance.toFixed(1)}%, presenting upside opportunity`,
        severity: "low",
        impact: avgVariance,
      });
    }
  }

  // Cash flow concerns
  if (cashFlows.length > 0) {
    const latestFlow = cashFlows[0];
    if (latestFlow.daysOfCash < 45) {
      observations.push({
        title: "Low Cash Reserve",
        description: `Cash reserves at ${latestFlow.daysOfCash} days, below recommended 60-day minimum`,
        severity: "high",
        impact: 45 - latestFlow.daysOfCash,
      });
    }
    if (latestFlow.liquidityRatio < 2.0) {
      observations.push({
        title: "Liquidity Pressure",
        description: `Current ratio of ${latestFlow.liquidityRatio.toFixed(1)}x indicates potential short-term liquidity challenges`,
        severity: "medium",
        impact: 2.0 - latestFlow.liquidityRatio,
      });
    }
  }

  // KPI performance gaps
  const criticalDrivers = drivers.filter((d) => d.status === "critical");
  if (criticalDrivers.length > 0) {
    observations.push({
      title: "Critical KPI Underperformance",
      description: `${criticalDrivers.length} key performance indicators are at critical levels: ${criticalDrivers.map((d) => d.name).join(", ")}`,
      severity: "critical",
      impact: criticalDrivers.length * 15,
    });
  }

  const atRiskDrivers = drivers.filter((d) => d.status === "at_risk");
  if (atRiskDrivers.length > 0) {
    observations.push({
      title: "KPI Risk Alert",
      description: `${atRiskDrivers.length} KPIs are trending toward targets: ${atRiskDrivers.slice(0, 3).map((d) => d.name).join(", ")}`,
      severity: "medium",
      impact: atRiskDrivers.length * 8,
    });
  }

  // Risk summary
  const highRisks = risks.filter((r) => r.riskScore > 70);
  if (highRisks.length > 0) {
    observations.push({
      title: "High-Risk Exposures",
      description: `${highRisks.length} risks require active mitigation management`,
      severity: "high",
      impact: highRisks.length * 10,
    });
  }

  return observations.sort((a, b) => {
    const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
    return severityOrder[b.severity] - severityOrder[a.severity];
  });
}

function generateRecommendations(
  budgets: BudgetForecast[],
  cashFlows: CashFlowProjection[],
  drivers: PerformanceDriver[],
): GeneratedInsightReport["recommendations"] {
  const recommendations: GeneratedInsightReport["recommendations"] = [];
  const baseId = Date.now();

  // Cash flow optimization
  if (cashFlows.length > 0 && cashFlows[0].daysOfCash < 60) {
    recommendations.push({
      id: `rec-${baseId}-1`,
      title: "Accelerate Cash Collection",
      description:
        "Implement early payment incentives and streamline invoice collection processes",
      rationale:
        "Current cash reserves are below target levels. Reducing Days Sales Outstanding by 5-7 days could improve liquidity significantly.",
      estimatedImpact: 250000,
      timeframe: "60 days",
      priority: "high",
      actionItems: [
        "Implement automated payment reminders",
        "Offer 2% discount for payments within 10 days",
        "Enhance collections team focus on high-value accounts",
        "Review and optimize credit terms",
      ],
    });
  }

  // Cost optimization
  const totalExpenses = budgets.reduce((sum, b) => sum + b.expenses, 0);
  if (totalExpenses > 0) {
    const expenseRatio = totalExpenses / budgets.reduce((sum, b) => sum + b.revenue, 0 || 1);
    if (expenseRatio > 0.7) {
      recommendations.push({
        id: `rec-${baseId}-2`,
        title: "Strategic Cost Reduction Program",
        description:
          "Launch systematic cost optimization across operational and discretionary spending",
        rationale: `Expense ratio of ${(expenseRatio * 100).toFixed(1)}% is above industry benchmarks. Identify 10-15% cost savings through process efficiency and vendor optimization.`,
        estimatedImpact: 180000,
        timeframe: "120 days",
        priority: "high",
        actionItems: [
          "Conduct procurement spend analysis",
          "Renegotiate major vendor contracts",
          "Implement zero-based budgeting for discretionary spend",
          "Automate high-volume operational processes",
        ],
      });
    }
  }

  // KPI performance improvement
  const underperformingDrivers = drivers.filter(
    (d) => (d.currentValue / d.targetValue) * 100 < 85,
  );
  if (underperformingDrivers.length > 0) {
    recommendations.push({
      id: `rec-${baseId}-3`,
      title: "KPI Performance Acceleration",
      description: `Address underperformance in ${underperformingDrivers.length} critical metrics`,
      rationale: `Multiple KPIs are tracking 15%+ below targets. Focused interventions can improve performance and align organizational execution.`,
      estimatedImpact: 320000,
      timeframe: "90 days",
      priority: "high",
      actionItems: [
        "Establish daily KPI monitoring dashboards",
        "Assign performance owners with accountability",
        "Implement weekly performance review cadence",
        "Deploy targeted improvement initiatives per metric",
      ],
    });
  }

  // Budget-KPI alignment
  recommendations.push({
    id: `rec-${baseId}-4`,
    title: "Strengthen Budget-KPI Linkage",
    description:
      "Create explicit connections between budget allocation and performance driver outcomes",
    rationale:
      "Enhanced alignment between budgets and KPIs improves forecasting accuracy and decision-making.",
    estimatedImpact: 150000,
    timeframe: "45 days",
    priority: "medium",
    actionItems: [
      "Map budget categories to key performance drivers",
      "Create variance analysis framework linking budgets to KPI changes",
      "Establish monthly reconciliation process",
      "Build predictive models for budget-to-KPI relationships",
    ],
  });

  // Scenario planning
  recommendations.push({
    id: `rec-${baseId}-5`,
    title: "Implement Dynamic Scenario Planning",
    description:
      "Develop flexible planning framework to respond to market changes and economic shifts",
    rationale:
      "Current planning is largely static. Dynamic scenarios enable faster response to business disruptions.",
    estimatedImpact: 200000,
    timeframe: "60 days",
    priority: "medium",
    actionItems: [
      "Establish quarterly scenario review process",
      "Develop early warning indicators for plan adjustments",
      "Create contingency budgets for identified risks",
      "Implement rolling forecast methodology",
    ],
  });

  return recommendations;
}

function generateScenarios(
  revenue: number,
  expenses: number,
  netIncome: number,
): GeneratedInsightReport["strategicScenarios"] {
  const currentMargin = netIncome / (revenue || 1);

  return [
    {
      name: "best-case",
      description: "Strong execution with favorable market conditions",
      assumptions: [
        "10% revenue growth from new market expansion",
        "Operating margins improve 2% through efficiency gains",
        "No major economic disruptions",
        "Customer retention improves to 95%",
      ],
      projections: {
        revenue: revenue * 1.1,
        expenses: expenses * 0.96,
        netIncome: revenue * 1.1 - expenses * 0.96,
        liquidityCash: revenue * 0.12,
        profitMargin: ((revenue * 1.1 - expenses * 0.96) / (revenue * 1.1)) * 100,
      },
      probability: 25,
    },
    {
      name: "expected",
      description: "Moderate growth with normal business conditions",
      assumptions: [
        "4-5% revenue growth from current trajectory",
        "Operating margins stable or slightly improving",
        "Normal seasonal variations",
        "Customer retention steady at 92%",
      ],
      projections: {
        revenue: revenue * 1.045,
        expenses: expenses * 0.98,
        netIncome: revenue * 1.045 - expenses * 0.98,
        liquidityCash: revenue * 0.1,
        profitMargin: ((revenue * 1.045 - expenses * 0.98) / (revenue * 1.045)) * 100,
      },
      probability: 50,
    },
    {
      name: "worst-case",
      description: "Economic slowdown with execution challenges",
      assumptions: [
        "2% revenue decline from market downturn",
        "Operating expenses increase 5% due to inflation",
        "Customer churn increases to 12%",
        "Margin compression from competitive pressure",
      ],
      projections: {
        revenue: revenue * 0.98,
        expenses: expenses * 1.05,
        netIncome: revenue * 0.98 - expenses * 1.05,
        liquidityCash: revenue * 0.07,
        profitMargin: ((revenue * 0.98 - expenses * 1.05) / (revenue * 0.98)) * 100,
      },
      probability: 25,
    },
  ];
}

function generateRiskAlerts(
  risks: RiskAssessment[],
): GeneratedInsightReport["riskAlerts"] {
  return risks
    .map((risk) => ({
      riskName: risk.riskName,
      category: risk.category,
      severity:
        risk.riskScore > 75
          ? "critical"
          : risk.riskScore > 60
            ? "high"
            : risk.riskScore > 40
              ? "medium"
              : "low",
      description: risk.description,
      recommendedActions: risk.recommendedActions,
    }))
    .sort((a, b) => {
      const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return severityOrder[b.severity] - severityOrder[a.severity];
    });
}

function createStrategicRoadmap(
  observations: GeneratedInsightReport["keyObservations"],
  recommendations: GeneratedInsightReport["recommendations"],
): GeneratedInsightReport["strategicRoadmap"] {
  const highPriorityRecs = recommendations.filter((r) => r.priority === "high");
  const mediumPriorityRecs = recommendations.filter(
    (r) => r.priority === "medium",
  );
  const criticalObs = observations.filter((o) => o.severity === "critical");

  return [
    {
      phase: "week",
      timeframe: "Next 7 Days",
      objectives: [
        "Assess and acknowledge critical observations",
        "Align leadership on top priorities",
        "Mobilize teams for quick-win initiatives",
      ],
      keyInitiatives: [
        criticalObs.length > 0
          ? `Address ${criticalObs.length} critical issue(s)`
          : "Stabilize financial position",
        "Establish daily monitoring cadence",
        "Initiate emergency action plans for high-risk areas",
      ],
      expectedOutcomes: [
        "100% leadership alignment on priorities",
        "Risk mitigation plans activated",
        "Daily monitoring dashboard operational",
      ],
    },
    {
      phase: "month",
      timeframe: "Next 30 Days",
      objectives: [
        `Execute top ${Math.min(3, highPriorityRecs.length)} high-priority recommendations`,
        "Improve key metrics visibility",
        "Establish new operational rhythms",
      ],
      keyInitiatives: [
        highPriorityRecs
          .slice(0, 3)
          .map((r) => `${r.title}`)
          .join("; "),
        "Implement real-time KPI dashboards",
        "Launch quick-win improvement projects",
        "Complete monthly business review cycle",
      ],
      expectedOutcomes: [
        "5-10% improvement in critical metrics",
        "Leadership confidence in execution plan",
        "Foundation laid for longer-term initiatives",
      ],
    },
    {
      phase: "quarter",
      timeframe: "Next 90 Days",
      objectives: [
        "Full implementation of strategic recommendations",
        "Achieve material improvements in health metrics",
        "Build sustainable improvement culture",
      ],
      keyInitiatives: [
        `Execute ${recommendations.length} comprehensive recommendations`,
        mediumPriorityRecs.length > 0
          ? `Integrate medium-priority initiatives`
          : "Optimize processes",
        "Build predictive analytics capability",
        "Establish continuous improvement governance",
      ],
      expectedOutcomes: [
        "20%+ improvement in overall health score",
        "All high-priority items resolved",
        "Sustainable improvement mechanisms in place",
      ],
    },
  ];
}
