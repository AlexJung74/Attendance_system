# admin_views.py

import logging

import pandas as pd
from django.contrib import messages
from django.contrib.auth.decorators import login_required, permission_required
from django.contrib.auth.mixins import LoginRequiredMixin, PermissionRequiredMixin
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.urls import reverse_lazy
from django.utils import timezone
from django.views.decorators.http import require_GET
from django.views.generic import ListView, CreateView, UpdateView, DeleteView, TemplateView, DetailView

from attendance.models import Semester, Course, Class, Lecturer, Student, Attendance, CollegeDay
from attendance.utils import (
    send_attendance_warning_email,
    calculate_attendance_rate,
    has_permission_for_attendance, update_attendance_status
)
from rest_framework.authentication import TokenAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions

logger = logging.getLogger('attendance')


# 관리자 대시보드 (클래스형 뷰) - TokenAuthentication 사용
class AdminDashboardView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # 필요 시 추가 데이터 구성
        lecturers = Lecturer.objects.all()
        courses = Course.objects.all()
        classes = Class.objects.all()
        semesters = Semester.objects.all()

        context = {
            'lecturers': lecturers,
            'courses': courses,
            'classes': classes,
            'semesters': semesters,
        }
        return JsonResponse(context)


# 학기 관리 뷰
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


# 강좌 관리 뷰
class CourseListView(LoginRequiredMixin, ListView):
    model = Course
    template_name = 'admin/course_list.html'
    context_object_name = 'courses'


class CourseCreateView(LoginRequiredMixin, PermissionRequiredMixin, CreateView):
    model = Course
    fields = ['code', 'name']
    template_name = 'admin/course_form.html'
    success_url = reverse_lazy('course-list')
    permission_required = 'attendance.add_course'


class CourseUpdateView(LoginRequiredMixin, PermissionRequiredMixin, UpdateView):
    model = Course
    fields = ['code', 'name']
    template_name = 'admin/course_form.html'
    success_url = reverse_lazy('course-list')
    permission_required = 'attendance.change_course'


class CourseDeleteView(LoginRequiredMixin, PermissionRequiredMixin, DeleteView):
    model = Course
    template_name = 'admin/course_confirm_delete.html'
    success_url = reverse_lazy('course-list')
    permission_required = 'attendance.delete_course'


# 수업 관리 뷰
class AdminClassListView(LoginRequiredMixin, PermissionRequiredMixin, ListView):
    model = Class
    template_name = 'class_list.html'  # 명확한 경로로 수정
    context_object_name = 'classes'
    permission_required = 'attendance.view_class'

    def get_queryset(self):
        # 모든 수업 목록을 반환합니다.
        return Class.objects.all()

    def get_context_data(self, **kwargs):
        """
        템플릿에 추가적인 context 데이터를 전달합니다.
        """
        context = super().get_context_data(**kwargs)
        # 예시: 추가적으로 다른 데이터를 context에 전달
        context['title'] = 'Dashboards Class List'
        context['total_classes'] = self.get_queryset().count()  # 전체 클래스 수를 추가
        return context


class ClassDetailView(DetailView):
    model = Class
    template_name = 'admin/../../templates/class_detail.html'
    context_object_name = 'class_detail'


class ClassCreateView(LoginRequiredMixin, PermissionRequiredMixin, CreateView):
    model = Class
    fields = ['number', 'course', 'semester', 'lecturer']
    template_name = 'admin/class_form.html'
    success_url = reverse_lazy('admin-class-list')
    permission_required = 'attendance.add_class'


class ClassUpdateView(LoginRequiredMixin, PermissionRequiredMixin, UpdateView):
    model = Class
    fields = ['number', 'course', 'semester', 'lecturer']
    template_name = 'admin/class_form.html'
    success_url = reverse_lazy('admin-class-list')
    permission_required = 'attendance.change_class'


