# API Integration Roadmap

## Overview
This document provides a comprehensive roadmap for integrating Xano APIs with React Query across all application modules.

## ✅ Completed Integrations

### 1. Business Forecasting Module
- **Status**: ✅ COMPLETE
- **Service**: `src/lib/api/business-forecasting-service.ts`
- **Hook**: `src/hooks/useBusinessForecastingData.ts`
- **Page**: `src/pages/BusinessForecast.tsx`
- **Implementation**: 
  - Integrated `useBusinessForecastingData()` hook with React Query
  - Transforms 30+ Xano fields into component-ready structures
  - Returns: customer profiles, revenue projections, KPIs, scenarios

## 📋 API Services Created

### Core Services (Ready for Integration)
1. **Business Forecasting** ✅ 
   - File: `src/lib/api/business-forecasting-service.ts`
   - Endpoints: `/business_forecasting`
   - Functions: `getBusinessForecasts()`, `getBusinessForecast(id)`, create, update, delete

2. **Tax Compliance**
   - File: `src/lib/api/tax-compliance-service.ts`
   - Endpoints: `/tax_compliance`
   - Functions: `getTaxComplianceRecords()`, `getTaxCompliance(id)`, create, update, delete

3. **Pricing Strategy**
   - File: `src/lib/api/pricing-strategy-service.ts`
   - Endpoints: `/pricing_strategy`
   - Functions: `getPricingStrategies()`, `getPricingStrategy(id)`, create, update, delete

4. **Revenue Strategy**
   - File: `src/lib/api/revenue-strategy-service.ts`
   - Endpoints: `/revenue_strategy`
   - Functions: `getRevenueStrategies()`, `getRevenueStrategy(id)`, create, update, delete

5. **Company Profile**
   - File: `src/lib/api/company-profile-service.ts`
   - Endpoints: `/company_profile`

6. **Market Analysis**
   - File: `src/lib/api/market-analysis-service.ts`
   - Endpoints: `/market_analysis`

7. **Risk Management**
   - File: `src/lib/api/risk-management-service.ts`
   - Endpoints: `/risk_management`

8. **Business Feasibility**
   - File: `src/lib/api/business-feasibility-service.ts`
   - Endpoints: `/business_feasibility`

9. **Inventory & Supply Chain**
   - File: `src/lib/api/inventory-supply-chain-service.ts`
   - Endpoints: `/inventory_supply_chain`

10. **Loan & Funding**
    - File: `src/lib/api/loan-funding-service.ts`
    - Endpoints: `/loan_funding`

11. **Financial Advisory**
    - File: `src/lib/api/financial-advisory-service.ts`
    - Endpoints: `/financial_advisory`

12. **Auth Service**
    - File: `src/lib/api/auth-service.ts`
    - Basic authentication endpoints

13. **Accounts Service**
    - File: `src/lib/api/accounts-service.ts`
    - Account management endpoints

## 🔗 React Query Hooks Created

### API-First Hooks (Ready for Use)
1. **useBusinessForecastingData** ✅ COMPLETE
   - File: `src/hooks/useBusinessForecastingData.ts`
   - Returns: customer profiles, revenue projections, KPIs, scenarios
   - Data transformation: Maps Xano fields to component structures

2. **useTaxComplianceAPI** (Ready to integrate)
   - File: `src/hooks/useTaxComplianceAPI.ts`
   - Returns: tax liability, savings, recommendations, compliance updates
   - Status: Created, ready for page integration

3. **usePricingStrategyAPI** (Ready to integrate)
   - File: `src/hooks/usePricingStrategyAPI.ts`
   - Returns: average price, elasticity, position score, strategies
   - Status: Created, ready for page integration

4. **useRevenueStrategyAPI** (Ready to integrate)
   - File: `src/hooks/useRevenueStrategyAPI.ts`
   - Returns: MRR, ACV, CLV, revenue per customer, recommendations
   - Status: Created, ready for page integration

## 📍 Pages Requiring Integration

### High Priority (Core Business Modules)
1. **TaxCompliance** 
   - Current Hook: `useTaxData` (mock data)
   - New Hook: `useTaxComplianceAPI`
   - Status: Ready for integration
   - Effort: Low - hook already created

