# attendance/views/models.py

from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import ClassStudent, Attendance, CollegeDay
import logging

logger = logging.getLogger('attendance')


@receiver(post_save, sender=ClassStudent)
def create_attendance_records(sender, instance, created, **kwargs):
    if created:
        try:
            class_instance = instance.class_instance
            student = instance.student
            college_days = CollegeDay.objects.filter(class_instance=class_instance)
            attendance_records = [
                Attendance(student=student, class_instance=class_instance, date=day.date, status='D')
                for day in college_days
            ]
            Attendance.objects.bulk_create(attendance_records)
            logger.info(f"Created attendance records for {student} in {class_instance}")
        except Exception as e:
            logger.error(f"Error creating attendance records for {instance}: {e}")
