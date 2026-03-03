# Project Structure & Complete File Guide

This document provides a comprehensive overview of every file and folder in the Joseph AI application, organized by category with detailed explanations of what each file does.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Frontend (React/TypeScript - src/)](#frontend-reacttypescript---src)
3. [Backend (Django - Python)](#backend-django---python)
4. [Agent System](#agent-system)
5. [Configuration Files](#configuration-files)
6. [Root-Level Documentation](#root-level-documentation)

---

## Project Overview

**Joseph AI** is a comprehensive business intelligence and planning platform that helps companies with:
- Business forecasting and planning
- Market competitive analysis
- Financial advisory and planning
- Revenue strategy optimization
- Pricing strategy development
- Tax compliance and advisory
- Loan and funding research
- Supply chain and inventory management
- Policy and economic analysis
- Sales intelligence and KPI tracking
- Growth planning and risk management

The application has:
- **Frontend**: React 18 + TypeScript + Vite (SPA)
- **Backend**: Django REST Framework (Python)
- **AI Agent**: Custom Python agent for intelligent analysis
- **Theme System**: Tailwind CSS with dark mode support
- **Global Currency**: Dynamic multi-currency support

---

## Frontend (React/TypeScript - src/)

### Root Frontend Files

#### `src/main.tsx`
The application entrypoint that mounts the React app into the DOM. This is the first file to execute.

#### `src/App.tsx` ⭐ CRITICAL
The root React component that:
- Sets up all providers (Theme, Auth, Company Info, Currency, React Query)
- Defines all routes using React Router
- Manages navigation bar and global UI state
- Handles conversational mode toggle
- Provides context for the entire app

#### `src/index.css`
Base CSS styles including fonts, reset styles, and global theme variables.

#### `src/App.css`
Application-level styles for the main App component.

#### `src/vite-env.d.ts`
TypeScript ambient declarations for Vite environment variables.

---

### Pages (src/pages/) - ALL User-Facing Screens

#### Authentication Pages
- **`Login.tsx`** - User login form with email/password
- **`SignUp.tsx`** - User registration form
- **`Onboarding.tsx`** - Company setup flow (required after first login). Collects:
  - Company name, description, sector
  - Number of workers, company size
  - Location (country, state, city)
  - Website URL, email, phone
  - Currency preference, language
  - Number of business entities

#### Core Pages
- **`Index.tsx`** ⭐ - Economic indicators homepage showing real-time economic data
- **`Landing.tsx`** - Main landing page after login (module overview)
- **`PrimaryLanding.tsx`** - Alternative landing page
- **`NotFound.tsx`** - 404 error page

#### Main Business Intelligence Modules (10 Core Modules)

1. **`BusinessForecast.tsx`** - Business forecasting and revenue projections
   - Displays annual revenue targets, customer segments, KPIs tracked
   - Tabs: Overview, Summary & Rec, Tables, Revenue, Costs, Planning

2. **`Index.tsx`** - Economic indicators and market data
   - Live economic data feeds
   - Economic events and trends

3. **`MarketCompetitiveAnalysis.tsx`** - Competitive market analysis
   - Competitor profiles and comparison
   - Market trends and positioning

4. **`MarketReportView.tsx`** - Detailed market report viewing
   - Report details and analysis
   - Customizable views

5. **`SwotWhitePaper.tsx`** - SWOT analysis generation and viewing

6. **`CompetitorWhitePaper.tsx`** - Detailed competitor analysis documents

7. **`PricingStrategy.tsx`** - Dynamic pricing strategy tools
   - Competitive pricing analysis
   - Price testing and optimization

8. **`RevenueStrategy.tsx`** - Revenue forecasting and optimization
   - Revenue streams management
   - Scenario planning and comparison

9. **`LoanFunding.tsx`** - Loan and funding research
   - Loan comparison tools
   - Funding options and eligibility checks
   - Investor matching

10. **`InventorySupplyChain.tsx`** - Supply chain and inventory management
    - Procurement tracking
    - Supplier management
    - Production planning
    - Inventory analytics

#### Additional Business Modules

- **`FinancialAdvisory.tsx`** - Financial planning and advisory tools
- **`TaxCompliance.tsx`** - Tax compliance calendar and recommendations
- **`BusinessFeasibility.tsx`** - Business viability assessment
- **`BusinessFeasibilityIdea.tsx`** - Detailed feasibility analysis for ideas
- **`BusinessPlanning.tsx`** - Business plan creation
- **`BusinessPlanningFlow.tsx`** - Step-by-step business plan builder
- **`BusinessPlanningFromFeasibility.tsx`** - Generate plans from feasibility studies
- **`BusinessPlansList.tsx`** - View and manage created business plans
- **`ImpactCalculator.tsx`** - Calculate policy/economic impact scenarios
- **`GrowthPlanning.tsx`** - Strategic growth planning
- **`SalesIntelligence.tsx`** - Sales performance dashboard and analytics
- **`RiskManagement.tsx`** - Risk assessment and mitigation strategies
- **`PolicyEconomicAnalysis.tsx`** - Policy impact on business
- **`StrategyBuilder.tsx`** - Visual strategy building tool

#### Information & Management Pages

- **`Notifications.tsx`** - Notification center and history
- **`PolicyAlerts.tsx`** - Policy and compliance alerts
- **`AllReports.tsx`** - View all generated reports
- **`ComplianceReports.tsx`** - Compliance-specific reports
- **`AuditReports.tsx`** - Audit report viewing
- **`AuditTrail.tsx`** - Activity and change history
- **`AiInsights.tsx`** - AI-generated insights across modules
- **`DocumentManager.tsx`** - Manage uploaded documents
- **`DocumentUpload.tsx`** - Upload and process documents
- **`KPIDashboardPage.tsx`** - KPI monitoring dashboard

#### User Settings Pages

- **`CompanySettings.tsx`** - Edit company information (currency, language, fiscal year, etc.)
- **`UserSettings.tsx`** ⭐ CRITICAL - Comprehensive user settings with 8 tabs:
  - Account Settings (profile, password)
  - Appearance (dark/light mode, font size, language, layout)
  - Notifications (email, push, marketing, frequency)
  - Privacy & Security (2FA, login history)
  - Preferences (currency, timezone, auto-save)
  - Connected Accounts (OAuth integrations)
  - Billing (subscription management)
  - Danger Zone (logout, delete account)

#### Infrastructure Division Pages

- **`Infrastructure.tsx`** - Infrastructure module overview
- **`infrastructure/Networks.tsx`** - Business network infrastructure
- **`infrastructure/Opportunities.tsx`** - Opportunity pipeline
- **`infrastructure/ValueExchangeChannels.tsx`** - Value exchange mechanisms
- **`infrastructure/KnowledgeFlows.tsx`** - Knowledge sharing flows
- **`infrastructure/GovernanceTrustMechanisms.tsx`** - Governance structure
- **`infrastructure/SocialCapitalInclusion.tsx`** - Social capital metrics
- **`infrastructure/CultureOfCollaboration.tsx`** - Collaboration metrics
- **`infrastructure/PolicyIntegrationLayer.tsx`** - Policy integration
- **`infrastructure/DataEconomyLayer.tsx`** - Data economy metrics
- **`infrastructure/InfrastructureMappingEngine.tsx`** - Infrastructure mapping
- **`infrastructure/AnalyticsMetricsEngine.tsx`** - Analytics and metrics
- **`infrastructure/MarketAccessLayer.tsx`** - Market access
- **`infrastructure/FundingLayer.tsx`** - Funding mechanisms
- **`infrastructure/BusinessIntelligenceLayer.tsx`** - Business intelligence
- **`infrastructure/SupportSystems.tsx`** - Support and resource systems
- **`infrastructure/OpportunitiesMarketplace.tsx`** - Marketplace for opportunities

#### Learning Division Pages

- **`learn/Learn.tsx`** - Learning hub overview
- **`learn/LearnDiscover.tsx`** - Discover learning content
- **`learn/LearnCourses.tsx`** - Browse available courses
- **`learn/LearnCourseGenerate.tsx`** - Generate custom courses
- **`learn/LearnCourseView.tsx`** - View course content
- **`learn/LearnQuizzes.tsx`** - Quiz and assessment tools
- **`learn/LearnRecords.tsx`** - Learning records and progress

#### Development Pages

- **`ChatbotTest.tsx`** - Testing interface for the chatbot/AI agent

---

### Components (src/components/)

Components are organized by feature area. Each component is reusable and focused on a specific aspect of the UI.

#### UI Library (src/components/ui/) - Design System
These are fundamental, reusable UI building blocks following the Shadcn/Radix UI pattern:

**Form & Input Components:**
- `button.tsx` - Button component with variants
- `input.tsx` - Text input field
- `textarea.tsx` - Multi-line text input
- `label.tsx` - Form label
- `checkbox.tsx` - Checkbox input
- `radio-group.tsx` - Radio button group
- `select.tsx` - Dropdown select
- `input-otp.tsx` - One-time password input
- `slider.tsx` - Slider/range input
- `switch.tsx` - Toggle switch
- `toggle.tsx` - Toggle button
- `toggle-group.tsx` - Toggle button group

**Display Components:**
- `card.tsx` - Card container with header, content, footer
- `badge.tsx` - Badge/tag component
- `alert.tsx` - Alert message container
- `alert-dialog.tsx` - Confirmation dialog
- `avatar.tsx` - User avatar display
- `breadcrumb.tsx` - Navigation breadcrumbs
- `pagination.tsx` - Pagination controls
- `progress.tsx` - Progress bar
- `skeleton.tsx` - Loading placeholder
- `spinner.tsx` - Loading spinner

**Layout & Navigation:**
- `tabs.tsx` - Tab interface
- `navigation-menu.tsx` - Navigation menu
- `menubar.tsx` - Menu bar
- `sidebar.tsx` - Sidebar layout
- `drawer.tsx` - Side drawer/panel
- `sheet.tsx` - Bottom sheet
- `accordion.tsx` - Collapsible accordion
- `collapsible.tsx` - Collapsible section

**Dialogs & Overlays:**
- `dialog.tsx` - Modal dialog
- `dropdown-menu.tsx` - Dropdown menu
- `context-menu.tsx` - Right-click context menu
- `popover.tsx` - Floating popover
- `hover-card.tsx` - Hover card
- `tooltip.tsx` - Tooltip display
- `toaster.tsx` - Toast notification container
- `sonner.tsx` - Sonner toast notifications

**Specialized Components:**
- `chart.tsx` - Recharts integration
- `table.tsx` - Data table with sorting/filtering
- `command.tsx` - Command/search palette
- `calendar.tsx` - Date picker calendar
- `carousel.tsx` - Carousel/slider
- `aspect-ratio.tsx` - Maintains aspect ratio
- `resizable.tsx` - Resizable panels
- `scroll-area.tsx` - Scrollable area
- `separator.tsx` - Visual separator
- `connection-status.tsx` - Connection status indicator
- `loading-spinner.tsx` - Loading spinner
- `speedometer.tsx` - Gauge/speedometer
- `module-header.tsx` - Module page header with title, description
- `module-navigation.tsx` - Navigation within modules
- `notifications-ideas-popovers.tsx` - Notification and idea popups

**Utilities:**
- `form.tsx` - Form context and utilities
- `use-toast.ts` - Toast hook

#### Business Components (src/components/business/)
Components for business forecasting and planning:
- `business-metrics-table.tsx` - Table of business metrics
- `customer-profile.tsx` - Customer segment profile display
- `documents-section.tsx` - Document listing and management
- `financial-layout.tsx` - Financial data layout and display
- `kpi-dashboard.tsx` - KPI metrics dashboard
- `revenue-projections.tsx` - Revenue projection charts
- `scenario-planning.tsx` - Scenario comparison interface

#### Chatbot Components (src/components/chatbot/)
Components for AI chatbot functionality:
- `chatbot-container.tsx` - Main chatbot widget container
- `chat-interface.tsx` - Message display and input
- `agent-panel.tsx` - Agent status and controls
- `module-context-switcher.tsx` - Switch context between modules
- `tool-modal.tsx` - Modal for tool invocation
- `tools-dock.tsx` - Dock of available tools

#### Feature-Specific Components (src/components/)
Organized by business module:

**Competitive Analysis** (`competitive/`)
- `competitive-analysis.tsx` - Competitive positioning analysis
- `competitive-strategy.tsx` - Competitive strategy UI

**Economic** (`economic/`)
- `context-switcher.tsx` - Economic context switching
- `economic-table.tsx` - Economic data table
- `forecast-panel.tsx` - Forecast controls and display
- `metrics-dashboard.tsx` - Economic metrics
- `upcoming-events.tsx` - Upcoming economic events

**Financial Advisory** (`financial/`)
- `add-kpi-modal.tsx` - Add KPI dialog
- `advisory-insights.tsx` - Financial insights display
- `budget-validation.tsx` - Budget validation tool
- `cash-flow-planning.tsx` - Cash flow planner
- `create-forecast-dialog.tsx` - Forecast creation
- `create-projection-dialog.tsx` - Projection creation
- `generate-insights-modal.tsx` - AI insights generation
- `improvement-card.tsx` - Improvement suggestions
- `insights-loading-dialog.tsx` - Insights loading state
- `insights-report-panel.tsx` - Insights report display
- `performance-drivers.tsx` - Performance metrics
- `risk-assessment.tsx` - Risk assessment tool
- `scenario-testing.tsx` - Scenario testing interface
- `strategic-budgeting.tsx` - Budget strategy tool
- `validation-report-dialog.tsx` - Report validation
- `validation-report.tsx` - Validation report display

**Inventory & Supply Chain** (`inventory/`)
- `demand-forecasting.tsx` - Demand forecast
- `inventory-analytics.tsx` - Analytics dashboard
- `stock-monitoring.tsx` - Stock level monitoring
- `valuation-tracking.tsx` - Inventory valuation

**KPI Management** (`kpi/`)
- `BenchmarkingSection.tsx` - KPI benchmarking
- `CustomKPIBuilder.tsx` - Custom KPI creation
- `KPIAlertsInsights.tsx` - KPI alerts
- `KPICategoriesView.tsx` - KPI categories
- `KPIDashboardHome.tsx` - KPI dashboard
- `KPIExportReporting.tsx` - KPI export and reports

**Loan & Funding** (`loan/`)
- `add-program-modal.tsx` - Add loan program
- `application-assistance.tsx` - Application help
- `funding-options.tsx` - Funding options
- `funding-strategy.tsx` - Funding strategy
- `investor-matching.tsx` - Investor matching
- `loan-calculator.tsx` - Loan calculation tool
- `loan-comparison.tsx` - Compare loan options
- `loan-eligibility.tsx` - Eligibility checker
- `loan-research.tsx` - Loan research tools
- `manage-alerts-modal.tsx` - Alert management
- `refine-matching-modal.tsx` - Refine matching criteria
- `strategy-report.tsx` - Strategy report

**Market Analysis** (`market/`)
- `action-plan-dialog.tsx` - Action planning
- `market-analysis.tsx` - Market analysis display
- `report-notes.tsx` - Report notes

**Module Features** (`module/`)
- `recommendation-section.tsx` - Recommendations display
- `summary-recommendation-section.tsx` - Summary recommendations
- `summary-section.tsx` - General summary

**Policy Analysis** (`policy/`)
- `economic-impact-analysis.tsx` - Economic impact analysis
- `economic-pulseboard.tsx` - Economic dashboard
- `external-policy-analysis.tsx` - External policy analysis
- `fiscal-policy-analyzer.tsx` - Fiscal policy analysis
- `internal-impact-analysis.tsx` - Internal impact
- `internal-policy-analysis.tsx` - Internal policy
- `policy-economic-management.tsx` - Policy management
- `policy-reports.tsx` - Policy reports
- `policy-simplifier.tsx` - Simplify policy text
- `policy-watchtower.tsx` - Policy monitoring
- `scenario-simulation.tsx` - Scenario simulation
- `strategy-recommendations.tsx` - Strategy recommendations

**Pricing** (`pricing/`)
- `competitive-analysis.tsx` - Pricing competition
- `dynamic-pricing.tsx` - Dynamic pricing control
- `price-testing.tsx` - Price testing tool
- `pricing-strategies.tsx` - Pricing strategy

**Revenue** (`revenue/`)
- `add-revenue-stream-dialog.tsx` - Add revenue stream
- `churn-analysis.tsx` - Customer churn analysis
- `optimize-stream-dialog.tsx` - Optimize revenue stream
- `revenue-forecasting.tsx` - Revenue forecast
- `revenue-streams.tsx` - Revenue stream listing
- `scenario-comparison-dialog.tsx` - Compare scenarios
- `upsell-opportunities.tsx` - Upsell suggestions

**Sales Intelligence** (`sales-intelligence/`)
- `BenchmarkingSection.tsx` - Sales benchmarking
- `CreateEngagementDialog.tsx` - Create engagement
- `CreateLeadDialog.tsx` - Create lead
- `CreateLeadForm.tsx` - Lead form
- `CreateSalesRepDialog.tsx` - Add sales rep
- `CreateSalesTargetDialog.tsx` - Create target
- `CreateSalesTargetForm.tsx` - Target form
- `CustomKPIBuilder.tsx` - Sales KPI builder
- `DealsAnalytics.tsx` - Deals analytics
- `DocumentUpload.tsx` - Sales document upload
- `ExportReporting.tsx` - Sales export/reports
- `KPIAlerts.tsx` - Sales KPI alerts
- `KPICategories.tsx` - Sales KPI categories
- `KPIDashboard.tsx` - Sales KPI dashboard

**Supply Chain** (`supply-chain/`)
- `procurement-tracking.tsx` - Purchase order tracking
- `production-planning.tsx` - Production scheduling
- `supplier-management.tsx` - Supplier relationships
- `supply-chain-analytics.tsx` - Supply chain dashboard

**Tax Compliance** (`tax/`)
- `compliance-calendar.tsx` - Tax calendar
- `compliance-updates.tsx` - Tax updates
- `smart-tax-calculator.tsx` - Tax calculator
- `tax-recommendations.tsx` - Tax recommendations

#### Additional Components
- **`conversation/module-conversation.tsx`** - Module conversation history
- **`currency-formatter.tsx`** - Currency display utilities and components

---

### Hooks (src/hooks/) - State Management & Data Fetching

#### Core Hooks
- **`useCurrency.ts`** ⭐ - Currency selection and formatting (uses context)
- **`useSyncCurrency.ts`** ⭐ - Syncs company currency with global context
- **`useConversationalMode.tsx`** - Conversational UI mode toggle
- **`useChatbot.ts`** - Chatbot state management
- **`useAgent.ts`** - AI agent interaction
- **`use-toast.ts`** - Toast notification trigger
- **`use-mobile.tsx`** - Mobile device detection

#### API & Data Hooks
Each module has dedicated hooks for fetching and managing data:

**Business Hooks:**
- `useBusinessForecastingData.ts` - Business forecasting data
- `useBusinessData.ts` - General business data
- `useBusinessFeasibilityAPI.ts` - Feasibility API calls

**Economic Hooks:**
- `useEconomicData.ts` - Economic data
- `useEconomicData_backup.ts` - Backup economic data
- `useEconomicIndicatorsAPI.ts` - Economic indicators API

**Financial Hooks:**
- `useFinancialAdvisoryData.ts` - Financial advisory
- `useFinancialAdvisoryAPI.ts` - Financial API

**Market Hooks:**
- `useMarketData.ts` - Market data
- `useMarketDataAPI.ts` - Market API
- `useMarketAnalysisData.ts` - Market analysis
- `useMarketAnalysisAPI.ts` - Market analysis API

**Competitive Hooks:**
- `useCompetitiveData.ts` - Competitive data
- `useCompetitiveDataAPI.ts` - Competitive API

**Revenue Hooks:**
- `useRevenueData.ts` - Revenue data
- `useRevenueDataAPI.ts` - Revenue API
- `useRevenueStrategyAPI.ts` - Revenue strategy API

**Pricing Hooks:**
- `usePricingData.ts` - Pricing data
- `usePricingDataAPI.ts` - Pricing API
- `usePricingStrategyAPI.ts` - Pricing strategy API

**Loan Hooks:**
- `useLoanData.ts` - Loan data
- `useLoanFundingAPI.ts` - Loan funding API

**Inventory Hooks:**
- `useInventoryData.ts` - Inventory data
- `useInventorySupplyChainAPI.ts` - Supply chain API

**Tax Hooks:**
- `useTaxData.ts` - Tax data
- `useTaxComplianceAPI.ts` - Tax compliance API
- `useTaxDataAPI.ts` - Tax data API

**Other Hooks:**
- `useRiskManagementAPI.ts` - Risk management
- `useRiskManagementDataAPI.ts` - Risk data
- `useGrowthPlanningAPI.ts` - Growth planning
- `usePolicyComplianceAPI.ts` - Policy compliance
- `usePolicyEconomicData.ts` - Policy economics
- `useSalesIntelligenceAPI.ts` - Sales intelligence
- `useSupplyChainData.ts` - Supply chain data

---

### Libraries & Utilities (src/lib/)

#### Context Providers ⭐ CRITICAL
- **`auth-context.tsx`** - Authentication state and login/logout
- **`company-context.tsx`** - Company information and settings
- **`currency-context.tsx`** - Global currency selection and formatting
- **`theme-context.tsx`** - Dark/light mode theme provider
- **`app-context.ts`** - General app context

#### API Services (src/lib/api/)
Low-level HTTP clients for backend communication:
- `auth-service.ts` - Authentication API calls
- `accounts-service.ts` - Account management API
- `xano-client.ts` - Xano database client
- `business-forecasting-service.ts` - Business forecasting API
- `business-feasibility-service.ts` - Feasibility API
- `economic-indicators-service.ts` - Economic data API
- `market-analysis-service.ts` - Market analysis API
- `financial-advisory-service.ts` - Financial advisory API
- `pricing-strategy-service.ts` - Pricing strategy API
- `revenue-strategy-service.ts` - Revenue strategy API
- `loan-funding-service.ts` - Loan funding API
- `inventory-supply-chain-service.ts` - Supply chain API
- `tax-compliance-service.ts` - Tax compliance API
- `policy-compliance-service.ts` - Policy compliance API
- `risk-management-service.ts` - Risk management API
- `company-profile-service.ts` - Company profile API
- `groq-agent-service.ts` - Groq AI agent API

#### Data Management & Content
- **`currency-utils.ts`** ⭐ - Currency formatting and conversion
- **`utils.ts`** - General utility functions (cn classname merge, etc.)
- **`app-config.ts`** - Application configuration
- **`company-config.ts`** - Company-specific defaults
- **`feasibility-config.ts`** - Feasibility configuration
- **`demo-explainable-elements.ts`** - Demo explainability features

#### Module-Specific Data & Content
Each module has data generation/management utilities:
- `business-forecast-data.ts` / `business-forecast-content.ts`
- `business-planning-types.ts` / `business-plan-content-generator.ts`
- `economic-data.ts` / `economic-content.ts`
- `market-data.ts` / `market-content.ts`
- `competitive-data.ts`
- `revenue-data.ts` / `revenue-content.ts`
- `pricing-data.ts` / `pricing-content.ts`
- `loan-data.ts`
- `inventory-data.ts` / `inventory-content.ts`
- `tax-compliance-data.ts`
- `policy-economic-data.ts`
- `supply-chain-data.ts`

#### Export & Generation Utilities
- `pdf-generator.ts` - General PDF generation
- `business-plan-export.ts` - Business plan export
- `optimize-plan-pdf-generator.ts` - Optimized plan PDF
- `revenue-stream-pdf-generator.ts` - Revenue stream PDF

#### AI & Intelligence
- `ai-insights-engine.ts` - AI insights processing
- `ai.ts` - AI helper functions
- `economist-prompts.ts` - Prompt templates for AI
- `impact-scenarios.ts` - Impact scenario generation

#### Other Utilities
- `document-processor.ts` - Frontend document processing
- `web-scraper.ts` - Web scraping utilities
- `web-search.ts` - Web search utilities
- `chatbot-data.ts` - Chatbot data management
- `economic-events.ts` - Economic event handling
- `get-company-name.ts` - Company name utilities
- `feasibility.ts` - Feasibility calculations
- `joseph-global-explain.ts` - Explainability utilities

---

### Mock Data (src/mocks/)
Development and testing data files:
- `business-forecast.ts` - Mock business forecast data
- `business-feasibility.ts` - Mock feasibility data
- `business-planning.ts` - Mock business plan data
- `economic-indicators.ts` - Mock economic data
- `financial-advisory.ts` - Mock financial data
- `impact-calculator.ts` - Mock impact scenarios
- `inventory-supply-chain.ts` - Mock supply chain data
- `loan-funding.ts` - Mock loan data
- `market-competitive-analysis.ts` - Mock market data
- `pricing-strategy.ts` - Mock pricing data
- `revenue-strategy.ts` - Mock revenue data
- `tax-compliance.ts` - Mock tax data
- `notifications.ts` - Mock notifications
- `module-labels.ts` - Module label definitions

---

## Backend (Django - Python)

### Django Project Configuration

#### `backend/backend_project/`
Main Django project settings and configuration:
- `settings.py` - Django configuration (databases, apps, middleware, secrets)
- `urls.py` - Root URL routing configuration
- `wsgi.py` - WSGI application entrypoint
- `asgi.py` - ASGI application entrypoint
- `show_urls.py` - Utility to list all registered URLs

#### `backend/manage.py`
Django management utility for running commands, migrations, and server.

#### `backend/requirements.txt`
Python package dependencies for the backend.

### Django Apps (Features)

Each app follows the standard Django structure with:
- `models.py` - Database models
- `views.py` - View/endpoint handlers
- `serializers.py` - DRF serializers for API
- `urls.py` - URL routing
- `admin.py` - Django admin registration
- `migrations/` - Database migration files
- `management/commands/` - Custom management commands

#### App Directory Structure:

##### 1. Business Forecast (`business_forecast/`)
**Purpose:** Business forecasting, projections, and revenue targets
- Models for forecast scenarios, revenue projections, KPIs
- Views for CRUD operations and forecast calculations
- Management command: `populate_data.py`, `load_ecommerce_demo.py`

##### 2. Chatbot (`chatbot/`)
**Purpose:** AI chatbot integration and conversation management
- Models: Conversations, Messages, Agent Memory, Tasks
- Views: Chat endpoints, agent handlers
- `agent.py`: Chatbot AI agent integration
- Management command: (tests available)

##### 3. Economic Forecast (`economic_forecast/`)
**Purpose:** Economic data, indicators, and forecasts
- Models for economic indicators, events, forecasts
- Views for economic data endpoints
- Management commands: `populate_economic_data.py`, `scrape_news.py`, `run_scheduler.py`

##### 4. Financial Advisory (`financial_advisory/`)
**Purpose:** Financial planning and advisory
- Models for financial plans, recommendations, scenarios
- Views for financial analysis endpoints
- Management command: `populate_financial_data.py`

##### 5. Inventory Supply Chain (`inventory_supply_chain/`)
**Purpose:** Inventory management, procurement, production planning
- Models for inventory, suppliers, procurement orders, production plans
- Views for supply chain endpoints
- Management command: `populate_inventory_supply_data.py`

##### 6. Loan Funding (`loan_funding/`)
**Purpose:** Loan research, funding options, and applications
- Models for loan programs, applications, documents, business plans
- Views for loan API endpoints
- Management command: `populate_loan_data.py`

##### 7. Market Analysis (`market_analysis/`)
**Purpose:** Competitive market analysis and reports
- Models for market data, competitors, analysis
- Views for market endpoints
- Management command: `populate_market_data.py`

##### 8. Policy (`policy/`)
**Purpose:** Policy compliance and economic analysis
- Models for policies, impacts, compliance requirements
- Views for policy endpoints
- Management command: `populate_policy_data.py`

##### 9. Pricing Strategy (`pricing_strategy/`)
**Purpose:** Dynamic pricing and pricing strategy
- Models for pricing strategies, price points, testing
- Views for pricing endpoints
- Management command: `populate_pricing_data.py`

##### 10. Revenue Strategy (`revenue_strategy/`)
**Purpose:** Revenue forecasting and optimization
- Models for revenue streams, forecasts, scenarios
- Views for revenue endpoints
- Management command: `populate_revenue_data.py`

##### 11. Tax Compliance (`tax_compliance/`)
**Purpose:** Tax planning and compliance
- Models for tax obligations, deductions, compliance
- Views for tax endpoints
- Management command: `populate_tax_data.py`

##### Top-Level App (`business_forecast/` at root)
A utility app (non-Django) for business forecast logic.

---

## Agent System

### Python AI Agent (`agent/`)

The intelligent agent that powers the chatbot and analysis:

#### Core (`agent/core/`)
- **`agent.py`** - Main agent orchestration and logic
- **`memory.py`** - Agent memory and context management
- **`planner.py`** - Task planning and orchestration

#### LLM Integration (`agent/llm/`)
- **`client.py`** - LLM API client (calls to OpenAI, Groq, etc.)
- **`cost_guard.py`** - Cost monitoring and limits

#### Document Processing (`agent/document_processing/`)
- **`extract.py`** - Extract content from documents
- **`ingest.py`** - Ingest documents into memory
- **`metadata.py`** - Extract metadata
- **`normalize.py`** - Normalize document data

#### Retrieval (`agent/retrieval/`)
- **`retriever.py`** - Document/information retrieval
- **`ranker.py`** - Rank retrieval results
- **`sources.py`** - Define retrieval sources

#### Tools (`agent/tools/`)
- **`api_tools.py`** - Agent tools for API calls
- **`documents.py`** - Document handling tools
- **`scraper.py`** - Web scraping tools

#### Prompts (`agent/prompts/`)
- **`system.txt`** - System-level prompts
- **`tools.txt`** - Tool-specific prompts

#### Scheduling (`agent/schedules/`)
- **`cron.py`** - Cron job scheduling

#### Configuration
- **`config.py`** - Agent configuration
- **`__init__.py`** - Package initialization

#### Shared (`agent/shared/`)
- **`schemas.py`** - Shared data schemas

---

## Configuration Files

### Build & Dev Configuration

#### `vite.config.ts`
Vite configuration for:
- React plugin setup
- Development server (port 8080)
- Build optimization
- Path aliases (@/ for src/)
- Custom plugins (ai-proxy, spa-fallback)

#### `tailwind.config.ts`
Tailwind CSS configuration:
- Color palette and design tokens
- Component variations
- Plugin configurations

#### `postcss.config.js`
PostCSS pipeline configuration for Tailwind CSS processing.

#### `tsconfig.json` & Related
TypeScript configuration files:
- `tsconfig.json` - Root config with path aliases
- `tsconfig.app.json` - App-specific overrides
- `tsconfig.node.json` - Node/build-specific config

#### `package.json` ⭐ CRITICAL
npm package management:
- **Scripts:**
  - `npm run dev` - Start development server
  - `npm run build` - Production build
  - `npm run test` - Run tests
  - `npm run typecheck` - TypeScript type checking
  - `npm run format.fix` - Format code with prettier
- **Dependencies:** React 18, Router, UI libraries, utilities
- **Dev Dependencies:** Vite, TypeScript, Tailwind, testing tools

#### `package-lock.json`
Locked dependency versions for reproducible installs.

### Docker Configuration

#### `Dockerfile` & `Dockerfile.frontend`
Docker image definitions for containerized deployment.

#### `docker-compose.yml`
Docker Compose configuration for multi-container setup.

### Deployment Configuration

#### `vercel.json`
Vercel deployment configuration.

### Root HTML

#### `index.html`
HTML entry point that:
- Defines root DOM element (`<div id="root">`)
- Loads main.tsx for React app initialization
- Sets up viewport and meta tags

---

## Root-Level Documentation

### Application Documentation Files

- **`AGENTS.md`** - Agent architecture and design
- **`README.md`** - Project overview and setup
- **`README_INTEGRATION.md`** - Integration documentation
- **`API_DOCUMENTATION.md`** - API endpoints reference
- **`DATA_ENDPOINTS_DOCUMENTATION.md`** - Data endpoint specs
- **`BACKEND_INTEGRATION_GUIDE.md`** - Backend integration instructions
- **`XANO_INTEGRATION_GUIDE.md`** - Xano database integration
- **`QUICK_INTEGRATION_GUIDE.md`** - Quick start guide
- **`COMPLETE_INTEGRATION_PLAN.md`** - Full integration plan
- **`ENDPOINT_MAPPING.md`** - Endpoint to function mapping
- **`FRONTEND_ARCHITECTURE.md`** - Frontend architecture notes
- **`CURRENCY_SYSTEM.md`** - Currency system design

### Development Documentation

- **`REFACTORING_GUIDE.md`** - Refactoring instructions
- **`MOCK_DATA_REFACTORING_GUIDE.md`** - Mock data refactor guide
- **`MOCK_DATA_REFACTORING_SUMMARY.md`** - Refactor summary
- **`HARDCODED_DATA_AUDIT.md`** - Audit of hardcoded values
- **`MODULES_HARDCODED_DATA_AUDIT.md`** - Module-specific audit
- **`MODULES_STRUCTURE_REPORT.md`** - Module structure analysis
- **`INTEGRATION_PROGRESS.md`** - Integration progress tracking
- **`SESSION_SUMMARY.md`** - Session notes
- **`TODO.md`** - Project TODO list

### Additional Files

- **`components.json`** - Component export map
- **`test_request.json`** - Example API request payloads
- **`rustup-init.exe`** - Windows Rust installer (incidental)

---

## Project Statistics

- **Frontend Pages:** 50+ pages covering all business modules
- **React Components:** 150+ UI and feature components
- **Custom Hooks:** 50+ data and state management hooks
- **UI Components:** 40+ design system primitives
- **Backend Apps:** 11 Django apps covering major features
- **API Endpoints:** 100+ REST endpoints
- **Languages:** TypeScript (Frontend), Python (Backend)
- **Main Libraries:** React, Vite, Tailwind CSS, Django, Radix UI

---

## Key Architecture Patterns

### Frontend

1. **Context-Based State Management**
   - Auth, Company, Currency, Theme contexts
   - Providers wrapped in App.tsx

2. **Modular Component Architecture**
   - Feature-based organization
   - Reusable UI component library
   - Hooks for data fetching and state

3. **API Service Layer**
   - Centralized API clients in src/lib/api/
   - Type-safe services for each module
   - Error handling and request/response transformation

4. **Page-Based Routing**
   - React Router v6 with nested routes
   - Protected routes with auth checks
   - Infrastructure, Learning, and Solutions divisions

### Backend

1. **Django App-Per-Feature Model**
   - Modular apps with clear responsibilities
   - Shared settings and URLs configuration
   - Management commands for data population

2. **DRF API Structure**
   - Serializers for data validation
   - ViewSets or APIViews for endpoints
   - URL routing per app

3. **Database Migrations**
   - Version-controlled schema changes
   - Migration per app
   - Data consistency maintained

---

## Getting Started

1. **Frontend Development:** `npm run dev` - Starts on localhost:8080
2. **Backend Setup:** Install requirements, run migrations, start Django server
3. **Configuration:** Update settings in `backend_project/settings.py` and environment variables
4. **Database:** Configure database in Django settings
5. **API Integration:** Use services in `src/lib/api/` to call backend endpoints

---

This document is comprehensive and covers every major file and directory in the Joseph AI application. Refer back to it for understanding the project structure and locating specific functionality.
