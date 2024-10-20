"""
Defines schcema database models 
"""
from django.db import models
import uuid

class Guest(models.Model):
    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other'),
    ]

    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    birthday = models.DateField()
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    bonvoy_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=20)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

class Booking(models.Model):
    guest = models.ForeignKey(Guest, on_delete=models.CASCADE, related_name='bookings')
    city = models.CharField(max_length=100)
    hotel = models.CharField(max_length=100)
    check_in_date = models.DateField()
    check_out_date = models.DateField()
    number_of_rooms = models.PositiveIntegerField()
    number_of_guests = models.PositiveIntegerField()
    is_past = models.BooleanField(default=False)

class Preferences(models.Model):
    guest = models.OneToOneField(Guest, on_delete=models.CASCADE, related_name='preferences')
    accessible = models.BooleanField(default=False)
    bed_type = models.CharField(max_length=50)
    room_type = models.CharField(max_length=50)
    room_temperature = models.IntegerField()
    prompt_priority = models.CharField(max_length=50)

class RoomLocation(models.Model):
    preferences = models.ForeignKey(Preferences, on_delete=models.CASCADE, related_name='room_locations')
    location = models.CharField(max_length=50)

class PillowType(models.Model):
    preferences = models.ForeignKey(Preferences, on_delete=models.CASCADE, related_name='pillow_types')
    type = models.CharField(max_length=50)

class Amenity(models.Model):
    preferences = models.ForeignKey(Preferences, on_delete=models.CASCADE, related_name='amenities')
    name = models.CharField(max_length=50)

class FoodPreference(models.Model):
    preferences = models.OneToOneField(Preferences, on_delete=models.CASCADE, related_name='food_preferences')

class FavoriteFood(models.Model):
    food_preference = models.ForeignKey(FoodPreference, on_delete=models.CASCADE, related_name='favorites')
    name = models.CharField(max_length=50)

class DietaryRestriction(models.Model):
    food_preference = models.ForeignKey(FoodPreference, on_delete=models.CASCADE, related_name='dietary_restrictions')
    name = models.CharField(max_length=50)

class BeveragePreference(models.Model):
    preferences = models.OneToOneField(Preferences, on_delete=models.CASCADE, related_name='beverage_preferences')

class NonAlcoholicBeverage(models.Model):
    beverage_preference = models.ForeignKey(BeveragePreference, on_delete=models.CASCADE, related_name='non_alcoholic')
    name = models.CharField(max_length=50)

class AlcoholicBeverage(models.Model):
    beverage_preference = models.ForeignKey(BeveragePreference, on_delete=models.CASCADE, related_name='alcoholic')
    name = models.CharField(max_length=50)