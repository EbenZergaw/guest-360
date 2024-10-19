from django.urls import path
from django.http import HttpResponse

def test_view(request):
    return HttpResponse("API is working!")

urlpatterns = [
    path('test/', test_view, name='test'),
]