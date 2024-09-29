# attendance/views/student_views.py
from django.contrib import messages
from django.views.generic import ListView
from django.contrib.auth.mixins import LoginRequiredMixin
from attendance.models import Attendance


class StudentAttendanceView(LoginRequiredMixin, ListView):
    model = Attendance
    template_name = 'student/student_attendance.html'
    context_object_name = 'attendances'

    def get_queryset(self):
        # 현재 사용자가 속한 학생 객체를 가져옵니다.
        student = self.request.user.student

        # GET 파라미터로 전달된 클래스 ID를 가져옵니다.
        class_instance_id = self.request.GET.get('class')

        # 학생과 연결된 출석 데이터를 가져옵니다.
        queryset = Attendance.objects.filter(student=student)

        # 특정 수업으로 필터링합니다.
        if class_instance_id:
            queryset = queryset.filter(class_instance_id=class_instance_id)

        return queryset.select_related('class_instance')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['student'] = self.request.user.student
        context['title'] = 'My Attendance Records'
        context['selected_class'] = self.request.GET.get('class', '')
        return context
