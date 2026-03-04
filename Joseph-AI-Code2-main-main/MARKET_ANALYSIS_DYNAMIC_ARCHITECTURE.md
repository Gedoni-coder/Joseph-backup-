# Market Analysis Module - Dynamic Architecture Blueprint

## Overview

The Market Analysis module will be fully dynamic with a three-layer architecture:
1. **Data Layer**: APIs/endpoints supplying raw market data
2. **Business Logic Layer**: .ts files containing calculations and analysis formulas
3. **UI Layer**: .tsx components displaying analyzed data

### Data Flow
```
API Endpoints → Raw Data → .ts Analysis Functions → Analyzed Data → .tsx Components (Display)
```

---

## OVERVIEW TAB - Dynamic Components

### 1. Market Size Metrics (TAM, SAM, SOM)
**UI Component**: `src/components/market/market-analysis.tsx`

**Data Structure**:
```
{
  tam: {
    value: 50000000,
    currency: "USD",
    growthRate: 12.5%,
    timeframe: "2025"
  },
  sam: {
    value: 10000000,
    currency: "USD",
    growthRate: 15.2%,
    timeframe: "2025"
  },
  som: {
    value: 1000000,
    currency: "USD",
    growthRate: 25.0%,
    timeframe: "2025"
  }
}
```

**API Endpoint Needed**:
- `GET /api/market/segments/market-size` → Returns TAM/SAM/SOM data

**Business Logic File**: `src/lib/calculations/market-size-calculations.ts`

**Formula Logic**:
```
TAM (Total Addressable Market) = Total market size for the industry
SAM (Serviceable Addressable Market) = TAM × market segment relevance
SOM (Serviceable Obtainable Market) = SAM × company capture potential (0-20% typical)
Market Penetration % = Current Revenue / TAM × 100
Growth Projection = Current Size × (1 + growth_rate/100)
```

---

### 2. Customer Segments Analysis
**Data Structure**:
```
{
  segment: "Enterprise"
  segmentSize: 10000000
  percentageOfTAM: 20%
  avgCustomerValue: 50000
  growthRate: 12.5%
  characteristics: ["High-value", "Needs support"]
  priority: "high"
  penetrationRate: 5%
}
```

**API Endpoint Needed**:
- `GET /api/market/segments` → Returns customer segment data

**Business Logic File**: `src/lib/calculations/market-segment-calculations.ts`

**Formula Logic**:
```
segmentSize = TAM × segment_percentage
percentageOfTAM = (segmentSize / TAM) × 100
estimatedCustomers = segmentSize / avgCustomerValue
penetrationRate = estimatedCustomers / market_saturation × 100
projectedRevenue = segmentSize × penetrationRate / 100
```

---

### 3. Market Trends & Dynamics
**Data Structure**:
```
{
  id: "trend-1"
  category: "Technology"
  trend: "Cloud adoption increasing"
  direction: "positive"
  impact: "high"
  confidence: 85%
  description: "..."
  timeframe: "2025"
  sources: ["industry_report", "analyst"]
}
```

**API Endpoint Needed**:
- `GET /api/market/trends` → Returns market trend data

**Business Logic File**: `src/lib/calculations/market-trend-calculations.ts`

**Formula Logic**:
```
trendImpactScore = impact_level × confidence / 100
riskLevel = determineByDirection(positive=opportunity, negative=threat)
trendVelocity = rate_of_change / timeframe
businessRelevance = correlation_to_business_model × 100
```

---

### 4. Demand Forecasting
**Data Structure**:
```
{
  product: "Product A"
  currentDemand: 50000
  forecastedDemand: 75000
  growthForecast: 50%
  timeframe: "2025"
  confidence: "High"
  scenarios: [
    { name: "Best Case", value: 100000, probability: 25% },
    { name: "Base Case", value: 75000, probability: 50% },
    { name: "Conservative", value: 60000, probability: 25% }
  ]
}
```