2. **PricingStrategy**
   - Current Hook: `usePricingData` (mock data)
   - New Hook: `usePricingStrategyAPI`
   - Status: Ready for integration
   - Effort: Low - hook already created

3. **RevenueStrategy**
   - Current Hook: `useRevenueData` (mock data)
   - New Hook: `useRevenueStrategyAPI`
   - Status: Ready for integration
   - Effort: Low - hook already created

### Medium Priority (Secondary Modules)
4. **MarketCompetitiveAnalysis**
   - Current Hooks: `useMarketData`, `useCompetitiveData`
   - Required Services: `market-analysis-service.ts`
   - Status: Service created, needs hooks and page update
   - Effort: Medium

5. **LoanFunding** 
   - Service: `loan-funding-service.ts` ✅ Created
   - Status: Service ready, needs hook and page integration
   - Effort: Medium

6. **InventorySupplyChain**
   - Service: `inventory-supply-chain-service.ts` ✅ Created
   - Status: Service ready, needs hook and page integration
   - Effort: Medium

7. **FinancialAdvisory**
   - Service: `financial-advisory-service.ts` ✅ Created
   - Status: Service ready, needs hook and page integration
   - Effort: Medium

8. **BusinessFeasibility**
   - Service: `business-feasibility-service.ts` ✅ Created
   - Status: Service ready, needs hook and page integration
   - Effort: Medium

9. **RiskManagement**
   - Service: `risk-management-service.ts` ✅ Created
   - Status: Service ready, needs hook and page integration
   - Effort: Medium

### Lower Priority (Dependent/Support Modules)
10. **BusinessPlanning** - Likely aggregates multiple services
11. **GrowthPlanning** - Depends on business forecasting
12. **ComplianceReports** - Uses tax compliance data
13. **PolicyEconomicAnalysis** - Requires new service
14. **Index** (Economic Indicators) - Requires new service
15. Other infrastructure and learning modules

## 🛠️ Integration Pattern (How to Integrate)

### Step 1: Identify the Service and Hook
```
Module: TaxCompliance
Service: tax-compliance-service.ts ✅
Hook: useTaxComplianceAPI.ts ✅
Page: src/pages/TaxCompliance.tsx
```

### Step 2: Update the Page Import
```typescript
// OLD
import { useTaxData } from "@/hooks/useTaxData";

// NEW
import { useTaxComplianceAPI } from "@/hooks/useTaxComplianceAPI";
```

### Step 3: Update the Hook Call
```typescript
// OLD
const {
  calculations,
  recommendations,
  // ... other fields
} = useTaxData();

// NEW
const {
  totalTaxLiability,
  potentialSavings,
  complianceUpdatesCount,
  recommendations,
  // ... other fields
} = useTaxComplianceAPI();
```

### Step 4: Map Data to Components
Update component props to use new data structure. For example:
```typescript
// In the page, update calculations render to use new data
<div>Tax Liability: ${totalTaxLiability}</div>
<div>Potential Savings: ${potentialSavings}</div>
```

## 📊 Data Transformation Pattern

All API hooks follow this pattern:

```typescript
interface TransformedData {
  // Primitive values
  field1: number;
  field2: string;
  // Arrays for component rendering
  items: string[];
  // State management
  isLoading: boolean;
  error: string | null;
  isConnected: boolean;
  lastUpdated: Date;
}

function transformData(apiData: ApiDataType[]): TransformedData {
  if (!data || data.length === 0) {
    return { /* defaults */ };
  }
  const record = data[0];
  return {
    field1: record.api_field_name,
    // ...
    isLoading: false,
    error: null,
    isConnected: true,
    lastUpdated: new Date(),
  };
}
```

## 🚀 Quick Start: Next Steps

### To Complete All Integrations:

1. **Immediate Tasks (Next 1-2 hours)**
   - [ ] Integrate TaxCompliance page (use `useTaxComplianceAPI`)
   - [ ] Integrate PricingStrategy page (use `usePricingStrategyAPI`)
   - [ ] Integrate RevenueStrategy page (use `useRevenueStrategyAPI`)

2. **Follow-up Tasks (2-4 hours)**
   - [ ] Create hook for Market Analysis
   - [ ] Create hook for Risk Management
   - [ ] Create hook for Business Feasibility
   - [ ] Create hook for Inventory/Supply Chain
   - [ ] Create hook for Loan/Funding
   - [ ] Create hook for Financial Advisory
   - [ ] Integrate corresponding pages

