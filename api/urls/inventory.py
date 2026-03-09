from django.urls import path, include
from rest_framework.routers import DefaultRouter
from ..views import (
    InventoryItemViewSet, StockMovementViewSet, SupplierViewSet,
    ProcurementOrderViewSet, LogisticsMetricViewSet
)

router = DefaultRouter()
router.register(r'inventory-items', InventoryItemViewSet)
router.register(r'stock-movements', StockMovementViewSet)
router.register(r'suppliers', SupplierViewSet)
router.register(r'procurement-orders', ProcurementOrderViewSet)
router.register(r'logistics-metrics', LogisticsMetricViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
