"""
Agent API Views for managing threads and chat interactions.
"""
import json
import queue
import asyncio
import threading
import httpx
import logging

from django.http import StreamingHttpResponse
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.conf import settings
from drf_spectacular.utils import extend_schema
from django.utils import timezone
from datetime import timedelta

from common.views import APIViewTokenRefresh
from .models import Thread, Message, Tool, ToolCall, Response as ResponseModel
from .serializers import (
    ThreadSerializer,
    MessageSerializer,
    ResponseSerializer,
    ChatRequestSerializer,
    ThreadDeleteResponseSerializer,
    ThreadTitleGenerateResponseSerializer,
    ThreadSummaryGenerateResponseSerializer,
    OnboardingSummaryResponseSerializer,
    VoiceMessageRequestSerializer,
    VoiceMessageResponseSerializer,
    RealtimeTokenResponseSerializer,
)
from .services import AgentService
from .agent_instance import get_graph_agent
from libs.agent import Create
from libs.agent.utils import add_chunk_delimiters
from .prompts.azugh import AZUGH_VOICE_SYSTEM_PROMPT
from .prompts.onboarding import AZUGH_VOICE_ONBOARDING_SYSTEM_PROMPT
from .utils import compose_user_profile_prompt


ONBORAIDNG_THREAD_EXPIRATION = timedelta(days=7)


def _format_onboarding_title(now=None) -> str:
    now = now or timezone.now()
    day = now.day
    suffix = "th" if 11 <= day <= 13 else {
        1: "st", 2: "nd", 3: "rd"}.get(day % 10, "th")
    time_str = now.strftime("%I:%M%p").lstrip("0").lower()
    return f"Onboarding {day}{suffix} {now.strftime('%B %Y')} {time_str}"


class ThreadsView(APIViewTokenRefresh):
    """
    API endpoint to manage threads for the agent.
    GET: List all threads for the authenticated user.
    POST: Create a new thread.
    """
    serializer_class = ThreadSerializer

    @extend_schema(
        responses={200: ThreadSerializer(many=True)},
        description="Get the list of threads for the authenticated user"
    )
    def get(self, request):
        """
        Get the list of threads for the authenticated user.
        """
        service = AgentService(request.user)
        threads = service.get_user_threads()
        serializer = ThreadSerializer(
            threads,
            many=True,
            included_fields=['id', 'title', 'created_at',
                             'updated_at', 'summary', 'is_onboarding']
        )
        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(
        request=ThreadSerializer,
        responses={201: ThreadSerializer},
        description="Create a new thread for the authenticated user"
    )
    def post(self, request):
        """
        Create a new thread for the authenticated user.
        """
        service = AgentService(request.user)
        title = request.data.get('title', None)

        thread = service.create_new_thread(title=title)

        response_serializer = ThreadSerializer(
            thread,
            included_fields=['id', 'title',
                             'created_at', 'updated_at', 'responses']
        )
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)


class OnboardingThreadView(APIViewTokenRefresh):
    """
    GET: Return the existing active onboarding thread or create a new one.
    """
    serializer_class = ThreadSerializer

    @extend_schema(
        responses={200: ThreadSerializer},
        description="Get or create the current onboarding thread (expires after 7 days)"
    )
    def get(self, request):
        service = AgentService(request.user)
        thread = service.get_active_onboarding_thread(
            ONBORAIDNG_THREAD_EXPIRATION)

        if not thread:
            title = _format_onboarding_title()
            thread = service.create_new_thread(title=title, is_onboarding=True)

        serializer = ThreadSerializer(
            thread,
            included_fields=['id', 'title', 'created_at',
                             'updated_at', 'summary', 'responses']
        )
        return Response(serializer.data, status=status.HTTP_200_OK)


