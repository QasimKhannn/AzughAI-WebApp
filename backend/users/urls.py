from django.urls import path
from . import views

app_name = 'users'

urlpatterns = [
    path('check-account-exists/', views.CheckAccountExistsView.as_view(),
         name='check_account_exists'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('profile/', views.UserProfileView.as_view(), name='profile'),
    path('signup/', views.SignUpView.as_view(), name='signup'),
    path('signup/onboarding/voice/', views.start_voice_omboarding,
         name='start_voice_onboarding'),
    path('azugh-account/', views.AzughAccountView.as_view(), name='azugh_account'),
    # Email verification and password reset
    path('verify-email/', views.VerifyEmailView.as_view(), name='verify_email'),
    path('resend-verification/', views.ResendVerificationView.as_view(),
         name='resend_verification'),
    path('request-password-reset/', views.RequestPasswordResetView.as_view(),
         name='request_password_reset'),
    path('reset-password/', views.ResetPasswordView.as_view(), name='reset_password'),
]
