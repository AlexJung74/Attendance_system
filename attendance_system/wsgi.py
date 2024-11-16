# attendance_system/wsgi.py

"""
WSGI config for attendance_system project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/wsgi/
"""

import os
from django.core.wsgi import get_wsgi_application
import logging


# 로깅 설정
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# 환경 변수 로깅
logger.debug("Initializing WSGI application...")
logger.debug("DJANGO_SETTINGS_MODULE: %s", os.environ.get('DJANGO_SETTINGS_MODULE'))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'settings.production')

try:
    # WSGI 애플리케이션 생성
    application = get_wsgi_application()
    logger.debug("WSGI application initialized successfully.")
except Exception as e:
    logger.error("Error initializing WSGI application: %s", e)
    raise e

# Vercel 호환성을 위한 handler 추가
handler = application
logger.debug("Handler assigned successfully.")