class ClassDeleteView(LoginRequiredMixin, PermissionRequiredMixin, DeleteView):
    model = Class
    template_name = 'admin/class_confirm_delete.html'
    success_url = reverse_lazy('admin-class-list')
    permission_required = 'attendance.delete_class'


# Lecturer mgt.
class LecturerListView(LoginRequiredMixin, ListView):
    model = Lecturer
    template_name = 'admin/lecturer_list.html'
    context_object_name = 'lecturers'


class LecturerCreateView(LoginRequiredMixin, PermissionRequiredMixin, CreateView):
    model = Lecturer
    fields = ['user', 'staff_id', 'DOB']
    template_name = 'admin/lecturer_form.html'
    success_url = reverse_lazy('lecturer-list')
    permission_required = 'attendance.add_lecturer'


class LecturerUpdateView(LoginRequiredMixin, PermissionRequiredMixin, UpdateView):
    model = Lecturer
    fields = ['user', 'staff_id', 'DOB']
    template_name = 'admin/lecturer_form.html'
    success_url = reverse_lazy('lecturer-list')
    permission_required = 'attendance.change_lecturer'


class LecturerDeleteView(LoginRequiredMixin, PermissionRequiredMixin, DeleteView):
    model = Lecturer
    template_name = 'admin/lecturer_confirm_delete.html'
    success_url = reverse_lazy('lecturer-list')
    permission_required = 'attendance.delete_lecturer'


# 학생 관리 뷰
class StudentListView(LoginRequiredMixin, ListView):
    model = Student
    template_name = 'admin/student_list.html'
    context_object_name = 'students'


class StudentCreateView(LoginRequiredMixin, PermissionRequiredMixin, CreateView):
    model = Student
    fields = ['user', 'student_id', 'DOB']
    template_name = 'admin/student_form.html'
    success_url = reverse_lazy('student-list')
    permission_required = 'attendance.add_student'


class StudentUpdateView(LoginRequiredMixin, PermissionRequiredMixin, UpdateView):
    model = Student
    fields = ['user', 'student_id', 'DOB']
    template_name = 'admin/student_form.html'
    success_url = reverse_lazy('student-list')
    permission_required = 'attendance.change_student'


class StudentDeleteView(LoginRequiredMixin, PermissionRequiredMixin, DeleteView):
    model = Student
    template_name = 'admin/student_confirm_delete.html'
    success_url = reverse_lazy('student-list')
    permission_required = 'attendance.delete_student'


# Attendance Selection View (관리자 및 강사용)
@login_required
def select_attendance(request):
    # 학기, 강좌, 수업 정보 불러오기
    semesters = Semester.objects.all()
    courses = Course.objects.none()
    classes = Class.objects.none()

    selected_semester = request.GET.get('semester', None)
    selected_course = request.GET.get('course', None)
    selected_class = request.GET.get('class_number', None)

    logger.info("Request received at select_attendance view.")
    logger.info(f"Received Data - Semester: {selected_semester}, Course: {selected_course}, Class: {selected_class}")

    # 선택된 학기가 있을 경우 해당 학기에 속한 강좌를 필터링하여 가져옴
    if selected_semester:
        # 학기에 해당하는 코스만 필터링하여 courses에 할당
        courses = Course.objects.filter(classes__semester__id=selected_semester).distinct()
        logger.info(
            f"Filtered Courses for selected semester ({selected_semester}): {list(courses.values('id', 'name'))}")

    # 선택된 학기와 강좌가 있을 경우 해당 학기와 강좌에 속한 수업을 필터링하여 가져옴
    if selected_semester and selected_course:
        classes = Class.objects.filter(semester__id=selected_semester, course__id=selected_course).distinct()
        logger.info(
            f"Filtered Classes for selected course ({selected_course}) in semester ({selected_semester}): {list(classes.values('id', 'number'))}")

    # POST 요청이 있을 경우 선택된 클래스로 이동
    if request.method == 'POST':
        selected_class = request.POST.get('class_number')
        logger.info(f"POST Request - Selected Class: {selected_class}")

        if selected_class:
            logger.info(f"Redirecting to attendance-check view for class_instance_id: {selected_class}")
            return redirect('attendance-check', class_instance_id=selected_class)
        else:
            logger.warning("No class selected for attendance check.")
            messages.warning(request, "Please select a class to proceed.")

    # GET 요청이나 POST 요청 실패 시 컨텍스트 데이터와 함께 렌더링
    context = {
        'semesters': semesters,
        'courses': courses,
        'classes': classes,
        'selected_semester': selected_semester,
        'selected_course': selected_course,
        'selected_class': selected_class,
    }
    logger.info("Rendering select_attendance template with context data.")
    return render(request, 'select_attendance.html', context)


