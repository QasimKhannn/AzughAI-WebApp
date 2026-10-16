
import json
from typing import Any

from langchain.tools import tool
from pydantic import BaseModel, Field
from langchain_core.tools import InjectedToolCallId
from langgraph.prebuilt import InjectedState
from langchain_core.messages import ToolMessage
from langgraph.types import Command
from typing_extensions import Annotated

from ..states import AgentState
from ..plan import Plan
from .widgets import _build_widget_message, _get_user_reference


class CreatePlanInput(BaseModel):
    """Create a developer checklist plan from a plain text prompt."""

    input_prompt: str = Field(
        description="User's request as a plain text string")
    state: Annotated[AgentState, InjectedState] | None = None
    tool_call_id: Annotated[str, InjectedToolCallId] | None = None


@tool(args_schema=CreatePlanInput)
def create_plan(
        input_prompt: str,
        state: Annotated[AgentState, InjectedState] = None,
        tool_call_id: Annotated[str, InjectedToolCallId] = None,
) -> Command:
    """Generate a concise developer plan (checklist) for the given prompt.

    Returns a `Command` containing a ToolMessage with a JSON payload:
      {"widget": "create_plan", "plan_text": <string>, "summary": <string>}
    """
    plan = Plan()
    plan_text = plan.generate_plan(input_prompt, state=state)

    user_ref = _get_user_reference(state)

    payload = {
        "widget": "create_plan",
        "plan_text": plan_text,
        "summary": f"Generated plan for: {user_ref} - {input_prompt[:200]}",
    }

    tool_message = _build_widget_message("create_plan", payload, tool_call_id)
    return Command(update={"messages": [tool_message]})
