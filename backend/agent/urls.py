from django.urls import path
from . import views

app_name = 'agent'

urlpatterns = [
    # Thread management
    path('threads/', views.ThreadsView.as_view(), name='threads'),
    path('threads/<str:thread_id>/',
         views.ThreadView.as_view(), name='thread_detail'),

    # Onboarding threads
    path('onboarding/threads/', views.OnboardingThreadView.as_view(),
         name='onboarding_thread_detail'),

    # Onboarding summary generation with keywords
    path('onboarding/threads/<str:thread_id>/generate-summary/',
         views.OnboardingSummaryGenerateView.as_view(), name='onboarding_generate_summary'),

    # Thread messages
    path('threads/<str:thread_id>/messages/',
         views.ThreadMessagesView.as_view(), name='thread_messages'),

    # Thread title generation
    path('threads/<str:thread_id>/generate-title/',
         views.ThreadTitleGenerateView.as_view(), name='thread_generate_title'),

    # Thread summary generation
    path('threads/<str:thread_id>/generate-summary/',
         views.ThreadSummaryGenerateView.as_view(), name='thread_generate_summary'),

    # Streaming chat
    path('threads/<str:thread_id>/chat/',
         views.ThreadChatView.as_view(), name='thread_chat'),

    # Voice endpoints
    path('realtime-token/', views.RealtimeTokenView.as_view(), name='realtime_token'),
    path('threads/<str:thread_id>/voice-message/',
         views.VoiceMessageView.as_view(), name='voice_message'),
]
