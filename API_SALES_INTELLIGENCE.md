# Sales Intelligence API Documentation

## Overview

The Sales Intelligence API provides comprehensive endpoints for managing sales operations, including leads, opportunities, sales representatives, activities, and performance metrics. This module enables organizations to track and optimize their sales process from lead generation to deal closure.

## Base URLs

All endpoints are under `/api/v1/sales/` base path.

```
Production: https://api.yourapp.com/api/v1/sales/
Development: http://localhost:8000/api/v1/sales/
```

## Authentication

All endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Core Endpoints

### 1. Sales Representatives (`/api/v1/sales/sales-reps/`)

#### List Sales Reps
```
GET /api/v1/sales/sales-reps/
```

**Query Parameters:**
- `territory`: Filter by territory (north, south, east, west, central, international, virtual, enterprise)
- `status`: Filter by status (active, inactive, on_leave, terminated)
- `department`: Filter by department
- `search`: Search by first_name, last_name, email, or title
- `ordering`: Order by ytd_sales, ytd_quota_percentage, win_rate, last_name

**Example:**
```bash
GET /api/v1/sales/sales-reps/?territory=north&status=active&ordering=-ytd_sales
```

**Response:**
```json
{
  "count": 25,
  "next": "http://api.example.com/api/v1/sales/sales-reps/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "first_name": "John",
      "last_name": "Smith",
      "email": "john.smith@company.com",
      "phone": "+1-555-0123",
      "title": "Senior Sales Representative",
      "department": "Enterprise Sales",
      "territory": "north",
      "status": "active",
      "quota": 500000,
      "ytd_sales": 425000,
      "ytd_quota_percentage": 85,
      "annual_quota": 1200000,
      "active_leads": 12,
      "active_opportunities": 5,
      "pipeline_value": 1500000,
      "win_rate": 42.5,
      "calls_this_week": 18,
      "emails_this_week": 45,
      "meetings_this_week": 7,
      "average_deal_size": 125000,
      "deal_cycle_days": 45,
      "customer_retention": 92.5,
      "created_at": "2024-01-15T10:00:00Z",
      "updated_at": "2024-03-10T15:30:00Z",
      "subordinates_count": 3
    }
  ]
}
```

#### Create Sales Rep
```
POST /api/v1/sales/sales-reps/
```

**Request Body:**
```json
{
  "first_name": "Jane",
  "last_name": "Doe",
  "email": "jane.doe@company.com",
  "phone": "+1-555-0456",
  "title": "Sales Representative",
  "department": "Mid-Market Sales",
  "territory": "south",
  "manager": 1,
  "status": "active",
  "quota": 400000,
  "annual_quota": 1000000,
  "hire_date": "2023-06-01"
}
```

#### Get Sales Rep Detail
```
GET /api/v1/sales/sales-reps/{id}/
```

#### Update Sales Rep
```
PATCH /api/v1/sales/sales-reps/{id}/
```

#### Delete Sales Rep
```
DELETE /api/v1/sales/sales-reps/{id}/
```

#### Dashboard Action
```
GET /api/v1/sales/sales-reps/dashboard/
```

Returns summary of all sales reps with key metrics.

**Response:**
```json
{
  "total_reps": 25,
  "total_quota": 12500000,
  "total_ytd_sales": 10625000,
  "avg_win_rate": 41.2,
  "total_pipeline_value": 45300000,
  "reps": [...]
}
```

#### Performance Action
```
GET /api/v1/sales/sales-reps/{id}/performance/
```

Returns detailed performance metrics for a specific rep.

#### Activity Summary Action
```
GET /api/v1/sales/sales-reps/{id}/activity_summary/
```

Returns activity summary for the current week.

---

### 2. Leads (`/api/v1/sales/leads/`)

#### List Leads
```
GET /api/v1/sales/leads/
```

