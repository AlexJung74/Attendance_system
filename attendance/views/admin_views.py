# attendance/views/admin_views.py

import logging

from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin, PermissionRequiredMixin
from django.shortcuts import render, redirect, get_object_or_404
from django.urls import reverse_lazy
from django.utils import timezone
from django.views.generic import ListView, CreateView, UpdateView, DeleteView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from attendance.models import Semester, Course, Class, Lecturer, Student, Attendance, CollegeDay
from attendance.utils import (
    send_attendance_warning_email,
    calculate_attendance_rate,
    has_permission_for_attendance,
    update_attendance_status
)

logger = logging.getLogger('attendance')


# 관리자 대시보드 (API 뷰와 템플릿 뷰 분리)
class AttendanceCheckAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        attendances = Attendance.objects.all()
        data = [
            {
                "id": attendance.id,
                "date": attendance.date,
                "class": str(attendance.class_instance),
                "student": str(attendance.student),
                "status": attendance.get_status_display(),
            }
            for attendance in attendances
        ]
        return Response(data)


@login_required
def admin_dashboard(request):
    lecturers = Lecturer.objects.all()
    courses = Course.objects.all()
    classes = Class.objects.all()
    semesters = Semester.objects.all()

    context = {
        "lecturers": lecturers,
        "courses": courses,
        "classes": classes,
        "semesters": semesters,
    }
    return render(request, "admin/admin_dashboard.html", context)


# 학기 관리 뷰 (API 및 템플릿 기반)
class SemesterListView(LoginRequiredMixin, ListView):
    model = Semester
    template_name = 'admin/semester_list.html'
    context_object_name = 'semesters'


class SemesterCreateView(LoginRequiredMixin, PermissionRequiredMixin, CreateView):
    model = Semester
    fields = ['year', 'semester']
    template_name = 'admin/semester_form.html'
    success_url = reverse_lazy('semester-list')
    permission_required = 'attendance.add_semester'


class SemesterUpdateView(LoginRequiredMixin, PermissionRequiredMixin, UpdateView):
    model = Semester
    fields = ['year', 'semester']
    template_name = 'admin/semester_form.html'
    success_url = reverse_lazy('semester-list')
    permission_required = 'attendance.change_semester'


class SemesterDeleteView(LoginRequiredMixin, PermissionRequiredMixin, DeleteView):
    model = Semester
    template_name = 'admin/semester_confirm_delete.html'
    success_url = reverse_lazy('semester-list')
    permission_required = 'attendance.delete_semester'


# 출석 관리 뷰
@login_required
def select_attendance(request):
    semesters = Semester.objects.all()
    courses = Course.objects.none()
    classes = Class.objects.none()

    selected_semester = request.GET.get("semester")
    selected_course = request.GET.get("course")

    if selected_semester:
        courses = Course.objects.filter(classes__semester__id=selected_semester).distinct()

    if selected_semester and selected_course:
        classes = Class.objects.filter(
            semester__id=selected_semester, course__id=selected_course
        ).distinct()

    context = {
        "semesters": semesters,
        "courses": courses,
        "classes": classes,
        "selected_semester": selected_semester,
        "selected_course": selected_course,
    }
    return render(request, "select_attendance.html", context)


@login_required
def attendance_check(request, class_instance_id):
    class_instance = get_object_or_404(Class, pk=class_instance_id)

    if not has_permission_for_attendance(request.user, class_instance):
        messages.error(request, "You do not have permission to access this page.")
        return redirect("home")

    students = class_instance.students.all()
    today = timezone.now().date()

    college_days = CollegeDay.objects.filter(class_instance=class_instance).order_by("date")
    selected_date = request.GET.get("date", today)

    attendance_data = Attendance.objects.filter(class_instance=class_instance, date=selected_date)
    student_attendance_dict = {att.student.id: att for att in attendance_data}

    total_classes = Attendance.objects.filter(class_instance=class_instance).values("date").distinct().count()

    students_with_attendance = [
        {
            "student": student,
            "status": student_attendance_dict.get(student.id).status
            if student_attendance_dict.get(student.id)
            else "P",
            "attendance_rate": calculate_attendance_rate(student, class_instance),
        }
        for student in students
    ]

    context = {
        "class_instance": class_instance,
        "students_with_attendance": students_with_attendance,
        "college_days": college_days,
        "selected_date": selected_date,
    }
    return render(request, "attendance_check.html", context)


# 출석 경고 이메일 발송
@login_required
def send_attendance_warning(request, class_instance_id, student_id):
    class_instance = get_object_or_404(Class, pk=class_instance_id)
    student = get_object_or_404(Student, pk=student_id)

    if not request.user.is_superuser and request.user != class_instance.lecturer.user:
        messages.error(request, "You do not have permission to access this page.")
        return redirect("home")

    attendance_rate = calculate_attendance_rate(student, class_instance)
    send_attendance_warning_email(student, attendance_rate)

    messages.success(request, f"Warning email sent to {student.user.get_full_name()}.")
    return redirect("attendance_check", class_instance_id=class_instance_id)
