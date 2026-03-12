import React, { useState, createContext, useContext } from "react";
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { ChatbotContainer } from "./components/chatbot/chatbot-container";
import "./lib/demo-explainable-elements";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  Link,
  useLocation,
  Navigate,
} from "react-router-dom";
import { Radio, Moon, Sun, Settings, DollarSign } from "lucide-react";
import { Switch } from "./components/ui/switch";
import { ThemeProvider, useTheme } from "./lib/theme-context";
import { CurrencyProvider, useCurrency, CURRENCIES } from "./lib/currency-context";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "./components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import { Separator } from "./components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./components/ui/breadcrumb";
import Landing from "./pages/Landing";
import PrimaryLanding from "./pages/PrimaryLanding";
import Index from "./pages/Index";
import BusinessForecast from "./pages/BusinessForecast";
import TaxCompliance from "./pages/TaxCompliance";
import PricingStrategy from "./pages/PricingStrategy";
import RevenueStrategy from "./pages/RevenueStrategy";
import MarketCompetitiveAnalysis from "./pages/MarketCompetitiveAnalysis";
import MarketReportView from "./pages/MarketReportView";
import SwotWhitePaper from "./pages/SwotWhitePaper";
import CompetitorWhitePaper from "./pages/CompetitorWhitePaper";
import LoanFunding from "./pages/LoanFunding";
import InventorySupplyChain from "./pages/InventorySupplyChain";
import FinancialAdvisory from "./pages/FinancialAdvisory";
import PolicyEconomicAnalysis from "./pages/PolicyEconomicAnalysis";
import BusinessFeasibility from "./pages/BusinessFeasibility";
import BusinessFeasibilityIdea from "./pages/BusinessFeasibilityIdea";
import BusinessPlanning from "./pages/BusinessPlanning";
import BusinessPlanningFlow from "./pages/BusinessPlanningFlow";
import BusinessPlanningFromFeasibility from "./pages/BusinessPlanningFromFeasibility";
import BusinessPlansList from "./pages/BusinessPlansList";
import ImpactCalculator from "./pages/ImpactCalculator";
import AiInsights from "./pages/AiInsights";
import DocumentManager from "./pages/DocumentManager";
import GrowthPlanning from "./pages/GrowthPlanning";
import AllReports from "./pages/AllReports";
import Notifications from "./pages/Notifications";
import PolicyAlerts from "./pages/PolicyAlerts";
import StrategyBuilder from "./pages/StrategyBuilder";
import RiskManagement from "./pages/RiskManagement";
import ComplianceReports from "./pages/ComplianceReports";
import AuditReports from "./pages/AuditReports";
import AuditTrail from "./pages/AuditTrail";
import DocumentUpload from "./pages/DocumentUpload";
import DocumentProcessing from "./pages/DocumentProcessing";
import NotFound from "./pages/NotFound";
import Infrastructure from "./pages/Infrastructure";
import Networks from "./pages/infrastructure/Networks";
import Opportunities from "./pages/infrastructure/Opportunities";
import ValueExchangeChannels from "./pages/infrastructure/ValueExchangeChannels";
import KnowledgeFlows from "./pages/infrastructure/KnowledgeFlows";
import GovernanceTrustMechanisms from "./pages/infrastructure/GovernanceTrustMechanisms";
import SocialCapitalInclusion from "./pages/infrastructure/SocialCapitalInclusion";
import CultureOfCollaboration from "./pages/infrastructure/CultureOfCollaboration";
import PolicyIntegrationLayer from "./pages/infrastructure/PolicyIntegrationLayer";
import DataEconomyLayer from "./pages/infrastructure/DataEconomyLayer";
import InfrastructureMappingEngine from "./pages/infrastructure/InfrastructureMappingEngine";
import AnalyticsMetricsEngine from "./pages/infrastructure/AnalyticsMetricsEngine";
import MarketAccessLayer from "./pages/infrastructure/MarketAccessLayer";
import FundingLayer from "./pages/infrastructure/FundingLayer";
import BusinessIntelligenceLayer from "./pages/infrastructure/BusinessIntelligenceLayer";
import SupportSystems from "./pages/infrastructure/SupportSystems";
import OpportunitiesMarketplace from "./pages/infrastructure/OpportunitiesMarketplace";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import CompanySettings from "./pages/CompanySettings";
import UserSettings from "./pages/UserSettings";
import Learn from "./pages/learn/Learn";
import { CompanyInfoProvider } from "./lib/company-context";
import LearnDiscover from "./pages/learn/LearnDiscover";
import LearnCourses from "./pages/learn/LearnCourses";
import LearnCourseGenerate from "./pages/learn/LearnCourseGenerate";
import LearnCourseView from "./pages/learn/LearnCourseView";
import LearnQuizzes from "./pages/learn/LearnQuizzes";
import LearnRecords from "./pages/learn/LearnRecords";
import SalesIntelligence from "./pages/SalesIntelligence";
import ChatbotTest from "./pages/ChatbotTest";
import { useCompanyInfo } from "./lib/company-context";
import { AuthProvider } from "./lib/auth-context";
import { useSyncCurrency } from "./hooks/useSyncCurrency";

