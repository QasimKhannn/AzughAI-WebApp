from rest_framework import serializers
from .models import *
from common.serializers import DynamicFieldsModelSerializer
# from users.serializers import UserSerializer


# ==================== Request Serializers ====================

class ChatRequestSerializer(serializers.Serializer):
    """
    Request serializer for chat/message endpoints.
    """
    message = serializers.CharField(
        max_length=10000,
        min_length=1,
        help_text="The user's message to send to the agent"
    )


class VoiceMessageRequestSerializer(serializers.Serializer):
    """
    Request serializer for saving a voice message.
    """
    content = serializers.CharField(
        max_length=50000,
        min_length=1,
        help_text="The transcribed voice message content"
    )
    sender = serializers.ChoiceField(
        choices=['user', 'agent'],
        help_text="Who sent the message: 'user' or 'agent'"
    )


class VoiceMessageResponseSerializer(serializers.Serializer):
    """
    Response serializer for voice message save confirmation.
    """
    success = serializers.BooleanField()
    message = serializers.CharField()


class RealtimeTokenResponseSerializer(serializers.Serializer):
    """
    Response serializer for realtime token generation.
    """
    clientSecret = serializers.CharField()
    expiresAt = serializers.IntegerField()
    sessionId = serializers.CharField()


# ==================== Response Serializers ====================

class ThreadDeleteResponseSerializer(serializers.Serializer):
    """
    Response serializer for thread deletion.
    """
    success = serializers.BooleanField()
    message = serializers.CharField()


class ThreadTitleGenerateResponseSerializer(serializers.Serializer):
    """
    Response serializer for thread title generation.
    """
    id = serializers.UUIDField()
    title = serializers.CharField()


class ThreadSummaryGenerateResponseSerializer(serializers.Serializer):
    """
    Response serializer for thread summary generation.
    """
    id = serializers.UUIDField()
    summary = serializers.CharField()


class OnboardingKeywordsSerializer(serializers.Serializer):
    """
    Serializer for onboarding keywords extracted from the summary.
    """
    city = serializers.CharField()
    gender = serializers.CharField()
    age_group = serializers.CharField()
    lifestyle_1 = serializers.CharField()
    lifestyle_2 = serializers.CharField()
    style_1 = serializers.CharField()
    style_2 = serializers.CharField()
    fit_1 = serializers.CharField()
    fit_2 = serializers.CharField()
    budget = serializers.CharField()


class OnboardingSummaryResponseSerializer(serializers.Serializer):
    """
    Response serializer for onboarding summary generation with keywords.
    """
    id = serializers.UUIDField()
    summary = serializers.CharField()
    keywords = OnboardingKeywordsSerializer()


# ==================== Model Serializers ====================

class AgentSerializer(DynamicFieldsModelSerializer):
    """
    Serializer for Agent model
    """

    class Meta:
        model = Agent
        fields = ('id', 'name', 'description', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')


class ToolSerializer(DynamicFieldsModelSerializer):
    """
    Serializer for Tool model
    """
    class Meta:
        model = Tool
        fields = ('id', 'name', 'description',
                  'tool_type', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')


class ToolCallSerializer(DynamicFieldsModelSerializer):
    """
    Serializer for ToolCall model
    """
    tool = serializers.SerializerMethodField()
    message = serializers.SerializerMethodField()
    tool_type = serializers.CharField(source='tool.tool_type', read_only=True)

    class Meta:
        model = ToolCall
        fields = ('id', 'message', 'tool', 'tool_type',
                  'arguments', 'result_data')
        read_only_fields = ('id',)

    def get_tool(self, obj):
        """
        Returns the tool name for the tool call
        """
        if obj.tool:
            return str(obj.tool.name)
        return None

    def get_message(self, obj):
        """
        Returns the message ID for the tool call
        """
        return str(obj.message.id) if obj.message else None


class AgentVersionSerializer(DynamicFieldsModelSerializer):
    """
    Serializer for AgentVersion model
    """
    agent = serializers.SerializerMethodField()

    class Meta:
        model = AgentVersion
        fields = ('id', 'agent', 'version_number', 'system_prompt',
                  'config', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')

    def get_agent(self, obj):
        """
        Returns the agent name for the version
        """
        if obj.agent:
            return AgentSerializer(obj.agent).data
        return None


class ResponseSerializer(DynamicFieldsModelSerializer):
    """
    Serializer for Response model
    """
    thread = serializers.SerializerMethodField()
    messages = serializers.SerializerMethodField()

    class Meta:
        model = Response
        fields = ('id', 'thread', 'created_at', 'messages')
        read_only_fields = ('id', 'created_at')

    def get_thread(self, obj):
        """
        Returns the thread ID for the response
        """
        return str(obj.thread.id) if obj.thread else None

    def get_messages(self, obj):
        """
        Returns the messages associated with the response
        """
        return MessageSerializer(obj.messages.all(), many=True, included_fields=['id', 'sequence', 'sender', 'msg_type', 'content', 'created_at', 'updated_at', 'target_msg', 'tool_call']).data if obj.messages.exists() else []


class MessageSerializer(DynamicFieldsModelSerializer):
    """
    Serializer for Message model
    """
    thread = serializers.SerializerMethodField()
    response = serializers.SerializerMethodField()
    target_msg = serializers.SerializerMethodField()
    tool_call = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = ('id', 'thread', 'response', 'sequence', 'sender', 'msg_type',
                  'content', 'created_at', 'updated_at', 'target_msg', 'tool_call')
        read_only_fields = ('id', 'created_at', 'updated_at')

    def get_target_msg(self, obj):
        """
        Returns the target message for the message
        """
        if obj.target_msg:
            return MessageSerializer(obj.target_msg).data
        return None

    def get_thread(self, obj):
        """
        Returns the thread ID for the message
        """
        return str(obj.thread.id) if obj.thread else None

    def get_response(self, obj):
        """
        Returns the response ID for the message
        """
        return str(obj.response.id) if obj.response else None

    def get_tool_call(self, obj):
        """
        Returns the tool call associated with the message
        """
        if hasattr(obj, 'tool_call') and obj.tool_call:
            return ToolCallSerializer(obj.tool_call, included_fields=["id", "tool", "tool_type", "arguments", "result_data"]).data
        return None


class ThreadSerializer(DynamicFieldsModelSerializer):
    """
    Serializer for Thread model
    """
    agent_version = AgentVersionSerializer(read_only=True)
    agent_version_id = serializers.PrimaryKeyRelatedField(
        queryset=AgentVersion.objects.all(),
        write_only=True,
        source='agent_version'
    )
    # user = serializers.SerializerMethodField()
    responses = serializers.SerializerMethodField()

    class Meta:
        model = Thread
        fields = ('id', 'agent_version', 'agent_version_id', 'user',
                  'title', 'summary', 'created_at', 'updated_at', 'responses', 'is_onboarding')
        read_only_fields = ('id', 'created_at', 'updated_at')

    # def get_user(self, obj):
    #     """
    #     Returns the user ID for the thread
    #     """
    #     if obj.user:
    #         return UserSerializer(obj.user, included_fields=['id', 'first_name', 'last_name', 'email']).data
    #     return None

    def get_responses(self, obj):
        """
        Returns the responses associated with the thread
        """
        return ResponseSerializer(obj.responses.all(), many=True, included_fields=['id', 'created_at', 'messages']).data if obj.responses.exists() else []
