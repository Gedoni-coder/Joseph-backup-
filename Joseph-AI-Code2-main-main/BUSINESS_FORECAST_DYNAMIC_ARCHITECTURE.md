# Business Forecasting Module - Dynamic Architecture Blueprint

## Overview

The Business Forecasting module will be fully dynamic, with a three-layer architecture:
1. **Data Layer**: APIs/endpoints supplying raw data
2. **Business Logic Layer**: .ts files containing formulas and calculations
3. **UI Layer**: .tsx components displaying calculated data

### Data Flow
```
API Endpoints → Raw Data → .ts Formulas/Logic → Calculated Data → .tsx Components (Display)
```

---

## OVERVIEW TAB - Dynamic Components

### 1. Monthly Revenue Projections
**UI Component**: `src/components/business/revenue-projections.tsx`

**Data Structure**:
```
{
  period: "Jan 2025"
  percentageComplete: 85%
  projected: NGN 933,333.33
  actualToDate: NGN 884,666.67
  variance: -5.2%
  progress: 95%
  scenarioMin: NGN 840,000.00
  scenarioMax: NGN 1,073,333.33
  confidence: "High"
}
```

**API Endpoint Needed**:
- `GET /api/business/forecasts/monthly-projections` → Returns monthly revenue data

**Business Logic File**: `src/lib/calculations/revenue-calculations.ts`
```
calculateMonthlyProgress(actual, target) → percentage
calculateMonthlyVariance(actual, projected) → percentage
calculateConfidenceLevel(variance, historicalAccuracy) → confidence
getScenarioRange(baseProjection, volatility) → {min, max}
```

**Formula Logic**:
- **Progress Bar Fill**: `(actualToDate / projected) * 100`
- **Variance %**: `((actualToDate - projected) / projected) * 100`
- **Confidence Mapping**: Based on variance threshold (if variance < 5% → High, 5-15% → Medium, >15% → Low)
- **Scenario Range**: Min = projected * (1 - volatility), Max = projected * (1 + volatility)

---

### 2. Quarterly Revenue Projections
**UI Component**: Same as above with quarterly view toggle

**Data Structure**:
```
{
  period: "Q1 2025"
  percentageComplete: 85%
  projected: NGN 2,800,000.00
  actualToDate: NGN 2,654,000.00
  variance: -5.2%
  progress: 95%
  scenarioMin: NGN 2,520,000.00
  scenarioMax: NGN 3,220,000.00
  confidence: "High"
}
```

**API Endpoint Needed**:
- `GET /api/business/forecasts/quarterly-projections` → Returns quarterly revenue data

**Business Logic File**: Same as monthly (uses same calculations with different period aggregation)

**Formula Logic**:
- Sum monthly projections within quarter
- Calculate weighted average confidence for quarter
- Same variance and progress calculations as monthly

---

### 3. Yearly Revenue Projections
**Data Structure**:
```
{
  period: "Full Year 2025"
  percentageComplete: 76%
  projected: NGN 13,700,000.00
  actualToDate: NGN 7,224,000.00
  variance: -47.3%
  progress: 53%
  scenarioMin: NGN 12,330,000.00
  scenarioMax: NGN 15,785,000.00
  confidence: "Medium"
}
```

**API Endpoint Needed**:
- `GET /api/business/forecasts/annual-target` → Returns annual revenue target

**Formula Logic**:
- Sum all quarters (or month extrapolation)
- Annual confidence = weighted average of all quarterly confidences

---

### 4. Potential Upside
**Data Structure**:
```
{
  upside: NGN 2,085,000.00
}
```

**Business Logic File**: `src/lib/calculations/upside-calculation.ts`

**Formula Logic**:
```
potentialUpside = scenarioMax(annual) - projected(annual)
```

---

### 5. Average Confidence
**Data Structure**:
```
{
  avgConfidence: 76%
}
```

**Business Logic File**: Same as above

**Formula Logic**:
```
avgConfidence = (sum of all projection confidences) / (count of projections)
```

---

### 6. Cash Flow Forecast
**UI Component**: `src/components/business/financial-layout.tsx` (cash flow section)

**Data Structure**:
```
{
  period: "Jan 2025"
  inflow: $2.4M
  outflow: $2.1M
  net: $0.3M
}
```

**API Endpoint Needed**:
- `GET /api/business/forecasts/cash-flow` → Returns monthly cash flow data

