"""
Define URLs for APIs
"""
from django.urls import path
from .views import GuestListView, GuestDetailView, GuestByBonvoyIdView

urlpatterns = [
    path('guests/', GuestListView.as_view(), name='guest-list'),
    path('guests/<uuid:bonvoy_id>/', GuestDetailView.as_view(), name='guest-detail'),
    path('guests/bonvoy/<uuid:bonvoy_id>/', GuestByBonvoyIdView.as_view(), name='guest-by-bonvoy-id'),
]