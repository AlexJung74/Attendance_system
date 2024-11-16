# attendance/views/lecturer_views.py

from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import render
from django.views.generic import ListView

from attendance.models import Class


@login_required
def lecturer_dashboard(request):
    lecturer_classes = Class.objects.filter(lecturer__user=request.user)
    return render(request, 'lecturer/lecturer_dashboard.html', {'lecturer_classes': lecturer_classes})


class LecturerClassListView(LoginRequiredMixin, ListView):
    model = Class
    template_name = 'class_list.html'
    context_object_name = 'classes'

    def get_queryset(self):
        return Class.objects.filter(lecturer__user=self.request.user)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'My Lecture Classes'
        context['total_classes'] = context['classes'].count()
        return context
