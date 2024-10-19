from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
import json

@method_decorator(csrf_exempt, name='dispatch')
class GuestView(View):
    def get(self, request):
        # This handles GET requests
        return JsonResponse({"message": "This is a GET request to the Guest API"})

    def post(self, request):
        # This handles POST requests
        try:
            data = json.loads(request.body)
            # Process the data here (e.g., save to database)
            return JsonResponse({"message": "POST request successful", "data": data})
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)