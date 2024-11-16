# attendance_system/wsgi.py

"""
WSGI config for attendance_system project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/wsgi/
"""

import os
import sys
from django.core.wsgi import get_wsgi_application
import logging

# 로그 설정: stdout 강제 출력
logging.basicConfig(
    stream=sys.stdout,  # stdout으로 강제 출력
    level=logging.DEBUG,  # DEBUG 수준의 로깅
    format='%(levelname)s %(asctime)s %(message)s',
)

logger = logging.getLogger('django')

# 환경 변수 확인
print("DEBUG: Starting WSGI application initialization...")
print(f"DEBUG: sys.argv: {sys.argv}")
print(f"DEBUG: Current working directory: {os.getcwd()}")
print(f"DEBUG: DJANGO_SETTINGS_MODULE (before): {os.environ.get('DJANGO_SETTINGS_MODULE')}")

# WSGI 애플리케이션 생성
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'settings.production')

try:
    print(f"DEBUG: DJANGO_SETTINGS_MODULE (after): {os.environ.get('DJANGO_SETTINGS_MODULE')}")
    application = get_wsgi_application()
    print("DEBUG: WSGI application initialized successfully.")
    logger.info("WSGI application initialized successfully.")
except Exception as e:
    print(f"ERROR: Failed to initialize WSGI application: {e}")
    logger.error(f"Error initializing WSGI application: {e}")
    raise e

# Vercel 호환성을 위해 handler를 정의
handler = application
