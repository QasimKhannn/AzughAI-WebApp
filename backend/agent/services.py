"""
Service layer for managing agent-related operations.
Uses Django ORM directly for database operations.
"""
import json
from typing import List, Optional, Tuple
from django.db import transaction
from django.utils import timezone

from .models import (
    Thread, Response, Message, Tool, ToolCall, AgentVersion
)
from libs.agent.utils import recompose_thread_messages


class AgentService:
    """
    Service class for managing agent threads and messages.
    Enforces thread ownership on all operations.
    """

    def __init__(self, user):
        """
        Initialize the service with the authenticated user.

        Args:
            user: The authenticated Django user object
        """
        self.user = user
        self._default_agent_version = None

    def _get_default_agent_version(self) -> Optional[AgentVersion]:
        """
        Get and cache the default agent version.

        Returns:
            AgentVersion or None if not found
        """
        if self._default_agent_version is None:
            self._default_agent_version = (
                AgentVersion.objects.filter(agent__name="AzughAI")
                .order_by("-created_at")
                .first()
            )
        return self._default_agent_version

    def _get_onboarding_agent_version(self) -> Optional[AgentVersion]:
        """
        Get and cache the onboarding agent version.

        Returns:
            AgentVersion or None if not found
        """
        if self._default_agent_version is None:
            self._default_agent_version = (
                AgentVersion.objects.filter(agent__name="AzughOnboarding")
                .order_by("-created_at")
                .first()
            )
        return self._default_agent_version

    # ==================== Thread Operations ====================

    def get_user_threads(self) -> List[Thread]:
        """
        Retrieve all threads for the current user.

        Returns:
            QuerySet of Thread objects ordered by updated_at descending
        """
        return Thread.objects.filter(
            user=self.user,
        ).order_by('-updated_at')

    def get_thread(self, thread_id: str) -> Optional[Thread]:
        """
        Retrieve a specific thread with ownership verification.
        Prefetches related responses and messages for efficiency.

        Args:
            thread_id: The UUID of the thread

        Returns:
            Thread object or None if not found/not owned
        """
        try:
            return Thread.objects.prefetch_related(
                'responses',
                'messages__tool_call__tool',
                'agent_version__agent'
            ).get(id=thread_id, user=self.user)
        except Thread.DoesNotExist:
            return None

    def get_thread_messages(self, thread_id: str) -> Optional[List[Message]]:
        """
        Get all messages for a specific thread with tool call details.

        Args:
            thread_id: The UUID of the thread

        Returns:
            QuerySet of Message objects or None if thread not found
        """
        thread = self.get_thread(thread_id)
        if not thread:
            return None

        return thread.messages.select_related(
            'tool_call',
            'tool_call__tool',
            'response'
        ).order_by('created_at')

    def load_thread_messages_for_agent(self, thread_id: str) -> Tuple[Optional[Thread], List]:
        """
        Load thread messages and convert them to LangChain format for agent context.

        Args:
            thread_id: The UUID of the thread

        Returns:
            Tuple of (Thread, list of LangChain messages) or (None, []) if not found
        """
        thread = self.get_thread(thread_id)
        if not thread:
            return None, []

        messages = thread.messages.select_related(
            'tool_call',
            'tool_call__tool'
        ).order_by('created_at')

        langchain_messages = recompose_thread_messages(list(messages))
        return thread, langchain_messages

    def get_active_onboarding_thread(self, expiration_delta) -> Optional[Thread]:
        """
        Get the active onboarding thread for the user, if it exists.

        Args:
            expiration_delta: Time delta to determine thread expiration

        Returns:
            Active Thread object with is_onboarding=True or None if not found
        """
        cutoff = timezone.now() - expiration_delta
        return Thread.objects.filter(
            user=self.user,
            is_onboarding=True,
            updated_at__gte=cutoff
        ).order_by('-updated_at').first()

    def create_new_thread(self, title: str = None, is_onboarding: bool = False) -> Thread:
        """
        Create a new conversation thread for the current user.

        Args:
            title: Optional title for the thread
            is_onboarding: Flag to mark onboarding threads

        Returns:
            The created Thread object
        """
        if is_onboarding:
            agent_version = self._get_onboarding_agent_version()
        else:
            agent_version = self._get_default_agent_version()

        thread = Thread.objects.create(
            user=self.user,
            agent_version=agent_version,
            title=title or "New Conversation",
            is_onboarding=is_onboarding
        )
        return thread

    def delete_thread(self, thread_id: str) -> Tuple[bool, str]:
        """
        Delete a thread with ownership verification.

        Args:
            thread_id: The UUID of the thread to delete

        Returns:
            Tuple of (success: bool, message: str)
        """
        try:
            thread = Thread.objects.get(id=thread_id, user=self.user)
            thread.delete()
            return True, "Thread deleted successfully."
        except Thread.DoesNotExist:
            return False, "Thread not found."

    def update_thread_title(self, thread_id: str, title: str) -> Optional[Thread]:
        """
        Update the title of a thread.

        Args:
            thread_id: The UUID of the thread
            title: The new title

        Returns:
            Updated Thread object or None if not found
        """
        thread = self.get_thread(thread_id)
        if not thread:
            return None

        thread.title = title
        thread.save(update_fields=['title', 'updated_at'])
        return thread

    def generate_thread_title(self, thread_id: str, agent) -> Optional[str]:
        """
        Generate a title for the thread using the agent.

        Args:
            thread_id: The UUID of the thread
            agent: The GraphAgent instance

        Returns:
            Generated title string or None if thread not found
        """
        thread = self.get_thread(thread_id)
        if not thread:
            return None

        # Generate title using the agent
        title = agent.generate_thread_title(
            thread_id=str(thread.id),
            user_id=str(self.user.id),
            user_name=self._get_user_display_name()
        )

        # Update thread title in database
        thread.title = title
        thread.save(update_fields=['title', 'updated_at'])

        return title

    def generate_thread_summary(self, thread_id: str, agent) -> Optional[str]:
        """
        Generate a summary for the thread using the agent.

        Args:
            thread_id: The UUID of the thread
            agent: The GraphAgent instance

        Returns:
            Generated summary string or None if thread not found
        """
        thread = self.get_thread(thread_id)
        if not thread:
            return None

        # Generate summary using the agent
        summary = agent.generate_thread_summary(
            thread_id=str(thread.id),
            user_id=str(self.user.id),
            user_name=self._get_user_display_name()
        )

        # Update thread summary in database
        thread.summary = summary
        thread.save(update_fields=['summary', 'updated_at'])

        return summary

    def generate_onboarding_summary_with_keywords(self, thread_id: str, agent, structured_output) -> Optional[dict]:
        """
        Generate an engaging onboarding summary and extract keywords from it.

        Args:
            thread_id: The UUID of the thread
            agent: The GraphAgent instance
            structured_output: The Create instance for keyword extraction

        Returns:
            Dictionary with 'summary' and 'keywords' or None if thread not found
        """
        thread = self.get_thread(thread_id)
        if not thread:
            return None

        # Generate the onboarding summary using the agent
        summary = agent.generate_onboarding_summary(
            thread_id=str(thread.id),
            user_id=str(self.user.id),
            user_name=self._get_user_display_name()
        )

        # Extract keywords from the generated summary
        keywords = structured_output.extract_onboarding_keywords(summary)

        # Update thread summary in database
        thread.summary = summary
        thread.save(update_fields=['summary', 'updated_at'])

        return {
            'summary': summary,
            'keywords': keywords.model_dump()
        }

    # ==================== Response Operations ====================

    def add_empty_response_to_thread(self, thread: Thread) -> Response:
        """
        Add an empty response container to the thread.
        Used to group agent messages during streaming.

        Args:
            thread: The Thread object

        Returns:
            The created Response object
        """
        return Response.objects.create(thread=thread)

    # ==================== Message Operations ====================

    def add_message_to_thread(
        self,
        thread: Thread,
        content: str,
        sender: str = Message.Sender.USER,
        msg_type: str = Message.MsgType.TEXT,
        tool_call_name: str = None,
        tool_call_args: dict = None,
        add_to_last_response: bool = False
    ) -> Message:
        """
        Add a message to the thread.

        Args:
            thread: The Thread object
            content: Message content
            sender: Message sender (USER, AGENT, META)
            msg_type: Message type (TEXT, TOOL_CALL, META)
            tool_call_name: Name of the tool if msg_type is TOOL_CALL
            tool_call_args: Arguments for the tool call
            add_to_last_response: If True, add to last response; else create new response

        Returns:
            The created Message object
        """
        # Get or create response
        if add_to_last_response:
            response = thread.responses.last()
            if not response:
                response = Response.objects.create(thread=thread)
        else:
            response = Response.objects.create(thread=thread)

        # Calculate sequence number
        sequence = response.messages.count() + 1

        # Create the message
        message = Message.objects.create(
            thread=thread,
            response=response,
            sequence=sequence,
            sender=sender,
            msg_type=msg_type,
            content=content
        )

        # Create tool call if applicable
        if msg_type == Message.MsgType.TOOL_CALL and tool_call_name:
            try:
                tool = Tool.objects.get(name=tool_call_name)
                ToolCall.objects.create(
                    tool=tool,
                    arguments=tool_call_args or {},
                    message=message
                )
            except Tool.DoesNotExist:
                # Tool not found - log warning but don't fail
                print(
                    f"[AgentService] Warning: Tool '{tool_call_name}' not found in database")

        return message

    def update_last_tool_call(
        self,
        thread: Thread,
        tool_name: str,
        tool_output: str | dict = None
    ) -> bool:
        """
        Update the last tool call in the thread with the output.

        Args:
            thread: The Thread object
            tool_name: Name of the tool to update
            tool_output: The output/result of the tool execution

        Returns:
            True if update was successful, False otherwise
        """
        last_response = thread.responses.last()
        if not last_response:
            return False

        last_tool_message = last_response.messages.filter(
            msg_type=Message.MsgType.TOOL_CALL
        ).last()

        if not last_tool_message:
            return False

        try:
            tool_call = last_tool_message.tool_call
            if tool_call and tool_call.tool.name == tool_name:
                tool_call.result_data = tool_output or ""
                tool_call.save(update_fields=['result_data'])
                return True
        except ToolCall.DoesNotExist:
            pass

        return False

    # ==================== Helper Methods ====================

    def _get_user_display_name(self) -> str:
        """
        Get the display name for the current user.

        Returns:
            User's full name or username
        """
        if hasattr(self.user, 'first_name') and hasattr(self.user, 'last_name'):
            full_name = f"{self.user.first_name} {self.user.last_name}".strip()
            if full_name:
                return full_name
        return getattr(self.user, 'username', 'User')

    # ==================== Streaming Operations ====================

    def handle_stream_chunk(
        self,
        thread: Thread,
        current_agent_message: str,
        chunk: dict
    ) -> str:
        """
        Handle a streaming chunk from the agent and update the current agent message.
        Handles persistence (saving tool calls, updating tool results).

        Args:
            thread: The Thread object
            current_agent_message: Accumulated agent message so far
            chunk: The streaming chunk from the agent

        Returns:
            Updated current_agent_message string
        """
        chunk_type = chunk.get("type", "")

        if chunk_type == "token":
            # Accumulate token content in current message
            content = chunk.get("content", "")
            if content:
                current_agent_message += content

        elif chunk_type == "tool_start":
            # Create tool call message
            tool_name = chunk.get("tool", "")
            tool_input = chunk.get("input", {})

            self.add_message_to_thread(
                thread,
                content="",
                sender=Message.Sender.AGENT,
                msg_type=Message.MsgType.TOOL_CALL,
                tool_call_name=tool_name,
                tool_call_args=tool_input,
                add_to_last_response=True
            )

        elif chunk_type == "tool_end":
            # Update the last tool call with the output
            tool_name = chunk.get("tool", "")
            tool_output = chunk.get("output", "")

            # Parse output if JSON string
            if isinstance(tool_output, str):
                try:
                    tool_output = json.loads(tool_output)
                except (json.JSONDecodeError, TypeError):
                    pass

            self.update_last_tool_call(
                thread,
                tool_name=tool_name,
                tool_output=tool_output
            )

        return current_agent_message
