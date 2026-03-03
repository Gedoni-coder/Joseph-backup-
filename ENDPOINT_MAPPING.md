# Quick Endpoint & Function Mapping Reference

**Document**: Quick lookup for endpoints, functions, and data flow  
**Last Updated**: 2025  
**For**: Developers connecting modules

---

## Summary Table: All Endpoints & Functions

### Legend

- ✅ = Connected to frontend
- ⚠️ = Backend ready, frontend using mock data
- 🔴 = Not implemented yet

---

## Module 1: Economic Forecast `/api/economic/` ✅

### Endpoints

| Method | Endpoint                                   | Function                                 | Status |
| ------ | ------------------------------------------ | ---------------------------------------- | ------ |
| GET    | `/api/economic/metrics/`                   | `EconomicMetricViewSet.list()`           | ✅     |
| GET    | `/api/economic/metrics/?context={context}` | Filter by context                        | ✅     |
| POST   | `/api/economic/metrics/`                   | `EconomicMetricViewSet.create()`         | ✅     |
| GET    | `/api/economic/metrics/{id}/`              | `EconomicMetricViewSet.retrieve()`       | ✅     |
| PUT    | `/api/economic/metrics/{id}/`              | `EconomicMetricViewSet.update()`         | ✅     |
| PATCH  | `/api/economic/metrics/{id}/`              | `EconomicMetricViewSet.partial_update()` | ✅     |
| DELETE | `/api/economic/metrics/{id}/`              | `EconomicMetricViewSet.destroy()`        | ✅     |
| GET    | `/api/economic/news/`                      | `EconomicNewsViewSet.list()`             | ✅     |
| POST   | `/api/economic/news/`                      | `EconomicNewsViewSet.create()`           | ✅     |
| GET    | `/api/economic/forecasts/`                 | `EconomicForecastViewSet.list()`         | ✅     |
| POST   | `/api/economic/forecasts/`                 | `EconomicForecastViewSet.create()`       | ✅     |
| GET    | `/api/economic/events/`                    | `EconomicEventViewSet.list()`            | ✅     |
| POST   | `/api/economic/events/`                    | `EconomicEventViewSet.create()`          | ✅     |

### Frontend Hook & Functions

**Hook**: `src/hooks/useEconomicData.ts`

```typescript
// Main hook function
export function useEconomicData(companyName?: string) {
  // Returns object with:
  metrics: Record<string, EconomicMetric[]>        // grouped by context
  news: Record<string, EconomicNews[]>
  forecasts: Record<string, EconomicForecast[]>
  events: Record<string, EconomicEvent[]>
  lastUpdated: Date
  isLoading: boolean
  error: Error | null
  isConnected: boolean

  // Methods
  refreshData: (context?: string) => Promise<void>
  reconnect: () => Promise<void>
}

// Helper functions
groupByContext<T extends { context: string }>(items: T[])
  => Record<string, T[]>

getMockMetricsData(): EconomicMetric[]
getMockNewsData(): EconomicNews[]
getMockForecastData(): EconomicForecast[]
getMockEventData(): EconomicEvent[]
```

### Used By

- `src/pages/Index.tsx` - Displays metrics, news, forecasts on dashboard

### Environment Variables

```bash
VITE_API_BASE_URL=http://localhost:8000
VITE_ECONOMIC_API_ENDPOINT=/api/economic
VITE_ECONOMIC_API_ENABLED=true
```

---

## Module 2: Chatbot & Agent `/chatbot/` ✅

### Endpoints