# Attendance Check View (관리자 및 강사용)
@login_required
def attendance_check(request, class_instance_id):
    class_instance = get_object_or_404(Class, pk=class_instance_id)

    # 권한 확인
    if not has_permission_for_attendance(request.user, class_instance):
        logger.info(f"jys request.user.groups: {request.user.groups}")
        logger.info(f"User: {request.user.username}, Groups: {[group.name for group in request.user.groups.all()]}")
        messages.error(request, 'You do not have permission to access this page.')
        return redirect('home')

    students = class_instance.students.all()
    today = timezone.now().date()
    attendance_threshold = 75

    # 해당 학기의 모든 수업 날짜를 가져옵니다.
    # CollegeDay 모델과 Class 모델의 관계를 활용하여 필터링
    college_days = CollegeDay.objects.filter(class_instance_id=class_instance.id).order_by('date')

    # 오늘 날짜에 가장 가까운 과거 날짜를 찾습니다.
    closest_past_date = college_days.filter(date__lte=today).last()
    selected_date = closest_past_date.date if closest_past_date else today

    # 사용자가 GET 요청으로 날짜를 선택했는지 확인
    if request.method == 'GET':
        date_param = request.GET.get('date', None)
        if date_param:
            try:
                selected_date = timezone.datetime.strptime(date_param, '%Y-%m-%d').date()
            except ValueError:
                selected_date = today

    # 선택된 날짜의 출석 데이터 가져오기 / 학생별 출석 데이터를 딕셔너리로 저장
    attendance_data = Attendance.objects.filter(class_instance=class_instance, date=selected_date).select_related(
        'student')
    student_attendance_dict = {att.student.id: att for att in attendance_data}

    # 총 수업 횟수 계산
    total_classes = Attendance.objects.filter(class_instance=class_instance, date__lte=selected_date).values(
        'date').distinct().count()

    # 학생 출석 정보를 구성
    students_with_attendance = []
    for student in students:
        attendance_record = student_attendance_dict.get(student.id)
        attended_classes = Attendance.objects.filter(
            student=student,
            class_instance=class_instance,
            status__in=['P', 'L', 'E'],
            date__lte=selected_date
        ).count()
        attendance_rate = (attended_classes / total_classes) * 100 if total_classes > 0 else 0
        students_with_attendance.append({
            'student': student,
            'status': attendance_record.status if attendance_record else 'P',
            'attendance_rate': attendance_rate,
            'send_warning': attendance_rate < attendance_threshold
        })

    # POST 요청 시 선택된 날짜의 출석 정보 업데이트
    if request.method == 'POST':
        if update_attendance_status(request, students, class_instance, selected_date):
            messages.success(request, "Attendance has been successfully updated.")
            return redirect('attendance-check', class_instance_id=class_instance.id)
        else:
            messages.error(request, "Failed to update attendance.")

    # GET 요청일 때는 페이지 렌더링
    context = {
        'class_instance': class_instance,
        'students_with_attendance': students_with_attendance,
        'college_days': college_days,
        'selected_date': selected_date,
        'today': today,
        'attendance_threshold': attendance_threshold,
    }
    return render(request, 'attendance_check.html', context)


