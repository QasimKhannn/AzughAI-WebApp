"""
Configuration module for MailPace email service.
"""

from pydantic_settings import BaseSettings, SettingsConfigDict


class MailPaceSettings(BaseSettings):
    """
    MailPace settings loaded from environment variables.

    Environment variables:
        MAILPACE_SERVER_TOKEN: API token from MailPace dashboard
        MAILPACE_SENDER_EMAIL: Default sender email address
    """

    model_config = SettingsConfigDict(
        case_sensitive=True,
        env_file=".env",
        extra="ignore",
    )

    # MailPace API configuration
    MAILPACE_SERVER_TOKEN: str = ""
    MAILPACE_SENDER_EMAIL: str = ""
    MAILPACE_PUBLIC_KEY_VERIFICATION: str = ""

    # API endpoint
    MAILPACE_API_URL: str = "https://app.mailpace.com/api/v1/send"

    # Request configuration
    MAILPACE_TIMEOUT: int = 30


settings = MailPaceSettings()