| Method | Endpoint                                  | Function                               | Status |
| ------ | ----------------------------------------- | -------------------------------------- | ------ |
| GET    | `/chatbot/messages/`                      | `ChatMessageViewSet.list()`            | ✅     |
| POST   | `/chatbot/messages/`                      | `ChatMessageViewSet.create()`          | ✅     |
| GET    | `/chatbot/conversations/`                 | `ModuleConversationViewSet.list()`     | ✅     |
| GET    | `/chatbot/conversations/?module={module}` | Filter by module                       | ✅     |
| POST   | `/chatbot/conversations/`                 | `ModuleConversationViewSet.create()`   | ✅     |
| GET    | `/chatbot/conversations/{id}/`            | `ModuleConversationViewSet.retrieve()` | ✅     |
| POST   | `/chatbot/module-chat/`                   | `module_chat(request, module)`         | ✅     |
| POST   | `/chatbot/generate-response/`             | `generate_response(messages, context)` | ✅     |
| POST   | `/chatbot/agent/start/`                   | `agent_start()`                        | ✅     |
| POST   | `/chatbot/agent/stop/`                    | `agent_stop()`                         | ✅     |
| GET    | `/chatbot/agent/status/`                  | `agent_status()`                       | ✅     |
| POST   | `/chatbot/agent/command/`                 | `agent_command(command)`               | ✅     |
| POST   | `/chatbot/agent/tool-call/`               | `agent_tool_call(tool_name, params)`   | ✅     |
| POST   | `/chatbot/agent/ingest-url/`              | `agent_ingest_url(url)`                | ✅     |
| POST   | `/chatbot/agent/ingest-text/`             | `agent_ingest_text(text)`              | ✅     |
| POST   | `/chatbot/agent/query/`                   | `agent_query(module, query)`           | ✅     |

### Frontend Hooks & Functions

**Hook 1**: `src/hooks/useChatbot.ts`

```typescript
export function useChatbot() {
  // State
  isOpen: boolean
  isMinimized: boolean
  messages: ChatMessage[]                    // for current context
  currentInput: string
  isTyping: boolean
  currentContext: ModuleContext
  selectedTool: EconomicTool | null
  isToolOpen: boolean

  // Methods
  sendMessage: (content: string, context?: string) => Promise<void>
    // Tries local AI first, then POST /chatbot/generate-response/
    // May POST /chatbot/agent/query/ for module knowledge

  explainElement: (desc: string, data?: any) => Promise<void>
  switchContext: (contextId: string) => void
  openTool: (tool: EconomicTool) => void
  clearChat: () => void
  setIsOpen: (open: boolean) => void
  setIsMinimized: (minimized: boolean) => void
}

// Helper functions
generateAIResponse(messages, context)        // Local AI (fallback)
extractUrls(text): string[]
fetchWebPageText(url): Promise<string>
```

**Hook 2**: `src/hooks/useAgent.ts`

```typescript
export function useAgent() {
  // State
  isLoading: boolean
  error: Error | null
  status: AgentStatus                        // { is_running, pending_tasks, ... }

  // Methods
  startAgent: () => Promise<void>            // POST /chatbot/agent/start/
  stopAgent: () => Promise<void>             // POST /chatbot/agent/stop/
  getAgentStatus: () => Promise<AgentStatus> // GET /chatbot/agent/status/
  addAgentTask: (task: any) => Promise<void> // POST /chatbot/generate-response/
  clearError: () => void
}
```

### Backend Agent Functions

**File**: `backend/chatbot/agent.py`

```python
class AutonomousAgent:
  # Control methods
  start() -> None                            # Start agent loop
  stop() -> None                             # Stop agent loop
  get_status() -> dict                       # Return status
  add_task(task: dict) -> None               # Queue task

  # Internal methods
  _run_agent_loop() -> None                  # Main loop
  _process_pending_tasks() -> None           # Task processor
  _execute_task(task: dict) -> dict          # Execute single task
  _register_builtin_tools() -> None          # Register built-in tools
  _execute_tool(name: str, params: dict)     # Execute tool

  # Built-in tool methods
  _perform_web_search(query: str) -> list
  _retrieve_information(module: str, query: str) -> dict
  _update_module_data(module: str, data: dict) -> dict
  _analyze_data(module: str) -> dict
  _auto_update_modules() -> None
  _handle_information_processing(info: dict) -> dict
  _handle_user_request(request: str) -> str

# Global instance
agent = AutonomousAgent()
```

### Backend View Functions

**File**: `backend/chatbot/views.py`

