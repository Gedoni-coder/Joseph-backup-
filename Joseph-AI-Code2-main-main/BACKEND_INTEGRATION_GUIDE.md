# Backend Integration Implementation Guide

**Purpose**: Practical guide with code examples for connecting frontend to backend endpoints  
**Target**: Developers implementing data flow connections  
**Last Updated**: 2025

---

## Table of Contents

1. [Architecture Diagram](#architecture-diagram)
2. [Data Flow Patterns](#data-flow-patterns)
3. [Module-by-Module Integration Guide](#module-by-module-integration-guide)
4. [Error Handling Patterns](#error-handling-patterns)
5. [Testing the Integration](#testing-the-integration)
6. [Deployment Configuration](#deployment-configuration)

---

## Architecture Diagram

### Current Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          FRONTEND (React)                            │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ Pages (e.g., BusinessForecast.tsx)                           │   │
│  │                                                              │   │
│  │  const data = useBusinessData()      // Hook call           │   │
│  │  return <Component data={data} />                           │   │
│  └─────────────────────┬────────────────────────────────────────┘   │
│                        │                                             │
│                        ▼                                             │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ Custom Data Hooks (useBusinessData.ts, etc.)                │   │
│  │                                                              │   │
│  │  1. useState for data state                                │   │
│  │  2. useEffect for initial fetch                           │   │
│  │  3. Methods for create/update/delete                      │   │
│  │  4. Error handling & loading states                       │   │
│  └─────────────────────┬────────────────────────────────────────┘   │
│                        │                                             │
│                        ▼ (HTTP fetch calls)                          │
│                   Environment Variables                              │
│          VITE_API_BASE_URL = http://localhost:8000                   │
│                        │                                             │
├────────────────────────┼──────────────────────────────────────────────┤
│ Network Boundary (HTTP)|                                              │
├────────────────────────┼──────────────────────────────────────────────┤
│                        │                                             │
│                        ▼                                             │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                  BACKEND (Django REST)                       │   │
│  │                                                              │   │
│  │  ┌──────────────────────────────────────────────────────┐   │   │
│  │  │ URL Router (backend_project/urls.py)               │   │   │
│  │  │                                                     │   │   │
│  │  │ /api/business/ → business_forecast.urls            │   │   │
│  │  │ /api/economic/ → economic_forecast.urls            │   │   │
│  │  │ /api/market/   → market_analysis.urls              │   │   │
│  │  │ ... (10 more modules)                              │   │   │
│  │  └──────────────┬──────────────────────────────────────┘   │   │
│  │                │                                            │   │
│  │                ▼                                            │   │
│  │  ┌──────────────────────────────────────────────────────┐   │   │
│  │  │ ViewSets (e.g., business_forecast/views.py)         │   │   │
│  │  │                                                      │   │   │
│  │  │ CustomerProfileViewSet:                            │   │   │
│  │  │   - list() → GET /api/business/customer-profiles/  │   │   │
│  │  │   - create() → POST /api/business/customer-...     │   │   │
│  │  │   - retrieve() → GET .../123/                      │   │   │
│  │  │   - update() → PUT .../123/                        │   │   │
│  │  │   - partial_update() → PATCH .../123/             │   │   │
│  │  │   - destroy() → DELETE .../123/                   │   │   │
│  │  └──────────────┬──────────────────────────────────────┘   │   │
│  │                │                                            │   │
│  │                ▼                                            │   │
│  │  ┌──────────────────────────────────────────────────────┐   │   │
│  │  │ Models & Database (business_forecast/models.py)      │   │   │
│  │  │                                                      │   │   │
│  │  │ CustomerProfile:                                    │   │   │
│  │  │   - id: UUID                                       │   │   │
│  │  │   - segment: String                                │   │   │
│  │  │   - demand_assumption: Float                       │   │   │
│  │  │   - ... other fields                               │   │   │
│  │  └──────────────────────────────────────────────────────┘   │   │
│  │                                                              │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  Data Persistence: SQLite (dev) / PostgreSQL (prod)                 │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Patterns

### Pattern 1: Simple GET with Mock Fallback (Current Implementation)

```typescript
// Hook File: src/hooks/useEconomicData.ts
export function useEconomicData(companyName?: string) {
  const [metrics, setMetrics] = useState<Record<string, EconomicMetric[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMetrics = useCallback(async (context?: string) => {
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      const endpoint = import.meta.env.VITE_ECONOMIC_API_ENDPOINT;
      const enabled = import.meta.env.VITE_ECONOMIC_API_ENABLED;

      if (!enabled || !baseUrl) {
        throw new Error("API not configured");
      }

      const url = context
        ? `${baseUrl}${endpoint}/metrics/?context=${context}`
        : `${baseUrl}${endpoint}/metrics/`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const grouped = groupByContext(data);
      setMetrics(grouped);
      return data;
    } catch (err) {
      console.error("Failed to fetch metrics:", err);
      setError(err as Error);
      // Fallback to mock data
      const mockData = getMockMetricsData();
      setMetrics(groupByContext(mockData));
      return mockData;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return {
    metrics,
    isLoading,
    error,
    refreshData: fetchMetrics,
  };
}
```

### Pattern 2: CRUD Operations (Create, Read, Update, Delete)

```typescript
// Hook File: src/hooks/useBusinessData.ts (to be updated)
export function useBusinessData() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // READ: Fetch all KPIs
  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${baseUrl}/api/business/kpis/`);

        if (!response.ok) {
          throw new Error(`Failed to fetch KPIs: ${response.statusText}`);
        }

        const data = await response.json();
        setKpis(Array.isArray(data) ? data : data.results || []);
      } catch (err) {
        setError(err as Error);
        setKpis([]); // Empty state on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchKPIs();
  }, [baseUrl]);

  // CREATE: Add new KPI
  const createKPI = async (kpiData: Omit<KPI, "id">) => {
    try {
      const response = await fetch(`${baseUrl}/api/business/kpis/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(kpiData),
      });

      if (!response.ok) {
        throw new Error(`Failed to create KPI: ${response.statusText}`);
      }

      const newKPI = await response.json();
      setKpis((prev) => [...prev, newKPI]);
      return newKPI;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  // UPDATE: Modify existing KPI (partial update)
  const updateKPI = async (id: string, updates: Partial<KPI>) => {
    try {
      const response = await fetch(`${baseUrl}/api/business/kpis/${id}/`, {
        method: "PATCH", // PATCH for partial update
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error(`Failed to update KPI: ${response.statusText}`);
      }

      const updated = await response.json();
      setKpis((prev) => prev.map((kpi) => (kpi.id === id ? updated : kpi)));
      return updated;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  // DELETE: Remove KPI
  const deleteKPI = async (id: string) => {
    try {
      const response = await fetch(`${baseUrl}/api/business/kpis/${id}/`, {
        method: "DELETE",
      });

      if (!response.ok && response.status !== 204) {
        throw new Error(`Failed to delete KPI: ${response.statusText}`);
      }

      setKpis((prev) => prev.filter((kpi) => kpi.id !== id));
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  return {
    kpis,
    isLoading,
    error,
    createKPI,
    updateKPI,
    deleteKPI,
  };
}
```

### Pattern 3: File Upload (FormData)

```typescript
// Component: src/components/business/documents-section.tsx
async function uploadDocument(file: File) {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  try {
    // Create FormData (required for file uploads)
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${baseUrl}/api/business/documents/`, {
      method: "POST",
      body: formData, // Don't set Content-Type header with FormData
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const document = await response.json();
    // Update UI with new document
    setDocuments((prev) => [...prev, document]);
    return document;
  } catch (err) {
    console.error("Document upload error:", err);
    throw err;
  }
}
```

### Pattern 4: Filtering & Query Parameters

```typescript
// Fetching with filters
async function fetchMetricsByContext(context: string) {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  try {
    // Build URL with query parameters
    const url = new URL(`${baseUrl}/api/economic/metrics/`);
    url.searchParams.append("context", context);
    url.searchParams.append("limit", "100"); // Pagination
    url.searchParams.append("offset", "0");

    const response = await fetch(url.toString());
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Fetch error:", err);
    return [];
  }
}
```

---

## Module-by-Module Integration Guide

### Module 1: Business Forecast

**Current Status**: Backend ready, Frontend using mock data

#### Step 1: Update Hook File

**File**: `src/hooks/useBusinessData.ts`

Replace the mock implementation with:

```typescript
import { useState, useEffect, useCallback } from "react";

interface CustomerProfile {
  id: string;
  segment: string;
  demand_assumption: number;
  growth_rate: number;
  retention: number;
  avg_order_value: number;
  seasonality: string;
}

interface RevenueProjection {
  id: string;
  period: string;
  projected: number;
  conservative: number;
  optimistic: number;
  actual_to_date: number;
  confidence: number;
}

interface KPI {
  id: string;
  name: string;
  current_value: number;
  target_value: number;
  unit: string;
  status: string;
}

export function useBusinessData() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "";

  // State
  const [customerProfiles, setCustomerProfiles] = useState<CustomerProfile[]>(
    [],
  );
  const [revenueProjections, setRevenueProjections] = useState<
    RevenueProjection[]
  >([]);
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch all data
  const fetchData = useCallback(async () => {
    if (!baseUrl) {
      console.warn("VITE_API_BASE_URL not configured");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const [profilesRes, projectionsRes, kpisRes] = await Promise.all([
        fetch(`${baseUrl}/api/business/customer-profiles/`),
        fetch(`${baseUrl}/api/business/revenue-projections/`),
        fetch(`${baseUrl}/api/business/kpis/`),
      ]);

      // Check all responses
      if (!profilesRes.ok || !projectionsRes.ok || !kpisRes.ok) {
        throw new Error("One or more API requests failed");
      }

      const [profilesData, projectionsData, kpisData] = await Promise.all([
        profilesRes.json(),
        projectionsRes.json(),
        kpisRes.json(),
      ]);

      // Handle paginated responses (DRF returns { results: [] } or just [])
      setCustomerProfiles(
        Array.isArray(profilesData) ? profilesData : profilesData.results || [],
      );
      setRevenueProjections(
        Array.isArray(projectionsData)
          ? projectionsData
          : projectionsData.results || [],
      );
      setKpis(Array.isArray(kpisData) ? kpisData : kpisData.results || []);
    } catch (err) {
      console.error("Failed to fetch business data:", err);
      setError(err as Error);
      // Clear states on error (or set to empty arrays)
      setCustomerProfiles([]);
      setRevenueProjections([]);
      setKpis([]);
    } finally {
      setIsLoading(false);
    }
  }, [baseUrl]);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Update KPI (PATCH request)
  const updateKPI = useCallback(
    async (id: string, value: number) => {
      if (!baseUrl) return;

      try {
        const response = await fetch(`${baseUrl}/api/business/kpis/${id}/`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ current_value: value }),
        });

        if (!response.ok) {
          throw new Error(`Failed to update KPI: ${response.statusText}`);
        }

        const updated = await response.json();
        setKpis((prev) => prev.map((kpi) => (kpi.id === id ? updated : kpi)));
      } catch (err) {
        console.error("Error updating KPI:", err);
        setError(err as Error);
      }
    },
    [baseUrl],
  );

  return {
    customerProfiles,
    revenueProjections,
    kpis,
    isLoading,
    error,
    updateKPI,
    refreshData: fetchData,
    reconnect: fetchData,
  };
}
```

#### Step 2: Test the Integration

1. **Start backend**:

```bash
cd backend
python manage.py runserver
```

2. **Start frontend**:

```bash
npm run dev
```

3. **Check browser DevTools**:

   - Network tab: Look for requests to `http://localhost:8000/api/business/`
   - Console: Check for any error messages

4. **Verify data loads**:
   - Open `http://localhost:5173` in browser
   - Navigate to Business Forecast page
   - Check if data displays (no more mock data)

---

### Module 2: Market Analysis

**File**: `src/hooks/useMarketData.ts`

```typescript
import { useState, useEffect, useCallback } from "react";

interface MarketSegment {
  id: string;
  name: string;
  tam: number; // Total Addressable Market
  sam: number; // Serviceable Addressable Market
  growth_rate: number;
  characteristics: Record<string, any>;
}

interface Competitor {
  id: string;
  name: string;
  market_segment: string;
  market_share: number;
  strengths: string;
  weaknesses: string;
  pricing_strategy: string;
}

export function useMarketData() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "";
  const [marketSegments, setMarketSegments] = useState<MarketSegment[]>([]);
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!baseUrl) return;

    try {
      setIsLoading(true);
      const [segmentsRes, competitorsRes] = await Promise.all([
        fetch(`${baseUrl}/api/market/market-segments/`),
        fetch(`${baseUrl}/api/market/competitors/`),
      ]);

      if (!segmentsRes.ok || !competitorsRes.ok) {
        throw new Error("Market API request failed");
      }

      const segmentsData = await segmentsRes.json();
      const competitorsData = await competitorsRes.json();

      setMarketSegments(
        Array.isArray(segmentsData) ? segmentsData : segmentsData.results || [],
      );
      setCompetitors(
        Array.isArray(competitorsData)
          ? competitorsData
          : competitorsData.results || [],
      );
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [baseUrl]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalTAM = marketSegments.reduce((sum, seg) => sum + seg.tam, 0);

  return {
    marketSegments,
    competitors,
    totalTAM,
    isLoading,
    error,
    refreshData: fetchData,
  };
}
```

---

### Module 3: Loan & Funding

**File**: `src/hooks/useLoanData.ts`

```typescript
import { useState, useEffect, useCallback } from "react";

interface FundingOption {
  id: string;
  type: string; // 'bank_loan', 'venture_capital', 'grant'
  provider: string;
  amount: number;
  interest_rate: number;
  term: number; // months
  description: string;
}

interface LoanComparison {
  id: string;
  option1_id: string;
  option2_id: string;
  analysis: Record<string, any>;
}

export function useLoanData() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "";
  const [fundingOptions, setFundingOptions] = useState<FundingOption[]>([]);
  const [loanComparisons, setLoanComparisons] = useState<LoanComparison[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!baseUrl) return;

    try {
      setIsLoading(true);
      const [optionsRes, comparisonsRes] = await Promise.all([
        fetch(`${baseUrl}/api/loan/funding-options/`),
        fetch(`${baseUrl}/api/loan/loan-comparisons/`),
      ]);

      if (!optionsRes.ok || !comparisonsRes.ok) {
        throw new Error("Loan API request failed");
      }

      const optionsData = await optionsRes.json();
      const comparisonsData = await comparisonsRes.json();

      setFundingOptions(
        Array.isArray(optionsData) ? optionsData : optionsData.results || [],
      );
      setLoanComparisons(
        Array.isArray(comparisonsData)
          ? comparisonsData
          : comparisonsData.results || [],
      );
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [baseUrl]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Create new funding option
  const addFundingOption = useCallback(
    async (optionData: Omit<FundingOption, "id">) => {
      try {
        const response = await fetch(`${baseUrl}/api/loan/funding-options/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(optionData),
        });

        if (!response.ok) throw new Error("Failed to create funding option");

        const newOption = await response.json();
        setFundingOptions((prev) => [...prev, newOption]);
        return newOption;
      } catch (err) {
        setError(err as Error);
        throw err;
      }
    },
    [baseUrl],
  );

  return {
    fundingOptions,
    loanComparisons,
    isLoading,
    error,
    addFundingOption,
    refreshData: fetchData,
  };
}
```

---

## Error Handling Patterns

### Pattern 1: Global Error Handler

Create a utility function for consistent error handling:

```typescript
// src/lib/api-error-handler.ts
export interface ApiError {
  status: number;
  message: string;
  details?: Record<string, any>;
}