**Query Parameters:**
- `status`: (new, contacted, qualified, nurturing, ready_to_close, disqualified, converted, lost)
- `lead_source`: (website, referral, cold_call, trade_show, email, social_media, partnership, paid_ads, inbound, marketing, other)
- `industry`: Filter by industry
- `company_size`: Filter by company size
- `assigned_to`: Filter by assigned sales rep
- `search`: Search by name, email, company, job title
- `ordering`: Order by lead_score, created_at, last_contact_date, response_rate

**Example:**
```bash
GET /api/v1/sales/leads/?status=qualified&ordering=-lead_score
```

#### Create Lead
```
POST /api/v1/sales/leads/
```

**Request Body:**
```json
{
  "first_name": "Michael",
  "last_name": "Johnson",
  "email": "michael.johnson@techcorp.com",
  "phone": "+1-555-0789",
  "company": "TechCorp Inc",
  "job_title": "VP of Operations",
  "company_website": "https://techcorp.com",
  "company_size": "large",
  "industry": "technology",
  "annual_revenue": 500000000,
  "status": "new",
  "lead_source": "website",
  "lead_score": 75,
  "budget_available": true,
  "decision_maker": true,
  "timeline": "Q2 2025",
  "notes": "High priority prospect. Excellent fit for enterprise solution."
}
```

#### Get Lead Detail
```
GET /api/v1/sales/leads/{id}/
```

#### Update Lead
```
PATCH /api/v1/sales/leads/{id}/
```

#### Summary Action
```
GET /api/v1/sales/leads/summary/
```

Returns comprehensive lead analytics and summary.

**Response:**
```json
{
  "total_leads": 450,
  "new_leads": 85,
  "contacted_leads": 120,
  "qualified_leads": 95,
  "converted_leads": 125,
  "lost_leads": 25,
  "conversion_rate": 27.78,
  "avg_lead_score": 68.5,
  "avg_response_rate": 42.3,
  "by_source": {
    "website": 120,
    "referral": 85,
    "cold_call": 95,
    ...
  },
  "by_status": {...},
  "by_industry": {...}
}
```

#### High Priority Action
```
GET /api/v1/sales/leads/high_priority/
```

Returns top 50 high-priority leads (score >= 70, qualified/new, not contacted in 7+ days).

#### Convert Lead to Opportunity
```
POST /api/v1/sales/leads/{id}/convert/
```

Marks lead as converted and returns confirmation with timestamp.

#### Bulk Assign
```
POST /api/v1/sales/leads/bulk_assign/
```

**Request Body:**
```json
{
  "lead_ids": [1, 2, 3, 4, 5],
  "rep_id": 7
}
```

---

### 3. Opportunities (`/api/v1/sales/opportunities/`)

#### List Opportunities
```
GET /api/v1/sales/opportunities/
```

**Query Parameters:**
- `stage`: (prospecting, qualification, needs_analysis, proposal, negotiation, closed_won, closed_lost, on_hold)
- `is_won`: (true, false)
- `is_closed`: (true, false)
- `assigned_to`: Filter by sales rep
- `company`: Filter by company
- `search`: Search by name, company, contact
- `ordering`: Order by amount, probability, close_date_expected, weighted_amount

**Example - Get all open opportunities:**
```bash
GET /api/v1/sales/opportunities/?is_closed=false&ordering=-weighted_amount
```

#### Create Opportunity
```
POST /api/v1/sales/opportunities/
```

**Request Body:**
```json
{
  "name": "Enterprise Solutions Implementation",
  "description": "Full platform implementation for mid-market retail company",
  "company": "RetailCorp Inc",
  "contact_name": "Sarah Williams",
  "contact_email": "sarah.williams@retailcorp.com",
  "amount": 250000,
  "currency": "USD",
  "stage": "needs_analysis",
  "probability": 50,
  "close_date_expected": "2025-05-30",
  "assigned_to": 5,
  "products_services": ["Platform License", "Implementation Services", "Training"],
  "key_competitors": ["Competitor A", "Competitor B"],
  "champion_identified": true,
  "budget_confirmed": true,
  "engagement_score": 85,
  "notes": "Executive sponsor committed. Strong business case."
}
```

