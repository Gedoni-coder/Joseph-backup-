from django.urls import path, include
from rest_framework.routers import DefaultRouter
from ..views import (
    ChatMessageViewSet, ModuleConversationViewSet, AgentStateViewSet
)

router = DefaultRouter()
router.register(r'messages', ChatMessageViewSet)
router.register(r'conversations', ModuleConversationViewSet)
router.register(r'agent', AgentStateViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
