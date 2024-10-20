from django.db import models
import uuid

class Booking(models.Model):
    city = models.CharField(max_length=100)
    hotel = models.CharField(max_length=100)
    check_in_date = models.DateField()
    check_out_date = models.DateField()
    number_of_rooms = models.IntegerField()
    number_of_guests = models.IntegerField()

class Preferences(models.Model):
    accessible = models.BooleanField(default=False)
    bed_type = models.CharField(max_length=50)
    room_type = models.CharField(max_length=50)
    room_location = models.JSONField()
    room_temperature = models.IntegerField()
    pillow_type = models.JSONField()
    amenities = models.JSONField()
    food_preferences = models.JSONField()
    beverages = models.JSONField()

class Guest(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    birthday = models.DateField()
    gender = models.CharField(max_length=20)
    bonvoy_id = models.UUIDField()
    email = models.EmailField()
    phone_number = models.CharField(max_length=20)
    upcoming_bookings = models.ManyToManyField(Booking, related_name='upcoming_guests')
    past_bookings = models.ManyToManyField(Booking, related_name='past_guests')
    preferences = models.OneToOneField(Preferences, on_delete=models.CASCADE)