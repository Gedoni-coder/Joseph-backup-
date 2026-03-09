# Dynamic Currency System Documentation

## Overview

The Joseph AI platform now includes a comprehensive dynamic currency system that allows users to select their preferred currency during onboarding. Once selected, the chosen currency is automatically reflected throughout the entire application wherever monetary values are displayed.

## How It Works

### 1. **User Selection (Onboarding)**

During the onboarding process, users choose from two currency format options:

#### Option A: International

- Limited to 2 currencies: **US Dollar (USD)** and **Euro (EUR)**
- Perfect for organizations operating primarily in these major global currencies
- Quick and simple selection

#### Option B: National

- Access to all **182 world currencies**
- Includes major and minor currencies from every nation
- Examples: INR, JPY, GBP, CAD, AUD, BRL, ZAR, CNY, MXN, CHF, SEK, NOK, DKK, and many more
- Full currency information with symbols and positioning

### 2. **Currency Preference Storage**

Selected currency preference is stored in:

- **Browser LocalStorage** (via CompanyInfo context)
- **Application State** (CompanyInfo context)
- Persists across sessions

### 3. **Dynamic Rendering Throughout App**

The selected currency is automatically applied to all monetary values in:

#### Sales Intelligence Module

- Pipeline Value
- Average Deal Size
- Revenue metrics

#### KPI Dashboard

- Monthly Revenue
- Sales Target
- Revenue Gap
- All revenue-based KPIs
- Pipeline values
- Cost metrics

#### Benchmarking Section

- Deal size comparisons
- Performance metrics
- Industry average comparisons

## Technical Implementation

### Currency Utility (`src/lib/currency-utils.ts`)

Provides core currency formatting functions:

```typescript
// Format number as currency
formatCurrency(amount: number | string, currencyCode: string, decimalPlaces: number)
// Example: formatCurrency(45200, "USD") → "$45,200.00"
// Example: formatCurrency(45200, "INR") → "₹45,200.00"

// Get currency symbol only
getCurrencySymbol(currencyCode: string)
// Example: getCurrencySymbol("EUR") → "€"

// Format currency in short form
formatCurrencyShort(amount: number, currencyCode: string)
// Example: formatCurrencyShort(2400000, "USD") → "$2.4M"

// Get full currency information
getCurrencyInfo(currencyCode: string)
// Returns: { symbol, code, name, position: 'before' | 'after' }
```

### Custom Hook (`src/hooks/useCurrency.ts`)

Makes currency formatting easy in any React component:

```typescript
import { useCurrency } from "@/hooks/useCurrency";

function MyComponent() {
  const { format, formatShort, symbol, info, code } = useCurrency();

  return (
    <div>
      <p>Revenue: {format(245000)}</p>           // "$245,000.00"
      <p>Pipeline: {formatShort(2400000)}</p>   // "$2.4M"
      <p>Currency: {symbol}</p>                  // "$"
      <p>Full Info: {info?.name}</p>             // "US Dollar"
    </div>
  );
}
```

### Company Context (`src/lib/company-context.tsx`)

Extended to include:

- `currencyFormat`: "international" | "national"
- `currencyPreference`: Currency code (e.g., "USD", "EUR", "INR")

## Currency Symbols and Positioning

Different currencies have different symbol positions:

**Before Amount:**

- USD: $245,000
- EUR: €245,000
- INR: ₹245,000
- GBP: £245,000

**After Amount:**

- EUR (in some locales): 245,000 €
- JPY: 245,000 ¥
- CHF: 245,000 CHF

The system automatically handles positioning based on currency standards.

## Supported Currencies (182 Total)

### Major Currencies

- USD - US Dollar
- EUR - Euro
- GBP - British Pound
- JPY - Japanese Yen
- CAD - Canadian Dollar
- AUD - Australian Dollar
- CHF - Swiss Franc
- CNY - Chinese Yuan
- INR - Indian Rupee
- MXN - Mexican Peso
- BRL - Brazilian Real
- ZAR - South African Rand

### And 170+ more from around the world...

See `src/lib/currency-utils.ts` for complete list.

## Implementation in Components

### Example 1: Display Revenue with Dynamic Currency