**API Endpoint Needed**:
- `GET /api/market/demand-forecasts` → Returns demand forecast data

**Business Logic File**: `src/lib/calculations/demand-forecast-calculations.ts`

**Formula Logic**:
```
forecastedDemand = currentDemand × (1 + growth_forecast/100)
growthRate = ((forecastedDemand - currentDemand) / currentDemand) × 100
scenarioWeightedAverage = sum(scenario_value × scenario_probability)
forecastAccuracy = historical_accuracy_rate × 100
demandVelocity = (forecastedDemand - currentDemand) / months
```

---

### 5. Industry Challenges & Opportunities
**Data Structure**:
```
{
  id: "opp-1"
  type: "opportunity" | "challenge"
  title: "AI market expansion"
  description: "..."
  impact: "high" | "medium" | "low"
  probability: 75%
  timeframe: "2025"
  actionItems: ["Research market", "Develop strategy"]
  relatedTrends: ["trend-1", "trend-3"]
}
```

**API Endpoint Needed**:
- `GET /api/market/insights` → Returns opportunity and challenge data

**Business Logic File**: `src/lib/calculations/industry-insight-calculations.ts`

**Formula Logic**:
```
opportunityScore = impact_level × probability / 100
urgencyLevel = (probability / 100) × impact_weight
potentialRevenue = market_size × capture_potential
riskScore = similar_calculation_for_threats
actionPriorityRank = (score × urgency × business_fit) score
```

---

## COMPETITIVE ANALYSIS TAB - Dynamic Components

### 6. Competitor Identification & Tracking
**Data Structure**:
```
{
  id: "comp-1"
  name: "Competitor A"
  marketShare: 15%
  positionScore: 8.5
  strengths: ["Strong brand", "Wide distribution"]
  weaknesses: ["High cost", "Limited innovation"]
  products: ["Product 1", "Product 2"]
  pricing: "Premium"
  marketPosition: "Market Leader"
}
```

**API Endpoint Needed**:
- `GET /api/market/competitors` → Returns competitor data

**Business Logic File**: `src/lib/calculations/competitor-calculations.ts`

**Formula Logic**:
```
marketShare = competitor_revenue / total_market × 100
competitivePosition = (market_share × 0.3) + (customer_satisfaction × 0.3) + (innovation_score × 0.4)
strengthCount = count(identified_strengths)
weaknessCount = count(identified_weaknesses)
threatLevel = (competitor_market_share × growth_rate) / company_market_share
```

---

### 7. SWOT Analysis
**Data Structure**:
```
{
  competitorId: "comp-1"
  strengths: [
    { item: "Brand recognition", impact: "high" },
    { item: "Distribution network", impact: "high" }
  ],
  weaknesses: [
    { item: "High operating costs", impact: "medium" },
    { item: "Limited innovation", impact: "high" }
  ],
  opportunities: [
    { item: "Emerging markets", probability: 75% },
    { item: "New product categories", probability: 60% }
  ],
  threats: [
    { item: "Market disruption", probability: 40% },
    { item: "New regulations", probability: 30% }
  ]
}
```

**Business Logic File**: `src/lib/calculations/swot-calculations.ts`

**Formula Logic**:
```
swotScore = (strength_count × strength_weight) - (weakness_count × weakness_weight) + 
           (opportunity_count × opportunity_weight) - (threat_count × threat_weight)
overallPosition = determine_by_net_score (Strong/Neutral/Weak)
competitiveAdvantage = sum(unique_strengths) / competitor_count
riskExposure = sum(threats_probability) × average_impact
```

---

### 8. Competitive Positioning
**Data Structure**:
```
{
  dimension: "Price vs Quality"
  competitors: [
    { name: "Our Company", position: 6.5 },
    { name: "Competitor A", position: 7.8 },
    { name: "Competitor B", position: 5.2 }
  ]
}
```

