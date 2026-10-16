from rest_framework import serializers
from common.serializers import DynamicFieldsModelSerializer
from users.models import *


class UserSerializer(DynamicFieldsModelSerializer):
    class Meta:
        model = User  # Assuming User model is already imported
        fields = ('id', 'nickname', 'email', 'first_name',
                  'last_name', 'date_joined', 'is_staff', 'email_verified', 'email_verified_at')
        read_only_fields = ('id', 'date_joined', 'is_staff',
                            'email_verified', 'email_verified_at')


class UserProfileSerializer(DynamicFieldsModelSerializer):
    """Serializer specifically for user profile GET/PATCH operations."""
    class Meta:
        model = User
        fields = ('id', 'nickname', 'email', 'first_name',
                  'last_name', 'date_joined')
        read_only_fields = ('id', 'email')


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class LoginResponseSerializer(serializers.Serializer):
    message = serializers.CharField()
    email_verified = serializers.BooleanField(required=False)
    hint = serializers.CharField(required=False)


class SignUpSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    create_azugh_account = serializers.BooleanField(default=False)


class LogoutResponseSerializer(serializers.Serializer):
    message = serializers.CharField()


class CheckAccountExistsSerializer(serializers.Serializer):
    email = serializers.EmailField()


class CheckAccountExistsResponseSerializer(serializers.Serializer):
    exists = serializers.BooleanField()


class CountrySerializer(DynamicFieldsModelSerializer):
    class Meta:
        model = Country
        fields = ('id', 'name', 'code')
        read_only_fields = ('id',)
        extra_kwargs = {
            'name': {'help_text': "Name of the country"},
            'code': {'help_text': "ISO code of the country"}
        }


class AzughAccountSerializer(DynamicFieldsModelSerializer):
    """General purpose serializer for AzughAccount."""
    user = serializers.SerializerMethodField()
    country = CountrySerializer(read_only=True)

    class Meta:
        model = AzughAccount
        fields = (
            'id',
            'user',
            'phone_number',
            'profile_picture',
            'gender',
            'date_of_birth',
            'country',
            'city',
            'created_at',
            'updated_at',
            'onboarding_completed',
            'language'
        )
        read_only_fields = ('id', 'created_at', 'updated_at')

    def get_user(self, obj):
        """
        Returns the user details for the account
        """
        if obj.user:
            return UserSerializer(obj.user, included_fields=['id', 'first_name', 'last_name', 'email', 'nickname']).data
        return None


class AzughAccountCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating an AzughAccount."""

    class Meta:
        model = AzughAccount
        fields = (
            'user',
            'phone_number',
            'profile_picture',
            'gender',
            'date_of_birth',
            'country',
            'city',
            'onboarding_completed',
            'language'
        )

    def validate_user(self, value):
        """Ensure user doesn't already have an AzughAccount."""
        if AzughAccount.objects.filter(user=value).exists():
            raise serializers.ValidationError(
                "This user already has an Azugh account.")
        return value


class AzughAccountUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating an AzughAccount."""
    country = CountrySerializer(required=False)

    class Meta:
        model = AzughAccount
        fields = (
            'phone_number',
            'profile_picture',
            'gender',
            'date_of_birth',
            'country',
            'city',
            'onboarding_completed',
            'language'
        )

    def update(self, instance, validated_data):
        country_data = validated_data.pop('country', None)
        if country_data is None:
            # try getting in form 'country[name]' and 'country[code]'
            country_name = self.initial_data.get('country[name]')
            country_code = self.initial_data.get('country[code]')
            if country_name or country_code:
                country_data = {
                    'name': country_name,
                    'code': country_code
                }

        if country_data:
            country_obj = None

            country_id = country_data.get('id')
            if country_id:
                country_obj = Country.objects.filter(id=country_id).first()

            if not country_obj:
                code = country_data.get('code')
                if code:
                    country_obj, _ = Country.objects.get_or_create(
                        code=code,
                        defaults={'name': country_data.get('name', code)}
                    )
                else:
                    name = country_data.get('name')
                    if name:
                        country_obj, _ = Country.objects.get_or_create(
                            name=name,
                            defaults={'code': name[:2].upper()}
                        )

            instance.country = country_obj

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance


# Email Verification and Password Reset Serializers

class VerifyEmailSerializer(serializers.Serializer):
    """Serializer for email verification."""
    uidb64 = serializers.CharField()
    token = serializers.CharField()


class ResendVerificationSerializer(serializers.Serializer):
    """Serializer for resending verification email."""
    email = serializers.EmailField()


class RequestPasswordResetSerializer(serializers.Serializer):
    """Serializer for requesting password reset."""
    email = serializers.EmailField()


class ResetPasswordSerializer(serializers.Serializer):
    """Serializer for resetting password."""
    uidb64 = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True, min_length=8)

    def validate_new_password(self, value):
        """Validate the new password."""
        from django.contrib.auth.password_validation import validate_password
        validate_password(value)
        return value
