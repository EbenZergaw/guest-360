"""
Define endpoints
"""
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Guest
from .serializers import GuestSerializer
from django.shortcuts import get_object_or_404

class GuestByBonvoyIdView(APIView):
    def get(self, request, bonvoy_id):
        guest = get_object_or_404(Guest, bonvoy_id=bonvoy_id)
        serializer = GuestSerializer(guest)
        return Response(serializer.data)

class GuestListView(APIView):
    def get(self, request):
        guests = Guest.objects.all()
        serializer = GuestSerializer(guests, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = GuestSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GuestDetailView(APIView):
    def get(self, request, bonvoy_id):
        guest = get_object_or_404(Guest, bonvoy_id=bonvoy_id)
        serializer = GuestSerializer(guest)
        return Response(serializer.data)

    def put(self, request, bonvoy_id):
        guest = get_object_or_404(Guest, bonvoy_id=bonvoy_id)
        serializer = GuestSerializer(guest, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