**Business Logic File**: Same as competitor-calculations.ts

**Formula Logic**:
```
competitiveGap = our_position - leader_position
relativeStrength = our_position / average_competitor_position × 100
marketOpportunity = underserved_market_segments
positioningStrategy = optimal_position - current_position
```

---

### 9. Threat Assessment
**Data Structure**:
```
{
  id: "threat-1"
  threat: "New market entrant with VC funding"
  likelihood: 60%
  impact: "high"
  timeframe: "2025"
  mitigationStrategy: "..."
  severity: "high" | "medium" | "low"
}
```

**Business Logic File**: `src/lib/calculations/threat-assessment-calculations.ts`

**Formula Logic**:
```
threatRiskScore = likelihood × impact_weight
exposureLevel = threatRiskScore × business_dependency
mitigationPriority = threatRiskScore × urgency
contingencyNeed = determine_by_risk_score
riskMonitoringFrequency = inverse(months_to_materialise)
```

---

## STRATEGY & ADVANTAGES TAB - Dynamic Components

### 10. Competitive Advantages Analysis
**Data Structure**:
```
{
  advantage: "Superior technology"
  defensibility: "high"
  duration: 3
  competitiveGap: 4.2
  differentiation: 85%
  sustainability: "medium"
}
```

**Business Logic File**: `src/lib/calculations/advantage-calculations.ts`

**Formula Logic**:
```
advantageScore = (defensibility_score × 0.4) + (differentiation × 0.3) + (duration × 0.3)
competitiveGap = our_capability - competitor_best × 100
sustainabilityPeriod = months_until_parity / 12
valueProposition = sum(advantage_scores) / advantage_count
```

---

### 11. Market Positioning Strategy
**Data Structure**:
```
{
  strategy: "Premium positioning"
  targetSegment: "Enterprise"
  differentiation: "Superior support & integration"
  pricePosition: "Premium (20% above average)"
  marketShare_Target: 12%
  timeframe: "2025"
}
```

**Business Logic File**: Same as advantage-calculations.ts

**Formula Logic**:
```
strategyAlignment = sum(all_strategy_metrics) / metric_count × 100
marketFitScore = segment_TAM × capture_potential × company_capability
revenueTarget = segment_TAM × capture_potential
strategyRisk = sum(execution_challenges) × complexity
feasibilityScore = resource_availability × capability_match × timeline_fit
```

---

## SUMMARY & RECOMMENDATIONS TAB - Dynamic Components

### 12. Market Summary
**Data Structure**: Narrative summary based on:
- Total addressable market
- Number of segments
- Key trends
- Top competitors
- Market opportunities
- Next quarter forecast

**Business Logic File**: `src/lib/calculations/market-summary-calculations.ts`

**Formula Logic**:
```
marketHealthScore = (TAM_growth × 0.3) + (trend_momentum × 0.3) + (opportunity_count × 0.2) + (threat_mitigation × 0.2)
marketMomentum = (positive_trends - negative_trends) / total_trends × 100
competitiveIntensity = competitor_count × average_market_share_concentration
nextQuarterOutlook = weighted_forecast(demand_trends, competitive_actions, company_initiatives)
```

---

### 13. Market Recommendations
**Data Structure**: Strategic recommendations based on:
- Market analysis
- Competitive positioning
- Opportunity assessment
- Resource constraints

**Business Logic File**: Same as market-summary-calculations.ts

**Formula Logic**:
```
recommendationPriority = (opportunity_score × feasibility) / implementation_cost
expectedROI = (projected_revenue - investment) / investment × 100
riskAdjustedReturn = expectedROI × (1 - risk_probability)
implementationTimeline = sum(task_durations)
```

---

## API Endpoints Summary

All endpoints should follow REST convention and return JSON:

