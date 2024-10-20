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
        preferences_data = validated_data.pop('preferences', None)
        guest = Guest.objects.create(**validated_data)
        if preferences_data:
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
        room_locations_data = preferences_data.pop('room_locations', [])
        pillow_types_data = preferences_data.pop('pillow_types', [])
        amenities_data = preferences_data.pop('amenities', [])
        food_preferences_data = preferences_data.pop('food_preferences', {})
        beverage_preferences_data = preferences_data.pop('beverage_preferences', {})

        preferences = Preferences.objects.create(guest=guest, **preferences_data)

        for location in room_locations_data:
            RoomLocation.objects.create(preferences=preferences, **location)

        for pillow_type in pillow_types_data:
            PillowType.objects.create(preferences=preferences, **pillow_type)

        for amenity in amenities_data:
            Amenity.objects.create(preferences=preferences, **amenity)

        if food_preferences_data:
            food_pref = FoodPreference.objects.create(preferences=preferences)
            for favorite in food_preferences_data.get('favorites', []):
                FavoriteFood.objects.create(food_preference=food_pref, **favorite)
            for restriction in food_preferences_data.get('dietary_restrictions', []):
                DietaryRestriction.objects.create(food_preference=food_pref, **restriction)

        if beverage_preferences_data:
            beverage_pref = BeveragePreference.objects.create(preferences=preferences)
            for non_alcoholic in beverage_preferences_data.get('non_alcoholic', []):
                NonAlcoholicBeverage.objects.create(beverage_preference=beverage_pref, **non_alcoholic)
            for alcoholic in beverage_preferences_data.get('alcoholic', []):
                AlcoholicBeverage.objects.create(beverage_preference=beverage_pref, **alcoholic)

    def update_preferences(self, preferences, preferences_data):
        room_locations_data = preferences_data.pop('room_locations', None)
        pillow_types_data = preferences_data.pop('pillow_types', None)
        amenities_data = preferences_data.pop('amenities', None)
        food_preferences_data = preferences_data.pop('food_preferences', None)
        beverage_preferences_data = preferences_data.pop('beverage_preferences', None)

        for attr, value in preferences_data.items():
            setattr(preferences, attr, value)
        preferences.save()

        if room_locations_data is not None:
            preferences.room_locations.all().delete()
            for location in room_locations_data:
                RoomLocation.objects.create(preferences=preferences, **location)

        if pillow_types_data is not None:
            preferences.pillow_types.all().delete()
            for pillow_type in pillow_types_data:
                PillowType.objects.create(preferences=preferences, **pillow_type)

        if amenities_data is not None:
            preferences.amenities.all().delete()
            for amenity in amenities_data:
                Amenity.objects.create(preferences=preferences, **amenity)

        if food_preferences_data is not None:
            if hasattr(preferences, 'food_preferences'):
                preferences.food_preferences.favorites.all().delete()
                preferences.food_preferences.dietary_restrictions.all().delete()
                food_pref = preferences.food_preferences
            else:
                food_pref = FoodPreference.objects.create(preferences=preferences)

            for favorite in food_preferences_data.get('favorites', []):
                FavoriteFood.objects.create(food_preference=food_pref, **favorite)
            for restriction in food_preferences_data.get('dietary_restrictions', []):
                DietaryRestriction.objects.create(food_preference=food_pref, **restriction)

        if beverage_preferences_data is not None:
            if hasattr(preferences, 'beverage_preferences'):
                preferences.beverage_preferences.non_alcoholic.all().delete()
                preferences.beverage_preferences.alcoholic.all().delete()
                beverage_pref = preferences.beverage_preferences
            else:
                beverage_pref = BeveragePreference.objects.create(preferences=preferences)

            for non_alcoholic in beverage_preferences_data.get('non_alcoholic', []):
                NonAlcoholicBeverage.objects.create(beverage_preference=beverage_pref, **non_alcoholic)
            for alcoholic in beverage_preferences_data.get('alcoholic', []):
                AlcoholicBeverage.objects.create(beverage_preference=beverage_pref, **alcoholic)