export async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error: ApiError = {
      status: response.status,
      message: `HTTP ${response.status}: ${response.statusText}`,
    };

    // Try to parse error details from response body
    try {
      const body = await response.json();
      error.details = body;
    } catch {
      // If response body is not JSON, ignore
    }

    throw error;
  }

  try {
    return await response.json();
  } catch {
    throw new Error("Failed to parse response");
  }
}

// Usage in hook:
const data = await handleApiResponse<KPI[]>(
  await fetch(`${baseUrl}/api/business/kpis/`),
);
```

### Pattern 2: Retry Logic

```typescript
// src/lib/api-retry.ts
export async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  maxRetries: number = 3,
  delay: number = 1000,
): Promise<Response> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);

      // Don't retry on 4xx errors (user error)
      if (response.status >= 400 && response.status < 500) {
        return response;
      }

      // Retry on 5xx (server error) and network errors
      if (response.ok) return response;

      if (i < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)));
      }
    } catch (err) {
      if (i === maxRetries - 1) throw err;
      await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)));
    }
  }

  throw new Error(`Failed after ${maxRetries} retries`);
}
```

### Pattern 3: User-Friendly Error Messages

```typescript
// src/lib/error-messages.ts
export function getUserFriendlyMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 404) {
      return 'Resource not found'
    }
    if (error.status === 401) {
      return 'Please log in again'
    }
    if (error.status === 403) {
      return 'You do not have permission to access this'
    }
    if (error.status >= 500) {
      return 'Server error. Please try again later'
    }
  }

  if (error instanceof TypeError) {
    return 'Network error. Please check your connection'
  }

  return 'An unexpected error occurred'
}

