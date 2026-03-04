# Business Forecasting Module - API Requirements

This document outlines all required API endpoints to feed the dynamic Business Forecasting module with raw data.

## Overview

The API endpoints will provide **raw data only**. All business logic calculations are handled in the calculation layer (`src/lib/calculations/`). The endpoints should return minimal, unprocessed data that the calculation functions will transform.

## API Endpoints Required

### 1. Revenue Projections Endpoints

#### GET `/api/business/forecasts/revenue-projections`
Returns revenue projection data for all periods.

**Response:**
```json
{
  "monthlyProjections": [
    {
      "period": "Jan 2025",
      "projected": 933333.33,
      "conservative": 840000,
      "optimistic": 1073333,
      "actualToDate": 884666.67,
      "confidence": 85
    },
    // ... more months
  ],
  "quarterlyProjections": [
    {
      "period": "Q1 2025",
      "projected": 2800000,
      "conservative": 2520000,
      "optimistic": 3220000,
      "actualToDate": 2654000,
      "confidence": 85
    },
    // ... Q2, Q3, Q4
  ],
  "annualTarget": {
    "period": "Full Year 2025",
    "projected": 13700000,
    "conservative": 12330000,
    "optimistic": 15785000,
    "actualToDate": 7224000,
    "confidence": 76
  },
  "historicalAccuracy": 0.92,
  "volatilityCoefficient": 0.1
}
```

**Used by:**
- `calculateCompleteProjection()` in revenue-calculations.ts
- RevenueProjections component

---

### 2. Cash Flow Endpoints

#### GET `/api/business/forecasts/cash-flow`
Returns monthly cash flow data.

**Response:**
```json
{
  "initialCumulative": 1650000,
  "monthlyBurnRate": 50000,
  "data": [
    {
      "period": "Jan 2025",
      "cashInflow": 2400000,
      "cashOutflow": 2100000
    },
    {
      "period": "Feb 2025",
      "cashInflow": 2650000,
      "cashOutflow": 2280000
    },
    // ... more months
  ]
}
```

**Used by:**
- `calculateCompleteCashFlow()` in financial-calculations.ts
- Financial layout component

---

### 3. Profit & Loss Endpoints

#### GET `/api/business/forecasts/profit-loss`
Returns P&L projection data.

**Response:**
```json
{
  "annual": {
    "revenue": 13700000,
    "cogs": 5243000,
    "operatingExpenses": 3277000,
    "taxes": 1365000,
    "otherExpenses": 300000
  },
  "quarterly": [
    {
      "period": "Q1 2025",
      "revenue": 2800000,
      "cogs": 1064000,
      "operatingExpenses": 700000,
      "taxes": 280000,
      "otherExpenses": 75000
    },
    // ... Q2, Q3, Q4
  ]
}
```

**Used by:**
- `calculateCompleteProfitLoss()` in financial-calculations.ts
- Financial layout component

---

### 4. KPI Data Endpoints

#### GET `/api/business/forecasts/kpis`
Returns raw KPI values and metadata.

**Response:**
```json
{
  "kpis": [
    {
      "id": "f1",
      "name": "Revenue Growth Rate",
      "current": 22.5,
      "target": 25.0,
      "unit": "%",
      "category": "Financial",
      "frequency": "Monthly",
      "previous": 21.5
    },
    {
      "id": "f2",
      "name": "Gross Profit Margin",
      "current": 62.0,
      "target": 65.0,
      "unit": "%",
      "category": "Financial",
      "frequency": "Monthly",
      "previous": 61.5
    },
    // ... all 59 KPIs
  ],
  "period": "Jan 2025",
  "lastUpdated": "2025-01-15T10:30:00Z"
}
```

**Used by:**
- `calculateBatchKPIs()` in kpi-calculations.ts
- KPI Dashboard component

---

### 5. Customer Segment Endpoints

#### GET `/api/business/forecasts/customer-segments`
Returns customer segment demand assumptions.

**Response:**
```json
{
  "segments": [
    {
      "segment": "Enterprise",
      "units": 85,
      "growthRate": 12.5,
      "retention": 92,
      "avgOrderValue": 25000,
      "seasonality": 8
    },
    {
      "segment": "SMB",
      "units": 280,
      "growthRate": 25.6,
      "retention": 78,
      "avgOrderValue": 1200,
      "seasonality": 22
    }
  ],
  "baselineRevenues": [2125000, 336000]
}
```

**Used by:**
- `calculateBatchSegments()` in customer-segment-calculations.ts
- `calculateDemandSummary()` in customer-segment-calculations.ts
- Customer Profile component

---

### 6. Alerts Data Endpoint

#### GET `/api/business/forecasts/alert-metrics`
Returns metrics needed for alert generation (may be aggregated from above endpoints).