```python
def module_chat(request):
  # POST request body: { "message": "text", "module": "market_analysis" }
  # Process using _build_knowledge_pack(module)
  # Call _groq_chat() if available, else use Gemini
  # Persist to ModuleConversationMessage
  # Return: { "response": "text", "timestamp": "..." }
  ...

def generate_response(request):
  # POST request body: { "messages": [...], "context": "..." }
  # Generate AI response combining Groq/Gemini
  # Return: { "content": "text", "role": "assistant" }
  ...

def _build_knowledge_pack(module: str) -> dict:
  # Compile module-specific data for context
  # Fetches recent KPIs, trends, recommendations from module
  ...

def _groq_chat(messages, system, knowledge) -> str:
  # Optional Groq API call (requires GROQ_API_KEY)
  # Falls back to Gemini if not available
  ...
```

### Used By

- `src/components/chatbot/chatbot-container.tsx` - Chat UI
- `src/components/chatbot/agent-panel.tsx` - Agent controls
- `src/components/conversation/module-conversation.tsx` - Module chat
- `src/components/competitive/competitive-strategy.tsx` - Agent tasks

### Environment Variables

```bash
VITE_CHATBOT_BACKEND_URL=http://localhost:8000
# Backend only:
GEMINI_API_KEY=<your-gemini-key>
GROQ_API_KEY=<your-groq-key>  # Optional
```

---

## Module 3: Business Forecast `/api/business/` ⚠️

### Endpoints

| Method | Endpoint                                  | Function                                 | Status |
| ------ | ----------------------------------------- | ---------------------------------------- | ------ |
| GET    | `/api/business/customer-profiles/`        | `CustomerProfileViewSet.list()`          | ⚠️     |
| POST   | `/api/business/customer-profiles/`        | `CustomerProfileViewSet.create()`        | ⚠️     |
| GET    | `/api/business/revenue-projections/`      | `RevenueProjectionViewSet.list()`        | ⚠️     |
| POST   | `/api/business/revenue-projections/`      | `RevenueProjectionViewSet.create()`      | ⚠️     |
| GET    | `/api/business/cost-structures/`          | `CostStructureViewSet.list()`            | ⚠️     |
| POST   | `/api/business/cost-structures/`          | `CostStructureViewSet.create()`          | ⚠️     |
| GET    | `/api/business/cash-flow-forecasts/`      | `CashFlowForecastViewSet.list()`         | ⚠️     |
| POST   | `/api/business/cash-flow-forecasts/`      | `CashFlowForecastViewSet.create()`       | ⚠️     |
| GET    | `/api/business/kpis/`                     | `KPIViewSet.list()`                      | ⚠️     |
| POST   | `/api/business/kpis/`                     | `KPIViewSet.create()`                    | ⚠️     |
| PATCH  | `/api/business/kpis/{id}/`                | `KPIViewSet.partial_update()`            | ⚠️     |
| GET    | `/api/business/scenario-plannings/`       | `ScenarioPlanningViewSet.list()`         | ⚠️     |
| POST   | `/api/business/scenario-plannings/`       | `ScenarioPlanningViewSet.create()`       | ⚠️     |
| GET    | `/api/business/documents/`                | `DocumentViewSet.list()`                 | ⚠️     |
| POST   | `/api/business/documents/`                | `DocumentViewSet.create()` (file upload) | ⚠️     |
| DELETE | `/api/business/documents/{id}/`           | `DocumentViewSet.destroy()`              | ⚠️     |
| GET    | `/api/business/documents/list_documents/` | `list_documents()` (custom action)       | ⚠️     |

### Frontend Hook & Functions

**Hook**: `src/hooks/useBusinessData.ts` (MOCK DATA)

```typescript
export function useBusinessData() {
  // State (mock data)
  customerProfiles: CustomerProfile[]
  revenueProjections: RevenueProjection[]
  costStructures: CostStructure[]
  cashFlowForecasts: CashFlowForecast[]
  kpis: KPI[]
  scenarios: ScenarioPlanning[]
  isLoading: boolean
  error: Error | null

  // Methods
  updateKPI: (id: string, value: number) => void
  updateScenario: (id: string, data: any) => void
  refreshData: () => Promise<void>
  reconnect: () => Promise<void>
}
```