```typescript
import { useCurrency } from "@/hooks/useCurrency";

export function RevenueCard() {
  const { format } = useCurrency();

  return (
    <Card>
      <CardTitle>Monthly Revenue</CardTitle>
      <CardContent>
        <p className="text-3xl font-bold">
          {format(245000)}
        </p>
      </CardContent>
    </Card>
  );
}
```

### Example 2: Display Multiple Currency Values

```typescript
import { useCurrency } from "@/hooks/useCurrency";

export function SalesMetrics() {
  const { format, formatShort } = useCurrency();

  return (
    <div className="space-y-4">
      <div>
        <p>Pipeline Value</p>
        <p className="text-2xl font-bold">{formatShort(2400000)}</p>
      </div>
      <div>
        <p>Avg Deal Size</p>
        <p className="text-2xl font-bold">{format(45200)}</p>
      </div>
    </div>
  );
}
```

## User Experience

### Onboarding Flow

1. User expands "Optional Information" section
2. Sees "Currency Format" option with two buttons:
   - 🌍 **International** (Dollars & Euros)
   - 🗺️ **National** (All currencies)
3. Clicks their preferred format
4. Dropdown appears with appropriate currency options
5. Selects desired currency
6. Completes onboarding
7. Currency is now applied everywhere in app

### Settings Update

Users can update their currency preference anytime in:

- Company Settings (future implementation)
- User Profile (future implementation)

Changes are reflected immediately throughout the app.

## Future Enhancements

1. **User Settings Page** - Allow users to change currency after onboarding
2. **Currency Conversion** - Show equivalent values in multiple currencies
3. **Historical Trends** - Track performance in original vs. current currency
4. **Multi-currency Reporting** - Generate reports in multiple currencies
5. **Decimal Customization** - Allow users to choose 0, 1, 2, or 3 decimal places
6. **Thousands Separator** - Options for comma, period, or space as thousands separator

## Troubleshooting

### Currency Not Updating Across App

- Ensure `useCurrency()` hook is used in the component
- Check browser DevTools → Application → LocalStorage for stored currency
- Verify CompanyInfo context is wrapping the component

### Currency Symbol Not Displaying

- Check if currency code is valid (see CURRENCY_SYMBOLS in currency-utils.ts)
- Ensure font supports the currency symbol (most do)
- Try a different currency to test

### Incorrect Currency Position

- Position is determined by CURRENCY_SYMBOLS configuration
- For custom positioning, update the position field in currency-utils.ts

## Files Modified/Created

### New Files Created:

- `src/lib/currency-utils.ts` - Core currency formatting utilities
- `src/hooks/useCurrency.ts` - Custom hook for easy usage

### Files Modified:

- `src/pages/Onboarding.tsx` - Added currency selection
- `src/lib/company-context.tsx` - Added currencyFormat and currencyPreference
- `src/pages/SalesIntelligence.tsx` - Updated to use dynamic currency
- `src/components/kpi/KPIDashboardHome.tsx` - Updated to use dynamic currency
- `src/components/kpi/KPICategoriesView.tsx` - Updated to use dynamic currency
- `src/components/kpi/BenchmarkingSection.tsx` - Updated to use dynamic currency

## Best Practices for Developers

1. **Always use `useCurrency()` hook** for displaying monetary values
2. **Use `format()` for standard amounts**, `formatShort()` for large numbers
3. **Use appropriate decimal places** - 0 for whole numbers, 2 for typical currency
4. **Consider performance** - Hook uses context, avoid excessive re-renders
5. **Document currency fields** - Add comments if values represent currency
6. **Test with multiple currencies** - Ensure layout works with various symbol positions

## Example: Adding Currency to New Component

```typescript
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useCurrency } from "@/hooks/useCurrency";

export function NewFinancialCard() {
  const { format, symbol } = useCurrency();

  const revenue = 125000;
  const expenses = 45000;
  const profit = revenue - expenses;

  return (
    <Card>
      <CardTitle>Financial Summary</CardTitle>
      <CardContent className="space-y-2">
        <div className="flex justify-between">
          <span>Revenue:</span>
          <span className="font-bold">{format(revenue)}</span>
        </div>
        <div className="flex justify-between">
          <span>Expenses:</span>
          <span className="font-bold">{format(expenses)}</span>
        </div>
        <div className="flex justify-between">
          <span>Profit:</span>
          <span className="font-bold text-green-600">{format(profit)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
```

---

**Last Updated:** 2025-02-03
**System Version:** 1.0
**Status:** Production Ready
