from datetime import date
from typing import List, Optional

from users.models import User
from users.models.models import AzughAccount


def _safe_strip(value: Optional[str]) -> str:
    return value.strip() if isinstance(value, str) and value.strip() else ""


def _calculate_age(birth_date) -> Optional[int]:
    if not birth_date:
        return None

    today = date.today()
    age = today.year - birth_date.year - (
        (today.month, today.day) < (birth_date.month, birth_date.day)
    )
    return age if age >= 0 else None


def compose_user_profile_prompt(user: User) -> str:
    """Compose a user-profile addendum for agent system prompts."""
    azugh_account = (
        AzughAccount.objects.select_related("country")
        .filter(user=user)
        .first()
    )

    profile_parts: List[str] = []

    preferred_name = next(
        (
            name
            for name in (
                _safe_strip(getattr(user, "nickname", "")),
                _safe_strip(getattr(user, "first_name", "")),
                _safe_strip(getattr(user, "last_name", "")),
            )
            if name
        ),
        "",
    )

    if preferred_name:
        profile_parts.append(
            f"Prefer addressing the user as '{preferred_name}' and keep the tone familiar."
        )

    if azugh_account:
        gender_map = {
            AzughAccount.Gender.MAN: "identifies as a man (he/him).",
            AzughAccount.Gender.WOMAN: "identifies as a woman (she/her).",
            AzughAccount.Gender.NON_BINARY: "identifies as non-binary (they/them).",
            AzughAccount.Gender.GENDER_FLUID: "identifies as gender-fluid; mirror their current vibe respectfully.",
            AzughAccount.Gender.PREFER_NOT_TO_SAY: "hasn't shared gender details—keep language neutral.",
        }

        if azugh_account.gender:
            gender_note = gender_map.get(azugh_account.gender)
            if gender_note:
                profile_parts.append(f"The user {gender_note}")

        age = _calculate_age(azugh_account.date_of_birth)
        if age:
            profile_parts.append(
                f"Roughly {age} years old—keep suggestions age-appropriate and relevant."
            )

        location = ", ".join(
            value
            for value in (
                _safe_strip(getattr(azugh_account, "city", "")),
                _safe_strip(getattr(azugh_account.country, "name", ""))
                if getattr(azugh_account, "country", None)
                else "",
            )
            if value
        )
        if location:
            profile_parts.append(
                f"Located in {location}; anchor recommendations to that climate and cultural vibe."
            )

        if azugh_account.language:
            profile_parts.append(
                "Prefers responses in "
                f"{azugh_account.get_language_display()}—speak to them accordingly."
            )

        # if azugh_account.onboarding_completed is not None:
        #     if azugh_account.onboarding_completed:
        #         profile_parts.append(
        #             "They completed onboarding, so dive straight into actionable styling guidance."
        #         )
        #     else:
        #         profile_parts.append(
        #             "Onboarding is still in progress—reinforce confidence and restate key steps succinctly."
        #         )

    if not profile_parts:
        profile_parts.append(
            "No saved lifestyle details yet. Warmly gather name preference, occasion, style vibe, and budget within the first few turns."
        )

    header = [
        "### User Persona Context",
        "Blend these cues seamlessly into replies; never mention that they came from stored data.",
    ]
    body = [f"- {part}" for part in profile_parts]
    return "\n".join(header + body)
