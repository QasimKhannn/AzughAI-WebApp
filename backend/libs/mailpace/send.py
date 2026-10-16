"""
MailPace email sending module.
"""

import httpx
from typing import Optional
from dataclasses import dataclass

from .config import settings
from .models import OutboundEmailPayload, OutboundEmailAttachment


@dataclass
class SendEmailResponse:
    """Response from sending an email."""
    success: bool
    message_id: Optional[str] = None
    error: Optional[str] = None
    status_code: Optional[int] = None


class EmailSender:
    """
    Client for sending emails via MailPace API.

    Usage:
        # Using default settings from environment
        sender = EmailSender()

        # Or with custom credentials
        sender = EmailSender(
            sender_email="custom@domain.com",
            mailpace_server_token="your-token"
        )

        # Send an email
        response = await sender.send(
            to="recipient@example.com",
            subject="Hello",
            htmlbody="<p>Hello World</p>"
        )
    """

    def __init__(
        self,
        sender_email: Optional[str] = None,
        mailpace_server_token: Optional[str] = None,
    ):
        """
        Initialize the EmailSender.

        Args:
            sender_email: Sender email address. Uses MAILPACE_SENDER_EMAIL 
                         from settings if not provided.
            mailpace_server_token: MailPace API token. Uses MAILPACE_SERVER_TOKEN 
                                  from settings if not provided.
        """
        self.sender_email = sender_email or settings.MAILPACE_SENDER_EMAIL
        self.server_token = mailpace_server_token or settings.MAILPACE_SERVER_TOKEN
        self.api_url = settings.MAILPACE_API_URL
        self.timeout = settings.MAILPACE_TIMEOUT

        if not self.sender_email:
            raise ValueError(
                "sender_email must be provided or set MAILPACE_SENDER_EMAIL"
            )
        if not self.server_token:
            raise ValueError(
                "mailpace_server_token must be provided or set MAILPACE_SERVER_TOKEN"
            )

    def _get_headers(self) -> dict[str, str]:
        """Get HTTP headers for MailPace API requests."""
        return {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "MailPace-Server-Token": self.server_token,
        }

    async def send(
        self,
        to: str,
        subject: Optional[str] = None,
        htmlbody: Optional[str] = None,
        textbody: Optional[str] = None,
        cc: Optional[str] = None,
        bcc: Optional[str] = None,
        replyto: Optional[str] = None,
        inreplyto: Optional[str] = None,
        references: Optional[str] = None,
        attachments: Optional[list[OutboundEmailAttachment]] = None,
        tags: Optional[list[str] | str] = None,
    ) -> SendEmailResponse:
        """
        Send an email via MailPace.

        Args:
            to: Recipient email(s), comma-separated for multiple.
            subject: Email subject line.
            htmlbody: HTML email content.
            textbody: Plain text email content.
            cc: CC recipients, comma-separated.
            bcc: BCC recipients, comma-separated.
            replyto: Reply-To email address.
            inreplyto: In-Reply-To header for email threading.
            references: References header for email threading.
            attachments: List of attachments.
            tags: Tags for categorization.

        Returns:
            SendEmailResponse with success status and message ID or error.
        """
        # Build the payload
        payload = OutboundEmailPayload(
            **{"from": self.sender_email},
            to=to,
            subject=subject,
            htmlbody=htmlbody,
            textbody=textbody,
            cc=cc,
            bcc=bcc,
            replyto=replyto,
            inreplyto=inreplyto,
            references=references,
            attachments=attachments,
            tags=tags,
        )

        return await self._send_request(payload)

    async def send_payload(
        self,
        payload: OutboundEmailPayload
    ) -> SendEmailResponse:
        """
        Send an email using a pre-built payload.

        Args:
            payload: OutboundEmailPayload instance.

        Returns:
            SendEmailResponse with success status and message ID or error.
        """
        return await self._send_request(payload)

    async def _send_request(
        self,
        payload: OutboundEmailPayload
    ) -> SendEmailResponse:
        """
        Execute the API request to send an email.

        Args:
            payload: The email payload to send.

        Returns:
            SendEmailResponse with the result.
        """
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(
                    self.api_url,
                    headers=self._get_headers(),
                    json=payload.to_api_payload(),
                )

                if response.status_code == 200:
                    data = response.json()
                    return SendEmailResponse(
                        success=True,
                        message_id=str(data.get("id")),
                        status_code=response.status_code,
                    )
                else:
                    # Handle error response
                    error_message = response.text
                    try:
                        error_data = response.json()
                        error_message = error_data.get("error", response.text)
                    except Exception:
                        pass

                    return SendEmailResponse(
                        success=False,
                        error=error_message,
                        status_code=response.status_code,
                    )

        except httpx.TimeoutException:
            return SendEmailResponse(
                success=False,
                error="Request timed out",
            )
        except httpx.RequestError as e:
            return SendEmailResponse(
                success=False,
                error=f"Request failed: {str(e)}",
            )

    def send_sync(
        self,
        to: str,
        subject: Optional[str] = None,
        htmlbody: Optional[str] = None,
        textbody: Optional[str] = None,
        cc: Optional[str] = None,
        bcc: Optional[str] = None,
        replyto: Optional[str] = None,
        attachments: Optional[list[OutboundEmailAttachment]] = None,
        tags: Optional[list[str] | str] = None,
    ) -> SendEmailResponse:
        """
        Synchronous version of send() for non-async contexts.

        Args:
            Same as send().

        Returns:
            SendEmailResponse with success status and message ID or error.
        """
        payload = OutboundEmailPayload(
            **{"from": self.sender_email},
            to=to,
            subject=subject,
            htmlbody=htmlbody,
            textbody=textbody,
            cc=cc,
            bcc=bcc,
            replyto=replyto,
            attachments=attachments,
            tags=tags,
        )

        try:
            with httpx.Client(timeout=self.timeout) as client:
                response = client.post(
                    self.api_url,
                    headers=self._get_headers(),
                    json=payload.to_api_payload(),
                )

                if response.status_code == 200:
                    data = response.json()
                    return SendEmailResponse(
                        success=True,
                        message_id=data.get("id"),
                        status_code=response.status_code,
                    )
                else:
                    error_message = response.text
                    try:
                        error_data = response.json()
                        error_message = error_data.get("error", response.text)
                    except Exception:
                        pass

                    return SendEmailResponse(
                        success=False,
                        error=error_message,
                        status_code=response.status_code,
                    )

        except httpx.TimeoutException:
            return SendEmailResponse(
                success=False,
                error="Request timed out",
            )
        except httpx.RequestError as e:
            return SendEmailResponse(
                success=False,
                error=f"Request failed: {str(e)}",
            )
