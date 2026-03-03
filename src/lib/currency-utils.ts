/**
 * Currency utility functions for formatting and displaying monetary values
 * These work in conjunction with the CurrencyContext
 */

/**
 * Conversion rates (relative to USD)
 * In a real app, these would be fetched from an API
 * These are approximate rates for demonstration
 */
const EXCHANGE_RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.5,
  CAD: 1.36,
  AUD: 1.53,
  CHF: 0.89,
  CNY: 7.24,
  INR: 83.12,
  MXN: 17.05,
  BRL: 4.97,
  ZAR: 18.64,
  SGD: 1.34,
  HKD: 7.78,
  KRW: 1319.5,
  THB: 35.29,
  IDR: 15950,
  PHP: 56.25,
  MYR: 4.73,
  PKR: 278.5,
  BDT: 109.45,
  VND: 24500,
  TWD: 31.85,
  TRY: 32.5,
  AED: 3.67,
  SAR: 3.75,
  KWD: 0.31,
  QAR: 3.64,
  OMR: 0.38,
  BHD: 0.38,
  JOD: 0.71,
  EGP: 48.5,
  NGN: 1235,
  GHS: 13.2,
  KES: 157.5,
  UGX: 3895,
  SEK: 10.85,
  NOK: 10.65,
  DKK: 6.87,
  PLN: 4.05,
  CZK: 24.15,
  HUF: 393.5,
  RON: 4.97,
  BGN: 1.96,
  HRK: 6.97,
  RUB: 98.5,
  ARS: 841,
  CLP: 945,
  COP: 4185,
  PEN: 3.75,
  UYU: 39.5,
  NZD: 1.67,
  FJD: 2.28,
};

/**
 * Convert amount from one currency to another
 * @param amount Amount in source currency
 * @param fromCurrency Source currency code
 * @param toCurrency Target currency code
 * @returns Converted amount
 */
export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string
): number {
  const fromRate = EXCHANGE_RATES[fromCurrency] || 1;
  const toRate = EXCHANGE_RATES[toCurrency] || 1;
  return (amount / fromRate) * toRate;
}

/**
 * Get complete currency information
 * @param currencyCode Currency code (e.g., 'USD', 'EUR')
 * @returns Currency object with code, name, and symbol
 */
export function getCurrencyInfo(
  currencyCode: string
): { code: string; name: string; symbol: string } | null {
  const currencyMap: Record<string, { name: string; symbol: string }> = {
    USD: { name: "United States Dollar", symbol: "$" },
    EUR: { name: "Euro", symbol: "€" },
    GBP: { name: "British Pound", symbol: "£" },
    JPY: { name: "Japanese Yen", symbol: "¥" },
    CAD: { name: "Canadian Dollar", symbol: "$" },
    AUD: { name: "Australian Dollar", symbol: "$" },
    CHF: { name: "Swiss Franc", symbol: "CHF" },
    CNY: { name: "Chinese Yuan", symbol: "¥" },
    INR: { name: "Indian Rupee", symbol: "₹" },
    MXN: { name: "Mexican Peso", symbol: "$" },
    BRL: { name: "Brazilian Real", symbol: "R$" },
    ZAR: { name: "South African Rand", symbol: "R" },
    SGD: { name: "Singapore Dollar", symbol: "$" },
    HKD: { name: "Hong Kong Dollar", symbol: "$" },
    KRW: { name: "South Korean Won", symbol: "₩" },
    THB: { name: "Thai Baht", symbol: "฿" },
    IDR: { name: "Indonesian Rupiah", symbol: "Rp" },
    PHP: { name: "Philippine Peso", symbol: "₱" },
    MYR: { name: "Malaysian Ringgit", symbol: "RM" },
    PKR: { name: "Pakistani Rupee", symbol: "₨" },
    BDT: { name: "Bangladeshi Taka", symbol: "৳" },
    VND: { name: "Vietnamese Dong", symbol: "₫" },
    TWD: { name: "Taiwan Dollar", symbol: "$" },
    TRY: { name: "Turkish Lira", symbol: "₺" },
    AED: { name: "United Arab Emirates Dirham", symbol: "د.إ" },
    SAR: { name: "Saudi Arabian Riyal", symbol: "﷼" },
    KWD: { name: "Kuwaiti Dinar", symbol: "د.ك" },
    QAR: { name: "Qatari Riyal", symbol: "﷼" },
    OMR: { name: "Omani Rial", symbol: "﷼" },
    BHD: { name: "Bahraini Dinar", symbol: ".د.ب" },
    JOD: { name: "Jordanian Dinar", symbol: "د.ا" },
    EGP: { name: "Egyptian Pound", symbol: "£" },
    NGN: { name: "Nigerian Naira", symbol: "₦" },
    GHS: { name: "Ghanaian Cedi", symbol: "₵" },
    KES: { name: "Kenyan Shilling", symbol: "KSh" },
    UGX: { name: "Ugandan Shilling", symbol: "USh" },
    SEK: { name: "Swedish Krona", symbol: "kr" },
    NOK: { name: "Norwegian Krone", symbol: "kr" },
    DKK: { name: "Danish Krone", symbol: "kr" },
    PLN: { name: "Polish Zloty", symbol: "zł" },
    CZK: { name: "Czech Koruna", symbol: "Kč" },
    HUF: { name: "Hungarian Forint", symbol: "Ft" },
    RON: { name: "Romanian Leu", symbol: "lei" },
    BGN: { name: "Bulgarian Lev", symbol: "лв" },
    HRK: { name: "Croatian Kuna", symbol: "kn" },
    RUB: { name: "Russian Ruble", symbol: "₽" },
    ARS: { name: "Argentine Peso", symbol: "$" },
    CLP: { name: "Chilean Peso", symbol: "$" },
    COP: { name: "Colombian Peso", symbol: "$" },
    PEN: { name: "Peruvian Sol", symbol: "S/" },
    UYU: { name: "Uruguayan Peso", symbol: "$" },
    NZD: { name: "New Zealand Dollar", symbol: "$" },
    FJD: { name: "Fiji Dollar", symbol: "$" },
  };

  const info = currencyMap[currencyCode];
  if (!info) return null;

  return {
    code: currencyCode,
    ...info,
  };
}

