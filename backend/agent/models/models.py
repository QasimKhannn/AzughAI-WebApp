import uuid

from django.db import models
from django.conf import settings


class Agent(models.Model):
    """
    Model representing an agent.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Agent"
        verbose_name_plural = "Agents"
        ordering = ['name']


class AgentVersion(models.Model):
    """
    Model representing a version of an agent.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    agent = models.ForeignKey(
        Agent, related_name='versions', on_delete=models.CASCADE)
    version_number = models.IntegerField()
    system_prompt = models.TextField(
        help_text="The base system prompt for this agent version",
        default="",
    )
    config = models.JSONField(
        blank=True,
        default=dict,
        help_text="Additional agent configuration (e.g. temperature, max_tokens)…"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.agent.name} - {self.version_number}"

    class Meta:
        verbose_name = "Agent Version"
        verbose_name_plural = "Agent Versions"
        ordering = ['-created_at']
        unique_together = ('agent', 'version_number')


class Thread(models.Model):
    """
    Model representing a thread of conversation.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    agent_version = models.ForeignKey(
        AgentVersion, related_name='threads', on_delete=models.CASCADE, help_text='Agent version used in this thread')
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name='threads', on_delete=models.CASCADE, help_text='User who initiated the thread')
    title = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        default="New Conversation",
        help_text='Optional title for the thread'
    )
    summary = models.TextField(
        blank=True,
        null=True,
        default="",
        help_text='Optional summary of the thread'
    )
    is_onboarding = models.BooleanField(
        default=False, help_text='Indicates if this thread is for onboarding purposes')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Thread {self.id}"

    class Meta:
        verbose_name = "Thread"
        verbose_name_plural = "Threads"
        ordering = ['-created_at']


class Response(models.Model):
    """
    Model representing a response from an agent in a thread.
    A response is composed of one or more messages.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    thread = models.ForeignKey(
        Thread, related_name='responses', on_delete=models.CASCADE, help_text='Thread this response belongs to')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Response {self.id}"

    class Meta:
        verbose_name = "Response"
        verbose_name_plural = "Responses"
        ordering = ['created_at']


class Message(models.Model):
    """
    Model representing a message in a thread.
    """
    class Sender(models.TextChoices):
        USER = 'user', 'User'
        AGENT = 'agent', 'Agent'
        META = 'meta', 'Meta'

    class MsgType(models.TextChoices):
        TEXT = 'text', 'Text'
        TOOL_CALL = "tool_call", 'Tool Call'
        META = "meta_prompt", 'Meta Prompt'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    thread = models.ForeignKey(
        Thread, related_name='messages', on_delete=models.CASCADE, help_text='Thread this message belongs to')
    response = models.ForeignKey(Response, null=True, blank=True,
                                 related_name='messages', on_delete=models.CASCADE, help_text='Response this message belongs to')
    sequence = models.IntegerField(null=True, blank=True,
                                   help_text='Sequence number of this message in the thread')
    sender = models.CharField(
        max_length=10,
        choices=Sender.choices,
        default=Sender.USER,
        help_text='Who sent this message'
    )
    msg_type = models.CharField(
        max_length=25,
        choices=MsgType.choices,
        default=MsgType.TEXT,
        help_text='Type of message'
    )
    content = models.TextField(
        blank=True,
        help_text='Content of the message'
    )
    target_msg = models.ForeignKey(
        'self',
        null=True,
        blank=True,
        related_name='meta_prompt',
        on_delete=models.CASCADE,
        help_text="Target message for meta prompt"
    )
    created_at = models.DateTimeField(
        auto_now_add=True, help_text='When the message was created')
    updated_at = models.DateTimeField(
        auto_now=True, help_text='When the message was last updated')

    def __str__(self):
        return f"Message {self.id}"

    class Meta:
        verbose_name = "Message"
        verbose_name_plural = "Messages"
        ordering = ['created_at']


class Tool(models.Model):
    """
    Model representing all available tools.
    """
    class ToolType(models.TextChoices):
        FUNCTION = 'function', 'Function'
        RAG = 'rag', 'RAG'
        WIDGET = 'widget', 'Widget'
        
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField()
    tool_type = models.CharField(
        max_length=25,
        choices=ToolType.choices,
        default=ToolType.FUNCTION,
        help_text='Type of tool'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Tool"
        verbose_name_plural = "Tools"
        ordering = ['name']
        unique_together = ('name',)


class ToolCall(models.Model):
    """
    Represents a widget invocation by the agent.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    message = models.OneToOneField(
        Message, on_delete=models.CASCADE, related_name="tool_call")
    tool = models.ForeignKey(Tool, on_delete=models.PROTECT)
    arguments = models.JSONField(default=dict)
    result_data = models.JSONField(null=True, blank=True)

    def __str__(self):
        return f"Tool Call {self.id}"

    class Meta:
        verbose_name = "Tool Call"
        verbose_name_plural = "Tool Calls"
        ordering = ['-message__created_at']
        unique_together = ('message', 'tool')


class WidgetInstance(models.Model):
    """
    Holds the current state of an interactive widget.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tool_call = models.OneToOneField(
        ToolCall, on_delete=models.CASCADE, related_name="widget_instance")
    # aggregated user inputs, button clicks
    state = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Widget Instance {self.id}"

    class Meta:
        verbose_name = "Widget Instance"
        verbose_name_plural = "Widget Instances"
        ordering = ['created_at']


class WidgetEvent(models.Model):
    """
    Logs each user interaction with a widget.
    """
    EVENT_TYPES = [
        ('input', 'Input change'),
        ('click', 'Button click'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    widget = models.ForeignKey(
        WidgetInstance, on_delete=models.CASCADE, related_name="events")
    event_type = models.CharField(max_length=10, choices=EVENT_TYPES)
    # e.g. {'field':'name','value':'Alice'}
    payload = models.JSONField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Widget Event {self.id}"
    
    class Meta:
        verbose_name = "Widget Event"
        verbose_name_plural = "Widget Events"
        ordering = ['-timestamp']