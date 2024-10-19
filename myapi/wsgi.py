"""
WSGI (Web Server Gateway Interface) configuration for deploying  project.

Used by Heroku to serve the Django application.
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myapi.settings')

application = get_wsgi_application()