### To Connect to Backend

Replace with:

```typescript
// In useBusinessData.ts
export function useBusinessData() {
  const [customerProfiles, setCustomerProfiles] = useState<CustomerProfile[]>(
    [],
  );
  const [revenueProjections, setRevenueProjections] = useState<
    RevenueProjection[]
  >([]);
  // ... other states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const baseUrl = import.meta.env.VITE_API_BASE_URL;

        const [profiles, projections, costs, cashflow, kpis, scenarios] =
          await Promise.all([
            fetch(`${baseUrl}/api/business/customer-profiles/`).then((r) =>
              r.json(),
            ),
            fetch(`${baseUrl}/api/business/revenue-projections/`).then((r) =>
              r.json(),
            ),
            fetch(`${baseUrl}/api/business/cost-structures/`).then((r) =>
              r.json(),
            ),
            fetch(`${baseUrl}/api/business/cash-flow-forecasts/`).then((r) =>
              r.json(),
            ),
            fetch(`${baseUrl}/api/business/kpis/`).then((r) => r.json()),
            fetch(`${baseUrl}/api/business/scenario-plannings/`).then((r) =>
              r.json(),
            ),
          ]);

        setCustomerProfiles(profiles);
        setRevenueProjections(projections);
        setCostStructures(costs);
        setCashFlowForecasts(cashflow);
        setKpis(kpis);
        setScenarios(scenarios);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    customerProfiles,
    revenueProjections,
    costStructures,
    cashFlowForecasts,
    kpis,
    scenarios,
    isLoading,
    error,
    updateKPI: async (id: string, value: number) => {
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      await fetch(`${baseUrl}/api/business/kpis/${id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ current_value: value }),
      });
    },
    // ... other methods
  };
}
```

### Used By

- `src/pages/BusinessForecast.tsx`
- Components: RevenueProjections, KPIDashboard, CostAnalysis, CashFlowChart

---

## Module 4: Market Analysis `/api/market/` ⚠️

### Endpoints

| Method | Endpoint                       | Function                        | Status |
| ------ | ------------------------------ | ------------------------------- | ------ |
| GET    | `/api/market/market-segments/` | `MarketSegmentViewSet.list()`   | ⚠️     |
| POST   | `/api/market/market-segments/` | `MarketSegmentViewSet.create()` | ⚠️     |
| GET    | `/api/market/competitors/`     | `CompetitorViewSet.list()`      | ⚠️     |
| POST   | `/api/market/competitors/`     | `CompetitorViewSet.create()`    | ⚠️     |
| GET    | `/api/market/market-trends/`   | `MarketTrendViewSet.list()`     | ⚠️     |
| POST   | `/api/market/market-trends/`   | `MarketTrendViewSet.create()`   | ⚠️     |

### Frontend Hooks

**Hook 1**: `src/hooks/useMarketData.ts` (MOCK)

```typescript
export function useMarketData() {
  return {
    marketSegments: MarketSegment[],
    competitors: Competitor[],
    marketTrends: MarketTrend[],
    totalTAM: number,
    refreshData: () => Promise<void>,
    isLoading: boolean,
    error: Error | null
  }
}
```

**Hook 2**: `src/hooks/useCompetitiveData.ts` (MOCK)

```typescript
export function useCompetitiveData() {
  return {
    competitors: Competitor[],
    swotAnalyses: SWOTAnalysis[],
    strategyRecommendations: StrategyRecommendation[],
    refreshData: () => Promise<void>,
    isLoading: boolean
  }
}
```

### Used By

- `src/pages/MarketCompetitiveAnalysis.tsx`
- `src/pages/CompetitorWhitePaper.tsx`
- `src/pages/SwotWhitePaper.tsx`

---

## Module 5: Loan & Funding `/api/loan/` ⚠️

### Key Endpoints

| Method | Endpoint                      | Function                        | Status |
| ------ | ----------------------------- | ------------------------------- | ------ |
| GET    | `/api/loan/loan-eligibility/` | `LoanEligibilityViewSet.list()` | ⚠️     |
| GET    | `/api/loan/funding-options/`  | `FundingOptionViewSet.list()`   | ⚠️     |
| GET    | `/api/loan/loan-comparisons/` | `LoanComparisonViewSet.list()`  | ⚠️     |
| GET    | `/api/loan/business-plans/`   | `BusinessPlanViewSet.list()`    | ⚠️     |
| GET    | `/api/loan/funding-strategy/` | `FundingStrategyViewSet.list()` | ⚠️     |
| GET    | `/api/loan/investor-matches/` | `InvestorMatchViewSet.list()`   | ⚠️     |

### Frontend Hook

**Hook**: `src/hooks/useLoanData.ts` (MOCK)

```typescript
export function useLoanData() {
  return {
    loanEligibility: LoanEligibility[],
    fundingOptions: FundingOption[],
    loanComparisons: LoanComparison[],
    businessPlans: BusinessPlan[],
    fundingStrategies: FundingStrategy[],
    investorMatches: InvestorMatch[],
    refreshData: () => Promise<void>,
    isLoading: boolean,
    error: Error | null
  }
}
```

### Used By

- `src/pages/LoanFunding.tsx`

---

## Module 6: Revenue Strategy `/api/revenue/` ⚠️

### Key Endpoints

| Method | Endpoint                             | Function                           | Status |
| ------ | ------------------------------------ | ---------------------------------- | ------ |
| GET    | `/api/revenue/revenue-streams/`      | `RevenueStreamViewSet.list()`      | ⚠️     |
| GET    | `/api/revenue/revenue-scenarios/`    | `RevenueScenarioViewSet.list()`    | ⚠️     |
| GET    | `/api/revenue/churn-analyses/`       | `ChurnAnalysisViewSet.list()`      | ⚠️     |
| GET    | `/api/revenue/upsell-opportunities/` | `UpsellOpportunityViewSet.list()`  | ⚠️     |
| GET    | `/api/revenue/revenue-metrics/`      | `RevenueMetricViewSet.list()`      | ⚠️     |
| GET    | `/api/revenue/channel-performances/` | `ChannelPerformanceViewSet.list()` | ⚠️     |

### Frontend Hook

**Hook**: `src/hooks/useRevenueData.ts` (MOCK)

```typescript
export function useRevenueData() {
  return {
    revenueStreams: RevenueStream[],
    revenueScenarios: RevenueScenario[],
    churnAnalyses: ChurnAnalysis[],
    upsellOpportunities: UpsellOpportunity[],
    revenueMetrics: RevenueMetric[],
    channelPerformances: ChannelPerformance[],
    refreshData: () => Promise<void>,
    isLoading: boolean
  }
}
```

### Used By

- `src/pages/RevenueStrategy.tsx`

---

## Module 7: Financial Advisory `/api/financial/` ⚠️

### Key Endpoints

| Method | Endpoint                                | Function                           | Status |
| ------ | --------------------------------------- | ---------------------------------- | ------ |
| GET    | `/api/financial/budget-forecasts/`      | `BudgetForecastViewSet.list()`     | ⚠️     |
| GET    | `/api/financial/cash-flow-projections/` | `CashFlowProjectionViewSet.list()` | ⚠️     |
| GET    | `/api/financial/scenario-tests/`        | `ScenarioTestViewSet.list()`       | ⚠️     |
| GET    | `/api/financial/risk-assessments/`      | `RiskAssessmentViewSet.list()`     | ⚠️     |
| GET    | `/api/financial/advisory-insights/`     | `AdvisoryInsightViewSet.list()`    | ⚠️     |
| GET    | `/api/financial/liquidity-metrics/`     | `LiquidityMetricViewSet.list()`    | ⚠️     |

### Frontend Hook

**Hook**: `src/hooks/useFinancialAdvisoryData.ts` (MOCK)

```typescript
export function useFinancialAdvisoryData() {
  return {
    budgetForecasts: BudgetForecast[],
    cashFlowProjections: CashFlowProjection[],
    scenarioTests: ScenarioTest[],
    riskAssessments: RiskAssessment[],
    advisoryInsights: AdvisoryInsight[],
    liquidityMetrics: LiquidityMetric[],
    refreshData: () => Promise<void>,
    isLoading: boolean
  }
}
```

### Used By

- `src/pages/FinancialAdvisory.tsx`

---

## Module 8: Pricing Strategy `/api/pricing/` ⚠️

### Key Endpoints

| Method | Endpoint                        | Function                      | Status |
| ------ | ------------------------------- | ----------------------------- | ------ |
| GET    | `/api/pricing/price-settings/`  | `PriceSettingViewSet.list()`  | ⚠️     |
| GET    | `/api/pricing/pricing-rules/`   | `PricingRuleViewSet.list()`   | ⚠️     |
| GET    | `/api/pricing/price-forecasts/` | `PriceForecastViewSet.list()` | ⚠️     |
| GET    | `/api/pricing/status/`          | `pricing_status()`            | ⚠️     |

### Frontend Hook

**Hook**: `src/hooks/usePricingData.ts` (MOCK)

```typescript
export function usePricingData() {
  return {
    priceSettings: PriceSetting[],
    pricingRules: PricingRule[],
    priceForecasts: PriceForecast[],
    refreshData: () => Promise<void>,
    isLoading: boolean
  }
}
```

### Used By

- `src/pages/PricingStrategy.tsx`

---

## Module 9: Tax Compliance `/api/tax/` ⚠️

### Key Endpoints

| Method | Endpoint                       | Function                         | Status |
| ------ | ------------------------------ | -------------------------------- | ------ |
| GET    | `/api/tax/`                    | `tax_home()`                     | ⚠️     |
| GET    | `/api/tax/tax-records/`        | `TaxRecordViewSet.list()`        | ⚠️     |
| GET    | `/api/tax/compliance-reports/` | `ComplianceReportViewSet.list()` | ⚠️     |

### Frontend Hook

**Hook**: `src/hooks/useTaxData.ts` (MOCK)

```typescript
export function useTaxData() {
  return {
    taxRecords: TaxRecord[],
    complianceReports: ComplianceReport[],
    refreshData: () => Promise<void>,
    isLoading: boolean
  }
}
```

### Used By

- `src/pages/TaxCompliance.tsx`

---

## Module 10: Policy & Compliance `/api/policy/` ⚠️

### Key Endpoints

| Method | Endpoint                                | Function                               | Status |
| ------ | --------------------------------------- | -------------------------------------- | ------ |
| GET    | `/api/policy/external-policies/`        | `ExternalPolicyViewSet.list()`         | ⚠️     |
| GET    | `/api/policy/internal-policies/`        | `InternalPolicyViewSet.list()`         | ⚠️     |
| GET    | `/api/policy/strategy-recommendations/` | `StrategyRecommendationViewSet.list()` | ⚠️     |

### Frontend Hook

**Hook**: `src/hooks/usePolicyEconomicData.ts` (MOCK)

```typescript
export function usePolicyEconomicData() {
  return {
    externalPolicies: ExternalPolicy[],
    internalPolicies: InternalPolicy[],
    strategyRecommendations: StrategyRecommendation[],
    refreshData: () => Promise<void>,
    isLoading: boolean
  }
}
```

---

## Module 11: Inventory & Supply Chain `/api/inventory/` ⚠️

### Key Endpoints

| Method | Endpoint                             | Function                         | Status |
| ------ | ------------------------------------ | -------------------------------- | ------ |
| GET    | `/api/inventory/inventory-items/`    | `InventoryItemViewSet.list()`    | ⚠️     |
| GET    | `/api/inventory/stock-movements/`    | `StockMovementViewSet.list()`    | ⚠️     |
| GET    | `/api/inventory/suppliers/`          | `SupplierViewSet.list()`         | ⚠️     |
| GET    | `/api/inventory/procurement-orders/` | `ProcurementOrderViewSet.list()` | ⚠️     |
| GET    | `/api/inventory/logistics-metrics/`  | `LogisticsMetricViewSet.list()`  | ⚠️     |

### Frontend Hooks

**Hook 1**: `src/hooks/useInventoryData.ts` (MOCK)

```typescript
export function useInventoryData() {
  return {
    inventoryItems: InventoryItem[],
    stockMovements: StockMovement[],
    demandForecasts: DemandForecast[],
    updateStockLevel: (itemId: string, quantity: number) => void,
    refreshData: () => Promise<void>,
    isLoading: boolean
  }
}
```

**Hook 2**: `src/hooks/useSupplyChainData.ts` (MOCK)

```typescript
export function useSupplyChainData() {
  return {
    suppliers: Supplier[],
    procurementOrders: ProcurementOrder[],
    warehouseOperations: WarehouseOperation[],
    logisticsMetrics: LogisticsMetric[],
    refreshData: () => Promise<void>,
    isLoading: boolean
  }
}
```

### Used By

- `src/pages/InventorySupplyChain.tsx`

---

## Additional Components with Direct API Calls

### Module Conversation Component

**File**: `src/components/conversation/module-conversation.tsx`

```typescript
// Direct API calls (not in hook)
GET /chatbot/conversations/?module={module}
POST /chatbot/conversations/
POST /chatbot/module-chat/
  Body: { content: string, module: string }
