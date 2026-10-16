from django.contrib import admin
from .models import User, AzughAccount, Country
from django.contrib.auth.admin import UserAdmin
from .forms import CustomUserCreationForm, CustomUserChangeForm


class CustomUserAdmin(UserAdmin):
    form = CustomUserChangeForm
    add_form = CustomUserCreationForm
    model = User
    list_display = ['email', 'is_active', 'is_staff', 'is_superuser',
                    'last_login', 'date_joined']  # Adjust list_display
    # Make these fields read-only
    readonly_fields = ('last_login', 'date_joined')
    fieldsets = (
        # removed username since not in your model
        (None, {'fields': ('email', 'password')}),
        # adjust fields
        ('Personal info', {'fields': ('nickname', 'first_name', 'last_name')}),
        # adjust fields
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser')}),
        # email verification fields
        ('Email Verification', {
         'fields': ('email_verified', 'email_verified_at', 'verification_attempts', 'last_verification_attempt')}),
        # adjust fields
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            # adjust fields
            'fields': ('email', 'password1', 'password2', 'nickname', 'first_name', 'last_name'),
        }),
    )
    search_fields = ['email', 'nickname',
                     'first_name', 'last_name']  # adjust fields
    ordering = ['email']
    filter_horizontal = ()  # Remove the filter_horizontal setting
    # adjust list filter.
    list_filter = ['is_active', 'is_staff', 'is_superuser']


admin.site.register(User, CustomUserAdmin)


@admin.register(Country)
class CountryAdmin(admin.ModelAdmin):
    list_display = ['name', 'code']
    search_fields = ['name', 'code']
    ordering = ['name']


@admin.register(AzughAccount)
class AzughAccountAdmin(admin.ModelAdmin):
    list_display = ['user', 'phone_number', 'gender', 'country',
                    'city', 'date_of_birth', 'created_at', 'onboarding_completed']
    list_filter = ['gender', 'country', 'created_at', 'onboarding_completed']
    search_fields = ['user__email', 'user__first_name',
                     'user__last_name', 'phone_number', 'city']
    readonly_fields = ['created_at', 'updated_at']
    autocomplete_fields = ['user', 'country']
    fieldsets = (
        ('User Information', {
            'fields': ('user',)
        }),
        ('Personal Details', {
            'fields': ('phone_number', 'gender', 'date_of_birth', 'profile_picture', 'onboarding_completed', 'language')
        }),
        ('Location', {
            'fields': ('country', 'city')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
