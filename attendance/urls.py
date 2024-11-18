# attendance/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from .views.admin_views import (
    admin_dashboard,
    select_attendance,
    attendance_check,
    send_attendance_warning,
    AttendanceCheckAPIView,
)
from .views.api import (
    CourseViewSet,
    SemesterViewSet,
    LecturerViewSet,
    StudentViewSet,
    ClassViewSet,
    CollegeDayViewSet,
    AttendanceViewSet,
)
from .views.auth_views import CustomAuthToken

# REST API를 위한 DefaultRouter 설정
router = DefaultRouter()
router.register(r'courses', CourseViewSet, basename='course')
router.register(r'semesters', SemesterViewSet, basename='semester')
router.register(r'lecturers', LecturerViewSet, basename='lecturer')
router.register(r'students', StudentViewSet, basename='student')
router.register(r'classes', ClassViewSet, basename='class')
router.register(r'college-days', CollegeDayViewSet, basename='college-day')
router.register(r'attendances', AttendanceViewSet, basename='attendance')

# URL 패턴 설정
urlpatterns = [
    # 사용자 인증 API 엔드포인트
    path('api/auth/login/', CustomAuthToken.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # 관리자 대시보드 (템플릿 및 API)
    path('api/admin/dashboard/', AttendanceCheckAPIView.as_view(), name='admin_attendance_api'),
    path('dashboard/', admin_dashboard, name='admin_dashboard'),

    # 출석 관리
    path('attendance/select/', select_attendance, name='select_attendance'),
    path('attendance/check/<int:class_instance_id>/', attendance_check, name='attendance_check'),
    path('attendance/warning/<int:class_instance_id>/<int:student_id>/', send_attendance_warning, name='send_attendance_warning'),

    # REST API 엔드포인트
    path('api/', include(router.urls)),
]
