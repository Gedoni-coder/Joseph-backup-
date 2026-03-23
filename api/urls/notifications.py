"""
URL routing for Notification endpoints
"""
from rest_framework.routers import DefaultRouter
from api.views import NotificationViewSet

router = DefaultRouter()
router.register(r'messages', NotificationViewSet, basename='notification')

urlpatterns = router.urls
