from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from rest_framework.authtoken.models import Token
from .models import CompanyProfile
import json


def _get_user_from_token(request):
    """
    Extract user from Authorization: Token <key> header.
    Returns (user, error_response).
    """
    auth_header = request.META.get('HTTP_AUTHORIZATION', '')
    if not auth_header.startswith('Token '):
        return None, JsonResponse({'error': 'Authentication required'}, status=401)
    
    token_key = auth_header.split('Token ')[1].strip()
    try:
        token = Token.objects.select_related('user').get(key=token_key)
        return token.user, None
    except Token.DoesNotExist:
        return None, JsonResponse({'error': 'Invalid or expired token'}, status=401)


def _build_user_response(user, include_token=None):
    """
    Build a consistent user JSON payload.
    """
    company_profile = CompanyProfile.objects.filter(user=user).first()
    
    data = {
        'user_id': user.id,
        'email': user.email,
        'name': f"{user.first_name} {user.last_name}".strip() or user.username,
        'is_authenticated': True,
        'has_company_profile': company_profile is not None,
        'company_profile_id': company_profile.id if company_profile else None,
        'company_name': company_profile.company_name if company_profile else None,
    }
    
    if include_token:
        data['authToken'] = include_token
    
    return data


@csrf_exempt
@require_http_methods(["POST"])
def signup(request):
    """
    Create a new user account and return an auth token.
    """
    try:
        data = json.loads(request.body)
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        name = data.get('name', '')

        if not email or not password:
            return JsonResponse(
                {'error': 'Email and password are required'},
                status=400
            )

        if len(password) < 6:
            return JsonResponse(
                {'error': 'Password must be at least 6 characters'},
                status=400
            )

        # Check if user already exists
        if User.objects.filter(username=email).exists():
            return JsonResponse(
                {'error': 'A user with this email already exists'},
                status=400
            )

        # Create the Django user
        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            first_name=name.split()[0] if name else '',
            last_name=' '.join(name.split()[1:]) if len(name.split()) > 1 else ''
        )

        # Create a DRF auth token for the new user
        token = Token.objects.create(user=user)

        response_data = _build_user_response(user, include_token=token.key)
        response_data['message'] = 'User created successfully'

        return JsonResponse(response_data, status=201)

    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON body'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def login_view(request):
    """
    Login with email/password and return an auth token.
    """
    try:
        data = json.loads(request.body)
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')

        if not email or not password:
            return JsonResponse(
                {'error': 'Email and password are required'},
                status=400
            )

        # Authenticate against Django's auth backend
        user = authenticate(request, username=email, password=password)

        if user is None:
            return JsonResponse(
                {'error': 'Invalid email or password'},
                status=401
            )

        # Get or create a DRF token
        token, _ = Token.objects.get_or_create(user=user)

        response_data = _build_user_response(user, include_token=token.key)
        response_data['message'] = 'Login successful'

        return JsonResponse(response_data)

    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON body'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def logout_view(request):
    """
    Logout: delete the user's auth token.
    """
    user, err = _get_user_from_token(request)
    if user:
        # Delete the token so it can no longer be used
        Token.objects.filter(user=user).delete()

    return JsonResponse({'message': 'Logged out successfully'})


@csrf_exempt
@require_http_methods(["GET"])
def get_user(request):
    """
    Return the current user by validating the Authorization token header.
    """
    user, err = _get_user_from_token(request)
    if err:
        return err

    return JsonResponse(_build_user_response(user))