**Response:**
```json
{
  "actualToDate": 7224000,
  "projected": 13700000,
  "monthlyRevenue": [1800000, 1920000, 2100000, 2250000, 2430000, 2650000, 2850000],
  "monthlyCosts": [1500000, 1520000, 1545000, 1575000, 1610000, 1650000, 1695000],
  "churnRate": 2.1,
  "runwayMonths": 18,
  "pipelineValue": 45000000,
  "quarterlyTarget": 3425000,
  "currentMargin": 18.5,
  "targetMargin": 20.0,
  "growthRates": [22.5, 22.8, 23.2, 23.1],
  "kpiStatuses": {
    "f1": "Good",
    "f2": "Good",
    "c1": "Good",
    // ... KPI status map
  }
}
```

**Used by:**
- `generateAllAlerts()` in alert-generation.ts
- Alerts & Warnings component

---

### 7. Summary & Recommendations Endpoints

#### GET `/api/business/forecasts/summary-metadata`
Returns metadata for generating summary and recommendations (can be mostly static/template-based).

**Response:**
```json
{
  "totalRevenueLast12": 13700000,
  "segmentCount": 2,
  "kpiCount": 59,
  "scenarioCount": 2,
  "forecastMethod": "Monte Carlo + Linear Regression + Scenario Planning",
  "nextQuarter": "Q1 2025",
  "nextQuarterFocus": "foundation building",
  "nextQuarterExpectedGrowth": 25
}
```

**Used by:**
- Summary generation logic (can be template-based with data insertion)
- Summary & Recommendations tab

---

## Data Requirements by Calculation File

### revenue-calculations.ts
**Required Input Data:**
- Monthly/quarterly/yearly projected revenue
- Conservative scenario (minimum)
- Optimistic scenario (maximum)
- Actual to date
- Confidence levels (0-100)
- Historical accuracy score (0-1) - optional
- Volatility coefficient (0-1) - optional

**Data Sources:**
- GET `/api/business/forecasts/revenue-projections`

---

### kpi-calculations.ts
**Required Input Data:**
- Current value (for each of 59 KPIs)
- Target value
- Unit of measurement
- Category classification
- Previous value (for trend calculation)
- Whether it's an inverse metric (lower is better)

**Data Sources:**
- GET `/api/business/forecasts/kpis`

---

### financial-calculations.ts
**Required Input Data for Cash Flow:**
- Monthly cash inflows
- Monthly cash outflows
- Initial cumulative cash balance
- Monthly burn rate estimate

**Required Input Data for P&L:**
- Revenue
- Cost of goods sold (COGS)
- Operating expenses
- Taxes
- Other expenses

**Data Sources:**
- GET `/api/business/forecasts/cash-flow`
- GET `/api/business/forecasts/profit-loss`

---

### customer-segment-calculations.ts
**Required Input Data:**
- Segment name
- Number of units/customers
- Growth rate (%)
- Retention rate (%)
- Average order value
- Seasonality (±%)
- Baseline revenue (previous period)

**Data Sources:**
- GET `/api/business/forecasts/customer-segments`

---

### alert-generation.ts
**Required Input Data:**
- All revenue metrics (from revenue-projections)
- Monthly costs (from profit-loss or separate)
- Customer churn rate
- Cash runway months
- Sales pipeline value
- Current and target margins
- Growth rate trends
- KPI status map

**Data Sources:**
- GET `/api/business/forecasts/alert-metrics` (aggregated)
- Or individual endpoints combined in calculation layer

---

## Current Implementation Status

### ✅ Already Implemented
- `GET /api/business/forecasts/` - Returns BusinessForecastingData (partially)
- `src/lib/api/business-forecasting-service.ts` - Basic API client exists

### ⚠️ Needs Enhancement
- Endpoint data structure should match above specifications
- Add missing fields to API responses
- Ensure all raw data is provided (unprocessed)

### ❌ Not Yet Implemented
1. Dedicated endpoints for each data category
2. Mock data server/responses aligned with above specs
3. Hook integration with calculation layer

---

## Data Transformation Flow

```
API Endpoint
    ↓
Raw Data Response
    ↓
useBusinessForecastingData hook
    ↓
Passes to calculation functions
    ↓
calculateComplete*() returns processed data
    ↓
Hook aggregates and returns to components
    ↓
Component renders with calculated data
```

---

## Implementation Priorities

### Phase 1: Data Structure Alignment
1. Define and document exact API response format
2. Create mock data matching above specifications
3. Test data flow through hook and calculations

### Phase 2: Backend Integration
4. Implement backend endpoints (Django/FastAPI/etc.)
5. Database schema to support data persistence
6. Ensure API returns correctly formatted data

### Phase 3: Frontend Integration
7. Update hook to use new endpoints
8. Integrate calculation functions into transformation
9. Update components to display calculated data

### Phase 4: Testing & Refinement
10. Test with real data volumes
11. Optimize calculation performance
12. Handle edge cases and errors

---

## Notes

- All calculations are **stateless** - same input always produces same output
- API should return **raw data only** - no pre-calculated values
- Each calculation file is **independently testable** with mock data
- Endpoints should support **filtering by period** (month, quarter, year)
- Include **timestamp** on all responses for caching strategy
- Consider pagination for large datasets (multiple years of history)

