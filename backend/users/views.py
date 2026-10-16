from pydantic import BaseModel
import requests

from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from drf_spectacular.utils import extend_schema

from libs.jwt_authentication import *
from common.views import APIViewTokenRefresh
from users.serializers import *
from users.models import AzughAccount
from users.services import EmailService
from users.token_utils import verify_verification_token, verify_reset_token
from django.utils.timezone import now
from django_ratelimit.decorators import ratelimit
from django.utils.decorators import method_decorator

OPENAI_URL_VOICE_SESSION = 'https://api.openai.com/v1/realtime/sessions'


class CheckAccountExistsView(APIView):
    """
    API endpoint to check if an account exists with the given email.
    """
    serializer_class = CheckAccountExistsSerializer

    @permission_classes([AllowAny])
    @extend_schema(
        request=CheckAccountExistsSerializer,
        responses={200: CheckAccountExistsResponseSerializer},
        description="Check if an account exists with the provided email"
    )
    def post(self, request):
        """
        Check if an account exists with the provided email.
        """
        # Validate request data
        email = request.data.get('email')
        if not email:
            return Response({"error": "Email is required."},
                            status=status.HTTP_400_BAD_REQUEST)
        # Check if the email exists
        User = get_user_model()
        if User.objects.filter(email=email).exists():
            return Response({"exists": True}, status=status.HTTP_200_OK)
        else:
            return Response({"exists": False}, status=status.HTTP_200_OK)


class LoginView(APIView):
    """
    API endpoint for user login.
    """
    permission_classes = [AllowAny]
    serializer_class = LoginSerializer

    @extend_schema(
        request=LoginSerializer,
        responses={200: LoginResponseSerializer},
        description="Handle user login"
    )
    def post(self, request):
        """
        Handle user login.
        """
        # Validate request data
        email = request.data.get('email')
        password = request.data.get('password')
        if not email or not password:
            return Response({"error": "Email and password are required."},
                            status=status.HTTP_400_BAD_REQUEST)
        # Check if the email exists
        User = get_user_model()
        if not User.objects.filter(email=email).exists():
            return Response({"error": "No account found with this email."},
                            status=status.HTTP_404_NOT_FOUND)
        # serialize the data
        serializer = TokenObtainPairSerializer(data=request.data)
        if not serializer.is_valid():
            # the password is incorrect
            return Response({"error": "Password incorrect."}, status=status.HTTP_400_BAD_REQUEST)

        # Check if user's email is verified
        user = User.objects.get(email=email)
        if not user.email_verified:
            return Response({
                "error": "Please verify your email address before logging in.",
                "email_verified": False,
                "hint": "Check your inbox or request a new verification email."
            }, status=status.HTTP_403_FORBIDDEN)

        # get the refresh and access tokens
        tokens = serializer.validated_data
        access_token = tokens.get('access')
        refresh_token = tokens.get('refresh')
        # set the tokens in the cookies
        response = Response({"message": "Login successful."},
                            status=status.HTTP_200_OK)
        # setup the access token cookie
        response.set_cookie(
            key=get_simple_jwt_setting("AUTH_COOKIE"),
            value=access_token,
            expires=get_simple_jwt_setting("ACCESS_TOKEN_LIFETIME"),
            httponly=get_simple_jwt_setting("AUTH_COOKIE_HTTP_ONLY"),
            secure=get_simple_jwt_setting("AUTH_COOKIE_SECURE"),
            samesite=get_simple_jwt_setting("AUTH_COOKIE_SAMESITE"),
        )
        # setup the refresh token cookie
        response.set_cookie(
            key=get_simple_jwt_setting("AUTH_COOKIE_REFRESH"),
            value=refresh_token,
            expires=get_simple_jwt_setting("REFRESH_TOKEN_LIFETIME"),
            httponly=get_simple_jwt_setting("AUTH_COOKIE_HTTP_ONLY"),
            secure=get_simple_jwt_setting("AUTH_COOKIE_SECURE"),
            samesite=get_simple_jwt_setting("AUTH_COOKIE_SAMESITE"),
        )
        return response


