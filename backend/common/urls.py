from django.urls import path
from . import views

urlpatterns = [
    path('google/places/autocomplete/', views.google_places_autocomplete,
         name='google_places_autocomplete'),
    path('google/places/details/', views.google_place_details,
         name='google_place_details'),
]
