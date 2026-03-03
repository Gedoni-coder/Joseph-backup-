# Quick Integration Guide - 3 Pages (⚡ ~15 minutes total)

## What's Already Done For You ✅

- ✅ Tax Compliance API service created
- ✅ Tax Compliance React Query hook created  
- ✅ Tax Compliance adapter hook created
- ✅ Pricing Strategy API service created
- ✅ Pricing Strategy React Query hook created
- ✅ Pricing Strategy adapter hook created
- ✅ Revenue Strategy API service created
- ✅ Revenue Strategy React Query hook created
- ✅ Revenue Strategy adapter hook created

**All you need to do**: Change one import in each page! ⚡

---

## 1️⃣ TaxCompliance Page Integration (2 minutes)

### File: `src/pages/TaxCompliance.tsx`

**Find line 15:**
```typescript
import { useTaxData } from "@/hooks/useTaxData";
```

**Replace with:**
```typescript
import { useTaxDataAPI } from "@/hooks/useTaxDataAPI";
```

**Find line 40 (inside the component):**
```typescript
const {
  calculations,
  recommendations,
  complianceUpdates,
  planningScenarios,
  auditTrail,
  documents,
  reports,
  lastUpdated,
  isLoading,
  error,
  isConnected,
  refreshData,
  updateCalculation,
  implementRecommendation,
  updateComplianceStatus,
  reconnect,
} = useTaxData();
```

**Replace with:**
```typescript
const {
  calculations,
  recommendations,
  complianceUpdates,
  planningScenarios,
  auditTrail,
  documents,
  reports,
  lastUpdated,
  isLoading,
  error,
  isConnected,
  refreshData,
  updateCalculation,
  implementRecommendation,
  updateComplianceStatus,
  reconnect,
} = useTaxDataAPI();
```

✅ **Done!** The page will now fetch real data from your Xano API.

---

## 2️⃣ PricingStrategy Page Integration (2 minutes)

### File: `src/pages/PricingStrategy.tsx`

**Find line 16:**
```typescript
import { usePricingData } from "@/hooks/usePricingData";
```

**Replace with:**
```typescript
import { usePricingDataAPI } from "@/hooks/usePricingDataAPI";
```

**Find line 49 (inside the component):**
```typescript
const {
  strategies,
  competitors,
  tests,
  metrics,
  dynamicPrices,
  isLoading,
  isConnected,
  lastUpdated,
  error,
  refreshData,
} = usePricingData();
```

**Replace with:**
```typescript
const {
  strategies,
  competitors,
  tests,
  metrics,
  dynamicPrices,
  isLoading,
  isConnected,
  lastUpdated,
  error,
  refreshData,
} = usePricingDataAPI();
```

✅ **Done!** The page will now fetch real data from your Xano API.

---

## 3️⃣ RevenueStrategy Page Integration (2 minutes)

### File: `src/pages/RevenueStrategy.tsx`

**Find line 17:**
```typescript
import { useRevenueData } from "@/hooks/useRevenueData";
```

**Replace with:**
```typescript
import { useRevenueDataAPI } from "@/hooks/useRevenueDataAPI";
```

**Find line 50 (inside the component):**
```typescript
const {
  streams: initialStreams,
  scenarios,
  churn,
  upsells,
  metrics,
  discounts,
  channels,
  isLoading,
  isConnected,
  lastUpdated,
  error,
  refreshData,
} = useRevenueData();
```

**Replace with:**
```typescript
const {
  streams: initialStreams,
  scenarios,
  churn,
  upsells,
  metrics,
  discounts,
  channels,
  isLoading,
  isConnected,
  lastUpdated,
  error,
  refreshData,
} = useRevenueDataAPI();
```

✅ **Done!** The page will now fetch real data from your Xano API.

---

## 🧪 Testing (2 minutes)

After making the changes:

### 1. Check TypeScript Compiles
```bash
npm run typecheck
```
You should see no errors.

### 2. Test in Browser
1. Open your app in browser
2. Open DevTools (F12)
3. Go to Network tab
4. Navigate to `/tax-compliance`
5. Look for API calls to `https://x8ki-letl-twmt.n7.xano.io/...`
6. You should see successful 200 responses

### 3. Verify Data Appears
- Tax Compliance page should show "Total Tax Liability"
- Pricing Strategy should show pricing metrics
- Revenue Strategy should show revenue data

### 4. Test Refresh Button
- Click the refresh button on the module header
- Watch Network tab for new API calls
- Data should update

---

## ✅ Completion Checklist

- [ ] Updated TaxCompliance import
- [ ] Updated PricingStrategy import
- [ ] Updated RevenueStrategy import
- [ ] `npm run typecheck` passed
- [ ] App still compiles without errors
- [ ] Tested `/tax-compliance` page - loads and shows data
- [ ] Tested `/pricing-strategies` page - loads and shows data
- [ ] Tested `/revenue-forecasting` page - loads and shows data
- [ ] Network tab shows API calls (not localhost)
- [ ] Refresh buttons work on all pages

---

## 🎉 You're Done!

All three high-priority pages are now integrated with the Xano API!

**Next steps** (if desired):
- See `API_INTEGRATION_SUMMARY.md` for medium-priority integrations
- See `API_INTEGRATION_ROADMAP.md` for complete integration guide
- Check that all pages use real data instead of mock data

---

## 🔍 Troubleshooting

### If you see TypeScript errors:
```
// Make sure the import path is correct:
import { useTaxDataAPI } from "@/hooks/useTaxDataAPI";
                             ^ this path must be exact
```

### If data doesn't appear:
1. Open DevTools → Console
2. Look for red errors
3. Check Network tab for API failures
4. Verify base URL in `src/lib/api/xano-client.ts`

### If you get `cannot find module` errors:
1. Make sure all three adapter hook files exist:
   - `src/hooks/useTaxDataAPI.ts`
   - `src/hooks/usePricingDataAPI.ts`
   - `src/hooks/useRevenueDataAPI.ts`
2. Restart your dev server: `npm run dev`

### If API returns 404:
1. Check that Xano endpoints exist
2. Verify endpoint names in the service files match Xano
3. Check base URL configuration

---

**Time to complete**: ~15-20 minutes  
**Difficulty**: Easy ⚡  
**Result**: 3 Pages with Real API Data ✅
