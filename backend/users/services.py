from django.template.loader import render_to_string
from django.utils.timezone import now
from libs.mailpace.send import EmailSender
from .models import User
from .token_utils import compose_verification_url, compose_reset_url


class EmailService:
    def __init__(self):
        self.email_sender = EmailSender()

    def render_email(self, template_name: str, context: dict) -> str:
        """
        Render an email template (HTML or text)
        """
        base_context = {
            "year": now().year,
            **context,
        }
        return render_to_string(template_name, base_context)

    def send_verify_email(self, user: User) -> None:
        """
        Send a verification email to the user.
        """
        verification_link = compose_verification_url(user)
        subject = "Verify your email address - Azugh AI"

        html_content = self.render_email(
            "verify_email.html",
            {"user": user, "verification_link": verification_link},
        )
        text_content = self.render_email(
            "verify_email.txt",
            {"user": user, "verification_link": verification_link},
        )

        response = self.email_sender.send_sync(
            to=user.email,
            subject=subject,
            htmlbody=html_content,
            textbody=text_content,
        )

        if not response.success:
            raise Exception(
                f"Failed to send verification email: {response.error}")

    def send_password_reset_email(self, user: User) -> None:
        """
        Send a password reset email to the user.
        """
        reset_link = compose_reset_url(user)
        subject = "Reset your password - Azugh AI"

        html_content = self.render_email(
            "reset_password.html",
            {"user": user, "reset_link": reset_link},
        )
        text_content = self.render_email(
            "reset_password.txt",
            {"user": user, "reset_link": reset_link},
        )

        response = self.email_sender.send_sync(
            to=user.email,
            subject=subject,
            htmlbody=html_content,
            textbody=text_content,
        )

        if not response.success:
            raise Exception(
                f"Failed to send password reset email: {response.error}")