| Endpoint | Method | Returns |
|----------|--------|---------|
| `/api/market/segments/market-size` | GET | TAM/SAM/SOM metrics |
| `/api/market/segments` | GET | Customer segment data |
| `/api/market/trends` | GET | Market trends and dynamics |
| `/api/market/demand-forecasts` | GET | Demand forecast data |
| `/api/market/insights` | GET | Challenges and opportunities |
| `/api/market/competitors` | GET | Competitor information |
| `/api/market/swot` | GET | SWOT analysis data |
| `/api/market/threats` | GET | Threat assessment data |
| `/api/market/positioning` | GET | Competitive positioning data |

---

## Implementation Layer Files

### New Business Logic Files to Create

1. `src/lib/calculations/market-size-calculations.ts`
   - TAM, SAM, SOM calculations
   - Market penetration analysis
   - Growth projections

2. `src/lib/calculations/market-segment-calculations.ts`
   - Segment sizing
   - Customer value calculations
   - Penetration rate analysis

3. `src/lib/calculations/market-trend-calculations.ts`
   - Trend impact assessment
   - Risk/opportunity scoring
   - Trend velocity calculation

4. `src/lib/calculations/demand-forecast-calculations.ts`
   - Demand projections
   - Scenario analysis
   - Forecast accuracy

5. `src/lib/calculations/industry-insight-calculations.ts`
   - Opportunity scoring
   - Challenge assessment
   - Action priority ranking

6. `src/lib/calculations/competitor-calculations.ts`
   - Competitor positioning
   - Market share analysis
   - Threat level assessment

7. `src/lib/calculations/swot-calculations.ts`
   - SWOT scoring
   - Competitive advantage analysis
   - Position determination

8. `src/lib/calculations/threat-assessment-calculations.ts`
   - Risk scoring
   - Mitigation priority
   - Contingency planning

9. `src/lib/calculations/advantage-calculations.ts`
   - Competitive advantage scoring
   - Defensibility analysis
   - Value proposition measurement

10. `src/lib/calculations/market-summary-calculations.ts`
    - Market health scoring
    - Summary narrative generation
    - Recommendation logic

### Updated Hook Files

- `src/hooks/useMarketAnalysisAPI.ts`
  - Integrate calculation functions
  - Transform API data through calculations
  - Return calculated metrics to components

- `src/hooks/useCompetitiveDataAPI.ts`
  - Integrate competitive analysis calculations
  - Transform competitor data
  - Return scoring and analysis

---

## Data Flow Example: Market Size Calculation

```
1. User views Overview tab
   ↓
2. Component requests market data from hook
   ↓
3. Hook calls API: GET /api/market/segments/market-size
   ↓
4. API returns:
   {
     "tam": 50000000,
     "tam_growth_rate": 12.5,
     "sam_percentage": 20,
     "som_percentage": 10
   }
   ↓
5. Hook passes to market-size-calculations.ts:
   - calculateSAM(50000000, 20)
   - calculateSOM(10000000, 10)
   - calculatePenetrationRate(current_revenue, 50000000)
   ↓
6. Calculations return:
   {
     "tam": 50000000,
     "sam": 10000000,
     "som": 1000000,
     "penetrationRate": 2.5,
     "growth": 12.5
   }
   ↓
7. Hook combines and passes to component
   ↓
8. Component renders formatted cards with:
   - TAM: $50M
   - SAM: $10M
   - SOM: $1M
   - Growth: 12.5%
```

---

## Phase Implementation Order

### Phase 1: Foundation (Calculation Layer)
1. Create all 10 calculation files
2. Add all necessary formulas
3. Test with mock data

### Phase 2: Integration (Hook & API)
4. Update hooks to use calculation files
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

---

## Success Criteria

- All 13 components in tabs are fully dynamic
- Every number displayed has a corresponding formula
- Data flows seamlessly from API → calculations → UI
- No hardcoded values (except defaults/fallbacks)
- All metrics update when input data changes
- Competitive positions, threat scores, opportunities all calculated
- All calculations are testable and documented

