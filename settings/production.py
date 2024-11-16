# settings/production.py

from .base import *
import dj_database_url

DEBUG = True

ALLOWED_HOSTS = [
    'attendance-system-backend-theta.vercel.app',  # 프로덕션 백엔드 도메인
    'attendance-system-frontend-seven.vercel.app',  # 프로덕션 프론트엔드 도메인
    'localhost', '127.0.0.1'
]

DATABASES = {
    'default': dj_database_url.config(
        default=os.getenv('DATABASE_URL'),
        conn_max_age=600,
        ssl_require=True)
}

# 추가적인 프로덕션 설정 (보안, 로깅 등)

STATICFILES_DIRS = [os.path.join(BASE_DIR, 'attendance', 'static')]  # 정적 파일 디렉토리
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATIC_URL = '/static/'

# ASGI 전환 확인용 디버깅 메시지 추가
print("DEBUG: Running ASGI production settings")

