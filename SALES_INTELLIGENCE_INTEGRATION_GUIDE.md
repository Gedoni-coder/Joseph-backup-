# Sales Intelligence Module Integration Guide

## Overview

This guide provides step-by-step instructions for integrating the Sales Intelligence module into your Django REST framework application.

## Prerequisites

- Django 3.2+
- Django REST Framework 3.12+
- Python 3.8+
- PostgreSQL (recommended for production)
- `django-filter` package

## Installation Steps

### 1. Install Required Packages

```bash
pip install djangorestframework django-filter
pip install -r requirements.txt
```

### 2. Update Django Settings

Add to `backend_django/settings.py`:

```python
INSTALLED_APPS = [
    # ... other apps
    'rest_framework',
    'django_filters',
    'api',  # Your API app
]

REST_FRAMEWORK = {
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
}
```

### 3. Add Sales Intelligence URLs

Add to `api/urls.py`:

```python
from django.urls import path, include
from . import sales_intelligence_urls

urlpatterns = [
    # ... existing patterns
    path('sales/', include(sales_intelligence_urls.urlpatterns)),
]
```

Or update your main `backend_django/urls.py`:

```python
from django.urls import path, include

urlpatterns = [
    # ... existing patterns
    path('api/v1/', include('api.urls')),
]
```

### 4. Create and Run Migrations

```bash
# Generate migration files
python manage.py makemigrations

# Apply migrations to database
python manage.py migrate

# Show migration status
python manage.py showmigrations
```

### 5. Create Superuser (if needed)

```bash
python manage.py createsuperuser
```

### 6. Register Models in Django Admin

Add to `api/admin.py`:

```python
from django.contrib import admin
from .models import (
    SalesRep, Lead, Opportunity, SalesMetric, 
    ActivityLog, SalesPipeline, CompetitionTracking, SalesVelocity
)

@admin.register(SalesRep)
class SalesRepAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'territory', 'status', 'ytd_sales', 'ytd_quota_percentage')
    list_filter = ('territory', 'status', 'department')
    search_fields = ('first_name', 'last_name', 'email')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'company', 'status', 'lead_score', 'assigned_to')
    list_filter = ('status', 'lead_source', 'industry', 'company_size')
    search_fields = ('first_name', 'last_name', 'email', 'company')
    readonly_fields = ('created_at', 'updated_at', 'converted_at')

@admin.register(Opportunity)
class OpportunityAdmin(admin.ModelAdmin):
    list_display = ('name', 'company', 'amount', 'stage', 'probability', 'is_won', 'close_date_expected')
    list_filter = ('stage', 'is_closed', 'is_won')
    search_fields = ('name', 'company', 'contact_name')
    readonly_fields = ('created_at', 'updated_at', 'weighted_amount')

@admin.register(ActivityLog)
class ActivityLogAdmin(admin.ModelAdmin):
    list_display = ('activity_type', 'subject', 'sales_rep', 'scheduled_date', 'status')
    list_filter = ('activity_type', 'status', 'scheduled_date')
    search_fields = ('subject', 'description')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(SalesMetric)
class SalesMetricAdmin(admin.ModelAdmin):
    list_display = ('name', 'metric_type', 'period_start', 'achievement_percentage', 'is_on_track')
    list_filter = ('metric_type', 'period_type', 'is_on_track')
    search_fields = ('name',)
    readonly_fields = ('created_at', 'updated_at', 'variance', 'achievement_percentage')

@admin.register(SalesPipeline)
class SalesPipelineAdmin(admin.ModelAdmin):
    list_display = ('name', 'total_opportunities', 'total_pipeline_value', 'period')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(CompetitionTracking)
class CompetitionTrackingAdmin(admin.ModelAdmin):
    list_display = ('competitor_name', 'opportunity', 'strength', 'last_updated')
    list_filter = ('strength', 'last_updated')
    search_fields = ('competitor_name', 'opportunity__name')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(SalesVelocity)
class SalesVelocityAdmin(admin.ModelAdmin):
    list_display = ('sales_rep', 'total_sales_cycle_days', 'deals_analyzed', 'period_end')
    list_filter = ('period_end', 'sales_rep')
    readonly_fields = ('created_at', 'updated_at')
```

## Database Schema

### Core Tables

1. **SalesRep**
   - Stores sales representative information and performance metrics
   - Relationships: self-referential (manager), has many leads/opportunities/activities

2. **Lead**
   - Represents prospective customers
   - Relationships: belongs to SalesRep (assigned_to)

3. **Opportunity**
   - Represents potential sales deals
   - Relationships: belongs to Lead, SalesRep (assigned_to)

4. **ActivityLog**
   - Tracks all sales activities (calls, emails, meetings, etc.)
   - Relationships: belongs to SalesRep, Lead (optional), Opportunity (optional)

5. **SalesMetric**
   - Aggregated performance metrics
   - Relationships: belongs to SalesRep (optional)

6. **SalesPipeline**
   - Pipeline snapshots and funnel analysis
   - No relationships (aggregate data)

7. **CompetitionTracking**
   - Tracks competitive information per opportunity
   - Relationships: belongs to Opportunity

8. **SalesVelocity**
   - Measures deal velocity through sales stages
   - Relationships: belongs to SalesRep

## Data Model Index Strategy

For optimal performance, the following indexes are created:

```python
# ActivityLog indexes
models.Index(fields=['sales_rep', 'scheduled_date']),
models.Index(fields=['activity_type', 'status']),

# Lead indexes
models.Index(fields=['status', 'assigned_to']),
models.Index(fields=['lead_score', '-created_at']),

# Opportunity indexes
models.Index(fields=['stage', 'assigned_to']),
models.Index(fields=['close_date_expected', 'is_won']),

# SalesMetric indexes
models.Index(fields=['metric_type', 'period_start']),
models.Index(fields=['sales_rep', 'period_end']),
```

