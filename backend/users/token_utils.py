"""
Token utilities for email verification and password reset.
"""
from datetime import datetime, timedelta
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.conf import settings
from django.contrib.auth import get_user_model

User = get_user_model()


class ExpiringTokenGenerator(PasswordResetTokenGenerator):
    """
    Token generator that checks token age against a configurable expiration time.
    """

    def __init__(self, expiry_hours=1):
        """
        Initialize the token generator with expiry time.

        Args:
            expiry_hours: Number of hours before the token expires
        """
        super().__init__()
        self.expiry_hours = expiry_hours

    def _make_hash_value(self, user, timestamp):
        """
        Hash the user's primary key, email, and timestamp.
        This ensures tokens are invalidated when email changes or password changes.
        """
        email_field = user.get_email_field_name()
        email = getattr(user, email_field, "") or ""
        return f"{user.pk}{user.password}{timestamp}{email}"

    def check_token(self, user, token):
        """
        Check that a password reset token is correct for a given user and
        hasn't expired based on the configured expiry time.
        """
        if not (user and token):
            return False

        # Parse the token
        try:
            ts_b36, _ = token.split("-")
        except ValueError:
            return False

        try:
            ts = int(ts_b36, 36)
        except ValueError:
            return False

        # Check the timestamp is within the expiry window
        now_timestamp = self._num_seconds(self._now())
        token_timestamp = ts
        expiry_seconds = self.expiry_hours * 3600

        if (now_timestamp - token_timestamp) > expiry_seconds:
            return False

        # Check the token is valid
        return super().check_token(user, token)


# Create instances for different use cases
verification_token_generator = ExpiringTokenGenerator(
    expiry_hours=settings.EMAIL_VERIFICATION_TOKEN_EXPIRY_HOURS
)

password_reset_token_generator = ExpiringTokenGenerator(
    expiry_hours=settings.PASSWORD_RESET_TOKEN_EXPIRY_HOURS
)


def generate_verification_token(user):
    """
    Generate a verification token for the given user.

    Args:
        user: User instance

    Returns:
        tuple: (uidb64, token) - Base64 encoded user ID and verification token
    """
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = verification_token_generator.make_token(user)
    return uid, token


def generate_reset_token(user):
    """
    Generate a password reset token for the given user.

    Args:
        user: User instance

    Returns:
        tuple: (uidb64, token) - Base64 encoded user ID and reset token
    """
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = password_reset_token_generator.make_token(user)
    return uid, token


def verify_verification_token(uidb64, token):
    """
    Verify a verification token and return the associated user.

    Args:
        uidb64: Base64 encoded user ID
        token: Verification token

    Returns:
        tuple: (user, error_message) - User instance if valid, None if invalid
               error_message is None if valid, contains error details if invalid
    """
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        return None, "Invalid verification link"

    if not verification_token_generator.check_token(user, token):
        return None, "Verification link has expired or is invalid. Please request a new verification email."

    return user, None


def verify_reset_token(uidb64, token):
    """
    Verify a password reset token and return the associated user.

    Args:
        uidb64: Base64 encoded user ID
        token: Reset token

    Returns:
        tuple: (user, error_message) - User instance if valid, None if invalid
               error_message is None if valid, contains error details if invalid
    """
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        return None, "Invalid reset link"

    if not password_reset_token_generator.check_token(user, token):
        return None, "Reset link has expired or is invalid. Please request a new password reset."

    return user, None


def compose_verification_url(user):
    """
    Compose the full verification URL for the given user.

    Args:
        user: User instance

    Returns:
        str: Full verification URL
    """
    uid, token = generate_verification_token(user)
    return f"{settings.FRONTEND_URL}/verify-email/{uid}/{token}"


def compose_reset_url(user):
    """
    Compose the full password reset URL for the given user.

    Args:
        user: User instance

    Returns:
        str: Full password reset URL
    """
    uid, token = generate_reset_token(user)
    return f"{settings.FRONTEND_URL}/reset-password/{uid}/{token}"
