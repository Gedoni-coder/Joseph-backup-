import React, { createContext, useContext, useState, useEffect } from "react";

export interface Currency {
  code: string;
  name: string;
  symbol: string;
}

export const CURRENCIES: Currency[] = [
  // Major Currencies
  { code: "USD", name: "United States Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "CAD", name: "Canadian Dollar", symbol: "$" },
  { code: "AUD", name: "Australian Dollar", symbol: "$" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "MXN", name: "Mexican Peso", symbol: "$" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$" },
  { code: "ZAR", name: "South African Rand", symbol: "R" },
  
  // Asian Currencies
  { code: "SGD", name: "Singapore Dollar", symbol: "$" },
  { code: "HKD", name: "Hong Kong Dollar", symbol: "$" },
  { code: "KRW", name: "South Korean Won", symbol: "₩" },
  { code: "THB", name: "Thai Baht", symbol: "฿" },
  { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp" },
  { code: "PHP", name: "Philippine Peso", symbol: "₱" },
  { code: "MYR", name: "Malaysian Ringgit", symbol: "RM" },
  { code: "PKR", name: "Pakistani Rupee", symbol: "₨" },
  { code: "BDT", name: "Bangladeshi Taka", symbol: "৳" },
  { code: "VND", name: "Vietnamese Dong", symbol: "₫" },
  { code: "TWD", name: "Taiwan Dollar", symbol: "$" },
  { code: "TRY", name: "Turkish Lira", symbol: "₺" },
  
  // Middle Eastern & African Currencies
  { code: "AED", name: "United Arab Emirates Dirham", symbol: "د.إ" },
  { code: "SAR", name: "Saudi Arabian Riyal", symbol: "﷼" },
  { code: "KWD", name: "Kuwaiti Dinar", symbol: "د.ك" },
  { code: "QAR", name: "Qatari Riyal", symbol: "﷼" },
  { code: "OMR", name: "Omani Rial", symbol: "﷼" },
  { code: "BHD", name: "Bahraini Dinar", symbol: ".د.ب" },
  { code: "JOD", name: "Jordanian Dinar", symbol: "د.ا" },
  { code: "EGP", name: "Egyptian Pound", symbol: "£" },
  { code: "NGN", name: "Nigerian Naira", symbol: "₦" },
  { code: "GHS", name: "Ghanaian Cedi", symbol: "₵" },
  { code: "KES", name: "Kenyan Shilling", symbol: "KSh" },
  { code: "UGX", name: "Ugandan Shilling", symbol: "USh" },
  
  // European Currencies
  { code: "SEK", name: "Swedish Krona", symbol: "kr" },
  { code: "NOK", name: "Norwegian Krone", symbol: "kr" },
  { code: "DKK", name: "Danish Krone", symbol: "kr" },
  { code: "PLN", name: "Polish Zloty", symbol: "zł" },
  { code: "CZK", name: "Czech Koruna", symbol: "Kč" },
  { code: "HUF", name: "Hungarian Forint", symbol: "Ft" },
  { code: "RON", name: "Romanian Leu", symbol: "lei" },
  { code: "BGN", name: "Bulgarian Lev", symbol: "лв" },
  { code: "HRK", name: "Croatian Kuna", symbol: "kn" },
  { code: "RUB", name: "Russian Ruble", symbol: "₽" },
  
  // Americas
  { code: "ARS", name: "Argentine Peso", symbol: "$" },
  { code: "CLP", name: "Chilean Peso", symbol: "$" },
  { code: "COP", name: "Colombian Peso", symbol: "$" },
  { code: "PEN", name: "Peruvian Sol", symbol: "S/" },
  { code: "UYU", name: "Uruguayan Peso", symbol: "$" },
  
  // Oceania
  { code: "NZD", name: "New Zealand Dollar", symbol: "$" },
  { code: "FJD", name: "Fiji Dollar", symbol: "$" },
];

interface CurrencyContextType {
  currency: string;
  setCurrency: (code: string) => void;
  getCurrencySymbol: (code?: string) => string;
  getCurrencyName: (code?: string) => string;
  formatCurrency: (amount: number, code?: string) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("selectedCurrency") || "USD";
    }
    return "USD";
  });

  const setCurrency = (code: string) => {
    setCurrencyState(code);
    localStorage.setItem("selectedCurrency", code);
  };

  const getCurrencySymbol = (code?: string): string => {
    const currencyCode = code || currency;
    const curr = CURRENCIES.find((c) => c.code === currencyCode);
    return curr?.symbol || currencyCode;
  };

  const getCurrencyName = (code?: string): string => {
    const currencyCode = code || currency;
    const curr = CURRENCIES.find((c) => c.code === currencyCode);
    return curr?.name || currencyCode;
  };

  const formatCurrency = (amount: number, code?: string): string => {
    const currencyCode = code || currency;
    const curr = CURRENCIES.find((c) => c.code === currencyCode);
    
    if (!curr) {
      return `${amount.toFixed(2)} ${currencyCode}`;
    }

    // Format based on currency code
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currencyCode,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    } catch (e) {
      // Fallback for unsupported currencies
      return `${curr.symbol}${amount.toFixed(2)}`;
    }
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        getCurrencySymbol,
        getCurrencyName,
        formatCurrency,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within CurrencyProvider");
  }
  return context;
}