const queryClient = new QueryClient();

interface ConversationalModeContextType {
  conversationalMode: boolean;
  onConversationalModeChange: (enabled: boolean) => void;
}

const ConversationalModeContext = createContext<
  ConversationalModeContextType | undefined
>(undefined);

export const useConversationalMode = () => {
  const context = useContext(ConversationalModeContext);
  if (!context) {
    throw new Error(
      "useConversationalMode must be used within ConversationalModeProvider",
    );
  }
  return context;
};

const infraModules = [
  { slug: "networks", name: "Networks" },
  { slug: "jobs", name: "Jobs" },
  { slug: "opportunities", name: "Opportunities" },
  { slug: "services", name: "Services" },
  { slug: "support-systems", name: "Support Systems" },
  { slug: "value-exchange-channels", name: "Value Exchange Channels" },
  { slug: "knowledge-flows", name: "Knowledge Flows" },
  {
    slug: "governance-trust-mechanisms",
    name: "Governance & Trust Mechanisms",
  },
  { slug: "social-capital-inclusion", name: "Social Capital & Inclusion" },
  { slug: "culture-of-collaboration", name: "Culture of Collaboration" },
  { slug: "business-intelligence-layer", name: "Business Intelligence Layer" },
  { slug: "policy-integration-layer", name: "Policy Integration Layer" },
  { slug: "data-economy-layer", name: "Data Economy Layer" },
  { slug: "funding-layer", name: "Funding Layer" },
  { slug: "market-access-layer", name: "Market Access Layer" },
  {
    slug: "infrastructure-mapping-engine",
    name: "Infrastructure Mapping Engine",
  },
  { slug: "education-training-layer", name: "Education & Training Layer" },
  { slug: "analytics-metrics-engine", name: "Analytics & Metrics Engine" },
  {
    slug: "community-governance-council",
    name: "Community Governance Council",
  },
];

const infraRouteComp = {
  networks: Networks,
  opportunities: Opportunities,
  "value-exchange-channels": ValueExchangeChannels,
  "knowledge-flows": KnowledgeFlows,
  "governance-trust-mechanisms": GovernanceTrustMechanisms,
  "social-capital-inclusion": SocialCapitalInclusion,
  "culture-of-collaboration": CultureOfCollaboration,
  "policy-integration-layer": PolicyIntegrationLayer,
  "data-economy-layer": DataEconomyLayer,
  "infrastructure-mapping-engine": InfrastructureMappingEngine,
  "analytics-metrics-engine": AnalyticsMetricsEngine,
  "market-access-layer": MarketAccessLayer,
  "funding-layer": FundingLayer,
  "business-intelligence-layer": BusinessIntelligenceLayer,
  "support-systems": SupportSystems,
};

function InfraModulePage({ name }: { name: string }) {
  return (
    <div className="container mx-auto max-w-xl py-16">
      <div className="text-3xl font-bold mb-4">{name}</div>
      <p className="text-muted-foreground mb-2">
        This is a placeholder module page for <b>{name}</b>. More functionality
        and integration coming soon.{" "}
      </p>
    </div>
  );
}

interface TopDivisionNavProps {
  conversationalMode: boolean;
  onConversationalModeChange: (enabled: boolean) => void;
}

/* ---------- breadcrumb-friendly title map ---------- */
const routeTitleMap: Record<string, string> = {
  "/home": "Home",
  "/economic-indicators": "Economic Indicators",
  "/business-forecast": "Business Forecast",
  "/market-competitive-analysis": "Market Analysis",
  "/pricing-strategies": "Pricing Strategy",
  "/revenue-forecasting": "Revenue Strategy",
  "/loan-research": "Funding & Loans",
  "/supply-chain-analytics": "Supply Chain",
  "/financial-advisory": "Financial Advisory",
  "/impact-calculator": "Policy & Impact",
  "/tax-compliance": "Tax & Compliance",
  "/business-feasibility": "Business Feasibility",
  "/business-planning": "Business Planning",
  "/business-plans": "Business Plans",
  "/sales-intelligence": "Sales Intelligence",
  "/kpi-dashboard": "KPI Dashboard",
  "/ai-insights": "AI Insights",
  "/document-manager": "Document Manager",
  "/growth-planning": "Growth Planning",
  "/all-reports": "All Reports",
  "/notifications": "Notifications",
  "/policy-alerts": "Policy Alerts",
  "/strategy-builder": "Strategy Builder",
  "/risk-management": "Risk Management",
  "/compliance-reports": "Compliance Reports",
  "/audit-reports": "Audit Reports",
  "/audit-trail": "Audit Trail",
  "/document-upload": "Document Upload",
  "/document-processing": "Document Processing",
  "/infrastructure": "Infrastructure",
  "/learn": "Learn",
  "/user-settings": "Settings",
  "/company-settings": "Company Settings",
};

