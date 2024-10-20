"""
Convert model instances like Guests into a format that can be easily stored/transmitted, i.e. JSON
"""
from rest_framework import serializers
from .models import Guest, Booking, Preferences, RoomLocation, PillowType, Amenity, FoodPreference, FavoriteFood, DietaryRestriction, BeveragePreference, NonAlcoholicBeverage, AlcoholicBeverage

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        exclude = ['guest', 'is_past']

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

class PreferencesSerializer(serializers.ModelSerializer):
    room_locations = RoomLocationSerializer(many=True)
    pillow_types = PillowTypeSerializer(many=True)
    amenities = AmenitySerializer(many=True)
    food_preferences = FoodPreferenceSerializer()
    beverage_preferences = BeveragePreferenceSerializer()

    class Meta:
        model = Preferences
        fields = ['accessible', 'bed_type', 'room_type', 'room_temperature', 'room_locations', 'pillow_types', 'prompt_priority', 'amenities', 'food_preferences', 'beverage_preferences']

class GuestSerializer(serializers.ModelSerializer):
    upcoming_bookings = serializers.SerializerMethodField()
    past_bookings = serializers.SerializerMethodField()
    preferences = PreferencesSerializer()

    class Meta:
        model = Guest
        fields = ['first_name', 'last_name', 'birthday', 'gender', 'bonvoy_id', 'email', 'phone_number', 'upcoming_bookings', 'past_bookings', 'preferences']

    def get_upcoming_bookings(self, obj):
        bookings = obj.bookings.filter(is_past=False)
        return BookingSerializer(bookings, many=True).data

    def get_past_bookings(self, obj):
        bookings = obj.bookings.filter(is_past=True)
        return BookingSerializer(bookings, many=True).data

    def create(self, validated_data):
        preferences_data = validated_data.pop('preferences')
        guest = Guest.objects.create(**validated_data)
        self.create_preferences(guest, preferences_data)
        return guest

    def update(self, instance, validated_data):
        preferences_data = validated_data.pop('preferences', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if preferences_data:
            self.update_preferences(instance.preferences, preferences_data)
        return instance

    def create_preferences(self, guest, preferences_data):
        # Implementation for creating preferences
        pass

    def update_preferences(self, preferences, preferences_data):
        # Implementation for updating preferences
        pass