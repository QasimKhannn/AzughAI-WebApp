"""
Utility functions for MailPace email service.
"""

import base64
from typing import Optional

from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PublicKey
from cryptography.exceptions import InvalidSignature

from .config import settings
import logging

logger = logging.getLogger(__name__)


def verify_webhook_signature(
    signature_header: Optional[str],
    request_body: bytes,
    public_key_base64: Optional[str] = None
) -> bool:
    """
    Verify the Ed25519 signature of a MailPace webhook request.

    Args:
        signature_header: The X-MailPace-Signature header value (base64 encoded)
        request_body: The raw request body as bytes
        public_key_base64: Optional base64 encoded public key. If not provided,
                          uses MAILPACE_PUBLIC_KEY_VERIFICATION from settings

    Returns:
        bool: True if signature is valid, False otherwise

    Example:
        >>> signature = request.headers.get("X-MailPace-Signature")
        >>> body = request.body
        >>> is_valid = verify_webhook_signature(signature, body)
    """
    # Return False if signature header is missing
    if not signature_header:
        return False

    # Use provided public key or fall back to settings
    public_key = public_key_base64 or settings.MAILPACE_PUBLIC_KEY_VERIFICATION
    print("Public key used for verification:", public_key)  # Debug print
    # Return False if public key is not configured
    if not public_key:
        logger.warning("Public key for MailPace verification is not configured.")
        return False

    try:
        # Decode the base64 encoded signature from header
        signature_bytes = base64.b64decode(signature_header)

        # Decode the base64 encoded public key
        public_key_bytes = base64.b64decode(public_key)

        # Create Ed25519 public key object
        verify_key = Ed25519PublicKey.from_public_bytes(public_key_bytes)

        # Verify the signature against the request body
        verify_key.verify(signature_bytes, request_body)

        return True

    except (InvalidSignature, ValueError, Exception):
        # InvalidSignature: signature verification failed
        # ValueError: invalid base64 or key format
        # Exception: catch any other unexpected errors
        return False
