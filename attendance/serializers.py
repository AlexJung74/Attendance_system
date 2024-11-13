# attendance/views/serializers.py

from rest_framework import serializers
from .models import Course, Semester, Lecturer, Student, Class, CollegeDay, Attendance


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
    class Meta:
        model = Lecturer
        fields = ['id', 'user', 'staff_id', 'DOB']


# Student 모델 직렬화
class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ['id', 'user', 'student_id', 'DOB', 'classes']


# Class 모델 직렬화
class ClassSerializer(serializers.ModelSerializer):
    course = CourseSerializer()  # 관련 코스 정보 포함
    semester = SemesterSerializer()  # 관련 학기 정보 포함
    lecturer = LecturerSerializer()  # 관련 강사 정보 포함

    class Meta:
        model = Class
        fields = ['id', 'number', 'course', 'semester', 'lecturer']


# CollegeDay 모델 직렬화
class CollegeDaySerializer(serializers.ModelSerializer):
    class_instance = ClassSerializer()  # 수업 정보 포함

    class Meta:
        model = CollegeDay
        fields = ['id', 'date', 'class_instance']


# Attendance 모델 직렬화
class AttendanceSerializer(serializers.ModelSerializer):
    student = StudentSerializer()  # 학생 정보 포함
    class_instance = ClassSerializer()  # 수업 정보 포함

    class Meta:
        model = Attendance
        fields = ['id', 'student', 'class_instance', 'date', 'status']
