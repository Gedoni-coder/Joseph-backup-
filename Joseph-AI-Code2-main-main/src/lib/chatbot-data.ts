export interface ChatMessage {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  context?: string;
  tools?: string[];
}

export interface ModuleContext {
  id: string;
  name: string;
  icon: string;
  route: string;
  description: string;
  capabilities: string[];
  sampleQuestions: string[];
}

export interface EconomicTool {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: "calculator" | "analyzer" | "planner" | "advisor" | "utility";
  isAvailable: boolean;
}

export const moduleContexts: ModuleContext[] = [
  {
    id: "economic-forecasting",
    name: "Economic Forecasting",
    icon: "TrendingUp",
    route: "/",
    description: "Economic indicators, forecasts, and market analysis",
    capabilities: [
      "Explain economic indicators and trends",
      "Interpret forecast data and projections",
      "Analyze market conditions and volatility",
      "Provide context for economic events"
    ],
    sampleQuestions: [
      "What does this inflation trend indicate?",
      "Explain the GDP forecast for next quarter",
      "What factors are driving this market volatility?"
    ]
  },
  {
    id: "business-forecast",
    name: "Business Forecast",
    icon: "BarChart3",
    route: "/business-forecast",
    description: "Business performance predictions and scenarios",
    capabilities: [
      "Analyze business forecast models",
      "Explain scenario planning results",
      "Interpret revenue and cost projections",
      "Provide strategic recommendations"
    ],
    sampleQuestions: [
      "How accurate is this forecast model?",
      "What assumptions drive these projections?",
      "How should I adjust my strategy based on this forecast?"
    ]
  },
  {
    id: "tax-compliance",
    name: "Tax & Compliance",
    icon: "Activity",
    route: "/tax-compliance",
    description: "Tax obligations and regulatory compliance",
    capabilities: [
      "Explain tax calculations and obligations",
      "Interpret compliance requirements",
      "Analyze audit findings and recommendations",
      "Provide deadline and penalty information"
    ],
    sampleQuestions: [
      "What does this tax calculation mean?",
      "How can I improve my compliance score?",
      "What are the implications of this audit finding?"
    ]
  },
  {
    id: "pricing-strategy",
    name: "Pricing Strategy",
    icon: "TrendingUp",
    route: "/pricing-strategy",
    description: "Pricing models and competitive analysis",
    capabilities: [
      "Analyze pricing strategies and models",
      "Explain competitive positioning",
      "Interpret price elasticity data",
      "Provide optimization recommendations"
    ],
    sampleQuestions: [
      "Is my current pricing optimal?",
      "How do I compare to competitors?",
      "What's the impact of a price change?"
    ]
  },
  {
    id: "revenue-strategy",
    name: "Revenue Strategy",
    icon: "Activity",
    route: "/revenue-strategy",
    description: "Revenue optimization and growth strategies",
    capabilities: [
      "Analyze revenue streams and performance",
      "Explain growth drivers and constraints",
      "Interpret customer metrics and LTV",
      "Provide revenue optimization strategies"
    ],
    sampleQuestions: [
      "Which revenue stream is most profitable?",
      "How can I increase customer lifetime value?",
      "What's driving the revenue decline?"
    ]
  },
  {
    id: "market-analysis",
    name: "Market Analysis",
    icon: "BarChart3",
    route: "/market-competitive-analysis",
    description: "Market research and competitive intelligence",
    capabilities: [
      "Analyze market trends and opportunities",
      "Explain competitive dynamics",
      "Interpret customer behavior data",
      "Provide market entry strategies"
    ],
    sampleQuestions: [
      "What's the market opportunity size?",
      "Who are my main competitors?",
      "How is customer behavior changing?"
    ]
  },
  {
    id: "loan-funding",
    name: "Loan & Funding",
    icon: "TrendingUp",
    route: "/loan-funding",
    description: "Financing options and investment analysis",
    capabilities: [
      "Analyze loan terms and conditions",
      "Explain funding options and requirements",
      "Interpret financial ratios and metrics",
      "Provide financing recommendations"
    ],
    sampleQuestions: [
      "Which loan option is best for me?",
      "What do these financial ratios mean?",
      "How can I improve my creditworthiness?"
    ]
  },
  {
    id: "inventory-supply",
    name: "Inventory & Supply",
    icon: "BarChart3",
    route: "/inventory-supply-chain",
    description: "Supply chain optimization and inventory management",
    capabilities: [
      "Analyze inventory levels and turnover",
      "Explain supply chain bottlenecks",
      "Interpret supplier performance data",
      "Provide optimization strategies"
    ],
    sampleQuestions: [
      "Why is my inventory turnover low?",
      "Which suppliers are underperforming?",
      "How can I optimize my supply chain?"
    ]
  },
  {
    id: "financial-advisory",
    name: "Financial Advisory",
    icon: "Calculator",
    route: "/financial-advisory",
    description: "Financial planning and strategic budgeting",
    capabilities: [
      "Analyze budget forecasts and variances",
      "Explain cash flow projections",
      "Interpret risk assessments",
      "Provide financial planning advice"
    ],
    sampleQuestions: [
      "Is my budget realistic?",
      "What does this cash flow projection show?",
      "How can I reduce financial risk?"
    ]
  },
  {
    id: "policy-economic",
    name: "Policy & Economic",
    icon: "Globe",
    route: "/policy-economic-analysis",
    description: "Policy analysis and economic impact assessment",
    capabilities: [
      "Explain policy implications and compliance",
      "Analyze economic indicators and trends",
      "Interpret impact assessments",
      "Provide strategic recommendations"
    ],
    sampleQuestions: [
      "How does this policy affect my business?",
      "What do these economic indicators mean?",
      "How should I respond to these changes?"
    ]
  },
  {
    id: "business-feasibility",
    name: "Business Feasibility",
    icon: "CheckCircle",
    route: "/business-feasibility",
    description: "Helps decide if a business idea is viable",
    capabilities: [
      "Assess risk and viability",
      "Incorporate time value and interest",
      "Estimate ROI timing and feasibility",
      "Compare conservative, safe, and wild modes"
    ],
    sampleQuestions: [
      "Is this idea feasible under conservative assumptions?",
      "How does interest rate change affect feasibility?",
      "When do we break even under wild mode?"
    ]
  }
];

