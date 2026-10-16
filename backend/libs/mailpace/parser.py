import re
from typing import Optional
from bs4 import BeautifulSoup

from .models import InboundEmailPayload, InboundEmailAttachment


# Email regex pattern (RFC 5322 simplified)
EMAIL_REGEX = re.compile(
    r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
)

# Pattern to extract email from "Name <email@domain.com>" format
EMAIL_IN_BRACKETS_REGEX = re.compile(r"<([^>]+)>")

# Pattern to extract message ID from angle brackets
MESSAGE_ID_REGEX = re.compile(r"<([^>]+)>")


class EmailParser:
    """
    Parser for extracting key information from MailPace inbound email payloads.

    Provides methods to extract sender email, recipient email, subject,
    provider message ID, and links from the email body.
    """

    def __init__(self, inbound_email: InboundEmailPayload):
        """
        Initialize the EmailParser with an inbound email payload.

        Args:
            inbound_email: The MailPace inbound email payload to parse.
        """
        self.inbound_email = inbound_email

    def _validate_email(self, email: str) -> bool:
        """
        Validate if a string is a valid email address.

        Args:
            email: The string to validate as an email address.

        Returns:
            True if the string is a valid email address, False otherwise.
        """
        return bool(EMAIL_REGEX.fullmatch(email))

    def _extract_email_from_string(self, value: str) -> Optional[str]:
        """
        Extract an email address from a string that may contain a name
        and email in the format "Name <email@domain.com>" or just an email.

        Args:
            value: The string potentially containing an email address.

        Returns:
            The extracted email address if found and valid, None otherwise.
        """
        if not value:
            return None

        # Try to extract email from angle brackets first
        bracket_match = EMAIL_IN_BRACKETS_REGEX.search(value)
        if bracket_match:
            email = bracket_match.group(1).strip()
            if self._validate_email(email):
                return email

        # Try to find any email in the string
        email_match = EMAIL_REGEX.search(value)
        if email_match:
            return email_match.group(0)

        return None

    def sender_email(self) -> Optional[str]:
        """
        Extract the sender's email address from the 'from' field.

        Handles formats like:
        - "user@example.com"
        - "Name <user@example.com>"
        - "Name via Service <proxy@service.com>"

        Returns:
            The sender's email address if found and valid, None otherwise.
        """
        return self._extract_email_from_string(self.inbound_email.from_)

    def recipient_email(self) -> Optional[str]:
        """
        Extract and validate the recipient's email address from the 'to' field.

        Returns:
            The recipient's email address if valid, None otherwise.
        """
        to_value = self.inbound_email.to
        if not to_value:
            return None

        return self._extract_email_from_string(to_value)

    def get_subject(self) -> Optional[str]:
        """
        Get the email subject line.

        Returns:
            The email subject if present, None otherwise.
        """
        subject = self.inbound_email.subject
        if subject:
            # Subject should already be decoded by the email provider
            return subject.strip()
        return None

    def get_provider_message_id(self) -> Optional[str]:
        """
        Extract the message ID without angle brackets.

        Parses the messageId field which typically comes in the format
        "<unique-id@domain.com>" and extracts just "unique-id@domain.com".

        Returns:
            The message ID without angle brackets if found, None otherwise.
        """
        message_id = self.inbound_email.messageId
        if not message_id:
            return None

        # Try to extract from angle brackets
        match = MESSAGE_ID_REGEX.search(message_id)
        if match:
            return match.group(1)

        # Return as-is if no brackets found (already clean)
        return message_id.strip()

    def get_links_from_body(self) -> list[str]:
        """
        Extract all URLs/links from the HTML body of the email.

        Parses the HTML content and extracts all href attributes from
        anchor (<a>) tags. Filters out empty, None, and mailto: links.

        Returns:
            A list of unique URLs found in the email body.
            Returns an empty list if no HTML content is available.
        """
        html_content = self.inbound_email.html
        if not html_content:
            return []

        soup = BeautifulSoup(html_content, "html.parser")
        links: list[str] = []

        for anchor in soup.find_all("a", href=True):
            href = anchor.get("href")
            if href and isinstance(href, str):
                href = href.strip()
                # Skip empty links, anchors, and mailto links
                if href and not href.startswith(("#", "mailto:", "javascript:")):
                    links.append(href)

        # Return unique links while preserving order
        seen: set[str] = set()
        unique_links: list[str] = []
        for link in links:
            if link not in seen:
                seen.add(link)
                unique_links.append(link)

        return unique_links

    def get_emails_from_text(self) -> list[str]:
        """
        Extract all email addresses from the plain text body of the email.

        Scans the text content and extracts all valid email addresses.
        Excludes the sender and recipient emails to find third-party addresses.

        Returns:
            A list of unique email addresses found in the text body.
            Returns an empty list if no text content is available.
        """
        text_content = self.inbound_email.text
        if not text_content:
            return []

        # Find all email matches in text
        matches = EMAIL_REGEX.findall(text_content)

        # Return unique emails while preserving order
        seen: set[str] = set()
        unique_emails: list[str] = []
        for email in matches:
            email_lower = email.lower()
            if email_lower not in seen:
                seen.add(email_lower)
                unique_emails.append(email)

        return unique_emails

    def get_links_from_text(self) -> list[str]:
        """
        Extract all URLs/links from the plain text body of the email.

        Scans the text content and extracts all valid URLs.

        Returns:
            A list of unique URLs found in the text body.
            Returns an empty list if no text content is available.
        """
        text_content = self.inbound_email.text
        if not text_content:
            return []

        # URL regex pattern
        url_pattern = re.compile(
            r'https?://[^\s<>"\')\]]+',
            re.IGNORECASE
        )

        matches = url_pattern.findall(text_content)

        # Return unique links while preserving order
        seen: set[str] = set()
        unique_links: list[str] = []
        for link in matches:
            if link not in seen:
                seen.add(link)
                unique_links.append(link)

        return unique_links
