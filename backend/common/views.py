from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from libs.jwt_authentication import get_simple_jwt_setting
import requests
import os
from django.conf import settings


class APIViewTokenRefresh(APIView):
    """
    API view for refreshing JWT tokens.
    """

    def dispatch(self, request, *args, **kwargs):
        response = super().dispatch(request, *args, **kwargs)
        # Attach refreshed token if present
        if 'REFRESHED_TOKEN' in request.META:
            response.set_cookie(
                key=get_simple_jwt_setting("AUTH_COOKIE"),
                value=request.META['REFRESHED_TOKEN'],
                expires=get_simple_jwt_setting("ACCESS_TOKEN_LIFETIME"),
                httponly=get_simple_jwt_setting("AUTH_COOKIE_HTTP_ONLY"),
                secure=get_simple_jwt_setting("AUTH_COOKIE_SECURE"),
                samesite=get_simple_jwt_setting("AUTH_COOKIE_SAMESITE"),
            )
        return response

@csrf_exempt
@api_view(['GET'])
def google_places_autocomplete(request):
    """
    Proxy endpoint for Google Places Autocomplete API
    """
    print("Request received for autocomplete")
    query = request.GET.get('input', '')
    if not query or len(query) < 2:
        return Response({'predictions': [], 'status': 'INVALID_REQUEST'})

    try:
        api_key = os.getenv('GOOGLE_MAPS_API_KEY')
        if not api_key:
            return Response({'error': 'Google Maps API key not configured'}, status=500)

        url = 'https://maps.googleapis.com/maps/api/place/autocomplete/json'
        params = {
            'input': query,
            'key': api_key,
            'types': '(cities)',
            'language': 'en'
        }

        response = requests.get(url, params=params)
        response.raise_for_status()

        return Response(response.json())
    except requests.RequestException as e:
        return Response({'error': str(e), 'status': 'REQUEST_DENIED'}, status=500)

@csrf_exempt
@api_view(['GET'])
def google_place_details(request):
    """
    Proxy endpoint for Google Place Details API
    """
    place_id = request.GET.get('place_id', '')
    if not place_id:
        return Response({'error': 'place_id parameter is required'}, status=400)

    try:
        api_key = os.getenv('GOOGLE_MAPS_API_KEY')
        if not api_key:
            return Response({'error': 'Google Maps API key not configured'}, status=500)

        url = 'https://maps.googleapis.com/maps/api/place/details/json'
        params = {
            'place_id': place_id,
            'key': api_key,
            'fields': 'address_components,formatted_address,geometry'
        }

        response = requests.get(url, params=params)
        response.raise_for_status()

        return Response(response.json())
    except requests.RequestException as e:
        return Response({'error': str(e), 'status': 'REQUEST_DENIED'}, status=500)
