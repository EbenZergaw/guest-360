"""
Main URL configuration responsible for directing traffic.

This can be ignored as the front end will be developed using NextJS and deployed on Vercel.
"""


from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse

def home(request):
    return HttpResponse("Welcome to Guest360 API")

urlpatterns = [
    path('', home, name='home'),
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
]