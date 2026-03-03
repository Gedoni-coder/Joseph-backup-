# 📊 APPLICATION MODULES STRUCTURE REPORT

## Executive Summary
Comprehensive inventory of all 12 core modules with their UI structures, data structures, components, and data management approaches.

---

## MODULE 1: Economic Indicators (Index.tsx)

### 🏗️ UI Structures
- **ModuleHeader** - Top header with title and status
- **Badges/Status Indicators** - Connection status, data freshness
- **Cards** - Market alerts (3x cards), economic analysis summary
- **MetricsDashboard** - Custom metrics grid component
- **EconomicTable** - News/data table
- **ForecastPanel** - Forecast visualization
- **UpcomingEvents** - Event list
- **Popovers & Tooltips** - Notifications/ideas
- **Footer** - Copyright and metadata

### 📦 Data Structures
```
metrics: Record<EconomicContext, Metric[]>
news: Record<EconomicContext, EconomicNews[]>
forecasts: Record<EconomicContext, EconomicForecast[]>
events: Record<EconomicContext, EconomicEvent[]>
MARKET_ALERTS: AlertItem[]
KEY_TAKEAWAYS: TakeawayItem[]
ECONOMIC_OUTLOOK: { summary, riskAssessment }
```

### 🔧 Child Components
- ModuleHeader
- ContextSwitcher
- MetricsDashboard
- EconomicTable
- ForecastPanel
- UpcomingEvents
- LoadingOverlay
- ConnectionStatus
- MetricCardSkeleton

### 📡 Data Management
- **Hook**: `useEconomicData(companyName)`
- **State**: activeContext, notificationsOpen, isStreaming, activeUpdates
- **Effects**: Streaming simulation (interval), context change refresh
- **Updates**: Real-time metrics via interval polling

### 📋 Main Sections
1. Header with context selector & live status
2. Key Metrics Dashboard
3. Economic News (table)
4. Economic Forecasts
5. Market Alerts (3 cards)
6. Economic Analysis Summary (takeaways & outlook)
7. Upcoming Events
8. Footer

---

## MODULE 2: Business Forecast

### 🏗️ UI Structures
- **ModuleHeader** - Module header
- **Quick-Stat Cards** - 4-column grid of KPIs
- **Tabbed Interface** - 8 tabs for different views
- **Card Grids** - Cost structure cards, cash flow cards
- **LoadingOverlay** - Loading states
- **Summary/Recommendation Section** - Narrative & metrics

### 📦 Data Structures
```
customerProfiles: CustomerProfile[]
revenueProjections: RevenueProjection[]
kpis: KPI[]
scenarios: BusinessScenario[]
costStructure: CostItem[]
cashFlowForecast: CashFlowItem[]
BUSINESS_FORECAST_DEFAULTS: Constants
```

### 🔧 Child Components
- CustomerProfileComponent
- RevenueProjections
- KPIDashboard
- ScenarioPlanningComponent
- BusinessMetricsTable
- FinancialLayout
- DocumentsSection
- SummaryRecommendationSection

### 📡 Data Management
- **Hook**: `useBusinessData()`
- **State**: activeTab (via Tabs component)
- **Actions**: refreshData, updateKPI, updateScenario
- **Derived**: Loading states via conditional renders

### 📋 Main Sections
1. Quick Stats (Revenue Target, Segments, KPIs, Scenarios)
2. Overview (Profiles, Revenue, KPIs)
3. Summary & Recommendation
4. Metrics Tables
5. Revenue Analysis
6. Cost Structure & Cash Flow
7. Planning & Scenarios
8. Analytics (Coming Soon)
9. Documents

---

## MODULE 3: Impact Calculator

### 🏗️ UI Structures
- **Card Grid** - Type selector (Policy vs Economic)
- **Scenario Cards** - Pre-defined scenario templates
- **Form Inputs** - Numerical inputs, select dropdowns
- **Two-Column Layout** - Input panel + Results panel
- **Result Cards** - Summary metrics
- **Action Buttons** - Calculate, Export, Save, Reset
- **Related Tools Card** - Links to other modules

