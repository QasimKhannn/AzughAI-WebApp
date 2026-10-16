from functools import wraps

from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import TokenError
from django.conf import settings
from django.http import HttpRequest

from .simplejwt_tracked import RefreshTokenTracked

DEFAULT_SIMPLE_JWT = {
    "AUTH_COOKIE": "auth_token",
    "AUTH_COOKIE_REFRESH": "refresh_token",
    "ACCESS_TOKEN_LIFETIME": 60 * 60,  # 1 hour in seconds
    "REFRESH_TOKEN_LIFETIME": 60 * 60 * 24,  # 1 day in seconds
    "AUTH_COOKIE_HTTP_ONLY": True,
    "AUTH_COOKIE_SECURE": False,
    "AUTH_COOKIE_SAMESITE": "Lax",
}

def get_simple_jwt_setting(key: str):
    simple_jwt = getattr(settings, "SIMPLE_JWT", {})
    return simple_jwt.get(key, DEFAULT_SIMPLE_JWT[key])

class JWTAuthSupportCookie(JWTAuthentication):
    """
    JWT authentication class that supports authentication using a token stored in a cookie.

    This class extends the JWTAuthentication class provided by Django REST Framework SimpleJWT.
    It checks if the 'auth_token' cookie is present in the request and if so, adds it to the
    'HTTP_AUTHORIZATION' header before calling the parent class's authenticate method. It also
    validates the token using custom logic to ensure it is not blacklisted.

    Usage:
        Set as the authentication class in DRF views to enable cookie-based JWT authentication.
    """
    
    # Define public endpoints that should allow anonymous access
    PUBLIC_ENDPOINTS = [
        '/api/users/check-account-exists/',
        '/api/users/login/',
        '/api/users/signup/',
    ]

    def authenticate(self, request):
        # Check if this is a public endpoint
        if self.is_public_endpoint(request):
            return None
        
        
        access_token = request.COOKIES.get('auth_token', None)
        valid = RefreshTokenTracked().check_access_token(
            access_token)  # check access token not expired or blacklisted
        # try refreshing it if it is expired
        print("Token valid:", valid)
        if access_token is not None and valid == False:
            # retrieve refresh token from cookies
            refresh_token = request.COOKIES.get(
                get_simple_jwt_setting("AUTH_COOKIE_REFRESH"), None)
            print("Refreshing token...")
            # refresh the access token
            try:
                token_refresher = RefreshTokenTracked(refresh_token)
                new_access_token, new_access_token_expiration = token_refresher.refresh()
                print("Refreshed token")
                # Update the request with the new access token
                request.META['HTTP_AUTHORIZATION'] = f'Token {new_access_token}'
                # Attach the new token to the request
                request.META['REFRESHED_TOKEN'] = new_access_token
                #return super().authenticate(request)
                pass
            except TokenError:
                # If the refresh token is invalid, return None
                print("Refresh token expired or invalid")
                pass
            except Exception as e:
                print("Error refreshing token:", e)
                pass
        elif valid == True:
            # If the access token is valid, set it in the request
            request.META['HTTP_AUTHORIZATION'] = f'Token {access_token}'
        # authenticate the request using the parent class's method
        return super().authenticate(request)
    
    def is_public_endpoint(self, request):
        """
        Check if the current request path is a public endpoint.
        """
        path = request.path
        return any(path.endswith(endpoint) or path == endpoint for endpoint in self.PUBLIC_ENDPOINTS)


def jwt_refresh_access_token(view_func):
    """
    Decorator function that refreshes the access token if it is expired or invalid.

    This decorator checks the access token from the request cookies. If the token is invalid or expired,
    and a valid refresh token is present, it attempts to refresh the access token and updates the request
    and response cookies accordingly. This ensures that users experience seamless authentication without
    manual re-login when their access token expires.

    Usage:
        @jwt_refresh_access_token
        def my_view(request):
            ...
    """
    @wraps(view_func)
    def _wrapped_view(*args, **kwargs):
        # Detect if this is a method (class-based view) or a function-based view
        if isinstance(args[0], HttpRequest):
            # Function-based view: first arg is request
            request = args[0]
            rest_args = args[1:]
        else:
            # Method: first arg is self, second is request
            self_obj = args[0]
            request = args[1]
            rest_args = args[2:]
        access_token = request.COOKIES.get(get_simple_jwt_setting("AUTH_COOKIE"))
        refresh_token = request.COOKIES.get(get_simple_jwt_setting("AUTH_COOKIE_REFRESH"))
        try:
            valid = RefreshTokenTracked().check_access_token(access_token)
            print("Token valid:", valid)
        except TokenError:
            valid = True
            print("Token error:", valid)
        # print("valid", valid)
        if access_token is not None and refresh_token is not None and valid == False:
            try:
                print("Refreshing token...")
                # refresh = RefreshToken(refresh_token)
                token_refresher = RefreshTokenTracked(refresh_token)
                # access_token = str(refresh.access_token)
                print("Refreshed token:", token_refresher.access_token_str)
                access_token, access_token_expiration = token_refresher.refresh()

                # Update the request with the new access token
                request.META['HTTP_AUTHORIZATION'] = f'Token {access_token}'
                request.COOKIES[get_simple_jwt_setting("AUTH_COOKIE")] = access_token

                # Update the cookies in the response
                response = view_func(request, *args, **kwargs)
                response.set_cookie(
                    key=get_simple_jwt_setting("AUTH_COOKIE"),
                    value=access_token,
                    expires=get_simple_jwt_setting("ACCESS_TOKEN_LIFETIME"),
                    httponly=get_simple_jwt_setting("AUTH_COOKIE_HTTP_ONLY"),
                    secure=get_simple_jwt_setting("AUTH_COOKIE_SECURE"),
                    samesite=get_simple_jwt_setting("AUTH_COOKIE_SAMESITE"),
                )

                return response

            except Exception as e:
                # access_token_jti = RefreshTokenTracked().get_jti(access_token)
                # ensure to blacklist access token too
                # caches['access_tokens'].delete(access_token_jti)
                pass

        # If no token refresh or an exception occurred, proceed with the original view
                # If no token refresh or an exception occurred, proceed with the original view
        if isinstance(args[0], HttpRequest):
            return view_func(request, *rest_args, **kwargs)
        else:
            return view_func(self_obj, request, *rest_args, **kwargs)

    return _wrapped_view