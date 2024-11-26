# attendance/views/api.py

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly  # 수정된 부분
from attendance.models import Course, Semester, Lecturer, Student, Class, CollegeDay, Attendance
from attendance.serializers import (
    CourseSerializer, SemesterSerializer, LecturerSerializer,
    StudentSerializer, ClassReadSerializer, ClassWriteSerializer,
    CollegeDaySerializer, AttendanceSerializer
)


# Course 모델 ViewSet
class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]  # 수정된 부분


# Semester 모델 ViewSet
class SemesterViewSet(viewsets.ModelViewSet):
    queryset = Semester.objects.all()
    serializer_class = SemesterSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]  # 수정된 부분


# Lecturer 모델 ViewSet
class LecturerViewSet(viewsets.ModelViewSet):
    queryset = Lecturer.objects.all()
    serializer_class = LecturerSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]  # 수정된 부분


# Student 모델 ViewSet
class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]  # 수정된 부분


# Class 모델 ViewSet
class ClassViewSet(viewsets.ModelViewSet):
    queryset = Class.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly]  # 수정된 부분

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return ClassReadSerializer
        return ClassWriteSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        semester = self.request.query_params.get('semester')
        course = self.request.query_params.get('course')
        if semester:
            queryset = queryset.filter(semester__id=semester)
        if course:
            queryset = queryset.filter(course__id=course)
        return queryset


# CollegeDay 모델 ViewSet
class CollegeDayViewSet(viewsets.ModelViewSet):
    queryset = CollegeDay.objects.all()
    serializer_class = CollegeDaySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]  # 수정된 부분


# Attendance 모델 ViewSet
class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]  # 수정된 부분