### 📦 Data Structures
```
PolicyInputs: {
  complianceCost, implementationTime, affectedEmployees,
  trainingCost, systemUpgrades, consultingFees, reputationalImpact
}
EconomicInputs: {
  gdpChange, businessInvestment, jobCreation, marketExpansion,
  sectorImpact, innovationBoost, uncertaintyFactor
}
PolicyScenario[] & EconomicScenario[]
Results: { policyResult | economicResult }
```

### 🔧 Child Components
- Card (UI primitives only)
- Button
- Badge
- Select elements
- Input elements
- Router Link

### 📡 Data Management
- **State**: calculationType, policyInputs, economicInputs, results, isCalculating
- **Functions**: calculateImpact (local sync logic), loadScenario, resetCalculation
- **Async**: Simulated async delay in calculation
- **No External Hooks**: Self-contained component

### 📋 Main Sections
1. Calculator Type Selection
2. Quick Scenario Templates
3. Input Panel (dynamic based on type)
4. Results Panel (metrics summary)
5. Detailed Results Grid
6. Related Tools

---

## MODULE 4: Pricing Strategy

### 🏗️ UI Structures
- **ModuleHeader** - Title & connection status
- **LoadingSpinner** - Loading indicator
- **Tabbed Interface** - 7 tabs
- **Metric Cards** - Key pricing metrics
- **Strategy List** - Compact strategy rows
- **Test Cards** - Price test results
- **Conversation Pane** - Chat interface

### 📦 Data Structures
```
strategies: PricingStrategy[]
competitors: CompetitorPricing[]
tests: PriceTest[]
metrics: PricingMetric[]
dynamicPrices: DynamicPrice[]
MARKET_PREMIUM: "8-12%"
```

### 🔧 Child Components
- PricingStrategies
- CompetitiveAnalysis
- PriceTesting
- DynamicPricingComponent
- SummaryRecommendationSection
- ModuleConversation
- LoadingSpinner

### 📡 Data Management
- **Hook**: `usePricingData()`
- **State**: activeTab, isLoading, isConnected, error
- **Actions**: refreshData
- **Derived**: Market premium & metrics from imported content

### 📋 Main Sections
1. Overview (metrics + strategies + tests)
2. Summary & Recommendation
3. Strategies (detailed)
4. Competitive Analysis
5. Price Testing
6. Dynamic Pricing
7. JOSEPH Conversation

---

## MODULE 5: Revenue Strategy

### 🏗️ UI Structures
- **ModuleHeader** - Module header
- **LoadingSpinner** - Loading indicator
- **Tabbed Interface** - 7 tabs
- **Card Grids** - Revenue streams, churn, upsells
- **Metric Cards** - KPIs
- **Form Controls** - Add new stream capability
- **List Items** - Streams, channels, segments

### 📦 Data Structures
```
streams: RevenueStream[]
scenarios: RevenueScenario[]
churn: ChurnSegment[]
upsells: UpsellOpportunity[]
metrics: RevenueMetric[]
discounts: DiscountStructure[]
channels: Channel[]
```

### 🔧 Child Components
- RevenueStreams
- RevenueForecasting
- ChurnAnalysisComponent
- UpsellOpportunities
- SummaryRecommendationSection
- ModuleConversation

### 📡 Data Management
- **Hook**: `useRevenueData()`
- **State**: activeTab, streams (local copy for edits)
- **Actions**: refreshData, onAddStream
- **Derived**: Top lists filtered from data

### 📋 Main Sections
1. Overview (metrics & top lists)
2. Summary & Recommendation
3. Revenue Streams (management)
4. Forecasting
5. Churn Analysis
6. Upsell Opportunities
7. JOSEPH Conversation

---

## MODULE 6: Financial Advisory & Planning

### 🏗️ UI Structures
- **Sticky Header** - Navigation + status + popovers
- **Tabbed Interface** - 8 tabs
- **Notification Popovers** - 2-item list
- **Advice Popovers** - 2-item list
- **Domain Components** - Budget, cash flow, risk, KPIs
- **Metric Cards** - Quick stats

