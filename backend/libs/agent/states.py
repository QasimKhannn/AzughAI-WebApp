from typing_extensions import TypedDict, Annotated
from langgraph.graph.message import add_messages


class AgentState(TypedDict):
    """
    State for the agent, including user information and tool call ID.
    """
    messages: Annotated[list, add_messages]
    thread_id: str
    user_id: str
    user_name: str
    current_date: str