class LogoutView(APIViewTokenRefresh):
    """
    API endpoint for user logout.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = LogoutResponseSerializer

    @extend_schema(
        responses={200: LogoutResponseSerializer},
        description="Handle user logout"
    )
    def post(self, request):
        """
        Handle user logout.
        """
        # Blacklist the refresh token
        refresh_token = request.COOKIES.get(
            get_simple_jwt_setting("AUTH_COOKIE_REFRESH"))
        print("refresh_token", refresh_token)
        # print("access_token", request.COOKIES.get(
        # get_simple_jwt_setting("AUTH_COOKIE")))
        if refresh_token:
            token_refresher = RefreshTokenTracked(refresh_token)
            token_refresher.blacklist()
        # Clear the cookies
        response = Response({"message": "Logout successful."},
                            status=status.HTTP_200_OK)
        response.delete_cookie(get_simple_jwt_setting("AUTH_COOKIE"))
        response.delete_cookie(get_simple_jwt_setting("AUTH_COOKIE_REFRESH"))
        return response


class UserProfileView(APIViewTokenRefresh):
    """
    API endpoint to get the user profile.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = UserProfileSerializer

    @extend_schema(
        responses={200: UserProfileSerializer},
        description="Get the user profile"
    )
    def get(self, request):
        """
        Get the user profile.
        """
        user = request.user
        # Serialize the user data
        serializer = UserProfileSerializer(user)
        user_data = serializer.data
        return Response(user_data, status=status.HTTP_200_OK)

    @extend_schema(
        request=UserProfileSerializer,
        responses={200: UserProfileSerializer},
        description="Update the user profile (full update)"
    )
    def put(self, request):
        """
        Update the user profile (full update).
        """
        user = request.user
        serializer = UserProfileSerializer(user, data=request.data, context={
                                           'request': request}, partial=False)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(
        request=UserProfileSerializer,
        responses={200: UserProfileSerializer},
        description="Partially update the user profile"
    )
    def patch(self, request):
        """
        Partially update the user profile.
        """
        user = request.user
        serializer = UserProfileSerializer(user, data=request.data, context={
                                           'request': request}, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SignUpView(APIView):
    """
    API endpoint for user registration.
    """
    permission_classes = [AllowAny]
    serializer_class = SignUpSerializer

    @extend_schema(
        request=SignUpSerializer,
        responses={201: UserSerializer},
        description="Handle user registration"
    )
    def post(self, request):
        """
        Handle user registration.
        """
        # Validate request data
        email = request.data.get('email')
        password = request.data.get('password')
        if not email or not password:
            return Response({"error": "Email and password are required."},
                            status=status.HTTP_400_BAD_REQUEST)
        # Check if the email already exists
        User = get_user_model()
        if User.objects.filter(email=email).exists():
            return Response({"error": "An account with this email already exists."},
                            status=status.HTTP_400_BAD_REQUEST)
        # Create the user
        user = User.objects.create_user(email=email,
                                        password=password,
                                        first_name=request.data.get(
                                            'first_name', ''),
                                        last_name=request.data.get(
                                            'last_name', '')
                                        )
        user.save()
        # Check if we need to create an AzughAccount
        create_azugh_account = request.data.get('create_azugh_account', False)
        if create_azugh_account:
            azugh_account = AzughAccount(user=user)
            azugh_account.save()

        # Send verification email
        try:
            email_service = EmailService()
            email_service.send_verify_email(user)
        except Exception as e:
            # Log the error but don't fail the registration
            print(f"Failed to send verification email: {e}")

        # Now sign in the user
        serializer = TokenObtainPairSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({"error": "Password incorrect."}, status=status.HTTP_400_BAD_REQUEST)
        # get the refresh and access tokens
        tokens = serializer.validated_data
        access_token = tokens.get('access')
        refresh_token = tokens.get('refresh')
        # set the tokens in the cookies
        response = Response({"message": "Registration successful."},
                            status=status.HTTP_201_CREATED)
        # setup the access token cookie
        response.set_cookie(
            key=get_simple_jwt_setting("AUTH_COOKIE"),
            value=access_token,
            expires=get_simple_jwt_setting("ACCESS_TOKEN_LIFETIME"),
            httponly=get_simple_jwt_setting("AUTH_COOKIE_HTTP_ONLY"),
            secure=get_simple_jwt_setting("AUTH_COOKIE_SECURE"),
            samesite=get_simple_jwt_setting("AUTH_COOKIE_SAMESITE"),
        )
        # setup the refresh token cookie
        response.set_cookie(
            key=get_simple_jwt_setting("AUTH_COOKIE_REFRESH"),
            value=refresh_token,
            expires=get_simple_jwt_setting("REFRESH_TOKEN_LIFETIME"),
            httponly=get_simple_jwt_setting("AUTH_COOKIE_HTTP_ONLY"),
            secure=get_simple_jwt_setting("AUTH_COOKIE_SECURE"),
            samesite=get_simple_jwt_setting("AUTH_COOKIE_SAMESITE"),
        )
        # return the response
        return response


class AzughAccountView(APIViewTokenRefresh):
    """
    API endpoint to get, create, or update the AzughAccount for the authenticated user.
    """
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return AzughAccountCreateSerializer
        elif self.request.method == 'PATCH':
            return AzughAccountUpdateSerializer
        return AzughAccountSerializer

    @extend_schema(
        responses={200: AzughAccountSerializer},
        description="Get the AzughAccount for the authenticated user"
    )
    def get(self, request):
        """
        Get the AzughAccount for the authenticated user.
        """
        try:
            azugh_account = request.user.azugh_account
            serializer = AzughAccountSerializer(azugh_account)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except AzughAccount.DoesNotExist:
            return Response({"error": "AzughAccount does not exist."},
                            status=status.HTTP_404_NOT_FOUND)

    @extend_schema(
        request=AzughAccountCreateSerializer,
        responses={201: AzughAccountSerializer},
        description="Create an AzughAccount for the authenticated user"
    )
    def post(self, request):
        """
        Create an AzughAccount for the authenticated user.
        """
        # Check if user already has an AzughAccount
        if hasattr(request.user, 'azugh_account'):
            return Response({"error": "AzughAccount already exists."},
                            status=status.HTTP_400_BAD_REQUEST)

        # Set the user to the authenticated user
        data = request.data.copy()
        data['user'] = request.user.id

        serializer = AzughAccountCreateSerializer(data=data)
        if serializer.is_valid():
            azugh_account = serializer.save()
            response_serializer = AzughAccountSerializer(azugh_account)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(
        request=AzughAccountUpdateSerializer,
        responses={200: AzughAccountSerializer},
        description="Partially update the AzughAccount for the authenticated user"
    )
    def patch(self, request):
        """
        Partially update the AzughAccount for the authenticated user.
        """
        try:
            azugh_account = request.user.azugh_account
        except AzughAccount.DoesNotExist:
            return Response({"error": "AzughAccount does not exist."},
                            status=status.HTTP_404_NOT_FOUND)
        update_data = request.data.copy()
        print("update_data before country organise:", update_data)
        # organise the country name and code if provided
        serializer = AzughAccountUpdateSerializer(
            azugh_account, data=request.data, partial=True
        )
        if serializer.is_valid():
            serializer.save()
            response_serializer = AzughAccountSerializer(azugh_account)
            return Response(response_serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VerifyEmailView(APIView):
    """
    API endpoint to verify user's email address.
    """
    permission_classes = [AllowAny]
    serializer_class = VerifyEmailSerializer

    @extend_schema(
        request=VerifyEmailSerializer,
        responses={200: {"type": "object", "properties": {
            "message": {"type": "string"}}}},
        description="Verify user's email address"
    )
    def post(self, request):
        """
        Verify user's email address using uidb64 and token.
        """
        serializer = VerifyEmailSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        uidb64 = serializer.validated_data['uidb64']
        token = serializer.validated_data['token']

        user, error = verify_verification_token(uidb64, token)

        if error:
            return Response({"error": error}, status=status.HTTP_400_BAD_REQUEST)

        # Update user verification status
        user.email_verified = True
        user.email_verified_at = now()
        user.verification_attempts += 1
        user.last_verification_attempt = now()
        user.save()

        return Response({
            "message": "Email verified successfully. You can now log in."
        }, status=status.HTTP_200_OK)


class ResendVerificationView(APIView):
    """
    API endpoint to resend verification email.
    """
    permission_classes = [AllowAny]
    serializer_class = ResendVerificationSerializer

    @method_decorator(ratelimit(key='ip', rate=settings.EMAIL_RATE_LIMIT, method='POST'))
    @extend_schema(
        request=ResendVerificationSerializer,
        responses={200: {"type": "object", "properties": {
            "message": {"type": "string"}}}},
        description="Resend verification email"
    )
    def post(self, request):
        """
        Resend verification email to the user.
        """
        # Check rate limit
        if getattr(request, 'limited', False):
            return Response({
                "error": "Too many requests. Please try again later."
            }, status=status.HTTP_429_TOO_MANY_REQUESTS)

        serializer = ResendVerificationSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data['email']
        User = get_user_model()

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            # Don't reveal if email exists
            return Response({
                "message": "If an account exists with this email, a verification email has been sent."
            }, status=status.HTTP_200_OK)

        if user.email_verified:
            return Response({
                "message": "Email is already verified."
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            email_service = EmailService()
            email_service.send_verify_email(user)
        except Exception as e:
            return Response({
                "error": "Failed to send verification email. Please try again later."
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({
            "message": "Verification email sent successfully."
        }, status=status.HTTP_200_OK)


class RequestPasswordResetView(APIView):
    """
    API endpoint to request password reset.
    """
    permission_classes = [AllowAny]
    serializer_class = RequestPasswordResetSerializer

    @method_decorator(ratelimit(key='ip', rate=settings.EMAIL_RATE_LIMIT, method='POST'))
    @extend_schema(
        request=RequestPasswordResetSerializer,
        responses={200: {"type": "object", "properties": {
            "message": {"type": "string"}}}},
        description="Request password reset"
    )
    def post(self, request):
        """
        Send password reset email to the user.
        """
        # Check rate limit
        if getattr(request, 'limited', False):
            return Response({
                "error": "Too many requests. Please try again later."
            }, status=status.HTTP_429_TOO_MANY_REQUESTS)

        serializer = RequestPasswordResetSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data['email']
        User = get_user_model()

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            # Don't reveal if email exists
            return Response({
                "message": "If an account exists with this email, a password reset email has been sent."
            }, status=status.HTTP_200_OK)

        try:
            email_service = EmailService()
            email_service.send_password_reset_email(user)
        except Exception as e:
            return Response({
                "error": "Failed to send password reset email. Please try again later."
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({
            "message": "Password reset email sent successfully."
        }, status=status.HTTP_200_OK)


class ResetPasswordView(APIView):
    """
    API endpoint to reset password.
    """
    permission_classes = [AllowAny]
    serializer_class = ResetPasswordSerializer

    @extend_schema(
        request=ResetPasswordSerializer,
        responses={200: {"type": "object", "properties": {
            "message": {"type": "string"}}}},
        description="Reset password using token"
    )
    def post(self, request):
        """
        Reset user's password using uidb64 and token.
        """
        serializer = ResetPasswordSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        uidb64 = serializer.validated_data['uidb64']
        token = serializer.validated_data['token']
        new_password = serializer.validated_data['new_password']

        user, error = verify_reset_token(uidb64, token)

        if error:
            return Response({"error": error}, status=status.HTTP_400_BAD_REQUEST)

        # Update user password
        user.set_password(new_password)
        user.save()

        return Response({
            "message": "Password reset successfully. You can now log in with your new password."
        }, status=status.HTTP_200_OK)


@api_view(['GET'])
@authentication_classes([])
@permission_classes([AllowAny])
def start_voice_omboarding(request):
    headers = {
        "Authorization": f"Bearer {settings.OPENAI_API_KEY}",
        "Content-Type": "application/json"
    }
    body = {
        "model": "gpt-4o-realtime-preview",
        "modalities": ["audio", "text"],
        "instructions": "You are a friendly assistant."
    }
    response = requests.post(OPENAI_URL_VOICE_SESSION,
                             headers=headers, json=body)
    try:
        response.raise_for_status()
        session_data = response.json()
        secret_key = session_data.get("client_secret")["value"]
        client_secret = secret_key
        response_data = {
            'client_secret': client_secret,
        }
        return Response(response_data, status=200)
    except Exception as e:
        return Response({"error": str(e)}, status=400)
