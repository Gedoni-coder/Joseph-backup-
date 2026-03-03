/**
 * Application Configuration
 * Contains app-level constants, storage keys, and configuration
 * All data here should come from mock API and be replaced with real API calls in production
 */

// ============ STORAGE KEYS ============
// Centralized localStorage keys to avoid collisions and support versioning
export const STORAGE_KEYS = {
  // Business Feasibility module
  FEASIBILITY_IDEAS: 'joseph_feasibility_ideas_v1',
  
  // Business Planning module
  BUSINESS_PLANS: 'joseph_business_plans_v1',
  
  // Authentication
  AUTH_TOKEN: 'joseph_auth_token_v1',
  USER_PREFERENCES: 'joseph_user_preferences_v1',
  
  // Session
  LAST_MODULE: 'joseph_last_module_v1',
  SESSION_DATA: 'joseph_session_data_v1',
} as const;

// ============ APPLICATION METADATA ============
// Metadata about the application version and build
export const APP_METADATA = {
  version: '1.0.0',
  name: 'Joseph AI',
  fullName: 'Joseph AI - Economic Intelligence System',
  description: 'Agentic Economic Intelligence System for businesses',
  buildYear: new Date().getFullYear(),
};

// ============ NOTIFICATION CONFIGURATION ============
// Configuration for notifications and alerts
export const NOTIFICATION_CONFIG = {
  defaultNotificationCount: 2,  // Used when real count not available
  maxNotificationsDisplay: 5,   // Maximum notifications to show at once
  notificationTimeout: 5000,    // Default notification timeout (ms)
};

// ============ TIMING CONSTANTS ============
// Various timing values used throughout the app
export const TIMING_CONSTANTS = {
  // Economic Indicators module
  economicStreamingRefreshInterval: 2000,    // ms - Base interval for streaming
  economicStreamingRandomDelay: 3000,        // ms - Random delay added
  economicUpdateIndicatorClearTime: 3000,    // ms - Time to clear active indicator
  
  // Impact Calculator module
  impactCalculationDelay: 2500,              // ms - Simulated calc delay
  
  // General
  defaultLoadingTimeout: 5000,               // ms - Default loading timeout
  debounceDelay: 300,                        // ms - Debounce for form inputs
};

// ============ API ENDPOINTS (MOCK) ============
// Mock API endpoints - these should be replaced with real ones
export const API_ENDPOINTS = {
  // Feasibility endpoints
  feasibilityAnalyze: '/api/feasibility/analyze',
  feasibilityList: '/api/feasibility/list',
  feasibilityDelete: '/api/feasibility/delete',
  
  // Business Planning endpoints
  planCreate: '/api/business-plans/create',
  planList: '/api/business-plans/list',
  planUpdate: '/api/business-plans/update',
  planDelete: '/api/business-plans/delete',
  
  // Economic data endpoints
  economicData: '/api/economic/data',
  economicForecasts: '/api/economic/forecasts',
  economicNews: '/api/economic/news',
  
  // General
  config: '/api/config',
  health: '/api/health',
};

// ============ FEATURE FLAGS ============
// Feature flags for enabling/disabling features
export const FEATURE_FLAGS = {
  enableAIPrompts: true,
  enableMockData: true,
  enableLocalStorage: true,
  enableOfflineMode: false,
  enableAnalytics: true,
  enableDarkMode: true,
};

// ============ ERROR MESSAGES ============
// Standardized error messages used throughout the app
export const ERROR_MESSAGES = {
  generic: 'An error occurred. Please try again.',
  networkError: 'Network error. Please check your connection.',
  dataLoadError: 'Failed to load data. Please try again.',
  dataValidation: 'Invalid data provided. Please check your inputs.',
  notAuthorized: 'You do not have permission to perform this action.',
  notFound: 'The requested resource was not found.',
};

// ============ SUCCESS MESSAGES ============
// Standardized success messages
export const SUCCESS_MESSAGES = {
  saved: 'Data saved successfully.',
  deleted: 'Item deleted successfully.',
  created: 'Item created successfully.',
  updated: 'Item updated successfully.',
};

// ============ PAGINATION CONFIG ============
// Default pagination settings
export const PAGINATION_CONFIG = {
  defaultPageSize: 10,
  maxPageSize: 100,
  defaultPage: 1,
};

