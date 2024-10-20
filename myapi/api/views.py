from rest_framework import viewsets
from rest_framework.response import Response
from .models import Guest
from .serializers import GuestSerializer

class GuestViewSet(viewsets.ModelViewSet):
    queryset = Guest.objects.all()
    serializer_class = GuestSerializer
    lookup_field = 'id'