export const economicTools: EconomicTool[] = [
  {
    id: "economic-calculator",
    name: "Economic Calculator",
    icon: "Calculator",
    description: "Calculate IRR, NPV, ROI, Payback Period",
    category: "calculator",
    isAvailable: true
  },
  {
    id: "forecast-wizard",
    name: "Forecast Wizard",
    icon: "TrendingUp",
    description: "Time-series projection with interactive charts",
    category: "analyzer",
    isAvailable: true
  },
  {
    id: "budget-planner",
    name: "Budget Planner",
    icon: "Target",
    description: "Generate personal and business budgets",
    category: "planner",
    isAvailable: true
  },
  {
    id: "cba-analyzer",
    name: "CBA Analyzer",
    icon: "Scale",
    description: "Cost-Benefit analysis decision assistant",
    category: "analyzer",
    isAvailable: true
  },
  {
    id: "trade-advisor",
    name: "Trade Advisor",
    icon: "Globe",
    description: "Trade opportunities based on country data",
    category: "advisor",
    isAvailable: true
  },
  {
    id: "jargon-buster",
    name: "Jargon Buster",
    icon: "BookOpen",
    description: "Explain economic terms in plain language",
    category: "utility",
    isAvailable: true
  },
  {
    id: "survey-builder",
    name: "Survey Builder",
    icon: "ClipboardList",
    description: "Design and analyze surveys and forms",
    category: "utility",
    isAvailable: true
  },
  {
    id: "dashboard-viewer",
    name: "Dashboard Viewer",
    icon: "Monitor",
    description: "View uploaded data in charts and tables",
    category: "utility",
    isAvailable: true
  }
];