#### Pipeline Summary
```
GET /api/v1/sales/opportunities/pipeline_summary/
```

Returns detailed pipeline breakdown by stage with values and counts.

**Response:**
```json
{
  "total_opportunities": 145,
  "total_pipeline_value": 18500000,
  "weighted_pipeline": 9250000,
  "by_stage": {
    "Prospecting": {
      "count": 25,
      "value": 2500000,
      "weighted_value": 250000
    },
    "Qualification": {
      "count": 35,
      "value": 4500000,
      "weighted_value": 1125000
    },
    ...
  },
  "closed_won": 45,
  "closed_lost": 15,
  "avg_deal_size": 127586
}
```

#### Revenue Forecast
```
GET /api/v1/sales/opportunities/forecast/
```

Returns revenue forecast based on opportunity probability and close dates.

**Response:**
```json
{
  "total_weighted_forecast": 9250000,
  "forecast_next_30_days": 2150000,
  "forecast_next_90_days": 6400000,
  "by_stage": {
    "Prospecting": 250000,
    "Qualification": 1125000,
    "Needs Analysis": 1800000,
    "Proposal": 2250000,
    "Negotiation": 3825000
  },
  "by_rep": {
    "Smith": 1500000,
    "Johnson": 1200000,
    ...
  }
}
```

#### Advance Stage
```
POST /api/v1/sales/opportunities/{id}/advance_stage/
```

Automatically moves opportunity to next stage in sales funnel.

#### Close Opportunity
```
POST /api/v1/sales/opportunities/{id}/close/
```

**Request Body:**
```json
{
  "is_won": true,
  "close_reason": "won_solution_fit",
  "close_notes": "Excellent implementation partner fit. Strong ROI demonstration."
}
```

---

### 4. Sales Metrics (`/api/v1/sales/sales-metrics/`)

#### List Metrics
```
GET /api/v1/sales/sales-metrics/
```

**Query Parameters:**
- `metric_type`: (revenue, pipeline, activity, conversion, efficiency, forecast, performance)
- `dimension`: (overall, by_rep, by_territory, by_source, by_stage, by_product)
- `period_type`: (daily, weekly, monthly, quarterly, annual)
- `sales_rep`: Filter by sales rep
- `ordering`: Order by period_end, achievement_percentage

#### Dashboard
```
GET /api/v1/sales/sales-metrics/dashboard/
```

Returns current metrics dashboard summary.

---

### 5. Activity Logs (`/api/v1/sales/activities/`)

#### List Activities
```
GET /api/v1/sales/activities/
```

**Query Parameters:**
- `activity_type`: (call, email, meeting, task, note, demo, proposal, contract, other)
- `status`: (planned, in_progress, completed, cancelled, no_show)
- `sales_rep`: Filter by rep
- `lead`: Filter by lead
- `opportunity`: Filter by opportunity

#### Create Activity
```
POST /api/v1/sales/activities/
```

**Request Body:**
```json
{
  "activity_type": "call",
  "subject": "Discovery call with procurement team",
  "description": "Initial discovery call to understand requirements and timeline",
  "call_direction": "outbound",
  "scheduled_date": "2025-03-20",
  "scheduled_time": "14:00",
  "sales_rep": 5,
  "opportunity": 12,
  "participants": ["Sarah Williams", "John Smith"],
  "status": "planned"
}
```

#### Upcoming Activities
```
GET /api/v1/sales/activities/upcoming/
```

Returns next 50 planned/in-progress activities ordered by date.

#### Overdue Activities
```
GET /api/v1/sales/activities/overdue/
```

Returns all overdue activities that haven't been completed.

---

### 6. Competition Tracking (`/api/v1/sales/competition/`)

#### List Competition
```
GET /api/v1/sales/competition/
```

**Query Parameters:**
- `competitor_name`: Filter by competitor
- `strength`: (strong, moderate, weak)
- `opportunity`: Filter by opportunity

#### Create Competition Entry
```
POST /api/v1/sales/competition/
```

