from django.contrib import admin
from .models import *


class AgentAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'created_at', 'updated_at')
    search_fields = ('name',)
    ordering = ('-created_at',)
    date_hierarchy = 'created_at'


admin.site.register(Agent, AgentAdmin)


class AgentVersionAdmin(admin.ModelAdmin):
    list_display = ('id', 'agent', 'version_number',
                    'created_at', 'updated_at')
    search_fields = ('agent__name',)
    fieldsets = (
        ('Agent Details', {
            'fields': ('agent', 'version_number', 'system_prompt', 'config'),
            'classes': ('wide',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    ordering = ('-created_at',)
    date_hierarchy = 'created_at'
    raw_id_fields = ('agent',)
    readonly_fields = ('created_at', 'updated_at')


admin.site.register(AgentVersion, AgentVersionAdmin)


class ThreadAdmin(admin.ModelAdmin):
    list_display = ('id', 'agent_version', 'user', 'title', 'created_at', 'is_onboarding')
    search_fields = ('agent_version__agent__name', 'user__email')
    fieldsets = (
        ('Thread Details', {
            'fields': ('agent_version', 'user', 'title', 'summary', 'is_onboarding'),
            'classes': ('wide',)
        }),
        ('Timestamps', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
    ordering = ('-created_at',)
    date_hierarchy = 'created_at'
    readonly_fields = ('created_at',)


admin.site.register(Thread, ThreadAdmin)


class ResponseAdmin(admin.ModelAdmin):
    list_display = ('id', 'thread', 'created_at')
    search_fields = ('thread__id',)
    fieldsets = (
        ('Response Details', {
            'fields': ('thread',),
            'classes': ('wide',)
        }),
        ('Timestamps', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
    ordering = ('-created_at',)
    date_hierarchy = 'created_at'
    readonly_fields = ('created_at',)


admin.site.register(Response, ResponseAdmin)


class MessageAdmin(admin.ModelAdmin):
    list_display = ('id', 'thread', 'sender', 'msg_type', 'created_at', 'content')
    search_fields = ('thread__id', 'sender')
    list_filter = ('sender', 'msg_type')
    fieldsets = (
        ('Message Details', {
            'fields': ('thread', 'sender', 'msg_type', 'target_msg', 'response', 'sequence'),
            'classes': ('wide',)
        }),
        ('Message Content', {
            'fields': ('content',),
            'classes': ('wide',)
        }),
        ('Timestamps', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
    ordering = ('-created_at',)
    readonly_fields = ('created_at',)


admin.site.register(Message, MessageAdmin)


class ToolAdmin(admin.ModelAdmin):
    list_display = ('name', 'tool_type', 'created_at', 'updated_at')
    search_fields = ('name', 'description')
    list_filter = ('tool_type',)
    fieldsets = (
        ('Tool Details', {
            'fields': ('name', 'description', 'tool_type'),
            'classes': ('wide',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    ordering = ('name',)
    readonly_fields = ('created_at', 'updated_at')


admin.site.register(Tool, ToolAdmin)


class ToolCallAdmin(admin.ModelAdmin):
    list_display = ('id', 'tool', 'message', 'get_created_at')
    search_fields = ('tool__name', 'message__thread__id')
    list_filter = ('tool__tool_type',)
    fieldsets = (
        ('Tool Call Details', {
            'fields': ('message', 'tool'),
            'classes': ('wide',)
        }),
        ('Data', {
            'fields': ('arguments', 'result_data'),
            'classes': ('wide',)
        }),
    )
    ordering = ('-message__created_at',)
    raw_id_fields = ('message', 'tool')

    def get_created_at(self, obj):
        return obj.message.created_at
    get_created_at.short_description = 'Created At'
    get_created_at.admin_order_field = 'message__created_at'


admin.site.register(ToolCall, ToolCallAdmin)


class WidgetInstanceAdmin(admin.ModelAdmin):
    list_display = ('id', 'get_tool_name', 'created_at', 'updated_at')
    search_fields = ('tool_call__tool__name', 'id')
    fieldsets = (
        ('Widget Details', {
            'fields': ('tool_call', 'state'),
            'classes': ('wide',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    ordering = ('-created_at',)
    raw_id_fields = ('tool_call',)
    readonly_fields = ('created_at', 'updated_at')

    def get_tool_name(self, obj):
        return obj.tool_call.tool.name
    get_tool_name.short_description = 'Tool'
    get_tool_name.admin_order_field = 'tool_call__tool__name'


admin.site.register(WidgetInstance, WidgetInstanceAdmin)


class WidgetEventAdmin(admin.ModelAdmin):
    list_display = ('id', 'get_widget_id', 'event_type', 'timestamp')
    search_fields = ('widget__id', 'event_type')
    list_filter = ('event_type',)
    fieldsets = (
        ('Event Details', {
            'fields': ('widget', 'event_type', 'payload'),
            'classes': ('wide',)
        }),
        ('Timestamps', {
            'fields': ('timestamp',),
            'classes': ('collapse',)
        }),
    )
    ordering = ('-timestamp',)
    raw_id_fields = ('widget',)
    readonly_fields = ('timestamp',)

    def get_widget_id(self, obj):
        return obj.widget.id
    get_widget_id.short_description = 'Widget ID'
    get_widget_id.admin_order_field = 'widget__id'


admin.site.register(WidgetEvent, WidgetEventAdmin)