// Usage:
catch (err) {
  const message = getUserFriendlyMessage(err)
  toast.error(message)
}
```

---

## Testing the Integration

### Test Checklist

- [ ] Backend server is running (`python manage.py runserver`)
- [ ] Frontend dev server is running (`npm run dev`)
- [ ] Environment variables are set correctly
- [ ] Network tab shows successful API requests (200/201 status)
- [ ] Data loads without errors
- [ ] Create/Update/Delete operations work
- [ ] Error states display correctly

### Manual Testing Steps

1. **Check Backend Endpoints**:

```bash
# In terminal, test endpoints directly
curl http://localhost:8000/api/business/kpis/
curl http://localhost:8000/api/market/market-segments/
curl http://localhost:8000/api/loan/funding-options/
```

2. **Check Frontend Network Calls**:

   - Open DevTools → Network tab
   - Interact with page
   - Verify requests to backend endpoints
   - Check response status and data

3. **Test Error Scenarios**:
   - Stop backend server
   - Check if frontend handles error gracefully
   - Verify fallback UI/messages

### Automated Testing Example

```typescript
// src/hooks/__tests__/useBusinessData.test.ts
import { renderHook, waitFor } from "@testing-library/react";
import { useBusinessData } from "../useBusinessData";

describe("useBusinessData", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it("fetches KPIs on mount", async () => {
    const mockKpis = [
      { id: "1", name: "Revenue", current_value: 100, target_value: 150 },
    ];

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockKpis,
    });

    const { result } = renderHook(() => useBusinessData());

    // Initially loading
    expect(result.current.isLoading).toBe(true);

    // Wait for data to load
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Check data
    expect(result.current.kpis).toEqual(mockKpis);
  });

  it("handles API errors gracefully", async () => {
    global.fetch.mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => useBusinessData());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBeDefined();
    expect(result.current.kpis).toEqual([]);
  });
});
```

---

## Deployment Configuration

### Environment Variables for Production

**Create `.env.production`**:

```bash
# Frontend
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_CHATBOT_BACKEND_URL=https://api.yourdomain.com
VITE_ECONOMIC_API_ENDPOINT=/api/economic
VITE_ECONOMIC_API_ENABLED=true
VITE_DEV_MODE=false

