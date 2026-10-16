import re
from typing import List

from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage

from .prompts import GENERATE_MAIN_AGENT_PLAN_PROMPT
from .tools.widgets import _get_user_reference

# Global maximum steps for generated plans
MAX_PLAN_STEPS = 10


class Plan:
    """Generate concise developer-oriented checklist plans from a plain text request.

    The generator first attempts to use the configured LLM to produce a
    developer-facing checklist. If the LLM call fails, it falls back to a
    deterministic rule-based generator.
    """

    def __init__(self, max_steps: int = MAX_PLAN_STEPS, model: str = "gpt-4.1"):
        self.max_steps = max_steps
        self.model = model

    def _fallback_plan(self, input_prompt: str, max_steps: int) -> str:
        """Previous deterministic fallback used when LLM is unavailable."""
        # Very small deterministic plan to ensure availability
        items = [
            ("Analyze the request and constraints",
             "Validation: key constraints documented.", "[low]"),
            ("Define acceptance criteria",
             "Validation: acceptance tests listed.", "[low]"),
            ("Break into subtasks",
             "Validation: subtasks have owners.", "[medium]"),
            ("Implement core functionality",
             "Validation: end-to-end dev test passes.", "[high]"),
            ("Write tests and smoke test",
             "Validation: tests pass locally.", "[medium]"),
        ][0:max_steps]

        lines = [f"Plan for: {input_prompt[:80]}" if input_prompt else "Plan"]
        for i, (a, v, t) in enumerate(items, 1):
            lines.append(f"{i}. {a} — {v} {t}")
        return "\n".join(lines)

    def generate_plan(self, input_prompt: str, state: dict | None = None, max_steps: int | None = None) -> str:
        """Generate a plan using the LLM; fallback to deterministic generator on error.

        Args:
            input_prompt: plain text description of the user's request
            state: optional agent state (used to extract user reference)
            max_steps: maximum checklist items (defaults to instance max_steps)
        """
        if max_steps is None:
            max_steps = self.max_steps

        user_ref = _get_user_reference(
            state) if state is not None else "the user"

        system_prompt = GENERATE_MAIN_AGENT_PLAN_PROMPT
        human_prompt = (
            f"User reference: {user_ref}\n"
            f"Max steps: {max_steps}\n"
            f"Request: {input_prompt}\n"
            "Generate the developer checklist now."
        )

        try:
            llm = ChatOpenAI(model=self.model, temperature=0.2, max_tokens=800)
            messages = [
                SystemMessage(content=system_prompt),
                HumanMessage(content=human_prompt),
            ]
            response = llm.invoke(messages)
            content = (response.content or "").strip()
            if content:
                return content
            # If LLM returned empty, fall back
            return self._fallback_plan(input_prompt, max_steps)

        except Exception:
            return self._fallback_plan(input_prompt, max_steps)
