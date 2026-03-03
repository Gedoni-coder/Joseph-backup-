# Joseph AI - Complete API Documentation & Data Flow Mapping

**Project**: Joseph-AI-Code2-main  
**Last Updated**: 2025  
**Version**: 1.0

## Table of Contents

1. [Project Architecture Overview](#project-architecture-overview)
2. [Frontend Architecture](#frontend-architecture)
3. [Backend Module Structure](#backend-module-structure)
4. [Frontend Data Consumption](#frontend-data-consumption)
5. [Complete Data Flow Mapping](#complete-data-flow-mapping)
6. [Integration Status & Implementation Details](#integration-status--implementation-details)
7. [Environment Configuration](#environment-configuration)
8. [Quick Reference Guide](#quick-reference-guide)

---

## Project Architecture Overview

### Technology Stack

**Backend**:

- Django REST Framework
- Python with async support
- 11 main modules + 1 chatbot/agent system
- SQLite (development) / PostgreSQL (production recommended)

**Frontend**:

- React 18 with TypeScript
- React Router 6 (SPA mode)
- TailwindCSS 3 for styling
- Vite for bundling
- Custom hooks for data management (no Redux)

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                         │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐ │
│  │ Pages        │  │ Components   │  │ Custom Hooks         │ │
│  ├──────────────┤  ├──────────────┤  ├──────────────────────┤ │
│  │ Index.tsx    │  │ chatbot-     │  │ useEconomicData      │ │
│  │ Business...  │  │ container    │  │ useChatbot           │ │
│  │ Market...    │  │ module-      │  │ useAgent             │ │
│  │ Loan...      │  │ conversation │  │ useBusinessData      │ │
│  │ etc.         │  │ documents... │  │ useCompetitiveData   │ │
│  │              │  │              │  │ etc.                 │ │
│  └──────────────┘  └──────────────┘  └──────────────────────┘ │
│                                                                  │
│  State Management: useState/useContext (no Redux)               │
│  HTTP Client: fetch API with environment-configured base URLs   │
└─────────────────────────────────────────────────────────────────┘
                              │
                    (HTTP/REST Calls)
                              │
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (Django REST)                         │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Core Modules:                                            │   │
│  │                                                          │   │
│  │ /api/economic/    → Economic Forecast Module            │   │
│  │ /api/business/    → Business Forecast Module            │   │
│  │ /api/market/      → Market Analysis Module              │   │
│  │ /api/revenue/     → Revenue Strategy Module             │   │
│  │ /api/loan/        → Loan & Funding Module               │   │
│  │ /api/financial/   → Financial Advisory Module           │   │
│  │ /api/tax/         → Tax Compliance Module               │   │
│  │ /api/pricing/     → Pricing Strategy Module             │   │
│  │ /api/inventory/   → Inventory & Supply Chain Module     │   │
│  │ /api/policy/      → Policy & Compliance Module          │   │
│  │ /chatbot/         → Chatbot & Agent Module              │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  Data Persistence: SQLite / PostgreSQL                          │
└─────────────────────────────────────────────────────────────────┘
```

---

## Frontend Architecture

### Frontend Technology Stack

**Framework & Build Tools**:

- React 18 with TypeScript
- React Router 6 (SPA mode)
- Vite (bundler & dev server)
- TailwindCSS 3 (utility-first CSS)

**UI Components & Libraries**:

- Radix UI (accessible primitives)
- Class Variance Authority (CVA) (component variants)
- Lucide React (icons)
- Sonner (toast notifications)
- React Query (data caching - available but partially used)

**State Management**:

- React Hooks (useState, useEffect, useContext)
- Custom Hooks for domain data (useBusinessData, useEconomicData, etc.)
- React Context (Auth, Company Info)
- localStorage (persistence)

**HTTP Client**:

- Fetch API (no axios)
- Environment-based base URLs

### Frontend Directory Structure

```
src/
├── App.tsx                    # Root component with routing, providers
├── main.tsx                   # Entry point
├── index.css                  # Global styles, CSS variables, Tailwind directives
├── vite-env.d.ts             # Vite environment type definitions
│
├── pages/                     # Page components (~40+ pages)
│   ├── Index.tsx             # Economic indicators dashboard
│   ├── BusinessForecast.tsx   # Business forecasting page
│   ├── MarketCompetitiveAnalysis.tsx  # Market & competitive analysis
│   ├── LoanFunding.tsx        # Loan research hub
│   ├── RevenueStrategy.tsx    # Revenue forecasting
│   ├── FinancialAdvisory.tsx  # Financial planning
│   ├── InventorySupplyChain.tsx  # Inventory management
│   ├── PricingStrategy.tsx    # Pricing strategies
│   ├── TaxCompliance.tsx      # Tax & compliance
│   ├── Landing.tsx            # Product landing page
│   ├── Onboarding.tsx         # Company setup flow
│   ├── SignUp.tsx / Login.tsx # Authentication pages
│   ├── CompanySettings.tsx    # Settings page
│   ├── DocumentManager.tsx    # Document upload/management
│   ├── AllReports.tsx         # Reports dashboard
│   ├── infrastructure/        # Infrastructure module pages
│   ├── learn/                 # Learning/LMS pages
│   └── ...more pages
│
├── components/
│   ├── ui/                    # Design system components
│   │   ├── button.tsx         # Button component (with variants)
│   │   ├── card.tsx           # Card container
│   │   ├── input.tsx          # Input fields
│   │   ├── tabs.tsx           # Tab navigation
│   │   ├── table.tsx          # Data tables
│   │   ├── dialog.tsx         # Modal dialogs
│   │   ├── popover.tsx        # Popover tooltips
│   │   ├── module-header.tsx  # Module page header
│   │   ├── module-navigation.tsx  # Module nav tabs
│   │   ├── loading-spinner.tsx    # Loading indicator
│   │   ├── toast.tsx / toaster.tsx  # Toast notifications
│   │   ├── badge.tsx          # Badges/tags
│   │   ├── select.tsx         # Select/dropdown
│   │   ├── chart.tsx          # Chart wrapper
│   │   └── ...40+ more UI components
│   │
│   ├── chatbot/               # Chatbot & AI components
│   │   ├── chatbot-container.tsx  # Main chat UI
│   │   ├── chat-interface.tsx
│   │   ├── agent-panel.tsx    # Agent control panel
│   │   ├── tool-modal.tsx
│   │   ├── tools-dock.tsx
│   │   └── module-context-switcher.tsx
│   │
│   ├── business/              # Business forecast components
│   │   ├── customer-profile.tsx
│   │   ├── revenue-projections.tsx
│   │   ├── kpi-dashboard.tsx
│   │   ├── documents-section.tsx
│   │   ├── scenario-planning.tsx
│   │   └── ...more
│   │
│   ├── market/                # Market analysis components
│   │   ├── market-analysis.tsx
│   │   ├── report-notes.tsx
│   │   └── action-plan-dialog.tsx
│   │
│   ├── competitive/           # Competitive analysis components
│   │   ├── competitive-analysis.tsx
│   │   └── competitive-strategy.tsx
│   │
│   ├── financial/             # Financial advisory components
│   │   ├── budget-validation.tsx
│   │   ├── cash-flow-planning.tsx
│   │   ├── risk-assessment.tsx
│   │   ├── advisory-insights.tsx
│   │   └── ...more
│   │
│   ├── loan/                  # Loan & funding components
│   │   ├── loan-eligibility.tsx
│   │   ├── funding-options.tsx
│   │   ├── loan-comparison.tsx
│   │   ├── investor-matching.tsx
│   │   └── ...more
│   │
│   ├── revenue/               # Revenue strategy components
│   │   ├── revenue-streams.tsx
│   │   ├── churn-analysis.tsx
│   │   ├── revenue-forecasting.tsx
│   │   └── upsell-opportunities.tsx
│   │
│   ├── inventory/             # Inventory & supply chain components
│   │   ├── stock-monitoring.tsx
│   │   ├── demand-forecasting.tsx
│   │   ├── inventory-analytics.tsx
│   │   └── valuation-tracking.tsx
│   │
│   ├── policy/                # Policy analysis components
│   │   ├── external-policy-analysis.tsx
│   │   ├── internal-policy-analysis.tsx
│   │   ├── policy-watchtower.tsx
│   │   └── ...more
│   │
│   ├── pricing/               # Pricing strategy components
│   │   ├── pricing-strategies.tsx
│   │   ├── competitive-analysis.tsx
│   │   └── dynamic-pricing.tsx
│   │
│   ├── tax/                   # Tax compliance components
│   │   ├── smart-tax-calculator.tsx
│   │   ├── compliance-calendar.tsx
│   │   └── tax-recommendations.tsx
│   │
│   ├── conversation/          # Conversation components
│   │   └── module-conversation.tsx
│   │
│   └── module/                # Generic module components
│       ├── summary-section.tsx
│       └── recommendation-section.tsx
│
├── hooks/                     # Custom React hooks
│   ├── useEconomicData.ts     # Economic data hook (CONNECTED)
│   ├── useChatbot.ts          # Chatbot state & actions (CONNECTED)
│   ├── useAgent.ts            # Agent control (CONNECTED)
│   ├── useBusinessData.ts     # Business data (mock)
│   ├── useMarketData.ts       # Market data (mock)
│   ├── useCompetitiveData.ts  # Competitive data (mock)
│   ├── useLoanData.ts         # Loan data (mock)
│   ├── useRevenueData.ts      # Revenue data (mock)
│   ├── useFinancialAdvisoryData.ts  # Financial data (mock)
│   ├── useInventoryData.ts    # Inventory data (mock)
│   ├── useSupplyChainData.ts  # Supply chain data (mock)
│   ├── usePricingData.ts      # Pricing data (mock)
│   ├── useTaxData.ts          # Tax data (mock)
│   ├── usePolicyEconomicData.ts  # Policy data (mock)
│   ├── useConversationalMode.ts  # Conversation mode toggle
│   ├── use-toast.ts           # Toast notification store
│   └── use-mobile.tsx         # Mobile detection
│
├── lib/                       # Utilities & helpers
│   ├── utils.ts               # cn() utility (Tailwind merge)
│   ├── ai.ts                  # AI orchestration (Groq/OpenAI/Gemini)
│   ├── app-context.ts         # Get app context for AI grounding
│   ├── company-context.tsx    # Company info provider & hook
│   ├── auth-context.tsx       # Authentication provider & hook
│   ├── web-scraper.ts         # URL extraction & web page fetching
│   ├── web-search.ts          # Web search integration
│   ├── api/
│   │   ├── auth-service.ts    # Login/signup API calls
│   │   └── accounts-service.ts  # Account API calls
│   ├── *-data.ts files        # Mock data (business-forecast-data, economic-data, etc.)
│   ├── *-generator.ts files   # Generators (pdf-generator, business-plan-content-generator, etc.)
│   ├── feasibility.ts         # Business feasibility helpers
│   └── ...other helpers
│
└── vite-env.d.ts              # Environment variable types
```

### Pages Overview

**Dashboard Pages** (main entry points):

| Page                      | Route                          | Purpose                       | Data Hook                            | Status       |
| ------------------------- | ------------------------------ | ----------------------------- | ------------------------------------ | ------------ |
| Index                     | `/economic-indicators`         | Economic indicators dashboard | useEconomicData                      | ✅ Connected |
| BusinessForecast          | `/business-forecast`           | Business forecasting          | useBusinessData                      | ⚠️ Mock      |
| MarketCompetitiveAnalysis | `/market-competitive-analysis` | Market & competitive analysis | useMarketData, useCompetitiveData    | ⚠️ Mock      |
| LoanFunding               | `/loan-research`               | Loan research hub             | useLoanData                          | ⚠️ Mock      |
| RevenueStrategy           | `/revenue-forecasting`         | Revenue forecasting           | useRevenueData                       | ⚠️ Mock      |
| FinancialAdvisory         | `/financial-advisory`          | Financial planning & advisory | useFinancialAdvisoryData             | ⚠️ Mock      |
| InventorySupplyChain      | `/supply-chain-analytics`      | Inventory & supply chain      | useInventoryData, useSupplyChainData | ⚠️ Mock      |
| PricingStrategy           | `/pricing-strategies`          | Pricing strategies            | usePricingData                       | ⚠️ Mock      |
| TaxCompliance             | `/tax-compliance`              | Tax & regulatory compliance   | useTaxData                           | ⚠️ Mock      |

**Special Pages**:

| Page            | Route               | Purpose                             |
| --------------- | ------------------- | ----------------------------------- |
| Landing         | `/home` (protected) | Product landing & module navigation |
| Onboarding      | `/onboarding`       | Company setup flow                  |
| SignUp          | `/signup`           | User registration                   |
| Login           | `/login`            | User authentication                 |
| CompanySettings | `/company-settings` | Company info editor                 |
| DocumentManager | `/document-manager` | Document upload/library             |
| AllReports      | `/all-reports`      | Reports dashboard                   |
| ChatbotTest     | `/chatbot-test`     | AI testing playground               |

### UI Component Library

The app includes a comprehensive set of reusable UI components under `src/components/ui/`:

**Form Components**:

- Input, Textarea
- Select, MultiSelect
- Checkbox, RadioGroup, Switch
- Form (wrapper for react-hook-form)

**Layout Components**:

- Card (container)
- Button (with variants: primary, secondary, ghost, outline, destructive)
- Badge (tags/labels)
- Separator (divider)
- Sidebar, Drawer, Sheet
- Dialog (modal)
- Popover, HoverCard
- Tooltip

**Data Display**:

- Table (data tables with sorting/filtering)
- Chart (wrapper for chart libraries)
- Pagination
- Accordion
- Tabs
- Progress
- Breadcrumb

**Specialized**:

- ModuleHeader (page title + breadcrumbs + actions)
- ModuleNavigation (tabs for module sections)
- LoadingSpinner (loading indicator)
- ConnectionStatus (online/offline indicator)
- Speedometer (gauge visualization)
- NavigationMenu

**Notifications**:

- Toast (custom in-memory store in use-toast.ts)
- Toaster (renders toast stack)
- Sonner (alternative toast library)

### Component Patterns

**UI Component Pattern** (e.g., Button):

```typescript
// src/components/ui/button.tsx
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        outline: "border border-input bg-background hover:bg-accent",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
)
```

**Domain Component Pattern** (e.g., RevenueProjections):

```typescript
// src/components/business/revenue-projections.tsx
import { Card } from "@/components/ui/card"
import { Chart } from "@/components/ui/chart"
import type { RevenueProjection } from "@/hooks/useBusinessData"

interface RevenueProjectionsProps {
  data: RevenueProjection[]
  isLoading?: boolean
  onUpdate?: (id: string, value: number) => void
}

export function RevenueProjections({
  data,
  isLoading,
  onUpdate
}: RevenueProjectionsProps) {
  return (
    <Card>
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Revenue Projections</h3>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <Chart data={data} type="line" />
        )}
      </div>
    </Card>
  )
}
```

**Page Pattern** (e.g., BusinessForecast):

```typescript
// src/pages/BusinessForecast.tsx
import { useBusinessData } from "@/hooks/useBusinessData"
import { ModuleHeader } from "@/components/ui/module-header"
import { ModuleNavigation } from "@/components/ui/module-navigation"
import { RevenueProjections } from "@/components/business/revenue-projections"
import { KPIDashboard } from "@/components/business/kpi-dashboard"

export function BusinessForecast() {
  const {
    revenueProjections,
    kpis,
    isLoading,
    error,
    updateKPI
  } = useBusinessData()

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorAlert error={error} />

  return (
    <div className="space-y-6">
      <ModuleHeader
        title="Business Forecast"
        description="Revenue projections and KPI tracking"
      />

      <ModuleNavigation
        tabs={[
          { label: "Overview", value: "overview" },
          { label: "Projections", value: "projections" },
          { label: "KPIs", value: "kpis" },
        ]}
      />

      <RevenueProjections data={revenueProjections} />
      <KPIDashboard data={kpis} onUpdate={updateKPI} />
    </div>
  )
}
```

### Styling System

**Design Tokens** (src/index.css):

```css
@layer base {
  :root {
    /* Colors - HSL format for runtime theme switching */
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --accent: 217.2 91.2% 59.8%;
    --accent-foreground: 210 40% 98%;
    --success: 142.4 71.8% 29.2%;
    --warning: 38.6 92.1% 50.2%;
    --destructive: 0 84.2% 60.2%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    /* ...more dark mode variables */
  }
}

@layer components {
  .text-primary {
    @apply text-[hsl(var(--primary))];
  }
  /* Custom utility classes */
}

@tailwind base;
@tailwind components;
@tailwind utilities;
```

**TailwindCSS Configuration** (tailwind.config.ts):

```typescript
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: "hsl(var(--primary))",
        secondary: "hsl(var(--secondary))",
        // ...more colors
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
};
```

**Theme Switching**:

```typescript
// In components or hooks
function setTheme(theme: "light" | "dark") {
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
  localStorage.setItem("theme", theme);
}
```

### Routing System

**Route Configuration** (src/App.tsx):

```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/toaster'
import { AuthProvider } from '@/lib/auth-context'
import { CompanyInfoProvider } from '@/lib/company-context'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <CompanyInfoProvider>
            <BrowserRouter>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<PrimaryLanding />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<Login />} />

                {/* Protected routes */}
                <Route path="/home" element={<ProtectedHomeRoute />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/company-settings" element={<CompanySettings />} />

                {/* Module routes */}
                <Route path="/economic-indicators" element={<Index />} />
                <Route path="/business-forecast" element={<BusinessForecast />} />
                <Route path="/market-competitive-analysis" element={<MarketCompetitiveAnalysis />} />
                <Route path="/loan-research" element={<LoanFunding />} />
                <Route path="/revenue-forecasting" element={<RevenueStrategy />} />
                <Route path="/financial-advisory" element={<FinancialAdvisory />} />
                <Route path="/pricing-strategies" element={<PricingStrategy />} />
                <Route path="/supply-chain-analytics" element={<InventorySupplyChain />} />
                <Route path="/tax-compliance" element={<TaxCompliance />} />

                {/* Special routes */}
                <Route path="/document-manager" element={<DocumentManager />} />
                <Route path="/all-reports" element={<AllReports />} />

                {/* Infrastructure module routes */}
                {infraModules.map((module) => (
                  <Route
                    key={module}
                    path={`/infrastructure/${module}`}
                    element={
                      infraRouteComp[module] ?
                        React.createElement(infraRouteComp[module]) :
                        <InfraModulePage module={module} />
                    }
                  />
                ))}

                {/* Catch-all */}
                <Route path="*" element={<NotFound />} />
              </Routes>

              <ChatbotContainer />
              <Toaster />
            </BrowserRouter>
          </CompanyInfoProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  )
}

// Protected route example
function ProtectedHomeRoute() {
  const { isSetup } = useCompanyInfo()
  if (!isSetup) return <Navigate to="/onboarding" />
  return <Landing />
}
```

### State Management Patterns

**1. Local Component State**:

```typescript
function MyComponent() {
  const [count, setCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  // ...
}
```

**2. Custom Data Hook**:

```typescript
// src/hooks/useBusinessData.ts
export function useBusinessData() {
  const [kpis, setKpis] = useState<KPI[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const updateKPI = async (id: string, value: number) => {
    try {
      // Make API call or local update
      setKpis(prev => prev.map(k => k.id === id ? { ...k, current_value: value } : k))
    } catch (err) {
      setError(err as Error)
    }
  }

  useEffect(() => {
    // Initial fetch
  }, [])

  return { kpis, isLoading, error, updateKPI, refreshData: () => {} }
}

// Usage in page
function BusinessForecast() {
  const { kpis, updateKPI } = useBusinessData()
  return <KPIDashboard data={kpis} onUpdate={updateKPI} />
}
```

**3. React Context**:

```typescript
// src/lib/auth-context.tsx
interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  // ... state logic

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
```

**4. localStorage Persistence**:

```typescript
// Company info persisted to localStorage
const STORAGE_KEY = "joseph:companyInfo";

export function useCompanyInfo() {
  const [companyInfo, setCompanyInfo] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  const updateCompanyInfo = (info: Partial<CompanyInfo>) => {
    setCompanyInfo((prev) => {
      const updated = { ...prev, ...info };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  return { companyInfo, updateCompanyInfo, isSetup: !!companyInfo };
}
```

### Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      USER INTERACTION                        │
│                    (Click, Input, etc.)                     │
└──────────────────────────┬──────────────────────────────────┘
                           │
        ┌──────────────────┴──────────────────┐
        │                                     │
        ▼                                     ▼
  ┌──────────────┐                  ┌────────────────┐
  │  Component   │                  │  Custom Hook   │
  │  onClick()   │                  │  (Page level)  │
  └──────┬───────┘                  └────────┬───────┘
         │                                    │
         └──────────────────┬─────────────────┘
                            │
                 ┌──────────▼───────────┐
                 │  State Update        │
                 │  (useState)          │
                 └──────────┬───────────┘
                            │
         ┌──────────────────┼──────────────────┐
         │                  │                  │
         ▼                  ▼                  ▼
    ┌─────────┐        ┌────────┐        ┌──────────┐
    │ localStorage  │  │ Context │  │ Component    │
    │ (persistence) │  │ (shared) │  │ (local)      │
    └─────────┘        └────────┘        └──────────┘
         │                  │                  │
         └──────────────────┼──────────────────┘
                            │
                 ┌──────────▼───────────┐
                 │ Component Re-render   │
                 │ (with new state)      │
                 └──────────┬───────────┘
                            │
                            ▼
                    ┌───────────────┐
                    │  Updated UI   │
                    └───────────────┘
```

### Key Conventions

**File Naming**:

- Components: PascalCase (e.g., `BusinessForecast.tsx`)
- Utilities: camelCase (e.g., `utils.ts`, `web-scraper.ts`)
- Hooks: camelCase with `use` prefix (e.g., `useBusinessData.ts`)
- Page components: PascalCase (e.g., `Index.tsx`, `Landing.tsx`)

**Component Props**:

```typescript
interface ComponentProps {
  // Data props
  data: SomeType[];
  isLoading?: boolean;
  error?: Error | null;

  // Event handlers (on prefix)
  onClick?: () => void;
  onChange?: (value: string) => void;
  onUpdate?: (id: string, value: any) => void;

  // Style/Display
  className?: string;
  variant?: "default" | "secondary";

  // Children
  children?: React.ReactNode;
}
```

**Hook Return Value**:

```typescript
interface UseXDataReturn {
  // Data
  data: DataType[];

  // State
  isLoading: boolean;
  error: Error | null;
  isConnected?: boolean;

  // Methods
  refreshData: () => Promise<void>;
  reconnect?: () => Promise<void>;
  updateItem?: (id: string, value: any) => Promise<void>;
}
```

**Error Handling Pattern**:

```typescript
try {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = await response.json();
  setData(data);
} catch (err) {
  console.error("Error:", err);
  setError(err as Error);
  // Fallback to mock data or empty state
  setData([]);
} finally {
  setIsLoading(false);
}
```

---

## Backend Module Structure

### 1. Economic Forecast Module (`/api/economic/`)

**Purpose**: Store and serve economic metrics, news, forecasts, and events

**Endpoints**:

| HTTP Method | Endpoint                      | Handler                                | Purpose                       |
| ----------- | ----------------------------- | -------------------------------------- | ----------------------------- |
| GET         | `/api/economic/metrics/`      | EconomicMetricViewSet.list()           | Retrieve all economic metrics |
| POST        | `/api/economic/metrics/`      | EconomicMetricViewSet.create()         | Create new metric             |
| GET         | `/api/economic/metrics/{id}/` | EconomicMetricViewSet.retrieve()       | Get specific metric           |
| PUT         | `/api/economic/metrics/{id}/` | EconomicMetricViewSet.update()         | Update metric                 |
| PATCH       | `/api/economic/metrics/{id}/` | EconomicMetricViewSet.partial_update() | Partial metric update         |
| DELETE      | `/api/economic/metrics/{id}/` | EconomicMetricViewSet.destroy()        | Delete metric                 |
| GET         | `/api/economic/news/`         | EconomicNewsViewSet.list()             | Retrieve economic news        |
| POST        | `/api/economic/news/`         | EconomicNewsViewSet.create()           | Create news item              |
| GET         | `/api/economic/forecasts/`    | EconomicForecastViewSet.list()         | Get economic forecasts        |
| POST        | `/api/economic/forecasts/`    | EconomicForecastViewSet.create()       | Create forecast               |
| GET         | `/api/economic/events/`       | EconomicEventViewSet.list()            | Get economic events           |
| POST        | `/api/economic/events/`       | EconomicEventViewSet.create()          | Create event                  |

**Models**:

```python
# backend/economic_forecast/models.py
- EconomicMetric
  ├── id: UUID
  ├── context: String
  ├── name: String
  ├── value: Float
  ├── change: Float
  ├── unit: String
  ├── trend: String  # 'up', 'down', 'stable'
  └── category: String

- EconomicNews
  ├── id: UUID
  ├── context: String
  ├── title: String
  ├── summary: String
  ├── source: String
  ├── timestamp: DateTime
  ├── impact: String  # 'high', 'medium', 'low'
  └── category: String

- EconomicForecast
  ├── id: UUID
  ├── context: String
  ├── indicator: String
  ├── period: String
  ├── forecast: Float
  ├── confidence: Float
  ├── range_low: Float
  └── range_high: Float

- EconomicEvent
  ├── id: UUID
  ├── context: String
  ├── title: String
  ├── date: DateTime
  ├── description: String
  ├── impact: String
  └── category: String
```

**Frontend Integration**:

```typescript
// src/hooks/useEconomicData.ts
export function useEconomicData(companyName?: string) {
  // Fetches from backend endpoints
  const fetchMetrics = (context?: string)
    => GET /api/economic/metrics/?context={context}
  const fetchNews = (context?: string)
    => GET /api/economic/news/?context={context}
  const fetchForecasts = (context?: string)
    => GET /api/economic/forecasts/?context={context}
  const fetchEvents = (context?: string)
    => GET /api/economic/events/?context={context}

  return {
    metrics: Record<string, EconomicMetric[]>,  // Grouped by context
    news: Record<string, EconomicNews[]>,
    forecasts: Record<string, EconomicForecast[]>,
    events: Record<string, EconomicEvent[]>,
    lastUpdated: Date,
    isLoading: boolean,
    error: Error | null,
    isConnected: boolean,
    refreshData: (context?: string) => Promise<void>,
    reconnect: () => Promise<void>
  }
}
```

**Used By**:

- `src/pages/Index.tsx` - Main economic dashboard displays metrics, news, forecasts
- `src/hooks/useEconomicData.ts` - Direct hook for economic data

**Key Functions**:

- `groupByContext<T>(items: T[]): Record<string, T[]>` - Groups data by context field
- `getMockMetricsData()` - Fallback mock data when API unavailable
- `getMockNewsData()` - Fallback mock data
- `getMockForecastData()` - Fallback mock data
- `getMockEventData()` - Fallback mock data

---

### 2. Chatbot & Agent Module (`/chatbot/`)

**Purpose**: Conversational AI agent with autonomous task execution, knowledge management, and tool integration

**Endpoints**:

| HTTP Method | Endpoint                       | Handler                              | Purpose                                |
| ----------- | ------------------------------ | ------------------------------------ | -------------------------------------- |
| GET         | `/chatbot/messages/`           | ChatMessageViewSet.list()            | List chat messages                     |
| POST        | `/chatbot/messages/`           | ChatMessageViewSet.create()          | Create message                         |
| GET         | `/chatbot/conversations/`      | ModuleConversationViewSet.list()     | Get conversations                      |
| POST        | `/chatbot/conversations/`      | ModuleConversationViewSet.create()   | Create conversation                    |
| GET         | `/chatbot/conversations/{id}/` | ModuleConversationViewSet.retrieve() | Get specific conversation              |
| POST        | `/chatbot/module-chat/`        | module_chat()                        | Send chat message to module context    |
| POST        | `/chatbot/generate-response/`  | generate_response()                  | Generate AI response using Groq/Gemini |
| POST        | `/chatbot/agent/start/`        | agent_start()                        | Start autonomous agent                 |
| POST        | `/chatbot/agent/stop/`         | agent_stop()                         | Stop autonomous agent                  |
| GET         | `/chatbot/agent/status/`       | agent_status()                       | Get agent status                       |
| POST        | `/chatbot/agent/command/`      | agent_command()                      | Send command to agent                  |
| POST        | `/chatbot/agent/tool-call/`    | agent_tool_call()                    | Execute tool via agent                 |
| POST        | `/chatbot/agent/ingest-url/`   | agent_ingest_url()                   | Ingest web page content                |
| POST        | `/chatbot/agent/ingest-text/`  | agent_ingest_text()                  | Ingest text content                    |
| POST        | `/chatbot/agent/query/`        | agent_query()                        | Query agent for insights               |

**Models**:

```python
# backend/chatbot/models.py
- ModuleConversation
  ├── id: UUID
  ├── module: String  # e.g., 'market_analysis', 'business_forecast'
  ├── created_at: DateTime
  └── updated_at: DateTime

- ModuleConversationMessage
  ├── id: UUID
  ├── conversation: FK(ModuleConversation)
  ├── content: String
  ├── role: String  # 'user', 'assistant'
  └── timestamp: DateTime

- ChatMessage
  ├── id: UUID
  ├── content: String
  ├── role: String
  └── timestamp: DateTime

- ModuleContext
  ├── id: UUID
  ├── name: String
  ├── description: String
  └── tools: M2M(EconomicTool)

- EconomicTool
  ├── id: UUID
  ├── name: String
  ├── description: String
  └── action: String

- AgentTask
  ├── id: UUID
  ├── description: String
  ├── status: String  # 'pending', 'running', 'completed'
  └── result: JSON

- AgentMemory
  ├── id: UUID
  ├── key: String
  ├── value: JSON
  └── updated_at: DateTime

- AgentInsight
  ├── id: UUID
  ├── module: String
  ├── insight_text: String
  └── created_at: DateTime
```

**Frontend Integration**:

```typescript
// src/hooks/useAgent.ts
export function useAgent() {
  const startAgent = () => POST /chatbot/agent/start/
  const stopAgent = () => POST /chatbot/agent/stop/
  const getAgentStatus = () => GET /chatbot/agent/status/
  const addAgentTask = (task: any) => POST /chatbot/generate-response/

  return {
    isLoading: boolean,
    error: Error | null,
    status: AgentStatus,  // { is_running, last_updates, pending_tasks, ... }
    startAgent: () => Promise<void>,
    stopAgent: () => Promise<void>,
    getAgentStatus: () => Promise<AgentStatus>,
    addAgentTask: (task: any) => Promise<void>,
    clearError: () => void
  }
}

// src/hooks/useChatbot.ts
export function useChatbot() {
  const sendMessage = (content: string, context?: string) => {
    // Tries local AI first via generateAIResponse()
    // Falls back to POST /chatbot/generate-response/
    // May call POST /chatbot/agent/query/ for module knowledge
  }

  const explainElement = (description: string, data?: any) => {
    // Generate explanation for UI element
  }

  return {
    isOpen: boolean,
    isMinimized: boolean,
    messages: ChatMessage[],
    currentInput: string,
    isTyping: boolean,
    currentContext: ModuleContext,
    selectedTool: EconomicTool | null,
    sendMessage: (content: string, context?: string) => Promise<void>,
    explainElement: (desc: string, data?: any) => Promise<void>,
    switchContext: (contextId: string) => void,
    openTool: (tool: EconomicTool) => void,
    clearChat: () => void,
    setIsOpen: (open: boolean) => void,
    setIsMinimized: (minimized: boolean) => void
  }
}
```

**Autonomous Agent** (`backend/chatbot/agent.py`):

```python
class AutonomousAgent:
  def start(self) -> None
    # Starts background thread running _run_agent_loop()

  def stop(self) -> None
    # Stops agent thread

  def get_status(self) -> dict
    # Returns: { is_running, last_updates, pending_tasks, completed_tasks, memory_size }

  def add_task(self, task: dict) -> None
    # Queue task for execution

  def _run_agent_loop(self) -> None
    # Main agent loop: process tasks, execute tools, update modules

  def _execute_task(self, task: dict) -> dict
    # Execute individual task with tool calls

  def _execute_tool(self, tool_name: str, params: dict) -> dict
    # Execute registered tool (built-ins or custom)

  # Built-in tools:
  def _perform_web_search(self, query: str) -> list
  def _retrieve_information(self, module: str, query: str) -> dict
  def _update_module_data(self, module: str, data: dict) -> dict
  def _handle_user_request(self, request: str) -> str
  def _analyze_data(self, module: str) -> dict
  def _auto_update_modules(self) -> None
  def _handle_information_processing(self, info: dict) -> dict

# Exported instance
agent = AutonomousAgent()
```

**Used By**:

- `src/components/chatbot/chatbot-container.tsx` - Chat UI
- `src/components/chatbot/agent-panel.tsx` - Agent control panel
- `src/components/competitive/competitive-strategy.tsx` - Agent tasks
- `src/pages/Index.tsx` - Joseph AI live badge

**Key Functions**:

- `module_chat(request, module)` - Builds system prompt, calls Groq/Gemini, persists messages
- `generate_response(messages, context)` - General response generation
- `_build_knowledge_pack(module)` - Compile module knowledge for context
- `_groq_chat(messages, system, knowledge)` - Groq API call (optional)
- Gemini integration via `google.generativeai`

---

### 3. Business Forecast Module (`/api/business/`)

**Purpose**: Business forecasting - customer profiles, revenue projections, costs, cash flow, KPIs, scenarios

**Endpoints**:

| HTTP Method | Endpoint                                  | Handler                           | Purpose                           |
| ----------- | ----------------------------------------- | --------------------------------- | --------------------------------- |
| GET         | `/api/business/customer-profiles/`        | CustomerProfileViewSet.list()     | List customer profiles            |
| POST        | `/api/business/customer-profiles/`        | CustomerProfileViewSet.create()   | Create profile                    |
| GET         | `/api/business/revenue-projections/`      | RevenueProjectionViewSet.list()   | List revenue projections          |
| POST        | `/api/business/revenue-projections/`      | RevenueProjectionViewSet.create() | Create projection                 |
| GET         | `/api/business/cost-structures/`          | CostStructureViewSet.list()       | List cost structures              |
| POST        | `/api/business/cost-structures/`          | CostStructureViewSet.create()     | Create cost structure             |
| GET         | `/api/business/cash-flow-forecasts/`      | CashFlowForecastViewSet.list()    | List cash flow forecasts          |
| POST        | `/api/business/cash-flow-forecasts/`      | CashFlowForecastViewSet.create()  | Create forecast                   |
| GET         | `/api/business/kpis/`                     | KPIViewSet.list()                 | List KPIs                         |
| POST        | `/api/business/kpis/`                     | KPIViewSet.create()               | Create KPI                        |
| PATCH       | `/api/business/kpis/{id}/`                | KPIViewSet.partial_update()       | Update KPI value                  |
| GET         | `/api/business/scenario-plannings/`       | ScenarioPlanningViewSet.list()    | List scenarios                    |
| POST        | `/api/business/scenario-plannings/`       | ScenarioPlanningViewSet.create()  | Create scenario                   |
| GET         | `/api/business/documents/`                | DocumentViewSet.list()            | List documents                    |
| POST        | `/api/business/documents/`                | DocumentViewSet.create()          | Upload document                   |
| DELETE      | `/api/business/documents/{id}/`           | DocumentViewSet.destroy()         | Delete document                   |
| GET         | `/api/business/documents/list_documents/` | list_documents()                  | Custom action: list all documents |

**Models**:

```python
# backend/business_forecast/models.py
- Document
  ├── id: UUID
  └── file: FileField

- CustomerProfile
  ├── id: UUID
  ├── segment: String
  ├── demand_assumption: Float
  ├── growth_rate: Float
  ├── retention: Float
  ├── avg_order_value: Float
  └── seasonality: String

- RevenueProjection
  ├── id: UUID
  ├── period: String
  ├── projected: Float
  ├── conservative: Float
  ├── optimistic: Float
  ├── actual_to_date: Float
  └── confidence: Float

- CostStructure
  ├── id: UUID
  ├── category: String
  ├── type: String
  ├── amount: Float
  ├── percentage: Float
  ├── variability: String
  └── trend: String

- CashFlowForecast
  ├── id: UUID
  ├── period: String
  ├── inflow: Float
  ├── outflow: Float
  └── net_flow: Float

- KPI
  ├── id: UUID
  ├── name: String
  ├── current_value: Float
  ├── target_value: Float
  ├── unit: String
  └── status: String  # 'on_track', 'at_risk', 'off_track'

- ScenarioPlanning
  ├── id: UUID
  ├── name: String
  ├── description: String
  └── parameters: JSON
```

**Frontend Integration**:

```typescript
// src/hooks/useBusinessData.ts (MOCK DATA - Not connected to backend)
export function useBusinessData() {
  return {
    customerProfiles: CustomerProfile[],
    revenueProjections: RevenueProjection[],
    costStructures: CostStructure[],
    cashFlowForecasts: CashFlowForecast[],
    kpis: KPI[],
    scenarios: ScenarioPlanning[],
    updateKPI: (id: string, value: number) => void,
    updateScenario: (id: string, data: any) => void,
    refreshData: () => Promise<void>,
    reconnect: () => Promise<void>,
    error: Error | null,
    isLoading: boolean
  }
}
```

**Used By**:

- `src/pages/BusinessForecast.tsx` - Business forecast dashboard
- Components: RevenueProjections, KPIDashboard, CostAnalysis, CashFlowChart

**Key Functions**:

- DocumentViewSet.create() - Handles file upload via FormData
- DocumentViewSet.get_serializer_context() - Passes request context
- Document.delete() - Removes file from storage

---

### 4. Market Analysis Module (`/api/market/`)

**Purpose**: Market modeling - market segments, competitors, market trends

**Endpoints**:

| HTTP Method | Endpoint                       | Handler                       | Purpose              |
| ----------- | ------------------------------ | ----------------------------- | -------------------- |
| GET         | `/api/market/market-segments/` | MarketSegmentViewSet.list()   | List market segments |
| POST        | `/api/market/market-segments/` | MarketSegmentViewSet.create() | Create segment       |
| GET         | `/api/market/competitors/`     | CompetitorViewSet.list()      | List competitors     |
| POST        | `/api/market/competitors/`     | CompetitorViewSet.create()    | Add competitor       |
| GET         | `/api/market/market-trends/`   | MarketTrendViewSet.list()     | List trends          |
| POST        | `/api/market/market-trends/`   | MarketTrendViewSet.create()   | Create trend         |

**Models**:

```python
# backend/market_analysis/models.py
- MarketSegment
  ├── id: UUID
  ├── name: String
  ├── tam: Float  # Total Addressable Market
  ├── sam: Float  # Serviceable Addressable Market
  ├── growth_rate: Float
  └── characteristics: JSON

- Competitor
  ├── id: UUID
  ├── name: String
  ├── market_segment: FK(MarketSegment)
  ├── market_share: Float
  ├── strengths: String
  ├── weaknesses: String
  └── pricing_strategy: String

- MarketTrend
  ├── id: UUID
  ├── title: String
  ├── description: String
  ├── impact: String
  └── relevance_date: DateTime
```

**Frontend Integration**:

```typescript
// src/hooks/useMarketData.ts (MOCK DATA)
export function useMarketData() {
  return {
    marketSegments: MarketSegment[],
    competitors: Competitor[],
    marketTrends: MarketTrend[],
    totalTAM: number,
    refreshData: () => Promise<void>,
    isLoading: boolean,
    error: Error | null
  }
}

// src/hooks/useCompetitiveData.ts (MOCK DATA)
export function useCompetitiveData() {
  return {
    competitors: Competitor[],
    swotAnalyses: SWOTAnalysis[],
    strategyRecommendations: StrategyRecommendation[],
    refreshData: () => Promise<void>,
    isLoading: boolean
  }
}
```

**Used By**:

- `src/pages/MarketCompetitiveAnalysis.tsx` - Market and competitive analysis dashboard
- `src/pages/CompetitorWhitePaper.tsx` - Competitor analysis report
- `src/pages/SwotWhitePaper.tsx` - SWOT analysis report

---

### 5. Loan & Funding Module (`/api/loan/`)

**Purpose**: Loan and funding information - eligibility, options, comparisons, applications, investor matching

**Endpoints**:

| HTTP Method | Endpoint                      | Handler                         | Purpose                   |
| ----------- | ----------------------------- | ------------------------------- | ------------------------- |
| GET         | `/api/loan/loan-eligibility/` | LoanEligibilityViewSet.list()   | List eligibility criteria |
| POST        | `/api/loan/loan-eligibility/` | LoanEligibilityViewSet.create() | Create eligibility        |
| GET         | `/api/loan/funding-options/`  | FundingOptionViewSet.list()     | List funding options      |
| POST        | `/api/loan/funding-options/`  | FundingOptionViewSet.create()   | Add funding option        |
| GET         | `/api/loan/loan-fees/`        | LoanFeeViewSet.list()           | List loan fees            |
| POST        | `/api/loan/loan-fees/`        | LoanFeeViewSet.create()         | Add fee                   |
| GET         | `/api/loan/loan-comparisons/` | LoanComparisonViewSet.list()    | Compare loans             |
| POST        | `/api/loan/loan-comparisons/` | LoanComparisonViewSet.create()  | Create comparison         |
| GET         | `/api/loan/business-plans/`   | BusinessPlanViewSet.list()      | List business plans       |
| POST        | `/api/loan/business-plans/`   | BusinessPlanViewSet.create()    | Create plan               |
| GET         | `/api/loan/funding-strategy/` | FundingStrategyViewSet.list()   | List strategies           |
| POST        | `/api/loan/funding-strategy/` | FundingStrategyViewSet.create() | Create strategy           |
| GET         | `/api/loan/investor-matches/` | InvestorMatchViewSet.list()     | Find investor matches     |
| POST        | `/api/loan/investor-matches/` | InvestorMatchViewSet.create()   | Create match              |
| GET         | `/api/loan/watchlists/`       | WatchlistViewSet.list()         | List watchlists           |
| POST        | `/api/loan/watchlists/`       | WatchlistViewSet.create()       | Create watchlist          |

**Models**:

```python
# backend/loan_funding/models.py
- LoanEligibility
  ├── id: UUID
  ├── criteria: String
  ├── min_requirement: Float
  └── description: String

- FundingOption
  ├── id: UUID
  ├── type: String  # 'bank_loan', 'venture_capital', 'grant', etc.
  ├── provider: String
  ├── amount: Float
  ├── interest_rate: Float
  ├── term: Integer  # months
  └── description: String

- LoanFee
  ├── id: UUID
  ├── name: String
  ├── amount: Float
  └── description: String

- LoanComparison
  ├── id: UUID
  ├── option1: FK(FundingOption)
  ├── option2: FK(FundingOption)
  └── analysis: JSON

- BusinessPlan
  ├── id: UUID
  ├── title: String
  ├── description: String
  └── sections: M2M(BusinessPlanSection)

- FundingStrategy
  ├── id: UUID
  ├── name: String
  ├── description: String
  ├── timeline: FK(FundingTimeline)
  └── impact_analysis: JSON

- InvestorMatch
  ├── id: UUID
  ├── investor_profile: String
  ├── match_score: Float
  └── reason: String

- Watchlist
  ├── id: UUID
  ├── name: String
  └── items: M2M(FundingOption)
```

**Frontend Integration**:

```typescript
// src/hooks/useLoanData.ts (MOCK DATA)
export function useLoanData() {
  return {
    loanEligibility: LoanEligibility[],
    fundingOptions: FundingOption[],
    loanComparisons: LoanComparison[],
    businessPlans: BusinessPlan[],
    fundingStrategies: FundingStrategy[],
    investorMatches: InvestorMatch[],
    refreshData: () => Promise<void>,
    isLoading: boolean,
    error: Error | null
  }
}
```

**Used By**:

- `src/pages/LoanFunding.tsx` - Loan and funding dashboard

---

### 6. Revenue Strategy Module (`/api/revenue/`)

**Purpose**: Revenue modeling - streams, scenarios, churn, upsell, metrics, channels

**Endpoints**:

| HTTP Method | Endpoint                             | Handler                            | Purpose              |
| ----------- | ------------------------------------ | ---------------------------------- | -------------------- |
| GET         | `/api/revenue/revenue-streams/`      | RevenueStreamViewSet.list()        | List revenue streams |
| POST        | `/api/revenue/revenue-streams/`      | RevenueStreamViewSet.create()      | Create stream        |
| GET         | `/api/revenue/revenue-scenarios/`    | RevenueScenarioViewSet.list()      | List scenarios       |
| POST        | `/api/revenue/revenue-scenarios/`    | RevenueScenarioViewSet.create()    | Create scenario      |
| GET         | `/api/revenue/churn-analyses/`       | ChurnAnalysisViewSet.list()        | Analyze churn        |
| POST        | `/api/revenue/churn-analyses/`       | ChurnAnalysisViewSet.create()      | Create analysis      |
| GET         | `/api/revenue/upsell-opportunities/` | UpsellOpportunityViewSet.list()    | List opportunities   |
| POST        | `/api/revenue/upsell-opportunities/` | UpsellOpportunityViewSet.create()  | Add opportunity      |
| GET         | `/api/revenue/revenue-metrics/`      | RevenueMetricViewSet.list()        | Get metrics          |
| POST        | `/api/revenue/revenue-metrics/`      | RevenueMetricViewSet.create()      | Create metric        |
| GET         | `/api/revenue/channel-performances/` | ChannelPerformanceViewSet.list()   | Get channel data     |
| POST        | `/api/revenue/channel-performances/` | ChannelPerformanceViewSet.create() | Add channel data     |

**Models**:

```python
# backend/revenue_strategy/models.py
- RevenueStream
  ├── id: UUID
  ├── name: String
  ├── current_value: Float
  ├── growth_rate: Float
  └── description: String

- RevenueScenario
  ├── id: UUID
  ├── name: String
  ├── description: String
  └── parameters: JSON

- ChurnAnalysis
  ├── id: UUID
  ├── period: String
  ├── churn_rate: Float
  └── reasons: M2M(ChurnReason)

- UpsellOpportunity
  ├── id: UUID
  ├── customer_segment: String
  ├── potential_value: Float
  └── strategy: String

- RevenueMetric
  ├── id: UUID
  ├── name: String
  ├── value: Float
  └── unit: String

- ChannelPerformance
  ├── id: UUID
  ├── channel: String
  ├── revenue: Float
  └── efficiency: Float
```

**Frontend Integration**:

```typescript
// src/hooks/useRevenueData.ts (MOCK DATA)
export function useRevenueData() {
  return {
    revenueStreams: RevenueStream[],
    revenueScenarios: RevenueScenario[],
    churnAnalyses: ChurnAnalysis[],
    upsellOpportunities: UpsellOpportunity[],
    revenueMetrics: RevenueMetric[],
    channelPerformances: ChannelPerformance[],
    refreshData: () => Promise<void>,
    isLoading: boolean
  }
}
```

**Used By**:

- `src/pages/RevenueStrategy.tsx` - Revenue strategy dashboard

---

### 7. Financial Advisory Module (`/api/financial/`)

**Purpose**: Financial planning and analysis - budgets, cash flow, risk, performance, liquidity

**Endpoints**:

| HTTP Method | Endpoint                                | Handler                            | Purpose               |
| ----------- | --------------------------------------- | ---------------------------------- | --------------------- |
| GET         | `/api/financial/budget-forecasts/`      | BudgetForecastViewSet.list()       | List budget forecasts |
| POST        | `/api/financial/budget-forecasts/`      | BudgetForecastViewSet.create()     | Create budget         |
| GET         | `/api/financial/cash-flow-projections/` | CashFlowProjectionViewSet.list()   | List projections      |
| POST        | `/api/financial/cash-flow-projections/` | CashFlowProjectionViewSet.create() | Create projection     |
| GET         | `/api/financial/scenario-tests/`        | ScenarioTestViewSet.list()         | List tests            |
| POST        | `/api/financial/scenario-tests/`        | ScenarioTestViewSet.create()       | Create test           |
| GET         | `/api/financial/risk-assessments/`      | RiskAssessmentViewSet.list()       | List assessments      |
| POST        | `/api/financial/risk-assessments/`      | RiskAssessmentViewSet.create()     | Create assessment     |
| GET         | `/api/financial/performance-drivers/`   | PerformanceDriverViewSet.list()    | List drivers          |
| POST        | `/api/financial/performance-drivers/`   | PerformanceDriverViewSet.create()  | Create driver         |
| GET         | `/api/financial/advisory-insights/`     | AdvisoryInsightViewSet.list()      | Get insights          |
| POST        | `/api/financial/advisory-insights/`     | AdvisoryInsightViewSet.create()    | Add insight           |
| GET         | `/api/financial/liquidity-metrics/`     | LiquidityMetricViewSet.list()      | Get liquidity data    |
| POST        | `/api/financial/liquidity-metrics/`     | LiquidityMetricViewSet.create()    | Add metric            |

**Models**:

```python
# backend/financial_advisory/models.py
- BudgetForecast
  ├── id: UUID
  ├── period: String
  ├── planned: Float
  └── category: String

- CashFlowProjection
  ├── id: UUID
  ├── period: String
  ├── inflow: Float
  └── outflow: Float

- ScenarioTest
  ├── id: UUID
  ├── name: String
  ├── assumptions: JSON
  └── results: JSON

- RiskAssessment
  ├── id: UUID
  ├── risk_type: String
  ├── probability: Float
  └── impact: Float

- PerformanceDriver
  ├── id: UUID
  ├── name: String
  ├── current_value: Float
  └── target_value: Float

- AdvisoryInsight
  ├── id: UUID
  ├── title: String
  ├── description: String
  └── recommendation: String

- LiquidityMetric
  ├── id: UUID
  ├── name: String
  ├── value: Float
  └── threshold: Float
```

**Frontend Integration**:

```typescript
// src/hooks/useFinancialAdvisoryData.ts (MOCK DATA)
export function useFinancialAdvisoryData() {
  return {
    budgetForecasts: BudgetForecast[],
    cashFlowProjections: CashFlowProjection[],
    scenarioTests: ScenarioTest[],
    riskAssessments: RiskAssessment[],
    performanceDrivers: PerformanceDriver[],
    advisoryInsights: AdvisoryInsight[],
    liquidityMetrics: LiquidityMetric[],
    refreshData: () => Promise<void>,
    isLoading: boolean
  }
}
```

**Used By**:

- `src/pages/FinancialAdvisory.tsx` - Financial advisory dashboard

---

### 8. Pricing Strategy Module (`/api/pricing/`)

**Purpose**: Pricing configuration and forecasting

**Endpoints**:

| HTTP Method | Endpoint                        | Handler                       | Purpose             |
| ----------- | ------------------------------- | ----------------------------- | ------------------- |
| GET         | `/api/pricing/price-settings/`  | PriceSettingViewSet.list()    | List price settings |
| POST        | `/api/pricing/price-settings/`  | PriceSettingViewSet.create()  | Create setting      |
| GET         | `/api/pricing/pricing-rules/`   | PricingRuleViewSet.list()     | List rules          |
| POST        | `/api/pricing/pricing-rules/`   | PricingRuleViewSet.create()   | Create rule         |
| GET         | `/api/pricing/price-forecasts/` | PriceForecastViewSet.list()   | List forecasts      |
| POST        | `/api/pricing/price-forecasts/` | PriceForecastViewSet.create() | Create forecast     |
| GET         | `/api/pricing/status/`          | pricing_status()              | Get pricing status  |

**Models**:

```python
# backend/pricing_strategy/models.py
- PriceSetting
  ├── id: UUID
  ├── product: String
  ├── base_price: Float
  ├── currency: String
  └── effective_date: DateTime

- PricingRule
  ├── id: UUID
  ├── name: String
  ├── condition: String
  ├── action: String
  └── priority: Integer

- PriceForecast
  ├── id: UUID
  ├── period: String
  ├── forecast_price: Float
  └── confidence: Float
```

**Frontend Integration**:

```typescript
// src/hooks/usePricingData.ts (MOCK DATA)
export function usePricingData() {
  return {
    priceSettings: PriceSetting[],
    pricingRules: PricingRule[],
    priceForecasts: PriceForecast[],
    refreshData: () => Promise<void>,
    isLoading: boolean
  }
}
```

**Used By**:

- `src/pages/PricingStrategy.tsx` - Pricing strategy dashboard

---

### 9. Tax Compliance Module (`/api/tax/`)

**Purpose**: Tax filing and compliance tracking

**Endpoints**:

| HTTP Method | Endpoint                       | Handler                          | Purpose                      |
| ----------- | ------------------------------ | -------------------------------- | ---------------------------- |
| GET         | `/api/tax/`                    | tax_home()                       | API root with endpoints list |
| GET         | `/api/tax/tax-records/`        | TaxRecordViewSet.list()          | List tax records             |
| POST        | `/api/tax/tax-records/`        | TaxRecordViewSet.create()        | Create record                |
| GET         | `/api/tax/compliance-reports/` | ComplianceReportViewSet.list()   | List reports                 |
| POST        | `/api/tax/compliance-reports/` | ComplianceReportViewSet.create() | Create report                |

**Models**:

```python
# backend/tax_compliance/models.py
- TaxRecord
  ├── id: UUID
  ├── tax_type: String
  ├── amount: Float
  ├── due_date: DateTime
  └── filing_status: String

- ComplianceReport
  ├── id: UUID
  ├── report_type: String
  ├── title: String
  ├── findings: String
  ├── complianceScore: Float
  └── recommendations: String
```

**Frontend Integration**:

```typescript
// src/hooks/useTaxData.ts (MOCK DATA)
export function useTaxData() {
  return {
    taxRecords: TaxRecord[],
    complianceReports: ComplianceReport[],
    refreshData: () => Promise<void>,
    isLoading: boolean
  }
}
```

**Used By**:

- `src/pages/TaxCompliance.tsx` - Tax compliance dashboard

---

### 10. Policy & Compliance Module (`/api/policy/`)

**Purpose**: Policy tracking and impact assessment

**Endpoints**:

| HTTP Method | Endpoint                                | Handler                                | Purpose                |
| ----------- | --------------------------------------- | -------------------------------------- | ---------------------- |
| GET         | `/api/policy/external-policies/`        | ExternalPolicyViewSet.list()           | List external policies |
| POST        | `/api/policy/external-policies/`        | ExternalPolicyViewSet.create()         | Add policy             |
| GET         | `/api/policy/internal-policies/`        | InternalPolicyViewSet.list()           | List internal policies |
| POST        | `/api/policy/internal-policies/`        | InternalPolicyViewSet.create()         | Create policy          |
| GET         | `/api/policy/policy-reports/`           | PolicyReportViewSet.list()             | List reports           |
| POST        | `/api/policy/policy-reports/`           | PolicyReportViewSet.create()           | Create report          |
| GET         | `/api/policy/strategy-recommendations/` | StrategyRecommendationViewSet.list()   | Get recommendations    |
| POST        | `/api/policy/strategy-recommendations/` | StrategyRecommendationViewSet.create() | Add recommendation     |

**Models**:

```python
# backend/policy/models.py
- ExternalPolicy
  ├── id: UUID
  ├── title: String
  ├── description: String
  ├── implementation_date: DateTime
  └── impact: String

- InternalPolicy
  ├── id: UUID
  ├── name: String
  ├── content: String
  └── effective_date: DateTime

- PolicyReport
  ├── id: UUID
  ├── title: String
  ├── findings: String
  └── created_date: DateTime

- StrategyRecommendation
  ├── id: UUID
  ├── title: String
  ├── description: String
  └── implementation_priority: Integer
```

**Frontend Integration**:

```typescript
// src/hooks/usePolicyEconomicData.ts (MOCK DATA)
export function usePolicyEconomicData() {
  return {
    externalPolicies: ExternalPolicy[],
    internalPolicies: InternalPolicy[],
    policyReports: PolicyReport[],
    strategyRecommendations: StrategyRecommendation[],
    refreshData: () => Promise<void>,
    isLoading: boolean
  }
}
```

---

### 11. Inventory & Supply Chain Module (`/api/inventory/`)

**Purpose**: Inventory management, supply chain optimization, procurement

**Endpoints**:

| HTTP Method | Endpoint                               | Handler                            | Purpose          |
| ----------- | -------------------------------------- | ---------------------------------- | ---------------- |
| GET         | `/api/inventory/inventory-items/`      | InventoryItemViewSet.list()        | List items       |
| POST        | `/api/inventory/inventory-items/`      | InventoryItemViewSet.create()      | Add item         |
| GET         | `/api/inventory/stock-movements/`      | StockMovementViewSet.list()        | Track movements  |
| POST        | `/api/inventory/stock-movements/`      | StockMovementViewSet.create()      | Record movement  |
| GET         | `/api/inventory/demand-forecasts/`     | DemandForecastViewSet.list()       | Get forecasts    |
| POST        | `/api/inventory/demand-forecasts/`     | DemandForecastViewSet.create()     | Create forecast  |
| GET         | `/api/inventory/inventory-valuations/` | InventoryValuationViewSet.list()   | Get valuations   |
| POST        | `/api/inventory/inventory-valuations/` | InventoryValuationViewSet.create() | Create valuation |
| GET         | `/api/inventory/suppliers/`            | SupplierViewSet.list()             | List suppliers   |
| POST        | `/api/inventory/suppliers/`            | SupplierViewSet.create()           | Add supplier     |
| GET         | `/api/inventory/procurement-orders/`   | ProcurementOrderViewSet.list()     | List orders      |
| POST        | `/api/inventory/procurement-orders/`   | ProcurementOrderViewSet.create()   | Create order     |
| GET         | `/api/inventory/warehouse-operations/` | WarehouseOperationViewSet.list()   | Get operations   |
| POST        | `/api/inventory/warehouse-operations/` | WarehouseOperationViewSet.create() | Record operation |
| GET         | `/api/inventory/logistics-metrics/`    | LogisticsMetricViewSet.list()      | Get metrics      |
| POST        | `/api/inventory/logistics-metrics/`    | LogisticsMetricViewSet.create()    | Add metric       |
| GET         | `/api/inventory/disruption-risks/`     | DisruptionRiskViewSet.list()       | List risks       |
| POST        | `/api/inventory/disruption-risks/`     | DisruptionRiskViewSet.create()     | Add risk         |

**Models**:

```python
# backend/inventory_supply_chain/models.py
- InventoryItem
  ├── id: UUID
  ├── sku: String
  ├── name: String
  ├── quantity: Integer
  ├── reorder_point: Integer
  └── supplier: FK(Supplier)

- StockMovement
  ├── id: UUID
  ├── item: FK(InventoryItem)
  ├── movement_type: String
  ├── quantity: Integer
  └── date: DateTime

- DemandForecast
  ├── id: UUID
  ├── item: FK(InventoryItem)
  ├── period: String
  └── forecast_quantity: Integer

- Supplier
  ├── id: UUID
  ├── name: String
  ├── location: String
  ├── lead_time: Integer
  └── reliability_score: Float

- ProcurementOrder
  ├── id: UUID
  ├── supplier: FK(Supplier)
  ├── items: JSON
  ├── order_date: DateTime
  └── expected_delivery: DateTime

- WarehouseOperation
  ├── id: UUID
  ├── operation_type: String
  ├── items_involved: Integer
  └── timestamp: DateTime

- LogisticsMetric
  ├── id: UUID
  ├── metric_name: String
  ├── value: Float
  └── period: String

- DisruptionRisk
  ├── id: UUID
  ├── risk_type: String
  ├── probability: Float
  ├── impact: Float
  └── mitigation_strategy: String
```

**Frontend Integration**:

```typescript
// src/hooks/useInventoryData.ts & useSupplyChainData.ts (MOCK DATA)
export function useInventoryData() {
  return {
    inventoryItems: InventoryItem[],
    stockMovements: StockMovement[],
    demandForecasts: DemandForecast[],
    updateStockLevel: (itemId: string, quantity: number) => void,
    refreshData: () => Promise<void>,
    isLoading: boolean
  }
}

export function useSupplyChainData() {
  return {
    suppliers: Supplier[],
    procurementOrders: ProcurementOrder[],
    warehouseOperations: WarehouseOperation[],
    logisticsMetrics: LogisticsMetric[],
    disruptionRisks: DisruptionRisk[],
    refreshData: () => Promise<void>,
    isLoading: boolean
  }
}
```

**Used By**:

- `src/pages/InventorySupplyChain.tsx` - Inventory and supply chain dashboard

---

## Frontend Data Consumption

### Data Hooks Architecture

Frontend uses **custom React hooks** for all data management. No Redux/MobX. State is local with optional persistence via localStorage.

#### Active Network Hooks (Real Backend Calls)

1. **useEconomicData** (`src/hooks/useEconomicData.ts`)

   - Calls: `/api/economic/metrics/`, `/api/economic/news/`, `/api/economic/forecasts/`, `/api/economic/events/`
   - Used by: `Index.tsx`
   - Fallback: Mock data when API unavailable

2. **useChatbot** (`src/hooks/useChatbot.ts`)

   - Calls: `/chatbot/generate-response/`, `/chatbot/agent/query/`, `/chatbot/module-chat/`, `/chatbot/agent/command/`
   - Used by: `chatbot-container.tsx`, chat-related components
   - Fallback: Local AI generation via `generateAIResponse()` from `src/lib/ai.ts`

3. **useAgent** (`src/hooks/useAgent.ts`)

   - Calls: `/chatbot/agent/start/`, `/chatbot/agent/stop/`, `/chatbot/agent/status/`
   - Used by: `agent-panel.tsx`, `competitive-strategy.tsx`
   - Fallback: Error state with retry capability

4. **module-conversation** (`src/components/conversation/module-conversation.tsx`)

   - Calls: `GET /chatbot/conversations/?module={module}`, `POST /chatbot/conversations/`, `POST /chatbot/module-chat/`
   - Direct API calls (not in hook)
   - Fallback: Creates local conversation object if API fails

5. **documents-section** (`src/components/business/documents-section.tsx`)
   - Calls: `GET /api/business/documents/`, `POST /api/business/documents/` (FormData), `DELETE /api/business/documents/{id}/`
   - Direct API calls
   - Fallback: Local mock document entry

#### Mock Data Hooks (Local Simulation)

All other domain hooks simulate real-time data updates via `setInterval`:

- `useBusinessData` - Simulates revenue, KPI updates
- `useMarketData` - Simulates market metrics
- `useCompetitiveData` - Simulates competitor data changes
- `useRevenueData` - Simulates revenue stream changes
- `useInventoryData` - Simulates stock level changes
- `useLoanData` - Loan and funding data
- `usePricingData` - Pricing data
- `useFinancialAdvisoryData` - Financial metrics
- `useTaxData` - Tax records and compliance
- `usePolicyEconomicData` - Policy data

### Frontend State Management

```typescript
// No global state library - everything is local
// Pattern: Hook-based with optional Context for cross-app state

// Auth Context (src/lib/auth-context.tsx)
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
  getMe: () => Promise<void>;
}

// Conversational Mode Context (src/hooks/useConversationalMode.ts)
export interface ConversationalModeContext {
  conversationalMode: boolean;
  setConversationalMode: (mode: boolean) => void;
}
```

---

## Complete Data Flow Mapping

### Economic Data Flow Example

```
User navigates to Index.tsx
    ↓
Index.tsx calls useEconomicData()
    ↓
Hook checks environment variables:
  - VITE_API_BASE_URL
  - VITE_ECONOMIC_API_ENDPOINT
  - VITE_ECONOMIC_API_ENABLED
    ↓
If enabled and API configured:
  ├→ GET {API_BASE_URL}/metrics/ → EconomicMetricViewSet.list()
  ├→ GET {API_BASE_URL}/news/ → EconomicNewsViewSet.list()
  ├→ GET {API_BASE_URL}/forecasts/ → EconomicForecastViewSet.list()
  └→ GET {API_BASE_URL}/events/ → EconomicEventViewSet.list()
    ↓
Responses are grouped by context using groupByContext()
    ↓
State updated: metrics, news, forecasts, events
    ↓
Components re-render with data
    ↓
If API fails:
  └→ Fall back to mock data (getMockMetricsData, etc.)
  └→ isConnected set to false
  └→ User sees warning about API unavailability
```

### Chatbot/Agent Flow Example

```
User opens chat in chatbot-container.tsx
    ↓
Calls useChatbot() hook
    ↓
User types message → sendMessage()
    ↓
First, try local AI generation:
  ├→ generateAIResponse() from src/lib/ai.ts
  └→ If response good enough, display locally (fast)
    ↓
If local fails or needs backend:
  ├→ POST /chatbot/generate-response/ with message
  ├→ Backend receives request
  ├→ module_chat() in backend/chatbot/views.py processes it
  ├→ Tries _groq_chat() if GROQ_API_KEY available (fast)
  ├→ Falls back to Google Gemini (via google.generativeai)
  └→ Returns response
    ↓
Agent commands (starting with /agent):
  ├→ POST /chatbot/agent/command/ with command text
  └→ Agent processes it via backend/chatbot/agent.py
    ↓
Agent responses displayed in chat UI
    ↓
User can open tools via agent or manually
```

### Business Data Flow Example

```
User navigates to BusinessForecast.tsx
    ↓
Page calls useBusinessData()
    ↓
Hook initializes mock data from src/lib/business-data.ts
    ↓
Hook sets up setInterval to simulate real-time updates:
  - Every 5 seconds: KPIs update with small random deltas
  - Every 10 seconds: Revenue projections update
  - Every 8 seconds: Customer profiles refresh
    ↓
Components subscribe to hook state:
  ├→ RevenueProjections component
  ├→ KPIDashboard component
  ├→ CostAnalysis component
  └→ CashFlowChart component
    ↓
When user clicks "Update KPI":
  └→ updateKPI(id, newValue) updates hook state
  └→ Component re-renders with new data
    ↓
NOTE: Currently NOT connected to backend
To connect:
  1. Replace mock data with API calls to /api/business/* endpoints
  2. Store data in useState instead of local constants
  3. Use useEffect to fetch on component mount
```

---

## Integration Status & Implementation Details

### Current Implementation Status

| Module                   | Backend Endpoints    | Frontend Hook                        | Status       | Notes                              |
| ------------------------ | -------------------- | ------------------------------------ | ------------ | ---------------------------------- |
| Economic Forecast        | ✅ Fully implemented | useEconomicData                      | ✅ CONNECTED | Environment variable controlled    |
| Chatbot & Agent          | ✅ Fully implemented | useChatbot, useAgent                 | ✅ CONNECTED | Groq/Gemini fallback               |
| Business Forecast        | ✅ Fully implemented | useBusinessData                      | ⚠️ MOCK      | Backend ready, frontend using mock |
| Market Analysis          | ✅ Fully implemented | useMarketData                        | ⚠️ MOCK      | Backend ready, frontend using mock |
| Loan & Funding           | ✅ Fully implemented | useLoanData                          | ⚠️ MOCK      | Backend ready, frontend using mock |
| Revenue Strategy         | ✅ Fully implemented | useRevenueData                       | ⚠️ MOCK      | Backend ready, frontend using mock |
| Financial Advisory       | ✅ Fully implemented | useFinancialAdvisoryData             | ⚠️ MOCK      | Backend ready, frontend using mock |
| Pricing Strategy         | ✅ Fully implemented | usePricingData                       | ⚠️ MOCK      | Backend ready, frontend using mock |
| Tax Compliance           | ✅ Fully implemented | useTaxData                           | ⚠️ MOCK      | Backend ready, frontend using mock |
| Policy & Compliance      | ✅ Fully implemented | usePolicyEconomicData                | ⚠️ MOCK      | Backend ready, frontend using mock |
| Inventory & Supply Chain | ✅ Fully implemented | useInventoryData, useSupplyChainData | ⚠️ MOCK      | Backend ready, frontend using mock |

### Backend API Server Configuration

**Location**: `backend/backend_project/`

**Files**:

- `urls.py` - Main URL router (mounts all app endpoints)
- `settings.py` - Django configuration
- `wsgi.py` - WSGI application

**Available Management Commands** (for data seeding):

```bash
# Business Forecast
python manage.py load_ecommerce_demo

# Economic Forecast
python manage.py populate_economic_metrics
python manage.py populate_economic_news
python manage.py populate_economic_forecasts
python manage.py populate_economic_events

# Loan Funding
python manage.py populate_loan_data

# Other modules have similar commands
```

### Frontend API Client Configuration

**Environment Variables** (`.env` or system environment):

```bash
# Frontend API base URL
VITE_API_BASE_URL=http://localhost:8000
VITE_API_BASE_URL=https://api.yourdomain.com  # Production

# Economic data endpoint path
VITE_ECONOMIC_API_ENDPOINT=/api/economic

# Toggle economic API
VITE_ECONOMIC_API_ENABLED=true

# Chatbot backend (separate server possible)
VITE_CHATBOT_BACKEND_URL=http://localhost:8000
VITE_CHATBOT_BACKEND_URL=https://api.yourdomain.com  # Production

# Auth endpoints
VITE_AUTH_API_BASE=http://localhost:8000
VITE_ACCOUNTS_API_BASE=http://localhost:8000

# Development mode flag
VITE_DEV_MODE=true
```

**Key Files**:

- `src/hooks/useEconomicData.ts` - Reads VITE_API_BASE_URL, VITE_ECONOMIC_API_ENDPOINT, VITE_ECONOMIC_API_ENABLED
- `src/hooks/useChatbot.ts` - Reads VITE_CHATBOT_BACKEND_URL
- `src/hooks/useAgent.ts` - Reads VITE_CHATBOT_BACKEND_URL
- `src/lib/api/auth-service.ts` - Reads VITE_AUTH_API_BASE
- `src/lib/api/accounts-service.ts` - Reads VITE_ACCOUNTS_API_BASE

---

## Environment Configuration

### Development Setup

```bash
# Backend
cd backend
export DJANGO_SECRET_KEY=dev-secret-key
export DEBUG=True
export ALLOWED_HOSTS=localhost,127.0.0.1
python manage.py migrate
python manage.py runserver

# Frontend (in another terminal)
npm install
npm run dev
# Access at http://localhost:5173
# API calls go to http://localhost:8000
```

### Production Deployment

```bash
# Using Docker Compose
cp .env.example .env

# Edit .env with production values:
# - VITE_API_BASE_URL=https://api.yourdomain.com
# - VITE_CHATBOT_BACKEND_URL=https://api.yourdomain.com
# - DJANGO_SECRET_KEY=<secure-random-key>
# - DEBUG=False

docker-compose up --build
```

### Environment Variables Summary

| Variable                   | Purpose             | Default               | Required   |
| -------------------------- | ------------------- | --------------------- | ---------- |
| VITE_API_BASE_URL          | Backend API base    | http://localhost:8000 | Yes        |
| VITE_ECONOMIC_API_ENDPOINT | Economic API path   | /api/economic         | Yes        |
| VITE_ECONOMIC_API_ENABLED  | Toggle economic API | true                  | No         |
| VITE_CHATBOT_BACKEND_URL   | Chatbot API         | http://localhost:8000 | Yes        |
| VITE_AUTH_API_BASE         | Auth API            | http://localhost:8000 | No         |
| VITE_ACCOUNTS_API_BASE     | Accounts API        | http://localhost:8000 | No         |
| VITE_DEV_MODE              | Enable dev logging  | false                 | No         |
| DJANGO_SECRET_KEY          | Django secret       | -                     | Yes (prod) |
| DEBUG                      | Django debug mode   | True                  | Yes        |
| ALLOWED_HOSTS              | CORS hosts          | localhost,127.0.0.1   | Yes        |
| GEMINI_API_KEY             | Google Gemini API   | -                     | No         |
| GROQ_API_KEY               | Groq API (optional) | -                     | No         |

---

## Quick Reference Guide

### Module-by-Module Summary

#### 1. Economic Forecast Module

- **Backend Path**: `backend/economic_forecast/`
- **API Prefix**: `/api/economic/`
- **Resources**: metrics, news, forecasts, events
- **Frontend**: `useEconomicData()` hook, connected
- **CRUD Operations**: Full CRUD on all resources
- **Query Params**: `context=` to filter by context

#### 2. Business Forecast Module

- **Backend Path**: `backend/business_forecast/`
- **API Prefix**: `/api/business/`
- **Resources**: customer-profiles, revenue-projections, cost-structures, cash-flow-forecasts, kpis, scenario-plannings, documents
- **Frontend**: `useBusinessData()` hook (mock data)
- **Special**: Document upload with FormData, file storage, deletion

#### 3. Market Analysis Module

- **Backend Path**: `backend/market_analysis/`
- **API Prefix**: `/api/market/`
- **Resources**: market-segments, competitors, market-trends
- **Frontend**: `useMarketData()` hook (mock data)

#### 4. Loan & Funding Module

- **Backend Path**: `backend/loan_funding/`
- **API Prefix**: `/api/loan/`
- **Resources**: loan-eligibility, funding-options, loan-fees, loan-comparisons, business-plans, funding-strategy, investor-matches, watchlists
- **Frontend**: `useLoanData()` hook (mock data)
- **Special**: LoanComparison includes related LoanFee objects

#### 5. Revenue Strategy Module

- **Backend Path**: `backend/revenue_strategy/`
- **API Prefix**: `/api/revenue/`
- **Resources**: revenue-streams, revenue-scenarios, churn-analyses, upsell-opportunities, revenue-metrics, channel-performances
- **Frontend**: `useRevenueData()` hook (mock data)

#### 6. Financial Advisory Module

- **Backend Path**: `backend/financial_advisory/`
- **API Prefix**: `/api/financial/`
- **Resources**: budget-forecasts, cash-flow-projections, scenario-tests, risk-assessments, performance-drivers, advisory-insights, liquidity-metrics
- **Frontend**: `useFinancialAdvisoryData()` hook (mock data)

#### 7. Pricing Strategy Module

- **Backend Path**: `backend/pricing_strategy/`
- **API Prefix**: `/api/pricing/`
- **Resources**: price-settings, pricing-rules, price-forecasts
- **Frontend**: `usePricingData()` hook (mock data)
- **Special**: `/api/pricing/status/` endpoint for health check

#### 8. Tax Compliance Module

- **Backend Path**: `backend/tax_compliance/`
- **API Prefix**: `/api/tax/`
- **Resources**: tax-records, compliance-reports
- **Frontend**: `useTaxData()` hook (mock data)
- **Special**: Root endpoint `/api/tax/` returns API documentation

#### 9. Policy & Compliance Module

- **Backend Path**: `backend/policy/`
- **API Prefix**: `/api/policy/`
- **Resources**: external-policies, internal-policies, policy-reports, economic-indicators, internal-impacts, strategy-recommendations
- **Frontend**: `usePolicyEconomicData()` hook (mock data)

#### 10. Inventory & Supply Chain Module

- **Backend Path**: `backend/inventory_supply_chain/`
- **API Prefix**: `/api/inventory/`
- **Resources**: inventory-items, stock-movements, demand-forecasts, inventory-valuations, suppliers, procurement-orders, warehouse-operations, logistics-metrics, disruption-risks, sustainability-metrics
- **Frontend**: `useInventoryData()`, `useSupplyChainData()` hooks (mock data)

#### 11. Chatbot & Agent Module

- **Backend Path**: `backend/chatbot/`
- **API Prefix**: `/chatbot/`
- **Resources**: messages, conversations, module-conversations, economic-tools
- **Frontend**: `useChatbot()`, `useAgent()` hooks (connected)
- **Special**: Autonomous agent with task queue, Groq/Gemini AI, web ingestion

### Common API Patterns

**Standard REST Pattern** (for all modules except special cases):

```bash
# List all resources
GET /api/{module}/{resource}/

# Get single resource
GET /api/{module}/{resource}/{id}/

# Create resource
POST /api/{module}/{resource}/
Content-Type: application/json
{ "field": "value" }

# Update (full)
PUT /api/{module}/{resource}/{id}/
Content-Type: application/json
{ "field": "value" }

# Update (partial)
PATCH /api/{module}/{resource}/{id}/
Content-Type: application/json
{ "field": "new-value" }

# Delete
DELETE /api/{module}/{resource}/{id}/
```

**Special Cases**:

```bash
# Economic API with context filtering
GET /api/economic/metrics/?context=local

# Business Document upload
POST /api/business/documents/
Content-Type: multipart/form-data
file=<binary-data>

# Chatbot module chat
POST /chatbot/module-chat/
{ "message": "text", "module": "market_analysis" }

# Agent commands
POST /chatbot/agent/start/
POST /chatbot/agent/stop/
GET /chatbot/agent/status/

# Pricing status
GET /api/pricing/status/
# Returns: { "status": "ok", "models_count": {...} }
```

### Data Flow Checklist

To connect a module from mock to real backend:

1. ✅ Verify backend module exists in `backend/{module_name}/`
2. ✅ Check `backend_project/urls.py` for route (should be `/api/{prefix}/`)
3. ✅ Review backend models in `{module}/models.py`
4. ✅ Check ViewSet in `{module}/views.py` for custom actions
5. ✅ Update frontend hook in `src/hooks/use{ModuleName}Data.ts`:
   - Replace mock data with API calls
   - Use `useState` for data state
   - Use `useEffect` with cleanup
   - Implement error handling
   - Ensure proper TypeScript types
6. ✅ Add/update environment variables if needed
7. ✅ Test locally with backend running
8. ✅ Update documentation

---

## Next Steps for Full Backend Integration

### High Priority (Necessary for full functionality):

1. **Economic Data** - ✅ Already connected
2. **Chatbot/Agent** - ✅ Already connected
3. **Business Forecast** - Connect all endpoints
4. **Market Analysis** - Connect all endpoints
5. **Loan & Funding** - Connect all endpoints

### Medium Priority:

6. **Revenue Strategy** - Connect endpoints
7. **Financial Advisory** - Connect endpoints
8. **Inventory & Supply Chain** - Connect endpoints

### Low Priority (Can remain mock for now):

9. **Pricing Strategy** - Connect endpoints
10. **Tax Compliance** - Connect endpoints
11. **Policy & Compliance** - Connect endpoints

---

## Troubleshooting

### Common Issues

| Issue                                  | Solution                                                                  |
| -------------------------------------- | ------------------------------------------------------------------------- |
| API calls return 404                   | Check backend server is running on correct port, URL env vars are correct |
| CORS errors                            | Ensure Django CORS_ALLOWED_ORIGINS includes frontend URL                  |
| Environment variables not loading      | Check `.env` file in root directory, restart dev server                   |
| Mock data showing instead of real data | Check if API is reachable, check browser console for fetch errors         |
| Agent not responding                   | Verify Gemini API key set (GEMINI_API_KEY), check backend logs            |

### Debugging Tips

1. Check browser DevTools Network tab for actual API requests
2. Check Django server logs: `python manage.py runserver`
3. Verify environment variables: `echo $VITE_API_BASE_URL`
4. Test endpoints directly: `curl http://localhost:8000/api/economic/metrics/`
5. Enable VITE_DEV_MODE=true for additional logging

---

## Document Metadata

- **Document Version**: 1.0
- **Last Updated**: 2025
- **Created For**: Joseph-AI-Code2 project
- **Backend Framework**: Django REST Framework
- **Frontend Framework**: React 18 + TypeScript
- **Modules Documented**: 11 backend modules + chatbot
- **Total Endpoints**: 100+ REST endpoints
- **Status**: Complete architectural documentation with full endpoint mapping

---

**End of Documentation**
