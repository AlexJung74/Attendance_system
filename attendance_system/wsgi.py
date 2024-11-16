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
logger.info("Initializing WSGI application...")
logger.info("DJANGO_SETTINGS_MODULE: %s", os.environ.get('DJANGO_SETTINGS_MODULE'))

# WSGI 애플리케이션 생성
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'settings.production')

try:
    application = get_wsgi_application()
    logger.info("WSGI application initialized successfully.")
except Exception as e:
    logger.error("Error initializing WSGI application: %s", e)
    raise e

handler = application
