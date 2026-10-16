"""
Factory helpers for GraphAgent instances.
Each call returns a fresh agent configured for the given thread context.
"""
from typing import List, Optional

from django.conf import settings
from libs.agent import GraphAgent
from users.models import User

from .utils import compose_user_profile_prompt


def get_graph_agent(
    system_prompt: Optional[str] = None,
    tool_set: Optional[List] = None,
    user: Optional[User] = None
) -> GraphAgent:
    """Build a GraphAgent tailored to the provided prompt, tools, and user profile."""
    resolved_prompt = system_prompt or getattr(
        settings, 'AGENT_SYSTEM_PROMPT', None)
    resolved_tools = tool_set or []

    if user:
        profile_prompt = compose_user_profile_prompt(user).strip()
        prompt_parts = [segment.strip()
                        for segment in (resolved_prompt, profile_prompt) if segment]
        if prompt_parts:
            resolved_prompt = "\n\n".join(prompt_parts)

    return GraphAgent(
        api_key=getattr(settings, 'OPENAI_API_KEY', None),
        model=getattr(settings, 'AGENT_MODEL', 'gpt-4.1'),
        temperature=getattr(settings, 'AGENT_TEMPERATURE', 0.5),
        max_tokens=getattr(settings, 'AGENT_MAX_TOKENS', 7024),
        streaming=True,
        system_prompt=resolved_prompt,
        tool_set=resolved_tools
    )
