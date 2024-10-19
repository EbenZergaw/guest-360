import os
import dj_database_url

# Add to INSTALLED_APPS
INSTALLED_APPS = [
    'rest_framework',
    'api',
]

# Add near the top
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATIC_URL = '/static/'

# Add to the bottom
DATABASES['default'] = dj_database_url.config(conn_max_age=600, ssl_require=True)
ALLOWED_HOSTS = ['*']