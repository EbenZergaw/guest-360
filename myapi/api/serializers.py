# serializers.py

from rest_framework import serializers
from django.db import transaction
from .models import Guest, Booking, Preferences, RoomLocation, PillowType, Amenity, FoodPreference, FavoriteFood, DietaryRestriction, BeveragePreference, NonAlcoholicBeverage, AlcoholicBeverage

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ['city', 'hotel', 'check_in_date', 'check_out_date', 'number_of_rooms', 'number_of_guests']

class RoomLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomLocation
        fields = ['location']

class PillowTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PillowType
        fields = ['type']

class AmenitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Amenity
        fields = ['name']

class FavoriteFoodSerializer(serializers.ModelSerializer):
    class Meta:
        model = FavoriteFood
        fields = ['name']

class DietaryRestrictionSerializer(serializers.ModelSerializer):
    class Meta:
        model = DietaryRestriction
        fields = ['name']

class NonAlcoholicBeverageSerializer(serializers.ModelSerializer):
    class Meta:
        model = NonAlcoholicBeverage
        fields = ['name']

class AlcoholicBeverageSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlcoholicBeverage
        fields = ['name']

class FoodPreferenceSerializer(serializers.ModelSerializer):
    favorites = FavoriteFoodSerializer(many=True)
    dietary_restrictions = DietaryRestrictionSerializer(many=True)

    class Meta:
        model = FoodPreference
        fields = ['favorites', 'dietary_restrictions']

class BeveragePreferenceSerializer(serializers.ModelSerializer):
    non_alcoholic = NonAlcoholicBeverageSerializer(many=True)
    alcoholic = AlcoholicBeverageSerializer(many=True)

    class Meta:
        model = BeveragePreference
        fields = ['non_alcoholic', 'alcoholic']

class PreferencesSerializer(serializers.ModelSerializer):
    room = serializers.DictField(source='*')
    pillow_type = serializers.ListField(child=serializers.CharField(), source='pillow_types.type', read_only=True)
    amenities = serializers.ListField(child=serializers.CharField(), source='amenities.name', read_only=True)
    food_preferences = FoodPreferenceSerializer()
    beverages = BeveragePreferenceSerializer(source='beverage_preferences')

    class Meta:
        model = Preferences
        fields = ['accessible', 'bed_type', 'room', 'pillow_type', 'amenities', 'food_preferences', 'beverages']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['room'] = {
            'type': instance.room_type,
            'location': [loc.location for loc in instance.room_locations.all()],
            'temperature': instance.room_temperature
        }
        return representation

class GuestSerializer(serializers.ModelSerializer):
    upcoming_bookings = BookingSerializer(many=True, read_only=True)
    past_bookings = BookingSerializer(many=True, read_only=True)
    preferences = PreferencesSerializer()

    class Meta:
        model = Guest
        fields = ['first_name', 'last_name', 'birthday', 'gender', 'bonvoy_id', 'email', 'phone_number', 'upcoming_bookings', 'past_bookings', 'preferences']
        read_only_fields = ['bonvoy_id']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['upcoming_bookings'] = BookingSerializer(instance.bookings.filter(is_past=False), many=True).data
        representation['past_bookings'] = BookingSerializer(instance.bookings.filter(is_past=True), many=True).data
        return representation

    @transaction.atomic
    def create(self, validated_data):
        upcoming_bookings_data = validated_data.pop('upcoming_bookings', [])
        past_bookings_data = validated_data.pop('past_bookings', [])
        preferences_data = validated_data.pop('preferences', None)

        guest = Guest.objects.create(**validated_data)

        for booking_data in upcoming_bookings_data:
            Booking.objects.create(guest=guest, is_past=False, **booking_data)
        
        for booking_data in past_bookings_data:
            Booking.objects.create(guest=guest, is_past=True, **booking_data)

        if preferences_data:
            self.create_preferences(guest, preferences_data)

        return guest

    def create_preferences(self, guest, preferences_data):
        room_data = preferences_data.pop('room', {})
        food_preferences_data = preferences_data.pop('food_preferences', {})
        beverage_preferences_data = preferences_data.pop('beverages', {})
        pillow_types_data = preferences_data.pop('pillow_type', [])
        amenities_data = preferences_data.pop('amenities', [])

        preferences = Preferences.objects.create(
            guest=guest,
            room_type=room_data.get('type'),
            room_temperature=room_data.get('temperature'),
            **preferences_data
        )

        for location in room_data.get('location', []):
            RoomLocation.objects.create(preferences=preferences, location=location)

        for pillow_type in pillow_types_data:
            PillowType.objects.create(preferences=preferences, type=pillow_type)

        for amenity in amenities_data:
            Amenity.objects.create(preferences=preferences, name=amenity)

        if food_preferences_data:
            food_pref = FoodPreference.objects.create(preferences=preferences)
            for favorite in food_preferences_data.get('favorites', []):
                FavoriteFood.objects.create(food_preference=food_pref, name=favorite)
            for restriction in food_preferences_data.get('dietary_restrictions', []):
                DietaryRestriction.objects.create(food_preference=food_pref, name=restriction)

        if beverage_preferences_data:
            beverage_pref = BeveragePreference.objects.create(preferences=preferences)
            for non_alcoholic in beverage_preferences_data.get('non_alcoholic', []):
                NonAlcoholicBeverage.objects.create(beverage_preference=beverage_pref, name=non_alcoholic)
            for alcoholic in beverage_preferences_data.get('alcoholic', []):
                AlcoholicBeverage.objects.create(beverage_preference=beverage_pref, name=alcoholic)

        return preferences
