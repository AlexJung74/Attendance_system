# attendance/admin.py

from django.contrib import admin
from .models import Lecturer, Student, Course, Semester, Class, CollegeDay, ClassStudent, Attendance


@admin.register(Lecturer)
class LecturerAdmin(admin.ModelAdmin):
    list_display = ('user', 'staff_id', 'DOB')
    search_fields = ('user__username', 'staff_id')
    list_filter = ('DOB',)
    ordering = ('staff_id',)


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('user', 'student_id', 'DOB')
    search_fields = ('user__username', 'student_id')
    list_filter = ('DOB',)
    ordering = ('student_id',)


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('name', 'code')
    search_fields = ('name', 'code')
    ordering = ('code',)


@admin.register(Semester)
class SemesterAdmin(admin.ModelAdmin):
    list_display = ('year', 'semester')
    search_fields = ('year', 'semester')
    ordering = ('year', 'semester')


@admin.register(Class)
class ClassAdmin(admin.ModelAdmin):
    list_display = ('number', 'course', 'semester', 'lecturer')
    search_fields = ('course__name', 'lecturer__user__username')
    list_filter = ('semester', 'course')
    ordering = ('number',)


@admin.register(CollegeDay)
class CollegeDayAdmin(admin.ModelAdmin):
    list_display = ('date', 'class_instance')
    search_fields = ('date', 'class_instance__course__name')
    list_filter = ('class_instance__semester',)
    ordering = ('date',)


@admin.register(ClassStudent)
class ClassStudentAdmin(admin.ModelAdmin):
    list_display = ('student', 'class_instance')
    search_fields = ('student__user__username', 'class_instance__course__name')
    list_filter = ('class_instance__semester',)
    ordering = ('class_instance', 'student')


@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ('student', 'class_instance', 'date', 'status')
    search_fields = ('student__user__username', 'class_instance__course__name')
    list_filter = ('status', 'date', 'class_instance__semester')
    ordering = ('class_instance', 'date', 'student')
