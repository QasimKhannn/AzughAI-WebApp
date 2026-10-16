from django.contrib import admin
from django_celery_beat.models import PeriodicTask, PeriodicTasks, IntervalSchedule, CrontabSchedule, SolarSchedule, ClockedSchedule

# Register all Celery Beat models in the Django admin panel
admin.site.register(PeriodicTask)     # Main table storing periodic tasks
admin.site.register(IntervalSchedule)  # Defines interval-based task schedules
admin.site.register(CrontabSchedule)  # Defines cron-based task schedules
admin.site.register(SolarSchedule)    # Defines solar event-based schedules
admin.site.register(ClockedSchedule)  # Defines one-time execution schedules
# Internal table tracking last schedule update
admin.site.register(PeriodicTasks)
