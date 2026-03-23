from rest_framework.routers import DefaultRouter
from ..views import AdviceMessageViewSet

router = DefaultRouter()
router.register(r'messages', AdviceMessageViewSet, basename='advice-message')

urlpatterns = router.urls
