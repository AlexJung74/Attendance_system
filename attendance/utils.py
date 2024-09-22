# utils.py
from django.contrib import messages
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth.models import Group
import pandas as pd
from django.utils import timezone
from django.shortcuts import redirect

from attendance.models import Student, Attendance


def send_attendance_warning_email(student, attendance_rate):
    subject = f'Attendance Warning for {student.user.first_name} {student.user.last_name}'
    message = (f"Dear {student.user.first_name},\n\nYour attendance rate is {attendance_rate}%. Please make sure to "
               f"attend the classes.")
    send_mail(
        subject,
        message,
        settings.EMAIL_HOST_USER,
        [student.user.email]
    )


def send_bulk_attendance_warning_emails(students_with_issues):
    """
    여러 학생에게 출석 경고 이메일을 일괄 전송합니다.
    :param students_with_issues: 출석 문제가 있는 학생들의 쿼리셋
    """
    for student in students_with_issues:
        attendance_rate = calculate_attendance_rate(student, student.attendances.first().class_instance)
        send_attendance_warning_email(student, attendance_rate)


def get_user_dashboard_url(user):
    """
    사용자 권한에 따라 대시보드 URL을 반환합니다.
    :param user: User 객체
    :return: 대시보드 URL 문자열
    """
    if user.is_superuser:
        return 'admin-dashboard'
    elif user.groups.filter(name='Lecturer').exists():
        return 'lecturer-dashboard'
    elif user.groups.filter(name='Student').exists():
        return 'student-attendance'
    else:
        return 'home'


def upload_students_from_excel(file):
    """
    엑셀 파일을 통해 학생 정보를 일괄 업로드합니다.
    :param file: 업로드된 엑셀 파일
    :return: None
    """
    df = pd.read_excel(file)

    for _, row in df.iterrows():
        user, _ = User.objects.get_or_create(
            username=row['username'],
            defaults={
                'first_name': row['first_name'],
                'last_name': row['last_name'],
                'email': row['email']
            }
        )
        if _:
            user.set_password('defaultpassword')  # 기본 비밀번호 설정 (필요시 수정)
            user.save()

        Student.objects.get_or_create(
            user=user,
            student_id=row['student_id'],
            DOB=row['DOB']
        )

        if 'group' in row:
            group, _ = Group.objects.get_or_create(name=row['group'])
            user.groups.add(group)


# utils.py 파일에 정의
def calculate_attendance_rate(student, class_instance):
    """
    학생의 특정 수업에 대한 출석률을 계산합니다.
    :param student: Student 객체
    :param class_instance: Class 객체
    :return: 출석률 (0~100 사이의 정수)
    """
    total_classes = Attendance.objects.filter(student=student, class_instance=class_instance).count()

    if total_classes == 0:
        return 0  # 출석 기록이 없을 경우 0% 반환

    attended_classes = Attendance.objects.filter(student=student, class_instance=class_instance, status='P').count()

    attendance_rate = (attended_classes / total_classes) * 100
    return round(attendance_rate)


def update_attendance_status(request, students, class_instance):
    today = timezone.now().date()

    if request.method == 'POST':
        for student in students:
            status = request.POST.get(f'status_{student.id}')
            if status:
                Attendance.objects.update_or_create(
                    student=student,
                    class_instance=class_instance,
                    date=today,
                    defaults={'status': status}
                )
        messages.success(request, 'Attendance has been updated successfully.')
        return True
    return False


def redirect_user_based_on_role(user):
    """
    사용자 권한에 따라 리디렉션할 페이지를 결정합니다.
    """
    if user.is_superuser:
        return redirect('admin-dashboard')
    elif user.groups.filter(name='Lecturer').exists():
        return redirect('lecturer-dashboard')
    elif user.groups.filter(name='Student').exists():
        return redirect('student-attendance')
    else:
        return redirect('home')


def has_permission_for_attendance(user, class_instance):
    """
    사용자(user)가 해당 수업(class_instance)에 대한 출석을 확인할 권한이 있는지 확인합니다.
    관리자 또는 해당 수업의 강사일 경우 True를 반환합니다.
    """
    return user.is_superuser or user == class_instance.lecturer.user


# attendance/utils.py
def update_attendance_records(request, students, class_instance, date):
    """
    POST 요청으로 받은 출석 데이터를 이용하여 출석 기록을 업데이트합니다.
    """
    for student in students:
        status = request.POST.get(f'status_{student.id}')
        if status:
            Attendance.objects.update_or_create(
                student=student,
                class_instance=class_instance,
                date=date,
                defaults={'status': status}
            )


# attendance/utils.py
def redirect_to_dashboard(user):
    """
    사용자의 권한에 따라 해당 대시보드로 리디렉션합니다.
    """
    if user.is_superuser:
        return redirect('admin-dashboard')
    elif user.groups.filter(name='Lecturer').exists():
        return redirect('lecturer-dashboard')
    elif user.groups.filter(name='Student').exists():
        return redirect('student-attendance')
    else:
        return redirect('home')
