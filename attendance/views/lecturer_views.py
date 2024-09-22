import pandas as pd
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import HttpResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.views.generic import ListView
from ..models import Class, Attendance


# 헬퍼 함수: 현재 사용자에게 할당된 수업 리스트 반환
def get_lecturer_classes(user):
    return Class.objects.filter(lecturer__user=user)


# 강사 대시보드
@login_required
def lecturer_dashboard(request):
    classes = get_lecturer_classes(request.user)
    return render(request, 'attendance/../../templates/lecturer/lecturer_dashboard.html', {'classes': classes})


# 강사 클래스 리스트 보기 (함수형 뷰)
@login_required
def class_list_lecturer(request):
    classes = get_lecturer_classes(request.user)
    context = {
        'classes': classes,
        'title': 'My Classes'
    }
    return render(request, 'attendance/../../templates/lecturer/class_list.html', context)


# 강사 클래스 리스트 보기 (클래스형 뷰)
class LecturerClassListView(LoginRequiredMixin, ListView):
    model = Class
    template_name = 'attendance/../../templates/lecturer/class_list.html'
    context_object_name = 'classes'

    def get_queryset(self):
        return get_lecturer_classes(self.request.user)
