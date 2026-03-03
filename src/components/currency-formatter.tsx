import React from "react";
import { useCurrency } from "@/lib/currency-context";

interface CurrencyDisplayProps {
  amount: number;
  compact?: boolean;
  decimals?: number;
  className?: string;
}

/**
 * Component to display currency amounts with proper symbol and formatting
 * Uses the global currency context
 */
export function CurrencyDisplay({
  amount,
  compact = false,
  decimals = 2,
  className = "",
}: CurrencyDisplayProps) {
  const { getCurrencySymbol } = useCurrency();
  const symbol = getCurrencySymbol();

  if (compact) {
    // Compact format: $1.5M, $250K, etc.
    const absAmount = Math.abs(amount);
    let formatted: string;

    if (absAmount >= 1e9) {
      formatted = `${symbol}${(amount / 1e9).toFixed(decimals)}B`;
    } else if (absAmount >= 1e6) {
      formatted = `${symbol}${(amount / 1e6).toFixed(decimals)}M`;
    } else if (absAmount >= 1e3) {
      formatted = `${symbol}${(amount / 1e3).toFixed(decimals)}K`;
    } else {
      formatted = `${symbol}${amount.toFixed(decimals)}`;
    }

    return <span className={className}>{formatted}</span>;
  }

  // Regular format with locale
  const formatted = amount.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span className={className}>
      {symbol}
      {formatted}
    </span>
  );
}

/**
 * Hook to get a currency formatter function
 * Useful for use in callbacks and charts
 */
export function useCurrencyFormatter() {
  const { getCurrencySymbol } = useCurrency();
  const symbol = getCurrencySymbol();

  return {
    /**
     * Format a number as compact currency (e.g., $1.5M)
     */
    compact: (value: number, decimals = 2): string => {
      const absAmount = Math.abs(value);
      if (absAmount >= 1e9) {
        return `${symbol}${(value / 1e9).toFixed(decimals)}B`;
      } else if (absAmount >= 1e6) {
        return `${symbol}${(value / 1e6).toFixed(decimals)}M`;
      } else if (absAmount >= 1e3) {
        return `${symbol}${(value / 1e3).toFixed(decimals)}K`;
      }
      return `${symbol}${value.toFixed(decimals)}`;
    },

    /**
     * Format a number as locale currency
     */
    format: (value: number, decimals = 2): string => {
      const formatted = value.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
      return `${symbol}${formatted}`;
    },

    /**
     * Get just the symbol
     */
    symbol: (): string => symbol,

    /**
     * Format as compact for charts/tooltips
     */
    chartFormat: (value: number): string => {
      return `${symbol}${(value / 1000).toFixed(0)}K`;
    },
  };
}