**Business Logic File**: `src/lib/calculations/cash-flow-calculations.ts`

**Formula Logic**:
```
netCashFlow = cashInflow - cashOutflow
cumulativeCash = previous_cumulative + netCashFlow
runwayMonths = cumulativeCash / monthlyBurnRate
```

---

### 7. Profit/Loss Projection
**UI Component**: `src/components/business/financial-layout.tsx` (P&L section)

**Data Structure**:
```
{
  grossProfitMargin: 0
  afterCOGS: [value]
  operatingExpense: $0
  annualOverhead: [value]
  netProfit: $0
  bottomLine: [value]
}
```

**API Endpoint Needed**:
- `GET /api/business/forecasts/profit-loss` → Returns P&L projection

**Business Logic File**: `src/lib/calculations/profit-loss-calculations.ts`

**Formula Logic**:
```
grossProfit = revenue - COGS
grossProfitMargin = (grossProfit / revenue) * 100
operatingProfit = grossProfit - operatingExpenses
netProfit = operatingProfit - taxes - otherExpenses
netProfitMargin = (netProfit / revenue) * 100
```

---

### 8. Key Performance Indicators (KPIs)
**UI Component**: `src/components/business/kpi-dashboard.tsx`

**Data Structure** (for each KPI):
```
{
  id: "f1"
  name: "Revenue Growth Rate"
  status: "Good"
  current: 22.5%
  target: 25%
  progress: 90%
  frequency: "Monthly"
  category: "Financial"
}
```

**API Endpoint Needed**:
- `GET /api/business/forecasts/kpis` → Returns all KPI data

**Business Logic File**: `src/lib/calculations/kpi-calculations.ts`

**Formula Logic** (per KPI):
```
progress = (current / target) * 100
status = determine based on progress:
  - Excellent: >= 95%
  - Good: 80-94%
  - Fair: 60-79%
  - Needs Attention: < 60%

For each specific KPI, apply its own formula:
- Revenue Growth Rate = ((current_revenue - previous_revenue) / previous_revenue) * 100
- Gross Profit Margin = (gross_profit / revenue) * 100
- Net Profit Margin = (net_profit / revenue) * 100
- Operating Cash Flow = cash_inflows - cash_outflows
- ROI = (profit / investment) * 100
- Accounts Receivable Turnover = revenue / average_accounts_receivable
[... and formulas for all 59 KPIs]
```

---

### 9. KPI Summary Overview
**Data Structure**:
```
{
  excellent: 0
  good: 4
  fair: 2
  needsAttention: 0
}
```

**Business Logic File**: Same as KPI calculations

**Formula Logic**:
```
Count KPIs by status:
excellent = count(KPIs with status === "Excellent")
good = count(KPIs with status === "Good")
fair = count(KPIs with status === "Fair")
needsAttention = count(KPIs with status === "Needs Attention")
```

---

### 10. Alerts & Warnings
**Data Structure**:
```
[
  {
    id: "alert-1"
    title: "Revenue Below Target"
    description: "Current projection is slightly below annual target. Review customer segment assumptions."
    severity: "warning" | "critical" | "info"
  }
]
```

**API Endpoint Needed**:
- `GET /api/business/forecasts/alerts` → Returns generated alerts

**Business Logic File**: `src/lib/calculations/alert-generation.ts`

**Formula Logic**:
```
Generate alerts based on thresholds:
- IF (actualToDate / projected) < 0.95 → "Revenue Below Target"
- IF (variance_month_to_month) > threshold → "Cash Flow Variability"
- IF (cost_trend === "up" && increase > 10%) → "Cost Increase Trend"
[... and rules for other alerts]
```

---

### 11. Customer Profile & Demand Assumptions
**UI Component**: `src/components/business/customer-profile.tsx`

**Data Structure** (per segment):
```
{
  segment: "Enterprise"
  units: 85
  growthRate: +12.5%
  retention: 92%
  avgOrder: NGN 25,000.00
  seasonality: ±8%
  totalRevenueP otential: NGN 2,125,000.00
}
```

**API Endpoint Needed**:
- `GET /api/business/forecasts/customer-segments` → Returns customer segment data

**Business Logic File**: `src/lib/calculations/customer-segment-calculations.ts`

