# attendance_system/urls.py

from django.contrib import admin
from django.urls import path, include
from django.contrib.auth import views as auth_views

from attendance.utils import custom_logout
from attendance.views import home_views  # home_views를 사용하여 로그인된 상태 확인

urlpatterns = [
    path('admin/', admin.site.urls),  # Django admin

    # 기본 홈 페이지 설정 (로그인된 상태에 따라 대시보드로 리디렉션)
    path('', home_views.home, name='home'),
    path('dashboard/', home_views.dashboard, name='dashboard'),  # 대시보드 페이지

    # 로그인과 로그아웃은 /accounts 경로로 처리
    path('accounts/login/', auth_views.LoginView.as_view(template_name='registration/login.html'), name='login'),
    path('accounts/logout/', custom_logout, name='logout'),

    # attendance 앱의 urls.py를 포함합니다.
    path('', include('attendance.urls')),
]