3. **Advanced Integration (4+ hours)**
   - [ ] Handle dependent module relationships
   - [ ] Create additional services for remaining modules
   - [ ] Implement cross-module data aggregation
   - [ ] Add error handling and fallbacks
   - [ ] Implement caching strategies
   - [ ] Add data synchronization between modules

## 🔧 Configuration

### Base URL
All services use: `https://x8ki-letl-twmt.n7.xano.io/api:MdDKI7Xp`
Configured in: `src/lib/api/xano-client.ts`

### React Query
- Stale time: 5 minutes (300,000ms)
- Cache time: 10 minutes (600,000ms)
- Retry attempts: 2
- Already configured in `src/App.tsx` with QueryClientProvider

### API Exports
All services exported from: `src/lib/api/index.ts`
Import anywhere: `import { getBusinessForecasts } from "@/lib/api"`

## 📝 Service Features

All services include:
- ✅ TypeScript interfaces with full type safety
- ✅ GET (fetch all), GET (fetch by ID), POST (create), PATCH (update), DELETE operations
- ✅ Proper error handling in xanoRequest wrapper
- ✅ Query parameter support
- ✅ JSON request/response handling
- ✅ Bearer token support (can be added to headers)

## 🔐 Security Considerations

- All API requests go through the Xano client wrapper
- Base URL is centralized for easy switching
- No sensitive data in URLs (uses POST for data)
- Can add authentication headers in xanoRequest

## 📚 File Structure Reference

```
src/
├── lib/
│   └── api/
│       ├── index.ts                    (exports all services)
│       ├── xano-client.ts             (base HTTP client)
│       ├── business-forecasting-service.ts
│       ├── tax-compliance-service.ts
│       ├── pricing-strategy-service.ts
│       ├── revenue-strategy-service.ts
│       ├── market-analysis-service.ts
│       ├── risk-management-service.ts
│       ├── business-feasibility-service.ts
│       ├── inventory-supply-chain-service.ts
│       ├── loan-funding-service.ts
│       ├── financial-advisory-service.ts
│       ├── company-profile-service.ts
│       ├── auth-service.ts
│       └── accounts-service.ts
└── hooks/
    ├── useBusinessForecastingData.ts   (✅ complete)
    ├── useTaxComplianceAPI.ts          (ready to use)
    ├── usePricingStrategyAPI.ts        (ready to use)
    ├── useRevenueStrategyAPI.ts        (ready to use)
    ├── useTaxData.ts                   (old - uses mock)
    ├── usePricingData.ts               (old - uses mock)
    ├── useRevenueData.ts               (old - uses mock)
    ├── useMarketData.ts                (old - uses mock)
    └── useCompetitiveData.ts           (old - uses mock)
```

## 💡 Pro Tips

1. **Keep old hooks temporarily** - Don't delete old hooks immediately; have both available during transition
2. **Test one page at a time** - Integrate and test each page independently
3. **Compare data shapes** - Ensure new hook data matches what components expect
4. **Use React Query DevTools** - Add `@tanstack/react-query-devtools` for debugging
5. **Monitor API calls** - Check network tab to verify API calls are working

## ❓ FAQs

**Q: Do I need to update all pages at once?**
A: No. You can integrate pages gradually. Each service is independent.

**Q: What if the API returns different data than expected?**
A: Update the transformation function in the hook to map Xano fields correctly.

**Q: How do I test if the integration works?**
A: Check browser DevTools network tab to see API calls, use React Query DevTools to inspect cache.

**Q: Can I keep using mock data during transition?**
A: Yes. Both old (mock) and new (API) hooks can coexist temporarily.

**Q: Where do I add authentication?**
A: Update `xanoRequest()` in `xano-client.ts` to add auth headers.

## 🎯 Success Criteria

Integration is successful when:
- ✅ API hook created and uses React Query
- ✅ Page updated to use new hook
- ✅ Data flows correctly to components
- ✅ Loading states work properly
- ✅ Error handling displays correctly
- ✅ Browser network tab shows API calls
- ✅ No TypeScript errors

---

**Last Updated**: January 2026
**Status**: In Progress - 1/14 modules complete
