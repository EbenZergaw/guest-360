"""
Define URLs for APIs
"""
from django.urls import path
from .views import GuestView

urlpatterns = [
    path('guests/', GuestView.as_view(), name='guest-list'),
]