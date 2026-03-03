# Mock Data Refactoring Guide

## Overview
This document provides a comprehensive guide for extracting hardcoded data from all 12 modules and moving it to a centralized mock data structure.

## Pattern Summary

### What to Keep (Hardcoded in Components)
- **Tags**: Category types, status types, priority levels (e.g., "forecast", "alert", "high", "medium", "low")
- **Sub-tags**: Fields like type, category, priority that organize data (hardcoded patterns)
- **UI Structure**: Component layout, styling patterns, conditional rendering logic

### What to Move (to Mock Files)
- **Data Values**: Actual names, numbers, descriptions, amounts
- **Content**: User-facing text, labels, instructions
- **Configurations**: Numeric thresholds, default values, formatting rules

## Completed Tasks ✅

### 1. Created Mock Data Files

#### Module-Specific Mocks:
- `src/mocks/economic-indicators.ts` - Module 1
- `src/mocks/business-forecast.ts` - Module 2
- `src/mocks/impact-calculator.ts` - Module 3
- `src/mocks/pricing-strategy.ts` - Module 4
- `src/mocks/revenue-strategy.ts` - Module 5
- `src/mocks/financial-advisory.ts` - Module 6
- `src/mocks/tax-compliance.ts` - Module 8
- `src/mocks/business-feasibility.ts` - Module 9
- `src/mocks/business-planning.ts` - Module 10
- `src/mocks/loan-funding.ts` - Module 11
- `src/mocks/inventory-supply-chain.ts` - Module 12

#### Shared UI Mocks:
- `src/mocks/notifications.ts` - Notification objects
- `src/mocks/module-labels.ts` - UI labels for all modules

### 2. Updated Components

#### Fully Updated:
- ✅ `src/pages/Notifications.tsx` - Uses MOCK_NOTIFICATIONS
- ✅ `src/pages/Index.tsx` - Uses ECONOMIC_CONTEXT_CONFIG and related constants
- ✅ `src/pages/BusinessForecast.tsx` - Uses KEY_ASSUMPTIONS, COMPETITIVE_METRICS

## Remaining Tasks

### Data to Move to Mocks (by Module)

#### Module 3: Impact Calculator (`src/pages/ImpactCalculator.tsx`)
**Current Hardcoded Data:**
- Form field labels (30+) for policy/economic impact scenarios
- Scenario template definitions
- Calculation delay time (2500ms)

**Action:**
```typescript
import { 
  POLICY_IMPACT_FIELDS, 
  ECONOMIC_IMPACT_FIELDS,
  SCENARIO_TEMPLATES,
  CALCULATION_CONFIG 
} from "@/mocks/impact-calculator";

// Replace hardcoded field labels with:
{POLICY_IMPACT_FIELDS.map(field => (...))}
```

#### Module 4: Pricing Strategy (`src/pages/PricingStrategy.tsx`)
**Current Hardcoded Data:**
- Pricing strategy definitions
- Active price test data
- Competitor pricing data

**Action:**
```typescript
import { 
  PRICING_STRATEGIES,
  ACTIVE_PRICE_TESTS,
  COMPETITOR_PRICING 
} from "@/mocks/pricing-strategy";
```

#### Module 5: Revenue Strategy (`src/pages/RevenueStrategy.tsx`)
**Current Hardcoded Data:**
- Revenue stream names and values
- Customer segment definitions
- Upsell opportunities
- Sales channel data

**Action:**
```typescript
import { 
  REVENUE_STREAMS,
  CUSTOMER_SEGMENTS,
  UPSELL_OPPORTUNITIES,
  SALES_CHANNELS 
} from "@/mocks/revenue-strategy";
```

#### Module 6: Financial Advisory & Planning (`src/pages/FinancialAdvisory.tsx`)
**Current Hardcoded Data:**
- Notifications badge count (currently "2")
- Expert advice recommendations
- Financial planning templates

**Action:**
```typescript
import { 
  DEFAULT_NOTIFICATIONS,
  EXPERT_ADVICE,
  FINANCIAL_PLANNING_TEMPLATES 
} from "@/mocks/financial-advisory";

// Make badge count dynamic:
<Badge>{DEFAULT_NOTIFICATIONS.length}</Badge>
```

