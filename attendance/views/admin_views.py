# attendance/views/admin_views.py

import pandas as pd
from datetime import date, datetime
from django.contrib import messages
from django.contrib.auth.decorators import login_required, permission_required
from django.contrib.auth.models import User
from django.contrib.auth.mixins import LoginRequiredMixin, PermissionRequiredMixin
from django.shortcuts import render, redirect, get_object_or_404
from django.urls import reverse_lazy
from django.views.generic import ListView, CreateView, UpdateView, DeleteView
from ..models import Semester, Course, Class, Lecturer, Student

from ..utils import send_attendance_warning_email, calculate_attendance_rate, redirect_user_based_on_role, \
    update_attendance_records, redirect_to_dashboard, has_permission_for_attendance


# 관리자 대시보드
@login_required
def admin_dashboard(request):
    classes = Class.objects.all()
    return render(request, 'attendance/../../templates/admin/admin_dashboard.html', {'classes': classes})


# 강사 대시보드
@login_required
def lecturer_dashboard(request):
    classes = Class.objects.filter(lecturer__user=request.user)
    return render(request, 'attendance/../../templates/lecturer/lecturer_dashboard.html', {'classes': classes})


# 로그인 후 사용자 권한에 따라 각기 다른 페이지로 리디렉션
@login_required
def dashboard(request):
    return redirect_user_based_on_role(request.user)


# Attendance Check View (관리자 및 강사용)
# attendance/views/admin_views.py
@login_required
def attendance_check(request, class_id):
    class_instance = get_object_or_404(Class, pk=class_id)

    # 관리자가 아니고 해당 수업의 강사가 아닌 경우 접근 제한
    if not has_permission_for_attendance(request.user, class_instance):
        messages.error(request, 'You do not have permission to access this page.')
        return redirect('class-list')

    students = class_instance.students.all()
    today = date.today()

    # today 변수, 로그로 확인
    print(f"Today: {today}")

    # 만약 Attendance 모델의 date 필드가 datetime 타입이라면, today 변수를 datetime 형식으로 변환
    today_start = datetime(today.year, today.month, today.day, 0, 0, 0)
    today_end = datetime(today.year, today.month, today.day, 23, 59, 59)

    if request.method == 'POST':
        update_attendance_records(request, students, class_instance, today)
        messages.success(request, 'Attendance has been updated successfully.')
        return redirect_to_dashboard(request.user)

    context = {
        'class_instance': class_instance,
        'students': students,
        'today': today,
    }
    return render(request, 'attendance/../../templates/attendance_check.html', context)


@login_required
def class_list_admin(request):
    classes = Class.objects.all()
    context = {
        'classes': classes,
        'title': 'Admin Class List'
    }
    return render(request, 'attendance/../../templates/admin/class_list.html', context)


# Send Attendance Warning View
@login_required
def send_attendance_warning(request, class_id):
    class_instance = get_object_or_404(Class, pk=class_id)

    # 관리자가 아니고 강사가 아니라면 접근 제한
    if not request.user.is_superuser and request.user != class_instance.lecturer.user:
        messages.error(request, 'You do not have permission to access this page.')
        return redirect('class-list')

    students_with_issues = Student.objects.filter(
        attendance__class_instance=class_instance,
        attendance__status__in=['A', 'L']
    ).distinct()

    for student in students_with_issues:
        attendance_rate = calculate_attendance_rate(student, class_instance)
        send_attendance_warning_email(student, attendance_rate)

    messages.success(request, 'Attendance warning emails have been sent.')
    if request.user.is_superuser:
        return redirect('class-list')
    else:
        return redirect('lecturer-dashboard')


# 학생 정보 엑셀 업로드
@login_required
@permission_required('attendance.add_student', raise_exception=True)
def upload_students_excel(request):
    if request.method == 'POST':
        # 업로드된 파일이 있는지 확인
        if 'student_file' in request.FILES:
            excel_file = request.FILES['student_file']
            try:
                # 판다스를 사용하여 엑셀 파일 읽기
                df = pd.read_excel(excel_file)

                # 데이터 유효성 검사 (예시: 필수 컬럼이 있는지 확인)
                required_columns = ['username', 'email', 'student_id', 'DOB']
                if not all(col in df.columns for col in required_columns):
                    messages.error(request, "The Excel file is missing a required column.")
                    return redirect('upload-students-excel')

                # 각 행마다 학생 정보 생성 또는 업데이트
                for _, row in df.iterrows():
                    # 사용자 생성 또는 업데이트
                    user, created = User.objects.update_or_create(
                        username=row['username'],
                        defaults={
                            'email': row['email'],
                            'first_name': row.get('first_name', ''),
                            'last_name': row.get('last_name', ''),
                        }
                    )
                    # 학생 생성 또는 업데이트
                    Student.objects.update_or_create(
                        user=user,
                        defaults={
                            'student_id': row['student_id'],
                            'DOB': row['DOB']
                        }
                    )
                messages.success(request, "Student information has been successfully uploaded.")
                return redirect('student-list')
            except Exception as e:
                messages.error(request, f"An error occurred while processing the Excel file: {str(e)}")
                return redirect('upload-students-excel')
        else:
            messages.error(request, "Select the Excel file you want to upload.")
            return redirect('upload-students-excel')

    return render(request, 'attendance/../../templates/admin/upload_students_excel.html')


# Semester mgt.
class SemesterListView(LoginRequiredMixin, ListView):
    model = Semester
    template_name = 'attendance/../../templates/admin/semester_list.html'
    context_object_name = 'semesters'