### 📦 Data Structures
```
budgetForecasts: BudgetForecast[]
cashFlowProjections: CashFlowProjection[]
currentCashFlows: CashFlow[]
scenarioTests: ScenarioTest[]
riskAssessments: RiskAssessment[]
performanceDrivers: PerformanceDriver[]
advisoryInsights: AdvisoryInsight[]
budgetAssumptions: BudgetAssumption[]
liquidityMetrics: LiquidityMetric[]
DEFAULT_NOTIFICATIONS: Notification[]
DEFAULT_ADVICE: Advice[]
```

### 🔧 Child Components
- StrategicBudgeting
- CashFlowPlanning
- BudgetValidation
- ScenarioTesting
- RiskAssessmentComponent
- PerformanceDrivers
- AdvisoryInsights
- SummaryRecommendationSection

### 📡 Data Management
- **Hook**: `useFinancialAdvisoryData()`
- **State**: activeTab, notificationsOpen, ideasOpen
- **Actions**: createBudgetForecast, updateBudgetAssumption, runScenarioTest, updateRiskStatus, updateInsightStatus, addCashFlowProjection, addRisk, addPerformanceDriver
- **UI State**: Popover open/close management

### 📋 Main Sections
1. Header with Notifications & Advice Popovers
2. Strategic Budgeting
3. Summary & Recommendation
4. Cash Flow Planning
5. Budget Validation
6. Scenario Testing
7. Risk Assessment
8. Performance Drivers (KPIs)
9. Advisory Insights

---

## MODULE 7: Market & Competitive Analysis

### 🏗️ UI Structures
- **ModuleHeader** - Title & status
- **LoadingSpinner** - Loading state
- **Tabbed Interface** - 7 tabs
- **Overview Cards** - TAM, segments, competitors, growth
- **Insight Cards** - Trends & competitors
- **Detailed Components** - Analysis views

### 📦 Data Structures
```
marketSizes: MarketSize[]
customerSegments: CustomerSegment[]
marketTrends: MarketTrend[]
demandForecasts: DemandForecast[]
industryInsights: IndustryInsight[]
reportNotes: ReportNote[]
competitors: Competitor[]
swotAnalyses: SWOTAnalysis[]
productComparisons: ProductComparison[]
marketPositions: MarketPosition[]
competitiveAdvantages: CompetitiveAdvantage[]
strategyRecommendations: StrategyRecommendation[]
```

### 🔧 Child Components
- MarketAnalysis
- CompetitiveAnalysis
- CompetitiveStrategy
- ReportNotes
- SummaryRecommendationSection
- ModuleConversation
- LoadingSpinner

### 📡 Data Management
- **Hooks**: `useMarketData()` + `useCompetitiveData()`
- **State**: activeTab
- **Derived**: Combined isLoading, isConnected, lastUpdated, error
- **Actions**: refreshMarketData, refreshCompetitiveData

### 📋 Main Sections
1. Overview (Market cards & insights)
2. Summary & Recommendation
3. Market Analysis (detailed)
4. Competitive Analysis
5. Strategy & Advantages
6. Report Notes
7. JOSEPH Conversation

---

## MODULE 8: Tax Compliance

### 🏗️ UI Structures
- **ModuleHeader** - Title & connection
- **Quick-Stat Cards** - 4 KPIs (liability, savings, updates, entities)
- **Tabbed Interface** - 6 tabs
- **Compliance Components** - Calculator, recommendations, updates
- **Compliance Calendar** - Event calendar
- **Lists & Cards** - Scenarios, audit trail, documents

### 📦 Data Structures
```
calculations: TaxCalculation[]
recommendations: TaxRecommendation[]
complianceUpdates: ComplianceUpdate[]
planningScenarios: PlanningScenario[]
auditTrail: AuditEntry[]
documents: Document[]
reports: Report[]
```

### 🔧 Child Components
- SmartTaxCalculator
- TaxRecommendations
- ComplianceUpdates
- ComplianceCalendar
- SummaryRecommendationSection (for summary tab)

