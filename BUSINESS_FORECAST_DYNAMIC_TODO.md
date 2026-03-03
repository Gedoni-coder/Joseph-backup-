# Business Forecasting Dynamic Implementation - TODO

## Phase 1: Fix Service File
- [ ] 1.1 Update `src/lib/api/business-forecasting-service.ts` to use correct API endpoints
- [ ] 1.2 Add functions for: customer profiles, revenue projections, cost structures, cash flow forecasts, KPIs, scenarios

## Phase 2: Update Hook
- [ ] 2.1 Update `src/hooks/useBusinessForecastingData.ts` to fetch from multiple endpoints
- [ ] 2.2 Implement proper error handling and loading states
- [ ] 2.3 Add mutation functions for CRUD operations

## Phase 3: Test & Verify
- [ ] 3.1 Test API connectivity
- [ ] 3.2 Verify data flow to UI components

## API Endpoints to Use:
```
GET    /api/business/customer-profiles/     - List/Create customer profiles
GET    /api/business/revenue-projections/   - List/Create revenue projections
GET    /api/business/cost-structures/       - List/Create cost structures
GET    /api/business/cash-flow-forecasts/   - List/Create cash flow forecasts
GET    /api/business/kpis/                 - List/Create KPIs
GET    /api/business/scenario-plannings/   - List/Create scenarios
