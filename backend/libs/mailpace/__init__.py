"""
MailPace email service integration.
"""

from .models import (
    InboundEmailPayload,
    InboundEmailAttachment,
    OutboundEmailPayload,
    OutboundEmailAttachment,
)
from .parser import EmailParser
from .send import EmailSender, SendEmailResponse
from .config import settings as mailpace_settings

__all__ = [
    "InboundEmailPayload",
    "InboundEmailAttachment",
    "OutboundEmailPayload",
    "OutboundEmailAttachment",
    "EmailParser",
    "EmailSender",
    "SendEmailResponse",
    "mailpace_settings",
]