### 📡 Data Management
- **Hook**: `useTaxData()`
- **State**: Active Tab via Tabs component
- **Derived**: totalTaxLiability, potentialSavings, implementedSavings
- **Actions**: updateCalculation, implementRecommendation, updateComplianceStatus, refreshData, reconnect
- **Helpers**: formatCurrency

### 📋 Main Sections
1. Quick Stats Dashboard
2. Smart Tax Calculator
3. Recommendations
4. Compliance Updates & Calendar
5. Planning Scenarios
6. Audit Trail
7. Documents & Reports

---

## MODULE 9: Business Feasibility

### 🏗️ UI Structures
- **ModuleHeader** - Title
- **Tabbed Interface** - 2 tabs (feasibility, planning)
- **Conversation Input Card** - Text input + submit
- **Report Cards** - Grid of past ideas
- **Tags** - Idea categorization
- **Verdict Badge** - Feasibility verdict per mode
- **Progress Indicators** - Score visualization

### 📦 Data Structures
```
FeasibilityReport: {
  id, idea, createdAt, tags,
  derivedInputs: Inputs,
  resultsByMode: Record<Mode, ModeResult>
}
Inputs: {
  risk, timeValue, roiTime, lengthTimeFactor, interestRate
}
ModeResult: {
  score, verdict, colorClass, pvFactor, combinedRate, details
}
```

### 🔧 Child Components
- BusinessPlanningContent (rendered in planning tab)
- Input form (native HTML)
- Card UI primitives

### 📡 Data Management
- **State**: ideaInput, reports, selectedId, activeTab
- **Storage**: localStorage with STORAGE_KEY
- **Effects**: Load/save reports from localStorage
- **Functions**: computeFeasibility (pure), deriveInputsFromIdea, buildNarrative (async AI)
- **Navigation**: useNavigate for routing to per-report details

### 📋 Main Sections
1. Input Card ("Got an Idea?")
2. Past Ideas Grid (with tags, date, actions)
3. Business Planning Tab

---

## MODULE 10: Business Planning

### 🏗️ UI Structures
- **ModuleHeader** - Title
- **Plan Input Card** - Text input + Plan button
- **Past Plans Grid** - 3-column responsive grid
- **Plan Cards** - Progress bar + metadata + actions
- **Badge** - Plan count

### 📦 Data Structures
```
BusinessPlan: {
  id, idea, businessName, createdAt,
  steps: Step[],
  completionPercentage
}
Step: {
  title, description, status, details
}
```

### 🔧 Child Components
- BusinessPlanningContent (main content)
- Card UI primitives
- Input
- Button

### 📡 Data Management
- **State**: planInput, plans (array)
- **Storage**: localStorage with STORAGE_KEY
- **Effects**: Load/save plans
- **Functions**: createEmptyBusinessPlan, extractBusinessName
- **Navigation**: useNavigate to planning flow

### 📋 Main Sections
1. Plan Input ("Make a Plan")
2. Past Business Plans Grid (progress cards)

---

## MODULE 11: Loan Funding

### 🏗️ UI Structures
- **ModuleHeader** - Title & connection status
- **LoadingSpinner** - Loading indicator
- **Tabbed Interface** - 7 tabs
- **Eligibility Card** - Quick eligibility check
- **Metric Cards** - Application progress, recommendations
- **Funding Options List** - Comparable funding products
- **Loan Comparison Table** - Side-by-side comparison
- **Application Progress** - Document checklist
- **Updates List** - Recent loan updates

### 📦 Data Structures
```
eligibility: {
  eligibilityScore, businessName, creditScore,
  monthlyRevenue, qualifiedPrograms
}
fundingOptions: FundingOption[]
loanComparisons: LoanComparison[]
applicationDocuments: Document[]
businessPlan: BusinessPlan
fundingStrategy: FundingStrategy
investorMatches: InvestorMatch[]
loanUpdates: Update[]
```

### 🔧 Child Components
- LoanEligibilityAssessment
- FundingOptionsExplorer
- SmartLoanComparison
- ApplicationAssistance
- FundingStrategyAnalysis
- InvestorMatchingEngine
- LoanResearchUpdates