class SemesterCreateView(LoginRequiredMixin, PermissionRequiredMixin, CreateView):
    model = Semester
    fields = ['year', 'semester']
    template_name = 'attendance/../../templates/admin/semester_form.html'
    success_url = reverse_lazy('semester-list')
    permission_required = 'attendance.add_semester'


class SemesterUpdateView(LoginRequiredMixin, PermissionRequiredMixin, UpdateView):
    model = Semester
    fields = ['year', 'semester']
    template_name = 'attendance/../../templates/admin/semester_form.html'
    success_url = reverse_lazy('semester-list')
    permission_required = 'attendance.change_semester'


class SemesterDeleteView(LoginRequiredMixin, PermissionRequiredMixin, DeleteView):
    model = Semester
    template_name = 'attendance/../../templates/admin/semester_confirm_delete.html'
    success_url = reverse_lazy('semester-list')
    permission_required = 'attendance.delete_semester'


# Course mgt.
class CourseListView(LoginRequiredMixin, ListView):
    model = Course
    template_name = 'attendance/../../templates/admin/course_list.html'
    context_object_name = 'courses'


class CourseCreateView(LoginRequiredMixin, PermissionRequiredMixin, CreateView):
    model = Course
    fields = ['code', 'name']
    template_name = 'attendance/../../templates/admin/course_form.html'
    success_url = reverse_lazy('course-list')
    permission_required = 'attendance.add_course'


class CourseUpdateView(LoginRequiredMixin, PermissionRequiredMixin, UpdateView):
    model = Course
    fields = ['code', 'name']
    template_name = 'attendance/../../templates/admin/course_form.html'
    success_url = reverse_lazy('course-list')
    permission_required = 'attendance.change_course'


class CourseDeleteView(LoginRequiredMixin, PermissionRequiredMixin, DeleteView):
    model = Course
    template_name = 'attendance/../../templates/admin/course_confirm_delete.html'
    success_url = reverse_lazy('course-list')
    permission_required = 'attendance.delete_course'


# Class mgt.
class AdminClassListView(LoginRequiredMixin, ListView):
    model = Class
    template_name = 'attendance/../../templates/admin/class_list.html'
    context_object_name = 'classes'


class ClassCreateView(LoginRequiredMixin, PermissionRequiredMixin, CreateView):
    model = Class
    fields = ['number', 'course', 'semester', 'lecturer']
    template_name = 'attendance/../../templates/admin/class_form.html'
    success_url = reverse_lazy('class-list')
    permission_required = 'attendance.add_class'


class ClassUpdateView(LoginRequiredMixin, PermissionRequiredMixin, UpdateView):
    model = Class
    fields = ['number', 'course', 'semester', 'lecturer']
    template_name = 'attendance/../../templates/admin/class_form.html'
    success_url = reverse_lazy('class-list')
    permission_required = 'attendance.change_class'


class ClassDeleteView(LoginRequiredMixin, PermissionRequiredMixin, DeleteView):
    model = Class
    template_name = 'attendance/../../templates/admin/class_confirm_delete.html'
    success_url = reverse_lazy('class-list')
    permission_required = 'attendance.delete_class'


# Lecturer mgt.
class LecturerListView(LoginRequiredMixin, ListView):
    model = Lecturer
    template_name = 'attendance/../../templates/admin/lecturer_list.html'
    context_object_name = 'lecturers'


class LecturerCreateView(LoginRequiredMixin, PermissionRequiredMixin, CreateView):
    model = Lecturer
    fields = ['user', 'staff_id', 'DOB']
    template_name = 'attendance/../../templates/admin/lecturer_form.html'
    success_url = reverse_lazy('lecturer-list')
    permission_required = 'attendance.add_lecturer'


class LecturerUpdateView(LoginRequiredMixin, PermissionRequiredMixin, UpdateView):
    model = Lecturer
    fields = ['user', 'staff_id', 'DOB']
    template_name = 'attendance/../../templates/admin/lecturer_form.html'
    success_url = reverse_lazy('lecturer-list')
    permission_required = 'attendance.change_lecturer'


class LecturerDeleteView(LoginRequiredMixin, PermissionRequiredMixin, DeleteView):
    model = Lecturer
    template_name = 'attendance/../../templates/admin/lecturer_confirm_delete.html'
    success_url = reverse_lazy('lecturer-list')
    permission_required = 'attendance.delete_lecturer'


# Student mgt.
class StudentListView(LoginRequiredMixin, ListView):
    model = Student
    template_name = 'attendance/../../templates/admin/student_list.html'
    context_object_name = 'students'


class StudentCreateView(LoginRequiredMixin, PermissionRequiredMixin, CreateView):
    model = Student
    fields = ['user', 'student_id', 'DOB']
    template_name = 'attendance/../../templates/admin/student_form.html'
    success_url = reverse_lazy('student-list')
    permission_required = 'attendance.add_student'


class StudentUpdateView(LoginRequiredMixin, PermissionRequiredMixin, UpdateView):
    model = Student
    fields = ['user', 'student_id', 'DOB']
    template_name = 'attendance/../../templates/admin/student_form.html'
    success_url = reverse_lazy('student-list')
    permission_required = 'attendance.change_student'


class StudentDeleteView(LoginRequiredMixin, PermissionRequiredMixin, DeleteView):
    model = Student
    template_name = 'attendance/../../templates/admin/student_confirm_delete.html'
    success_url = reverse_lazy('student-list')
    permission_required = 'attendance.delete_student'