/**
 * Get currency symbol by code
 * @param currencyCode Currency code (e.g., 'USD', 'EUR')
 * @returns Currency symbol
 */
export function getCurrencySymbol(currencyCode: string): string {
  const symbolMap: Record<string, string> = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    CAD: "$",
    AUD: "$",
    CHF: "CHF",
    CNY: "¥",
    INR: "₹",
    MXN: "$",
    BRL: "R$",
    ZAR: "R",
    SGD: "$",
    HKD: "$",
    KRW: "₩",
    THB: "฿",
    IDR: "Rp",
    PHP: "₱",
    MYR: "RM",
    PKR: "₨",
    BDT: "৳",
    VND: "₫",
    TWD: "$",
    TRY: "₺",
    AED: "د.إ",
    SAR: "﷼",
    KWD: "د.ك",
    QAR: "﷼",
    OMR: "﷼",
    BHD: ".د.ب",
    JOD: "د.ا",
    EGP: "£",
    NGN: "₦",
    GHS: "₵",
    KES: "KSh",
    UGX: "USh",
    SEK: "kr",
    NOK: "kr",
    DKK: "kr",
    PLN: "zł",
    CZK: "Kč",
    HUF: "Ft",
    RON: "lei",
    BGN: "лв",
    HRK: "kn",
    RUB: "₽",
    ARS: "$",
    CLP: "$",
    COP: "$",
    PEN: "S/",
    UYU: "$",
    NZD: "$",
    FJD: "$",
  };
  return symbolMap[currencyCode] || currencyCode;
}

/**
 * Format a number as currency
 * @param amount Amount to format (can be number or string)
 * @param currencyCode Currency code
 * @param decimalPlaces Number of decimal places (default: 2)
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number | string,
  currencyCode: string = "USD",
  decimalPlaces: number = 2
): string {
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;

  if (isNaN(numAmount)) {
    return `${getCurrencySymbol(currencyCode)}0${"." + "0".repeat(decimalPlaces)}`;
  }

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
    }).format(numAmount);
  } catch (error) {
    // Fallback for unsupported currencies
    const symbol = getCurrencySymbol(currencyCode);
    return `${symbol}${numAmount.toFixed(decimalPlaces)}`;
  }
}

/**
 * Format a large number with K, M, B suffixes (e.g., 1.5M)
 * @param amount Amount to format
 * @param currencyCode Currency code
 * @returns Formatted string with symbol and suffix
 */
export function formatCompactCurrency(
  amount: number,
  currencyCode: string = "USD"
): string {
  const symbol = getCurrencySymbol(currencyCode);
  const absAmount = Math.abs(amount);

  if (absAmount >= 1e9) {
    return `${symbol}${(amount / 1e9).toFixed(2)}B`;
  }
  if (absAmount >= 1e6) {
    return `${symbol}${(amount / 1e6).toFixed(2)}M`;
  }
  if (absAmount >= 1e3) {
    return `${symbol}${(amount / 1e3).toFixed(2)}K`;
  }
  return `${symbol}${amount.toFixed(2)}`;
}

/**
 * Alias for formatCompactCurrency - formats a large number with K, M, B suffixes
 * @param amount Amount to format
 * @param currencyCode Currency code
 * @returns Formatted string with symbol and suffix (e.g., "$2.4M")
 */
export function formatCurrencyShort(
  amount: number,
  currencyCode: string = "USD"
): string {
  return formatCompactCurrency(amount, currencyCode);
}

/**
 * Parse a currency string to extract the numeric value
 * @param currencyString Currency string (e.g., '$1,234.56')
 * @returns Numeric value
 */
export function parseCurrency(currencyString: string): number {
  const numericString = currencyString.replace(/[^\d.-]/g, "");
  return parseFloat(numericString) || 0;
}
