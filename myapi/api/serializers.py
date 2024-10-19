from rest_framework import serializers
from .models import Guest

class GuestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Guest
        fields = [
            'first_name',
            'last_name',
            'bonvoy_id',
            'email',
            'phone_number',
        ]