**Formula Logic**:
```
totalRevenuePotential = units * avgOrderValue * (1 + growthRate/100)
expectedRevenue = totalRevenuePotential * (retention/100)
seasonalVariance = totalRevenuePotential * (seasonality/100)
```

---

### 12. Demand Summary & Key Insights
**Data Structure**:
```
{
  totalMarketOpportunity: NGN 2,461,000.00
  weightedAvgGrowth: +22.5%
  overallRetention: 81.3%
}
```

**Business Logic File**: `src/lib/calculations/demand-summary-calculations.ts`

**Formula Logic**:
```
totalMarketOpportunity = sum(all segment revenue potentials)
weightedAvgGrowth = sum(segment_growth * segment_weight) / sum(segment_weights)
  where segment_weight = segment_units / total_units
overallRetention = sum(segment_retention * segment_units) / sum(segment_units)
```

---

## SUMMARY & RECOMMENDATIONS TAB - Dynamic Components

### 1. Business Forecast Summary
**Data Structure**:
```
{
  sections: [
    { title: "REVENUE OVERVIEW", content: "..." },
    { title: "CUSTOMER BASE", content: "..." },
    { title: "KEY PERFORMANCE METRICS", content: "..." },
    { title: "FORECAST METHODOLOGY", content: "..." },
    { title: "NEXT QUARTER OUTLOOK", content: "..." }
  ]
}
```

**Business Logic File**: `src/lib/calculations/summary-generation.ts`

**Formula Logic**:
- Pull key data points from previous calculations
- Generate narrative based on:
  - Annual revenue target
  - Number of customer segments
  - KPI count
  - Scenario range
  - Next quarter projections

---

### 2. Business Forecast Recommendations
**Data Structure**:
```
{
  recommendations: [
    { 
      section: "REVENUE OPTIMIZATION",
      points: [...]
    },
    { ... more sections ... }
  ]
}
```

**Business Logic File**: Same as summary

**Formula Logic**:
- Analyze KPI performance vs targets
- Flag low-performing areas
- Generate specific, data-driven recommendations

---

### 3. Key Metrics & Insights Table
**Data Structure**:
```
{
  metrics: [
    { index: 1, metric: "Annual Revenue Target", value: "$13.7M", insight: "Primary revenue goal" },
    { index: 2, metric: "Customer Segments", value: "2", insight: "Active market segments" },
    { ... more rows ... }
  ]
}
```

**Business Logic File**: Same as summary

**Formula Logic**:
```
Compile key metrics from:
- annual_revenue_target
- count(distinct customer_segments)
- count(all KPIs)
- count(scenarios)
```

---

### 4. Action Items
**Data Structure**:
```
[
  {
    id: "1"
    title: "Segment Revenue Analysis"
    priority: "High"
    description: "..."
    timeline: "Q1 2025"
  }
]
```

**Business Logic File**: Same as summary

**Formula Logic**:
- Auto-generate action items based on alerts and low KPI performance
- Prioritize based on impact (gap to target)

---

### 5. Next Steps
**Data Structure**:
```
[
  {
    id: "1"
    title: "Review and validate all revenue assumptions"
    owner: "Finance Team"
    due: "End of Week 1"
  }
]
```

**Business Logic File**: Same as summary

**Formula Logic**:
- Static but data-informed (adjust based on timeline and dependencies)

---

## API Endpoints Summary

All endpoints should follow REST convention and return JSON:

| Endpoint | Method | Returns |
|----------|--------|---------|
| `/api/business/forecasts/monthly-projections` | GET | Monthly revenue projections |
| `/api/business/forecasts/quarterly-projections` | GET | Quarterly revenue projections |
| `/api/business/forecasts/annual-target` | GET | Annual revenue target |
| `/api/business/forecasts/cash-flow` | GET | Cash flow forecast |
| `/api/business/forecasts/profit-loss` | GET | P&L projection |
| `/api/business/forecasts/kpis` | GET | All KPI data |
| `/api/business/forecasts/alerts` | GET | Generated alerts |
| `/api/business/forecasts/customer-segments` | GET | Customer segment data |
| `/api/business/forecasts/{id}` | PATCH | Update forecast data |

---

## Implementation Layer Files

### New Business Logic Files to Create

1. `src/lib/calculations/revenue-calculations.ts`
   - Monthly/quarterly/yearly revenue logic
   - Progress, variance, confidence calculations

