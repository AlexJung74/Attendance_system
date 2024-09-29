# settings/production.py

from .base import *
import dj_database_url

DEBUG = False

ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', '').split(',')

DATABASES = {
    'default': dj_database_url.config(conn_max_age=600, ssl_require=True)
}

# 추가적인 프로덕션 설정 (보안, 로깅 등)

STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'