#### Module 7: Market & Competitive Analysis (`src/pages/MarketCompetitiveAnalysis.tsx`)
**Current Status:** Mostly using hooks for data, needs display label consolidation
**Action:**
```typescript
import { MODULE_LABELS } from "@/mocks/module-labels";
// Use MODULE_LABELS.marketCompetitiveAnalysis for UI text
```

#### Module 8: Tax Compliance (`src/pages/TaxCompliance.tsx`)
**Current Hardcoded Data:**
- Tax liability items with amounts and dates
- Tax filing forms and deadlines
- Compliance checklist items
- Currency/locale settings (currently hardcoded to USD)

**Action:**
```typescript
import { 
  TAX_LIABILITIES,
  TAX_FILINGS,
  COMPLIANCE_CHECKLIST,
  CURRENCY_CONFIG,
  TAX_OPTIMIZATION_TIPS 
} from "@/mocks/tax-compliance";

// Update footer year dynamically
<span>© {new Date().getFullYear()} Tax & Compliance Platform</span>
```

#### Module 9: Business Feasibility (`src/pages/BusinessFeasibility.tsx`)
**Current Hardcoded Data:**
- Algorithm thresholds and defaults by mode (conservative, safe, wild)
- AI system prompt template
- Storage key (localized to v1)
- Stop words for keyword extraction

**Action:**
```typescript
import { 
  FEASIBILITY_MODES,
  FEASIBILITY_DEFAULTS,
  AI_SYSTEM_PROMPT_TEMPLATE,
  BUSINESS_FEASIBILITY_STORAGE_KEY,
  FEASIBILITY_KEYWORDS 
} from "@/mocks/business-feasibility";

// Update thresholds:
const currentMode = FEASIBILITY_MODES[mode];
const feasibleThreshold = currentMode.feasibleThreshold;

// Use centralized storage key:
localStorage.getItem(BUSINESS_FEASIBILITY_STORAGE_KEY)
```

#### Module 10: Business Planning (`src/pages/BusinessPlanning.tsx`)
**Current Hardcoded Data:**
- Plan templates
- Plan sections and guidance text
- Default plan name
- Storage key

**Action:**
```typescript
import { 
  PLAN_TEMPLATES,
  PLAN_SECTIONS,
  PLAN_GUIDANCE,
  BUSINESS_PLANNING_STORAGE_KEY 
} from "@/mocks/business-planning";
```

#### Module 11: Loan Funding (`src/pages/LoanFunding.tsx`)
**Current Hardcoded Data:**
- Loan product definitions
- Investor profiles
- Grant programs
- Currency formatting thresholds
- Locale/currency (hardcoded "en-US", "USD")

**Critical Issue:** "E-buy" company name hardcoded in module description

**Action:**
```typescript
import { 
  LOAN_PRODUCTS,
  INVESTOR_PROFILES,
  GRANT_PROGRAMS,
  CURRENCY_FORMATTING,
  LOCALE_CONFIG 
} from "@/mocks/loan-funding";

// Replace hardcoded "E-buy expansion":
description={`Funding and loan options to support ${companyName} expansion`}

// Use centralized currency formatting:
function formatCurrency(value) {
  if (value >= CURRENCY_FORMATTING.millions) {
    return (value / CURRENCY_FORMATTING.millions).toFixed(1) + CURRENCY_FORMATTING.millions_suffix;
  }
  // ... more logic
}
```

#### Module 12: Inventory & Supply Chain (`src/pages/InventorySupplyChain.tsx`)
**Current Hardcoded Data:**
- Inventory status mappings (in-stock, low-stock, out-of-stock, overstock)
- Inventory items list
- Supplier information
- Risk alerts and thresholds
- Supply chain metrics

**Critical Issue:** Risk threshold hardcoded to "20" (magic number)

**Action:**
```typescript
import { 
  INVENTORY_STATUSES,
  INVENTORY_ITEMS,
  SUPPLIERS,
  RISK_ALERTS,
  INVENTORY_CONFIG,
  SUPPLY_CHAIN_METRICS 
} from "@/mocks/inventory-supply-chain";

// Use centralized risk threshold:
const isHighRisk = riskScore > INVENTORY_CONFIG.riskThreshold;
```

## Implementation Steps

### Step 1: Choose a Module
Pick one of the remaining modules to refactor.

### Step 2: Import Mock Data
Add import statement at the top of the component file:
```typescript
import { MOCK_DATA_1, MOCK_DATA_2 } from "@/mocks/[module-name]";
```