# Backend (Docker environment)
DJANGO_SECRET_KEY=your-secure-secret-key-here
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,api.yourdomain.com,www.yourdomain.com
DATABASE_URL=postgresql://user:password@host:5432/dbname
GEMINI_API_KEY=your-production-key
```

### Docker Deployment

**Dockerfile.frontend**:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ARG VITE_API_BASE_URL=https://api.yourdomain.com
ARG VITE_CHATBOT_BACKEND_URL=https://api.yourdomain.com
ARG VITE_ECONOMIC_API_ENABLED=true

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_CHATBOT_BACKEND_URL=$VITE_CHATBOT_BACKEND_URL
ENV VITE_ECONOMIC_API_ENABLED=$VITE_ECONOMIC_API_ENABLED

RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "preview"]
```

**docker-compose.yml**:

```yaml
version: "3.8"

services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: joseph_db
      POSTGRES_USER: joseph_user
      POSTGRES_PASSWORD: secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build:
      context: .
      dockerfile: Dockerfile
    command: >
      sh -c "python manage.py migrate &&
             python manage.py runserver 0.0.0.0:8000"
    environment:
      DEBUG: "False"
      DJANGO_SECRET_KEY: "your-secret-key"
      DATABASE_URL: "postgresql://joseph_user:secure_password@db:5432/joseph_db"
      ALLOWED_HOSTS: "localhost,127.0.0.1,api.yourdomain.com"
    ports:
      - "8000:8000"
    depends_on:
      - db

  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
      args:
        VITE_API_BASE_URL: "https://api.yourdomain.com"
        VITE_CHATBOT_BACKEND_URL: "https://api.yourdomain.com"
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  postgres_data:
```

