"""
URL configuration for backend_django project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

# Import routers from each module
from api.urls import economic, business, market, loan, revenue, financial, pricing, tax, policy, inventory, chatbot, company

# Import auth views
from api.auth_views import signup, login_view, logout_view, get_user

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Auth endpoints
    path('api/auth/signup/', signup, name='signup'),
    path('api/auth/login/', login_view, name='login'),
    path('api/auth/logout/', logout_view, name='logout'),
    path('api/auth/me/', get_user, name='get_user'),
    
    # Economic endpoints: /api/economic/metrics/, /api/economic/news/, etc.
    path('api/economic/', include(economic.router.urls)),
    
    # Business endpoints: /api/business/customer-profiles/, etc.
    path('api/business/', include(business.router.urls)),
    
    # Market endpoints: /api/market/segments/, etc.
    path('api/market/', include(market.router.urls)),
    
    # Loan endpoints
    path('api/loan/', include(loan.router.urls)),
    
    # Revenue endpoints
    path('api/revenue/', include(revenue.router.urls)),
    
    # Financial endpoints
    path('api/financial/', include(financial.router.urls)),
    
    # Pricing endpoints
    path('api/pricing/', include(pricing.router.urls)),
    
    # Tax endpoints
    path('api/tax/', include(tax.router.urls)),
    
    # Policy endpoints
    path('api/policy/', include(policy.router.urls)),
    
    # Inventory endpoints
    path('api/inventory/', include(inventory.router.urls)),
    
    # Chatbot endpoints
    path('chatbot/', include(chatbot.router.urls)),
    
    # Company endpoints
    path('api/company/', include(company.router.urls)),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
