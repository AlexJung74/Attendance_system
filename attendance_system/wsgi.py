"""
WSGI config for attendance_system project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/wsgi/
"""

import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'settings.production')

# 기존 WSGI 애플리케이션 정의
application = get_wsgi_application()

# Vercel 호환성을 위한 app 변수 추가
app = application