function AppBreadcrumb() {
  const location = useLocation();
  const segments = location.pathname.split("/").filter(Boolean);

  if (segments.length === 0) return null;

  // Build breadcrumb trail
  const crumbs: { label: string; href?: string }[] = [];
  let accumulated = "";
  for (let i = 0; i < segments.length; i++) {
    accumulated += `/${segments[i]}`;
    const title = routeTitleMap[accumulated] || segments[i].replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    if (i === segments.length - 1) {
      crumbs.push({ label: title });
    } else {
      crumbs.push({ label: title, href: accumulated });
    }
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map((crumb, i) => (
          <React.Fragment key={i}>
            {i > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              {crumb.href ? (
                <BreadcrumbLink asChild>
                  <Link to={crumb.href}>{crumb.label}</Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

/** Compact top header with sidebar trigger + breadcrumbs + utility controls */
function TopUtilityBar({
  conversationalMode,
  onConversationalModeChange,
}: TopDivisionNavProps) {
  const { theme, toggleTheme } = useTheme();
  const { currency, setCurrency } = useCurrency();

  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 sticky top-0 z-40">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <AppBreadcrumb />

      <div className="ml-auto flex items-center gap-3">
        <div className="flex items-center gap-1.5 px-2 py-1 hover:bg-muted rounded cursor-pointer">
          <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="text-xs font-medium bg-transparent text-muted-foreground border-0 outline-0 focus:outline-0 cursor-pointer"
            aria-label="Select currency"
            title="Select currency"
          >
            {CURRENCIES.map((curr) => (
              <option key={curr.code} value={curr.code}>
                {curr.code}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={toggleTheme}
          className="flex items-center gap-1.5 px-2 py-1 hover:bg-muted rounded cursor-pointer"
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          aria-label="Toggle dark mode"
        >
          {theme === "dark" ? (
            <Sun className="h-3.5 w-3.5 text-muted-foreground" />
          ) : (
            <Moon className="h-3.5 w-3.5 text-muted-foreground" />
          )}
          <span className="text-xs text-muted-foreground font-medium hidden sm:inline">
            {theme === "dark" ? "Light" : "Dark"}
          </span>
        </button>

        <div className="flex items-center gap-1.5 px-2 py-1 hover:bg-muted rounded cursor-pointer">
          <Radio className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground font-medium hidden sm:inline">Chat</span>
          <Switch
            checked={conversationalMode}
            onCheckedChange={onConversationalModeChange}
            className="scale-75"
          />
        </div>
      </div>
    </header>
  );
}

function ProtectedHomeRoute() {
  const { isSetup } = useCompanyInfo();

  if (!isSetup) {
    return <Navigate to="/onboarding" replace />;
  }

  return <Landing />;
}

function AppContent() {
  const [conversationalMode, setConversationalMode] = React.useState(true);
  const location = useLocation();

  // Sync company's currency preference with global currency context
  useSyncCurrency();

  const isLandingPage =
    location.pathname === "/" ||
    location.pathname === "/signup" ||
    location.pathname === "/login" ||
    location.pathname === "/onboarding";

  React.useEffect(() => {
    const saved = localStorage.getItem("conversationalMode");
    if (saved !== null) {
      setConversationalMode(saved === "true");
    }
  }, []);

  const handleConversationalModeChange = (enabled: boolean) => {
    setConversationalMode(enabled);
    localStorage.setItem("conversationalMode", String(enabled));
  };

  /* ------ Routes (shared between landing & sidebar layouts) ------ */
  const routeElements = (
    <Routes>
      <Route path="/" element={<PrimaryLanding />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/company-settings" element={<CompanySettings />} />
      <Route path="/user-settings" element={<UserSettings />} />
      <Route path="/chatbot-test" element={<ChatbotTest />} />
      <Route path="/home" element={<ProtectedHomeRoute />} />
      <Route path="/landing" element={<Landing />} />

      {/* Core Module Routes */}
      <Route path="/economic-indicators" element={<Index />} />
      <Route path="/business-forecast" element={<BusinessForecast />} />
      <Route path="/market-competitive-analysis" element={<MarketCompetitiveAnalysis />} />
      <Route path="/market-report/:reportId" element={<MarketReportView />} />
      <Route path="/market-competitive-analysis/swot" element={<SwotWhitePaper />} />
      <Route path="/market-competitive-analysis/profile/:id" element={<CompetitorWhitePaper />} />
      <Route path="/pricing-strategies" element={<PricingStrategy />} />
      <Route path="/revenue-forecasting" element={<RevenueStrategy />} />
      <Route path="/loan-research" element={<LoanFunding />} />
      <Route path="/supply-chain-analytics" element={<InventorySupplyChain />} />
      <Route path="/financial-advisory" element={<FinancialAdvisory />} />
      <Route path="/impact-calculator" element={<ImpactCalculator />} />
      <Route path="/tax-compliance" element={<TaxCompliance />} />
      <Route path="/business-feasibility" element={<BusinessFeasibility />} />
      <Route path="/business-feasibility/:id" element={<BusinessFeasibilityIdea />} />
      <Route path="/business-planning" element={<BusinessPlanning />} />
      <Route path="/business-planning/:id" element={<BusinessPlanningFromFeasibility />} />
      <Route path="/business-planning-flow/:planId" element={<BusinessPlanningFlow />} />
      <Route path="/business-plans" element={<BusinessPlansList />} />
      <Route path="/sales-intelligence" element={<SalesIntelligence />} />
      <Route path="/kpi-dashboard" element={<SalesIntelligence />} />

      {/* Additional Feature Routes */}
      <Route path="/ai-insights" element={<AiInsights />} />
      <Route path="/document-manager" element={<DocumentManager />} />
      <Route path="/growth-planning" element={<GrowthPlanning />} />
      <Route path="/all-reports" element={<AllReports />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/policy-alerts" element={<PolicyAlerts />} />
      <Route path="/strategy-builder" element={<StrategyBuilder />} />
      <Route path="/risk-management" element={<RiskManagement />} />
      <Route path="/compliance-reports" element={<ComplianceReports />} />
      <Route path="/audit-reports" element={<AuditReports />} />
      <Route path="/audit-trail" element={<AuditTrail />} />
      <Route path="/document-upload" element={<DocumentUpload />} />
      <Route path="/document-processing" element={<DocumentProcessing />} />

      {/* Legacy routes for backward compatibility */}
      <Route path="/pricing-strategy" element={<PricingStrategy />} />
      <Route path="/revenue-strategy" element={<RevenueStrategy />} />
      <Route path="/loan-funding" element={<LoanFunding />} />
      <Route path="/inventory-supply-chain" element={<InventorySupplyChain />} />
      <Route path="/InventorySupplyChain" element={<InventorySupplyChain />} />
      <Route path="/policy-economic-analysis" element={<PolicyEconomicAnalysis />} />

      {/* Infrastructure Division Routes */}
      <Route path="/infrastructure" element={<Infrastructure />} />
      <Route path="/infrastructure/opportunities/marketplace" element={<OpportunitiesMarketplace />} />

      {/* Learn Division Routes */}
      <Route path="/learn" element={<Learn />} />
      <Route path="/learn/discover" element={<LearnDiscover />} />
      <Route path="/learn/courses" element={<LearnCourses />} />
      <Route path="/learn/courses/generate" element={<LearnCourseGenerate />} />
      <Route path="/learn/courses/:courseId" element={<LearnCourseView />} />
      <Route path="/learn/quizzes" element={<LearnQuizzes />} />
      <Route path="/learn/records" element={<LearnRecords />} />

      {/* Individual infrastructure module routes */}
      {infraModules.map((mod) => (
        <Route
          key={mod.slug}
          path={`/infrastructure/${mod.slug}`}
          element={
            infraRouteComp[mod.slug] ? (
              React.createElement(infraRouteComp[mod.slug])
            ) : (
              <InfraModulePage name={mod.name} />
            )
          }
        />
      ))}

      {/* Catch-all route - MUST be last */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );

  /* ------ Landing pages: no sidebar ------ */
  if (isLandingPage) {
    return (
      <ConversationalModeContext.Provider
        value={{
          conversationalMode,
          onConversationalModeChange: handleConversationalModeChange,
        }}
      >
        {routeElements}
      </ConversationalModeContext.Provider>
    );
  }

  /* ------ Authenticated pages: sidebar + header ------ */
  return (
    <ConversationalModeContext.Provider
      value={{
        conversationalMode,
        onConversationalModeChange: handleConversationalModeChange,
      }}
    >
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <TopUtilityBar
            conversationalMode={conversationalMode}
            onConversationalModeChange={handleConversationalModeChange}
          />
          <main className="flex-1">
            {routeElements}
          </main>
        </SidebarInset>
      </SidebarProvider>
      <ChatbotContainer conversationalMode={conversationalMode} />
    </ConversationalModeContext.Provider>
  );
}

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <CurrencyProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AuthProvider>
                <CompanyInfoProvider>
                  <AppContent />
                </CompanyInfoProvider>
              </AuthProvider>
            </BrowserRouter>
          </TooltipProvider>
        </CurrencyProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