## API Endpoint Summary

All endpoints are under `/api/v1/sales/`:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /sales-reps/ | List all sales reps |
| POST | /sales-reps/ | Create new sales rep |
| GET | /sales-reps/{id}/ | Get sales rep details |
| GET | /sales-reps/dashboard/ | Sales rep dashboard |
| GET | /leads/ | List all leads |
| POST | /leads/ | Create new lead |
| GET | /leads/{id}/ | Get lead details |
| GET | /leads/summary/ | Lead analytics summary |
| GET | /leads/high_priority/ | Get high-priority leads |
| POST | /leads/{id}/convert/ | Convert lead to opportunity |
| GET | /opportunities/ | List all opportunities |
| POST | /opportunities/ | Create new opportunity |
| GET | /opportunities/{id}/ | Get opportunity details |
| GET | /opportunities/pipeline_summary/ | Pipeline breakdown |
| GET | /opportunities/forecast/ | Revenue forecast |
| POST | /opportunities/{id}/advance_stage/ | Move to next stage |
| POST | /opportunities/{id}/close/ | Close opportunity |
| GET | /sales-metrics/ | List all metrics |
| GET | /activities/ | List all activities |
| POST | /activities/ | Create new activity |
| GET | /activities/upcoming/ | Get upcoming activities |
| GET | /activities/overdue/ | Get overdue activities |
| GET | /competition/ | List competitive tracking |
| POST | /competition/ | Add competitor to opportunity |
| GET | /velocity/ | List sales velocity metrics |

## Sample Data Loading

### Create Sample Sales Reps

```python
from api.models import SalesRep

SalesRep.objects.bulk_create([
    SalesRep(
        first_name='John',
        last_name='Smith',
        email='john.smith@company.com',
        territory='north',
        status='active',
        quota=500000,
        annual_quota=1200000
    ),
    SalesRep(
        first_name='Sarah',
        last_name='Johnson',
        email='sarah.johnson@company.com',
        territory='south',
        status='active',
        quota=450000,
        annual_quota=1100000
    ),
])
```

### Create Sample Leads

```python
from api.models import Lead, SalesRep

rep = SalesRep.objects.first()

Lead.objects.bulk_create([
    Lead(
        first_name='Michael',
        last_name='Brown',
        email='m.brown@techcorp.com',
        company='TechCorp Inc',
        job_title='IT Director',
        status='qualified',
        lead_source='website',
        lead_score=85,
        assigned_to=rep,
        user=rep.user
    ),
])
```

## Testing the Integration

### Using cURL

```bash
# Get all sales reps
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/v1/sales/sales-reps/

# Get pipeline summary
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/v1/sales/opportunities/pipeline_summary/
```

### Using Python

```python
import requests
import json

headers = {'Authorization': 'Bearer YOUR_TOKEN'}

# Get opportunities
response = requests.get(
    'http://localhost:8000/api/v1/sales/opportunities/',
    headers=headers,
    params={'is_closed': 'false'}
)
print(json.dumps(response.json(), indent=2))
```

## Troubleshooting

### Common Issues

#### 1. Import Errors

If you see import errors for serializers or views:
- Ensure files are in the correct directory: `api/`
- Check that `__init__.py` exists in the api directory
- Run: `python manage.py check`

#### 2. Migration Conflicts

If you encounter migration conflicts:
```bash
# Show migration status
python manage.py showmigrations

# If needed, create new migration
python manage.py makemigrations --merge
```

#### 3. Permission Denied

If you get 403 Forbidden:
- Check user authentication
- Verify JWT token is valid
- Ensure user has required permissions

#### 4. Database Connection

If database connection fails:
- Check DATABASE settings in settings.py
- Verify database is running
- Run: `python manage.py dbshell` to test connection

## Performance Optimization

### Query Optimization

The views use `select_related()` and `prefetch_related()` for efficient queries:

```python
# In viewsets:
queryset = Opportunity.objects.select_related('assigned_to', 'lead')
queryset = SalesRep.objects.prefetch_related('leads', 'opportunities')
```

### Caching Strategy

Consider implementing caching for frequently accessed data:

```python
from django.views.decorators.cache import cache_page

@cache_page(60 * 5)  # 5 minutes
def pipeline_summary(request):
    # expensive query
    pass
```

### Database Indexes

Verify indexes are created:

```bash
python manage.py sqlsequencereset api | python manage.py dbshell
```

## Security Considerations

1. **Authentication**: All endpoints require JWT authentication
2. **Permissions**: Implement role-based access control
3. **Data Validation**: Django REST framework handles most validation
4. **SQL Injection**: Django ORM prevents SQL injection
5. **Rate Limiting**: Implement rate limiting on sensitive endpoints

## Next Steps

1. **Test the API**: Use the provided examples to test endpoints
2. **Create Frontend**: Build UI components to consume these APIs
3. **Add Reporting**: Create reports from the metrics data
4. **Setup Webhooks**: Implement webhooks for real-time updates
5. **Configure Notifications**: Set up alerts for key events

## Support & Documentation

- **API Docs**: See `API_SALES_INTELLIGENCE.md` for detailed endpoint documentation
- **Django Docs**: https://docs.djangoproject.com/
- **DRF Docs**: https://www.django-rest-framework.org/
- **Internal Wiki**: Check your organization's internal documentation

## Version History

- **v1.0.0** (2025-03-20)
  - Initial release with core CRM functionality
  - Sales rep, lead, opportunity management
  - Activity tracking and metrics
  - Pipeline and velocity analytics
