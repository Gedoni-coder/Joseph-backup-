/**
 * Company Configuration
 * Central configuration for E-buy company branding and data
 */
export const COMPANY_CONFIG = {
  name: "E-buy",
  fullName: "E-buy Marketplace",
  description: "E-buy is a leading e-commerce marketplace connecting buyers and sellers across multiple categories including electronics, fashion, home & living, groceries, and more.",
  industry: "E-commerce / Online Marketplace",
  similarCompanies: ["Jumia", "Konga", "Temu", "Amazon"],
  website: "https://www.e-buy.com",
  founded: "2018",
  headquarters: "Lagos, Nigeria",
  activeMarkets: ["Nigeria", "Ghana", "Kenya"],
} as const;

export const COMPANY_NAME = COMPANY_CONFIG.name;

