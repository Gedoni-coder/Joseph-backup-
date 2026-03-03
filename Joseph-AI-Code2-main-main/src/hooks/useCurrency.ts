import { useCompanyInfo } from "@/lib/company-context";
import {
  formatCurrency,
  getCurrencySymbol,
  getCurrencyInfo,
  formatCurrencyShort,
} from "@/lib/currency-utils";

/**
 * Custom hook to use currency formatting based on company's selected currency preference
 * Usage: const { format, symbol, info } = useCurrency();
 */
export function useCurrency() {
  const { companyInfo } = useCompanyInfo();
  const currencyCode = companyInfo?.currencyPreference || "USD";

  return {
    /**
     * Format a number as currency
     * @param amount - Number to format
     * @param decimalPlaces - Number of decimal places (default: 2)
     */
    format: (amount: number | string, decimalPlaces: number = 2): string => {
      return formatCurrency(amount, currencyCode, decimalPlaces);
    },

    /**
     * Get currency symbol only
     */
    symbol: getCurrencySymbol(currencyCode),

    /**
     * Get full currency information
     */
    info: getCurrencyInfo(currencyCode),

    /**
     * Format currency in short form (e.g., $50K, €2.5M)
     */
    formatShort: (amount: number): string => {
      return formatCurrencyShort(amount, currencyCode);
    },

    /**
     * Get the current currency code
     */
    code: currencyCode,
  };
}