// ============ CURRENCY FORMATTING ============
// Global currency formatting configuration
export const CURRENCY_FORMAT_CONFIG = {
  locale: 'en-US',              // Default locale
  currency: 'USD',              // Default currency
  millionThreshold: 1000000,    // Threshold for M suffix
  millionSuffix: 'M',           // Suffix for millions
  millionDecimals: 1,           // Decimals for millions
  thousandThreshold: 1000,      // Threshold for K suffix
  thousandSuffix: 'K',          // Suffix for thousands
  thousandDecimals: 0,          // Decimals for thousands
};

// ============ TAX COMPLIANCE CONFIG ============
// Tax compliance module configuration
export const TAX_CONFIG = {
  locale: 'en-US',                           // Default locale
  currency: 'USD',                           // Default currency
  year: new Date().getFullYear(),            // Current tax year
  jurisdiction: 'federal',                   // Default jurisdiction
  jurisdictionText: 'IRS, State Tax Codes, Local Regulations',
  footerText: `© ${new Date().getFullYear()} Tax & Compliance Platform`,
  dataSecurityText: 'Data secured and encrypted',
  supportedJurisdictions: ['federal', 'state', 'local'],
};

// ============ INVENTORY CONFIG ============
// Inventory & Supply Chain module configuration
export const INVENTORY_CONFIG = {
  riskThreshold: 20,             // Score above this is high risk
  lowStockThreshold: 5,          // Inventory level threshold
  highStockThreshold: 100,       // Overstock threshold
  statusMappings: {
    'in-stock': { key: 'in-stock', label: 'In Stock', icon: 'check-circle' },
    'low-stock': { key: 'low-stock', label: 'Low Stock', icon: 'alert-circle' },
    'out-of-stock': { key: 'out-of-stock', label: 'Out of Stock', icon: 'x-circle' },
    'overstock': { key: 'overstock', label: 'Overstock', icon: 'arrow-up' },
  },
  urgencyLevels: {
    high: { value: 'high', label: 'High', color: 'text-red-500' },
    medium: { value: 'medium', label: 'Medium', color: 'text-yellow-500' },
    low: { value: 'low', label: 'Low', color: 'text-green-500' },
  },
};

// ============ FINANCIAL ADVISORY CONFIG ============
// Financial Advisory & Planning module configuration
export const FINANCIAL_ADVISORY_CONFIG = {
  notificationsBadgeCount: 2,    // Dynamic count - should come from data
  adviceBadgeCount: 2,           // Dynamic count - should come from data
  defaultCurrency: 'USD',
  defaultLocale: 'en-US',
};

// ============ LOGGING CONFIG ============
// Logging configuration
export const LOGGING_CONFIG = {
  enableLogging: true,
  logLevel: 'info',              // 'debug' | 'info' | 'warn' | 'error'
  logToConsole: true,
  logToServer: false,
};

/**
 * Get storage key by name
 * @param keyName - Name of the storage key
 * @returns The storage key string
 */
export function getStorageKey(keyName: keyof typeof STORAGE_KEYS): string {
  return STORAGE_KEYS[keyName];
}

/**
 * Get error message
 * @param type - Type of error
 * @returns The error message string
 */
export function getErrorMessage(type: keyof typeof ERROR_MESSAGES): string {
  return ERROR_MESSAGES[type];
}

/**
 * Get success message
 * @param type - Type of success message
 * @returns The success message string
 */
export function getSuccessMessage(type: keyof typeof SUCCESS_MESSAGES): string {
  return SUCCESS_MESSAGES[type];
}

/**
 * Format currency value
 * @param amount - Amount to format
 * @returns Formatted currency string
 */
export function formatCurrencyShort(amount: number): string {
  const config = CURRENCY_FORMAT_CONFIG;
  
  if (amount >= config.millionThreshold) {
    return (amount / config.millionThreshold).toFixed(config.millionDecimals) + config.millionSuffix;
  }
  if (amount >= config.thousandThreshold) {
    return (amount / config.thousandThreshold).toFixed(config.thousandDecimals) + config.thousandSuffix;
  }
  return amount.toString();
}

/**
 * Get current tax year
 * @returns Current tax year
 */
export function getCurrentTaxYear(): number {
  return TAX_CONFIG.year;
}

/**
 * Get dynamic footer text
 * @returns Footer text with current year
 */
export function getFooterText(): string {
  return `© ${new Date().getFullYear()} Joseph AI Platform`;
}
