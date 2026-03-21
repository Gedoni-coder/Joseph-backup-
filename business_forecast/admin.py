from django.contrib import admin
from .models import BusinessMetric

@admin.register(BusinessMetric)
class BusinessMetricAdmin(admin.ModelAdmin):
    list_display = ('metric', 'category', 'current', 'target', 'status', 'change')
    list_filter = ('category', 'status')
    search_fields = ('metric', 'category')
    fieldsets = (
        ('Basic Info', {'fields': ('metric', 'category', 'status')}),
        ('Metrics', {'fields': ('current', 'target', 'last_month', 'change')}),
        ('Trend', {'fields': ('trend',)}),
    )
