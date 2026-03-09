# Currency System Usage Guide

This guide explains how to use the global currency system in your application.

## Overview

The currency system is built with three main components:

1. **CurrencyContext** (`src/lib/currency-context.tsx`) - Global state management
2. **Currency Utilities** (`src/lib/currency-utils.ts`) - Helper functions for formatting
3. **CurrencyProvider** (wrapped in App.tsx) - Makes currency available app-wide

## Using the Currency Context

### In Functional Components

```tsx
import { useCurrency } from "@/lib/currency-context";

export function MyComponent() {
  const { currency, setCurrency, formatCurrency, getCurrencySymbol } = useCurrency();
  
  return (
    <div>
      <p>Current currency: {currency}</p>
      <p>Formatted amount: {formatCurrency(1234.56)}</p>
      <p>Symbol: {getCurrencySymbol()}</p>
    </div>
  );
}
```

## Available Methods

### `currency`
Returns the currently selected currency code (e.g., "USD", "EUR")

### `setCurrency(code: string)`
Changes the selected currency
```tsx
setCurrency("EUR");
```

### `formatCurrency(amount: number, code?: string): string`
Formats a number as currency with proper symbols and formatting
```tsx
formatCurrency(1234.56)        // "$1,234.56" (if USD selected)
formatCurrency(1234.56, "EUR") // "€1.234,56" (always EUR, regardless of selection)
```

### `getCurrencySymbol(code?: string): string`
Returns the symbol for a currency
```tsx
getCurrencySymbol()      // "$" (if USD selected)
getCurrencySymbol("GBP") // "£"
```

### `getCurrencyName(code?: string): string`
Returns the full name of a currency
```tsx
getCurrencyName()      // "United States Dollar"
getCurrencyName("EUR") // "Euro"
```

## Using Utility Functions

For cases where you can't use the hook (like in utility functions or API calls):

```tsx
import { formatCurrency, convertCurrency, formatCompactCurrency } from "@/lib/currency-utils";

// Format a basic currency
const formatted = formatCurrency(1234.56, "USD"); // "$1,234.56"

// Format with compact notation (e.g., for large numbers)
const compact = formatCompactCurrency(1500000, "USD"); // "$1.50M"

// Convert between currencies
const converted = convertCurrency(100, "USD", "EUR"); // ~92

// Parse currency string
const parsed = parseCurrency("$1,234.56"); // 1234.56
```

## Example: Formatting Currency in Components

### Before (Static Currency)
```tsx
<div>
  <p>Revenue: ${revenue.toFixed(2)}</p>
  <p>Costs: ${costs.toFixed(2)}</p>
  <p>Profit: ${profit.toFixed(2)}</p>
</div>
```

### After (Dynamic Currency)
```tsx
import { useCurrency } from "@/lib/currency-context";

export function FinancialSummary({ revenue, costs, profit }) {
  const { formatCurrency } = useCurrency();
  
  return (
    <div>
      <p>Revenue: {formatCurrency(revenue)}</p>
      <p>Costs: {formatCurrency(costs)}</p>
      <p>Profit: {formatCurrency(profit)}</p>
    </div>
  );
}
```

## Supported Currencies

All world currencies are supported! The system includes:

- **Major Currencies**: USD, EUR, GBP, JPY, CAD, AUD, CHF, CNY, INR, etc.
- **Asian Currencies**: SGD, HKD, KRW, THB, IDR, PHP, MYR, PKR, BDT, VND, TWD, TRY, etc.
- **Middle Eastern**: AED, SAR, KWD, QAR, OMR, BHD, JOD, EGP, etc.
- **African Currencies**: NGN, GHS, KES, UGX, ZAR, etc.
- **European**: SEK, NOK, DKK, PLN, CZK, HUF, RON, BGN, HRK, RUB, etc.
- **Americas**: ARS, CLP, COP, PEN, UYU, MXN, BRL, etc.
- **Oceania**: NZD, FJD, AUD, etc.

See `CURRENCIES` array in `src/lib/currency-context.tsx` for the complete list.

## Currency Persistence

- Selected currency is automatically saved to localStorage
- Persists across page refreshes
- Default currency is USD if none is selected

## Best Practices

1. **Always use useCurrency hook** in components that display currency
   ```tsx
   const { formatCurrency } = useCurrency();
   ```

2. **Use formatCurrency** for consistent formatting
   ```tsx
   // Good
   <p>{formatCurrency(amount)}</p>
   
   // Avoid
   <p>${amount.toFixed(2)}</p>
   ```

3. **Use formatCompactCurrency** for large numbers
   ```tsx
   // Good for dashboards and summaries
   <p>Total Revenue: {formatCompactCurrency(1500000)}</p>
   ```

4. **Specify currency only when needed**
   ```tsx
   // Use selected currency (from context)
   formatCurrency(100)
   
   // Override with specific currency
   formatCurrency(100, "EUR")
   ```

## Integration Examples

### Financial Dashboard
```tsx
import { useCurrency } from "@/lib/currency-context";

export function FinancialDashboard({ data }) {
  const { formatCurrency, currency } = useCurrency();
  
  return (
    <div>
      <h2>Financial Summary ({currency})</h2>
      {data.metrics.map((metric) => (
        <div key={metric.id}>
          <p>{metric.name}: {formatCurrency(metric.value)}</p>
        </div>
      ))}
    </div>
  );
}
```

### Price List
```tsx
import { useCurrency } from "@/lib/currency-context";
import { convertCurrency } from "@/lib/currency-utils";

export function PriceList({ products }) {
  const { currency, formatCurrency } = useCurrency();
  
  return (
    <ul>
      {products.map((product) => {
        // If prices are stored in USD, convert to selected currency
        const priceInSelectedCurrency = convertCurrency(
          product.priceUSD,
          "USD",
          currency
        );
        
        return (
          <li key={product.id}>
            {product.name}: {formatCurrency(priceInSelectedCurrency)}
          </li>
        );
      })}
    </ul>
  );
}
```

### Form Input with Currency Display
```tsx
import { useCurrency } from "@/lib/currency-context";

export function PriceInput() {
  const { currency, getCurrencySymbol, formatCurrency } = useCurrency();
  const [value, setValue] = useState(0);
  
  return (
    <div>
      <label>Price ({currency})</label>
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(parseFloat(e.target.value))}
        placeholder="0.00"
      />
      <p>Preview: {formatCurrency(value)}</p>
    </div>
  );
}
```

## Migration Checklist

When updating existing components to use the currency system:

- [ ] Import `useCurrency` hook
- [ ] Replace static currency symbols with `getCurrencySymbol()`
- [ ] Replace `toFixed(2)` with `formatCurrency()`
- [ ] Add currency display next to amounts
- [ ] Test with different currencies from navbar
- [ ] Update tests to mock currency context

## Notes

- Exchange rates in `CURRENCY_UTILS.ts` are approximate for demonstration
- In production, fetch real-time rates from an API (e.g., fixer.io, exchangerate-api.com)
- Currency formatting respects browser locale and language settings
- Some currencies may have special formatting rules in different regions

## Troubleshooting

**Issue: Currency not persisting**
- Check browser localStorage is enabled
- Clear localStorage and try again

**Issue: formatCurrency throws error**
- Ensure currency code is valid (see CURRENCIES list)
- Use fallback formatting: `${symbol}${amount.toFixed(2)}`

**Issue: Rates not converting correctly**
- Note: rates are hardcoded approximations
- Implement live rate API for production
- Consider using Open Exchange Rates or similar service
