from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import CompanyProfile
import json

@csrf_exempt
@require_http_methods(["POST"])
def signup(request):
    """
    Create a new user account with optional company profile
    """
    try:
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')
        name = data.get('name', '')
        
        if not email or not password:
            return JsonResponse(
                {'error': 'Email and password are required'},
                status=400
            )
        
        # Check if user already exists
        if User.objects.filter(username=email).exists():
            return JsonResponse(
                {'error': 'User with this email already exists'},
                status=400
            )
        
        # Create user
        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            first_name=name.split()[0] if name else '',
            last_name=' '.join(name.split()[1:]) if len(name.split()) > 1 else ''
        )
        
        # Check if company profile data was provided
        company_data = data.get('company', {})
        
        if company_data:
            # Create company profile linked to this user
            CompanyProfile.objects.create(
                user=user,
                company_name=company_data.get('company_name', ''),
                description=company_data.get('description', ''),
                number_of_workers=company_data.get('number_of_workers', 1),
                sector=company_data.get('sector', ''),
                company_size=company_data.get('company_size', 'small'),
                country=company_data.get('country', ''),
                state=company_data.get('state', ''),
                city=company_data.get('city', ''),
                website_url=company_data.get('website_url', ''),
                email=company_data.get('email', email),
                phone=company_data.get('phone', '')
            )
        
        return JsonResponse({
            'user_id': str(user.id),
            'email': user.email,
            'name': name,
            'has_company_profile': bool(company_data),
            'message': 'User created successfully'
        }, status=201)
        
    except Exception as e:
        return JsonResponse(
            {'error': str(e)},
            status=500
        )

@csrf_exempt
@require_http_methods(["POST"])
def login_view(request):
    """
    Login with email and password
    """
    try:
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return JsonResponse(
                {'error': 'Email and password are required'},
                status=400
            )
        
        # Authenticate user
        user = authenticate(request, username=email, password=password)
        
        if user is not None:
            login(request, user)
            
            # Check if user has a company profile
            company_profile = CompanyProfile.objects.filter(user=user).first()
            
            return JsonResponse({
                'user_id': str(user.id),
                'email': user.email,
                'name': f"{user.first_name} {user.last_name}".strip() or user.username,
                'has_company_profile': company_profile is not None,
                'company_profile_id': company_profile.id if company_profile else None,
                'message': 'Login successful'
            })
        else:
            return JsonResponse(
                {'error': 'Invalid email or password'},
                status=401
            )
            
    except Exception as e:
        return JsonResponse(
            {'error': str(e)},
            status=500
        )

@csrf_exempt
@require_http_methods(["POST"])
def logout_view(request):
    """
    Logout the current user
    """
    logout(request)
    return JsonResponse({'message': 'Logged out successfully'})

@require_http_methods(["GET"])
def get_user(request):
    """
    Get the current logged in user with company profile info
    """
    if request.user.is_authenticated:
        # Check if user has a company profile
        company_profile = CompanyProfile.objects.filter(user=request.user).first()
        
        return JsonResponse({
            'user_id': str(request.user.id),
            'email': request.user.email,
            'name': f"{request.user.first_name} {request.user.last_name}".strip() or request.user.username,
            'is_authenticated': True,
            'has_company_profile': company_profile is not None,
            'company_profile_id': company_profile.id if company_profile else None,
            'company_name': company_profile.company_name if company_profile else None
        })
    else:
        return JsonResponse({
            'is_authenticated': False
        })
