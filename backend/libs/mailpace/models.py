"""
Pydantic schemas for inbound email webhook from MailPace.
"""

from typing import Optional
from pydantic import BaseModel, Field, field_validator
import re


class InboundEmailAttachment(BaseModel):
    """Schema for email attachment."""
    content: str = Field(..., description="Base64 encoded content")
    type: str = Field(..., description="Type of attachment")
    contentType: str = Field(..., description="MIME type")
    contentDisposition: str = Field(...,
                                    description="Content disposition type")
    filename: Optional[str] = Field(None, description="File name if provided")
    headers: list[str] = Field(..., description="Attachment headers")
    checksum: str = Field(..., description="MD5 hash of content")
    size: int = Field(..., description="Size in bytes")
    contentId: Optional[str] = Field(
        None, description="Content-ID header value")
    cid: Optional[str] = Field(None, description="contentId without < and >")
    related: Optional[bool] = Field(
        None, description="Not a standard attachment")


class InboundEmailPayload(BaseModel):
    """Schema for MailPace inbound email webhook payload."""
    # Required fields
    from_: str = Field(..., alias="from", description="Sender email")
    headers: list[str] = Field(..., description="Email headers")
    messageId: str = Field(..., description="Unique message ID")
    raw: str = Field(..., description="Full raw email (RFC 822)")

    # Optional fields
    to: Optional[str] = Field(None, description="Recipient email")
    subject: Optional[str] = Field(None, description="Email subject")
    cc: Optional[str] = Field(None, description="CC recipients")
    bcc: Optional[str] = Field(None, description="BCC recipients")
    inReplyTo: Optional[str] = Field(None, description="In-Reply-To header")
    replyTo: Optional[str] = Field(None, description="Reply-To address")
    html: Optional[str] = Field(None, description="HTML content")
    text: Optional[str] = Field(None, description="Plain text content")
    attachments: Optional[list[InboundEmailAttachment]] = Field(
        None, description="Email attachments"
    )

    class Config:
        populate_by_name = True


class OutboundEmailAttachment(BaseModel):
    """Schema for outbound email attachment."""
    name: str = Field(..., description="Filename displayed to the end user")
    content: str = Field(..., description="Base64 encoded content")
    content_type: str = Field(..., description="MIME type (e.g., image/jpeg)")
    cid: Optional[str] = Field(
        None,
        description="Content-ID for inline images (e.g., '<myimage.cid>')"
    )


class OutboundEmailPayload(BaseModel):
    """
    Schema for MailPace send email API payload.

    Reference: https://docs.mailpace.com/reference/send
    """
    # Required fields
    from_: str = Field(
        ...,
        alias="from",
        description="Sender email (must match domain associated with API token)"
    )
    to: str = Field(
        ...,
        description="Recipient email(s), comma-separated for multiple"
    )

    # Conditionally required - at least one of htmlbody or textbody
    htmlbody: Optional[str] = Field(None, description="HTML email content")
    textbody: Optional[str] = Field(
        None, description="Plain text email content")

    # Optional fields
    subject: Optional[str] = Field(None, description="Email subject line")
    cc: Optional[str] = Field(
        None, description="CC recipients, comma-separated")
    bcc: Optional[str] = Field(
        None, description="BCC recipients, comma-separated")
    replyto: Optional[str] = Field(None, description="Reply-To email address")
    inreplyto: Optional[str] = Field(
        None,
        description="In-Reply-To header for threading"
    )
    references: Optional[str] = Field(
        None,
        description="References header for threading"
    )
    list_unsubscribe: Optional[str] = Field(
        None,
        description="List-Unsubscribe header value"
    )
    attachments: Optional[list[OutboundEmailAttachment]] = Field(
        None,
        description="Email attachments"
    )
    tags: Optional[list[str] | str] = Field(
        None,
        description="Tags for categorization"
    )

    @field_validator("to", "cc", "bcc", mode="before")
    @classmethod
    def validate_email_list(cls, v: Optional[str]) -> Optional[str]:
        """Validate email addresses in comma-separated list."""
        if v is None:
            return None
        # Basic validation - MailPace will do full validation
        emails = [e.strip() for e in v.split(",")]
        if len(emails) > 50:
            raise ValueError("Maximum 50 recipients allowed")
        return v

    @field_validator("htmlbody", "textbody", mode="after")
    @classmethod
    def validate_body_present(cls, v, info):
        """Ensure at least one body type is provided."""
        # This runs after field assignment, full validation in model_validator
        return v

    def model_post_init(self, __context) -> None:
        """Validate that at least htmlbody or textbody is provided."""
        if not self.htmlbody and not self.textbody:
            raise ValueError("Either htmlbody or textbody must be provided")

    class Config:
        populate_by_name = True

    def to_api_payload(self) -> dict:
        """Convert to API payload format."""
        payload = {
            "from": self.from_,
            "to": self.to,
        }

        if self.htmlbody:
            payload["htmlbody"] = self.htmlbody
        if self.textbody:
            payload["textbody"] = self.textbody
        if self.subject:
            payload["subject"] = self.subject
        if self.cc:
            payload["cc"] = self.cc
        if self.bcc:
            payload["bcc"] = self.bcc
        if self.replyto:
            payload["replyto"] = self.replyto
        if self.inreplyto:
            payload["inreplyto"] = self.inreplyto
        if self.references:
            payload["references"] = self.references
        if self.list_unsubscribe:
            payload["list_unsubscribe"] = self.list_unsubscribe
        if self.attachments:
            payload["attachments"] = [
                {
                    "name": att.name,
                    "content": att.content,
                    "content_type": att.content_type,
                    **({"cid": att.cid} if att.cid else {})
                }
                for att in self.attachments
            ]
        if self.tags:
            payload["tags"] = self.tags

        return payload
