# Xano API Integration Guide

## Overview

Your application is now integrated with the Xano API. This guide explains how to use the API services and extend them for additional endpoints.

## Architecture

The integration follows a layered approach:

```
React Components
    ↓
Service Functions (e.g., getBusinessForecast())
    ↓
Xano Client (xanoGet, xanoPost, etc.)
    ↓
Xano API (https://x8ki-letl-twmt.n7.xano.io/api:MdDKI7Xp)
```

## Files Created

### 1. **Xano Client** (`src/lib/api/xano-client.ts`)
Core HTTP client for all Xano API requests. Handles:
- Base URL configuration
- Request method helpers (GET, POST, PATCH, DELETE)
- Error handling
- Query parameters

### 2. **Service Modules**
Pre-built services for major features:
- `business-forecasting-service.ts` - Business forecasting data
- `company-profile-service.ts` - Company profile management
- `tax-compliance-service.ts` - Tax compliance records
- `pricing-strategy-service.ts` - Pricing strategies
- `revenue-strategy-service.ts` - Revenue strategies

### 3. **Barrel Export** (`src/lib/api/index.ts`)
Central export point - import all services from `src/lib/api`

## Usage Examples

### Basic Usage in Components

```typescript
import { getBusinessForecast, createBusinessForecast } from "@/lib/api";
import { useQuery, useMutation } from "@tanstack/react-query";

function MyComponent() {
  // Fetch data
  const { data, isLoading } = useQuery({
    queryKey: ["forecast", 1],
    queryFn: () => getBusinessForecast(1),
  });

  // Create/update data
  const mutation = useMutation({
    mutationFn: (newData) => createBusinessForecast(newData),
    onSuccess: () => {
      // Handle success
    },
  });

  if (isLoading) return <div>Loading...</div>;
  
  return <div>{data?.annual_revenue_target}</div>;
}
```

### Error Handling

```typescript
try {
  const forecast = await getBusinessForecast(1);
} catch (error) {
  console.error("Failed to fetch forecast:", error.message);
  // Show error to user
}
```

## Creating New Service Modules

For any missing endpoint, follow this pattern:

### 1. Create the Service File
```typescript
// src/lib/api/my-feature-service.ts
import { xanoGet, xanoPost, xanoPatch, xanoDelete } from "./xano-client";

export interface MyFeatureData {
  id: number;
  created_at: string;
  account_id: number;
  // ... other fields from Xano API docs
}

export type MyFeatureCreateData = Omit<MyFeatureData, "id" | "created_at">;
export type MyFeatureUpdateData = Partial<MyFeatureCreateData>;

export async function getMyFeatures(): Promise<MyFeatureData[]> {
  return xanoGet<MyFeatureData[]>("/my_feature");
}

export async function getMyFeature(id: number): Promise<MyFeatureData> {
  return xanoGet<MyFeatureData>(`/my_feature/${id}`);
}

export async function createMyFeature(data: MyFeatureCreateData): Promise<MyFeatureData> {
  return xanoPost<MyFeatureData>("/my_feature", data);
}

export async function updateMyFeature(id: number, data: MyFeatureUpdateData): Promise<MyFeatureData> {
  return xanoPatch<MyFeatureData>(`/my_feature/${id}`, data);
}

export async function deleteMyFeature(id: number): Promise<void> {
  return xanoDelete(`/my_feature/${id}`);
}
```

### 2. Add to Barrel Export
```typescript
// src/lib/api/index.ts
export * from "./my-feature-service";
```

### 3. Use in Components
```typescript
import { getMyFeatures, createMyFeature } from "@/lib/api";
```

## Available Endpoints

The following endpoints are available via Xano API:

- `/advice` - Financial/business advice records
- `/business_feasibility` - Business feasibility studies
- `/business_forecasting` - Business forecasting (service created ✓)
- `/company_profile` - Company profile management (service created ✓)
- `/document` - Document management
- `/financial_advisory` - Financial advisory records
- `/funding_loan_hub` - Funding and loan information
- `/growth_planning_dashboard` - Growth planning dashboards
- `/inventory_supply_chain` - Inventory and supply chain data
- `/joseph_ai_notification` - AI notifications
- `/local_economic_dashboard` - Local economic data
- `/market_analysis` - Market analysis records
- `/notification` - General notifications
- `/policy_alert` - Policy alerts
- `/policy_economic_impact` - Policy impact analysis
- `/pricing_strategy` - Pricing strategies (service created ✓)
- `/revenue_strategy` - Revenue strategies (service created ✓)
- `/risk_management` - Risk management records
- `/tax_compliance` - Tax compliance records (service created ✓)

## Configuration

### Environment Variables

The API base URL is configured via:
```
VITE_XANO_API_BASE=https://x8ki-letl-twmt.n7.xano.io/api:MdDKI7Xp
```

If this variable is not set, the application will use the default URL. To customize:
1. Create a `.env.local` file in the root directory
2. Add: `VITE_XANO_API_BASE=your_custom_url`
3. Restart the dev server

## Best Practices

1. **Always use TypeScript types** - Define interfaces for API responses
2. **Use React Query** - For caching and state management of API data
3. **Error handling** - Wrap API calls in try-catch or use React Query error handling
4. **Loading states** - Show loading indicators while fetching
5. **Query invalidation** - Invalidate related queries after mutations

### Example with React Query:

```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBusinessForecast, updateBusinessForecast } from "@/lib/api";

function BusinessForecastEditor() {
  const queryClient = useQueryClient();
  
  const { data: forecast, isLoading } = useQuery({
    queryKey: ["forecast", 1],
    queryFn: () => getBusinessForecast(1),
  });

  const mutation = useMutation({
    mutationFn: (updates) => updateBusinessForecast(1, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forecast"] });
    },
  });

  const handleSave = (updates) => {
    mutation.mutate(updates);
  };

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {forecast && (
        <button onClick={() => handleSave({ annual_revenue_target: 1000000 })}>
          Update Target
        </button>
      )}
      {mutation.isPending && <p>Saving...</p>}
    </div>
  );
}
```

## Troubleshooting

### API Not Responding
1. Check that `VITE_XANO_API_BASE` is correctly set
2. Verify network connectivity
3. Check browser console for CORS errors

### Type Errors
- Ensure the data types in your service match the Xano API response
- Update the interface if Xano API schema changes

### Data Not Updating
- Use React Query's `queryClient.invalidateQueries()` after mutations
- Check that the correct ID is being used in PATCH/DELETE operations

## Next Steps

1. Create remaining service modules for other endpoints
2. Integrate services into your page components
3. Set up React Query for optimal data fetching
4. Add loading states and error handling to all data-dependent components
