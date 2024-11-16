# attendance_system/urls.py

from django.contrib import admin
from django.urls import path, include
from django.contrib.auth import views as auth_views
from django.shortcuts import redirect

from attendance.utils import custom_logout

urlpatterns = [
    # Django admin 페이지를 기본 홈으로 설정
    path('', lambda request: redirect('admin/'), name='backend-home'),

    # Django admin
    path('admin/', admin.site.urls),

    # 로그인과 로그아웃은 /accounts 경로로 처리
    path('accounts/login/', auth_views.LoginView.as_view(template_name='registration/login.html'), name='login'),
    path('accounts/logout/', custom_logout, name='logout'),

    # attendance 앱의 urls.py를 포함합니다.
    path('', include('attendance.urls')),
]
