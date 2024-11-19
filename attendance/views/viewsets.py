# attendance/views/viewsets.py
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from rest_framework import viewsets
from attendance.models import Course, Semester, Lecturer, Student, Class, CollegeDay, Attendance
from attendance.serializers import (
    CourseSerializer, SemesterSerializer, LecturerSerializer,
    StudentSerializer, ClassReadSerializer, ClassWriteSerializer, CollegeDaySerializer, AttendanceSerializer
)
from rest_framework.permissions import IsAdminUser
from rest_framework.pagination import PageNumberPagination

class ClassPagination(PageNumberPagination):
    page_size = 20


# Course 모델 ViewSet
class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAdminUser]


# Semester 모델 ViewSet
class SemesterViewSet(viewsets.ModelViewSet):
    queryset = Semester.objects.all()
    serializer_class = SemesterSerializer
    permission_classes = [IsAdminUser]


# Lecturer 모델 ViewSet
class LecturerViewSet(viewsets.ModelViewSet):
    queryset = Lecturer.objects.all()
    serializer_class = LecturerSerializer
    permission_classes = [IsAdminUser]


# Student 모델 ViewSet
class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    permission_classes = [IsAdminUser]


# Class 모델 ViewSet (요청 유형에 따라 직렬화 클래스 선택)
class ClassViewSet(viewsets.ModelViewSet):
    queryset = Class.objects.select_related(
        'course',
        'semester',
        'lecturer',
        'lecturer__user'
    ).all()[:20]
    serializer_class = ClassReadSerializer
    permission_classes = [IsAdminUser]
    pagination_class = ClassPagination

    @method_decorator(cache_page(60 * 15))  # 15분 동안 캐시
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def get_serializer_class(self):
        # GET 요청에는 읽기 전용 직렬화, 그 외 요청에는 쓰기 전용 직렬화 사용
        if self.request.method in ['GET']:
            return ClassReadSerializer
        return ClassWriteSerializer


# CollegeDay 모델 ViewSet
class CollegeDayViewSet(viewsets.ModelViewSet):
    queryset = CollegeDay.objects.all()
    serializer_class = CollegeDaySerializer
    permission_classes = [IsAdminUser]


# Attendance 모델 ViewSet
class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    permission_classes = [IsAdminUser]
