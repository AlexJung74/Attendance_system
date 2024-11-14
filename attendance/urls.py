# attendance/views/urls.py

from django.urls import path, include
import logging
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views.api import (
    CourseViewSet, SemesterViewSet, LecturerViewSet,
    StudentViewSet, ClassViewSet, CollegeDayViewSet, AttendanceViewSet
)
from .views.auth_views import CustomAuthToken

logger = logging.getLogger('django')

def url_log(pattern, view_func, name=None):
    logger.info(f"URL pattern added: {pattern}, view_func: {view_func}, name: {name}")
    return path(pattern, view_func, name=name)

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
    path('api/auth/login/', CustomAuthToken.as_view(), name='token_obtain_pair'),  # CustomAuthToken을 로그인 엔드포인트로 사용
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # 리프레시 토큰 엔드포인트

    # REST API 엔드포인트
    path('api/', include(router.urls)),
]

# router.urls도 urlpatterns에 포함
urlpatterns += router.urls


'''
urlpatterns = [
    # 기본 홈 페이지 (로그인)
    path('dashboard/', home_views.dashboard, name='dashboard'),
    path('classes/', home_views.class_list, name='class-list'),

    # 대시보드
    path('admindashboard/', admin_views.AdminDashboardView.as_view(), name='admin-dashboard'),

    # 관리자 관련 URL 패턴
    path('semesters/', admin_views.SemesterListView.as_view(), name='semester-list'),
    path('semesters/new/', admin_views.SemesterCreateView.as_view(), name='semester-create'),
    path('semesters/<int:pk>/edit/', admin_views.SemesterUpdateView.as_view(), name='semester-update'),
    path('semesters/<int:pk>/delete/', admin_views.SemesterDeleteView.as_view(), name='semester-delete'),
    path('courses/', admin_views.CourseListView.as_view(), name='course-list'),
    path('courses/new/', admin_views.CourseCreateView.as_view(), name='course-create'),
    path('courses/<int:pk>/edit/', admin_views.CourseUpdateView.as_view(), name='course-update'),
    path('courses/<int:pk>/delete/', admin_views.CourseDeleteView.as_view(), name='course-delete'),
    path('classes/', admin_views.AdminClassListView.as_view(), name='admin-class-list'),
    path('classes/detail/<int:pk>/', admin_views.ClassDetailView.as_view(), name='class-detail'),
    path('classes/new/', admin_views.ClassCreateView.as_view(), name='class-create'),
    path('classes/<int:pk>/edit/', admin_views.ClassUpdateView.as_view(), name='class-update'),
    path('classes/<int:pk>/delete/', admin_views.ClassDeleteView.as_view(), name='class-delete'),
    path('lecturers/', admin_views.LecturerListView.as_view(), name='lecturer-list'),
    path('lecturers/new/', admin_views.LecturerCreateView.as_view(), name='lecturer-create'),
    path('lecturers/<int:pk>/edit/', admin_views.LecturerUpdateView.as_view(), name='lecturer-update'),
    path('lecturers/<int:pk>/delete/', admin_views.LecturerDeleteView.as_view(), name='lecturer-delete'),
    path('students/', admin_views.StudentListView.as_view(), name='student-list'),
    path('students/new/', admin_views.StudentCreateView.as_view(), name='student-create'),
    path('students/<int:pk>/edit/', admin_views.StudentUpdateView.as_view(), name='student-update'),
    path('students/<int:pk>/delete/', admin_views.StudentDeleteView.as_view(), name='student-delete'),
    path('attendance/upload_excel/', admin_views.upload_students_excel, name='upload-students-excel'),
    path('attendance/select/', admin_views.select_attendance, name='select-attendance'),
    path('attendance/check/<int:class_instance_id>/', admin_views.attendance_check, name='attendance-check'),
    path('attendance/warning/<int:class_instance_id>/<int:student_id>/', admin_views.send_attendance_warning,
         name='send-attendance-warning'),

    # 강사 관련 URL 패턴
    path('lecturerdashboard/', lecturer_dashboard, name='lecturer-dashboard'),
    path('lecturerclasses/', lecturer_views.LecturerClassListView.as_view(), name='lecturer-class-list'),

    # 학생 관련 URL 패턴
    path('attendance/', student_views.StudentAttendanceView.as_view(), name='student-attendance'),

    # 기타 URL
    path('get-courses/<int:semester_id>/', admin_views.get_courses, name='get-courses'),
    path('get-classes/<int:semester_id>/<int:course_id>/', admin_views.get_classes, name='get-classes'),
]
'''