# 출석 경고 이메일 발송
@login_required
def send_attendance_warning(request, class_instance_id, student_id):
    class_instance = get_object_or_404(Class, pk=class_instance_id)
    student = get_object_or_404(Student, pk=student_id)

    # 관리자가 아니고 해당 수업의 강사가 아닌 경우 접근 제한
    if not request.user.is_superuser and request.user != class_instance.lecturer.user:
        messages.error(request, 'You do not have permission to access this page.')
        return redirect('admin-class-list')

    # 출석 경고 이메일을 보냅니다.
    attendance_rate = calculate_attendance_rate(student, class_instance)
    send_attendance_warning_email(student, attendance_rate)

    messages.success(request, f'Warning email sent to {student.user.get_full_name} successfully.')
    return redirect('admin-class-list')


# 학생 정보 엑셀 업로드
@login_required
@permission_required('attendance.add_student', raise_exception=True)
def upload_students_excel(request):
    if request.method == 'POST' and request.FILES.get('student_file'):
        excel_file = request.FILES['student_file']
        try:
            df = pd.read_excel(excel_file)
            required_columns = {'username', 'email', 'student_id', 'DOB'}
            if not required_columns.issubset(df.columns):
                missing_cols = required_columns - set(df.columns)
                messages.error(request, f"Missing required columns: {', '.join(missing_cols)}")
                return redirect('upload-students-excel')

            users_bulk_create = []
            students_bulk_create = []
            for _, row in df.iterrows():
                user = User(
                    username=row['username'],
                    email=row['email'],
                    first_name=row.get('first_name', ''),
                    last_name=row.get('last_name', ''),
                )
                users_bulk_create.append(user)

            User.objects.bulk_create(users_bulk_create, ignore_conflicts=True)

            for user in User.objects.filter(username__in=df['username']):
                student_row = df[df['username'] == user.username].iloc[0]
                student = Student(
                    user=user,
                    student_id=student_row['student_id'],
                    DOB=student_row['DOB']
                )
                students_bulk_create.append(student)

            Student.objects.bulk_create(students_bulk_create, ignore_conflicts=True)
            messages.success(request, "Student information has been successfully uploaded.")
            return redirect('student-list')
        except Exception as e:
            messages.error(request, f"An error occurred while processing the Excel file: {str(e)}")
            return redirect('upload-students-excel')
    else:
        messages.error(request, "Please select an Excel file to upload.")
        return render(request, 'admin/upload_students_excel.html')


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_courses(request, semester_id):
    logger.info(f"get_courses called with semester_id: {semester_id}")
    try:
        semester = Semester.objects.get(id=semester_id)
    except Semester.DoesNotExist:
        return JsonResponse({'error': 'Invalid semester ID'}, status=400)

    courses = list(Course.objects.filter(classes__semester=semester).distinct().values('id', 'name'))
    return JsonResponse({'courses': courses})


@require_GET
def get_classes(request, semester_id, course_id):
    logger.info(f"get_classes called with semester_id: {semester_id}, course_id: {course_id}")
    try:
        semester = Semester.objects.get(id=semester_id)
    except Semester.DoesNotExist:
        logger.warning(f"Semester ID {semester_id} does not exist.")
        return JsonResponse({'error': 'Invalid semester ID'}, status=400)

    try:
        course = Course.objects.get(id=course_id)
    except Course.DoesNotExist:
        logger.warning(f"Course ID {course_id} does not exist.")
        return JsonResponse({'error': 'Invalid course ID'}, status=400)

    classes = list(Class.objects.filter(course=course, semester=semester).values('id', 'number'))
    logger.info(f"Classes found: {classes}")

    if not classes:
        return JsonResponse({'classes': [], 'message': 'No classes found for this course in the given semester.'})

    return JsonResponse({'classes': classes})


