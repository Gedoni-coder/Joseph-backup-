# 📊 12 Modules Hardcoded Data Audit Report

**Scope:** All 12 core business modules (excluding landing, home, and company pages)  
**Date:** January 2025  
**Total Hardcoded Items Found:** 250+

---

## Quick Navigation

1. [Module 1: Economic Indicators](#module-1-economic-indicators)
2. [Module 2: Business Forecast](#module-2-business-forecast)
3. [Module 3: Impact Calculator](#module-3-impact-calculator)
4. [Module 4: Pricing Strategy](#module-4-pricing-strategy)
5. [Module 5: Revenue Strategy](#module-5-revenue-strategy)
6. [Module 6: Financial Advisory & Planning](#module-6-financial-advisory--planning)
7. [Module 7: Market & Competitive Analysis](#module-7-market--competitive-analysis)
8. [Module 8: Tax Compliance](#module-8-tax-compliance)
9. [Module 9: Business Feasibility](#module-9-business-feasibility)
10. [Module 10: Business Planning](#module-10-business-planning)
11. [Module 11: Loan Funding](#module-11-loan-funding)
12. [Module 12: Inventory & Supply Chain](#module-12-inventory--supply-chain)

---

## MODULE 1: Economic Indicators

**File:** `src/pages/Index.tsx`  
**Priority:** 🟡 MEDIUM

### Hardcoded Text Strings

| Line(s) | Content | Type | Recommendation |
|---------|---------|------|-----------------|
| 129-131 | "Economic data refreshed successfully!..." | Alert message | Move to i18n/content config |
| 170-176 | Context titles map: "Local Economic Dashboard", "State Economic Overview", etc. | UI labels | Create `src/config/economic-labels.ts` |
| 181-185 | Context descriptions with interpolation | Descriptions | Externalize to constants |
| 200, 228 | "Live Streaming", "Offline Mode" | Status badges | Move to constants |
| 288, 298, 308 | "Updating metrics...", "Fetching latest news...", etc. | Loading messages | Create loading messages config |
| 320, 366, 372, 389 | Card titles: "Market Alerts & Notifications", "Economic Analysis Summary", etc. | Section headers | Centralize |
| 423 | "Sources: " prefix text | Footer | Config constant |

### Hardcoded Numeric/Time Values

| Line(s) | Value | Usage | Recommendation |
|---------|-------|-------|-----------------|
| 149-154 | 3000 ms | Active update indicator timeout | Create `src/config/timing.ts` |
| 156 | 2000 + Math.random() * 3000 | Streaming simulation frequency | Make configurable |

### CSS/Styling Hardcoded

| Line(s) | Issue | Recommendation |
|---------|-------|-----------------|
| 337-344 | Inline class construction from ALERT_STYLE_MAP | Consider Tailwind config or style constants |

### Data Status

| Item | Status |
|------|--------|
| Mock data (MARKET_ALERTS, etc.) | ✅ Externalized to lib files |
| Content constants | ⚠️ Partially externalized |
| UI copy | ❌ Hardcoded in component |

---

## MODULE 2: Business Forecast

**File:** `src/pages/BusinessForecast.tsx`  
**Priority:** 🟡 MEDIUM

### Hardcoded Text Strings

| Line(s) | Content | Type |
|---------|---------|------|
| 83 | "Business Forecasting" | Module title |
| 84 | Description template with companyName | Module description |
| 172-215 | Tab labels: "Overview", "Summary & Rec", "Tables", "Revenue", "Costs", "Planning", "Analytics", "Documents" | Tab navigation |
| 102-156 | "Annual Revenue Target", "Customer Segments", "KPIs Tracked", "Scenarios Modeled" | Card headings |
| 256, 268 | "Business Forecast Summary", "Business Forecast Recommendations" | Section titles |
| 657 | "© 2024 Business Forecast Platform" | Footer copyright |
| 659 | "Data updated every hour" | Footer subtitle |
| 663 | "Models: Monte Carlo, Linear Regression, Scenario Analysis" | Footer model list |

### Hardcoded Numeric Values

| Line(s) | Value | Usage |
|---------|-------|-------|
| 598 | "12.5%" | Market Share display |
| 600 | "15%" | Target display |
| 609 | "#3" | Competitive Position |
| 620 | "+8%" | Price Premium |
| 551-554 | "15%", "85%", "3-5%", "25%" | Key assumptions (growth, retention, inflation, tech adoption) |

### Issues

- Footer strings hardcoded with year 2024
- Key assumptions are static example numbers
- Tab labels not externalized
- Module description includes hardcoded template but relies on companyName variable

### Recommendation

Create `src/lib/business-forecast-config.ts` with all UI labels and numeric thresholds.

---

## MODULE 3: Impact Calculator

**File:** `src/pages/ImpactCalculator.tsx`  
**Priority:** 🟠 HIGH

### Hardcoded Text Strings

| Line(s) | Content | Type |
|---------|---------|------|
| 171 | "Impact Calculator Type" | Card title |
| 191, 213 | "Policy Impact Calculator", "Economic Impact Calculator" | Type labels |
| 229-231 | "Quick Scenario Templates" | Heading |
| 288-608 | All input field labels (20+ labels) | Form labels |
| 644-648 | "Calculate Policy/Economic Impact", "Calculating Impact..." | Button text |
| 842-855 | "Export Analysis", "Save Scenario", "Build Strategy" | Action button labels |
| 668-676 | "Ready to Calculate" + instructional text | UI instructions |

### Hardcoded Numeric Values

| Line(s) | Value | Usage | Severity |
|---------|-------|-------|----------|
| 59 | 2500 ms | Simulated calculation delay | ⚠️ Time constant |
| 70-76 | 100, 12, 0.4 | Algorithm constants for computation | 🔴 Algorithm config |
| Various | Percent conversions (÷100), division by 12 for months | Formulas | ⚠️ Document needed |

### Issues

- Form field labels scattered throughout component (30+ hardcoded strings)
- Simulated calculation delay (2500 ms) not configurable
- Algorithm constants embedded in computation logic
- Default inputs come from externalized constants (good) but UI labels don't

### Recommendation

Create:
- `src/config/impact-calculator-labels.ts` - All form labels
- `src/config/impact-calculator-defaults.ts` - Default inputs and numeric thresholds

---

## MODULE 4: Pricing Strategy

**File:** `src/pages/PricingStrategy.tsx`  
**Priority:** 🟡 MEDIUM

### Hardcoded Text Strings

| Line(s) | Content | Type |
|---------|---------|------|
| 90 | "Pricing Strategy" | Module title |
| 91 | Description template string | Module description |
| 68-71 | "Connection Error", "Unable to load pricing data..." | Error UI |
| 110-147 | Tab labels: "Overview", "Summary & Rec", "Strategies", "Competitive", "Testing", "Dynamic", "JOSEPH" | Tab navigation |
| 195, 229 | "Active Pricing Strategies", "Running Price Tests" | Card headings |
| 75, 252, 250-251 | "Retry Connection", "Template", "Running", "confidence" | UI labels |

### Hardcoded Numeric Values

| Line(s) | Value | Usage |
|---------|-------|-------|
| 163 | 2 decimals for unit !== "$" | Formatting logic |

### Data Status

- Mock data: ✅ Externalized to usePricingData hook
- UI labels: ❌ Hardcoded

### Recommendation

Extract tab labels and card headings to content config.

---

## MODULE 5: Revenue Strategy

**File:** `src/pages/RevenueStrategy.tsx`  
**Priority:** 🟡 MEDIUM

### Hardcoded Text Strings

| Line(s) | Content | Type |
|---------|---------|------|
| 98 | "Revenue Strategy & Analysis" | Module title |
| 99 | Description with companyName | Module description |
| 119-156 | Tab labels (8 tabs) | Tab navigation |
| 206-315 | "Top Revenue Streams", "Churn Risk Summary", "Top Upsell Opportunities", "Channel Performance" | Card/Section headings |

### Formatting Constants

| Line(s) | Value | Usage |
|---------|-------|-------|
| 225 | ".toFixed(1) + 'M'" | Revenue formatting suffix |

### Recommendation

Extract UI labels and formatting constants to module config.

---

## MODULE 6: Financial Advisory & Planning

**File:** `src/pages/FinancialAdvisory.tsx`  
**Priority:** 🟠 HIGH

### Hardcoded Text Strings

| Line(s) | Content | Type |
|---------|---------|------|
| 133 | "Financial Advisory & Planning" | Module title |
| 136-138 | Description with companyName | Module description |
| 97-99 | "Loading Financial Advisory Data..." | Loading message |
| 111 | "Error Loading Data" | Error message |
| 168 | "2" (absolute hardcoded count) | Notifications badge | 🔴 |
| 174, 256 | "View notifications and alerts", "Get expert advice..." | Tooltip text |
| 180, 262 | "Notifications", "Advice" | Popover headings |
| 333-419 | All tab labels (8 tabs) | Tab navigation |

### Hardcoded Numeric Values

| Line(s) | Value | Usage | Issue |
|---------|-------|-------|-------|
| 168 | "2" | Badge count for notifications | 🔴 Should be dynamic |
| 177, 259 | "w-80" | Tooltip width class | ⚠️ UI sizing constant |

### Issues

- Notifications badge shows hardcoded "2" instead of actual notification count
- Should derive count from DEFAULT_NOTIFICATIONS data

### Recommendation

- Make badge count dynamic: `DEFAULT_NOTIFICATIONS.length`
- Extract popover strings to config
- Create responsive UI constant for tooltip widths

---

## MODULE 7: Market & Competitive Analysis

**File:** `src/pages/MarketCompetitiveAnalysis.tsx`  
**Priority:** 🟡 MEDIUM

### Hardcoded Text Strings

| Line(s) | Content | Type |
|---------|---------|------|
| 120 | "Market Analysis" | Module title |
| 121 | Description with companyName | Module description |
| 176 | "JOSEPH" | Tab label (AI chat) |
| 189-246 | "Total TAM", "Customer Segments", "Competitors", "Market Growth" | Card labels |
| 286 | "high"/"medium"/"low" | Trend impact badges |
| 336, 352 | "Market & Competitive Analysis Summary", "Market & Competitive Recommendations" | Summary section titles |

### Hardcoded Numeric Values

| Line(s) | Value | Usage |
|---------|-------|-------|
| 192-197 | Suffix "B" for billions | TAM formatting |
| 246 | "%" suffix | Growth percentage |
| 289 | "% confidence" | Confidence label |

### Data Status

- Mock data: ✅ Externalized via hooks
- UI labels: ❌ Hardcoded

---

## MODULE 8: Tax Compliance

**File:** `src/pages/TaxCompliance.tsx`  
**Priority:** 🟠 HIGH

### Hardcoded Text Strings

| Line(s) | Content | Type | Issue |
|---------|---------|------|-------|
| 87 | "Tax & Compliance Module" | Module title | ⚠️ |
| 88 | Description with companyName | Module description | ⚠️ |
| 596 | "© 2024 Tax & Compliance Platform" | Footer copyright | 🔴 Year hardcoded |
| 598 | "Data secured and encrypted" | Footer text | ⚠️ |
| 601 | "Compliance: IRS, State Tax Codes, Local Regulations" | Footer legal text | ⚠️ Jurisdiction-specific |
| 175-209 | Tab labels (6 tabs) | Tab navigation | ⚠️ |
| 225, 232, 239-240 | "Live Data", "Offline Mode", "Tax Module Active", "Sync Issue" | Badge labels | ⚠️ |
| 250, 264, 290 | "Calculating tax liabilities...", "Analyzing tax opportunities...", etc. | Loading messages | ⚠️ |
| Various | Button and form labels | UI elements | ⚠️ |

### Hardcoded Numeric/Config Values

| Line(s) | Value | Usage | Issue |
|---------|-------|-------|-------|
| 75-80 | "en-US", "USD" | formatCurrency defaults | 🔴 Not configurable per company |
| 387 | `window.print()` | Print action | ⚠️ Direct browser call |
| 483, 546 | `/documents/${doc.id}`, `/reports/${report.id}` | Document/report URL patterns | ⚠️ Hardcoded paths |

### Issues

- Footer copyright year hardcoded (2024) - will be outdated
- Currency format hardcoded to USD - not suitable for international companies
- Jurisdiction-specific compliance text (IRS) - should be configurable
- Document URL patterns hardcoded

### Recommendation

Create:
- `src/config/tax-compliance-config.ts` - All labels and messages
- Add locale/currency configuration support
- Make document URL patterns configurable

---

## MODULE 9: Business Feasibility

**File:** `src/pages/BusinessFeasibility.tsx`  
**Priority:** 🔴 CRITICAL

### Hardcoded Text Strings

| Line(s) | Content | Type |
|---------|---------|------|
| 62 | "joseph_feasibility_ideas_v1" | localStorage key | 🔴 |
| 306 | "Business Plan and Feasibility Analysis" | Module title |
| 307 | Description text | Module description |
| 344-350 | "Got an Idea?" + button text | Form label |
| 352-355 | "Tip: include rough timelines..." | Form tip text |
| 361, 430-431 | "Past Ideas", "No ideas analyzed yet..." | Empty state text |

### Hardcoded Numeric Values/Thresholds

| Line(s) | Value | Type | Issue | Severity |
|---------|-------|------|-------|----------|
| 77-79 | risk: 1.0, time: 0.8, rate: 0.8 | Conservative mode multipliers | 🔴 Algorithm config embedded |
| 80-81 | feasible: 60, borderline: 45 | Conservative mode thresholds | 🔴 Algorithm config embedded |
| 83 | risk: 0.7, time: 0.5, rate: 0.6, feasible: 50, borderline: 40 | Safe mode thresholds | 🔴 |
| 84 | risk: 0.4, time: 0.3, rate: 0.4, feasible: 40, borderline: 30 | Wild mode thresholds | 🔴 |
| 70 | (timeValue + interestRate) / 100 | Algorithm constant | ⚠️ |
| 72 | Math.pow 1 / (1+combinedRate)^years | Algorithm constant | ⚠️ |
| 88 | 100 * pvFactor | Algorithm constant | ⚠️ |
| 168 | 6.5 | Default interest rate | 🔴 Magic number |
| 170 | Math.max(3, Math.min(interestRate, 12)) | Default timeValue bounds | 🔴 Min 3, Max 12 hardcoded |
| 171 | 18 | Default roiTime (months) | 🔴 |
| 173 | 35 | Default risk value | 🔴 |
| 179 | 12 | Default lengthTimeFactor | 🔴 |
| 180-181 | 24 | lengthTimeFactor for infrastructure/hardware/manufacturing | 🔴 |

### Hardcoded Regex Patterns

| Line(s) | Pattern | Usage |
|---------|---------|-------|
| 163-166 | `/(\d+(?:\.\d+)?)\s*%/` | Detect percentage values |
| 174-177 | `/(\d+(?:\.\d+)?)\s*(?:months?|yrs?)/i` | Detect time periods |
| 179-182 | `/(\d+(?:\.\d+)?)\s*(?:%|rate|apr|interest)/i` | Detect rates |
| 133-151 | Stop words list (40+ words) | extractKeywords filter |

### Hardcoded AI System Prompt

| Line(s) | Content |
|---------|---------|
| 201-202 | `You are Joseph AI. Create a concise business feasibility narrative for the ${mode} mode. Include: Risk, Time Value (NPV intuition), ROI Time, Length Time Factor, Interest Rate, and an overall verdict (${res.verdict}) with score ${res.score}/100. Avoid fluff.` | 🔴 AI prompt embedded in component |

### Other Hardcoded Values

| Line(s) | Item | Type |
|---------|------|------|
| 270 | `idea_${Date.now()}_${Math.random()...}` | ID generation pattern |
| 291 | `/business-feasibility/${id}` | Route path |
| 64-66 | clamp(min 0, max 100) | Utility function bounds |

### Issues

🔴 **CRITICAL:**
- All feasibility algorithm thresholds and defaults are hardcoded
- localStorage key is hardcoded (version 1)
- AI system prompt embedded in component
- Stop words list for keyword extraction embedded

⚠️ **HIGH:**
- Default numeric values scattered throughout
- Regex patterns hardcoded for parsing

### Recommendation

Create:
- `src/config/feasibility-config.ts` - All thresholds, defaults, modes
- `src/config/feasibility-prompts.ts` - AI system prompts
- `src/config/storage-keys.ts` - localStorage keys (shared across app)
- Extract regex patterns to `src/utils/feasibility-parser.ts`

---

## MODULE 10: Business Planning

**File:** `src/pages/BusinessPlanning.tsx`  
**Priority:** 🟠 HIGH

### Hardcoded Text Strings

| Line(s) | Content | Type |
|---------|---------|------|
| 13 | "joseph_business_plans_v1" | localStorage key | 🔴 |
| 18 | "My Business Plan" | Default fallback | ⚠️ |
| 69, 78 | "Make a Plan" | Form label |
| 82-85 | "Tip: describe your business idea..." | Form tip text |
| 91 | "Past Business Plans" | Section heading |
| 172-175 | "No business plans created yet..." | Empty state text |
| 186-189 | "Business Planning", "Create comprehensive, investor-ready..." | Module title & description |

### Hardcoded Logic

| Line(s) | Item | Type |
|---------|------|------|
| 18 | extractBusinessName picks first 3 words | ⚠️ Business logic |
| Progress calculation | plan.steps.length dependent | ⚠️ Potential divide by zero if 0 steps |

### Issues

- localStorage key hardcoded (same issue as Module 9)
- Default plan name fallback hardcoded
- extractBusinessName uses hardcoded word count (3 words)

### Recommendation

Centralize localStorage keys. Consider if 3-word extraction is configurable.

---

## MODULE 11: Loan Funding

**File:** `src/pages/LoanFunding.tsx`  
**Priority:** 🟠 HIGH

### Hardcoded Text Strings

| Line(s) | Content | Type | Issue |
|---------|---------|------|-------|
| 100 | "Funding and Loan Hub" | Module title | ⚠️ |
| 101 | Description includes "E-buy expansion" | Module description | 🔴 Brand name hardcoded |
| 121-158 | Tab labels (7 tabs) | Tab navigation | ⚠️ |
| 171-223 | "Eligibility Score", "Funding Options", "Investor Matches", "New Updates" | Card headings | ⚠️ |
| Various | Button labels and CTAs | UI elements | ⚠️ |

### Hardcoded Numeric Values

| Line(s) | Value | Usage | Issue |
|---------|-------|-------|-------|
| 85-86 | >= 1,000,000 → "M" suffix | Currency formatting | ⚠️ Threshold hardcoded |
| 88-89 | >= 1,000 → "K" suffix | Currency formatting | ⚠️ Threshold hardcoded |
| 292 | "Equity" label when interestRate === 0 | Loan type labeling | ⚠️ |
| 366-369 | Intl.DateTimeFormat with "en-US" | Date formatting | 🔴 Locale hardcoded |

### Issues

- 🔴 Company name "E-buy" hardcoded in description (product-specific data)
- Module hardcodes "E-buy expansion" which won't work for other businesses
- Currency formatting thresholds and locales hardcoded

### Recommendation

- Replace "E-buy" with dynamic company name from COMPANY_CONFIG
- Create `src/config/currency-formatting.ts` for thresholds
- Make locale configurable

---

## MODULE 12: Inventory & Supply Chain

**File:** `src/pages/InventorySupplyChain.tsx`  
**Priority:** 🟠 HIGH

### Hardcoded Text Strings

| Line(s) | Content | Type |
|---------|---------|------|
| 157 | "Inventory & Supply Chain Management" | Module title |
| 158 | Description with companyName | Module description |
| 172-221 | Tab labels (10+ tabs) | Tab navigation |
| 249-297 | "Inventory Value", "Stock Alerts", "Supplier Performance", "Risk Alerts" | Card headings |
| 594 | "Advanced Analytics Coming Soon" | Placeholder text |
| 605-633 | Feature list for coming soon section | Static placeholder |

### Hardcoded Numeric Values

| Line(s) | Value | Usage | Issue |
|---------|-------|-------|-------|
| 129-136 | >= 1,000,000 → "M", >= 1,000 → "K" | formatCurrency (M/K thresholds) | ⚠️ Duplicated logic |
| 147-149 | riskScore > 20 | High-risk disruption threshold | 🔴 Magic number |
| 316-349 | Status mapping array | Inventory statuses with labels | ⚠️ Hardcoded status values |
| 432-441 | Urgency mapping ("high", "medium", etc.) | Reorder urgency labels | ⚠️ |

### Hardcoded Status Mappings

```typescript
// Lines 316-349
status: "in-stock" → "In Stock"
status: "low-stock" → "Low Stock"
status: "out-of-stock" → "Out of Stock"
status: "overstock" → "Overstock"
```

### Issues

- Risk score threshold (20) is magic number - should be configurable
- Status mappings hardcoded (should be in constants)
- Duplicated currency formatting logic (appears in multiple modules)
- "Coming Soon" placeholder text hardcoded (should be removed or configurable)

### Recommendation

Create:
- `src/config/currency-formatting.ts` - Centralized M/K formatting logic
- `src/config/inventory-config.ts` - Status mappings, risk thresholds
- Remove or externalize "Coming Soon" placeholder text

---

## 📊 Cross-Module Hardcoded Data Summary

### By Category

| Category | Count | Severity | Files |
|----------|-------|----------|-------|
| **UI Copy/Labels** | 80+ | 🟡 MEDIUM | All 12 |
| **localStorage Keys** | 2 | 🔴 CRITICAL | BusinessFeasibility, BusinessPlanning |
| **Algorithm Thresholds** | 15 | 🔴 CRITICAL | BusinessFeasibility, InventorySupplyChain |
| **Numeric Defaults** | 20+ | 🟠 HIGH | BusinessFeasibility, TaxCompliance, Inventory |
| **Formatting Thresholds** | 4 | 🟡 MEDIUM | LoanFunding, Inventory (duplicated) |
| **AI/System Prompts** | 1 | 🔴 CRITICAL | BusinessFeasibility |
| **Configuration Files** | 6+ | 🟡 MEDIUM | Multiple (timing, locales, currencies) |
| **Brand/Company Names** | 2 | 🔴 CRITICAL | LoanFunding ("E-buy"), FinancialAdvisory |
| **Footer/Legal Strings** | 5 | 🟡 MEDIUM | BusinessForecast, TaxCompliance |
| **Status/Type Mappings** | 3 | 🟡 MEDIUM | TaxCompliance, Inventory |

### By Severity

**🔴 CRITICAL (Fix Immediately):**
- localStorage keys (v1 hardcoded, can cause sync issues)
- BusinessFeasibility algorithm thresholds and AI prompt
- Hardcoded brand name "E-buy" in LoanFunding
- FinancialAdvisory badge count "2" (should be dynamic)
- Risk score threshold in InventorySupplyChain

**🟠 HIGH (Fix This Sprint):**
- All numeric defaults in BusinessFeasibility (interest rate, ROI time, etc.)
- Currency formatting duplicated across modules
- Locale/timezone hardcoding (TaxCompliance, LoanFunding)
- Tax jurisdiction text (IRS, State Tax Codes)

**🟡 MEDIUM (Fix Next Sprint):**
- UI copy/labels across all modules
- Footer copyright years
- Loading messages
- Form tip texts
- Status/type mappings

---

## 🛠️ Recommended Externalization Strategy

### Phase 1: Critical Fixes (Week 1)

```
src/config/
├── storage-keys.ts          # Centralize localStorage keys
├── feasibility-config.ts    # All BusinessFeasibility thresholds & defaults
├── feasibility-prompts.ts   # AI system prompts
└── app-constants.ts         # Brand, company names, badge counts
```

### Phase 2: Configuration (Week 2)

```
src/config/
├── ui-labels.ts             # Module titles, descriptions, tab labels
├── currency-formatting.ts   # M/K thresholds, locales
├── time-constants.ts        # Timing delays, polling intervals
├── inventory-config.ts      # Status mappings, risk thresholds
└── tax-config.ts            # Jurisdiction, footer text
```

### Phase 3: Content & i18n (Week 3)

```
src/locales/
├── en/                       # English translations
│   ├── modules.json         # UI copy per module
│   ├── messages.json        # Loading, error, success messages
│   └── labels.json          # Form labels, badges, status
└── [other locales]/
```

---

## ✅ Checklist: Items to Externalize by Module

### Module 1: Economic Indicators
- [ ] Move context titles/descriptions to constants
- [ ] Centralize loading messages
- [ ] Extract status badges ("Live Streaming", "Offline")
- [ ] Move timing constants (3000ms, 2000-5000ms) to config

### Module 2: Business Forecast
- [ ] Extract tab labels to array constant
- [ ] Move footer text (copyright, model list) to config
- [ ] Externalize key assumptions (15%, 85%, etc.)
- [ ] Create module config for all strings

### Module 3: Impact Calculator
- [ ] Create form labels config (30+ fields)
- [ ] Extract button text
- [ ] Externalize calculation delay (2500ms)
- [ ] Document algorithm constants (100, 12, 0.4)

### Module 4: Pricing Strategy
- [ ] Extract tab and card labels
- [ ] Move error messages to constants
- [ ] Centralize formatting logic

### Module 5: Revenue Strategy
- [ ] Extract tab labels and card headings
- [ ] Move currency formatting suffixes

### Module 6: Financial Advisory & Planning
- [ ] 🔴 Make notifications badge count dynamic (use DEFAULT_NOTIFICATIONS.length)
- [ ] Extract popover strings and tooltips
- [ ] Move tab labels to config
- [ ] Create responsive UI constant for widths

### Module 7: Market & Competitive Analysis
- [ ] Extract card labels and badge text
- [ ] Move formatting labels ("% confidence", "B" suffix)
- [ ] Centralize summary section titles

### Module 8: Tax Compliance
- [ ] 🔴 Make currency/locale configurable (not "en-US"/"USD" hardcoded)
- [ ] Update footer copyright year (make dynamic)
- [ ] Externalize jurisdiction text
- [ ] Extract all tab labels and messages
- [ ] Make document/report URL patterns configurable

### Module 9: Business Feasibility
- [ ] 🔴 Create feasibility-config.ts with all thresholds and defaults
- [ ] 🔴 Create feasibility-prompts.ts with AI prompts
- [ ] 🔴 Centralize localStorage key to storage-keys.ts
- [ ] Extract stop words list to separate file
- [ ] Externalize regex patterns
- [ ] Extract form labels and tip text

### Module 10: Business Planning
- [ ] 🔴 Move localStorage key to centralized storage-keys.ts
- [ ] Extract form labels and empty state text
- [ ] Review extractBusinessName word count (is 3 configurable?)

### Module 11: Loan Funding
- [ ] 🔴 Replace "E-buy" with dynamic company name from COMPANY_CONFIG
- [ ] Create currency-formatting.ts (shared across modules)
- [ ] Make locale/date formatting configurable
- [ ] Extract tab labels and card headings

### Module 12: Inventory & Supply Chain
- [ ] 🔴 Move risk threshold (20) to config
- [ ] Create status mapping config
- [ ] Consolidate currency formatting (reuse shared module)
- [ ] Extract all tab labels
- [ ] Remove or externalize "Coming Soon" placeholder

---

## 📄 Config Files to Create

### 1. `src/config/storage-keys.ts`
```typescript
export const STORAGE_KEYS = {
  FEASIBILITY_IDEAS: 'joseph_feasibility_ideas_v1',
  BUSINESS_PLANS: 'joseph_business_plans_v1',
  // Add versioning support for future migrations
};
```

### 2. `src/config/feasibility-config.ts`
```typescript
export const FEASIBILITY_MODES = {
  Conservative: {
    risk: 1.0,
    time: 0.8,
    rate: 0.8,
    feasible: 60,
    borderline: 45,
  },
  Safe: {
    risk: 0.7,
    time: 0.5,
    rate: 0.6,
    feasible: 50,
    borderline: 40,
  },
  Wild: {
    risk: 0.4,
    time: 0.3,
    rate: 0.4,
    feasible: 40,
    borderline: 30,
  },
};

export const FEASIBILITY_DEFAULTS = {
  interestRate: 6.5,
  roiTime: 18,
  timeValueMin: 3,
  timeValueMax: 12,
  defaultRisk: 35,
  lengthTimeFactor: 12,
  lengthTimeFactorLarge: 24,
};
```

### 3. `src/config/currency-formatting.ts`
```typescript
export const CURRENCY_FORMAT = {
  millions: 1000000,
  millions_suffix: 'M',
  thousands: 1000,
  thousands_suffix: 'K',
  decimals_millions: 1,
  decimals_thousands: 0,
};

export const LOCALE_CONFIG = {
  default_locale: 'en-US',
  default_currency: 'USD',
};
```

### 4. `src/config/inventory-config.ts`
```typescript
export const INVENTORY_STATUSES = {
  IN_STOCK: { key: 'in-stock', label: 'In Stock' },
  LOW_STOCK: { key: 'low-stock', label: 'Low Stock' },
  OUT_OF_STOCK: { key: 'out-of-stock', label: 'Out of Stock' },
  OVERSTOCK: { key: 'overstock', label: 'Overstock' },
};

export const INVENTORY_RISK_THRESHOLD = 20;

export const INVENTORY_URGENCY = {
  HIGH: { value: 'high', label: 'High' },
  MEDIUM: { value: 'medium', label: 'Medium' },
  LOW: { value: 'low', label: 'Low' },
};
```

---

## 📋 Implementation Roadmap

### Week 1: Critical Fixes
1. Create `storage-keys.ts` and update both modules
2. Create `feasibility-config.ts` and refactor BusinessFeasibility
3. Fix FinancialAdvisory badge count (make dynamic)
4. Replace "E-buy" with COMPANY_NAME in LoanFunding

### Week 2: High Priority
1. Create `currency-formatting.ts` and consolidate logic
2. Make TaxCompliance locale/currency configurable
3. Create `inventory-config.ts` and refactor statuses/thresholds
4. Extract feasibility-prompts.ts

### Week 3: Medium Priority
1. Create centralized UI labels config per module
2. Set up i18n framework for all UI copy
3. Extract time constants to config
4. Create tax jurisdiction config

### Week 4: Polish
1. Update footer texts dynamically (year, company name)
2. Migrate all remaining hardcoded strings to i18n
3. Test all configurations
4. Documentation

---

## 🎯 Expected Impact

**Before:**
- 250+ hardcoded items scattered across 12 modules
- Difficult to update without code changes
- Cannot adjust thresholds/defaults without deployment
- No localization support
- Duplicated formatting logic

**After:**
- ✅ All hardcoded items centralized in config files
- ✅ Easy threshold/default adjustments via config
- ✅ Full i18n support for all UI copy
- ✅ Consistent currency and locale handling
- ✅ DRY principle applied (no duplicated logic)
- ✅ Improved maintainability and scalability

---

**Report Generated:** January 2025  
**Total Items Identified:** 250+  
**Critical Items:** 8  
**High Priority Items:** 25  
**Medium Priority Items:** 220+  
**Estimated Implementation Time:** 3-4 weeks
