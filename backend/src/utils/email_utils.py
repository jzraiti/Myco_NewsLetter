import os
import logging
from jinja2 import Environment, FileSystemLoader

from utils.supabase_utils import supabase_recipients_GET
from utils.workflow_results import DeliveryRecipientResult, DeliveryResult


def render_template(articles: list[dict]) -> str:
    env = Environment(loader=FileSystemLoader(os.path.join(os.path.dirname(__file__), "..", "templates")))
    template = env.get_template("email.html")
    return template.render(articles=articles)


def send_newsletter_email(
    html_content: str,
    recipients: list[str] | None = None,
    recipient_loader=supabase_recipients_GET,
    resend_client=None,
    now=None,
) -> DeliveryResult:
    import resend
    from datetime import datetime

    current_time = now or datetime.now()
    active_resend = resend_client or resend
    if resend_client is None:
        resend.api_key = os.getenv("RESEND_API_KEY")

    receiver_email_list = recipients
    if receiver_email_list is None:
        loaded = recipient_loader()
        receiver_email_list = [
            receiver["email"] for receiver in loaded.data if receiver["is_subscribed"]
        ]

    sent: list[DeliveryRecipientResult] = []
    failed: list[DeliveryRecipientResult] = []

    for receiver in receiver_email_list:
        try:
            response = active_resend.Emails.send(
                {
                    "from": "MycoWeekly Newsletter <myconewsletter@mycoweekly.org>",
                    "to": receiver,
                    "subject": f"Weekly Digest {current_time.strftime('%m/%d')}",
                    "html": html_content,
                }
            )
            provider_id = response.get("id") if isinstance(response, dict) else None
            sent.append(DeliveryRecipientResult(email=receiver, status="sent", provider_id=provider_id))
            logging.info(f"Email sent successfully to {receiver}")
        except Exception as e:
            failed.append(DeliveryRecipientResult(email=receiver, status="failed", error=str(e)))
            logging.error(f"Failed to send email to {receiver}: {e}")

    status = "failed"
    if sent and failed:
        status = "partial"
    elif sent:
        status = "success"

    return DeliveryResult(status=status, sent=sent, failed=failed)


def resend_send_email(html_content: str):
    return send_newsletter_email(html_content)
