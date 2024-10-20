from rest_framework import serializers
from django.db import transaction
from .models import Guest, Booking, Preferences, RoomLocation, PillowType, Amenity, FoodPreference, FavoriteFood, DietaryRestriction, BeveragePreference, NonAlcoholicBeverage, AlcoholicBeverage

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ['city', 'hotel', 'check_in_date', 'check_out_date', 'number_of_rooms', 'number_of_guests']

class RoomPreferencesSerializer(serializers.ModelSerializer):
    type = serializers.CharField(source='room_type')
    location = serializers.ListField(child=serializers.CharField())
    temperature = serializers.IntegerField(source='room_temperature')

    class Meta:
        model = Preferences
        fields = ['type', 'location', 'temperature']

class FoodPreferencesSerializer(serializers.ModelSerializer):
    favorites = serializers.ListField(child=serializers.CharField())
    dietary_restrictions = serializers.ListField(child=serializers.CharField())

    class Meta:
        model = FoodPreference
        fields = ['favorites', 'dietary_restrictions']

class BeveragePreferencesSerializer(serializers.ModelSerializer):
    non_alcoholic = serializers.ListField(child=serializers.CharField())
    alcoholic = serializers.ListField(child=serializers.CharField())

    class Meta:
        model = BeveragePreference
        fields = ['non_alcoholic', 'alcoholic']

class PreferencesSerializer(serializers.ModelSerializer):
    room = RoomPreferencesSerializer()
    pillow_type = serializers.ListField(child=serializers.CharField())
    amenities = serializers.ListField(child=serializers.CharField())
    food_preferences = FoodPreferencesSerializer()
    beverages = BeveragePreferencesSerializer()

    class Meta:
        model = Preferences
        fields = ['accessible', 'bed_type', 'room', 'pillow_type', 'amenities', 'food_preferences', 'beverages']

class GuestSerializer(serializers.ModelSerializer):
    upcoming_bookings = BookingSerializer(many=True)
    past_bookings = BookingSerializer(many=True)
    preferences = PreferencesSerializer()

    class Meta:
        model = Guest
        fields = ['first_name', 'last_name', 'birthday', 'gender', 'bonvoy_id', 'email', 'phone_number', 'upcoming_bookings', 'past_bookings', 'preferences']
        read_only_fields = ['bonvoy_id']

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

        # Handle room locations
        RoomLocation.objects.bulk_create([
            RoomLocation(preferences=preferences, location=location)
            for location in room_data.get('location', [])
        ])

        # Handle pillow types
        PillowType.objects.bulk_create([
            PillowType(preferences=preferences, type=pillow_type)
            for pillow_type in pillow_types_data
        ])

        # Handle amenities
        amenities = [Amenity.objects.get_or_create(name=amenity)[0] for amenity in amenities_data]
        preferences.amenities.set(amenities)

        # Handle food preferences
        if food_preferences_data:
            food_pref, _ = FoodPreference.objects.get_or_create(preferences=preferences)
            FavoriteFood.objects.bulk_create([
                FavoriteFood(food_preference=food_pref, name=favorite)
                for favorite in food_preferences_data.get('favorites', [])
            ])
            DietaryRestriction.objects.bulk_create([
                DietaryRestriction(food_preference=food_pref, name=restriction)
                for restriction in food_preferences_data.get('dietary_restrictions', [])
            ])

        # Handle beverage preferences
        beverage_pref, _ = BeveragePreference.objects.get_or_create(preferences=preferences)
        NonAlcoholicBeverage.objects.bulk_create([
            NonAlcoholicBeverage(beverage_preference=beverage_pref, name=beverage)
            for beverage in beverage_preferences_data.get('non_alcoholic', [])
        ])
        AlcoholicBeverage.objects.bulk_create([
            AlcoholicBeverage(beverage_preference=beverage_pref, name=beverage)
            for beverage in beverage_preferences_data.get('alcoholic', [])
        ])

        return preferences