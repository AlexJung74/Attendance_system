# attendance/serializers.py

from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Course, Semester, Lecturer, Student, Class, CollegeDay, Attendance
import logging
logger = logging.getLogger(__name__)

# User 모델 직렬화
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email']


# Course 모델 직렬화
class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['id', 'code', 'name']


# Semester 모델 직렬화
class SemesterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Semester
        fields = ['id', 'year', 'semester']


# Lecturer 모델 직렬화
class LecturerSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)  # User 정보를 포함

    class Meta:
        model = Lecturer
        fields = ['id', 'user', 'staff_id', 'DOB']


# Student 모델 직렬화
class StudentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)  # User 정보를 포함
    classes = serializers.PrimaryKeyRelatedField(many=True, queryset=Class.objects.all())  # 클래스 ID만 참조

    class Meta:
        model = Student
        fields = ['id', 'user', 'student_id', 'DOB', 'classes']


# Class 모델 읽기 전용 직렬화 (읽기 전용)
class ClassReadSerializer(serializers.ModelSerializer):
    course = CourseSerializer(read_only=True)  # 관련 코스 정보 포함
    semester = SemesterSerializer(read_only=True)  # 관련 학기 정보 포함
    lecturer = LecturerSerializer(read_only=True)  # 관련 강사 정보 포함

    class Meta:
        model = Class
        fields = ['id', 'number', 'course', 'semester', 'lecturer']

    def to_representation(self, instance):
        try:
            return super().to_representation(instance)
        except Exception as e:
            logger.error(f"Class ID {instance.id} Error occurred during serialization: {e}")
            raise e


# Class 모델 쓰기 전용 직렬화 (쓰기 전용)
class ClassWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Class
        fields = ['id', 'number', 'course', 'semester', 'lecturer']


# CollegeDay 모델 직렬화
class CollegeDaySerializer(serializers.ModelSerializer):
    class_instance = ClassReadSerializer(read_only=True)  # 수업 정보 포함

    class Meta:
        model = CollegeDay
        fields = ['id', 'date', 'class_instance']


# Attendance 모델 직렬화
class AttendanceSerializer(serializers.ModelSerializer):
    student = StudentSerializer(read_only=True)  # 학생 정보 포함
    class_instance = ClassReadSerializer(read_only=True)  # 수업 정보 포함

    class Meta:
        model = Attendance
        fields = ['id', 'student', 'class_instance', 'date', 'status']