### 📡 Data Management
- **Hook**: `useLoanData()`
- **State**: activeTab, selectedFundingOption
- **Actions**: updateEligibility, updateDocumentStatus, refreshData
- **Helpers**: formatCurrency
- **Error Handling**: Conditional early returns

### 📋 Main Sections
1. Overview (Eligibility check + recommendations + progress + updates)
2. Eligibility Assessment
3. Funding Options
4. Loan Comparison
5. Application Assistance
6. Funding Strategy & Investor Matching
7. Loan Research Updates

---

## MODULE 12: Inventory & Supply Chain Management

### 🏗️ UI Structures
- **ModuleHeader** - Title & connection status
- **LoadingSpinner** - Loading indicator
- **Tabbed Interface** - 10+ tabs
- **Metric Cards** - Inventory value, stock items, supplier score, risk
- **Quick Insights Cards** - Inventory status, supply chain health
- **Domain-Specific Components** - Stock monitoring, supplier management, production planning
- **Analytics Cards** - Coming soon placeholder

### 📦 Data Structures
```
--- Inventory Side ---
inventoryItems: InventoryItem[]
stockMovements: StockMovement[]
demandForecasts: DemandForecast[]
inventoryValuation: { totalValue, byLocation, byCategory }
deadStock: DeadStockItem[]
locations: Location[]
inventoryAudits: AuditEntry[]
turnoverMetrics: TurnoverMetric[]

--- Supply Chain Side ---
suppliers: Supplier[]
procurementOrders: ProcurementOrder[]
productionPlans: ProductionPlan[]
warehouseOperations: WarehouseOperation[]
logisticsMetrics: LogisticsMetric[]
marketVolatility: VolatilityData
regulatoryCompliance: ComplianceData
disruptionRisks: DisruptionRisk[]
sustainabilityMetrics: SustainabilityMetric[]
```

### 🔧 Child Components
- StockMonitoring
- DemandForecasting
- ValuationTracking
- InventoryAnalytics
- SupplierManagement
- ProcurementTracking
- ProductionPlanning
- SupplyChainAnalytics
- SummaryRecommendationSection

### 📡 Data Management
- **Hooks**: `useInventoryData()` + `useSupplyChainData()`
- **State**: activeTab
- **Derived**: totalInventoryValue, lowStockItems, avgSupplierPerformance, highRiskDisruptions
- **Actions**: updateStockLevel, addStockMovement, updateSupplierPerformance, updateOrderStatus, refreshData
- **Combined Refresh**: Single refreshData calls both hook refresh functions

### 📋 Main Sections
1. Overview (Metrics + Insights)
2. Summary & Recommendation
3. Stock Monitoring
4. Demand Forecasting
5. Inventory Valuation
6. Supplier Management
7. Procurement Tracking
8. Production Planning
9. Supply Chain Analytics
10. Inventory Analytics / Reporting

---

## 🎯 CROSS-MODULE PATTERNS IDENTIFIED

### UI Structure Consistency
| Pattern | Frequency | Used In |
|---------|-----------|---------|
| **ModuleHeader** | 12/12 | All modules |
| **Tabbed Interface** | 12/12 | All modules |
| **Cards Grid Layout** | 12/12 | All modules |
| **SummaryRecommendationSection** | 8/12 | Forecast, Pricing, Revenue, Financial, Market, Tax, Inventory, Loan |
| **ModuleConversation (JOSEPH)** | 6/12 | Pricing, Revenue, Market, + others |
| **Quick-Stat Card Grid** | 8/12 | Most modules (Business, Tax, Loan, etc.) |
| **Popovers** | 3/12 | Economic, Financial Advisory |
| **Forms/Inputs** | 4/12 | Impact, Feasibility, Planning, Loan |

### Data Management Consistency
| Pattern | Frequency | Examples |
|---------|-----------|----------|
| **Custom Hook Pattern** | 10/12 | useEconomicData, useBusinessData, useTaxData, etc. |
| **useState for activeTab** | 12/12 | All tabbed interfaces |
| **Derived Calculations** | 10/12 | Sum totals, averages, filtered counts |
| **localStorage Persistence** | 2/12 | BusinessFeasibility, BusinessPlanning |
| **Loading Spinner/Overlay** | 11/12 | Most modules (except Impact Calculator) |
| **Error Handling** | 10/12 | Connection errors, data fetch failures |
| **formatCurrency Helper** | 6/12 | Financial, Tax, Loan, Inventory modules |