### Step 3: Replace Hardcoded Values
Search for hardcoded strings/numbers and replace with mock data:
```typescript
// Before:
const items = [
  { name: "Item 1", value: 100 },
  { name: "Item 2", value: 200 },
];

// After:
const items = MOCK_ITEMS;
```

### Step 4: Use Dynamic Rendering
For lists, use `.map()` instead of static JSX:
```typescript
// Before:
<div>{items[0].name}</div>
<div>{items[1].name}</div>

// After:
{items.map(item => (
  <div key={item.id}>{item.name}</div>
))}
```

### Step 5: Update Dependencies
If the module uses hooks or other dependencies, ensure they still work correctly with the mock data.

### Step 6: Test
Verify the module displays correctly with the mock data.

## Important Considerations

### 1. Storage Keys
Modules 9 and 10 use localStorage keys. These are now centralized:
```typescript
// Use from mocks:
BUSINESS_FEASIBILITY_STORAGE_KEY: "joseph_feasibility_ideas_v1"
BUSINESS_PLANNING_STORAGE_KEY: "joseph_business_plans_v1"
```

### 2. Dynamic Content
Some components need dynamic values (company name, dates, etc.):
```typescript
// Dynamic company name:
description.replace("{companyName}", companyName)

// Dynamic copyright year:
`© ${new Date().getFullYear()} Platform Name`

// Dynamic notification count:
<Badge>{DEFAULT_NOTIFICATIONS.length}</Badge>
```

### 3. Locale and Currency
Modules 8, 11, and 12 have locale/currency hardcoding. Use centralized configs:
```typescript
import { LOCALE_CONFIG, CURRENCY_FORMATTING } from "@/mocks/[module]";
```

### 4. Algorithm Constants
Module 9 (Business Feasibility) has algorithm thresholds. Keep them in mocks:
```typescript
const feasibleThreshold = FEASIBILITY_MODES[mode].feasibleThreshold;
```

## File Structure After Completion

```
src/mocks/
├── notifications.ts
├── module-labels.ts
├── economic-indicators.ts
├── business-forecast.ts
├── impact-calculator.ts
├── pricing-strategy.ts
├── revenue-strategy.ts
├── financial-advisory.ts
├── tax-compliance.ts
├── business-feasibility.ts
├── business-planning.ts
├── loan-funding.ts
└── inventory-supply-chain.ts

src/pages/
├── Index.tsx (✅ Updated)
├── Notifications.tsx (✅ Updated)
├── BusinessForecast.tsx (✅ Updated)
├── ImpactCalculator.tsx (⏳ Pending)
├── PricingStrategy.tsx (⏳ Pending)
├── RevenueStrategy.tsx (⏳ Pending)
├── FinancialAdvisory.tsx (⏳ Pending)
├── MarketCompetitiveAnalysis.tsx (⏳ Pending)
├── TaxCompliance.tsx (⏳ Pending)
├── BusinessFeasibility.tsx (⏳ Pending)
├── BusinessPlanning.tsx (⏳ Pending)
├── LoanFunding.tsx (⏳ Pending)
└── InventorySupplyChain.tsx (⏳ Pending)
```

## Benefits After Completion

1. **Maintainability**: All data in one place, easy to update without code changes
2. **Reusability**: Data can be shared across components
3. **Testability**: Mock data can be imported in tests
4. **Localization**: Ready for i18n implementation
5. **Configuration**: Easy to swap test vs. production data
6. **Performance**: Cleaner components, easier to optimize
7. **Scalability**: Pattern established for new modules

## Next Steps

1. Complete remaining module refactoring using this guide
2. Create integration tests for each module using mock data
3. Set up automated tests to ensure mock data structure consistency
4. Plan for dynamic data source integration (API) in future phases
5. Consider centralizing common patterns (status mappings, formatting functions)

## Related Documentation

- [MODULES_HARDCODED_DATA_AUDIT.md](./MODULES_HARDCODED_DATA_AUDIT.md) - Detailed audit of all hardcoded data
- [HARDCODED_DATA_AUDIT.md](./HARDCODED_DATA_AUDIT.md) - Full codebase audit
- [FRONTEND_ARCHITECTURE.md](./FRONTEND_ARCHITECTURE.md) - Frontend structure and patterns
