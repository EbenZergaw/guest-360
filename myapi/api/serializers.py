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

class FoodPreferenceSerializer(serializers.ModelSerializer):
    favorites = FavoriteFoodSerializer(many=True)
    dietary_restrictions = DietaryRestrictionSerializer(many=True)

    class Meta:
        model = FoodPreference
        fields = ['favorites', 'dietary_restrictions']

    def create(self, validated_data):
        favorites_data = validated_data.pop('favorites', [])
        dietary_restrictions_data = validated_data.pop('dietary_restrictions', [])
        food_preference = FoodPreference.objects.create(**validated_data)

        for favorite_data in favorites_data:
            FavoriteFood.objects.create(food_preference=food_preference, **favorite_data)
        
        for restriction_data in dietary_restrictions_data:
            DietaryRestriction.objects.create(food_preference=food_preference, **restriction_data)

        return food_preference

class NonAlcoholicBeverageSerializer(serializers.ModelSerializer):
    class Meta:
        model = NonAlcoholicBeverage
        fields = ['name']

class AlcoholicBeverageSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlcoholicBeverage
        fields = ['name']

class BeveragePreferenceSerializer(serializers.ModelSerializer):
    non_alcoholic = NonAlcoholicBeverageSerializer(many=True)
    alcoholic = AlcoholicBeverageSerializer(many=True)

    class Meta:
        model = BeveragePreference
        fields = ['non_alcoholic', 'alcoholic']

    def create(self, validated_data):
        non_alcoholic_data = validated_data.pop('non_alcoholic', [])
        alcoholic_data = validated_data.pop('alcoholic', [])
        beverage_preference = BeveragePreference.objects.create(**validated_data)
        
        for beverage_data in non_alcoholic_data:
            NonAlcoholicBeverage.objects.create(beverage_preference=beverage_preference, **beverage_data)
        
        for beverage_data in alcoholic_data:
            AlcoholicBeverage.objects.create(beverage_preference=beverage_preference, **beverage_data)
        
        return beverage_preference

class PreferencesSerializer(serializers.ModelSerializer):
    room = serializers.DictField(source='*')
    pillow_type = serializers.ListField(child=serializers.CharField(), write_only=True)
    amenities = serializers.ListField(child=serializers.CharField(), write_only=True)
    food_preferences = FoodPreferenceSerializer()
    beverages = BeveragePreferenceSerializer()

    class Meta:
        model = Preferences
        fields = ['accessible', 'bed_type', 'room', 'pillow_type', 'amenities', 'food_preferences', 'beverages']

    def create(self, validated_data):
        room_data = validated_data.pop('room', {})
        pillow_types_data = validated_data.pop('pillow_type', [])
        amenities_data = validated_data.pop('amenities', [])
        food_preferences_data = validated_data.pop('food_preferences', {})
        beverage_preferences_data = validated_data.pop('beverages', {})

        validated_data['room_type'] = room_data.get('type')
        validated_data['room_temperature'] = room_data.get('temperature')

        preferences = Preferences.objects.create(**validated_data)

        for location in room_data.get('location', []):
            RoomLocation.objects.create(preferences=preferences, location=location)

        for pillow_type in pillow_types_data:
            PillowType.objects.create(preferences=preferences, type=pillow_type)

        for amenity in amenities_data:
            Amenity.objects.create(preferences=preferences, name=amenity)

        if food_preferences_data:
            FoodPreferenceSerializer().create(dict(preferences=preferences, **food_preferences_data))

        if beverage_preferences_data:
            BeveragePreferenceSerializer().create(dict(preferences=preferences, **beverage_preferences_data))

        return preferences

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['room'] = {
            'type': instance.room_type,
            'location': [loc.location for loc in instance.room_locations.all()],
            'temperature': instance.room_temperature
        }
        representation['pillow_type'] = [pt.type for pt in instance.pillow_types.all()]
        representation['amenities'] = [a.name for a in instance.amenities.all()]
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
            PreferencesSerializer().create(dict(guest=guest, **preferences_data))

        return guest