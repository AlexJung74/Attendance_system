"""
ASGI config for attendance_system project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""

import os
import logging
from django.core.asgi import get_asgi_application

# ASGI 애플리케이션 로드 로깅
print("ASGI application is being loaded.")

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Django 환경 설정
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "attendance_system.settings.production")

try:
    application = get_asgi_application()
    logger.debug("ASGI application loaded successfully.")
except Exception as e:
    logger.error("Error loading ASGI application: %s", e)
    raise e

# Vercel 호환성을 위한 핸들러 설정
handler = application