```

### Documents Section Component

**File**: `src/components/business/documents-section.tsx`

```typescript
// Direct API calls
GET /api/business/documents/
POST /api/business/documents/    // FormData with file
DELETE /api/business/documents/{id}/
```

---

## Quick Integration Checklist

### To Connect a Module to Backend:

- [ ] Verify backend `/api/{module}/` endpoints exist in `backend/backend_project/urls.py`
- [ ] Check ViewSet implementations in `backend/{module}/views.py`
- [ ] Review model definitions in `backend/{module}/models.py`
- [ ] Update `src/hooks/use{Module}Data.ts` hook to make real API calls
- [ ] Replace mock data with `useState` and `useEffect`
- [ ] Add proper error handling and loading states
- [ ] Test with backend running: `python manage.py runserver`
- [ ] Test frontend: `npm run dev`
- [ ] Update `API_DOCUMENTATION.md` with actual status
- [ ] Commit changes

### For Each Hook:

1. **State Variables**: Replace mock data with `useState`

   ```typescript
   const [data, setData] = useState<Type[]>([]);
   ```

2. **Data Fetching**: Add `useEffect` for initial load

   ```typescript
   useEffect(() => {
     fetch(`${baseUrl}/api/...`)
       .then((r) => r.json())
       .then((data) => setData(data));
   }, []);
   ```

3. **Methods**: Implement update/delete methods with real API calls

   ```typescript
   const updateItem = async (id: string, newData: any) => {
     await fetch(`${baseUrl}/api/.../` id}/`, {
       method: 'PATCH',
       body: JSON.stringify(newData)
     })
   }
   ```

4. **Error Handling**: Use try/catch
   ```typescript
   const [error, setError] = useState<Error | null>(null);
   // ... in fetch: catch(e) => setError(e)
   ```

---

## Environment Variables Quick Reference

```bash
# Frontend (Vite)
VITE_API_BASE_URL=http://localhost:8000
VITE_ECONOMIC_API_ENDPOINT=/api/economic
VITE_ECONOMIC_API_ENABLED=true
VITE_CHATBOT_BACKEND_URL=http://localhost:8000
VITE_AUTH_API_BASE=http://localhost:8000
VITE_ACCOUNTS_API_BASE=http://localhost:8000
VITE_DEV_MODE=true

# Backend (Django)
DJANGO_SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
GEMINI_API_KEY=your-api-key
GROQ_API_KEY=your-api-key  # Optional
```

---

**End of Quick Reference Guide**
