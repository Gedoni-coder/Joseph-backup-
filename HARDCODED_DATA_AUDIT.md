# 🔍 Hardcoded Data Audit Report

**Date:** January 2025  
**Scope:** Full codebase scan (src/, backend/, plugins/, config files)  
**Status:** ⚠️ MULTIPLE INSTANCES FOUND - Action Required

---

## Executive Summary

**Total Issue Categories:** 5 Critical, 8 High Priority, Multiple Medium Priority  
**Files Affected:** 20+ files  
**Risk Level:** 🔴 HIGH (Security & Maintainability)

The codebase contains substantial amounts of hardcoded data across three main categories:

1. **Security Risks** - Credentials, secrets, and sensitive defaults
2. **UI/Content** - Pricing plans, feature descriptions, contact info, brand names
3. **API Configuration** - Endpoints, URLs, default models, ports
4. **Business Data** - Mock datasets, company info, pricing strategies

---

## 🔴 CRITICAL ISSUES (Must Fix)

### 1. Django Secret Key Fallback
**File:** `backend/backend_project/settings.py` (Line 24)  
**Severity:** 🔴 CRITICAL  
**Issue:** Hardcoded default SECRET_KEY exposed in source code

```python
# CURRENT (DANGEROUS):
SECRET_KEY = os.getenv('DJANGO_SECRET_KEY', 'django-insecure-svinma#7^fs$na$^1yk(oo)^^w9o6!#v5-n_v2-17srnhg9j-y')

# RECOMMENDED:
SECRET_KEY = os.getenv('DJANGO_SECRET_KEY')
if not SECRET_KEY:
    raise ValueError("DJANGO_SECRET_KEY environment variable is not set!")
```

**Why:** If this code is committed to GitHub, the secret key is publicly exposed. Anyone can impersonate the application.

---

### 2. Database Credentials in Docker Compose
**File:** `docker-compose.yml` (Lines 7-9, 23)  
**Severity:** 🔴 CRITICAL  
**Issue:** Plain text database credentials hardcoded

```yaml
# CURRENT (DANGEROUS):
environment:
  POSTGRES_DB: economic_db
  POSTGRES_USER: postgres
  POSTGRES_PASSWORD: postgres
  DATABASE_URL=postgresql://postgres:postgres@db:5432/economic_db

# RECOMMENDED:
# Use .env file or Docker secrets instead
```

**Why:** Production credentials should never be in version control. Use `.env` file or Docker secrets.

---

### 3. Debug Mode Default True
**File:** `backend/backend_project/settings.py` (Line 33)  
**Severity:** 🔴 CRITICAL  
**Issue:** DEBUG defaults to True in production scenarios

```python
# CURRENT:
DEBUG = os.getenv('DEBUG', 'True').lower() == 'true'

# RECOMMENDED:
DEBUG = os.getenv('DEBUG', 'False').lower() == 'true'
```

**Why:** In production, DEBUG=True exposes sensitive error messages and system information.

---

### 4. Localhost Fallback in Frontend Component
**File:** `src/components/conversation/module-conversation.tsx` (Lines 58-59)  
**Severity:** 🔴 CRITICAL  
**Issue:** Hardcoded localhost fallback could be used in production

```typescript
// CURRENT (PROBLEMATIC):
const apiUrl = (path: string) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
  return baseUrl + path;
};

// RECOMMENDED:
const apiUrl = (path: string) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  if (!baseUrl) {
    throw new Error('VITE_API_BASE_URL is not configured');
  }
  return baseUrl + path;
};
```

**Why:** If VITE_API_BASE_URL is not set in production, it falls back to localhost, breaking the application.

---

## 🟠 HIGH PRIORITY ISSUES (Security & Maintainability)

### 5. Pricing Data Hardcoded in UI Component
**File:** `src/pages/PrimaryLanding.tsx` (Lines 357-550+)  
**Severity:** 🟠 HIGH  
**Data Affected:**
- FREE plan: $0/month, $5 monthly AI credits
- PREMIUM plan: $6/month, $60/year option, $20 monthly AI credits
- TEAM plan: $60/user/month, $60 monthly AI credits per user
- BUSINESS plan: $200/user/month
- ENTERPRISE plan: Contact Sales

