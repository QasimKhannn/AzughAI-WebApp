from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from common.models import BaseModel


class Country(models.Model):
    """
    A model to store country information.
    """
    name = models.CharField(max_length=100, unique=True,
                            help_text="Name of the country")
    code = models.CharField(max_length=10, unique=True,
                            help_text="ISO code of the country")

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Country"
        verbose_name_plural = "Countries"
        ordering = ["name"]


class UserManager(BaseUserManager):
    # Used by createsuperuser
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Users must have an email address")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)  # Handles hashing
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        # extra_fields.setdefault("is_staff", True)
        # extra_fields.setdefault("is_superuser", True)
        user = self.create_user(email, password, **extra_fields)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user

    def update_user(self, identifier, **update_fields):
        # Retrieve the user by email or username (you can customize this logic based on your needs)
        user = self.get(
            email=identifier) if '@' in identifier else self.get(username=identifier)

        # Update the specified fields
        for field, value in update_fields.items():
            setattr(user, field, value)

        # Save the changes
        user.save(using=self._db)
        return user


class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    nickname = models.CharField(max_length=50, blank=True)
    first_name = models.CharField(max_length=50, blank=True)
    last_name = models.CharField(max_length=50, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    # Email verification fields
    email_verified = models.BooleanField(
        default=False, help_text="Whether the user's email has been verified")
    email_verified_at = models.DateTimeField(
        null=True, blank=True, help_text="Timestamp when email was verified")
    verification_attempts = models.IntegerField(
        default=0, help_text="Number of verification attempts")
    last_verification_attempt = models.DateTimeField(
        null=True, blank=True, help_text="Last verification attempt timestamp")

    groups = models.ManyToManyField(
        "auth.Group",
        verbose_name="groups",
        blank=True,
        help_text="The groups this user belongs to. A user will get all permissions granted to each of their groups.",
        related_name="custom_user_set",  # added this line
        related_query_name="user",
    )
    user_permissions = models.ManyToManyField(
        "auth.Permission",
        verbose_name="user permissions",
        blank=True,
        help_text="Specific permissions for this user.",
        related_name="custom_user_permissions_set",  # added this line
        related_query_name="user",
    )

    # Required fields
    objects = UserManager()
    USERNAME_FIELD = "email"  # login with email
    REQUIRED_FIELDS = []  # Required when creating a superuser

    def __str__(self):
        return self.email


class AzughAccount(BaseModel):
    """
    Model representing an Azugh account linked to a user.
    """
    class Gender(models.TextChoices):
        MAN = "man",
        WOMAN = "woman",
        NON_BINARY = "non-binary",
        GENDER_FLUID = "gender-fluid",
        PREFER_NOT_TO_SAY = "prefer-not-to-say",

    class Language(models.TextChoices):
        ENGLISH_GB = "en-gb", "English (GB)"
        ENGLISH_US = "en-us", "English (US)"
        ITALIAN = "it", "Italian"
        FRENCH = "fr", "French"
        GERMAN = "de", "German"
        SPANISH = "es", "Spanish"

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="azugh_account",
        help_text="The user associated with this Azugh account"
    )
    phone_number = models.CharField(
        max_length=20, blank=True, null=True, help_text="User's phone number")
    profile_picture = models.ImageField(
        upload_to='profile_pictures/', blank=True, null=True, help_text="Profile picture of the user")
    gender = models.CharField(
        max_length=20,
        choices=Gender.choices,
        blank=True,
        null=True,
        help_text="Gender of the user"
    )
    date_of_birth = models.DateField(
        blank=True, null=True, help_text="Date of birth of the user")
    country = models.ForeignKey(
        Country,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        help_text="Country of the user"
    )
    city = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        help_text="City of the user"
    )
    onboarding_completed = models.BooleanField(
        default=False, help_text="Indicates if the user has completed onboarding")
    language = models.CharField(
        max_length=10,
        choices=Language.choices,
        default=Language.ENGLISH_GB,
        help_text="Preferred language of the user"
    )