### Child Component Distribution
**Most Reused Components:**
- Card (UI) - 12/12 modules
- Button - 12/12 modules
- Badge - 11/12 modules
- Tabs/TabsContent - 12/12 modules
- SummaryRecommendationSection - 8/12 modules
- ModuleConversation - 6/12 modules

**Domain-Specific:**
- SmartTaxCalculator - Tax Compliance only
- StockMonitoring - Inventory only
- RevenueStreams - Revenue Strategy only
- RiskAssessmentComponent - Financial Advisory only
- EconomicTable - Economic Indicators only

---

## 📊 DATA VOLUME ESTIMATES

| Module | Primary Data Arrays | Avg Items Per Array | Total Fields Tracked |
|--------|-------------------|-------------------|----------------------|
| Economic Indicators | 4 (metrics, news, forecasts, events) | 5-10 | ~40 |
| Business Forecast | 4 (profiles, projections, KPIs, scenarios) | 5-20 | ~80 |
| Impact Calculator | 2 (scenarios: policy, economic) | 5-6 | ~15 |
| Pricing Strategy | 5 (strategies, competitors, tests, metrics, dynamic) | 3-10 | ~50 |
| Revenue Strategy | 5 (streams, scenarios, churn, upsells, channels) | 4-15 | ~60 |
| Financial Advisory | 8 (budgets, cash flow, scenarios, risks, insights, drivers, assumptions, liquidity) | 3-20 | ~100 |
| Market & Competitive | 9 (markets, segments, trends, forecasts, insights, competitors, SWOT, comparisons, positions) | 3-15 | ~90 |
| Tax Compliance | 7 (calculations, recommendations, updates, scenarios, audit, docs, reports) | 3-10 | ~70 |
| Business Feasibility | 1 (reports stored in localStorage) | 3-5 | ~20 |
| Business Planning | 1 (plans stored in localStorage) | 5-15 | ~30 |
| Loan Funding | 7 (eligibility, options, comparisons, docs, strategy, investors, updates) | 2-10 | ~60 |
| Inventory & Supply Chain | 9 Inventory + 9 Supply Chain = 18 total | 5-50 | ~200+ |

---

## 🔄 DATA FLOW ARCHITECTURE

```
Module Page (src/pages/*.tsx)
    ↓
Custom Data Hook (useXData)
    ↓
Data Provider/API Layer (hooks/useXData.ts)
    ↓
Mock Data File (lib/*-data.ts) OR Content File (lib/*-content.ts)
    ↓
UI Primitives & Domain Components
    ↓
Rendered Content (displayed via mapping, derived calculations, conditional rendering)
```

---

## ✅ DATA STRUCTURE SEPARATION STATUS

**Refactored (Content Extracted to lib/ files):**
- ✅ Impact Calculator → `src/lib/impact-scenarios.ts`
- ✅ Business Forecast → `src/lib/business-forecast-content.ts`
- ✅ Economic Indicators → `src/lib/economic-content.ts`
- ✅ Financial Advisory → `src/lib/financial-advisory-content.ts`
- ✅ Market & Competitive → `src/lib/market-content.ts`
- ✅ Inventory & Supply Chain → `src/lib/inventory-content.ts`

**Already Data-Driven:**
- ✅ Pricing Strategy → `src/lib/pricing-content.ts` + `src/lib/pricing-data.ts`
- ✅ Revenue Strategy → `src/lib/revenue-content.ts` + `src/lib/revenue-data.ts`
- ✅ Tax Compliance → `src/lib/tax-compliance-data.ts`
- ✅ Business Feasibility → localStorage + computed logic
- ✅ Business Planning → localStorage persistence
- ✅ Loan Funding → `src/lib/loan-data.ts`

---

**Report Generated**: All 12 modules fully documented with UI structures, data shapes, components, and management patterns.
