from .base import *
import dj_database_url

DEBUG = False  # 프로덕션 환경에서는 False로 설정

ALLOWED_HOSTS = [
    'attendance-system-backend-theta.vercel.app',
    'attendance-system-frontend-seven.vercel.app',
    'localhost', '127.0.0.1'
]

DATABASES = {
    'default': dj_database_url.config(
        default=config('DATABASE_URL'),
        conn_max_age=600,
        ssl_require=True
    )
}

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# 로그 레벨 설정
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
    },
    'formatters': {
        'verbose': {
            'format': '%(levelname)s %(asctime)s %(module)s %(message)s'
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',  # 필요시 DEBUG로 변경
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': False,
        },
    },
}
