# settings/development.py

from .base import *

ALLOWED_HOSTS = ['*']  # 개발 환경에서만 사용

DATABASES = {
    'default': {
        'ENGINE': os.environ.get('DB_ENGINE', 'django.db.backends.sqlite3'),
        'NAME': os.environ.get('DB_NAME', BASE_DIR / 'db.sqlite3'),
    }
}
