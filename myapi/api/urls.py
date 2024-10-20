"""
Define URLs for APIs
"""
from django.urls import path
from .views import GuestListView, GuestDetailView

urlpatterns = [
    path('guests/', GuestListView.as_view(), name='guest-list'),
    path('guests/<uuid:bonvoy_id>/', GuestDetailView.as_view(), name='guest-detail'),
]