---

## Troubleshooting Common Issues

### Issue 1: CORS Errors

**Error**: `Access to XMLHttpRequest at 'http://localhost:8000/api/...' from origin 'http://localhost:5173' has been blocked by CORS policy`

**Solution**:

Check `backend/backend_project/settings.py`:

```python
from corsheaders.defaults import default_headers

INSTALLED_APPS = [
    # ...
    'corsheaders',
    # ...
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    # ... other middleware
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://yourdomain.com",
]

CORS_ALLOW_CREDENTIALS = True
```

### Issue 2: API Returns 404

**Problem**: `GET /api/business/kpis/ 404 Not Found`

**Solution**:

1. Check backend is running: `python manage.py runserver`
2. Verify app is in `INSTALLED_APPS` in settings.py
3. Check `backend_project/urls.py` includes the app: `path('api/business/', include('business_forecast.urls'))`
4. Verify migrations: `python manage.py migrate`

### Issue 3: Data Not Persisting

**Problem**: Data created via POST request doesn't persist

**Solution**:

1. Verify database is running
2. Check migrations: `python manage.py makemigrations` → `python manage.py migrate`
3. Verify model has proper fields
4. Check serializer validation

### Issue 4: Incorrect Data Types

**Problem**: Numbers coming back as strings, dates in wrong format

