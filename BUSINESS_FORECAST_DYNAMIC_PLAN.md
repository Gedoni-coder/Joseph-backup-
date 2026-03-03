# Business Forecasting Module - Dynamic Implementation Plan

## Current State Analysis

### What Currently Uses Hardcoded Data:
1. **Revenue Targets Modal** - Saved to localStorage only (not synced to API)
2. **Customer Profiles** - Hardcoded in `business-forecast-data.ts`
3. **Revenue Projections** - Hardcoded in `business-forecast-data.ts`
4. **KPIs** - Hardcoded in `business-forecast-data.ts` (50+ KPIs)
5. **Scenario Planning** - Partially hardcoded
6. **Cost Structure** - Hardcoded in `business-forecast-data.ts`
7. **Cash Flow Forecast** - Hardcoded in `business-forecast-data.ts`
8. **Quick Stats Cards** - Use data from hook but some fallback to defaults

### Files Involved:
- `src/pages/BusinessForecast.tsx` - Main page
- `src/hooks/useBusinessForecastingData.ts` - Data hook
- `src/lib/api/business-forecasting-service.ts` - API service (already exists)
- `src/lib/business-forecast-data.ts` - Mock data (needs to be replaced)
- `src/lib/business-forecast-content.ts` - Static content strings
- `src/components/business/revenue-targets-modal.tsx` - Modal component

---

## Implementation Plan

### Phase 1: API Integration (Priority: HIGH)
- [ ] Update `useBusinessForecastingData` hook to fetch from Django API
- [ ] Replace mock data imports with API calls
- [ ] Add proper loading states and error handling
- [ ] Implement reconnection logic for failed API calls

### Phase 2: Revenue Targets (Priority: HIGH)
- [ ] Save revenue targets to API instead of localStorage only
- [ ] Load revenue targets from API on page load
- [ ] Sync modal to work with API

### Phase 3: Dynamic Data Components (Priority: MEDIUM)
- [ ] Make Customer Profiles section dynamic from API
- [ ] Make Revenue Projections section dynamic from API
- [ ] Make KPIs section dynamic from API
- [ ] Make Scenario Planning section dynamic from API
- [ ] Make Cost Structure section dynamic from API
- [ ] Make Cash Flow Forecast section dynamic from API

### Phase 4: UI Enhancements (Priority: MEDIUM)
- [ ] Add inline editing for editable fields
- [ ] Add "Add New" buttons for creating records
- [ ] Add delete functionality with confirmation
- [ ] Add export to PDF/Excel options

### Phase 5: Offline Support (Priority: LOW)
- [ ] Cache API responses
- [ ] Show cached data when offline
- [ ] Sync changes when back online

---

## API Endpoints Required:

```
GET    /api/business/forecasts/          - List all forecasts
POST   /api/business/forecasts/           - Create new forecast
GET    /api/business/forecasts/{id}/     - Get single forecast
PATCH  /api/business/forecasts/{id}/     - Update forecast
DELETE /api/business/forecasts/{id}/     - Delete forecast
```

---

## Key Changes Summary:

| Component | Current | Target |
|-----------|---------|--------|
| Revenue Targets | localStorage | API + localStorage fallback |
| Customer Profiles | Hardcoded | API |
| Revenue Projections | Hardcoded | API |
| KPIs | Hardcoded (50+) | API |
| Scenarios | Hardcoded | API |
| Cost Structure | Hardcoded | API |
| Cash Flow | Hardcoded | API |
| Data Refresh | Manual button | Auto-refresh + manual |