2. `src/lib/calculations/cash-flow-calculations.ts`
   - Cash flow projections
   - Runway calculations
   - Working capital analysis

3. `src/lib/calculations/profit-loss-calculations.ts`
   - Margin calculations
   - Profit/loss projections
   - Cost structure analysis

4. `src/lib/calculations/kpi-calculations.ts`
   - All 59 KPI formulas
   - Status determination logic
   - Progress calculation

5. `src/lib/calculations/customer-segment-calculations.ts`
   - Segment revenue potential
   - Growth and retention projections
   - Seasonality adjustments

6. `src/lib/calculations/alert-generation.ts`
   - Alert threshold evaluation
   - Alert prioritization
   - Auto-generation logic

7. `src/lib/calculations/demand-summary-calculations.ts`
   - Market opportunity calculation
   - Weighted averages
   - Aggregate metrics

8. `src/lib/calculations/upside-calculation.ts`
   - Upside potential
   - Scenario analysis
   - Range calculations

9. `src/lib/calculations/summary-generation.ts`
   - Narrative text generation
   - Insight compilation
   - Recommendation logic

### Updated Hook File

- `src/hooks/useBusinessForecastingData.ts`
  - Integrate all calculation files
  - Transform API responses through calculation layer
  - Return calculated data to components

### Updated Component Files

- `src/components/business/revenue-projections.tsx`
- `src/components/business/kpi-dashboard.tsx`
- `src/components/business/financial-layout.tsx`
- `src/components/business/customer-profile.tsx`
- `src/components/business/scenario-planning.tsx`
- All accept data props and render dynamically

---

## Data Flow Example: Monthly Revenue Projection

```
1. User views Monthly Revenue Projections tab
   ↓
2. Component requests data from hook
   ↓
3. Hook calls API: GET /api/business/forecasts/monthly-projections
   ↓
4. API returns:
   {
     "month": "Jan 2025",
     "actualToDate": 884666.67,
     "projected": 933333.33,
     "historicalAccuracy": 0.95
   }
   ↓
5. Hook passes to revenue-calculations.ts:
   - calculateMonthlyProgress(884666.67, 933333.33)
   - calculateMonthlyVariance(884666.67, 933333.33)
   - calculateConfidenceLevel(-0.052, 0.95)
   ↓
6. Calculations return:
   {
     "progress": 95,
     "variance": -5.2,
     "confidence": "High"
   }
   ↓
7. Hook combines with original data and passes to component:
   {
     "period": "Jan 2025",
     "percentageComplete": 95,
     "projected": 933333.33,
     "actualToDate": 884666.67,
     "variance": -5.2,
     "confidence": "High",
     "scenarioMin": 840000,
     "scenarioMax": 1073333.33
   }
   ↓
8. Component renders:
   - Title shows "Jan 2025"
   - Progress bar at 95% fill
   - Numbers displayed formatted with currency
   - Confidence badge shows "High"
   - Volume button updates based on progress
```

---

## Phase Implementation Order

### Phase 1: Foundation (Calculation Layer)
1. Create all 9 calculation files with formulas
2. Update existing API client to support new endpoints
3. Test calculations with mock data

### Phase 2: Integration (Hook & API)
4. Update hook to use calculation files
5. Ensure API endpoints are working
6. Test data transformation pipeline

### Phase 3: UI Updates
7. Update components to use dynamic data
8. Remove hardcoded values
9. Test all dynamic flows

### Phase 4: Refinement
10. Test with real backend data
11. Add error handling
12. Optimize performance

---

## Key Principles

1. **Separation of Concerns**: Formulas in .ts, UI in .tsx, APIs separate
2. **Single Responsibility**: Each calculation file handles one domain
3. **Immutability**: Don't mutate input data, return new data
4. **Type Safety**: All functions typed with TypeScript
5. **Reusability**: Formulas can be used across components
6. **Testability**: Pure functions for easy unit testing
7. **Documentation**: Every formula documented with examples

---

## Success Criteria

- All 12+ components in Overview tab are fully dynamic
- All 5 components in Summary & Recommendations tab are fully dynamic
- Every UI element that displays a number has a corresponding formula
- Data flows seamlessly from API → calculations → UI
- No hardcoded values (except defaults/fallbacks)
- Progress bars, confidence levels, alerts all update based on real data
- All calculations are testable and documented