**Request Body:**
```json
{
  "opportunity": 12,
  "competitor_name": "Competitor A",
  "strength": "strong",
  "our_advantages": [
    "Better pricing",
    "Superior customer support",
    "Faster implementation"
  ],
  "competitive_gaps": [
    "More established brand",
    "Larger customer base"
  ],
  "battle_card": "Key messaging for sales team..."
}
```

---

### 7. Sales Velocity (`/api/v1/sales/velocity/`)

#### List Velocity Metrics
```
GET /api/v1/sales/velocity/
```

**Query Parameters:**
- `sales_rep`: Filter by rep
- `ordering`: Order by period_end

---

## Common Query Patterns

### Get High-Value Opportunities
```bash
GET /api/v1/sales/opportunities/?is_closed=false&ordering=-amount
```

### Get Active Leads by Territory
```bash
GET /api/v1/sales/leads/?status__in=qualified,nurturing&team__territory=north
```

### Get YTD Sales by Rep
```bash
GET /api/v1/sales/sales-reps/?ordering=-ytd_sales
```

### Get Upcoming Meetings
```bash
GET /api/v1/sales/activities/?activity_type=meeting&status=planned
```

---

## Response Codes

- `200 OK`: Request succeeded
- `201 Created`: Resource created successfully
- `204 No Content`: Request succeeded, no content to return
- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `500 Server Error`: Internal server error

---

## Pagination

List endpoints support pagination with default page size of 20.

**Query Parameters:**
- `page`: Page number (default: 1)
- `page_size`: Items per page (default: 20, max: 100)

**Example:**
```bash
GET /api/v1/sales/leads/?page=2&page_size=50
```

---

## Filtering

Use Django ORM filters in query parameters.

**Examples:**
```bash
# Greater than
GET /api/v1/sales/opportunities/?amount__gte=100000

# Less than
GET /api/v1/sales/leads/?lead_score__lt=50

# Contains
GET /api/v1/sales/leads/?company__icontains=tech

# Date range
GET /api/v1/sales/opportunities/?close_date_expected__gte=2025-03-01&close_date_expected__lte=2025-03-31
```

---

## Error Handling

All errors return JSON format:

```json
{
  "error": "Error message",
  "details": {
    "field_name": ["Error details"]
  }
}
```

---

## Rate Limiting

API endpoints are rate-limited to:
- 1000 requests per hour per IP
- 100 requests per minute per authenticated user

---

## Integration Examples

### Python (Requests)
```python
import requests

headers = {
    'Authorization': 'Bearer YOUR_TOKEN',
    'Content-Type': 'application/json'
}

# Get opportunities
response = requests.get(
    'https://api.example.com/api/v1/sales/opportunities/?is_closed=false',
    headers=headers
)
opportunities = response.json()

# Create lead
lead_data = {
    'first_name': 'John',
    'last_name': 'Doe',
    'email': 'john@example.com',
    'company': 'ACME Corp',
    'job_title': 'Director of Sales',
    'status': 'new',
    'lead_source': 'website'
}

response = requests.post(
    'https://api.example.com/api/v1/sales/leads/',
    headers=headers,
    json=lead_data
)
```

### JavaScript (Axios)
```javascript
import axios from 'axios';

const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
};

// Get opportunities
axios.get('/api/v1/sales/opportunities/?is_closed=false', { headers })
  .then(response => console.log(response.data))
  .catch(error => console.error(error));

// Create activity
const activityData = {
  activity_type: 'call',
  subject: 'Discovery call',
  sales_rep: 5,
  scheduled_date: '2025-03-20',
  status: 'planned'
};

axios.post('/api/v1/sales/activities/', activityData, { headers })
  .then(response => console.log(response.data))
  .catch(error => console.error(error));
```

---

## Webhooks (Future)

Plan to implement webhooks for:
- Opportunity stage changes
- Deal closures
- High-priority lead creation
- Activity completion

---

## Support

For API support, contact: api-support@yourapp.com
