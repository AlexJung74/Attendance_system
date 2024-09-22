# attendance/urls.py

from django.urls import path, include
from django.contrib.auth import views as auth_views
from .views.home_views import home  # 홈 화면 뷰 임포트
from .views.admin_views import (
    admin_dashboard,
    dashboard,
    SemesterListView,
    SemesterCreateView,
    SemesterUpdateView,
    SemesterDeleteView,
    CourseListView,
    CourseCreateView,
    CourseUpdateView,
    CourseDeleteView,
    AdminClassListView,
    ClassCreateView,
    ClassUpdateView,
    ClassDeleteView,
    LecturerListView,
    LecturerCreateView,
    LecturerUpdateView,
    LecturerDeleteView,
    StudentListView,
    StudentCreateView,
    StudentUpdateView,
    StudentDeleteView,
    attendance_check,  # 출석 체크 뷰
    send_attendance_warning,  # 출석 경고 이메일 전송 뷰
    upload_students_excel,  # 학생 정보 엑셀 업로드 뷰
)
from .views.lecturer_views import lecturer_dashboard, LecturerClassListView
from .views.student_views import StudentAttendanceView

urlpatterns = [
    # 기본 홈 페이지 (로그인)
    path('', home, name='home'),

    # 대시보드
    path('dashboard/admin/', admin_dashboard, name='admin-dashboard'),
    path('dashboard/', dashboard, name='dashboard'),

    # 관리자 관련 URL 패턴
    path('semesters/', SemesterListView.as_view(), name='semester-list'),
    path('semesters/new/', SemesterCreateView.as_view(), name='semester-create'),
    path('semesters/<int:pk>/edit/', SemesterUpdateView.as_view(), name='semester-update'),
    path('semesters/<int:pk>/delete/', SemesterDeleteView.as_view(), name='semester-delete'),
    path('courses/', CourseListView.as_view(), name='course-list'),
    path('courses/new/', CourseCreateView.as_view(), name='course-create'),
    path('courses/<int:pk>/edit/', CourseUpdateView.as_view(), name='course-update'),
    path('courses/<int:pk>/delete/', CourseDeleteView.as_view(), name='course-delete'),
    # 관리자 관련 URL 패턴
    path('admin/classes/', AdminClassListView.as_view(), name='admin-class-list'),

    # 강사 관련 URL 패턴
    path('lecturer/classes/', LecturerClassListView.as_view(), name='lecturer-class-list'),
    path('classes/new/', ClassCreateView.as_view(), name='class-create'),
    path('classes/<int:pk>/edit/', ClassUpdateView.as_view(), name='class-update'),
    path('classes/<int:pk>/delete/', ClassDeleteView.as_view(), name='class-delete'),
    path('lecturers/', LecturerListView.as_view(), name='lecturer-list'),
    path('lecturers/new/', LecturerCreateView.as_view(), name='lecturer-create'),
    path('lecturers/<int:pk>/edit/', LecturerUpdateView.as_view(), name='lecturer-update'),
    path('lecturers/<int:pk>/delete/', LecturerDeleteView.as_view(), name='lecturer-delete'),
    path('students/', StudentListView.as_view(), name='student-list'),
    path('students/new/', StudentCreateView.as_view(), name='student-create'),
    path('students/<int:pk>/edit/', StudentUpdateView.as_view(), name='student-update'),
    path('students/<int:pk>/delete/', StudentDeleteView.as_view(), name='student-delete'),

    # 출석 관리 URL 패턴
    path('attendance/', StudentAttendanceView.as_view(), name='student-attendance'),
    path('attendance/check/<int:class_id>/', attendance_check, name='attendance-check'),
    path('attendance/warning/<int:student_id>/', send_attendance_warning, name='send_attendance_warning'),

    # 엑셀 파일 업로드
    path('attendance/upload_excel/', upload_students_excel, name='upload-students-excel'),

    # 강사 대시보드
    path('lecturer/dashboard/', lecturer_dashboard, name='lecturer-dashboard'),

    # 기본 로그인, 로그아웃 URL 포함
    path('login/', auth_views.LoginView.as_view(template_name='attendance/../templates/registration/login.html'), name='login'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),

    # 기본 인증 URL 포함
    path('', include('django.contrib.auth.urls')),

    path('upload-students-excel/', upload_students_excel, name='upload-students-excel'),
]
