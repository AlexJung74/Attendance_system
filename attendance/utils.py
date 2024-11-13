# attendance/views/utils.py

import logging

from django.contrib.auth import logout as auth_logout
from django.conf import settings
from django.contrib import messages
from django.core.mail import send_mail
from django.shortcuts import redirect
from django.db import connection, transaction

from attendance.models import Attendance

logger = logging.getLogger(__name__)


# 사용자 리디렉션
def redirect_to_dashboard(request, user):
    # 관리자일 경우 'admin_dashboard'로 리디렉션
    if user.is_superuser:
        return redirect('admin-dashboard')
    # 강사일 경우 'lecturer_dashboard'로 리디렉션
    elif user.groups.filter(name='Lecturers').exists():
        return redirect('lecturer-dashboard')
    # 학생일 경우 'student_dashboard'로 리디렉션
    elif user.groups.filter(name='Students').exists():
        return redirect('student-attendance')
    # 그 외의 경우 'home'으로 리디렉션
    else:
        messages.warning(request, "User is not assigned to any group.")
        return redirect('home')


# 개별 학생에게 경고 이메일 전송
def send_attendance_warning_email(student, attendance_rate):
    subject = f'Attendance Warning for {student.user.get_full_name()}'
    message = (
        f"Dear {student.user.first_name},\n\n"
        f"Your attendance rate is {attendance_rate}%. Please make sure to attend the classes."
    )
    send_mail(
        subject,
        message,
        settings.EMAIL_HOST_USER,
        [student.user.email],
        fail_silently=False,
    )


# 학생 정보 엑셀 업로드 (필요 시 활성화)
# def upload_students_from_excel(file):
#     df = pd.read_excel(file)
#     for _, row in df.iterrows():
#         user, _ = User.objects.get_or_create(
#             username=row['username'],
#             defaults={
#                 'first_name': row['first_name'],
#                 'last_name': row['last_name'],
#                 'email': row['email']
#             }
#         )
#         if _:
#             user.set_password('defaultpassword')
#             user.save()
#         Student.objects.get_or_create(
#             user=user,
#             student_id=row['student_id'],
#             DOB=row['DOB']
#         )
#         if 'group' in row:
#             group, _ = Group.objects.get_or_create(name=row['group'])
#             user.groups.add(group)


# 특정 수업의 출석률 계산
def calculate_attendance_rate(student, class_instance):
    total_classes = Attendance.objects.filter(class_instance=class_instance).values('date').distinct().count()
    if total_classes == 0:
        return 0
    attended_classes = Attendance.objects.filter(student=student, class_instance=class_instance, status='P').count()
    return round((attended_classes / total_classes) * 100)


# 출석 상태 업데이트
def update_attendance_status(request, students, class_instance, date):
    if request.method == 'POST':
        for student in students:
            # 상태 값의 첫 번째 문자를 대문자로 변환
            status = request.POST.get(f'status_{student.id}')
            if status:
                status = status.strip().upper()[0]  # 첫 글자를 대문자로 변환
                Attendance.objects.update_or_create(
                    student=student,
                    class_instance=class_instance,
                    date=date,  # 선택된 날짜의 출석을 업데이트
                    defaults={'status': status}
                )
        messages.success(request, 'Attendance has been updated successfully.')
        return True
    return False


# 출석 권한 확인
def has_permission_for_attendance(user, class_instance):
    groups = user.groups.all()
    # 관리자(superuser) 권한 확인
    if user.is_superuser:
        return True

    # 사용자가 강사 그룹에 속해 있는지 확인하고, 해당 수업의 강사인지 확인
    for group in groups:
        logger.info(f"Group ID: {group.id}, Group Name: {group.name}")
        if group.name == 'Lecturers':
            if class_instance.lecturer and class_instance.lecturer.user == user:
                logger.info(f"Lecturer Group ID: {group.id}, Group Name: {group.name}")
                return True
        # 사용자가 학생 그룹에 속해 있는지 확인하고, 해당 수업에 등록된 학생인지 확인
        if group.name == 'Students':
            if class_instance.students.filter(user=user).exists():
                return False
    # 그 외의 경우, 접근 권한 없음
    return False


def custom_logout(request):
    try:
        # 세션 사용을 멈추고, 응답 처리가 완료되기 전에 세션을 삭제하지 않도록 주의
        request.session.flush()  # 세션 초기화
        auth_logout(request)     # 로그아웃 처리
    except Exception as e:
        print(f"로그아웃 중 오류 발생: {e}")
    finally:
        # 연결 닫기
        try:
            connection.close()
        except Exception as e:
            print(f"데이터베이스 연결 종료 중 오류 발생: {e}")

    return redirect('login')  # 로그아웃 후 리디렉션할 URL