**Issue:** All pricing is hardcoded in JSX, making it difficult to update without code changes.

**Recommendation:** Move to `src/lib/pricing-config.ts` or backend CMS.

---

### 6. Company Contact Information Hardcoded
**File:** `src/pages/PrimaryLanding.tsx` (Lines 672-698)  
**Severity:** 🟠 HIGH  
**Data Affected:**
```
Email: support@josephai.site
Phone: +234 708 811 4692
Address: Lagos, Nigeria
Brand Name: Joseph AI
Copyright Year: 2024
```

**Issue:** Contact information and brand details scattered throughout UI components.

**Recommendation:** Centralize in `src/lib/company-config.ts` or environment variables.

---

### 7. UI Copy & Navigation Hardcoded
**File:** `src/pages/PrimaryLanding.tsx` (Multiple sections)  
**Severity:** 🟠 HIGH  
**Content:**
- Navigation: "Features", "Pricing", "About", "Contact"
- Tagline: "Plan. Decide. Grow."
- Hero description: "Agentic Economic Intelligence System..."
- CTA: "Get Started", "Subscribe" buttons
- Form messages: "Thank you! We'll get back to you within 1 business day."
- Trial text: "14-day free trial • No credit card required"

**Issue:** Makes localization (i18n) and future content updates difficult.

**Recommendation:** Move to i18n library (react-i18next) or content management system.

---

### 8. Feature Descriptions Hardcoded
**File:** `src/pages/PrimaryLanding.tsx` (Lines 283-335)  
**Severity:** 🟠 HIGH  
**Features:**
1. Real-time Financial Insights
2. Smart Pricing Optimization
3. Loan & Funding Advisory
4. Predictive Supply Chain
5. Policy & Market Forecasting
6. Secure Data Management

**Issue:** Feature titles and descriptions are hardcoded arrays, making it hard to manage.

---

### 9. Company Branding Configuration
**File:** `src/lib/company-config.ts` (Full file)  
**Severity:** 🟠 HIGH  
**Data:**
```typescript
name: "E-buy",
fullName: "E-buy Marketplace",
industry: "E-commerce / Online Marketplace",
similarCompanies: ["Jumia", "Konga", "Temu", "Amazon"],
website: "https://www.e-buy.com",
founded: "2018",
headquarters: "Lagos, Nigeria",
activeMarkets: ["Nigeria", "Ghana", "Kenya"],
```

**Issue:** While in a config file, this is still hardcoded. Should be fetched from backend or CMS.

---

### 10. AI Proxy Upstream Endpoints
**File:** `plugins/ai-proxy.ts` (Lines 29, 51, 79)  
**Severity:** 🟠 HIGH  
**Endpoints:**
```typescript
// Gemini
https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}

// OpenAI
https://api.openai.com/v1/chat/completions

// Groq
https://api.groq.com/openai/v1/chat/completions
```

**Issue:** Endpoints and default models are hardcoded.

**Default Models:**
- gemini-1.5-flash
- gpt-4o-mini
- llama-3.3-70b-versatile

**Recommendation:** Move to configuration file or environment variables.

---

### 11. Web API Endpoints Hardcoded
**File:** `src/lib/web-search.ts` (Lines 25, 94)  
**Severity:** 🟠 HIGH  
**Endpoints:**
```typescript
// DuckDuckGo
https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_redirect=1

// Jina Reader
https://r.jina.ai/${url}

// User-Agent
Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36
```

**Issue:** External API endpoints hardcoded.

---

### 12. Google Sign-In Endpoint
**File:** `src/pages/SignUp.tsx`  
**Severity:** 🟠 HIGH  
**Endpoint:**
```html
https://accounts.google.com/gsi/client
```

**Issue:** External script endpoint hardcoded in JSX.

---

## 🟡 MEDIUM PRIORITY ISSUES (Data & Configuration)

### 13. Large Mock Datasets in Source Code
**Files:** Multiple in `src/lib/`  
**Severity:** 🟡 MEDIUM  

