from rest_framework import serializers
from .models import Guest, Booking, Preferences

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'

class PreferencesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Preferences
        fields = '__all__'

class GuestSerializer(serializers.ModelSerializer):
    upcoming_bookings = BookingSerializer(many=True)
    past_bookings = BookingSerializer(many=True)
    preferences = PreferencesSerializer()

    class Meta:
        model = Guest
        fields = '__all__'

    def create(self, validated_data):
        upcoming_bookings_data = validated_data.pop('upcoming_bookings')
        past_bookings_data = validated_data.pop('past_bookings')
        preferences_data = validated_data.pop('preferences')

        preferences = Preferences.objects.create(**preferences_data)
        guest = Guest.objects.create(preferences=preferences, **validated_data)

        for booking_data in upcoming_bookings_data:
            booking = Booking.objects.create(**booking_data)
            guest.upcoming_bookings.add(booking)

        for booking_data in past_bookings_data:
            booking = Booking.objects.create(**booking_data)
            guest.past_bookings.add(booking)

        return guest