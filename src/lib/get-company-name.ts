import { COMPANY_CONFIG } from "./company-config";

/**
 * Get the company name from context or fallback to config
 * This should be called within a component that has access to useCompanyInfo hook
 * 
 * @param companyNameFromContext - Company name from useCompanyInfo hook
 * @returns Company name to use in the UI
 */
export function getCompanyName(companyNameFromContext?: string): string {
  // Priority: Context value > Config value
  if (companyNameFromContext?.trim()) {
    return companyNameFromContext.trim();
  }
  return COMPANY_CONFIG.name;
}

/**
 * Get the company full name from context or fallback to config
 */
export function getCompanyFullName(companyNameFromContext?: string): string {
  if (companyNameFromContext?.trim()) {
    return `${companyNameFromContext.trim()} Marketplace`;
  }
  return COMPANY_CONFIG.fullName;
}
