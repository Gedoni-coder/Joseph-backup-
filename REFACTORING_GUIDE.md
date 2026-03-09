# Application Data-Structure Separation Refactoring

## Overview

**Goal**: Separate all hardcoded information from UI structure components. Every page should have its data in mock data files, not embedded in JSX.

**Principle**: Data flows INTO structures (components), not WITHIN them.

## Completed Modules ✅

### 1. ImpactCalculator (src/pages/ImpactCalculator.tsx)

**Data File Created**: `src/lib/impact-scenarios.ts`

**What Was Extracted**:

- Default policy inputs (10 variables)
- Default economic inputs (10 variables)
- Policy scenarios array (3 templates with full input objects)
- Economic scenarios array (3 templates with full input objects)
- Sector options list
- Reputational impact options list

**Pattern Used**:

```typescript
// Create constants and interfaces in data file
export const DEFAULT_POLICY_INPUTS: PolicyInputs = { ... }
export const POLICY_SCENARIOS: Scenario<PolicyInputs>[] = [ ... ]

// Import and use in component
import { DEFAULT_POLICY_INPUTS, POLICY_SCENARIOS } from '@/lib/impact-scenarios'
const [inputs, setInputs] = useState(DEFAULT_POLICY_INPUTS)
```

---

### 2. BusinessForecast (src/pages/BusinessForecast.tsx)

**Data File Created**: `src/lib/business-forecast-content.ts`

**What Was Extracted**:

- Annual Revenue Target constant ($13.7M)
- Summary section narrative (5 sections)
- Recommendation section narrative (5 sections)
- Default action items (5 items with properties)
- Default next steps (4 items)
- Growth trajectory quarters (Q1-Q4 with descriptions)
- Summary metrics generator function

**Pattern Used**:

```typescript
// Content generators for dynamic data integration
export const getSummaryContent = (customerCount, scenarioCount, kpiCount) =>
  `1. REVENUE OVERVIEW\nCurrent revenue target...(computed values)`

export const getSummaryMetrics = (count1, count2, count3) => [
  { index: 1, title: "...", value: count1, insight: "..." },
  ...
]
```

---

### 3. Index / Economic Indicators (src/pages/Index.tsx)

**Data File Created**: `src/lib/economic-content.ts`

**What Was Extracted**:

- Market alerts (3 cards with type, title, message)
- Key takeaways (3 items with sentiment and text)
- Economic outlook (summary, risk assessment, confidence)
- Footer content (copyright, update frequency, data sources)
- Color style mappings for alerts
- Sentiment color mappings for takeaways

**Pattern Used**:

```typescript
// Map over imported data arrays
{MARKET_ALERTS.map((alert) => (
  <AlertCard key={alert.id} alert={alert} />
))}

// Use imported string constants
<p>{ECONOMIC_OUTLOOK.summary}</p>
```

---

## Refactoring Pattern Established

### Step-by-Step Pattern:

1. **Identify Hardcoded Content**

   - Scan JSX for literal strings, numbers, objects
   - Look for content that could be dynamic or localized
   - Find lists hardcoded as individual JSX elements

2. **Create Data File** (e.g., `src/lib/MODULE-content.ts`)

   ```typescript
   // 1. Export interfaces/types
   export interface AlertItem { ... }

   // 2. Export constants
   export const ALERTS: AlertItem[] = [ ... ]

   // 3. Export generators for computed content
   export const getContent = (param1, param2) => { ... }

   // 4. Export style/color mappings
   export const STYLE_MAP = { ... }
   ```

3. **Update Component**

   ```typescript
   // 1. Import data file
   import { ALERTS, getContent, STYLE_MAP } from '@/lib/MODULE-content'

   // 2. Remove hardcoded values
   // REMOVE: const alerts = [{ id: 1, ...}, { id: 2, ...}]

   // 3. Use imported data
   {ALERTS.map((alert) => ( ... ))}
   ```

---

## Remaining Modules (9 remaining)

### 4. PricingStrategy

**File to Create**: `src/lib/pricing-content.ts`

**Hardcoded Content to Extract**:

- "Market Premium: 8-12%" metric (search: "8-12%")
- Strategy titles and descriptions
- Long summary/recommendation copy blocks
- Pricing model comparisons table data

**Tasks**:

1. `grep -n "8-12\|Market Premium" src/pages/PricingStrategy.tsx`
2. Create `src/lib/pricing-content.ts` with all extracted data
3. Update component imports and JSX

---

### 5. RevenueStrategy

**File to Create**: `src/lib/revenue-content.ts`

**Hardcoded Content to Extract**:

- "$XXM" placeholders (unfinished values)
- Long narrative sections (summary/recommendation text)
- Revenue stream descriptions
- Churn analysis copy
- Upsell opportunity descriptions

---

### 6. FinancialAdvisory

