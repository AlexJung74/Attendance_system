"""
ASGI config for attendance_system project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""

import os
import logging
from django.core.asgi import get_asgi_application

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

print("ASGI application is being loaded.")

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'settings.production')

try:
    application = get_asgi_application()
    logger.debug("ASGI application loaded successfully.")
except Exception as e:
    logger.exception("Error loading ASGI application")  # Stack trace 포함
    raise e

# Vercel 호환성을 위한 handler 변수
handler = application