**Solution**:

Update serializer in `backend/{module}/serializers.py`:

```python
from rest_framework import serializers
from .models import KPI

class KPISerializer(serializers.ModelSerializer):
    current_value = serializers.FloatField()  # Ensure float type
    target_value = serializers.FloatField()
    created_at = serializers.DateTimeField(format='iso-8601')  # ISO format

    class Meta:
        model = KPI
        fields = ['id', 'name', 'current_value', 'target_value', 'created_at']
```

---

## Summary Checklist

### For Each Module Integration:

- [ ] Verify backend endpoints exist and work (`curl` test)
- [ ] Check models and serializers in backend
- [ ] Update frontend hook file with actual API calls
- [ ] Replace mock data with `useState`
- [ ] Add `useEffect` for initial fetch
- [ ] Implement CRUD methods (create, update, delete)
- [ ] Add error handling and loading states
- [ ] Test with backend running
- [ ] Test error scenarios (network down, invalid data)
- [ ] Update environment variables for production
- [ ] Update documentation with actual status

### Expected Timeline

- Simple GET endpoints: 30 minutes per module
- With POST/PATCH/DELETE: 1-2 hours per module
- Error handling & testing: 1 hour per module
- **Total**: ~11-16 hours to fully integrate all 10+ modules

---

**End of Implementation Guide**
