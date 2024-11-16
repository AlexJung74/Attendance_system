# settings/production.py

from .base import *
import dj_database_url

DEBUG = False

ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', '').split(',')

DATABASES = {
    'default': dj_database_url.config(default=os.getenv('DATABASE_URL'), conn_max_age=600, ssl_require=True)
}

LOGGING = {
    'version': 1,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'django.db.backends': {
            'level': 'DEBUG',
            'handlers': ['console'],
        },
    },
}

# 추가적인 프로덕션 설정 (보안, 로깅 등)

STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