class ThreadView(APIViewTokenRefresh):
    """
    API endpoint to manage a specific thread.
    GET: Get thread details.
    DELETE: Delete a thread.
    """

    @extend_schema(
        responses={200: ThreadSerializer},
        description="Get details of a specific thread"
    )
    def get(self, request, thread_id):
        """
        Get details of a specific thread.
        """
        service = AgentService(request.user)
        thread = service.get_thread(thread_id)

        if not thread:
            return Response(
                {"error": "Thread not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = ThreadSerializer(
            thread,
            included_fields=['id', 'title', 'created_at',
                             'updated_at', 'responses', 'summary', 'is_onboarding']
        )
        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(
        responses={200: ThreadDeleteResponseSerializer},
        description="Delete a specific thread"
    )
    def delete(self, request, thread_id):
        """
        Delete a specific thread.
        """
        service = AgentService(request.user)
        success, message = service.delete_thread(thread_id)

        if not success:
            return Response(
                {"success": False, "message": message},
                status=status.HTTP_404_NOT_FOUND
            )

        return Response(
            {"success": True, "message": message},
            status=status.HTTP_200_OK
        )


class ThreadMessagesView(APIViewTokenRefresh):
    """
    API endpoint to get messages for a specific thread.
    GET: Get all messages for a thread.
    """

    @extend_schema(
        responses={200: MessageSerializer(many=True)},
        description="Get all messages for a specific thread"
    )
    def get(self, request, thread_id):
        """
        Get all messages for a specific thread.
        """
        service = AgentService(request.user)
        messages = service.get_thread_messages(thread_id)

        if messages is None:
            return Response(
                {"error": "Thread not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = MessageSerializer(
            messages,
            many=True,
            included_fields=[
                'id', 'sequence', 'sender', 'msg_type', 'content',
                'created_at', 'updated_at', 'tool_call'
            ]
        )
        return Response({
            "id": thread_id,
            "messages": serializer.data
        }, status=status.HTTP_200_OK)


class ThreadTitleGenerateView(APIViewTokenRefresh):
    """
    API endpoint to generate a title for a thread based on its content.
    POST: Generate and update thread title.
    """

    @extend_schema(
        responses={200: ThreadTitleGenerateResponseSerializer},
        description="Generate a title for a thread based on its conversation content"
    )
    def post(self, request, thread_id):
        """
        Generate a title for the thread using the agent.
        """
        service = AgentService(request.user)

        # Load thread messages into agent memory
        thread, langchain_messages = service.load_thread_messages_for_agent(
            thread_id)

        if not thread:
            return Response(
                {"error": "Thread not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        # # check if thread is onboarding is onbaording
        # if thread.is_onboarding:
        #     return Response(
        #         {"error": "Cannot generate title for onboarding threads."},
        #         status=status.HTTP_400_BAD_REQUEST
        #     )

        # Get agent and upload thread context
        agent = get_graph_agent(
            system_prompt=thread.agent_version.system_prompt,
            tool_set=thread.agent_version.config["tools"]
            if thread.agent_version and "tools" in thread.agent_version.config
            else [],
            user=request.user
        )
        agent.upload_thread(
            thread_id=str(thread.id),
            messages=langchain_messages
        )

        # Generate title
        title = service.generate_thread_title(thread_id, agent)

        return Response({
            "id": str(thread.id),
            "title": title
        }, status=status.HTTP_200_OK)


class ThreadSummaryGenerateView(APIViewTokenRefresh):
    """
    API endpoint to generate a summary for a thread based on its content.
    POST: Generate and update thread summary.
    """

    @extend_schema(
        responses={200: ThreadSummaryGenerateResponseSerializer},
        description="Generate a summary for a thread based on its conversation content"
    )
    def post(self, request, thread_id):
        """
        Generate a summary for the thread using the agent.
        """
        service = AgentService(request.user)

        # Load thread messages into agent memory
        thread, langchain_messages = service.load_thread_messages_for_agent(
            thread_id)

        if not thread:
            return Response(
                {"error": "Thread not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Get agent and upload thread context
        agent = get_graph_agent(
            system_prompt=thread.agent_version.system_prompt,
            tool_set=thread.agent_version.config["tools"]
            if thread.agent_version and "tools" in thread.agent_version.config
            else [],
            user=request.user
        )
        agent.upload_thread(
            thread_id=str(thread.id),
            messages=langchain_messages
        )

        # Generate summary
        summary = service.generate_thread_summary(thread_id, agent)

        return Response({
            "id": str(thread.id),
            "summary": summary
        }, status=status.HTTP_200_OK)


class OnboardingSummaryGenerateView(APIViewTokenRefresh):
    """
    API endpoint to generate an engaging onboarding summary with keywords.
    POST: Generate personalized style profile summary and extract keywords.
    """

    @extend_schema(
        responses={200: OnboardingSummaryResponseSerializer},
        description="Generate an engaging onboarding summary with style keywords"
    )
    def post(self, request, thread_id):
        """
        Generate an onboarding summary and extract keywords for the thread.
        """
        service = AgentService(request.user)

        # Load thread messages into agent memory
        thread, langchain_messages = service.load_thread_messages_for_agent(
            thread_id)

        if not thread:
            return Response(
                {"error": "Thread not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Get agent and upload thread context
        agent = get_graph_agent(
            system_prompt=thread.agent_version.system_prompt,
            tool_set=thread.agent_version.config["tools"]
            if thread.agent_version and "tools" in thread.agent_version.config
            else [],
            user=request.user
        )
        agent.upload_thread(
            thread_id=str(thread.id),
            messages=langchain_messages
        )

        # Create structured output instance for keyword extraction
        structured_output = Create()

        # Generate summary with keywords
        result = service.generate_onboarding_summary_with_keywords(
            thread_id, agent, structured_output
        )

        if not result:
            return Response(
                {"error": "Failed to generate summary."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        return Response({
            "id": str(thread.id),
            "summary": result['summary'],
            "keywords": result['keywords']
        }, status=status.HTTP_200_OK)


class ThreadChatView(APIViewTokenRefresh):
    """
    API endpoint for streaming chat responses from the agent.
    POST: Send a message and receive streaming response.
    """
    serializer_class = ChatRequestSerializer

    def run_async_generator_in_thread(self, async_gen):
        """
        Run async generator in a separate thread with its own event loop.
        """
        def run_in_thread():
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)

            try:
                while True:
                    try:
                        event = loop.run_until_complete(async_gen.__anext__())
                        self.event_queue.put(event)
                    except StopAsyncIteration:
                        break
            except Exception as e:
                if getattr(settings, 'TESTING', False):
                    raise e
                self.event_queue.put({"type": "ERROR", "message": str(e)})
            finally:
                self.event_queue.put({"type": "STREAM_END"})
                loop.close()

        thread = threading.Thread(target=run_in_thread)
        thread.daemon = True
        thread.start()

    @extend_schema(
        request=ChatRequestSerializer,
        responses={200: {'description': 'Streaming response'}},
        description="Send a message to the AI agent and get a streaming response"
    )
    def post(self, request, thread_id):
        """
        Process a message sent to the agent and return a streaming response.
        """
        user = request.user
        service = AgentService(user)

        # Validate request data
        serializer = ChatRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Get thread with ownership check
        thread = service.get_thread(thread_id)
        if not thread:
            return Response(
                {"error": "Thread not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Load thread messages for agent context
        _, langchain_messages = service.load_thread_messages_for_agent(
            thread_id)

        # Get agent and upload thread context
        agent = get_graph_agent(
            system_prompt=thread.agent_version.system_prompt,
            tool_set=thread.agent_version.config["tools"]
            if thread.agent_version and "tools" in thread.agent_version.config
            else [],
            user=user
        )
        agent.upload_thread(
            thread_id=str(thread.id),
            messages=langchain_messages
        )

        prompt = serializer.validated_data['message']

        # Add user message to thread
        service.add_message_to_thread(
            thread,
            content=prompt,
            sender=Message.Sender.USER,
            msg_type=Message.MsgType.TEXT,
            add_to_last_response=False
        )

        # Create empty response to hold agent messages
        service.add_empty_response_to_thread(thread)

        try:
            self.event_queue = queue.Queue()

            # Get the async generator from the agent
            async_gen = agent.ask_stream(
                thread_id=str(thread.id),
                user_id=str(user.id),
                user_name=service._get_user_display_name(),
                user_prompt=prompt,
            )

            # Start the async generator in a separate thread
            self.run_async_generator_in_thread(async_gen)

            def event_stream():
                """
                Synchronous generator that reads from the queue populated by the async generator.
                Yields JSON-formatted chunks matching FastAPI format.
                """
                current_agent_message = ""

                try:
                    while True:
                        try:
                            event = self.event_queue.get(timeout=30)

                            if event["type"] == "STREAM_END":
                                # Send completion signal
                                completion_chunk = json.dumps(
                                    {"type": "complete"})
                                yield add_chunk_delimiters(completion_chunk).encode('utf-8')
                                break

                            elif event["type"] == "ERROR":
                                # Send error as JSON
                                error_chunk = json.dumps(
                                    {"type": "error", "message": event["message"]})
                                yield add_chunk_delimiters(error_chunk).encode('utf-8')
                                break

                            else:
                                # Handle persistence via service
                                current_agent_message = service.handle_stream_chunk(
                                    thread,
                                    current_agent_message,
                                    event
                                )

                                # Yield the event as JSON (like FastAPI)
                                chunk_str = json.dumps(event)
                                yield add_chunk_delimiters(chunk_str).encode('utf-8')

                        except queue.Empty:
                            yield b" "
                            continue

                except Exception as e:
                    print(f"[ThreadChatView] Error in event_stream: {e}")
                    error_chunk = json.dumps(
                        {"type": "error", "message": str(e)})
                    yield add_chunk_delimiters(error_chunk).encode('utf-8')

                finally:
                    # Save final agent response
                    if current_agent_message:
                        try:
                            service.add_message_to_thread(
                                thread,
                                content=current_agent_message,
                                sender=Message.Sender.AGENT,
                                msg_type=Message.MsgType.TEXT,
                                add_to_last_response=True
                            )
                        except Exception as e:
                            print(
                                f"[ThreadChatView] Error saving message: {e}")

            response = StreamingHttpResponse(
                event_stream(),
                content_type='text/plain; charset=utf-8'
            )
            return response

        except Exception as e:
            print(f"[ThreadChatView] Error in post: {e}")
            # Clean up responses on error
            if thread.responses.exists():
                thread.responses.last().delete()

            return Response(
                {"status": "error", "message": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


logger = logging.getLogger(__name__)


class RealtimeTokenView(APIViewTokenRefresh):
    """
    API endpoint to generate an ephemeral API key for realtime voice sessions.
    This key is short-lived and safe to use on the client side.
    """

    @extend_schema(
        responses={200: RealtimeTokenResponseSerializer},
        description="Generate an ephemeral API key for realtime voice sessions"
    )
    def get(self, request):
        """
        Generate an ephemeral API key for realtime voice sessions.
        """
        user = request.user
        user_profile_prompt = compose_user_profile_prompt(user)
        thread_id = request.query_params.get('thread_id', None)

        # Determine which prompt to use based on thread type
        system_prompt = AZUGH_VOICE_SYSTEM_PROMPT
        if thread_id:
            service = AgentService(user)
            thread = service.get_thread(thread_id)
            if thread and thread.is_onboarding:
                system_prompt = AZUGH_VOICE_ONBOARDING_SYSTEM_PROMPT

        try:
            import httpx as httpx_client

            with httpx_client.Client() as client:
                resp = client.post(
                    "https://api.openai.com/v1/realtime/sessions",
                    headers={
                        "Authorization": f"Bearer {settings.OPENAI_API_KEY}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": "gpt-realtime",
                        "voice": "alloy",
                        "instructions": system_prompt + "\n\n" + user_profile_prompt,
                        "input_audio_transcription": {
                            "model": "whisper-1"
                        },
                        "turn_detection": {
                            "type": "server_vad",
                            "threshold": 0.5,
                            "prefix_padding_ms": 300,
                            "silence_duration_ms": 500
                        }
                    }
                )

                if resp.status_code != 200:
                    logger.error(
                        f"OpenAI realtime session error: {resp.status_code} - {resp.text}")
                    return Response(
                        {"detail": "Failed to create realtime session"},
                        status=status.HTTP_502_BAD_GATEWAY
                    )

                data = resp.json()
                return Response({
                    "clientSecret": data.get("client_secret", {}).get("value"),
                    "expiresAt": data.get("client_secret", {}).get("expires_at"),
                    "sessionId": data.get("id")
                }, status=status.HTTP_200_OK)

        except httpx.RequestError as e:
            logger.error(f"Request error creating realtime session: {e}")
            return Response(
                {"detail": "Failed to connect to OpenAI"},
                status=status.HTTP_502_BAD_GATEWAY
            )
        except Exception as e:
            logger.error(f"Unexpected error creating realtime session: {e}")
            return Response(
                {"detail": "Failed to create realtime session"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class VoiceMessageView(APIViewTokenRefresh):
    """
    API endpoint to save a voice message to a thread.
    Used by the voice agent to persist conversation transcripts.
    """

    @extend_schema(
        request=VoiceMessageRequestSerializer,
        responses={200: VoiceMessageResponseSerializer},
        description="Save a voice message to a thread"
    )
    def post(self, request, thread_id):
        """
        Save a voice message to a thread.
        """
        serializer = VoiceMessageRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        content = serializer.validated_data['content']
        sender = serializer.validated_data['sender']

        service = AgentService(request.user)

        try:
            # Get the thread
            thread = service.get_thread(thread_id)
            if not thread:
                return Response(
                    {"detail": f"Thread {thread_id} not found"},
                    status=status.HTTP_404_NOT_FOUND
                )

            sender_enum = Message.Sender.USER if sender == 'user' else Message.Sender.AGENT
            add_to_last_response = sender == 'agent'

            if sender == 'user':
                # Create a new response for user messages
                service.add_empty_response_to_thread(thread=thread)

            service.add_message_to_thread(
                thread=thread,
                content=content,
                sender=sender_enum,
                msg_type=Message.MsgType.TEXT,
                add_to_last_response=add_to_last_response
            )

            return Response(
                {"success": True, "message": "Voice message saved"},
                status=status.HTTP_200_OK
            )

        except ValueError as e:
            logger.error(
                f"Error saving voice message to thread {thread_id}: {e}")
            return Response(
                {"detail": str(e)},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.error(
                f"Error saving voice message to thread {thread_id}: {e}")
            return Response(
                {"detail": "Failed to save voice message"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
