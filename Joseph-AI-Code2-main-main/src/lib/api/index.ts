/**
 * API Services Index
 * Central export point for all API service modules
 */

// Base clients
export { xanoRequest, xanoGet, xanoPost, xanoPatch, xanoDelete } from "./xano-client";
export { djangoRequest, djangoGet, djangoPost, djangoPut, djangoPatch, djangoDelete } from "./django-client";

// Service modules
export * from "./business-forecasting-service";
export * from "./company-profile-service";
export * from "./tax-compliance-service";
export * from "./pricing-strategy-service";
export * from "./revenue-strategy-service";
export * from "./auth-service";

// Additional services
export * from "./market-analysis-service";
export * from "./risk-management-service";
export * from "./business-feasibility-service";
export * from "./inventory-supply-chain-service";
export * from "./loan-funding-service";
export * from "./financial-advisory-service";
export * from "./economic-indicators-service";
export * from "./policy-compliance-service";
