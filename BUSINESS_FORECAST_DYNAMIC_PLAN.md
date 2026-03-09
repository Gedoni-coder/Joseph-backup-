# Business Forecasting Dynamic Implementation Plan

## Information Gathered

### Current Architecture
1. **Django Backend**: Has models for CustomerProfile, RevenueProjection, CostStructure, CashFlowForecast, KPI, ScenarioPlanning - but missing some fields
2. **API Service Layer**: `src/lib/api/business-forecasting-service.ts` - Has CRUD operations
3. **React Hook**: `src/hooks/useBusinessForecastingData.ts` - Fetches data with mock fallback
4. **UI Components**: Located in `src/components/business/` - Uses hardcoded mock data

### Current Data Types (in business-forecast-data.ts)
- CustomerProfile: id, segment, demandAssumption, growthRate, retention, avgOrderValue, seasonality
- RevenueProjection: id, period, projected, conservative, optimistic, actualToDate?, confidence
- KPI: id, name, current, target, unit, trend, category, frequency
- CashFlowForecast: id, month, cashInflow, cashOutflow, netCashFlow, cumulativeCash, workingCapital
- ScenarioPlanning: id, scenario, revenue, costs, profit, probability, keyAssumptions

### Missing in Django Models
- RevenueProjection: actualToDate, conservative, optimistic, period display name
- CustomerProfile: demandAssumption, growthRate, seasonality, revenuePotential
- KPI: category, frequency, trend
- CashFlowForecast: month name, cumulativeCash, workingCapital

## Plan

### Phase 1: Django Backend Updates
1. Extend RevenueProjection model with actualToDate, conservative, optimistic
2. Extend CustomerProfile with demandAssumption, growthRate, seasonality
3. Add category/frequency to KPI model
4. Create serializers
5. Create viewsets with CRUD

### Phase 2: TypeScript Calculation Files (Logic Layer)
Create separate .ts files for each calculation domain:

1. **revenue-calculation.ts**
   - calculateProgress(actual, projected)
   - calculateVariance(actual, projected)
   - calculateScenarioRange(conservative, optimistic, projected)
   - aggregateMonthly/Quarterly/Yearly

2. **kpi-calculation.ts**
   - calculateProgress(current, target)
   - determineStatus(progress)
   - determineTrend(current vs previous)
   - calculateCategorySummary(kpis)

3. **cashflow-calculation.ts**
   - calculateNetCashFlow(inflow, outflow)
   - calculateCumulativeCash(previous, current)
   - calculateWorkingCapital(inflow, outflow)

4. **customer-calculation.ts**
   - calculateRevenuePotential(demand, avgOrder)
   - calculateWeightedGrowth(profiles)
   - calculateOverallRetention(profiles)
   - calculateTotalMarketOpportunity(profiles)

5. **profitloss-calculation.ts**
   - calculateGrossProfit(revenue, cogs)
   - calculateGrossMargin(grossProfit, revenue)
   - calculateNetProfit(grossProfit, operating)
   - calculateNetMargin(netProfit, revenue)

6. **alert-generation.ts**
   - generateRevenueAlerts(projections, targets)
   - generateCashFlowAlerts(cashFlows)
   - generateCostAlerts(costStructure)

7. **summary-generation.ts**
   - generateBusinessSummary(data)
   - generateRecommendations(data)
   - generateActionItems(data)
   - generateNextSteps(data)

### Phase 3: Update Hook
- Import all calculation functions
- Add computed properties to return object
- Generate alerts dynamically
- Generate summaries dynamically

### Phase 4: UI Components
Make all components use computed/dynamic data:
- RevenueProjections: Dynamic progress bars, variance, confidence
- KPIDashboard: Dynamic status, progress, summary counts
- CustomerProfile: Dynamic calculations, demand summary
- Alerts: Dynamic based on calculations
- Summary: Dynamic text generation

## Dependent Files to be Edited
1. `api/models.py` - Add missing fields
2. `api/serializers.py` - Update serializers
3. `api/views.py` - Add viewsets
4. `api/urls/business.py` - Add routes
5. `src/lib/business-forecast-data.ts` - Update types
6. `src/lib/api/business-forecasting-service.ts` - Update service
7. New files in `src/lib/calculations/`:
   - revenue-calculation.ts
   - kpi-calculation.ts
   - cashflow-calculation.ts
   - customer-calculation.ts
   - profitloss-calculation.ts
   - alert-generation.ts
   - summary-generation.ts
8. `src/hooks/useBusinessForecastingData.ts` - Update hook
9. `src/components/business/*.tsx` - Update all components
10. `src/pages/BusinessForecast.tsx` - Update page

## Followup Steps
1. Run Django migrations for new fields
2. Seed initial data via API
3. Test all endpoints
4. Verify UI renders with dynamic data
5. Test progress bar animations
6. Verify calculations are correct

