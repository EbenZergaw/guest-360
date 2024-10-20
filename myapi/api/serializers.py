from rest_framework import serializers
from .models import Guest, Booking, Preferences, RoomLocation, PillowType, Amenity, FoodPreference, FavoriteFood, DietaryRestriction, BeveragePreference, NonAlcoholicBeverage, AlcoholicBeverage

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ['city', 'hotel', 'check_in_date', 'check_out_date', 'number_of_rooms', 'number_of_guests']

class RoomPreferencesSerializer(serializers.ModelSerializer):
    location = serializers.SerializerMethodField()

    class Meta:
        model = Preferences
        fields = ['type', 'location', 'temperature']

    def get_location(self, obj):
        return [location.location for location in obj.room_locations.all()]

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret['type'] = instance.room_type
        return ret

class FoodPreferencesSerializer(serializers.ModelSerializer):
    favorites = serializers.SerializerMethodField()
    dietary_restrictions = serializers.SerializerMethodField()

    class Meta:
        model = FoodPreference
        fields = ['favorites', 'dietary_restrictions']

    def get_favorites(self, obj):
        return [food.name for food in obj.favorites.all()]

    def get_dietary_restrictions(self, obj):
        return [restriction.name for restriction in obj.dietary_restrictions.all()]

class BeveragePreferencesSerializer(serializers.ModelSerializer):
    non_alcoholic = serializers.SerializerMethodField()
    alcoholic = serializers.SerializerMethodField()

    class Meta:
        model = BeveragePreference
        fields = ['non_alcoholic', 'alcoholic']

    def get_non_alcoholic(self, obj):
        return [beverage.name for beverage in obj.non_alcoholic.all()]

    def get_alcoholic(self, obj):
        return [beverage.name for beverage in obj.alcoholic.all()]

class PreferencesSerializer(serializers.ModelSerializer):
    room = RoomPreferencesSerializer(source='*')
    pillow_type = serializers.SerializerMethodField()
    amenities = serializers.SerializerMethodField()
    food_preferences = FoodPreferencesSerializer()
    beverages = BeveragePreferencesSerializer(source='beverage_preferences')

    class Meta:
        model = Preferences
        fields = ['accessible', 'bed_type', 'room', 'pillow_type', 'amenities', 'food_preferences', 'beverages']

    def get_pillow_type(self, obj):
        return [pillow.type for pillow in obj.pillow_types.all()]

    def get_amenities(self, obj):
        return [amenity.name for amenity in obj.amenities.all()]

class GuestSerializer(serializers.ModelSerializer):
    upcoming_bookings = serializers.SerializerMethodField()
    past_bookings = serializers.SerializerMethodField()
    preferences = PreferencesSerializer(required=False)

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
        upcoming_bookings_data = validated_data.pop('upcoming_bookings', [])
        past_bookings_data = validated_data.pop('past_bookings', [])
        preferences_data = validated_data.pop('preferences', None)

        guest = Guest.objects.create(**validated_data)

        for booking_data in upcoming_bookings_data:
            Booking.objects.create(guest=guest, is_past=False, **booking_data)
        
        for booking_data in past_bookings_data:
            Booking.objects.create(guest=guest, is_past=True, **booking_data)

        if preferences_data:
            room_data = preferences_data.pop('room', {})
            food_preferences_data = preferences_data.pop('food_preferences', {})
            beverage_preferences_data = preferences_data.pop('beverages', {})

            preferences = Preferences.objects.create(guest=guest, **preferences_data)

            for location in room_data.get('location', []):
                RoomLocation.objects.create(preferences=preferences, location=location)

            for pillow_type in preferences_data.get('pillow_type', []):
                PillowType.objects.create(preferences=preferences, type=pillow_type)

            for amenity in preferences_data.get('amenities', []):
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

        return guest

    def update(self, instance, validated_data):
        # Update basic guest information
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.birthday = validated_data.get('birthday', instance.birthday)
        instance.gender = validated_data.get('gender', instance.gender)
        instance.email = validated_data.get('email', instance.email)
        instance.phone_number = validated_data.get('phone_number', instance.phone_number)
        instance.save()

        # Update bookings
        upcoming_bookings_data = validated_data.get('upcoming_bookings', [])
        past_bookings_data = validated_data.get('past_bookings', [])

        instance.bookings.filter(is_past=False).delete()
        instance.bookings.filter(is_past=True).delete()

        for booking_data in upcoming_bookings_data:
            Booking.objects.create(guest=instance, is_past=False, **booking_data)
        
        for booking_data in past_bookings_data:
            Booking.objects.create(guest=instance, is_past=True, **booking_data)

        # Update preferences
        preferences_data = validated_data.get('preferences')
        if preferences_data:
            preferences, created = Preferences.objects.get_or_create(guest=instance)
            
            preferences.accessible = preferences_data.get('accessible', preferences.accessible)
            preferences.bed_type = preferences_data.get('bed_type', preferences.bed_type)
            preferences.room_type = preferences_data.get('room', {}).get('type', preferences.room_type)
            preferences.room_temperature = preferences_data.get('room', {}).get('temperature', preferences.room_temperature)
            preferences.save()

            # Update room locations
            preferences.room_locations.all().delete()
            for location in preferences_data.get('room', {}).get('location', []):
                RoomLocation.objects.create(preferences=preferences, location=location)

            # Update pillow types
            preferences.pillow_types.all().delete()
            for pillow_type in preferences_data.get('pillow_type', []):
                PillowType.objects.create(preferences=preferences, type=pillow_type)

            # Update amenities
            preferences.amenities.all().delete()
            for amenity in preferences_data.get('amenities', []):
                Amenity.objects.create(preferences=preferences, name=amenity)

            # Update food preferences
            food_preferences_data = preferences_data.get('food_preferences', {})
            food_pref, created = FoodPreference.objects.get_or_create(preferences=preferences)
            
            food_pref.favorites.all().delete()
            for favorite in food_preferences_data.get('favorites', []):
                FavoriteFood.objects.create(food_preference=food_pref, name=favorite)

            food_pref.dietary_restrictions.all().delete()
            for restriction in food_preferences_data.get('dietary_restrictions', []):
                DietaryRestriction.objects.create(food_preference=food_pref, name=restriction)

            # Update beverage preferences
            beverage_preferences_data = preferences_data.get('beverages', {})
            beverage_pref, created = BeveragePreference.objects.get_or_create(preferences=preferences)
            
            beverage_pref.non_alcoholic.all().delete()
            for non_alcoholic in beverage_preferences_data.get('non_alcoholic', []):
                NonAlcoholicBeverage.objects.create(beverage_preference=beverage_pref, name=non_alcoholic)

            beverage_pref.alcoholic.all().delete()
            for alcoholic in beverage_preferences_data.get('alcoholic', []):
                AlcoholicBeverage.objects.create(beverage_preference=beverage_pref, name=alcoholic)

        return instance

class GuestResponseSerializer(serializers.Serializer):
    guest = GuestSerializer()