# attendance/views/viewsets.py

from rest_framework import viewsets
from attendance.models import Course, Semester, Lecturer, Student, Class, CollegeDay, Attendance
from attendance.serializers import (
    CourseSerializer, SemesterSerializer, LecturerSerializer,
    StudentSerializer, ClassSerializer, CollegeDaySerializer, AttendanceSerializer
)
from rest_framework.permissions import IsAdminUser

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

# Class 모델 ViewSet
class ClassViewSet(viewsets.ModelViewSet):
    queryset = Class.objects.all()
    serializer_class = ClassSerializer
    permission_classes = [IsAdminUser]

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
