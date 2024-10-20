from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Guest
from .serializers import GuestResponseSerializer, GuestSerializer

class GuestListView(APIView):
    def get(self, request):
        guests = Guest.objects.all().prefetch_related(
            'bookings',
            'preferences',
            'preferences__room_locations',
            'preferences__pillow_types',
            'preferences__amenities',
            'preferences__food_preferences__favorites',
            'preferences__food_preferences__dietary_restrictions',
            'preferences__beverage_preferences__non_alcoholic',
            'preferences__beverage_preferences__alcoholic'
        )
        serializer = GuestSerializer(guests, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = GuestSerializer(data=request.data)
        if serializer.is_valid():
            guest = serializer.save()
            response_serializer = GuestResponseSerializer({'guest': guest})
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GuestDetailView(APIView):
    def get(self, request, bonvoy_id):
        guest = get_object_or_404(Guest, bonvoy_id=bonvoy_id)
        serializer = GuestResponseSerializer({'guest': guest})
        return Response(serializer.data)