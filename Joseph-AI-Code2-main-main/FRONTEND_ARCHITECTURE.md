# Frontend Architecture & Developer Guide

**Document**: Complete frontend structure, patterns, and conventions  
**Last Updated**: 2025  
**For**: Frontend developers building features

---

## Quick Navigation

- [Directory Structure](#directory-structure)
- [Pages Reference](#pages-reference)
- [Component System](#component-system)
- [Styling & Theme](#styling--theme)
- [Routing](#routing)
- [State Management](#state-management)
- [Data Fetching & Hooks](#data-fetching--hooks)
- [Best Practices & Patterns](#best-practices--patterns)
- [Common Tasks](#common-tasks)

---

## Directory Structure

```
src/
├── App.tsx                          # Root component & routing
├── main.tsx                         # Entry point
├── index.css                        # Global styles & CSS variables
├── vite-env.d.ts                    # Environment types
│
├── pages/                           # Page components (40+ files)
│   ├── Index.tsx                    # Economic dashboard
│   ├── BusinessForecast.tsx
│   ├── MarketCompetitiveAnalysis.tsx
│   ├── LoanFunding.tsx
│   ├── RevenueStrategy.tsx
│   ├── FinancialAdvisory.tsx
│   ├── InventorySupplyChain.tsx
│   ├── PricingStrategy.tsx
│   ├── TaxCompliance.tsx
│   ├── Landing.tsx                  # Product landing
│   ├── Onboarding.tsx               # Company setup
│   ├── Login.tsx / SignUp.tsx
│   ├── CompanySettings.tsx
│   ├── DocumentManager.tsx
│   ├── AllReports.tsx
│   ├── infrastructure/              # Infrastructure modules
│   │   ├── Networks.tsx
│   │   ├── Opportunities.tsx
│   │   └── ... (15+ more)
│   ├── learn/                       # Learning/LMS pages
│   │   ├── Learn.tsx
│   │   ├── LearnCourses.tsx
│   │   └── LearnRecords.tsx
│   └── ... (other pages)
│
├── components/
│   ├── ui/                          # Design system (40+ components)
│   │   ├── button.tsx               # Variants: default, secondary, ghost, etc.
│   │   ├── card.tsx                 # Container
│   │   ├── input.tsx                # Form input
│   │   ├── select.tsx               # Dropdown
│   │   ├── tabs.tsx                 # Tab navigation
│   │   ├── table.tsx                # Data table
│   │   ├── dialog.tsx               # Modal
│   │   ├── popover.tsx              # Tooltip
│   │   ├── module-header.tsx        # Module page header
│   │   ├── module-navigation.tsx    # Module tabs
│   │   ├── loading-spinner.tsx      # Loading indicator
│   │   ├── toast.tsx / toaster.tsx  # Notifications
│   │   ├── badge.tsx                # Tags/labels
│   │   ├── chart.tsx                # Chart wrapper
│   │   └── ... (30+ more)
│   │
│   ├── chatbot/                     # Chat & AI components
│   │   ├── chatbot-container.tsx    # Main chat UI
│   │   ├── chat-interface.tsx       # Message display
│   │   ├── agent-panel.tsx          # Agent controls
│   │   ├── tool-modal.tsx
│   │   └── tools-dock.tsx
│   │
│   ├── business/                    # Business domain
│   ├── market/                      # Market analysis
│   ├── competitive/                 # Competitive analysis
│   ├── financial/                   # Financial advisory
│   ├── loan/                        # Loan & funding
│   ├── revenue/                     # Revenue strategy
│   ├── inventory/                   # Inventory
│   ├── pricing/                     # Pricing strategy
│   ├── tax/                         # Tax compliance
│   ├── policy/                      # Policy analysis
│   ├── conversation/                # Conversation components
│   └── module/                      # Generic module components
│
├── hooks/                           # Custom React hooks
│   ├── useEconomicData.ts           # ✅ Connected to backend
│   ├── useChatbot.ts                # ✅ Connected to backend
│   ├── useAgent.ts                  # ✅ Connected to backend
│   ├── useBusinessData.ts           # ⚠️ Mock data
│   ├── useMarketData.ts
│   ├── useLoanData.ts
│   ├── useRevenueData.ts
│   ├── useFinancialAdvisoryData.ts
│   ├── useInventoryData.ts
│   ├── usePricingData.ts
│   ├── useTaxData.ts
│   ├── useConversationalMode.ts
│   ├── use-toast.ts                 # Toast store
│   └── use-mobile.tsx               # Mobile detection
│
└── lib/                             # Utilities & helpers
    ├── utils.ts                     # cn() utility
    ├── ai.ts                        # AI orchestration
    ├── app-context.ts               # App context getter
    ├── company-context.tsx          # Company info (Context + Hook)
    ├── auth-context.tsx             # Auth (Context + Hook)
    ├── web-scraper.ts               # URL fetching
    ├── api/
    │   ├── auth-service.ts          # Auth API calls
    │   └── accounts-service.ts      # Account API calls
    └── ... (mock data, generators, etc.)
```

---

## Pages Reference

### Module Dashboard Pages

All module pages follow the same pattern:

```typescript
import { ModuleHeader } from '@/components/ui/module-header'
import { ModuleNavigation } from '@/components/ui/module-navigation'

export function ModulePage() {
  const { data, isLoading, error } = useModuleData()

  return (
    <div className="space-y-6">
      <ModuleHeader title="Module Name" description="Short description" />
      <ModuleNavigation tabs={[...]} />
      {/* Content components */}
    </div>
  )
}
```

**Page → Hook → Components**:

| Page                      | Hook                                 | Components                                             | Route                          |
| ------------------------- | ------------------------------------ | ------------------------------------------------------ | ------------------------------ |
| Index                     | useEconomicData                      | MetricsDashboard, EconomicTable, ForecastPanel         | `/economic-indicators`         |
| BusinessForecast          | useBusinessData                      | RevenueProjections, KPIDashboard, CustomerProfile      | `/business-forecast`           |
| MarketCompetitiveAnalysis | useMarketData, useCompetitiveData    | MarketAnalysis, CompetitiveAnalysis                    | `/market-competitive-analysis` |
| LoanFunding               | useLoanData                          | LoanComparison, FundingStrategy, InvestorMatching      | `/loan-research`               |
| RevenueStrategy           | useRevenueData                       | RevenueStreams, ChurnAnalysis, RevenueForecasting      | `/revenue-forecasting`         |
| FinancialAdvisory         | useFinancialAdvisoryData             | BudgetValidation, CashFlowPlanning, RiskAssessment     | `/financial-advisory`          |
| InventorySupplyChain      | useInventoryData, useSupplyChainData | StockMonitoring, DemandForecasting                     | `/supply-chain-analytics`      |
| PricingStrategy           | usePricingData                       | PricingStrategies, CompetitiveAnalysis, DynamicPricing | `/pricing-strategies`          |
| TaxCompliance             | useTaxData                           | SmartTaxCalculator, ComplianceCalendar                 | `/tax-compliance`              |

### Special Pages

**Landing** (`/home`):

- Protected route (redirects to `/onboarding` if company not setup)
- Shows grid of all available modules
- Uses StaticContent + CardGrid

**Onboarding** (`/onboarding`):

- Company setup flow
- Multi-step form
- Saves to localStorage via useCompanyInfo

**Login/SignUp** (`/login`, `/signup`):

- Auth pages using auth-service
- Redirects to `/home` on success

**CompanySettings** (`/company-settings`):

- Edit company info
- Uses useCompanyInfo hook
- Updates localStorage

---

## Component System

### UI Component Library

Located in `src/components/ui/`, these are the building blocks for all pages.

#### Basic Components

**Button**:

```typescript
import { Button } from '@/components/ui/button'

// Variants: default, secondary, ghost, outline, destructive
<Button variant="primary">Click me</Button>
<Button size="sm" variant="outline">Small</Button>
<Button disabled>Disabled</Button>
```

**Card**:

```typescript
import { Card } from '@/components/ui/card'

<Card>
  <div className="p-6">
    <h3>Card Title</h3>
    <p>Card content</p>
  </div>
</Card>
```

**Input**:

```typescript
import { Input } from '@/components/ui/input'

<Input placeholder="Enter text..." type="text" />
<Input type="number" min="0" />
```

**Select**:

```typescript
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

<Select>
  <SelectTrigger>
    <SelectValue placeholder="Choose option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="opt1">Option 1</SelectItem>
    <SelectItem value="opt2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

**Tabs**:

```typescript
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content 1</TabsContent>
  <TabsContent value="tab2">Content 2</TabsContent>
</Tabs>
```

**Table**:

```typescript
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Column 1</TableHead>
      <TableHead>Column 2</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Data 1</TableCell>
      <TableCell>Data 2</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

#### Complex Components

**Dialog (Modal)**:

```typescript
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
    </DialogHeader>
    {/* Content */}
  </DialogContent>
</Dialog>
```

**ModuleHeader**:

```typescript
import { ModuleHeader } from '@/components/ui/module-header'

<ModuleHeader
  title="Market Analysis"
  description="Analyze market segments and competitors"
  breadcrumbs={[{ label: 'Home', href: '/home' }]}
/>
```

**ModuleNavigation**:

```typescript
import { ModuleNavigation } from '@/components/ui/module-navigation'

<ModuleNavigation
  tabs={[
    { label: 'Overview', value: 'overview' },
    { label: 'Analysis', value: 'analysis' },
  ]}
  onTabChange={(tab) => console.log(tab)}
/>
```

### Domain Components

Domain-specific components for each business area.

**Example: RevenueProjections Component**:

```typescript
// src/components/business/revenue-projections.tsx
import { Card } from '@/components/ui/card'
import { Chart } from '@/components/ui/chart'
import type { RevenueProjection } from '@/hooks/useBusinessData'

interface RevenueProjectionsProps {
  data: RevenueProjection[]
  isLoading?: boolean
  error?: Error | null
  onUpdate?: (id: string, value: number) => void
}

export function RevenueProjections({
  data,
  isLoading,
  error,
  onUpdate,
}: RevenueProjectionsProps) {
  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorAlert message={error.message} />

  return (
    <Card>
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Revenue Projections</h3>
        <Chart
          data={data}
          type="line"
          xAxis="period"
          yAxis="projected"
          series={[
            { key: 'projected', name: 'Projected', color: '#3b82f6' },
            { key: 'conservative', name: 'Conservative', color: '#ef4444' },
            { key: 'optimistic', name: 'Optimistic', color: '#10b981' },
          ]}
        />
        {data.map((projection) => (
          <div key={projection.id} className="mt-4 p-4 border rounded">
            <h4>{projection.period}</h4>
            <p>Projected: ${projection.projected}</p>
            <button onClick={() => onUpdate?.(projection.id, 100)}>
              Update
            </button>
          </div>
        ))}
      </div>
    </Card>
  )
}
```

---

## Styling & Theme

### CSS Variables & Theme Switching

**Available Colors** (in index.css):

```css
--primary           /* Main brand color */
--secondary         /* Secondary color */
--accent            /* Accent color */
--success           /* Success/positive state */
--warning           /* Warning state */
--destructive       /* Error/danger state */
--background        /* Page background */
--foreground        /* Text color */
--border            /* Border color */
--input             /* Input field background */
```

### Using Colors in Tailwind

```typescript
<div className="bg-primary text-primary-foreground">Primary Button</div>
<div className="bg-secondary text-secondary-foreground">Secondary Button</div>
<div className="bg-success text-white">Success Message</div>
<div className="border border-border">Bordered Element</div>
```

### Custom Styling Patterns

**Utility Function** (cn):

```typescript
import { cn } from '@/lib/utils'

<div className={cn(
  'px-4 py-2 rounded-lg',  // Base classes
  isActive && 'bg-primary', // Conditional
  className               // Override with prop
)}>
  Content
</div>
```

### Tailwind Configuration

Located in `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      background: 'hsl(var(--background))',
      primary: 'hsl(var(--primary))',
      // ...
    },
    borderRadius: {
      lg: 'var(--radius)',
      md: 'calc(var(--radius) - 2px)',
      sm: 'calc(var(--radius) - 4px)',
    },
  },
}
```

### Dark Mode

To enable dark theme:

```typescript
// Anywhere in your app
document.documentElement.classList.add("dark");

// To disable
document.documentElement.classList.remove("dark");

// Persist to localStorage
localStorage.setItem("theme", "dark");
```

CSS automatically switches colors based on `.dark` class in index.css.

---

## Routing

### Route Configuration (App.tsx)

```typescript
<BrowserRouter>
  <Routes>
    {/* Public routes */}
    <Route path="/" element={<PrimaryLanding />} />
    <Route path="/signup" element={<SignUp />} />
    <Route path="/login" element={<Login />} />

    {/* Protected routes */}
    <Route path="/home" element={<ProtectedHomeRoute />} />
    <Route path="/onboarding" element={<Onboarding />} />

    {/* Module routes */}
    <Route path="/economic-indicators" element={<Index />} />
    <Route path="/business-forecast" element={<BusinessForecast />} />
    {/* ... more module routes */}

    {/* Catch all */}
    <Route path="*" element={<NotFound />} />
  </Routes>
</BrowserRouter>
```

### Programmatic Navigation

```typescript
import { useNavigate } from 'react-router-dom'

function MyComponent() {
  const navigate = useNavigate()

  const goToHome = () => {
    navigate('/home')
  }

  const goBack = () => {
    navigate(-1)
  }

  return <button onClick={goToHome}>Go Home</button>
}
```

### Protected Routes

```typescript
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

// Usage
<Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
```

---

## State Management

### 1. Local Component State

For UI-specific state (toggles, form values, etc.):

```typescript
function MyComponent() {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '' })

  return (
    <dialog open={isOpen} onClose={() => setIsOpen(false)}>
      <input
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
    </dialog>
  )
}
```

### 2. Custom Hooks (Domain State)

For data specific to a module:

```typescript
// src/hooks/useBusinessData.ts
export function useBusinessData() {
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const updateKPI = async (id: string, value: number) => {
    // Update logic
  };

  return { kpis, isLoading, updateKPI };
}

// In page
function BusinessForecast() {
  const { kpis, updateKPI } = useBusinessData();
  // Use data and methods
}
```

### 3. React Context (App-Wide State)

For cross-component state:

```typescript
// src/lib/auth-context.tsx
interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const login = async (email: string, password: string) => {
    const user = await authService.login(email, password)
    setUser(user)
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be within AuthProvider')
  return context
}

// Usage
function LoginPage() {
  const { login } = useAuth()
  // ...
}
```

### 4. localStorage (Persistence)

For data that should survive page reloads:

```typescript
const STORAGE_KEY = "myapp:companyInfo";

export function useCompanyInfo() {
  const [info, setInfo] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  const updateInfo = (newInfo: Partial<CompanyInfo>) => {
    const updated = { ...info, ...newInfo };
    setInfo(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  return { info, updateInfo };
}
```

---

## Data Fetching & Hooks

### Hook Patterns

**Simple GET Hook**:

```typescript
export function useEconomicData() {
  const [data, setData] = useState<Metric[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refreshData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${baseUrl}/api/economic/metrics/`);
      if (!response.ok) throw new Error("Failed to fetch");
      const json = await response.json();
      setData(Array.isArray(json) ? json : json.results || []);
    } catch (err) {
      setError(err as Error);
      setData([]); // Fallback
    } finally {
      setIsLoading(false);
    }
  }, [baseUrl]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return { data, isLoading, error, refreshData };
}
```

**CRUD Hook**:

```typescript
export function useLoanData() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "";
  const [items, setItems] = useState<LoanOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // READ
  useEffect(() => {
    const fetch = async () => {
      const res = await fetch(`${baseUrl}/api/loan/funding-options/`);
      setItems(await res.json());
    };
    fetch();
  }, [baseUrl]);

  // CREATE
  const addItem = async (item: Omit<LoanOption, "id">) => {
    const res = await fetch(`${baseUrl}/api/loan/funding-options/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    const newItem = await res.json();
    setItems((prev) => [...prev, newItem]);
    return newItem;
  };

  // UPDATE
  const updateItem = async (id: string, updates: Partial<LoanOption>) => {
    const res = await fetch(`${baseUrl}/api/loan/funding-options/${id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    const updated = await res.json();
    setItems((prev) => prev.map((i) => (i.id === id ? updated : i)));
    return updated;
  };

  // DELETE
  const deleteItem = async (id: string) => {
    await fetch(`${baseUrl}/api/loan/funding-options/${id}/`, {
      method: "DELETE",
    });
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  return { items, isLoading, addItem, updateItem, deleteItem };
}
```

### Error Handling

**User-Friendly Errors**:

```typescript
function MyComponent() {
  const { data, error } = useMyData()

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded">
        <h3 className="font-semibold text-red-800">Error loading data</h3>
        <p className="text-red-600">{error.message}</p>
        <button onClick={() => location.reload()}>Try again</button>
      </div>
    )
  }

  return <div>{/* content */}</div>
}
```

**Fallback to Mock Data**:

```typescript
const fetchData = async () => {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("API error");
    return await res.json();
  } catch (err) {
    console.warn("API failed, using mock data");
    return getMockData(); // Fallback
  }
};
```

---

## Best Practices & Patterns

### 1. Component Composition

Break large components into smaller, reusable pieces:

```typescript
// Bad: One huge component
function Dashboard() {
  // 500 lines of code...
}

// Good: Composed from smaller pieces
function Dashboard() {
  return (
    <div>
      <DashboardHeader />
      <MetricsGrid />
      <ChartsSection />
      <DataTable />
    </div>
  )
}
```

### 2. Prop Drilling Prevention

Use Context or custom hooks to pass data deep without prop drilling:

```typescript
// Bad: Props going through many levels
<Page data={data}>
  <Section data={data}>
    <Component data={data} />
  </Section>
</Page>

// Good: Use hook
function Component() {
  const { data } = useAppData()
  return <div>{data}</div>
}
```

### 3. Type Safety

Always use TypeScript types:

```typescript
interface ComponentProps {
  title: string
  count: number
  onUpdate: (id: string, value: number) => void
  children?: React.ReactNode
}

export function MyComponent({ title, count, onUpdate, children }: ComponentProps) {
  return <div>{title}</div>
}
```

### 4. Error Boundaries

Wrap pages with error boundaries:

```typescript
<ErrorBoundary fallback={<ErrorPage />}>
  <YourPage />
</ErrorBoundary>
```

### 5. Loading States

Always handle loading state:

```typescript
if (isLoading) return <LoadingSpinner />
if (error) return <ErrorMessage error={error} />
return <Content data={data} />
```

### 6. Memoization

Use React.memo for expensive components:

```typescript
export const MetricCard = React.memo(function MetricCard({ data }: Props) {
  return (
    <Card>
      <h3>{data.name}</h3>
      <p>{data.value}</p>
    </Card>
  )
})
```

---

## Common Tasks

### Add a New Page

1. Create component in `src/pages/MyNewPage.tsx`:

```typescript
import { ModuleHeader } from '@/components/ui/module-header'
import { useMyData } from '@/hooks/useMyData'

export function MyNewPage() {
  const { data, isLoading } = useMyData()

  return (
    <div className="space-y-6">
      <ModuleHeader title="My Module" />
      {isLoading ? <LoadingSpinner /> : <Content data={data} />}
    </div>
  )
}
```

2. Add route in `src/App.tsx`:

```typescript
<Route path="/my-page" element={<MyNewPage />} />
```

3. Add navigation link in Landing.tsx or nav menu.

### Add a New Component

1. Create in `src/components/{domain}/MyComponent.tsx`:

```typescript
import { Card } from '@/components/ui/card'

interface MyComponentProps {
  data: SomeType[]
  onAction?: () => void
}

export function MyComponent({ data, onAction }: MyComponentProps) {
  return (
    <Card>
      {/* Component content */}
    </Card>
  )
}
```

2. Export from domain folder's index.ts (if exists)
3. Import and use in pages

### Add a New Hook

1. Create in `src/hooks/useMyHook.ts`:

```typescript
export function useMyHook() {
  const [data, setData] = useState<DataType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Fetch or initialize data
  }, []);

  return { data, isLoading };
}
```

2. Use in pages or components

### Connect Backend Data

1. Identify backend endpoint (e.g., `/api/business/kpis/`)
2. Update hook in `src/hooks/useBusinessData.ts`:

```typescript
const [kpis, setKpis] = useState<KPI[]>([]);

useEffect(() => {
  const fetch = async () => {
    const res = await fetch(`${baseUrl}/api/business/kpis/`);
    setKpis(await res.json());
  };
  fetch();
}, [baseUrl]);
```

3. Test with backend running

### Add Toast Notification

```typescript
import { useToast } from '@/hooks/use-toast'

function MyComponent() {
  const { toast } = useToast()

  const handleAction = () => {
    toast({
      title: 'Success',
      description: 'Action completed',
      variant: 'default', // or 'destructive'
    })
  }

  return <button onClick={handleAction}>Do Action</button>
}
```

---

## File Size Reference

For component organization:

- **Small Component**: < 100 lines (Button, Badge, Alert)
- **Medium Component**: 100-400 lines (Card with internal logic, Form)
- **Large Component**: 400-800 lines (Modal with form, complex Dashboard section)
- **Page Component**: 500-1500 lines (Full page with multiple sections)

If a component exceeds 800 lines, consider breaking it into smaller pieces.

---

**End of Frontend Architecture Guide**