**Files with significant hardcoded mock data:**
- `src/lib/supply-chain-data.ts` - 400+ lines of supplier/warehouse/logistics data
- `src/lib/loan-data.ts` - 300+ lines of loan/funding mock data
- `src/lib/pricing-data.ts` - Pricing strategies, competitor analysis, price tests
- `src/lib/market-data.ts` - Market data and metrics
- `src/lib/financial-advisory-data.ts` - Financial guidance data
- `src/lib/inventory-data.ts` - Inventory mock data
- `src/lib/revenue-data.ts` - Revenue data
- `src/lib/tax-compliance-data.ts` - Tax compliance mock data
- `src/lib/economic-data.ts` - Economic indicators
- `src/lib/business-forecast-data.ts` - Business forecast data
- `src/lib/business-forecast-content.ts` - Forecast content strings
- `src/lib/impact-scenarios.ts` - Impact scenario data
- `src/lib/economic-events.ts` - Economic events
- `src/lib/competitive-data.ts` - Competitor information

**Issue:** These large datasets:
1. Increase bundle size if imported by frontend
2. Mix test/seed data with production logic
3. Make it hard to distinguish real data from mocks

**Recommendation:** Move to:
- `src/fixtures/` folder for mocks only loaded in dev
- Backend API endpoints for production data
- Mock API service worker for testing

---

### 14. Docker Container Ports Hardcoded
**Files:** `docker-compose.yml`, `Dockerfile`, `Dockerfile.frontend`  
**Severity:** 🟡 MEDIUM  
**Ports:**
```yaml
- Backend: 8000
- Frontend: 8080
- Database: 5432
```

**Issue:** Port numbers hardcoded. Different environments may need different ports.

---

### 15. Environment Variable Defaults
**File:** `backend/backend_project/settings.py`  
**Severity:** 🟡 MEDIUM  
**Items:**
```python
ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', 'localhost,127.0.0.1')
DEBUG = os.getenv('DEBUG', 'True')
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    # ... 5+ more hardcoded hosts
]
```

**Issue:** Development values as defaults could leak into staging/production.

---

### 16. Sample Metrics in Landing Page
**File:** `src/pages/PrimaryLanding.tsx` (Lines 192-206)  
**Severity:** 🟡 MEDIUM  
**Data:**
```
"Top 10 in competitive market"
"+100% Revenue growth"
```

**Issue:** Metric claims are hardcoded without sources.

---

## 📋 CATEGORIZED HARDCODED DATA SUMMARY

| Category | Count | Files | Risk |
|----------|-------|-------|------|
| Secrets & Credentials | 3 | 2 | 🔴 CRITICAL |
| Pricing & Plans | 50+ items | 2 | 🟠 HIGH |
| UI Copy/Content | 100+ items | 5+ | 🟠 HIGH |
| API Endpoints | 6 | 3 | 🟠 HIGH |
| Mock Datasets | 1000+ items | 13 | 🟡 MEDIUM |
| Configuration Defaults | 15+ | 4 | 🟡 MEDIUM |
| Company Info | 10+ items | 3 | 🟡 MEDIUM |
| **TOTAL** | **1200+** | **20+** | **VARIES** |

---

## ✅ RECOMMENDED ACTIONS (Priority Order)

### Phase 1: Security (Implement Immediately)
- [ ] Remove hardcoded `SECRET_KEY` fallback from `backend/backend_project/settings.py`
- [ ] Remove database credentials from `docker-compose.yml` - use `.env.example` instead
- [ ] Change DEBUG default to `False` in `backend/backend_project/settings.py`
- [ ] Remove localhost fallback from `src/components/conversation/module-conversation.tsx`
- [ ] Create `.env.example` file with all required variables (no real values)

### Phase 2: Configuration Management (Implement This Sprint)
- [ ] Create `src/config/app-config.ts` for all UI/brand configuration
- [ ] Create `src/config/pricing.ts` for pricing plans (or API endpoint)
- [ ] Create `src/config/features.ts` for feature descriptions
- [ ] Create `src/config/api-endpoints.ts` for all API URLs
- [ ] Update `docker-compose.yml` to use `.env` file for secrets

