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

class RoomPreferencesSerializer(serializers.Serializer):
    type = serializers.CharField()
    location = RoomLocationSerializer(many=True)
    temperature = serializers.IntegerField()

class PreferencesSerializer(serializers.ModelSerializer):
    room = RoomPreferencesSerializer()
    pillow_types = PillowTypeSerializer(many=True)
    amenities = AmenitySerializer(many=True)
    food_preferences = FoodPreferenceSerializer()
    beverages = BeveragePreferenceSerializer(source='beverage_preferences')

    class Meta:
        model = Preferences
        fields = ['accessible', 'bed_type', 'room', 'pillow_types', 'prompt_priority', 'amenities', 'food_preferences', 'beverages']

    def create(self, validated_data):
        room_data = validated_data.pop('room', {})
        pillow_types_data = validated_data.pop('pillow_types', [])
        amenities_data = validated_data.pop('amenities', [])
        food_preferences_data = validated_data.pop('food_preferences', {})
        beverage_preferences_data = validated_data.pop('beverage_preferences', {})

        # Ensure room_temperature has a default value if not provided
        if 'room_temperature' not in room_data:
            room_data['room_temperature'] = 72  # Set a default value, adjust as needed

        preferences = Preferences.objects.create(**validated_data)

        # Handle room preferences
        RoomPreferences.objects.create(preferences=preferences, **room_data)

        # Handle pillow types
        for pillow_type in pillow_types_data:
            PillowType.objects.create(preferences=preferences, **pillow_type)

        # Handle amenities
        for amenity in amenities_data:
            Amenity.objects.create(preferences=preferences, **amenity)

        # Handle food preferences
        if food_preferences_data:
            food_prefs = FoodPreference.objects.create(preferences=preferences)
            for favorite in food_preferences_data.get('favorites', []):
                FavoriteFood.objects.create(food_preference=food_prefs, **favorite)
            for restriction in food_preferences_data.get('dietary_restrictions', []):
                DietaryRestriction.objects.create(food_preference=food_prefs, **restriction)

        # Handle beverage preferences
        if beverage_preferences_data:
            beverage_prefs = BeveragePreference.objects.create(preferences=preferences)
            for non_alcoholic in beverage_preferences_data.get('non_alcoholic', []):
                NonAlcoholicBeverage.objects.create(beverage_preference=beverage_prefs, **non_alcoholic)
            for alcoholic in beverage_preferences_data.get('alcoholic', []):
                AlcoholicBeverage.objects.create(beverage_preference=beverage_prefs, **alcoholic)

class GuestSerializer(serializers.ModelSerializer):
    bookings = BookingSerializer(many=True, read_only=True)
    preferences = PreferencesSerializer(read_only=True)

    class Meta:
        model = Guest
        fields = ['id', 'first_name', 'last_name', 'birthday', 'gender', 'bonvoy_id', 'email', 'phone_number', 'bookings', 'preferences']