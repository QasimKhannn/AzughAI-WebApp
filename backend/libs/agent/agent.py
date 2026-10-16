from typing import Optional
from typing_extensions import List

from langgraph.prebuilt import ToolNode
from langchain_core.messages import HumanMessage, ToolMessage, SystemMessage, AIMessage
from langchain_openai import ChatOpenAI
from langgraph.graph import StateGraph, END
from .states import AgentState
from .tools import *
from .prompts import (
    AGENT_SYSTEM_PROMPT,
    GENERATE_SUMMARY_PROMPT,
    GENERATE_TITLE_PROMPT,
    GENERATE_ONBOARDING_SUMMARY_PROMPT,
    GENERATE_ONBOARDING_SUMMARY_USER_PROMPT
)

TOOL_SET_OBJECT = {
    "draw_setup": draw_setup,
    "lookup_items": lookup_items,
    "open_aesthetics": open_aesthetics,
    "upload_images": upload_images,
    "upload_closet_items": upload_closet_items,
    "finish_onboarding": finish_onboarding,
    "create_plan": create_plan,
}


class GraphAgent:

    def __init__(self,
                 api_key: Optional[str] = None,
                 model: str = "gpt-4.1",
                 temperature: float = 0.5,
                 max_tokens: int = 7024,
                 streaming: bool = True,
                 system_prompt: str = None,
                 tool_set: List[str] = [
                     "draw_setup",
                     "lookup_items",
                     "open_aesthetics",
                     "upload_images",
                     "upload_closet_items",
                     "finish_onboarding",
                     "create_plan"
                 ]):
        self.api_key = api_key
        self.model = model
        self.temperature = temperature
        self.max_tokens = max_tokens
        self.streaming = streaming
        if not system_prompt:
            self.system_prompt = AGENT_SYSTEM_PROMPT
        else:
            self.system_prompt = system_prompt
        self.tool_set = tool_set
        self.THREADS = {}
        self.llm = ChatOpenAI(
            model=self.model,
            temperature=self.temperature,
            max_tokens=self.max_tokens,
            streaming=self.streaming,
            store=True,
            model_kwargs={
                "user": "default_user"  # Will be overridden per request
            },
            extra_body={
                "metadata": {"thread_id": "default_thread_id"}
            }
        )
        self.app = self.setup_graph()

    def setup_graph(self):

        # Define the agents of the graph
        # main agent
        main_agent = self.llm.bind_tools(
            [TOOL_SET_OBJECT[tool] for tool in self.tool_set])
        # Define the graph nodes
        tools_node = ToolNode([TOOL_SET_OBJECT[tool]
                              for tool in self.tool_set])

        def main_agent_node(state: AgentState) -> AgentState:
            """
            Main agent node that handles the conversation flow.
            """
            messages = state["messages"]
            response = main_agent.invoke(messages)
            return state | {"messages": [response]}

        # Define the edges of the graph
        def edge_router(state: AgentState) -> str:
            last_message = state["messages"][-1]
            # If LLM decided to call a tool, go to the tool node
            if "tool_calls" in last_message.additional_kwargs:
                return "agent_tools"
            # Else, continue the conversation with the agent
            return "end"

        # Define the graph
        graph = StateGraph(AgentState)
        graph.add_node("main_agent", main_agent_node)
        graph.add_node("agent_tools", tools_node)

        graph.set_entry_point("main_agent")
        graph.add_conditional_edges("main_agent", edge_router, {
            "agent_tools": "agent_tools",
            "end": END
        })
        graph.add_edge("agent_tools", "main_agent")

        app = graph.compile()
        return app

    def _get_thread(self, thread_id: str, force_create: bool = False):
        if thread_id not in self.THREADS or force_create:
            self.THREADS[thread_id] = [
                SystemMessage(content=self.system_prompt)]
        return self.THREADS[thread_id]

    def upload_thread(self, thread_id: str, messages: List) -> None:
        """
        Uploads a thread with the given messages.

        :param thread_id: The ID of the thread to upload.
        :param messages: A list of messages to upload in the thread.
        """
        thread = self._get_thread(thread_id, force_create=True)
        for message in messages:
            thread.append(message)
        # print(f"Thread {thread_id} uploaded with {len(messages)} messages.")
        # print(f"Current thread state: {len(self.THREADS[thread_id])}")

    async def ask_stream(self, thread_id: str,
                         user_id: str,
                         user_name: str,
                         user_prompt: str,):
        """
        Asks a question in the given thread and returns a generator that yields responses.
        """
        thread_past_messages = self._get_thread(thread_id)
        # print(f"Thread {thread_id} has {len(thread_past_messages)} messages before asking the question.")
        # print(f"Current thread state: {len(self.THREADS[thread_id])}")
        user_message = HumanMessage(
            content=user_prompt
        )
        thread_messages = thread_past_messages + [user_message]
        init_state = {
            "messages": thread_messages,
            "thread_id": thread_id,
            "user_id": user_id,
            "user_name": user_name,
            "current_date": "2025-10-01"  # Placeholder for current date
        }

        for stream_mode, chunk in self.app.stream(init_state,
                                                  config={"configurable": {
                                                      "thread_id": thread_id, "user_id": user_id}},
                                                  stream_mode=["messages", "updates"]):
            if stream_mode == "messages":
                # Token-by-token streaming for agent responses
                message_chunk, metadata = chunk

                # Only stream tokens from the main agent, not from tool calls
                if (metadata.get('langgraph_node') == 'main_agent' and
                    message_chunk.content and
                        not message_chunk.tool_calls):  # Ensure it's not a tool call message
                    content = message_chunk.content
                    yield {
                        "type": "token",
                        "content": content,
                    }
                    # print(message_chunk.content, end="", flush=True)

            elif stream_mode == "updates":
                # print(f"\n--- State Update Chunk: {chunk} ---\n")
                # Complete node updates
                for node_name, node_output in chunk.items():
                    # print(f"\n--- Node Update: {node_name} ---\n")
                    if node_name == "agent_tools":  # completed tool execution
                        # loop around the tool messages
                        print(f"\n🔧 Tool execution started: {node_output}")
                        messages = node_output[0]["messages"] if isinstance(
                            node_output, list) else node_output["messages"]
                        for tool_message in messages:
                            if isinstance(tool_message, ToolMessage):
                                yield {
                                    "type": "tool_end",
                                    "tool": tool_message.name,
                                    "output": tool_message.content,
                                    "tool_type": "widget" if tool_message.name in WIDGET_TOOLS else "function"
                                }
                        # Tool execution finished - you get the complete tool result
                        print(f"\n🔧 Tool execution completed: {node_output}")
                    elif node_name == "main_agent":
                        # Check if this message has tool call
                        agent_messages = node_output.get('messages', [])
                        for msg in agent_messages:
                            if hasattr(msg, 'tool_calls') and msg.tool_calls:
                                tool_calls = msg.tool_calls
                                for tool_call in tool_calls:
                                    yield {
                                        "type": "tool_start",
                                        "tool": tool_call.get('name'),
                                        "input": tool_call.get('args'),
                                        "tool_type": "widget" if tool_call.get('name') in WIDGET_TOOLS else "function"
                                    }

            elif stream_mode == "values":
                # Full state after each step (optional - for debugging)
                # This shows the complete state including case_in_creation updates
                pass

    def generate_thread_title(self, thread_id: str,
                              user_id: str,
                              user_name: str,
                              system_prompt: str = None,) -> str:
        """
        Generates a title for the given thread based on its messages.
        """
        thread_messages = self._get_thread(thread_id)

        # Create a dedicated LLM instance for title generation
        title_llm = ChatOpenAI(
            model=self.model,
            temperature=0.1,  # Lower temperature for more consistent titles
            max_tokens=20,    # Limit tokens to ensure concise titles
        )

        # Create system prompt specifically for title generation
        title_system_prompt = SystemMessage(
            content=system_prompt if system_prompt else GENERATE_TITLE_PROMPT
        )

        # Get the conversation history (exclude system message)
        conversation_messages = [
            msg for msg in thread_messages if not isinstance(msg, SystemMessage)]

        # If no conversation yet, return default
        if not conversation_messages:
            return "New Conversation"

        # Take first few messages to understand the context
        # First 2 exchanges usually capture the main topic
        context_messages = conversation_messages[:4]

        # Create messages for title generation
        title_messages = [title_system_prompt]
        title_messages.append(HumanMessage(
            content=f"Generate a title for this conversation:\n\n" +
            "\n".join([f"{type(msg).__name__}: {msg.content[:200]}..."
                       if len(msg.content) > 200 else f"{type(msg).__name__}: {msg.content}"
                       for msg in context_messages])
        ))

        try:
            response = title_llm.invoke(title_messages)
            title = response.content.strip()

            # Ensure title is within word limit
            words = title.split()
            if len(words) > 8:
                title = " ".join(words[:8])

            return title if title else "Untitled Thread"

        except Exception as e:
            print(f"Error generating title: {e}")
            return "Untitled Thread"

    def generate_thread_summary(self, thread_id: str,
                                user_id: str,
                                user_name: str,
                                system_prompt: str = None,
                                max_tokens: int = 300,
                                temperature: float = 0.3) -> str:
        """
        Generates a summary for the given thread based on its messages.
        """
        thread_messages = self._get_thread(thread_id)

        # Create a dedicated LLM instance for summary generation
        summary_llm = ChatOpenAI(
            model=self.model,
            temperature=temperature,  # Moderate temperature for balanced summaries
            max_tokens=max_tokens,    # Limit tokens to ensure concise summaries
        )

        # Create system prompt specifically for summary generation
        summary_system_prompt = SystemMessage(
            content=system_prompt if system_prompt else GENERATE_SUMMARY_PROMPT
        )

        # Get the conversation history (exclude system message)
        conversation_messages = [
            msg for msg in thread_messages if not isinstance(msg, SystemMessage)]

        # If no conversation yet, return default
        if not conversation_messages:
            return "No conversation to summarize."

        # Create messages for summary generation
        summary_messages = [summary_system_prompt]
        summary_messages.append(HumanMessage(
            content=f"Generate a summary for this conversation:\n\n" +
            "\n".join([f"{type(msg).__name__}: {msg.content[:500]}..."
                       if len(msg.content) > 500 else f"{type(msg).__name__}: {msg.content}"
                       for msg in conversation_messages])
        ))

        print(summary_messages[-1].content)  # Debug: Print the summary prompt

        try:
            response = summary_llm.invoke(summary_messages)
            summary = response.content.strip()

            return summary if summary else "No summary available."

        except Exception as e:
            print(f"Error generating summary: {e}")
            return "No summary available."

    def generate_onboarding_summary(self, thread_id: str,
                                    user_id: str,
                                    user_name: str,
                                    max_tokens: int = 700,
                                    temperature: float = 0.7) -> str:
        """
        Generates an engaging, personalized style profile summary for onboarding.
        This creates a warm, exciting narrative that celebrates the user's style journey.

        Args:
            thread_id: The ID of the thread to summarize
            user_id: The user's ID
            user_name: The user's display name
            max_tokens: Maximum tokens for the summary (default 700 for richer content)
            temperature: Temperature for generation (default 0.7 for creativity)

        Returns:
            A personalized 3-paragraph style narrative
        """
        thread_messages = self._get_thread(thread_id)

        # Create a dedicated LLM instance for onboarding summary generation
        summary_llm = ChatOpenAI(
            model=self.model,
            temperature=temperature,
            max_tokens=max_tokens,
        )

        # Create system prompt for onboarding summary generation
        summary_system_prompt = SystemMessage(
            content=GENERATE_ONBOARDING_SUMMARY_PROMPT
        )

        # Get the conversation history (exclude system message)
        conversation_messages = [
            msg for msg in thread_messages if not isinstance(msg, SystemMessage)]

        # If no conversation yet, return default
        if not conversation_messages:
            return "Your style journey is just beginning. We're excited to help you discover your unique fashion identity."

        # Format conversation for the prompt
        formatted_conversation = "\n".join([
            f"{type(msg).__name__}: {msg.content[:800]}..."
            if len(msg.content) > 800 else f"{type(msg).__name__}: {msg.content}"
            for msg in conversation_messages
        ])

        # Create the user prompt with conversation context
        user_prompt = GENERATE_ONBOARDING_SUMMARY_USER_PROMPT.format(
            conversation=formatted_conversation
        )

        summary_messages = [
            summary_system_prompt,
            HumanMessage(content=user_prompt)
        ]

        try:
            response = summary_llm.invoke(summary_messages)
            summary = response.content.strip()
            return summary if summary else "Your style journey awaits. Let's explore your unique fashion identity together."

        except Exception as e:
            print(f"Error generating onboarding summary: {e}")
            return "Your style journey awaits. Let's explore your unique fashion identity together."