### Phase 3: Content & Localization (Implement Next Sprint)
- [ ] Implement i18n (react-i18next) for UI copy
- [ ] Move all hardcoded strings to translation files
- [ ] Centralize contact information in backend or CMS
- [ ] Create content management strategy for pricing updates

### Phase 4: Data Management (Implement Later)
- [ ] Move mock datasets to `src/fixtures/` folder
- [ ] Create mock API service worker (MSW) for testing
- [ ] Create backend seed scripts for initial data
- [ ] Implement database migration strategy

### Phase 5: Backend Integration (Ongoing)
- [ ] Create API endpoints for dynamic pricing
- [ ] Create API endpoints for company configuration
- [ ] Create API endpoints for feature descriptions
- [ ] Create API endpoints for economic/business data

---

## 📄 Required Files to Create

### 1. `.env.example`
```
# Backend
DJANGO_SECRET_KEY=your-secure-random-secret-key-here
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=postgresql://postgres:password@db:5432/economic_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your-secure-password

# API Keys
GEMINI_API_KEY=your-gemini-api-key
GROQ_API_KEY=your-groq-api-key
OPENAI_API_KEY=your-openai-api-key

# Frontend
VITE_API_BASE_URL=http://localhost:8000
VITE_CHATBOT_BACKEND_URL=http://localhost:8000
VITE_GEMINI_API_KEY=your-gemini-api-key
VITE_OPENAI_API_KEY=your-openai-api-key

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### 2. `src/config/app-config.ts`
```typescript
export const APP_CONFIG = {
  branding: {
    name: 'Joseph AI',
    companyName: 'Joseph AI',
    logo: '/assets/logo.svg',
  },
  contact: {
    email: process.env.VITE_CONTACT_EMAIL || 'support@josephai.site',
    phone: process.env.VITE_CONTACT_PHONE || '+234 708 811 4692',
    address: process.env.VITE_CONTACT_ADDRESS || 'Lagos, Nigeria',
  },
  trial: {
    days: 14,
    noCardRequired: true,
  },
  // ... more configuration
};
```

### 3. `src/config/pricing.ts`
```typescript
export const PRICING_PLANS = [
  {
    id: 'free',
    name: 'FREE',
    price: 0,
    billing: '/month',
    description: 'Get Started',
    // ... plan details
  },
  // ... more plans
];
```

### 4. `.env` (Development, .gitignore'd)
```
# Copy from .env.example and fill in actual values
# This file should NEVER be committed to git
```

---

## 🔐 Security Checklist

- [ ] No hardcoded secrets in source code
- [ ] No real credentials in docker-compose.yml
- [ ] No real credentials in documentation examples
- [ ] SECRET_KEY has no fallback value
- [ ] DEBUG defaults to False for security
- [ ] All API endpoints use environment variables
- [ ] .env file is in .gitignore
- [ ] .env.example provided with placeholder values only
- [ ] No localhost defaults for API URLs in production code
- [ ] All sensitive data behind environment variable gates

---

## 📊 Impact Analysis

### If We Don't Fix This:
- **Security:** Secrets exposed if repo is made public or leaked
- **Maintainability:** Difficult to update pricing, contacts, copy without code changes
- **Scalability:** Harder to manage multiple environments (dev/staging/prod)
- **Testing:** Mock data mixed with production logic
- **Performance:** Unused mock datasets in bundle
- **Localization:** UI copy hardcoded makes i18n impossible

### Expected Impact After Fix:
- ✅ 100% secrets protected
- ✅ Content updates without code deployment
- ✅ Easy environment configuration
- ✅ Clear separation of mock vs. real data
- ✅ Smaller production bundle
- ✅ Ready for internationalization
- ✅ Better developer experience

---

## 📚 Related Documentation

- Security Best Practices: See `BACKEND_INTEGRATION_GUIDE.md`
- Deployment Guide: See `README.md`
- API Documentation: See `API_DOCUMENTATION.md`

---

**Report Generated:** January 2025  
**Next Review:** After implementing Phase 1 & 2  
**Responsibility:** Development Team  
**Urgency:** 🔴 CRITICAL - Address Phase 1 before next deployment