**File to Create**: `src/lib/financial-advisory-content.ts`

**Hardcoded Content to Extract**:

- Notification items (Budget Alert, Cash Flow Update)
- Advice/recommendations items
- Budget validation rules/messages
- Risk assessment descriptions
- Long narrative copy blocks

---

### 7. MarketCompetitiveAnalysis

**File to Create**: `src/lib/market-content.ts` (extend existing if exists)

**Hardcoded Content to Extract**:

- TAM breakdown narratives
- Competitive positioning descriptions
- Market trend summaries
- Strategy recommendation copy
- Summary and recommendation text blocks

---

### 8. TaxCompliance

**Status**: Mostly data-driven via hooks

**Action**: Verify `src/lib/tax-compliance-data.ts` contains:

- Mock calculations
- Mock recommendations
- Mock scenarios
- Mock documents
- Mock audit trails

If any of these are still hardcoded in component, extract to data file.

---

### 9. BusinessFeasibility

**File to Create**: `src/lib/feasibility-config.ts`

**Hardcoded Content to Extract**:

- Storage key constant
- NPV thresholds (if hardcoded)
- Scoring weights/formulas
- Input validation rules
- Tip/help text

---

### 10. BusinessPlanning

**File to Create**: `src/hooks/usePlans.ts` (hook wrapper)

**Action**: Create custom hook to abstract localStorage access:

```typescript
export const usePlans = () => {
  const STORAGE_KEY = 'business-plans'

  return {
    plans: getPans(),
    addPlan: (plan) => { ... },
    updatePlan: (id, plan) => { ... },
    deletePlan: (id) => { ... },
  }
}
```

---

### 11. LoanFunding

**Status**: Appears mostly data-driven via hooks

**Action**: Verify `src/lib/loan-data.ts` contains all mock data:

- Loan eligibility objects
- Funding options
- Investor matches
- Application status steps

Extract any remaining hardcoded content.

---

### 12. InventorySupplyChain

**File to Create**: `src/lib/inventory-content.ts`

**Hardcoded Content to Extract**:

- Section labels (Stock, Demand, Valuation, etc.)
- "Advanced Analytics Coming Soon" copy
- Placeholder descriptions
- Tab navigation labels
- Status indicator messages

---

## Quick Reference: Files to Create

```
src/lib/
├── impact-scenarios.ts                 ✅ DONE
├── business-forecast-content.ts        ✅ DONE
├── economic-content.ts                 ✅ DONE
├── pricing-content.ts                  (TODO)
├── revenue-content.ts                  (TODO)
├── financial-advisory-content.ts       (TODO)
├── market-content.ts                   (TODO: extend existing)
├── tax-compliance-content.ts           (TODO: if needed)
├── feasibility-config.ts               (TODO)
├── inventory-content.ts                (TODO)
└── (verify loan-data.ts is complete)

src/hooks/
├── usePlans.ts                         (TODO: new hook)
```

---

## Testing the Refactoring

**How to Verify Data Separation Works**:

1. **No Hardcoded Values in JSX**

   ```bash
   # Should return empty or only class/tag names
   grep -n "const.*=.*\[{" src/pages/ModuleName.tsx
   ```

2. **All Data in Files**

   ```bash
   ls -la src/lib/*-content.ts src/lib/*-config.ts
   ```

3. **Components Import and Use Data**

   ```bash
   grep -n "import.*from.*lib" src/pages/ModuleName.tsx
   ```

4. **Data Flows Through Props or State**
   ```bash
   grep -n "map\|Object.entries\|IMPORTED_CONSTANT" src/pages/ModuleName.tsx
   ```

---

## Key Principles to Remember

✅ **DO**:

- Extract all textual content, metrics, options
- Create reusable data structures
- Use functions for computed/templated content
- Keep data files organized by concern
- Use TypeScript interfaces for type safety
- Map/render imported arrays dynamically

❌ **DON'T**:

- Hardcode literal values in JSX
- Duplicate data across files
- Mix layout logic with data definitions
- Use magic strings or numbers
- Have data live only in component state

---

## Next Steps for Continuation

**Option 1: Continue with Assistant**

- I can systematically complete remaining modules
- Follow the established pattern for each
- Verify consistency across all 12 modules

**Option 2: Self-Complete**

- Use this guide to follow the pattern
- Each module follows the same 3-step process
- Can be done in parallel or sequentially

**Option 3: Hybrid**

- You pick which modules to tackle
- I assist with refactoring

---

## Summary of Impact

**Before Refactoring**:

- Data mixed throughout components
- Hard to test or reuse values
- Difficult to localize or update copy
- No single source of truth

**After Refactoring**:

- All data in dedicated files
- Easy to test, modify, or extend
- Ready for localization/CMS integration
- Clean separation of concerns
- Component code focused on UI logic only

This is a **foundational improvement** that makes the entire application more maintainable and scalable!
