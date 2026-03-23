# Dynamic Tables Implementation TODO

✅ Frontend syntax fixed

## Backend Django Steps
1. business_forecast/models.py: Add BusinessMetric model (category, metric, current, target, lastMonth, trend, change, status)
2. serializers.py: BusinessMetricSerializer
3. views.py: BusinessMetricListView (ListAPIView)
4. api/urls.py: path('business-metrics/', BusinessMetricListView.as_view())

## Frontend Steps
5. src/lib/api/business-forecasting-service.ts: Add getBusinessMetrics()
6. src/hooks/useBusinessForecastingData.ts: Add query, businessMetrics: data?.map(...) || []
7. src/components/business/business-metrics-table.tsx: Replace mock array with businessMetrics prop from hook
8. src/components/business/financial-layout.tsx: Compute from costStructure/revenueProjections or new FinancialMetric

## Post-Edit
9. python manage.py makemigrations business_forecast && python manage.py migrate
10. Seed 53 metrics via Django shell/admin
11. cd "Joseph-backup-" && npm run dev - test Tables tab

**Current Progress: 1/11**