export const generateContextualResponse = (question: string, context: string, currentData?: any): string => {
  const responses: Record<string, (data?: any) => string> = {
    "economic-forecasting": (data) => `As Joseph AI, I can help you understand the economic indicators and forecasts on this dashboard. ${question.includes('inflation') ? 'Inflation trends show the rate at which prices are rising, affecting purchasing power and monetary policy decisions.' : question.includes('GDP') ? 'GDP forecasts indicate expected economic growth, influenced by factors like consumer spending, investment, and government policies.' : 'The economic data shows current market conditions and future projections based on various economic factors.'}`,
    
    "policy-economic": (data) => `I'm Joseph, your policy and economic analysis assistant. ${question.includes('policy') ? 'This policy analysis shows external regulations, internal compliance status, and strategic recommendations for your business.' : question.includes('economic') ? 'The economic indicators track macro and micro-economic factors that impact your business operations and strategy.' : 'The current data shows policy compliance scores, economic trends, and recommended strategic actions.'}`,
    
    "business-forecast": (data) => `As Joseph AI, I can explain your business forecasting data. ${question.includes('forecast') ? 'These forecasts use historical data and market trends to predict future business performance.' : question.includes('scenario') ? 'Scenario analysis helps you understand different possible outcomes and prepare contingency plans.' : 'The business forecasts show expected revenue, costs, and growth patterns.'}`,
    
    "tax-compliance": (data) => `I'm Joseph, your tax and compliance advisor. ${question.includes('tax') ? 'Your tax calculations show obligations, deductions, and optimization opportunities.' : question.includes('compliance') ? 'Compliance scores indicate how well you meet regulatory requirements and areas for improvement.' : 'The tax and compliance data helps ensure you meet all obligations while optimizing your tax position.'}`,
    
    "pricing-strategy": (data) => `As Joseph AI, I can help with your pricing strategy analysis. ${question.includes('price') ? 'Pricing optimization considers market demand, competitor pricing, and cost structures.' : question.includes('competitor') ? 'Competitive analysis shows how your pricing compares to market standards and opportunities for adjustment.' : 'The pricing data shows current strategies, market positioning, and optimization recommendations.'}`,
    
    "revenue-strategy": (data) => `I'm Joseph, your revenue strategy consultant. ${question.includes('revenue') ? 'Revenue analysis shows which streams perform best and growth opportunities.' : question.includes('customer') ? 'Customer metrics indicate lifetime value, acquisition costs, and retention patterns.' : 'The revenue data helps identify the most profitable growth strategies.'}`,
    
    "market-analysis": (data) => `As Joseph AI, I can explain your market analysis data. ${question.includes('market') ? 'Market analysis reveals opportunities, threats, and competitive positioning.' : question.includes('customer') ? 'Customer behavior data shows preferences, trends, and buying patterns.' : 'The market data provides insights for strategic decision-making and positioning.'}`,
    
    "loan-funding": (data) => `I'm Joseph, your financing advisor. ${question.includes('loan') ? 'Loan analysis compares terms, rates, and total costs to find optimal financing.' : question.includes('funding') ? 'Funding options show available capital sources and their requirements.' : 'The financing data helps you make informed decisions about business funding.'}`,
    
    "inventory-supply": (data) => `As Joseph AI, I can help with supply chain optimization. ${question.includes('inventory') ? 'Inventory metrics show turnover rates, stock levels, and optimization opportunities.' : question.includes('supplier') ? 'Supplier performance data tracks delivery, quality, and cost metrics.' : 'The supply chain data identifies bottlenecks and improvement opportunities.'}`,
    
    "financial-advisory": (data) => `I'm Joseph, your financial planning assistant. ${question.includes('budget') ? 'Budget analysis shows planned vs actual performance and variance explanations.' : question.includes('cash flow') ? 'Cash flow projections help ensure adequate liquidity for operations.' : 'The financial planning data supports strategic budgeting and risk management.'}`
  ,
    "business-feasibility": (data) => `I'm Joseph, your feasibility assistant. ${question.includes('risk') ? 'Risk levels reduce feasibility; consider mitigation steps.' : question.includes('interest') ? 'Higher interest and discount rates lower present value and feasibility.' : question.includes('roi') ? 'Shorter ROI time improves feasibility; longer timelines require stronger returns.' : 'Use modes (Conservative/Safe/Wild) to test assumptions and see feasibility.'}`
  };

  return responses[context]?.(currentData) || `As Joseph AI, I'm here to help explain the data and insights on your screen. Could you be more specific about what you'd like to understand?`;
};

export const smartSuggestions = [
  "Explain this chart to me",
  "What does this trend indicate?",
  "How can I improve these metrics?",
  "Run a cost-benefit analysis",
  "Show me the forecast",
  "What are the key insights here?",
  "How does this compare to benchmarks?",
  "What actions should I take?",
  "Explain this in simple terms",
  "Generate a summary report"
];
